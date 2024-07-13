"use client"
import ChessBoard from '@/components/ChessBoard';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/hooks/useSocket';
import React, { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { CANCEL_GAME, GAME_OVER, INIT_GAME, MOVE, RESIGN } from '@/constants/messages';

const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [color, setColor] = useState('w');
    const [gameStarted, setGameStarted] = useState(0);
    const [buttonText, setButtonText] = useState('Start Game');

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            switch (data.type) {
                case INIT_GAME:
                    chess.reset();
                    setBoard(chess.board());
                    const receivedColor = data.payload.color;
                    setColor(receivedColor === 'black' ? 'b' : 'w');
                    setGameStarted(2);
                    setButtonText('Resign');
                    break;
                case MOVE:
                    const move = data.payload;
                    const audio = new Audio('/move.mp3');
                    audio.play();
                    chess.move(move);
                    setBoard(chess.board());
                    break;
                case GAME_OVER:
                    alert(`Game Over! ${data.payload.winner} wins!`);
                    chess.reset();
                    setBoard(chess.board());
                    setGameStarted(0);
                    setButtonText('Start Game');
                    break;
                default:
                    break;
            }
        };
    }, [socket]);

    if (!socket) return <Loader />;
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 justify-center items-center w-full h-screen bg-[#161513]">
            <div className="col-span-1 lg:col-span-3 flex justify-center items-center">
                <ChessBoard chess={chess} board={board} socket={socket} setBoard={setBoard} color={color} />
            </div>
            <div className="col-span-1 flex flex-col items-center space-y-4">
                {gameStarted == 1 && (
                    <h1 className="text-white text-lg">Waiting for your opponent...</h1>
                )}
                <Button
                    className="px-8 py-8 text-[30px] bg-slate-500 hover:bg-slate-400"
                    onClick={() => {
                        if (gameStarted == 0) {
                            socket.send(JSON.stringify({ type: INIT_GAME }));
                            setGameStarted(1);
                            setButtonText('Cancel');
                        } else if (gameStarted == 1) {
                            socket.send(JSON.stringify({ type: CANCEL_GAME }));
                            setGameStarted(0);
                            setButtonText('Start Game');
                        } else if (gameStarted == 2) {
                            socket.send(JSON.stringify({ type: RESIGN }));
                            setGameStarted(0);
                            setButtonText('Start Game');
                        }
                    }}
                >
                    {buttonText}
                </Button>
            </div>
        </div>
    );
};

export default Game;

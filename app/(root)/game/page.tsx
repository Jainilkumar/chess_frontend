"use client"
import ChessBoard from '@/components/ChessBoard';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/hooks/useSocket';
import React, {useEffect, useState } from 'react';
import {Chess} from 'chess.js';
export const INIT_GAME = 'init_game';
export const MOVE = 'move';
export const GAME_OVER = 'game_over';
const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [color, setColor] = useState('w');
    useEffect(() => {
        if(!socket) return;
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            switch(data.type) {
                case INIT_GAME:
                    chess.reset();
                    setBoard(chess.board());
                    const color = data.payload.color;
                    if(color === 'black') {
                        setColor('b');
                    }
                    else{
                        setColor('w');
                    }
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
                    break;
            }
        }
    }, [socket]);   
    if(!socket) return <Loader />;
  return (
    <div className="flex flex-col lg:flex-row justify-center items-center w-full h-screen space-y-4 lg:space-y-0 lg:space-x-4 bg-[#161513]">
    <ChessBoard chess = {chess} board={board} socket={socket} setBoard={setBoard} color={color}/>
    <div className="flex items-center">
        <Button
            onClick={() => {
                socket.send(JSON.stringify({type: INIT_GAME}));
            }}
        >
            Start Game
        </Button>
    </div>
</div>
  )
}

export default Game
import React, { useState } from 'react';
import { Color, PieceSymbol, Square } from 'chess.js';
import { MOVE } from '@/app/(root)/game/page';

const ChessBoard = ({chess, board, socket, setBoard, color}: {color: string;chess: any;setBoard: any;  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];socket: WebSocket }) => {
  const [from, setFrom] =  useState<Square | null>(null);
  const [to, setTo] = useState<Square | null>(null); 

  return (
    <div className={`text-white flex flex-col items-center justify-center w-full md:w-1/2 ${(color === 'b') ? 'rotate-180' : ''}`}>
      {board.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => {
            const squareRepresentation = String.fromCharCode(97 + (j%8)) + "" + (8-i) as Square;
            return (
              <div
                onClick={() => {
                  if(chess.turn() !== color) return;
                  if(!from){
                    setFrom(squareRepresentation);
                  }
                  else{
                    socket.send(JSON.stringify({type: MOVE, payload: {move:{from, to: squareRepresentation, promotion: 'q'}}}));
                    setFrom(null);
                  }
                  chess.move({
                    from: from, to: squareRepresentation, promotion: 'q'
                  });
                  const audio = new Audio('/move.mp3');
                  audio.play();
                  setBoard(chess.board());
                }}
                key={j}
                className={`flex items-center justify-center sm:w-24 sm:h-24 ${i % 2 === j % 2 ? 'bg-[#F0D9B5]': 'bg-[#b88c64]'} `}
              >
                <div className={`${(color === 'b') ? 'rotate-180' : ''}`} >
                  {square ? <img src={`/${square.color}${square.type}.svg`} width='100' height='100' alt="piece" /> : null}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;

import React, { useState } from 'react';
import { Color, PieceSymbol, Square, Move } from 'chess.js';
import { MOVE } from '@/constants/messages';

const ChessBoard = ({ chess, board, socket, setBoard, color }: { color: string; chess: any; setBoard: any; board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][]; socket: WebSocket }) => {
  const [from, setFrom] = useState<Square | null>(null);
  const [dragImage, setDragImage] = useState<HTMLImageElement | null>(null);
  const [draggingPiece, setDraggingPiece] = useState<Square | null>(null);
  const [currentBoard, setCurrentBoard] = useState(board);

  const handleMove = (from: Square, to: Square) => {
    setDraggingPiece(null);
    const move: Move | null = chess.move({ from, to, promotion: 'q' });
    if (move) {
      socket.send(JSON.stringify({ type: MOVE, payload: { move: { from, to, promotion: 'q' } } }));
      const audio = new Audio('/move.mp3');
      audio.play();
      setBoard(chess.board());
    } else {
      setBoard(currentBoard);
    }
    setFrom(null);
  };

  const createDragImage = (imgSrc: string) => {
    const img = new Image();
    img.src = imgSrc;
    img.width = 100;
    img.height = 100;
    img.style.position = 'absolute';
    img.style.pointerEvents = 'none';
    img.style.opacity = '0.9';
    img.className = (color === 'b') ? 'rotate-180' : '';
    document.body.appendChild(img);
    setDragImage(img);
    return img;
  };
  const handleDragEnd = () => {
    if (dragImage) {
      document.body.removeChild(dragImage);
      setDragImage(null);
    }
  };

  return (
    <div className={`text-white flex flex-col items-center justify-center w-full md:w-1/2 ${(color === 'b') ? 'rotate-180' : ''}`}>
      {board.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => {
            const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;
            return (
              <div
                onClick={() => {
                  if (chess.turn() !== color) return;
                  if (!from || from === null) {
                    setFrom(squareRepresentation);
                  } else {
                    handleMove(from, squareRepresentation);
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={() => {
                  if (from) {
                    handleMove(from, squareRepresentation);
                  }
                  if (dragImage) {
                    document.body.removeChild(dragImage);
                    setDragImage(null);
                  }
                  setDraggingPiece(null);
                }}
                onDragStart={(e) => {
                  if (chess.turn() === color && square) {
                    setFrom(squareRepresentation);
                    setDraggingPiece(squareRepresentation);
                    setCurrentBoard(board);
                    const img = createDragImage(`/${square.color}${square.type}.svg`);
                    e.dataTransfer.setDragImage(img, 50, 50);
                    e.dataTransfer.effectAllowed = 'move';
                  }
                }}
                draggable={chess.turn() == color && square?.color == color && !!square}
                onDragEnd={handleDragEnd}
                key={j}
                className={`flex items-center justify-center sm:w-24 sm:h-24 ${i % 2 === j % 2 ? 'bg-[#F0D9B5]' : 'bg-[#b88c64]'}`}
              >
                <div className={`${(color === 'b') ? 'rotate-180' : ''}`}>
                  {square ? (
                    <img src={`/${square.color}${square.type}.svg`} width='100' height='100' alt="piece" draggable={false} className={`${(draggingPiece === squareRepresentation) ? 'opacity-0' : 'opacity-100'}`}/>
                  ) : null}
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

import React from 'react';

type Props = {
  info: {
    isLoading: boolean;
    gameStarted: boolean;
    lives: number; // Add lives
    gameOver: boolean; // Add game over state
    onRestart: () => void; // Function to restart the game
  };
};

const GameInfoOverlay = ({ info }: Props) => {
  const { isLoading, gameStarted, lives, gameOver, onRestart } = info;

  return (
    <div className='absolute z-30 h-screen w-screen flex items-center justify-left'>
      {!gameStarted && (
        <div className="bg-blue-500 p-6 rounded-lg text-left text-white">
          <h1 className="text-3xl font-extrabold mb-4">Welcome to the Smile Platformer!</h1>
          <p className="text-lg mb-2">Instructions:</p>
          <p className="text-sm mb-2">1. Smile to make Mochi the Dog jump.</p>
          <p className="text-sm mb-2">2. Avoid the obstacles!</p>
          <p className="text-sm font-extrabold items-center">Smile to Start the Game!</p>
        </div>
      )}
      {isLoading && gameStarted && (
        <div className="text-left text-blue-500">
          <p className="text-lg">Get ready to jump!</p>
          <p className="text-lg">Lives: {lives}</p> {/* Show lives */}
        </div>
      )}
      {gameOver && (
        <div className="bg-red-500 p-6 rounded-lg text-left text-white"> {/* Game over screen */}
          <h1 className="text-3xl font-extrabold mb-4">Game Over!</h1>
          <p className="text-lg mb-2">You have no lives left.</p>
          <p className="text-sm font-extrabold">Smile to Restart the Game!</p>
          <button onClick={onRestart} className="mt-4 p-2 bg-yellow-500 text-black rounded">Restart</button>
        </div>
      )}
    </div>
  );
};

export default GameInfoOverlay;

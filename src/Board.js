import React, { useState, useEffect } from 'react';
import './Board.css';

function Board() {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [error, setError] = useState(null);
  const [isSinglePlayer, setIsSinglePlayer] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/game');
        const data = await response.json();
        setBoard(data.board);
        setIsXNext(data.is_x_next);
        setWinner(data.winner);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchGame();
  }, []); // No dependency on `error`

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  const handleClick = async (index) => {
    try {
      console.log(index);
      const response = await fetch('http://127.0.0.1:5000/move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ index }),
      });
      const data = await response.json();
      console.log(data);
      setBoard(data.board);
      setIsXNext(data.is_x_next);
      setWinner(data.winner);
    } catch (err) {
      setError('There was an error making the move!');
      console.error('There was an error making the move!', err);
    }
  };

  const renderCell = (index) => (
    <div key={index} className="cell" onClick={() => handleClick(index)}>
      {board[index]}
    </div>
  );

  const resetGame = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/reset', {
        method: 'POST',
      });
      const data = await response.json();
      setBoard(data.board);
      setIsXNext(data.is_x_next);
      setWinner(null);
    } catch (err) {
      setError('There was an error resetting the game!');
      console.error('There was an error resetting the game!', err);
    }
  };

  const setGameMode = async (isSinglePlayer) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/set_mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_single_player: isSinglePlayer }),
      });
      const data = await response.json();
      setIsSinglePlayer(data.is_single_player);
      resetGame(); // Reset the game when changing mode
    } catch (err) {
      setError('There was an error setting the game mode!');
      console.error('There was an error setting the game mode!', err);
    }
  };

  return (
    <div className="game">
      <div className="mode-toggle">
        <button onClick={() => setGameMode(false)}>Two Player</button>
        <button onClick={() => setGameMode(true)}>Single Player</button>
      </div>
      <div className="board">
        {board.map((cell, index) => renderCell(index))}
      </div>
      <div className="status">
        {winner ? `Winner: ${winner}` : `Next player: ${isXNext ? 'X' : 'O'}`}
      </div>
      <button onClick={resetGame}>Reset Game</button>
      {error && <div className="error">{error}</div>} {/* Display error message */}
    </div>
  );
}

export default Board;

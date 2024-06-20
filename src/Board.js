import React,{useState,useEffect} from 'react';
import'./Board.css'

function Board(){
    const [board,setBoard] = useState(Array(9).fill(''));
    
    const [isXNext,setIsXNext] = useState(true);

    const [winner,setWinner] = useState(null);
    
    const [error,setError] = useState(null);

    useEffect(()=>{
        const fetchGame = async () =>{
            try{
                const response = await fetch('/*Type the python server url*/');
                const data = response.json();
                setBoard(response.data.Board)
                setIsXNext(response.data.is_x_next);
                setWinner(response.data.winner);

            }catch(err){
                setError(err.message);
                console.log(error)
            }
        };
        fetchGame();
    },[]);

    const handleClick = async (index)=>{
        try{
            const response = await fetch('/*Type the url*/', {method:'POST',
            headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ index }),});
        const data = await response.json();
        setBoard(data.board);
        setIsXNext(data.is_x_next);
        setWinner(data.winner);
    } catch(error){
        console.error('There was an error making the move!', error);
    }};

    const renderCell = (index) => (
        <div className="cell" onClick={() => handleClick(index)}>
          {board[index]}
        </div>
      );
    
      const resetGame = async () => {
        try {
          const response = await fetch('/*type the url here*/', {
            method: 'POST',
          });
          const data = await response.json();
          setBoard(data.board);
          setIsXNext(data.is_x_next);
          setWinner(null);
        } catch (error) {
          console.error('There was an error resetting the game!', error);
        }
      };

      return(
        <div className="game">
      <div className="board">
        {board.map((cell, index) => renderCell(index))}
      </div>
      <div className="status">
        {winner ? `Winner: ${winner}` : `Next player: ${isXNext ? 'X' : 'O'}`}
      </div>
      <button onClick={resetGame}>Reset Game</button>
    </div>
      );
}

export default Board;
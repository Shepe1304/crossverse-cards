import React, { useState } from "react";
import "./GameSetUp.css";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router";

const GameSetUp = (props) => {
  const [matchName, setMatchName] = useState("");
  const [numPlayers, setNumPlayers] = useState(0);
  const [players, setPlayers] = useState([]);
  const [generatedList, setGeneratedList] = useState(null);

  const handlePlayerNameChange = (index, name) => {
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[index] = { ...updatedPlayers[index], name: name };
      return updatedPlayers;
    });
  };

  // Initialize or resize players array when numPlayers changes
  const updatePlayersArray = (count) => {
    setPlayers((prevPlayers) => {
      const newArray = Array(count)
        .fill(null)
        .map((_, i) => {
          // Preserve existing player data if available
          return prevPlayers[i] || { name: "" };
        });
      return newArray;
    });
  };

  const navigate = useNavigate();

  const generatePlayerList = async () => {
    try {
      const playerList = players.map((player) => ({
        name: player.name,
        characters: [],
        items: [],
        energy: -1,
        has_saved_energy: false,
      }));

      setGeneratedList(playerList);
      // props.setFinalPlayersList(playerList);

      const { data, error } = await supabase
        .from("matches")
        .insert({
          name: matchName,
          players: playerList,
          status: "ongoing",
          discarded: [],
          step: 0,
        })
        .select();

      // window.location = `/crossverse-cards/game/${data[0].id}`;
      navigate(`/game/${data[0].id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="game-container">
      <form onSubmit={(e) => e.preventDefault()} className="game-form">
        <div className="input-container">
          <label htmlFor="matchName" className="input-label">
            Match Name:{" "}
          </label>
          <input
            id="matchName"
            type="text"
            placeholder="Name of Match..."
            onChange={(e) => {
              setMatchName(e.target.value);
            }}
            className="input-field"
          />
        </div>

        <div className="input-container">
          <label htmlFor="numPlayers" className="input-label">
            Number of Players:{" "}
          </label>
          <input
            id="numPlayers"
            type="number"
            // min="0"
            placeholder="Number of players..."
            // value={numPlayers}
            onChange={(e) => {
              const count = parseInt(e.target.value) || 0;
              setNumPlayers(count);
              updatePlayersArray(count);
            }}
            className="input-field"
          />
        </div>

        {players.map((player, index) => {
          const playerId = index + 1;
          return (
            <div key={playerId} className="input-container">
              <label htmlFor={`player-${playerId}`} className="input-label">
                Player {playerId}'s name:{" "}
              </label>
              <input
                id={`player-${playerId}`}
                type="text"
                placeholder="Name of player..."
                value={player.name}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                className="input-field"
              />
            </div>
          );
        })}

        {numPlayers > 0 && (
          <button
            type="button"
            onClick={generatePlayerList}
            className="generate-button"
          >
            Generate Player List
          </button>
        )}

        {numPlayers > 0 && (
          <div className="player-list">
            <h3 className="list-heading">Current Players:</h3>
            <pre className="players-data">
              {JSON.stringify(players, null, 2)}
            </pre>
          </div>
        )}

        {generatedList && (
          <div className="generated-list">
            <h3 className="list-heading">Generated Player List:</h3>
            <pre className="players-data">
              {JSON.stringify(generatedList, null, 2)}
            </pre>
          </div>
        )}
      </form>
    </div>
  );
};

export default GameSetUp;

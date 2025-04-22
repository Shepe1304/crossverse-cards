import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useParams } from "react-router";
import "./GameBoard.css";

const GameBoard = (props) => {
  const { id } = useParams();

  const [step, setStep] = useState(0); // 0: choose characters, see items; 1: Roll initiatives; 2: gameplay

  const [characters, setCharacters] = useState([]);
  const [items, setItems] = useState([]);
  const [shuffledCharacters, setShuffledCharacters] = useState([]);
  const [shuffledItems, setShuffledItems] = useState([]);
  // const [matches, setMatches] = useState([]);
  const [currentMatch, setCurrentMatch] = useState({});
  const [playersCharacters, setPlayersCharacters] = useState({});

  // Courtesy of: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  const shuffle = (originalArray) => {
    let array = [...originalArray];
    let currentIndex = array.length;

    while (currentIndex !== 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  useEffect(() => {
    // const fetchMatches = async () => {
    //   const { data } = await supabase.from("matches").select();
    //   setMatches(data);
    // };
    // fetchMatches();

    const fetchCurrentMatch = async () => {
      const { data: matchesData } = await supabase.from("matches").select();
      const match = matchesData.find((m) => m.id === id);

      if (!match) return;

      setCurrentMatch(match);
      setStep(match.step);

      // Fetch characters and items only if needed
      if (!match.shuffledCharacters || match.shuffledCharacters.length === 0) {
        const { data: characterData } = await supabase
          .from("characters")
          .select();
        const shuffled = shuffle(characterData);

        setCharacters(characterData);
        setShuffledCharacters(shuffled);

        await supabase
          .from("matches")
          .update({ shuffledCharacters: shuffled })
          .eq("id", id);
      } else {
        setShuffledCharacters(match.shuffledCharacters);
      }

      if (!match.shuffledItems || match.shuffledItems.length === 0) {
        const { data: itemData } = await supabase.from("items").select();
        const shuffled = shuffle(itemData);

        setItems(itemData);
        setShuffledItems(shuffled);

        await supabase
          .from("matches")
          .update({ shuffledItems: shuffled })
          .eq("id", id);
      } else {
        setShuffledItems(match.shuffledItems);
      }
    };

    fetchCurrentMatch();
  }, []);

  // useEffect(() => {
  //   console.log("SHUFFLED");

  //   setShuffledCharacters(shuffle(characters));
  //   setShuffledItems(shuffle(items));
  // }, [characters, items]);

  const navigate = useNavigate();

  const handleEndMatch = async () => {
    try {
      const { data, error } = await supabase
        .from("matches")
        .update({ status: "ended" })
        .eq("id", id);
      // window.location = "/crossverse-cards/";
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const chooseCharacters = (player, character) => {
    const currentCharacters = playersCharacters[player.name] || [];

    if (
      !currentCharacters.includes(character) &&
      currentCharacters.length === 3
    ) {
      alert("Characters Limit Reached.");
      return;
    }

    let updatedCharacters;
    if (currentCharacters.includes(character)) {
      updatedCharacters = currentCharacters.filter(
        (char) => char.id !== character.id
      );
    } else {
      updatedCharacters = [...currentCharacters, character];
    }
    setPlayersCharacters({
      ...playersCharacters,
      [player.name]: updatedCharacters,
    });
  };

  useEffect(() => {
    console.log(playersCharacters);
  }, [playersCharacters]);

  const saveSelection = async () => {
    try {
      const updatedPlayers = currentMatch.players.map((player) => {
        return { ...player, characters: playersCharacters[player.name] };
      });
      const { data, error } = await supabase
        .from("matches")
        .update({ players: updatedPlayers })
        .eq("id", id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNextStep = async () => {
    if (step === 0) {
      try {
        const updatedPlayers = currentMatch.players.map((player, key) => {
          return {
            ...player,
            items: shuffledItems.slice(key * 5, (key + 1) * 5),
            characters: playersCharacters[player.name],
          };
        });
        const { data, error } = await supabase
          .from("matches")
          .update({ step: step + 1, players: updatedPlayers })
          .eq("id", id);
      } catch (err) {
        console.error(err);
      }
    } else if (step === 1) {
    } else if (step === 2) {
    } else {
    }
    setStep(step + 1);
    // window.location = `/crossverse-cards/game/${id}`;
    navigate(`/game/${id}`);
  };

  return (
    <div>
      {step === 0 ? (
        <div>
          <h2>{currentMatch.name}</h2>
          <div>
            {currentMatch?.players?.map((player, key) => {
              return (
                <div>
                  <h3>Player: {player.name}</h3>
                  <div>
                    <h3>Characters</h3>
                    {shuffledCharacters
                      ?.slice(key * 5, (key + 1) * 5)
                      .map((character) => {
                        const isSelected = playersCharacters[player.name]?.some(
                          (char) => char.id === character.id
                        );

                        return (
                          <button
                            key={character.id}
                            onClick={() => chooseCharacters(player, character)}
                            className={`character-button ${
                              isSelected ? "selected" : ""
                            }`}
                          >
                            {character.name}
                          </button>
                        );
                      })}
                  </div>
                  <div>
                    <h3>Items</h3>
                    {shuffledItems
                      ?.slice(key * 5, (key + 1) * 5)
                      .map((item) => {
                        return <button>{item.name}</button>;
                      })}
                  </div>
                  <br />
                  <button
                    style={{ background: "darkcyan", color: "white" }}
                    onClick={saveSelection}
                  >
                    Save Selection
                  </button>
                  <br />
                </div>
              );
            })}
          </div>
        </div>
      ) : step === 1 ? (
        <div>Step 1</div>
      ) : step === 2 ? (
        <div>Step 2</div>
      ) : (
        <div>Loading...</div>
      )}
      <br />
      <br />
      <button
        style={{ background: "darkgreen", color: "white" }}
        onClick={handleNextStep}
      >
        NEXT
      </button>
      <br />
      <br />
      <button
        style={{ background: "red", color: "white" }}
        onClick={handleEndMatch}
      >
        END MATCH
      </button>
    </div>
  );
};

export default GameBoard;

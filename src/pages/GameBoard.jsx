import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useParams } from "react-router";
import "./GameBoard.css";
import Card from "../components/Card";

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
  const [hoveredCharacterId, setHoveredCharacterId] = useState(null);
  const [hoveredItemId, setHoveredItemId] = useState(null);

  // Store timeout references to clear them when needed
  const timeoutRef = useRef(null);
  const itemTimeoutRef = useRef(null);

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

    // Clean up any timeouts when component unmounts
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (itemTimeoutRef.current) clearTimeout(itemTimeoutRef.current);
    };
  }, []);

  const navigate = useNavigate();

  const handleEndMatch = async () => {
    try {
      const { data, error } = await supabase
        .from("matches")
        .update({ status: "ended" })
        .eq("id", id);
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
      alert("Selection saved!");
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
    alert("If data is not showing, reload the page.");
    navigate(`/game/${id}`);
  };

  // Show card immediately when hovering over button or card
  const handleMouseEnter = (characterId) => {
    // Clear any existing timeout to hide the card
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredCharacterId(characterId);
  };

  // Schedule hiding the card after a small delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCharacterId(null);
    }, 100); // 100ms delay gives time to move between elements
  };

  // Show item card immediately when hovering over button or card
  const handleItemMouseEnter = (itemId) => {
    // Clear any existing timeout to hide the item card
    if (itemTimeoutRef.current) {
      clearTimeout(itemTimeoutRef.current);
      itemTimeoutRef.current = null;
    }
    setHoveredItemId(itemId);
  };

  // Schedule hiding the item card after a small delay
  const handleItemMouseLeave = () => {
    itemTimeoutRef.current = setTimeout(() => {
      setHoveredItemId(null);
    }, 100); // 100ms delay gives time to move between elements
  };

  return (
    <div className="gameboard">
      {step === 0 ? (
        <div>
          <h2>{currentMatch.name}</h2>
          <div>
            {currentMatch?.players?.map((player, key) => {
              return (
                <div key={`player-${key}`}>
                  <h3>Player: {player.name}</h3>
                  <div>
                    <h3>Characters</h3>
                    <div className="character-grid">
                      {shuffledCharacters
                        ?.slice(key * 5, (key + 1) * 5)
                        .map((character) => {
                          const isSelected = playersCharacters[
                            player.name
                          ]?.some((char) => char.id === character.id);

                          return (
                            <div
                              key={character.id}
                              className="character-container"
                            >
                              <button
                                onClick={() =>
                                  chooseCharacters(player, character)
                                }
                                className={`character-button ${
                                  isSelected ? "selected" : ""
                                }`}
                                onMouseEnter={() =>
                                  handleMouseEnter(character.id)
                                }
                                onMouseLeave={handleMouseLeave}
                              >
                                {character.name}
                              </button>
                              {hoveredCharacterId === character.id && (
                                <div
                                  className="card-preview"
                                  onMouseEnter={() =>
                                    handleMouseEnter(character.id)
                                  }
                                  onMouseLeave={handleMouseLeave}
                                >
                                  <Card data={character} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div>
                    <h3>Items</h3>
                    <div className="item-grid">
                      {shuffledItems
                        ?.slice(key * 5, (key + 1) * 5)
                        .map((item) => {
                          return (
                            <div key={item.id} className="item-container">
                              <button
                                className="item-button"
                                onMouseEnter={() =>
                                  handleItemMouseEnter(item.id)
                                }
                                onMouseLeave={handleItemMouseLeave}
                              >
                                {item.name}
                              </button>
                              {hoveredItemId === item.id && (
                                <div
                                  className="card-preview"
                                  onMouseEnter={() =>
                                    handleItemMouseEnter(item.id)
                                  }
                                  onMouseLeave={handleItemMouseLeave}
                                >
                                  <Card data={item} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <br />
                  <button
                    className="action-button save-button"
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
        <div>
          {currentMatch?.players?.map((player, key) => {
            return (
              <div key={`player-${key}`}>
                <h3>Player: {player.name}</h3>
                <div>
                  <h3>Selected Characters</h3>
                  <div className="character-grid">
                    {player.characters.map((character) => {
                      return (
                        <div key={character.id} className="character-container">
                          <button
                            className={`character-button`}
                            onMouseEnter={() => handleMouseEnter(character.id)}
                            onMouseLeave={handleMouseLeave}
                          >
                            {character.name}
                          </button>
                          {hoveredCharacterId === character.id && (
                            <div
                              className="card-preview"
                              onMouseEnter={() =>
                                handleMouseEnter(character.id)
                              }
                              onMouseLeave={handleMouseLeave}
                            >
                              <Card data={character} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h3>Items</h3>
                  <div className="item-grid">
                    {player.items.map((item) => {
                      return (
                        <div key={item.id} className="item-container">
                          <button
                            className="item-button"
                            onMouseEnter={() => handleItemMouseEnter(item.id)}
                            onMouseLeave={handleItemMouseLeave}
                          >
                            {item.name}
                          </button>
                          {hoveredItemId === item.id && (
                            <div
                              className="card-preview"
                              onMouseEnter={() => handleItemMouseEnter(item.id)}
                              onMouseLeave={handleItemMouseLeave}
                            >
                              <Card data={item} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <br />
              </div>
            );
          })}
        </div>
      ) : step === 2 ? (
        <div>Step 2</div>
      ) : (
        <div>Loading...</div>
      )}
      <br />
      <br />
      <button className="action-button next-button" onClick={handleNextStep}>
        NEXT
      </button>
      <br />
      <br />
      <button className="action-button end-button" onClick={handleEndMatch}>
        END MATCH
      </button>
    </div>
  );
};

export default GameBoard;

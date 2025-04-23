import React, { useState } from "react";
import Card from "../components/Card";
import "./PlayerContainer.css";

const PlayerContainer = (props) => {
  // Extract props
  const player = props.player;
  const step = props.step;
  const shuffledCharacters = props.shuffledCharacters;
  const shuffledItems = props.shuffledItems;
  const playersCharacters = props.playersCharacters;
  const playerIndex = props.playerIndex;
  const chooseCharacters = props.chooseCharacters;
  const saveSelection = props.saveSelection;
  const hoveredCharacterId = props.hoveredCharacterId;
  const hoveredItemId = props.hoveredItemId;
  const handleMouseEnter = props.handleMouseEnter;
  const handleMouseLeave = props.handleMouseLeave;
  const handleItemMouseEnter = props.handleItemMouseEnter;
  const handleItemMouseLeave = props.handleItemMouseLeave;

  // State to track whether the container is expanded or collapsed
  const [isExpanded, setIsExpanded] = useState(true);

  // Toggle expanded/collapsed state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Get selected character count for collapse view
  const selectedCharacterCount =
    step === 0
      ? playersCharacters[player.name]?.length || 0
      : player.characters?.length || 0;

  // Get item count for collapse view
  const itemCount =
    step === 0
      ? shuffledItems?.slice(playerIndex * 5, (playerIndex + 1) * 5)?.length ||
        0
      : player.items?.length || 0;

  return (
    <div
      className={`player-container ${isExpanded ? "expanded" : "collapsed"}`}
    >
      <div className="player-header">
        <div className="player-summary">
          <h3>Player: {player.name}</h3>
          <div className="player-stats">
            <span>Characters: {selectedCharacterCount}</span>
            {step === 0 && selectedCharacterCount > 0 ? (
              <span>
                {" "}
                |{" "}
                {selectedCharacterCount === 3
                  ? "Ready"
                  : `Need ${3 - selectedCharacterCount} more`}
              </span>
            ) : null}
            <span> | Items: {itemCount}</span>
          </div>
        </div>
        <button className="toggle-button" onClick={toggleExpanded}>
          {isExpanded ? "Collapse ▲" : "Expand ▼"}
        </button>
      </div>

      {isExpanded && (
        <div className="player-content">
          {step === 0 ? (
            <>
              <div>
                <h3>Characters</h3>
                <div className="character-grid">
                  {shuffledCharacters
                    ?.slice(playerIndex * 5, (playerIndex + 1) * 5)
                    .map((character) => {
                      const isSelected = playersCharacters[player.name]?.some(
                        (char) => char.id === character.id
                      );

                      return (
                        <div key={character.id} className="character-container">
                          <button
                            onClick={() => chooseCharacters(player, character)}
                            className={`character-button ${
                              isSelected ? "selected" : ""
                            }`}
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
                  {shuffledItems
                    ?.slice(playerIndex * 5, (playerIndex + 1) * 5)
                    .map((item) => {
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
              <button
                className="action-button save-button"
                onClick={saveSelection}
              >
                Save Selection
              </button>
              <br />
            </>
          ) : step === 1 ? (
            <>
              <div>
                <h3>Selected Characters</h3>
                <div className="character-grid">
                  {player.characters.map((character) => {
                    return (
                      <div key={character.id} className="character-container">
                        <button
                          className="character-button"
                          onMouseEnter={() => handleMouseEnter(character.id)}
                          onMouseLeave={handleMouseLeave}
                        >
                          {character.name}
                        </button>
                        {hoveredCharacterId === character.id && (
                          <div
                            className="card-preview"
                            onMouseEnter={() => handleMouseEnter(character.id)}
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
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default PlayerContainer;

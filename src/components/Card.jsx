import React from "react";
import "./Card.css";

const Card = (props) => {
  const isCharacter = props.data.title !== undefined;
  const isItem = props.data.type !== undefined;

  // Define stat labels for better readability
  const statLabels = {
    hp: "HP",
    atk: "ATK",
    def: "DEF",
    crt: "CRT",
    cdm: "CDM",
    int: "INT",
    mag: "MAG",
    res: "RES",
    ins: "INS",
  };

  // Filter out undefined stats
  const stats = Object.entries({
    hp: props.data.stats.hp,
    atk: props.data.stats.atk,
    def: props.data.stats.def,
    crt: props.data.stats.crt,
    cdm: props.data.stats.cdm,
    int: props.data.stats.int,
    mag: props.data.stats.mag,
    res: props.data.stats.res,
    ins: props.data.stats.ins,
  }).filter(([_, value]) => value !== undefined);

  return (
    <div className={`card ${isCharacter ? "character-card" : "item-card"}`}>
      <h1 className="card-title">{props.data.name}</h1>
      <p className="card-subtitle">
        {props.data.title ? props.data.title : props.data.type}
      </p>

      <p className="card-faction">
        {props.data.faction ? props.data.faction : "No Associated Faction"}
      </p>

      {(props.data.requirements || isItem) && (
        <p className="card-requirements">
          <strong>Requirements:</strong>{" "}
          {props.data.requirements ? props.data.requirements : "None"}
        </p>
      )}

      <div className="card-stats">
        {stats.map(([key, value]) => (
          <div key={key} className="stat" data-label={statLabels[key]}>
            {value}
          </div>
        ))}
      </div>

      <div className="card-special">
        <div className="card-special-title">
          {isCharacter ? "Special Ability" : "Effects"}
        </div>
        {props.data.special
          ? props.data.special
          : props.data.effects
          ? props.data.effects
          : "No special abilities or effects"}
      </div>
    </div>
  );
};

export default Card;

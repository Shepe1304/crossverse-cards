import React from "react";
import { Link } from "react-router-dom";
import MatchesList from "../components/MatchesList";

const Home = () => {
  return (
    <div>
      <button>
        <Link to={"/game/setup"}>Start New Game</Link>
      </button>
      <div>
        <div>Choose from ongoing games</div>
        <MatchesList selectedType="ongoing" />
      </div>
    </div>
  );
};

export default Home;

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CharacterImporter from "./pages/CharacterImporter";
import ItemImporter from "./pages/ItemImporter";
import GameBoard from "./pages/GameBoard";
import GameSetUp from "./pages/GameSetUp";
import "./App.css";

function App() {
  return (
    <Router basename="/crossverse-cards/">
      <div>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/import/characters" element={<CharacterImporter />} />
          <Route path="/import/items" element={<ItemImporter />} />

          <Route path="/game/setup" element={<GameSetUp />} />
          <Route path="/game/:id" element={<GameBoard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link, useNavigate } from "react-router";

const MatchesList = (props) => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data } = await supabase.from("matches").select();
        setMatches(data);

        if (props.selectedType === "all") {
          setFilteredMatches(data);
        } else {
          setFilteredMatches(
            data.filter((match) => match.status === props.selectedType)
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMatches();
  }, []);

  const navigate = useNavigate();

  const handleMatchSelect = async (match) => {
    console.log("Entering function");

    // try {
    //   const { error: deleteError } = await supabase
    //     .from("selected-match")
    //     .delete()
    //     .not("id", "is", null);

    //   const { error: insertError } = await supabase
    //     .from("selected-match")
    //     .insert({ matchId: match.id });
    // } catch (err) {
    //   console.error(err);
    // }

    // window.location = `/crossverse-cards/game/${match.id}`;
    // navigate(`/game/${match.id}`);
  };

  return (
    <div>
      <div>
        {matches.map((match) => {
          if (match.status != props.selectedType) return;
          return (
            <Link to={`/game/${match.id}`}>
              <h2>{match.name}</h2>
              <p>{match.status}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MatchesList;

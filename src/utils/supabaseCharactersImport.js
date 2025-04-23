import { supabase } from "../lib/supabaseClient";

// Characters data
const charactersData = [
  {
    name: "Klarus",
    title: "The Genius Mastermind",
    stats: {
      hp: 25 + 20,
      atk: 4,
      def: 3,
      crt: 10,
      cdm: 125,
      int: 7,
      mag: 2,
      res: 20,
      ins: 0,
    },
    faction: "The Cursed Order",
    special:
      "Analyze: Cold-Hearted Realist: When active, opponent's attack's CRT is fixed at 0. The Wall Between You and Me: If self's INT is higher than or equal to opponent's INT, decrease incoming DMG to self by 30% for reduce by DEF. Beyond Scrolls and Quills: For every INT that exceeds 10, further decrease incoming DMG to self by 5% to a maximum of 20%.",
  },
  {
    name: "Agondorr Van",
    title: "The Midnight Poet",
    stats: {
      hp: 20 + 20,
      atk: 3,
      def: 2,
      crt: 5,
      cdm: 100,
      int: 8,
      mag: 3,
      res: 20,
      ins: 4,
    },
    faction: "Beyonder's Society",
    special:
      "Sword of Twillight: Raving: INS minimum cap is 4. Assamilate: When INS is higher than or equal to 5, normal attack damage is converted to Spirit damage, then increase opponent active character's INS by 2 when using normal attack.",
  },
  {
    name: "Nightmare",
    title: "The Wandering Hermit",
    stats: {
      hp: 25 + 20,
      atk: 0,
      def: 4,
      crt: 5,
      cdm: 100,
      int: 10,
      mag: 0,
      res: 40,
      ins: 0,
    },
    faction: "Beyonder's Society",
    special:
      "It's Tea Time! (Special, 3E): Decrease self INS to 0 and deal 2 Spirit DMG to all characters for each INS they have, then decrease their INS to the minimum cap. Thus, the Darkness Begins (Special, 1E): Increase all characters' INS by 1.",
  },
  {
    name: "Joan - Divine Blessed",
    title: "Lunar's Will",
    stats: {
      hp: 15 + 20,
      atk: 1,
      def: 1,
      crt: 5,
      cdm: 100,
      int: 10,
      mag: 5,
      res: 50,
      ins: 0,
    },
    faction: "The Cursed Order",
    special:
      "Future Sight (Special, 2E): At the next drawing phrase, choose a type of cards (item or magic) and draw until you have drawn 2 of the chosen kind of card or there are no chosen type of card left. Pick 2 cards and put the rest back in the order that they are drawn This ability is considered as Magic Spell. Spell - Ice Sword (1E, INT 8): Deal MAG Magic DMG to one opponent's active. Spell - Jetstream (1E, INT 12): Deal 1.5 x MAG Magic DMG to one opponent's active while ignoring 20% of RES. Spell - Water World (3E, INT 15): Deal 1.5 x MAG Magic DMG to one opponent's active and 1.25 x MAG Magic DMG to the inactive.",
  },
  {
    name: "Kraguel",
    title: "The Rising Swordman",
    stats: {
      hp: 20 + 20,
      atk: 4,
      def: 4,
      crt: 60,
      cdm: 200,
      int: 2,
      mag: 1,
      res: 10,
      ins: 0,
    },
    faction: "The Guide",
    special: "Intuition: CRT is fixed at 60",
  },
  {
    name: "Viktor",
    title: "The Ambitious Swordmaster",
    stats: {
      hp: 20 + 20,
      atk: 4,
      def: 2,
      crt: 40,
      cdm: 170,
      int: 1,
      mag: 1,
      res: 10,
      ins: 0,
    },
    faction: "The Spirit Realm",
    special:
      "One with Sword: When HP is lower than or equal to 10, increase CRT by 40 and CDM by 80. The Line between Life and Death: When Viktor performs Normal Attack, if his HP is higher than 10, reduce it by 4, if HP is lower than 10, recover 2 HP.",
  },
  {
    name: "Syphl Riko Etranohl Sorokma",
    title: "The Grand Spirit",
    stats: {
      hp: 15 + 20,
      atk: 2,
      def: 2,
      crt: 5,
      cdm: 100,
      int: 8,
      mag: 4,
      res: 40,
      ins: 0,
    },
    faction: "The Spirit Realm",
    special:
      "Master of Elementals: Whenever Energy of allies and self is consumed, gain a stack of Synergy for each energy spent. A Maximum of 10 Stack can be gain per phase. Synergy (Max 10 Stack): Whenever allies dealt Magic DMG, consumed 10 stack of Synergy and increase the allies MAG by 50% of Syphl's MAG + 2 for that Magic Spell. For each INT higher than 8, decrease 1 stack of Synergy consumed up to a maximum of 5. Begone! O Evil Spirit! (1EP, Special Action): Recover 3 HP to self and remove one selected debuff from a choosen allies.",
  },
  {
    name: "Evelyn",
    title: "The Icy Sorceress",
    stats: {
      hp: 25 + 20,
      atk: 1,
      def: 4,
      crt: 5,
      cdm: 100,
      int: 4,
      mag: 2,
      res: 40,
      ins: 0,
    },
    faction: "Beyonder's Society",
    special:
      "Calm Mind: At the end of a phrase, decrease allies's INS by 1, increase opponent active's INS by 2 and increase self's INS by 4. All Darkness Shall Be Frozen (Special Action, 0E): Consumed half of self's INS (round up) and gain 1 stack of Snowflake for each INS spent. Snowflake (Max 5 Stack): For each stack, Increase allies Spirit DMG Bonus by 10% at base, further increase this DMG Bonus by 1% for each Evelyn's INT for a maximum 20% DMG Bonus. At the end of each phase, lose 2 stack. Sealed Omen: When INS reached 5 or above, reduce allies Spirit DMG taken by 20% and All-Type DMG taken by 10%.",
  },
  {
    name: "Kaya Clein",
    title: "The Magician",
    stats: {
      hp: 20 + 20,
      atk: 1,
      def: 3,
      crt: 20,
      cdm: 150,
      int: 4,
      mag: 1,
      res: 30,
      ins: 0,
    },
    faction: "Beyonder's Society",
    special:
      "Second Heart - Particle Recovery: When HP is lower than 0, if INS is lower than 4, increase INS minimum cap by 2 and then recover 5 HP for each INS Kaya has, else, Kaya Clein is defeated.",
  },
  {
    name: "Michael Pernor",
    title: "Machinery Hivemind",
    stats: {
      hp: 20 + 20,
      atk: 5,
      def: 5,
      crt: 20,
      cdm: 150,
      int: 2,
      mag: 1,
      res: 10,
      ins: 0,
    },
    faction: "Beyonder's Society",
    special:
      "Father of Machine: Maximum item equipped on Michael Pernor is increased to 4, for each equipped item that exceed 2, increase INS by 2.",
  },
  {
    name: "Aerith",
    title: "Paul's Sucessor",
    stats: {
      hp: 20 + 20,
      atk: 2,
      def: 1,
      crt: 5,
      cdm: 100,
      int: 8,
      mag: 5,
      res: 50,
      ins: 0,
    },
    faction: "The Cursed Order",
    special:
      "Historical Eyes (0E, Special Action): Replicate the last used magic on the field, provided that Aerith possess sufficient requirement, energy, scales with Aerith's MAG and is considered a Special Action.",
  },
  {
    name: "Paul",
    title: "Alchemist of Yore",
    stats: {
      hp: 15 + 20,
      atk: 1,
      def: 1,
      crt: 30,
      cdm: 100,
      int: 10,
      mag: 3,
      res: 30,
      ins: 0,
    },
    faction: "",
    special:
      "The Ultimate Alchemy (4E, Special): Grant all allied characters, including Paul, a stack of Philosopher's Stone. Philosopher's Stone: One of the following effects is granted to self for this phrase: -Perform an addition Normal Attack at cost of a Magic Attack. -Cast a Magic Attack at the cost of a Normal Attack. -Discard a card to draw a new card. -Transfer health to another allied character by maximum of MAG.",
  },
  {
    name: "Galbert",
    title: "The King's Slayer",
    stats: {
      hp: 15 + 20,
      atk: 4,
      def: 3,
      crt: 25,
      cdm: 175,
      int: 5,
      mag: 1,
      res: 10,
      ins: 0,
    },
    faction: "",
    special:
      "Scythe Art: Symphony of Death (1E): Consumed all stack of Doom's Tempo, deal 5*Doom's Tempo's Stack damage as normal attack while ignoring 50% opponent's DEF. Chorus of the Departed: When any character is defeated, gain to self 1 Doom's Tempo. Doom's Tempo: Increase ATK, DEF by 2, CRT by 10 and CDM by 25 for each stack.",
  },
  {
    name: "Chloé",
    title: "The Irregular",
    stats: {
      hp: 20 + 20,
      atk: 2,
      def: 1,
      crt: 10,
      cdm: 100,
      int: 8,
      mag: 4,
      res: 30,
      ins: 0,
    },
    faction: "",
    special:
      "Beelzebulb's Magic: Spell of the Depth: When allies casts Magic Spell, gain to self 1 stack of Corrosion. Corrosion: Opponent active's RES is decreased by 10, max 3 stack. Once 3 stacks have been reached, deal 6 MAG to all opponents, then remove all stack.",
  },
  {
    name: "Lilla Pernor",
    title: "The Spectator",
    stats: {
      hp: 15 + 20,
      atk: 4,
      def: 3,
      crt: 15,
      cdm: 125,
      int: 4,
      mag: 2,
      res: 30,
      ins: 0,
    },
    faction: "",
    special:
      "Spectate - Observe (1E): Grant to self 1 stack of Realization. Spectate - Disarm (2E): Consume 1 stack of Realization, all opponent's DEF are decreased by 2 for this phrase. Spectate - Assault (3E): Consume 2 stack of Realization, all allies' ATK are increased by total number of item equipped for this phrase, this Special can be used right after Spectate - Disarm is used without costing a Special Action.",
  },
  {
    name: "Welch Benz",
    title: "The Flawless Butler",
    stats: {
      hp: 25 + 20,
      atk: 1,
      def: 3,
      crt: 5,
      cdm: 100,
      int: 10,
      mag: 2,
      res: 20,
      ins: 0,
    },
    faction: "",
    special:
      "Special - Behind the Scene: When damage is dealt to a target (allies or enemies), that target receive a stack of Demonize, max 3 stack. Demonize: Spirit Damage taken is increased by the number of stack. Terrorize (4E): All characters' stacks of Demonize are consumed: 1/2 Demonize: Increase inflicted character's INS by 2/3 (or 1/2 for allies). 3 Demonize: Inflicted opponent's characters' ATK and MAG is reduced to 0 for this phrase / allies characters' DEF and RES are increased by 3 and 30 respectively.",
  },
  {
    name: "Grim",
    title: "Nakula's Successor",
    stats: {
      hp: 25 + 20,
      atk: 4,
      def: 5,
      crt: 5,
      cdm: 100,
      int: 6,
      mag: 1,
      res: 20,
      ins: 0,
    },
    faction: "",
    special:
      "Father of Battle Gear: Increase ATK and DEF by 1 for each 5 HP over 20 HP that Grim has. Blessing of Blacksmith: At the start of each phrase, recover 1 HP for each item equipped.",
  },
  {
    name: "Randal Heim",
    title: "God's Believer",
    stats: {
      hp: 15 + 20,
      atk: 2,
      def: 2,
      crt: 5,
      cdm: 100,
      int: 8,
      mag: 4,
      res: 40,
      ins: 0,
    },
    faction: "",
    special:
      "Notarize - Amplify (2E): Increase allies' next Magic Spell damage by 1.5. Notarize - Nullify (2E): Decrease next income damage by 1.5 (2 if the attack is Magic damage). (Randal Heim's Specials are not restricted by phrases)",
  },
  {
    name: "Lorella Accardo",
    title: "Shining Cat's Receptionist",
    stats: {
      hp: 20 + 20,
      atk: 2,
      def: 0,
      crt: 50,
      cdm: 100,
      int: 6,
      mag: 2,
      res: 0,
      ins: 0,
    },
    faction: "",
    special:
      "Dark Magic: Increase all opponent's active's INS by CRT/25 (round up) when casting a Magic Spell. Critical Strike (2E): Deal CRT/10 (round up) Spirit damage to one opponent's active.",
  },
  {
    name: "Soest Olaf",
    title: "The Nightshawk",
    stats: {
      hp: 20 + 20,
      atk: 0,
      def: 0,
      crt: 5,
      cdm: 100,
      int: 10,
      mag: 5,
      res: 50,
      ins: 0,
    },
    faction: "",
    special:
      "In the Dead of Night: Increase Mag by INT/3 (round up) when attacking opponent's with 10 HP or above.",
  },
];

// Function to insert all characters into Supabase
const importCharactersToSupabase = async () => {
  try {
    console.log("Starting character import to Supabase...");

    // Insert the characters data into the 'characters' table
    const { data, error } = await supabase
      .from("characters")
      .insert(charactersData);

    if (error) {
      console.error("Error importing characters:", error);
      return { success: false, error };
    }

    console.log("Successfully imported characters to Supabase!");
    return { success: true, data };
  } catch (err) {
    console.error("Exception occurred during import:", err);
    return { success: false, error: err };
  }
};

// Function to create the characters table if it doesn't exist
const createCharactersTable = async () => {
  try {
    // Check if the characters table exists
    const { error: checkError } = await supabase
      .from("characters")
      .select("name")
      .limit(1);

    // If the table exists, no need to create it
    if (!checkError) {
      console.log("Characters table already exists");
      return { success: true };
    }

    console.log(
      "You need to create the characters table in your Supabase dashboard"
    );
    console.log("Table structure should have columns for:");
    console.log(
      "name, title, hp, atk, def, crt, cdm, int, mag, res, ins, faction, special"
    );
  } catch (err) {
    console.error("Error checking/creating table:", err);
    return { success: false, error: err };
  }
};

export { importCharactersToSupabase, createCharactersTable, charactersData };

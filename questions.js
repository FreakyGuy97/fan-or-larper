// 12 video game trivia questions. `answer` is the index of the correct option.
// Each question carries a fun fact shown after answering.

export const QUESTIONS = [
  {
    q: "What year did the original Super Mario Bros. come out?",
    options: ["1983", "1985", "1987", "1990"],
    answer: 1,
    fact: "Super Mario Bros. launched in 1985 and basically rescued the entire video game industry.",
  },
  {
    q: "Which company makes the PlayStation?",
    options: ["Nintendo", "Sony", "Sega", "Microsoft"],
    answer: 1,
    fact: "Sony entered gaming after a failed partnership with Nintendo to build a CD add-on for the SNES.",
  },
  {
    q: "What is the best-selling video game of all time?",
    options: ["GTA V", "Minecraft", "Tetris", "Wii Sports"],
    answer: 1,
    fact: "Minecraft has sold over 300 million copies. Nothing else is even close.",
  },
  {
    q: "In Minecraft, what are Creepers afraid of?",
    options: ["Dogs", "Cats", "Torches", "Water"],
    answer: 1,
    fact: "Creepers run from cats and ocelots. A cat army is legitimate base defense.",
  },
  {
    q: "Master Chief is the hero of which game series?",
    options: ["Halo", "Gears of War", "Doom", "Call of Duty"],
    answer: 0,
    fact: "Master Chief debuted in Halo: Combat Evolved in 2001 and became the face of Xbox.",
  },
  {
    q: "What does NPC stand for?",
    options: ["New Player Challenge", "Non-Player Character", "National Play Commission", "Next Phase Content"],
    answer: 1,
    fact: "NPCs are every character not controlled by a player, from shopkeepers to final bosses' minions.",
  },
  {
    q: "In The Legend of Zelda, who is the hero you actually play as?",
    options: ["Zelda", "Link", "Ganon", "Epona"],
    answer: 1,
    fact: "The hero is Link. Zelda is the princess. Getting this wrong is the #1 larper tell.",
  },
  {
    q: "Which studio released Fortnite's battle royale mode in 2017?",
    options: ["Epic Games", "Activision", "EA", "Ubisoft"],
    answer: 0,
    fact: "Epic Games launched Fortnite Battle Royale in September 2017 and it became a cultural phenomenon.",
  },
  {
    q: "What is the red ghost's name in Pac-Man?",
    options: ["Blinky", "Pinky", "Inky", "Clyde"],
    answer: 0,
    fact: "Blinky is the red one and the most aggressive. Pinky is pink, Inky is cyan, Clyde is orange.",
  },
  {
    q: "What year did the Nintendo Switch launch?",
    options: ["2015", "2016", "2017", "2018"],
    answer: 2,
    fact: "The Switch launched in March 2017 and went on to sell over 140 million units.",
  },
  {
    q: "The famous Konami Code (up, up, down, down...) debuted in which game?",
    options: ["Contra", "Gradius", "Castlevania", "Metal Gear"],
    answer: 0,
    fact: "The code first appeared in Gradius but became legendary in Contra, granting 30 extra lives.",
  },
  {
    q: "What is the name of Sonic's two-tailed sidekick?",
    options: ["Tails", "Knuckles", "Shadow", "Silver"],
    answer: 0,
    fact: "Miles 'Tails' Prower can fly by spinning his two tails like a helicopter.",
  },
];

// Verdict tiers based on final score out of 12.
export function getVerdict(score) {
  if (score >= 11)
    return {
      title: "CERTIFIED DAY-ONE FAN",
      line: "You don't just play games. You ARE games.",
    };
  if (score >= 9)
    return {
      title: "REAL FAN",
      line: "Respect. Your gamer card is fully intact.",
    };
  if (score >= 7)
    return {
      title: "SOLID CASUAL",
      line: "You play games. But do you PLAY games?",
    };
  if (score >= 5)
    return {
      title: "SUS",
      line: "Some of those answers were... brave.",
    };
  if (score >= 3)
    return {
      title: "CASUAL LARPER",
      line: "You watched one speedrun and ran with it.",
    };
  return {
    title: "EXPOSED LARPER",
    line: "The council has reviewed your answers. It's not looking good.",
  };
}

// Fisher-Yates shuffle so the question order is fresh every game.
export function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

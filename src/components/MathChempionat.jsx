import "./MathChempionat.css";
import { useState } from "react";
import MainUclGame from "./MainUclGame.jsx";

function MathChempionat() {
  const [playerText, setPlayerText] = useState("");
  const [time, setTime] = useState(10);
  const [started, setStarted] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [champion, setChampion] = useState(null);

  const [activeMatch, setActiveMatch] = useState(null);

  const players = playerText
    .split("\n")
    .map((name) => name.trim())
    .filter(Boolean);

  const shufflePlayers = (list) => {
    const result = [...list];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  const getRoundName = (totalRounds, currentRoundIndex) => {
    const roundsLeft = totalRounds - currentRoundIndex;
    if (roundsLeft === 1) return "FINAL";
    if (roundsLeft === 2) return "YARIM FINAL";
    if (roundsLeft === 3) return "CHORAK FINAL";
    if (roundsLeft === 4) return "1/8 FINAL";
    return `${currentRoundIndex + 1}-BOSQICH`;
  };

  const propagateBracketWinners = (formattedRounds) => {
    let roundsCopy = JSON.parse(JSON.stringify(formattedRounds));

    for (let r = 0; r < roundsCopy.length - 1; r++) {
      const currentRound = roundsCopy[r];
      for (let m = 0; m < currentRound.matches.length; m++) {
        const match = currentRound.matches[m];

        if (match.winner) {
          const nextRoundIdx = r + 1;
          const nextMatchIdx = Math.floor(m / 2);
          const isPlayer2Slot = m % 2 !== 0;

          const targetMatch = roundsCopy[nextRoundIdx].matches[nextMatchIdx];

          if (isPlayer2Slot) {
            targetMatch.player2 = match.winner;
          } else {
            targetMatch.player1 = match.winner;
          }

          if (targetMatch.automatic) {
            targetMatch.winner = match.winner;
          }
        }
      }
    }
    return roundsCopy;
  };

  const createTournament = (playerList) => {
    const shuffled = shufflePlayers(playerList);
    let currentLevelPlayers = [...shuffled];
    const tempRounds = [];

    while (currentLevelPlayers.length > 1) {
      const matches = [];
      const nextLevelPlayers = [];

      let i = 0;
      const hasOdd = currentLevelPlayers.length % 2 !== 0;
      const limit = hasOdd ? currentLevelPlayers.length - 1 : currentLevelPlayers.length;

      for (i = 0; i < limit; i += 2) {
        const p1 = currentLevelPlayers[i];
        const p2 = currentLevelPlayers[i + 1];

        matches.push({
          id: `match-${Math.random()}`,
          player1: p1,
          player2: p2,
          winner: null,
          automatic: false,
        });

        nextLevelPlayers.push({ type: "winnerOf" });
      }

      if (hasOdd) {
        const oddPlayer = currentLevelPlayers[currentLevelPlayers.length - 1];
        matches.push({
          id: `bye-${Math.random()}`,
          player1: oddPlayer,
          player2: "— (Avtomat keyingi bosqichga)",
          winner: oddPlayer,
          automatic: true,
        });

        nextLevelPlayers.push(oddPlayer);
      }

      tempRounds.push({ matches });

      currentLevelPlayers = nextLevelPlayers.map((item) => {
        if (typeof item === "string") return item;
        return "G‘OLIB";
      });
    }

    const totalRounds = tempRounds.length;
    const initialRounds = tempRounds.map((round, index) => ({
      name: getRoundName(totalRounds, index),
      matches: round.matches,
    }));

    return propagateBracketWinners(initialRounds);
  };

  const startChampionship = () => {
    if (players.length < 2) {
      alert("Kamida 2 ta o‘yinchi kiriting!");
      return;
    }

    const tournament = createTournament(players);
    setRounds(tournament);
    setChampion(null);
    setStarted(true);
  };

  const resetToSetup = () => {
    setStarted(false);
    setChampion(null);
    setActiveMatch(null);
    setRounds([]);
  };

  const handleStartMatch = (roundIdx, matchIdx, p1, p2) => {
    const isFinal = roundIdx === rounds.length - 1;
    setActiveMatch({
      roundIdx,
      matchIdx,
      player1: p1,
      player2: p2,
      isFinal,
    });
  };

  const handleMatchFinish = (winnerName) => {
    if (!activeMatch) return;

    const { roundIdx, matchIdx, isFinal } = activeMatch;
    let updatedRounds = JSON.parse(JSON.stringify(rounds));
    updatedRounds[roundIdx].matches[matchIdx].winner = winnerName;

    updatedRounds = propagateBracketWinners(updatedRounds);
    setRounds(updatedRounds);

    if (isFinal) {
      setChampion(winnerName);
    }

    setActiveMatch(null);
  };

  if (champion) {
    return (
      <div className="champion-screen-overlay">
        <div className="confetti-box">✨ 🏆 ✨</div>
        <div className="champion-card">
          <div className="trophy-icon">🏆</div>
          <span className="champion-subtitle">MATEMATIKA MUSOBAQASI G‘OLIBI</span>
          <h1 className="champion-name">{champion}</h1>
          <p className="champion-congrats">
            Barcha raqiblarini mag‘lub etib, mutlaq CHEMPION bo‘ldi! 👑
          </p>
          <button className="restart-btn" onClick={resetToSetup}>
            Yangi Turnir Boshlash 🔄
          </button>
        </div>
      </div>
    );
  }

  if (activeMatch) {
    return (
      <MainUclGame
        player1={activeMatch.player1}
        player2={activeMatch.player2}
        timeLimit={time}
        isFinalMatch={activeMatch.isFinal}
        onFinish={handleMatchFinish}
        onCancel={() => setActiveMatch(null)}
      />
    );
  }

  if (!started) {
    return (
      <div className="championship-page">
        <header className="championship-header">
          <button className="back-button" onClick={() => window.location.href = "/8b-menu"}>
            ← 8-B Menuga qaytish
          </button>
          <div className="championship-logo">
            MATH<span>CHAMP</span>
          </div>
        </header>

        <main className="championship-content">
          <div className="championship-title">
            <h1>Turnir Sozlamalari</h1>
            <p>O‘yinchilar ro‘yxatini kiriting va qura tashlang</p>
          </div>

          <section className="setup-card">
            <div className="setup-card-header">
              <div>
                <h2>O‘yinchilar Ro‘yxati</h2>
                <p>Har bir qatorda bitta o‘yinchi ismi</p>
              </div>
              <div className="player-count">
                {players.length} <span>O‘yinchi</span>
              </div>
            </div>
            <textarea
              className="players-textarea"
              value={playerText}
              onChange={(e) => setPlayerText(e.target.value)}
              placeholder={"Sardor\nTemur\nJavohir\nAli\nVali"}
            />
          </section>

          <section className="setup-card">
            <div className="setup-card-header">
              <div>
                <h2>Savol Vaqti</h2>
                <p>Har bir savol uchun ajratiladigan vaqt (soniya)</p>
              </div>
              <div className="time-box">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
                <span>sekund</span>
              </div>
            </div>
          </section>

          <button className="start-button" onClick={startChampionship}>
            🎲 QURA TASHLASH VA SETKANI YARATISH →
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="championship-page">
      <header className="championship-header">
        <button className="back-button" onClick={resetToSetup}>
          ← Sozlamalarga qaytish
        </button>
        <div className="championship-logo">
          MATH<span>CHAMP</span>
        </div>
      </header>

      <main className="championship-content">
        <div className="tournament-top">
          <div>
            <div className="live-draw-badge">
              <span className="live-dot"></span> LIVE DRAW
            </div>
            <h1>Turnir Setkasi</h1>
            <p>O‘yinni boshlash uchun juftlikdagi tugmani bosing</p>
          </div>

          <div className="tournament-stats">
            <div>
              <strong>{players.length}</strong>
              <span>O‘YINCHI</span>
            </div>
            <div>
              <strong>{rounds.length}</strong>
              <span>BOSQICH</span>
            </div>
            <div>
              <strong>{time}s</strong>
              <span>VAQT</span>
            </div>
          </div>
        </div>

        <section className="bracket-card">
          <div className="bracket-scroll">
            <div className="sky-bracket-grid">
              {rounds.map((round, roundIndex) => (
                <div className="sky-round-column" key={roundIndex}>
                  <div className="round-heading">
                    <span className="round-num">{String(roundIndex + 1).padStart(2, "0")}</span>
                    <strong>{round.name}</strong>
                  </div>

                  <div className="sky-matches-list">
                    {round.matches.map((match, matchIndex) => {
                      const canPlay =
                        match.player1 &&
                        match.player2 &&
                        match.player1 !== "G‘OLIB" &&
                        match.player2 !== "G‘OLIB" &&
                        !match.winner &&
                        !match.automatic;

                      return (
                        <div className="sky-match-box" key={match.id}>
                          <div
                            className={`sky-player ${
                              match.winner === match.player1 ? "is-winner" : ""
                            }`}
                          >
                            <span className="p-name">{match.player1 || "Kutilyapti..."}</span>
                            {match.winner === match.player1 && <span className="check-icon">✓</span>}
                          </div>

                          <div className="sky-divider"></div>

                          <div
                            className={`sky-player ${
                              match.winner === match.player2 ? "is-winner" : ""
                            }`}
                          >
                            <span className="p-name">
                              {match.automatic ? "— (Avtomat keyingi bosqichga)" : match.player2 || "Kutilyapti..."}
                            </span>
                            {match.winner === match.player2 && <span className="check-icon">✓</span>}
                          </div>

                          {canPlay && (
                            <button
                              className="play-match-btn"
                              onClick={() =>
                                handleStartMatch(
                                  roundIndex,
                                  matchIndex,
                                  match.player1,
                                  match.player2
                                )
                              }
                            >
                              ⚔️ O‘YINNI BOSHLASH
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MathChempionat;
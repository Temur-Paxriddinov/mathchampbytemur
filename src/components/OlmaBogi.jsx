import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SAMPLE_QUESTIONS } from "./questions.js";
import OlmaBogiGame from "./OlmaBogiGame.jsx";
import "./OlmaBogi.css";

function OlmaBogi() {
  const navigate = useNavigate();

  const [playerText, setPlayerText] = useState("");
  const [timeLimit, setTimeLimit] = useState(15);
  
  const [stage, setStage] = useState("setup");

  const [allPlayers, setAllPlayers] = useState([]);
  const [playersStats, setPlayersStats] = useState({});
  const [revealedCards, setRevealedCards] = useState({});

  const [roundNumber, setRoundNumber] = useState(1);
  const [apples, setApples] = useState([]);
  const [selectedApple, setSelectedApple] = useState(null);
  const [activeBluePlayer, setActiveBluePlayer] = useState(null);
  const [activeGreenPlayer, setActiveGreenPlayer] = useState(null);

  const [activeQuestion, setActiveQuestion] = useState(null);

  const handleCreateTeams = () => {
    const list = playerText
      .split("\n")
      .map((name) => name.trim())
      .filter(Boolean);

    if (list.length < 2) {
      alert("Kamida 2 ta o‘quvchi kiriting!");
      return;
    }

    const shuffledForTeams = [...list].sort(() => Math.random() - 0.5);
    const mid = Math.ceil(shuffledForTeams.length / 2);
    const blue = shuffledForTeams.slice(0, mid);
    const green = shuffledForTeams.slice(mid);

    const initialStats = {};
    const formattedPlayers = shuffledForTeams.map((name, idx) => {
      const isBlue = blue.includes(name);
      initialStats[name] = {
        name,
        score: 0,
        applesCount: 0,
        timesPlayed: 0,
        errors: 0,
        fastestTime: null,
        team: isBlue ? "blue" : "green",
      };
      return {
        id: idx,
        name,
        team: isBlue ? "blue" : "green",
      };
    });

    // Kartalarni RANDOM joylashtirish
    const randomizedGridCards = [...formattedPlayers].sort(() => Math.random() - 0.5);

    setAllPlayers(randomizedGridCards);
    setPlayersStats(initialStats);
    setRevealedCards({});

    const pointsList = [5, 10, 12, 15, 20];
    const generatedApples = Array.from({ length: 30 }, (_, index) => ({
      id: index + 1,
      points: pointsList[index % pointsList.length],
      picked: false,
      pickedByTeam: null,
    }));
    setApples(generatedApples);

    setStage("teams");
  };

  const handleToggleCard = (id) => {
    setRevealedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleStartMatch = () => {
    setStage("playing");
    setRoundNumber(1);
    pickNextDuellists();
  };

  const pickNextDuellists = () => {
    const blueList = Object.values(playersStats).filter((p) => p.team === "blue").map((p) => p.name);
    const greenList = Object.values(playersStats).filter((p) => p.team === "green").map((p) => p.name);

    const randomBlue = blueList[Math.floor(Math.random() * blueList.length)];
    const randomGreen = greenList[Math.floor(Math.random() * greenList.length)];

    setActiveBluePlayer(randomBlue);
    setActiveGreenPlayer(randomGreen);

    setPlayersStats((prev) => ({
      ...prev,
      [randomBlue]: { ...prev[randomBlue], timesPlayed: prev[randomBlue].timesPlayed + 1 },
      [randomGreen]: { ...prev[randomGreen], timesPlayed: prev[randomGreen].timesPlayed + 1 },
    }));
  };

  const handlePickApple = (apple) => {
    if (apple.picked || selectedApple) return;

    setSelectedApple(apple);
    
    // Savolni tanlash va o'rnatish
    const randomQ = SAMPLE_QUESTIONS[Math.floor(Math.random() * SAMPLE_QUESTIONS.length)];
    setActiveQuestion(randomQ);
  };

  const handleGameFinish = (result) => {
    const { winner, winnerTeam, points, fastestTime, p1Error, p2Error } = result;

    setPlayersStats((prev) => {
      const updated = { ...prev };

      if (p1Error) {
        updated[activeBluePlayer] = {
          ...updated[activeBluePlayer],
          errors: updated[activeBluePlayer].errors + 1,
        };
      }

      if (p2Error) {
        updated[activeGreenPlayer] = {
          ...updated[activeGreenPlayer],
          errors: updated[activeGreenPlayer].errors + 1,
        };
      }

      if (winner && winnerTeam) {
        const wStats = updated[winner];
        const newFastest = wStats.fastestTime === null ? fastestTime : Math.min(wStats.fastestTime, fastestTime);

        updated[winner] = {
          ...wStats,
          score: wStats.score + points,
          applesCount: wStats.applesCount + 1,
          fastestTime: newFastest,
        };
      }

      return updated;
    });

    if (winner && winnerTeam && selectedApple) {
      setApples((prev) =>
        prev.map((a) => (a.id === selectedApple.id ? { ...a, picked: true, pickedByTeam: winnerTeam } : a))
      );
    }

    const currentPickedId = selectedApple ? selectedApple.id : null;
    setSelectedApple(null);
    setActiveQuestion(null);

    const remainingApples = apples.filter((a) => !a.picked && a.id !== currentPickedId);
    if (remainingApples.length === 0) {
      setStage("gameover");
    } else {
      setRoundNumber((prev) => prev + 1);
      pickNextDuellists();
    }
  };

  const getTeamScore = (teamName) => {
    return Object.values(playersStats)
      .filter((p) => p.team === teamName)
      .reduce((sum, p) => sum + p.score, 0);
  };

  const getTeamAppleCount = (teamName) => {
    return apples.filter((a) => a.picked && a.pickedByTeam === teamName).length;
  };

  const sortedPlayers = Object.values(playersStats).sort((a, b) => b.score - a.score);

  const validFastestPlayers = sortedPlayers.filter((p) => p.fastestTime !== null);
  const fastestPlayerName = validFastestPlayers.length > 0
    ? validFastestPlayers.reduce((minP, p) => (p.fastestTime < minP.fastestTime ? p : minP), validFastestPlayers[0]).name
    : null;

  if (stage === "setup") {
    return (
      <div className="olma-container">
        <header className="olma-header">
          <button className="back-button" onClick={() => navigate("/8b-menu")}>
            ← 8-B Menuga qaytish
          </button>
          <div className="logo-badge">🍎 OLMA BOG‘I</div>
        </header>

        <div className="setup-wrapper">
          <div className="setup-card-fancy">
            <div className="setup-icon">🌳</div>
            <h2>Turnir Sozlamalari</h2>
            <p className="setup-subtitle">O‘quvchilar ro‘yxatini kiriting va tasodifiy guruhlarga bo‘ling</p>

            <div className="input-group">
              <label>👥 O‘quvchilar Ro‘yxati (Har bir qatorda bitta ism):</label>
              <textarea
                value={playerText}
                onChange={(e) => setPlayerText(e.target.value)}
                placeholder={"Sardor\nTemur\nJavohir\nAli\nVali\nZilola"}
                rows={6}
              />
            </div>

            <div className="input-group">
              <label>⏱️ Savol Vaqti (soniya):</label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                min="5"
                max="60"
              />
            </div>

            <button className="start-fancy-btn" onClick={handleCreateTeams}>
              🎁 SIRLI GURUHLARGA BO‘LISH →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "teams") {
    return (
      <div className="olma-container">
        <header className="olma-header">
          <button className="back-button" onClick={() => setStage("setup")}>
            ← Sozlamalarga qaytish
          </button>
          <div className="logo-badge">❓ SIRLI GURUHLAR</div>
        </header>

        <p className="mystery-instruction">
          🕵️ O‘quvchilar navbat bilan kelib o‘z kartasini ustiga bosadi!
        </p>

        <div className="mystery-cards-grid">
          {allPlayers.map((player) => {
            const isRevealed = revealedCards[player.id];

            return (
              <div
                key={player.id}
                className={`mystery-card ${isRevealed ? `revealed-${player.team}` : "hidden"}`}
                onClick={() => handleToggleCard(player.id)}
              >
                {isRevealed ? (
                  <div className="card-inner-revealed">
                    <span className="team-indicator">
                      {player.team === "blue" ? "🔵 KO‘K GURUH" : "🟢 YASHIL GURUH"}
                    </span>
                    <h2>{player.name}</h2>
                  </div>
                ) : (
                  <div className="card-inner-hidden">
                    <span className="question-mark">❓</span>
                    <span>Kartani Oching</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: "35px" }}>
          <button className="start-match-btn" onClick={handleStartMatch}>
            🎮 O‘yinni Boshlash →
          </button>
        </div>
      </div>
    );
  }

  if (stage === "gameover") {
    const blueScore = getTeamScore("blue");
    const greenScore = getTeamScore("green");
    const winningTeam = blueScore > greenScore ? "🔵 Ko‘k guruh" : greenScore > blueScore ? "🟢 Yashil guruh" : "🤝 Durang";

    const mvpPlayer = sortedPlayers[0];

    return (
      <div className="olma-container">
        <header className="olma-header">
          <h1>🏆 OLMA BOG‘I — NATIJALAR</h1>
          <button className="back-button" onClick={() => navigate("/8b-menu")}>
            ← 8-B Menuga qaytish
          </button>
        </header>

        <div className="game-over-card">
          <h2>🎉 G'olib Guruh: {winningTeam} 🎉</h2>
          <div className="team-final-scores">
            <div className="team-box blue">
              🔵 Ko‘k guruh: {blueScore} ball (🧺 {getTeamAppleCount("blue")} ta olma)
            </div>
            <div className="team-box green">
              🟢 Yashil guruh: {greenScore} ball (🧺 {getTeamAppleCount("green")} ta olma)
            </div>
          </div>

          <h3>🏅 ENG YAXSHI O‘QUVCHILAR</h3>
          <div className="podium">
            {sortedPlayers[1] && (
              <div className="podium-place place-2">
                <span>🥈 2-o‘rin</span>
                <h4>{sortedPlayers[1].name}</h4>
                <p>{sortedPlayers[1].score} ball</p>
              </div>
            )}
            {mvpPlayer && (
              <div className="podium-place place-1">
                <span className="mvp-tag">🔥 MVP</span>
                <h4>{mvpPlayer.name}</h4>
                <p>{mvpPlayer.score} ball</p>
              </div>
            )}
            {sortedPlayers[2] && (
              <div className="podium-place place-3">
                <span>🥉 3-o‘rin</span>
                <h4>{sortedPlayers[2].name}</h4>
                <p>{sortedPlayers[2].score} ball</p>
              </div>
            )}
          </div>

          <h3>📊 BARCHA O‘QUVCHILAR STATISTIKASI</h3>
          <table className="stats-table">
            <thead>
              <tr>
                <th>O‘rin</th>
                <th>Ismi</th>
                <th>Guruh</th>
                <th>Unvon / Tag</th>
                <th>Ball</th>
                <th>To‘plangan olmalar</th>
                <th>Eng tez javob</th>
                <th>Xatoliklar</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((p, idx) => {
                const isMvp = idx === 0;
                const isTatayr = idx === sortedPlayers.length - 1 && sortedPlayers.length > 1;
                const isFastest = p.name === fastestPlayerName;

                return (
                  <tr key={idx} className={isMvp ? "row-mvp" : isTatayr ? "row-tatayr" : ""}>
                    <td>{idx + 1}</td>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.team === "blue" ? "🔵 Ko‘k" : "🟢 Yashil"}</td>
                    <td>
                      {isMvp && <span className="badge-mvp">🔥 MVP</span>}
                      {isFastest && <span className="badge-fastest" style={{ marginLeft: "4px" }}>⚡ FLASH</span>}
                      {isTatayr && <span className="badge-tatayr" style={{ marginLeft: "4px" }}>🥔 TATAYR</span>}
                      {!isMvp && !isFastest && !isTatayr && "—"}
                    </td>
                    <td><strong>{p.score} ball</strong></td>
                    <td>🧺 {p.applesCount} ta</td>
                    <td>{p.fastestTime !== null ? `${p.fastestTime}s` : "—"}</td>
                    <td>{p.errors} ta</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button className="start-fancy-btn" style={{ marginTop: "20px" }} onClick={() => setStage("setup")}>
            🔄 Yangi O‘yin Boshlash
          </button>
        </div>
      </div>
    );
  }

  const p1Stats = playersStats[activeBluePlayer] || {};
  const p2Stats = playersStats[activeGreenPlayer] || {};

  return (
    <div className="olma-container">
      <header className="olma-header">
        <button className="back-button" onClick={() => setStage("setup")}>
          ← Sozlamalar
        </button>

        <div className="team-scores">
          <div className="team-card blue-card">
            <h3>🔵 Ko‘k guruh</h3>
          </div>
          <div className="team-card green-card">
            <h3>🟢 Yashil guruh</h3>
          </div>
        </div>

        <button className="finish-game-btn" onClick={() => setStage("gameover")}>
          🏁 O‘yinni Yakunlash
        </button>
      </header>

      <div className="round-badge-center">
        ⚔️ {roundNumber}-RAUND
      </div>

      <div className="duellists-banner">
        <div className="duellist blue">
          <div className="d-title">🔵 KO‘K GURUH</div>
          <strong>{activeBluePlayer}</strong>
          <div className="p-sub-info">
            <span>⚔️ {p1Stats.timesPlayed}-martasi</span>
            <span>🧺 {p1Stats.applesCount} ta olma ({p1Stats.score} ball)</span>
          </div>
        </div>

        <div className="vs-badge">VS</div>

        <div className="duellist green">
          <div className="d-title">🟢 YASHIL GURUH</div>
          <strong>{activeGreenPlayer}</strong>
          <div className="p-sub-info">
            <span>⚔️ {p2Stats.timesPlayed}-martasi</span>
            <span>🧺 {p2Stats.applesCount} ta olma ({p2Stats.score} ball)</span>
          </div>
        </div>
      </div>

      <p className="pick-instruction">
        👆 <strong>{activeBluePlayer}</strong> va <strong>{activeGreenPlayer}</strong> kelishib bitta olmani tanlang!
      </p>

      {/* 30 TA OLMA STIKERLARI */}
      <div className="apples-grid">
        {apples.map((apple) => (
          <button
            key={apple.id}
            className={`apple-sticker-btn ${apple.picked ? `picked-${apple.pickedByTeam}` : ""}`}
            onClick={() => handlePickApple(apple)}
            disabled={apple.picked || selectedApple !== null}
          >
            <div className="apple-sticker">
              {apple.picked ? "🧺" : "🍎"}
            </div>
            <div className="apple-point-tag">
              {apple.points} ball
            </div>
          </button>
        ))}
      </div>

      {/* SAVOL MODAL OYNASI */}
      {selectedApple && activeQuestion && (
        <OlmaBogiGame
          player1={activeBluePlayer}
          player2={activeGreenPlayer}
          timeLimit={timeLimit}
          points={selectedApple.points}
          question={activeQuestion}
          onFinish={handleGameFinish}
          onCancel={() => {
            setSelectedApple(null);
            setActiveQuestion(null);
          }}
        />
      )}
    </div>
  );
}

export default OlmaBogi;
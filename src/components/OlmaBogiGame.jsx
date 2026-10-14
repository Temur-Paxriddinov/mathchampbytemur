import React, { useState, useEffect } from "react";
import "./OlmaBogi.css";

function OlmaBogiGame({
  player1,
  player2,
  timeLimit,
  points,
  question,
  onFinish,
  onCancel,
}) {
  const [timeLeft, setTimeLeft] = useState(Number(timeLimit) || 15);
  const [startCooldown, setStartCooldown] = useState(3);

  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [correctIndex, setCorrectIndex] = useState(null);

  const [p1State, setP1State] = useState({ answered: false, isCorrect: false, selectedOpt: null, timeSpent: 0 });
  const [p2State, setP2State] = useState({ answered: false, isCorrect: false, selectedOpt: null, timeSpent: 0 });

  const [isShowingResult, setIsShowingResult] = useState(false);

  // Savol yuklanganda variantlarni va to'g'ri javobni bir marta tasodifiy aralashtirish
  useEffect(() => {
    if (!question || !question.options) return;

    const originalCorrectText = question.options[question.correct];
    const shuffled = [...question.options].sort(() => Math.random() - 0.5);
    const newCorrectIdx = shuffled.indexOf(originalCorrectText);

    setShuffledOptions(shuffled);
    setCorrectIndex(newCorrectIdx);
    setTimeLeft(Number(timeLimit) || 15);
    setStartCooldown(3);

    setP1State({ answered: false, isCorrect: false, selectedOpt: null, timeSpent: 0 });
    setP2State({ answered: false, isCorrect: false, selectedOpt: null, timeSpent: 0 });
    setIsShowingResult(false);
  }, [question]);

  // Taymer: 3-2-1
  useEffect(() => {
    if (startCooldown <= 0) return;
    const cdTimer = setInterval(() => {
      setStartCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(cdTimer);
  }, [startCooldown]);

  // Taymer: Savol berilish vaqti
  useEffect(() => {
    if (isShowingResult || startCooldown > 0) return;

    if (timeLeft <= 0) {
      handleRoundFinish(p1State, p2State);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isShowingResult, startCooldown, p1State, p2State]);

  const handleAnswerSelect = (playerNum, optionIndex) => {
    if (isShowingResult || startCooldown > 0) return;

    const isCorrect = optionIndex === correctIndex;
    const timeSpent = Number(timeLimit) - timeLeft;

    let updatedP1 = { ...p1State };
    let updatedP2 = { ...p2State };

    if (playerNum === 1) {
      if (p1State.answered) return;
      updatedP1 = { answered: true, isCorrect, selectedOpt: optionIndex, timeSpent };
      setP1State(updatedP1);
    } else {
      if (p2State.answered) return;
      updatedP2 = { answered: true, isCorrect, selectedOpt: optionIndex, timeSpent };
      setP2State(updatedP2);
    }

    // FAQAT IKKALA O'YINCHI HAM JAVOB BERIB BO'LGANDAGINA NATIJA CHIQARILADI (1-o'yinchi shoshirib yopmaydi)
    if (updatedP1.answered && updatedP2.answered) {
      handleRoundFinish(updatedP1, updatedP2);
    }
  };

  const handleRoundFinish = (p1, p2) => {
    setIsShowingResult(true);

    const p1Ok = p1.answered && p1.isCorrect;
    const p2Ok = p2.answered && p2.isCorrect;

    let winnerName = null;
    let winnerTeam = null;
    let fastestTime = null;

    // Ikkala o'quvchi ham to'g'ri topsa, tezrog'i yutadi
    if (p1Ok && p2Ok) {
      if (p1.timeSpent <= p2.timeSpent) {
        winnerName = player1;
        winnerTeam = "blue";
        fastestTime = p1.timeSpent;
      } else {
        winnerName = player2;
        winnerTeam = "green";
        fastestTime = p2.timeSpent;
      }
    } else if (p1Ok) {
      winnerName = player1;
      winnerTeam = "blue";
      fastestTime = p1.timeSpent;
    } else if (p2Ok) {
      winnerName = player2;
      winnerTeam = "green";
      fastestTime = p2.timeSpent;
    }

    // 1.5 Soniyalik Cooldown (savol va javoblar foni ko'rinib turadi)
    setTimeout(() => {
      onFinish({
        winner: winnerName,
        winnerTeam,
        points: winnerName ? points : 0,
        fastestTime,
        p1Error: p1.answered && !p1Ok,
        p2Error: p2.answered && !p2Ok,
      });
    }, 1500);
  };

  const getOptionClass = (playerState, optionIdx) => {
    if (isShowingResult) {
      if (optionIdx === correctIndex) {
        return "btn-correct"; // To'g'ri javob — Yashil
      }
      if (playerState.selectedOpt === optionIdx && !playerState.isCorrect) {
        return "btn-wrong"; // Xato javob — Qizil
      }
      return "btn-disabled";
    }

    if (playerState.answered) {
      return "btn-disabled";
    }

    return "";
  };

  if (!question) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content large-modal">
        <div className="modal-header">
          <span className="apple-badge">🍎 {points} BALLIK SAVOL</span>
          <div className="timer-badge">
            {isShowingResult
              ? "⏱️ NATIJA..."
              : startCooldown > 0
              ? `⏳ DIQQAT: ${startCooldown}s`
              : `⏱️ VAQT: ${timeLeft}s`}
          </div>
          <button className="cancel-match-btn" onClick={onCancel}>
            ✕ Chiqish
          </button>
        </div>

        <h1 className="large-question-text">{question.question}</h1>

        <div className="large-duel-answers-container">
          {/* KO'K O'YINCHI */}
          <div className={`player-answer-box blue ${p1State.answered || startCooldown > 0 ? "locked" : ""}`}>
            <h3>🔵 {player1}</h3>
            {p1State.answered && (
              <div className="status-badge">
                Javob qabul qilindi ✅
              </div>
            )}
            <div className="options-list">
              {shuffledOptions.map((opt, idx) => (
                <button
                  key={idx}
                  className={getOptionClass(p1State, idx)}
                  disabled={p1State.answered || startCooldown > 0 || isShowingResult}
                  onClick={() => handleAnswerSelect(1, idx)}
                >
                  <span className="opt-num">{["A", "B", "C", "D"][idx]}:</span> {opt}
                </button>
              ))}
            </div>
          </div>

          {/* YASHIL O'YINCHI */}
          <div className={`player-answer-box green ${p2State.answered || startCooldown > 0 ? "locked" : ""}`}>
            <h3>🟢 {player2}</h3>
            {p2State.answered && (
              <div className="status-badge">
                Javob qabul qilindi ✅
              </div>
            )}
            <div className="options-list">
              {shuffledOptions.map((opt, idx) => (
                <button
                  key={idx}
                  className={getOptionClass(p2State, idx)}
                  disabled={p2State.answered || startCooldown > 0 || isShowingResult}
                  onClick={() => handleAnswerSelect(2, idx)}
                >
                  <span className="opt-num">{["A", "B", "C", "D"][idx]}:</span> {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OlmaBogiGame;
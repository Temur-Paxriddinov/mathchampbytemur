import React, { useState, useEffect } from "react";
import "./MathChempionat.css";
import { SAMPLE_QUESTIONS } from "./questions.js";

function MainUclGame({ player1, player2, timeLimit, isFinalMatch, onFinish, onCancel }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(Number(timeLimit) || 10);
  
  // 3 soniyalik cooldown
  const [startCooldown, setStartCooldown] = useState(3);
  
  // O'yinchilarning javob holati
  const [p1State, setP1State] = useState({ answered: false, isCorrect: null, selectedOpt: null, time: null });
  const [p2State, setP2State] = useState({ answered: false, isCorrect: null, selectedOpt: null, time: null });
  
  // Natija va ranglarni ko'rsatish
  const [isShowingResult, setIsShowingResult] = useState(false);
  const [roundResultText, setRoundResultText] = useState(null);
  const [matchWinner, setMatchWinner] = useState(null);

  const loadNewQuestion = () => {
    const randomQ = SAMPLE_QUESTIONS[Math.floor(Math.random() * SAMPLE_QUESTIONS.length)];
    setCurrentQuestion(randomQ);
    setTimeLeft(Number(timeLimit) || 10);
    setStartCooldown(3);
    setP1State({ answered: false, isCorrect: null, selectedOpt: null, time: null });
    setP2State({ answered: false, isCorrect: null, selectedOpt: null, time: null });
    setIsShowingResult(false);
    setRoundResultText(null);
  };

  useEffect(() => {
    loadNewQuestion();
  }, [player1, player2]);

  // 3s Cooldown taymeri
  useEffect(() => {
    if (!currentQuestion || startCooldown <= 0) return;

    const cdTimer = setInterval(() => {
      setStartCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(cdTimer);
  }, [startCooldown, currentQuestion]);

  // Asosiy taymer
  useEffect(() => {
    if (matchWinner || isShowingResult || startCooldown > 0 || !currentQuestion) return;

    if (timeLeft <= 0) {
      checkRoundOutcome(p1State, p2State);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, matchWinner, isShowingResult, startCooldown, currentQuestion, p1State, p2State]);

  const handleAnswerSelect = (playerNum, optionIndex) => {
    if (matchWinner || isShowingResult || startCooldown > 0) return;

    const isCorrect = optionIndex === currentQuestion.correct;
    const clickTime = Date.now();

    let updatedP1 = { ...p1State };
    let updatedP2 = { ...p2State };

    if (playerNum === 1) {
      if (p1State.answered) return;
      updatedP1 = { answered: true, isCorrect, selectedOpt: optionIndex, time: clickTime };
      setP1State(updatedP1);
    } else {
      if (p2State.answered) return;
      updatedP2 = { answered: true, isCorrect, selectedOpt: optionIndex, time: clickTime };
      setP2State(updatedP2);
    }

    if (playerNum === 1 && updatedP2.answered) {
      checkRoundOutcome(updatedP1, updatedP2);
    } else if (playerNum === 2 && updatedP1.answered) {
      checkRoundOutcome(updatedP1, updatedP2);
    }
  };

  const checkRoundOutcome = (p1, p2) => {
    setIsShowingResult(true);

    const p1Ok = p1.answered && p1.isCorrect;
    const p2Ok = p2.answered && p2.isCorrect;

    setTimeout(() => {
      if (p1Ok && p2Ok) {
        if (p1.time <= p2.time) {
          finishMatch(player1, `${player1} tezroq to‘g‘ri javob berib, keyingi bosqichga o‘tdi! ⚡`);
        } else {
          finishMatch(player2, `${player2} tezroq to‘g‘ri javob berib, keyingi bosqichga o‘tdi! ⚡`);
        }
      } else if (p1Ok && !p2Ok) {
        finishMatch(player1, `${player1} to‘g‘ri javob berdi va keyingi bosqichga o‘tdi! 🎯`);
      } else if (!p1Ok && p2Ok) {
        finishMatch(player2, `${player2} to‘g‘ri javob berdi va keyingi bosqichga o‘tdi! 🎯`);
      } else {
        setRoundResultText("Ikkala javob ham noto'g'ri! 🔄 Yangi savol berilmoqda...");
        setTimeout(() => {
          loadNewQuestion();
        }, 1500);
      }
    }, 1500);
  };

  const finishMatch = (winnerName, reasonText) => {
    setRoundResultText(reasonText);
    setMatchWinner(winnerName);
    setTimeout(() => {
      onFinish(winnerName);
    }, 2200);
  };

  const getOptionClass = (playerState, optionIdx) => {
    if (!isShowingResult) return "";

    if (optionIdx === currentQuestion.correct) {
      return "correct-option";
    }

    if (playerState.selectedOpt === optionIdx && !playerState.isCorrect) {
      return "wrong-option";
    }

    return "";
  };

  if (!currentQuestion) return null;

  return (
    <div className="match-arena-page">
      <div className="arena-header">
        <div className="timer-badge">
          {startCooldown > 0 ? `⏳ DIQQAT: ${startCooldown}s` : `⏱️ VAQT: ${timeLeft}s`}
        </div>
        <div className="question-box">
          {isFinalMatch && <div className="final-tag">🔥 CHAMPIONS LEAGUE FINAL 🔥</div>}
          <h2>{currentQuestion.question}</h2>
        </div>
        <button className="cancel-match-btn" onClick={onCancel}>
          ✕ Chiqish
        </button>
      </div>

      {startCooldown > 0 && (
        <div className="cooldown-banner">
          <h3>Savol bilan tanishib o‘ling! Tugmalar {startCooldown}s dan so‘ng aktivlashadi...</h3>
        </div>
      )}

      {/* G'OLIB VA BOSQICHGA O'TISH HAQIDA ORTADA SHIRIN BANNER */}
      {roundResultText && (
        <div className="ucl-victory-banner-center">
          <div className="ucl-star-badge">UEFA MATCH RESULT</div>
          <h3>{roundResultText}</h3>
        </div>
      )}

      {matchWinner ? (
        <div className="winner-overlay">
          <div className="ucl-winner-box">
            <span className="ucl-mini-title">MATCH WINNER</span>
            <h1>🏆 {matchWinner}</h1>
            <p>{isFinalMatch ? "CHEMPION BO‘LDI! 🎉" : "Keyingi bosqichga muvaffaqiyatli o‘tdi ✨"}</p>
          </div>
        </div>
      ) : (
        <div className="split-screen-container">
          
          {/* CHAP TARAF: 1-O'YINCHI */}
          <div className={`player-side side-left ${p1State.answered || startCooldown > 0 ? "locked" : ""}`}>
            <div className="player-card-header">
              <span>PLAYER 1</span>
              <h3>{player1}</h3>
              {p1State.answered && !isShowingResult && (
                <div className="status-badge">Javob qabul qilindi ✅</div>
              )}
            </div>

            <div className="options-grid">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`option-btn ${getOptionClass(p1State, idx)}`}
                  disabled={p1State.answered || startCooldown > 0 || isShowingResult}
                  onClick={() => handleAnswerSelect(1, idx)}
                >
                  <span className="opt-letter">{["A", "B", "C", "D"][idx]}:</span> {opt}
                </button>
              ))}
            </div>
          </div>

          {/* O'NG TARAF: 2-O'YINCHI */}
          <div className={`player-side side-right ${p2State.answered || startCooldown > 0 ? "locked" : ""}`}>
            <div className="player-card-header">
              <span>PLAYER 2</span>
              <h3>{player2}</h3>
              {p2State.answered && !isShowingResult && (
                <div className="status-badge">Javob qabul qilindi ✅</div>
              )}
            </div>

            <div className="options-grid">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`option-btn ${getOptionClass(p2State, idx)}`}
                  disabled={p2State.answered || startCooldown > 0 || isShowingResult}
                  onClick={() => handleAnswerSelect(2, idx)}
                >
                  <span className="opt-letter">{["A", "B", "C", "D"][idx]}:</span> {opt}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default MainUclGame;
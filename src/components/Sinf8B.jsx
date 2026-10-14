import React from "react";
import { useNavigate } from "react-router-dom";
import "./MainMenu.css";

function Sinf8B() {
  const navigate = useNavigate();

  return (
    <div className="main-menu">
      <header className="main-header">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Asosiy menyuga qaytish
        </button>

        <div className="logo">
          8-B<span> SINF</span>
        </div>

        <div className="header-title">
          8-B SINF O‘YINLARI
        </div>
      </header>

      <main className="main-content">
        <h1>O‘yin rejimini tanlang</h1>

        <p className="main-description">
          8-B sinfi uchun mo‘ljallangan matematika o‘yinlaridan birini tanlang va o‘yinni boshlang!
        </p>

        <div className="game-list">

          {/* CHEMPIONAT O'YINI */}
          <div className="game-card championship">
            <div className="game-icon">
              🏆
            </div>

            <div className="game-card-content">
              <h2>Chempionat</h2>

              <p>
                O‘quvchilar tasodifiy tarzda juftliklarga
                bo‘linadi va savollarga javob berib,
                finalgacha kurashadi.
              </p>

              <button onClick={() => navigate("/chempionat")}>
                Chempionatni boshlash →
              </button>
            </div>
          </div>

          {/* OLMA BOG'I O'YINI (AKTIV) */}
          <div className="game-card championship">
            <div className="game-icon">
              🍎
            </div>

            <div className="game-card-content">
              <h2>Olma bog‘i</h2>

              <p>
                O‘quvchilar 2 guruhga bo‘linib, 30 ta olmali bog‘dan
                ball yig‘ish bo‘yicha bellashadilar.
              </p>

              <button onClick={() => navigate("/olma-bogi")}>
                Olma bog‘iga kirish →
              </button>
            </div>
          </div>

        </div>

        {/* ASOSIY MENYUGA QAYTISH TUGMASI (PASTDAGI) */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button className="back-to-main-btn" onClick={() => navigate("/")}>
            🏠 Asosiy Menyuga Qaytish
          </button>
        </div>
      </main>

      <footer>
        <div>© 2026 MathChamp • 8-B Sinf</div>
        <div className="creator">by P.Temur</div>
      </footer>
    </div>
  );
}

export default Sinf8B;
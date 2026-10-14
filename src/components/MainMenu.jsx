import "./MainMenu.css";

function MainMenu() {
  return (
    <div className="main-menu">
      <header className="main-header">
        <div className="logo">
          Math<span>Champ</span>
        </div>

        <div className="header-title">
          MATEMATIKA O‘YINLARI PLATFORMASI
        </div>
      </header>

      <main className="main-content">
        <h1>Sinfni tanlang</h1>

        <p className="main-description">
          Matematika darslarida o‘yinlar o‘tkazish uchun kerakli sinfni tanlang
        </p>

        <div className="game-list">

          {/* 8-B SINF (AKTIV) */}
          <div className="game-card championship">
            <div className="game-icon">
              🏫
            </div>

            <div className="game-card-content">
              <h2>8-B Sinf</h2>

              <p>
                8-B sinf o‘quvchilari uchun maxsus matematika
                o‘yinlari va chempionatlari bo‘limi.
              </p>

              <button onClick={() => window.location.href = "/8b-menu"}>
                Sinfga kirish →
              </button>
            </div>
          </div>

          {/* BOSHQA SINF (TEZ ORADA) */}
          <div className="game-card disabled">
            <div className="game-icon">
              📚
            </div>

            <div className="game-card-content">
              <h2>Boshqa sinflar</h2>

              <p>
                Yangi sinflar va o‘quv guruhlari tez orada qo‘shiladi.
              </p>

              <button disabled>
                Tez orada
              </button>
            </div>
          </div>

        </div>
      </main>

      <footer>
        <div>© 2026 MathChamp</div>
        <div className="creator">by P.Temur</div>
      </footer>

    </div>
  );
}

export default MainMenu;
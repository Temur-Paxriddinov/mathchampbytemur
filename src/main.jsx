import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainMenu from './components/MainMenu';
import Sinf8B from './components/Sinf8B'; // <-- Yangi komponent nomi
import MathChempionat from './components/MathChempionat';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/8b-menu" element={<Sinf8B />} />
        <Route path="/chempionat" element={<MathChempionat />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
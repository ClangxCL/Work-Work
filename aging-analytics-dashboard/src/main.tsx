import React from 'react';
import ReactDOM from 'react-dom/client';

// Fontsource: Inter (Latin & Numbers: 400, 500, 600)
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';

// Fontsource: Noto Sans Thai (Thai: 400, 500, 600)
import '@fontsource/noto-sans-thai/400.css';
import '@fontsource/noto-sans-thai/500.css';
import '@fontsource/noto-sans-thai/600.css';

// Fontsource: Source Serif 4 (Latin & Numbers Serif: 400, 600)
import '@fontsource/source-serif-4/400.css';
import '@fontsource/source-serif-4/600.css';

// Fontsource: Noto Serif Thai (Thai Serif: 400, 600)
import '@fontsource/noto-serif-thai/400.css';
import '@fontsource/noto-serif-thai/600.css';

import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

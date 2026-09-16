import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Safely handle any development-only HMR WebSocket connection anomalies
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = String(reason?.message || reason || '').toLowerCase();
    if (msg.includes('websocket closed without opened') || (msg.includes('vite') && msg.includes('websocket'))) {
      event.preventDefault();
      console.warn('[internhub] Safely handled development WebSocket connection event.');
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

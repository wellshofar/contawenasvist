
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { setupDatabase } from './utils/database';

// Run database setup when the app starts
setupDatabase().catch(console.error);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

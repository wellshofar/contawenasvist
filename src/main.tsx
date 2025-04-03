
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { runMigrations } from './utils/migrations';

// Run migrations when the app starts
runMigrations().catch(console.error);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

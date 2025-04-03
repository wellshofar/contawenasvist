
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { setupDatabase } from './utils/database';
import { runMigrations } from './utils/migrations';

// Run database setup and migrations when the app starts
Promise.all([
  setupDatabase(),
  runMigrations()
])
.catch(console.error)
.finally(() => {
  console.log('App initialization complete');
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

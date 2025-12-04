import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = '<div style="color: red; padding: 20px;">Error: Could not find root element.</div>';
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Application failed to mount:", error);
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h2 style="color: #ef4444;">Application Error</h2>
      <p style="color: #374151;">Failed to load the application.</p>
      <pre style="background: #f3f4f6; padding: 10px; border-radius: 4px; overflow: auto; color: #dc2626;">${error instanceof Error ? error.message : String(error)}</pre>
    </div>
  `;
}
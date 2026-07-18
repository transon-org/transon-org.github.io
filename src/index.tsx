import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

declare global {
  function transform(template: string, value: string): string;
  function init(data: string): void;
}

globalThis.init = (data) => {
  // D-20 envelope from public/script.py: {docs, reference, readme}.
  const payload = JSON.parse(data);
  const container = document.getElementById('root') as HTMLElement;
  // Drop the static pre-load intro (see public/index.html) before mounting so
  // React starts from an empty container and doesn't duplicate the header.
  container.innerHTML = '';
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App docs={payload.docs} reference={payload.reference} readme={payload.readme}/>
    </React.StrictMode>
  );
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { site } from './content/site';
import './styles.css';

document.title = site.title;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

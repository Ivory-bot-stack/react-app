import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
// Sin StrictMode: los efectos de DOM (observers) se registran una sola vez
createRoot(document.getElementById('root')).render(<App />);

import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import { EventProvider } from './providers/EventProvider.js';
import { LocaleProvider } from '@adsk/alloy-react-locale';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <LocaleProvider>
      <EventProvider>
        <App />
      </EventProvider>
    </LocaleProvider>
);


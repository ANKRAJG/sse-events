import './App.css';
import EventComponent from './EventComponent.js';
import { LocaleProvider } from '@adsk/alloy-react-locale';

function App() {
  return (
    <LocaleProvider>
      <EventComponent />
    </LocaleProvider>
  );
}

export default App;

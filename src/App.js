import './App.css';
import EventComponent from './components/EventComponent.js';
import { LocaleProvider } from '@adsk/alloy-react-locale';
import InputComponent from './components/InputComponent.js';
import { EventProvider } from './providers/EventProvider.js';


const App = () => {
  return (
    <LocaleProvider>
      <EventProvider>
        <div className="app-container">
          <EventComponent />
          <InputComponent />
        </div>
      </EventProvider>
    </LocaleProvider>
  );
};

export default App;

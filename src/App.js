import './App.css';
import EventComponent from './components/EventComponent.js';
import InputComponent from './components/InputComponent.js';
import QuestionComponent from './components/QuestionComponent.js';
import { useEventProvider } from './providers/EventProvider.js';


const App = () => {
  const { question } = useEventProvider();

  return (
    <div className="app-container">
      {question && <QuestionComponent /> }
      <EventComponent />
      <InputComponent />
    </div>
  );
};

export default App;

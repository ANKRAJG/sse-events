import { useEventProvider } from "../providers/EventProvider.js";

const QuestionComponent = () => {
    const { question } = useEventProvider();

    return (
        <div className="question-container">
            <div className="question-inner">
                <b>Question: </b>
                <span>{question}</span>
            </div>
        </div>
    );
};

export default QuestionComponent;
import Textarea from "@adsk/alloy-react-textarea";
import { useState } from "react";
import { useEventProvider } from "../providers/EventProvider.js";

const InputComponent = () => {
    // States
    const [inputText, setInputText] = useState(''); 
    // Hooks
    const { question, getEventsData } = useEventProvider();

    const onQuestionSubmit = (event) => {
        event.stopPropagation();
        if (event.key === 'Enter' && !(event.metaKey || event.ctrlKey || event.shiftKey)) {
            getEventsData(inputText);
            event.target.blur();
            setInputText('');
        }
    };

    return (
        <div className={`input-container ${question ? '' : 'without-question'}`}>
            <Textarea
                value={inputText}
                autoFocus={!inputText}
                // disabled={disabled}
                minHeight={100}
                placeholder="Ask your question here..."
                showCount
                showCountThreshold={0}
                maxLength={500}
                className="input-text-area"
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={onQuestionSubmit}
            />
        </div>
    )
};

export default InputComponent;
import React, { useEffect, useState } from 'react';

const EventComponent = () => {
    const [message, setMessage] = useState();

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:3000/events');

        if(typeof (eventSource) !== 'undefined') {
            console.log('successful!');
        } else {
            console.log('no response!');
        }

        eventSource.onmessage = event => {
            const eventData = JSON.parse(event.data);
            const newMessage = `${message} ${eventData.message}`;
            setMessage(newMessage);
        }

        return () => eventSource.close();
    }, [message]);

  return (
    <div>{message}</div>
  );
};

export default EventComponent;
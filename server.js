const express = require('express');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: 'http://localhost:3001'
};

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

app.get('/events', cors(corsOptions), (req, res) => {
    // res.send();
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    // send SSE every second
    setInterval(() => {
        const len = Math.floor((Math.random() * 10) + 1);
        console.log('len = ', len);
        const data = {message: `${generateString(len)}`};
        console.log('sent = ', data);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }, 50);
});

app.listen(3000, () => console.log('Server is listening on port 3000'));
import express from 'express';
import https from 'https';
import fs from 'fs';
import { getProductData, getUserData, sendProductStreams, sendRFIsStreams } from './common-server.js';

var usersCallCount = 0, productsCallCount = 0;
const app = express();
const corsOptions = {
    key: fs.readFileSync('cert/server.key'),
    cert: fs.readFileSync('cert/server.cert'),
    origin: 'http://localhost:3001'
};

app.get('/events/rfis', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    sendRFIsStreams(res, usersCallCount, productsCallCount, req);
});

app.get('/events/products', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    sendProductStreams(res, usersCallCount, productsCallCount, req);
});

app.get('/getUsers', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    const userSkip = req.query?.skip;
    const limit = req.query?.limit;
    usersCallCount = Number(req.query?.usercount);
    getUserData(userSkip, limit).then(data => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
        res.end(); // Ensure the connection is closed
    });
}); 

app.get('/getProducts', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    const productSkip = req.query?.skip;
    const limit = req.query?.limit;
    productsCallCount = Number(req.query?.productcount);
    getProductData(productSkip, limit).then(data => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
        res.end(); // Ensure the connection is closed
    });
});

// Create HTTPS server
const httpsServer = https.createServer(corsOptions, app);

// Listen on port 3000 for HTTPS
httpsServer.listen(3000, () => {
    console.log('HTTPS Server running on port 3000');
});
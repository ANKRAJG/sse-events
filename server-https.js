import express from 'express';
import https from 'https';
import fs from 'fs';
import { getProductData, getUserData, sendHttpResponse, sendProductStreams, sendRFIsStreams, streamingResponseHeaders } from './common-server-functions.js';

var usersCallCount = 0, productsCallCount = 0;
const app = express();
const corsOptions = {
    key: fs.readFileSync('cert/server.key'),
    cert: fs.readFileSync('cert/server.cert'),
    origin: 'http://localhost:3001'
};

app.get('/events/rfis', (req, res) => {
    streamingResponseHeaders(res);
    sendRFIsStreams(res, usersCallCount, productsCallCount, req);
});

app.get('/events/products', (req, res) => {
    streamingResponseHeaders(res);
    sendProductStreams(res, usersCallCount, productsCallCount, req);
});

app.get('/getUsers', (req, res) => {
    usersCallCount = Number(req.query?.usercount);
    sendHttpResponse(req, res, getUserData);
}); 

app.get('/getProducts', (req, res) => {
    productsCallCount = Number(req.query?.productcount);
    sendHttpResponse(req, res, getProductData);
});

// Create HTTPS server
const httpsServer = https.createServer(corsOptions, app);

// Listen on port 3000 for HTTPS
httpsServer.listen(3000, () => {
    console.log('HTTPS Server running on port 3000');
});
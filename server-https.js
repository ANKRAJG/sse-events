import express from 'express';
import https from 'https';
import fs from 'fs';
import { 
    getProductData, 
    getSubmittalData, 
    getRFIData, 
    sendHttpResponse, 
    sendProductStreams, 
    sendRFIsStreams, 
    sendSubmittalStreams, 
    streamingResponseHeaders 
} from './backend/common-server-functions.js';
import { INITIAL_CALL_NUMBER } from './backend/helpers.js';

var usersCallCount = 0, submittalsCallCount = 0, productsCallCount = 0;
const app = express();
const corsOptions = {
    key: fs.readFileSync('cert/server.key'),
    cert: fs.readFileSync('cert/server.cert'),
    origin: 'http://localhost:3001'
};

// Streaming APIs
app.get('/events/rfis', (req, res) => {
    streamingResponseHeaders(res);
    const canCall = usersCallCount===INITIAL_CALL_NUMBER && submittalsCallCount===INITIAL_CALL_NUMBER && productsCallCount===INITIAL_CALL_NUMBER;
    sendRFIsStreams(res, canCall, req);
});

app.get('/events/submittals', (req, res) => {
    streamingResponseHeaders(res);
    const canCall = usersCallCount===INITIAL_CALL_NUMBER && submittalsCallCount===INITIAL_CALL_NUMBER && productsCallCount===INITIAL_CALL_NUMBER;
    sendSubmittalStreams(res, canCall, req);
});

app.get('/events/products', (req, res) => {
    streamingResponseHeaders(res);
    const canCall = usersCallCount===INITIAL_CALL_NUMBER && submittalsCallCount===INITIAL_CALL_NUMBER && productsCallCount===INITIAL_CALL_NUMBER;
    sendProductStreams(res, canCall, req);
});


// REST APIs
app.get('/rfis', (req, res) => {
    usersCallCount = Number(req.query?.usercount);
    sendHttpResponse(req, res, getRFIData);
}); 

app.get('/submittals', (req, res) => {
    submittalsCallCount = Number(req.query?.submittalcount);
    sendHttpResponse(req, res, getSubmittalData);
});

app.get('/products', (req, res) => {
    productsCallCount = Number(req.query?.productcount);
    sendHttpResponse(req, res, getProductData);
});

// Create HTTPS server
const httpsServer = https.createServer(corsOptions, app);

// Listen on port 3000 for HTTPS
httpsServer.listen(3000, () => {
    console.log('HTTPS Server running on port 3000');
});
import express from 'express';
import http2 from 'http2';
import https from 'https';
import fs from 'fs';
import { getProductData, getSubmittalData, getRFIData, sendHttpResponse, sendProductStreams, sendRFIsStreams, sendSubmittalStreams } from './backend/common-server-functions.js';
import { INITIAL_CALL_NUMBER } from './backend/helpers.js';

var usersCallCount = 0, submittalsCallCount = 0, productsCallCount = 0;
const app = express();
const corsOptions = {
    key: fs.readFileSync('cert/server.key'),
    cert: fs.readFileSync('cert/server.cert'),
    origin: 'http://localhost:3001'
};

// HTTP/2 Protocol Connection for SSE
const http2Server = http2.createSecureServer(corsOptions);
http2Server.on('stream', (stream, headers) => {
    stream.respond({
        ':status': 200,
        'content-type': 'text/event-stream',
    });

    const canCall = usersCallCount===INITIAL_CALL_NUMBER && submittalsCallCount===INITIAL_CALL_NUMBER && productsCallCount===INITIAL_CALL_NUMBER;

    if (headers[':path'] === '/events/rfis') {
        sendRFIsStreams(stream, canCall);
    }

    if (headers[':path'] === '/events/submittals') {
        sendSubmittalStreams(stream, canCall);
    }

    if (headers[':path'] === '/events/products') {
        sendProductStreams(stream, canCall);
    }
});

// Normal HTTPS REST APIs
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

// Listen on port 3002 for HTTP/2 for Streaming
http2Server.listen(3002, () => {
    console.log('HTTP/2 Server running on port 3002');
});
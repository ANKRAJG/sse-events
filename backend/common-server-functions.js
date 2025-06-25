import { rfi_data } from './data.js';
import { 
    getProductsLimitedFields, 
    firstPara, 
    secondPara, 
    getAALimitedFields, 
    broadcastStreams, 
    FIXED_STREAM_TIME,
    getTableHeaders 
} from './helpers.js';

// Constants
const EXTRA_TIME = 1000; // In milliseconds
const INITIAL_CALL_NUMBER = 0;
// Paragraphs
var usersPara = [], productsPara = [];
// AA Related Data
var total_rfi_limited_data = getAALimitedFields(rfi_data.results);
// Variables for users
var usersLimited = [], userHeaders = [], totalUserRecords = 0;
// Variables for products
var productsLimited = [], productHeaders = [], totalProductRecords = 0;
// Common Var for Para1 Adder
var para1Adder = 0;

const sendUserJsonProgressively = (users, total) => {
    //usersLimited = getUsersLimitedFields(users);
    usersLimited = users;
    userHeaders = getTableHeaders(usersLimited);
    totalUserRecords = total;
    usersPara = firstPara;
    productsPara = secondPara;
}

const sendProductJsonProgressively = (products, total) => {
    productsLimited = getProductsLimitedFields(products);
    productHeaders = getTableHeaders(productsLimited);
    totalProductRecords = total;
}

export const streamingResponseHeaders = (res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
}

// Function to send RFI data related streams
export const sendRFIsStreams = (stream, usersCallCount, productsCallCount, req) => {
    const reqStream = req ?? stream;
    const canCall = (usersCallCount===INITIAL_CALL_NUMBER && productsCallCount===INITIAL_CALL_NUMBER);

    // RFIs Para
    if(canCall) broadcastStreams(stream, usersPara, 'para1', 0);

    para1Adder = canCall ? firstPara.length : 0;
    // RFIs Table Headers
    if(canCall) broadcastStreams(stream, userHeaders, 'userHeader', para1Adder);

    // RFIs Table data events row by row
    const iteratorAdder1 = para1Adder + userHeaders.length;
    broadcastStreams(stream, usersLimited, 'user', iteratorAdder1);

    // RFIs Table total records
    if(canCall) {
        setTimeout(() => {
            const data1 = { totalUserRecords };
            stream.write(`data: ${JSON.stringify(data1)}\n\n`);
        }, FIXED_STREAM_TIME * (para1Adder + userHeaders.length));
    }

    // Handle client disconnection
    reqStream.on('close', () => {
        console.log('Client disconnected. Cleaning up...');
        stream.end(); // Ensure the connection is closed
    });
};

// Function to send Product data related streams
export const sendProductStreams = (stream, usersCallCount, productsCallCount, req) => {
    const reqStream = req ?? stream;
    const canCall = (usersCallCount===INITIAL_CALL_NUMBER && productsCallCount===INITIAL_CALL_NUMBER);
    const userAdder = canCall ? (para1Adder + userHeaders.length + usersLimited.length) : 0;

    // Products
    // Products Para
    if(canCall) broadcastStreams(stream, productsPara, 'para2', userAdder, EXTRA_TIME);

    const para2Adder = canCall ? (userAdder + secondPara.length) : 0;
    // Products Table Headers
    if(canCall) broadcastStreams(stream, productHeaders, 'productHeader', para2Adder, EXTRA_TIME);

    // Products Table data events row by row
    const iteratorAdder2 = para2Adder + productHeaders.length;
    broadcastStreams(stream, productsLimited, 'product', iteratorAdder2, EXTRA_TIME);

    // Products Table total records
    if(canCall) {
        setTimeout(() => {
            const data2 = { totalProductRecords };
            stream.write(`data: ${JSON.stringify(data2)}\n\n`);
        }, (FIXED_STREAM_TIME * (para2Adder + productHeaders.length)) + EXTRA_TIME);
    }

    // Handle client disconnection
    reqStream.on('close', () => {
        console.log('Client disconnected. Cleaning up...');
        stream.end(); // Ensure the connection is closed
    });
};

// Function to simulate fetching user data
export const getUserData = async (skip = 0, limit = 10) => {
    const res = await fetch(`https://dummyjson.com/users?skip=${skip}&limit=${limit}`);
    const data = await res.json();
    const filtered_res = total_rfi_limited_data.slice(Number(skip), Number(skip) + Number(limit));
    sendUserJsonProgressively(filtered_res, total_rfi_limited_data.length);
    //sendUserJsonProgressively(data.users, data.total);
    return data;
}; 

// Function to simulate fetching product data
export const getProductData = async (skip = 0, limit = 10) => {
    const res = await fetch(`https://dummyjson.com/products?skip=${skip}&limit=${limit}`);
    const data = await res.json();
    sendProductJsonProgressively(data.products, data.total);
    return data;
}; 

export const sendHttpResponse = (req, res, fn) => {
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    const skip = req.query?.skip;
    const limit = req.query?.limit;
    fn(skip, limit).then(data => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
        res.end();
    });
};
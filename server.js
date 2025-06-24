import express from 'express';
import cors from 'cors';
import { getProductsLimitedFields, firstPara, secondPara, getAALimitedFields } from './helpers.js';
const app = express();
import { rfi_data } from './data.js';

const corsOptions = {
    origin: 'http://localhost:3001'
};

// Common variables
var streamTime = 50; // in milliseconds

// Paras
var usersPara = [];
var productsPara = [];

// AA Related Data
var total_rfi_limited_data = getAALimitedFields(rfi_data.results);

// Variables for users
var usersCallCount = 0;
var usersLimited = [];
var userHeaders = [];
var totalUserRecords = 0;

// Variables for products
var productsCallCount = 0;
var productsLimited = [];
var productHeaders = [];
var totalProductRecords = 0;

var para1Multiplier = 0;


const getTableHeaders = (data) => {
    return data[0] ? Object.keys(data[0]) : [];
};

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

app.get('/events/rfis', cors(corsOptions), (req, res) => {
    // res.send();
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    let paraTimer1;
    let userTimer1, userTimer2, userTimer3;
    const canCall = (usersCallCount===1 && productsCallCount===1);

    // Users
    usersPara.forEach((item, i) => {
        // send SSE every 50ms
        paraTimer1 = setTimeout(() => {
            const paraUser = { para1: item };
            //console.log('paraUser = ', paraUser);
            if(canCall) {
                res.write(`data: ${JSON.stringify(paraUser)}\n\n`);
            }
        }, streamTime * i);
    });

    para1Multiplier = canCall ? firstPara.length : 0;

    userHeaders.forEach((userHeader, i) => {
        // send SSE every 50ms
        userTimer1 = setTimeout(() => {
            const data1 = { userHeader };
            //console.log('data1 = ', data1);
            if(canCall) {
                res.write(`data: ${JSON.stringify(data1)}\n\n`);
            }
        }, streamTime * (para1Multiplier + i));
    });

    usersLimited.forEach((user, index) => {
        // send SSE every 50ms
        userTimer2 = setTimeout(() => {
            const data2 = { user };
            //console.log('data2 = ', data2);
            res.write(`data: ${JSON.stringify(data2)}\n\n`);
        }, streamTime * (para1Multiplier + index+userHeaders.length));
    });

    userTimer3 = setTimeout(() => {
            const data3 = { totalUserRecords };
            //console.log('data3 = ', data3);
            res.write(`data: ${JSON.stringify(data3)}\n\n`);
    }, streamTime * (para1Multiplier + userHeaders.length));

    // Handle client disconnection
    req.on('close', () => {
        console.log('Client disconnected. Cleaning up...');
        const timerArray = [paraTimer1, userTimer1, userTimer2, userTimer3];
        // Clear all timers to prevent memory leaks
        timerArray.forEach(timer => {
            if (timer) clearTimeout(timer);
        });
        res.end(); // Ensure the connection is closed
    });
});

app.get('/events/products', cors(corsOptions), (req, res) => {
        // res.send();
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    let paraTimer2;
    let productTimer1, productTimer2, productTimer3;
    const canCall = (usersCallCount===1 && productsCallCount===1);

    const userMultiplier = canCall ? (para1Multiplier + userHeaders.length + usersLimited.length) : 0;

    // Products

    productsPara.forEach((item, i) => {
        // send SSE every 50ms
        paraTimer2 = setTimeout(() => {
            const paraProduct = { para2: item };
            //console.log('paraProduct = ', paraProduct);
            if(canCall) {
                res.write(`data: ${JSON.stringify(paraProduct)}\n\n`);
            }
        }, streamTime * (userMultiplier + i));
    });

    const para2Multiplier = canCall ? (userMultiplier + secondPara.length) : 0;

    productHeaders.forEach((productHeader, i) => {
        // send SSE every 50ms
        productTimer1 = setTimeout(() => {
            const pData1 = { productHeader };
            //console.log('pData1 = ', pData1);
            if(canCall) {
                res.write(`data: ${JSON.stringify(pData1)}\n\n`);
            }
        }, streamTime * (i + para2Multiplier));
    });


    productsLimited.forEach((product, index) => {
        // send SSE every 50ms
        productTimer2 = setTimeout(() => {
            const pData2 = { product };
            //console.log('pData2 = ', pData2);
            res.write(`data: ${JSON.stringify(pData2)}\n\n`);
        }, streamTime * (index + productHeaders.length + para2Multiplier));
    });

    productTimer3 = setTimeout(() => {
            const pData3 = { totalProductRecords };
            //console.log('pData3 = ', pData3);
            res.write(`data: ${JSON.stringify(pData3)}\n\n`);
    }, streamTime * (productHeaders.length + para2Multiplier));

    // Handle client disconnection
    req.on('close', () => {
        console.log('Client disconnected. Cleaning up...');
        const timerArray = [paraTimer2, productTimer1, productTimer2, productTimer3];
        // Clear all timers to prevent memory leaks
        timerArray.forEach(timer => {
            if (timer) clearTimeout(timer);
        });
        res.end(); // Ensure the connection is closed
    });
});

// Function to simulate fetching user data
const getUserData = async (skip = 0, limit = 10) => {
    const res = await fetch(`https://dummyjson.com/users?skip=${skip}&limit=${limit}`);
    const data = await res.json();
    const filtered_res = total_rfi_limited_data.slice(Number(skip), Number(skip) + Number(limit));
    sendUserJsonProgressively(filtered_res, total_rfi_limited_data.length);
    //sendUserJsonProgressively(data.users, data.total);
    return data;
}; 

// Function to simulate fetching product data
const getProductData = async (skip = 0, limit = 10) => {
    const res = await fetch(`https://dummyjson.com/products?skip=${skip}&limit=${limit}`);
    const data = await res.json();
    sendProductJsonProgressively(data.products, data.total);
    return data;
}; 

app.get('/getUsers', cors(corsOptions), (req, res) => {
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
    });
}); 

app.get('/getProducts', cors(corsOptions), (req, res) => {
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
    });
});

// Call the users API in the startup

//getUserData();

app.listen(3000, () => console.log('Server is listening on port 3000'));
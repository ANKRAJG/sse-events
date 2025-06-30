import { issues_data, issues_para } from './data/issues_data.js';
import { rfiPara, rfi_data } from './data/rfi_data.js';
import { submittalPara, submittals_data } from './data/submittals_data.js';
import { 
    getProductsLimitedFields, 
    schedulesPara, 
    getRFILimitedFields, 
    broadcastStreams, 
    FIXED_STREAM_TIME,
    getTableHeaders, 
    getSubmittalLimitedFields,
    getIssuesLimitedFields
} from './helpers.js';

// Constants
const EXTRA_TIME = 500; // In milliseconds
// Paragraphs
// AA Related Data
var total_rfi_limited_data = getRFILimitedFields(rfi_data.results);
var total_submittal_limited_data = getSubmittalLimitedFields(submittals_data.results);
var total_issues_limited_data = getIssuesLimitedFields(issues_data.results);
// Variables for RFIs
var rfisLimited = [], rfiHeaders = [], totalRfiRecords = 0;
// Variables for Submittals
var submittalsLimited = [], submittalHeaders = [], totalSubmittalRecords = 0;
// Variables for products
var productsLimited = [], productHeaders = [], totalProductRecords = 0;
// Variables for issues
var issuesLimited = [], issuesHeaders = [], totalIssuesRecords = 0;
// Common Var for Para1 Adder
var para1Adder = 0, para2Adder = 0, para3Adder = 0;

const sendRFIJsonProgressively = (rfis, total) => {
    //usersLimited = getUsersLimitedFields(users);
    rfisLimited = rfis;
    rfiHeaders = getTableHeaders(rfisLimited);
    totalRfiRecords = total;
};

const sendSubmittalsJsonProgressively = (submittals, total) => {
    submittalsLimited = submittals;
    submittalHeaders = getTableHeaders(submittalsLimited);
    totalSubmittalRecords = total;
};

const sendProductJsonProgressively = (products, total) => {
    productsLimited = getProductsLimitedFields(products);
    productHeaders = getTableHeaders(productsLimited);
    totalProductRecords = total;
}

const sendIssuesJsonProgressively = (issues, total) => {
    issuesLimited = issues;
    issuesHeaders = getTableHeaders(issuesLimited);
    totalIssuesRecords = total;
}

export const streamingResponseHeaders = (res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
}

// Function to send RFI data related streams
export const sendRFIsStreams = (stream, canCall, req) => {
    const reqStream = req ?? stream;

    // RFIs Para
    if(canCall) broadcastStreams(stream, rfiPara, 'rfiPara', 0);

    para1Adder = canCall ? rfiPara.length : 0;
    // RFIs Table Headers
    if(canCall) broadcastStreams(stream, rfiHeaders, 'rfiHeader', para1Adder);

    // RFIs Table data events row by row
    const iteratorAdder1 = para1Adder + rfiHeaders.length;
    broadcastStreams(stream, rfisLimited, 'rfi', iteratorAdder1);

    // RFIs Table total records
    if(canCall) {
        setTimeout(() => {
            const data1 = { totalRfiRecords };
            stream.write(`data: ${JSON.stringify(data1)}\n\n`);
        }, FIXED_STREAM_TIME * (para1Adder + rfiHeaders.length));
    }

    // Handle client disconnection
    reqStream.on('close', () => {
        console.log('Client disconnected. Cleaning up...');
        stream.end(); // Ensure the connection is closed
    });
};

// Function to send Submittals data related streams
export const sendSubmittalStreams = (stream, canCall, req) => {
    const reqStream = req ?? stream;
    const rfiAdder = canCall ? (para1Adder + rfiHeaders.length + rfisLimited.length) : 0;

    // Submittals Para
    if(canCall) broadcastStreams(stream, submittalPara, 'submittalPara', rfiAdder, EXTRA_TIME, canCall);

    para2Adder = canCall ? (rfiAdder + submittalPara.length) : 0;
    // Submittals Table Headers
    if(canCall) broadcastStreams(stream, submittalHeaders, 'submittalHeader', para2Adder, EXTRA_TIME, canCall);

    // Submittals Table data events row by row
    const iteratorAdder2 = para2Adder + submittalHeaders.length;
    broadcastStreams(stream, submittalsLimited, 'submittal', iteratorAdder2, EXTRA_TIME, canCall);

    // Submittals Table total records
    if(canCall) {
        const extra_time_wait = canCall ? EXTRA_TIME : 0;
        setTimeout(() => {
            const data2 = { totalSubmittalRecords };
            stream.write(`data: ${JSON.stringify(data2)}\n\n`);
        }, (FIXED_STREAM_TIME * (para2Adder + submittalHeaders.length)) + extra_time_wait);
    }

    // Handle client disconnection
    reqStream.on('close', () => {
        console.log('Client disconnected. Cleaning up...');
        stream.end(); // Ensure the connection is closed
    });
};

// Function to send Product data related streams
export const sendProductStreams = (stream, canCall, req) => {
    const reqStream = req ?? stream;
    const product_extra_time = 2 * EXTRA_TIME;
    const submittalsAdder = canCall ? (para2Adder + submittalHeaders.length + submittalsLimited.length) : 0;

    // Products Para
    if(canCall) broadcastStreams(stream, schedulesPara, 'schedulesPara', submittalsAdder, product_extra_time, canCall);

    para3Adder = canCall ? (submittalsAdder + schedulesPara.length) : 0;
    // Products Table Headers
    if(canCall) broadcastStreams(stream, productHeaders, 'productHeader', para3Adder, product_extra_time, canCall);

    // Products Table data events row by row
    const iteratorAdder3 = para3Adder + productHeaders.length;
    broadcastStreams(stream, productsLimited, 'product', iteratorAdder3, product_extra_time, canCall);

    // Products Table total records
    if(canCall) {
        const extra_time_wait = canCall ? product_extra_time : 0;
        setTimeout(() => {
            const data3 = { totalProductRecords };
            stream.write(`data: ${JSON.stringify(data3)}\n\n`);
        }, (FIXED_STREAM_TIME * (para3Adder + productHeaders.length)) + extra_time_wait);
    }

    // Handle client disconnection
    reqStream.on('close', () => {
        console.log('Client disconnected. Cleaning up...');
        stream.end(); // Ensure the connection is closed
    });
};

// Function to send Issues data related streams
export const sendIssuesStreams = (stream, canCall, req) => {
    const reqStream = req ?? stream;
    const issues_extra_time = 3 * EXTRA_TIME;
    const productsAdder = canCall ? (para3Adder + productHeaders.length + productsLimited.length) : 0;

    // Issues Para
    if(canCall) broadcastStreams(stream, issues_para, 'issuesPara', productsAdder, issues_extra_time, canCall);

    const para4Adder = canCall ? (productsAdder + issues_para.length) : 0;
    // Issues Table Headers
    if(canCall) broadcastStreams(stream, issuesHeaders, 'issueHeader', para4Adder, issues_extra_time, canCall);

    // Issues Table data events row by row
    const iteratorAdder4 = para4Adder + issuesHeaders.length;
    broadcastStreams(stream, issuesLimited, 'issue', iteratorAdder4, issues_extra_time, canCall);

    // Issues Table total records
    if(canCall) {
        const extra_time_wait = canCall ? issues_extra_time : 0;
        setTimeout(() => {
            const data4 = { totalIssuesRecords };
            stream.write(`data: ${JSON.stringify(data4)}\n\n`);
        }, (FIXED_STREAM_TIME * (para4Adder + issuesHeaders.length)) + extra_time_wait);
    }

    // Handle client disconnection
    reqStream.on('close', () => {
        console.log('Client disconnected. Cleaning up...');
        stream.end(); // Ensure the connection is closed
    });
};

// Function to simulate fetching RFIs data
export const getRFIData = async (skip = 0, limit = 10) => {
    const res = await fetch(`https://dummyjson.com/users?skip=${skip}&limit=${limit}`);
    const data = await res.json();
    const filtered_res = total_rfi_limited_data.slice(Number(skip), Number(skip) + Number(limit));
    sendRFIJsonProgressively(filtered_res, total_rfi_limited_data.length);
    //sendUserJsonProgressively(data.users, data.total);
    return data;
}; 

// Function to simulate fetching Submittals data
export const getSubmittalData = async (skip = 0, limit = 10) => {
    const res = await fetch(`https://dummyjson.com/users?skip=${skip}&limit=${limit}`);
    const data = await res.json();
    const filtered_res = total_submittal_limited_data.slice(Number(skip), Number(skip) + Number(limit));
    sendSubmittalsJsonProgressively(filtered_res, total_submittal_limited_data.length);
    return data;
}; 

// Function to simulate fetching product data
export const getProductData = async (skip = 0, limit = 10) => {
    const res = await fetch(`https://dummyjson.com/products?skip=${skip}&limit=${limit}`);
    const data = await res.json();
    sendProductJsonProgressively(data.products, data.total);
    return data;
}; 

// Function to simulate fetching issues data
export const getIssuesData = async (skip = 0, limit = 10) => {
    const res = await fetch(`https://dummyjson.com/products?skip=${skip}&limit=${limit}`);
    const data = await res.json();
    const filtered_res = total_issues_limited_data.slice(Number(skip), Number(skip) + Number(limit));
    sendIssuesJsonProgressively(filtered_res, total_issues_limited_data.length);
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
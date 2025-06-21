const express = require('express');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: 'http://localhost:3001'
};

var usersLimited = [];
var headers = [];

const getUsersLimitedFields = (users) => {
    return users.map(user => {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            maidenName: user.maidenName,
            age: user.age,
            email: user.email,
            phone: user.phone,
            username: user.username,
            birthDate: user.birthDate,
            role: user.role,
            height: user.height,
            weight: user.weight,
        };
    });
};

const getTableHeaders = (users) => {
    const headerWithoutId = users[0] ? Object.keys(users[0]).filter(key => key !== 'id') : [];
    const headers = ['S.No'];
    const hwi = headerWithoutId.map(header => header.charAt(0).toUpperCase() + header.slice(1));
    return headers.concat(hwi);
};

const sendUserJsonProgressively = (users) => {
    usersLimited = getUsersLimitedFields(users);
    headers = getTableHeaders(usersLimited);
}

app.get('/events', cors(corsOptions), (req, res) => {
    // res.send();
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    headers.forEach((header, i) => {
        // send SSE every 50ms
        setTimeout(() => {
            const data1 = { header };
            console.log('data1 = ', data1);
            res.write(`data: ${JSON.stringify(data1)}\n\n`);
        }, 60*i);
    });

    usersLimited.forEach((user, index) => {
        // send SSE every 50ms
        setTimeout(() => {
            const data2 = { user };
            console.log('data2 = ', data2);
            res.write(`data: ${JSON.stringify(data2)}\n\n`);
        }, 60*(index+headers.length));
    });
});

// Function to simulate fetching user data
const getUserData = async () => {
    const res = await fetch('https://dummyjson.com/users?skip=0&limit=20');
    const data = await res.json();
    sendUserJsonProgressively(data.users);
};  

// Call the users API in the startup
getUserData();

app.listen(3000, () => console.log('Server is listening on port 3000'));
const express = require('express');
const route = require('./routes/route');
const dbConnection = require('./dataBase/db');
require('dotenv').config();
const app = express()

app.use(express.json())

//----- database connection------
dbConnection();

app.use('/', route);

app.use((req, res) => res.status(400).send({ status: false, message: 'invalid URL' }));

app.listen(process.env.PORT, () => { console.log(`Express app running on port ${process.env.PORT}`) });

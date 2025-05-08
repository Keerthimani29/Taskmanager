const express = require('express');

const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for all routes

require('./db/tm.js');

const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/server', require('./Routes/tm.js'));


app.listen(port,  ()=>{
    console.log(`Server is running on port ${port}`);
})
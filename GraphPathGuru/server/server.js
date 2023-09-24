// this is where we will have our mongo-db server 


const express = require("express");
const connectToMongo = require("./database/db");

const app = express();
const port = 4000;

connectToMongo();

app.use(express.json()) 

app.use('/routes', require('./routes/api'))  

app.listen(port, () => {
    console.log(`backend listening on port : ${port}`)
  })

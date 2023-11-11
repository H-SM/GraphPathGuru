const mongoose = require('mongoose');
require('dotenv').config();
let cluster = process.env.API_CLUSTERING;
console.log(cluster);
const connectToMongo = () => {
    mongoose.connect(cluster,{ 
        //TODO: look over these parameters in the db connection
        // useNewUrlParser: true, 
        // useUnifiedTopology: true
    })
    .then(() => console.log('Successfully connected to Mongo'))
    .catch((e) => console.log(e))
}

module.exports = connectToMongo;
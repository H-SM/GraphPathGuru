const mongoose = require('mongoose');
let cluster = process.env.API_CLUSTER;
cluster = 'mongodb+srv://harman777:qweewq123@dbcluster.wfzixhr.mongodb.net/testdb';
// console.log(cluster);
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
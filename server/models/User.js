const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type : String, 
        required : true
    },
    email: {
        type : String, 
        required : true,
        unique : true
    },
    password: {
        type : String, 
        required : true
    },
    image: {
        type: String
    },
    date: {
        type : Date, 
        default : Date.now
    }

});

// const user = mongoose.model('user', UserSchema);
// user.createIndexes();
// module.exports = user;
// we have made these changes over the auth.js seperately over 11000 status of E11000  there is no need to check the same thing twice

module.exports = mongoose.model('user', UserSchema);
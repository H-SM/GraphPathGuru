const mongoose = require('mongoose');
const { Schema } = mongoose;

const GraphSchema = new Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    result: {
        type : String, 
        required : true
    },
    date: {
        type : Date, 
        default : Date.now
    }
});

module.exports = mongoose.model('graph', GraphSchema);
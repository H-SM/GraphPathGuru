const mongoose = require("mongoose");

const schema = mongoose.Schema({
   //YOUR BACK-END SCHEMA HERE { name : string , address, string }
})

const schema_looker = mongoose.model("routes", schema);
module.exports = schema_looker;

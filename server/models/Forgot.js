const mongoose = require("mongoose");
const { Schema } = mongoose;

const ForgotSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("forgot", ForgotSchema);

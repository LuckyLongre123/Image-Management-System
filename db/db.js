const mongoose = require("mongoose");
const conn = () => mongoose.connect(process.env.MONGO_URI);
module.exports = conn;

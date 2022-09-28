const mongoose = require("mongoose");
require('dotenv').config();

module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    try {
        mongoose.connect(process.env.DB, connectionParams);
        console.log("MongoDb is connected");
    } catch (err) {
        console.log(err);
    }
};

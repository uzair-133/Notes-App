const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MONGODB IS CONNECTED")
    }
    catch (err) {
        console.log("MONGODB IS NOT CONNECTED", err)
    }
}

module.exports  = connectDb;
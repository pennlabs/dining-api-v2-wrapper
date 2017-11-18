var mongoose = require('mongoose')
require('dotenv').config()

mongoose.connection.on('connected', () => {
    console.log('Successfully connected to database')
})

//for production 
mongoose.connect(process.env.MONGO_URI)

//for local dev

mongoose.Promise = global.Promise

module.exports = mongoose
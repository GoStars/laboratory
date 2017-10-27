const mongoose = require('mongoose')

let Schema = mongoose.Schema

// home schema
let homeSchema = new Schema({
    author: String,
    body: String
})

// home model
let Home = mongoose.model('Home', homeSchema)

module.exports = Home
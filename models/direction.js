const mongoose = require('mongoose')

let Schema = mongoose.Schema

// direction schema
let directionSchema = new Schema({
    title: String,
    author: String,
    body: String
})

// direction model
let Direction = mongoose.model('Direction', directionSchema)

module.exports = Direction
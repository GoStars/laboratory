const mongoose = require('mongoose')

let Schema = mongoose.Schema

// contact schema
let contactSchema = new Schema({
    author: String,
    body: String
})

// contact model
let Contact = mongoose.model('Contact', contactSchema)

module.exports = Contact
const mongoose = require('mongoose')

let Schema = mongoose.Schema

// researcher schema
let researcherSchema = new Schema({
    title: String,
    author: String,
    body: String
})

// researcher model
let Researcher = mongoose.model('Researcher', researcherSchema)

module.exports = Researcher
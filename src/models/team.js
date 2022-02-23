const mongoose = require('mongoose')
// const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        trim: true,
        default: 'Private Company'
    },
    empID: {
        type: Number,
        // required: true,
    },
    age: {
        type: Number,
    },
    phone_number: {
        type: Number,
        default: 1234567890,
    },
})


// userSchema.createIndex({name: 'text'})
const Team = mongoose.model('Team', userSchema)
// Team.createIndexes({"$**":"text"})
module.exports = Team


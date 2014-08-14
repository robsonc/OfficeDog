var mongoose = require('mongoose');

var NoteSchema = mongoose.Schema({
    datetime: Date,
    note: String
});

module.exports = mongoose.model('Note', NoteSchema);
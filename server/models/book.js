const mongoose = require('mongoose');
const schema = mongoose.Schema;

const bookSchema = new schema({
    name: String,
    genere: String,
    authId: String
});

module.exports = mongoose.model('Book', bookSchema);


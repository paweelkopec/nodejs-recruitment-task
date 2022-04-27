const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
        title: {type: String, required: true},
        released: {type: Date},
        genre: {type: String},
        director: {type: String},
        user_id: {type: Number, required: true}
    },
    {timestamps: true}
);

module.exports = mongoose.model("movie", movieSchema);
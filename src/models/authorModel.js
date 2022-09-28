const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
    {
        fname: { type: String, required: true, minlength: 2, maxlength: 33, trim: true },
        lname: { type: String, required: true, minlength: 2, maxlength: 33, trim: true },
        title: { type: String, required: true, enum: ["Mr", "Mrs", "Miss"] },
        email: { type: String, required: true, unique: true, minlength: 5, maxlength: 99, trim: true },
        password: { type: String, required: true, minlength: 8, maxlength: 99, trim: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Author", authorSchema);

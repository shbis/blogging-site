const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const BlogsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    authorId: { required: true, type: ObjectId, ref: "Author" },
    tags: { type: [String], trim: true },
    category: { type: [String], trim: true },
    subcategory: { type: [String], trim: true },
    deletedAt: Date,
    isDeleted: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogsSchema);

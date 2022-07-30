const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true // remove leading and ending whitespace
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "public",
    enum: ["public", "private"] // status can be either public or private || one of these array values status can have
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // reference the collection
  },
}, { timestamps: true });

module.exports = mongoose.model("story", storySchema);
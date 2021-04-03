const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  categories: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  // property ('createdBy') === path
  // ref ('User') === model
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  comments: [
    {
      commentBody: {
        type: String,
        required: true,
      },
      commentDate: {
        type: Date,
        default: Date.now,
      },
      commentUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    },
  ],
});

// Create index to search on all fields of posts
PostSchema.index({
  "$**": "text", // for all fields on this schema, we want to perform a text search
});

module.exports = mongoose.model("Post", PostSchema);

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  discription: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tags',
      required: true,
    },
  ],
  category: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      //   required: true,
    },
  ],
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

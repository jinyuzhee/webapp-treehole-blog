const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: {type: Date}
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

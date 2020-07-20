const Post = require('../models/post');

module.exports.create = (req, res) => {
  const body = req.body;
  const post = new Post(body);
  post
    .save()
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.show = (req, res) => {
  Post.find()
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      res.json(err);
    });
};

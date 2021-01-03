const Tag = require("../models/tag");

module.exports.create = (req, res) => {
  const body = req.body;
  const tag = new Tag(body);
  tag
    .save()
    .then((tag) => {
      res.json({ confirmation: "Success", tag: tag });
    })
    .catch((err) => {
      res.json({ confirmation: "Failed", error: err.message });
    });
};

module.exports.list = (req, res) => {
  Tag.find()
    .then((tags) => {
      res.json({ confirmation: "Success", tags: tags });
    })
    .catch((err) => {
      res.json({ confirmation: "Failed", error: err });
    });
};

module.exports.show = (req, res) => {
  const id = req.params.id;
  Tag.findById(id)
    .then((tag) => {
      res.json({ confirmation: "Success", tag: tag });
    })
    .catch((err) => {
      res.json({ confirmation: "Failed", error: err });
    });
};

module.exports.delete = (req, res) => {
  const id = req.params.id;
  Tag.findByIdAndDelete(id)
    .then((tag) => {
      res.json({ confirmation: "Success", tag: tag });
    })
    .catch((err) => {
      res.json({ confirmation: "Failed", error: err });
    });
};

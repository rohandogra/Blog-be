const Category = require("../models/category");

module.exports.create = (req, res) => {
  const body = req.body;
  const user = req.user;
  console.log(body, user);
  const category = new Category(body);
  category
    .save()
    .then((category) => {
      res.json({ confirmation: "Success", category: category });
    })
    .catch((err) => {
      res.json({ confirmation: "Failed", error: err.message });
    });
};

module.exports.list = (req, res) => {
  Category.find()
    .then((category) => {
      res.json({ confirmation: "Success", category: category });
    })
    .catch((err) => {
      res.json({ confirmation: "Failed", error: err.message });
    });
};

module.exports.show = (req, res) => {
  const id = req.params.id;
  Category.findById(id)
    .then((category) => {
      res.json({ confirmation: "Success", category: category });
    })
    .catch((err) => {
      res.json({ confirmation: "Failed", error: err });``
    });
};

module.exports.delete = (req, res) => {
  const id = req.params.id;
  Category.findByIdAndDelete(id)
    .then((category) => {
      res.json({ confirmation: "Success", category: category });
    })
    .catch((err) => res.json({ confirmation: "Failed", error: err.message }));
};

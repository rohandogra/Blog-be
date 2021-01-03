const Post = require("../models/post");
const aws = require("aws-sdk");
const fs = require("fs");
const { uuid } = require("uuidv4");
const { $where } = require("../models/post");

module.exports.create = (req, res) => {
  const userId = req.user._id;
  console.log(userId, ":::::::::::::::::::::::::::::");

  aws.config.setPromisesDependency();
  aws.config.update({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
  });

  const s3 = new aws.S3();

  const params = {
    ACL: "public-read",
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: fs.createReadStream(req.file.path),
    Key: `${uuid()}-${req.file.originalname}`,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.log("Error occured while trying to upload to S3 bucket", err);
    }

    if (data) {
      fs.unlinkSync(req.file.path); // Empty temp folder
      const locationUrl = data;
      let post = new Post({ ...req.body, image: locationUrl, author: userId });

      post
        .save()
        .then((post) => {
          res.json({ message: "Post created successfully", post });
        })
        .catch((err) => {
          console.log("Error occured while trying to save to DB", err.message);
        });
    }
  });
};

module.exports.delete = (req, res) => {
  const id = req.params.id;

  Post.findByIdAndDelete(id)
    .then((post) => {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: post.image.Key,
      };
      if (post) {
        s3.deleteObject(params, function (err, data) {
          if (err) console.log(err, err.stack);
          // an error occurred
          else console.log(data, post); // successful response
        });
      }
    })
    .catch((err) => res.json(err));
};

module.exports.show = (req, res) => {
  const query = req.query.tags;
  const pageOptions = {
    page: parseInt(req.query.page, 10) || 0,
    limit: parseInt(req.query.limit, 10) || 10,
  };
  Post.find(query, [
    "image.Location",
    "tags",
    "category",
    "title",
    "discription",
    "createdAt",
  ])
    .populate("author", "-password")
    .select("avatar.Location")
    .populate("category")
    .populate("tags")
    .sort({ createdAt: "asc" })
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .exec(function (err, post) {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.json({ confirmation: "Success", posts: post });
    });
};

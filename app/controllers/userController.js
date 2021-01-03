const User = require("../models/user");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const aws = require("aws-sdk");
const fs = require("fs");
const { uuid } = require("uuidv4");

module.exports.register = async (req, res) => {
  const { password, username, email, name, avatar } = req.body;

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
  //* Validate the Data before creasting u
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //* Checking if username is already in the database
  const usernameExists = await User.findOne({ username: username });
  if (usernameExists) return res.status(400).send("Username already exists");

  //* Checking if user is already in the database
  const emailExists = await User.findOne({ email: email });
  if (emailExists) return res.status(400).send("Email already exists");

  //* Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //* Create User

  s3.upload(params, (err, data) => {
    if (err) {
      console.log("Error occured while trying to upload to S3 bucket", err);
    }

    if (data) {
      fs.unlinkSync(req.file.path); // Empty temp folder
      const locationUrl = data;
      const user = new User({
        username,
        email,
        password: hashedPassword,
        name,
        avatar: locationUrl,
      });

      try {
        const savedUser = user.save();
        res.send({ _user: user._id });
      } catch (err) {
        res.status(400).send(err);
      }
    }
  });
};

module.exports.login = async (req, res) => {
  // Validate the Data before creasting user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if the email is correct
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email  is wrong");

  // Checking if Password is correct
  const passwordCheck = await bcrypt.compare(req.body.password, user.password);
  if (!passwordCheck) return res.status(400).send(" Password is wrong");

  //Create and assign a token
  const token = jwt.sign(
    { _id: user._id, username: user.username, email: user.email },
    process.env.TOKEN_SECRET,
    { expiresIn: "1h" }
  );
  req.header("Authorization", token);
  res.status(200).json({ token });
};

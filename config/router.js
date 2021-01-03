const express = require("express");
const router = express.Router();
const postController = require("../app/controllers/postController");
const userController = require("../app/controllers/userController");
const categoryController = require("../app/controllers/categoryController");
const tagController = require("../app/controllers/tagController");
const multer = require("multer");
const auth = require("../app/middleware/auth");

// const upload = multer({storage}).single('image')
//* Post Routes
router.get("/posts", postController.show);
router.post(
  "/post",
  multer({ dest: "temp/", limits: { fieldSize: 8 * 1024 * 1024 } }).single(
    "image"
  ),
  auth,
  postController.create
);
router.delete("/post/:id", auth, postController.delete);

//* Category Routes
router.post("/category", auth, categoryController.create);
router.get("/category", categoryController.list);
router.get("/category/:id", categoryController.show);
router.delete("/category/:id", auth, categoryController.delete);

//* Tag Routes
router.post("/tag", auth, tagController.create);
router.get("/tags", tagController.list);
router.get("/tag/:id", tagController.show);
router.delete("/tag/:id", auth, tagController.delete);

//* Auth Routes
router.post(
  "/register",
  multer({ dest: "temp/" }).single("avatar"),
  userController.register
);

router.post("/login", userController.login);

module.exports = router;

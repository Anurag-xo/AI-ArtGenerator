const express = require("express");
const {
  createPostWithImagesController_V3,
  createPostWithImagesController_V2,
  getPostsController,
  getSinglePostController,
  getUserPostController,
  deletePostController,
  likePostController,
  dislikePostController,
} = require("../controllers/postController");
const router = express.Router();

router.post("/create/v3/:userId", createPostWithImagesController_V3);
router.post("/create/v2/:userId", createPostWithImagesController_V2);

router.get("/all", getPostsController);
router.get("/single/:postId", getSinglePostController);
router.get("/user/:userId", getUserPostController);

router.delete("/delete/:postId", deletePostController);
router.post("/like/:postId", likePostController);
router.post("/dislike/:postId", dislikePostController);

module.exports = router;

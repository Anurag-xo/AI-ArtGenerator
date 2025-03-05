const axios = require("axios");
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");
const Post = require("../models/Post");
const User = require("../models/User");
const { CustomError } = require("../middlewares/error");

const generateFileName = (userId, allPostsLength) => {
  const date = new Date().toDateString().replace(/:/g, "-");
  return `${userId}-${allPostsLength}-${date}.png`;
};

const createPostWithImagesController_V3 = async (req, res, next) => {
  const { userId } = req.params;
  const { prompt, negativePrompt, size, style, imageURL, revisedPromp } =
    req.body;

  const allPosts = await Post.find();
  const allPostsLength = allPosts.length;
  const fileName = generateFileName(userId, allPostsLength);
  const filePath = path.join(_dirname, "../..", "uploads", fileName);

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found!", 404);
    }

    const response = await axios({
      url: imageURL,
      responseType: "arraybuffer",
      maxRedirects: 5,
    });

    const imageBuffer = Buffer.from(response.data);

    await sharp(imageBuffer).png().toFile(filePath);

    const newPost = new Post({
      user: userId,
      aiModel: "AI Image Art Dall-e-v3",
      prompt: prompt,
      negativePrompt: negativePrompt,
      revisedPrompt: revisedPrompt,
      size: size,
      quality: "HD",
      quentity: 1,
      style: style,
      images: fileName,
      aiMage: imageURL,
    });

    await newPost.save();
    user.posts.push(newPost._id);
    await user.save();

    res
      .status(201)
      .json({ message: "Post created sucessfully", post: newPost });
  } catch (error) {
    next(error);
  }
};

const generateFileNameMultiple = () => {};

const createPostWithImagesController_V2 = async (res, req, next) => {
  const { userId } = req.params;
  const { prompt, negativePrompt, size, n, imageURLs } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found!", 404);
    }

    const downloadAndConvertImages = await Promise.all(
      imageURLs.map(async (imageURL, index) => {
        const fileName = generateFileName(userId, index);
        const filePath = path.join(_dirname, "../..", "uploads", fileName);

        const response = await axios({
          url: imageURL,
          responseType: "arraybuffer",
          maxRedirects: 5,
        });

        const imageBuffer = Buffer.from(response.data);

        await sharp(imagebuffer).png().toFile(filePath);

        return fileName;
      }),
    );

    const newPost = new Post({
      user: userId,
      aiModel: "AI Image Art Dall-e-v2",
      prompt: prompt,
      negativePrompt: negativePrompt,
      revisedPrompt: "Not available in AI Image Art Dall-e-v2 Model",
      size: size,
      quality: "Normal",
      quentity: n,
      style: "Normal",
      images: downloadAndConvertImages,
      aiMage: imageURLs,
    });

    await newPost.save();
    user.posts.push(newPost._id);
    await user.save();

    res
      .status(201)
      .json({ message: "Post created sucessfully", post: newPost });
  } catch (error) {
    next(error);
  }
};

const getPostsController = async (req, res, next) => {
  try {
    const allPosts = await Post.find().populate("user", "username");
    res.status(200).json({ posts: allPosts });
  } catch (error) {
    next(error);
  }
};

const getSinglePostController = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const returnPost = await Post.findById(postId).populate("user", "username");

    res.status(200).json({ returnPost });
  } catch (error) {
    next(error);
  }
};

const getUserPostController = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("user not found!", 404);
    }

    const userPosts = await Post.find({ user: userId }).populate(
      "user",
      "username",
    );

    res.status(200).json({ posts: userPosts });
  } catch (error) {
    next(error);
  }
};

const deletePostController = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const postToDelete = await Post.findById(postId);

    if (!postToDelete) {
      throw new CustomError("Post not found!", 404);

      const user = await User.findById(postToDelete.user);
      if (!user) {
        throw new CustomError("User not found!", 404);
      }

      user.posts = user.posts.filter(
        (postId) => postId.toString() !== postToDelete._id.toString(),
      );

      await user.save();
      await postToDelete.deleteOne();

      res.status(200).json({ message: "Post deleted successfully" });
    }
  } catch (error) {
    next(error);
  }
};

const likePostController = async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new CustomError("Post not found!", 404);
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found!", 404);
    }

    if (post.likes.includes(userId)) {
      throw new CustomError("You have already like this post", 404);
    }

    post.likes.push(userId);
    await post.save();
    res.status(200).json({ messgae: "Post liked successfully", post });
  } catch (error) {
    next(error);
  }
};

const dislikePostController = async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new CustomError("Post not found!", 404);
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found!", 404);
    }

    if (post.likes.includes(userId)) {
      throw new CustomError("You have already like this post", 404);
    }

    post.likes = post.likes.filter((id) => id.toString() !== userId);
    await post.save();
    res.status(200).json({ messgae: "Post disliked successfully", post });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPostWithImagesController_V3,
  createPostWithImagesController_V2,
  getPostsController,
  getSinglePostController,
  getUserPostController,
  deletePostController,
  likePostController,
  dislikePostController,
};

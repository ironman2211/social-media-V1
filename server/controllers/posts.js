import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save().then((post) => {
      user.posts.push(post._id);
      user.save();
    });
    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    //latest posts
    const post = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id).then((post) => {
      User.findByIdAndUpdate(
        post.userId,
        { $pull: { posts: post._id } },
        { new: true }
      )
        .exec()
        .then((user) => {
          res.status(200).json(user);
        });
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, imageUrl, name } = req.body;
    const newComment = {
      id,
      comment,
      imageUrl,
      name,
      createdAt: new Date(),
    };
    Post.findByIdAndUpdate(
      id,
      { $push: { comments: newComment } },
      { new: true }
    )
      .then((updatedPost) => {
        console.log("Post with added comment:", updatedPost);
        res.status(200).json(updatedPost);
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Server Error please wait :)" });
      });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

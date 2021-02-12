const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

module.exports = {
  Query: {
    getPosts: async (_, args, { Post }) => {
      const posts = await Post.find({}).sort({ createdDate: "desc" }).populate({
        path: "createdBy",
        model: "User",
      });
      return posts;
    },
    getPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOne({ _id: postId }).populate({
        path: "comments.commentUser",
        model: "User",
      });
      return post;
    },
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({
        username: currentUser.username,
      }).populate({
        path: "likes",
        model: "Post",
      });
      return user;
    },
    infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
      let posts;
      if (pageNum === 1) {
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User",
          })
          .limit(pageSize);
      } else {
        // If page number is greater than one, figure out how many documents to skip
        const skips = pageSize * (pageNum - 1);
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User",
          })
          .skip(skips)
          .limit(pageSize);
      }
      const totalDocs = await Post.countDocuments();
      const hasMore = totalDocs > pageSize * pageNum;
      return { posts, hasMore };
    },
  },

  Mutation: {
    signinUser: async (_, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }
      return { token: createToken(user, process.env.SECRET, "1hr") };
    },

    /**
     * registerUser
     * Registers a user to the database given a username, email, and password.
     * If the user already exists, throw an error.
     * @param {*} _
     * @param {*} { username, email, password }
     * @param {*} { context }
     */
    registerUser: async (_, { username, email, password }, { User }) => {
      const user = await User.findOne({ username: username });
      if (user) {
        throw new Error("User already exists");
      }

      const newUser = await new User({
        username,
        email,
        password,
      }).save();
      return { token: createToken(newUser, process.env.SECRET, "1hr") };
    },

    /**
     * addPost
     * Creates a new post and links it to a registered user.
     * @param {*} _
     * @param {*} { title, image URL, categories, description, creator ID }
     * @param {*} { context }
     */
    addPost: async (
      _,
      { title, imageUrl, categories, description, creatorId },
      { Post }
    ) => {
      const post = await new Post({
        title,
        imageUrl,
        categories,
        description,
        createdBy: creatorId,
      }).save();
      return post;
    },
    addPostComment: async (_, { commentBody, userId, postId }, { Post }) => {
      const newComment = {
        commentBody,
        commentUser: userId,
      };
      const post = await Post.findOneAndUpdate(
        // find post by id
        { _id: postId },
        // prepend (push) new message to beginning of messages array
        { $push: { comments: { $each: [newComment], $position: 0 } } },
        // return fresh document post after update
        { new: true }
      ).populate({
        path: "comments.commentUser",
        model: "User",
      });
      return post.comments[0];
    },
  },
};

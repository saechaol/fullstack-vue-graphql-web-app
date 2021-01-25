module.exports = {
  Query: {
    getPosts: async (_, args, { Post }) => {
      const posts = await Post.find({}).sort({ createdDate: "desc" }).populate({
        path: "createdBy",
        model: "User",
      });
      return posts;
    },
  },

  Mutation: {
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
      return newUser;
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
  },
};

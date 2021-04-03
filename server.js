// Import ApolloServer to enable GraphQL
const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

// Import type definitions and resolvers
const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");
const resolvers = require("./resolvers");

// Import environment variables and Mongoose models
require("dotenv").config({ path: "variables.env" });
const User = require("./models/User");
const Post = require("./models/Post");

// Connect to MLab database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error(err));

// Verify JWT token from client
const getUser = async (token) => {
  if (token) {
    try {
      return jwt.verify(token, process.env.SECRET);
    } catch (err) {
      throw new AuthenticationError(
        "Your session has ended. Please sign in again."
      );
    }
  }
};

// Initialize ApolloServer GraphQL Server object using type definitions, resolvers, and context objects
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => ({
    name: error.name,
    message: error.message.replace("Context creation failed:", ""),
  }),
  context: async ({ req }) => {
    const token = req.headers["authorization"];
    return { User, Post, currentUser: await getUser(token) };
  },
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server listening on ${url}`);
});

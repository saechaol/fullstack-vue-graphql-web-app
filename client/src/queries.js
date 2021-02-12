import { gql } from "apollo-boost";
import { Query } from "mongoose";

/* Posts Queries */
export const GET_POSTS = gql`
  query {
    getPosts {
      _id
      title
      imageUrl
    }
  }
`;

export const GET_POST = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      _id
      title
      imageUrl
      categories
      description
      likes
      createdDate
      comments {
        _id
        commentBody
        commentDate
        commentUser {
          _id
          username
          avatar
        }
      }
    }
  }
`;

/*
 * User Queries
 */
export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      _id
      username
      email
      password
      avatar
      registerDate
      likes {
        _id
        title
        imageUrl
      }
    }
  }
`;

export const INFINITE_SCROLL_POSTS = gql`
  query($pageNum: Int!, $pageSize: Int!) {
    infiniteScrollPosts(pageNum: $pageNum, pageSize: $pageSize) {
      hasMore
      posts {
        _id
        title
        imageUrl
        categories
        description
        likes
        createdDate
        comments {
          _id
        }
        createdBy {
          _id
          username
          avatar
        }
      }
    }
  }
`;

/*
 * Post Mutations
 */
export const ADD_POST = gql`
  mutation(
    $title: String!
    $imageUrl: String!
    $categories: [String]!
    $description: String!
    $creatorId: ID!
  ) {
    addPost(
      title: $title
      imageUrl: $imageUrl
      categories: $categories
      description: $description
      creatorId: $creatorId
    ) {
      _id
      title
      imageUrl
      categories
      description
      createdDate
    }
  }
`;

export const ADD_POST_COMMENT = gql`
  mutation($commentBody: String!, $userId: ID!, $postId: ID!) {
    addPostComment(
      commentBody: $commentBody
      userId: $userId
      postId: $postId
    ) {
      _id
      commentBody
      commentDate
      commentUser {
        _id
        username
        avatar
      }
    }
  }
`;

/*
 * User Mutations
 */
export const SIGNIN_USER = gql`
  mutation($username: String!, $password: String!) {
    signinUser(username: $username, password: $password) {
      token
    }
  }
`;

export const REGISTER_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    registerUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

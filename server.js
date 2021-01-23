// Import ApolloServer to enable GraphQL
const { ApolloServer, gql } = require("apollo-server");

const todos = [
  { task: "Wash dishes", completed: false },
  { task: "Make bed", completed: false },
  { task: "Clean room", completed: false },
];

const classes = [
  {
    class: "Computer Graphics",
    time: "10AM - 11AM",
    days: ["Monday", "Wednesday", "Friday"],
  },
  { class: "Senior Project", time: "9AM - 10AM", days: ["Wednesday"] },
  {
    class: "Intelligent Systems",
    time: "11AM - 12PM",
    days: ["Monday", "Wednesday", "Friday"],
  },
  { class: "Senior Seminar", time: "9AM - 10AM", days: ["Friday"] },
  { class: "Career Planning", time: "2PM - 3PM", days: ["Friday"] },
  {
    class: "Operating System Pragmatics",
    time: "2PM - 3:30PM",
    days: ["Tuesday", "Thursday"],
  },
  { class: "Physics", time: "9AM - 1:30PM", days: ["Tuesday", "Thursday"] },
];

/* Define type definitions for this schema
 *  -   Todo: a list of tasks to complete and their completion status
 *  -   Classes: a list of classes, times, and days
 *  -   Query: functions to query this database
 *  -   Mutation: functions that modify this database
 */
const typeDefs = gql`
  type Todo {
    task: String
    completed: Boolean
  }

  type Class {
    class: String
    time: String
    days: [String]
  }

  type Query {
    getTodos: [Todo]
    getClass: [Class]
  }

  type Mutation {
    addTodo(task: String, completed: Boolean): Todo
    addClass(class: String, time: String, days: [String]): Class
  }
`;

const resolvers = {
  Query: {
    getTodos: () => todos,
    getClass: () => classes,
  },
  Mutation: {
    /*
     * addTodo: inserts the arguments into the todos array
     */
    addTodo: (_, { newTask, isComplete }) => {
      const newTodo = { task: newTask, completed: isComplete };
      todos.push(newTodo);
      return newTodo;
    },
    /*
     * addClass: inserts the arguments into the classes array
     */
    addClass: (_, { className, newTime, newDays }) => {
      const newClass = { class: className, time: newTime, days: newDays };
      classes.push(newClass);
      return newClass;
    },
  },
};

// Initialize ApolloServer object
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});

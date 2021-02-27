const userResolvers = require('./users');
const messageResolvers = require('./messages');

module.exports = {
    Message: {
      createdAt: (parent) => {
          const date = new Date(parent.createdAt);
          return date.toISOString();
      }
    },
    Query: {
        ...userResolvers.Query,
        ...messageResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...messageResolvers.Mutation,
    }
}
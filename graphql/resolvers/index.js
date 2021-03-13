const userResolvers = require('./users');
const messageResolvers = require('./messages');
const {User, Message} = require('../../models');

module.exports = {
    Message: {
        createdAt: (parent) => {
            const date = new Date(parent.createdAt);
            return date.toISOString();
        }
    },
    Reaction: {
        createdAt: (parent) => {
            const date = new Date(parent.createdAt);
            return date.toISOString();
        },
        Message: async (parent) => await Message.findByPk(parent.messageId),
        User: async (parent) => await User.findByPk(parent.userId, {attributes: ['username', 'createdAt', 'id']}),
    },
    User: {
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
    },
    Subscription: {
        ...messageResolvers.Subscription
    }
}
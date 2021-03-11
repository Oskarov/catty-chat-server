const {User, Message} = require('../../models');
const checkAuth = require('../../util/checkAuth');
const {UserInputError, withFilter} = require('apollo-server');
const {Op} = require('sequelize');


module.exports = {
    Query: {
        getMessages: async (parent, {from}, context) => {
            const authContext = checkAuth(context);
            const authUser = authContext.user;
            const targetUser = await User.findOne({where: {username: from}});

            if (!targetUser) {
                throw new UserInputError('User not found');
            }

            const usersNames = [authUser.username, targetUser.username];

            const messages = await Message.findAll({
                where: {
                    from: {[Op.in]: usersNames},
                    to: {[Op.in]: usersNames}
                },
                order: [['createdAt', 'DESC']]
            });

            return messages;
        }
    },
    Mutation: {
        sendMessage: async (parent, {to, content}, context) => {
            try {
                const authContext = checkAuth(context);
                const authUser = authContext.user;
                const recipient = await User.findOne({where: {username: to}});

                if (!recipient) {
                    throw new UserInputError('User not found');
                }

                if (recipient.username == authUser.username) {
                    throw new UserInputError('You cant message yourself');
                }

                if (content.trim() === '') {
                    throw new UserInputError('empty message');
                }

                const message = await Message.create({
                    from: authUser.username,
                    to,
                    content
                })

                context.pubsub.publish('NEW_MESSAGE', {newMessage: message});

                return message;
            } catch (err) {
                throw err;
            }
        }
    },
    Subscription: {
        newMessage: {
            subscribe:
                withFilter((_,__, context) => {
                    const authContext = checkAuth(context);
                    return authContext.pubsub.asyncIterator(['NEW_MESSAGE'])
                }, ({newMessage}, _, context) => {
                    const authContext = checkAuth(context);
                    const authUser = authContext.user;
                    if (newMessage.from === authUser.username || newMessage.to === authUser.username){
                        return true;
                    }
                    return false;
                })
        }
    }
}
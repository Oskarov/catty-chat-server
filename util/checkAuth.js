const jwt = require('jsonwebtoken');
const {AuthenticationError, PubSub} = require('apollo-server');
const { SECRET_KEY } = require('../config');

const pubsub = new PubSub();

module.exports = (context) => {
     const authHeader = context.req.headers.authorization;
     let token;
     if (authHeader){
         token = authHeader.split('Bearer ')[1];
         /*throw new AuthenticationError('Token must be in right format');*/
     } else if (context.connection && context.connection.context.authorization){
         token = context.connection.context.authorization;
     }

     if (token){
        try {
            context.user = jwt.verify(token, SECRET_KEY);
            context.pubsub = pubsub;

            return context;
        } catch (e){
            throw new AuthenticationError('Invalid/Expired token');
        }
    }
    throw new AuthenticationError('Header must be provided');
}
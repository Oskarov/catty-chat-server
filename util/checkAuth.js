const jwt = require('jsonwebtoken');
const {AuthenticationError, PubSub} = require('apollo-server');
const { SECRET_KEY } = require('../config');

const pubsub = new PubSub();

module.exports = (context) => {

     let bearerToken;
     if (context.req && context.req.headers.authorization){
         bearerToken = context.req.headers.authorization
     } else if (context.connection && context.connection.context.Authorization){
         bearerToken = context.connection.context.Authorization
     }


     if (bearerToken){
        try {
            const token = bearerToken.split('Bearer ')[1];
            context.user = jwt.verify(token, SECRET_KEY);
            context.pubsub = pubsub;
            return context;
        } catch (e){
            throw new AuthenticationError('Invalid/Expired token');
        }
    }

    throw new AuthenticationError('Header must be provided');
}
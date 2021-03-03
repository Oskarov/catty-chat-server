const {gql} = require('apollo-server');

module.exports = gql`
    type User {
        id: ID!
        username: String!
        email: String
        token: String
        createdAt: String!
        latestMessage: Message
    }
    type Message {
        uuid: String!
        content: String!
        from: String!
        to: String!
        createdAt: String!
    }
    type Query {
        getUsers: [User]!
        getUser: User!
        getMessages(
            from: String!
        ): [Message]!
    }
    type Mutation {
        register(
            username: String! 
            email: String!
            password: String!
            confirmedPassword: String!
        ): User!
        login(
            username: String!
            password: String!
        ): User!
        sendMessage(
            to: String!
            content: String!
        ): Message!
    }
`;
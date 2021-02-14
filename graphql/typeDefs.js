const {gql} = require('apollo-server');

module.exports = gql`
    type User {
        username: String!
        email: String!
        token: String
        createdAt: String!
    }
    type Query {
        getUsers: [User]!
        getUser: User!
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
    }
`;
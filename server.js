const {ApolloServer} = require('apollo-server');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const {sequelize} = require('./models');

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen().then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);

    sequelize.authenticate()
        .then(()=>{
            console.log('database connected')
        })
        .catch((e)=>{
            console.log(e);
        })
});
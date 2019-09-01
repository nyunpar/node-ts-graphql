"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const graphql_yoga_1 = require("graphql-yoga");
const typeDefs = `
  type Query {
    hello(name: String): String!
  }
`;
const resolvers = {
    Query: {
        hello: (_, { name }) => `Hello ${name || 'World'}`,
    },
};
const server = new graphql_yoga_1.GraphQLServer({ typeDefs, resolvers });
typeorm_1.createConnection().then(() => {
    server.start(() => console.log('Server is running on localhost:4000'));
});
//# sourceMappingURL=index.js.map
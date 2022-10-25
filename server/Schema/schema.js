const { projects, clients } = require("../../sampleData");

// Mongoose Models
const Project = require("../models/Project");
const Client = require("../models/Client");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
} = require("graphql");

// client type
const ClientType = new GraphQLObjectType({
  name: "client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    project: {
      type: ProjectType,
      description: "tells the project of which client",
      resolve: (parentClient) => {
        return Project.find({}, { clientId: parentClient.id }).pretty();
      },
    },
  }),
});

// Project type
const ProjectType = new GraphQLObjectType({
  name: "project",
  fields: () => ({
    id: { type: GraphQLID },
    clientId: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve: (parentProject) => {
        return Client.findById(parentProject.clientId).pretty();
      },
    },
  }),
});

// root query
const rootQuery = new GraphQLObjectType({
  name: "rootQueryType",
  fields: {
    // client
    client_: {
      type: new GraphQLList(ClientType),
      description: "Clients Array",
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        if (args.id) {
          return Client.findById(args.id);
        }

        return Client.find();
      },
    },
    // project
    project_: {
      type: new GraphQLList(ProjectType),
      description: "Projects Array",
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        if (args.id) {
          return Project.findById(args.id);
        }

        return Project.find();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: rootQuery,
});

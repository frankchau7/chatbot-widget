import { gql } from "graphql-tag";

export const sendMessageTypeDefs = gql`
  type Message {
    id: ID!
    content: String!
    sender: String!
    timestamp: String!
  }
  type Query {
    _health: String!
  }
  type Mutation {
    sendMessage(content: String!): Message!
  }
`;
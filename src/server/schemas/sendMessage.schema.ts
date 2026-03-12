import { gql } from "graphql-tag";

export const sendMessageTypeDefs = gql`
  type Message {
    id: ID
    content: String!
    sender: String!
    timestamp: String!
  }
  type Session {
    id: String!
    messages: [Message!]!
  }
  type Query {
    _health: String!
  }
  type Mutation {
    sendMessage(sessionId: String!, content: String!): Session!
  }
`;
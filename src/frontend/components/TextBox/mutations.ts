import { gql } from "@apollo/client";

export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($sessionId: String!, $content: String!) {
    sendMessage(sessionId: $sessionId, content: $content) {
      id
      messages {
        id
        content
        sender
        timestamp
      }
    }
  }
`;
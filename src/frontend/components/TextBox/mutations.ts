import { gql } from "@apollo/client";

export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($content: String!) {
    sendMessage(content: $content) {
      id
      content
      sender
      timestamp
    }
  }
`;
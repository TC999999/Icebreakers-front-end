import API from "./api";
import type {
  conversation,
  savedMessage,
  conversationMessage,
  currentConversation,
  updateConversation,
} from "../types/conversationTypes";

type getMessagesReturn = {
  messages: conversationMessage[];
  conversationData: currentConversation;
};

type createMessagesReturn = {
  message: conversationMessage;
};

// API class for direct conversations, including creating new messages, getting all
// current conversations, and getting all messages for a single conversation,
// extends from the basic API class
class directConversationsAPI extends API {
  // initial backend route endpoint
  public static route = "directMessage";

  // retrieves a list of all of a single user's conversations, not including messages
  public static async getConversations(
    username: string
  ): Promise<conversation[]> {
    let res = await this.getRequest(`${username}/conversation`);
    return res.conversations;
  }

  // retrieves a list of all messages that belong to a single conversation based on id; messages can
  // belong to either user in the conversation
  public static async getMessages(
    username: string,
    id: string,
    unreadMessages: number
  ): Promise<getMessagesReturn> {
    const res = await this.getRequest(
      `${username}/conversation/${id}/message`,
      {
        unreadMessages,
      }
    );
    return res;
  }

  // creates and returns a new message for a single conversation created by one of the users involved
  // in the conversation
  public static async createMessage(
    message: savedMessage,
    username: string,
    id: string
  ): Promise<createMessagesReturn> {
    const res = await this.postRequest(
      `${username}/conversation/${id}/message`,
      message
    );
    return res;
  }

  // updates a single direct conversation's title and returns that new title
  public static async updateConversation(
    conversation: updateConversation,
    username: string,
    id: string
  ): Promise<any> {
    const res = await this.patchRequest(
      `${username}/conversation/${id}`,
      conversation
    );
    return res.updatedConversation;
  }
}

export default directConversationsAPI;

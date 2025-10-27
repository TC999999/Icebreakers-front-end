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
  otherUser: { username: string };
};

class directConversationsAPI extends API {
  public static route = "directMessage";

  public static async getConversations(
    username: string
  ): Promise<conversation[]> {
    let res = await this.getRequest(`conversations/${username}`);
    return res.conversations;
  }

  public static async getMessages(
    username: string,
    id: string,
    unreadMessages: number
  ): Promise<getMessagesReturn> {
    const res = await this.getRequest(
      `${username}/conversation/${id}/messages`,
      {
        unreadMessages,
      }
    );
    return res;
  }

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

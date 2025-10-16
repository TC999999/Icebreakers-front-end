import API from "./api";
import type {
  savedMessage,
  conversationMessage,
  currentConversation,
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

  public static async getConversations(username: string): Promise<any> {
    let res = await this.getRequest(`conversations/${username}`);
    return res.conversations;
  }

  public static async getMessages(
    username: string,
    id: number,
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
    id: number
  ): Promise<createMessagesReturn> {
    const res = await this.postRequest(
      `${username}/conversation/${id}/message`,
      message
    );
    return res;
  }
}

export default directConversationsAPI;

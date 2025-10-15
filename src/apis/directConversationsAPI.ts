import API from "./api";
import type {
  savedMessage,
  conversationMessage,
} from "../types/conversationTypes";

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
  ): Promise<conversationMessage[]> {
    let res = await this.getRequest(`${username}/conversation/${id}/messages`, {
      unreadMessages,
    });
    return res.messages;
  }

  public static async createMessage(
    message: savedMessage,
    username: string,
    id: number
  ): Promise<any> {
    const res = await this.postRequest(
      `${username}/conversation/${id}/message`,
      message
    );
    return res;
  }
}

export default directConversationsAPI;

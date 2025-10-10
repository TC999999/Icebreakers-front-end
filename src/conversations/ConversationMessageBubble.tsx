import { useAppSelector } from "../features/hooks";
import type { conversationMessage } from "../types/conversationTypes";
import { DateTime } from "luxon";
import "../styles/ConversationMessageBubble.scss";

type Props = { conversationMessage: conversationMessage };

const ConversationMessageBubble: React.FC<Props> = ({
  conversationMessage,
}) => {
  const username = useAppSelector((store) => {
    return store.user.user?.username;
  });
  let newDate = DateTime.fromISO(conversationMessage.createdAt).toFormat(
    "MM/dd/yy, h:mm a"
  );
  return (
    <div
      className={`direct-message-bubble-window ${
        conversationMessage.username === username
          ? "self-bubble-window"
          : "other-bubble-window"
      }`}
    >
      <div
        className={`direct-message-bubble ${
          conversationMessage.username === username
            ? "self-bubble"
            : "other-bubble"
        }`}
      >
        <div>
          <p>{conversationMessage.content}</p>
          <small>{newDate}</small>
          <br />
          <small>From: {conversationMessage.username}</small>
        </div>
      </div>
      <div className={`bubble-tail`}></div>
    </div>
  );

  //   return (
  //     <table>
  //       <tr className="bubble-row">
  //         <td colSpan={6} className="bubble">
  //           <p>{conversationMessage.content}</p>
  //           <small>{newDate}</small>
  //         </td>
  //       </tr>
  //       <tr className="bubble-tail">
  //         <td className="tail">t</td>
  //         <td> </td>
  //         <td> </td>
  //         <td> </td>
  //         <td> </td>
  //         <td> </td>
  //       </tr>
  //     </table>
  //   );
};

export default ConversationMessageBubble;

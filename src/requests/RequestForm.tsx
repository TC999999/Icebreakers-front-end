import { type JSX } from "react";
import { type directConversationRequestPair } from "../types/requestTypes";
import useRequestForm from "./hooks/useRequestForm";

const RequestForm: React.FC<directConversationRequestPair> = ({
  requestedUser,
  requesterUser,
}): JSX.Element => {
  const { requestData, handleChange, handleSubmit } = useRequestForm(
    requestedUser,
    requesterUser
  );
  return (
    <div id="direct-conversation-request-form">
      <form onSubmit={handleSubmit}>
        <h1>Request to Chat with {requestedUser}</h1>
        <textarea
          name="content"
          id="content"
          onChange={handleChange}
          value={requestData.content}
          placeholder="Type a friendly message here"
          maxLength={200}
          rows={10}
          cols={40}
        />
        <button>Make Request!</button>
      </form>
    </div>
  );
};

export default RequestForm;

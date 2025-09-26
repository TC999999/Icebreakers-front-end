import { type JSX } from "react";
import { type directConversationRequestPair } from "../types/requestTypes";
import useRequestForm from "./hooks/useRequestForm";
import "../styles/RequestForm.scss";

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
        <div id="direct-conversation-request-message-div" className="form-div">
          <label htmlFor="content">
            Type a friendly message to {requestedUser}:{" "}
            <span id="required">*</span>
          </label>
          <textarea
            name="content"
            id="content"
            className="form-textarea"
            onChange={handleChange}
            value={requestData.content}
            required
            placeholder="Type a friendly message here"
            maxLength={100}
            rows={10}
            cols={40}
          />
        </div>
        <button className="submit-button">Make Request!</button>
      </form>
    </div>
  );
};

export default RequestForm;

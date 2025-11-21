import type { JSX } from "react";
import type { directConversationRequestPair } from "../types/requestTypes";
import useRequestForm from "./hooks/useRequestForm";
import "../styles/requests/RequestForm.scss";
import InputDirections from "../InputDirections";

// React Component for form to create a new direct conversation request with another user
const RequestForm: React.FC<directConversationRequestPair> = ({
  to,
  from,
}): JSX.Element => {
  const {
    requestData,
    validInputs,
    showDirections,
    currentErrorFlash,
    handleChange,
    handleSubmit,
    handleDirectionsFocus,
    handleDirectionsBlur,
  } = useRequestForm(to, from);
  return (
    <div id="direct-conversation-request-form">
      <form onSubmit={handleSubmit}>
        <h1>Request to Chat with {to}</h1>
        <div id="direct-conversation-request-message-div" className="form-div">
          <label htmlFor="content">
            Type a friendly message to {to}: <span id="required">*</span>
          </label>
          <textarea
            name="content"
            id="content"
            className={`form-textarea ${
              currentErrorFlash.content ? "error-flash" : ""
            }`}
            onChange={handleChange}
            value={requestData.content}
            placeholder="Type a friendly message here"
            maxLength={100}
            rows={10}
            cols={40}
            onFocus={handleDirectionsFocus}
            onBlur={handleDirectionsBlur}
            autoComplete="off"
          />

          <InputDirections
            type="content"
            validInputs={validInputs.content}
            showDirections={showDirections}
            onBottom={true}
          />
        </div>
        <button className="submit-button">Make Request!</button>
      </form>
    </div>
  );
};

export default RequestForm;

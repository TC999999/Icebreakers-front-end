import type { JSX } from "react";
import "../styles/conversations/EditConversation.scss";
import type {
  currentConversation,
  returnUpdateConversation,
} from "../types/conversationTypes";
import useEditConversation from "./hooks/useEditConversation";

type Props = {
  show: boolean;
  currentConversation: currentConversation;
  hideForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
  ) => void;
  updateConversations: (newConversation: returnUpdateConversation) => void;
};

// form component for editing a single conversation's title
const EditConversation: React.FC<Props> = ({
  show,
  currentConversation,
  hideForm,
  updateConversations,
}): JSX.Element | null => {
  const { formData, handleChange, handleSubmit, handleCancel } =
    useEditConversation({
      show,
      currentConversation,
      hideForm,
      updateConversations,
    });

  return show ? (
    <div className="modal-transparent modal-background">
      <div className="modal-content" id="edit-conversation-content">
        <h1>Edit Conversation with {currentConversation.recipient}</h1>
        <div id="edit-form">
          <form onSubmit={handleSubmit}>
            <div id="title-input" className="form-div">
              <label htmlFor="title">
                Title:
                <input
                  className="form-input"
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter New Title Here"
                  value={formData.title}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="button-row">
              <button
                type="button"
                className="cancel-button"
                onClick={(e) => handleCancel(e)}
              >
                Cancel
              </button>
              <button type="submit" className="submit-button">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditConversation;

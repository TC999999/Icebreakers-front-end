import useGroupInvite from "./hooks/useGroupInvite";
import "../styles/groups/GroupInvite.scss";
import InputDirections from "../InputDirections";

// React component for form to create an invitation to allow another user into a group that you are
// a member of already
const GroupInvite = () => {
  const {
    formData,
    groupList,
    validInputs,
    showDirections,
    currentErrorFlash,
    handleChange,
    handleSubmit,
    handleDirectionsFocus,
    handleDirectionsEnter,
    handleDirectionsBlur,
    handleDirectionsExit,
  } = useGroupInvite();

  return (
    <main id="group-invite-form-page">
      <header>
        <h1>Send Invitation to {formData.to}</h1>
      </header>
      <div id="invitation-form-div">
        <form onSubmit={handleSubmit}>
          <div className="form-div">
            <label htmlFor="content">
              Type a friendly message to {formData.to}:
              <span title="required field" className="required">
                *
              </span>
            </label>
            <textarea
              name="content"
              id="content"
              className={`form-textarea ${
                currentErrorFlash.content ? "error-flash" : ""
              }`}
              cols={50}
              rows={10}
              maxLength={400}
              placeholder={`Type what you want ${formData.to} to know`}
              value={formData.content}
              onChange={handleChange}
              onFocus={handleDirectionsFocus}
              onBlur={handleDirectionsBlur}
            ></textarea>
            <InputDirections
              type="content"
              validInputs={validInputs.content}
              showDirections={showDirections}
              onBottom={true}
            />
          </div>
          <div
            id="group"
            className="form-div"
            onMouseEnter={handleDirectionsEnter}
            onMouseLeave={handleDirectionsExit}
          >
            <fieldset
              id="group-radio-div"
              className={currentErrorFlash.group ? "error-flash" : ""}
            >
              <legend>
                Which Group Are You Inviting Them Into?{" "}
                <span title="required field" className="required">
                  *
                </span>
              </legend>
              {groupList.map((g) => {
                return (
                  <div key={g.id} className="radio-div">
                    <label htmlFor={`group-radio-${g.id}`}>
                      {g.title}
                      <input
                        type="radio"
                        name="group"
                        id={`group-radio-${g.id}`}
                        value={g.id}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                );
              })}
            </fieldset>
            <InputDirections
              type="group"
              validInputs={validInputs.group}
              showDirections={showDirections}
              onBottom={true}
            />
          </div>

          <div id="button-div">
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default GroupInvite;

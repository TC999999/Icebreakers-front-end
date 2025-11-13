import useGroupInvite from "./hooks/useGroupInvite";
import "../styles/groups/GroupInvite.scss";
import InputDirections from "../InputDirections";

const GroupInvite = () => {
  const {
    formData,
    groupList,
    validInputs,
    showDirections,
    currentErrorFlash,
    handleChange,
    handleSubmit,
    handleMouseEnter,
    handleMouseExit,
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
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseExit}
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
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseExit}
          >
            <fieldset
              id="group-radio-div"
              className={currentErrorFlash.group ? "error-flash" : ""}
            >
              <legend>Which Group Are You Inviting Them Into?</legend>
              {groupList.map((g) => {
                return (
                  <div key={g.id} className="radio-div">
                    <label htmlFor="group">
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

import useGroupInvite from "./hooks/useGroupInvite";
import "../styles/groups/GroupInvite.scss";

const GroupInvite = () => {
  const { formData, groupList, handleChange, handleSubmit } = useGroupInvite();

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
              cols={50}
              rows={10}
              maxLength={400}
              placeholder={`Type what you want ${formData.to} to know`}
              value={formData.content}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div id="group-radio-wrapper">
            <fieldset id="group-radio-div">
              <legend>Which Group Are You Inviting Them Into?</legend>
              {groupList.map((g) => {
                return (
                  <div key={g.id} className="radio-div">
                    <input
                      type="radio"
                      name="group"
                      id={`group-radio-${g.id}`}
                      value={g.id}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="group">{g.title}</label>
                  </div>
                );
              })}
            </fieldset>
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

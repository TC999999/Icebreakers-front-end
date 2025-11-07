import useGroupRequest from "./hooks/useGroupRequest";
import "../styles/groups/GroupRequest.scss";

const GroupRequest = () => {
  const { formData, groupData, handleChange, handleSubmit } = useGroupRequest();
  return (
    <main id="group-request-form-page">
      <header>
        <h1>Make A Request to Join</h1>
        <h1>{groupData.title}</h1>
        <h2>
          This request will only be seen by the host of this group:{" "}
          {groupData.host}
        </h2>
      </header>

      <section id="group-request-form-window">
        <form onSubmit={handleSubmit}>
          <div className="form-div">
            <label htmlFor="content">
              Type a friendly message to {groupData.host}
            </label>
            <textarea
              name="content"
              id="content"
              cols={50}
              rows={10}
              placeholder={`What do you want ${groupData.host} to know about yourself?`}
              value={formData.content}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div id="button-div">
            <button className="submit-button">Send Request</button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default GroupRequest;

import useGroupRequest from "./hooks/useGroupRequest";

const GroupRequest = () => {
  const { formData, handleChange, handleSubmit } = useGroupRequest();
  return (
    <main>
      <header>
        <h1>Make A Request to Join</h1>
        <h2>This request will only be seen by the host of this group</h2>
      </header>

      <section id="group-request-form-window">
        <form onSubmit={handleSubmit}>
          <div className="form-div">
            <label htmlFor="content">Type a friendly message to the host</label>
            <textarea
              name="content"
              id="content"
              cols={50}
              rows={10}
              placeholder="What do you want the host to know about yourself?"
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

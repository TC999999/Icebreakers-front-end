import useCreateGroupForm from "./hooks/useCreateGroupForm";
import "../styles/groups/CreateGroupForm.scss";

const CreateGroupForm = () => {
  const {
    formData,
    interestsList,
    handleChange,
    handleCheckBox,
    handleSubmit,
  } = useCreateGroupForm();
  return (
    <main id="create-group-form-page">
      <header>
        <h1>Create a New Group</h1>
      </header>
      <div id="create-group-form">
        <form onSubmit={handleSubmit}>
          <div className="form-div">
            <label htmlFor="title">
              Group Title:
              <input
                className="form-input"
                type="text"
                name="title"
                id="title"
                placeholder="Type the title of your group"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className="form-div">
            <label htmlFor="host">
              Group Host:
              <input
                className="form-input"
                type="text"
                name="host"
                id="host"
                value={formData.host}
                onChange={handleChange}
                required
                readOnly
              />
            </label>
          </div>
          <div className="form-div">
            <label htmlFor="description">Group Description: </label>
            <textarea
              name="description"
              id="description"
              cols={40}
              rows={10}
              required
              maxLength={400}
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div id="interests-div">
            <h3>Interests:</h3>
            <ul>
              {Object.values(interestsList.current).map((i) => {
                return (
                  <li key={`interest-${i.id}`}>
                    <label htmlFor={`interest-${i.id}`}>{i.topic}</label>
                    <input
                      type="checkbox"
                      name={`interest-${i.id}`}
                      id={`interest-${i.id}`}
                      value={i.id}
                      onChange={handleCheckBox}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
          <div id="buttons">
            <button className="submit-button">Make Group</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateGroupForm;

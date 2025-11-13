import useCreateGroupForm from "./hooks/useCreateGroupForm";
import "../styles/groups/CreateGroupForm.scss";
import InputDirections from "../InputDirections";

const CreateGroupForm = () => {
  const {
    formData,
    interestList,
    showDirections,
    validInputs,
    currentErrorFlash,
    handleChange,
    handleCheckBox,
    handleSubmit,
    handleMouseEnter,
    handleMouseExit,
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
                className={`form-input ${
                  currentErrorFlash.title ? "error-flash" : ""
                }`}
                type="text"
                name="title"
                id="title"
                placeholder="Type the title of your group"
                value={formData.title}
                onChange={handleChange}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseExit}
              />
            </label>
            <InputDirections
              type="title"
              validInputs={validInputs.title}
              showDirections={showDirections}
              onBottom={true}
            />
          </div>
          <div className="form-div">
            <label htmlFor="description">Group Description: </label>
            <textarea
              name="description"
              id="description"
              className={`form-textarea ${
                currentErrorFlash.description ? "error-flash" : ""
              }`}
              cols={40}
              rows={10}
              maxLength={400}
              placeholder="Type a short description about what you want this group to be about."
              value={formData.description}
              onChange={handleChange}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseExit}
            ></textarea>

            <InputDirections
              type="description"
              validInputs={validInputs.description}
              showDirections={showDirections}
              onBottom={true}
            />
          </div>
          <div
            id="interests"
            className="form-div"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseExit}
          >
            <fieldset
              id="interests-div"
              className={currentErrorFlash.title ? "error-flash" : ""}
            >
              <legend>Interests:</legend>

              {Object.values(interestList).map((i) => {
                return (
                  <div className="interest-check" key={`interest-${i.id}`}>
                    <label htmlFor={`interest-${i.id}`}>
                      {i.topic}
                      <input
                        type="checkbox"
                        name={`interest-${i.id}`}
                        id={`interest-${i.id}`}
                        value={i.id}
                        onChange={handleCheckBox}
                      />
                    </label>
                  </div>
                );
              })}
            </fieldset>
            <InputDirections
              type="interests"
              validInputs={validInputs.interests}
              showDirections={showDirections}
              onBottom={true}
            />
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

import type { JSX } from "react";
import useEditUser from "./hooks/useEditUser";
import "../styles/users/EditUser.scss";
import InputDirections from "../InputDirections";

// React component that contains form for editing the current user; can update a user's current email
// address, user biography, and their list of interests
const EditUser = (): JSX.Element => {
  const {
    userData,
    interestsList,
    validInputs,
    showDirections,
    currentErrorFlash,
    checkUserInterests,
    handleChange,
    handleSubmit,
    handleReset,
    handleCheckBox,
    handleDirectionsFocus,
    handleDirectionsEnter,
    handleDirectionsBlur,
    handleDirectionsExit,
  } = useEditUser();
  return (
    <main id="edit-user-page">
      <div id="edit-user-form">
        <header>
          <h1>Edit Your Profile Here!</h1>
        </header>
        <form onSubmit={handleSubmit}>
          <div id="email-div" className="form-div">
            <label htmlFor="emailAddress">
              Email Address:{" "}
              <span title="required field" className="required">
                *
              </span>
            </label>
            <input
              className={`form-input ${
                currentErrorFlash.emailAddress ? "error-flash" : ""
              }`}
              type="text"
              name="emailAddress"
              id="emailAddress"
              value={userData.emailAddress}
              onChange={handleChange}
              onFocus={handleDirectionsFocus}
              onBlur={handleDirectionsBlur}
            />

            <InputDirections
              type="emailAddress"
              showDirections={showDirections}
              validInputs={validInputs.emailAddress}
              onBottom={true}
            />
          </div>
          <div id="favorite-color-div" className="form-div">
            <label htmlFor="favoriteColor">Favorite Color:</label>
            <input
              type="color"
              name="favoriteColor"
              id="favoriteColor"
              value={userData.favoriteColor}
              onChange={handleChange}
            />
          </div>
          <div id="biography-div" className="form-div">
            <label htmlFor="biography">
              Write a short paragraph about yourself{" "}
              <span title="required field" className="required">
                *
              </span>
            </label>
            <textarea
              name="biography"
              id="biography"
              className={`form-textarea ${
                currentErrorFlash.biography ? "error-flash" : ""
              }`}
              maxLength={200}
              cols={40}
              rows={10}
              value={userData.biography}
              onChange={handleChange}
              onFocus={handleDirectionsFocus}
              onBlur={handleDirectionsBlur}
            ></textarea>

            <InputDirections
              type="biography"
              showDirections={showDirections}
              validInputs={validInputs.biography}
              onBottom={true}
            />
          </div>

          <div
            id="interests"
            className="form-div"
            onMouseEnter={handleDirectionsEnter}
            onMouseLeave={handleDirectionsExit}
          >
            <fieldset
              id="interests-div"
              className={currentErrorFlash.interests ? "error-flash" : ""}
            >
              <legend id="interests-header">
                Select Your Interests{" "}
                <span title="required field" className="required">
                  *
                </span>
              </legend>

              {Object.values(interestsList.current).map((i) => (
                <div className="interest-check" key={`interest-${i.id}`}>
                  <label htmlFor={`interest-${i.id}`}>
                    {i.topic}
                    <input
                      type="checkbox"
                      name={`interest-${i.id}`}
                      id={`interest-${i.id}`}
                      value={i.id}
                      checked={checkUserInterests(i.id)}
                      onChange={handleCheckBox}
                    />
                  </label>
                </div>
              ))}
            </fieldset>

            <InputDirections
              type="interests"
              showDirections={showDirections}
              validInputs={validInputs.interests}
              onBottom={true}
            />
          </div>
          <div id="buttons-row">
            <button
              type="button"
              className="submit-button"
              onClick={handleReset}
            >
              Reset
            </button>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditUser;

import type { JSX } from "react";
import useEditUser from "./hooks/useEditUser";
import "../styles/users/EditUser.scss";

const EditUser = (): JSX.Element => {
  const {
    userData,
    interestsList,
    checkUserInterests,
    handleChange,
    handleSubmit,
    handleReset,
    handleCheckBox,
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
              Email Address:
              <input
                className="form-input"
                type="text"
                name="emailAddress"
                id="emailAddress"
                value={userData.emailAddress}
                onChange={handleChange}
              />
            </label>
          </div>
          <div id="biography-div" className="form-div">
            <label htmlFor="biography">
              Write a short paragraph about yourself
              <textarea
                name="biography"
                id="biography"
                maxLength={200}
                cols={40}
                rows={10}
                value={userData.biography}
                onChange={handleChange}
              ></textarea>
            </label>
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
          <fieldset id="interests-checklist">
            <legend id="interests-header">Select Your Interests</legend>

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

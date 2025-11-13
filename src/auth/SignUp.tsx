import { type JSX } from "react";
import useSignUp from "./hooks/useSignUp";
import "../styles/auth/SignUp.scss";
import InputDirections from "../InputDirections";

const SignUp = (): JSX.Element => {
  const {
    formData,
    initialInterests,
    currentErrorFlash,
    showDirections,
    validInputs,
    serverError,
    handleChange,
    handleCheckbox,
    handleMouseEnter,
    handleMouseExit,
    handleSubmit,
  } = useSignUp();
  return (
    <div id="signup-page">
      <div id="signup-form">
        <form onSubmit={handleSubmit}>
          <h1>Sign Up Here!</h1>
          <h3>(Hover your cursor over a required field to see requirements)</h3>
          <div id="form-inputs">
            <div id="left-side">
              <div id="username-div" className="form-div">
                <label htmlFor="username">
                  Username:{" "}
                  <span title="required field" className="required">
                    *
                  </span>
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className={`form-input ${
                    currentErrorFlash.username ? "error-flash" : ""
                  }`}
                  placeholder="Enter your username here"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="off"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseExit}
                />
                <InputDirections
                  type="username"
                  showDirections={showDirections}
                  validInputs={validInputs.username}
                  onBottom={false}
                />
              </div>
              <div id="password-div" className="form-div">
                <label htmlFor="password">
                  Password:{" "}
                  <span title="required field" className="required">
                    *
                  </span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`form-input ${
                    currentErrorFlash.password ? "error-flash" : ""
                  }`}
                  placeholder="Enter your password here"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="off"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseExit}
                />
                <InputDirections
                  type="password"
                  showDirections={showDirections}
                  validInputs={validInputs.password}
                  onBottom={false}
                />
              </div>
              <div id="email-address-div" className="form-div">
                <label htmlFor="emailAddress">
                  Email Address:{" "}
                  <span title="required field" className="required">
                    *
                  </span>
                </label>
                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="text"
                  className={`form-input ${
                    currentErrorFlash.emailAddress ? "error-flash" : ""
                  }`}
                  placeholder="Enter your email address here"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  autoComplete="off"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseExit}
                />

                <InputDirections
                  type="emailAddress"
                  showDirections={showDirections}
                  validInputs={validInputs.emailAddress}
                  onBottom={false}
                />
              </div>
              <div id="favorite-color-div" className="form-div">
                <label htmlFor="favoriteColor">Favorite Color:</label>
                <input
                  id="favoriteColor"
                  name="favoriteColor"
                  type="color"
                  value={formData.favoriteColor}
                  onChange={handleChange}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseExit}
                />
              </div>
            </div>
            <div id="right-side">
              <div id="biography-div" className="form-div">
                <label htmlFor="biography">
                  Write a short paragraph about yourself:{" "}
                  <span title="required field" className="required">
                    *
                  </span>
                </label>
                <textarea
                  id="biography"
                  name="biography"
                  className={`form-textarea ${
                    currentErrorFlash.biography ? "error-flash" : ""
                  }`}
                  placeholder="Tell us about yourself (Maximum 200 characters)."
                  value={formData.biography}
                  onChange={handleChange}
                  maxLength={200}
                  rows={10}
                  cols={40}
                  autoComplete="off"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseExit}
                />
                <InputDirections
                  type="biography"
                  showDirections={showDirections}
                  validInputs={validInputs.biography}
                  onBottom={true}
                />
              </div>
              <div
                className="form-div"
                id="interests"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseExit}
              >
                <fieldset
                  id="interests-div"
                  className={currentErrorFlash.interests ? "error-flash" : ""}
                >
                  <legend>
                    Interests
                    <span title="required field" className="required">
                      *
                    </span>
                  </legend>
                  {initialInterests.map((i) => {
                    return (
                      <div
                        className="checkbox-div"
                        id="interests"
                        key={`option${i.id}`}
                      >
                        <label htmlFor={`option${i.id}`}>
                          {i.topic}
                          <input
                            type="checkbox"
                            name={`option${i.id}`}
                            id={`option${i.id}`}
                            value={i.id}
                            onChange={handleCheckbox}
                          />
                        </label>
                      </div>
                    );
                  })}
                </fieldset>
                <InputDirections
                  type="interests"
                  showDirections={showDirections}
                  validInputs={validInputs.interests}
                  onBottom={true}
                />
              </div>
            </div>
          </div>
          <div id="submit-button">
            <button className="submit-button">Register!</button>
          </div>

          <div id="error-message">
            <h2>{serverError}</h2>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

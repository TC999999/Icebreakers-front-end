import { type JSX } from "react";
import useSignUp from "./hooks/useSignUp";
import "../styles/SignUp.scss";

const SignUp = (): JSX.Element => {
  const { formData, handleChange, handleSubmit } = useSignUp();
  return (
    <div id="signup-page">
      <div id="signup-form">
        <form onSubmit={handleSubmit}>
          <h1>Sign Up Here!</h1>
          <div id="username-div" className="form-div">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-input"
              placeholder="Enter your username here"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div id="password-div" className="form-div">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="Enter your password here"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div id="email-address-div" className="form-div">
            <label htmlFor="emailAddress">Email Address:</label>
            <input
              id="emailAddress"
              name="emailAddress"
              type="text"
              className="form-input"
              placeholder="Enter your email address here"
              value={formData.emailAddress}
              onChange={handleChange}
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
            />
          </div>
          <div id="biography-div" className="form-div">
            <label htmlFor="biography">
              Write a short paragraph about yourself:{" "}
            </label>
            <textarea
              id="biography"
              name="biography"
              placeholder="Tell us about yourself (Maximum 200 characters)."
              value={formData.biography}
              onChange={handleChange}
              maxLength={200}
              rows={10}
              cols={40}
            />{" "}
          </div>
          <div id="submit-button">
            <button className="submit-button">Register!</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

import { type JSX } from "react";
import useSignUp from "./hooks/useSignUp";

const SignUp = (): JSX.Element => {
  const { formData, handleChange, handleSubmit } = useSignUp();
  return (
    <div id="signup-page">
      <div id="signup-form">
        <form onSubmit={handleSubmit}>
          <div id="username-div" className="form-div">
            <label htmlFor="username">
              Username:
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username here"
                value={formData.username}
                onChange={handleChange}
              />
            </label>
          </div>
          <div id="password-div" className="form-div">
            <label htmlFor="password">
              Password:
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password here"
                value={formData.password}
                onChange={handleChange}
              />
            </label>
          </div>
          <div id="email-address-div" className="form-div">
            <label htmlFor="emailAddress">
              Email Address:
              <input
                id="emailAddress"
                name="emailAddress"
                type="text"
                placeholder="Enter your email address here"
                value={formData.emailAddress}
                onChange={handleChange}
              />
            </label>
          </div>
          <div id="favorite-color-div" className="form-div">
            <label htmlFor="favoriteColor">
              Favorite Color:
              <input
                id="favoriteColor"
                name="favoriteColor"
                type="color"
                value={formData.favoriteColor}
                onChange={handleChange}
              />
            </label>
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

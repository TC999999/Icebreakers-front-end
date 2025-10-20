import { type JSX } from "react";
import useLogIn from "./hooks/useLogin";
import "../styles/auth/LogIn.scss";

const LogIn = (): JSX.Element => {
  const { formData, error, handleChange, handleSubmit } = useLogIn();
  return (
    <div id="login-page">
      <div id="login-form">
        <form onSubmit={handleSubmit}>
          <h1>Log In Here!</h1>
          <div id="username-div" className="form-div">
            <label htmlFor="username">
              Username:
              <input
                className="form-input"
                type="text"
                placeholder="Enter Your Username Here"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                maxLength={30}
              />
            </label>
          </div>
          <div id="password-div" className="form-div">
            <label htmlFor="password">
              Password:
              <input
                className="form-input"
                type="password"
                placeholder="Enter Your Password Here"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                maxLength={30}
              />
            </label>
          </div>
          <div id="error-message">
            <h3>{error}</h3>
          </div>
          <div id="button-div">
            <button className="submit-button">Log In!</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogIn;

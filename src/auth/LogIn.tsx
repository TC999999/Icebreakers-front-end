import { type JSX } from "react";
import useLogIn from "./hooks/useLogin";

const LogIn = (): JSX.Element => {
  const { formData, handleChange, handleSubmit } = useLogIn();
  return (
    <div id="login-page">
      <div id="login-form-div">
        <form onSubmit={handleSubmit}>
          <div id="username-div" className="form-div">
            <label htmlFor="username">
              <input
                className="input"
                type="text"
                placeholder="username goes here"
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
              <input
                className="input"
                type="password"
                placeholder="password goes here"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                maxLength={30}
              />
            </label>
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

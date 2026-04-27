import type { JSX } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { useAppSelector } from "../features/hooks";
import type { ReduxAuthState } from "../types/authTypes";
import { shallowEqual } from "react-redux";
import "../styles/Welcome.scss";

// React component for welcome message when the user first arrives on the app
const Welcome = (): JSX.Element => {
  const navigate: NavigateFunction = useNavigate();
  const { user }: ReduxAuthState = useAppSelector(
    (store) => store.user,
    shallowEqual,
  );
  return (
    <main id="welcome-page">
      <h1 id="tagline">Icebreakers: Find your People!</h1>
      <div id="starting-point">
        <section id="welcome-message">
          <h3>
            {user
              ? `Welcome back, ${user.username}!`
              : "Welcome to Icebreakers!"}
          </h3>
        </section>
        <section id="description">
          Here on Icebreakers, you can find people who have similar interests
          and invite them to chat. We'll recommend people who you may want to
          chat with based on mutual interests, but you can also search for
          people and request conversations from them as well.
        </section>
      </div>
      {!user && (
        <button id="login-button" onClick={() => navigate("/login")}>
          Log In/Register Here
        </button>
      )}
    </main>
  );
};

export default Welcome;

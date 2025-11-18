import { type JSX } from "react";
import Welcome from "./Welcome";

// React component for initial home page the user sees after logging in
const HomePage = (): JSX.Element => {
  return (
    <div id="homepage">
      <Welcome />
    </div>
  );
};

export default HomePage;

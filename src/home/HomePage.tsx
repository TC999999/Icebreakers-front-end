import { type JSX } from "react";
import Welcome from "./Welcome";

const HomePage = (): JSX.Element => {
  return (
    <div id="homepage">
      <Welcome />
    </div>
  );
};

export default HomePage;

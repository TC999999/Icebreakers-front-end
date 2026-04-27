import { useNavigate, type NavigateFunction } from "react-router-dom";
import authNavigateMap from "../helpers/maps/authNavigate";
import "../styles/auth/AuthNavigate.scss";

type Props = { type: "register" | "login" };

// reusable component for login and registration pages to the other page
const AuthNavigate = ({ type }: Props) => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <span id="auth-navigate">
      {authNavigateMap[type].message}
      <button id="link-button" onClick={() => navigate(`/${type}`)}>
        {authNavigateMap[type].link}
      </button>
    </span>
  );
};

export default AuthNavigate;

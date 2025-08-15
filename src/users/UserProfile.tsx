import useUserProfile from "./hooks/useUserProfile";
import { MdPerson } from "react-icons/md";
import "../styles/UserProfile.scss";

const UserProfile = () => {
  const { userState } = useUserProfile();
  return (
    <main id="user-profile-page">
      <section id="user-profile-introduction">
        <div id="user-header" className="profile-section">
          <div
            id="profile-pic"
            style={{ backgroundColor: userState.favoriteColor }}
          >
            <MdPerson />
          </div>
          <h2>{userState.username}</h2>
        </div>
        <article id="user-biography" className="profile-section">
          <h3>About {userState.username}</h3>
          <p>{userState.biography}</p>
        </article>
        <div id="interests-list" className="profile-section">
          <h4>Interests Include:</h4>
          <ul>
            {userState.interests.map((i, index) => {
              return <li key={`interest-${index}`}>{i}</li>;
            })}
          </ul>
        </div>
        <div id="additional-info">
          <small>
            <b>Joined On: </b>
            {userState.createdAt}
          </small>
        </div>
      </section>
    </main>
  );
};

export default UserProfile;

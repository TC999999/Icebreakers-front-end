import Skeleton from "react-loading-skeleton";
import { MdPerson } from "react-icons/md";

import "../../styles/users/UserProfile.scss";

const UserProfileSkeleton = () => {
  return (
    <main id="user-profile-page">
      <section id="user-profile-introduction">
        <div id="user-header" className="profile-section">
          <div id="profile-pic">
            <MdPerson />
          </div>
          <h2>
            <Skeleton />
          </h2>
        </div>
        <div id="about-user">
          <section id="user-biography" className="profile-section">
            <h3>
              <Skeleton />
            </h3>
            <p>
              <Skeleton />
            </p>
          </section>
          <section id="interests-list" className="profile-section">
            <h4>Interests Include:</h4>
            <ul>
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <li key={i}>
                    <Skeleton />
                  </li>
                ))}
            </ul>
          </section>
        </div>
        <div id="additional-info">
          <small>
            <b>Joined On: </b>
            <Skeleton />
          </small>
        </div>

        <div id="button-row">
          <div>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        </div>
      </section>
    </main>
  );
};

export default UserProfileSkeleton;

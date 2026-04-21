type Props = {
  selectedNav: string;
  name: string;
  value: string;
  title: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  unreadNotifications?: number;
};

// reusable navigation button component, to be used with Navbar component
const NavButton: React.FC<Props> = ({
  selectedNav,
  name,
  value,
  title,
  onClick,
  unreadNotifications,
}) => {
  return (
    <div className="navlink">
      {unreadNotifications !== undefined && unreadNotifications > 0 && (
        <div className="notification-label">{unreadNotifications}</div>
      )}
      <button
        name={name}
        value={value}
        onClick={onClick}
        className={selectedNav === name ? "selectedNav" : ""}
      >
        {title}
      </button>
    </div>
  );
};

export default NavButton;

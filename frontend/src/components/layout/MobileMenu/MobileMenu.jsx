import { NavLink, Link } from "react-router-dom";

import "./MobileMenu.css";

const navItems = [
  {
    label: "Discover",
    path: "/discover",
  },
  {
    label: "Genres",
    path: "/categories",
  },
  {
    label: "Trending",
    path: "/popular",
  },
  {
    label: "Community",
    path: "/community",
  },
];

function MobileMenu({ isOpen, onClose }) {
  return (
    <div
      className={`lumora-mobile-menu ${
        isOpen ? "lumora-mobile-menu--open" : ""
      }`}
    >
      <nav
        className="lumora-mobile-menu__nav"
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `lumora-mobile-menu__link ${
                isActive
                  ? "lumora-mobile-menu__link--active"
                  : ""
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}

        <Link
          to="/become-writer"
          onClick={onClose}
          className="lumora-mobile-menu__link"
        >
          Become Writer
        </Link>

        <Link
          to="/login"
          onClick={onClose}
          className="lumora-mobile-menu__link"
        >
          Log in
        </Link>

        <Link
          to="/register"
          onClick={onClose}
          className="lumora-mobile-menu__signup"
        >
          Sign up
        </Link>
      </nav>
    </div>
  );
}

export default MobileMenu;
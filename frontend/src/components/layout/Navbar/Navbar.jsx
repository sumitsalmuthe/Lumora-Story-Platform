import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  Moon,
  Plus,
  Search,
  Sun,
  X,
} from "lucide-react";

import useTheme from "../../../context/ThemeContext/useTheme";
import useAuth from "../../../context/AuthContext/useAuth";
import MobileMenu from "../MobileMenu/MobileMenu";

import lumoraLogo from "../../../assets/logo/lumora-logo-bold.svg";

import "./Navbar.css";

/* =========================================================
   NAVIGATION DATA
========================================================= */

/* -------------------------
   GENRES
------------------------- */

const genreItems = [
  { label: "Fantasy", path: "/categories/fantasy" },
  { label: "Romance", path: "/categories/romance" },
  { label: "Mystery", path: "/categories/mystery" },
  { label: "Horror", path: "/categories/horror" },
  { label: "Thriller", path: "/categories/thriller" },
  { label: "Sci-Fi", path: "/categories/sci-fi" },
  { label: "Adventure", path: "/categories/adventure" },
  { label: "Drama", path: "/categories/drama" },
  { label: "Crime", path: "/categories/crime" },
  { label: "Historical", path: "/categories/historical" },
  { label: "Action", path: "/categories/action" },
  { label: "Supernatural", path: "/categories/supernatural" },
  { label: "Psychological", path: "/categories/psychological" },
  { label: "Poetry", path: "/categories/poetry" },
  { label: "Non-Fiction",  path: "/categories/nonfiction", },
  { label: "Fanfiction", path: "/categories/fanfiction" },
  { label: "Young Adult", path: "/categories/young-adult" },
  { label: "Comedy", path: "/categories/comedy" },
  { label: "Short Stories", path: "/categories/short-stories" },
  { label: "Paranormal", path: "/categories/paranormal" },
  { label: "Dystopian", path: "/categories/dystopian" },
  { label: "Coming of Age", path: "/categories/coming-of-age" },
  { label: "LGBTQ+", path: "/categories/lgbtq" },
];

/* -------------------------
   TRENDING
------------------------- */

const trendingItems = [
  {
    label: "Trending Now",
    path: "/trending/now",
  },
  {
    label: "Rising Stories",
    path: "/trending/rising",
  },
  {
    label: "Most Read",
    path: "/trending/most-read",
  },
  {
    label: "Most Liked",
    path: "/trending/most-liked",
  },
  {
    label: "Most Discussed",
    path: "/trending/most-discussed",
  },
  {
    label: "Popular This Week",
    path: "/trending/this-week",
  },
  {
    label: "New & Trending",
    path: "/trending/new",
  },
];


/* -------------------------
   COMMUNITY
------------------------- */

const communityItems = [
  {
    label: "Featured Communities",
    path: "/community/featured",
  },
  {
    label: "Writing Communities",
    path: "/community/writing",
  },
  {
    label: "Genre Communities",
    path: "/community/genres",
  },
  {
    label: "Popular Communities",
    path: "/community/popular",
  },
  {
    label: "New Communities",
    path: "/community/new",
  },
  {
    label: "My Communities",
    path: "/community/my",
  },
];

/* =========================================================
   SEARCH DATA
========================================================= */

const recentSearches = [
  "Fantasy",
  "Horror",
  "The Last Signal",
];

const trendingStories = [
  "Under a Dead Sky",
  "The Last Signal",
  "Where Shadows Sleep",
];

const popularAuthors = [
  "Aarav Mehta",
  "Mira Sen",
  "Riya Kapoor",
];

/* =========================================================
   LOGO
========================================================= */

function LumoraLogo() {
  return (
    <div className="navbar__logo-wrap">
      <img
        src={lumoraLogo}
        alt="Lumora"
        className="navbar__logo-image"
      />
    </div>
  );
}

/* =========================================================
   NAV DROPDOWN
========================================================= */

function NavDropdown({
  label,
  items,
  active,
  onToggle,
  columns = false,
  viewAllLabel,
  viewAllPath,
  createLabel,
  createPath,
}) {
  return (
    <div
      className={`navbar__dropdown ${
        active ? "navbar__dropdown--open" : ""
      }`}
    >
      <button
        type="button"
        className="navbar__dropdown-trigger"
        onClick={onToggle}
        aria-expanded={active}
      >
        <span>{label}</span>

        <ChevronDown
          size={14}
          strokeWidth={1.8}
        />
      </button>

      {active && (
        <div
          className={`navbar__dropdown-menu ${
            columns
              ? "navbar__dropdown-menu--wide"
              : ""
          }`}
        >
          {/* Dropdown Items */}

          <div
            className={
              columns
                ? "navbar__dropdown-grid"
                : "navbar__dropdown-list"
            }
          >
            {items.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="navbar__dropdown-item"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* View All */}

          {viewAllLabel && viewAllPath && (
            <Link
              to={viewAllPath}
              className="navbar__dropdown-view-all"
            >
              {viewAllLabel}
            </Link>
          )}

          {/* Create */}

          {createLabel && createPath && (
            <Link
              to={createPath}
              className="navbar__dropdown-create"
            >
              <Plus
                size={14}
                strokeWidth={2}
              />

              <span>{createLabel}</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SEARCH DROPDOWN
========================================================= */

function SearchDropdown({
  open,
  onClose,
}) {
  const searchRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={searchRef}
      className="navbar__search-dropdown"
    >
      {/* Search */}

      <Link
        to="/search"
        className="navbar__search-input"
        onClick={onClose}
      >
        <Search
          size={17}
          strokeWidth={1.8}
        />

        <span>
          Search stories, authors...
        </span>
      </Link>

      {/* Recent Searches */}

      <div className="navbar__search-section">
        <div className="navbar__search-heading">
          Recent Searches
        </div>

        {recentSearches.map((item) => (
          <Link
            key={item}
            to={`/search?q=${encodeURIComponent(
              item
            )}`}
            className="navbar__search-item"
            onClick={onClose}
          >
            <Search size={14} />

            <span>{item}</span>
          </Link>
        ))}
      </div>

      {/* Trending Stories */}

      <div className="navbar__search-section">
        <div className="navbar__search-heading">
          Trending Stories
        </div>

        {trendingStories.map((item) => (
          <Link
    key={item}
    to="/trending"
            className="navbar__search-item"
            onClick={onClose}
          >
            <span className="navbar__search-dot" />

            <span>{item}</span>
          </Link>
        ))}
      </div>

      {/* Popular Authors */}

      <div className="navbar__search-section">
        <div className="navbar__search-heading">
          Popular Authors
        </div>

        {popularAuthors.map((item) => (
          <Link
            key={item}
            to="/community"
            className="navbar__search-item"
            onClick={onClose}
          >
            <span className="navbar__author-avatar">
              {item
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)}
            </span>

            <span>{item}</span>
          </Link>
        ))}
      </div>

      {/* View All Search */}

      <Link
        to="/search"
        className="navbar__search-view-all"
        onClick={onClose}
      >
        View all search results
      </Link>
    </div>
  );
}

/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  const {
    user,
    isAuthenticated,
    isWriter,
    logout,
  } = useAuth();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    activeDropdown,
    setActiveDropdown,
  ] = useState(null);

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const navbarRef = useRef(null);

  /* -------------------------
     MOBILE
  ------------------------- */

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  /* -------------------------
     DROPDOWN
  ------------------------- */

  const toggleDropdown = (name) => {
    setSearchOpen(false);

    setActiveDropdown((current) =>
      current === name
        ? null
        : name
    );
  };

  /* -------------------------
     CLOSE EVERYTHING
  ------------------------- */

  const closeDropdowns = () => {
    setActiveDropdown(null);
    setSearchOpen(false);
  };

  /* -------------------------
     OUTSIDE CLICK
  ------------------------- */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(
          event.target
        )
      ) {
        closeDropdowns();
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  return (
    <header
      ref={navbarRef}
      className="navbar"
    >
      <div className="navbar__container">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          className="navbar__brand"
          onClick={() => {
            closeMobileMenu();
            closeDropdowns();
          }}
          aria-label="Lumora home"
        >
          <LumoraLogo />
        </Link>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav
          className="navbar__desktop-nav"
          aria-label="Main navigation"
        >

          {/* Discover */}

          <NavLink
            to="/discover"
            className={({ isActive }) =>
              `navbar__link ${
                isActive
                  ? "navbar__link--active"
                  : ""
              }`
            }
          >
            Discover
          </NavLink>

          {/* Genres */}

          <NavDropdown
            label="Genres"
            items={genreItems}
            active={
              activeDropdown === "genres"
            }
            onToggle={() =>
              toggleDropdown("genres")
            }
            columns
            viewAllLabel="View all genres"
            viewAllPath="/categories"
          />

          {/* Trending */}

          <NavDropdown
            label="Trending"
            items={trendingItems}
            active={
              activeDropdown === "trending"
            }
            onToggle={() =>
              toggleDropdown("trending")
            }
            viewAllLabel="View all trending"
viewAllPath="/trending"
          />

          {/* Community */}

          <NavDropdown
            label="Community"
            items={communityItems}
            active={
              activeDropdown === "community"
            }
            onToggle={() =>
              toggleDropdown("community")
            }
            viewAllLabel="Explore all communities"
            viewAllPath="/community"
            createLabel="Create a Community"
            createPath="/create-community"
          />
        </nav>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="navbar__actions">

          {/* Search */}

          <div className="navbar__search-wrapper">
            <button
              type="button"
              className={`navbar__icon-button ${
                searchOpen
                  ? "navbar__icon-button--active"
                  : ""
              }`}
              onClick={() => {
                setActiveDropdown(null);

                setSearchOpen(
                  (current) => !current
                );
              }}
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              <Search
                size={19}
                strokeWidth={1.8}
              />
            </button>

            <SearchDropdown
              open={searchOpen}
              onClose={() =>
                setSearchOpen(false)
              }
            />
          </div>

          {/* Theme */}

          <button
            type="button"
            className="navbar__icon-button"
            onClick={toggleTheme}
            aria-label={
              theme === "light"
                ? "Switch to dark theme"
                : "Switch to light theme"
            }
            title={
              theme === "light"
                ? "Switch to dark theme"
                : "Switch to light theme"
            }
          >
            {theme === "light" ? (
              <Moon
                size={19}
                strokeWidth={1.8}
              />
            ) : (
              <Sun
                size={19}
                strokeWidth={1.8}
              />
            )}
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to={isWriter ? "/writer/dashboard" : "/become-writer"}
                className="navbar__writer-link"
              >
                {isWriter ? "Write" : "Become Writer"}
              </Link>

              <Link
                to={`/profile/${user._id}`}
                className="navbar__login"
              >
                {user.username}
              </Link>

              <button
                type="button"
                className="navbar__signup"
                onClick={logout}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/become-writer"
                className="navbar__writer-link"
              >
                Become Writer
              </Link>

              <Link
                to="/login"
                className="navbar__login"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="navbar__signup"
              >
                Sign up
              </Link>
            </>
          )}

          {/* Mobile */}

          <button
            type="button"
            className="navbar__mobile-toggle"
            onClick={() =>
              setMobileOpen(
                (current) => !current
              )
            }
            aria-label={
              mobileOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X
                size={23}
                strokeWidth={1.8}
              />
            ) : (
              <Menu
                size={23}
                strokeWidth={1.8}
              />
            )}
          </button>
        </div>
      </div>

      {/* =================================================
          MOBILE MENU
      ================================================= */}

      <MobileMenu
        isOpen={mobileOpen}
        onClose={closeMobileMenu}
      />
    </header>
  );
}

export default Navbar;


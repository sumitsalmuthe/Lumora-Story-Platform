import { Link } from "react-router-dom";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";

import "./Footer.css";

const footerLinks = {
  Explore: [
    { label: "Discover", path: "/discover" },
    { label: "Categories", path: "/categories" },
    { label: "Popular", path: "/popular" },
    { label: "Search", path: "/search" },
  ],

  Community: [
    { label: "Community", path: "/community" },
    { label: "Become a Writer", path: "/become-writer" },
    { label: "About Lumora", path: "/about" },
  ],
};

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__main">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              Lumora
            </Link>

            <p className="footer__description">
              A place to read stories, discover new worlds, and share your
              own.
            </p>

            <div className="footer__socials">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="footer__social"
              >
                <FaGithub size={18} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="footer__social"
              >
                <FaLinkedinIn size={18} />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="footer__social"
              >
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="footer__links">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div className="footer__column" key={title}>
                <h3 className="footer__heading">{title}</h3>

                <nav aria-label={title}>
                  {links.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="footer__link"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
       <div className="footer__bottom">
  <p>
    © {new Date().getFullYear()} Lumora. All rights reserved.
  </p>

  <div className="footer__legal">
    <Link to="/privacy">Privacy</Link>
    <Link to="/terms">Terms</Link>
  </div>
</div>
      </div>
    </footer>
  );
}

export default Footer;
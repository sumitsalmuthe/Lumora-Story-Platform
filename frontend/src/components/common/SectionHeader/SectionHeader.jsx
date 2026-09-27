import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import "./SectionHeader.css";

function SectionHeader({
  title,
  description,
  viewAllPath,
  viewAllLabel = "View all",
  align = "between",
  className = "",
}) {
  return (
    <div
      className={`lumora-section-header lumora-section-header--${align} ${className}`}
    >
      <div className="lumora-section-header__content">
        <h2 className="lumora-section-header__title">
          {title}
        </h2>

        {description && (
          <p className="lumora-section-header__description">
            {description}
          </p>
        )}
      </div>

      {viewAllPath && (
        <Link
          to={viewAllPath}
          className="lumora-section-header__link"
        >
          {viewAllLabel}
          <FaArrowRight size={11} />
        </Link>
      )}
    </div>
  );
}

export default SectionHeader;
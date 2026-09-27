import { FaBookOpen } from "react-icons/fa";

import "./EmptyState.css";

function EmptyState({
  icon,
  title = "Nothing here yet",
  description = "There is nothing to show right now.",
  action = null,
  className = "",
}) {
  return (
    <section
      className={`lumora-empty-state ${className}`}
      aria-label={title}
    >
      <div className="lumora-empty-state__icon">
        {icon || <FaBookOpen size={22} />}
      </div>

      <h2 className="lumora-empty-state__title">
        {title}
      </h2>

      <p className="lumora-empty-state__description">
        {description}
      </p>

      {action && (
        <div className="lumora-empty-state__action">
          {action}
        </div>
      )}
    </section>
  );
}

export default EmptyState;
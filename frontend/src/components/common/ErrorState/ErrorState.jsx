import { FaExclamationCircle, FaRedo } from "react-icons/fa";

import Button from "../Button/Button";

import "./ErrorState.css";

function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
  retryLabel = "Try again",
  icon,
  className = "",
}) {
  return (
    <section
      className={`lumora-error-state ${className}`}
      role="alert"
    >
      <div className="lumora-error-state__icon">
        {icon || <FaExclamationCircle size={22} />}
      </div>

      <h2 className="lumora-error-state__title">
        {title}
      </h2>

      <p className="lumora-error-state__description">
        {description}
      </p>

      {onRetry && (
        <div className="lumora-error-state__action">
          <Button
            variant="outline"
            onClick={onRetry}
          >
            <FaRedo size={12} />
            {retryLabel}
          </Button>
        </div>
      )}
    </section>
  );
}

export default ErrorState;
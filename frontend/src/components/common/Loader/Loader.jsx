import "./Loader.css";

function Loader({
  size = "medium",
  label = "Loading...",
  showLabel = false,
  fullPage = false,
}) {
  return (
    <div
      className={`lumora-loader ${
        fullPage ? "lumora-loader--full-page" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span
        className={`lumora-loader__spinner lumora-loader__spinner--${size}`}
        aria-hidden="true"
      />

      {showLabel && (
        <span className="lumora-loader__label">
          {label}
        </span>
      )}
    </div>
  );
}

export default Loader;
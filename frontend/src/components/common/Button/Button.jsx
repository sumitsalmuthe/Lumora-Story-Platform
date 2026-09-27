import "./Button.css";

function Button({
  children,
  variant = "primary",
  size = "medium",
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = "",
}) {
  const classes = [
    "lumora-button",
    `lumora-button--${variant}`,
    `lumora-button--${size}`,
    fullWidth ? "lumora-button--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <span className="lumora-button__loader" aria-label="Loading" />
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
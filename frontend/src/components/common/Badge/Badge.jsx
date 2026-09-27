import "./Badge.css";

function Badge({
  children,
  variant = "default",
  size = "medium",
  className = "",
}) {
  const classes = [
    "lumora-badge",
    `lumora-badge--${variant}`,
    `lumora-badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {children}
    </span>
  );
}

export default Badge;
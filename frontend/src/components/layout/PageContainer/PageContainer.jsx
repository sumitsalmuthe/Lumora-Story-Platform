import "./PageContainer.css";

function PageContainer({
  children,
  size = "default",
  className = "",
}) {
  const classes = [
    "lumora-page-container",
    `lumora-page-container--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {children}
    </div>
  );
}

export default PageContainer;
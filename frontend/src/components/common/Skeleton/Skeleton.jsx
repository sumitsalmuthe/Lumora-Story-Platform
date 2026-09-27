import "./Skeleton.css";

function Skeleton({
  width = "100%",
  height = "20px",
  radius = "var(--radius-sm)",
  className = "",
}) {
  return (
    <span
      className={`lumora-skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius: radius,
      }}
      aria-hidden="true"
    />
  );
}

export default Skeleton;
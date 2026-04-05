export default function PortalMenuToggle({
  onClick,
  className = "",
  label = "Menu",
}) {
  const classes = `portal-user-sidebar-toggle portal-user-menu-toggle ${className}`.trim();

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      aria-label="Open portal menu"
    >
      <span className="portal-menu-icon" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span>{label}</span>
    </button>
  );
}

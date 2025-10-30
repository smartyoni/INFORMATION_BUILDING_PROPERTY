export function MapleFrame({ children, className = '', title = null }) {
  return (
    <div className={`maple-frame ${className}`}>
      {title && (
        <div className="maple-header">
          {title}
        </div>
      )}
      <div className={title ? 'p-4' : 'p-4'}>
        {children}
      </div>
    </div>
  );
}

export function MapleButton({
  children,
  onClick,
  className = '',
  active = false,
  disabled = false
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`maple-button ${active ? 'active' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

export function MapleTab({
  children,
  onClick,
  active = false,
  className = ''
}) {
  return (
    <button
      onClick={onClick}
      className={`maple-tab ${active ? 'active' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

export function MapleCard({ children, className = '', onClick = null }) {
  return (
    <div
      className={`maple-card cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function MapleDivider() {
  return <div className="maple-divider"></div>;
}

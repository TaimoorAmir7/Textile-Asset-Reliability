export function StatusBadge({ children, tone = children }) {
  const className = String(tone).toLowerCase().replaceAll(' ', '-');
  return <span className={`badge ${className}`}><i />{children}</span>;
}

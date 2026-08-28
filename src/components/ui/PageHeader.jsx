export function PageHeader({ eyebrow, title, subtitle, actions }) {
  return <div className="page-head">
    <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>
    {actions && <div className="head-actions">{actions}</div>}
  </div>;
}

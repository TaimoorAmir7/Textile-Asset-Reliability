export function MachineReference({ src, alt, label='Anatomy reference', className='' }) {
  return <div className={`machine-reference ${className}`}><img src={src} alt={alt} /><span>{label}</span></div>;
}

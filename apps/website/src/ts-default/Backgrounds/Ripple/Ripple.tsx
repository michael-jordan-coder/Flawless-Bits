import './Ripple.css';

export interface RippleProps {
  className?: string;
}

export default function Ripple({ className = '' }: RippleProps) {
  return <div className={`ripple-root ${className}`}>Ripple component</div>;
}

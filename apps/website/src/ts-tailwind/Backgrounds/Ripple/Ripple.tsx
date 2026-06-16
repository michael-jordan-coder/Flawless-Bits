export interface RippleProps {
  className?: string;
}

export default function Ripple({ className = '' }: RippleProps) {
  return (
    <div className={`flex items-center justify-center p-4 text-white ${className}`}>Ripple component</div>
  );
}

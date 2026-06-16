import './SpeedDial.css';

export interface SpeedDialProps {
  className?: string;
}

export default function SpeedDial({ className = '' }: SpeedDialProps) {
  return <div className={`speed-dial-root ${className}`}>Speed Dial component</div>;
}

export interface SpeedDialProps {
  className?: string;
}

export default function SpeedDial({ className = '' }: SpeedDialProps) {
  return (
    <div className={`flex items-center justify-center p-4 text-white ${className}`}>Speed Dial component</div>
  );
}

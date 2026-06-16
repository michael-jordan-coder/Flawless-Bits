export interface FlipCardProps {
  className?: string;
}

export default function FlipCard({ className = '' }: FlipCardProps) {
  return (
    <div className={`flex items-center justify-center p-4 text-white ${className}`}>Flip Card component</div>
  );
}

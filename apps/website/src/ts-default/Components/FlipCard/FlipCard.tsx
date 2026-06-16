import './FlipCard.css';

export interface FlipCardProps {
  className?: string;
}

export default function FlipCard({ className = '' }: FlipCardProps) {
  return <div className={`flip-card-root ${className}`}>Flip Card component</div>;
}

import './TagInput.css';

export interface TagInputProps {
  className?: string;
}

export default function TagInput({ className = '' }: TagInputProps) {
  return <div className={`tag-input-root ${className}`}>Tag Input component</div>;
}

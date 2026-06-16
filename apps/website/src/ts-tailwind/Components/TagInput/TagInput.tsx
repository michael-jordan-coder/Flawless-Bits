export interface TagInputProps {
  className?: string;
}

export default function TagInput({ className = '' }: TagInputProps) {
  return (
    <div className={`flex items-center justify-center p-4 text-white ${className}`}>Tag Input component</div>
  );
}

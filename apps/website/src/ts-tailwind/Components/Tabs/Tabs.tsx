export interface TabsProps {
  className?: string;
}

export default function Tabs({ className = '' }: TabsProps) {
  return (
    <div className={`flex items-center justify-center p-4 text-white ${className}`}>Tabs component</div>
  );
}

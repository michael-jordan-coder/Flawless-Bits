import './Tabs.css';

export interface TabsProps {
  className?: string;
}

export default function Tabs({ className = '' }: TabsProps) {
  return <div className={`tabs-root ${className}`}>Tabs component</div>;
}

import { useCallback, useEffect, useRef, useState, type ComponentType, type CSSProperties, type PointerEvent } from 'react';
import {
  Home,
  Inbox,
  FolderOpen,
  Calendar,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  type LucideProps
} from 'lucide-react';
import './Sidebar.css';

const COLLAPSED_WIDTH = 64;

export interface SidebarItem {
  id: string;
  label: string;
  icon: ComponentType<LucideProps>;
  badge?: number | string;
}

export interface SidebarProps {
  items?: SidebarItem[];
  brand?: string;
  defaultCollapsed?: boolean;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  accentColor?: string;
  surfaceColor?: string;
  activeId?: string;
  onItemClick?: (id: string) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
}

const DEFAULT_ITEMS: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'inbox', label: 'Inbox', icon: Inbox, badge: 3 },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const join = (...classes: Array<string | false | undefined>): string => classes.filter(Boolean).join(' ');
const clamp = (val: number, min: number, max: number): number => Math.min(Math.max(val, min), max);

export default function Sidebar({
  items = DEFAULT_ITEMS,
  brand = 'Acme',
  defaultCollapsed = false,
  defaultWidth = 240,
  minWidth = 200,
  maxWidth = 380,
  accentColor = '#a855f7',
  surfaceColor = '#15121c',
  activeId: activeIdProp,
  onItemClick,
  onCollapsedChange,
  className = ''
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);
  const [width, setWidth] = useState<number>(() => clamp(defaultWidth, minWidth, maxWidth));
  const [activeId, setActiveId] = useState<string | undefined>(activeIdProp ?? items[0]?.id);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (activeIdProp !== undefined) setActiveId(activeIdProp);
  }, [activeIdProp]);

  const toggleCollapsed = (): void => {
    setCollapsed(prev => {
      const next = !prev;
      onCollapsedChange?.(next);
      return next;
    });
  };

  const handleItemClick = (id: string): void => {
    onItemClick?.(id);
    if (activeIdProp === undefined) setActiveId(id);
  };

  const startResize = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (collapsed) return;
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = width;
      setIsResizing(true);

      const onMove = (ev: globalThis.PointerEvent): void => {
        const next = clamp(startWidth + (ev.clientX - startX), minWidth, maxWidth);
        setWidth(next);
      };
      const onUp = (): void => {
        setIsResizing(false);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        document.body.style.removeProperty('user-select');
        document.body.style.removeProperty('cursor');
      };

      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'ew-resize';
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    },
    [collapsed, maxWidth, minWidth, width]
  );

  return (
    <aside
      ref={rootRef}
      className={join('ui-sidebar', collapsed && 'ui-sidebar--collapsed', isResizing && 'ui-sidebar--resizing', className)}
      style={
        {
          width: collapsed ? COLLAPSED_WIDTH : width,
          '--ui-sidebar-accent': accentColor,
          '--ui-sidebar-surface': surfaceColor
        } as CSSProperties
      }
      aria-label="Sidebar navigation"
    >
      <div className="ui-sidebar__brand">
        <div className="ui-sidebar__brand-mark" aria-hidden="true">
          {brand.charAt(0).toUpperCase()}
        </div>
        {!collapsed && <span className="ui-sidebar__brand-name">{brand}</span>}
      </div>

      <nav className="ui-sidebar__nav">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              className={join('ui-sidebar__item', isActive && 'ui-sidebar__item--active')}
              onClick={() => handleItemClick(item.id)}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} strokeWidth={1.75} className="ui-sidebar__item-icon" />
              {!collapsed && (
                <>
                  <span className="ui-sidebar__item-label">{item.label}</span>
                  {item.badge != null && <span className="ui-sidebar__item-badge">{item.badge}</span>}
                </>
              )}
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        className="ui-sidebar__collapse"
        onClick={toggleCollapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} strokeWidth={2} /> : <ChevronLeft size={16} strokeWidth={2} />}
      </button>

      {!collapsed && (
        <div
          className="ui-sidebar__handle"
          onPointerDown={startResize}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize sidebar"
        />
      )}
    </aside>
  );
}

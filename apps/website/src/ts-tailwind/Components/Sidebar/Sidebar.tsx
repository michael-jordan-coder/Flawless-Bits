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
import { twMerge } from 'tailwind-merge';

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

  const rootStyle: CSSProperties = {
    width: collapsed ? COLLAPSED_WIDTH : width,
    ['--ui-sidebar-accent' as string]: accentColor,
    ['--ui-sidebar-surface' as string]: surfaceColor,
    ['--ui-sidebar-border' as string]: `color-mix(in oklch, ${accentColor} 14%, #1a1a1a)`,
    ['--ui-sidebar-hover' as string]: `color-mix(in oklch, ${accentColor} 12%, ${surfaceColor})`,
    ['--ui-sidebar-active' as string]: `color-mix(in oklch, ${accentColor} 22%, ${surfaceColor})`
  };

  return (
    <aside
      ref={rootRef}
      className={twMerge(
        'relative box-border flex h-full min-h-[480px] flex-col text-white bg-[var(--ui-sidebar-surface)] border-r border-[var(--ui-sidebar-border)] transition-[width] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none',
        collapsed ? 'px-2 pt-4 pb-3' : 'px-2.5 pt-4 pb-3',
        isResizing && 'transition-none',
        className
      )}
      style={rootStyle}
      aria-label="Sidebar navigation"
    >
      <div className="flex min-h-[40px] items-center gap-2.5 px-1.5 pt-1 pb-[18px]">
        <div
          className="flex h-7 w-7 flex-none items-center justify-center rounded-[7px] bg-[var(--ui-sidebar-accent)] text-[13px] font-semibold text-white"
          aria-hidden="true"
        >
          {brand.charAt(0).toUpperCase()}
        </div>
        {!collapsed && (
          <span className="overflow-hidden whitespace-nowrap text-sm font-semibold tracking-[-0.01em]">{brand}</span>
        )}
      </div>

      <nav className="mt-1 flex flex-1 flex-col gap-0.5">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              className={twMerge(
                'flex w-full cursor-pointer items-center gap-3 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-[13.5px] text-[#c9c6cf] transition-colors duration-100 ease-out hover:bg-[var(--ui-sidebar-hover)] hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[1px] focus-visible:outline-[var(--ui-sidebar-accent)] motion-reduce:transition-none',
                collapsed && 'justify-center gap-0 px-2.5 py-2.5',
                isActive && 'bg-[var(--ui-sidebar-active)] text-white'
              )}
              onClick={() => handleItemClick(item.id)}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} strokeWidth={1.75} className="flex-none" />
              {!collapsed && (
                <>
                  <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{item.label}</span>
                  {item.badge != null && (
                    <span className="flex-none rounded-full bg-[var(--ui-sidebar-accent)] px-[7px] py-[2px] text-[11px] font-semibold leading-[1.4] text-white">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        className={twMerge(
          'mt-3 inline-flex h-7 w-7 cursor-pointer items-center justify-center self-end rounded-lg border border-[var(--ui-sidebar-border)] bg-transparent text-[#c9c6cf] transition-colors duration-100 ease-out hover:bg-[var(--ui-sidebar-hover)] hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[1px] focus-visible:outline-[var(--ui-sidebar-accent)] motion-reduce:transition-none',
          collapsed && 'self-center'
        )}
        onClick={toggleCollapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} strokeWidth={2} /> : <ChevronLeft size={16} strokeWidth={2} />}
      </button>

      {!collapsed && (
        <div
          className={twMerge(
            "absolute -right-1 top-0 h-full w-2 cursor-ew-resize touch-none bg-transparent before:absolute before:left-[3px] before:top-0 before:h-full before:w-px before:bg-transparent before:transition-colors before:duration-150 before:content-[''] hover:before:bg-[var(--ui-sidebar-accent)] motion-reduce:before:transition-none",
            isResizing && 'before:bg-[var(--ui-sidebar-accent)]'
          )}
          onPointerDown={startResize}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize sidebar"
        />
      )}
    </aside>
  );
}

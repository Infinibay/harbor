import { useId, type CSSProperties, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export type ProductShellKind =
  | "dashboard"
  | "admin"
  | "workbench"
  | "editor";

export interface ProductShellProps {
  children: ReactNode;
  sidebar?: ReactNode;
  mobileNavigation?: ReactNode;
  topbar?: ReactNode;
  breadcrumbs?: ReactNode;
  header?: ReactNode;
  toolbar?: ReactNode;
  detailPanel?: ReactNode;
  mobileDetailPanel?: ReactNode;
  commandPalette?: ReactNode;
  statusBar?: ReactNode;
  footer?: ReactNode;
  kind?: ProductShellKind;
  mainLabel?: string;
  sidebarLabel?: string;
  mobileNavigationLabel?: string;
  detailPanelLabel?: string;
  mobileDetailPanelLabel?: string;
  className?: string;
  sidebarClassName?: string;
  mobileNavigationClassName?: string;
  detailPanelClassName?: string;
  mobileDetailPanelClassName?: string;
  mainClassName?: string;
  contentClassName?: string;
  style?: CSSProperties;
}

const kindChrome: Record<ProductShellKind, string> = {
  dashboard: "bg-[var(--harbor-surface-canvas)]",
  admin: "bg-[var(--harbor-surface-canvas)]",
  workbench: "bg-[var(--harbor-workbench-bg)]",
  editor: "bg-[var(--harbor-workbench-bg)]",
};

const kindMain: Record<ProductShellKind, string> = {
  dashboard: "p-4 md:p-6",
  admin: "p-3 md:p-4",
  workbench: "p-0",
  editor: "p-0",
};

export function ProductShell({
  children,
  sidebar,
  mobileNavigation,
  topbar,
  breadcrumbs,
  header,
  toolbar,
  detailPanel,
  mobileDetailPanel,
  commandPalette,
  statusBar,
  footer,
  kind = "dashboard",
  mainLabel = "Main content",
  sidebarLabel = "Primary navigation",
  mobileNavigationLabel = "Mobile navigation",
  detailPanelLabel = "Details",
  mobileDetailPanelLabel = "Mobile details",
  className,
  sidebarClassName,
  mobileNavigationClassName,
  detailPanelClassName,
  mobileDetailPanelClassName,
  mainClassName,
  contentClassName,
  style,
}: ProductShellProps) {
  const mainId = useId();

  return (
    <div
      data-harbor-product-shell={kind}
      style={style}
      className={cn(
        "flex min-h-screen w-full overflow-hidden text-[rgb(var(--harbor-text))]",
        kindChrome[kind],
        className,
      )}
    >
      <a
        href={`#${mainId}`}
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[9999] focus:rounded-[var(--harbor-target-radius)] focus:bg-[var(--harbor-surface-raised)] focus:px-3 focus:py-2 focus:text-sm focus:shadow-[var(--harbor-focus-shadow)]"
      >
        Skip to content
      </a>
      {sidebar ? (
        <aside
          aria-label={sidebarLabel}
          className={cn(
            "hidden min-h-screen w-64 shrink-0 border-r border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel)] md:block",
            sidebarClassName,
          )}
        >
          {sidebar}
        </aside>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        {topbar ? (
          <header className="shrink-0 border-b border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-toolbar)] backdrop-blur-md">
            {topbar}
          </header>
        ) : null}
        {mobileNavigation ? (
          <nav
            aria-label={mobileNavigationLabel}
            className={cn(
              "shrink-0 border-b border-[color:var(--harbor-border-subtle)] bg-[var(--harbor-surface-panel)] px-3 py-2 md:hidden",
              mobileNavigationClassName,
            )}
          >
            {mobileNavigation}
          </nav>
        ) : null}
        {breadcrumbs ? (
          <nav
            aria-label="Breadcrumb"
            className="shrink-0 border-b border-[color:var(--harbor-border-subtle)] bg-[var(--harbor-surface-panel)] px-4 py-2 text-sm text-[rgb(var(--harbor-text-muted))]"
          >
            {breadcrumbs}
          </nav>
        ) : null}
        {toolbar ? (
          <div className="shrink-0 border-b border-[color:var(--harbor-border-subtle)] bg-[var(--harbor-surface-toolbar)] px-3 py-2">
            {toolbar}
          </div>
        ) : null}
        <div className="flex min-h-0 flex-1">
          <main
            id={mainId}
            aria-label={mainLabel}
            className={cn(
              "min-w-0 flex-1 overflow-auto outline-none",
              kindMain[kind],
              mainClassName,
            )}
            tabIndex={-1}
          >
            {header ? <div className="mb-4">{header}</div> : null}
            <div className={contentClassName}>{children}</div>
            {mobileDetailPanel ? (
              <aside
                aria-label={mobileDetailPanelLabel}
                className={cn(
                  "mt-4 border-t border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel)] pt-4 lg:hidden",
                  mobileDetailPanelClassName,
                )}
              >
                {mobileDetailPanel}
              </aside>
            ) : null}
          </main>
          {detailPanel ? (
            <aside
              aria-label={detailPanelLabel}
              className={cn(
                "hidden w-80 shrink-0 overflow-auto border-l border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel)] lg:block",
                detailPanelClassName,
              )}
            >
              {detailPanel}
            </aside>
          ) : null}
        </div>
        {statusBar ? (
          <footer className="shrink-0 border-t border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-toolbar)] px-3 py-1">
            {statusBar}
          </footer>
        ) : null}
        {footer}
      </div>
      {commandPalette}
    </div>
  );
}

export type ShellPresetProps = Omit<ProductShellProps, "kind">;

export function DashboardShell(props: ShellPresetProps) {
  return <ProductShell {...props} kind="dashboard" />;
}

export function AdminShell(props: ShellPresetProps) {
  return <ProductShell {...props} kind="admin" />;
}

export function WorkbenchShell(props: ShellPresetProps) {
  return <ProductShell {...props} kind="workbench" />;
}

export function EditorShell(props: ShellPresetProps) {
  return <ProductShell {...props} kind="editor" />;
}

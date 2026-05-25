import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { focusFirst, trapFocus, useDismissableLayer } from "../../lib/a11y";
import { cn } from "../../lib/cn";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";
import { DataTable, type DataTableProps } from "./DataTable";
import type {
  ColumnDef,
  ColumnEditConfig,
  FilterState,
  PaginationState,
  SortState,
} from "./table/types";

export interface DataWorkspaceView {
  id: string;
  label: ReactNode;
  count?: ReactNode;
}

export interface DataWorkspaceBulkAction {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export interface DataWorkspaceFacetOption {
  label: ReactNode;
  value: unknown;
  count?: ReactNode;
}

export interface DataWorkspaceFacet {
  id: string;
  label: ReactNode;
  columnId: string;
  options: DataWorkspaceFacetOption[];
  multiple?: boolean;
}

export interface DataWorkspaceMetric {
  label: ReactNode;
  value: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}

export interface DataWorkspaceEmptyState {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export interface DataWorkspaceErrorState {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export interface DataWorkspaceEditableColumn<T> {
  type: ColumnEditConfig<T>["type"];
  options?: ColumnEditConfig<T>["options"];
  validate?: ColumnEditConfig<T>["validate"];
}

export interface DataWorkspaceInlineEdit<T> {
  columns: Record<string, DataWorkspaceEditableColumn<T>>;
  onCommit: (
    row: T,
    columnId: string,
    nextValue: unknown,
  ) => void | Promise<void>;
}

export interface DataWorkspaceServerQuery {
  sort: readonly SortState[];
  filters: readonly FilterState[];
  globalFilter: string;
  pagination: PaginationState;
  viewId?: string;
}

export interface DataWorkspaceDataSource<T> {
  rows: readonly T[];
  totalCount: number;
  loading?: boolean;
  error?: ReactNode;
  onRetry?: () => void;
  query?: Partial<DataWorkspaceServerQuery>;
  defaultQuery?: Partial<DataWorkspaceServerQuery>;
  onQueryChange?: (query: DataWorkspaceServerQuery) => void;
}

export interface DataWorkspaceProps<T> extends Omit<DataTableProps<T>, "rows"> {
  rows?: readonly T[];
  dataSource?: DataWorkspaceDataSource<T>;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  metrics?: DataWorkspaceMetric[];
  savedViews?: DataWorkspaceView[];
  activeViewId?: string;
  onViewChange?: (id: string) => void;
  selectedCount?: number;
  bulkActions?: DataWorkspaceBulkAction[];
  facets?: DataWorkspaceFacet[];
  facetsLabel?: string;
  filterBar?: ReactNode;
  emptyStateContent?: DataWorkspaceEmptyState;
  errorStateContent?: DataWorkspaceErrorState;
  detailPanel?: ReactNode;
  detailPanelLabel?: string;
  detailDrawer?: ReactNode;
  detailDrawerOpen?: boolean;
  detailDrawerLabel?: string;
  onDetailDrawerClose?: () => void;
  inlineEdit?: DataWorkspaceInlineEdit<T>;
  className?: string;
  tableClassName?: string;
}

const metricTones: Record<NonNullable<DataWorkspaceMetric["tone"]>, string> = {
  neutral: "text-[rgb(var(--harbor-text))]",
  success: "text-[rgb(var(--harbor-success))]",
  warning: "text-[rgb(var(--harbor-warning))]",
  danger: "text-[rgb(var(--harbor-danger))]",
  info: "text-[rgb(var(--harbor-info))]",
};

export function DataWorkspace<T>({
  title,
  description,
  actions,
  metrics,
  savedViews,
  activeViewId,
  onViewChange,
  selectedCount,
  bulkActions,
  facets,
  facetsLabel = "Workspace filters",
  filterBar,
  emptyStateContent,
  errorStateContent,
  detailPanel,
  detailPanelLabel = "Row details",
  detailDrawer,
  detailDrawerOpen = false,
  detailDrawerLabel = "Row details",
  onDetailDrawerClose,
  inlineEdit,
  className,
  tableClassName,
  dataSource,
  rows = [],
  selected,
  defaultSelected,
  onSelectionChange,
  mode,
  totalCount,
  loading,
  columns,
  emptyState,
  error,
  onRetry,
  showGlobalSearch = true,
  showColumnPicker = true,
  showDensityToggle = true,
  showExport = true,
  selectable,
  sort,
  defaultSort,
  onSortChange,
  filters,
  defaultFilters,
  onFiltersChange,
  globalFilter,
  defaultGlobalFilter,
  onGlobalFilterChange,
  pagination,
  defaultPagination,
  onPaginationChange,
  ...tableProps
}: DataWorkspaceProps<T>) {
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(
    () => defaultSelected ?? [],
  );
  const [internalFilters, setInternalFilters] = useState<readonly FilterState[]>(
    () => defaultFilters ?? [],
  );
  const firstSavedViewId = savedViews?.[0]?.id;
  const controlledServerViewId = dataSource?.query?.viewId;
  const defaultServerViewId = dataSource?.defaultQuery?.viewId;
  const [internalActiveViewId, setInternalActiveViewId] = useState<
    string | undefined
  >(
    () =>
      activeViewId ??
      controlledServerViewId ??
      defaultServerViewId ??
      firstSavedViewId,
  );
  const resolvedSelectedIds = selected ?? internalSelectedIds;
  const resolvedSelectedCount = selectedCount ?? resolvedSelectedIds.length;
  const hasBulkBar =
    resolvedSelectedCount > 0 && bulkActions && bulkActions.length > 0;
  const resolvedActiveViewId =
    activeViewId ?? controlledServerViewId ?? internalActiveViewId ?? firstSavedViewId;
  const hasMetrics = Boolean(metrics?.length);
  const savedViewRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [internalServerQuery, setInternalServerQuery] =
    useState<DataWorkspaceServerQuery>(() =>
      normalizeServerQuery(dataSource?.query ?? dataSource?.defaultQuery, resolvedActiveViewId),
    );
  const serverQuery = normalizeServerQuery(
    dataSource?.query ?? internalServerQuery,
    resolvedActiveViewId,
  );
  const resolvedFilters = dataSource
    ? serverQuery.filters
    : filters ?? internalFilters;
  const updateServerQuery = (next: DataWorkspaceServerQuery) => {
    if (dataSource?.query === undefined) setInternalServerQuery(next);
    dataSource?.onQueryChange?.(next);
  };
  const setServerQuery = (patch: Partial<DataWorkspaceServerQuery>) => {
    updateServerQuery(normalizeServerQuery({ ...serverQuery, ...patch }, serverQuery.viewId));
  };
  const handleViewChange = (id: string) => {
    if (activeViewId === undefined && controlledServerViewId === undefined) {
      setInternalActiveViewId(id);
    }
    onViewChange?.(id);
    if (dataSource) {
      setServerQuery({
        viewId: id,
        pagination: { ...serverQuery.pagination, page: 0 },
      });
    }
  };
  const handleSelectionChange = (ids: string[]) => {
    if (selected === undefined) setInternalSelectedIds(ids);
    onSelectionChange?.(ids);
  };
  const handleFiltersChange = (next: readonly FilterState[]) => {
    if (dataSource) {
      setServerQuery({
        filters: next,
        pagination: { ...serverQuery.pagination, page: 0 },
      });
    } else if (filters === undefined) {
      setInternalFilters(next);
    }
    onFiltersChange?.(next as FilterState[]);
  };
  useEffect(() => {
    if (activeViewId !== undefined || controlledServerViewId !== undefined) return;

    const savedViewExists =
      internalActiveViewId !== undefined &&
      savedViews?.some((view) => view.id === internalActiveViewId);
    if (savedViewExists) return;

    const nextViewId = defaultServerViewId ?? firstSavedViewId;
    if (nextViewId !== undefined && nextViewId !== internalActiveViewId) {
      setInternalActiveViewId(nextViewId);
    }
  }, [
    activeViewId,
    controlledServerViewId,
    defaultServerViewId,
    firstSavedViewId,
    internalActiveViewId,
    savedViews,
  ]);
  const setFacetFilter = (
    facet: DataWorkspaceFacet,
    option: DataWorkspaceFacetOption,
  ) => {
    const current = resolvedFilters.find((filter) => filter.id === facet.columnId);
    const currentValues = Array.isArray(current?.value) ? current.value : [];
    const multiple = facet.multiple !== false;
    const nextValue = multiple
      ? toggleFacetValue(currentValues, option.value)
      : facetValueEquals(current?.value, option.value)
        ? undefined
        : option.value;
    const nextFilters = upsertFilter(resolvedFilters, facet.columnId, nextValue);

    handleFiltersChange(nextFilters);
  };
  const handleSavedViewKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (!savedViews?.length) return;

    const lastIndex = savedViews.length - 1;
    const nextIndexByKey: Record<string, number> = {
      ArrowRight: index === lastIndex ? 0 : index + 1,
      ArrowDown: index === lastIndex ? 0 : index + 1,
      ArrowLeft: index === 0 ? lastIndex : index - 1,
      ArrowUp: index === 0 ? lastIndex : index - 1,
      Home: 0,
      End: lastIndex,
    };
    const nextIndex = nextIndexByKey[event.key];

    if (nextIndex === undefined) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleViewChange(savedViews[index].id);
      }
      return;
    }

    event.preventDefault();
    const nextView = savedViews[nextIndex];
    handleViewChange(nextView.id);
    savedViewRefs.current[nextIndex]?.focus();
  };
  const workspaceColumns = useMemo<readonly ColumnDef<T>[]>(() => {
    if (!inlineEdit) return columns;

    return columns.map((column) => {
      const editable = inlineEdit.columns[column.id];
      if (!editable || column.editable) return column;

      return {
        ...column,
        editable: {
          ...editable,
          onCommit: (row, nextValue) =>
            inlineEdit.onCommit(row, column.id, nextValue),
        },
      };
    });
  }, [columns, inlineEdit]);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel)] text-[rgb(var(--harbor-text))]",
        className,
      )}
    >
      {title || description || actions || hasMetrics ? (
        <div className="border-b border-[color:var(--harbor-border-subtle)] px-4 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              {title ? (
                <h2 className="text-base font-semibold text-[rgb(var(--harbor-text))]">
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p className="mt-1 text-sm text-[rgb(var(--harbor-text-muted))]">
                  {description}
                </p>
              ) : null}
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
          {hasMetrics ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {metrics?.map((metric, index) => (
                <div
                  key={index}
                  className="rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-subtle)] bg-[var(--harbor-surface-panel-muted)] px-3 py-2"
                >
                  <div className="text-xs text-[rgb(var(--harbor-text-muted))]">
                    {metric.label}
                  </div>
                  <div
                    className={cn(
                      "mt-1 text-lg font-semibold",
                      metricTones[metric.tone ?? "neutral"],
                    )}
                  >
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {savedViews && savedViews.length > 0 ? (
        <div
          role="tablist"
          aria-label="Saved views"
          className="flex gap-1 overflow-x-auto border-b border-[color:var(--harbor-border-subtle)] px-3 py-2"
        >
          {savedViews.map((view, index) => {
            const active = view.id === resolvedActiveViewId;
            return (
              <button
                key={view.id}
                ref={(node) => {
                  savedViewRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                aria-selected={active}
                tabIndex={active ? 0 : -1}
                onClick={() => handleViewChange(view.id)}
                onKeyDown={(event) => handleSavedViewKeyDown(event, index)}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-[var(--harbor-target-radius)] px-3 py-1.5 text-sm outline-none transition-colors focus-visible:shadow-[var(--harbor-focus-shadow)]",
                  active
                    ? "bg-[var(--harbor-state-selected)] text-[var(--harbor-state-selected-fg)]"
                    : "text-[rgb(var(--harbor-text-muted))] hover:bg-[var(--harbor-state-hover)] hover:text-[rgb(var(--harbor-text))]",
                )}
              >
                <span>{view.label}</span>
                {view.count != null ? (
                  <span className="rounded-full bg-[var(--harbor-state-active)] px-1.5 py-0.5 text-[10px]">
                    {view.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}

      {filterBar ? (
        <div className="border-b border-[color:var(--harbor-border-subtle)] px-3 py-2">
          {filterBar}
        </div>
      ) : null}

      {facets && facets.length > 0 ? (
        <div
          aria-label={facetsLabel}
          className="space-y-2 border-b border-[color:var(--harbor-border-subtle)] px-3 py-2"
        >
          {facets.map((facet) => {
            const activeFilter = resolvedFilters.find(
              (filter) => filter.id === facet.columnId,
            );
            const activeValues = Array.isArray(activeFilter?.value)
              ? activeFilter.value
              : activeFilter?.value == null
                ? []
                : [activeFilter.value];

            return (
              <div key={facet.id} className="flex flex-wrap items-center gap-2">
                <span className="min-w-20 text-xs font-medium uppercase tracking-wide text-[rgb(var(--harbor-text-muted))]">
                  {facet.label}
                </span>
                {facet.options.map((option) => {
                  const active = activeValues.some((value) =>
                    facetValueEquals(value, option.value),
                  );
                  return (
                    <button
                      key={String(option.value)}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFacetFilter(facet, option)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs outline-none transition-colors focus-visible:shadow-[var(--harbor-focus-shadow)]",
                        active
                          ? "border-[color:var(--harbor-border-focus)] bg-[var(--harbor-state-selected)] text-[var(--harbor-state-selected-fg)]"
                          : "border-[color:var(--harbor-border-subtle)] bg-surface-1/80 text-[rgb(var(--harbor-text-muted))] hover:bg-[var(--harbor-state-hover)] hover:text-[rgb(var(--harbor-text))]",
                      )}
                    >
                      <span>{option.label}</span>
                      {option.count != null ? (
                        <span className="rounded-full bg-[var(--harbor-state-active)] px-1.5 py-0.5 text-[10px]">
                          {option.count}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : null}

      {hasBulkBar ? (
        <div
          role="toolbar"
          aria-label="Bulk actions"
          className="flex flex-wrap items-center gap-2 border-b border-[color:var(--harbor-border-subtle)] bg-[var(--harbor-state-selected)] px-3 py-2"
        >
          <span className="me-2 text-sm font-medium">
            {resolvedSelectedCount} selected
          </span>
          {bulkActions.map((action) => (
            <button
              key={action.id}
              type="button"
              disabled={action.disabled}
              onClick={action.onClick}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-default)] bg-surface-1/90 px-2.5 py-1.5 text-sm outline-none transition-colors hover:bg-[var(--harbor-state-hover)] focus-visible:shadow-[var(--harbor-focus-shadow)] disabled:cursor-not-allowed disabled:opacity-50",
                action.danger && "text-[rgb(var(--harbor-danger))]",
              )}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex min-h-0">
        <div className="min-w-0 flex-1">
          <DataTable
            {...tableProps}
            rows={dataSource ? dataSource.rows : rows}
            columns={workspaceColumns}
            mode={dataSource ? "server" : mode}
            totalCount={dataSource ? dataSource.totalCount : totalCount}
            loading={dataSource ? dataSource.loading : loading}
            emptyState={emptyState ?? (
              emptyStateContent ? <WorkspaceEmptyState state={emptyStateContent} /> : undefined
            )}
            error={
              errorStateContent && (dataSource?.error ?? error) != null
                ? <WorkspaceErrorState state={errorStateContent} onRetry={dataSource?.onRetry ?? onRetry} />
                : dataSource?.error ?? error
            }
            onRetry={dataSource?.onRetry ?? onRetry}
            selectable={selectable ?? Boolean(bulkActions?.length)}
            selected={resolvedSelectedIds}
            onSelectionChange={handleSelectionChange}
            sort={dataSource ? [...serverQuery.sort] : sort}
            defaultSort={dataSource ? undefined : defaultSort}
            onSortChange={
              dataSource
                ? (next) => {
                    setServerQuery({
                      sort: next,
                      pagination: { ...serverQuery.pagination, page: 0 },
                    });
                    onSortChange?.(next as SortState[]);
                  }
                : onSortChange
            }
            filters={[...resolvedFilters]}
            defaultFilters={dataSource ? undefined : defaultFilters}
            onFiltersChange={handleFiltersChange}
            globalFilter={dataSource ? serverQuery.globalFilter : globalFilter}
            defaultGlobalFilter={dataSource ? undefined : defaultGlobalFilter}
            onGlobalFilterChange={
              dataSource
                ? (next) => {
                    setServerQuery({
                      globalFilter: next,
                      pagination: { ...serverQuery.pagination, page: 0 },
                    });
                    onGlobalFilterChange?.(next);
                  }
                : onGlobalFilterChange
            }
            pagination={dataSource ? serverQuery.pagination : pagination}
            defaultPagination={dataSource ? undefined : defaultPagination}
            onPaginationChange={
              dataSource
                ? (next) => {
                    setServerQuery({ pagination: next });
                    onPaginationChange?.(next);
                  }
                : onPaginationChange
            }
            showGlobalSearch={showGlobalSearch}
            showColumnPicker={showColumnPicker}
            showDensityToggle={showDensityToggle}
            showExport={showExport}
            className={cn("rounded-none border-0 bg-transparent", tableClassName)}
          />
        </div>
        {detailPanel ? (
          <aside
            aria-label={detailPanelLabel}
            className="hidden w-80 shrink-0 border-l border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel-muted)] lg:block"
          >
            {detailPanel}
          </aside>
        ) : null}
      </div>
      {detailDrawer ? (
        <WorkspaceDetailDrawer
          open={detailDrawerOpen}
          label={detailDrawerLabel}
          onClose={onDetailDrawerClose}
        >
          {detailDrawer}
        </WorkspaceDetailDrawer>
      ) : null}
    </section>
  );
}

function normalizeServerQuery(
  query?: Partial<DataWorkspaceServerQuery>,
  fallbackViewId?: string,
): DataWorkspaceServerQuery {
  return {
    sort: query?.sort ?? [],
    filters: query?.filters ?? [],
    globalFilter: query?.globalFilter ?? "",
    pagination: {
      page: query?.pagination?.page ?? 0,
      pageSize: query?.pagination?.pageSize ?? 25,
    },
    viewId: query?.viewId ?? fallbackViewId,
  };
}

function facetValueEquals(a: unknown, b: unknown): boolean {
  return String(a) === String(b);
}

function toggleFacetValue(values: readonly unknown[], value: unknown): unknown[] {
  const exists = values.some((current) => facetValueEquals(current, value));
  if (exists) return values.filter((current) => !facetValueEquals(current, value));
  return [...values, value];
}

function upsertFilter(
  filters: readonly FilterState[],
  id: string,
  value: unknown,
): FilterState[] {
  if (
    value == null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return filters.filter((filter) => filter.id !== id);
  }

  const exists = filters.some((filter) => filter.id === id);
  if (!exists) return [...filters, { id, value }];
  return filters.map((filter) => (filter.id === id ? { id, value } : filter));
}

function WorkspaceEmptyState({ state }: { state: DataWorkspaceEmptyState }) {
  return (
    <div className="max-w-sm text-center">
      <div className="text-sm font-medium text-[rgb(var(--harbor-text))]">
        {state.title}
      </div>
      {state.description ? (
        <div className="mt-1 text-sm text-[rgb(var(--harbor-text-muted))]">
          {state.description}
        </div>
      ) : null}
      {state.action ? <div className="mt-4">{state.action}</div> : null}
    </div>
  );
}

function WorkspaceErrorState({
  state,
  onRetry,
}: {
  state: DataWorkspaceErrorState;
  onRetry?: () => void;
}) {
  return (
    <div className="max-w-sm text-center">
      <div className="text-sm font-medium text-[rgb(var(--harbor-danger))]">
        {state.title}
      </div>
      {state.description ? (
        <div className="mt-1 text-sm text-[rgb(var(--harbor-text-muted))]">
          {state.description}
        </div>
      ) : null}
      <div className="mt-4 flex justify-center gap-2">
        {state.action}
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel)] px-3 py-1.5 text-sm outline-none hover:bg-[var(--harbor-state-hover)] focus-visible:shadow-[var(--harbor-focus-shadow)]"
          >
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
}

function WorkspaceDetailDrawer({
  open,
  label,
  onClose,
  children,
}: {
  open: boolean;
  label: string;
  onClose?: () => void;
  children: ReactNode;
}) {
  const titleId = useId();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useDismissableLayer({
    ref: drawerRef,
    enabled: open,
    onDismiss: () => onClose?.(),
  });

  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const id = window.setTimeout(() => {
      if (drawerRef.current) focusFirst(drawerRef.current);
    });
    return () => {
      window.clearTimeout(id);
      restoreFocusRef.current?.focus?.();
      restoreFocusRef.current = null;
    };
  }, [open]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (drawerRef.current) trapFocus(drawerRef.current, e);
  }

  if (!open) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 flex justify-end bg-[var(--harbor-overlay-scrim)]"
        style={{ zIndex: Z.DIALOG }}
      >
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className="flex h-full w-full max-w-md flex-col border-l border-[color:var(--harbor-border-default)] bg-[var(--harbor-overlay-surface)] text-[rgb(var(--harbor-text))] shadow-[var(--harbor-shadow-xl)] outline-none"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[color:var(--harbor-border-subtle)] px-4 py-3">
            <h2 id={titleId} className="text-sm font-semibold">
              {label}
            </h2>
            {onClose ? (
              <button
                type="button"
                aria-label="Close details"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-[var(--harbor-target-radius)] text-[rgb(var(--harbor-text-muted))] outline-none hover:bg-[var(--harbor-state-hover)] hover:text-[rgb(var(--harbor-text))] focus-visible:shadow-[var(--harbor-focus-shadow)]"
              >
                <span aria-hidden>×</span>
              </button>
            ) : null}
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
        </div>
      </div>
    </Portal>
  );
}

import { DataTable, type ColumnDef } from "./DataTable";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

type Vm = {
  id: string;
  name: string;
  cpu: number;
  ram: number;
  status: "up" | "down" | "paused";
};

const sampleRows: Vm[] = [
  { id: "1", name: "vm-prod-01", cpu: 4, ram: 16, status: "up" },
  { id: "2", name: "vm-prod-02", cpu: 8, ram: 32, status: "up" },
  { id: "3", name: "vm-stage-01", cpu: 2, ram: 8, status: "paused" },
  { id: "4", name: "vm-stage-02", cpu: 2, ram: 8, status: "down" },
  { id: "5", name: "vm-dev-ada", cpu: 1, ram: 4, status: "up" },
  { id: "6", name: "vm-dev-lin", cpu: 1, ram: 4, status: "down" },
];

const sampleColumns: ColumnDef<Vm>[] = [
  { id: "name", header: "Name", accessor: (r) => r.name, sortable: true,
    filterable: { type: "text" } },
  { id: "cpu", header: "CPU", accessor: (r) => r.cpu, sortable: true,
    align: "end", width: 80 },
  { id: "ram", header: "RAM", accessor: (r) => r.ram, sortable: true,
    align: "end", width: 80,
    cell: ({ value }) => `${value} GB` },
  { id: "status", header: "Status", accessor: (r) => r.status,
    filterable: {
      type: "select",
      options: [
        { value: "up", label: "Up" },
        { value: "down", label: "Down" },
        { value: "paused", label: "Paused" },
      ],
    } },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DataTableDemo(props: any) {
  return (
    <div style={{ width: "100%", minHeight: 420 }}>
      <DataTable<Vm>
        rows={sampleRows}
        columns={sampleColumns}
        rowId={(r) => r.id}
        {...props}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: DataTableDemo as never,
  importPath: "@infinibay/harbor/data",
  controls: {
    selectable: { type: "boolean", default: false },
    showGlobalSearch: { type: "boolean", default: true },
    showDensityToggle: { type: "boolean", default: true },
    showExport: { type: "boolean", default: false },
    showColumnPicker: { type: "boolean", default: false },
    columnMenu: { type: "boolean", default: true },
    hidePagination: { type: "boolean", default: false },
    loading: { type: "boolean", default: false },
    keyboardNavigation: { type: "boolean", default: true },
  },
  variants: [
    { label: "Plain", props: {} },
    { label: "Selectable + search", props: { selectable: true, showGlobalSearch: true } },
    { label: "Loading", props: { loading: true } },
    { label: "Full chrome", props: {
      selectable: true, showGlobalSearch: true, showDensityToggle: true,
      showExport: true, showColumnPicker: true,
    } },
  ],
  events: [
    { name: "onRowClick", signature: "(row: T) => void" },
    { name: "onSelectionChange", signature: "(ids: string[]) => void" },
    { name: "onSortChange", signature: "(next: SortState[]) => void" },
  ],
};

import type { HarborLocale } from "../types";

export const en: HarborLocale = {
  code: "en",
  label: "English",
  direction: "ltr",
  messages: {
    "harbor.field.optional": "(optional)",
    "harbor.field.requiredMark": "*",
    "harbor.action.close": "Close",
    "harbor.action.cancel": "Cancel",
    "harbor.action.save": "Save",
    "harbor.action.back": "Back",
    "harbor.action.next": "Next",
    "harbor.action.finish": "Finish",
    "harbor.action.clear": "Clear",
    "harbor.action.submit": "Submit",

    "harbor.wizard.stepOfN":
      "Step {current, plural, other {#}} of {total, plural, other {#}}",
    "harbor.wizard.defaultError": "Required fields missing",

    "harbor.commandPalette.placeholder": "Type a command…",
    "harbor.commandPalette.escKey": "ESC",
    "harbor.commandPalette.title": "Command palette",
    "harbor.commandPalette.noResults": "No matching commands",

    "harbor.select.placeholder": "Select…",

    "harbor.search.placeholder": "Search…",

    "harbor.datatable.empty": "No data",
    "harbor.datatable.selectAll": "Select all rows on this page",
    "harbor.datatable.selectRow": "Select row",
    "harbor.datatable.rowsPerPage": "Rows per page",
    "harbor.datatable.showingRange":
      "Showing {start}–{end} of {total, plural, one {# row} other {# rows}}",
    "harbor.datatable.firstPage": "First page",
    "harbor.datatable.prevPage": "Previous page",
    "harbor.datatable.nextPage": "Next page",
    "harbor.datatable.lastPage": "Last page",
    "harbor.datatable.menu.open": "Column menu",
    "harbor.datatable.menu.sortAsc": "Sort ascending",
    "harbor.datatable.menu.sortDesc": "Sort descending",
    "harbor.datatable.menu.clearSort": "Clear sort",
    "harbor.datatable.menu.pinStart": "Pin to start",
    "harbor.datatable.menu.pinEnd": "Pin to end",
    "harbor.datatable.menu.unpin": "Unpin column",
    "harbor.datatable.menu.hide": "Hide column",
    "harbor.datatable.menu.moveLeft": "Move left",
    "harbor.datatable.menu.moveRight": "Move right",
    "harbor.datatable.columns.title": "Columns",
    "harbor.datatable.columns.showAll": "Show all",
    "harbor.datatable.columns.hideAll": "Hide all",

    "harbor.validation.required": "This field is required",
    "harbor.validation.email": "Enter a valid email address",
    "harbor.validation.min": "Must be at least {min}",
    "harbor.validation.max": "Must be at most {max}",
    "harbor.validation.minLength":
      "{min, plural, one {Must be at least # character} other {Must be at least # characters}}",
    "harbor.validation.maxLength":
      "{max, plural, one {Must be at most # character} other {Must be at most # characters}}",
  },
};

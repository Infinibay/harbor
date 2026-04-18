/**
 * Layer system — always import from here, never hardcode z-index.
 *
 * Ranges (100 values per tier for future variants):
 *
 *   -10..-1   BACKGROUND     decorative (mesh, blobs)
 *    0..  9   BASE           normal flow
 *   10.. 19   RAISED         in-flow elevated (sticky headers, overlap fixes)
 *   20.. 29   STICKY         sticky page chrome (navbars)
 *   30.. 39   CHROME         top-of-page chrome (progress bar)
 *
 *   1000..1099  POPOVER      content-anchored dropdowns (Select, Combobox,
 *                            Popover, Menu, MultiSelect, DatePicker,
 *                            SearchField results, NotificationBell,
 *                            SplitButton menu, MenuBar dropdown)
 *   1100..1199  SUBMENU      submenu one level deeper than POPOVER
 *   2000..2099  CONTEXT_MENU right-click menus (over selection)
 *   2100..2199  HOVER_CARD   hover previews (appear above popovers)
 *   4000..4099  DRAWER       side sheets
 *   5000..5099  DIALOG       centered modals
 *   6000..6099  COMMAND_PAL  quick switcher
 *   7000..7099  TOAST        notifications — must clear dialogs
 *   9000..9099  TOOLTIP      always highest, since hover-driven
 */
export const Z = {
  BACKGROUND: -1,
  BASE: 0,
  RAISED: 10,
  STICKY: 20,
  CHROME: 30,

  POPOVER: 1000,
  SUBMENU: 1100,
  CONTEXT_MENU: 2000,
  HOVER_CARD: 2100,
  DRAWER: 4000,
  DIALOG: 5000,
  COMMAND_PALETTE: 6000,
  TOAST: 7000,
  TOOLTIP: 9000,
} as const;

export type ZKey = keyof typeof Z;

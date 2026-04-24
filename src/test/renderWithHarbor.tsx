import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HarborProvider } from "../lib/theme/HarborProvider";

/** Renders `ui` inside a `HarborProvider` so theme context / CSS vars
 *  are available to any component under test. Returns the usual
 *  Testing Library result plus a pre-configured `user` (user-event). */
export function renderWithHarbor(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    theme?: string;
  },
): RenderResult & { user: ReturnType<typeof userEvent.setup> } {
  const { theme, ...rest } = options ?? {};

  function Wrapper({ children }: { children: ReactNode }) {
    return <HarborProvider theme={theme}>{children}</HarborProvider>;
  }

  const user = userEvent.setup();
  const result = render(ui, { wrapper: Wrapper, ...rest });
  return { ...result, user };
}

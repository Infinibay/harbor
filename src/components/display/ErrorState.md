# ErrorState

`ErrorState` is the recovery surface for failed data loading, failed mutations, missing records, permission problems, and unavailable services. It gives the user a clear title, useful explanation, optional error code, retry affordance, custom actions, and an error icon inside a consistent Harbor container.

Use it where the user expected content but cannot proceed until something changes. For empty successful states, use `EmptyState` instead.

## Import

```tsx
import { ErrorState } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<ErrorState
  title="Projects could not be loaded"
  description="The API returned a temporary error. Try again or check the deployment logs."
  code="503"
  onRetry={() => refetchProjects()}
/>
```

Add custom actions when retry is not the only path:

```tsx
<ErrorState
  title="You do not have access"
  description="Ask a workspace owner to grant the Billing Admin role."
  code="403"
  actions={<Button variant="secondary">Request access</Button>}
/>
```

## Props

- **title** - optional `ReactNode`. Defaults to `"Something went wrong"`.
- **description** - optional `ReactNode`. Defaults to a generic recovery message.
- **code** - optional string rendered as a compact monospace badge.
- **onRetry** - optional callback. When provided, Harbor renders a `"Try again"` button.
- **actions** - optional `ReactNode` for additional buttons or links.
- **icon** - optional `ReactNode`. Defaults to a simple error mark.
- **className** - optional string merged onto the root element.

## Content Guidance

Write the title as the failed user outcome, not the internal exception. `"Invoices could not be loaded"` is better than `"Request failed"`. Use the description to explain what the user can do next: retry, check permissions, refresh credentials, contact an owner, or inspect logs.

Use `code` for stable support identifiers such as HTTP status, request id, or product-specific error code. Avoid dumping raw stack traces into the user interface.

## Interaction Model

`onRetry` is intentionally simple. Your app remains responsible for loading state, debouncing, disabling repeated retries, and showing success after the retry works. If retry starts an async request, pair the surrounding panel with `LoadingOverlay`, button pending state, or a status message.

## Accessibility

Place `ErrorState` where the missing content would have appeared. For major page failures, wrap it in a region with a useful label or heading. If the error appears after an async action, use your app's announcement pattern so assistive technology users know the content changed.

The retry button is a native button. Custom `actions` should also be accessible buttons or links.

## Gotchas

- Do not use `ErrorState` for empty results, onboarding, or "nothing configured yet"; use `EmptyState`.
- Avoid vague descriptions like `"Please try again later"` when there is a concrete next step.
- Keep `code` short. Long request ids are better in a copyable details drawer.
- If `onRetry` can fail repeatedly, update the message or expose diagnostic actions.

## Related

- `EmptyState` for successful but empty content.
- `Alert` for inline validation and local warnings.
- `LoadingOverlay` for retry-in-progress states.
- `Button` for custom recovery actions.

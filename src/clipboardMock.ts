// mockHistory10.ts
import type { ClipboardItem } from "./clipboardManager";

export function createMockHistory(): ClipboardItem[] {
  const now = Date.now();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  // Новые сверху (от более свежих к более старым)
  return [
    {
      text: "OK",
      timestamp: new Date(now - 1 * minute).toISOString(),
    },
    {
      text: "git pull",
      timestamp: new Date(now - 3 * minute).toISOString(),
    },
    {
      text: "function clamp(n, min, max) { return Math.min(Math.max(n, min), max); }",
      timestamp: new Date(now - 6 * minute).toISOString(),
    },
    {
      text: '{"feature":"multi-clipboard","enabled":true,"limit":100}',
      timestamp: new Date(now - 10 * minute).toISOString(),
    },
    {
      text: "https://marketplace.visualstudio.com/items?itemName=YourPublisher.MultiClipboard",
      timestamp: new Date(now - 15 * minute).toISOString(),
    },
    {
      text: "- [ ] Add unit tests\n- [x] Update README\n- [ ] Publish",
      timestamp: new Date(now - 1 * day - 5 * minute).toISOString(),
    },
    {
      text:
        "This is a longer note explaining the clipboard history workflow: " +
        "items are captured on copy, shown via Quick Pick with smart timestamps, " +
        "and persisted across restarts for faster retrieval during editing.",
      timestamp: new Date(now - 1 * day - 45 * minute).toISOString(),
    },
    {
      text: "UPDATE users SET last_login = NOW() WHERE id = 42;",
      timestamp: new Date(now - 3 * day - 10 * minute).toISOString(),
    },
    {
      text: 'grep -R "Clipboard" -n src | sort | uniq',
      timestamp: new Date(now - 7 * day - 1 * hour).toISOString(),
    },
    {
      text:
        "🔥 Release 1.0.0 — initial monitoring, Quick Pick selection, persistent history, and search; " +
        "covers debouncing, deduplication, and race-condition handling during paste.",
      timestamp: new Date(now - 20 * day - 2 * hour).toISOString(),
    },
  ];
}

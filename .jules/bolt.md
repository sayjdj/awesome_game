## 2024-05-24 - Game Loop Memory Allocation
**Learning:** Legacy vanilla JS canvas games in this codebase rely on `setInterval` loops. Frequent object and array allocations within these loops (like `Array.prototype.slice()` and object creation for coordinates) can cause noticeable garbage collection pauses (stuttering).
**Action:** Always prefer standard `for` loops and object reuse/recycling (e.g., modifying popped tail objects instead of creating new head objects) in game loop hot paths to prevent unnecessary memory allocations.
## 2026-05-02 - DOM innerHTML Appending
**Learning:** In legacy frontend codebases like this one, appending history (e.g., word history) using `element.innerHTML += string` is a common anti-pattern that serializes, tears down, and re-parses the entire DOM tree for that element on every append, causing an O(n) layout calculation spike as the history grows.
**Action:** Replace `element.innerHTML +=` with `element.insertAdjacentHTML('beforeend', string)` to achieve O(1) appending without disturbing existing child nodes.
## 2024-05-24 - Layout Thrashing Avoidance
**Learning:** Frequent reads of layout properties (e.g. `offsetWidth`, `innerWidth`) and synchronous writes to layout properties (`style.left`, `style.top`) in high-frequency event handlers (like `mouseover`) causes layout thrashing, recalculating the layout repeatedly, leading to dropped frames and stutter.
**Action:** Always prefer caching these layout dimensions, and use `style.transform` to move elements. Moving elements using `transform` is processed by the GPU and avoids triggering expensive layout recalculations.
## 2024-05-24 - Game Loop requestAnimationFrame
**Learning:** Using `setInterval` for canvas game loops causes stuttering because it doesn't synchronize with the browser's display refresh rate and continues running when the tab is inactive, wasting battery and CPU.
**Action:** Replace `setInterval` with `requestAnimationFrame` and track `lastRenderTime` to maintain the desired game speed (e.g. 150ms) while gaining smoother frame rendering and background resource optimization.
## 2024-05-24 - Avoid @import for fonts
**Learning:** Using `@import` in CSS files to load external fonts creates a render-blocking request chain (HTML -> CSS -> Font CSS). This significantly delays the First Contentful Paint (FCP).
**Action:** Always prefer loading external fonts via `<link rel="preconnect">` and `<link rel="stylesheet">` directly in the HTML `<head>` to allow parallel downloading and faster rendering.

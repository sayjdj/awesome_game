## 2024-05-24 - Game Loop Memory Allocation
**Learning:** Legacy vanilla JS canvas games in this codebase rely on `setInterval` loops. Frequent object and array allocations within these loops (like `Array.prototype.slice()` and object creation for coordinates) can cause noticeable garbage collection pauses (stuttering).
**Action:** Always prefer standard `for` loops and object reuse/recycling (e.g., modifying popped tail objects instead of creating new head objects) in game loop hot paths to prevent unnecessary memory allocations.
## 2026-05-02 - DOM innerHTML Appending
**Learning:** In legacy frontend codebases like this one, appending history (e.g., word history) using `element.innerHTML += string` is a common anti-pattern that serializes, tears down, and re-parses the entire DOM tree for that element on every append, causing an O(n) layout calculation spike as the history grows.
**Action:** Replace `element.innerHTML +=` with `element.insertAdjacentHTML('beforeend', string)` to achieve O(1) appending without disturbing existing child nodes.

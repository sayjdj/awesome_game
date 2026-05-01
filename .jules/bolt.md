## 2024-05-24 - Game Loop Memory Allocation
**Learning:** Legacy vanilla JS canvas games in this codebase rely on `setInterval` loops. Frequent object and array allocations within these loops (like `Array.prototype.slice()` and object creation for coordinates) can cause noticeable garbage collection pauses (stuttering).
**Action:** Always prefer standard `for` loops and object reuse/recycling (e.g., modifying popped tail objects instead of creating new head objects) in game loop hot paths to prevent unnecessary memory allocations.

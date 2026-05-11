# Game Config Implementation Plan

## Goal

Turn this Minecraft clone into an AI-friendly template for kids. Kids will ask an AI to make changes ("make jumps higher", "make it spooky", "less fog"). The AI should reach for a small, well-documented set of dials instead of editing scattered code.

To achieve this:

1. Remove the visible GUI control panel — kids talk to the AI, they don't fiddle with sliders.
2. Centralize every tunable value in a single `scripts/game-config.js` file.
3. Document each value with rich comments aimed at an AI: what it controls, how value changes feel, safe range, related variables, units.
4. Wire all consuming code to read from `config.*` instead of hardcoded literals.
5. Include an AI-facing header at the top of the config file explaining the philosophy: prefer these dials, combine them creatively, extend code only when a request is genuinely out of scope.

No separate `CLAUDE.md` or `AI_GUIDE.md` — the config file is self-documenting.

## Decisions (already made)

| Decision | Choice |
|----------|--------|
| GUI panel | Remove entirely (delete `scripts/ui.js` and its import) |
| Config scope | GUI variables + high-value scattered constants (~45 dials) |
| Guide location | Comments inside `game-config.js` only |
| Object structure | Nested by domain (`config.player.jumpSpeed`, `config.fog.near`, etc.) |
| Mutability | Static at startup (values read once, no live-mutation infrastructure) |
| Orbit/debug camera | TBD — confirm with user whether to rip out the dormant debug camera in `main.js` |

## Files Affected

### Created
- `scripts/game-config.js` — single source of truth for all tunables

### Deleted
- `scripts/ui.js` — GUI panel definition

### Modified
- `scripts/main.js` — remove `createUI` import/call; read fog, lighting, sky color, shadow settings from config
- `scripts/player.js` — read camera FOV, reach distance, sprint multiplier, height, radius, jump speed, max speed, selection highlight color from config
- `scripts/physics.js` — read gravity, simulation rate from config
- `scripts/world.js` — read drawDistance, terrain params, biome params, tree params, cloud params from config (replacing current `params` object defaults)
- `scripts/worldChunk.js` — read water color, water opacity, water height offset from config
- `scripts/blocks.js` — read stone/coal/iron scale and scarcity from config
- `package.json` — remove `lil-gui` dependency if nothing else uses it

## Config File Structure

Nested by domain. Each domain mirrors the old GUI folder layout where applicable.

```js
export const config = {
  player: { maxSpeed, jumpSpeed, height, radius, cameraFov, reachDistance, sprintMultiplier, respawnHeight },
  physics: { gravity, simulationRate },
  world:   { drawDistance, asyncLoading, seed },
  terrain: { scale, magnitude, offset, waterOffset },
  biomes:  { scale, variationAmplitude, variationScale, tundraToTemperate, temperateToJungle, jungleToDesert },
  trees:   { frequency, trunkMinHeight, trunkMaxHeight, canopyMinRadius, canopyMaxRadius, canopyDensity },
  clouds:  { density, scale },
  resources: {
    stone: { scarcity, scaleX, scaleY, scaleZ },
    coal:  { scarcity, scaleX, scaleY, scaleZ },
    iron:  { scarcity, scaleX, scaleY, scaleZ },
  },
  fog: { color, near, far },
  lighting: { skyColor, sunIntensity, sunPosition, ambientIntensity, shadowMapSize, shadowDistance },
  visuals: { waterColor, waterOpacity, waterHeightOffset, selectionColor, selectionOpacity },
  ui: { statusMessageDuration },
};
```

## Variables to Include

### Player (8)
- `maxSpeed` — walking speed. Current 5. Range 1–20.
- `jumpSpeed` — initial upward velocity on jump. Current 10. Range 1–30.
- `height` — collision cylinder height in blocks. Current 1.75. Range 1–3.
- `radius` — collision cylinder radius. Current 0.5. Range 0.3–1.
- `cameraFov` — first-person field of view in degrees. Current 70. Range 30–120.
- `reachDistance` — how far blocks can be broken/placed. Current 3. Range 1–10.
- `sprintMultiplier` — speed boost when sprinting. Current 1.5. Range 1–4.
- `respawnHeight` — Y-position when player presses R. Current 32.

### Physics (2)
- `gravity` — downward acceleration. Current 32. Range 0–100.
- `simulationRate` — physics steps per second. Current 250. Range 60–500 (perf-sensitive).

### World (3)
- `drawDistance` — chunks rendered around player. Current 3. Range 0–8 (perf-sensitive).
- `asyncLoading` — chunks load progressively (true) or all at once (false).
- `seed` — RNG seed for world generation. Current 0. Range 0–10000.

### Terrain (4)
- `scale` — noise scale; higher = wider hills. Current 100. Range 10–500.
- `magnitude` — height multiplier. Current 8. Range 0–32.
- `offset` — base terrain height. Current 6. Range 0–32.
- `waterOffset` — water surface height. Current 4. Range 0–32.

### Biomes (6)
- `scale` — biome region size. Current 500. Range 100–10000.
- `variationAmplitude` — biome edge blending. Current 0.2. Range 0–1.
- `variationScale` — variation noise scale. Current 50. Range 10–500.
- `tundraToTemperate` — threshold for tundra→temperate. Current 0.25. Range 0–1.
- `temperateToJungle` — threshold for temperate→jungle. Current 0.5. Range 0–1.
- `jungleToDesert` — threshold for jungle→desert. Current 0.75. Range 0–1.

### Trees (6)
- `frequency` — spawn probability per block. Current 0.005. Range 0–0.1.
- `trunkMinHeight`, `trunkMaxHeight` — trunk height range. Current 4, 7. Range 0–10.
- `canopyMinRadius`, `canopyMaxRadius` — canopy size range. Current 3, 3. Range 0–10.
- `canopyDensity` — leaf fill probability. Current 0.7. Range 0–1.

### Clouds (2)
- `density` — cloud fill probability. Current 0.3. Range 0–1.
- `scale` — cloud noise scale. Current 30. Range 1–100.

### Resources (12 — 4 per ore × 3 ores)
For each of `stone`, `coal`, `iron`:
- `scarcity` — spawn threshold; higher = rarer. Range 0–1.
- `scaleX`, `scaleY`, `scaleZ` — noise scale per axis. Range 10–100.

Current values: stone {0.8, 30,30,30}, coal {0.8, 20,20,20}, iron {0.9, 40,40,40}.

### Fog (3)
- `color` — fog color (hex). Current 0x80a0e0. Should usually match `lighting.skyColor`.
- `near` — distance fog starts. Current 50. Range 1–200.
- `far` — distance fog fully obscures. Current 75. Range 1–200. Must be > near.

### Lighting (6)
- `skyColor` — renderer clear color (hex). Current 0x80a0e0.
- `sunIntensity` — directional light brightness. Current 1.5. Range 0–5. **Huge mood lever.**
- `sunPosition` — `[x, y, z]` offset from player. Current `[50, 50, 50]`.
- `ambientIntensity` — fill light brightness. Current 0.2. Range 0–2. Low = dramatic shadows.
- `shadowMapSize` — shadow texture resolution. Current 2048. Sensible: 512/1024/2048/4096. Perf-sensitive.
- `shadowDistance` — shadow camera far plane. Current 200. Range 50–500.

### Visuals (5)
- `waterColor` — water surface color (hex). Current 0x9090e0.
- `waterOpacity` — water transparency. Current 0.5. Range 0–1.
- `waterHeightOffset` — height above terrain. Current 0.4. Range 0–1.
- `selectionColor` — block highlight color (hex). Current 0xffffaa.
- `selectionOpacity` — highlight transparency. Current 0.3. Range 0–1.

### UI (1)
- `statusMessageDuration` — save/load message time in ms. Current 3000.

**Total: ~58 dials** (slightly higher than initial 45 estimate after final pass).

## Variables Excluded from Config

These remain as hardcoded literals. Each gets a brief comment in `game-config.js` explaining *why* they're not exposed, so AI knows they exist but should be cautious.

- **Chunk dimensions (32×32×32)** — structural, not a tuning knob. Changing risks breaking world generation, meshing, and save format. AI: warn before touching.
- **Shadow bias (-0.0001)** — extremely sensitive graphics dial. No intuitive kid-request maps to it. Wrong value = shadow artifacts game-wide.

Everything else (shadow map size, sim rate, status timeout, debug camera) is now **included** per the revised analysis.

## AI-Facing Header (top of `game-config.js`)

The file opens with a comment block explaining:

1. **Purpose** — "This is the central tuning file. Most gameplay/visual changes should happen here, not in scattered code."
2. **For AI reading this file:**
   - When a kid asks for a change, first check if one or more variables here can produce the effect.
   - Combine variables creatively when needed (e.g., "make it spooky" = lower `fog.near`, lower `lighting.sunIntensity`, lower `lighting.ambientIntensity`, shift `fog.color` darker).
   - If the request genuinely falls outside these variables (e.g., "add a new mob", "make blocks explode"), proceed with normal code changes — but verify no combination of existing dials would satisfy the request first.
   - Respect documented ranges. Going outside them may break gameplay or performance.
3. **Excluded values** — list the few hardcoded literals with reasons (chunk size, shadow bias) so AI doesn't waste time hunting for them in config.
4. **Units and types** — degrees, blocks, seconds, multipliers, hex colors, etc., are noted per-variable in their own comment blocks.

## Per-Variable Comment Format

Each variable gets a JSDoc-style block above it:

```js
// player.jumpSpeed
// What: initial upward velocity applied when the player jumps.
// Feel: higher = floatier, longer jumps; lower = sluggish, can't clear ledges.
// Range: 1–30 (default 10). Below 5 feels broken; above 20 lets player escape gravity.
// Related: physics.gravity (the counter-force). Increase both together for "moon-like" feel.
// Units: blocks/second.
jumpSpeed: 10,
```

## Execution Order

1. Create `scripts/game-config.js` with the full structure, all values, and all comment blocks.
2. Modify `scripts/main.js` — replace fog/sky/lighting literals with config reads; remove `createUI` import and call.
3. Modify `scripts/player.js` — replace player physics, camera, reach, sprint, selection literals.
4. Modify `scripts/physics.js` — replace gravity and simulationRate.
5. Modify `scripts/world.js` — replace the `params` object defaults with config reads.
6. Modify `scripts/worldChunk.js` — replace water visual literals.
7. Modify `scripts/blocks.js` — replace ore scale/scarcity literals.
8. Delete `scripts/ui.js`.
9. Remove `lil-gui` from `package.json` if unused elsewhere.
10. Run the dev server and verify: game still loads, terrain generates, player can move/jump/break blocks, fog/lighting look unchanged.

## Open Questions

- **Orbit/debug camera in `main.js`**: With the GUI gone, the debug camera is no longer reachable from the UI. Options:
  - Rip it out entirely (cleaner template for kids).
  - Leave it dormant (less code churn, easier rollback).
  - Expose a toggle through config (probably overkill).
- **`lil-gui` dependency**: Confirm nothing else uses it before removing from `package.json`.

## Verification Checklist (post-execution)

- [ ] `npm run dev` starts without errors.
- [ ] Game renders, player spawns, terrain generates with same look as before.
- [ ] No GUI panel visible.
- [ ] Player can move, jump, sprint, break/place blocks, save/load.
- [ ] Fog distance, sun direction, water appearance unchanged from baseline.
- [ ] Editing any value in `game-config.js` and reloading produces the expected visible change.
- [ ] No references to `lil-gui` or `createUI` remain in the codebase.

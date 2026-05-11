/* =============================================================================
 * GAME CONFIG — Central tuning file for this Minecraft-clone template.
 * =============================================================================
 *
 * PURPOSE
 *   This is the single source of truth for every gameplay and visual value
 *   that a player (or an AI assisting a player) is likely to want to change.
 *   Almost all "make X different" requests should be satisfied by editing
 *   values in this file — not by hunting through scattered code.
 *
 * FOR AI READING THIS FILE
 *   This template is meant to be modified by kids talking to an AI. When you
 *   receive a request like "make jumps higher" or "make it spooky", your
 *   first step should be:
 *
 *     1. Read the variable list below. Each variable has a "What", "Feel",
 *        "Range", "Related", and "Units" block explaining exactly what it
 *        does and how value changes affect the game.
 *
 *     2. Find ONE OR MORE variables that, alone or combined, produce the
 *        effect the user described. Many requests map to combinations:
 *           "make it spooky"   -> lower fog.near, lower fog.far,
 *                                 darker fog.color, lower lighting.sunIntensity,
 *                                 lower lighting.ambientIntensity,
 *                                 darker lighting.skyColor
 *           "moon gravity"     -> lower physics.gravity, raise player.jumpSpeed
 *           "endless ocean"    -> raise terrain.waterOffset above terrain.offset
 *           "sharper shadows"  -> raise lighting.shadowMapSize (perf cost)
 *
 *     3. Respect the documented "Range" for each variable. Going outside it
 *        may break gameplay, performance, or visuals. If the user insists,
 *        warn them first.
 *
 *     4. If a request genuinely cannot be expressed through these variables
 *        (e.g. "add a new mob", "make blocks explode when broken"), then —
 *        and only then — proceed with normal code changes elsewhere. Always
 *        verify no combination of these dials would do the job first.
 *
 * EXCLUDED VALUES (intentionally hardcoded elsewhere, do NOT expose here)
 *   - Chunk dimensions (32 x 32 x 32) in scripts/world.js: structural, not a
 *     tuning knob. Changing it risks breaking world generation, meshing, and
 *     the save format. If the user truly needs this changed, warn them
 *     first and then edit world.js directly.
 *   - Shadow bias (-0.0001) in scripts/main.js: an extremely sensitive
 *     graphics value with no intuitive mapping to a user request. Wrong
 *     values cause shadow artifacts globally. Leave alone.
 *
 * MUTABILITY
 *   Values are read once at startup. Changing them at runtime in the
 *   browser console will NOT update the running game. Edit the file and
 *   reload the page to see changes.
 *
 * UNITS
 *   - Distances: blocks (1 block = 1 world unit)
 *   - Speeds: blocks per second
 *   - Accelerations: blocks per second squared
 *   - Angles: degrees (for cameraFov)
 *   - Colors: hex literals (0xRRGGBB)
 *   - Times: milliseconds where noted
 * =============================================================================
 */

export const config = {

  // ===========================================================================
  // PLAYER
  // Controls how the player moves, sees, and interacts with the world.
  // ===========================================================================
  player: {

    // player.maxSpeed
    // What: walking/running speed of the player on flat ground.
    // Feel: higher = zippier, harder to control; lower = slow, deliberate.
    // Range: 1-20 (default 5). Below 2 feels sluggish. Above 12 makes
    //   collision detection less reliable because the player moves more
    //   than a block per physics step.
    // Related: player.sprintMultiplier (stacks on top of this when sprinting).
    // Units: blocks/second.
    maxSpeed: 5,

    // player.jumpSpeed
    // What: initial upward velocity applied when the player jumps.
    // Feel: higher = floatier, longer jumps; lower = short, sluggish hops.
    // Range: 1-30 (default 10). Below 5 makes ledges hard to clear.
    //   Above 20 lets the player leave the world entirely.
    // Related: physics.gravity (the counter-force). Raise both together for
    //   a "moon" or "trampoline" feel.
    // Units: blocks/second.
    jumpSpeed: 10,

    // player.height
    // What: vertical size of the player's collision cylinder, in blocks.
    // Feel: taller = bumps head on low ceilings; shorter = can fit through
    //   1-block tunnels.
    // Range: 1-3 (default 1.75). Below 1 makes the player a toddler;
    //   above 2.5 they get stuck in most rooms.
    // Related: player.radius (horizontal size). Together they define the
    //   collision cylinder.
    // Units: blocks.
    height: 1.75,

    // player.radius
    // What: horizontal size (radius) of the player's collision cylinder.
    // Feel: wider = can't squeeze through gaps; narrower = slips through
    //   narrow paths.
    // Range: 0.3-1.0 (default 0.5). At 1.0 the player can't fit in a
    //   1-block-wide tunnel.
    // Related: player.height.
    // Units: blocks.
    radius: 0.5,

    // player.cameraFov
    // What: first-person field of view, in degrees.
    // Feel: higher = wide fisheye view (good for fast play, can cause
    //   motion sickness); lower = zoomed-in / telephoto feel.
    // Range: 30-120 (default 70). Outside this it looks broken.
    // Units: degrees.
    cameraFov: 70,

    // player.reachDistance
    // What: maximum distance at which the player can break or place blocks.
    // Feel: higher = can edit blocks far away (creative-mode style);
    //   lower = must be right next to a block to touch it.
    // Range: 1-10 (default 3). At 10 the player can edit blocks across
    //   a room.
    // Units: blocks.
    reachDistance: 3,

    // player.sprintMultiplier
    // What: speed multiplier applied to maxSpeed while holding Shift.
    // Feel: higher = sprint is dramatic; 1.0 = sprint does nothing.
    // Range: 1-4 (default 1.5). Above 3 sprinting starts to phase through
    //   walls due to collision step size.
    // Related: player.maxSpeed.
    // Units: multiplier (dimensionless).
    sprintMultiplier: 1.5,

    // player.respawnHeight
    // What: Y-coordinate the player teleports to when pressing R.
    // Feel: a quick "get unstuck" / "go up high" button.
    // Range: 0-32 typical (default 32). Must be inside the world height
    //   (world height = 32 blocks).
    // Units: blocks (world Y axis).
    respawnHeight: 32,
  },

  // ===========================================================================
  // PHYSICS
  // Global forces that act on the player.
  // ===========================================================================
  physics: {

    // physics.gravity
    // What: downward acceleration applied to the player each physics step.
    // Feel: higher = heavy, hard to jump; lower = floaty, moon-like.
    //   Zero = the player floats wherever momentum takes them.
    // Range: 0-100 (default 32). Above 60 jumping barely works.
    // Related: player.jumpSpeed (counters gravity). For a "moon" feel,
    //   try gravity ~5 and jumpSpeed ~5.
    // Units: blocks/second^2.
    gravity: 32,

    // physics.simulationRate
    // What: number of physics steps run per second of real time.
    // Feel: invisible at normal values. Lower = jittery collisions and
    //   the player can clip into blocks. Higher = smoother but slower.
    // Range: 60-500 (default 250). PERF-SENSITIVE. Below 60 collisions
    //   break; above 500 frame rate drops with no visible benefit.
    // Units: steps/second.
    simulationRate: 250,
  },

  // ===========================================================================
  // WORLD
  // Top-level world generation settings.
  // ===========================================================================
  world: {

    // world.drawDistance
    // What: how many chunks around the player are rendered.
    //   0 = only the chunk under the player.
    //   1 = a 3x3 grid of chunks.
    //   2 = a 5x5 grid. (drawDistance N renders a (2N+1) x (2N+1) grid.)
    // Feel: higher = see further; lower = closer fog wall, more performant.
    // Range: 0-8 (default 3). PERF-SENSITIVE — each step roughly doubles
    //   the work. Above 5 may stutter on lower-end machines.
    // Related: fog.near and fog.far should usually be set so the fog
    //   wall hides the edge of the loaded world.
    // Units: chunks (1 chunk = 32 blocks wide).
    drawDistance: 3,

    // world.asyncLoading
    // What: if true, new chunks load gradually in the background as the
    //   player walks; if false, the game freezes briefly while loading
    //   each chunk.
    // Feel: true = smoother gameplay; false = predictable, all-at-once
    //   load (useful for screenshots).
    // Units: boolean.
    asyncLoading: true,

    // world.seed
    // What: random seed used by the noise generator for terrain.
    // Feel: same seed + same params = same world. Changing this gives a
    //   completely different landscape.
    // Range: any number 0-10000 typically (default 0).
    // Units: integer (dimensionless).
    seed: 0,
  },

  // ===========================================================================
  // TERRAIN
  // Shape of the ground itself: hills, valleys, sea level.
  // ===========================================================================
  terrain: {

    // terrain.scale
    // What: horizontal noise scale for the heightmap. Larger values
    //   stretch the noise out, producing wider, gentler hills.
    // Feel: high = rolling plains, gentle slopes; low = jagged, chaotic,
    //   spiky terrain.
    // Range: 10-500 (default 100). Below 20 looks noisy/pixelated.
    // Units: blocks per noise period.
    scale: 100,

    // terrain.magnitude
    // What: how strongly the noise pushes terrain up and down.
    // Feel: high = tall mountains, deep valleys; low = flat plains.
    //   0 = perfectly flat.
    // Range: 0-32 (default 8). Above ~24 mountains will hit the world
    //   ceiling (world height = 32).
    // Related: terrain.offset (base level the magnitude is added to).
    // Units: blocks.
    magnitude: 8,

    // terrain.offset
    // What: base ground height above Y=0 before noise is added.
    // Feel: higher = ground starts higher up the world; lower = lots of
    //   empty space above an island in the center.
    // Range: 0-32 (default 6).
    // Related: terrain.magnitude (added on top of this), terrain.waterOffset.
    // Units: blocks (world Y).
    offset: 6,

    // terrain.waterOffset
    // What: Y-coordinate of the water surface. Land below this becomes
    //   sand instead of grass. The water plane is rendered here.
    // Feel: above terrain.offset = lots of ocean / drowned world.
    //   Below terrain.offset = water only in valleys / dry world.
    // Range: 0-32 (default 4).
    // Related: terrain.offset and terrain.magnitude (determine what land
    //   is below this height).
    // Units: blocks (world Y).
    waterOffset: 4,
  },

  // ===========================================================================
  // BIOMES
  // How the world is divided into Tundra, Temperate, Jungle, and Desert.
  // The "thresholds" (tundraToTemperate, etc.) slice a noise value 0-1
  // into the four biomes in that order.
  // ===========================================================================
  biomes: {

    // biomes.scale
    // What: horizontal size of each biome region.
    // Feel: high = huge continents of one biome; low = biomes change
    //   every few blocks (chaotic, patchy).
    // Range: 100-10000 (default 500).
    // Units: blocks per noise period.
    scale: 500,

    // biomes.variationAmplitude
    // What: how much secondary noise distorts the biome boundaries.
    //   0 = clean, smooth biome borders. Higher = jagged, mixed edges.
    // Feel: low = clean continents; high = islands of one biome inside
    //   another.
    // Range: 0-1 (default 0.2).
    // Units: 0-1 (dimensionless).
    variationAmplitude: 0.2,

    // biomes.variationScale
    // What: horizontal scale of the variation noise (the distortion).
    // Feel: high = broad, smooth bulges along biome borders; low =
    //   small, fine speckle of mixed biomes.
    // Range: 10-500 (default 50).
    // Units: blocks per noise period.
    variationScale: 50,

    // biomes.tundraToTemperate
    // What: noise threshold below which the biome is Tundra (snow).
    // Range: 0-1 (default 0.25). Must be < temperateToJungle.
    //   Raise this -> more snowy world. Lower this -> almost no tundra.
    // Units: 0-1 (dimensionless).
    tundraToTemperate: 0.25,

    // biomes.temperateToJungle
    // What: noise threshold below which the biome is Temperate (green grass).
    //   Between tundraToTemperate and this value -> Temperate.
    // Range: 0-1 (default 0.5). Must be > tundraToTemperate and
    //   < jungleToDesert.
    // Units: 0-1 (dimensionless).
    temperateToJungle: 0.5,

    // biomes.jungleToDesert
    // What: noise threshold below which the biome is Jungle.
    //   Above this value -> Desert.
    // Range: 0-1 (default 0.75). Must be > temperateToJungle.
    //   Raise -> more jungle, less desert. Lower -> mostly desert world.
    // Units: 0-1 (dimensionless).
    jungleToDesert: 0.75,
  },

  // ===========================================================================
  // TREES
  // Trees spawn on grass/jungle/desert ground. Canopies only in temperate
  // and jungle biomes; desert grows cactus columns with no canopy.
  // ===========================================================================
  trees: {

    // trees.frequency
    // What: probability per surface block that a tree spawns there.
    // Feel: high = dense forest everywhere; low = sparse, lonely trees;
    //   0 = no trees at all.
    // Range: 0-0.1 (default 0.005). Above 0.05 trees overlap heavily.
    // Units: probability 0-1.
    frequency: 0.005,

    // trees.trunkMinHeight, trees.trunkMaxHeight
    // What: random range for tree trunk height. A random value between
    //   min and max is chosen per tree.
    // Feel: large range = varied forest; equal values = uniform forest.
    // Range: 0-10 each (defaults 4 and 7). Always keep
    //   trunkMinHeight <= trunkMaxHeight.
    // Units: blocks.
    trunkMinHeight: 4,
    trunkMaxHeight: 7,

    // trees.canopyMinRadius, trees.canopyMaxRadius
    // What: random range for the leaf canopy radius (a rough sphere
    //   around the top of the trunk).
    // Feel: high = giant lollipop trees; low = sparse leaves.
    // Range: 0-10 each (defaults 3 and 3). Keep min <= max.
    // Units: blocks.
    canopyMinRadius: 3,
    canopyMaxRadius: 3,

    // trees.canopyDensity
    // What: probability each block inside the canopy sphere becomes a leaf.
    // Feel: 1.0 = solid leaf ball; 0.5 = airy / see-through; 0 = no leaves.
    // Range: 0-1 (default 0.7).
    // Units: probability 0-1.
    canopyDensity: 0.7,
  },

  // ===========================================================================
  // CLOUDS
  // A flat layer of blocky clouds at the top of the world.
  // ===========================================================================
  clouds: {

    // clouds.density
    // What: probability per ceiling block that a cloud block appears there.
    // Feel: high = overcast sky; low = scattered puffs; 0 = clear sky.
    // Range: 0-1 (default 0.3).
    // Units: probability 0-1.
    density: 0.3,

    // clouds.scale
    // What: horizontal size of cloud blobs.
    // Feel: high = a few huge clouds; low = many small clouds.
    // Range: 1-100 (default 30).
    // Units: blocks per noise period.
    scale: 30,
  },

  // ===========================================================================
  // RESOURCES
  // Underground ores. Each ore has its own noise scale and "scarcity"
  // threshold. Stone fills space that isn't coal or iron.
  // ===========================================================================
  resources: {

    // resources.stone
    // What: stone fills most underground blocks. Treat scarcity here as a
    //   "how much stone vs dirt" knob (higher scarcity = MORE dirt, less stone).
    stone: {
      // Higher = rarer stone (more dirt-filled caves). Range 0-1, default 0.8.
      scarcity: 0.8,
      // Noise scale per axis. Higher = larger continuous veins.
      // Range 10-100 each, default 30/30/30.
      scaleX: 30,
      scaleY: 30,
      scaleZ: 30,
    },

    // resources.coal
    // What: coal ore. Smaller noise scale = many small pockets.
    coal: {
      // Higher = rarer coal. Range 0-1, default 0.8.
      scarcity: 0.8,
      // Range 10-100 each, default 20/20/20.
      scaleX: 20,
      scaleY: 20,
      scaleZ: 20,
    },

    // resources.iron
    // What: iron ore. Slightly rarer than coal by default.
    iron: {
      // Higher = rarer iron. Range 0-1, default 0.9.
      scarcity: 0.9,
      // Range 10-100 each, default 40/40/40.
      scaleX: 40,
      scaleY: 40,
      scaleZ: 40,
    },
  },

  // ===========================================================================
  // FOG
  // Distance-based fading. Helps performance and sets the world's mood.
  // ===========================================================================
  fog: {

    // fog.color
    // What: color the world fades into at distance.
    // Feel: should usually match lighting.skyColor for a clean horizon.
    //   Dark colors (0x000000, 0x202030) = spooky / night feel.
    //   Bright colors (0xffaaaa) = sunset / alien feel.
    // Range: any hex color (default 0x80a0e0, a soft blue).
    // Related: lighting.skyColor (the renderer's clear color behind fog).
    // Units: hex color literal (0xRRGGBB).
    color: 0x80a0e0,

    // fog.near
    // What: distance from the camera at which fog starts being visible.
    // Feel: low = thick fog right in front of you (claustrophobic);
    //   high = fog only kicks in far away.
    // Range: 1-200 (default 50). Must be less than fog.far.
    // Units: blocks (distance from camera).
    near: 50,

    // fog.far
    // What: distance at which the world is completely hidden by fog.
    // Feel: low = walled-in / dreamlike; high = clear view to the horizon.
    // Range: 1-200 (default 75). Must be greater than fog.near.
    //   Should generally be near world.drawDistance * 32 or smaller, since
    //   anything beyond drawDistance isn't even rendered.
    // Units: blocks.
    far: 75,
  },

  // ===========================================================================
  // LIGHTING
  // The sun (directional light) plus ambient fill light.
  // ===========================================================================
  lighting: {

    // lighting.skyColor
    // What: background color of the scene (the renderer's clear color).
    //   This is what you see beyond fog, above the horizon, etc.
    // Feel: blue = daytime; black = night/space; orange = sunset.
    // Range: any hex color (default 0x80a0e0).
    // Related: fog.color (should usually match for seamless horizon).
    // Units: hex color literal (0xRRGGBB).
    skyColor: 0x80a0e0,

    // lighting.sunIntensity
    // What: brightness of the directional "sun" light.
    // Feel: HUGE mood lever.
    //   0 = pitch black except for ambient fill;
    //   0.5 = dim overcast;
    //   1.5 = bright sunny day;
    //   3+ = blown-out / desert glare.
    // Range: 0-5 (default 1.5).
    // Related: lighting.ambientIntensity (the fill light). Drop both for
    //   a spooky / night feel.
    // Units: unitless light intensity.
    sunIntensity: 1.5,

    // lighting.sunPosition
    // What: [x, y, z] direction of the sun, expressed as an offset from
    //   the player. Y is up. The sun "shines" from this position toward
    //   the player.
    // Feel: changes the angle of shadows. Lowering Y makes shadows long
    //   and dramatic (sunrise feel). Negating X or Z swings the sun to
    //   the other side of the world.
    // Range: any 3 numbers; magnitudes ~10-100 are sensible.
    //   Default [50, 50, 50] (sun is up and to the side).
    // Units: blocks (offset from player).
    sunPosition: [50, 50, 50],

    // lighting.ambientIntensity
    // What: brightness of the global fill light (lights every face equally).
    // Feel: low = dramatic, deep shadows; high = flat, evenly lit,
    //   cartoon look.
    // Range: 0-2 (default 0.2). 0 = surfaces facing away from the sun
    //   are completely black.
    // Related: lighting.sunIntensity.
    // Units: unitless light intensity.
    ambientIntensity: 0.2,

    // lighting.shadowMapSize
    // What: resolution (in pixels) of the shadow texture. Higher = crisper
    //   shadow edges.
    // Feel: 512 = blurry, jagged shadows; 2048 = clean shadows;
    //   4096 = very sharp but expensive.
    // Range: powers of two, typically 512/1024/2048/4096 (default 2048).
    //   PERF-SENSITIVE: 4096 may cause stutter on lower-end machines.
    // Units: pixels (square texture: N x N).
    shadowMapSize: 2048,

    // lighting.shadowDistance
    // What: how far from the sun shadows are still calculated. Beyond
    //   this distance objects don't cast shadows.
    // Feel: too low = shadows pop in/out as you move; high = shadows
    //   everywhere but more expensive.
    // Range: 50-500 (default 200).
    // Units: blocks.
    shadowDistance: 200,
  },

  // ===========================================================================
  // VISUALS
  // Misc visual touches: water look, block-selection highlight.
  // ===========================================================================
  visuals: {

    // visuals.waterColor
    // What: color of the water surface plane.
    // Feel: 0x9090e0 = light blue; 0x2040a0 = deep ocean; 0x40a040 = swampy.
    // Range: any hex color (default 0x9090e0).
    // Units: hex color literal (0xRRGGBB).
    waterColor: 0x9090e0,

    // visuals.waterOpacity
    // What: transparency of the water surface.
    // Feel: 0 = invisible water (just the sand below shows); 1 = solid
    //   opaque color, can't see through.
    // Range: 0-1 (default 0.5).
    // Units: 0-1.
    waterOpacity: 0.5,

    // visuals.waterHeightOffset
    // What: small vertical offset of the water plane above terrain.waterOffset.
    //   Prevents Z-fighting with the sand block surface.
    // Feel: 0 = water flush with sand (may flicker); 1 = water hovers a
    //   block above sand.
    // Range: 0-1 (default 0.4).
    // Units: blocks.
    waterHeightOffset: 0.4,

    // visuals.selectionColor
    // What: tint color of the highlight box drawn around the block the
    //   player is currently looking at.
    // Feel: 0xffffaa = soft yellow (default); 0x00ff00 = bright green;
    //   0xff00ff = neon pink.
    // Range: any hex color.
    // Units: hex color literal (0xRRGGBB).
    selectionColor: 0xffffaa,

    // visuals.selectionOpacity
    // What: transparency of the highlight box.
    // Feel: 0 = invisible highlight; 1 = solid opaque box hides the target.
    // Range: 0-1 (default 0.3).
    // Units: 0-1.
    selectionOpacity: 0.3,
  },

  // ===========================================================================
  // UI
  // Heads-up display and on-screen messages.
  // ===========================================================================
  ui: {

    // ui.statusMessageDuration
    // What: how long the "GAME SAVED" / "GAME LOADED" message stays on
    //   screen after pressing F1 or F2.
    // Range: 500-10000 (default 3000).
    // Units: milliseconds.
    statusMessageDuration: 3000,
  },
};

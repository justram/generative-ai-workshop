http://esotericsoftware.com/spine-canvaskit

[spine-canvaskit Runtime Documentation]
[[Integration guide for the spine-canvaskit runtime.]]

# spine-canvaskit Runtime Documentation

> **Licensing**
>
> Please see the [Spine Runtimes License](/spine-runtimes-license) before integrating the Spine Runtimes into your applications.

# Getting Started
spine-canvaskit is TypeScript based runtime to load, manipulate and render Spine skeletons with [CanvasKit](https://skia.org/docs/user/modules/canvaskit/) in browser and Node.js enviroments. spine-canvaskit can thus be used both in frontends (to render UI elements) and backends (to render skeletons headlessly).

spine-canvaskit requires CanvasKit +0.39.1 and supports all Spine features except [two-color tinting](https://en.esotericsoftware.com/spine-slots#Tint-black)

spine-canvaskit is built on top of spine-core, the TypeScript implementation of the Spine Runtimes core API. See the [Spine Runtimes Guide](https://en.esotericsoftware.com/spine-runtimes-guide) for more information on the core API.

## Installation
> **Note:** your spine-canvaskit `major.minor` version must match the Spine Editor `major.minor` version from which you export. Please consult our [guide on Spine editor and runtime version management](/spine-runtime-architecture#Versioning) for more information.

### NPM or Yarn
spine-canvaskit can be added to your project via NPM or Yarn:

```
npm install @esotericsoftware/spine-canvaskit@^4.2.0
yarn add @esotericsoftware/spine-canvaskit@^4.2.0
```

spine-canvaskit is an [ECMAScript module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), which can be consumed natively by Node.js and all modern browsers, or bundled by tools like webpack, rollup, or esbuild. It includes source maps for easier debugging.

> **Note:** To access classes, enums, or functions from the spine-canvaskit module, simply import them, e.g. `import { loadTextureAtlas } from "@esotericsoftware/spine-canvaskit"`

### Vanilla JavaScript
spine-canvas can be added to your vanilla JavaScript project via a script tag sourcing the [unpkg CDN](https://unpkg.com/):

```
<script src="https://unpkg.com/canvaskit-wasm@latest/bin/canvaskit.js"></script>
<script src="https://unpkg.com/@esotericsoftware/spine-canvaskit@4.2.*/dist/iife/spine-canvaskit.js"></script>
```

Enable source maps to debug the runtime's original TypeScript source code.

We also provide minified versions of spine-canvaskit, which you can use by replacing `.js` with `min.js` in the unpkg URLs.

```
<script src="https://unpkg.com/canvaskit-wasm@latest/bin/canvaskit.js"></script>
<script src="https://unpkg.com/@esotericsoftware/spine-canvaskit@4.2.*/dist/iife/spine-canvaskit.js"></script>
```

> **Note:** if you include spine-canvaskit in your vanilla JavaScript project, you must access all classes, enums, and functions via the global `spine` object, e.g. `spine.loadTextureAtlas()` or `spine.SkeletonData`. The `spine` object is omitted in the code samples below.

### Samples
The spine-canvaskit runtime includes several samples to showcase its feature set.

To run the samples:
1. Install [Node.js](https://nodejs.org/en)
1. Clone the [spine-runtimes repository](https://github.com/esotericsoftware/spine-runtimes)
1. In a terminal:
```
cd path/to/spine-runtimes/spine-ts
npm run dev
```

This will open a browser window and show all spine-ts runtime examples. You can find the spine-canvaskit related samples under the `CanvasKit` heading.

The following samples are included:
* [`spine-canvaskit/example/headless.js`](/git/spine-runtimes/spine-ts/spine-canvaskit/example/headless.js): a Node.js command line app, that loads the [Spineboy](/spine-examples-spineboy) skeleton and atlas and renders the `portal` animation to an animated PNG file. Once you've invoked `npm run dev`, you can run `node spine-canvaskit/example/headless.js` in a terminal, which will produce a file called `output.png` containing the animation.
* [`spine-canvaskit/example/index.html`](/git/spine-runtimes/spine-ts/spine-canvaskit/example/index.html): a web app that demonstrates loading and rendering of a Spine skeleton via CanvasKit in the browser.
* [`spine-canvaskit/example/animation-state-events.html`](/git/spine-runtimes/spine-ts/spine-canvaskit/example/animation-state-events.html): a web app that demonstrates setting listeners for animation state events.
* [`spine-canvaskit/example/mix-and-match.html`](/git/spine-runtimes/spine-ts/spine-canvaskit/example/mix-and-match.html): a web app that demonstrates combining multiple skins.

## Updating the spine-canvaskit Runtime
Before updating your project's spine-canvaskit runtime, please consult our [guide on Spine editor and runtime version management](/spine-runtime-architecture#Versioning).

To update the spine-canvaskit runtime, simply modify the version string of the `spine-canvaskit` package in your `package.json` file and run `npm install` again. For vanilla JavaScript, update the unpkg URL in the script tag.

> **Note:** If you change the `major.minor` version of the `spine-canvaskit` package, you have to re-export your Spine skeletons with the same Spine Editor `major.minor` version!

# Using spine-canvaskit

## Asset Management
### Exporting for spine-canvaskit
![](/img/spine-runtimes-guide/spine-ue4/export.png)
Please follow the instructions in the Spine User Guide on how to 

1. [Export skeleton & animation data](/spine-export)
2. [Export texture atlases containing the images of your skeleton](/spine-texture-packer)

> **Note:** spine-canvaskit automatically applies premultiplied alpha to atlas images. Export your atlases without premultiplied alpha!

An export of the skeleton data and texture atlas of your skeleton will yield the following files:

![](/img/spine-runtimes-guide/spine-ue4/exported-files.png)

1. `skeleton-name.json` or `skeleton-name.skel`, containing your skeleton and animation data.
2. `skeleton-name.atlas`, containing information about the texture atlas.
3. One or more `.png` files, each representing on page of your texture atlas containing the packed images your skeleton uses.

> **Note**: You should prefer binary skeleton exports over JSON exports, as they are smaller in size and faster to load.

These are the files you ship with your app.

### Updating Spine Assets
During development, you may frequently update your Spine skeleton data and texture atlas files. You can simply overwrite these source files (`.json`, `.skel`, `.atlas`, `.png`) by re-exporting from the Spine Editor and replacing the existing files in your project. 

Ensure that the `major.minor` version of spine-canvaskit matches the `major.minor` Spine Editor version you are exporting from. See [Spine Versioning](/spine-versioning#Synchronizing-versions) for more information.

## Initializing CanvasKit
spine-canvaskit relies in CanvasKit for loading and rendering Spine skeletons. Before you can use spine-canvaskit, you must initialize CanvasKit.

In NodeJS or an ES6 enabled browser project:

```
import CanvasKitInit from "canvaskit-wasm";

const ck = await CanvasKitInit();
```

Using vanilla JavaScript in the browser in a script tag:
```
<script src="https://unpkg.com/canvaskit-wasm@latest/bin/canvaskit.js"></script>
<script type="module">
const ck = await CanvasKitInit();
</script>

```

In the code snippets below, we assume that `ck` holds a reference to the initialized `CanvasKit` object.

## Core classes
The spine-canvaskit API is built on top of the TypeScript-based, generic [spine-core](/git/spine-runtimes/spine-ts/spine-core) runtime, which provides platform independent core classes and algorithms to load, query, modify, and animate Spine skeletons. The core classes are also part of spine-canvaskit.

Here, we will briefly discuss the most important core classes that you will  encounter in your day-to-day use of spine-canvaskit. Please consult the [Spine Runtimes Guide](/spine-runtimes-guide) 
for a detailed overview of the Spine Runtimes architecture, core classes, and API usage.

The [`Atlas`](/git/spine-runtimes/spine-ts/spine-core/src/TextureAtlas.ts) class stores the data loaded from an `.atlas` file and its corresponding `.png` image files.

The [`SkeletonData`](/git/spine-runtimes/spine-ts/spine-core/src/SkeletonData.ts) class stores the data loaded from a `.json` or `.skel` skeleton file.  The skeleton data contains information about the bone hierarchy, slots, attachments, constraints, skins, and animations. A `SkeletonData` instance is usually loaded by also providing a `TextureAtlas` from which it sources the images to be used by the skeleton it represents. It serves as a blueprint for creating `Skeleton` instances. Multiple skeletons can be instantiated from the same atlas and skeleton data, which then share the loaded data, minimizing both load times and memory consumption at runtime.

The [`Skeleton`](/git/spine-runtimes/spine-ts/spine-core/src/Skeleton.ts) class stores an instance of a skeleton, created from a `SkeletonData` instance. A skeleton stores its current pose, that is the position of bones and the current configuration of slots, attachments, and active skin. The current pose can be computed by either manually modifying the bone hierarchy, or, more commonly, by applying animations via an `AnimationState`.

The [`AnimationState`](/git/spine-runtimes/spine-ts/spine-core/src/AnimationState.ts) class is responsible for keeping track of which animation(s) should be applied to a skeleton, advancing and mixing those animations based on the elapsed time between the last and current rendering frame, and applying the animations to a skeleton instance, thereby setting its current pose. The `AnimationState` queries an [`AnimationStateData`](/git/spine-runtimes/spine-ts/spine-core/src/AnimationStateData.ts) instance to retrieve mixing times between animations, or fetches the default mix time if no mixing time is available for a pair of animations.

spine-canvaskit adds functionality on top of spine-core to make loading, modifying and rendering Spine skeletons straightforward.

## Loading assets
Spine atlas and skeleton data files can be loaded via the `loadTextureAtlas()` and `loadSkeletonData()` functions respectively.

spine-canvaskit works in any JavaScript environment that CanvasKit is available for, such as NodeJS or the browser. As such, the loader functions are platform-agnostic and require you to provide a function that takes an absolute or relative path and returns a `Buffer` (NodeJS) or `ArrayBuffer` (browser) containing the raw, binary contents of the file.

The `TypeScript` signature of this function is as follows:

```
readFile(path: string): Promise<any>
```

For NodeJS, this function can be implemented like shown below:

```
import * as fs from "fs"

async function readFile(path) {
   return fs.readFileSync(path)
}
```

For browser environments, the function can be implemented like this:

```
async function readFile(path) {
   const response = await fetch(path);
   if (!response.ok) throw new Error("Could not load file " + path);
   return await response.arrayBuffer();
}
```

Use the `loadTextureAtlas()` function to load a `.atlas` file and its `.png` page image files:

```
const atlas = await loadTextureAtlas(ck, "myatlas.atlas", readFile);
```

The atlas' `.png` files will be resolved relative to the directory the `.atlas` file resides in.

Similarily, use the `loadSkeletonData()` function to load a skeleton data `.json` or `.skel` file:

```
const skeletonData = await loadSkeletonData("myskeleton.skel", atlas, readFile);
```

`loadSkeletonData()` can load both `.json` and `.skel` files, based on the respective extension in the file name. The `atlas` is used to source the images needed to render skeletons derived from the skeleton data.

## SkeletonDrawable
A `SkeletonDrawable` encapsulates a `Skeleton`, which stores the current pose and skin of a skeleton, and an `AnimationState`, which is responsible for keeping track and applying animations.

Once you have loaded a skeleton's atlas and skeleton data files, you can create one or more `SkeletonDrawable` instances from them. Note that the `SkeletonData` implicitely references the `TextureAtlas`. 

Call the `SkeletonDrawable` constructor to create a new instance:

```
const drawable = new SkeletonDrawable(skeletonData);
```

You can access the `Skeleton` and `AnimationState` inside the `SkeletonDrawable` via the respective fields:

```
// Position and scale the skeleton
const skeleton = drawable.skeleton
skeleton.x = 300;
skeleton.y = 380;
skeleton.scaleX = skeleton.scaleY = 0.5;

// Queue an animation on the animation state
const animationState = drawable.animationState;
animationState.setAnimation(0, "walk", true);
```

See the [Spine Runtimes Guide](/spine-runtimes-guide) for a comprehensive discussion of the `Skeleton` and `AnimationState` API. Below you'll find bare minimum API usage examples to get you started. 

## Applying animations
> ** Note:** See [Applying Animations](/spine-applying-animations) in the Spine Runtimes Guide for more in-depth information.

The `AnimationState` lets you queue one or more animations on multiple tracks. Tracks are indexed starting at index 0. Animations on higher tracks overwrite any properties that are keyed in animations in lower tracks. This track concept allows you to playback and mix multiple animations at once.

To set a specific animation on track 0, call `AnimationState.setAnimation()`:

```
drawable.animationState.setAnimation(0, "walk", true);
```

The first parameter specifies the track, the second parameter is the name of the animation, and the third parameter defines whether to loop the animation.

You can queue multiple animations:

```
const animationState = drawable.animationState;
animationState.setAnimation(0, "walk", true);
animationState.addAnimation(0, "jump", false, 2);
animationState.addAnimation(0, "run", true, 0);
```

The first parameter to `addAnimationByName()` is the track. The second parameter is the name of the animation. The third parameter defines whether to loop the animation, The final parameter specifies the delay in seconds, after which this animation should replace the previous animation on the track.

In the example above, the `"walk"` animation is played back first. 2 seconds later, the `"jump"` animation is played back once, followed by a transition to the `"run"` animation, which will be looped.

When transitioning from one animation to another, `AnimationState` will mix the animations for a specificable duration. These mix times are defined in an `AnimationStateData` instance, from which the `AnimationState` retrieves mix times.

The `AnimationStateData` instance is also available through the `AnimationState`. You can set the default mix time, or the mix time for a specific pair of animations:

```
animationState.data.defaultMix = 0.2;
animationState.data.setMix("walk", "jump", 0.1);
```

When setting or adding an animation, a `TrackEntry` object is returned, which allows further modification of that animation's playback. For example, you can set the track entry to reverse the animation playback:

```
const entry = drawable.animationState.setAnimation(0, "walk", true);
entry.reverse = true;
```

See the [`TrackEntry` class documentation](/git/spine-runtimes/spine-ts/spine-core/src/AnimationState.ts#L798) for more options.

> **Note:** Do not hold on to `TrackEntry` instances outside the function you are using them in. Track entries are re-used internally and will thus become invalid once the animation it represents has been completed.

You can set or queue empty animations on an animation track to smoothly reset the skeleton back to its setup pose:

```dart
controller.animationState.setEmptyAnimation(0, 0.5);
controller.animationState.addEmptyAnimation(0, 0.5, 0.5);
```

The first parameter to `setEmptyAnimation()` specifies the track. The second parameter specifies the mix duration in seconds used to mix out the previous animation and mix in the "empty" animation.

The first parameter to `addEmptyAnimation()` specifies the track. The second parameter specifies the mix duration. The third parameter is the delay in seconds, after which the empty animation should replace the previous animation on the track via mixing.

All animations on a track can be cleared immediately via `AnimationState.clearTrack()`. To clear all tracks at once, `AnimationState.clearTracks()` can be used. This will leave the skeleton in the last pose it was in.

To reset the pose of a skeleton to the setup pose, use `Skeleton.setToSetupPose()`:

```
drawable.skeleton.setToSetupPose();
```

This will reset both the bones and slots to their setup pose configuration. Use `Skeleton.setSlotsToSetupPose()` to only reset the slots to their setup pose configuration.

## AnimationState Events
An `AnimationState` emits events during the life-cycle of an animation that is being played back. You can listen for these events to react as needed. The Spine Runtimes API defines the following [event types](/git/spine-runtimes/spine-ts/spine-core/src/AnimationState.ts#L1095):

* `Start`: emitted when an animation is started.
* `Interrupted`: emitted when an animation's track was cleared, or a new animation was set.
* `Completed`: emitted when an animation completes a loop.
* `Ended`: emitted when an animation will never be applied again.
* `Disposed`: emitted when the animation's track entry is disposed.
* `Event`: emitted when a user defined [event](/spine-events#Events) happened.

To receive events, you can register an [`AnimationStateListener`](/git/spine-runtimes/spine-ts/spine-core/src/AnimationState.ts#L1161) callback with either the `AnimationState` to receive events across all animations, or with the `TrackEntry` of a specific animation queued for playback:

```
const entry = drawable.animationState.setAnimation(0, "walk", true);
entry.listener = {
   event: (entry, event) => console.log(`User defined event: ${event.data.name}`),
   complete: (entry) => console.log(`Animation loop completed.`)
}

drawable.animationState.setListener({
   end: (entry) => console.log(`Animation ${entry.data.name} has ended and will not be applied again.`
});
```

See the [`example/animation-state-events.html`](/git/spine-runtimes/spine-ts/spine-canvaskit/example/animation-state-events.html) example.

## Skins
Many applications and games allow users to create custom avatars out of many individual items, such as hair, eyes, pants, or accessories like earrings or bags. With Spine, this can be achieved by [mixing and matching skins](/spine-examples-mix-and-match).

You can create custom skins from other skins like this:
```
// Create a custom, empty skin
const skin = new spine.Skin("custom");

// Add other skins to the custom skin
skin.addSkin(skeletonData.findSkin("skin-base"));
skin.addSkin(skeletonData.findSkin("nose/short"));
skin.addSkin(skeletonData.findSkin("eyelids/girly"));
skin.addSkin(skeletonData.findSkin("eyes/violet"));
skin.addSkin(skeletonData.findSkin("hair/brown"));
skin.addSkin(skeletonData.findSkin("clothes/hoodie-orange"));
skin.addSkin(skeletonData.findSkin("legs/pants-jeans"));
skin.addSkin(skeletonData.findSkin("accessories/bag"));
skin.addSkin(skeletonData.findSkin("accessories/hat-red-yellow"));
skeleton.setSkin(skin);
skeleton.setSlotsToSetupPose();
```

Create a custom skin with the `Skin()` constructor.

Next, use the `SkeletonData` to look up skins by name via `SkeletonData.findSkin()`.

Add all the skins you want to combine into the new custom skin via `Skin.addSkin()`.

Finally, set the new skin on the `Skeleton` via `Skeleton.setSkin()` and call `Skeleton.setSlotsToSetupPose()` to ensure no attachments from previous skins and/or animations are left over.

See the [`example/mix-and-match.html`](/git/spine-runtimes/spine-ts/spine-canvaskit/example/mix-and-match.html) example.

## Setting Bone Transforms

When authoring a skeleton in the Spine Editor, the skeleton is defined in what is called the skeleton coordinate system. Use the `Bone.worldToLocal()` method to transform touch or mouse coordinates relative to the canvas to the coordinate system of the bone.

This can be useful if you want to drive the position of a bone based on user input.

See the [`example/ik-following.html`](/git/spine-runtimes/spine-ts/spine-canvaskit/example/ik-following.html) example.


## Performance
spine-canvaskit uses `CavansKit.MakeVertices()` and `Canvas.drawVertices()` to draw the meshes of individual skeleton attachments. While Skia appears to be batching these meshes in the background, further performance improvements could possibly achieved by performing batching of attachment meshes in spine-canvaskit itself.

See the [`example/micro-benchmark.html`](/git/spine-runtimes/spine-ts/spine-canvaskit/example/micro-benchmark.html) example.
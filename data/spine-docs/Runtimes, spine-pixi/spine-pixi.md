http://esotericsoftware.com/spine-pixi

[spine-pixi Runtime Documentation]
[[Integration guide for the spine-pixi runtime.]]

# spine-pixi Runtime Documentation

> **Licensing**
>
> See the [Spine Runtimes License](/spine-runtimes-license) before integrating the Spine Runtimes into your applications.

# Getting Started
This is a unified page for our official [PixiJS](https://pixijs.com/) runtimes. Here you can find a list of our official PixiJS runtimes along with the respective compatible versions:

<table>
  <tbody>

    <tr>
      <th>Runtime</th>
      <th>PixiJS version</th>
      <th>Maintained</th>
    </tr>

    <tr>
      <td id="spine-pixi-v8">
        <a href="https://github.com/EsotericSoftware/spine-runtimes/tree/4.2/spine-ts/spine-pixi-v8">spine-pixi-v8</a>
      </td>
      <td>
        <p>8 (minimum 8.4.0)</p>
      </td>
      <td>
        <p>Yes</p>
      </td>
    </tr>

    <tr>
      <td id="spine-pixi-v7">
        <a href="https://github.com/EsotericSoftware/spine-runtimes/tree/4.2/spine-ts/spine-pixi-v7">spine-pixi-v7</a>
      </td>
      <td>
        <p>7 (minimum 7.2.0)</p>
      </td>
      <td>
        <p>Yes</p>
      </td>
    </tr>

    <tr>
      <td id="spine-pixi">
        <a href="https://github.com/EsotericSoftware/spine-runtimes/tree/ca00e561368f2c838026e2d02aed57b709b037ef/spine-ts/spine-pixi">spine-pixi</a>
      </td>
      <td>
        <p>7 (minimum 7.2.0)</p>
      </td>
      <td>
        <p>No (switch to spine-pixi-v7)</p>
      </td>
    </tr>

  </tbody>
</table>

Unless otherwise indicated, the examples and GitHub file links refer to the v8 version. However, everything applies to the v7 version by simply replace `-v8` with `-v7` from paths and links.

The Spine PixiJS runtimes are implemented on top of [spine-ts core](https://github.com/EsotericSoftware/spine-runtimes/tree/4.2/spine-ts/spine-core), a TypeScript implementation of the renderer-agnostic Spine Runtimes core APIs.


`spine-pixi-v8` can be rendered using both [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) or [WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API). `spine-pixi-v7` is rendered using WebGL (WebGPU support was introduced in PixiJS 8).
Rendering via the [canvas APIs](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) is not supported.

The Spine PixiJS runtimes support all Spine features.

## Installation
To use a Spine PixiJS runtime in your Pixi project, you must first include its sources.

### Vanilla JavaScript
In vanilla JavaScript, use a `script` tag to include the spine-pixi-v8 runtime from [unpkg](https://unpkg.com) (or host it yourself):

```
<script src="https://unpkg.com/@esotericsoftware/spine-pixi-v8@4.2.*/dist/iife/spine-pixi-v8.js"></script>
```

> **Note:** Ensure that the `major.minor` version of spine-pixi matches the `major.minor` Spine Editor version you are exporting from. See [Synchronizing versions](/spine-versioning#Synchronizing-versions) for more information.

The Spine extension will be auto-installed and the `spine-pixi-v8` runtime can now be used in your Pixi project. Check out [`index.html`](/git/spine-runtimes/spine-ts/spine-pixi-v8/example/index.html) for a full example.

The spine-pixi-v8 package provides source maps for debugging, as well as minified versions of spine-pixi-v8, which can be used by replacing the `.js` file suffix with `.min.js` in the unpkg URLs.

To build `spine-pixi-v8.js` yourself, follow the instructions in the spine-ts [README.md](/git/spine-runtimes/spine-ts/README.md).


### NPM or Yarn
When using NPM or Yarn for dependency management, add spine-pixi-v8 the usual way:

```
npm install @esotericsoftware/spine-pixi-v8@~4.2.0
```

> **Note:** Ensure that the `major.minor` version of spine-pixi matches the `major.minor` Spine Editor version you are exporting from. See [Synchronizing versions](/spine-versioning#Synchronizing-versions) for more information.

Next, just import the Spine class.

```
import PIXI from "pixi.js"
import { Spine } from '@esotericsoftware/spine-pixi-v8';
```

The Spine extension will be auto-installed and the chosen Spine PixiJS runtime can now be used in your project. Check out the [`esbuild/TypeScript project`](/git/spine-runtimes/spine-ts/spine-pixi-v8/example/typescript) for a minimal example.

Our module packages contain source maps as well as `d.ts` typings for improved debugging and development.

## Examples
The spine-pixi runtimes include several examples demonstrating their feature set.

To run the examples locally:

1. Install Git and [Node.js](https://nodejs.org/en) for your operating system.
2. Clone the spine-runtimes repository: `git clone https://github.com/esotericsoftware/spine-runtimes`
2. Navigate to `spine-runtimes/spine-ts`, then run `npm install & npm run dev`.

This builds the spine-pixi-v8 runtime, then opens a browser, displaying the example index for all spine-ts based runtimes.

Click on the spine-pixi-v8 example you are interested in and check out the code in the [`spine-runtimes/spine-ts/spine-pixi-v8/example`](/git/spine-runtimes/spine-ts/spine-pixi-v8/example) folder.

## Updating the spine-pixi-v8 Runtime
Before updating your project's spine-pixi-v8 runtime, consult our [guide on Spine editor and runtime version management](/spine-runtime-architecture#Versioning).

To update the spine-pixi-v8 runtime in vanilla JavaScript, change the version string in the `src` attribute or the `script` tag fetching spine-pixi-v8 from unpkg.

To update the spine-pixi-v8 runtime when managing dependencies with NPM or Yarn, change the version string in your `package.json` file.

> **Note:** If you change the `major.minor` version of the spine-pixi-v8 package, you have to re-export your Spine skeletons with the same Spine Editor `major.minor` version. See [Synchronizing versions](/spine-versioning#Synchronizing-versions) for more information.

# Using spine-pixi-v8
The Spine PixiJS runtimes support all Spine features. `spine-pixi-v8` can be rendered using both [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) or [WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API). `spine-pixi-v7` is rendered using WebGL (WebGPU support was introduced in PixiJS 8).
Rendering via the [canvas APIs](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) is not supported.

## Asset Management
### Exporting for Spine PixiJS runtimes

![](/img/spine-runtimes-guide/spine-ue4/export.png)

Follow the instructions in the Spine User Guide on how to:

1. [Export skeleton & animation data](/spine-export)
2. [Export texture atlases containing the images for your skeletons](/spine-texture-packer)

An export of the skeleton data and texture atlas will yield the following files:

![](/img/spine-runtimes-guide/spine-ue4/exported-files.png)

1. `skeleton-name.json` or `skeleton-name.skel`, containing your skeleton and animation data, either in the JSON or binary format.
2. `skeleton-name.atlas`, containing information about the texture atlas.
3. One or more `.png` files, each representing a page in your texture atlas containing the packed images your skeleton uses.

> **Note**: You should prefer binary skeleton exports over JSON exports, as they are smaller in size and faster to load.

When serving these files, make sure the server emits the correct MIME types:
- `skel` files as `application/octet-stream`
- `json` files as `application/json`
- `atlas` files as `application/octet-stream`
- `png` files as `image/png`


### Updating Spine Assets
During development, you may frequently update your Spine skeleton data and texture atlas files. You can simply overwrite these source files (`.json`, `.skel`, `.atlas`, `.png`) by re-exporting from the Spine Editor and replacing the existing files in your Pixi project.

Ensure that the `major.minor` version of spine-pixi-v8 matches the `major.minor` Spine Editor version you are exporting from. See [Synchronizing versions](/spine-versioning#Synchronizing-versions) for more information.

## Core classes
The Spine PixiJS API is built on top of the generic TypeScript [spine-core](/git/spine-runtimes/spine-ts/spine-core) runtime, which provides platform independent core classes and algorithms to load, query, modify, and animate Spine skeletons.

Here, we will briefly discuss the most important core classes that you will encounter in your day-to-day use of Spine PixiJS. Consult the [Spine Runtimes Guide](/spine-runtimes-guide)
for a detailed overview of the Spine Runtimes architecture, core classes, and API usage.

The [`TextureAtlas`](/git/spine-runtimes/spine-ts/spine-core/src/TextureAtlas.ts) class stores the data loaded from an `.atlas` file and its corresponding `.png` image files.

The [`SkeletonData`](/git/spine-runtimes/spine-ts/spine-core/src/SkeletonData.ts) class stores the data loaded from a `.json` or `.skel` skeleton file. The skeleton data contains information about the bone hierarchy, slots, attachments, constraints, skins, and animations. A `SkeletonData` instance is usually loaded by providing an `Atlas` from which it sources the images to be used by the skeleton it represents. It serves as a blueprint for creating `Skeleton` instances. Multiple skeletons can be instantiated from the same atlas and skeleton data, which then share the loaded data, minimizing both load times and memory consumption at runtime.

The [`Skeleton`](/git/spine-runtimes/spine-ts/spine-core/src/Skeleton.ts) class stores an instance of a skeleton, created from a `SkeletonData` instance. A skeleton stores its current pose, that is the position of bones and the current configuration of slots, attachments, and active skin. The current pose can be computed by either manually modifying the bone transforms, or, more commonly, by applying animations via an `AnimationState`.

The [`AnimationState`](/git/spine-runtimes/spine-ts/spine-core/src/AnimationState.ts) class is responsible for keeping track of which animation(s) should be applied to a skeleton, advancing and mixing those animations based on the elapsed time between the last and current rendering frame, and applying the animations to a skeleton instance, thereby setting its current pose. The `AnimationState` queries an [`AnimationStateData`](/git/spine-runtimes/spine-ts/spine-core/src/AnimationStateData.ts) instance to retrieve mixing times between animations, or fetches the default mix duration if no mix duration is available for a pair of animations.

The Spine Pixi runtime is built on top of these core classes.

## Spine Pixi runtime
The spine-pixi-v8 runtime automatically installs two extensions of type [`Asset`](https://pixijs.download/release/docs/extensions.html#ExtensionType) into Pixi: [`skeletonLoader`](/git/spine-runtimes/spine-ts/spine-pixi-v8/src/assets/skeletonLoader.ts) and [`atlasLoader`](/git/spine-runtimes/spine-ts/spine-pixi-v8/src/assets/atlasLoader.ts). They add to [PIXI.Assets](https://pixijs.download/release/docs/assets.Assets.html) the functionality to (pre-)load exported `.json`, `.skel`, and `.atlas` files.

The `Spine` class extends the Pixi [`ViewContainer`](https://pixijs.download/release/docs/scene.ViewContainer.html) class ([`Container`](https://pixijs.com/7.x/guides/components/containers) for PixiJS 7) and provides a factory function to create `Spine` container instances from loaded skeleton data and atlas files.

Additionally, for PixiJS v8, it installs the SpinePipe, which extends WebGPUPipes, WebGLPipes, and CanvasPipes.
Eventually, it installs the `DarkTintBatcher`, which is the batcher used to support tint black.
For PixiJS v7, it installs an extension of type `RendererPlugin` that is used to render Spine containers that use tint black on at least one attachment.

### Loading Spine Assets
Spine assets, like skeleton data `.json`/`.skel` files or `.atlas` files, are loaded through the usual functions available in the `PIXI.Assets` class instance, such as `Assets.load`.

Before an instance of a `Spine` container can be created, the respective skeleton and atlas files must be loaded. One way of doing it is through the `Assets.add` and `Assets.load` functions.

* `Assets.add({ alias: string, src: string })`: allows to specify how to resolve the asset `alias` using the `url`. This function can be used for all spine assets files (`.json`, `.skel`, and `.atlas`).
* `Assets.load(string[])`: loads the asset `alias` previously added using `Assets.add`.

Assuming you have exported your skeleton data to a binary skeleton file called `skeleton.skel`, and your atlas to a file called `skeleton.atlas` with one corresponding `skeleton.png` file, you can load your assets like this:

```
PIXI.Assets.add({ alias: "skeleton-data", src: "path/to/skeleton.skel" });
PIXI.Assets.add({ alias: "skeleton-atlas", src: "path/to/skeleton.atlas" });
await PIXI.Assets.load["skeleton-data", "skeleton-atlas"];
```

The `Assets.load` function loads the [SkeletonData](/git/spine-runtimes/spine-ts/spine-core/src/SkeletonData.ts) from the `skeleton.skel` file and caches it under the key `skeleton-data`. It also loads the [TextureAtlas](/git/spine-runtimes/spine-ts/spine-core/src/TextureAtlas.ts) from the `skeleton.atlas` file, as well as a texture from the corresponding `skeleton.png` file. The atlas is cached under the key `skeleton-atlas`. The individual texture atlas page images are loaded transparently without the need to explicitly load them.

Once preloading has finished, you can access the `TextureAtlas` via `Asset.get(atlasKey)`. Similarly, you can access the raw `.skel` file via `Asset.get(skeletonKey)`. Note that in this phase the `SkeletonData` instance is not available yet.

The raw skeleton data and atlas on their own can not be animated or rendered. Instead, a [`Spine`](/git/spine-runtimes/spine-ts/spine-pixi-v8/src/Spine.ts) container is constructed from them. `Spine` containers that are instantiated with the same asset key share the same skeleton data and atlas.

You can also use [Pixi bundles](https://pixijs.com/examples/assets/bundle) to load you assets. To make the `texturePreference.format` and `texturePreference.resolution` properties of the `Assets.init` work, you need to specify the atlas name using the format `FILENAME@RESOLUTION.FORMAT.atlas`.
Here's an example of a `manifest.json` file for a bundle and how to load it while specifying the preferred `format` and `resolution`:

```json
{
    "bundles": [
        {
            "name": "spineboy",
            "assets": [
                {
                    "alias": ["spineboyAtlas"],
                    "src": [
                        "spineboy.png.atlas",
                        "spineboy@2x.png.atlas",
                        "spineboy@3x.png.atlas",
                        "spineboy.webp.atlas",
                        "spineboy@2x.webp.atlas",
                        "spineboy@3x.webp.atlas"
                    ]
                },
                { "alias": ["spineboyData"], "src": ["spineboy-pro.json"] }
            ]
        }
    ]
}
```

```javascript
// Initialize Assets with given manifest and preference
await PIXI.Assets.init({
  basePath: './assets/spineboy-bundle',
  manifest: './manifest.json',
  texturePreference: {
    resolution: Math.min(PIXI.utils.isMobile.any ? window.devicePixelRatio : 3, 3),
    format: ['webp', 'png'],
  },
});

// Load the bundle that includes the skeleton data and atlas
await PIXI.Assets.loadBundle("spineboy");
```

### Creating Spine container instances
Once raw skeleton data and a corresponding atlas have been loaded, a `Spine` container can be created via the `from()` static function from the [`Spine`](/git/spine-runtimes/spine-ts/spine-pixi-v8/src/Spine.ts) class:

```javascript
// Pixi app creation
const app = new PIXI.Application({ ... });
...
// Create a Spine container through the Spine.from factory
const spineboy = Spine.from({ skeleton: "spineboyData", atlas: "spineboyAtlas", ... });

// Add the Spine container to the stage
app.stage.addChild(spineboy);
```

The `from()` function on the `Spine` class takes a [SpineFromOptions](/git/spine-runtimes/spine-ts/spine-pixi-v8/src/Spine.ts#SpineFromOptions) as parameter. It needs:

- `skeleton`: the asset name for the skeleton `.skel` or `.json` file previously loaded into the Assets
- `atlas`: the asset name for the atlas file previously loaded into the Assets
- (optional) `scale`: The value passed to the skeleton reader. If omitted, 1 is passed.
- (optional) `darkTint`: If `true`, use the dark tint renderer to render the skeleton; if `false`, use the default pixi renderer to render the skeleton; If `undefined`, use the dark tint renderer if at least one slot has tint black
- (optional) `autoUpdate`: Set the Spine instance `autoUpdate` value. If omitted, it is set to `true` and the animation will be played automatically. Otherwise call the `update` method.
- (optional) `boundsProvider`: The bounds provider to use. If undefined the bounds will be dynamic, calculated when requested and based on the current frame. Read the [Bounds](#Bounds) section for more details.

## Spine Container
A `Spine` container is an extension of a Pixi [`ViewContainer`](https://pixijs.download/release/docs/scene.ViewContainer.html) ([Container](https://pixijs.com/7.x/guides/components/containers) for PixiJS 7) that handles storing, updating, and rendering a `Skeleton` and its associated `AnimationState`. `Spine` container instances are created from a skeleton data and an atlas, as described in the last section. The `Skeleton` and `AnimationState` are accessible through the `skeleton` and `state` fields respectively.

Each frame (when `autoUpdate` is `true`), the `Spine` container will:

* Update the `AnimationState`
* Apply the `AnimationState` to the `Skeleton`
* Update the `Skeleton` world transforms, resulting in a new pose
* Render the `Skeleton` in its current pose

### Bounds
By default, the `Spine` container has dynamic bounds. When you call the `getBounds` function, the returned bounds are calculated based on the current frame.
This can be useful if you need precise interactions based on mesh hulls.
However, it may not be ideal for setting the exact size of your skeleton, as changing the width will scale the skeleton based on the current frame.
Additionally, recalculating bounds each time they are requested may impact performance.

If you need more consistent bounds that are calculated only once, you can provide a `SpineBoundsProvider` in the constructor or at runtime.
A bounds provider determines the size of the bounding box for a Spine game object. The available `SpineBoundsProvider` implementations are:

- `SetupPoseBoundsProvider`: Calculates the bounding box based on the skeleton's setup pose.
- `SkinsAndAnimationBoundsProvider`: Calculates the bounding box based on the maximum bounds for a given set of skins and animations.
- `AABBRectangleBoundsProvider`: Always returns a fixed size specified in the constructor.

You can also create a custom `SpineBoundsProvider` by implementing the `SpineBoundsProvider` interface.

For more information, Refer to their signatures and jsdoc [here](/git/spine-runtimes/spine-ts/spine-pixi-v8/src/Spine.ts).

See the [`bounds.html`](/git/spine-runtimes/spine-ts/spine-pixi-v8/example/bounds.html) example to compare the different bounds providers and their effects.

### Applying Animations
Applying animations to a skeleton displayed by a `Spine` container is done using `AnimationState`.

> **Note:** See [Applying Animations](/spine-applying-animations#AnimationState-API) in the Spine Runtimes Guide for more in-depth information, specifically about animation tracks and animation queueing.

To set a specific animation on track 0, call AnimationState `setAnimation`:

```javascript
spineObject.state.setAnimation(0, "walk", true);
```

The first parameter specifies the track, the second parameter is the name of the animation, and the third parameter defines whether to loop the animation.

You can queue multiple animations using `addAnimation`:

```javascript
spineObject.state.setAnimation(0, "walk", true);
spineObject.state.addAnimation(0, "jump", 2, false);
spineObject.state.addAnimation(0, "run", 0, true);
```

The first parameter to `addAnimation` is the track. The second parameter is the name of the animation. The third parameter specifies the delay in seconds, after which this animation should replace the previous animation on the track. The final parameter defines whether to loop the animation.

In the example above, the `"walk"` animation is played back first. 2 seconds later, the `"jump"` animation is played back once, followed by a transition to the `"run"` animation, which will be looped.

When transitioning from one animation to another, `AnimationState` will mix (crossfade) the animations for a specific duration. These mix durations are defined in an `AnimationStateData` instance, from which the `AnimationState` retrieves them.

The `AnimationStateData` instance is also available through the `AnimationState.data` property. You can set the default mix duration, or the mix duration for a specific pair of animations:

```javascript
spineObject.state.data.setDefaultMix = 0.2;
spineObject.state.data.setMix("walk", "jump", 0.1);
```

When setting or adding an animation, a `TrackEntry` object is returned, which allows further modification of that animation's playback. For example, you can set the mix duration or reverse the animation playback:

```javascript
const entry = spineObject.state.setAnimation(0, "walk", true);
entry.mixDuration = 0.4;
entry.reverse = true;
```

See the [`TrackEntry` class documentation](/git/spine-runtimes/spine-ts/spine-core/src/AnimationState.ts#L785) for more options.

> **Note:** Be careful about holding on to `TrackEntry` instances outside the function you are using them in. Track entries are re-used internally and will thus become invalid once the track entry [dispose event](/spine-api-reference#AnimationStateListener-dispose) occurs.

You can use empty animations to smoothly mix the skeleton from the setup pose to an animation, or from an animation to the setup pose:

```javascript
spineObject.state.setEmptyAnimation(0, 0);
spineObject.state.addAnimation(0, "walk", 0).mixDuration = 0.5;
spineObject.state.addEmptyAnimation(0, 0.5, 6);
```

Like `setAnimation`, the first parameter to `setEmptyAnimation()` specifies the track. The second parameter specifies the mix duration in seconds used to mix out the previous animation and mix in the "empty" animation.

Like `addAnimation`, the first parameter to `addEmptyAnimation()` specifies the track. The second parameter specifies the mix duration. The third parameter is the delay in seconds, after which the empty animation should replace the previous animation on the track via mixing.

All animations on a track can be cleared immediately via `AnimationState.clearTrack()`. To clear all tracks at once, `AnimationState.clearTracks()` can be used. This will leave the skeleton in the last pose it was in, which is not usually desired. Instead, use empty animations to mix smoothly to the setup pose.

To reset a skeleton to its setup pose, use `Skeleton.setToSetupPose()`:

```javascript
spineObject.skeleton.setToSetupPose();
```

This will reset both the bones and slots to their setup pose configuration. Use `Skeleton.setBonesToSetupPose()` or `Skeleton.setSlotsToSetupPose()` to only reset the bones or slots to their setup pose configuration.

### AnimationState Events
An `AnimationState` emits events during the lifecycle of an animation that is being played back. You can listen for these events and react as needed. The Spine Runtimes API defines the following [event types](/git/spine-runtimes/spine-ts/spine-core/src/AnimationState.ts#L1108):

* `start`: emitted when an animation is started.
* `interrupt`: emitted when an animation's track was cleared, or a new animation was set.
* `end`: emitted when an animation will never be applied again.
* `dispose`: emitted when the animation's track entry is disposed.
* `complete`: emitted when an animation completes a loop.
* `event`: emitted when a user defined [event](/spine-events#Events) happened.

To receive events, you can register an [`AnimationStateListener`](/git/spine-runtimes/spine-ts/spine-core/src/AnimationState.ts#L1117) callback with either the `AnimationState` to receive events across all animations, or with the `TrackEntry` of a specific animation queued for playback:

```javascript
spineObject.state.addListener({
    start: (entry) => log(`Started animation ${entry.animation.name}`),
    interrupt: (entry) => log(`Interrupted animation ${entry.animation.name}`),
    end: (entry) => log(`Ended animation ${entry.animation.name}`),
    dispose: (entry) => log(`Disposed animation ${entry.animation.name}`),
    complete: (entry) => log(`Completed animation ${entry.animation.name}`),
    event: (entry, event) => log(`Custom event for ${entry.animation.name}: ${event.data.name}`)
})

trackEntry.listener = {
    event: (entry, event) => log(`Custom event for ${entry.animation.name}: ${event.data.name}`)
}
```

See the [`events-example.html`](/git/spine-runtimes/spine-ts/spine-pixi-v8/example/events-example.html) example.

## Skins
Many applications and games allow users to create custom avatars out of many individual items, such as hair, eyes, pants, or accessories like earrings or bags. With Spine, this can be achieved by [using skins](/spine-examples-mix-and-match).

You can create custom skins from other skins like this:

```javascript
const skeletonData = spineObject.skeleton.data;
const skin = new spine.Skin("custom");
skin.addSkin(skeletonData.findSkin("skin-base"));
skin.addSkin(skeletonData.findSkin("nose/short"));
skin.addSkin(skeletonData.findSkin("eyelids/girly"));
skin.addSkin(skeletonData.findSkin("eyes/violet"));
skin.addSkin(skeletonData.findSkin("hair/brown"));
skin.addSkin(skeletonData.findSkin("clothes/hoodie-orange"));
skin.addSkin(skeletonData.findSkin("legs/pants-jeans"));
skin.addSkin(skeletonData.findSkin("accessories/bag"));
skin.addSkin(skeletonData.findSkin("accessories/hat-red-yellow"));
spineObject.skeleton.setSkin(skin);
spineObject.skeleton.setToSetupPose();
```

Create a new, empty skin with the `Skin()` constructor.

Next, fetch the `SkeletonData` from the skeleton. It is used to look up skins by name via `SkeletonData.findSkin()`.

Add all the skins you want to combine into the new skin via `Skin.addSkin()`.

Finally, set the new skin on the `Skeleton` and call `Skeleton.setSlotsToSetupPose()` to ensure no attachments from previous skins and/or animations are left attached.

See [`mix-and-match-example.html`](/git/spine-runtimes/spine-ts/spine-pixi-v8/example/mix-and-match-example.html) for full example code.

## Setting Bone Transforms
When authoring a skeleton in the Spine Editor, the skeleton is defined in what is called the skeleton's world coordinate system or "skeleton coordinate system". This coordinate system may not align with the coordinate system of Pixi. Mouse and touch coordinates relative to the `Spine` container need to be converted to the skeleton coordinate system, for example if a user should be able to move a bone by touch.

The `Spine` container offers the method `pixiWorldCoordinatesToBone(point: { x: number, y: number}, bone: Bone)` which takes a point relative to the `Spine` container and converts it to the skeleton's coordinate system, relative to the specified bone.

The reverse, that is converting from the skeleton coordinate system to the Pixi coordinate system, can be achieved via `Spine.skeletonToPixiWorldCoordinates(point: { x: number, y: number})`.

See [`control-bones-example.html`](/git/spine-runtimes/spine-ts/spine-pixi-v8/example/control-bones-example.html) for full example code.

## Adding Pixi Objects to Slots
The `Spine` class has three convenient methods to attach and detach pixi `Container`s to slots.

```
addSlotObject (slotRef: number | string | Slot, pixiObject: Container, options?: { followAttachmentTimeline?: boolean }): void
```
This adds the `pixiObject` to the slot referenced by `slotRef`. You can pass either the name, the index of the slot, or the slot object itself.

It is possible to assign only one Pixi object per slot. Once added, certain properties of the Pixi object, such as its transform and mask, will be automatically modified by the `Spine` object.

The `followAttachmentTimeline` option allows to synchronize the visibility of the current attachment with that of the slot. By default, its value is set to `false`.

For this reason, and to ensure more control over the added objects, it is highly recommended to wrap the object you want to add into a Pixi `Container`. This allows you to add multiple Pixi objects, adjust their position, angle, scale, and more, without being restricted by `Spine`'s automatic modifications.

If you want to remove a Container, call the appropriate method:
```
removeSlotObject (slotRef: number | string | Slot, pixiObject?: Container): void
```
`pixiObject` is optional. If passed, the Pixi object will be removed only if it corresponds to the one in the slot referenced by `slotRef`.

Note that the Pixi object is only removed, not destroyed. You should take care of the lifecycle of the Pixi objects added manually.

If you want to remove all Containers, call instead:
```
removeSlotObjects (): void
```

To retrieve a Pixi object attached to a slot, use the method:
```
getSlotObject (slotRef: number | string | Slot): Container | undefined
```
It returns the `Container` attached to the slot referenced by `slotRef`, if any.

See [`slot-objects.html`](/git/spine-runtimes/spine-ts/spine-pixi-v8/example/slot-objects.html) for full example code.

## Mesh batch size

In v7, `Spine` objects use Pixi meshes to render attachments. By default in Pixi, a mesh having a number of vertices higher than 100 is marked as not batchable. This will consequently break batching, increasing the number of draw calls and reducing performances. To overcome this inconvenience, you can set the global `PIXI.Mesh.BATCHABLE_SIZE` to a value that fits your skeletons.

spine-pixi-v8 does not have this limitation.

# Spine Runtimes API access
The spine-pixi-v8 API is built on top of the [spine-ts core](https://github.com/EsotericSoftware/spine-runtimes/tree/4.2/spine-ts/spine-core) and you can thus use the whole API it provides. Please consult the [Spine Runtimes Guide](https://esotericsoftware.com/spine-runtimes-guide) for more information.
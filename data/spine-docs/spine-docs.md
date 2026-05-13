

---
## File: Runtimes Guide/spine-applying-animations.md
## Title: Applying Animations - Spine Runtimes Guide
## URL: http://esotericsoftware.com/spine-applying-animations
---

# Applying Animations

Spine provides two APIs for applying animations.

# AnimationState API

[AnimationState](/spine-api-reference#AnimationState) supports applying animations over time, queuing animations for later playback, mixing (crossfading) between animations, and applying multiple animations on top of each other (layering).

AnimationState is stateful. It stores the animation times and other parameters for applying the animations. While a single AnimationState can pose multiple skeletons, it's somewhat rare to want multiple skeletons in exactly the same pose. Typically a single AnimationState instance will be used for each [Skeleton](/spine-api-reference#Skeleton) instance.

AnimationState is built on top of the [Timeline API](#Timeline-API) and can handle most animation playback needs, except for playing backward. If reverse playback is needed, the Timeline API can be used directly or the animation can be duplicated and reversed in Spine using box select [scaling](/spine-dopesheet#Scaling).

The AnimationState `update` method takes the time that has elapsed since it was last called and updates the internal state. The `apply` method takes a skeleton and applies the appropriate animations.

```
AnimationState state = ...
...
// Every frame:
state.update(delta);
state.apply(skeleton);
```

## Mix times

Creating an AnimationState instance requires supplying an [AnimationStateData](/spine-api-reference#AnimationStateData). When the AnimationState changes the current animation, it will automatically mix (crossfade) between the animations using the mix durations defined in the AnimationStateData, resulting in smooth animation transitions.

```
AnimationStateData stateData = new AnimationStateData(skeletonData);
stateData.setDefaultMix(0.1);
stateData.setMix("walk", "jump", 0.2);
stateData.setMix("jump", "walk", 0.4);
stateData.setMix("jump", "run", 0.25);
stateData.setMix("walk", "shoot", 0);
AnimationState state = new AnimationState(stateData);
```

Rather than manually specifying the mix duration for every animation pair, a default mix duration can be set. Also, the mix duration can be set on a case-by-case basis using the TrackEntry [mixDuration](/spine-api-reference#TrackEntry-mixDuration) property:

```
TrackEntry entry = state.setAnimation(0, "walk", true);
entry.mixDuration = 0.6;
```

As indicated by the "Data" suffix, AnimationStateData is stateless. The same AnimationStateData instance can be used with multiple AnimationStates.

## Tracks

Tracks allow animations to be applied in layers. Each track stores an animation and playback parameters. Tracks are numbered increasingly starting at zero (track index is an array index internally). When the AnimationState is applied to a skeleton, the track animations are applied in order, starting with the lowest track number.

Tracks have many uses. For example, an animation that does not key everything can be played on a higher track, overriding the lower track only for what is keyed. Track 0 could have a walk, run, swim, or other animation and track one could have a shoot animation that keys only the arm and gun firing. Also, setting the TrackEntry [alpha](/spine-api-reference#TrackEntry-alpha) for a higher track allows it to mix with the tracks below it. For example, track 0 could have a walk animation and track 1 could have a limp animation. The alpha for track 1 is increased as the player takes damage, so they limp more and more.

## Playback

Setting the animation for a track is done by calling [setAnimation](/spine-api-reference#AnimationState-setAnimation). This replaces the current animation and any queued animations on that track with the specified animation. If a mix duration is defined between the previous animation and the current animation, then the current animation will be mixed out over the mix duration so the transition between animations is done smoothly.

`setAnimation` returns a [TrackEntry](#TrackEntry) which can be used to customize playback in many ways.

By default, the animation will continue to be applied until another animation is played or the track is cleared. To stop the animation after a specific amount of time, the TrackEntry [trackEnd](/spine-api-reference#TrackEntry-trackEnd) time can be set.

## Queuing

To queue animations to play in the future, call [addAnimation](/spine-api-reference#AnimationState-addAnimation). This schedules the animation to play after the current or last queued animation for the track. If the track is empty, it is equivalent to calling `setAnimation`.

`addAnimation` returns a [TrackEntry](#TrackEntry) which can be used to customize playback.

## Empty animations

When a track has no current animation and an animation is set, it begins playing right away. To instead mix in the animation from the setup pose, an empty animation can be used.

When a track is cleared, the track's animations are no longer applied, leaving the skeletons in their current pose. To instead mix out the animation to the setup pose, an empty animation can be used.

An empty animation has no timelines. It is used as a placeholder so a mix duration can be set. For convenience, the [setEmptyAnimation](/spine-api-reference#AnimationState-setEmptyAnimation) and [addEmptyAnimation](/spine-api-reference#AnimationState-addEmptyAnimation) methods are provided for setting or queuing an empty animation.

To mix an animation in from the setup pose, set an empty animation, add the animation to mix in, then set the mix duration:

```
state.setEmptyAnimation(track, 0);
TrackEntry entry = state.addAnimation(track, "run", true, 0);
entry.mixDuration = 1.5;
```

To mix an animation out to the setup pose, set or queue an empty animation specifying a mix duration:

```
state.setAnimation(track, "run", true, 0);
state.addEmptyAnimation(track, 1.5, 0);
```

When an animation reaches the TrackEntry [trackEnd](/spine-api-reference#TrackEntry-trackEnd) time, properties that the animation keyed are set to the setup pose and the track is cleared. It may be desired to use `setEmptyAnimation` or `addEmptyAnimation` to mix the skeletons back to the setup pose, rather than have it happen instantly.

## TrackEntry

The methods that set or queue animations return a TrackEntry which can be used to further customize playback. Refer to the [TrackEntry API reference](/spine-api-reference#TrackEntry) for the many settings that are available.

### References

It is possible to keep a reference to the TrackEntry, for example, to adjust the `alpha` or `timeScale` properties over time. However, care must be taken not to hold the reference past when the `dispose` listener event occurs.

## Listeners

An application can register a callback to be notified of TrackEntry lifecycle events. `addListener` on the AnimationState registers the listener for all TrackEntry events. A listener can also be set on a specific TrackEntry to receive only events from that entry.

The events that are possible are listed on [AnimationStateListener](/spine-api-reference#AnimationStateListener) and are guaranteed to occur in the order specified. Events are queued during the internal processing done by the AnimationState `update` or `apply` methods and listeners are notified afterward, just before the method returns. This makes it safe for listeners to manipulate the AnimationState, for example to set animations or clear tracks. However, all events that have already been queued will still be fired unless [clearListenerNotifications](/spine-api-reference#AnimationState-clearListenerNotifications) is used.

Changes made to the AnimationState in a listener, such as setting a new animation, are not applied to skeletons until the next time AnimationState `apply` is called. This can be done in the listener, but care must be taken to first call `update`:

```
// Inside a listener:
state.setAnimation(0, "jump", false);
state.update(0); // Advance internal state.
state.apply(skeleton);
```

The `apply` method does not change any internal state, allowing a single AnimationState to be applied to multiple skeletons. Calling `update` lets the AnimationState know all the applying is complete and subsequent `apply` calls are for the next frame. If `update` is not called, `apply` may trigger the same listener notification resulting in an infinite loop and stack overflow.

## Video

This video explains using AnimationState with [spine-unity](/spine-unity), but much of the information is applicable to all other Spine runtimes.

[youtube:DxDZtTK2nlE?start=190]

# Timeline API

The Timeline API is the lowest level API for applying animations and consists of the [Animation](/spine-api-reference#Animation) and [Timeline](/spine-api-reference#Timeline) classes. These classes are stateless, so the time and other parameters for applying the animation must be stored and manipulated externally. This API provides the most control over animation playback, but requires more work to manage the playback state yourself. Most users will prefer to use the [AnimationState API](#AnimationState-API).

An Animation is very simple, it has a name and a list of Timelines. Each timeline knows how to modify a specific skeleton property over time. Applying an animation to a skeleton is done by calling [apply](/spine-api-reference#Timeline-apply) for each timeline in the animation.

```
time += delta;
alpha = 1; // For mixing between the current or setup pose (0) or the animation pose (1).
blend = MixBlend.first; // How the current or setup pose is mixed with the animation pose.
direction = MixDirection.in; // Whether mixing out to the setup pose or in to the animation pose.

for (Timeline timeline : animation.timelines)
	timeline.apply(skeleton, lastTime, time, events, alpha, blend, direction);

// The events list contains any events fired between lastTime and time.
// Process them here, then clear the list.
events.clear();

lastTime = time;
```

Animation has an `apply` convenience method for doing this which has a `loop` parameter and simply calls `apply` on each timeline.

```
loop = true;
animation.apply(skeleton, lastTime, time, loop, events, alpha, blend, direction);
```

[Next: Runtime Skeletons](/spine-runtime-skeletons)
[Previous: Loading Skeleton Data](/spine-loading-skeleton-data)
[Spine Runtimes Guide: Table of Contents]

---
## File: Runtimes Guide/spine-loading-skeleton-data.md
## Title: Loading Skeleton Data - Spine Runtimes Guide
## URL: http://esotericsoftware.com/spine-loading-skeleton-data
---

# Loading Skeleton Data

The first step to getting your Spine animations in your application is to load a texture atlas and skeleton data that have been [exported](/spine-export) from Spine.

# Texture atlas

Spine can [pack](/spine-texture-packer) a texture atlas, which makes rendering skeletons more efficient. Other tools can also be used to pack a texture atlas in the Spine atlas format, such as [Texture Packer Pro](https://www.codeandweb.com/texturepacker) using the "libgdx" atlas format. The Spine Runtimes load an atlas using:

```
TextureLoader textureLoader = ...
Atlas atlas = new Atlas("myAtlas.atlas", textureLoader);
```

Creating an atlas parses the atlas text file which contains information about where the regions are in the atlas page images. It also loads the image files for each atlas page.

# TextureLoader

Loading images is game toolkit specific, so the TextureLoader is what creates and disposes of images. Runtimes for a specific game toolkit come with a TextureLoader for that game toolkit. When using a generic runtime, you will need to write your own TextureLoader. It has two methods:

```
void load (AtlasPage page, String path)
void unload (Object rendererObject)
```

The `load` method loads an image using the path and sets the `rendererObject` field on the [AtlasPage](/spine-api-reference#AtlasPage). The `unload` method disposes of the previously loaded image. For example, here Texture is a game toolkit type:

```
void load (AtlasPage page, String path) {
	Texture texture = GameToolkit.loadTexture(path);
	page.rendererObject = texture;
}

void unload (Object rendererObject) {
	Texture texture = (Texture)rendererObject;
	texture.dispose();
}
```

The `rendererObject` on the AtlasPage is used by the [rendering code](/spine-runtime-skeletons#Generic-rendering).

# JSON and binary data

Loading JSON or binary skeleton data is done using [SkeletonJson](/spine-api-reference#SkeletonJson) or [SkeletonBinary](/spine-api-reference#SkeletonBindy). JSON is human readable but has a larger file size and is slower to parse. Binary is very small and fast, but is not human readable. Both SkeletonJson and SkeletonBinary have a `readSkeletonData` method which returns a [SkeletonData](/spine-api-reference#SkeletonData).

Creating a SkeletonJson or SkeletonBinary instance requires specifying an [AttachmentLoader](/spine-api-reference#AttachmentLoader), which has methods that return new attachment instances. The AttachmentLoader provides a way to customize attachments as they are loaded, such as setting the attachment's atlas region for later rendering. This is so common that the Spine Runtimes comes with [AtlasAttachmentLoader](/spine-api-reference#AtlasAttachmentLoader) which does exactly that:

```
AtlasAttachmentLoader attachmentLoader = new AtlasAttachmentLoader(atlas);
SkeletonJson json = new SkeletonJson(attachmentLoader);
SkeletonData skeletonData = json.readSkeletonData("mySkeleton.json");
```

The AtlasAttachmentLoader uses the attachment's `path` string to find a region in the texture atlas, then sets the attachment's `rendererObject` field to that region for later use by the [rendering code](/spine-runtime-skeletons#Generic-rendering).

# AttachmentLoader

Rather than use AtlasAttachmentLoader, advanced users may want to specify their own AttachmentLoader which has a method for each attachment type:

```
RegionAttachment newRegionAttachment (Skin skin, String name, String path)
MeshAttachment newMeshAttachment (Skin skin, String name, String path)
BoundingBoxAttachment newBoundingBoxAttachment (Skin skin, String name, String path)
PathAttachment newPathAttachment (Skin skin, String name, String path)
```

At a minimum, a new attachment of the appropriate type (or a subclass) should be created and returned, which will then be further configured by data from the JSON or binary file. If a method returns null, the attachment will be ignored as if it did not exist in the data at all.

For region and mesh attachments, the `rendererObject` field may be set to any object that the rendering code needs, though this is optional. For example, you may be using the skeleton data for purposes other than rendering and don't need to load any images. Or maybe you have thousands of attachments and it would not be feasible to load all the images when the skeleton data is loaded. In this case you could defer loading images until later, once you know which attachments will actually be in use.

At some point before rendering occurs, the `rendererObject` and a few properties about the atlas region must be set, such as the UVs, the whitespace stripped region size, the original image size, and if the region was rotated 90 degrees by the texture packer. Refer to the AtlasAttachmentLoader source for the runtime of your choice for as example of setting these properties.

# Scaling

When the skeleton data is loaded, the SkeletonJson or SkeletonBinary class can scale the bone positions, image sizes, and translations:

```
SkeletonJson json = new SkeletonJson(attachmentLoader);
json.scale = 2;
SkeletonData skeletonData = json.readSkeletonData("mySkeleton.json");
```

This causes a skeleton to be drawn at a different size, twice as large in this example. Scaling can be useful when using different sized images than were used when designing the skeleton in Spine. For example, if using images that are half the size than were used in Spine, a scale of 0.5 can be used. Some games include different sized texture atlases and choose which to use based on the player's screen resolution.

Using a loader scale changes the units used. For example, if a bone has a local position of 50,100 then with a scale of 2 it will be changed at load time to 100,200. This can be useful when not using a pixel unit scale at runtime. For example, Box2D prefers meters so a scale of 0.01 could be used to convert pixels to meters.

A skeleton can also be scaled without affecting the units by scaling the root bone:

```
SkeletonJson json = new SkeletonJson(attachmentLoader);
SkeletonData skeletonData = json.readSkeletonData("mySkeleton.json");
BoneData root = skeletonData.findBone("root");
root.scaleX = 2;
root.scaleY = 2;
```

In this case, if a bone has a local position of 50,100 then it will remain at that position. However, when the bone's world transform is computed, its position will be scaled. This may not work as desired if your skeleton has bones that have disabled inheriting scale.

[Next: Applying Animations](/spine-applying-animations)
[Previous: Runtime Architecture](/spine-runtime-architecture)
[Spine Runtimes Guide: Table of Contents]

---
## File: Runtimes Guide/spine-runtime-architecture.md
## Title: Runtime Architecture - Spine Runtimes Guide
## URL: http://esotericsoftware.com/spine-runtime-architecture
---

# Runtime Architecture

The Spine Runtimes are software components that are integrated into your application to load and render skeleton data exported from Spine. The runtimes are very flexible, allowing for customization of when and how textures are loaded, bone manipulation and procedural animation, mixing and layering animations, and much more.

The [runtimes page](/spine-runtimes) lists runtimes available for many different programming languages and game toolkits.

# Licensing

Permission to use the Spine Runtimes is granted by licensing Spine. If you have a Spine license, you may use the Spine Runtimes in any number of applications. See the [Spine Editor License Agreement](/spine-editor-license) for details.

# Source code

The source code for the Spine Runtimes is available in its entirety on [GitHub](https://github.com/EsotericSoftware/spine-runtimes). Access to the source code is essential for such a fundamental component of your applications, enabling customization or optimization for your specific needs.

The source code can be downloaded using Git or by clicking the green "Clone or download button" on GitHub and choosing "Download ZIP".

The code examples in this documentation use pseudo code that is easily translated to runtimes in any language. See the runtime specific pages (README.md files) on GitHub for runtime specific documentation.

# Versioning

The Spine Runtimes load data [exported](/spine-export) from Spine. Care must be taken to use the correct version of Spine so the Spine Runtimes can successfully load the data. It is suggested to freeze your [editor version](/spine-settings#Version) and keep it in lock step with your runtime version. Spine and the Spine Runtimes are constantly being improved, so you may want to periodically update both your runtimes and your editor version.

The [default branch](/git/spine-runtimes/tree) works with the latest non-beta version of Spine. Each runtime's README.md file lists the exact version it works with.

By definition, [beta versions](/spine-versioning#Beta-releases) may not have support for every supported runtime. However, some runtimes will become ready for use before others. If you need the very latest runtimes, look for a branch with the name of the beta version, such as `4.2-beta`. If the runtime you are interested in has been updated, that branch is where you will find the latest code until the next non-beta release. Keep in mind new development happens in the beta branch and may be a work in progress.

# Class diagram

This diagram illustrates how the various pieces of the runtimes fit together. Click for full resolution.

[![](/img/runtimes-diagram.png)](/img/runtimes-diagram.png)

The [API reference](/spine-api-reference) has detailed information about properties and methods for each type of object.

# Data objects

At a high level, skeleton data is loaded into the "Setup Pose Data" objects and usually combined with a texture atlas. These data objects are then used to create skeleton "Instance Data" objects, which are stateful objects that usually correspond to each on-screen skeleton. The data objects are stateless, which means they can be shared across any number of skeleton instances.

Data object class names that have an instance data counterpart end with "Data". Data objects that don't have an instance data counterpart don't have a suffix, such as Attachment, Skin, and Animation.

Sharing the data objects across many skeleton instances is efficient because the data only needs to be loaded once. However, if the data objects are modified, the changes will affect all skeleton instances. To modify a data object only for a single instance, the object must be copied and the original replaced for only that instance.

# Instance objects

Each instance object has the same class name as its data object, but without the "Data" suffix. For example, SkeletonData is the data object and Skeleton is the instance object.

The instance object has many of the same properties as the data object. The properties in the data object represent the setup pose and don't normally change. The same properties in the instance object represent the current pose for that instance as it is animated.

Every instance object keeps a reference to its data object. This is used to reset the instance object back to the setup pose. Also, some properties exist only on the data object and not on the instance object, such as the object's name.

[Next: Loading Skeleton Data](/spine-loading-skeleton-data)
[Spine Runtimes Guide: Table of Contents]

---
## File: Runtimes Guide/spine-runtime-skeletons.md
## Title: Runtime Skeletons - Spine Runtimes Guide
## URL: http://esotericsoftware.com/spine-runtime-skeletons
---

# Runtime Skeletons

The Spine Runtimes provide access to bones, slots, attachments, and more. Skeletons can be customized and respond to the environment in many ways.

# World transforms

Bones are arranged in a hierarchy where each bone is affected by its parent bones, all the way back to the root bone. For example, when a bone is rotated, all its child bones and all their children are also rotated. To accomplish this, each bone has a local transform consisting of:

- **`x`** and **`y`**
- **`rotation`**
- **`scaleX`** and **`scaleY`**
- **`shearX`** and **`shearY`**

Starting at the root and proceeding with parent bones first, the local transform is used to compute a world transform for each bone. The world transform consists of:

- **`a`**, **`b`**, **`c`**, and **`d`** This is a 2x2 matrix which encodes the combined rotation, scale and shear of the bone and all parent bones back to the root. `a` and `c` are the X axis, `b` and `d` are the Y axis.
- **`worldX`** and **`worldY`** This is the world position of the bone, where the world coordinate system is the coordinate system the root bone is positioned in.

The world transform can transform any point from the bone's local coordinates to world coordinates. For example, the vertices for a mesh attached to a bone are transformed by the bone's world transform. The resulting vertices are affected by the bone and all its parent bones. This mechanism is at the core of Spine's skeletal animation system.

The world transform can also do the reverse, transform any point from world coordinates to the bone's local coordinates.

## updateWorldTransform

A bone's world transform is not normally modified directly. Instead, the local transform is modified and the world transform is computed using the local transform and the parent bone's world transform. Any time a bone's local transform is changed, the world transform for the bone and all its descendants must be recomputed by calling Bone [updateWorldTransform](/spine-api-reference#Bone-updateWorldTransform). However, bones must be updated in the correct order so it is much more common to call Skeleton `updateWorldTransform` which not only updates all the bones in the correct order, but also applies any constraints.

Applying an animation almost always modifies bone local transforms. Rendering a skeleton makes uses of the bone world transforms. Therefore it is very common to call `updateWorldTransform` after applying an animation, before rendering occurs.

```
state.update(delta);
state.apply(skeleton);
skeleton.updateWorldTransform();
renderSkeleton(skeleton);
```

# Procedural animation

Bones can be accessed and adjusted programmatically for a variety of effects. For example, the local rotation of a bone can be set so it points toward the mouse cursor for aiming. It can also be convenient to programmatically position an IK target bone, allowing IK constraints to adjust various bones with different IK mixes.

It is common to apply an animation, then adjust the bones:

```
Bone torso = skeleton.findBone("torso");
...
state.update(delta);
state.apply(skeleton);
torso.rotation = ... // compute rotation for torso
skeleton.updateWorldTransform();
renderSkeleton(skeleton);
}
```

If the world transform from the animation pose is may be needed to adjust the bone, `updateWorldTransform` can be called before the adjustment, then again after the local transform is changed:

```
Bone torso = skeleton.findBone("torso");
...
state.update(delta);
state.apply(skeleton);
skeleton.updateWorldTransform();
torso.rotation = ... // compute rotation for torso
skeleton.updateWorldTransform();
renderSkeleton(skeleton);
```

## Setup pose

Animations are applied relative to the setup pose. This means if a BoneData is adjusted, it will affect all animations for all skeletons that use that BoneData. Applying an animation uses the BoneData, so changes should be made before applying an animation:

```
Bone torso = skeleton.findBone("torso");
...
torso.data.rotation = ... // compute rotation for torso
state.update(delta);
state.apply(skeleton);
skeleton.updateWorldTransform();
renderSkeleton(skeleton);
```

## Bone positions

The world transform of a bone can be used to position game elements, such as a particles or other effects:

```
Bone rightHand = skeleton.findBone("right hand");
...
state.update(delta);
state.apply(skeleton);
skeleton.updateWorldTransform();
renderSkeleton(skeleton);
renderParticles(rightHand.worldX, rightHand.worldY);
```

In this example, an animation is applied, the world transforms are computed, the skeleton is rendered, then the world position of the "right hand" bone is used to draw particle effects. The world rotation and scale of the bone is also available, for example to shoot particles in the direction of the bone. In a similar manner, bone world transforms could be used to animate a UI by positioning, rotating, and scaling the UI elements using bones.

# Generic rendering

Runtimes for a specific game toolkit are a full solution, they do everything including rendering. Generic runtimes are game toolkit agnostic and do everything except for the actual rendering. You only need to concern yourself with rendering if using a generic runtime.

To perform rendering for a generic runtime, the Skeleton class provides a [drawOrder](/spine-api-reference#Skeleton-drawOrder) property which is a list of slots in the order they should be drawn. Rendering consists of retrieving the attachment from each slot, inspecting its type, and rendering it if necessary. The attachment types that need to be rendered are:

- **`RegionAttachment`** This has 4 vertices and is a quadrilateral (it is not always a rectangle).
- **`MeshAttachment`** This has any number of vertices and triangles. Both are provided by the skeleton data, the renderer does not need to perform any triangulation.

Pseudo code for rendering looks like:

```
foreach (Slot slot in skeleton.drawOrder) {
	Attachment attachment = slot.attachment;
	AtlasRegion region;
	if (attachment is RegionAttachment) {
		attachment.computeWorldVertices(slot.bone, vertices);
		triangles = quadTriangles;
		region = attachment.rendererObject;
	} else if (attachment is MeshAttachment) {
		attachment.computeWorldVertices(slot.bone, vertices);
		triangles = attachment.triangles;
		region = attachment.rendererObject;
	}
	if (texture != null) {
		Texture texture = region.page.rendererObject;
		draw(texture, vertices, triangles, slot.data.blendMode);
	}
}
```

The `rendererObject` property on the attachments is set by the [AttachmentLoader](/spine-api-reference#AttachmentLoader) when the skeleton data is loaded. This pseudo code assumes a Spine atlas is used, which is why the `rendererObject` is an AtlasRegion.

The AtlasRegion has an AtlasPage which has its own `rendererObject` property that is set by the [TextureLoader](/spine-api-reference#TextureLoader) when the atlas is loaded. The Texture class represents a game toolkit specific class.

# Changing attachments

At any given time, a slot can have a single attachment or no attachment. The attachment for a slot can be changed by setting Slot [attachment](/spine-api-reference#Slot-attachment). Skeleton has a [setAttachment](/spine-api-reference#Skeleton-setAttachment) convenience method which finds the slot and attachment objects by name. The slot's attachment will stay until changed again.

```
Skeleton skeleton = ...

// Find the slot by name.
Slot slot = skeleton.findSlot("slotName");
// Get the attachment by name from the skeleton's skin or default skin.
Attachment attachment = skeleton.getAttachment(slot.index, "attachmentName");
// Sets the slot's attachment.
slot.attachment = attachment;

// Alternatively, the skeleton setAttachment method does the above.
skeleton.setAttachment("slotName", "attachmentName");
```

Attachments may be changed in other ways. Calling Skeleton `setToSetupPose` or `setSlotsToSetupPose` will change slot attachments. An animation may have key frames that change attachments. Calling Skeleton `setSkin` may change attachments (see [Skin changes](/spine-runtime-skins#Skin-changes)).

[Next: Runtime Skins](/spine-runtime-skins)
[Previous: Applying Animations](/spine-applying-animations)
[Spine Runtimes Guide: Table of Contents]

---
## File: Runtimes Guide/spine-runtime-skins.md
## Title: Runtime Skins - Spine Runtimes Guide
## URL: http://esotericsoftware.com/spine-runtime-skins
---

# Runtime Skins

Skins are used to control what attachments a skeleton uses at runtime. A [Skin](/spine-api-reference#Skin) is a map where the key is a slot and a name, while the value is an attachment. The name is the skin placeholder name defined in the Spine editor and is not necessarily the name of the attachment. This allows code and animations to set attachments by skin placeholder name, without having to reference a specific attachment.

For example, a skin might have a key `slot=head,name=head` and a value for that key `attachment=fish-head`. Another skin might have the same key `slot=head,name=head` and a value `attachment=donkey-head`. The skin decouples code and animations from which attachments are actually used. Code and animations change the attachment using the name `head`, but which attachment is shown for the head depends on the skeleton's current skin.

All attachments defined in the skeleton data are placed in a skin. Attachments that were not in a skin in the Spine editor will appear at runtime in a skin named `default`, where the name in the skin is the same as the attachment's name. When Skeleton `getAttachment` needs to find an attachment by name, it first looks in the skeleton's current skin. If the attachment is not found, then it looks in the SkeletonData's default skin.

# Customization

Skeletons are not limited by the skins that are defined it the Spine editor. A new, empty skin can be created at runtime and populated with attachments. For example, consider a skeleton that can have a dog head or a snake head, and can have feathered wings or burning wings. Creating a skin for every combination of head and wings would be tedious, especially as more are added. Instead, a skin can be created programmatically with the desired head, wings, and other attachments.

# Grouping attachments

While the primary purpose for skins is decoupling, they are also useful to simply group attachments. Most commonly a skin is used to swap the entire look of the skeleton.

Skins can also be used to group a subset of attachments. For example, sometimes an "item" to be equipped by a character is actually made up of multiple attachments. A shirt might be made up of a torso attachment plus two more attachments for each sleeve. In this case a skin can be created containing the 3 shirt attachments.

At runtime a skeleton can only have one skin (plus the "default" skin in SkeletonData as a fallback). A skin can be created programmatically, then populated with the attachments from other skins. In this way, multiple "item" skins can be combined to outfit the skeletons.
```
Skin newSkin = new Skin("new-skin"); // 1. Create a new empty skin
newSkin.addSkin(skeletonData.findSkin("shirt/pink"); // 2. Add items
newSkin.addSkin(skeletonData.findSkin("pants/green");
newSkin.addSkin(skeletonData.findSkin("shoes/sneakers");
```
In the Spine editor, you can use the [Skins view](/spine-skins-view) to preview multiple skins at once.

# Skin changes

When a new skin is set and the skeleton does not already have a skin, any attachments in the skin that are visible in the setup pose are attached. 

When a new skin is set and the skeleton already has a skin, then attachments from the new skin are attached if the slot had the attachment from the old skin attached. Otherwise, no attachments are changed.

To ensure all the attachments reflect the active skin setup, all the systems that affect attachments need to be told to set the slots again.
```
skeleton.setSkin(newSkin); // 1. Set the active skin
skeleton.setSlotsToSetupPose(); // 2. Use setup pose to set base attachments.
animationState.apply(skeleton); // 3. Use AnimationState to set attachments active in the current movement.
// 4. Set attachments that were manually changed.
```

The call to `animationState.apply` may be omitted if the skin is set before animationState.apply is going to be called in that frame.

To get any other behavior, you will need to set the desired attachments after changing the skin.

# Creating attachments

Similar to creating skins at runtime, attachments can also be created programmatically. This can be useful when there are many attachments that would be tedious to create manually in Spine.

In Spine, attachments are positioned relative to their parent bone. When creating an attachment programmatically, some convention is needed to know where to place the attachment. The main problem is that when images are a different sizes, they will need to be positioned differently.

To solve this, you can outfit the skeleton with template images that have enough whitespace to accommodate art for all your different attachments. Now any number of attachment images can be created from the template images, but don't need to be added to the skeleton in Spine. At runtime, the attachments for the template images can be copied, then the texture regions changed. Since every image is the same size as the corresponding template image, they attach to the bone in the same position.

It is helpful for creating the art to have the template images mark the bone locations. Also, the extra whitespace in the attachment images can be stripped by the texture packer or a similar process.

[Next: API Reference](/spine-api-reference)
[Previous: Runtime Skeletons](/spine-runtime-skeletons)
[Spine Runtimes Guide: Table of Contents]

---
## File: Runtimes Guide/spine-runtimes-guide.md
## Title: Spine Runtimes Guide
## URL: http://esotericsoftware.com/spine-runtimes-guide
---

# Spine Runtimes Guide

This guide will teach you how to load, render, and manipulate skeletons in your applications using the Spine Runtimes.

<div
  style="
    display: flex;
    flex-direction: column;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 16px 0;
    margin-bottom: 16px;
  "
>
  <div style="font-weight: bold">User Guide Search</div>
  <div class="btn-group" style="display: flex; align-items: center; margin: 16px 0">
    <input
      type="text"
      id="query"
      maxlength="128"
      title="Search the Spine User Guide using Google"
      class="input-search"
      style="height: 25px; margin: 0"
    />
    <button id="search" class="btn btn-round" style="margin: 0">
      <span class="iconfont-search"></span>
    </button>
  </div>
  <div id="queryResults" style="display: flex; flex-direction: column; gap: 16px; width: 100%; height: 100%">
  </div>
</div>

<script>
// See https://doxie.marioslab.io/admin for source ids
const sourceId = "65cb43073ec0ffabf4624e4d"

const queryUi = document.querySelector("#query");
queryUi.addEventListener("keydown", (event) => {
   if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      search();
   }
});
const searchButtonUi = document.querySelector("#search");
searchButtonUi.addEventListener("click", () => search());
const resultsUi = document.querySelector("#queryResults");

async function search() {
   resultsUi.innerHTML = "<div>Searching ...</div>";
   try {
      const response = await fetch(`https://doxie.marioslab.io/api/search?sourceId=${sourceId}&query=${encodeURIComponent(queryUi.value)}`)
      if (!response.ok) throw new Error(await response.text());
      const results = (await response.json()).results;
      resultsUi.innerHTML = "";
      let i = 0;
      for (const result of results) {
         const row = renderResult(result);
         if (row) {
            resultsUi.append(row);
            i++;
            if (i == 5) break;
         }
      }
   } catch (e) {
      console.log("Search failed", e);
      resultsUi.innerHTML = "<div>Sorry, could not find any results.</div>"
   }
}

function renderResult(result) {
   const parts = result.text.split("\n\n");
   parts.shift();
   const text = stripMarkdown(parts.join(" "));
   if (text.length == 0) return;
   const resultUi = document.createElement("div");
resultUi.innerHTML = `
    <a
      href="${result.docUri}"
      style="font-size: 18px"
      >${result.docTitle}</a
    >
    <p style="margin-bottom: 0px;">${text.substring(0, 400)} ...</p>
`
   resultUi.style.display = "flex";
   resultUi.style.flexDirection = "column";
   return resultUi;
}

function stripMarkdown(markdownText) {
  const htmlText = markdownText
    .replace(/#/g, "")
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold **text** or __text__
    .replace(/(\*|_)(.*?)\1/g, '$2') // Italic *text* or _text_
    .replace(/\~\~(.*?)\~\~/g, '$1') // Strikethrough ~~text~~
    .replace(/\!\[[^\]]*\]\([^\)]*\)/g, '') // Remove images ![alt text](image.jpg)
    .replace(/\[([^\]]*)\]\([^\)]*\)/g, '$1') // Corrected: Remove links [text](http://) but keep the text
    .replace(/#+\s?(.*?)\n/g, '$1\n') // Remove headers, adjusted to capture text after #
    .replace(/\n-\s/g, '') // Remove lists
    .replace(/\n\d+\.\s/g, '') // Remove numbered lists
    .replace(/\n>/g, '') // Remove blockquotes
    .replace(/`{3}.*?`{3}/gs, '') // Remove fenced code blocks
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .replace(/\[.*?\]/g, '')
    .replace(/\n/g, ' '); // Replace new lines with spaces
  return htmlText.trim();
}
</script>

<!--<form method="get" action="//www.google.com/search" class="support-form forms" id="runtimes-guide-form" style="margin-bottom:-0.5em">
<fieldset>
	<legend>Runtimes Guide Search</legend>
	<table class="layout layout-form"><tr>
	<td>Keywords:</td>
	<td class="btn-group">
		<input type="text" id="runtimes-guide-q" maxlength="128" title="Search the Spine Runtimes Guide using Google" class="input-search">
		<button class="btn btn-round" onclick="googleRuntimesGuide(); return false"><span class="iconfont-search"></span></button>
	</td>
	</tr></table>
</fieldset>
</form>-->

!!* [Runtime Architecture](/spine-runtime-architecture)
* [Loading Skeleton Data](/spine-loading-skeleton-data)
* [Applying Animations](/spine-applying-animations)
* [Runtime Skeletons](/spine-runtime-skeletons)
* [Runtime Skins](/spine-runtime-skins)
* [API Reference](/spine-api-reference)

<form method="get" action="//www.google.com/search" id="google" style="display:none">
<input type="hidden" name="q" id="google-q">
</form>

<script>
$("#runtimes-guide-form").submit(function() {
	if (e.which == 13) {
		googleRuntimesGuide();
		return false;
	}
});
function googleRuntimesGuide () {
	$("#google-q").val('site:' + (langs[0] == "en" ? "" : (langs[0] + ".")) + 'esotericsoftware.com "Spine Runtimes Guide" ' + $("#runtimes-guide-q").val());
	$("#google").submit();
}
</script>

---
## File: Runtimes, spine-c/spine-c.md
## Title: spine-c Runtime Documentation
## URL: http://esotericsoftware.com/spine-c
---

# spine-c Runtime Documentation

> **Licensing**
>
> Please see the [Spine Runtimes License](/spine-runtimes-license) before integrating the Spine Runtimes into your applications.

# Introduction
spine-c is a generic runtime for integrating Spine animations in game engines and frameworks written in C, C++, Swift, Rust, Objective-C or any other language that can interface with C.

spine-c provides functionality to:
* Load and manipulate [Spine skeletons](/spine-loading-skeleton-data) and [texture atlases](/spine-texture-packer)
* Apply and mix [animations](/spine-applying-animations) with crossfading
* Manage [skins](/spine-runtime-skins) for visual variations
* Manipulate and compute data required for rendering and physics based on the current [skeleton pose, slots & attachments states](/spine-runtime-skeletons)

The runtime is engine-agnostic. You provide texture loading callbacks and feed the generated render commands into your engine's rendering system.

spine-c is written in C99 for maximum compatibility. The API is generated from [spine-cpp](/spine-cpp), ensuring completeness and type safety.

Example integrations:
* [spine-ios](/git/spine-runtimes/tree/spine-ios) - iOS integration
* [spine-flutter](/git/spine-runtimes/tree/spine-flutter) - Flutter integration
* [spine-sdl](/git/spine-runtimes/tree/spine-sdl) - SDL integration
* [spine-glfw](/git/spine-runtimes/tree/spine-glfw) - GLFW integration

> **Note:** This guide assumes familiarity with [Spine runtime architecture](/spine-runtime-architecture) and terminology. See the [API reference](/spine-api-reference) for detailed function documentation.

# Integrating spine-c

## CMake Integration (Recommended)

The easiest way to integrate spine-c into your project is via CMake FetchContent:

```cmake
include(FetchContent)
FetchContent_Declare(
    spine-c
    GIT_REPOSITORY https://github.com/esotericsoftware/spine-runtimes.git
    GIT_TAG 4.3
    SOURCE_SUBDIR spine-c
)
FetchContent_MakeAvailable(spine-c)

# Link against spine-c
target_link_libraries(your_target spine-c)
```

This will automatically fetch and build spine-c along with its dependency (spine-cpp).

Include spine-c headers in your code:
```c
#include <spine-c.h>
```

## Manual Integration

If you prefer manual integration:

1. Download the Spine Runtimes source using git (`git clone https://github.com/esotericsoftware/spine-runtimes`) or download it as a zip
2. Add the required source files to your project:
   - Add sources from `spine-cpp/src`, `spine-c/src`
3. Add the include directories: `spine-cpp/include`, `spine-c/include`

Include spine-c headers in your code:
```c
#include <spine-c.h>
```

# Exporting Spine assets for spine-c
![](/img/spine-runtimes-guide/spine-ue4/export.png)

Follow the Spine User Guide to:
1. [Export skeleton & animation data](/spine-export) to JSON or binary format
2. [Export texture atlases](/spine-texture-packer) containing your skeleton's images

An export yields these files:

![](/img/spine-runtimes-guide/spine-ue4/exported-files.png)

1. `skeleton-name.json` or `skeleton-name.skel`: skeleton and animation data
2. `skeleton-name.atlas`: texture atlas information
3. One or more `.png` files: atlas pages with packed images

> **Note:** You can pack images from multiple skeletons into a single texture atlas for efficiency. See the [texture packing guide](/spine-texture-packer).

# Loading Spine assets
spine-c provides APIs to load texture atlases, Spine skeleton data (bones, slots, attachments, skins, animations) and define mix times between animations through [animation state data](/spine-applying-animations#Mix-times). These three types of data, also known as setup pose data, are generally loaded once and then shared by every game object. The sharing mechanism is achieved by giving each game object its own skeleton and [animation state](/spine-applying-animations#AnimationState-API), also known as instance data.

> **Note:** For a more detailed description of the overall loading architecture consult the generic [Spine Runtime Documentation](/spine-loading-skeleton-data).

## Loading texture atlases
Texture atlas data is stored in a custom [atlas format](/spine-atlas-format) that describes the location of individual images within atlas pages. The atlas pages themselves are stored as plain `.png` files next to the atlas.

spine-c provides two approaches for loading atlases:

### Option 1: Load atlas without textures
Use `spine_atlas_load` to parse the atlas data without loading textures. You'll need to manually load textures for each atlas page:

```c
// First, load the .atlas file contents into a string
char* atlasData = read_file_to_string("path/to/skeleton.atlas");

// Parse the atlas data (doesn't load textures)
spine_atlas_result result = spine_atlas_load(atlasData);

// Check for errors
if (spine_atlas_result_get_error(result)) {
    printf("Error loading atlas: %s\n", spine_atlas_result_get_error(result));
    spine_atlas_result_dispose(result);
    exit(1);
}

spine_atlas atlas = spine_atlas_result_get_atlas(result);
spine_atlas_result_dispose(result);

// Manual texture loading: spine_atlas_load sets page indices, not texture pointers
// You need to load textures and set them on the regions for each page
spine_array_atlas_page pages = spine_atlas_get_pages(atlas);
int num_pages = spine_array_atlas_page_size(pages);

// Load texture for each page
void** page_textures = malloc(num_pages * sizeof(void*));
spine_atlas_page* pages_buffer = spine_array_atlas_page_buffer(pages);
for (int i = 0; i < num_pages; i++) {
    spine_atlas_page page = pages_buffer[i];

    // Get the texture filename from the atlas
    const char* texture_name = spine_atlas_page_get_texture_path(page);

    // Construct full path (you need to know where your textures are)
    char full_path[256];
    snprintf(full_path, sizeof(full_path), "%s/%s", atlas_dir, texture_name);

    // Load texture using your engine
    page_textures[i] = engine_load_texture(full_path);
}

// Set renderer objects on all regions to point to their page's texture
spine_array_atlas_region regions = spine_atlas_get_regions(atlas);
int num_regions = spine_array_atlas_region_size(regions);
spine_atlas_region* regions_buffer = spine_array_atlas_region_buffer(regions);

for (int i = 0; i < num_regions; i++) {
    spine_atlas_region region = regions_buffer[i];
    spine_atlas_page page = spine_atlas_region_get_page(region);

    // spine_atlas_load stores the page index in the page's texture field
    int page_index = (int)(intptr_t)spine_atlas_page_get_texture(page);

    // Set the actual texture as the region's renderer object
    spine_atlas_region_set_renderer_object(region, page_textures[page_index]);
}

free(page_textures);
```

### Option 2: Provide texture loading callbacks
Use `spine_atlas_load_callback` to automatically load textures during atlas parsing:

```c
// Define callbacks for your engine's texture system
void* my_load_texture(const char* path) {
    // path is the full path: atlas_dir + "/" + texture_name
    // e.g., "path/to/atlas/dir/skeleton.png"
    return engine_load_texture(path);
}

void my_unload_texture(void* texture) {
    engine_unload_texture(texture);
}

// First, load the .atlas file contents into a string
char* atlasData = read_file_to_string("path/to/skeleton.atlas");

// Load atlas with automatic texture loading
spine_atlas_result result = spine_atlas_load_callback(
    atlasData,              // Atlas file contents as string
    "path/to/atlas/dir",    // Directory where texture files are located
    my_load_texture,        // Your texture load function
    my_unload_texture       // Your texture unload function
);

// Check for errors
if (spine_atlas_result_get_error(result)) {
    printf("Error loading atlas: %s\n", spine_atlas_result_get_error(result));
    spine_atlas_result_dispose(result);
    exit(1);
}

spine_atlas atlas = spine_atlas_result_get_atlas(result);
spine_atlas_result_dispose(result);
```

## Loading skeleton data
Skeleton data (bones, slots, attachments, skins, animations) can be exported to human readable [JSON](/spine-json-format) or a custom [binary format](/spine-binary-format). spine-c stores skeleton data in `spine_skeleton_data` structs.

For loading skeleton data:

```c
// First, load the skeleton JSON file contents into a string
char* jsonString = read_file_to_string("path/to/skeleton.json");

// Load skeleton data from JSON
spine_skeleton_data_result json_result = spine_skeleton_data_load_json(
    atlas,           // Previously loaded atlas
    jsonString,      // JSON file contents as string
    "skeleton.json"  // Path for error reporting
);

// Check for errors
if (spine_skeleton_data_result_get_error(json_result)) {
    printf("Error loading skeleton: %s\n", spine_skeleton_data_result_get_error(json_result));
    spine_skeleton_data_result_dispose(json_result);
    exit(1);
}

// Get the skeleton data from the result
spine_skeleton_data skeleton_data = spine_skeleton_data_result_get_data(json_result);

// Dispose the result (but keep the skeleton data)
spine_skeleton_data_result_dispose(json_result);
```

Loading skeleton data from a binary export:

```c
// First, load the skeleton binary file into memory
uint8_t* binaryData = read_file_to_bytes("path/to/skeleton.skel", &dataLength);

// Load skeleton data from binary
spine_skeleton_data_result binary_result = spine_skeleton_data_load_binary(
    atlas,           // Previously loaded atlas
    binaryData,      // Binary data as uint8_t array
    dataLength,      // Length of binary data
    "skeleton.skel"  // Path for error reporting
);

// Check for errors and get skeleton data (same as JSON)
if (spine_skeleton_data_result_get_error(binary_result)) {
    printf("Error loading skeleton: %s\n", spine_skeleton_data_result_get_error(binary_result));
    spine_skeleton_data_result_dispose(binary_result);
    exit(1);
}

spine_skeleton_data skeleton_data = spine_skeleton_data_result_get_data(binary_result);
spine_skeleton_data_result_dispose(binary_result);
```

> **Note:** Binary format is preferred for production as it's smaller and faster to load than JSON.

## Preparing animation state data
Spine supports smooth transitions (crossfades) when switching from one animation to another. The crossfades are achieved by mixing one animation with another for a specific mix time. spine-c provides the `spine_animation_state_data` struct to define these mix times:

```c
// Create the animation state data
spine_animation_state_data anim_state_data = spine_animation_state_data_create(skeleton_data);

// Set the default mix time between any pair of animations in seconds
spine_animation_state_data_set_default_mix(anim_state_data, 0.1f);

// Set the mix time between specific animations, overwriting the default
spine_animation_state_data_set_mix_1(anim_state_data, "jump", "walk", 0.2f);
```

The mix times defined in `spine_animation_state_data` can also be overwritten explicitly when applying animations (see below).

# Skeletons
Setup pose data (skeleton data, texture atlases) is shared between game objects. Each game object gets its own `spine_skeleton` instance that references the shared `spine_skeleton_data` and `spine_atlas`.

Skeletons can be freely modified (procedural bone manipulation, animations, attachments, skins) while the underlying data stays intact. This allows efficient sharing across any number of game objects.

## Creating skeletons
```c
spine_skeleton skeleton = spine_skeleton_create(skeleton_data);
```

Each game object needs its own skeleton instance. The bulk data remains shared to reduce memory consumption and texture switches.

> **Note:** Skeletons must be explicitly disposed with `spine_skeleton_dispose(skeleton)` when no longer needed.

## Bones
A skeleton is a hierarchy of bones, with slots attached to bones, and attachments attached to slots.

### Finding bones
All bones in a skeleton have a unique name:

```c
// Returns NULL if no bone of that name exists
spine_bone bone = spine_skeleton_find_bone(skeleton, "mybone");
```

### Local transform
A bone is affected by its parent bone, all the way back to the root bone. How a bone inherits from its parent is controlled by its [transform inheritance](/spine-bones#Transform-inheritance) setting. Each bone has a local transform relative to its parent consisting of:

* `x` and `y` coordinates relative to the parent
* `rotation` in degrees
* `scaleX` and `scaleY`
* `shearX` and `shearY` in degrees

The local transform is accessed through the bone's pose (`spine_bone_local`):

```c
spine_bone bone = spine_skeleton_find_bone(skeleton, "mybone");
spine_bone_local pose = spine_bone_get_pose(bone);

// Get local transform properties
float x = spine_bone_local_get_x(pose);
float y = spine_bone_local_get_y(pose);
float rotation = spine_bone_local_get_rotation(pose);
float scaleX = spine_bone_local_get_scale_x(pose);
float scaleY = spine_bone_local_get_scale_y(pose);
float shearX = spine_bone_local_get_shear_x(pose);
float shearY = spine_bone_local_get_shear_y(pose);

// Modify local transform
spine_bone_local_set_position(pose, 100, 50);
spine_bone_local_set_rotation(pose, 45);
spine_bone_local_set_scale_1(pose, 2, 2);
```

The local transform can be manipulated procedurally or via animations. Both can be done simultaneously, with the combined result stored in the pose.

### World transform
After setting up local transforms (procedurally or via animations), you need the world transform of each bone for rendering and physics.

The calculation starts at the root bone and recursively calculates all child bone world transforms. It also applies [IK](/spine-ik-constraints), [transform](/spine-transform-constraints), [path](/spine-path-constraints) and [slider](/spine-sliders) constraints.

To calculate world transforms:

```c
spine_skeleton_update(skeleton, deltaTime);
spine_skeleton_update_world_transform(skeleton, SPINE_PHYSICS_UPDATE);
```

`deltaTime` is the time between frames in seconds. The second parameter specifies physics behavior, with `SPINE_PHYSICS_UPDATE` being a good default.

The world transform is accessed through the bone's applied pose (`spine_bone_pose`):

```c
spine_bone_pose applied = spine_bone_get_applied_pose(bone);

// Get world transform matrix components
float a = spine_bone_pose_get_a(applied);  // 2x2 matrix encoding
float b = spine_bone_pose_get_b(applied);  // rotation, scale
float c = spine_bone_pose_get_c(applied);  // and shear
float d = spine_bone_pose_get_d(applied);

// Get world position
float worldX = spine_bone_pose_get_world_x(applied);
float worldY = spine_bone_pose_get_world_y(applied);
```

Note that `worldX` and `worldY` are offset by the skeleton's x and y position.

World transforms should never be modified directly. They're always derived from local transforms by calling `spine_skeleton_update_world_transform`.

### Converting between coordinate systems
spine-c provides functions to convert between coordinate systems. These assume world transforms have been calculated:

```c
spine_bone bone = spine_skeleton_find_bone(skeleton, "mybone");
spine_bone_pose applied = spine_bone_get_applied_pose(bone);

// Get world rotation and scale
float rotationX = spine_bone_pose_get_world_rotation_x(applied);
float rotationY = spine_bone_pose_get_world_rotation_y(applied);
float scaleX = spine_bone_pose_get_world_scale_x(applied);
float scaleY = spine_bone_pose_get_world_scale_y(applied);

// Transform between world and local space
float localX, localY, worldX, worldY;
spine_bone_pose_world_to_local(applied, worldX, worldY, &localX, &localY);
spine_bone_pose_local_to_world(applied, localX, localY, &worldX, &worldY);

// Transform rotations
float localRotation = spine_bone_pose_world_to_local_rotation(applied, worldRotation);
float worldRotation = spine_bone_pose_local_to_world_rotation(applied, localRotation);
```

> **Note:** Modifications to a bone's local transform (and its children) are reflected in world transforms after calling `spine_skeleton_update_world_transform`.

## Positioning
By default, a skeleton is at the origin of the world coordinate system. To position a skeleton in your game world:

```c
// Make a skeleton follow a game object
spine_skeleton_set_x(skeleton, myGameObject->worldX);
spine_skeleton_set_y(skeleton, myGameObject->worldY);

// Or set both at once
spine_skeleton_set_position(skeleton, myGameObject->worldX, myGameObject->worldY);
```

> **Note:** Changes to the skeleton's position are reflected in bone world transforms after calling `spine_skeleton_update_world_transform`.

## Flipping
A skeleton can be flipped to reuse animations for the opposite direction:

```c
spine_skeleton_set_scale(skeleton, -1, 1);  // Flip horizontally
spine_skeleton_set_scale(skeleton, 1, -1);  // Flip vertically
// Or individually: spine_skeleton_set_scale_x(skeleton, -1); spine_skeleton_set_scale_y(skeleton, -1);
```

For coordinate systems with y-axis pointing down (Spine assumes y-up by default), set this globally:

```c
spine_bone_set_y_down(true);  // Affects all skeletons
```

> **Note:** Scale changes are reflected in bone world transforms after calling `spine_skeleton_update_world_transform`.

## Setting skins
Artists can create multiple [skins](/spine-runtime-skins) to provide visual variations of the same skeleton (e.g., different characters or equipment). A [skin at runtime](/spine-runtime-skins) maps which [attachment](/spine-basic-concepts#Attachments) goes into which [slot](/spine-basic-concepts#Slots).

Every skeleton has at least one skin defining the setup pose. Additional skins have names:

```c
// Set a skin by name
spine_skeleton_set_skin_1(skeleton, "my_skin_name");

// Set the default setup pose skin
spine_skeleton_set_skin_2(skeleton, NULL);
```

### Creating custom skins
You can create custom skins at runtime by combining existing skins (mix and match):

```c
// Create a new custom skin
spine_skin custom_skin = spine_skin_create("custom-character");

// Add multiple skins to create a mix-and-match combination
spine_skin_add_skin(custom_skin, spine_skeleton_data_find_skin(skeleton_data, "skin-base"));
spine_skin_add_skin(custom_skin, spine_skeleton_data_find_skin(skeleton_data, "armor/heavy"));
spine_skin_add_skin(custom_skin, spine_skeleton_data_find_skin(skeleton_data, "weapon/sword"));
spine_skin_add_skin(custom_skin, spine_skeleton_data_find_skin(skeleton_data, "hair/long"));

// Apply the custom skin to the skeleton
spine_skeleton_set_skin_2(skeleton, custom_skin);
```

> **Note:** Custom skins must be manually disposed with `spine_skin_dispose(custom_skin)` when no longer needed.

> **Note:** Setting a skin considers previously active attachments. See [skin changes](/spine-runtime-skins#Skin-changes) for details.

## Setting attachments
You can set individual attachments on slots directly, useful for switching equipment:

```c
// Set the "sword" attachment on the "hand" slot
spine_skeleton_set_attachment(skeleton, "hand", "sword");

// Clear the attachment on the "hand" slot
spine_skeleton_set_attachment(skeleton, "hand", NULL);
```

The attachment is searched first in the active skin, then in the default skin.

## Tinting
You can tint all attachments in a skeleton:

```c
// Tint all attachments red with half transparency
spine_skeleton_set_color_2(skeleton, 1.0f, 0.0f, 0.0f, 0.5f);

// Or using a color struct
spine_color color = spine_skeleton_get_color(skeleton);
// Modify color...
spine_skeleton_set_color_1(skeleton, color);
```

> **Note:** Colors in spine-c are RGBA with values in the range [0-1].

Each slot also has its own color that can be manipulated:

```c
spine_slot slot = spine_skeleton_find_slot(skeleton, "mySlot");
spine_slot_pose pose = spine_slot_get_pose(slot);
spine_color slot_color = spine_slot_pose_get_color(pose);
// The slot color is multiplied with the skeleton color when rendering
```

Slot colors can be animated. Manual changes will be overwritten if an animation keys that slot's color.

# Applying animations
The Spine editor lets artists create multiple, uniquely named [animations](/spine-animating). An animation is a set of [timelines](/spine-api-reference#Timeline). Each timeline specifies values over time for properties like bone transforms, attachment visibility, slot colors, etc.

## Timeline API
spine-c provides a [timeline API](/spine-applying-animations#Timeline-API) for direct timeline manipulation. This low-level functionality allows full customization of how animations are applied.

## Animation state API
For most use cases, use the [animation state API](/spine-applying-animations#AnimationState-API) instead of the timeline API. It handles:
- Applying animations over time
- Queueing animations
- Mixing between animations (crossfading)
- Applying multiple animations simultaneously (layering)

The animation state API uses the timeline API internally.

spine-c represents animation state via `spine_animation_state`. Each game object needs its own skeleton and animation state instance. These share the underlying `spine_skeleton_data` and `spine_animation_state_data` with all other instances to reduce memory consumption.

### Creating animation states
```c
spine_animation_state animation_state = spine_animation_state_create(animation_state_data);
```

The function takes the `spine_animation_state_data` created during loading, which defines default mix times and mix times between specific animations for [crossfades](/spine-applying-animations#Mix-times).

> **Note:** Animation states must be explicitly disposed with `spine_animation_state_dispose(animation_state)` when no longer needed.

### Tracks & Queueing
An animation state manages one or more [tracks](/spine-applying-animations#Tracks). Each track is a list of animations played in sequence ([queuing](/spine-applying-animations#Queuing)). Tracks are indexed starting from 0.

Queue an animation on a track:

```c
// Add "walk" animation to track 0, looping, without delay
int track = 0;
bool loop = true;
float delay = 0;
spine_animation_state_add_animation_1(animation_state, track, "walk", loop, delay);
```

Queue multiple animations to create sequences:

```c
// Start walking (looping)
spine_animation_state_add_animation_1(animation_state, 0, "walk", true, 0);

// Jump after 3 seconds
spine_animation_state_add_animation_1(animation_state, 0, "jump", false, 3);

// Idle indefinitely after jumping
spine_animation_state_add_animation_1(animation_state, 0, "idle", true, 0);
```

Clear animations:

```c
// Clear track 0
spine_animation_state_clear_track(animation_state, 0);

// Clear all tracks
spine_animation_state_clear_tracks(animation_state);
```

To clear and set a new animation with crossfading from the previous animation:

```c
// Clear track 0 and crossfade to "shot" (not looped)
spine_animation_state_set_animation_1(animation_state, 0, "shot", false);

// Queue "idle" to play after "shot"
spine_animation_state_add_animation_1(animation_state, 0, "idle", true, 0);
```

To crossfade to the setup pose:

```c
// Clear track 0 and crossfade to setup pose over 0.5 seconds with 1 second delay
spine_animation_state_set_empty_animation(animation_state, 0, 0.5f);

// Or queue a crossfade to setup pose as part of a sequence
spine_animation_state_add_empty_animation(animation_state, 0, 0.5f, 0);
```

For complex games, use multiple tracks to layer animations:

```c
// Walk on track 0
spine_animation_state_set_animation_1(animation_state, 0, "walk", true);

// Simultaneously shoot on track 1
spine_animation_state_set_animation_1(animation_state, 1, "shoot", false);
```

> **Note:** Higher track animations overwrite lower track animations for any properties both animate. Ensure layered animations don't key the same properties.

### Track entries
When setting or queueing an animation, a [track entry](/spine-api-reference#TrackEntry) is returned:

```c
spine_track_entry entry = spine_animation_state_set_animation_1(animation_state, 0, "walk", true);
```

The track entry lets you further customize this specific playback instance of an animation:

```c
// Override the mix duration when transitioning to this animation
spine_track_entry_set_mix_duration(entry, 0.5f);
```

The track entry is valid until the animation it represents is finished. It can be stored when setting the animation and reused as long as the animation is applied. Alternatively, call `spine_animation_state_get_current` to get the track entry for the animation currently playing on a track:

```c
spine_track_entry current = spine_animation_state_get_current(animation_state, 0);
```

### Events
An animation state generates events while playing back queued animations:
* An animation **started**
* An animation was **interrupted**, e.g. by clearing a track
* An animation was **completed**, which may occur multiple times if looped
* An animation has **ended**, either due to interruption or completion
* An animation and its corresponding track entry have been **disposed**
* A [user defined **event**](/spine-events) was fired

You can listen for these events by registering a function with the animation state or individual track entries:

```c
// Define the function that will be called when an event happens
void my_listener(spine_animation_state state, spine_event_type type,
                spine_track_entry entry, spine_event event, void* user_data) {
    // Cast user_data to your context if needed
    MyGameContext* context = (MyGameContext*)user_data;

    switch (type) {
        case SPINE_EVENT_TYPE_START:
            printf("Animation started\n");
            break;
        case SPINE_EVENT_TYPE_INTERRUPT:
            printf("Animation interrupted\n");
            break;
        case SPINE_EVENT_TYPE_END:
            printf("Animation ended\n");
            break;
        case SPINE_EVENT_TYPE_COMPLETE:
            printf("Animation completed (loops fire this each loop)\n");
            break;
        case SPINE_EVENT_TYPE_DISPOSE:
            printf("Track entry disposed\n");
            break;
        case SPINE_EVENT_TYPE_EVENT:
            // User-defined event from animation
            if (event) {
                spine_event_data data = spine_event_get_data(event);
                const char* name = spine_event_data_get_name(data);
                printf("Event: %s\n", name);

                // Access event data
                int int_value = spine_event_data_get_int_value(data);
                float float_value = spine_event_data_get_float_value(data);
                const char* string_value = spine_event_data_get_string_value(data);
            }
            break;
    }
}

// Register listener for all tracks
MyGameContext* context = get_my_game_context();
spine_animation_state_set_listener(animation_state, my_listener, context);

// Or register listener for a specific track entry
spine_track_entry entry = spine_animation_state_set_animation_1(animation_state, 0, "walk", true);
spine_track_entry_set_listener(entry, my_listener, context);

// Clear listeners by setting to NULL
spine_animation_state_set_listener(animation_state, NULL, NULL);
spine_track_entry_set_listener(entry, NULL, NULL);
```

The track entry is valid until the animation it represents is finished. Any registered listener will be called for events until the track entry is disposed.

### Updating and applying
Each frame, advance the animation state by the frame delta time, then apply it to the skeleton:

```c
// In your game loop
void update(float deltaTime) {
    // Advance the animation state by deltaTime seconds
    spine_animation_state_update(animation_state, deltaTime);

    // Apply the animation state to the skeleton's local transforms
    spine_animation_state_apply(animation_state, skeleton);

    // Calculate world transforms for rendering
    spine_skeleton_update(skeleton, deltaTime);
    spine_skeleton_update_world_transform(skeleton, SPINE_PHYSICS_UPDATE);
}
```

`spine_animation_state_update` advances all tracks by the delta time, potentially triggering [events](/spine-events).

`spine_animation_state_apply` poses the skeleton's local transforms based on the current state of all tracks. This includes:
- Applying individual animations
- Crossfading between animations
- Layering animations from multiple tracks

After applying animations, call `spine_skeleton_update_world_transform` to calculate world transforms for rendering.

## Skeleton drawable

For simplified management, spine-c provides `spine_skeleton_drawable` which combines a skeleton, animation state, and animation state data into a single object:

```c
// Create drawable from skeleton data
spine_skeleton_drawable drawable = spine_skeleton_drawable_create(skeleton_data);

// Access the skeleton and animation state
spine_skeleton skeleton = spine_skeleton_drawable_get_skeleton(drawable);
spine_animation_state animation_state = spine_skeleton_drawable_get_animation_state(drawable);
spine_animation_state_data animation_state_data = spine_skeleton_drawable_get_animation_state_data(drawable);

// Update and render in one call
spine_skeleton_drawable_update(drawable, deltaTime);
spine_render_command render_command = spine_skeleton_drawable_render(drawable);

// Get animation state events
spine_animation_state_events events = spine_skeleton_drawable_get_animation_state_events(drawable);
int num_events = spine_animation_state_events_get_num_events(events);
for (int i = 0; i < num_events; i++) {
    spine_event_type type = spine_animation_state_events_get_event_type(events, i);
    spine_track_entry entry = spine_animation_state_events_get_track_entry(events, i);
    if (type == SPINE_EVENT_TYPE_EVENT) {
        spine_event event = spine_animation_state_events_get_event(events, i);
        // Handle event
    }
}
spine_animation_state_events_reset(events);

// Dispose when done (disposes skeleton and animation state, but not skeleton data)
spine_skeleton_drawable_dispose(drawable);
```

The drawable simplifies the update cycle by combining update and apply operations. However, for full control over the animation pipeline, use the skeleton and animation state APIs directly.

# Rendering

spine-c provides a renderer-agnostic interface for drawing skeletons. The rendering process produces `spine_render_command` objects, each representing a batch of textured triangles with blend mode and texture information that can be submitted to any graphics API.

## Render commands

After updating a skeleton's world transforms, generate render commands:

```c
// Using skeleton drawable
spine_render_command command = spine_skeleton_drawable_render(drawable);

// Or using skeleton renderer directly (reusable for multiple skeletons, not thread-safe)
spine_skeleton_renderer renderer = spine_skeleton_renderer_create();
spine_render_command command = spine_skeleton_renderer_render(renderer, skeleton);
```

The renderer handles everything automatically:
* Batches triangles from consecutive region and mesh attachments that share the same texture and blend mode
* Applies clipping for clipping attachments
* Generates optimized draw calls

Each render command represents a batch with:
* Vertex data (positions, UVs, colors)
* Index data for triangles
* Texture to sample from
* Blend mode (normal, additive, multiply, screen)

## Processing render commands

Iterate through commands and submit them to your graphics API:

```c
// Simplified graphics API for illustration
void render_skeleton(spine_render_command first_command) {
    spine_render_command command = first_command;

    while (command) {
        // Get command data
        float* positions = spine_render_command_get_positions(command);
        float* uvs = spine_render_command_get_uvs(command);
        uint32_t* colors = spine_render_command_get_colors(command);
        uint16_t* indices = spine_render_command_get_indices(command);
        int num_vertices = spine_render_command_get_num_vertices(command);
        int num_indices = spine_render_command_get_num_indices(command);

        // Get texture and blend mode
        void* texture = spine_render_command_get_texture(command);
        spine_blend_mode blend_mode = spine_render_command_get_blend_mode(command);

        // Set graphics state
        graphics_bind_texture(texture);
        graphics_set_blend_mode(blend_mode);

        // Submit vertices and indices to GPU
        graphics_set_vertices(positions, uvs, colors, num_vertices);
        graphics_draw_indexed(indices, num_indices);

        // Move to next command
        command = spine_render_command_get_next(command);
    }
}
```

## Blend modes

Configure your graphics API blend function based on the blend mode:

```c
void graphics_set_blend_mode(spine_blend_mode mode, bool premultiplied_alpha) {
    switch (mode) {
        case SPINE_BLEND_MODE_NORMAL:
            // Premultiplied: src=GL_ONE, dst=GL_ONE_MINUS_SRC_ALPHA
            // Straight: src=GL_SRC_ALPHA, dst=GL_ONE_MINUS_SRC_ALPHA
            break;
        case SPINE_BLEND_MODE_ADDITIVE:
            // Premultiplied: src=GL_ONE, dst=GL_ONE
            // Straight: src=GL_SRC_ALPHA, dst=GL_ONE
            break;
        case SPINE_BLEND_MODE_MULTIPLY:
            // Both: src=GL_DST_COLOR, dst=GL_ONE_MINUS_SRC_ALPHA
            break;
        case SPINE_BLEND_MODE_SCREEN:
            // Both: src=GL_ONE, dst=GL_ONE_MINUS_SRC_COLOR
            break;
    }
}
```

## Example implementations

For complete rendering implementations, see:
* [spine-sfml](/spine-sfml): SFML-based renderer
* [spine-sdl](/spine-sdl): SDL-based renderer
* [spine-glfw](/spine-glfw): OpenGL renderer with GLFW

These examples show how to integrate spine-c rendering with different graphics APIs and frameworks.

# Memory management

spine-c memory management is straightforward. Any object created with `spine_*_create` must be disposed with `spine_*_dispose`. Objects returned from loaders use result types that must be disposed with `spine_*_result_dispose`.

Lifetime guidelines:
* Create setup pose data shared by instances (`spine_atlas`, `spine_skeleton_data`, `spine_animation_state_data`) at game or level startup, dispose at game or level end.
* Create instance data (`spine_skeleton`, `spine_animation_state`) when the game object is created, dispose when the game object is destroyed.
* Use `spine_skeleton_drawable` for simplified management: it combines skeleton, animation state, and animation state data.

Track entries (`spine_track_entry`) are valid from when an animation is queued (`spine_animation_state_set_animation_*`, `spine_animation_state_add_animation_*`) until the `SPINE_EVENT_TYPE_DISPOSE` event is sent to your listener. Accessing a track entry after this event causes undefined behavior.

When creating objects, you pass references to other objects. The referencing object never disposes the referenced object:
* Disposing `spine_skeleton` does not dispose `spine_skeleton_data` or `spine_atlas`. The skeleton data is likely shared by other skeleton instances.
* Disposing `spine_skeleton_data` does not dispose `spine_atlas`. The atlas may be shared by multiple skeleton data instances.
* Disposing `spine_skeleton_drawable` disposes its skeleton and animation state, but not the skeleton data.

# Type information and casting

spine-c uses opaque pointers to represent C++ objects. Some types have inheritance relationships that require explicit casting when converting between base and derived types.

## RTTI (Runtime Type Information)

Every polymorphic type in spine-c provides RTTI to identify its concrete type at runtime:

```c
spine_array_constraint constraints = spine_skeleton_get_constraints(skeleton);
spine_constraint* buffer = spine_array_constraint_buffer(constraints);

for (int i = 0; i < spine_array_constraint_size(constraints); i++) {
    spine_constraint constraint = buffer[i];
    spine_rtti rtti = spine_constraint_get_rtti(constraint);
    
    // Check the exact type
    if (spine_rtti_is_exactly(rtti, spine_transform_constraint_rtti())) {
        // This is exactly a TransformConstraint
    }
    
    // Check if it's an instance of a type (includes derived types)
    if (spine_rtti_is_instance_of(rtti, spine_constraint_rtti())) {
        // This is a Constraint or derived from Constraint
    }
    
    // Get the class name for debugging
    const char* class_name = spine_rtti_get_class_name(rtti);
    printf("Constraint type: %s\n", class_name);
}
```

## Type casting

Due to C++ multiple inheritance, pointer values change when casting between types. spine-c provides cast functions that handle these adjustments correctly.

### Upcasting (derived to base)

Upcasting is always safe and used when storing derived types in base-type containers:

```c
spine_transform_constraint tc = /* ... */;

// Cast to base type for storage in array
spine_constraint base = spine_transform_constraint_cast_to_constraint(tc);
spine_array_constraint_add(constraints_array, base);
```

### Downcasting (base to derived)

Downcasting requires knowing the actual type. Use RTTI to verify before casting:

```c
spine_constraint constraint = buffer[i];

// Check type before downcasting
spine_rtti rtti = spine_constraint_get_rtti(constraint);
if (spine_rtti_is_exactly(rtti, spine_transform_constraint_rtti())) {
    // Safe to downcast
    spine_transform_constraint tc = spine_constraint_cast_to_transform_constraint(constraint);
    spine_transform_constraint_data data = spine_transform_constraint_get_data(tc);
    // Use the transform constraint...
}
```

### Common type hierarchies

Key inheritance relationships that require casting:

* **Constraints**: `IkConstraint`, `PathConstraint`, `PhysicsConstraint`, `TransformConstraint` → `Constraint`
* **Constraint data**: `IkConstraintData`, `PathConstraintData`, etc. → `ConstraintData`
* **Attachments**: `RegionAttachment`, `MeshAttachment`, `BoundingBoxAttachment`, etc. → `Attachment`
* **Timelines**: Many timeline types → `CurveTimeline` → `Timeline`

Example with attachments:

```c
spine_slot slot = spine_skeleton_find_slot(skeleton, "weapon");
spine_attachment attachment = spine_slot_get_attachment(slot);

if (attachment) {
    spine_rtti rtti = spine_attachment_get_rtti(attachment);
    
    if (spine_rtti_is_exactly(rtti, spine_region_attachment_rtti())) {
        spine_region_attachment region = spine_attachment_cast_to_region_attachment(attachment);
        // Work with region attachment...
    } else if (spine_rtti_is_exactly(rtti, spine_mesh_attachment_rtti())) {
        spine_mesh_attachment mesh = spine_attachment_cast_to_mesh_attachment(attachment);
        // Work with mesh attachment...
    }
}
```

> **Note:** Never use C-style casts between spine-c types. Always use the provided cast functions to ensure correct pointer adjustment.

---
## File: Runtimes, spine-canvaskit/spine-canvaskit.md
## Title: spine-canvaskit Runtime Documentation
## URL: http://esotericsoftware.com/spine-canvaskit
---

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

---
## File: Runtimes, spine-cpp/spine-cpp.md
## Title: spine-cpp Runtime Documentation
## URL: http://esotericsoftware.com/spine-cpp
---

# spine-cpp Runtime Documentation

> **Licensing**
>
> Please see the [Spine Runtimes License](/spine-runtimes-license) before integrating the Spine Runtimes into your applications.

# Introduction
spine-cpp is a generic C++ runtime for integrating Spine animations in game engines and frameworks that can interface with C++.

spine-cpp provides functionality to:
* Load and manipulate [Spine skeletons](/spine-loading-skeleton-data) and [texture atlases](/spine-texture-packer)
* Apply and mix [animations](/spine-applying-animations) with crossfading
* Manage [skins](/spine-runtime-skins) for visual variations
* Manipulate and compute data required for rendering and physics based on the current [skeleton pose, slots & attachments states](/spine-runtime-skeletons)

The runtime is engine-agnostic. You provide texture loading through a TextureLoader implementation and feed render commands into your engine's rendering system.

spine-cpp is written in C++11. It is exposed as a plain C API via [spine-c](/spine-c) as well.

Example integrations:
* [spine-ios](/git/spine-runtimes/tree/spine-ios) - iOS integration
* [spine-flutter](/git/spine-runtimes/tree/spine-flutter) - Flutter integration
* [spine-sdl](/git/spine-runtimes/tree/spine-sdl) - SDL integration
* [spine-glfw](/git/spine-runtimes/tree/spine-glfw) - GLFW integration
* [spine-ue](/git/spine-runtimes/tree/spine-ue) - Unreal Engine integration
* [spine-godot](/git/spine-runtimes/tree/spine-godot) - Godot integration

> **Note:** This guide assumes familiarity with [Spine runtime architecture](/spine-runtime-architecture) and terminology. See the [API reference](/spine-api-reference) for detailed function documentation.

# Integrating spine-cpp

## CMake Integration (Recommended)

The easiest way to integrate spine-cpp into your project is via CMake FetchContent:

```cmake
include(FetchContent)
FetchContent_Declare(
    spine-cpp
    GIT_REPOSITORY https://github.com/esotericsoftware/spine-runtimes.git
    GIT_TAG 4.3
    SOURCE_SUBDIR spine-cpp
)
FetchContent_MakeAvailable(spine-cpp)

# Link against spine-cpp
target_link_libraries(your_target spine-cpp)
```

This will automatically fetch and build spine-cpp.

Include the spine-cpp headers in your code:
```cpp
#include <spine/spine.h>
using namespace spine;
```

## Manual Integration

If you prefer manual integration:

1. Download the Spine Runtimes source using git (`git clone https://github.com/esotericsoftware/spine-runtimes`) or download it as a zip
2. Add the required source files to your project:
   - Add sources from `spine-cpp/src`
3. Add the include directory: `spine-cpp/include`

Include the spine-cpp headers in your code:
```cpp
#include <spine/spine.h>
using namespace spine;
```

# Exporting Spine assets for spine-cpp
![](/img/spine-runtimes-guide/spine-ue4/export.png)

Follow the Spine User Guide to:
1. [Export skeleton & animation data](/spine-export) to JSON or binary format
2. [Export texture atlases](/spine-texture-packer) containing your skeleton's images

An export yields these files:

![](/img/spine-runtimes-guide/spine-ue4/exported-files.png)

1. `skeleton-name.json` or `skeleton-name.skel`: skeleton and animation data
2. `skeleton-name.atlas`: texture atlas information
3. One or more `.png` files: atlas pages with packed images

> **Note:** You can pack images from multiple skeletons into a single texture atlas for efficiency. See the [texture packing guide](/spine-texture-packer).

# Loading Spine assets
spine-cpp provides APIs to load texture atlases, Spine skeleton data (bones, slots, attachments, skins, animations) and define mix times between animations through [animation state data](/spine-applying-animations#Mix-times). These three types of data, also known as setup pose data, are generally loaded once and then shared by every game object. The sharing mechanism is achieved by giving each game object its own skeleton and [animation state](/spine-applying-animations#AnimationState-API), also known as instance data.

> **Note:** For a more detailed description of the overall loading architecture consult the generic [Spine Runtime Documentation](/spine-loading-skeleton-data).

## Loading texture atlases
Texture atlas data is stored in a custom [atlas format](/spine-atlas-format) that describes the location of individual images within atlas pages. The atlas pages themselves are stored as plain `.png` files next to the atlas.

spine-cpp uses a `TextureLoader` interface to load textures. You need to implement this interface for your engine:

### Implementing a TextureLoader

```cpp
class MyTextureLoader : public TextureLoader {
public:
    virtual void load(AtlasPage& page, const String& path) {
        // Load texture from path
        void* texture = engine_load_texture(path.buffer());

        // Store the texture in the page
        page.texture = texture;

        // Set texture dimensions (required)
        page.width = texture_width;
        page.height = texture_height;
    }

    virtual void unload(void* texture) {
        // Unload the texture
        engine_unload_texture(texture);
    }
};
```

### Loading an atlas

With a TextureLoader implementation, you can load an atlas:

```cpp
// Create your texture loader
MyTextureLoader* textureLoader = new MyTextureLoader();

// Load atlas from file, the textureLoader is retained by the atlas until the atlas is disposed
// Atlas will use the DefaultExtension to load the file from the given path. This assumes
// stdio.h is available on the system.
Atlas* atlas = new Atlas("path/to/skeleton.atlas", textureLoader);

// Or load atlas from memory
const char* atlasData = read_file_to_string("path/to/skeleton.atlas");
Atlas* atlas = new Atlas(atlasData, strlen(atlasData), "path/to/atlas/dir", textureLoader);
```

The Atlas constructor automatically:
1. Parses the atlas data
2. Calls your TextureLoader for each atlas page
3. Sets up all regions with their texture references

## Loading skeleton data
Skeleton data (bones, slots, attachments, skins, animations) can be exported to human readable [JSON](/spine-json-format) or a custom [binary format](/spine-binary-format). spine-cpp stores skeleton data in `SkeletonData` objects.

### Loading from JSON

```cpp
// Create a JSON loader using the atlas
SkeletonJson json(*atlas);

// Optionally set the scale
json.setScale(0.5f);  // Scale skeleton to 50%

// Load skeleton data from file
SkeletonData* skeletonData = json.readSkeletonDataFile("path/to/skeleton.json");

// Or load from memory
const char* jsonString = read_file_to_string("path/to/skeleton.json");
SkeletonData* skeletonData = json.readSkeletonData(jsonString);

// Check for errors
if (!skeletonData) {
    printf("Error loading skeleton: %s\n", json.getError().buffer());
    exit(1);
}
```

### Loading from binary

```cpp
// Create a binary loader using the atlas
SkeletonBinary binary(*atlas);

// Optionally set the scale
binary.setScale(0.5f);  // Scale skeleton to 50%

// Load skeleton data from file
SkeletonData* skeletonData = binary.readSkeletonDataFile("path/to/skeleton.skel");

// Or load from memory
unsigned char* binaryData = read_file_to_bytes("path/to/skeleton.skel", &dataLength);
SkeletonData* skeletonData = binary.readSkeletonData(binaryData, dataLength);

// Check for errors
if (!skeletonData) {
    printf("Error loading skeleton: %s\n", binary.getError().buffer());
    exit(1);
}
```

> **Note:** Binary format is preferred for production as it's smaller and faster to load than JSON.

## Preparing animation state data
Spine supports smooth transitions (crossfades) when switching from one animation to another. The crossfades are achieved by mixing one animation with another for a specific mix time. spine-cpp provides the `AnimationStateData` class to define these mix times:

```cpp
// Create the animation state data
AnimationStateData* animStateData = new AnimationStateData(skeletonData);

// Set the default mix time between any pair of animations in seconds
animStateData->setDefaultMix(0.1f);

// Set the mix time between specific animations, overwriting the default
animStateData->setMix("jump", "walk", 0.2f);
```

The mix times defined in `AnimationStateData` can also be overwritten explicitly when applying animations (see below).

# Skeletons
Setup pose data (skeleton data, texture atlases) is shared between game objects. Each game object gets its own `Skeleton` instance that references the shared `SkeletonData` and `Atlas`.

Skeletons can be freely modified (procedural bone manipulation, animations, attachments, skins) while the underlying data stays intact. This allows efficient sharing across any number of game objects.

## Creating skeletons
```cpp
Skeleton* skeleton = new Skeleton(skeletonData);
```

Each game object needs its own skeleton instance. The bulk data remains shared to reduce memory consumption and texture switches.

> **Note:** Skeletons must be explicitly deleted with `delete skeleton` when no longer needed.

## Bones
A skeleton is a hierarchy of bones, with slots attached to bones, and attachments attached to slots.

### Finding bones
All bones in a skeleton have a unique name:

```cpp
// Returns NULL if no bone of that name exists
Bone* bone = skeleton->findBone("mybone");
```

### Local transform
A bone is affected by its parent bone, all the way back to the root bone. How a bone inherits from its parent is controlled by its [transform inheritance](/spine-bones#Transform-inheritance) setting. Each bone has a local transform relative to its parent consisting of:

* `x` and `y` coordinates relative to the parent
* `rotation` in degrees
* `scaleX` and `scaleY`
* `shearX` and `shearY` in degrees

The local transform is accessed through the bone's pose (`BoneLocal`):

```cpp
Bone* bone = skeleton->findBone("mybone");
BoneLocal& pose = bone->getPose();

// Get local transform properties
float x = pose.getX();
float y = pose.getY();
float rotation = pose.getRotation();
float scaleX = pose.getScaleX();
float scaleY = pose.getScaleY();
float shearX = pose.getShearX();
float shearY = pose.getShearY();

// Modify local transform
pose.setPosition(100, 50);
pose.setRotation(45);
pose.setScale(2, 2);
```

The local transform can be manipulated procedurally or via animations. Both can be done simultaneously, with the combined result stored in the pose.

### World transform
After setting up local transforms (procedurally or via animations), you need the world transform of each bone for rendering and physics.

The calculation starts at the root bone and recursively calculates all child bone world transforms. It also applies [IK](/spine-ik-constraints), [transform](/spine-transform-constraints), [path](/spine-path-constraints) and [slider](/spine-sliders) constraints.

To calculate world transforms:

```cpp
skeleton->update(deltaTime);
skeleton->updateWorldTransform(Physics_Update);
```

`deltaTime` is the time between frames in seconds. The second parameter specifies physics behavior, with `Physics_Update` being a good default.

The world transform is accessed through the bone's applied pose (`BonePose`):

```cpp
BonePose& applied = bone->getAppliedPose();

// Get world transform matrix components
float a = applied.getA();  // 2x2 matrix encoding
float b = applied.getB();  // rotation, scale
float c = applied.getC();  // and shear
float d = applied.getD();

// Get world position
float worldX = applied.getWorldX();
float worldY = applied.getWorldY();
```

Note that `worldX` and `worldY` are offset by the skeleton's x and y position.

World transforms should never be modified directly. They're always derived from local transforms by calling `skeleton->updateWorldTransform()`.

### Converting between coordinate systems
spine-cpp provides functions to convert between coordinate systems. These assume world transforms have been calculated:

```cpp
Bone* bone = skeleton->findBone("mybone");
BonePose& applied = bone->getAppliedPose();

// Get world rotation and scale
float rotationX = applied.getWorldRotationX();
float rotationY = applied.getWorldRotationY();
float scaleX = applied.getWorldScaleX();
float scaleY = applied.getWorldScaleY();

// Transform between world and local space
float localX, localY, worldX, worldY;
applied.worldToLocal(worldX, worldY, localX, localY);
applied.localToWorld(localX, localY, worldX, worldY);

// Transform rotations
float localRotation = applied.worldToLocalRotation(worldRotation);
float worldRotation = applied.localToWorldRotation(localRotation);
```

> **Note:** Modifications to a bone's local transform (and its children) are reflected in world transforms after calling `skeleton->updateWorldTransform()`.

## Positioning
By default, a skeleton is at the origin of the world coordinate system. To position a skeleton in your game world:

```cpp
// Make a skeleton follow a game object
skeleton->setX(myGameObject->worldX);
skeleton->setY(myGameObject->worldY);

// Or set both at once
skeleton->setPosition(myGameObject->worldX, myGameObject->worldY);
```

> **Note:** Changes to the skeleton's position are reflected in bone world transforms after calling `skeleton->updateWorldTransform()`.

## Flipping
A skeleton can be flipped to reuse animations for the opposite direction:

```cpp
skeleton->setScaleX(-1);  // Flip horizontally
skeleton->setScaleY(-1);  // Flip vertically

// Or both at once
skeleton->setScale(-1, 1);  // Flip horizontally
skeleton->setScale(1, -1);  // Flip vertically
```

For coordinate systems with y-axis pointing down (Spine assumes y-up by default), set this globally:

```cpp
Bone::setYDown(true);  // Affects all skeletons
```

> **Note:** Scale changes are reflected in bone world transforms after calling `skeleton->updateWorldTransform()`.

## Setting skins
Artists can create multiple [skins](/spine-runtime-skins) to provide visual variations of the same skeleton (e.g., different characters or equipment). A [skin at runtime](/spine-runtime-skins) maps which [attachment](/spine-basic-concepts#Attachments) goes into which [slot](/spine-basic-concepts#Slots).

Every skeleton has at least one skin defining the setup pose. Additional skins have names:

```cpp
// Set a skin by name
skeleton->setSkin("my_skin_name");

// Set the default setup pose skin
skeleton->setSkin(nullptr);
```

### Creating custom skins
You can create custom skins at runtime by combining existing skins (mix and match):

```cpp
// Create a new custom skin
Skin* customSkin = new Skin("custom-character");

// Add multiple skins to create a mix-and-match combination
customSkin->addSkin(skeletonData->findSkin("skin-base"));
customSkin->addSkin(skeletonData->findSkin("armor/heavy"));
customSkin->addSkin(skeletonData->findSkin("weapon/sword"));
customSkin->addSkin(skeletonData->findSkin("hair/long"));

// Apply the custom skin to the skeleton
skeleton->setSkin(customSkin);
```

> **Note:** Custom skins must be manually deleted with `delete customSkin` when no longer needed.

> **Note:** Setting a skin considers previously active attachments. See [skin changes](/spine-runtime-skins#Skin-changes) for details.

## Setting attachments
You can set individual attachments on slots directly, useful for switching equipment:

```cpp
// Set the "sword" attachment on the "hand" slot
skeleton->setAttachment("hand", "sword");

// Clear the attachment on the "hand" slot
skeleton->setAttachment("hand", nullptr);
```

The attachment is searched first in the active skin, then in the default skin.

## Tinting
You can tint all attachments in a skeleton:

```cpp
// Tint all attachments red with half transparency
skeleton->getColor().set(1.0f, 0.0f, 0.0f, 0.5f);

// Or using individual components
skeleton->getColor().r = 1.0f;
skeleton->getColor().g = 0.0f;
skeleton->getColor().b = 0.0f;
skeleton->getColor().a = 0.5f;
```

> **Note:** Colors in spine-cpp are RGBA with values in the range [0-1].

Each slot also has its own color that can be manipulated:

```cpp
Slot* slot = skeleton->findSlot("mySlot");
SlotPose& pose = slot->getPose();
Color& slotColor = pose.getColor();
// The slot color is multiplied with the skeleton color when rendering
```

Slot colors can be animated. Manual changes will be overwritten if an animation keys that slot's color.

# Applying animations
The Spine editor lets artists create multiple, uniquely named [animations](/spine-animating). An animation is a set of [timelines](/spine-api-reference#Timeline). Each timeline specifies values over time for properties like bone transforms, attachment visibility, slot colors, etc.

## Timeline API
spine-cpp provides a [timeline API](/spine-applying-animations#Timeline-API) for direct timeline manipulation. This low-level functionality allows full customization of how animations are applied.

## Animation state API
For most use cases, use the [animation state API](/spine-applying-animations#AnimationState-API) instead of the timeline API. It handles:
- Applying animations over time
- Queueing animations
- Mixing between animations (crossfading)
- Applying multiple animations simultaneously (layering)

The animation state API uses the timeline API internally.

spine-cpp represents animation state via `AnimationState`. Each game object needs its own skeleton and animation state instance. These share the underlying `SkeletonData` and `AnimationStateData` with all other instances to reduce memory consumption.

### Creating animation states
```cpp
AnimationState* animationState = new AnimationState(animationStateData);
```

The constructor takes the `AnimationStateData` created during loading, which defines default mix times and mix times between specific animations for [crossfades](/spine-applying-animations#Mix-times).

> **Note:** Animation states must be explicitly deleted with `delete animationState` when no longer needed.

### Tracks & Queueing
An animation state manages one or more [tracks](/spine-applying-animations#Tracks). Each track is a list of animations played in sequence ([queuing](/spine-applying-animations#Queuing)). Tracks are indexed starting from 0.

Queue an animation on a track:

```cpp
// Add "walk" animation to track 0, looping, without delay
int track = 0;
bool loop = true;
float delay = 0;
animationState->addAnimation(track, "walk", loop, delay);
```

Queue multiple animations to create sequences:

```cpp
// Start walking (looping)
animationState->addAnimation(0, "walk", true, 0);

// Jump after 3 seconds
animationState->addAnimation(0, "jump", false, 3);

// Idle indefinitely after jumping
animationState->addAnimation(0, "idle", true, 0);
```

Clear animations:

```cpp
// Clear track 0
animationState->clearTrack(0);

// Clear all tracks
animationState->clearTracks();
```

To clear and set a new animation with crossfading from the previous animation:

```cpp
// Clear track 0 and crossfade to "shot" (not looped)
animationState->setAnimation(0, "shot", false);

// Queue "idle" to play after "shot"
animationState->addAnimation(0, "idle", true, 0);
```

To crossfade to the setup pose:

```cpp
// Clear track 0 and crossfade to setup pose over 0.5 seconds
animationState->setEmptyAnimation(0, 0.5f);

// Or queue a crossfade to setup pose as part of a sequence
animationState->addEmptyAnimation(0, 0.5f, 0);
```

For complex games, use multiple tracks to layer animations:

```cpp
// Walk on track 0
animationState->setAnimation(0, "walk", true);

// Simultaneously shoot on track 1
animationState->setAnimation(1, "shoot", false);
```

> **Note:** Higher track animations overwrite lower track animations for any properties both animate. Ensure layered animations don't key the same properties.

### Track entries
When setting or queueing an animation, a [track entry](/spine-api-reference#TrackEntry) is returned:

```cpp
TrackEntry& entry = animationState->setAnimation(0, "walk", true);
```

The track entry lets you further customize this specific playback instance of an animation:

```cpp
// Override the mix duration when transitioning to this animation
entry.setMixDuration(0.5f);
```

The track entry is valid until the animation it represents is finished. It can be stored when setting the animation and reused as long as the animation is applied. Alternatively, call `getCurrent` to get the track entry for the animation currently playing on a track:

```cpp
TrackEntry* current = animationState->getCurrent(0);
```

### Events
An animation state generates events while playing back queued animations:
* An animation **started**
* An animation was **interrupted**, e.g. by clearing a track
* An animation was **completed**, which may occur multiple times if looped
* An animation has **ended**, either due to interruption or completion
* An animation and its corresponding track entry have been **disposed**
* A [user defined **event**](/spine-events) was fired

You can listen for these events by registering a listener with the animation state or individual track entries. Using C++11 lambdas:

```cpp
// Lambda with captured context
MyGameContext* context = getMyGameContext();

auto listener = [context](AnimationState* state, EventType type, TrackEntry* entry, Event* event) {
    switch (type) {
        case EventType_Start:
            printf("Animation %s started\n", entry->getAnimation()->getName().buffer());
            break;
        case EventType_Interrupt:
            printf("Animation interrupted\n");
            break;
        case EventType_End:
            printf("Animation ended\n");
            break;
        case EventType_Complete:
            printf("Animation completed (loops fire this each loop)\n");
            context->onAnimationComplete();  // Access captured context
            break;
        case EventType_Dispose:
            printf("Track entry disposed\n");
            break;
        case EventType_Event:
            // User-defined event from animation
            if (event) {
                const String& name = event->getData().getName();
                printf("Event: %s\n", name.buffer());

                // Access event data
                int intValue = event->getIntValue();
                float floatValue = event->getFloatValue();
                const String& stringValue = event->getStringValue();

                // Handle specific events
                if (name == "footstep") {
                    context->playFootstepSound(intValue);  // Use int as foot ID
                }
            }
            break;
    }
};

// Register listener for all tracks
animationState->setListener(listener);

// Or register listener for a specific track entry
TrackEntry& entry = animationState->setAnimation(0, "walk", true);
entry.setListener(listener);

// Alternative: inline lambda for simple cases
animationState->setListener([](AnimationState* state, EventType type, TrackEntry* entry, Event* event) {
    if (type == EventType_Complete) {
        printf("Animation loop completed: %s\n", entry->getAnimation()->getName().buffer());
    }
});

// Clear listeners by setting to nullptr
animationState->setListener(nullptr);
entry.setListener(nullptr);
```

For more complex event handling, you can use `AnimationStateListenerObject`:

```cpp
class MyAnimationListener : public AnimationStateListenerObject {
    MyGameContext* context;

public:
    MyAnimationListener(MyGameContext* ctx) : context(ctx) {}

    virtual void callback(AnimationState* state, EventType type, TrackEntry* entry, Event* event) override {
        switch (type) {
            case EventType_Start:
                context->onAnimationStart(entry->getAnimation()->getName());
                break;
            case EventType_Event:
                if (event && event->getData().getName() == "attack") {
                    context->dealDamage(event->getFloatValue());
                }
                break;
            // Handle other events...
        }
    }
};

// Use the listener object
MyAnimationListener* listener = new MyAnimationListener(context);
animationState->setListener(listener);

// Remember to delete when done
delete listener;
```

The track entry is valid until the animation it represents is finished. Any registered listener will be called for events until the track entry is disposed.

### Updating and applying
Each frame, advance the animation state by the frame delta time, then apply it to the skeleton:

```cpp
// In your game loop
void update(float deltaTime) {
    // Advance the animation state by deltaTime seconds
    animationState->update(deltaTime);

    // Apply the animation state to the skeleton's local transforms
    animationState->apply(*skeleton);

    // Calculate world transforms for rendering
    skeleton->update(deltaTime);
    skeleton->updateWorldTransform(Physics_Update);
}
```

`animationState->update()` advances all tracks by the delta time, potentially triggering [events](/spine-events).

`animationState->apply()` poses the skeleton's local transforms based on the current state of all tracks. This includes:
- Applying individual animations
- Crossfading between animations
- Layering animations from multiple tracks

After applying animations, call `skeleton->updateWorldTransform()` to calculate world transforms for rendering.

# Rendering

spine-cpp provides a renderer-agnostic interface for drawing skeletons. The rendering process produces `RenderCommand` objects, each representing a batch of textured triangles with blend mode and texture information that can be submitted to any graphics API.

## Render commands

After updating a skeleton's world transforms, generate render commands:

```cpp
// Using skeleton renderer (reusable for multiple skeletons, not thread-safe)
SkeletonRenderer renderer;
RenderCommand* command = renderer.render(*skeleton);
```

The renderer handles everything automatically:
* Batches triangles from consecutive region and mesh attachments that share the same texture and blend mode
* Applies clipping for clipping attachments
* Generates optimized draw calls

Each render command represents a batch with:
* Vertex data (positions, UVs, colors)
* Index data for triangles
* Texture to sample from
* Blend mode (normal, additive, multiply, screen)

## Processing render commands

Iterate through commands and submit them to your graphics API:

```cpp
// Simplified graphics API for illustration
void render_skeleton(RenderCommand* firstCommand) {
    RenderCommand* command = firstCommand;

    while (command) {
        // Get command data
        float* positions = command->positions;
        float* uvs = command->uvs;
        uint32_t* colors = command->colors;
        uint16_t* indices = command->indices;
        int numVertices = command->numVertices;
        int numIndices = command->numIndices;

        // Get texture and blend mode
        void* texture = command->texture;
        BlendMode blendMode = command->blendMode;

        // Set graphics state
        graphics_bind_texture(texture);
        graphics_set_blend_mode(blendMode);

        // Submit vertices and indices to GPU
        graphics_set_vertices(positions, uvs, colors, numVertices);
        graphics_draw_indexed(indices, numIndices);

        // Move to next command
        command = command->next;
    }
}
```

## Blend modes

Configure your graphics API blend function based on the blend mode:

```cpp
void graphics_set_blend_mode(BlendMode mode, bool premultipliedAlpha) {
    switch (mode) {
        case BlendMode_Normal:
            // Premultiplied: src=GL_ONE, dst=GL_ONE_MINUS_SRC_ALPHA
            // Straight: src=GL_SRC_ALPHA, dst=GL_ONE_MINUS_SRC_ALPHA
            break;
        case BlendMode_Additive:
            // Premultiplied: src=GL_ONE, dst=GL_ONE
            // Straight: src=GL_SRC_ALPHA, dst=GL_ONE
            break;
        case BlendMode_Multiply:
            // Both: src=GL_DST_COLOR, dst=GL_ONE_MINUS_SRC_ALPHA
            break;
        case BlendMode_Screen:
            // Both: src=GL_ONE, dst=GL_ONE_MINUS_SRC_COLOR
            break;
    }
}
```

## Example implementations

For complete rendering implementations, see:
* [spine-sfml](/spine-sfml): SFML-based renderer
* [spine-sdl](/spine-sdl): SDL-based renderer
* [spine-glfw](/spine-glfw): OpenGL renderer with GLFW
* [spine-ue](/spine-ue): Unreal Engine renderer
* [spine-godot](/spine-godot): Godot renderer

These examples show how to integrate spine-cpp rendering with different graphics APIs and frameworks.

# Memory management

spine-cpp uses standard C++ memory management. Objects created with `new` must be deleted with `delete`.

Lifetime guidelines:
* Create setup pose data shared by instances (`Atlas`, `SkeletonData`, `AnimationStateData`) at game or level startup, delete at game or level end.
* Create instance data (`Skeleton`, `AnimationState`) when the game object is created, delete when the game object is destroyed.

Track entries (`TrackEntry`) are managed by the `AnimationState` and should not be deleted manually. They're valid from when an animation is queued until the dispose event is triggered.

When creating objects, you pass references to other objects. The referencing object never deletes the referenced object:
* Deleting `Skeleton` does not delete `SkeletonData` or `Atlas`. The skeleton data is likely shared by other skeleton instances.
* Deleting `SkeletonData` does not delete `Atlas`. The atlas may be shared by multiple skeleton data instances.

## Custom memory allocation and file I/O

spine-cpp uses an Extension system for memory allocation and file I/O. You can customize this by creating your own Extension class:

```cpp
class MyExtension : public spine::SpineExtension {
public:
    virtual void* _alloc(size_t size, const char* file, int line) override {
        // Your custom allocator
        return my_custom_malloc(size);
    }
    
    virtual void* _calloc(size_t size, const char* file, int line) override {
        void* ptr = my_custom_malloc(size);
        if (ptr) memset(ptr, 0, size);
        return ptr;
    }
    
    virtual void* _realloc(void* ptr, size_t size, const char* file, int line) override {
        return my_custom_realloc(ptr, size);
    }
    
    virtual void _free(void* mem, const char* file, int line) override {
        my_custom_free(mem);
    }
    
    virtual char* _readFile(const String& path, int* length) override {
        // Your custom file reader
        return my_custom_file_reader(path.buffer(), length);
    }
};

// Set your extension before using spine-cpp
MyExtension* extension = new MyExtension();
spine::SpineExtension::setInstance(extension);
```

## Memory leak detection

spine-cpp provides a `DebugExtension` that wraps another extension to track allocations and detect leaks:

```cpp
// Create your base extension (or use the default)
spine::DefaultSpineExtension* baseExtension = new spine::DefaultSpineExtension();

// Wrap it with DebugExtension
spine::DebugExtension* debugExtension = new spine::DebugExtension(baseExtension);
spine::SpineExtension::setInstance(debugExtension);

// ... use spine-cpp normally ...

// Check for leaks
debugExtension->reportLeaks();  // Prints all unfreed allocations
size_t usedMemory = debugExtension->getUsedMemory();  // Get current memory usage

// Clear tracking (useful for resetting between tests)
debugExtension->clearAllocations();
```

The DebugExtension tracks:
* All allocations with file names and line numbers
* Memory usage statistics
* Double-free detection
* Untracked memory warnings

To track allocations of spine objects in your own code with file and line information, use the placement new operator:

```cpp
// Instead of:
Skeleton* skeleton = new Skeleton(skeletonData);

// Use:
Skeleton* skeleton = new (__FILE__, __LINE__) Skeleton(skeletonData);

// This allows DebugExtension to report the exact location of allocations
```

This is invaluable for finding memory leaks during development.

---
## File: Runtimes, spine-flutter/spine-flutter.md
## Title: spine-flutter Runtime Documentation
## URL: http://esotericsoftware.com/spine-flutter
---

# spine-flutter Runtime Documentation

> **Licensing**
>
> Please see the [Spine Runtimes License](/spine-runtimes-license) before integrating the Spine Runtimes into your applications.

# Getting Started
The spine-flutter runtime is implemented as a [Flutter FFI plugin](https://docs.flutter.dev/development/packages-and-plugins/developing-packages#plugin-ffi) on top of [spine-cpp](/spine-cpp). It supports all platforms supported by Flutter (desktop, Android, iOS, web), and supports all Spine features except tint black and screen blend mode.


## Installation
spine-flutter is supported from Flutter 3.16.0 onwards. To use spine-flutter in your Flutter project, add the following dependency to your project's `pubspec.yaml` file:

```yaml
dependencies:
  ...
  spine_flutter: ^4.3.0
```

See [spine_flutter on pub.dev](https://pub.dev/packages/spine_flutter) for the latest version.

Ensure that the `major.minor` version of spine-flutter matches the `major.minor` Spine Editor version you are exporting from. See [Spine Versioning](/spine-versioning#Synchronizing-versions) for more information.

In your `main()` function, add these two lines in the beginning to initialize the spine-flutter runtime:

```dart
void main() async {
    await initSpineFlutter(enableMemoryDebugging: false);
    ...
}
```

> **Note:** the `main()` method must be `async`.

## Samples
The spine-flutter runtime includes several samples that showcase its feature set.

You can run the example project following these steps:

1. Install the [Flutter SDK](https://docs.flutter.dev/get-started/install), then run `flutter doctor` which will instruct you what other dependencies to install.
2. Clone the spine-runtimes repository: `git clone https://github.com/esotericsoftware/spine-runtimes`
3. Run the `setup.sh` script in the `spine-flutter/` folder. On Windows, you can use [Git Bash](https://gitforwindows.org/) included in Git for Window to run the `setup.sh` Bash script.

You can then open `spine-flutter` in an IDE or editor of your choice that supports Flutter, like [IntelliJ IDEA/Android Studio](https://docs.flutter.dev/get-started/editor?tab=androidstudio) or [Visual Studio Code](https://docs.flutter.dev/get-started/editor?tab=vscode) to inspect and run the example.

Alternatively, you can run the example from the [command line](https://docs.flutter.dev/get-started/test-drive?tab=terminal).

The example project contains the following examples:
* [`example/lib/simple_animation.dart`](/git/spine-runtimes/spine-flutter/example/lib/simple_animation.dart): demonstrates the basic use of `SpineWidget` and `SpineWidgetController` to load an exported Spine skeleton, display it in the widget, and playback a specific animation.
* [`example/lib/pause_play_animation.dart`](/git/spine-runtimes/spine-flutter/example/lib/pause_play_animation.dart): demonstrates how to pause and resume an animation.
* [`example/lib/animation_state_events.dart`](/git/spine-runtimes/spine-flutter/example/lib/animation_state_events.dart): demonstrates how set a slot's color, how to queue multiple animations, and how to to listen for animation state events.
* [`example/lib/debug_rendering.dart`](/git/spine-runtimes/spine-flutter/example/lib/debug_rendering.dart): shows how to perform custom drawing on top of the rendered skeleton via the `SpineWidgetController` `onAfterPaint` callback.
* [`example/lib/dress_up.dart`](/git/spine-runtimes/spine-flutter/example/lib/dress_up.dart): demonstrates Spine's skins feature as well as rendering a skeleton to a thumbnail for use in a character creation UI.
* [`example/lib/ik_following.dart`](/git/spine-runtimes/spine-flutter/example/lib/ik_following.dart): demonstrates how to let the user drag one of the skeleton's bones via mouse or touch input.
* [`example/lib/physics.dart`](/git/spine-runtimes/spine-flutter/example/lib/physics.dart): demonstrates physics constraints in action.
* [`example/lib/flame_example.dart`](/git/spine-runtimes/spine-flutter/example/lib/flame_example.dart): demonstrates how to write a simple [Flame](https://flame-engine.org/) component to use spine-flutter with the Flame game engine.

## Updating the spine-flutter Runtime
Before updating your project's spine-flutter runtime, please consult our [guide on Spine editor and runtime version management](/spine-runtime-architecture#Versioning).

To update the spine-flutter runtime, simply modify the version string of the `spine_flutter` package in your `pubspec.yaml`.

> **Note:** If you change the `major.minor` version of the `spine_flutter` package, you have to re-export your Spine skeletons with the same Spine Editor `major.minor` version!

# Using spine-flutter
The spine-flutter runtime is an idiomatic [Dart FFI wrapper](https://dart.dev/guides/libraries/c-interop) around the generic [spine-cpp](/spine-cpp) which supports loading, playback and manipulation of animations created with Spine. The spine-flutter runtime exposes almost all of the spine-cpp API as idiomatic Dart and provides Flutter and [Flame](https://flame-engine.org/) specific classes to easily display and interact with Spine skeletons.

The spine-flutter runtime supports all Spine features except tint black and screen blend mode.

## Asset Management
### Exporting for spine-flutter
![](/img/spine-runtimes-guide/spine-ue4/export.png)
Please follow the instructions in the Spine User Guide on how to

1. [Export skeleton & animation data](/spine-export)
2. [Export texture atlases containing the images of your skeleton](/spine-texture-packer)

An export of the skeleton data and texture atlas of your skeleton will yield the following files:

![](/img/spine-runtimes-guide/spine-ue4/exported-files.png)

1. `skeleton-name.json` or `skeleton-name.skel`, containing your skeleton and animation data.
2. `skeleton-name.atlas`, containing information about the texture atlas.
3. One or more `.png` files, each representing on page of your texture atlas containing the packed images your skeleton uses.

> **Note**: You should prefer binary skeleton exports over JSON exports, as they are smaller in size and faster to load.

The files can be loaded via spine-flutter classes like `AtlasFlutter`, `SkeletonDataFlutter`, `SkeletonDrawableFlutter`, `SpineWidget`.

> **Note**: The spine-flutter runtime currently does not support atlases exported using pre-multiplied alpha due to technical limitations in Flutter. Flutter's rendering engine ensures that common non-premultiplied alpha artifacts are avoided.

### Updating Spine Assets
During development, you may frequently update your Spine skeleton data and texture atlas files. You can simply overwrite these source files (`.json`, `.skel`, `.atlas`, `.png`) by re-exporting from the Spine Editor and replacing the existing files in your Flutter project.

Ensure that the `major.minor` version of spine-flutter matches the `major.minor` Spine Editor version you are exporting from. See [Spine Versioning](/spine-versioning#Synchronizing-versions) for more information.

## Core classes
The spine-flutter API is built on top of the generic [spine-cpp](/spine-cpp) runtime, which provides platform independent  core classes and algorithms to load, query, modify, and animate Spine skeletons. The core classes are wrapped via Dart FFI and exposed as idiomatic Dart classes.

Here, we will briefly discuss the most important core classes that you will  encounter in your day-to-day use of spine-flutter. Please consult the [Spine Runtimes Guide](/spine-runtimes-guide) for a detailed overview of the Spine Runtimes architecture, core classes, and API usage.

### spine-dart classes

The [`Atlas`](/git/spine-runtimes/spine-flutter/lib/generated/atlas.dart) class stores the data loaded from an `.atlas` file. This is the base class used internally by spine-flutter.

The [`SkeletonData`](/git/spine-runtimes/spine-flutter/lib/generated/skeleton_data.dart) class stores the data loaded from a `.json` or `.skel` skeleton file.  The skeleton data contains information about the bone hierarchy, slots, attachments, constraints, skins, and animations. A `SkeletonData` instance is usually loaded by also providing an `Atlas` from which it sources the images to be used by the skeleton it represents. It serves as a blueprint for creating `Skeleton` instances. Multiple skeletons can be instantiated from the same atlas and skeleton data, which then share the loaded data, minimizing both load times and memory consumption at runtime.

The [`Skeleton`](/git/spine-runtimes/spine-flutter/lib/generated/skeleton.dart) class stores an instance of a skeleton, created from a `SkeletonData` instance. A skeleton stores its current pose, that is the position of bones and the current configuration of slots, attachments, and active skin. The current pose can be computed by either manually modifying the bone hierarchy, or, more commonly, by applying animations via an `AnimationState`.

The [`AnimationState`](/git/spine-runtimes/spine-flutter/lib/generated/animation_state.dart) class is responsible for keeping track of which animation(s) should be applied to a skeleton, advancing and mixing those animations based on the elapsed time between the last and current rendering frame, and applying the animations to a skeleton instance, thereby setting its current pose. The `AnimationState` queries an [`AnimationStateData`](/git/spine-runtimes/spine-flutter/lib/generated/animation_state_data.dart) instance to retrieve mixing times between animations, or fetches the default mix time if no mixing time is available for a pair of animations.

### Flutter-specific classes

spine-flutter provides Flutter-specific wrapper classes that handle texture loading, rendering, and lifecycle management:

The [`AtlasFlutter`](/git/spine-runtimes/spine-flutter/lib/spine_flutter.dart#L28) class extends the base `Atlas` class and additionally manages Flutter `Image` objects and `Paint` objects for each atlas page and blend mode. It provides static methods to load atlases from assets, files, or URLs:

```dart
final atlas = await AtlasFlutter.fromAsset("assets/skeleton.atlas");
```

The [`SkeletonDataFlutter`](/git/spine-runtimes/spine-flutter/lib/spine_flutter.dart#L122) class extends the base `SkeletonData` class and provides convenient loading methods that work with `AtlasFlutter`:

```dart
final skeletonData = await SkeletonDataFlutter.fromAsset(atlas, "assets/skeleton.skel");
```

The [`SkeletonDrawableFlutter`](/git/spine-runtimes/spine-flutter/lib/spine_flutter.dart#L304) class extends the base `SkeletonDrawable` and provides Flutter-specific rendering capabilities, including the ability to render to `Canvas`, `PictureRecorder`, PNG, or raw image data.

The spine-flutter runtime builds on top of these core classes.

## SpineWidget
![/img/spine-runtimes-guide/spine-flutter/simple-animation.png](/img/spine-runtimes-guide/spine-flutter/simple-animation.png)

A [`SpineWidget`](/git/spine-runtimes/spine-flutter/lib/spine_widget.dart#L261) is a [StatefulWidget](https://api.flutter.dev/flutter/widgets/StatefulWidget-class.html) responsible for loading and displaying a Spine skeleton. At a minimum, the widget needs to know from where to load the skeleton and atlas files, and it must receive a `SpineWidgetController` instance that is responsible for modifying the state of the widget, such as setting an animation, or changing the skin of the skeleton.

In the simplest case, a `SpineWidget` can be instantiated inside another widget's `build()` method like this:

```dart
@override
Widget build(BuildContext context) {
    final controller = SpineWidgetController(onInitialized: (controller) {
      // Set the walk animation on track 0, let it loop
      controller.animationState.setAnimation(0, "walk", true);
    });

    return Scaffold(
      appBar: AppBar(title: const Text('Simple Animation')),
      body: SpineWidget.fromAsset("assets/spineboy.atlas", "assets/spineboy-pro.skel", controller)
    );
}
```

Upon instantiation, the `SpineWidget` will asynchronously load the specified files and construct the underlying core class instances from them, namely instances of `AtlasFlutter`, `SkeletonDataFlutter`, `Skeleton`, `AnimationStateData`, and `AnimationState`.

Once loading is complete, the `SpineWidgetController` is called, allowing it to modify the state of the widget, such as setting one or more animations, manipulating the bone hierarchy, or modifying the skin of the skeleton. See the section on `SpineWidgetController` below.

The `SpineWidget` class provides multiple static factory methods to load skeleton and atlas files from different sources:

* `SpineWidget.fromAsset()` loads files from the root bundle, or a provided bundle.
* `SpineWidget.fromFile()` loads files from the file system.
* `SpineWidget.fromHttp()` loads files from URLs.
* `SpineWidget.fromDrawable()` constructs a widget from a `SkeletonDrawableFlutter`. This is useful when the skeleton data should be preloaded, cached, and/or shared between `SpineWidget` instances. See the section "Pre-loading and sharing skeleton data" below.

All factory methods have optional arguments that let you further define how the Spine skeleton is fitted and aligned inside the widget, and how the widget is sized.

* `fit`, the [BoxFit](https://api.flutter.dev/flutter/painting/BoxFit.html) to use to fit the skeleton inside the widget.
* `alignment`, the [Alignment](https://api.flutter.dev/flutter/painting/Alignment-class.html) to use to align the skeleton inside the widget.
* `boundsProvider`, used to calculate the pixel size of the bounding box to be used for the skeleton when computing the fit and alignment. By default, the skeleton's setup pose bounding box is used. See the class documentation for [`SetupPoseBounds`](/git/spine-runtimes/spine-flutter/lib/spine_widget.dart#L180), [`RawBounds`](/git/spine-runtimes/spine-flutter/lib/spine_widget.dart#L192), and [`SkinAndAnimationBounds`](/git/spine-runtimes/spine-flutter/lib/spine_widget.dart#L205) for additional information.
* `sizedByBounds`, defines whether to size the widgets by the bounds computed by the `BoundsProvider`, or have it sized by its parent widget.

## Pre-loading and sharing skeleton data
Pre-loading allows you to share atlas and skeleton data between multiple `SpineWidget` instances, saving both load time and memory. The key is understanding the ownership parameter when creating drawables.

### Sharing data across multiple widgets
When you want multiple widgets to share the same atlas and skeleton data:

```dart
// Pre-load the atlas and skeleton data once
final atlas = await AtlasFlutter.fromAsset("assets/test.atlas");
final skeletonData = await SkeletonDataFlutter.fromAsset(atlas, "assets/test.skel");

// Create drawables without taking ownership (pass false)
final drawable1 = SkeletonDrawableFlutter(atlas, skeletonData, false);
final drawable2 = SkeletonDrawableFlutter(atlas, skeletonData, false);

// Use in multiple widgets
SpineWidget.fromDrawable(drawable1, controller1);
SpineWidget.fromDrawable(drawable2, controller2);
```

With `ownsAtlasAndSkeletonData: false`, the drawables will NOT dispose the atlas and skeleton data when they are disposed. You must manually manage their lifecycle:

```dart
// Dispose drawables when done
drawable1.dispose();
drawable2.dispose();

// Manually dispose shared data when completely done
skeletonData.dispose();
atlas.dispose();
```

### Single-use with ownership
If you only need one widget and want automatic cleanup:

```dart
final atlas = await AtlasFlutter.fromAsset("assets/test.atlas");
final skeletonData = await SkeletonDataFlutter.fromAsset(atlas, "assets/test.skel");

// Create drawable with ownership (pass true)
final drawable = SkeletonDrawableFlutter(atlas, skeletonData, true);
SpineWidget.fromDrawable(drawable, controller);

// When disposed, this will also dispose atlas and skeletonData
drawable.dispose();
```

## SpineWidgetController
A [`SpineWidgetController`](/git/spine-runtimes/spine-flutter/lib/spine_widget.dart#L64) controls how the skeleton of a `SpineWidget` is animated and rendered. The controller is provided with a set of optional callbacks as constructor arguments, which are called at specific times during the life-time of the `SpineWidget`.

The controller exposes the skeleton state through getters returning Spine Runtimes API objects such as the `AtlasFlutter`, `SkeletonDataFlutter`, `Skeleton`, and `AnimationState`, through which the state can be manipulated. See the [Spine Runtimes Guide](/spine-runtimes-guide), and the [class documentation](/git/spine-runtimes/spine-flutter/lib/generated/api.dart) for more information.

Upon initialization of a `SpineWidget`, the controller's `onInitialized()` callback method is invoked once. This method can be used to setup the initial animation(s) to be played back, or set the skin of the skeleton, among other things.

After initialization is complete, the `SpineWidget` is rendered continuously at the screen refresh rate. Each frame, the `AnimationState` is updated based on the currently queued animations, and applied to the `Skeleton`.

Next, the optional `onBeforeUpdateWorldTransforms()` callback is invoked, which can modify the skeleton before its current pose is calculated using `Skeleton.updateWorldTransform()`.

After the current pose has been calculated, the optional `onAfterUpdateWorldTransforms()` callback is invoked, which can further modify the current pose before the skeleton is rendered. This is a good place to manually position bones.

Before the skeleton is rendered by the `SpineWidget`, the optional `onBeforePaint()` callback is invoked, which allows rendering backgrounds or other objects that should go behind the skeleton on the [`Canvas`](https://api.flutter.dev/flutter/dart-ui/Canvas-class.html).

After the `SpineWidget` has rendered the current skeleton pose to the `Canvas`, the optional `onAfterPaint()` callback is invoked, which allows rendering additional objects on top of the skeleton.

By default, the widget updates and renders the skeleton every frame. The `SpineWidgetController.pause()` method can be used to pause updating and rendering the skeleton. The `SpineWidgetController.resume()` method resumes updating and rendering the skeleton. The `SpineWidgetController.isPlaying()` getter reports the current playback state. See the [`example/lib/pause_play_animation.dart`](/git/spine-runtimes/spine-flutter/example/lib/pause_play_animation.dart) example.

## SkeletonDrawableFlutter
A `SkeletonDrawableFlutter` bundles loading, storing, updating, and rendering a `Skeleton` and its associated `AnimationState` into a single, easy to use class. The class can be used as the basis for a custom widget implementation. The `SpineWidget` encapsulates the state of the skeleton it displays via an instance of a `SkeletonDrawableFlutter`.

Use the static `fromAsset()`, `fromFile()`, or `fromHttp()` methods to construct a `SkeletonDrawableFlutter` from file assets. To share `AtlasFlutter` and `SkeletonDataFlutter` among multiple `SkeletonDrawableFlutter` instances, instantiate the drawables via the constructor, passing the same atlas and skeleton data to each of them.

The `SkeletonDrawableFlutter` exposes the `atlasFlutter`, `skeletonData`, `skeleton`, `animationStateData`, and `animationState` to query, modify, and animate the skeleton.

To animate the skeleton, queue animations on one or more tracks via the `AnimationState` API, such as `AnimationState.setAnimation()` or `AnimationState.addAnimation()`.

To update the animation state, apply it to the skeleton, and update the current skeleton pose, call the `SkeletonDrawableFlutter.update()` method, providing it a delta time in seconds to advance the animations.

To render the current pose of the skeleton, use the rendering methods `SkeletonDrawableFlutter.renderFlutter()`, `SkeletonDrawableFlutter.renderToCanvas()`, `SkeletonDrawableFlutter.renderToPictureRecorder()`, `SkeletonDrawableFlutter.renderToPng()`, or `SkeletonDrawableFlutter.renderToRawImageData()`.

The `SkeletonDrawableFlutter` stores objects allocated on the native heap. The native objects need to be manually disposed of via a call to `SkeletonDrawableFlutter.dispose()` if the `SkeletonDrawableFlutter` is no longer needed. Not doing so will result in a native memory leak.

> **Note:** when using `SpineWidget`, you do not have to manually dispose of the `SkeletonDrawableFlutter` the widget uses. The widget will dispose the `SkeletonDrawableFlutter` when it is disposed itself.

## Applying Animations
Applying animations to a skeleton displayed by a `SpineWidget` is done through the `AnimationState` in the callbacks of a `SpineWidgetController`.

> **Note:** See [Applying Animations](/spine-applying-animations#AnimationState-API) in the Spine Runtimes Guide for more in-depth information, specifically about animation tracks and animation queueing.

To set a specific animation on track 0, call `AnimationState.setAnimation()`:

```dart
final controller = SpineWidgetController(onInitialized: (controller) {
   // Set the walk animation on track 0, let it loop
   controller.animationState.setAnimation(0, "walk", true);
});
```

The first parameter specifies the track, the second parameter is the name of the animation, and the third parameter defines whether to loop the animation.

You can queue multiple animations:

```dart
controller.animationState.setAnimation(0, "walk", true);
controller.animationState.addAnimation(0, "jump", false, 2);
controller.animationState.addAnimation(0, "run", true, 0);
```

The first parameter to `addAnimation()` is the track. The second parameter is the name of the animation. The third parameter specifies whether to loop the animation. The final parameter defines the delay in seconds, after which this animation should replace the previous animation on the track.

In the example above, the `"walk"` animation is played back first. 2 seconds later, the `"jump"` animation is played back once, followed by a transition to the `"run"` animation, which will be looped.

When transitioning from one animation to another, `AnimationState` will mix the animations for a specificable duration. These mix times are defined in an `AnimationStateData` instance, from which the `AnimationState` retrieves mix times.

The `AnimationStateData` instance is also available through the controller. You can set the default mix time, or the mix time for a specific pair of animations:

```dart
controller.animationStateData.defaultMix = 0.2;
controller.animationStateData.setMix("walk", "jump", 0.1);
```

When setting or adding an animation, a `TrackEntry` object is returned, which allows further modification of that animation's playback. For example, you can set the track entry to reverse the animation playback:

```dart
final entry = controller.animationState.setAnimation(0, "walk", true);
entry.reverse = true;
```

See the [`TrackEntry` class documentation](/git/spine-runtimes/spine-flutter/lib/generated/track_entry.dart) for more options.

> **Note:** Do not hold on to `TrackEntry` instances outside the function you are using them in. Track entries are re-used internally and will thus become invalid once the animation it represents has been completed.

You can set or queue empty animations on an animation track to smoothly reset the skeleton back to its setup pose:

```dart
controller.animationState.setEmptyAnimation(0, 0.5);
controller.animationState.addEmptyAnimation(0, 0.5, 0.5);
```

The first parameter to `setEmptyAnimation()` specifies the track. The second parameter specifies the mix duration in seconds used to mix out the previous animation and mix in the "empty" animation.

The first parameter to `addEmptyAnimation()` specifies the track. The second parameter is the mix duration. The third parameter specifies the delay in seconds, after which the empty animation should replace the previous animation on the track via mixing.

All animations on a track can be cleared immediately via `AnimationState.clearTrack()`. To clear all tracks at once, `AnimationState.clearTracks()` can be used. This will leave the skeleton in the last pose it was in.

To reset the pose of a skeleton to the setup pose, use `Skeleton.setupPose()`:

```dart
controller.skeleton.setupPose();
```

This will reset both the bones and slots to their setup pose configuration. Use `Skeleton.setupPoseSlots()` to only reset the slots to their setup pose configuration.

## AnimationState Events
An `AnimationState` emits events during the life-cycle of an animation that is being played back. You can listen for this events to react as needed. The Spine Runtimes API defines the following [event types](/git/spine-runtimes/spine-flutter/lib/generated/event_type.dart):

* `start`: emitted when an animation is started.
* `interrupt`: emitted when an animation's track was cleared, or a new animation was set.
* `complete`: emitted when an animation completes a loop.
* `end`: emitted when an animation will never be applied again.
* `dispose`: emitted when the animation's track entry is disposed.
* `event`: emitted when a user defined [event](/spine-events#Events) happened.

To receive events, you can register an [`AnimationStateListener`](/git/spine-runtimes/spine-flutter/lib/spine_dart.dart#L229) callback with either the `AnimationState` to receive events across all animations, or with the `TrackEntry` of a specific animation queued for playback:

```dart
final entry = controller.animationState.setAnimation(0, "walk", true);
entry.setListener((type, trackEntry, event) {
   if (type == EventType.event) {
      print("User defined event: ${event?.data.name}");
   }
});

controller.animationState.setListener((type, trackEntry, event) {
   print("Animation state event $type");
});
```

See the [`example/lib/animation_state_events.dart`](/git/spine-runtimes/spine-flutter/example/lib/animation_state_events.dart) example.

## Skins
![/img/spine-runtimes-guide/spine-flutter/skins.png](/img/spine-runtimes-guide/spine-flutter/skins.png)

Many applications and games allow users to create custom avatars out of many individual items, such as hair, eyes, pants, or accessories like earrings or bags. With Spine, this can be achieved by [mixing and matching skins](/spine-examples-mix-and-match).

You can create custom skins from other skins like this:

```dart
final data = controller.skeletonData;
final skeleton = controller.skeleton;
final customSkin = Skin("custom-skin");
customSkin.addSkin(data.findSkin("skin-base")!);
customSkin.addSkin(data.findSkin("nose/short")!);
customSkin.addSkin(data.findSkin("eyelids/girly")!);
customSkin.addSkin(data.findSkin("eyes/violet")!);
customSkin.addSkin(data.findSkin("hair/brown")!);
customSkin.addSkin(data.findSkin("clothes/hoodie-orange")!);
customSkin.addSkin(data.findSkin("legs/pants-jeans")!);
customSkin.addSkin(data.findSkin("accessories/bag")!);
customSkin.addSkin(data.findSkin("accessories/hat-red-yellow")!);
skeleton.setSkin2(customSkin);
skeleton.setupPoseSlots();
```

Create a custom skin with the `Skin()` constructor.

Next, fetch the `SkeletonData` from the controller. It is used to look up skins by name via `SkeletonData.findSkin()`.

Add all the skins you want to combine into the new custom skin via `Skin.addSkin()`.

Finally, set the new skin on the `Skeleton` using `Skeleton.setSkin2()` and call `Skeleton.setupPoseSlots()` to ensure no attachments from previous skins and/or animations are left over.

> **Note:** The `Skeleton` class provides two methods for setting skins:
> - `setSkin(String skinName)` - Sets a skin by its name
> - `setSkin2(Skin? newSkin)` - Sets a skin using a `Skin` object (used for custom skins)
>
> A `Skin` wraps an underlying C++ object. It needs to be manually disposed via a call to `Skin.dispose()` when it is no longer in use.

See the [`example/lib/dress_up.dart`](/git/spine-runtimes/spine-flutter/example/lib/dress_up.dart) example, which also demonstrate how to render thumbnail previews of skins using `SkeletonDrawableFlutter`.

## Setting Bone Transforms
![/img/spine-runtimes-guide/spine-flutter/simple-animation.png](/img/spine-runtimes-guide/spine-flutter/bone-transform.png)

When authoring a skeleton in the Spine Editor, the skeleton is defined in what is called the skeleton coordinate system. This coordinate system may not align with the coordinate system of the `SpineWidget` the skeleton is rendered by. Touch coordinates relative to the `SpineWidget` need thus be converted to the skeleton coordinate system, e.g. if a user should be able to move a bone by touch.

The `SpineWidgetController` offers the method `toSkeletonCoordinates()` which takes an [`Offset`](https://api.flutter.dev/flutter/dart-ui/Offset-class.html) relative to the `SpineWidget` it is associated with, and converts it to the skeleton's coordinate system.

See the [`example/lib/ik_following.dart`](/git/spine-runtimes/spine-flutter/example/lib/ik_following.dart) example.

## Flame Integration
![/img/spine-runtimes-guide/spine-flutter/flame.png](/img/spine-runtimes-guide/spine-flutter/flame.png)

spine-flutter includes an example that shows how to load and renderer Spine skeletons in [Flame Engine](https://flame-engine.org/). See the [`example/lib/flame_example.dart`](/git/spine-runtimes/spine-flutter/example/lib/flame_example.dart) source file.

The example features a simple `SpineComponent` that extends Flame's `PositionComponent`. The `SpineComponent` can be instantiated through the static `SpineComponent.fromAsset()` method, or through the constructor.

The static method can be used as a quick, one-off loading mechanism when the skeleton and atlas data doesn't have to be shared with other components. The example contains a `FlameGame` implementation called `SimpleFlameExample` which demonstrates this simple way of getting a Spine skeleton on screen as part of a Flame game.

Creating a `SpineComponent` via the constructor allows more fine-grained management of the data loading and sharing by taking a `SkeletonDrawableFlutter`. E.g. you can pre-load the skeleton data and atlas, then share it across multiple `SpineComponent` instances. This will both improve memory usage and rendering performance, as data is shared, and rendering can be batched. See the `FlameGame` implementation called `PreloadAndShareSpineDataExample` for an example.

By design, Flame can not know when a component has reached its end of life. However, a `SpineComponent` handles native resources that need to be released at the end of its life. It is thus your responsibility to either call `SpineComponent.dispose()` if a `SpineComponent` is no longer in use. If the `SpineComponent` was constructed from a `SkeletonDrawableFlutter`, you may also have to manually dispose the `SkeletonDataFlutter` and `AtlasFlutter` from which it was constructed, like in the `PreloadAndShareSpineDataExample` example.

# Spine Runtimes API access
spine-flutter maps almost all of the Spine Runtime API to Dart. Objects returned by `SpineWidgetController` or `SkeletonDrawableFlutter`, like `Skeleton` or `AnimationState` are 1:1 translations of the spine-cpp API to Dart. You can thus apply all of the materials in the generic [Spine Runtimes Guide](/spine-runtimes-guide) and the [spine-cpp documentation](/spine-cpp) to your Dart code.

Due to the nature of the spine-cpp to Dart FFI bridge, there are some considerations:

* Arrays returned by the API (like `ArrayFloat`, `ArrayInt`) are direct wrappers around native memory. They provide List-like access to the underlying C++ data and modifications through the array's methods will affect the native data.
* You can create bones and slots using their factory constructors (e.g., `Bone(boneData, parent)`, `Slot(slotData, skeleton)`). However, you are responsible for disposing any manually created objects.
* The C++ class hierarchy is fully translated to Dart, including all timeline and constraint classes with proper inheritance relationships and the same nullability patterns as the Java reference implementation.

---
## File: Runtimes, spine-glfw/spine-glfw.md
## Title: spine-glfw Runtime Documentation
## URL: http://esotericsoftware.com/spine-glfw
---

# spine-glfw Runtime Documentation

> **Licensing**
>
> Please see the [Spine Runtimes License](/spine-runtimes-license) before integrating the Spine Runtimes into your applications.

# Getting Started
spine-glfw is a C and C++ based runtime to load, manipulate and render Spine skeletons with [GLFW](https://www.glfw.org/) and OpenGL.

spine-glfw requires GLFW 3.0+ and OpenGL 3.3+ and supports all Spine features.

## Installation

The spine-glfw runtime is available as a C and C++ API. Both APIs are based on [spine-c](/spine-c) and [spine-cpp](/spine-cpp) runtimes. Note that spine-c depends on spine-cpp, so both are required regardless of which API you choose to use.

### Integration with CMake (Recommended)

The easiest way to integrate spine-glfw into your project is via CMake FetchContent:

```cmake
cmake_minimum_required(VERSION 3.16)
project(MySpineProject)

include(FetchContent)
FetchContent_Declare(
    spine-glfw
    GIT_REPOSITORY https://github.com/esotericsoftware/spine-runtimes.git
    GIT_TAG 4.3
    SOURCE_SUBDIR spine-glfw
)
FetchContent_MakeAvailable(spine-glfw)

# Create your executable
add_executable(MyApp main.cpp)

# Link against spine-glfw (includes spine-cpp, spine-c, GLFW, and glbinding)
target_link_libraries(MyApp spine-glfw)
```

This will automatically fetch and build spine-glfw along with all its dependencies (spine-c, spine-cpp, GLFW, and glbinding).

### Manual Integration

If you prefer manual integration:

1. Download the Spine Runtimes source using git (`git clone https://github.com/esotericsoftware/spine-runtimes`) or download as a zip.
2. Add the required source files to your project:
   - Add sources from `spine-cpp/src`, `spine-c/src`, and `spine-glfw/src/spine-glfw.cpp`
3. Add the include directories: `spine-cpp/include`, `spine-c/include`, and `spine-glfw/src`
4. Link against GLFW, OpenGL, and glbinding libraries

In your C++ code, include the following header file to get access to the `spine-glfw` API:

```cpp
#include <spine-glfw.h>
```

> *Note:* spine-glfw requires OpenGL 3.3 Core Profile or higher. The runtime uses modern OpenGL features including vertex array objects, vertex buffer objects, and GLSL shaders.

## Samples
The spine-glfw example works on Windows, Linux and Mac OS X. For a [spine-cpp](/spine-cpp) based example, see [example/main.cpp](/git/spine-runtimes/tree/spine-glfw/example/main.cpp), for a spine-c example see [example/main-c.cpp](/git/spine-runtimes/tree/spine-glfw/example/main-c.cpp).

### Windows

1. Install [Visual Studio Community](https://visualstudio.microsoft.com/downloads/). Make sure you install support for C++ and CMake.
2. Download the Spine Runtimes repository using git (`git clone https://github.com/esotericsoftware/spine-runtimes`) or download it as a zip.
3. Open Visual Studio Community, then open `spine-glfw/` via the **Open a local folder** button in the Visual Studio Community launcher.
4. Wait for CMake to finish, then select either `spine-glfw-example.exe` or `spine-glfw-example-c.exe` as the start-up project and start debugging.

### Linux

1. Install dependencies:
   ```bash
   sudo apt-get install cmake ninja-build libgl1-mesa-dev libx11-dev libxrandr-dev libxinerama-dev libxcursor-dev libxi-dev  # Ubuntu/Debian
   # or equivalent for your distribution
   ```
2. Clone the repository: `git clone https://github.com/esotericsoftware/spine-runtimes`
3. Build and run:
   ```bash
   cd spine-runtimes/spine-glfw
   ./build.sh
   ./build/debug/spine-glfw-example-c    # Run C example
   ./build/debug/spine-glfw-example      # Run C++ example
   ```

### macOS

1. Install [Xcode](https://developer.apple.com/xcode/)
2. Install [Homebrew](http://brew.sh/)
3. Install dependencies:
   ```bash
   brew install cmake ninja
   ```
4. Clone the repository: `git clone https://github.com/esotericsoftware/spine-runtimes`
5. Build and run:
   ```bash
   cd spine-runtimes/spine-glfw
   ./build.sh
   ./build/debug/spine-glfw-example-c    # Run C example
   ./build/debug/spine-glfw-example      # Run C++ example
   ```

## Using spine-glfw
The spine-glfw runtime supports playback and manipulation of animations created with Spine using [GLFW](https://www.glfw.org/) and OpenGL. The spine-glfw runtime comes as both a C and C++ implementation, based on the generic [spine-c](/spine-c) and [spine-cpp](/spine-cpp) runtimes. It adds loading and rendering implementations based on OpenGL APIs.

Please consult the [Spine Runtimes Guide](/spine-runtimes) for a detailed overview of the Spine Runtime architecture, and the [spine-c](/spine-c) and [spine-cpp](/spine-cpp) documentation for information on the core APIs used to playback and manipulate animations created with Spine with C and C++.

### Exporting for GLFW
![](/img/spine-runtimes-guide/spine-ue4/export.png)
Please follow the instructions in the Spine User Guide on how to

1. [Export skeleton & animation data](/spine-export)
2. [Export texture atlases containing the images of your skeleton](/spine-texture-packer)

An export of the skeleton data and texture atlas of your skeleton will yield the following files:

![](/img/spine-runtimes-guide/spine-ue4/exported-files.png)

1. `skeleton-name.json` or `skeleton-name.skel`, containing your skeleton and animation data.
2. `skeleton-name.atlas`, containing information about the texture atlas.
3. One or more `.png` files, each representing on page of your texture atlas containing the packed images your skeleton uses.

### Loading Spine skeletons
The spine-glfw runtime uses OpenGL for rendering skeletons. Before a skeleton can be loaded from exported files, a GLFW window and OpenGL context must be created:

```cpp
// Initialize GLFW
if (!glfwInit()) {
    // Handle error
    return -1;
}

// Set OpenGL version to 3.3 Core Profile
glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

// Create window
GLFWwindow* window = glfwCreateWindow(800, 600, "Spine GLFW", NULL, NULL);
glfwMakeContextCurrent(window);

// Initialize OpenGL function loading (e.g., with glbinding)
glbinding::initialize(glfwGetProcAddress);
```

#### Loading with C API

With the C API, loading requires texture loading callbacks and manual file reading:

```cpp
// Texture loading callbacks
void *load_texture(const char *path) {
    return (void *)(uintptr_t)texture_load(path);
}

void unload_texture(void *texture) {
    texture_dispose((texture_t)(uintptr_t)texture);
}

// Read atlas file into memory
int atlas_length = 0;
uint8_t *atlas_bytes = read_file("data/spineboy-pma.atlas", &atlas_length);

// Load atlas with callbacks
spine_atlas_result atlas_result = spine_atlas_load_callback(
    (const char*)atlas_bytes, "data/", load_texture, unload_texture);
spine_atlas atlas = spine_atlas_result_get_atlas(atlas_result);

// Read skeleton file into memory
int skeleton_length = 0;
uint8_t *skeleton_bytes = read_file("data/spineboy-pro.skel", &skeleton_length);

// Load skeleton data
spine_skeleton_data_result skeleton_result = spine_skeleton_data_load_binary(
    atlas, skeleton_bytes, skeleton_length, "data/");
spine_skeleton_data skeleton_data = spine_skeleton_data_result_get_data(skeleton_result);

// Free file data
free(atlas_bytes);
free(skeleton_bytes);
```

#### Loading with C++ API

For the C++ API, a `GlTextureLoader` is needed:

```cpp
// C++ API
spine::GlTextureLoader textureLoader;
spine::Atlas *atlas = new spine::Atlas("data/spineboy-pma.atlas", &textureLoader);

// Load skeleton data from binary
spine::SkeletonBinary binary(*atlas);
spine::SkeletonData *skeletonData = binary.readSkeletonDataFile("data/spineboy-pro.skel");

// Or load from JSON
spine::SkeletonJson json(*atlas);
spine::SkeletonData *skeletonData = json.readSkeletonDataFile("data/spineboy-pro.json");
```

The loaded skeleton data and atlas can and should be shared across skeleton instances to reduce memory consumption and enable batched rendering of skeletons that share the same atlas data.

### Renderer

The main addition of spine-glfw on top of [spine-c](/spine-c) and [spine-cpp](/spine-cpp) is the renderer system. The renderer handles the OpenGL rendering pipeline including shaders, meshes, and textures.

```cpp
// Create the renderer and set viewport size
renderer_t *renderer = renderer_create();
renderer_set_viewport_size(renderer, windowWidth, windowHeight);
```

The renderer automatically creates and manages OpenGL shaders optimized for Spine skeleton rendering.

### Rendering Skeletons

spine-glfw provides rendering functions that work directly with skeletons and skeleton drawables.

#### C API

```cpp
// Create skeleton drawable (combines skeleton + animation state)
spine_skeleton_drawable drawable = spine_skeleton_drawable_create(skeleton_data);
spine_skeleton skeleton = spine_skeleton_drawable_get_skeleton(drawable);
spine_animation_state animation_state = spine_skeleton_drawable_get_animation_state(drawable);

// Setup skeleton
spine_skeleton_set_position(skeleton, 400, 500);
spine_skeleton_set_scale(skeleton, 0.3f, 0.3f);
spine_skeleton_setup_pose(skeleton);

// Setup animation
spine_animation_state_set_animation_1(animation_state, 0, "portal", false);
spine_animation_state_add_animation_1(animation_state, 0, "run", true, 0);

// Update and render (in your main loop)
spine_skeleton_drawable_update(drawable, deltaTime);
renderer_draw_c(renderer, skeleton, true); // true for premultiplied alpha

// Cleanup
spine_skeleton_drawable_dispose(drawable);
spine_skeleton_data_dispose(skeleton_data);
spine_atlas_dispose(atlas);
spine_skeleton_data_result_dispose(skeleton_result);
spine_atlas_result_dispose(atlas_result);
```

#### C++ API

```cpp
// Set coordinate system (spine-glfw uses y-down by default)
spine::Bone::setYDown(true);

// Create skeleton and animation state
spine::Skeleton skeleton(*skeletonData);
spine::AnimationStateData animationStateData(*skeletonData);
spine::AnimationState animationState(animationStateData);

// Setup skeleton
skeleton.setPosition(400, 500);
skeleton.setScaleX(0.5f);
skeleton.setScaleY(0.5f);
skeleton.setupPose();

// Setup animation
animationStateData.setDefaultMix(0.2f);
animationState.setAnimation(0, "portal", false);
animationState.addAnimation(0, "run", true, 0);

// Update and render (in your main loop)
animationState.update(deltaTime);
animationState.apply(skeleton);
skeleton.update(deltaTime);
skeleton.updateWorldTransform(spine::Physics_Update);

// Clear screen
gl::glClear(gl::GL_COLOR_BUFFER_BIT);

// Render skeleton
renderer_draw(renderer, &skeleton, true); // true for premultiplied alpha

// Cleanup
delete skeletonData;
delete atlas;
```

Please refer to the [spine-c](/spine-c) and [spine-cpp](/spine-cpp) documentation for more information on the APIs to manipulate skeletons and animation states.


### Cleanup

When you no longer need the skeleton and atlas data, free their memory:

#### C API
```cpp
// Dispose renderer and skeleton data
renderer_dispose(renderer);
spine_skeleton_drawable_dispose(drawable);
spine_skeleton_data_dispose(skeleton_data);
spine_atlas_dispose(atlas);
spine_skeleton_data_result_dispose(skeleton_result);
spine_atlas_result_dispose(atlas_result);

// Free manually allocated file data
free(atlas_bytes);
free(skeleton_bytes);

// Cleanup GLFW
glfwTerminate();
```

#### C++ API
```cpp
// Dispose renderer and skeleton data
renderer_dispose(renderer);
delete skeletonData;
delete atlas;

// Cleanup GLFW
glfwTerminate();
```

> *Note:* Freeing skeleton data and atlas instances will automatically dispose of any associated OpenGL textures through the texture loader. With spine-c, you must also free any memory you allocated for file data using `malloc()`/`read_file()`.

---
## File: Runtimes, spine-godot/spine-godot.md
## Title: spine-godot Runtime Documentation
## URL: http://esotericsoftware.com/spine-godot
---

# spine-godot Runtime Documentation

> **Licensing**
>
> Please see the [Spine Runtimes License](/spine-runtimes-license) before integrating the Spine Runtimes into your applications.

# Getting Started

## Installation
The spine-godot runtime comes in two flavors:
* **spine-godot [GDExtension](https://docs.godotengine.org/en/stable/tutorials/scripting/gdextension/index.html)**: A single package you drop into your existing Godot project's `bin/` folder. Supports all platforms Godot supports, possibly including consoles in the future powered by [W4Games](https://www.w4games.com/). Lacks support for `AnimationPlayer`, does not have [dedicated C# bindings](https://github.com/godotengine/godot-proposals/issues/8191), and is missing a [minor editor feature](https://github.com/godotengine/godot-proposals/issues/10985).
* **spine-godot [custom C++ engine module](https://docs.godotengine.org/en/stable/development/cpp/custom_modules_in_cpp.html)**: requires you to use a custom Godot Editor build and Godot templates. Unlikely to support consoles in the future. Supports additional features, like `AnimationPlayer`, and dedicated C# bindings.


### spine-godot GDExtension downloads
<script>
let baseURL = "https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/refs/heads/";
let spineVersion = undefined;

async function getSpineVersion() {
    if (!spineVersion) {
        const response = await fetch("/spine/version");
        spineVersion = await response.text();
    }
    return spineVersion;
}

async function getV4ExtensionVersions() {
    const response = await fetch(baseURL + spineVersion + "/.github/workflows/spine-godot-extension-v4-all.yml");
    const v4Data = await response.text();
    const pattern = /{\s*"tag":\s*"(.*?)",\s*"version":\s*"(.*?)",\s*"dev":\s*(true|false)\s*}/g;
    const matches = v4Data.match(pattern);
    return matches.map(match => JSON.parse(match));
}

(async () => {
    const spineVersion = await getSpineVersion();
    const versions = [...(await getV4ExtensionVersions())];

    let html = "<ul>";
    for (const version of versions) {
        const versionLabel = "Godot " + version.tag.substring(0, version.tag.indexOf("-"));
        html += `<li><a href="https://spine-godot.s3.eu-central-1.amazonaws.com/${spineVersion}/${version.tag}/spine-godot-extension-${spineVersion}-${version.tag}.zip">${versionLabel}</a></li>`
    }
    html += "</ul>"
    document.querySelector("#ext-urls").innerHTML = html;
 })()
 </script>

 <div id="ext-urls"></div>
!!

Download the spine-godot GDExtension version for the Godot version you are using. Unpack the `.zip` file and copy the `bin/` folder to the root folder of your project. E.g. you should have a folder `your-project/bin` and a file `your-project/bin/spine_godot_extension.gdextension`. Then run the Godot editor.

### spine-godot engine module downloads
<script>
async function getV4Versions() {
    const response = await fetch(baseURL + spineVersion + "/.github/workflows/spine-godot-v4-all.yml");
    const v4Data = await response.text();
    const pattern = /{\s*"tag":\s*"(.*?)",\s*"version":\s*"(.*?)",\s*"mono":\s*(true|false)\s*}/g;
    const matches = v4Data.match(pattern);
    return matches.map(match => JSON.parse(match));
}

async function getV3Versions() {
    const response = await fetch(baseURL + spineVersion + "/.github/workflows/spine-godot.yml");
    const v3Data = await response.text();
    const tagPattern = /GODOT_TAG:\s*(.*)/;
    const versionPattern = /GODOT_VERSION:\s*(.*)/;
    function extractValue(pattern, str) {
        const match = str.match(pattern);
        return match ? match[1] : null;
    }
    const godotTag = extractValue(tagPattern, v3Data);
    const godotVersion = extractValue(versionPattern, v3Data);

    return [{
        tag: godotTag,
        version: godotVersion,
        mono: false
    }];
}

(async () => {
    const spineVersion = (await getSpineVersion());
    const versions = [...(await getV3Versions()), ...(await getV4Versions())];

    let html = "<ul>";
    for (const version of versions) {
        const mono = version.mono ? "-mono" : "";
        html += "<li>Godot " + version.tag.substring(0, version.tag.indexOf("-")) + (version.mono ? " with C# support" : "");
        html += `
            <ul>
                <li><a href="https://spine-godot.s3.eu-central-1.amazonaws.com/${spineVersion}/${version.tag}/godot-editor-windows${mono}.zip">Editor Windows</a></li>
                <li><a href="https://spine-godot.s3.eu-central-1.amazonaws.com/${spineVersion}/${version.tag}/godot-editor-linux${mono}.zip">Editor Linux</a></li>
                <li><a href="https://spine-godot.s3.eu-central-1.amazonaws.com/${spineVersion}/${version.tag}/godot-editor-macos${mono}.zip">Editor macOS</a></li>
                <li><a href="https://spine-godot.s3.eu-central-1.amazonaws.com/${spineVersion}/${version.tag}/spine-godot-templates-${spineVersion}-${version.tag}${mono}.tpz">Export templates for Windows, Linux, macOS${!version.mono ? ", Web, Android, iOS" : ""}</a></li>
            </ul>
        `
        html += "</li>"
    }
    html += "</ul>"
    document.querySelector("#urls").innerHTML = html;
 })()
 </script>

 <div id="urls"></div>
!!

> **Note**: All editor builds require 64-bit support. The export templates for Windows, Linux and macOS also require 64-bit support. The export template for iOS devices only supports 64-bit ARM devices, which is a requirement by Apple.

Download the Godot editor for your operating system as well as the Godot export templates from the links above.

For Windows and Linux, unpack the `.zip` file and place the extracted executable file anywhere you like. For macOS, unpack the `.zip` file and place the `Godot.app` into your `/Applications/` folder. If you have a pre-existing Godot installation, you can rename the `Godot.app` package.

To install the export templates `.tpz` file, open the Godot editor, then go to `Editor >  Manage export templates ...`. Click `Install from file` and select the `.tzp` you downloaded from the link above. You can now [export your project](https://docs.godotengine.org/en/stable/tutorials/export/index.html) for Windows, Linux, macOS, iOS, Android, and the web as usual. You can also use Godot's [one-click deploy](https://docs.godotengine.org/en/stable/tutorials/export/one-click_deploy.html) for Android and the web right from within the Godot editor.

## Samples
The spine-godot runtime comes with many samples that demonstrate its feature set. To inspect and play around with the samples:

1. Download either the GDExtension or the pre-built Godot editor from the links in the "Installation" section above.
2. Clone the [spine-runtimes Git repository](https://github.com/esotericsoftware/spine-runtimes). If you don't want to use Git, download the [latest version as a ZIP](/git/spine-runtimes/archive) and unpack it.
3. Open the Godot editor and click `Import`, then select the example folder based on your spine-godot and Godot Editor version:
   - GDExtension: `spine-runtimes/spine-godot/example-v4-extension/project.godot`.
      - Unpack the GDExtension you downloaded and copy the `bin/` to the project root before opening the project in the Godot editor!
   - C++ Engine Module:
      - Godot 3.x: `spine-runtimes/spine-godot/example/project.godot`.
      - Godot 4.x: `spine-runtimes/spine-godot/example-v4/project.godot`.
      - Godot 4.x with C# support: `spine-runtimes/spine-godot/example-v4-csharp/project.godot`.
   

The following examples are available:
* `01-helloworld`: demonstrates how to use a `SpineSprite` node to display and animate a Spine skeleton.
* `02-animation-state-listener`: demonstrates how to listen for animation state changes on a `SpineSprite` via signals.
* `03-mix-and-match`. demonstrates how to create a custom skin composed from other skins for mix-and-match avatar creation scenarios.
* `04-simple-input`: demonstrates how to playback animations in reaction to input events.
* `05-mouse-following`: demonstrates how to manually let a bone in a `SpineSprite` skeleton follow the mouse or touch events.
* `06-bone-following`: demonstrates how to use a `SpineBoneNode` on a `SpineSprite` to let a child node follow a bone in the skeleton.
* `07-slot-node`: demonstrates how to use a `SpineSlotNode` to let a child node follow a slot in the skeleton, correctly inserting the child node in the `SpineSprite`'s rendering order.
* `08-animation-player`: demonstrates how to use a `SpineAnimationTrack` node to create cut-scenes using Godot's `AnimationPlayer` user interface. *Note: this example if not available in the GDExtension version of spine-godot*
* `09-custom-material`: demonstrates how to apply custom materials to an entire `SpineSprite` as well as individual slots via a `SpineSlotNode`.
* `10-2d-lighting`: demonstrates how to use normal maps in combination with a `SpineSprite` to support Godot's 2D lighting system.
* `11-bone-node`: demonstrates using `SpineBoneNode` instances to drive a `SpineSprite`'s bones via Godot physics. 
* `12-bone-node`: demonstrates Spine's physics using the Celestial Circus skeleton.
* `13-load-from-disk`: demonstrates how to load Spine .skel/.json and .atlas files from disk at runtime. 

## Compiling spine-godot from source
If you need to compile the spine-godot GDExtension, or spine-godot engine module (Godot editor, export templates) yourself, e.g. because you want to use a different Godot version, have other custom C++ modules, or want to work on the spine-godot runtime, we provide shell scripts to ease the process.

> *NOTE:* Make sure you have all build dependencies installed before attempting this, as per the [official instructions by Godot](https://docs.godotengine.org/en/stable/development/compiling/index.html).

### Compiling the GDExtension
To build the GDExtension binaries, clone the [spine-runtimes repository](https://github.com/esotericsoftware/spine-runtimes). Run the following in a Bash shell (use Git Bash on Windows) from inside the directory you cloned the Spine Runtimes to:

```
cd spine-godot
./build/setup-extension.sh 4.4.1-stable false
./build/build-extension.sh <os> <arch>?
```

The `setup-extension.sh` build is responsible for cloning external dependencies and setting up the build. The first argument to `setup-extension.sh` is the Godot repository branch or commit hash you want to build the GDExtension against. The second argument specifies whether you want to compile a build with debug information. This can be useful for development purposes. The setup script will clone the appropriate version of [`godot-cpp`](https://github.com/godotengine/godot-cpp) and optionally the Godot editor repository, if a debug build should be created. It will also copy the `spine-godot/spine_godot_extension.gdextension` file to `spine-godot/example-v4-extension/bin`.

The `build-extension.sh` script is responsible for executing the build and generating the GDExtension binaries for a specific operating system. The &lt;os&gt; argument to `build-extension.sh` specifies the OS you want to build for. You can omit it if you want to build for your host OS and architecture. Valid values for &lt;os&gt; are `windows`, `linux`, `macos`, `ios`, `android`, and `web`. You can optionally pass the `arch` argument to build for a specific CPU architecture, e.g. `x86_32 `, `x86_64`, `arm64`, etc, as per the Godot build system documentatio. The GDExtension binaries will be placed in the `spine-godot/example-v4-extension/bin` folder in their respective operating system specific subfolder.

#### Building via GitHub Actions
The [Spine Runtimes repository](https://github.com/EsotericSoftware/spine-runtimes) contains a GitHub workflows in `.github/workflows/spine-godot-extension-v4.yml`, and `.github/workflows/spine-godot-extension-v4-all.yml`that allow building the spine-godot GDExtension through GitHub actions. This may be simpler than compiling these artifacts locally. To use the GitHub workflow:

1. Clone the [Spine Runtimes repository](https://github.com/EsotericSoftware/spine-runtimes)
2. Enable GitHub workflows on the cloned repository
3. Manually trigger the `spine-godot-extension-v4-all` workflow.

The resulting binaries will be attached as artifacts to a successful workflow run.

### Compiling C++ Engine Module
#### Godot 3.5.x

To build a Godot editor binary, clone the [spine-runtimes repository](https://github.com/esotericsoftware/spine-runtimes). Run the following in a Bash shell (use Git Bash on Windows) from inside the directory you cloned the Spine Runtimes to:

```
cd spine-godot
./build/setup.sh 3.5.2-stable false
./build/build.sh release_debug
```

The first argument to `setup.sh` is the Godot repository branch or commit hash you want to build the Godot editor from. The second argument specifies whether you want to compile the editor for development. Valid values are `true` and `false`. If set to true, the build will add support for [Live++](https://liveplusplus.tech/) on Windows if you have set the `LIVEPP` environment variable to your Live++ installation directory, and disable many modules to speed up compilation.

The first argument to `build.sh` specifies the optimization level of the resulting binary. Supported values are `debug`, which allows full debugging but may be slow due to missing optimizations, and `release_debug`, which is generally used for release builds of the Godot editor.

The resulting Godot editor binary can then be found in `spine-godot/godot/bin`.

To build the export template for a specific platform, run the following in a Bash shell (use Git Bash on Windows):

```
cd spine-godot
./build/setup.sh 3.5.2-stable false
./build/build-templates.sh windows
```

The first argument to `setup.sh` is the Godot repository branch or commit hash you want to build the Godot editor from. The second argument must be `false`.

The first argument to `built-templates.sh` is the platform to compile the template for. Valid values are `windows`, `linux`, `macos`, `web`, `android`, and `ios`. Note that macOS and iOS export templates can only be build on a machine running macOS. See the [official instructions by Godot](https://docs.godotengine.org/en/stable/development/compiling/index.html).

The resulting Godot export template binary can then be found in `spine-godot/godot/bin`.

#### Godot 4.x
To build a Godot editor binary, clone the [spine-runtimes repository](https://github.com/esotericsoftware/spine-runtimes). Run the following in a Bash shell (use Git Bash on Windows) from inside the directory you cloned the Spine Runtimes to:

```
cd spine-godot
./build/setup.sh 4.1-stable false
./build/build-v4.sh
```

The first argument to `setup.sh` is the Godot repository branch or commit hash you want to build the Godot editor from. The second argument specifies whether you want to compile the editor for development. Valid values are `true` and `false`. If set to true, the build will add support for [Live++](https://liveplusplus.tech/) on Windows if you have set the `LIVEPP` environment variable to your Live++ installation directory, and disable many modules to speed up compilation.

The resulting Godot editor binary can then be found in `spine-godot/godot/bin`.

To build the export template for a specific platform, run the following in a Bash shell (use Git Bash on Windows):

```
cd spine-godot
./build/setup.sh 4.1-stable false
./build/build-templates-v4.sh windows
```

The first argument to `setup.sh` is the Godot repository branch or commit hash you want to build the Godot editor from. The second argument must be `false`.

The first argument to `built-templates-v4.sh` is the platform to compile the template for. Valid values are `windows`, `linux`, `macos`, `web`, `android`, and `ios`. Note that macOS and iOS export templates can only be build on a machine running macOS. See the [official instructions by Godot](https://docs.godotengine.org/en/stable/development/compiling/index.html).

The resulting Godot export template binary can then be found in `spine-godot/godot/bin`.

#### Godot 4.x with C# support
> **Note**: Godot 4.x with C# support currently only works on Windows, Linux, and macOS. As soon as upstream Godot releases support for mobile and the web, the spine-godot runtime will follow suit.

To build a Godot editor binary with C# support, clone the [spine-runtimes repository](https://github.com/esotericsoftware/spine-runtimes). Ensure you have the additional requirements for C# installed, as per the [Godot documentation](https://docs.godotengine.org/en/stable/contributing/development/compiling/compiling_with_dotnet.html) Run the following in a Bash shell (use Git Bash on Windows) from inside the directory you cloned the Spine Runtimes to:

```
cd spine-godot
./build/setup.sh 4.1-stable false true
./build/build-v4.sh true
```

The first argument to `setup.sh` is the Godot repository branch or commit hash you want to build the Godot editor from. The second argument specifies whether you want to compile the editor for development. Valid values are `true` and `false`. If set to true, the build will add support for [Live++](https://liveplusplus.tech/) on Windows if you have set the `LIVEPP` environment variable to your Live++ installation directory, and disable many modules to speed up compilation. The third argument is optional and specifies whether to build with C# support. Valid values are `true` and `false`. In this case it is set to true to enable C# support.

The argument to `build-v4.sh` is optional and specifies whether to build wiht C# support. Valid values are `true` and `false`. In this case it is set to true to enable C# support.

The resulting Godot editor binary can then be found in `spine-godot/godot/bin`. 
Additionally, you will find a folder `GodotSharp` in the `spine-godot/godot/bin` directory. It contains all the C# binding assemblies for the Godot API, including the spine-godot runtime APIs. When creating a new project, you will need to wire these up via [NuGet](https://www.nuget.org/). Read the section "C# project setup" below for more information.

To build the export template for a specific platform, run the following in a Bash shell (use Git Bash on Windows):

```
cd spine-godot
./build/setup.sh 4.1-stable false
./build/build-templates-v4.sh windows
```

The first argument to `setup.sh` is the Godot repository branch or commit hash you want to build the Godot editor from. The second argument must be `false`.

The first argument to `built-templates-v4.sh` is the platform to compile the template for. Valid values are `windows`, `linux`, `macos`, `web`, `android`, and `ios`. Note that macOS and iOS export templates can only be build on a machine running macOS. See the [official instructions by Godot](https://docs.godotengine.org/en/stable/development/compiling/index.html).

The resulting Godot export template binary can then be found in `spine-godot/godot/bin`.

#### Building via GitHub Actions
The [Spine Runtimes repository](https://github.com/EsotericSoftware/spine-runtimes/issues) contains a GitHub workflows in `.github/workflows/spine-godot.yml`, `.github/workflows/spine-godot-v4.yml`, and `.github/workflows/spine-godot-v4-all.yml`that allow building all Godot editor and export template binaries through GitHub actions. This may be simpler than compiling these artifacts locally. To use the GitHub workflow:

1. Clone the [Spine Runtimes repository](https://github.com/EsotericSoftware/spine-runtimes)
2. Enable GitHub workflows on the cloned repository
3. Manually trigger the `spine-godot`, `spine-godot-v4`, or `spine-godot-v4-all` workflow.

The resulting binaries will be attached as artifacts to a successful workflow run.

## C# Project Setup
> **Note:** the spine-godot GDExtension currently does not come with [C# bindings](https://github.com/godotengine/godot-proposals/issues/8191). The instructions below are for the spine-godot C++ engine module and corresponding custom Godot Editor build provided above.

If you use our Godot editor binaries with C# support, you have to take one extra step when setting up a new Godot project.

First, create the Godot project using the Godot Editor binary with C# support you downloaded from the installation section above.

Next, close Godot and open your project folder. In the root directory, create a new folder called `godot-nuget`.

Copy the Godot C# assemblies from the downloaded Godot editor ZIP file to that folder. These are the files you need to copy:

* <code>GodotSharpEditor.&lt;version>.snupkg</code>
* <code>Godot.NET.Sdk.&lt;version>.nupkg</code>
* <code>Godot.SourceGenerators.&lt;version>.nupkg</code>
* <code>GodotSharp.&lt;version>.nupkg</code>
* <code>GodotSharp.&lt;version>.snupkg</code>
* <code>GodotSharpEditor.&lt;version>.nupkg</code>

The <code>&lt;version></code> depends on which Godot version you downloaded from this page, e.g. `4.1.1`.

When you download and extract the Godot editor ZIP, you can find these files in the following folder:

* Windows: `godot-editor-windows-mono.zip\GodotSharp\Tools\`
* Linux: `godot-editor-linux-mono.zip/GodotSharp/Tools/`
* macOS: `Godot.app/Contents/Resources/GodotSharp/Tools`, or alternatively right click the Godot.app file in Finder, select `Show Package Contents`, then navigate to `Contents/Resources/GodotSharp/Tools/`

Finally, create a new file called nuget.config in the root directory of your project with the following content:

```
<configuration>
    <packageSources>
        <!-- package source is additive -->
        <add key="godot-nuget" value="./godot-nuget" />
    </packageSources>
</configuration>
```

This configures the `godot-nuget` directory to be a package source for NuGet packages. Instead of fetching the official Godot C# assemblies from the NuGet package registry, the assemblies from the `godot-nuget` directory will be used, which also include the C# bindings for the spine-godot runtime.

You can now open your project in Godot again and use the Godot and spine-godot C# APIs instead of GDScript!

> **NOTE**: if you have previously used the official Godot C# editor build, your NuGet cache will likely have the official Godot C# assemblies in NuGet cache at `$USER_HOME/.nuget`. Sadly, NuGet will not replace those with the Spine enabled assemblies. Please clear your NuGet cache before building your Spine-enabled Godot C# project!

Please read the [official Godot C# documentation](https://docs.godotengine.org/en/stable/tutorials/scripting/c_sharp/index.html) for the details.

## Updating the spine-godot Runtime
Before updating your project's spine-godot runtime, please consult our [guide on Spine editor and runtime version management](/spine-runtime-architecture#Versioning).

To update the spine-godot GDExtension, download the latest version from the `Installation` section above and copy it to your Godot project.

To update the spine-godot C++ engine module:
1. Download the latest pre-built Godot editor binaries for the Spine Runtimes and Editor version you want to use from the `Installation` section above.
2. Download the latest pre-built Godot export template binaries for the Spine Runtimes and Editor version you want to use from the `Installation` section above.
3. Open the Godot editor and install the export templates by navigating to `Editor >  Manage export templates ...`. Click `Install from file` and select the `.tzp` you downloaded.
4. If you are switching from one Spine major version to another, re-export your Spine projects with the Spine Editor version matching the Spine Runtimes version you just updated to, and replace your old exported files in your Godot project. Open your Godot project in Godot to trigger a re-import of the updated files.
5. If you are using C# with Godot, copy the new assemblies from the `GodotSharp` directory included in the editor download to your project's `godot-nuget/` directory as described above.

# Using spine-godot
The spine-godot runtime supports loading, playback and manipulation of animations created with Spine. The [spine-godot](/git/spine-runtimes/tree/spine-godot) runtime is written in C++ and based on the generic [spine-cpp](/spine-cpp) runtime. The spine-godot runtime wraps the spine-cpp classes and functions and exposes them to GDScript and C#. In addition to exposing most of the spine-cpp API, the spine-godot runtime also provides Godot nodes to easily display and interact with Spine skeletons.

Please consult the [Spine Runtimes Guide](/spine-runtimes-guide) 
for a detailed overview of the Spine Runtime architecture.

## Asset Management
### Exporting for Godot
![](/img/spine-runtimes-guide/spine-ue4/export.png)
Please follow the instructions in the Spine User Guide on how to 

1. [Export skeleton & animation data](/spine-export)
2. [Export texture atlases containing the images of your skeleton](/spine-texture-packer)

An export of the skeleton data and texture atlas of your skeleton will yield the following files:

![](/img/spine-runtimes-guide/spine-godot/exported-files.png)

1. `skeleton-name.spine-json` or `skeleton-name.skel`, containing your skeleton and animation data.
2. `skeleton-name.atlas`, containing information about the texture atlas.
3. One or more `.png` files, each representing on page of your texture atlas containing the packed images your skeleton uses.

> **Note**: You should prefer binary skeleton exports over JSON exports, as they are smaller in size and faster to load. If you must use JSON, make sure the file extension is `.spine-json` instead of `.json`. If you have an existing project that still uses `.json` export files, you can use this [Python script](/git/spine-runtimes/spine-godot/convert.py) to convert it to the new `.spine-json` extension.

The spine-godot runtime can import these files into special Godot resource types.

> **Note**: The spine-godot runtime currently does not support atlases exported using pre-multiplied alpha due to technical limitations in Godot. Godot performs a bleed operation on non-premultiplied texture images by default. This is generally enough to avoid artifacts usually fixed by using pre-multiplied alpha.

### Importing into Godot
![](/img/spine-runtimes-guide/spine-godot/import-general.png)
1. Open your Godot project in the Godot editor.
2. Drag your `.skel/.spine-json`, `.atlas`, and `.png` files into a folder of your choice

The asset importer will create a `SpineSkeletonFileResource` for the `.skel` or `.spine-json` skeleton file, a `SpineAtlasAssetResource` for the `.atlas` file, and a Godot texture resource for each `.png` file of the atlas.

> **Note:** In the import settings of a `SpineAtlasResource` you can also specify the prefix for normal map images that should be used for each atlas page. By default, the prefix is `n`. Normal maps are required for 2D lighting support and are optional.

With the source files imported, you can now create a `SpineSkeletonDataResource`, which combines a `SpineSkeletonFileResource` and a `SpineAtlasResource` for use by a `SpineSprite`.

In the file system panel in the Godot editor, right click the folder you placed your Spine assets in, then select `New Resource...`. In the pop-up dialog, select `SpineSkeletonDataResource`, click `Create`, give the resource a name, and click `Save`.

Double-click the newly created resource so it shows up in the inspector panel. Assign the previously imported atlas resource and skeleton file resource of your skeleton. The skeleton data resource also stores [animation mix times](/spine-applying-animations#Mix-times), which you can modify in the inspector.

![](/img/spine-runtimes-guide/spine-godot/skeleton-data-resource.png)

> **Note:** A skeleton data resource for a specific skeleton file and atlas combination should be shared by all all instances of `SpineSprite` that should display this combination. Do not define skeleton data resources as inline resources in a `SpineSprite`, as that will duplicate the amount of data that is being loaded by your game.


### Updating Spine Assets
During development, you may frequently update your Spine skeleton data and texture atlas files. You can simply overwrite these source files (`.spine-json`, `.skel`, `.atlas`, `.png`) by re-exporting from the Spine Editor and replacing the existing files in your Godot project. 

The Godot editor will detect changes to these source files and re-import the assets accordingly, updating any other resources referencing these assets in the process. If the Godot editor fails to recognize the source file change, you can force a re-import in the [import settings panel](https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/import_process.html#changing-import-parameters) of the file in the Godot editor.

## Nodes
The spine-godot runtime provides you with a set of nodes that allow to display, animate, and modify skeletons exported from Spine.

### SpineSprite Node
![](/img/spine-runtimes-guide/spine-godot/sprite-node.png)

The `SpineSprite` node displays the skeleton data and atlas stored in a `SkeletonDataResource`. The node exposes an [animation state](/spine-applying-animations) through which the skeleton can be animated. The `SpineAnimationState` can be accesssed via `SpineSprite.get_animation_state()`. The node also exposes the [skeleton instance](/spine-runtime-skeletons) (`SpineSkeleton`) via `SpineSprite.get_skeleton()`, through which you can query all of a skeleton's properties, like bones, slots, attachments, skins, or constraints.

#### Creating a SpineSprite

To create a `SpineSprite` node, click the `+` button in the scene panel and select `SpineSprite`. Next, assign a `SkeletonDataResource` the `SpineSprite` node should display to the respective property in the inspector, as shown in the image above.

You can freely transform the `SpineSprite` node in the Godot editor viewport using the respective tools and keyboard shortcuts. The in-editor bounding box of the `SpineSprite` coincides with the bounding box the skeleton has in the Spine Editor in setup mode.

#### Inspecting bones, slots, and attachments
Once you have assigned a `SkeletonDataResource` to a `SpineSprite`, you can inspect the bones, slots, and attachments of the skeleton.

Select the `SpineSprite` in the editor viewport. In the `Debug` property section, check the skeleton components you want to inspect.

![](/img/spine-runtimes-guide/spine-godot/debug.png)

You can hover your mouse in the editor viewport over parts you are interested in to show their names.

#### Previewing animations
The `Preview` property section lets you set an animation to be played back right in the editor viewport.

![](/img/spine-runtimes-guide/spine-godot/preview.png)

When `Preview Frame` is checked, the animation frame at the current `Preview Time` is displayed. You can scrub through the animation via the `Preview Time` slider.

#### Setting custom materials
The `Materials` property section lets you set a custom material for each supported Spine blend mode. The materials will be applied to all slots and their attachments in the `SpineSprite`.

![](/img/spine-runtimes-guide/spine-godot/materials.png)

You can use the `SpineSlotNode` to set materials for a single slot, which will ovewrite the custom materials set on the `SpineSprite`.

See the `example/09-custom-material` scene in the example project.

#### Setting the Update Mode
By default, a `SpineSprite` updates its underlying data as fast as possible, every frame. Changing this behaviour can be done via the `Update Mode` property.

![](/img/spine-runtimes-guide/spine-godot/update-mode.png)

The `Process` mode is the default and is dependent on the frame rate. The `Physics` mode updates the `SpineSprite` in fixed intervals (60 times per second by default) and is useful for code related to the Godot physics engine. The `Manual` mode disables all automatic updates. When set, the `SpineSprite` needs to be updated manually when overriding `_process(delta)` or `_physics_process(delta)` by calling `SpineSprite.update_skeleton()`. This mode gives full control over when a `SpineSprite` is  updated.

See [Idle and Physics Processing](https://docs.godotengine.org/en/stable/tutorials/scripting/idle_and_physics_processing.html) in the official Godot documentation for more information.

#### Animating a `SpineSprite`
Animating a `SpineSprite` is done in code via GDScript or C#. Below, you'll find example code using GDScript which directly translates to the spine-godot C# API as well. See the [Godot C# documentation](https://docs.godotengine.org/en/stable/tutorials/scripting/c_sharp/index.html) on how the APIs are mapped from GDScript to C#.

The `SpineSprite` exposes a `SpineAnimationState` via `get_animation_state()`. See [Applying Animations](/spine-applying-animations#AnimationState-API) in the Spine Runtimes Guide for more in-depth information, specifically about animation tracks and animation queueing.

To set a specific animation on track 0 of a `SpineSprite`, call `SpineAnimationState.set_animation()`:

```
extends SpineSprite

func _ready():
   var animation_state = get_animation_state()
   animation_state.set_animation("walk", true, 0)
```

The first parameter is the name of the animation, the second parameter specifies whether to loop the animation, and the last parameter specifies the animation track the animation should be played back on.

Queuing animations is also done through the animation state methods:

```
extends SpineSprite

func _ready():
   var animation_state = get_animation_state()
   animation_state.set_animation("idle", true, 0)
   animation_state.add_animation("walk", 0.5, true, 0)
```

The first parameter to `add_animation()` is the animation name. The second parameter specifies the delay in seconds, after which this animation should replace the previous animation on the track. The third parameter specifies whether the animation should be looped. The final parameter specifies the track the animation should be played back on.

When setting or adding an animation to an animation state track, a `SpineTrackEntry` is returned, which allows to further modify the properties of this specific animation playback. For example, you can set the track entry to reverse the animation playback:

```
var track_entry = animation_state.add_animation("walk", 0.5, true, 0)
track_entry.set_reverse(true)
```

> **Note:** Do not hold on to `SpineTrackEntry` instance outside the function you are using them in. Track entries are re-used internally and will thus become invalid once the animation it represents has been completed.

You can set or queue empty animations on an animation track to smoothly reset the skeleton back to the setup pose via the `set_empty_animation()` and `add_empty_animation()`:

```
animation_state.set_empty_animation(0, 0.5)
animation_state.add_empty_animation(0, 0.5, 0.5)
```

The first parameter to `set_empty_animation()` specifies the track. The second parameter specifies the mix duration in seconds used to mix out the previous animation and mix in the "empty" animation.

The first parameter to `add_empty_animation()` specifies the track.  The second parameter specifies the mix duration in seconds used to mix out the previous animation and mix in the "empty" animation. The third parameter is the delay in seconds, after which the "empty" animation should replace the previous animation on the track via mixing.

All animations on a track can be cleared immediately via `clear_track(track_id)`. To clear all tracks at once, `clear_tracks()` can be used. This will leave the skeleton in the last pose it was in.

To reset the pose of a skeleton to the setup pose, use `SpineSprite.get_skeleton().set_to_setup_pose()`. This will reset both bones and slots to their setup pose configuration. Use `SpineSprite.get_skeleton().set_slots_to_setup_pose()` to only reset the slots to their setup pose configuration.

#### Signals
A `SpineSprite` exposes multiple signals to react to events throughout its life-cycle.

To react to changes of the animation state, you can connect to these signals:

* `animation_started`, emitted when an animation has started.
* `animation_interrupted`, emitted when the animation's track was cleared, or a new animation was set.
* `animation_completed`, emitted whenever an animation on a track completes a loop.
* `animation_ended`, emitted when the animation will never be applied again.
* `animation_disposed`, emitted when the animation track entry is disposed.
* `animation_event`, emitted when a user defined [event](/spine-events#Events) happened.

In addition to animation state events, a `SpineSprite` also exposes signals for its higher-level life-cycle:

* `before_animation_state_update`, emitted before the animation state is updated with the current delta time.
* `before_animation_state_apply`, emitted before the animation state is applied to the skeleton pose.
* `before_world_transforms_change`, emitted before the world transforms of the skeleton's bones are updated.
* `world_transforms_changed`, emitted after the world transforms of the skeleton's bones are updated.

These signals can come in handy when updating bones or other skeleton components manually. Generally, it is advised to use `SpineBoneNode` or `SpineSlotNode` instead, as they hide the intricacies of such manual updates, while covering 99% of the uses cases, like positioning a bone based on a mouse cursor position.

See `example/02-animation-state-listeners` scene in the example project.

#### Mix-and-match Skins
![](/img/spine-runtimes-guide/spine-godot/mix-and-match.png)

Many applications and games allow their users to create custom avatars out of many individual items, such as hair, eyes, pants, or accessories like earrings or bags. In Spine, this can be achieved by [mixing and matching skins](/spine-examples-mix-and-match).

You can create custom skins from other skins as follows:

```
var custom_skin = new_skin("custom-skin")
var data = get_skeleton().get_data()
custom_skin.add_skin(data.find_skin("skin-base"))
custom_skin.add_skin(data.find_skin("nose/short"))
custom_skin.add_skin(data.find_skin("eyelids/girly"))
custom_skin.add_skin(data.find_skin("eyes/violet"))
custom_skin.add_skin(data.find_skin("hair/brown"))
custom_skin.add_skin(data.find_skin("clothes/hoodie-orange"))
custom_skin.add_skin(data.find_skin("legs/pants-jeans"))
custom_skin.add_skin(data.find_skin("accessories/bag"))
custom_skin.add_skin(data.find_skin("accessories/hat-red-yellow"))
get_skeleton().set_skin(custom_skin)
get_skeleton().set_slots_to_setup_pose()
```

Create a custom skin via `SpineSprite.new_skin(name)`. Next, fetch the `SpineSkeletonData` from the `SpineSkeleton` the `SpineSprite` manages. This is used to look up skins by name via `SpineSkeletonData.find_skin()`. Add all the skins you want to combine via `SpineSkin.add_skin()`. Finally, set the new skin on the skeleton via `SpineSkeleton.set_skin()`.

See the `example/03-mix-and-match` scene in the example project.

#### Getting and setting bone transforms
A `SpineSprite` wraps a Spine [runtime skeleton](/spine-runtime-skeletons), which itself consists of bones, slots, attachments, and constraints. The skeleton manages the transforms of bones in a coordinate system relative to the skeleton's origin in the Spine Editor.

The `SpineSprite` class exposes the helper methods `get_global_bone_transform(name)` and `set_global_bone_transform(name, transform)` to let you get and set a bone's transform in the Godot canvas space. Note that a retrieved or set transform will not encode skew.

If you want to set the transform of a bone manually, you must do so before the `SpineSprite` updates the world transforms of the skeleton's bones. This can be done in reaction to the `before_world_transforms_change` signal.

An alternative to setting a bone's transform directly is to use a `SpineBoneNode`.

### SpineBoneNode
![](/img/spine-runtimes-guide/spine-godot/bone-node.png)
A `SpineBoneNode` can either follow a skeleton's bone, or drive its transform. Use a `SpineBoneNode` in drive mode in scenarios where you want to control the transform of a bone based on some input, e.g. the mouse position. Use a `SpineBoneNode` in follow mode if you want another node to follow a bone in a skeleton, e.g. to attach a `CollisionShape` to a bone of a `SpineSprite`.

To create a `SpineBoneNode`, right-click the `SpineSprite` you want to attach the node to, and select `Add child node...`. Select `SpineBoneNode` from the list of available node types and give it a name. You can then modify the node's configuration in the inspector.

> **Note**: A `SpineBoneNode` must always be a direct child of a `SpineSprite`, otherwise it will be unable to locate the bone it should follow or drive.

![](/img/spine-runtimes-guide/spine-godot/bone-node-properties.png)

The `Bone Name` property dropdown displays all available bones to select from. The `Bone Mode` specifies whether the node should follow a bone in the `SpineSprite` or drive it. The node can be enabled or disabled, allowing to turn following and driving on and off on demand.

The `SpineBoneNode` will also be displayed in the editor viewport. The properties in the `Debug` section define its appearance.

See the `example/05-mouse-following` scene for an example on how to use a `SpineBoneNode` to drive a bone inside a `SpineSprite` using mouse movement.

See the `example/06-bone-following` scene for an example on how to use a `SpineBoneNode` to follow a bone in a `SpineSprite`. In this example, the `SpineBoneNode` itself has a child, which will appear to follow the bone in the `SpineSprite`.

> **Note:** The child node will not be properly inserted into the `SpineSprite` drawing order. The `SpineSlotNode` is better suited for use cases, where you want to insert arbitrary nodes into the drawing order of the parts making up a `SpineSprite`.

### SpineSlotNode
![](/img/spine-runtimes-guide/spine-godot/slot-node.png)

A `SpineSlotNode` lets you insert your own nodes into the drawing order of a `SpineSprite`. It can be used to attach particle system, custom sprites, or even other `SpineSprite` nodes to specific [slots](/spine-slots) of the skeleton. The children of the `SpineSlotNode` will be rendered on top of any active attachment of the slot. You can also use a `SpineSlotNode` to override the materials of a specific slot.

To create a `SpineSlotNode`, right-click the `SpineSprite` you want to attach the node to, and select `Add child node...`. Select `SpineSlotNode` from the list of available node types and give it a name. You can then modify the node's configuration in the inspector.

> **Note**: A `SpineSlotNode` must always be a direct child of a `SpineSprite`, otherwise it will be unable to locate the slot it is assigned to.

![](/img/spine-runtimes-guide/spine-godot/slot-node-properties.png)

The `Slot Name` property dropdown displays all available slots to select from. The `Materials` section lets you set the materials that should be used to override the default materials of this slot.

See the `example/07-slot-node` scene for an example on how to use a `SpineSlotNode` to insert nodes into the drawing order of a `SpineSprite`.

See the `example/09-custom-material` scene for an example on how to use a `SpineSlotNode` to override the materials of a specific slot in a `SpineSprite`.

### SpineAnimationTrack
![](/img/spine-runtimes-guide/spine-godot/animation-track.png)

> **Note:** `SpineAnimationTrack` is highly experimental due to Godot's animation engine not being open enough for 3rd party plugins to support the full fidelty as found in e.g. animation imported 3D characters. It is not available in the spine-godot GDExtension.

A `SpineAnimationTrack` node lets you animate a `SpineSprite` via Godot's [animation player](https://docs.godotengine.org/en/stable/classes/class_animationplayer.html) and powerful [animation editor](https://docs.godotengine.org/en/stable/tutorials/animation/introduction.html). It's ideally suited to create cut scenes using Godot's animation editor instead of handcrafting them by code.

To create a `SpineAnimationTrack`, right-click the `SpineSprite` you want to attach the node to, and select `Add child node...`. Select `SpineAnimationTrack` from the list of available node types and give it a name. You can then modify the node's configuration in the inspector.

> **Note**: A `SpineAnimationTrack` must always be a direct child of a `SpineSprite`, otherwise it will be unable to locate the slot it is assigned to.

When creating a `SpineAnimationTrack`, an `AnimationPlayer` node is created and attached as a child.

A `SpineSprite` is then animated by keying both the `SpineAnimationTrack` and its child `AnimationPlayer`. You set the animation to be played back by keying the child `AnimationPlayer`. To modify animation properties, like whether it should be looped, played in reverse, and so on, you key the `SpineAnimationTrack` properties.

This two tiered setup allows the animation editor to display the duration of keyed animations of the child `AnimationPlayer`, which makes creating complex animation sequences a lot easier. It also allows scrubbing the timeline in the animation editor for previewing.

> **Note:** Mix times defined in the `SpineSkeletonDataResource` used by a `SpineSprite` can not be previewed in the editor due to technical limitations of the Godot animation editor.

You can attach multiple `SpineAnimationTrack` nodes to a single `SpineSprite`. This can be used to layer multiple animations on top of each other. Each `SpineAnimationTrack` is assigned a [track index](/spine-applying-animations#Tracks). Animations on higher tracks override effects of animations on lower tracks if they key the same skeleton property.

See the `example/08-animation-player` scene for an example. The `AnimationPlayer` attached to the root of the scene has two animations that key the `SpineAnimationTrack` nodes and their child `AnimationPlayer` nodes. The `slow-moonwalk` animation is a simple illustration of the basic principles of `SpineAnimationTrack`. The `cutscene` animation is a more elaborate animation, demonstrating multi-track keying and complex animation sequences.

# 2D Lighting
![](/img/spine-runtimes-guide/spine-godot/2d-lighting.png)

spine-godot integrates with [Godot's 2D lighting system](https://docs.godotengine.org/en/stable/tutorials/2d/2d_lights_and_shadows.html).

To support Godot's 2D lighting system, you must provide normal maps for your texture atlas. Each `.png` making up a texture atlas page must have a corresponding `.png` normal map image next to it in the file hierarchy. The normal map image files must have a common prefix. The default prefix is `n_`. E.g. a texture atlas page image called `raptor.png` must have a normal map image called `n_raptor.png` next to it.

Upon importing a texture atlas, spine-godot will try to locate and load normal map images for each texture atlas page image. You can define your own normal map image prefix in the texture atlas import view.

![](/img/spine-runtimes-guide/spine-godot/normal-map.png)

Once the texture atlas page and normal map images have been successfully imported, you can apply Godot's 2D lighting system to your `SpineSprite` nodes.

See the `10-2d-lighting` scene in the examples.

# Loading .skel/.json/.atlas files from disk
For modding purposes, it might be useful to be able to load export Spine assets from an arbitrary location on disk. You can achieve this by using the `SpineSkeletonFileResource.load_from_file()` function for `.skel` and `.json` skeleton files, and the `SpineAtlasResource.load_from_atlas_file()` function for `.atlas` files.

The general principle:
- Load the skeleton file
- Load the atlas file
- Construct a `SpineSkeletonDataResource` from the skeleton and atlas
- Create one or more `SpineSprite` instances from the `SpineSkeletonDataResource`. The data resource is shared!

The whole process in GDScript:

```
	# Load the skeleton file
	var skeleton_file_res = SpineSkeletonFileResource.new();
	skeleton_file_res.load_from_file("/Users/badlogic/workspaces/spine-runtimes/examples/coin/export/coin-pro.skel");
	
	# Load the atlas file
	var atlas_res = SpineAtlasResource.new();
	atlas_res.load_from_atlas_file("/Users/badlogic/workspaces/spine-runtimes/examples/coin/export/coin.atlas");
	
	# Create a skeleton data resource, you can share this across multiple sprites
	var skeleton_data_res = SpineSkeletonDataResource.new();
	skeleton_data_res.skeleton_file_res = skeleton_file_res;
	skeleton_data_res.atlas_res = atlas_res
	
	# Create a sprite from the skeleton data and add it as a child
	var sprite = SpineSprite.new();
	sprite.skeleton_data_res = skeleton_data_res;
	sprite.position.x = 200;
	sprite.position.y = 200;
	sprite.get_animation_state().set_animation("animation", true, 0);
	self.add_child(sprite)
```

See also the `13-load-from-disk` example.

# Spine Runtimes API access
spine-godot maps almost all of the Spine Runtime API to GDSCript. Objects returned by `SpineSprite`, like `SpineSkeleton` via `SpineSprite.get_skeleton()` are 1:1 translations of the spine-cpp API to GDScript. You can thus apply almost all of the materials in the generic [Spine Runtimes Guide](/spine-runtimes-guide) to your GDScripts.

Due to the nature of GDScript, there are however a few limitations:

* Any returned array or map is a copy of the internal array. Modification will not have an effect.
* You can not set listeners on individual `SpineTrackEntry` objects. Setup signals on `SpineSprite` instead.
* You can not create, add or remove bones, slots, and other Spine objects directly.
* The C++ class hierarchies of attachments and timelines are not exposed in GDScript.

---
## File: Runtimes, spine-haxe/spine-haxe.md
## Title: spine-haxe Runtime Documentation
## URL: http://esotericsoftware.com/spine-haxe
---

# spine-haxe Runtime Documentation

> **Licensing**
>
> See the [Spine Runtimes License](/spine-runtimes-license) before integrating the Spine Runtimes into your applications.

# Getting Started
The spine-haxe runtime is composed of a core module, that is a Haxe implementation of the renderer-agnostic Spine Runtimes core APIs, and the following specific renderer implementations:
 - [Starling](https://lib.haxe.org/p/starling/)
 - [HaxeFlixel](https://lib.haxe.org/p/flixel/) (minimum supported version 5.9.0)

The spine-haxe has been tested using HTML5 as target and it is currently compatible with [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) to render. It supports all Spine features except premultiplied alpha atlases and two color tinting.

## Installation
The core module of spine-haxe has zero dependencies.

The starling rendering implementation has two dependencies: openfl and starling.
```plain
haxelib install openfl
haxelib install starling
```

The haxeflixel rendering implementation has two dependencies: openfl and flixel. We recommend to follow the installation guide on the [HaxeFlixel](https://haxeflixel.com/documentation/install-haxeflixel/) website.

Once you have installed the dependencies, you can [download the latest version of spine-haxe](/files/spine-haxe/4.2/spine-haxe-latest.zip) and install it:

```plain
haxelib install spine-haxe-x.y.z.zip
```

Notice that the spine-haxe library is not available on [lib.haxe.org](https://lib.haxe.org/). This is why you need to download the library and install it through the zip archive.

## Examples
The spine-haxe runtime includes several examples demonstrating its feature set.

To run the examples locally:

1. Install Git and [Haxe](https://haxe.org/download/) for your operating system
2. Configure haxelib and install all necessary dependencies

```plain
haxelib setup
haxelib install openfl
haxelib run openfl setup
haxelib install starling
haxelib install flixel
```

3. Clone the spine-runtimes repository, navigate to the `spine-runtimes/spine-haxe` folder, and run lime with the test command:

```plain
git clone https://github.com/esotericsoftware/spine-runtimes
cd spine-runtimes/spine-haxe
haxelib dev spine-haxe .
lime test html5
```

This builds the spine-haxe runtime, then opens a browser window displaying the examples in a webpage.
Click on the Starling or HaxeFlixel button to start the examples for the specific runtime. Then click on the frame, or on the button, to go through all the examples, and check out the code in the [`spine-runtimes/spine-haxe/example/src`](/git/spine-runtimes/spine-haxe/example/src) folder.

## Updating the spine-haxe Runtime
Before updating your project's spine-haxe runtime, please consult our [guide on Spine editor and runtime version management](/spine-runtime-architecture#Versioning).

To update the spine-haxe runtime download the desired version from `https://esotericsoftware.com/files/spine-haxe/4.2/spine-haxe-x.y.z.zip` changing `x.y.z` respectively. Then run `haxelib install spine-haxe:x.y.z.zip`.

> **Note:** If you change the `major.minor` version of the spine-haxe package, you have to re-export your Spine skeletons with the same Spine Editor `major.minor` version! See [Synchronizing versions](/spine-versioning#Synchronizing-versions) for more information.

# Using spine-haxe
The spine-haxe runtime supports all Spine features except premultiplied alpha atlases and two color tinting.

spine-haxe works using starling or haxeflixel as framework. It has been tested using HTML5 as target and it is currently compatible with [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) to render. It is not supported rendering via the [Canvas APIs](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

We try to keep the class names and API as similar as possible between frameworks. Right now, the main difference is how bounds are calculated.

## Asset Management
### Exporting for spine-haxe

![](/img/spine-runtimes-guide/spine-ue4/export.png)

Follow the instructions in the Spine User Guide on how to:

1. [Export skeleton & animation data](/spine-export)
2. [Export texture atlases containing the images of your skeleton](/spine-texture-packer)

An export of the skeleton data and texture atlas of your skeleton will yield the following files:

![](/img/spine-runtimes-guide/spine-ue4/exported-files.png)

1. `skeleton-name.json` or `skeleton-name.skel`, containing your skeleton and animation data, either in the JSON or binary format.
2. `skeleton-name.atlas`, containing information about the texture atlas.
3. One or more `.png` files, each representing one page of your texture atlas containing the packed images your skeleton uses.

> **Note**: You should prefer binary skeleton exports over JSON exports, as they are smaller in size and faster to load.

When serving these files, make sure the server emits the correct MIME types.

### Updating Spine Assets
During development, you may frequently update your Spine skeleton data and texture atlas files. You can simply overwrite these source files (.json, .skel, .atlas, .png) by re-exporting from the Spine Editor and replacing the existing files in your Haxe project.

Ensure that the `major.minor` version of spine-haxe matches the `major.minor` Spine Editor version you are exporting from. See [Synchronizing versions](/spine-versioning#Synchronizing-versions) for more information.

## Core classes
The spine-haxe API is built on top of the a generic Haxe runtime that does not depend on starling and openfl. It provides platform independent core classes and algorithms to load, query, modify, and animate Spine skeletons.

Here, we will briefly discuss the most important core classes that you will  encounter in your day-to-day use of spine-haxe. Please consult the [Spine Runtimes Guide](/spine-runtimes-guide)
for a detailed overview of the Spine Runtimes architecture, core classes, and API usage.

The [`TextureAtlas`](/git/spine-runtimes/spine-ts/spine-core/src/TextureAtlas.ts) class stores the data loaded from an `.atlas` file and its corresponding `.png` image files.

The [`SkeletonData`](/git/spine-runtimes/spine-ts/spine-core/src/SkeletonData.ts) class stores the data loaded from a `.json` or `.skel` skeleton file.  The skeleton data contains information about the bone hierarchy, slots, attachments, constraints, skins, and animations. A `SkeletonData` instance is usually loaded by also providing an `Atlas` from which it sources the images to be used by the skeleton it represents. It serves as a blueprint for creating `Skeleton` instances. Multiple skeletons can be instantiated from the same atlas and skeleton data, which then share the loaded data, minimizing both load times and memory consumption at runtime.

The [`Skeleton`](/git/spine-runtimes/spine-ts/spine-core/src/Skeleton.ts) class stores an instance of a skeleton, created from a `SkeletonData` instance. A skeleton stores its current pose, that is the position of bones and the current configuration of slots, attachments, and active skin. The current pose can be computed by either manually modifying the bone transforms, or, more commonly, by applying animations via an `AnimationState`.

The [`AnimationState`](/git/spine-runtimes/spine-ts/spine-core/src/AnimationState.ts) class is responsible for keeping track of which animation(s) should be applied to a skeleton, advancing and mixing those animations based on the elapsed time between the last and current rendering frame, and applying the animations to a skeleton instance, thereby setting its current pose. The `AnimationState` queries an [`AnimationStateData`](/git/spine-runtimes/spine-ts/spine-core/src/AnimationStateData.ts) instance to retrieve mixing times between animations, or fetches the default mix time if no mixing time is available for a pair of animations.

The spine-haxe runtime for starling builds on top of these core classes.

## Spine Haxe runtime for starling
The spine-haxe for starling exposes two classes: [`StarlingTextureLoader`](/git/spine-runtimes/spine-haxe/spine-haxe/spine/starling/StarlingTextureLoader.hx) and [`SkeletonSprite`](/git/spine-runtimes/spine-haxe/spine-haxe/spine/starling/SkeletonSprite.hx).

`StarlingTextureLoader` is an implementation of the spine [`TextureLoader`](/spine-loading-skeleton-data#TextureLoader) to create and dispose images in starling.

`SkeletonSprite` is an extension of the starling [`DisplayObject`](https://doc.starling-framework.org/current/starling/display/DisplayObject.html) to play spine animations.

### Loading Spine Assets
Spine assets, like skeleton data `.json`/`.skel` files, or `.atlas` files, are loaded through the openfl [`Assets`](https://api.openfl.org/openfl/utils/Assets.html) class.

Before an instance of a `SkeletonSprite` can be created, the respective skeleton and atlas files must be loaded. You can use:

* `Assets.getText(string)`: loads text based assets like `.json` and `.atlas` files.
* `Assets.getBytes(string)`: loads binary based asset like `.skel` files.

Assuming you have exported your skeleton data to a binary skeleton file called `skeleton.skel`, and your atlas to a file called `skeleton.atlas` with one corresponding `skeleton.png` file, you can load your assets like this:

```haxe
var atlasFile = Assets.getText("skeleton.atlas");
var skeletonFile = Assets.getBytes("skeleton.skel");
```

Once assets are loaded, you need to get instances of a `TextureAtlas` and a `SkeletonData`:

```haxe
var atlas = new TextureAtlas(atlasFile, new StarlingTextureLoader("skeleton.atlas"));
var skeletondata = SkeletonData.from(skeletonFile, atlas);
```

Notice how the `TextureAtlas` constuctor needs an instance of `StarlingTextureLoader`. You have to provide the name of the atlas file to the `StarlingTextureLoader`. The individual texture atlas page images are loaded transparently without the need for explicitly loading them.

The skeleton raw data and atlas on their own can not be animated or rendered. Instead, a [`SkeletonSprite`](/git/spine-runtimes/spine-haxe/spine-haxe/spine/starling/SkeletonSprite.hx) is constructed from them. `SkeletonSprite`s instantiated with the same assets share the same skeleton data and atlas.

### Creating SkeletonSprite instances
Once skeleton raw data and a corresponding atlas have been loaded, you need to instantiate an `AnimationStateData` before being able to instantiate a `SkeletonSprite`:

```haxe
var animationStateData = new AnimationStateData(skeletondata);
```

Now you can instantiate the `SkeletonSprite`:

```haxe
// Instantiate the SkeletonSprite
var skeletonSprite = new SkeletonSprite(skeletondata, animationStateData);

// Add the SkeletonSprite as a child of the DisplayObject in the stage
addChild(spineboy);
```

The `SkeletonSprite` constructor takes the `SkeletonData` and the `AnimationStateData` to make an instance.

### Bounds
To get the bounds of your skeleton, you can call the `getBounds()` function on the skeleton. You can also call `getAnimationBounds(string, bool)` function on the `SkeletonSprite` to get a `Rectangle` containing the animation whose name is provided as first parameter. The second parameter is a boolean to take the clipping attachments into consideration during the bounds calculation.
Be aware that the `getBounds(DisplayObject)` on the `SkeletonSprite` always returns a `Rectangle` with size 0, 0, so you should not use it. This behaviour is necessary to render Spine animations correctly in starling, as suggested in the starling [forum](https://forum.starling-framework.org/d/6030-rendering-issues-w-custom-displayobject).

## Spine Haxe runtime for haxeflixel
Everything explained in the paragraph dedicated to starling is valid also for haxeflixel.
The exceptions are:
 - `SkeletonSprite` is an extension of [`FlxObject`](https://api.haxeflixel.com/flixel/FlxObject.html)
 - `StarlingTextureLoader` is named `FlixelTextureLoader`, but has the same purpose and API.
 - Bounds can be set using `setBoundingBox(?animation:Animation, ?clip:Bool = true)`. When the `SkeletonSprite` is created, the `setBoundingBox` is invoked without any parameter using the setup pose to determine the bounds. If you pass an animation, the bounds will match its size. The clip parameter lets you include or ignore clipping attachments in the calculation.

## SkeletonSprite
A `SkeletonSprite` handles storing, updating, and rendering a `Skeleton` and its associated `AnimationState`. `SkeletonSprite` instances are created from a skeleton data and an atlas, as described in the previous section. The `Skeleton` and `AnimationState` are accessible through the `skeleton` and `state` fields respectively.

Every frame, the `SkeletonSprite` will:

* Update the `AnimationState`
* Apply the `AnimationState` to the `Skeleton`
* Update the `Skeleton` world transforms, resulting in a new pose
* Render the `Skeleton` in its current pose

### Applying Animations
Applying animations to a skeleton displayed by a `SkeletonSprite` container is done using `AnimationState`.

> **Note:** See [Applying Animations](/spine-applying-animations#AnimationState-API) in the Spine Runtimes Guide for more in-depth information, specifically about animation tracks and animation queueing.

To set a specific animation on track 0, call AnimationState `setAnimation`:

```haxe
spineObject.state.setAnimation(0, "walk", true);
```

The first parameter specifies the track, the second parameter is the name of the animation, and the third parameter defines whether to loop the animation.

You can queue multiple animations using `addAnimation`:

```haxe
spineObject.state.setAnimation(0, "walk", true);
spineObject.state.addAnimation(0, "jump", 2, false);
spineObject.state.addAnimation(0, "run", 0, true);
```

The first parameter to `addAnimation` is the track. The second parameter is the name of the animation. The third parameter specifies the delay in seconds, after which this animation should replace the previous animation on the track. The final parameter defines whether to loop the animation.

In the example above, the `"walk"` animation is played back first. 2 seconds later, the `"jump"` animation is played back once, followed by a transition to the `"run"` animation, which will be looped.

When transitioning from one animation to another, `AnimationState` will mix (crossfade) the animations for a specific duration. These mix durations are defined in an `AnimationStateData` instance, from which the `AnimationState` retrieves them.

The `AnimationStateData` instance is also available through the `AnimationState.data` property. You can set the default mix duration, or the mix duration for a specific pair of animations:

```
spineObject.state.data.setDefaultMix = 0.2;
spineObject.state.data.setMixByName("walk", "jump", 0.1);
```

When setting or adding an animation, a `TrackEntry` object is returned, which allows further modification of that animation's playback. For example, you can set the mix duration or reverse the animation playback:

```
const entry = spineObject.state.setAnimation(0, "walk", true);
entry.reverse = true;
```

See the [`TrackEntry` class documentation](/git/spine-runtimes/spine-ts/spine-core/src/AnimationState.ts#L785) for more options.

> **Note:** Be careful about holding on to `TrackEntry` instances outside the function you are using them in. Track entries are re-used internally and will thus become invalid once the track entry [dispose event](/spine-api-reference#AnimationStateListener-dispose) occurs.

You can use empty animations to smoothly mix the skeleton from the setup pose to an animation, or from an animation to the setup pose:

```
spineObject.state.setEmptyAnimation(0, 0);
spineObject.state.addAnimation(0, "walk", 0).mixDuration = 0.5;
spineObject.state.addEmptyAnimation(0, 0.5, 6);
```

Like `setAnimation`, the first parameter to `setEmptyAnimation()` specifies the track. The second parameter specifies the mix duration in seconds used to mix out the previous animation and mix in the "empty" animation.

Like `addAnimation`, the first parameter to `addEmptyAnimation()` specifies the track. The second parameter specifies the mix duration. The third parameter is the delay in seconds, after which the empty animation should replace the previous animation on the track via mixing.

All animations on a track can be cleared immediately via `AnimationState.clearTrack()`. To clear all tracks at once, `AnimationState.clearTracks()` can be used. This will leave the skeleton in the last pose it was in, which is not usually desired. Instead, use empty animations to mix smoothly to the setup pose.

To reset a skeleton to its setup pose, use `Skeleton.setToSetupPose()`:

```
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

```haxe
// add callback to the AnimationState
spineObject.state.onStart.add(entry -> trace('Started animation ${entry.animation.name}'));
spineObject.state.onInterrupt.add(entry -> trace('Interrupted animation ${entry.animation.name}'));
spineObject.state.onEnd.add(entry -> trace('Ended animation ${entry.animation.name}'));
spineObject.state.onDispose.add(entry -> trace('Disposed animation ${entry.animation.name}'));
spineObject.state.onComplete.add(entry -> trace('Completed animation ${entry.animation.name}'));
spineObject.state.onEvent.add((event entry) -> trace('Custom event for ${entry.animation.name}: ${event.data.name}'));

// add callback to the TrackEntry
var trackEntry = spineObject.state.setAnimationByName(0, "walk", true);
trackEntry.onEvent.add((entry, event) => trace('Custom event for ${entry.animation.name}: ${event.data.name}'));
```

See the [`EventsExample.hx`](/git/spine-runtimes/spine-haxe/example/src/EventsExample.hx) example.

## Skins
Many applications and games allow users to create custom avatars out of many individual items, such as hair, eyes, pants, or accessories like earrings or bags. With Spine, this can be achieved by [using skins](/spine-examples-mix-and-match).

You can create custom skins from other skins like this:

```haxe
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
spineObject.skeletonskin = skin;
spineObject.skeleton.setToSetupPose();
```

Create a new, empty skin with the `Skin()` constructor.

Next, fetch the `SkeletonData` from the skeleton. It is used to look up skins by name via `SkeletonData.findSkin()`.

Add all the skins you want to combine into the new skin via `Skin.addSkin()`.

Finally, set the new skin on the `Skeleton` and call `Skeleton.setSlotsToSetupPose()` to ensure no attachments from previous skins and/or animations are left attached.

See [`MixAndMatchExample.hx`](/git/spine-runtimes/spine-haxe/example/src/MixAndMatchExample.hx) for full example code.

## Setting Bone Transforms
When authoring a skeleton in the Spine Editor, the skeleton is defined in what is called the skeleton's world coordinate system or "skeleton coordinate system". This coordinate system may not align with the coordinate system of Haxe. Mouse and touch coordinates relative to the `SkeletonSprite` need thus be converted to the skeleton coordinate system, e.g. if a user should be able to move a bone by touch.

The `SkeletonSprite` offers the method `haxeWorldCoordinatesToBone(point, bone)` which takes a point relative to the `SkeletonSprite` and converts it to the skeleton's coordinate system, relative to the specified bone.

The reverse, that is converting from the skeleton coordinate system to the Haxe coordinate system, can be achieved via `SkeletonSprite.skeletonToHaxeWorldCoordinates(point)`.

See [`ControlBonesExample.hx`](/git/spine-runtimes/spine-haxe/example/src/ControlBonesExample.hx) for full example code.

## Spine Runtimes API access
spine-haxe for starling and haxeflixel exposes the entire core APIs via the `SkeletonSprite` properties `skeleton`, `state`, and `state.data`. See the JS doc documentation of these classes as well as the generic [Spine Runtimes Guide](/spine-runtimes-guide).

## Minimal project setup
If you just want to run a Spine animation in Haxe, or you want to start a project with a Spine animation, you can follow these steps.

### Starling minimal project
Once you have installed all the [necessary dependencies](#Installation), create a new project using:
```plain
openfl create starling:project MySpineProject
```

This will create a folder named `MySpineProject` containing all the files needed to run an empty project with OpenFL.
Open `MySpineProject` with your favorite haxe IDE. Copy your assets into the `Assets` folder. Edit the `project.xml` file and add spine-haxe as a dependency like this:

```xml
<haxelib name="spine-haxe" />
```

If you want to load a `.skel` binary skeleton, replace this line:
```xml
<assets path="Assets" rename="assets" />
```
With the following (otherwise openfl will load `skel` files as text, corrupting them):

```xml
<assets path="Assets" rename="assets" exclude="*.skel"/>
<assets path="Assets" rename="assets" include="*.skel" type="binary" />
```

Open the `Source/Game.hx` file and change the costructor with the following one:
```haxe
public function new () {
    super ();
    var atlas = new TextureAtlas(
        Assets.getText("assets/raptor.atlas"),
        new StarlingTextureLoader("assets/raptor-pro.atlas"));
    var skeletondata = SkeletonData.from(Assets.getText("assets/raptor-pro.json"), atlas, .5);
    var animationStateData = new AnimationStateData(skeletondata);
    var skeletonSprite = new SkeletonSprite(skeletondata, animationStateData);
    skeletonSprite.x = Starling.current.stage.stageWidth / 2;
    skeletonSprite.y = Starling.current.stage.stageHeight * .75;
    skeletonSprite.state.setAnimationByName(0, "walk", true);
    addChild(skeletonSprite);
    Starling.current.juggler.add(skeletonSprite);
}
```
Don't forget to import the necessary classes. Now run you code from you IDE or using the following command from the terminal on your project folder:
```
lime test html5
```

### Haxeflixel minimal project
Once you have installed all the [necessary dependencies](#Installation), create a new project using:
```plain
haxelib run flixel tpl -n "MySpineProject"
```

This will create a folder named `MySpineProject` containing all the files needed to run an empty project with OpenFL.
Open `MySpineProject` with your favorite haxe IDE. Copy your assets into the `assets` folder. Edit the `Project.xml` file and add spine-haxe as a dependency like this:

```xml
<haxelib name="spine-haxe" />
```

If you want to load a `.skel` binary skeleton, replace this line:
```xml
<assets path="assets" />
```
With the following (otherwise openfl will load `skel` files as text, corrupting them):

```xml
<assets path="assets" exclude="*.skel"/>
<assets path="assets" include="*.skel" type="binary" />
```

Open the `source/PlayState.hx` file and change the `create` method with the following one:
```haxe
override public function create()
{
    super.create();
    var atlas = new TextureAtlas(
        Assets.getText("assets/spineboy.atlas"),
        new FlixelTextureLoader("assets/spineboy-pro.atlas"));
    var skeletondata = SkeletonData.from(Assets.getBytes("assets/spineboy-pro.skel"), atlas, .5);
    var animationStateData = new AnimationStateData(skeletondata);
    var skeletonSprite = new SkeletonSprite(skeletondata, animationStateData);
    skeletonSprite.screenCenter();
    skeletonSprite.state.setAnimationByName(0, "walk", true);
    add(skeletonSprite);
}
```
Don't forget to import the necessary classes. Now run you code from you IDE or using the following command from the terminal on your project folder:
```
lime test html5 -debug
```

## VS Code setup
As an IDE, we recommend [Visual Studio Code](https://code.visualstudio.com/) with the following extension:

1. [Haxe extension](https://marketplace.visualstudio.com/items?itemName=nadako.vshaxe)
2. [HXCPP debugger extension](https://marketplace.visualstudio.com/items?itemName=vshaxe.hxcpp-debugger)
3. [Lime extension](https://marketplace.visualstudio.com/items?itemName=openfl.lime-vscode-extension)

The extensions provide IDE features like auto-completion, debugging, and build support.

To debug a build, set the corresponding Lime target in the status bar at the bottom of VS Code to e.g. `HTML5 / Debug`. Run the `lime` run configuration by pressing `F5`.

---
## File: Runtimes, spine-ios/spine-ios.md
## Title: spine-ios Runtime Documentation
## URL: http://esotericsoftware.com/spine-ios
---

# spine-ios Runtime Documentation

> **Licensing**
>
> Please see the [Spine Runtimes License](/spine-runtimes-license) before integrating the Spine Runtimes into your applications.

# Getting Started
The spine-ios runtime is implemented using an idiomatic Swift thin wrapper around [spine-c](/spine-c). It can be used with both UIKit and SwiftUI, and supports both Swift and Objective-C.

It uses [Metal](https://developer.apple.com/metal/) for rendering and supports all Spine features including physics, except tint black.

## Installation
spine-ios is supported from iOS 13.0, tvOS 13.0, macOS 10.15, macCatalyst 13.0, visionOS 1.0, and watchOS 6.0 onwards. To use spine-ios in your project, install it using the [Swift Package Manager](https://www.swift.org/documentation/package-manager/).

Ensure that the `major.minor` version of the spine-runtimes repo branch matches the `major.minor` Spine Editor version you are exporting from. See [Spine Versioning](/spine-versioning#Synchronizing-versions) for more information.

### Swift Package Manager

Add the spine-ios SPM package to your project:

#### Via Xcode

1. Open your project in Xcode
2. Go to File → Add Package Dependencies
3. Enter the repository URL: `https://github.com/esotericsoftware/spine-runtimes.git`
4. Choose the version (e.g., branch "4.3")
5. Select the libraries you need:
   - `SpineC` - C API for low-level access
   - `SpineSwift` - Swift API for Swift projects
   - `SpineiOS` - iOS/tvOS rendering with Metal

#### Via Package.swift

```swift
dependencies: [
    .package(url: "https://github.com/esotericsoftware/spine-runtimes.git", branch: "4.3")
],
targets: [
    .target(
        name: "YourTarget",
        dependencies: [
            .product(name: "SpineiOS", package: "spine-runtimes"),
            // Or use SpineSwift for cross-platform Swift-only code:
            // .product(name: "SpineSwift", package: "spine-runtimes"),
        ]
    )
]
```

### Usage

You can now import the appropriate module in your Swift file:

```swift
import SpineiOS  // For iOS/tvOS with UI components
// or
import SpineSwift  // For cross-platform Swift code
```

## Samples
The spine-ios runtime includes several samples that showcase its feature set.

You can run the example project following these steps:

1. Install [Xcode](https://developer.apple.com/xcode/) on your mac
2. Clone the spine-runtimes repository: `git clone https://github.com/esotericsoftware/spine-runtimes`
3. Open `spine-runtimes/spine-ios/Example/Spine iOS Example.xcodeproj` with Xcode
4. Select your target device (simulator or physical device)
5. Press Run (⌘R) to build and run the examples

All samples listed below support SwiftUI previews and can be rendered in the canvas, right in Xcode.

The example project contains the following examples:

* [`SimpleAnimation.swift`](/git/spine-runtimes/spine-ios/Example/Spine%20iOS%20Example/SimpleAnimation.swift): demonstrates the basic use of `SpineView` and `SpineController` to load an exported Spine skeleton, display it in the view, and playback a specific animation.
* [`PlayPauseAnimation.swift`](/git/spine-runtimes/spine-ios/Example/Spine%20iOS%20Example/PlayPauseAnimation.swift): demonstrates how to pause and resume an animation.
* [`AnimationStateEvents.swift`](/git/spine-runtimes/spine-ios/Example/Spine%20iOS%20Example/AnimationStateEvents.swift): demonstrates how to set a slot's color, how to queue multiple animations, and how to listen for animation state events.
* [`DebugRendering.swift`](/git/spine-runtimes/spine-ios/Example/Spine%20iOS%20Example/DebugRendering.swift): shows how to perform custom drawing on top of the rendered skeleton via the `SpineController` `onAfterPaint` callback.
* [`DressUp.swift`](/git/spine-runtimes/spine-ios/Example/Spine%20iOS%20Example/DressUp.swift): demonstrates Spine's skins feature as well as rendering a skeleton to a thumbnail for use in a character creation UI.
* [`IKFollowing.swift`](/git/spine-runtimes/spine-ios/Example/Spine%20iOS%20Example/IKFollowing.swift): demonstrates how to let the user drag one of the skeleton's bones via touch input.
* [`Physics.swift`](/git/spine-runtimes/spine-ios/Example/Spine%20iOS%20Example/Physics.swift): demonstrates physics constraints in action with interactive physics simulation.
* [`DisableRendering.swift`](/git/spine-runtimes/spine-ios/Example/Spine%20iOS%20Example/DisableRendering.swift): demonstrates how to disable rendering when the `SpineView` moves off screen. This is important if you need to preserve CPU/GPU resources.
* [`SimpleAnimationViewController.m`](/git/spine-runtimes/spine-ios/Example/Spine%20iOS%20Example/SimpleAnimationViewController.m): demonstrates how to use spine-ios with UIKit and Objective-C.

## Updating the spine-ios Runtime
Before updating your project's spine-ios runtime, please consult our [guide on Spine editor and runtime version management](/spine-runtime-architecture#Versioning).

For Swift Package Manager, choose the correct commit hash or branch from the correct `major.minor` branch.

> **Note:** If you change the `major.minor` version of spine-ios, you have to re-export your Spine skeletons with the same Spine Editor `major.minor` version!

# Using spine-ios
The spine-ios runtime is an idiomatic wrapper around the generic [spine-cpp](/spine-cpp) which supports loading, playback and manipulation of animations created with Spine. The spine-ios runtime exposes almost all of the spine-cpp API as idiomatic Swift and provides SwiftUI and UIKit specific classes to easily display and interact with Spine skeletons.

The spine-ios runtime supports all Spine features including physics, except tint black.

## Asset Management
### Exporting for spine-ios
![](/img/spine-runtimes-guide/spine-ue4/export.png)
Please follow the instructions in the Spine User Guide on how to

1. [Export skeleton & animation data](/spine-export)
2. [Export texture atlases containing the images of your skeleton](/spine-texture-packer)

An export of the skeleton data and texture atlas of your skeleton will yield the following files:

![](/img/spine-runtimes-guide/spine-ue4/exported-files.png)

1. `skeleton-name.json` or `skeleton-name.skel`, containing your skeleton and animation data.
2. `skeleton-name.atlas`, containing information about the texture atlas.
3. One or more `.png` files, each representing one page of your texture atlas containing the packed images your skeleton uses.

> **Note**: You should prefer binary skeleton exports over JSON exports, as they are smaller in size and faster to load.

The files can be loaded via spine-ios classes like `Atlas`, `SkeletonData`, `SkeletonDrawable`, and `SpineView`.

> **Note**: If you are using non-premultiplied assets, you need to disable `Compress PNG Files` and `Remove Text Metadata From PNG Files` in your application target's build settings. Alternatively, you can select the `.png` file in Xcode, then set its type to `Other - Data`, which will prevent any kind of preprocessing.

### Updating Spine Assets
During development, you may frequently update your Spine skeleton data and texture atlas files. You can simply overwrite these source files (`.json`, `.skel`, `.atlas`, `.png`) by re-exporting from the Spine Editor and replacing the existing files in your Xcode project.

Ensure that the `major.minor` version of spine-ios matches the `major.minor` Spine Editor version you are exporting from. See [Spine Versioning](/spine-versioning#Synchronizing-versions) for more information.

## Core classes
The spine-ios API is built on top of the generic [spine-cpp](/spine-cpp) runtime, which provides platform independent core classes and algorithms to load, query, modify, and animate Spine skeletons. The core classes are exposed as idiomatic Swift classes through the SpineSwift module.

Here, we will briefly discuss the most important core classes that you will encounter in your day-to-day use of spine-ios. Please consult the [Spine Runtimes Guide](/spine-runtimes-guide) for a detailed overview of the Spine Runtimes architecture, core classes, and API usage.

The [`Atlas`](/git/spine-runtimes/spine-ios/Sources/SpineSwift/Generated/atlas.swift) class stores the data loaded from an `.atlas` file and its corresponding `.png` image files.

The [`SkeletonData`](/git/spine-runtimes/spine-ios/Sources/SpineSwift/Generated/skeleton_data.swift) class stores the data loaded from a `.json` or `.skel` skeleton file. The skeleton data contains information about the bone hierarchy, slots, attachments, constraints, skins, and animations. A `SkeletonData` instance is usually loaded by also providing an `Atlas` from which it sources the images to be used by the skeleton it represents. It serves as a blueprint for creating `Skeleton` instances. Multiple skeletons can be instantiated from the same atlas and skeleton data, which then share the loaded data, minimizing both load times and memory consumption at runtime.

The [`Skeleton`](/git/spine-runtimes/spine-ios/Sources/SpineSwift/Generated/skeleton.swift) class stores an instance of a skeleton, created from a `SkeletonData` instance. A skeleton stores its current pose, that is the position of bones and the current configuration of slots, attachments, and active skin. The current pose can be computed by either manually modifying the bone hierarchy, or, more commonly, by applying animations via an `AnimationState`.

The [`AnimationState`](/git/spine-runtimes/spine-ios/Sources/SpineSwift/Generated/animation_state.swift) class is responsible for keeping track of which animation(s) should be applied to a skeleton, advancing and mixing those animations based on the elapsed time between the last and current rendering frame, and applying the animations to a skeleton instance, thereby setting its current pose. The `AnimationState` queries an [`AnimationStateData`](/git/spine-runtimes/spine-ios/Sources/SpineSwift/Generated/animation_state_data.swift) instance to retrieve mixing times between animations, or fetches the default mix time if no mixing time is available for a pair of animations.

The spine-ios runtime builds on top of these core classes with iOS-specific functionality.

## SpineView / SpineUIView
![/img/spine-runtimes-guide/spine-ios/simple-animation.png](/img/spine-runtimes-guide/spine-ios/simple-animation.png)

The `SpineView` struct is a `UIViewRepresentable` around `SpineUIView`, so the latter can be used in SwiftUI projects. `SpineUIView` is a subclass of [MTKView](https://developer.apple.com/documentation/metalkit/mtkview).

Going forward, we will use `SpineView` when referring to either one of them.

A [`SpineView`](/git/spine-runtimes/spine-ios/Sources/SpineiOS/SpineView.swift) is responsible for loading and displaying a Spine skeleton. At a minimum, the view needs to know from where to load the skeleton and atlas files, and it can receive a `SpineController` instance that is responsible for modifying the state of the skeleton, such as setting an animation or changing the skin.

The `SpineController` is an `ObservableObject` and should be held inside a `@StateObject` variable. In the simplest case, a `SpineView` can be instantiated inside another view's `body` like this:

```swift
@StateObject
var controller = SpineController(
    onInitialized: { controller in
        controller.animationState.setAnimation(0, "walk", true)
    }
)

var body: some View {
    SpineView(
        from: .bundle(atlasFileName: "spineboy.atlas", skeletonFileName: "spineboy-pro.skel"),
        controller: controller,
        mode: .fit,
        alignment: .center
    )
}
```

Upon instantiation, the `SpineView` will asynchronously load the specified files and construct the underlying core class instances from them, namely instances of `Atlas`, `SkeletonData`, `Skeleton`, `AnimationStateData`, and `AnimationState`.

Once loading is complete, the `SpineController` `onInitialized` callback is called, allowing it to modify the state of the skeleton, such as setting one or more animations, manipulating the bone hierarchy, or modifying the skin. See the section on `SpineController` below.

The `SpineView` class takes the `SpineViewSource` enum as its first parameter, to load skeleton and atlas files from different sources:

* `SpineViewSource.bundle` loads files from the main bundle, or a provided bundle.
* `SpineViewSource.file` loads files from the file system.
* `SpineViewSource.http` loads files from URLs.
* `SpineViewSource.drawable()` constructs a view from a `SkeletonDrawable`. This is useful when the skeleton data should be preloaded, cached, and/or shared between `SpineView` instances. See the section "Pre-loading and sharing skeleton data" below.

Additionally, `SpineView` has optional arguments that let you further define how the Spine skeleton is fitted and aligned inside the view:

* `mode`, how the skeleton is fitted inside `SpineUIView`. By default, it is `.fit`
* `alignment`, how the skeleton is aligned inside `SpineUIView`. By default, it is `.center`
* `boundsProvider`, used to calculate the pixel size of the bounding box to be used for the skeleton when computing the fit and alignment. By default, the skeleton's setup pose bounding box is used. See the class documentation for [`SetupPoseBounds`](/git/spine-runtimes/spine-ios/Sources/SpineiOS/BoundsProvider.swift), [`RawBounds`](/git/spine-runtimes/spine-ios/Sources/SpineiOS/BoundsProvider.swift), and [`SkinAndAnimationBounds`](/git/spine-runtimes/spine-ios/Sources/SpineiOS/BoundsProvider.swift) for additional information.
* `backgroundColor`: The background color of the view. By default, `UIColor.clear` is used

The `SpineView` has an additional optional binding parameter `isRendering`, through which rendering can be disabled. See the [`DisableRendering.swift`](/git/spine-runtimes/spine-ios/Example/Spine%20iOS%20Example/DisableRendering.swift) example for more information.

## SpineController
A [`SpineController`](/git/spine-runtimes/spine-ios/Sources/SpineiOS/SpineController.swift) controls how the skeleton of a `SpineView` is animated and rendered. The controller is provided with a set of optional callbacks as constructor arguments, which are called at specific times during the lifetime of the `SpineView`.

The controller exposes the skeleton state through properties returning Spine Runtimes API objects such as the `Atlas`, `SkeletonData`, `Skeleton`, and `AnimationState`, through which the state can be manipulated. See the [Spine Runtimes Guide](/spine-runtimes-guide), and the [class documentation](/git/spine-runtimes/spine-ios/Sources/SpineSwift/Generated/) for more information.

Upon initialization of a `SpineView`, the controller's `onInitialized()` callback method is invoked once. This method can be used to setup the initial animation(s) to be played back, or set the skin of the skeleton, among other things.

After initialization is complete, the `SpineView` is rendered continuously at the screen refresh rate. Each frame, the `AnimationState` is updated based on the currently queued animations, and applied to the `Skeleton`.

Next, the optional `onBeforeUpdateWorldTransforms()` callback is invoked, which can modify the skeleton before its current pose is calculated using `Skeleton.updateWorldTransform()`.

After the current pose has been calculated, the optional `onAfterUpdateWorldTransforms()` callback is invoked, which can further modify the current pose before the skeleton is rendered. This is a good place to manually position bones.

Before the skeleton is rendered by the `SpineView`, the optional `onBeforePaint()` callback is invoked, which allows rendering backgrounds or other objects that should go behind the skeleton.

After the `SpineView` has rendered the current skeleton pose, the optional `onAfterPaint()` callback is invoked, which allows rendering additional objects on top of the skeleton.

By default, the view updates and renders the skeleton every frame. The `SpineController.pause()` method can be used to pause updating and rendering the skeleton. The `SpineController.resume()` method resumes updating and rendering the skeleton. The `SpineController.isPlaying` property reports the current playback state. See the [`PlayPauseAnimation.swift`](/git/spine-runtimes/spine-ios/Example/Spine%20iOS%20Example/PlayPauseAnimation.swift) example.

## SkeletonDrawableWrapper / SkeletonDrawable
A `SkeletonDrawableWrapper` holds `SkeletonDrawable` and bundles loading, storing, updating, and rendering a `Skeleton` and its associated `AnimationState` into a single, easy to use class. The `SpineView` encapsulates the state of the skeleton it displays via an instance of a `SkeletonDrawableWrapper`.

Use the `fromBundle()`, `fromFile()`, or `fromHttp()` methods to construct a `SkeletonDrawableWrapper` from file assets. To share `Atlas` and `SkeletonData` among multiple `SkeletonDrawableWrapper` instances, instantiate the drawables via the constructor, passing the same atlas and skeleton data to each of them.

The `SkeletonDrawableWrapper` exposes the `SkeletonDrawable`, `Skeleton`, `AnimationState` and `AnimationStateEventManager` to query, modify, and animate the skeleton. It also exposes the `Atlas` and `SkeletonData` from which the skeleton and animation state have been constructed.

To animate the skeleton, queue animations on one or more tracks via the `AnimationState` API, such as `AnimationState.setAnimation()` or `AnimationState.addAnimation()`.

To update the animation state, apply it to the skeleton, and update the current skeleton pose, call the `SkeletonDrawableWrapper.update()` method, providing it a delta time in seconds to advance the animations.

To render the current pose of the `Skeleton` as a `CGImage`, use `SkeletonDrawableWrapper.renderToImage(size:backgroundColor:scaleFactor:)`.

The `SkeletonDrawable` stores objects allocated on the native heap. The native objects need to be manually disposed of via a call to `SkeletonDrawable.dispose()` if the `SkeletonDrawable` is no longer needed. Not doing so will result in a native memory leak.

> **Note:** `SpineController` does this automatically when being deinitialized. However, if you hold the `SkeletonDrawableWrapper` outside of `SpineController`, you are responsible for disposing as described above. In this case, set the optional `disposeDrawableOnDeInit` constructor parameter of `SpineController` to `false`.

## Applying Animations
Applying animations to a skeleton displayed by a `SpineView` is done through the `AnimationState` in the callbacks of a `SpineController`.

> **Note:** See [Applying Animations](/spine-applying-animations#AnimationState-API) in the Spine Runtimes Guide for more in-depth information, specifically about animation tracks and animation queueing.

To set a specific animation on track 0, call `AnimationState.setAnimation()`:

```swift
@StateObject
var controller = SpineController(
    onInitialized: { controller in
        // Set the walk animation on track 0, let it loop
        controller.animationState.setAnimation(0, "walk", true)
    }
)
```

The first parameter specifies the track, the second parameter is the name of the animation, and the third parameter defines whether to loop the animation.

You can queue multiple animations:

```swift
controller.animationState.setAnimation(0, "walk", true)
controller.animationState.addAnimation(0, "jump", false, 2)
controller.animationState.addAnimation(0, "run", true, 0)
```

The first parameter to `addAnimation()` is the track. The second parameter is the name of the animation. The third parameter specifies whether to loop the animation. The final parameter defines the delay in seconds, after which this animation should replace the previous animation on the track.

In the example above, the `"walk"` animation is played back first. 2 seconds later, the `"jump"` animation is played back once, followed by a transition to the `"run"` animation, which will be looped.

When transitioning from one animation to another, `AnimationState` will mix the animations for a specifiable duration. These mix times are defined in an `AnimationStateData` instance, from which the `AnimationState` retrieves mix times.

The `AnimationStateData` instance is also available through the controller. You can set the default mix time, or the mix time for a specific pair of animations:

```swift
controller.animationStateData.defaultMix = 0.2
controller.animationStateData.setMix("walk", "jump", 0.1)
```

When setting or adding an animation, a `TrackEntry` object is returned, which allows further modification of that animation's playback. For example, you can set the track entry to reverse the animation playback:

```swift
let entry = controller.animationState.setAnimation(0, "walk", true)
entry.reverse = true
```

See the [`TrackEntry` class documentation](/git/spine-runtimes/spine-ios/Sources/SpineSwift/Generated/track_entry.swift) for more options.

> **Note:** Do not hold on to `TrackEntry` instances outside the function you are using them in. Track entries are re-used internally and will thus become invalid once the animation it represents has been completed.

You can set or queue empty animations on an animation track to smoothly reset the skeleton back to its setup pose:

```swift
controller.animationState.setEmptyAnimation(0, 0.5)
controller.animationState.addEmptyAnimation(0, 0.5, 0.5)
```

The first parameter to `setEmptyAnimation()` specifies the track. The second parameter specifies the mix duration in seconds used to mix out the previous animation and mix in the "empty" animation.

The first parameter to `addEmptyAnimation()` specifies the track. The second parameter specifies the mix duration. The third parameter is the delay in seconds, after which the empty animation should replace the previous animation on the track via mixing.

All animations on a track can be cleared immediately via `AnimationState.clearTrack()`. To clear all tracks at once, `AnimationState.clearTracks()` can be used. This will leave the skeleton in the last pose it was in.

To reset the pose of a skeleton to the setup pose, use `Skeleton.setupPose()`:

```swift
controller.skeleton.setupPose()
```

This will reset both the bones and slots to their setup pose configuration. Use `Skeleton.setupPoseSlots()` to only reset the slots to their setup pose configuration.

## AnimationState Events
An `AnimationState` emits events during the life-cycle of an animation that is being played back. You can listen for these events to react as needed. The Spine Runtimes API defines the following [EventType](/git/spine-runtimes/spine-ios/Sources/SpineSwift/Generated/event_type.swift) types:

* `EventType.start`: emitted when an animation is started.
* `EventType.interrupt`: emitted when an animation's track was cleared, or a new animation was set.
* `EventType.complete`: emitted when an animation completes a loop.
* `EventType.end`: emitted when an animation will never be applied again.
* `EventType.dispose`: emitted when the animation's track entry is disposed.
* `EventType.event`: emitted when a user defined [event](/spine-events#Events) happened.

To receive events, you can register an event listener callback with the `AnimationState` to receive events across all animations, or with a specific `TrackEntry` for events from that animation:

```swift
let walkEntry = controller.animationState.setAnimation(0, "walk", true)
walkEntry.setListener { type, entry, event in
    if type == .event, let event = event {
        print("User defined event: \(event.data.name)")
    }
}

controller.animationState.setListener { type, entry, event in
    print("Animation state event \(type)")
}
```

See the [`AnimationStateEvents.swift`](/git/spine-runtimes/spine-ios/Example/Spine%20iOS%20Example/AnimationStateEvents.swift) example.

## Skins
![/img/spine-runtimes-guide/spine-ios/skins.png](/img/spine-runtimes-guide/spine-ios/skins.png)

Many applications and games allow users to create custom avatars out of many individual items, such as hair, eyes, pants, or accessories like earrings or bags. With Spine, this can be achieved by [mixing and matching skins](/spine-examples-mix-and-match).

You can create custom skins from other skins like this:

```swift
let data = controller.skeletonData
let skeleton = controller.skeleton
let customSkin = Skin.create("custom-skin")
customSkin.addSkin(data.findSkin("skin-base")!)
customSkin.addSkin(data.findSkin("nose/short")!)
customSkin.addSkin(data.findSkin("eyelids/girly")!)
customSkin.addSkin(data.findSkin("eyes/violet")!)
customSkin.addSkin(data.findSkin("hair/brown")!)
customSkin.addSkin(data.findSkin("clothes/hoodie-orange")!)
customSkin.addSkin(data.findSkin("legs/pants-jeans")!)
customSkin.addSkin(data.findSkin("accessories/bag")!)
customSkin.addSkin(data.findSkin("accessories/hat-red-yellow")!)
skeleton.setSkin2(customSkin)
skeleton.setupPose()
```

Create a custom skin with the `Skin.create()` static function.

Next, fetch the `SkeletonData` from the controller. It is used to look up skins by name via `SkeletonData.findSkin()`.

Add all the skins you want to combine into the new custom skin via `Skin.addSkin()`.

Finally, set the new skin on the `Skeleton` and call `Skeleton.setupPoseSlots()` to ensure no attachments from previous skins and/or animations are left over.

> **Note:** A `Skin` wraps an underlying C++ object. It needs to be manually disposed via a call to `Skin.dispose()` when it is no longer in use.

See the [`DressUp.swift`](/git/spine-runtimes/spine-ios/Example/Spine%20iOS%20Example/DressUp.swift) example, which also demonstrates how to render thumbnail previews of skins using `SkeletonDrawableWrapper`.

## Physics
![/img/spine-runtimes-guide/spine-ios/physics.png](/img/spine-runtimes-guide/spine-ios/physics.png)

spine-ios fully supports physics constraints, allowing for dynamic, realistic animations that respond to movement and forces. Physics can be controlled through the `Physics` enum when updating world transforms:

```swift
// Update with physics simulation
skeleton.updateWorldTransform(.update)

// Reset physics state
skeleton.updateWorldTransform(.reset)

// Pose without physics
skeleton.updateWorldTransform(.pose)
```

The physics system supports various constraint types including mass, damping, gravity, and inertia. See the [`Physics.swift`](/git/spine-runtimes/spine-ios/Example/Spine%20iOS%20Example/Physics.swift) example for an interactive demonstration.

## Setting Bone Transforms
![/img/spine-runtimes-guide/spine-ios/bone-transform.png](/img/spine-runtimes-guide/spine-ios/bone-transform.png)

When authoring a skeleton in the Spine Editor, the skeleton is defined in what is called the skeleton coordinate system. This coordinate system may not align with the coordinate system of the `SpineView` the skeleton is rendered by. Touch coordinates relative to the `SpineView` need to be converted to the skeleton coordinate system, e.g. if a user should be able to move a bone by touch.

The `SpineController` offers the method `toSkeletonCoordinates(position:)` which takes a `CGPoint` relative to the `SpineView` it is associated with, and converts it to the skeleton's coordinate system.

See the [`IKFollowing.swift`](/git/spine-runtimes/spine-ios/Example/Spine%20iOS%20Example/IKFollowing.swift) example.

You can also transform coordinates in the other direction using `fromSkeletonCoordinates(position:)`. See the [`DebugRendering.swift`](/git/spine-runtimes/spine-ios/Example/Spine%20iOS%20Example/DebugRendering.swift) example to learn more.

# Spine Runtimes API access
spine-ios maps almost all of the Spine Runtime API to Swift. Objects returned by `SpineController` or `SkeletonDrawableWrapper/SkeletonDrawable`, like `Skeleton` or `AnimationState` are 1:1 translations of the spine-cpp API to Swift. You can thus apply almost all of the materials in the generic [Spine Runtimes Guide](/spine-runtimes-guide) to your Swift code.

Due to the nature of the spine-cpp bridge, there are however a few limitations:

* Any returned array or map is a copy of the internal array. Modifications will not have an effect.
* You can not create, add or remove bones, slots, and other Spine objects directly.
* The C++ class hierarchies of timelines are not exposed in Swift.

## Objective-C Support
spine-ios provides full Objective-C compatibility through proper bridging:

### Using spine-ios from Objective-C
1. Import the SpineiOS module in your Objective-C file:
```objc
@import SpineiOS;
```

2. Use the Objective-C class names (prefixed with "Spine"):
```objc
SpineUIView *spineView = [[SpineUIView alloc] initWithAtlasFileName:@"spineboy.atlas"
                                                    skeletonFileName:@"spineboy-pro.skel"
                                                              bundle:[NSBundle mainBundle]
                                                          controller:nil
                                                                mode:SpineContentModeFit
                                                           alignment:SpineAlignmentCenter
                                                      boundsProvider:[[SpineSetupPoseBounds alloc] init]
                                                     backgroundColor:[UIColor clearColor]];
```

3. Key classes available in Objective-C:
- `SpineUIView` - UIKit view for rendering
- `SpineSkeletonDrawableWrapper` - Drawable wrapper
- `SpineBoundsProvider`, `SpineSetupPoseBounds`, `SpineRawBounds` - Bounds providers

See [`SimpleAnimationViewController.m`](/git/spine-runtimes/spine-ios/Example/Spine%20iOS%20Example/SimpleAnimationViewController.m) for a complete example.

## Development

For developers who want to modify or build spine-ios from source:

### Building the Modules

```bash
cd spine-runtimes/spine-ios

# Build SpineC (C API)
swift build --product SpineC

# Build SpineSwift (Swift API)
swift build --product SpineSwift

# Build SpineiOS (requires iOS/tvOS SDK)
# Use Xcode for SpineiOS as it requires platform-specific SDKs
```

### Running Tests

```bash
cd spine-runtimes/spine-ios/test
swift build
swift run SpineTest
```

### Generating Swift Bindings

If you need to regenerate the Swift bindings after modifying spine-c:

```bash
cd spine-runtimes/spine-ios
./generate-bindings.sh
```

This will regenerate the Swift wrapper code in `Sources/SpineSwift/Generated/`.

---
## File: Runtimes, spine-phaser/spine-phaser.md
## Title: spine-phaser Runtime Documentation
## URL: http://esotericsoftware.com/spine-phaser
---

# spine-phaser Runtime Documentation

> **Licensing**
>
> Please see the [Spine Runtimes License](/spine-runtimes-license) before integrating the Spine Runtimes into your applications.

# Getting Started
This is a unified page for our official [Phaser](https://phaser.io/) runtimes. Here you can find a list of our official Phaser runtimes along with the respective compatible versions:

<table>
  <tbody>

    <tr>
      <th>Runtime</th>
      <th>Phaser version</th>
      <th>Maintained</th>
    </tr>

    <tr>
      <td id="spine-phaser-v4">
        <a href="https://github.com/EsotericSoftware/spine-runtimes/tree/4.2/spine-ts/spine-phaser-v4">spine-phaser-v4</a>
      </td>
      <td>
        <p>4 (minimum 4.0.0-rc.1)</p>
      </td>
      <td>
        <p>Yes</p>
      </td>
    </tr>

    <tr>
      <td id="spine-phaser-v3">
        <a href="https://github.com/EsotericSoftware/spine-runtimes/tree/4.2/spine-ts/spine-phaser-v3">spine-phaser-v3</a>
      </td>
      <td>
        <p>3 (minimum 3.60.0)</p>
      </td>
      <td>
        <p>Yes</p>
      </td>
    </tr>

    <tr>
      <td id="spine-phaser">
        <a href="https://github.com/EsotericSoftware/spine-runtimes/tree/ca00e561368f2c838026e2d02aed57b709b037ef/spine-ts/spine-phaser">spine-phaser</a>
      </td>
      <td>
        <p>3 (minimum 3.60.0)</p>
      </td>
      <td>
        <p>No (switch to spine-phaser-v3)</p>
      </td>
    </tr>

  </tbody>
</table>

Unless otherwise indicated, the examples and GitHub file links refer to the v4 version. However, everything applies to the v3 version by simply replace `-v4` with `-v3` from paths and links.

The spine-phaser runtime is implemented on top of [spine-ts core](https://github.com/EsotericSoftware/spine-runtimes/tree/4.2/spine-ts/spine-core), a TypeScript implementation of the renderer-agnostic Spine Runtimes core APIs. The spine-phaser runtime supports all platforms supported by Phaser 3 and 4, including rendering via the [Canvas APIs](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) as well as rendering via [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API).

The spine-phaser runtime supports all Spine features when using the Phaser WebGL renderer. When using the Phaser Canvas renderer, the spine-phaser runtime does not support [meshes](/spine-meshes), [tint black](/spine-slots#Tint-black), or [blend modes](/spine-slots#Blending).


## Installation
To use spine-phaser in your Phaser project, you must first include its sources.

### Vanilla JavaScript
In vanilla JavaScript, use a `script` tag to include the spine-phaser runtime from [unpkg](https://unpkg.com):

```
<script src="https://unpkg.com/@esotericsoftware/spine-phaser-v4@4.2.*/dist/iife/spine-phaser-v4.js"></script>
```

> **Note:** Ensure that the `major.minor` version of spine-phaser matches the `major.minor` Spine Editor version you are exporting from. See [Synchronizing versions](/spine-versioning#Synchronizing-versions) for more information.

Next, add the Spine scene plugin to your Phaser game configuration:

```
const config = {
   ...
   plugins: {
      scene: [
         { key: "spine.SpinePlugin", plugin: spine.SpinePlugin, mapping: "spine" }
      ]
   }
}
new Phaser.Game(config);
```

All scenes in your project can now use the spine-phaser runtime.

Check out [`basic-vanilla-js-example.html`](/git/spine-runtimes/spine-ts/spine-phaser-v4/example/basic-vanilla-js-example.html) for a full example.


The spine-phaser package also provides source maps for debugging, as well as minified versions of spine-phaser, which can be used by replacing the `.js` file suffix with `.min.js` in the unpkg URLs.

For local vendoring, you can build `spine-phaser.js` by following the instructions in the spine-ts [README.md](/git/spine-runtimes/spine-ts/README.md).


### NPM or Yarn
When using NPM or Yarn for dependency management, add spine-phaser the usual way:

```
npm install @esotericsoftware/spine-phaser-v4@~4.2.0
```

> **Note:** Ensure that the `major.minor` version of spine-phaser matches the `major.minor` Spine Editor version you are exporting from. See [Synchronizing versions](/spine-versioning#Synchronizing-versions) for more information.

Next, add the Spine scene plugin to your Phaser game configuration:

```
import Phaser from "phaser"
import {SpinePlugin} from "@esotericsoftware/spine-phaser-v4"

const config = {
   ...
   plugins: {
      scene: [
         { key: "spine.SpinePlugin", plugin: SpinePlugin, mapping: "spine" }
      ]
   }
}
new Phaser.Game(config);
```

All scenes in your project can now use the spine-phaser runtime.

Check out [`the spine-phaser esbuild/TypeScript project`](/git/spine-runtimes/spine-ts/spine-phaser-v4/example/typescript) for minimal example.

Our module packages also contain source maps as well as `d.ts` typings for improved debugging and development.

## Samples
The spine-phaser runtime includes several samples demonstrating its feature set.

To run the examples locally:

1. Install Git and [Node.js](https://nodejs.org/en) for your operating system.
2. Clone the spine-runtimes repository: `git clone https://github.com/esotericsoftware/spine-runtimes`
2. At the terminal, navigate to `spine-runtimes/spine-ts`, then run `npm install & npm run dev`.

This builds the spine-phaser runtime, then opens a browser, displaying the example index for all spine-ts based runtimes.

Click on the spine-phaser example you are interested in, and check out the code in the [`spine-runtimes/spine-ts/spine-phaser-v4/example`](/git/spine-runtimes/spine-ts/spine-phaser-v4/example) folder.

## Updating the spine-phaser Runtime
Before updating your project's spine-phaser runtime, please consult our [guide on Spine editor and runtime version management](/spine-runtime-architecture#Versioning).

To update the spine-phaser runtime in vanilla JavaScript, change the version string in the `src` attribute or the `script` tag fetching spine-phaser from unpkg.

To update the spine-phaser runtime when managing dependencies with NPM or Yarn, change the version string in your `package.json` file.

> **Note:** If you change the `major.minor` version of the spine-phaser package, you have to re-export your Spine skeletons with the same Spine Editor `major.minor` version! See [Synchronizing versions](/spine-versioning#Synchronizing-versions) for more information.

# Using spine-phaser
The spine-phaser runtime supports all Spine features when using the Phaser WebGL renderer. When using the Phaser Canvas renderer, the spine-phaser runtime does not support [meshes](/spine-meshes), [tint black](/spine-slots#Tint-black), or [blend modes](/spine-slots#Blending).

## Asset Management
### Exporting for spine-phaser

![](/img/spine-runtimes-guide/spine-ue4/export.png)

Follow the instructions in the Spine User Guide on how to:

1. [Export skeleton & animation data](/spine-export)
2. [Export texture atlases containing the images of your skeleton](/spine-texture-packer)

An export of the skeleton data and texture atlas of your skeleton will yield the following files:

![](/img/spine-runtimes-guide/spine-ue4/exported-files.png)

1. `skeleton-name.json` or `skeleton-name.skel`, containing your skeleton and animation data, either in the JSON or binary format.
2. `skeleton-name.atlas`, containing information about the texture atlas.
3. One or more `.png` files, each representing one page of your texture atlas containing the packed images your skeleton uses.

> **Note**: You should prefer binary skeleton exports over JSON exports, as they are smaller in size and faster to load.

When serving these files, make sure the server emits the correct MIME types.

### Updating Spine Assets
During development, you may frequently update your Spine skeleton data and texture atlas files. You can simply overwrite these source files (.json, .skel, .atlas, .png) by re-exporting from the Spine Editor and replacing the existing files in your Phaser project.

Ensure that the `major.minor` version of spine-phaser matches the `major.minor` Spine Editor version you are exporting from. See [Synchronizing versions](/spine-versioning#Synchronizing-versions) for more information.

## Core classes
The spine-phaser API is built on top of the generic TypeScript [spine-core](/git/spine-runtimes/spine-ts/spine-core) runtime, which provides platform independent  core classes and algorithms to load, query, modify, and animate Spine skeletons.

Here, we will briefly discuss the most important core classes that you will  encounter in your day-to-day use of spine-phaser. Please consult the [Spine Runtimes Guide](/spine-runtimes-guide)
for a detailed overview of the Spine Runtimes architecture, core classes, and API usage.

The [`TextureAtlas`](/git/spine-runtimes/spine-ts/spine-core/src/TextureAtlas.ts) class stores the data loaded from an `.atlas` file and its corresponding `.png` image files.

The [`SkeletonData`](/git/spine-runtimes/spine-ts/spine-core/src/SkeletonData.ts) class stores the data loaded from a `.json` or `.skel` skeleton file.  The skeleton data contains information about the bone hierarchy, slots, attachments, constraints, skins, and animations. A `SkeletonData` instance is usually loaded by also providing an `Atlas` from which it sources the images to be used by the skeleton it represents. It serves as a blueprint for creating `Skeleton` instances. Multiple skeletons can be instantiated from the same atlas and skeleton data, which then share the loaded data, minimizing both load times and memory consumption at runtime.

The [`Skeleton`](/git/spine-runtimes/spine-ts/spine-core/src/Skeleton.ts) class stores an instance of a skeleton, created from a `SkeletonData` instance. A skeleton stores its current pose, that is the position of bones and the current configuration of slots, attachments, and active skin. The current pose can be computed by either manually modifying the bone transforms, or, more commonly, by applying animations via an `AnimationState`.

The [`AnimationState`](/git/spine-runtimes/spine-ts/spine-core/src/AnimationState.ts) class is responsible for keeping track of which animation(s) should be applied to a skeleton, advancing and mixing those animations based on the elapsed time between the last and current rendering frame, and applying the animations to a skeleton instance, thereby setting its current pose. The `AnimationState` queries an [`AnimationStateData`](/git/spine-runtimes/spine-ts/spine-core/src/AnimationStateData.ts) instance to retrieve mixing times between animations, or fetches the default mix time if no mixing time is available for a pair of animations.

The spine-phaser runtime builds on top of these core classes.

## Spine Scene Plugin
The spine-phaser scene plugin adds functionality to (pre-)load exported `.json`, `.skel`, and `.atlas` files to a scene's [LoaderPlugin (`Scene.load`)](https://photonstorm.github.io/phaser3-docs/Phaser.Loader.LoaderPlugin.html). It provides getters to access the raw skeleton data and texture atlases.

The scene plugin extends the scene's [GameObjectFactory (`Scene.add`)](https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectFactory.html) and [GameObjectCreator (`Scene.make`)](https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectCreator.html) with functions to create `SpineGameObject` instances from loaded skeleton data and atlas files.

### Loading Spine Assets
Spine assets, like skeleton data `.json`/`.skel` files, or `.atlas` files, are loaded through additional functions added to the [LoaderPlugin (`Scene.load`)](https://photonstorm.github.io/phaser3-docs/Phaser.Loader.LoaderPlugin.html) of a Phaser [`Scene`](https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html) by the [`SpinePlugin`](/git/spine-runtimes/spine-ts/spine-phaser/src/SpinePlugin.ts).

* `spineBinary(key: string, url: string, xhrSettings: Phaser.Loader.XHRSettingsObject)`: loads a binary skeleton `.skel` file from the `url` and makes it available via the `key`. The [`XHRSettingsObject`](https://newdocs.phaser.io/docs/3.54.0/Phaser.Types.Loader.XHRSettingsObject) is optional.
* `spineJson(key: string, url: string, xhrSettings: Phaser.Loader.XHRSettingsObject)`: loads a JSON skeleton `.json` file from the `url` and makes it available via the `key`. The [`XHRSettingsObject`](https://newdocs.phaser.io/docs/3.54.0/Phaser.Types.Loader.XHRSettingsObject) is optional.
* `spineAtlas(key: string, url: string, premultipliedAlpha: boolean, xhrSettings: Phaser.Loader.XHRSettingsObject)`: loads texture atlas `.atlas` file and its related `.png` texture atlas page files from the `url` and makes it available via the `key`. The `premultipliedAlpha` parameter is optional and specifies if the atlas was exported with premultiplied-alpha enabled. By default, the value stored in the `.atlas` file is used. The [`XHRSettingsObject`](https://newdocs.phaser.io/docs/3.54.0/Phaser.Types.Loader.XHRSettingsObject) is optional.

Assuming you have exported your skeleton data to a binary skeleton file called `skeleton.skel`, and your atlas to a file called `skeleton.atlas` with one corresponding `skeleton.png` file, you can load your assets in your scene's `preload()` function like this:

```
function preload() {
   this.load.spineBinary("skeleton-data", "path/to/skeleton.skel");
   this.load.spineAtlas("skeleton-atlas", "path/to/skeleton.atlas");
}
```

The `preload()` function loads the [SkeletonData](/git/spine-runtimes/spine-ts/spine-core/src/SkeletonData.ts) from the `skeleton.skel` file and caches it under the key `skeleton-data`. It also loads the [TextureAtlas](/git/spine-runtimes/spine-ts/spine-core/src/TextureAtlas.ts) from the `skeleton.atlas` file, as well as a texture from the corresponding `skeleton.png` file. The atlas is cached under the key `skeleton-atlas`. The individual texture atlas page images are loaded transparently without the need for explicitly loading them.

Once preloading has finished, you can access the `TextureAtlas` via `Scene.spine.getAtlas(atlasKey)`. Similarly, you can access the raw `SkeletonData` via `Scene.spine.getSkeletonData(dataKey, atlasKey)`. Note the second parameter: a `SkeletonData` instance can only be created in combination with an atlas for that skeleton data.

The skeleton data and atlas on their own can not be animated or rendered. Instead, a [`SpineGameObject`](/git/spine-runtimes/spine-ts/spine-phaser/src/SpineGameObject.ts) is constructed from them. `SpineGameObject` instances can share the same skeleton data and atlas.

### Creating SpineGameObject instances
Once skeleton data and a corresponding atlas have been loaded, a `SpineGameObject` can be created and optionally be added to the current scene via the `spine()` functions added to the scene's [GameObjectFactory (`Scene.add`)](https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectFactory.html) and [GameObjectCreator (`Scene.make`)](https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectCreator.html) by the `SpinePlugin`. You can use them in your scene's `create()` function:

```
function create() {
   // Create a SpineGameObject through the GameObjectFactory and add it to the scene
   const spineObject = this.add.spine(400, 500, "skeleton-data", "skeleton-atlas");

   // Create a SpineGameObject through the GameObjectCreator. It is not automatically
   // added to the scene.
   const spineObject2 = this.make.spine({
      x: 200, y: 500,
      dataKey: "skeleton-data", atlasKey: "skeleton-atlas"
   });

   // Manually add the game object to the scene
   this.add.existing(spineObject2);
}
```

The `spine()` function on the `GameObjectFactory` takes the objects position, the key of the skeleton data, and the key of the atlas as a parameter. This function will automatically add the object to the scene.

The `spine()` function on the `GameObjectCreator` takes a [SpineGameObjectConfig](/git/spine-runtimes/spine-ts/spine-phaser-v4/src/SpinePlugin.ts) as a parameter, which also specifies the position, data key, and atlas key. This function will not automatically add the object to the scene.

By default, a `SpineGameObject` is sized based on its setup pose bounding box. This behaviour can be customized by passing an optional [`SpineGameObjectBoundsProvider`](/git/spine-runtimes/spine-ts/spine-phaser-v4/src/SpineGameObject.ts) parameter to either of the `spine()` functions.

A bounds provider calculates the size of the bounding box of a Spine game object. By default, a `SetupPoseBoundsProvider` is used, which calculates the bounding box based on the bounds of the skeleton in its setup pose.

Another bounds provider is the `SkinsAndAnimationBoundsProvider`, which calculates the bounding box based on the maximum bounding box for a given set of skins and animation.

You can also pass a custom bounds provider to the `spine()` functions by implementing the [`SpineGameObjectBoundsProvider` interface](/git/spine-runtimes/spine-ts/spine-phaser-v4/src/SpinePlugin.ts).

## SpineGameObject
A `SpineGameObject` is a Phaser [GameObject](https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObject.html) that bundles storing, updating, and rendering a `Skeleton` and its associated `AnimationState`. `SpineGameObject` instances are created from a skeleton data and an atlas, as described in the last section. The `Skeleton` and `AnimationState` are accessible through the `skeleton` and `animationState` fields respectively.

Every frame, the `SpineGameObject` will:

* Update the `AnimationState`
* Apply the `AnimationState` to the `Skeleton`
* Update the `Skeleton` world transforms, resulting in a new pose
* Render the `Skeleton` in its current pose

### Applying Animations
Applying animations to a skeleton displayed by a `SpineGameObject` is done through the `AnimationState`.

> **Note:** See [Applying Animations](/spine-applying-animations#AnimationState-API) in the Spine Runtimes Guide for more in-depth information, specifically about animation tracks and animation queueing.

To set a specific animation on track 0, call `AnimationState.setAnimation()`:

```
spineObject.animationState.setAnimation(0, "walk", true);
```

The first parameter specifies the track, the second parameter is the name of the animation, and the third parameter defines whether to loop the animation.

You can queue multiple animations:

```
spineObject.animationState.setAnimation(0, "walk", true);
spineObject.animationState.addAnimation(0, "jump", 2, false);
spineObject.animationState.addAnimation(0, "run", 0, true);
```

The first parameter to `addAnimation()` is the track. The second parameter is the name of the animation. The third parameter specifies the delay in seconds, after which this animation should replace the previous animation on the track. The final parameter defines whether to loop the animation.

In the example above, the `"walk"` animation is played back first. 2 seconds later, the `"jump"` animation is played back once, followed by a transition to the `"run"` animation, which will be looped.

When transitioning from one animation to another, `AnimationState` will mix the animations for a specific duration called mix time. These mix times are defined in an `AnimationStateData` instance, from which the `AnimationState` retrieves mix times.

The `AnimationStateData` instance is also available through the `SpineGameObject`. You can set the default mix time, or the mix time for a specific pair of animations:

```
spineObject.animationStateData.setDefaultMix = 0.2;
spineObject.animationStateData.setMix("walk", "jump", 0.1);
```

When setting or adding an animation, a `TrackEntry` object is returned, which allows further modification of that animation's playback. For example, you can set the track entry to reverse the animation playback:

```
const entry = spineObject.animationState.setAnimation(0, "walk", true);
entry.reverse = true;
```

See the [`TrackEntry` class documentation](/git/spine-runtimes/spine-ts/spine-core/src/AnimationState.ts#L785) for more options.

> **Note:** Be careful about holding on to `TrackEntry` instances outside the function you are using them in. Track entries are re-used internally and will thus become invalid once the track entry [dispose event](/spine-api-reference#AnimationStateListener-dispose) occurs.

You can set or queue empty animations on an animation track to smoothly reset the skeleton back to its setup pose:

```
spineObject.animationState.setEmptyAnimation(0, 0.5);
spineObject.animationState.addEmptyAnimation(0, 0.5, 0.5);
```

The first parameter to `setEmptyAnimation()` specifies the track. The second parameter specifies the mix duration in seconds used to mix out the previous animation and mix in the "empty" animation.

The first parameter to `addEmptyAnimation()` specifies the track. The second parameter specifies the mix duration. The third parameter is the delay in seconds, after which the empty animation should replace the previous animation on the track via mixing.

All animations on a track can be cleared immediately via `AnimationState.clearTrack()`. To clear all tracks at once, `AnimationState.clearTracks()` can be used. This will leave the skeleton in the last pose it was in.

To reset the pose of a skeleton to the setup pose, use `Skeleton.setToSetupPose()`:

```
spineObject.skeleton.setToSetupPose();
```

This will reset both the bones and slots to their setup pose configuration. Use `Skeleton.setSlotsToSetupPose()` to only reset the slots to their setup pose configuration.

### AnimationState Events
An `AnimationState` emits events during the life-cycle of an animation that is being played back. You can listen for this events to react as needed. The Spine Runtimes API defines the following [event types](/git/spine-runtimes/spine-ts/spine-core/src/AnimationState.ts#L1108):

* `start`: emitted when an animation is started.
* `interrupt`: emitted when an animation's track was cleared, or a new animation was set.
* `end`: emitted when an animation will never be applied again.
* `dispose`: emitted when the animation's track entry is disposed.
* `complete`: emitted when an animation completes a loop.
* `event`: emitted when a user defined [event](/spine-events#Events) happened.

To receive events, you can register an [`AnimationStateListener`](/git/spine-runtimes/spine-ts/spine-core/src/AnimationState.ts#L1117) callback with either the `AnimationState` to receive events across all animations, or with the `TrackEntry` of a specific animation queued for playback:

```
spineObject.animationState.addListener({
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

See the [`events-example.html`](/git/spine-runtimes/spine-ts/spine-phaser-v4/example/events-example.html) example.

## Skins
Many applications and games allow users to create custom avatars out of many individual items, such as hair, eyes, pants, or accessories like earrings or bags. With Spine, this can be achived by [mixing and matching skins](/spine-examples-mix-and-match).

You can create custom skins from other skins like this:

```
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

Create a custom skin with the `Skin()` constructor.

Next, fetch the `SkeletonData` from the skeleton. It is used to look up skins by name via `SkeletonData.findSkin()`.

Add all the skins you want to combine into the new custom skin via `Skin.addSkin()`.

Finally, set the new skin on the `Skeleton` and call `Skeleton.setSlotsToSetupPose()` to ensure no attachments from previous skins and/or animations are left over.

See [`mix-and-match-example.html`](/git/spine-runtimes/spine-ts/spine-phaser-v4/example/mix-and-match-example.html) for full example code.

## Setting Bone Transforms
When authoring a skeleton in the Spine Editor, the skeleton is defined in what is called the skeleton's world coordinate system or "skeleton coordinate system". This coordinate system may not align with the coordinate system of Phaser. Mouse and touch coordinates relative to the `SpineGameObject` need thus be converted to the skeleton coordinate system, e.g. if a user should be able to move a bone by touch.

The `SpineGameObject` offers the method `phaserWorldCoordinatesToBone(point: { x: number, y: number}, bone: Bone)` which takes an a point relative to the SpineGameObject and converts it to the skeleton's coordinate system, relative to the specified bone.

The reverse, that is converting from the skeleton coordinate system to the Phaser coordinate system, can be achieved via `SpineGameObject.skeletonToPhaserWorldCoordinates(point: { x: number, y: number})`.

See [`control-bones-example.html`](/git/spine-runtimes/spine-ts/spine-phaser-v4/example/control-bones-example.html) for full example code.

## Spine Runtimes API access
spine-phaser exposes the entire [spine-ts core](https://github.com/EsotericSoftware/spine-runtimes/tree/4.2/spine-ts/spine-core) API via the `SpineGameObject` properties `skeleton`, `animationStateData`, and `animationState`. See the JS doc documentation of these classes as well as the generic [Spine Runtimes Guide](/spine-runtimes-guide).

## Differences to the Phaser Spine Plugin
Phaser offers its own [Spine Plugin](https://photonstorm.github.io/phaser3-docs/SpineGameObject.html) which is based on our `spine-ts WebGL` runtime. While writing our official spine-phaser runtime, we tried to stay as close to the API provided by Phaser. Here we discuss the few differences between the Phaser provided plugin and our official spine-phaser runtime API.

Starting with Spine 4.1, our spine-phaser runtime will be maintained like our other Spine Runtimes. This means you'll get timely updates whenever a new Spine Editor version is released, you will have access to beta runtimes for the next Spine Editor version, and you'll receive all the latest improvements and bug fixes in a timely manner. The Phaser maintainers may not be able to provide such guarantees, as the Spine Plugin is understandably not their number one priority.

On the API side, there are a handful of differences to watch out for.

### Loading skeleton and atlas data
Loading a skeleton and its atlas with the Phaser Spine Plugin is a single step:

```javascript
this.load.spine('spineboy', 'spineboy.json`, [ `spineboy.atlas` ], true);
```

With the spine-phaser runtime, the atlas data and skeleton data are loaded separately.

```
this.load.spineBinary("spineboy-data", "spineboy.skel");
this.load.spineAtlas("spineboy-atlas", "spineboy.atlas");
```

This allows you to share the same atlas across different skeletons. The spine-phaser runtime also supports both loading JSON and binary skeleton data, whereas the Phaser Spine Plugin can only load JSON skeleton data. Finally, the loader methods will automatically deduce if a skeleton's atlas uses pre-multiplied alpha or not.

The spine-phaser skeleton data loader does not support loading multiple spine skeletons from a single JSON file while the Phaser Spine Plugin does.

### Creating SpineGameObject instances
Creating a `SpineGameObject` with the Phaser Spine Plugin references only a single loaded asset, and offers many additional, optional parameters.

```javascript
const spineboy = this.add.spine(400, 600, 'spineboy', 'idle', true);
```

The spine-phaser runtime requires you to specify the keys of both the skeleton data and atlas.

```javascript
const spineboy = this.add.spine(400, 500, 'spineboy-data', "spineboy-atlas");
spineboy.animationState.setAnimation(0, "idle", true)
```

You can provide an optional `SkeletonBoundsProvider` as the 5th parameter as described above. However, you can not configure any other properties through this method. Instead, you directly access the methods and properties of the `SpineGameObject` to configure it to your liking.

### Spine Container
The Phaser Spine Plugin features a special container class called [SpineContainer](https://photonstorm.github.io/phaser3-docs/SpineContainer.html). Its purpose is to batch the rendering of multiple `SpineGameObject` instances contained within it for better performance.

With the spine-phaser runtime, this is not necessary, as the renderer will automatically batch subsequent `SpineGameObject` instances if possible, irrespective of their container parent.

### Examples ports
To further ease the transition from the Phaser Spine Plugin to our official spine-phaser runtime, we've ported most of the [Phaser Spine Plugin examples](https://labs.phaser.io/index.html?dir=spine4/&q=) to the [spine-phaser runtime](/git/spine-runtimes/spine-ts/spine-phaser-v4/example/).

---
## File: Runtimes, spine-pixi/spine-pixi.md
## Title: spine-pixi Runtime Documentation
## URL: http://esotericsoftware.com/spine-pixi
---

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

---
## File: Runtimes, spine-sdl/spine-sdl.md
## Title: spine-sdl Runtime Documentation
## URL: http://esotericsoftware.com/spine-sdl
---

# spine-sdl Runtime Documentation

> **Licensing**
>
> Please see the [Spine Runtimes License](/spine-runtimes-license) before integrating the Spine Runtimes into your applications.

# Getting Started
spine-sdl is a C and C++ based runtime to load, manipulate and render Spine skeletons with [SDL](https://www.libsdl.org/).

spine-sdl requires SDL 2.0.18+ and supports all Spine features except two-color tinting.

## Installation

The spine-sdl runtime is available as a C and C++ API. Both APIs are based on [spine-c](/spine-c) and [spine-cpp](/spine-cpp) runtimes. Note that spine-c depends on spine-cpp, so both are required regardless of which API you choose to use.

### Integration with CMake (Recommended)

The easiest way to integrate spine-sdl into your project is via CMake FetchContent:

```cmake
cmake_minimum_required(VERSION 3.16)
project(MySpineProject)

include(FetchContent)
FetchContent_Declare(
    spine-sdl
    GIT_REPOSITORY https://github.com/esotericsoftware/spine-runtimes.git
    GIT_TAG 4.3
    SOURCE_SUBDIR spine-sdl
)
FetchContent_MakeAvailable(spine-sdl)

# Create your executable
add_executable(MyApp main.cpp)

# For C API
target_link_libraries(MyApp spine-sdl-c)

# For C++ API
target_link_libraries(MyApp spine-sdl-cpp)
```

This will automatically fetch and build spine-sdl along with all its dependencies (spine-c, spine-cpp, and SDL).

### Manual Integration

If you prefer manual integration:

1. Download the Spine Runtimes source using git (`git clone https://github.com/esotericsoftware/spine-runtimes`) or download as a zip.
2. Add the required source files to your project:
   - For C API: Add sources from `spine-cpp/src`, `spine-c/src`, and `spine-sdl/src/spine-sdl-c.c`
   - For C++ API: Add sources from `spine-cpp/src`, `spine-c/src`, and `spine-sdl/src/spine-sdl-cpp.cpp`
3. Add the include directories: `spine-cpp/include`, `spine-c/include`, and `spine-sdl/src`
4. Link against SDL2

In your C or C++ code, include either of the following header files to get access to the `spine-sdl` API:

```cpp
// C API
#include <spine-sdl-c.h>

// C++ API
#include <spine-sdl-cpp.h>
```

> *Note:* spine-sdl requires the [`SDL_RenderGeometry`](https://wiki.libsdl.org/SDL_RenderGeometry) API which is available since SDL 2.0.18. Earlier versions of SDL are not compatible with spine-sdl.

## Samples
The spine-sdl example works on Windows, Linux and Mac OS X. For a [spine-c](/spine-c) based example, see [example/main.c](/git/spine-runtimes/tree/spine-sdl/example/main.c), for a spine-cpp example see [example/main.cpp](/git/spine-runtimes/tree/spine-sdl/example/main.cpp).

### Windows

1. Install [Visual Studio Community](https://visualstudio.microsoft.com/downloads/). Make sure you install support for C++ and CMake.
2. Download the Spine Runtimes repository using git (`git clone https://github.com/esotericsoftware/spine-runtimes`) or download it as a zip.
3. Open Visual Studio Community, then open `spine-sdl/` via the **Open a local folder** button in the Visual Studio Community launcher.
4. Wait for CMake to finish, then select either `spine-sdl-c-example.exe` or `spine-sdl-cpp-example.exe` as the start-up project and start debugging.

### Linux

1. Install dependencies:
   ```bash
   sudo apt-get install cmake ninja-build  # Ubuntu/Debian
   # or equivalent for your distribution
   ```
2. Clone the repository: `git clone https://github.com/esotericsoftware/spine-runtimes`
3. Build and run:
   ```bash
   cd spine-runtimes/spine-sdl
   ./build.sh
   ./build/debug/spine-sdl-c-example    # Run C example
   ./build/debug/spine-sdl-cpp-example  # Run C++ example
   ```

### macOS

1. Install [Xcode](https://developer.apple.com/xcode/)
2. Install [Homebrew](http://brew.sh/)
3. Install dependencies:
   ```bash
   brew install cmake ninja
   ```
4. Clone the repository: `git clone https://github.com/esotericsoftware/spine-runtimes`
5. Build and run:
   ```bash
   cd spine-runtimes/spine-sdl
   ./build.sh
   ./build/debug/spine-sdl-c-example    # Run C example
   ./build/debug/spine-sdl-cpp-example  # Run C++ example
   ```

## Using spine-sdl
The spine-sdl runtime supports playback and manipulation of animations created with Spine with [SDL](https://www.libsdl.org). The spine-sdl runtime comes as both a C and C++ implementation, based on the generic [spine-c](/spine-c) and [spine-cpp](/spine-cpp) runtimes. It adds loading and rendering implementations based on the SDL APIs.

Please consult the [Spine Runtimes Guide](/spine-runtimes) for a detailed overview of the Spine Runtime architecture, and the [spine-c](/spine-c) and [spine-cpp](/spine-cpp) documentation for information on the core APIs used to playback and manipulate animations created with Spine with C and C++.

### Exporting for SDL
![](/img/spine-runtimes-guide/spine-ue4/export.png)
Please follow the instructions in the Spine User Guide on how to

1. [Export skeleton & animation data](/spine-export)
2. [Export texture atlases containing the images of your skeleton](/spine-texture-packer)

An export of the skeleton data and texture atlas of your skeleton will yield the following files:

![](/img/spine-runtimes-guide/spine-ue4/exported-files.png)

1. `skeleton-name.json` or `skeleton-name.skel`, containing your skeleton and animation data.
2. `skeleton-name.atlas`, containing information about the texture atlas.
3. One or more `.png` files, each representing on page of your texture atlas containing the packed images your skeleton uses.

> **Note:** The spine-sdl runtime does not support two-color tinting.

### Loading Spine skeletons
The spine-sdl runtime uses the [`SDL_Renderer`](https://wiki.libsdl.org/SDL_Renderer) API to display skeletons. Before a skeleton can be loaded from exported files, an `SDL_Renderer` must be created:

```cpp
SDL_Renderer *renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC);
```

#### Loading with C API

With the spine-c API, loading requires texture loading callbacks and manual file reading:

```cpp
// Global renderer for texture loading callbacks
static SDL_Renderer *g_renderer;

// Texture loading callbacks
void *load_texture_callback(const char *path) {
    extern void *load_texture(const char *path, SDL_Renderer *renderer);
    return load_texture(path, g_renderer);
}

void unload_texture_callback(void *texture) {
    SDL_DestroyTexture((SDL_Texture*)texture);
}

// Set the global renderer
g_renderer = renderer;

// Read atlas file into memory
int atlas_length;
char *atlas_data = read_file("data/spineboy-pma.atlas", &atlas_length);

// Load atlas with callbacks
spine_atlas_result atlas_result = spine_atlas_load_callback(
    atlas_data, "data/", load_texture_callback, unload_texture_callback);
spine_atlas atlas = spine_atlas_result_get_atlas(atlas_result);

// Read skeleton file into memory
int skeleton_length;
char *skeleton_data = read_file("data/spineboy-pro.json", &skeleton_length);

// Load skeleton data
spine_skeleton_data_result skeleton_result = spine_skeleton_data_load_json(
    atlas, skeleton_data, "data/");
spine_skeleton_data skeleton_data_handle = spine_skeleton_data_result_get_data(skeleton_result);

// Free file data
free(atlas_data);
free(skeleton_data);
```

#### Loading with C++ API

For the C++ API, a `SDLTextureLoader` is needed:

```cpp
// C++ API
spine::SDLTextureLoader textureLoader(renderer);
spine::Atlas atlas("data/spineboy-pma.atlas", &textureLoader);
spine::SkeletonJson json(atlas);
spine::SkeletonData *skeletonData = json.readSkeletonDataFile("data/spineboy-pro.json");
```

The loaded skeleton data and atlas can and should be shared across skeleton instances to reduce memory consumption and enable batched rendering of skeletons that share the same atlas data.

### Rendering Skeletons

spine-sdl provides simple rendering functions that work directly with skeletons and skeleton drawables.

#### C API

```cpp
// Create skeleton drawable (combines skeleton + animation state)
spine_skeleton_drawable drawable = spine_skeleton_drawable_create(skeleton_data_handle);
spine_skeleton skeleton = spine_skeleton_drawable_get_skeleton(drawable);
spine_animation_state animation_state = spine_skeleton_drawable_get_animation_state(drawable);

// Setup skeleton
spine_skeleton_set_position(skeleton, 400, 500);
spine_skeleton_set_scale(skeleton, 0.5f, 0.5f);
spine_skeleton_setup_pose(skeleton);

// Setup animation
spine_animation_state_set_animation_1(animation_state, 0, "portal", false);
spine_animation_state_add_animation_1(animation_state, 0, "run", true, 0);

// Update and render (in your main loop)
spine_skeleton_drawable_update(drawable, deltaTime);
spine_sdl_draw(drawable, renderer, true); // true for premultiplied alpha

// Or draw skeleton directly without drawable
spine_sdl_draw_skeleton(skeleton, renderer, true);

// Cleanup
spine_skeleton_drawable_dispose(drawable);
spine_skeleton_data_dispose(skeleton_data_handle);
spine_atlas_dispose(atlas);
spine_skeleton_data_result_dispose(skeleton_result);
spine_atlas_result_dispose(atlas_result);
```

#### C++ API

```cpp
// Create skeleton and animation state
spine::Skeleton skeleton(*skeletonData);
spine::AnimationStateData animationStateData(*skeletonData);
spine::AnimationState animationState(animationStateData);

// Setup skeleton
skeleton.setPosition(400, 500);
skeleton.setupPose();

// Setup animation
animationState.setAnimation(0, "portal", false);
animationState.addAnimation(0, "run", true, 0);

// Update and render (in your main loop)
animationState.update(deltaTime);
animationState.apply(skeleton);
skeleton.update(deltaTime);
skeleton.updateWorldTransform(spine::Physics_Update);

// Draw using the simple SDL_draw function
spine::SDL_draw(skeleton, renderer, true); // true for premultiplied alpha

// Cleanup
delete skeletonData;
delete &atlas;
```

Please refer to the [spine-c](/spine-c) and [spine-cpp](/spine-cpp) documentation for more information on the APIs to manipulate skeletons and animation states.

### Cleanup

When you no longer need the skeleton and atlas data, free their memory:

#### C API
```cpp
// Dispose skeleton drawable and data
spine_skeleton_drawable_dispose(drawable);
spine_skeleton_data_dispose(skeleton_data_handle);
spine_atlas_dispose(atlas);
spine_skeleton_data_result_dispose(skeleton_result);
spine_atlas_result_dispose(atlas_result);

// Free manually allocated file data
free(atlas_data);
free(skeleton_data);
```

#### C++ API
```cpp
// C++ API cleanup
delete skeletonData;
delete &atlas; // If allocated with new
```

> *Note:* Freeing skeleton data and atlas instances will automatically dispose of any associated SDL textures through the texture loader.

---
## File: Runtimes, spine-sfml/spine-sfml.md
## Title: spine-sfml Runtime Documentation
## URL: http://esotericsoftware.com/spine-sfml
---

# spine-sfml Runtime Documentation

> **Licensing**
>
> Please see the [Spine Runtimes License](/spine-runtimes-license) before integrating the Spine Runtimes into your applications.

# Getting Started
spine-sfml is a C++ based runtime to load, manipulate and render Spine skeletons with [SFML](https://www.sfml-dev.org/).

spine-sfml requires SFML 2.6+ and supports all Spine features.

## Installation

The spine-sfml runtime is available as a C++ API based on the generic [spine-cpp](/spine-cpp) runtime.

### Integration with CMake (Recommended)

The easiest way to integrate spine-sfml into your project is via CMake FetchContent:

```cmake
cmake_minimum_required(VERSION 3.16)
project(MySpineProject)

include(FetchContent)
FetchContent_Declare(
    spine-sfml
    GIT_REPOSITORY https://github.com/esotericsoftware/spine-runtimes.git
    GIT_TAG 4.3
    SOURCE_SUBDIR spine-sfml
)
FetchContent_MakeAvailable(spine-sfml)

# Create your executable
add_executable(MyApp main.cpp)

# Link against spine-sfml
target_link_libraries(MyApp spine-sfml)
```

This will automatically fetch and build spine-sfml along with all its dependencies (spine-cpp and SFML).

### Manual Integration

If you prefer manual integration:

1. Download the Spine Runtimes source using git (`git clone https://github.com/esotericsoftware/spine-runtimes`) or download as a zip.
2. Add the required source files to your project:
   - Add sources from `spine-cpp/src` and `spine-sfml/src/spine-sfml.cpp`
3. Add the include directories: `spine-cpp/include` and `spine-sfml/src`
4. Link against SFML libraries (sfml-graphics, sfml-window, sfml-system)

In your C++ code, include the following header file to get access to the `spine-sfml` API:

```cpp
#include <spine-sfml.h>
```

> *Note:* spine-sfml is built on top of the SFML C++ library. There is no C API available for spine-sfml.

## Samples
The spine-sfml example works on Windows, Linux and Mac OS X. See [example/main.cpp](/git/spine-runtimes/tree/spine-sfml/example/main.cpp).

### Windows

1. Install [Visual Studio Community](https://visualstudio.microsoft.com/downloads/). Make sure you install support for C++ and CMake.
2. Download the Spine Runtimes repository using git (`git clone https://github.com/esotericsoftware/spine-runtimes`) or download it as a zip.
3. Open Visual Studio Community, then open `spine-sfml/` via the **Open a local folder** button in the Visual Studio Community launcher.
4. Wait for CMake to finish, then select `spine-sfml-example.exe` as the start-up project and start debugging.

### Linux

1. Install dependencies:
   ```bash
   sudo apt-get install cmake ninja-build libsfml-dev  # Ubuntu/Debian
   # or equivalent for your distribution
   ```
2. Clone the repository: `git clone https://github.com/esotericsoftware/spine-runtimes`
3. Build and run:
   ```bash
   cd spine-runtimes/spine-sfml
   ./build.sh
   ./build/debug/spine-sfml-example
   ```

### macOS

1. Install [Xcode](https://developer.apple.com/xcode/)
2. Install [Homebrew](http://brew.sh/)
3. Install dependencies:
   ```bash
   brew install cmake ninja
   ```
4. Clone the repository: `git clone https://github.com/esotericsoftware/spine-runtimes`
5. Build and run:
   ```bash
   cd spine-runtimes/spine-sfml
   ./build.sh
   ./build/debug/spine-sfml-example
   ```

## Using spine-sfml
The spine-sfml runtime supports playback and manipulation of animations created with Spine with [SFML](https://www.sfml-dev.org/). The spine-sfml runtime is implemented in C++ and is based on the generic [spine-cpp](/spine-cpp) runtime. It adds loading and rendering implementations based on the SFML APIs.

Please consult the [Spine Runtimes Guide](/spine-runtimes) for a detailed overview of the Spine Runtime architecture, and the [spine-cpp](/spine-cpp) documentation for information on the core APIs used to playback and manipulate animations created with Spine with C++.

### Exporting for SFML
![](/img/spine-runtimes-guide/spine-ue4/export.png)
Please follow the instructions in the Spine User Guide on how to

1. [Export skeleton & animation data](/spine-export)
2. [Export texture atlases containing the images of your skeleton](/spine-texture-packer)

An export of the skeleton data and texture atlas of your skeleton will yield the following files:

![](/img/spine-runtimes-guide/spine-ue4/exported-files.png)

1. `skeleton-name.json` or `skeleton-name.skel`, containing your skeleton and animation data.
2. `skeleton-name.atlas`, containing information about the texture atlas.
3. One or more `.png` files, each representing on page of your texture atlas containing the packed images your skeleton uses.

### Loading Spine skeletons
The spine-sfml runtime uses SFML's rendering API to display skeletons. Before a skeleton can be loaded from exported files, an `sf::RenderWindow` must be created:

```cpp
// Create SFML window
sf::RenderWindow window(sf::VideoMode(800, 600), "Spine SFML");
window.setFramerateLimit(60);
```

#### Loading with C++ API

The spine-sfml runtime provides an `SFMLTextureLoader` for loading textures:

```cpp
// Create texture loader
spine::SFMLTextureLoader textureLoader;

// Load atlas
spine::Atlas atlas("data/spineboy-pma.atlas", &textureLoader);

// Load skeleton data from binary
spine::SkeletonBinary binary(atlas);
spine::SkeletonData *skeletonData = binary.readSkeletonDataFile("data/spineboy-pro.skel");

// Or load from JSON
spine::SkeletonJson json(atlas);
spine::SkeletonData *skeletonData = json.readSkeletonDataFile("data/spineboy-pro.json");
```

The loaded skeleton data and atlas can and should be shared across skeleton instances to reduce memory consumption and enable batched rendering of skeletons that share the same atlas data.

### Rendering Skeletons

spine-sfml provides a simple rendering function that works directly with skeletons.

```cpp
// Create skeleton and animation state
spine::Skeleton skeleton(*skeletonData);
spine::AnimationStateData animationStateData(*skeletonData);
spine::AnimationState animationState(animationStateData);

// Setup skeleton
skeleton.setPosition(400, 500);
skeleton.setScaleX(0.5f);
skeleton.setScaleY(0.5f);
skeleton.setupPose();

// Setup animation
animationStateData.setDefaultMix(0.2f);
animationState.setAnimation(0, "portal", false);
animationState.addAnimation(0, "run", true, 0);

// Update and render (in your main loop)
animationState.update(deltaTime);
animationState.apply(skeleton);
skeleton.update(deltaTime);
skeleton.updateWorldTransform(spine::Physics_Update);

// Clear and draw
window.clear(sf::Color::Black);
spine::SFML_draw(skeleton, window, true); // true for premultiplied alpha
window.display();

// Cleanup
delete skeletonData;
```

### Complete Example

Here's a complete example showing how to load and render a Spine skeleton with SFML:

```cpp
#include <spine-sfml.h>
#include <SFML/Graphics.hpp>

int main() {
    // Create SFML window
    sf::RenderWindow window(sf::VideoMode(800, 600), "Spine SFML Example");
    window.setFramerateLimit(60);
    
    // Load atlas and skeleton
    spine::SFMLTextureLoader textureLoader;
    spine::Atlas atlas("data/spineboy-pma.atlas", &textureLoader);
    
    spine::SkeletonJson json(atlas);
    spine::SkeletonData* skeletonData = json.readSkeletonDataFile("data/spineboy-pro.json");
    if (!skeletonData) {
        printf("Failed to load skeleton data\n");
        return 1;
    }
    
    // Create skeleton and animation state
    spine::Skeleton skeleton(*skeletonData);
    spine::AnimationStateData animationStateData(*skeletonData);
    animationStateData.setDefaultMix(0.2f);
    spine::AnimationState animationState(animationStateData);
    
    // Setup skeleton
    skeleton.setPosition(400, 500);
    skeleton.setScaleX(0.5f);
    skeleton.setScaleY(0.5f);
    skeleton.setupPose();
    
    // Setup animation
    animationState.setAnimation(0, "portal", false);
    animationState.addAnimation(0, "run", true, 0);
    
    // Main loop
    sf::Clock clock;
    while (window.isOpen()) {
        // Handle events
        sf::Event event;
        while (window.pollEvent(event)) {
            if (event.type == sf::Event::Closed) {
                window.close();
            }
        }
        
        // Update animation
        float deltaTime = clock.restart().asSeconds();
        animationState.update(deltaTime);
        animationState.apply(skeleton);
        skeleton.update(deltaTime);
        skeleton.updateWorldTransform(spine::Physics_Update);
        
        // Clear and draw
        window.clear(sf::Color::Black);
        spine::SFML_draw(skeleton, window, true);
        window.display();
    }
    
    // Cleanup
    delete skeletonData;
    
    return 0;
}
```

Please refer to the [spine-cpp](/spine-cpp) documentation for more information on the APIs to manipulate skeletons and animation states.

### Cleanup

When you no longer need the skeleton and atlas data, free their memory:

```cpp
// Delete skeleton data and atlas
delete skeletonData;
// Atlas is stack allocated in the examples above, so it will be automatically cleaned up
// If you allocated it with new, delete it:
// delete atlas;
```

> *Note:* Freeing skeleton data and atlas instances will automatically dispose of any associated SFML textures through the texture loader.

---
## File: Runtimes, spine-ts/spine-player.md
## Title: Spine Web Player
## URL: http://esotericsoftware.com/spine-player
---

<script src="https://unpkg.com/@esotericsoftware/spine-player@4.2.*/dist/iife/spine-player.js"> </script>
<link rel="stylesheet" href="https://unpkg.com/@esotericsoftware/spine-player@4.2.*/dist/spine-player.css">
<link rel="stylesheet" href="https://gist.githubusercontent.com/saintedlama/628ba457dd5ae8b97ece/raw/8879ee2b4a8f8bb0e4d6ac0a14ab90c4c2d0a564/monokai.css">
<style>

#player-all-together {
   margin-bottom: 1.1em;
}

#player-all-together iframe {
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  box-shadow: none !important;
  max-width: none !important;
  border-radius: 4px;
}

#player-all-together {
   margin-bottom: 1.1em;
}

#player-all-together iframe {
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  box-shadow: none !important;
  max-width: none !important;
  border-radius: 4px;
}

#player-all-together .CodeMirror {
  line-height: normal;
  background-color: #000;
  color: #ddd;
}
</style>
!!

# Spine Web Player
The Spine web player lets you easily embed your Spine animations on your website.

<div id="player-top" style="margin-bottom: 2em;"></div>
<script>
new spine.SpinePlayer("player-top", {
   skeleton: "/files/examples/4.2/raptor/export/raptor-pro.json",
   atlas: "/files/examples/4.2/raptor/export/raptor-pma.atlas",
   animation: "walk",
   premultipliedAlpha: true,
   backgroundColor: "#666666",
});
</script>
!!

The player has controls that allow a user to:

* Pause/resume the currently playing animation.
* Scrub the timeline.
* Change the playback speed.
* Select an animation from a list of available animations.
* Select a skin from a list of available skins.
* Hide/show debug renderings of regions, meshes, bones, etc.
* Drag skeleton bones.

The player's controls can be disabled so it can be used just for displaying animations, without user input ([example](/blog/Spine-4.0-is-here)).

> **Note**: The Spine Web Player uses [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) for rendering. While WebGL is supported by all recent versions of popular desktop and mobile browsers, there may be [compatibility issues with old browsers](https://caniuse.com/#search=webgl).

## Exporting for the player
The Spine Web Player can display Spine skeletons exported from the Spine Editor in the `JSON` format.

![Export](/img/spine-runtimes-guide/spine-player/export.png)

In addition to the exported `.json` file, the player also requires a texture atlas consisting of a `.atlas` file and one or more `.png` files. Please see the Spine User Guide on how to [export skeletons to `JSON`](/spine-export) and how to [export a texture atlas](/spine-texture-packer) for more details.

We will use the [Spineboy project](/spine-examples-spineboy) for all examples below, for which the export creates the following files:

![Spineboy files](/img/spine-runtimes-guide/spine-ue4/exported-files.png)

These files must be uploaded to a web server and accessible via URLs.

> The `.png` files need to be accessible under the same path as the `.altas` file. For example, if the `.atlas` file is accessible via `https://mysite.com/assets/spineboy.atlas`, the `.png` file(s) must be accessible via `https://mysite.com/assets/spineboy.png`.

## Embedding a player
Adding the player to your website consists of a few simple steps, detailed below.

### Adding the JavaScript & CSS files
The Spine Web Player consists of two files: `spine-player.js` and `spine-player.css`. The JS file contains the JavaScript code required for the player functionality, while CSS file defines the CSS for the player's UI.

The two files can be added to a web page like this:

```
<script src="https://unpkg.com/@esotericsoftware/spine-player@4.2.*/dist/iife/spine-player.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@esotericsoftware/spine-player@4.2.*/dist/spine-player.css">
```

In the above example, the two files are loaded from [UNPKG](https://unpkg.com/), a fast NPM CDN. The URLs contain a version number (`4.2`) which must match the Spine editor version you used to export your skeleton and atlas. Loading the files like shown above will ensure that your Spine players always use the latest JavaScript code and CSS.

Use the `.min.js` and `.min.css` file extension for minified files on the UNPKG CDN:

```
<script src="https://unpkg.com/@esotericsoftware/spine-player@4.2.*/dist/iife/spine-player.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@esotericsoftware/spine-player@4.2.*/dist/spine-player.min.css">
```

If you don't want to use UNPKG then you can host the files yourself by downloading them from UNPKG or by building them from the sources provided on our [GitHub repository](/git/runtimes/spine-ts). There you will also find instructions on how to use the Spine Web Player together with NPM or Yarn.

### Creating a container element
The player requires an element into which it should be loaded. The easiest way to do this is to create a `div` element with an `id`:

```
<div id="player-container" style="width: 640px; height: 480px;"></div>
```

### Initializing the player
For the final step, the player needs to be initialized with a short JavaScript snippet:

```
<script>
new spine.SpinePlayer("player-container", {
		skeleton: "/files/spineboy/export/spineboy-pro.json",
		atlas: "/files/spineboy/export/spineboy.atlas",
		scale: 1,
});
</script>
```

This creates a new `SpinePlayer` in the `player-container` element. The player loads the Skeleton `.json` from the relative URL `/files/spineboy/export/spineboy-pro.json` and the `.atlas` file from `/files/spineboy/export/spineboy.atlas`. This particular texture atlas has one page named `spineboy.png`, so that image is loaded relative to the `.atlas` file, from `/files/spineboy/export/spineboy.png`.

The `scale` should match the [scale](https://esotericsoftware.com/spine-texture-packer#Scale) used to export the texture atlas. It can be omitted if 1.

### Putting it all together

<div id="player-all-together" style="height: 660px"></div>
<script>
var code = "<script src=\"https://unpkg.com/@esotericsoftware/spine-player@4.2.*/dist/iife/spine-player.js\"></" + "script>\n<link rel=\"stylesheet\" href=\"https://unpkg.com/@esotericsoftware/spine-player@4.2.*/dist/spine-player.css\">\n\n<div id=\"player-container\" style=\"width: 100%; height: 100vh;\"></div>\n\n<script>\nnew spine.SpinePlayer(\"player-container\", {\n	skeleton: \"https://esotericsoftware.com/files/examples/4.2/spineboy/export/spineboy-pro.json\",\n	atlas: \"https://esotericsoftware.com/files/examples/4.2/spineboy/export/spineboy-pma.atlas\"\n});\n</" + "script>".trim();
spine.SpinePlayerEditor.DEFAULT_CODE = code;
var player = new spine.SpinePlayerEditor(document.getElementById("player-all-together"));
</script>
!!

> The code in the player above is editable! Use it to experiment with the configuration options explained in the next section.

With the above code, the player will choose default values for all its configurable properties: which animation to play, the background color, and many more. You can further customize the player's appearance and behavior through the configuration detailed below.

## Configuration
The Spine Web Player offers a wide variety of configuration options to adapt it to your requirements.

### JSON, binary, and atlas URL
We have already encountered the two mandatory configuration properties `skeleton` and `atlas` in the example above. They specify from where the player should load the skeleton `.json` or binary `.skel`, and `.atlas` files. You can specify relative or absolute URLs:

```
<script>
new spine.SpinePlayer("player-container", {
   // Relative URLs
   skeleton: "assets/spineboy.json",
   atlas: "assets/spineboy.atlas",
});

new spine.SpinePlayer("player-container", {
   // Absolute URLs
   skeleton: "https://esotericsoftware.com/files/examples/4.2/spineboy/export/spineboy-pro.skel",
   atlas: "https://esotericsoftware.com/files/examples/4.2/spineboy/export/spineboy-pma.atlas"
});
</script>
```

> When using absolute URLs to another domain, it is possible that web browsers won't be able to load the assets. This is usually due to not having [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) enabled on the server that hosts the assets.

### Embedding data
Instead of loading data from URLs, you can also embed the raw `.json/.skel`, `.atlas`, and `.png` files directly in the JavaScript sources. Use the `rawDataURIs` configuration property:

```
new spine.SpinePlayer("player", {
		skeleton: "raptor-pro.json",
		atlas: "raptor-pma.atlas",
		rawDataURIs: {
			"raptor-pro.json": "data:application/json;base64,<base64 encoded raptor-pro.json>",
			"raptor-pma.atlas": "data:application/octet-stream;base64,<base64 encoded raptor-pma.atlas>",
			"raptor-pma.png": "data:image/png;base64,<base64 encoded raptor-pma.png>"
		}
}
```

`rawDataURIs` can also be used to use atlas images from a different path or (if CORS is enabled) a different domain.

```
			"raptor-pma.png": "https://example.com/assets/raptor.png"
```

### Default animation
By default, the player will play the first animation found in the skeleton. The default animation can be set explicitly in the configuration instead:

```
<script>
new spine.SpinePlayer("player-container", {
   ...
   animation: "walk" // Player will start with "walk" animation
});
</script>
```

### Limiting the animations
The player allows a user to select the active animation. The set of animations that can be chosen can be limited via the `animations` property:

```
<script>
new spine.SpinePlayer("player-container", {
   ...
   animations: ["walk", "run", "jump"] // The user can only select one of these three animations
});
</script>
```

The animation button will be hidden by the player if only one animation can be chosen, either because there is only one animation in the skeleton, or because the list of `animations` only contains one animation.

### Default mix time
When a user switches between two animations, the player will mix the animations for `0.25` seconds by default, displaying a smooth transition. This mix time can be set via the `defaultMix` property:

```
<script>
new spine.SpinePlayer("player-container", {
   ...
   defaultMix: 0.1 // Mix animation changes for 0.1 seconds
});
</script>
```

### Default skin
By default, the player will use the default skin of the skeleton, which only has the attachment that are not in a skin in the Spine editor. The active skin can be set explicitly in the configuration via the `skin` property:

```
<script>
new spine.SpinePlayer("player-container", {
   ...
   skin: "funky" // Start with  the "funky" skin
});
</script>
```

### Limiting the skins
The player allows a user to select the active skin. The set of skins that can be chosen can be limited via the `skins` property:


```
<script>
new spine.SpinePlayer("player-container", {
   ...
   skins: ["default", "funky"] // The user can only select one of these two skins
});
</script>
```

The skin button will be hidden by the player if only one skin can be chosen, either because there is only one skin in the skeleton, or because the list of `skins` only contains one skin.

### Premultiplied alpha
By default, the player loads images with [premultiplied alpha](/spine-texture-packer#Settings) enabled. To disable premultiplied alpha, the `premultipliedAlpha` configuration property must be set:


```
<script>
new spine.SpinePlayer("player-container", {
   ...
   premultipliedAlpha: false // Disable premultiplied alpha rendering
});
</script>
```

> We recommend using premultiplied alpha with all assets displayed by the Spine Web Player. It reduces artifacts and seams that may be visible when not using premultiplied alpha.

### Hide controls
The player controls can be hidden via the `showControls` configuration property:

```
<script>
new spine.SpinePlayer("player-container", {
   ...
   showControls: false // Hide the player controls
});
</script>
```

### Control bones

The player allows specifying bone names in the `controlBones` array to enable manual movement by dragging. A semi-transparent red circle is shown as a handle on each listed bone.

```
<script>
new spine.SpinePlayer("player-container", {
   ...
   controlBones: ["head", "hand"] // Enable listed bones to be moved by drag
});
</script>
```

### Disable interactions

The player captures click and touch events for play/pause and bone control. To disable all interactions and prevent event consumption, set `interactive` to `false`.

```
<script>
new spine.SpinePlayer("player-container", {
   ...
   interactive: false // Disable click and touch interactions
});
</script>
```

### Debug visualizations
By default, the player does not show any debug visualizations like regions, mesh triangles, bones, etc. These can be enabled manually by the user via the player controls. The `debug` property can be used to specify which debug visualizations should be enabled by default:

```
<script>
new spine.SpinePlayer("player-container", {
   ...
   debug: {
      bones: true, 
      regions: true,
      meshes: true,
      bounds: true,
      paths: true,
      clipping: true,
      points: true,
      hulls: true
   }
});
</script>
```

Of course, you can omit any visualizations you do not want to enable by default, or set their respective property to `false`.

### Background color
The player background color can be set via the `backgroundColor` configuration property. The color must be specified as a hexadecimal RGBA color (`#rrggbbaa`).

```
<script>
new spine.SpinePlayer("player-container", {
   ...
   backgroundColor: "#ff00ffff" // Magenta player background
});
</script>
```

The player can be expanded to fullscreen by the user. A separate background color for fullscreen mode can be set via the `fullscreenBackgroundColor` configuration property. If not specified, the fullscreen background color will be the same as the `backgroundColor`.

```
<script>
new spine.SpinePlayer("player-container", {
   ...
   backgroundColor: "#ff00ffff" // Magenta player background
   fullScreenBackgroundColor: "#00ff00ff" // Green player background in fullscreen mode
});
</script>
```

### Background image
Instead of a plain background color, the player can also display a background image behind the skeleton. The image can be specified via the `backgroundImage` configuration property:

```
<script>
new spine.SpinePlayer("player-container", {
   ...
   backgroundImage: {  // Display a background image behind the skeleton
      url: "assets/background.png",
      x: 0,
      y: 0,
      width: 330,
      height: 330
   }
});
</script>
```

The `url` is a relative or absolute URL to the background image. The `x` and `y` properties specify the position of the bottom left corner of the image in the skeleton's world coordinate space. The `width` and `height` properties specify the dimensions of the image.

### Translucent player
By default, the player is opaque and will be drawn over any other HTML elements behind it. The `alpha` configuration property can be used in combination with the `backgroundColor` property to make the player translucent, allowing any HTML elements behind to be seen through the player.

```
<script>
new spine.SpinePlayer("player-container", {
   ...
   alpha: true, // Enable player translucency
   backgroundColor: "#00000000" // Background is fully transparent
});
</script>
```

### Viewports
The player always tries to fill the container element it is embedded in. When an animation is chosen (or specified in the configuration), the player ensures the animation is fully visible inside the available player space.

![Viewport](/img/spine-runtimes-guide/spine-player/viewport.png)

In the above image, the green rectangle represents the bounding box automatically calculated for Spineboy's `run` animation. It is padded by 10% on each side by default. The resulting viewport, indicated by the red rectangle, is then embedded in the available space of the player, retaining the viewport's aspect ratio.

This automatic viewport mechanism can be customized via the player configuration. If no viewport configuration is given, the player defaults to the automatic behavior described above.

You can set a **global viewport**, used for all animations, like this:

```
<script>
new spine.SpinePlayer("player-container", {
   ...
   viewport: {
      x: 0,
      y: 0,
      width: 300,
      height: 300,
      padLeft: "5%",
      padRight: "5%",
      padTop: "5%",
      padBottom: "5%",
      clip: true
   }
});
</script>
```

The `x` and `y` properties specify the position of the bottom left corner of the viewport in the skeleton's world coordinate space. The `width` and `height` properties specify the dimensions of the viewport. If any of these properties is omitted, the player ignores all other properties and resorts to the automatic behavior described above.

The `padLeft`, `padRight`, `padTop`, and `padBottom` properties specify the padding to be added to the respective sides of the viewport. In the example above, they are expressed as percentages. You can also specify absolute numbers in the skeleton's world coordinate space instead. If one of these properties is omitted, the player assumes a default value of `10%`.

When `clip` is `true` (v4.3+), the skeleton won't be drawn outside the viewport bounds. This is much more efficient than using a clipping attachment to do the same. The default is `false`.

You can **visualize the viewport** as in the image above by specifying the `debugRender` property:

```
<script>
new spine.SpinePlayer("player-container", {
   ...
   viewport: {
      ...
      debugRender: true // Show the viewport bounds
   }
});
</script>
```

When the player switches between animations, it interpolates the viewports of the old and new animation for `0.2` seconds. This **viewport transition time** can be set via the `transitionTime` property:

```
<script>
new spine.SpinePlayer("player-container", {
   ...
   viewport: {
      ...
      transitionTime: 1 // Transition  between viewports for 1 second
   }
});
</script>
```

It is sometimes helpful to **specify a viewport for a specific animation**. This can be done via the `animations` property:

```
<script>
new spine.SpinePlayer("player-container", {
   ...
   viewport: {
      ...
      animations: {
         "walk": {
            x: 0,
            y: 0,
            width: 300,
            height: 300,
            padLeft: "5%",
            padRight: "5%",
            padTop: "5%",
            padBottom: "5%",
            clip: true
         },
         "run": {
            padTop: "20%",
         }
      }
   }
});
</script>
```

In the above example, we specify a viewport for the `walk` and `run` animations. For the `walk` animation, we define the complete viewport bounds including padding. The global viewport (or the automatic behavior if no global viewport is given) will be completely overwritten for this animation.

For the `run` animation, we only specify the top padding. All other viewport values will be either derived from the global viewport, or from the automatic behavior.

## Advanced playback

The player provides the function `setAnimation(name: string, loop: boolean)` to set an animation by name and specify whether it loops. This function adjusts the [viewport](#Viewports) based on the animation specified.

`setAnimation` cannot be called until after the `success` callback is invoked, which happens as soon as the atlas and skeleton data are loaded. The Spine player instance is passed to `success`. An `error` callback is also provided and is invoked if the atlas or skeleton data could not be loaded.

```
<script>
new spine.SpinePlayer("player-container", {
   ...
	success: function (player) {
		player.setAnimation("run", true);
	},
	error: function (player, reason) {
		alert(reason);
	}
});
</script>
```

For more control, the player's [Skeleton](/spine-api-reference#Skeleton) and [AnimationState](/spine-api-reference#AnimationState) can be accessed directly to set attachments on the skeleton, change the skeleton's skin, queue animations, play multiple animations at once on different tracks, and [more](/spine-applying-animations). The player provides `skeleton` and `animationState` properties:

```
<script>
new spine.SpinePlayer("player-container", {
   ...
	success: function (player) {
		player.skeleton.setAttachment("weapon", "sword");
		player.animationState.setAnimation(0, "jump");
		player.animationState.addAnimation(0, "walk", true, 0);
	}
});
</script>
```

When accessing these properties directly, it is recommended to use `showControls: false` so that the controls don't interfere with the configuration set by your code.

By default the [viewport](#Viewports) is based on the skeleton's bounds in the [default animation](#Default-animation). Unlike the player's `setAnimation` function, the viewport remains the same when the animation state is used to change the animation.

---
## File: Runtimes, spine-ue/spine-ue.md
## Title: spine-ue Runtime Documentation
## URL: http://esotericsoftware.com/spine-ue
---

# spine-ue Runtime Documentation

> **Licensing**
>
> Please see the [Spine Runtimes License](/spine-runtimes-license) before integrating the Spine Runtimes into your applications.

# Getting Started

## Installation
To use the spine-ue runtime in your Unreal Engine project:

1. Download and install [Unreal Engine](https://www.unrealengine.com/). *Currently compatible with UE 4.27+. **Please see the [upgrading to Unreal Engine 5.3+](#Updating-to-Unreal-Engine-5.3-) section!**
2. Download and install [Visual Studio Community](https://www.visualstudio.com/downloads/) or the latest [Xcode](https://developer.apple.com/xcode/) depending on your operating system. If in doubt about the Visual Studio version, you may want to choose according to the list [here](https://docs.unrealengine.com/en-US/ProductionPipelines/DevelopmentSetup/VisualStudioSetup/index.html). When installing and setting up Visual Studio, please follow the guide [here](https://docs.unrealengine.com/en-US/ProductionPipelines/DevelopmentSetup/VisualStudioSetup/index.html), section *Options for a New Visual Studio Installation*.
2. Create a new empty C++ code project in the Unreal Engine Editor. You can use Blueprint in your C++ project, but a Blueprints only project will not work because the Spine plugin is written in C++.
3. Clone the [spine-runtimes Git repository](https://github.com/esotericsoftware/spine-runtimes). If you don't want to use Git, download the [latest version as a ZIP](/git/spine-runtimes/archive) and unpack it.
4. In your project folder, create a subfolder called `Plugins`.
5. Copy the contents of `spine-runtimes/spine-ue/Plugins/` to your project's `Plugins/` folder.
6. Copy the folder `spine-runtimes/spine-cpp/spine-cpp` to your project's `Plugins/SpinePlugin/Source/SpinePlugin/Public/` folder.
6. Add `SpinePlugin` to `PublicDependencyModuleNames` in your project's `Build.cs` file.

View the [samples Build.cs](/git/spine-runtimes/blob/spine-ue/Source/SpineUE/SpineUE.Build.cs#L9) for a full example.

You can inspect the C++ code of both your game and the spine-ue runtime by opening the project in the Unreal Engine Editor and selecting `File -> Open Visual Studio` or `File -> Open Xcode`.

## Samples

The `spine-runtimes/spine-ue` directory is a project ready to be opened in the Unreal Engine Editor.

To explore the spine-ue runtime samples:
1. Download and install [Unreal Engine](https://www.unrealengine.com/). *Currently compatible with UE 5.5+
2. Download and install [Visual Studio 2022 Community](https://www.visualstudio.com/downloads/) or the latest [Xcode](https://developer.apple.com/xcode/) depending on your operating system. If in doubt about the Visual Studio version, you may want to choose according to the list [here](https://docs.unrealengine.com/en-US/ProductionPipelines/DevelopmentSetup/VisualStudioSetup/index.html). When installing and setting up Visual Studio, please follow the guide [here](https://docs.unrealengine.com/en-US/ProductionPipelines/DevelopmentSetup/VisualStudioSetup/index.html), section *Options for a New Visual Studio Installation*.
3. Clone the [spine-runtimes Git repository](https://github.com/esotericsoftware/spine-runtimes). If you don't want to use Git, download the [latest version as a ZIP](/git/spine-runtimes/archive) and unpack it.
4. Copy the folder `spine-runtimes/spine-cpp/spine-cpp` to the `spine-runtimes/spine-ue/Plugins/SpinePlugin/Source/SpinePlugin/Public/` folder.
5. Open the project `spine-runtimes/spine-ue/SpineUE.uproject` in the Unreal Engine Editor. As the project is not yet listed in the Unreal Project Brower under *Recent Projects*, choose *More* and then *Browse* and point it to the `SpineUE.uproject` file.
6. Checkout the different example levels in the `Content/GettingStarted` folder in the Content Browser. Each level has text instructions on how to run it and a description of what you see.

	> **Note:** In order for the editor to render your skeletons, please turn on realtime mode in your viewport
![](/img/spine-runtimes-guide/spine-ue/realtimemode.png)

You can inspect and modify the C++ code of both the samples and the spine-ue runtime by opening the project in the Unreal Engine Editor and selecting `File -> Open Visual Studio` or `File -> Open  Xcode`.

## Updating the spine-ue Runtime
Before updating your project' spine-ue runtime, please consult our [guide on Spine editor and runtime version management](/spine-runtime-architecture#Versioning).

Once you are sure you want to update to the latest spine-ue runtime:

1. Get the latest spine-ue runtime by pulling the latest changes from the [spine-runtimes Git repository](https://github.com/esotericsoftware/spine-runtimes) via Git, or download the [latest version as a ZIP](/git/spine-runtimes/archive) and unpack it.
2. Close the Unreal Engine Editor and Visual Studio/Xcode.
3. Remove the folder `Plugins/SpinePlugin` from your Unreal Engine project.
4. Copy the contents of `spine-runtimes/spine-ue/Plugins/` to your project's `Plugins/` folder.
5. Copy the folder `spine-runtimes/spine-cpp/spine-cpp` to your project's `Plugins/SpinePlugin/Source/SpinePlugin/Public/` folder.
6. Open the project in the Unreal Engine Editor, then select `File -> Generate Visual Studio project files` on Windows or `File -> Generate Xcode project files` on macOS.
7. Recompile your project's source code as well as the plugin's source code.

> **Note:** The spine-ue runtime is based on the generic [spine-cpp](/spine-cpp) runtime. Make sure to watch changes to both the spine-ue and spine-cpp runtime on [GitHub](https://github.com/esotericsoftware/spine-runtimes). It is a typical update mistake to forget to also update (copy) the `spine-cpp` part of the plugin as described in `(5.)` above.

## Updating to Unreal Engine 5.3+
Starting with Unreal Engine 5.3, Epic has introduced a breaking change in the way they handle `UAssets`. Imported `.skel`, `.json`, and`.atlas` files can no longer share a common prefix. E.g. `skeleton.skel` and `skeleton.atlas` will not work. However, `skeleton-data.skel` and `skeleton.atlas` will work.

For projects created with Unreal Engine versions before 5.3, it is not possible to automatically upgrade the imported assets. If you upgrade such a project to Unreal Engine 5.3+, the content browser will no longer show the imported skeleton data and atlas resources due to the regression introduced by Epic. The only way to upgrade a project to Unreal Engine 5.3+ is to manually re-name, re-import and re-wire all skeleton data and .atlas files.

We have filed a bug report with Epic right after the release of Unreal Engine 5.3 but have not heard back from them since. We therefore assume that Epic will not fix this regression, and that the above work around and limitations will stay in place.

# Using spine-ue
## Overview
The spine-ue runtime is an Unreal Engine plugin supporting playback and manipulation of animations created with Spine. The [spine-ue](/git/spine-runtimes/tree/spine-ue) runtime is written in C++ and based on the generic [spine-cpp runtime](/spine-cpp). The spine-ue runtime wraps the spine-cpp structs and functions and exposes them in both code and as Unreal Engine Blueprints. Additionally, the spine-ue runtime imports files exported from the Spine Editor and stores them in custom Unreal Engine asset types.

Please consult the [Spine Runtimes Guide](/spine-runtimes-guide) 
for a detailed overview of the Spine Runtime architecture.

## Asset Management
### Exporting for Unreal Engine
![](/img/spine-runtimes-guide/spine-ue/export.png)
Please follow the instructions in the Spine User Guide on how to 

1. [Export skeleton & animation data](/spine-export)
2. [Export texture atlases containing the images of your skeleton](/spine-texture-packer)

An export of the skeleton data and texture atlas of your skeleton will yield the following files:

![](/img/spine-runtimes-guide/spine-ue/exported-files.png)

1. `skeleton-name.json` or `skeleton-name.skel`, containing your skeleton and animation data.
2. `skeleton-name.atlas`, containing information about the texture atlas.
3. One or more `.png` files, each representing on page of your texture atlas containing the packed images your skeleton uses.

You need to ensure that your **asset files do not share a common prefix**. Example:
```
skeleton.skel
skeleton.atlas
```

This will not work, as the two files share a common prefix `skeleton`. Instead, rename the files to, e.g.

```
skeleton-data.skel
skeleton.atlas
```

The spine-ue runtime can import these files into special Unreal Engine asset types.

> **Note:** The spine-ue runtime currently does not support atlases exported using pre-multiplied alpha.

### Importing into Unreal Engine
![](/img/spine-runtimes-guide/spine-ue/import-general.png)
1. Open your Unreal Engine project in the Unreal Engine Editor
2. Click `Import` in the content browser
3. Select the `.json` or `.skel` file and the `.atlas` file you exported from the Spine Editor

The asset importer will create Unreal Engine assets for the skeleton data and texture atlas automatically. 

The import creates 

1. A Spine skeleton data asset for skeleton data files (`.json`, `.skel`)
2. A Spine texture atlas asset for the texture atlas file (`.atlas`)
3. A texture asset for each texture atlas page (`.png`), which will be put in a content folder called `Textures` next to the texture atlas asset

![](/img/spine-runtimes-guide/spine-ue/imported-files.png)

### Updating Spine Assets
During development, you may frequently update your Spine skeleton data and texture atlas files. You can simply overwrite these source files (`.json`, `.skel`, `.atlas`, `.png`) by re-exporting from the Spine Editor.

The Unreal Engine Editor will detect changes to these source files and prompt you to re-import the assets from these source files. After re-import, all references to previously imported Spine assets will be intact and use the latest source data.

> **Note:** The Unreal Engine Editor sometimes fails to recognize source file changes. In this case, locate your Spine skeleton data or texture atlas asset in the content browser, double click it, then select `Asset -> Reimport` from the menu of the newly opened window.


### Skeleton Data Asset
The skeleton data asset stores information about the bone hierarchy, slots, draw order, animations and other data that constitutes your skeleton. Other components provided by the spine-ue runtime reference and share this skeleton data asset to animate and display a skeleton as part of an Unreal Engine actor instance.

![](/img/spine-runtimes-guide/spine-ue/skeletondataasset.png)

The skeleton data asset allows you to specify [animation mix times](/spine-applying-animations#Mix-times). Double click the asset in the content browser, then enter the default mix time or define mix times for two specific animations by clicking the `+` sign on the `Mix Data` property of the asset.

Components using the skeleton data asset, like the skeleton animation component, use these mix times when playing back animations.

The detail panel for a skeleton data asset also shows all bones, slots, animations, skins, and events contained in the asset.

![](/img/blog/Unreal-Engine-4-quality-of-life-improvements/details-view.png)

### Texture Atlas Asset
The texture atlas asset contains information about the images used by your skeleton, namely on what texture atlas page an image is stored, as well as its UV texture coordinates on the texture atlas page.

![](/img/spine-runtimes-guide/spine-ue/textureatlasasset.png)

You can view the texture of the texture atlas pages when double clicking the asset in the content browser.

> **Note:** You can modify the textures referenced by the texture atlas asset. In this case, make sure the UV texture coordinates stay valid.

## Components
The spine-ue runtime provides you with a set of components that allow to display, animate and modify skeletons exported from Spine. These components reference skeleton data and texture atlas assets you import as described above.

### Adding a Skeleton to a Level
To quickly display a Spine skeleton in your Unreal Engine project:

1. Import the skeleton data and texture atlas as described above.
2. Create an empty actor in your level.
3. Add a `Spine Skeleton Animation` component to your actor in its detail panel and set the skeleton data and texture atlas properties to your assets.
![](/img/spine-runtimes-guide/spine-ue/addanimationcomponent.png)
5. Add a `Spine Skeleton Renderer Component` to your actor
![](/img/spine-runtimes-guide/spine-ue/addrenderercomponent.png)

You can now either use blueprints or the components' C++ API to animate the skeleton, react to events triggered by animations, etc. Refer to the component documentation below for more details.

> **Note:** In order for the editor to render your skeleton, please turn on realtime mode in your viewport
![](/img/spine-runtimes-guide/spine-ue/realtimemode.png)

### Skeleton Component
The skeleton component stores references to a skeleton data and texture atlas asset and will [update the world transforms](/spine-runtime-skeletons#updateWorldTransform) of each bone in every `Tick()`. It serves as the base component for the skeleton animation component or your own custom component.

> **Note:** In general, you want to use the skeleton animation component described below. It allows you to apply animations to your skeleton. Use the plain skeleton component as the base for your own custom skeleton components.

#### Setting Skeleton Data & Texture Atlas
A skeleton component requires references to a skeleton data asset from which it can get the information about a skeleton's bone hierarchy, slots etc., as well as a reference to a texture atlas asset, from which it gets information about the images used by the skeleton.

To set the skeleton data and texture atlas

1. Select the component in an actor's detail panel
2. Set the `Atlas` and `Skeleton Data` properties

> **Note:** Both the skeleton data and the atlas asset references have to be set for the component to function properly. If one or both are undefined, the component will gracefully ignore all interaction via C++ and blueprints.

#### Life-cycle
The skeleton component implements the `UActorComponent::Tick()` method in which it updates the world transforms of all bones of the skeleton.

The component exposes the multicast delegates `BeforeUpdateWorldTransform` and `AfterUpdateWorldTransform` as properties that allow you to intercept this life-cycle before and after the world transforms of all bones are calculated. You can bind to these delegates to modify bone positions and other aspects of the skeleton without having to care for the update order of your actors and components.

##### **C++**
In the class that should intercept the life-cycle, add a `UFUNCTION` declaration to the class header file:

```
UFUNCTION()
void BeforeUpdateWorldTransform(USpineSkeletonComponent* skeleton);
```

> **Note:** It is important to mark the method as a `UFUNCTION`, otherwise it can not be bound to the delegate.

Next, add a definition of this function to your class' `.cpp` file:

```
void MyClass::BeforeUpdateWorldTransform(USpineSkeletonComponent* skeleton) {
   ... modify the skeleton here ...
}
```

Finally, bind the method to the delegate, e.g. in `BeginPlay()` of your actor or component. Assuming you have a reference to the `AActor` containing the skeleton component:

```
AActor* actor = ...
USpineSkeletonComponent* skeletonComponent = static_cast<USpineSkeletonComponent*>(Actor->GetComponentByClass(USpineSkeletonComponent::StaticClass()));
skeletonComponent->BeforeUpdateWorldTransform.AddDynamic(this, &USpineBoneDriverComponent::BeforeUpdateWorldTransform);
```

Binding to the `AfterUpdateWorldTransform` delegate works the same.

##### **Blueprint**
Assuming you have a blueprint for the actor containing the skeleton component

1. Open the blueprint in the blueprint editor
2. In the components window, select the skeleton component
![](/img/spine-runtimes-guide/spine-ue/selectskeletoncomponent.png)
3. In the details panel for the skeleton component, click on the `+` for the `Before Update World Transorm` or `After Update World Transform`
![](/img/spine-runtimes-guide/spine-ue/addbeforeupdateworldevent.png)
4. Connect other blueprint nodes to the exec pin of the event to implement your custom update logic
![](/img/spine-runtimes-guide/spine-ue/beforeupdatenode.png)

Binding to the `AfterUpdateWorldTransform` event works the same.

#### Setting Skins
A Spine skeleton may have multiple [skins](/spine-runtime-skins) that define which attachment go on which slot. The skeleton component provides a simple way to switch between skins.

##### **C++**
```
bool success = skeletonComponent->SetSkin(FString(TEXT("skinName"));
```

##### **Blueprint**
![](/img/spine-runtimes-guide/spine-ue/setskin.png)

#### Setting Attachments
To set an attachment, provide the slot and attachment name.

##### **C++**
```
bool success = skeletonComponent->SetAttachment(FString(TEXT("slotName")), FString(TEXT("attachmentName"));
```

##### **Blueprint**
![](/img/spine-runtimes-guide/spine-ue/setattachment.png)

#### Resetting to Setup Pose
For [procedural animation](/spine-runtime-skeletons#Procedural-animation) it is sometimes necessary to reset bones and/or slots to their setup pose.

##### **C++**
```
skeletonComponent->SetToSetupPose();
skeletonComponent->SetBonesToSetupPose();
skeletonComponent->SetSlotsToSetupPose();
```

##### **Blueprint**
![](/img/spine-runtimes-guide/spine-ue/setsetuppose.png)

#### Flipping a Skeleton
Flipping a skeleton vertically or horizontally allows you to reuse animations, e.g. a walk animation facing left can be played back to face right.

##### **C++**
```
bool isFlippedX = skeletonComponent->GetScaleX() < 1;
skeletonComponent->SetScaleX(-1);
bool isFlippedY = skeletonComponent->GetScaleY() < 1;
skeletonComponent->SetScaleY(-1);
```

##### **Blueprint**
![](/img/spine-runtimes-guide/spine-ue/flipUpdated.png)

#### Getting and Setting Bone Transforms
The skeleton component lets you set and get bone transforms so you can implement IK terrain following or let other actors and components such as particle systems follow the bones in your skeleton. All transforms are given in the world coordinate system to make interaction easier.

> **Note:** Should you require to modify the local transform of a bone, please use the spine-cpp runtime API in your C++ code.

> **Note:** Make sure you apply new bone positions as part of the update world transform life-cycle, otherwise your modifications may be overwritten by animations.

> **Note:** The Spine bone follower and Spine bone driver components are an easier way to interact with bones.

##### **C++**
```
FTransform boneWorldTransform = skeletonComponent->GetBoneWorldTransform(FString(TEXT("boneName"));
skeletonComponent->SetBoneWorldPosition(FString(TEXT("boneName"), FVector(x, y, z));
```

##### **Blueprint**
![](/img/spine-runtimes-guide/spine-ue/worldtransform.png)



### Skeleton Animation Component
The skeleton animation component is the heart of the spine-ue runtime. It allows you to add a Spine skeleton to an actor, animate it, react to animation events, and so on. 

> **Note:** The skeleton animation component is based on the skeleton component, and hence inherits all of skeleton components features described above!

#### Life-cycle
The skeleton animation component implements the `UActorComponent::Tick()` method in which it updates the underlying [AnimationState](/spine-applying-animations#AnimationState-API) based on the delta time, applies the `AnimationState` to the skeleton, and updates the world transforms of all bones of the skeleton.

As the skeleton animation component is based on the skeleton component, you can bind to the `BeforeUpdateWorldTransform` and `AfterUpdateWorldTransform` as described above.

The skeleton animation component exposes the [AnimationState](/spine-api-reference#AnimationState) API to both blueprints and C++. This section assumes a familiarity with concepts like tracks, track entries, mix times, or animation queuing as described in the section [Applying Animations](/spine-applying-animations) in the generic Spine Runtime Guide.

#### Time Scale
You can set the time scale of the skeleton animation component to slow down or speed up the playback of animations. The delta time used to advance animations is simply multiplied with the time scale, e.g. a time scale of 0.5 slows the animation down to half the normal speed, a time scale of 2 speeds it up to twice the normal speed.

##### **C++**
```
float timeScale = animationComponent->GetTimeScale();
animationComponent->SetTimeScale(0.5);
```

##### **Blueprint**
![](/img/spine-runtimes-guide/spine-ue/timescale.png)

#### Setting Animations
To set an animation, provide the track index, animation name and whether to loop the animation-

##### **C++**
```
USpineSkeletonAnimationComponent* animationComponent = ... fetch from actor ..
UTrackEntry* entry = animationComponent->SetAnimation(trackIndex, FString(TEXT("walk")), true);
```
##### **Blueprint**

![](/img/spine-runtimes-guide/spine-ue/setanimationnode.png)

##### Queueing Animations
To queue an animation, provide the track index, animation name, whether to loop the animation, and the delay after which this animation should start playing on the track in seconds.

##### **C++**
```
UTrackEntry* entry = animationComponent->AddAnimation(trackIndex, FString(TEXT("run")), true, 2);
```

##### **Blueprint**
![](/img/spine-runtimes-guide/spine-ue/addanimationnode.png)

#### Setting and Queueing Empty Animations, Clearing Tracks
The skeleton animation component also provides methods and blueprint nodes to set an empty animation, queue an empty animation, or clear one or all tracks. All of these work analogous to the methods and nodes shown above.

##### **C++**
```
UTrackEntry* entry = animationComponent->SetEmptyAnimation(trackIndex, mixDuration);
entry = animationComponent->AddEmptyAnimation(trackIndex, mixDuration, delay);
animationComponent->ClearTrack(trackIndex);
animationComponent->ClearTracks();
```

##### **Blueprint**
![](/img/spine-runtimes-guide/spine-ue/cleartrack.png)

#### Track Entries
You'll receive a [TrackEntry](/spine-api-reference#TrackEntry) from all the methods/nodes that allows you to further customize the playback of this specific animation, as well as bind to delegates of track entry specific events. See the section *Processing AnimationState Events* below.

> **Note:** The returned track entries will only be valid until the corresponding animation is removed from the underlying animation state. The Unreal Engine garbage collector will automatically free them. After a dipose event is received for a track entry, it should no longer be stored or accessed. The C++ wrapper around the underlying `spTrackEntry` guards against invalid access.

##### **C++**
```
UTrackEntry* entry = ...
entry->SetEventThreshold(2);
float trackEnd = entry->GetTrackEnd();
```

##### **Blueprint**
![](/img/spine-runtimes-guide/spine-ue/trackentry.png)

#### Processing AnimationState Events
While animations are played back by the underlying `AnimationState`, various events will be emitted that notify listeners that

1. An animation **started**.
2. An animation was **interrupted**, e.g. by clearing a track or setting a new animation.
4. An animation was **completed**, which may occur multiple times if looped.
3. An animation has **ended**
5. An animation and its corresponding `TrackEntry` have been **disposed**
6. A user defined **event** was fired

The skeleton animation component provides delegates to which C++ code or blueprints can bind in order to react to these events for all queued animations on all tracks. Listeners can also be bound to the corresponding delegates of a specific `TrackEntry` only.

##### **C++**
In the class that should react to `AnimationState` events, add `UFUNCTION` declarations for the events you want to listen to the class header file:

```
UFUNCTION()
void AnimationComplete(UTrackEntry* entry);

UFUNCTION()
void UserDefinedEvent(UTrackEntry* entry, FSpineEvent evt);
```

In the corresponding `.cpp` implementation file, add the definitions:

```
void MyClass::AnimationComplete(UTrackEntry* entry) {
   ... react to complete event here ...
}

void MyClass::UserDefinedEvent(UTrackEntry* entry, FSpineEvent evt) {
   ... react to user defined event here ...
}
```

Finally, bind to the corresponding delegates of a `USkeletonAnimationComponent` or `UTrackEntry`:

```
USpineAnimationComponent* animationComponent = ...
animationComponent->AnimationComplete.AddDynamic(this, &MyClass::AnimationComplete);

UTrackEntry* entry = ...
animationComponet->AnimationEvent.AddDynamic(this, &MyClass::UserDefinedEvent);
```

##### **Blueprint**
To bind to `AnimationState` events on the skeleton animation component:

![](/img/spine-runtimes-guide/spine-ue/listenercomponent.png)

1. Open the blueprint
2. Select the skeleton animation component on your actor
3. In the detail panel, click on the `+` button next to the event you want to react to

To bind to the delegates of a specific `TrackEntry`:

![](/img/spine-runtimes-guide/spine-ue/listenertrackentry.png)

1. Drag the return value pin of an `Set Animation`, `Add Animation`, `Set Empty Animation` or `Add Empty Animation` node to an empty space in the blueprint.
2. Select `Assign Animation XXX` from the `Components -> Spine -> TrackEntry` category in the popup
3. Make sure the `Bind Event to` node is wired in such a way that it is executed.

#### Viewport preview
You can preview animations and skins in the UE editor viewports using the `Preview Animation` and `Preview Skin` properties of the skeleton animation component. Simply enter the name of the animation and skin.

![](/img/blog/Unreal-Engine-4-quality-of-life-improvements/preview.gif)

The reset the animation or skin, set the respective property to an empty text.

### Skeleton Renderer Component
The skeleton renderer component is responsible for drawing the current state of a skeleton or skeleton animation component on the same actor. Rendering is performed via a procedural mesh. The component uses the texture atlas asset referenced by the skeleton (animation) component to find the textures needed to draw the attachments of the skeleton.

#### Materials
![](/img/spine-runtimes-guide/spine-ue/materials.png)

The skeleton renderer component has 4 material properties, one for each blend mode supported by Spine. By default, these 4 materials are set to unlit materials that are part of the spine-ue plugin (see the `Contents` folder of the plugin).

To modify the materials used by all skeleton renderer components, modify the default materials of the plugin.

To modify the materials used by a specific skeleton renderer component, simply create a new material and assign it to the material property of the skeleton renderer component.

In all cases, you must provide a parameterized material that allows the skeleton renderer component to set the texture source. By default, the renderer component assumes the texture parameter is called `"SpriteTexture"`. You can customize the parameter name on the skeleton renderer component.

#### Depth Offset
![](/img/spine-runtimes-guide/spine-ue/depthoffset.png)
Attachments are rendered back to front in the x/z plane by the skeleton renderer component. Each attachment is offset by a customizable depth offset value on the y-axis to avoid [z-fighting](https://en.wikipedia.org/wiki/Z-fighting). The depth offset is freely customizable in both C++ and blueprints.

### Skeleton Follower Component
This component references a bone of a skeleton (animation) component and sets its own transform to that of the bone on every `Tick`.

Use this to let objects like particle systems follow a specific bone on the skeleton.

### Skeleton Driver Component
This component references a bone of a skeleton (animation) component and sets the bones position to its own position on every `Tick`. The component will set the bone position before the skeleton (animation) component updates the world transforms.

Use this for use cases such as letting the user drag a bone of the skeleton around.

### Spine widget for UMG UI
Since Spine 3.8, the spine-ue runtime offers the Spine widget for integration of Spine skeletons with your [UMG UI](https://docs.unrealengine.com/en-us/Engine/UMG/UserGuide). The widget has the same interface as the Skeleton Animation Component, for both blueprints and C++ code. The widget also shares some interface with the Skeleton Renderer Component, namely allowing you to set the depth offset between attachments, and changing the materials used to render the skeleton. Please refer to the sections on these two components for the details.

To add a Spine skeleton to your UMG UI, start by creating a new [widget blueprint](https://docs.unrealengine.com/en-us/Engine/UMG/UserGuide/WidgetBlueprints). Open the blueprint, then add a Spine widget to it via the palette.

![](/img/spine-runtimes-guide/spine-ue/ui-palette.png)

Next, set the atlas and skeleton data asset on the Spine widget, and resize it in the designer viewport to fit your requirements.

![](/img/spine-runtimes-guide/spine-ue/spine-widget.png)

The skeleton will resize automatically, keeping its aspect ratio, filling as much space within the widget as possible. You can scale it further up or down by via the `Scale` property.

After switching from `Design` to `Graph` editing mode in the widget editor window, you can modify the blueprint of the widget. Here's an example blueprint:

![](/img/spine-runtimes-guide/spine-ue/spine-widget-blueprint.png)

We set the initial animation of the raptor widget when the `Construct` event is fired. We also need to wire up the `Tick` event with the widget's `Tick` function so it animates.

Finally, we need to open the level blueprint and add the UMG widget to the viewport:

![](/img/spine-runtimes-guide/spine-ue/widget-level-blueprint.png)

In the blueprint, we first create the widget, specified by its class name, and then add it to the viewport.

### Motion blur post processing
spine-ue's default materials use the [translucent blend mode](https://docs.unrealengine.com/4.26/en-US/RenderingAndGraphics/Materials/MaterialProperties/BlendModes/) supported by Unreal Engine. For this blend mode to work with motion blur post processing, enable the `OutputVelocity` option in the material details.

---
## File: User Guide/spine-animating.md
## Title: Animating - Spine User Guide
## URL: http://esotericsoftware.com/spine-animating
---

# Animating

Animating is an iterative process. The [graph](/spine-graph) and [dopesheet](/spine-dopesheet) are used extensively while animating to visualize [keys](/spine-keys) and adjust their timing and values. It is recommended to learn about how the graph and dopesheet work before applying the techniques below.

Becoming a great animator is a complex subject and deserves much more space than can be given here. We provide an ongoing video series called [Animating with Spine](/spine-videos#animatingWithSpine) and highly suggested reading [The Animator's Survival Kit](http://www.amazon.com/The-Animators-Survival-Richard-Williams/dp/0571202284) by Richard Williams. For a brief overview, see the "12 basic principles of animation" on [Wikipedia](http://en.wikipedia.org/wiki/12_basic_principles_of_animation) or this [video series](https://www.youtube.com/playlist?list=PL-bOh8btec4CXd2ya1NmSKpi92U_l6ZJd).

# Workflow

There are many possible workflows for designing animations with Spine. Below are some of the most common approaches. Each individual animator will decide which combination of techniques work best for them and for a particular animation task.

## Straight ahead

In this approach each frame is posed sequentially from the start to the end of the animation. This is straightforward and easy to understand, so it is often how beginners intuitively approach animating.

Straight ahead has the benefit that the action flows naturally because the poses from frame to frame are similar. The drawback is that it is easy to lose focus of the animation's goals, such as fitting the animation within a specific amount of time. Also it may take longer to produce results than other approaches.

The straight ahead workflow can be very creative. It often works best when something is moving along a path rather than between specific poses.

Our [12 Principles](https://www.youtube.com/watch?v=ECM2WIN3cgY) video has a great exercise at the end for practicing straight ahead:

[youtube:ECM2WIN3cgY]

## Pose to pose

Pose to pose, also called "blocking", is traditionally the preferred method of beginning a new animation. It is done by first identifying the most important major poses of the animation with minimal concern for timing. Once these major poses are finalized, their timing can be adjusted and the movements between them filled in.

This approach focuses on the most important aspects of the animation first. The major poses capture the entire range of movement with a minimal amount of effort and changes to the animation at this point are easy to make. The drawback is that such a logical approach can hinder the flow of the animation, causing it to appear choppy or unnatural.

When using pose to pose, `Stepped` can be enabled on the [playback view](/spine-playback). This disables tweening between all keys, meaning that only the key poses will be seen.

## Layered

The layered approach means to only work on a few specific parts at time, hiding the rest. Multiple passes are done over the animation until all the parts have been animated.

For example, it can be useful to hide most of the attachments for a skeleton and focus on just the body and limbs during the first pass. For some animations, it can help to hide a skeleton's arms and legs and only animate the hips and torso, then go over the animation again to animate the legs, and again to animate the arms.

The layered approach removes distractions and allows the animator to focus on the most important parts of the skeleton, which will then dictate how the rest of the parts are animated. The drawbacks are that it requires a deep understanding of body mechanics, does not have the flexibility of pose to pose for making early changes to the animation, and can result in disconnected movements between the parts that were animated separately.

Layered works well for animations where most of the movement is defined by a subset of the skeleton's parts.

## Combined

It is often useful to combine the techniques. For example, first create major poses only for movements that *must* be in the animation (pose to pose), then go over the animation from start to finish (straight ahead) multiple times and animate only a subset of parts each time (layered). A combined approach can provide a balance between logical planning and creativity.

# Curves

Curves allow the animator to adjust the speed of a transition between keys. When all the parts of a skeleton are moving at a constant speed, the movement tends to be robotic and lifeless. See the [graph view](/spine-graph) for more information. 

# Videos

[youtube:iHDtWbFLf_w&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[youtube:CDdrR2MVudE&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[Next: Attachments](/spine-attachments)
[Previous: Keys](/spine-keys)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-animations-view.md
## Title: Animations view - Spine User Guide
## URL: http://esotericsoftware.com/spine-animations-view
---

# Animations view

The animations view provides quick access to the animations for the selected skeleton. This eliminates the need to find the `Animations` node in the tree to change the currently active animation.

![](/img/spine-user-guide/animations-view/view.png)

The new animation icon to the right of the `Animations` tab creates a new animation.

# Animation list

All animations are listed for the currently selected skeleton, just as they appear in the tree. If a project has multiple skeletons, a select box indicates for which skeleton the animations are being shown.

![](/img/spine-user-guide/animations-view/multiple-skeletons.png)

Clicking an animation sets it as active. This is identical to clicking the visibility dot for the animation in the tree.

Double clicking an animation opens the rename animation dialog. Right clicking an animation selects it in the tree, without making it active.

# Video

[youtube:kchQqeXRs4k&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[Next: Audio view](/spine-audio-view)
[Previous: Views](/spine-views)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-attachments.md
## Title: Attachments - Spine User Guide
## URL: http://esotericsoftware.com/spine-attachments
---

# Attachments

Attachments are attached to [bones](/spine-bones) so when the bones are transformed, the attachments are also transformed. Some attachments are visual, having images, while others are conceptual, like bounding boxes for hit detection.

However, attachments are not attached directly to a bone. Instead, attachments are grouped under a [slot](/spine-slots) and the slot is attached to a bone. The slot controls which attachment is visible and the attachment's color.

Attachments can be added to [skins](/spine-skins#Skin-attachments) so the attachments are only visible if the skins are visible.

# Types

These are the types of attachments available:

* [Region attachment](/spine-regions): a rectangular image.
* [Mesh attachment](/spine-meshes): a polygon that is textured with an image.
* [Bounding box attachment](/spine-bounding-boxes): a polygon for runtime physics or performing hit detection.
* [Clipping attachment](/spine-clipping): a polygon for clipping the rendering of region and mesh attachments.
* [Path attachment](/spine-paths): Bezier curves for positioning bones along a path.
* [Point attachment](/spine-points): a point in space with a rotation, for spawning projectiles, particles, etc at runtime.

# Common properties

![](/img/spine-user-guide/attachments/properties.png)

All attachments have these properties. See the attachment specific pages for other attachment properties.

## Select

When `Select` is unchecked, the attachment cannot be selected in the viewport. It will still be selected in the viewport if it is selected in the tree.

This can be useful for attachments that don't need to be selected very often.

## Export

<callout>Disabling selection and export can be useful for templates or background images that are only used as a reference in Spine.</callout>

When `Export` is unchecked, the attachment won't be exported, meaning it won't be in exported JSON or binary and won't appear in image or video exports.

If an attachment is not exported and is keyed in an animation, the keys won't be exported.

If a mesh attachment is not exported, none of its [linked meshes](/spine-meshes#Linked-meshes) will be exported either.

## Name

When checked, the attachment's name is always rendered in the viewport (if it doesn't overlap another name), even when names are not [enabled](/spine-tools#Viewport-options). The name can be clicked to select the attachment.

## Color

For mesh or region attachments, the attachment color tints the mesh or region image. The attachment color is set in setup mode and cannot be keyed in animations, but the attachment may be further tinted by the [slot color](/spine-slots#Color), which can be [keyed](/spine-keys#Slot-color).

All other attachments are not rendered at runtime and the attachment color is only used for visualization in the Spine editor.

## Set Parent

An attachment's parent can be changed by clicking `Set Parent` or pressing `P`, then clicking the new parent in the tree or viewport. An attachment can also be dragged in the tree to a new parent, even in a different skeleton.

# Hiding attachments

![](/img/spine-user-guide/attachments/attachment-visibility.png)

The attachment visible for a slot can be changed by clicking the paperclip icon next to each attachment. A slot can have only a single attachment visible at any given time, or no attachments visible. Which attachment is visible is considered a property of the slot, so [keying attachment visibility](/spine-keys#Slot-attachment) is done by clicking the key button next to the slot.

[Next: Region attachments](/spine-regions)
[Previous: Animating](/spine-animating)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-audio-view.md
## Title: Audio view - Spine User Guide
## URL: http://esotericsoftware.com/spine-audio-view
---

# Audio view

The audio view displays a [timeline](/spine-keys#Timeline) and the waveform for [audio events](/spine-events#Audio-events) keyed in the animation.

![](/img/spine-user-guide/audio-view/view.png)

See the audio [example projects](/spine-examples#Audio) for usage examples.

# Audio events

Each audio event key in the active animations is shown in a list with a unique color.

![](/img/spine-user-guide/audio-view/audio-list.png)

Selecting an audio event key in the list will set the timeline position to that key and dim the other waveforms.

If the corresponding [audio event](/spine-events#Audio-events) in the tree has its visibility dot cleared then it won't appear in the audio view and the audio won't be played.

# Volume

The volume slider controls the volume in the Spine editor for all audio events. The volume can be also muted.

![](/img/spine-user-guide/audio-view/volume.png)

To set the volume for a specific audio event, see [audio event volume](/spine-events#Volume).

# Audio device

This select box controls which audio device the Spine editor will use to play audio.

![](/img/spine-user-guide/audio-view/audio-device.png)

[Next: Dopesheet view](/spine-dopesheet)
[Previous: Animations view](/spine-animations-view)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-basic-concepts.md
## Title: Basic Concepts - Spine User Guide
## URL: http://esotericsoftware.com/spine-basic-concepts
---

# Basic Concepts

Knowledge of these basic concepts is necessary to set up your own skeletons.

# Skeletons

Each skeleton in the project appears in the [tree view](/spine-tree), along with all the bones, slots, attachments, and other information that make up the skeleton. A project may have multiple skeletons. To add additional skeletons, choose `New Skeleton` from the [Spine menu](/spine-getting-started#Menu).

![](/img/spine-user-guide/basic-concepts/tree.png)

# Bones

A skeleton has a hierarchy of bones. Each bone has a rotation, translation, scale, and shear which is called the bone's transform. When a bone is transformed, its children are affected. For example, moving an arm bone will also move the hand bone. This hierarchical nature of the bones makes manipulating images more intuitive, allowing the animator to focus on the large scale motion. It also makes it easy to keep the distance between elements consistent, when desired.

Bones are used for most animation in Spine, even skeletons that are not humanoid or animal. Simple skeletons can use a bone per image. Meshes can be used to animate images without using bones.

![](/img/spine-user-guide/basic-concepts/bones.png)

# Attachments

In skeletal animation, an image, mesh or other "attachment" is attached to a bone, then when the bone is transformed (rotated, translated, scaled, or sheared) the attachment is also transformed. However, in Spine attachments are not attached directly to a bone. Instead, attachments are attached to a "slot" and the slot is attached to a bone.

![](/img/spine-user-guide/basic-concepts/slots.png)

`root` is a bone with two slots, `eyes` and `head`, and each slot has an attachment with the same name.

# Slots

Slots exist to facilitate flexible draw order. The draw order for a skeleton is a list of slots, where attachments for slots higher in the list are drawn on top of those below. The draw order can be seen under the skeleton in the tree.

![](/img/spine-user-guide/basic-concepts/draworder.png)

Slots decouple bones from the draw order, allowing attachments on the same bone to be drawn above and below an attachment on a different bone. For example, the torso bone has slots `belly` and `shirt`, the hip bone has slot `pants`. Slots allow `belly` to be drawn under `pants` and `shirt` to be drawn above `pants`, even though both `belly` and `shirt` are on the same bone.

A slot can have any number of attachments, but only one attachment can be visible at any given time. A slot cannot have multiple attachments visible at the same time because the order those attachments are drawn would be undefined.

Slots also group attachments of the same type. For example, a `weapon` slot may have a `knife`, `sword`, `axe`, etc. Only the `weapon` slot appears in the draw order, which simplifies managing the draw order when the skeleton has a large number of attachments.

A slot has a color, which is used to [tint attachments](/spine-attachments#Tinting) that use images.

# Video

[youtube:iz9G3f9vYoU&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[Next: Images](/spine-images)
[Previous: Getting Started](/spine-getting-started)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-bones.md
## Title: Bones - Spine User Guide
## URL: http://esotericsoftware.com/spine-bones
---

# Bones

Bones are used for most animation in Spine, even for [skeletons](/spine-skeletons) that are objects rather then characters. Simple skeletons may use one bone per image. More complex skeletons may bind images to multiple bones so the images deform as the bones are animated.

A skeleton has a hierarchy of bones and there is always a single root bone. The root bone may have child bones under it, which themselves may have child bones, etc.

![](/img/spine-user-guide/bones/bones.png)

Bones can be added to [skins](/spine-skins#Skin-bones) so the bones are only active when the skins are visible.

# Bone transforms

Each bone has rotation, translation, scale, and shear properties which together are called the bone's "transform". A bone's transform affects its child bones. For example, translating an arm bone will also translate the hand bone.

This hierarchical inheritance of bone transforms makes manipulating images easier and more intuitive. For example, an entire skeleton can be scaled by scaling the root bone. Or, when an arm bone is rotated, the hand bone stays at the end of the arm, like you'd expect.

Bone transforms can be manipulated by the [transform tools](/spine-tools#Transform-tools) and can be [keyed](/spine-keys#Bone-transforms).

# Creating bones

<callout>Some image editor [scripts](/spine-images#Scripts), such as the script for Photoshop, can create bones so when the JSON data is imported into Spine, the bones are already there.</callout>

Bones can be created using the [create tool](/spine-tools#Create-tool).

A bone can also be created by selecting a bone in the tree that will be the parent, then choosing `New...` `Bone` in the tree properties. The new bone will be created at the tip of the parent bone which can save you from needing to place it there manually, if that is where you need it.

# Properties

![](/img/spine-user-guide/bones/properties.png)

## Transform inheritance

<callout>Bones affected by an [IK constraint](/spine-ik-constraints) cannot have their transform inheritance disabled.</callout>

Normally [transforms](#Bone-transforms) from parent bones affect their child bones. The `Inherit` checkboxes allow parts of the parent transforms to not be inherited.
* `Rotation` When unchecked, the bone does not rotate when parent bones are rotated. The world angle of the bone may still change if parent bones are scaled nonuniformly (meaning their X and Y scale are different).
* `Scale` When unchecked, the bone does not scale when parent bones are scaled. Nonuniform scale from parent bones may still change the world angle of the bone, but the size will not change.
* `Reflection` Normally when scale changes from positive to negative, the bone flips to point in the opposite direction. When `Reflection` is unchecked, negative scale will not cause the bone to flip.

Transform inheritance can be [keyed](/spine-keys#Transform-inheritance).


## Length

The bone's length can be set in bone's tree properties or via the [bone length tool](/spine-tools#Bone-length-tool).

The length of a bone is cosmetic, except when using [IK constraints](/spine-ik-constraints), [path constraints](/spine-path-constraints), or [auto weights](/spine-meshes#Auto-Weights).

A zero length bone is drawn in the viewport using a crosshair icon, but is otherwise exactly the same as any other bone.

## Icon

Changing the bone's icon can help differentiate bones in the tree and viewport, especially when they have zero length.

![](/img/spine-user-guide/bones/icons.png)

## Name

When checked, the bone's name is always rendered in the viewport (if it doesn't overlap another name), even when names are not [enabled](/spine-tools#Viewport-options). The name can be clicked to select the bone.

## Select

When `Select` is unchecked, the bone cannot be selected in the viewport. It will still be selected in the viewport if it is selected in the tree.

This can be useful when there are many bones in a small area and some of them don't need to be selected very often.

## Color

<callout>Multiple bones can be selected to set the color for all of them at the same time.</callout>

Changing the bone's color can help differentiate bones in the tree and viewport to make selection easier. For example, for a humanoid skeleton the back leg and arm can be colored differently from the front leg and arm.

![](/img/spine-user-guide/bones/color.png)

## Parent

A bone's parent can be changed by clicking `Set Parent` or pressing `P`, then clicking the new parent bone in the tree or viewport. A bone can also be dragged in the tree to a new parent bone, even in a different skeleton.

## Add to Skin

The `Add to Skin` button adds the bone to the currently active skin. See [skin bones](/spine-skins#Skin-bones) for more information.

The button is disabled if no skin is currently active. The root bone cannot be added to a skin.

## Split

The `Split` button splits a bone into a number of smaller bones. This can save time versus creating many small bones manually.

![](/img/spine-user-guide/bones/split.png)

When `Nested` is checked, each new bone is a child of the previous bone. When unchecked, all of the new bones will have the same parent as the original bone.

When `Fibonacci` is checked, the length of the new bones will follow the Fibonacci sequence, meaning they get progressively smaller. When unchecked, the new bones will have equal lengths.

![](/img/spine-user-guide/bones/split-bones.png)

## Separate X and Y

In animate mode, an additional row appears in the bone properties.

![](/img/spine-user-guide/bones/separate.png)

The `Separate` checkboxes allow X and Y to be keyed separately for translation, scale, or shear for the current animation. See [separate X and Y keying](/spine-keys#Separate-X-and-Y) for more information.

# Hiding bones

![](/img/spine-user-guide/bones/bone-visibility.png)

Bones have a visibility dot in the tree. When hidden, the bone will not be drawn and cannot be selected in the viewport, though it will still be selected in the viewport if it is selected in the tree. When the bone is hidden, it will still appear in data exports and child bones and attachments are still drawn.

<callout>If you've hidden many bones or slots, `ctrl+H` will show them all again.</callout>

Hiding a bone is intended only for temporarily reducing clutter in the viewport and cannot be keyed. You may want to hide the attachments for all of the bone's slots and [key them](/spine-keys#Slot-attachment) instead.

Right clicking a bone's visibility dot will toggle hiding the bone and all child bones and slots.

All bones can be hidden in the viewport using the [viewport options](/spine-tools#Viewport-options).

# Bone draw order

The order bones are drawn in the viewport depends on the order they were created and cannot be changed. The last bone that was created is drawn on top of the others. It is rare for the bone draw order to be important.

# Attachments

It's not enough just to animate bones, we need a way to attach images and other things to the bones. This is where "attachments" come in!

Attachments are attached to bones so when the bones are transformed, the attachments are also transformed. Some attachments are visual, having images, while others are conceptual, like bounding boxes for hit detection.

However, attachments are not attached directly to a bone. Instead, attachments are grouped under a "slot" and the slot is attached to a bone. The slot controls which attachment is visible and the attachment's color. We'll explain more about slots in the [next section](/spine-slots) and we'll cover attachments more thoroughly [later on](/spine-attachments).

[Next: Slots](/spine-slots)
[Previous: Skeletons](/spine-skeletons)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-bounding-boxes.md
## Title: Bounding box attachments - Spine User Guide
## URL: http://esotericsoftware.com/spine-bounding-boxes
---

# Bounding box attachments

A bounding box [attachment](/spine-attachments) is a polygon that can be used at runtime for hit detection, creating physics bodies, spawning particle effects, and more.

![](/img/spine-user-guide/bounding-boxes/boundingbox.png)

Bounding boxes can be deformed automatically when bones are transformed by using [weights](/spine-weights).

Bounding box vertex positions can be [keyed](/spine-keys#Deform-keys) in animations.

See the bounding box [example projects](/spine-examples#Bounding-Boxes) for usage examples.

> The term "bounding box" is somewhat of a misnomer. Technically a bounding box is the smallest rectangle that contains an object. In Spine, bounding boxes are actually arbitrary polygons, though they are often used to define the bounds of the skeleton.

# Setup

To create a new bounding box, select a bone or slot in the tree, then choose `New...` `Bounding Box` in the tree properties.

![](/img/spine-user-guide/bounding-boxes/new.png)

The new bounding box appears in the tree and [edit mode](#Edit-mode) opens automatically.
The [new vertices mode](#New-vertices-mode) inside of edit mode is also automatically selected.

# Properties

![](/img/spine-user-guide/bounding-boxes/properties.png)

See the [common attachment properties](/spine-attachments#Common-properties) for the `Select`, `Export`, `Name`, `Color`, and `Set Parent` properties.

## Edit Bounding Box

Clicking the `Edit Bounding Box` button enters [edit mode](#Edit-mode), which is for modifying the bounding box's vertices.

## Freeze

The `Freeze` button sets rotation to 0 and scale to 1 for the current vertex positions.

This is possible because a bounding box does not really have a rotation or scale. It has only a number of vertices, each of which has a position. Spine provides rotation and scale values for convenience, to allow manipulation similar to other attachments. The rotation and scale are adjusted when the `Rotate` or `Scale` tools are used on the entire attachment.

A bounding box doesn't have translation, either. The translation values shown are the centroid of the vertices.

# Edit mode

Edit mode allows for creating, modifying, and deleting the bounding box's vertices.

![](/img/spine-user-guide/bounding-boxes/create.png)

The [Edit Bounding Box](#Edit-Bounding-Box) button enters edit mode. It can be exited at any time by clicking the `Edit Bounding Box` button again, by closing the edit mode dialog, or by pressing `spacebar` or `escape`.

Right click switches between the `Create` and `Delete` tools.

## Create tool

The `Create` tool allows new vertices to be created along the bounding box edges by clicking. Drag to translate a vertex. Double click to delete a vertex.

## Delete tool

The `Delete` tool allows vertices to be deleted by clicking. Drag to translate a vertex. Multiple vertices can be selected by holding `ctrl` (`cmd` on Mac) or dragging to box select.

![](/img/spine-user-guide/bounding-boxes/delete.png)

## New vertices mode

The `New` button deletes all vertices and enters the new vertices mode. This mode allows the bounding box to be defined by clicking to create new vertices. Vertices can also be translated by dragging or deleted by double clicking. To complete the bounding box, exit the new vertices mode by clicking the first vertex to close the polygon or by clicking the `New` button again.

![](/img/spine-user-guide/bounding-boxes/new-vertices.png)

# Transform tools

Bounding box vertices can be moved outside of edit mode by using the transform tools. The entire bounding box can be rotated, translated, and scaled like any other attachment.

![](/img/spine-user-guide/bounding-boxes/rotate.png)

Individual vertices can be translated with any transform tool by dragging. Multiple vertices can be selected by holding `ctrl` (`cmd` on Mac), then clicking or dragging to box select. The selected vertices can be deselected by pressing `spacebar` or `escape`, or by clicking in any empty space.

![](/img/spine-user-guide/bounding-boxes/multiple-vertices.png)

The origin used for rotation or scaling can be changed. Mouse over the small crosshair at the center of the `Rotate` or `Scale` tool until a circle appears, then drag the origin to the desired position. The origin will automatically snap to vertices.

![](/img/spine-user-guide/bounding-boxes/origin.png)

Moving vertices in setup mode changes the bounding box for the setup pose. Moving vertices in animate mode is done to set [deform keys](/spine-keys#Deform-keys). Deform keys should generally be avoided and [weights](/spine-weights) used instead.

Rotation and scale are only used to move the vertices. The amount of rotation and scale used is not stored in deform keys. Only the vertex positions are stored and interpolation between deform keys always moves the vertices in a straight line.

# Video

[youtube:jlMqyyKq7MA&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[Next: Clipping attachments](/spine-clipping)
[Previous: Mesh attachments](/spine-meshes)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-clipping.md
## Title: Clipping attachments - Spine User Guide
## URL: http://esotericsoftware.com/spine-clipping
---

# Clipping attachments

<callout>Clipping can be a very expensive operation and should be used judiciously. See [performance](#Performance).</callout>

A clipping [attachment](/spine-attachments) is a polygon used to clip the rendering of region and mesh attachments.

![](/img/blog/3.6-clipping.gif)

Clipping attachments can be deformed automatically when bones are transformed by using [weights](/spine-weights).

Clipping attachment vertex positions can be [keyed](/spine-keys#Deform-keys) in animations.

See the clipping [demo](/spine-demos#Clipping), [example projects](/spine-examples#Clipping), and [tips](/spine-tips#Clipping) for usage examples.

# Setup

To create a new clipping attachment, select a bone or slot in the tree, then choose `New...` `Clipping`  in the tree properties.

![](/img/spine-user-guide/clipping/new.png)

The new clipping attachment appears in the tree and [edit mode](#Edit-mode) opens automatically.
The [new vertices mode](#New-vertices-mode) inside of edit mode is also automatically selected.

After creating vertices and exiting new vertices mode, the [end slot](#End-slot) should be set.

# Properties

![](/img/spine-user-guide/clipping/properties.png)

See the [common attachment properties](/spine-attachments#Common-properties) for the `Select`, `Export`, `Name`, `Color`, and `Set Parent` properties.

## End slot

The `End slot` property sets the slot at which clipping will end. Clipping is applied to all slots in the draw order starting from the clipping attachment's slot and ending at the specified end slot, inclusive.

The end slot can be chosen by clicking the pencil icon.

By default, a new clipping attachment's end slot is set to the slot that contains the clipping attachment. The result is that clipping is done from the clipping attachment's slot to the end of the draw order (all slots above the slot in the draw order). The clipped slots are highlighted in red in the tree.

![](/img/spine-user-guide/clipping/start.png)

After setting the end slot to `gun`:

![](/img/spine-user-guide/clipping/endslot2.png)

## Edit Clipping

Clicking the `Edit Clipping` button enters [edit mode](#Edit-mode), which is for modifying the clipping attachment's vertices.

## Freeze

The `Freeze` button sets rotation to 0 and scale to 1 for the current vertex positions.

This is possible because a clipping attachment does not really have a rotation or scale. It has only a number of vertices, each of which has a position. Spine provides rotation and scale values for convenience, to allow manipulation similar to other attachments. The rotation and scale are adjusted when the `Rotate` or `Scale` tools are used on the entire attachment.

A clipping attachment doesn't have translation, either. The translation values shown are the centroid of the vertices.

# Edit mode

<callout>Enabling [MSAA](/spine-settings#Multisample-anti-aliasing) results in a nice antialiased edge where images are cut by clipping.</callout>

Edit mode allows for creating, modifying, and deleting the clipping attachment's vertices.

![](/img/spine-user-guide/clipping/create.png)

The [Edit Clipping](#Edit-Clipping) button enters edit mode. It can be exited at any time by clicking the `Edit Clipping` button again, by closing the edit mode dialog, or by pressing `spacebar` or `escape`.

Right click switches between the `Create` and `Delete` tools.

## Create tool

The `Create` tool allows new vertices to be created along the clipping attachment edges by clicking. Drag to translate a vertex. Double click to delete a vertex.

## Delete tool

The `Delete` tool allows vertices to be deleted by clicking. Drag to translate a vertex. Multiple vertices can be selected by holding `ctrl` (`cmd` on Mac) or dragging to box select.

![](/img/spine-user-guide/clipping/delete.png)

## New vertices mode

The `New` button deletes all vertices and enters the new vertices mode. This mode allows the clipping attachment to be defined by clicking to create new vertices. Vertices can also be translated by dragging or deleted by double clicking. To complete the vertices, exit the new vertices mode by clicking the first vertex to close the polygon or by clicking the `New` button again.

![](/img/spine-user-guide/clipping/new-vertices.png)

# Transform tools

Clipping attachment vertices can be moved outside of edit mode by using the transform tools. The entire clipping attachment can be rotated, translated, and scaled like any other attachment.

![](/img/spine-user-guide/clipping/rotate.png)

Individual vertices can be translated with any transform tool by dragging. Multiple vertices can be selected by holding `ctrl` (`cmd` on Mac), then clicking or dragging to box select. The selected vertices can be deselected by pressing `spacebar` or `escape`, or by clicking in any empty space.

![](/img/spine-user-guide/clipping/multiple-vertices.png)

The origin used for rotation or scaling can be changed. Mouse over the small crosshair at the center of the `Rotate` or `Scale` tool until a circle appears, then drag the origin to the desired position. The origin will automatically snap to vertices.

![](/img/spine-user-guide/clipping/origin.png)

Moving vertices in setup mode changes the clipping attachment for the setup pose. Moving vertices in animate mode is done to set [deform keys](/spine-keys#Deform-keys). Deform keys should generally be avoided and [weights](/spine-weights) used instead.

Rotation and scale are only used to move the vertices. The amount of rotation and scale used is not stored in deform keys. Only the vertex positions are stored and interpolation between deform keys always moves the vertices in a straight line.

# Draw order

Clipping is applied to all slots in the draw order starting from the clipping attachment's slot and ending at the clipping attachment's [end slot](#End-slot), inclusive.

To change which attachments are clipped in an animation, the draw order can be [keyed](/spine-keys#Draw-order).

To turn a clipping attachment on or off, show or hide the clipping attachment. To do so in an animation, key the [slot attachment](/spine-keys#Slot-attachment).

Multiple clipping attachments can be visible at the same time, but the slots they clip cannot overlap in the draw order.

# Self-intersection

Clipping will not work correctly if the clipping attachment polygon self-intersects. Care must be taken to ensure the polygon edges never cross each other.

# Performance

Clipping in the Spine Runtimes is implemented using the CPU can be a very expensive operation, especially when using mesh attachments with many vertices. Always check the performance of your animations that use clipping on your target platforms.

<callout>Use a clipping attachment with just 3 vertices whenever possible, which is the minimum number of vertices allowed.</callout>

To minimize CPU usage for clipping, reduce both the number of vertices in the clipping attachment and the total number of vertices in all the clipped region and mesh attachments. Set the start and end slots to clip the fewest number of attachments and edit those attachments to reduce the number of vertices in each one as much as possible. The size of the clipping polygon does not affect performance.

Additionally, arranging the clipping attachment vertices so they are convex can greatly reduce the CPU usage needed to perform clipping. This is because the clipping attachment vertices are first decomposed into convex polygons, then each resulting polygon is checked against all the clipped region and mesh attachment vertices.

Clipping attachment performance is only a concern when using the Spine Runtimes, not when exporting images or video.

[Next: Path attachments](/spine-paths)
[Previous: Bounding box attachments](/spine-bounding-boxes)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-command-line-interface.md
## Title: Command line interface - Spine User Guide
## URL: http://esotericsoftware.com/spine-command-line-interface
---

# Command line interface

<callout>Our [export scripts](https://github.com/EsotericSoftware/spine-scripts/tree/master/export) can automate exporting many projects at once.</callout>

Spine's command line interface (CLI) allows Spine to be run from the command line to export, import, pack texture atlases, and more. This is most commonly used to automate exporting all your projects and packing texture atlases as part of the build process for your software.

When run in this way, Spine starts, does one or more exports or texture packings, then exits.

Most CLI parameters can be used headless, which means on a computer that is not configured to display a user interface. However, to export images or video an OS windowing system and OpenGL are required.

# Usage

Descriptions of CLI parameters are shown when Spine is run with the `--help` parameter. Additional, advanced parameters are shown when Spine is run with the `--advanced` parameter.

## Editor

```plain,full-height
Spine [-hvlft] [-x <host:port>] [-u <version>] [<path>]

-h, --help      Print basic CLI help and exit.
--advanced      Print advanced CLI help and exit.
-v, --version   Print version information and exit.
-l, --logout    Logout, removing activation code.
-u, --update    The version number of the Spine update to load.
-f, --force     Force download of the Spine update.
-x, --proxy     Proxy server to use when checking for and downloading updates.
-t, --notimeout Disable timeout when checking for and downloading updates.
project.spine   Path to a Spine project file to open.
```

The patch part of the [version number](/spine-versioning#Spine-editor-version-numbers) used with `-u` or `--update` can be `xx` to get the latest patch version. For example, to get the latest 4.0 version:

```plain,full-height
Spine --update 4.0.xx
```

If you want to get the latest stable version, you can specify `latest`, `lateststable` or `stable` to the version number. If you want to get the latest beta version, you can specify `latestbeta` or `beta`.

## Export

```plain,full-height
Spine [-i <path>] [-m] [-o <path>] -e <path>
Spine [-i <path>] [-m] [-o <path>] -e json[+pack]|binary[+pack]

Export JSON, binary, images, or video:
-i, --input   Path to a folder, project, or data file. Overrides export JSON.
-m, --clean   Animation clean up is performed before export.
-o, --output  Path to write export file(s). Overrides export JSON.
-e, --export  Path to export settings JSON file.
```

The export settings JSON file is created using Spine by clicking on the `Save` button at the bottom of the `Export` dialog.

![](/img/spine-user-guide/command-line-interface/save-export-settings.png)

<callout>Most build scripts that perform exports will want to use `--update` to specify the Spine editor version.</callout>

Input and output paths specified on the CLI are optional. If specified, they override any input or output paths specified in the export settings JSON file.

The input path is a path to a project, JSON, or binary file. The output path may be a file or folder, depending on the export settings.

<callout>The `--clean-all` parameter will clean all exports, so `--clean` doesn't have to be specified for each one.</callout>

If the `--clean` parameter is specified, animation [clean up](/spine-keys#Clean-Up) is performed before export. This does not modify the project file.

If `json` or `binary` is specified instead of a path to an export settings JSON file, then a JSON or binary export is performed using default settings. If `json+pack` or `binary+pack` is specified, [texture packing](/spine-texture-packer) is also performed using default settings.

## Import

```plain,full-height
Spine -i <path> [-s <scale>] -o <path> -r [<name>]

Import JSON, binary, or a project's skeletons into another project:
-i, --input   Path to a folder, project, or data file to be imported.
-o, --output  Path to project file to import into. Created if nonexistent.
-s, --scale   Scale the project being imported.
-r, --import  Perform a skeleton import. The skeleton name may be omitted.
```

The input path is a project, JSON, or binary file. Alternatively, it can be a folder containing `.spine`, `.json`, or `.skel` files.

The output path is a project file.

If `--scale` is specified, the project's skeletons are [scaled](/spine-import#Scale) before they are imported.

If a project is imported into another project, all skeletons are imported. If a skeleton name is specified using `--import` and only one skeleton is imported, then the skeleton is renamed. If multiple skeletons are imported, the skeleton name is ignored and the skeletons keep their existing names.

If a JSON or binary file is imported into a project and a skeleton name is specified using `--import`, then the skeleton is renamed. If a skeleton name is not specified, the skeleton is named using the JSON or binary file name without the extension.

## Clean up

```plain,full-height
Clean up: Spine -i <path> -m

Animation clean up:
-i, --input   Path to project file or folder.
-m, --clean   Animation clean up is performed and the project is saved.
```

Animation [clean up](/spine-keys#Clean-Up) is performed for all animations in the project and the project file is saved with the changes.

The input path is a project file or folder containing `.spine` files.

## Pack

```plain,full-height
Spine -i <path> [-j <path>]... -o <path> -p <name>
Spine -i <path> [-j <path>]... -o <path> [-n <name>] -p <path>

Texture atlas packing:
-i, --input   Path to folder of images to be packed.
-o, --output  Path to write texture atlas and PNG files.
-j, --project Path to a project to determine which images are used by meshes.
-n, --name    Texture atlas name, the prefix for the atlas and PNG files.
-p, --pack    Texture atlas name or path to pack settings JSON file.
```

The input and output paths are folder paths.

The `--pack` or `-p` parameter is either:
* The [texture atlas name](/spine-texture-packer#Texture-atlas-name) to use when writing output files. In this case, the default texture packing settings are used but can be customized by [pack.json](/spine-texture-packer#JSON-Configuration) files in the input folders.
* The path to a pack settings JSON file, which is created using Spine by clicking on the `Save` button at the bottom of the `Texture Packer Settings` dialog.
![](/img/spine-user-guide/command-line-interface/save-packer-settings.png)
If a name is not specified, the pack settings JSON file name without the file extension is used as the texture atlas name.

One or more project files can be specified using `--project`. When whitespace stripping is enabled, the texture packer looks in these projects for each image file. Any meshes found to use the image file are taken into account so whitespace stripping will not remove parts of the images within the meshes. When `--project` or `-j` is specified, the `currentProject` texture packer setting is ignored, as if it were set to `true`.

## Unpack

```
Spine -i <path> -o <path> -c <path>

Texture atlas unpacking:
-i, --input   Path to folder of atlas images.
-o, --output  Path to write unpacked image files.
-c, --unpack  Path to texture atlas file.
```

## Info

```plain,full-height
Spine -i <path>

Project information:
-i, --input   Path to a folder, project, or data file.
```

Information is output for each project file. This can useful to know what version of Spine a project was saved with, how many animations are in the project, and other information.

The input path is a folder containing `.spine` files, a project file, or a JSON or binary data file.

## Advanced

```plain,full-height
Advanced:
-Xmx2048m          Set the maximum memory usage in megabytes (2048 default).
--trace            Enable additional logging and diagnostic checks.
--auto-start       Start automatically.
--no-auto-start    Do not start automatically.
--ping             Test latency to each server (otherwise done every 4 days).
--server x         Set the preferred server regardless of ping (eg jp/us/eu).
--disable-audio    Disable all audio support.
--pretty-settings  Format settings files more nicely.
--keys             Enable hotkey popups by default.
--hide-license     Don't show name and email on launcher (eg for streaming).
--ui-scale x       Set the interface scale (eg 200).
--icc-profile x    Set the path to the ICC profile file for color management.
--intro            Show the Esoteric Software logo intro.
--clean-all        Animation clean up for all exports.
--mesh-debug       Show debug information on top of meshes.
--export-selection Editor selection is shown in image and video exports.
--ignore-unknown   Don't error if a CLI parameter is not recognized.
```

## Examples

```plain,full-height
Spine --export /path/to/export.json
Spine --export "/path/with spaces/to/export.json"
Spine --input /path/to/project.spine --output /path/to/output/
      --export /path/to/export.json
Spine -i /path/to/project.spine -o /path/to/output/ -e /path/to/export.json
Spine -i /path/to/project.spine -o /path/to/output/ -e binary+pack
Spine -e /path/to/export1.json -e /path/to/export2.json
Spine -i /path/to/images/ -o /path/to/output/ --pack /path/to/pack.json
Spine -i /path/to/images/ -o /path/to/output/ -n name -p /path/to/pack.json
Spine -i /path/to/project1.spine -o /path/to/output/ -e /path/to/export1.json
      -i /path/to/project2.spine -e /path/to/export2.json -i /path/to/images/
      -o /path/to/output/ -p /path/to/pack.json
Spine -i /path/to/skeleton.json -o /path/to/project.spine -r skeletonName
```

Multiple commands can be specified in one Spine ivocation, as seen in some of the examples above.

The folders for output paths are created if they don't exist.

If a command fails, Spine returns a non-zero error code.

The [export script](/git/spine-runtimes/blob/examples/export/export.sh) used to export all of Spine's example projects can serve as a real life example of Spine's CLI usage. Windows users can use [Cygwin](https://www.cygwin.com/) to write similar scripts using bash.

## Unknown parameters

The Spine launcher checks that the specified parameters are allowed, before passing them to the Spine editor. If some CLI parameters are not accepted, it could be that those parameters were not available when your Spine launcher was installed, but a newer version of the Spine editor can still understand them.

In that case, you can download and reinstall the Spine launcher or use the `--ignore-unknown` parameter so the Spine launcher will allow parameters it doesn't recognize. It will print a warning for unrecognized parameters, but will still pass them to the Spine editor. If the Spine editor doesn't recognize them, they will be ignored.

# Running Spine with CLI parameters

## Windows

Spine for Windows comes with two executables: `Spine.exe` and `Spine.com`. The EXE file is a GUI application, it starts Spine without a console window and doesn't wait for Spine to exit. The COM file is a command line application, it directs Spine's output to a console window and waits for Spine to exit.

Either executable can be used for the command line interface, but generally the COM file is preferred. If the Spine installation folder is on the system path or is the current working directory, specifying `Spine` without an extension will always execute `Spine.com`. For example:

```
Spine -e C:\path\to\export.json
```

## Mac

Command line export when using Spine for Mac is done by launching the Spine executable file directly rather than opening `Spine.app`. The executable is found inside `Spine.app` at `Spine.app/Contents/MacOS/Spine`. For example:

```
/Applications/Spine.app/Contents/MacOS/Spine -e /path/to/export.json
```

## Linux

Command line export when using Spine for Linux is done by running the `Spine.sh` script. For example:

```
./Spine.sh -e /path/to/export.json
```

[Next: Settings](/spine-settings)
[Previous: Import PSD](/spine-import-psd)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-constraints.md
## Title: Constraints
## URL: http://esotericsoftware.com/spine-constraints
---

# Constraints

<callout>Constraints are not available in Spine Essential.</callout>

Constraints provide ways to adjust bones besides using the bone hierarchy. For example, bones can follow a path or rotate to point at other bones.

Constraints can be added to [skins](/spine-bones#Skin-constraints) so the constraints are only active when the skins are visible.

# Order

Constraints are shown in the tree under the `Constraints` node.

![](/img/spine-user-guide/constraints/tree.png)

The order the constraints appear in the tree is also the order that the constraints are applied. The constraint at the top of the list is applied first, then each constraint below it is applied.

You may need to adjust the order to get the results you want. In setup mode, constraints can be dragged up and down to change their order.

When a constraint is created, Spine inserts it at a reasonable position in the constraint order. The `Reset` button in the tree properties for the `Constraints` tree node will automatically calculate a reasonable order for all the constraints.

## Order example

![](/img/tips/constraints-order-path-250px.gif)

In this example, when the IK constraint is applied first, the first bone is pointed at a second bone on the path, then the path constraint is applied to move the second bone along the path. The first bone is left pointing where the second bone was originally.

When the path constraint is applied first, the bone is moved along path, then the IK constraint is applied to point at the bone on the path. This is probably the desired behavior.

## Bone transforms

After a constraint is applied, the bone world transforms are recomputed for the constrained bones and all their descendants. If a constraint is applied and modifies a bone, then another constraint is applied that causes the world transform for that bone to be recomputed, the modifications made by the first constraint will be lost.

# Mix

Constraints have "mix" sliders that allow the constraint to be partially applied. When the slider for a constrained property is at 0, the constraint is not applied for that property. At 100, the constraint is applied fully. Between 0 and 100 results in a property value between the unconstrained pose and the fully constrained pose. This can be used to reduce the effect of the constraint or blend seamlessly between the unconstrained and constrained poses.

Some constraints allow negative mix values to constrain the property in the opposite direction or mix values over 100 to exaggerate the constraint's effect.

# Folders

Constraints can be organized into folders. To create a folder, select a constraint and click `New...` `Folder`. Constraints can be moved between folders by dragging them.

In exported skeleton data, folder names are prepended to the constraint name to create the final name used in the Spine Runtimes. For example, if the folder `weapons` has a subfolder `arms` which has a constraint `left-arm`, then the constraint name at runtime is `weapons/arms/left-arm`.

# Viewport bones

The editor area shows bones that are affected by a constraint as hollow. When a constraint is affecting the bone some transform tools may have a reduced effect or none at all, depending on the constraint mix. To adjust a constrained bone, the constraint's mix can be temporarily set to 0.

![](/img/spine-user-guide/constraints/bones.jpg)

# Tree annotations

The right edge of the tree displays annotation icons for bones that are constrained by or the target of a constraint. The icons can be clicked to select the constraint.

![](/img/spine-user-guide/constraints/annotations.png)

# Copy/paste

Constraint settings can be copied by selecting a constraint from the constraint node, or focusing on its properties, and pressing `ctrl+C` (`cmd+C` on Mac). The copied information can later be applied to one or more constraints of the same kind by selecting them and pressing `ctrl+V` (`cmd+V` on Mac) to paste.

# Video

[youtube:-U0Sk8KnzcI&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[Next: IK constraints](/spine-ik-constraints)
[Previous: Skins](/spine-skins)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-dopesheet.md
## Title: Dopesheet view - Spine User Guide
## URL: http://esotericsoftware.com/spine-dopesheet
---

# Dopesheet view

The dopesheet view displays and edits the timing of an animation's [keys](/spine-keys).

The dopesheet shows only the timing of the keys, not their values, but can show the keys for many different properties at once. In comparison, the [graph](/spine-graph) shows both the timing and values for keys, but can be difficult to use when many keyed properties are shown.

![](/img/spine-user-guide/dopesheet/dopesheet.png)

See the dopesheet [tips](/spine-tips#Dopesheet) for various ways to use the dopesheet efficiently.

# Rows

Below the [timeline](/spine-keys#Timeline), rows are shown for each keyed property, grouped by bone. Each row has colored rectangles that represent the keys. A unique color is used for each type of key. White keys indicate multiple types of keys on the same frame.

![](/img/spine-user-guide/dopesheet/rows.png)

Scrolling the mouse wheel over the dopesheet rows scrolls them up or down. Similar to the viewport, drag with the right mouse button to pan the dopesheet rows up and down or left and right.

## Overview row

The first row in the dopesheet is the "overview row". It shows the animation name and the keys for all the rows below it. This is useful when needing to modify all the keys in an animation or all the keys currently being shown in the dopesheet.

<callout>Clicking the animation name can be useful when another animation needs to be selected, though the [animations view](/spine-animations-view) is even faster.</callout>

When a project has multiple skeletons, an overview row will appear above the rows for each skeleton. Hiding a skeleton in the tree will also hide it in the dopesheet.

Click the animation name to select the animation in the tree.

## Bone rows

![](/img/spine-user-guide/dopesheet/rows-bone.png)

Keys are grouped by the bone most related to the keyed property.

A bone row can be collapsed or expanded by clicking the collapse (`-`) or expand (`+`) icon at the left of the row, or by right clicking the bone name. When expanded, the bone row only shows a key when multiple properties under it have keys on the same frame. When collapsed, the bone row shows all the keys for the properties under it.

<callout>Clicking a bone name is more useful when the dopesheet is [locked](#Locked), since the dopesheet rows won't change when the bone is selected.</callout>

Click the bone name to select the bone in the viewport. Hold `ctrl` (`cmd` on Mac) to toggle the selection or select multiple bones.

Bone rows can be dragged up or down to change their [order](#Row-order) in the dopesheet.

## Property rows

![](/img/spine-user-guide/dopesheet/rows-property.png)

Under a bone row are property rows for each keyed property. The property row shows all the keys for that property. Lines between keys indicate the type of interpolation between the keys.

<callout>Clicking the name of a [bone transform](/spine-tools#Bone-transforms) property will also select the corresponding [transform tool](/spine-tools#Transform-tools) to make setting new keys faster.</callout>

Click the property name to select the item in the viewport or tree. Hold `ctrl` (`cmd` on Mac) to toggle the selection or select multiple items.

### Interpolation

Straight lines between keys indicate linear interpolation between the keys. Slightly curved lines indicate Bézier interpolation and dotted lines indicate a stepped transition. See the [graph](/spine-graph#Interpolation) for more about interpolation between keys.

When no lines are shown between keys it indicates that there is no interpolation between the keys. This means either both keys have the same value or that the type of key does not have a transition, such as [slot attachment](/spine-keys#Slot-attachment) or [event keys](/spine-keys#Events). Note that overview and bone rows never display lines between keys.

## Other rows

Rows for [draw order](/spine-keys#Draw-order) and [events](/spine-keys#Events) aren't associated with a bone, so they are shown at the bottom of the dopesheet when they have keys and a related item or nothing is selected. Those rows can be hidden using the [dopesheet filter](#Filters).

# Contents

The dopesheet has two modes to control which bone rows are shown: unlocked and locked.

## Unlocked

![](/img/spine-user-guide/dopesheet/unlock.png)

<callout>To see all bone rows, [deselect](/spine-tools#Deselect) by pressing `spacebar`, `escape`, or by double clicking anywhere in the viewport.</callout>

The dopesheet is unlocked by default. When unlocked, which bone rows are shown depends on the viewport or tree selection. If bones (or items under a bone) are selected, only the bone rows for those bones are shown. If no bones are selected, then all bone rows are shown.

Using the dopesheet unlocked is useful when only needing to see the keys for one bone at a time. When working on multiple bones, locking the dopesheet contents may be more convenient.

## Locked

![](/img/spine-user-guide/dopesheet/lock.png)

<callout>When [sync](#Sync) is enabled, the lock buttons are hidden.</callout>

Click the lock button to lock the dopesheet, preserving which bone rows are shown. While locked, changing the viewport or tree selection does not affect which bone rows are shown.

Locking the dopesheet is useful when working on multiple bones or a particular set of bones, allowing multiple bone rows to be seen while selecting different bones.

#### Refresh

![](/img/spine-user-guide/dopesheet/lock-refresh.png)

The refresh button updates the dopesheet to show the bone rows for the current selection. This is equivalent to unlocking and locking the dopesheet again.

#### Select

![](/img/spine-user-guide/dopesheet/lock-select.png)

The select button selects the bones in the viewport for all of the currently shown bone rows. It can be useful to select the bones, modify the selection, then click refresh to change the bone rows shown in the dopesheet.

## Order

Bone rows appear in the dopesheet using the order the bones were selected. Bone rows can be rearranged by dragging them up or down.

## Visibility

Bone rows for [bones in a skin](/spine-skins#Skin-bones) are only shown when the skin is active. The tree view setting [Hide viewport skin bones](/spine-tree#Hide-viewport-skin-bones) can be unchecked to see all bone rows.

Property rows for [attachments in a skin](/spine-skins#Skin-attachments) are only shown when the skin is active. The tree view setting [Show all skin attachments](/spine-tree#Show-all-skin-attachments) can be unchecked to see all attachment property rows.

# Filters

<callout>When [sync](#Sync) is enabled, the filter button is hidden.</callout>

The dopesheet can be filtered to show only the chosen types of properties. Click the filter button to select the property types that will be shown. When a filter is active, the filter button is red.

![](/img/spine-user-guide/dopesheet/filter-dopesheet.png)

Hold `ctrl` (`cmd` on Mac) or `shift` to select multiple filters. The `Reset` button selects all filters.

When `Current tool` is active, only the [bone transform](/spine-tools#Bone-transforms) properties that corresponding to the current [transform tool](/spine-tools#Transform-tools) are shown.

Right click the filter button to toggle the filters on or off. 

# Timeline position

The current timeline position is shown next to the `Current` button.

![](/img/spine-user-guide/dopesheet/current.png)

A frame number can be typed and followed by `enter` or `tab` to set the current timeline position. A fractional number can be typed to set the timeline position between frames.

Click in empty space to set the timeline position to that frame, if [jump to frame](/spine-settings#Jump-to-frame) is enabled.

When the `Current` button is active, the dopesheet will automatically scroll horizontally during playback. This can be useful for a long animation where the keys don't fit in the dopesheet horizontally.

## Loop

To set the start or end frame, set the timeline position then click the `Loop Start` or `End` button. Alternatively, type a frame number in each box. When both have been set and [repeat](/spine-keys#Repeat) is enabled, playback is limited between the specified start and end frames. This only controls how playback repeats, it is not stored per animation.

To clear the start and end frames, click `Loop Start` or `End` twice or delete the numbers in the text boxes.

![](/img/spine-user-guide/dopesheet/looping.png)

# Selection

Click to select a key. This will also set the timeline position to the selected key, if [jump to key](/spine-settings#Jump-to-key) is enabled. Hold `ctrl` (`cmd` on Mac) to toggle the selection or select multiple keys. Selecting a key in an overview or bone row selects the keys under it.

If the dopesheet is [locked](#Locked) when a key is clicked, the item for the key is selected in the viewport or tree. This makes it easier to modify the selected key.

When a key is selected, press `ctrl+A` (`cmd+A` on Mac) to select all keys in the same dopesheet row. Press it again to select all keys shown in the dopesheet.

When keys are selected in the dopesheet, the same keys are selected in the graph. Likewise, when keys are selected in the graph, they are also selected in the dopesheet.

## Box selection

Drag in empty space to box select. Hold `ctrl` (`cmd` on Mac) before dragging to make a box selection that starts on top of a key.

![](/img/spine-user-guide/dopesheet/box-select-gif.gif)

To box select without leaving the box selection behind, drag and release the mouse button quickly. To keep the box selection, drag then pause briefly before releasing the mouse button. Multiple box selections can be created this way by holding `ctrl` (`cmd` on Mac).

![](/img/spine-user-guide/dopesheet/box-select-nobox-gif.gif)

The left or right edge of a box selection can be dragged to scale the selected keys. Scaling keys increases or decreases the timing between the selected keys. When used on the overview row, scaling can increase or decrease the duration of the entire animation.

![](/img/spine-user-guide/dopesheet/scale-gif.gif)

Scaling can be used to reverse the order of the keys by moving the left edge past the right, or the right edge past the left.

Hold `shift` to disable [frame snapping](/spine-keys#Frame-snapping) when creating or scaling a box selection.

# Manipulating keys

Selected keys can be dragged left or right to change the frame where the key takes effect. Hold `ctrl+shift` (`cmd+shift` on Mac) when starting the drag to duplicate the selected keys. Hold `shift` while dragging to disable [frame snapping](/spine-keys#Frame-snapping).

Double click to delete a key.

## Clipboard buttons

![](/img/spine-user-guide/dopesheet/copy-paste-keys.png)

See [clipboard buttons](/spine-keys#Clipboard-buttons).

## Shift

![](/img/spine-user-guide/dopesheet/key-shift.png)

See [shift](/spine-keys#Shift).

## Offset

![](/img/spine-user-guide/dopesheet/key-offset.png)

See [offset](/spine-keys#Offset).

## Adjust

![](/img/spine-user-guide/dopesheet/key-adjust.png)

<callout>Often it is easier to use the [graph](/spine-graph) to modify the value of multiple keys at once.</callout>

`Adjust` allows multiple keys to be edited at once. When `Adjust` is enabled and the `Rotate`, `Translate`, `Scale`, or `Pose` tool is used to manipulate bones in the viewport, all the selected keys are adjusted relatively by the same amount.

For example, a bone has three rotate keys: 0, 50, and 85 degrees. Select these keys in the dopesheet and enable `Adjust`, then use the `Rotate` tool to rotate the bone by 15 degrees. The selected keys are modified by adding 15 degrees to each value, so the keys become: 15, 65, and 100 degrees.

When an animation has movement that is defined by multiple keys, `Adjust` can be used to adjust the entire movement without needing to edit each key individually.

## Key shown

![](/img/spine-user-guide/dopesheet/key-shown.png)

See [key shown](/spine-keys#Key-shown).

# Sync

![](/img/spine-user-guide/dopesheet/sync.png)

<callout>[Hide toolbar](#Hide-toolbar) can be useful to save room when using `Sync`, since the graph provides many of the same toolbar of buttons.</callout>

When enabled, the dopesheet shows the rows for the curves that are visible in the [graph](/spine-graph). Since the graph controls which dopesheet rows are visible, the lock and filter buttons are hidden.

When the dopesheet view is directly above or below the graph view and `Sync` is enabled, the zoom level for the timelines in both of the views are synchronized so that the keys in both views are aligned horizontally. This allows using the graph to adjust key values while also using the dopesheet to adjust timing and see many keys at once.

# View settings

![](/img/spine-user-guide/dopesheet/view-options.png)

#### Toolbar

When unchecked, the dopesheet toolbar is hidden. This can save some vertical space and is often used with [sync](#Sync).

#### Rows

When unchecked, the dopesheet rows are hidden. This can save some horizontal space and is often used with [sync](#Sync).

# Video

[youtube:kDv2hBnenGs&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b?modestbranding=1&rel=0]

[Next: Ghosting view](/spine-ghosting)
[Previous: Audio view](/spine-audio-view)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-events.md
## Title: Events - Spine User Guide
## URL: http://esotericsoftware.com/spine-events
---

# Events

<callout>Events are not available in Spine Essential.</callout>

An event is a trigger for something to happen during an animation. In the Spine editor, an event can be configured to play audio. Otherwise, events are intended to be handled at runtime, where you can write code to take whatever action you like in response to the events. For example, to spawn particle effects, hurt an enemy, open a door, etc.

While audio playback for audio events is a feature in the Spine editor, the Spine Runtimes do not manage audio playback. At runtime, code needs to be written to [handle events](/spine-applying-animations#Listeners) and play the appropriate audio using the event's audio path, volume, and balance properties.

Video exported from Spine can include audio from audio events. See [AVI export](/spine-export#AVI) and [MOV export](/spine-export#MOV) for more details.

# Setup

An event is created by selecting the `Events` node in the tree and clicking `New...` `Event`.

![](/img/spine-user-guide/events/new.png)

# Properties

![](/img/spine-user-guide/events/properties.png)

The `Integer`, `Float`, and `String` properties are values that give extra information or context for the event. The setup pose has defaults for these values and each event key may have different values.

## Integer

Stores a whole number, without a fractional component. It may be [keyed](/spine-keys#Events).

## Float

Stores a number that may have a fractional component. It may be [keyed](/spine-keys#Events).

## String

Stores a text string. It may be [keyed](/spine-keys#Events).

## Audio path

When the audio path is set, the Spine editor will play the corresponding audio file when keys for this event are encountered during animation playback. See [audio file lookup](#Audio-file-lookup) for more information.

Once the audio path is set, the event becomes an [audio event](#Audio-events) and the `Volume` and `Balance` properties appear.

### Volume

Sets the playback volume of the audio event when played in the Spine editor. It may be [keyed](/spine-keys#Events).

### Balance

Sets the balance of the audio event when played in the Spine editor. It may be [keyed](/spine-keys#Events).

For 2 channel audio, this sets the volume of the left and right channels. For 1 channel audio, this pans the audio left or right.

# Audio node

The `Audio` node in the tree has a path to a folder where Spine will find WAV, MP3, and OGG audio files for the skeleton. The audio path can be relative to where the project file is saved or can be an absolute path. The `Browse` button can be used to specify a path, or you can type a path and press `enter`. Once the path is set, the audio files in that folder appear under the `Audio` node. Spine watches the audio folder and immediately loads any changes to the audio files.

![](/img/spine-user-guide/events/audio.png)

By default, only the first 2,000 audio files found in the audio folder are shown. This prevents Spine from scanning millions of files if the wrong path is accidentally specified. Uncheck `Limit scanning` to allow Spine to find more than 2,000 audio files.

## Audio events

An "audio event" is an event that has an [audio path](#Audio-path) set. The audio path can be set by typing it or dragging an audio file to an event in the tree.

Alternatively, a new audio event can be created by selecting an audio file and clicking `New Event` in the tree properties. This creates an event with the same name and sets the audio path.

Each audio file under the `Audio` node has a red icon if it is not used by any event and a green icon if it is used by at least one event.

If the visibility dot next to the event in the tree is cleared, the audio will not be played and won't show in the [audio view](/spine-audio-view).

## Audio file lookup

Spine finds the audio file for an event by taking the path specified under the `Audio` node and appending the event's audio path. The event's audio path does not need to include a file extension. Spine will look for files with `.wav`, `.mp3`, or `.ogg` file extensions.

For example, if the audio node has `./audio/` and an event has an audio path of `footstep`, Spine will look for `./audio/footstep.wav`, `./audio/footstep.mp3`, and `./audio/footstep.ogg`. Note that some operating systems are case sensitive.

The audio path can include subfolders. For example, if the audio node has `./audio/` and an event has an audio path of `gun/reload`, Spine will find `./audio/gun/reload.wav`.

## Audio formats

Spine supports WAV, MP3, and OGG audio files. WAV files need to be PCM, 1 or 2 channels, and 16 bits per sample.

[SoX](http://sox.sourceforge.net/) is a free command line tool for converting audio files. For example, to convert a WAV file to 16 bits per sample:

```
sox input.wav -b 16 output.wav
```

# Viewport events

When an event key is encountered during animation playback, the event name is shown briefly above the skeleton in the viewport.

![](/img/spine-user-guide/events/viewport-name.png)

To hide an event name in the viewport, clear the visibility dot next to the event in the tree. If it is an audio event, it will not be played and won't show in the [audio view](/spine-audio-view).

To hide all event names in the viewport, set both the [graph filter](/spine-graph#Filters) and [dopesheet filter](/spine-dopesheet#Filters) to exclude events.

## Folders

Events can be organized into folders. To create a folder, selectn an event and click `New...` `Folder`. Events can be moved between folders by dragging them.

In exported skeleton data, folder names are prepended to the event name to create the final name used in the Spine Runtimes. For example, if the folder `attacks` has an event `reload`, then the event name at runtime is `attacks/reload`.

# Video

[youtube:gPj9ZkSb0gU&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[Next: Views](/spine-views)
[Previous: Sliders](/spine-sliders)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-export.md
## Title: Export - Spine User Guide
## URL: http://esotericsoftware.com/spine-export
---

# Export

<callout>Spine project files can be exported using the UI or the [command line interface](/spine-command-line-interface). Our [export scripts](https://github.com/EsotericSoftware/spine-scripts/tree/master/export) can automate exporting many projects at once.</callout>

Spine can export a single image, sequence of images, video, and JSON or binary data.

To open the export dialog, choose `Export` from the main menu or press `ctrl+E` (`cmd+E` on Mac).

![](/img/spine-user-guide/export/menu.png)

To repeat the last export, press `ctrl+shift+E` (`cmd+shift+E` on Mac).

# Data

Spine can export skeleton data as JSON or binary. This data can then be loaded by our [Spine Runtimes](/spine-runtimes) and displayed in your applications just as it is in Spine.

<callout>For these reasons it is recommended to write scripts that automate exporting all of your Spine projects using the [command line interface](/spine-command-line-interface).</callout>

Data export transforms the data in the Spine project file to a format that can be read by the Spine Runtimes. The version of the Spine editor used to export must match the version of the Spine Runtimes. When the Spine Runtimes are updated to a newer version, the data must be exported from the Spine project file again. For this reason it is important to keep your Spine project files safe. See [versioning](/spine-versioning) for more information.

Data export creates a data file for each skeleton in the project. It is not possible to export only a single skeleton, only part of a skeleton, or individual animations.

## JSON

<callout>If the size of the data file is important, use binary.<br><br>If the speed the data file is loaded at runtime is important, use binary.</callout>

JSON data is much larger than binary and loading JSON data is much slower, so generally using binary data in your applications is preferred. However, JSON is human readable and it is easy to write tools to parse and manipulate the data, if needed.

It is perfectly reasonable to export to JSON, process the JSON data, then [import](/spine-import) the data back into a Spine project. When doing so, be sure that [Nonessential data](#Nonessential-data) is checked.

See [JSON format](/spine-json-format) for more information.

![](/img/spine-user-guide/export/json.png)

!table Setting, Description

!row Output folder
A JSON file will be created in this folder for each skeleton in your project. The name of the file will use the name of the skeleton.

!row Extension
The JSON files will use this file extension.

!row Format
Spine can optionally write in JSON-like formats that are slightly smaller, easier to read, and easier to edit.
* `JSON` Standard JSON.
* `JavaScript` Like JSON, but names are only quoted if necessary. The data is valid JavaScript.
* `Minimal` Like JSON, but most names and values are not quoted. This format requires a lenient JSON parser, such as the one in [libgdx](http://libgdx.com/).

!row Pretty print
When checked, the JSON is formatted to be more easily read by humans. This makes the file slightly larger.

!row Version
If an older JSON version is chosen, Spine attempts to write data compatible with that older version of the Spine Runtimes. In many cases this is not possible, data will be lost, and warnings will be shown.

Exporting to older versions is intended only as a last resort to partially recover work when a project was accidentally saved with a newer version of Spine. See [recovering work](/spine-versioning#Recovering-work-from-a-newer-version) for more information.

!row Nonessential data
When checked, additional data is included in the JSON data that is not usually needed at runtime. This makes the file slightly larger. This data is used if the JSON data is imported back into Spine. See [import](/spine-import#Nonessential-data) for more information.

!row Animation clean up
When checked, animation [clean up](/spine-keys#Clean-Up) is performed for the exported data. This does not modify the project file.

!row Export all
When checked, Spine will include items that have `Export` unchecked.

!row Warnings
When checked, Spine will show any warning messages after exporting.

!row Pack
When checked, a texture atlas is packed during the data export. See [packing during data export](/spine-texture-packer#Packing-during-data-export) for more information.

!table

## Binary

Binary data is much smaller than JSON and it is very fast to parse at runtime. However, it is not human readable and it is not easy to write tools to parse and manipulate the data.

See [binary format](/spine-binary-format) for more information.

![](/img/spine-user-guide/export/binary.png)

!table Setting, Description

!row Output folder
A binary file will be created in this folder for each skeleton in your project. The name of the file will use the name of the skeleton.

!row Extension
The binary files will use this file extension.

!row Nonessential data
When checked, additional data is included in the binary data that is not usually needed at runtime. This makes the file slightly larger. This data is used if the binary data is imported back into Spine. See [import](/spine-import#Nonessential-data) for more information.

!row Animation clean up
When checked, animation [clean up](/spine-keys#Clean-Up) is performed for the exported data. This does not modify the project file.

!row Warnings
When checked, Spine will show any warning messages after exporting.

!row Pack
When checked, a texture atlas is packed during the data export. See [packing during data export](/spine-texture-packer#Packing-during-data-export) for more information.

!table

# Images

## GIF

Spine can export animated GIFs, making it easy to share animations on the internet. GIF is an image format with only 256 colors, so some loss of quality may occur. GIF also doesn't support translucency, so pixels can only be either opaque or transparent.

Spine's GIF export is very sophisticated and produces the highest quality GIFs that are possible, but does not prioritize for a small file size.

![](/img/spine-user-guide/export/gif.png)

See [common settings](#Common-settings).

!table Setting, Description

!row Colors
The maximum number of colors in the GIF.

!row Color dither
The amount of dither to apply to the GIF colors. Dither disperses the colors to prevent hard edges in gradients.

!row Alpha threshold
Alpha values below this value are treated as 0. Set to zero if your slots have [additive blending](/spine-slots#Blending).

!row Alpha dither
The amount of dither to apply to the GIF transparency. Dither disperses transparency to prevent hard edges. The type of dispersion and how the alpha range is used can be chosen for the best results with your images. Set to zero if your slots have [additive blending](/spine-slots#Blending).

!row Background
The background color to use.

!row Transparent
When checked, completely transparent pixels will be transparent instead of the background color. When unchecked, the specified color is used for the background of the GIF.

!row Matte
Translucent pixels are made opaque using the matte color.

!row Quality
Higher quality produces better colors but takes longer to export.

!row FPS
The number of frames per second for the GIF animation. 50 generally provides the [best results](/support#Why-does-my-exported-GIF-play-back-at-a-different-speed-than-in-Spine).

!row Forever
When checked, the animation is looped continuously.

!row Include last frame
When unchecked, the last frame of each animation is omitted. Unchecking this is useful for looping animations where the first and last frame are identical -- the same frame would be exported twice when this setting is checked.

!table

## PNG

Spine can export PNG image files. PNG is a lossless image format that supports transparency, so no loss of quality will occur.

![](/img/spine-user-guide/export/png.png)

See [common settings](#Common-settings).

!table Setting, Description

!row Background
The background color to use.

!row Compression
Higher compression produces smaller files but takes longer to export.

!row FPS
The number of frames per second for the PNG sequence.

!row Include last frame
When unchecked, the last frame of each animation is omitted. Unchecking this is useful for looping animations where the first and last frame are identical -- the same frame would be exported twice when this setting is checked.

!row Pack
When checked, the exported images are packed into a texture atlas. This is convenient but running the texture packer separately provides more control over the packing. See [texture packing](/spine-texture-packer#Packing) for more information.

!table

## APNG

Spine can export APNG image files. APNG is a lossless animated image format that supports transparency, so no loss of quality will occur. It is supported by most modern browsers and has much higher quality than GIF, but the file size is usually larger.

![](/img/spine-user-guide/export/apng.png)

See [common settings](#Common-settings).

!table Setting, Description

!row Background
The background color to use.

!row Transparent
When checked, the background of the APNG is set to transparent.

!row Compression
Higher compression produces smaller files but takes longer to export.

!row FPS
The number of frames per second for the PNG sequence.

!row Forever
When checked, the animation is looped continuously.

!row Include last frame
When unchecked, the last frame of each animation is omitted. Unchecking this is useful for looping animations where the first and last frame are identical -- the same frame would be exported twice when this setting is checked.

!table

## PSD

<callout>It can be very useful to export the current pose in the middle of an animation as layers in a PSD so you can more easily redraw attachment images for that pose.</callout>

Spine can export Adobe Photoshop PSD image files. A layer for each animation frame will be created inside the PSD file.

![](/img/spine-user-guide/export/psd.png)

See [common settings](#Common-settings).

!table Setting, Description

!row Background
The background color to use.

!row Transparent
When checked, the background of the images within the PSD is set to transparent.

!row Encoding
The type of compression to use to create the PSD.
* `RAW` An uncompressed format. Encoding is fast but the exported PSD is very large.
* `RLE`  Encoding is fast and the exported PSD is small.
* `ZLIB` Encoding is slow and the exported PSD is very small.

!row FPS
The number of frames per second for the PSD image sequence.

!row Include last frame
When unchecked, the last frame of each animation is omitted. Unchecking this is useful for looping animations where the first and last frame are identical -- the same frame would be exported twice when this setting is checked.

!table

## JPEG

Spine can export JPEG images. JPEG is a lossy image format that does not support transparency, so some loss of quality may occur depending on the specified quality.

![](/img/spine-user-guide/export/jpeg.png)

See [common settings](#Common-settings).

!table Setting, Description

!row Background
The background color to use.

!row Quality
Higher quality produces better images but the file sizes are larger.

!row FPS
The number of frames per second for the JPEG sequence.

!row Include last frame
When unchecked, the last frame of each animation is omitted. Unchecking this is useful for looping animations where the first and last frame are identical -- the same frame would be exported twice when this setting is checked.

!table

# Video

## AVI

<callout>Please note that video playback support varies for different resolutions and encodings. Some video playback software is unable to play some video files, while other software can play them just fine.</callout>

Spine can export AVI video files. The RAW and PNG encodings for AVI files support transparency, which can be a convenient way to bring Spine animation into other software using a single file.

![](/img/spine-user-guide/export/avi.png)

See [common settings](#Common-settings).

!table Setting, Description

!row Encoding
The codec to use to encode the AVI video.

!row Background
The background color to use.

!row Compression
Higher compression produces smaller files but takes longer to export.

!row Quality
For the JPEG-based codec, higher quality produces better images but the file sizes are larger.

!row FPS
The number of frames per second for the AVI video.

!row Forever
When checked, the animation is looped continuously.

!row Include last frame
When unchecked, the last frame of each animation is omitted. Unchecking this is useful for looping animations where the first and last frame are identical -- the same frame would be exported twice when this setting is checked.

!table

## MOV

<callout>Please note that video playback support varies for different resolutions and encodings. Some video playback software is unable to play some video files, while other software can play them just fine.</callout>

Spine can export QuickTime MOV video files. The RAW and PNG encodings for MOV files support transparency, which can be a convenient way to bring Spine animation into other software using a single file.

![](/img/spine-user-guide/export/mov.png)

See [common settings](#Common-settings).

!table Setting, Description

!row Encoding
The codec to use to encode the MOV video.

!row Background
The background color to use.

!row Transparent
When checked, the background of the MOV video is set to transparent.

!row Compression
Higher compression produces smaller files but takes longer to export.

!row Quality
For the JPEG-based encoding, higher quality produces better images but the file sizes are larger.

!row FPS
The number of frames per second for the MOV video.

!row Forever
When checked, the animation is looped continuously.

!row Include last frame
When unchecked, the last frame of each animation is omitted. Unchecking this is useful for looping animations where the first and last frame are identical -- the same frame would be exported twice when this setting is checked.

!table

# Common settings

Most image and video exports have these settings. See the specific export section for other export settings.

!table Setting, Description

!row Defaults
Resets all the export settings to the defaults.

!row Preview
Opens the preview panel for the export dialog.

!row Export type
Either animations or the current skeleton pose are exported.

!row Skeletons
All skeletons are rendered together in the same export, in separate exports, or only the chosen skeleton is exported.

!row Animations
The current animation, all the animations, or the chosen animation is exported.

!row Skins
The currently visible skins, all the skins, or all skins plus the skeleton without any skin active are exported.

!row Output type
Either creates a single file, a file per frame, a file per animation, a single file with multiple layers, or a single file with one frame.

!row Output file
The file to write (when a single file is exported).

!row Output folder
The folder where files will be written, including the beginning of the file name for each file (when multiple files are exported).

!row Output prefix
The folder where files will be written (when multiple files are exported).

!row Maximum bounds
When checked, each exported file will have the same dimensions.

!row Animation repeat
The number of times to play each animation.

!row Pause after
The number of seconds to pause after playing each animation.

!row Bones
When checked, skeleton bones will be rendered.

!row Images
When checked, skeleton mesh and region attachments will be rendered.

!row Others
When checked, other skeleton attachments will be rendered.

!row Smoothing
Controls how much smoothing is applied to the image. Smoothing is a way of blurring the image to hide the pixel structure when upscaling, meaning when images are displayed larger than their actual size.

* 0 disables smoothing, nearest neighbor filtering is used. This can be useful for pixel art.
* 1-10 uses linear filtering between 10% and 100%.
* 11 uses bicubic filtering. This may be sharper and preserve details slightly better than linear filtering.

When smoothing is greater than zero, exports are affected by the `Anisotropic filtering` checkbox in the `Viewport` section of the [Spine settings](/spine-settings#Smoothing). Enabling anisotropic filtering may improve export quality.

!row Multisample AA
The number of samples for multisample anti-aliasing (MSAA). See [hull edges](/spine-meshes#Hull-edges).

!row Crop
When checked, the specified bounds are exported rather than using the skeleton's bounds. The first two numbers are X and Y world coordinates. The next two numbers are the width and height of the area to export. When enabled, the bounds can be adjusted by dragging the orange corners in the preview panel.

!row Size
The type of resizing to perform.

!row Scale
The relative scale of the image as a percentage.

!row Fit
When selected, the output image will fit within the specified pixel values.

!row Enlarge
When checked and the image is smaller than the specified size, the image is proportionally stretched until one of the sides matches the specified size.

!row Pad
When checked, additional space is added to the image to match the specified size.

!row Range
When checked, only the specified range of frames will be exported.

!row Warm Up
The number of times to play each animation before export, allowing physics to start in motion.

!table

# Preview panel

The preview panel shows a preview of the export.

![](/img/spine-user-guide/export/preview.png)

The frame slider and arrows at the bottom allow choosing the frame to preview. These frames may not correspond to the frames shown on the timeline in the Spine editor, as they depend on the FPS specified in the export settings.

A white box shows the bounds of the export. When `Crop` is checked, the bounds have orange corners that can be dragged and the box can be dragged to set the bounds for cropping.

The dimensions of the frame are shown in pixels along with an estimated file size for the export.

The edges of the preview panel can be dragged to resize the preview area.

# Additive blending

When a slot uses additive [blending](/spine-slots/#Blending), its attachment is rendered additively when the image or video has a background color. If the background is transparent, the attachment is rendered additively when over other images, but it is not rendered additively where it is over the transparent background. If the attachment image uses opaque black, the black will be seen where it is over the transparent background. To avoid this, use transparent instead of opaque black.

# Saving and loading export settings

<callout>Storing export files alongside your Spine project files can be useful to ensure exports are consistent. You can also save multiple files for specific outputs, such as sticker exports, along your game engine export settings.</callout>

The current export settings configuration can be saved as a JSON file by pressing the `Save` button in the lower left corner of the export window. This will store all the information currently displayed in the export dialog.

The saved JSON file can be then loaded by pressing the `Load` button in the lower left corner of the export window.


# Disabling export

Skeletons, animations, attachments, and skins have an `Export` property that can be unchecked to exclude them from exports. For example, this is useful to use a skeleton or attachment as a background or animation reference.

To do so, select a skeleton, skin, or attachment in the tree, then uncheck `Export` in the properties at the bottom of the tree. 

![](/img/spine-user-guide/export/skeleton-export.png)

If an attachment is not exported but it is keyed in animations, the keys will not be exported. If a mesh is not exported, any linked meshes will also not be exported.

[Next: Texture packing](/spine-texture-packer)
[Previous: Versioning](/spine-versioning)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-getting-started.md
## Title: Getting started - Spine User Guide
## URL: http://esotericsoftware.com/spine-getting-started
---

# Getting started

On this page we will briefly introduce you to all the bits and pieces needed to get you up and running with Spine.

Let's go!

## Trying and purchasing Spine

<callout>If you purchased Spine but lost your Spine license email, use the [Spine license recovery page](/spine-license-recovery) to retrieve it.</callout>

If you want to evaluate Spine before purchasing, visit the [Spine Trial download page](/spine-download), click the button for your operating system, and install the Spine Trial. The Spine Trial lets you try out all functionality the Spine editor offers, except for saving and exporting projects.

To purchase Spine, head over to the [Spine web store](/spine-purchase), select the Spine license you want to purchase, and complete the checkout process. Afterward you will receive an email with a link to your license page. Your license page contains download links, your activation code, and your invoices.

If you run into issues or have questions about purchasing Spine, you can [post on the Spine forum](/forum), look through the [FAQ](/support), or [contact us](/support#Contact-Us).

## Activation

The first time you run Spine you will be asked to enter your activation code.

![](/img/quickstart/activation.png)

Enter the activation code from your [license page](/spine-license-recovery) and press `Submit` to activate your Spine installation.

Spine needs an internet connection to activate and to download the chosen editor version (a [proxy server](/spine-proxy-server) can be specified). After that, Spine can run offline.

## Running Spine

When you run Spine, the launcher screen is shown.

![](/img/quickstart/launcher.png)

If you check `Start automatically`, you won't need to click `Start` each time you run Spine. In that case, to stop Spine from starting automatically, just click anywhere when the launcher window first appears.

Before clicking `Start`, you can choose the user interface language and the Spine editor version you want to run.

### Spine editor versions

<h4>Latest stable</h4>!!

<callout>When using Spine in production, we highly suggest explicitly setting the Spine editor version to match your Spine Runtimes version. This ensures you won't accidentally use a newer editor version that is incompatible with the Spine Runtimes version you are using.<br><br>See [versioning](/spine-versioning) for more information.</callout>

If you choose `Latest stable` in the version select box, it will run the newest stable, production ready release of the Spine editor. This is a good choice for new users.

<h4 style="clear:none">Latest beta</h4>!!

If you choose `Latest beta`, it will run the newest Spine editor beta. Beta versions let you try new features and are a great way to give us early feedback! However, exports may not yet be supported for all Spine Runtimes. You won't see the `Latest beta` option if there is currently no beta in progress.

<h4>Specific version</h4>!!

You can also choose a specific Spine editor version. All versions you have downloaded are shown, or you can click `Other...` and type the version number for [any version](/spine-changelog/archive) we've ever released.

Once you are happy with your version and language settings, click `Start` to run the Spine editor.

## Welcome to Spine

![](/img/quickstart/welcome.png)

The [welcome screen](/spine-welcome-screen) is your window into the Spine world! From here you can open one of the many example projects that come with Spine or create or open your own projects.

You can also read the latest Spine news and review the latest changes we have made to the Spine editor. This is a great way to stay on top of what is happening.

The `Tips` section displays handy [workflow tips](/spine-tips) that make your day-to-day work with Spine more efficient, while the items in the `Learn` section give you quick access to our [in-depth documentation](/spine-academy) and [forum](/forum), should you have any questions.

Go ahead, open one of the example projects!

## Getting to know the Spine editor

![](/img/quickstart/editor.png)

The Spine editor offers powerful tools and features to make editing your 2D animations as simple and efficient as possible. We have prepared lots of learning materials to get you up and running in no time.

[Spine Academy](/spine-academy) is your point of entry into Spine's documentation. The [Spine User Guide](/spine-user-guide) gives you a basic understanding of everything the Spine editor can do.

As you make your way through the Spine User Guide, it is helpful to explore Spine's example projects. You can open them from the welcome screen. We have in-depth explanations of how each example project is setup on our [example projects page](/spine-examples).

For your first Spine project you will need to prepare the images you want to animate using image editing software like Adobe Photoshop or Affinity Designer. We provide [scripts and plugins](/spine-images#Scripts) for various image editing software to make bringing your images into your Spine project a breeze.

Once you are comfortable working with Spine, check out our [Animating with Spine](/spine-videos#animatingWithSpine) video series to learn about animation theory and how to apply it in Spine to make amazing animation!

Eventually you'll want to display your animations in your games, apps, or on your websites. This is were Spine's powerful [export functionality](/spine-export) comes into play. Besides exporting standard image and video formats, Spine also exports to efficient binary and JSON formats that allow you to display your animations in games, apps, and websites using our Spine Runtimes.

## Getting to know the Spine Runtimes

![](/img/academy/runtime-documentation.jpg)

The [Spine Runtimes](/spine-runtime-documentation) are code libraries that you can use in your games, apps, or websites to load and render your animations. But we don't stop there &ndash; games and apps are dynamic and interactive and your animations should be too.

Our APIs provide direct access to your skeletons and animations, allowing them to interact with your users and game world. You can also combine animations, crossfade them, and more. Check out our [Spine demos](/spine-demos) to see some of these possibilities in action.

The Spine Runtimes integrate with many popular [game engines and frameworks](/spine-runtimes#runtimesOfficial), such as Unity, Unreal Engine, Cocos2d-x, PixiJS, and Game Maker. These engine and framework integrations sit on top of our programming language specific [generic runtimes](/spine-runtimes#runtimesGeneric), which can be used to integrate Spine into custom game engines or frameworks. The Spine community has also created many [third party runtimes](/spine-runtimes#runtimesThirdParty).

To get started using the Spine Runtimes, take a look at our [Spine Runtimes Guide](/spine-runtimes-guide). We also have documentation for specific game toolkits like [Unity](/spine-unity), [Unreal Engine](/spine-ue), and [others](/spine-runtime-documentation).

You can find the source code and example projects for all the official Spine Runtimes in the [Spine Runtimes GitHub repository](https://github.com/EsotericSoftware/spine-runtimes). There you can also file issues for any bugs you find or send pull requests if you want to contribute to the Spine Runtimes.

## Finding help

<img class="no-borders" src="/img/academy/forum.jpg">!!

If our documentation does not answer all your questions, we are happy to support you on the [Spine forum](/forum). Not only can you ask us and the community questions there, but you can also show off your work and geek out about Spine and animation with like-minded individuals!

For licensing and business related inquiries, please contact us via our [contact form](/support#Contact-Us).

## Keeping up-to-date

Spine will prompt when a new version is available, but make sure to keep your Spine editor version in sync with your Spine Runtimes version.

![](/img/spine-user-guide/getting-started/update.png)

To stay up-to-date with the latest news and developments surrounding Spine, keep an eye on the welcome screen news, make sure to read our [blog](/blog), and follow us on [Twitter](https://twitter.com/esotericsoftware).

Check out the [changelog](/spine-changelog) to see the latest feature additions and bug fixes we've made, and have look at our [roadmap](/spine-roadmap) to see what's coming next.

## Next steps

The Spine User Guide will teach you how skeletal animation in Spine works, how to set up and animate your skeletons, and will explain all the features that Spine has to offer. Continue on to the next page to begin learning.

Happy animating!

[Next: User interface](/spine-ui)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-ghosting.md
## Title: Ghosting view - Spine User Guide
## URL: http://esotericsoftware.com/spine-ghosting
---

# Ghosting view

The ghosting view contains settings for displaying skeleton "ghosts", also known as "onion skinning". Ghosting allows skeleton poses from preceding or subsequent timeline positions to be seen at the same time. These poses can then be considered when making decisions about the current pose.

![](/img/spine-user-guide/ghosting/ghosting-view.png)

# Frames

The frames section controls ghosts that are shown for preceding or subsequent frames.

![](/img/spine-user-guide/ghosting/frames.png)

<callout>For example, with `After frames` set to 6 and `Frame step` set to 3, two ghost poses will be drawn: one 3 frames ahead of the current frame and one 6 frames ahead of the current frame.</callout>

When `Before` is checked, ghosts are shown for preceding frames. When `After` is checked, ghosts are shown for subsequent frames.

The `Before frames` and `After frames` sliders control how far behind and ahead to draw ghosts. The `Frame step` slider sets how often a ghost is draw within that range. Fractional values may be typed into any of the slider text boxes, though rendering many ghosts can be taxing for the GPU.

When `Current` is checked, a ghost is shown for the current frame. This can be useful when [auto key](/spine-keys#Auto-key) is not enabled to see the difference between the current pose and the keyed pose. It can also be useful when showing ghosts [on top](#Options), only for the [selection](#Selection), or when hiding all attachments using the [viewport options](/spine-tools#Viewport-options).

# Key Frames

<callout>For example, with `After frames` set to 6 and `Key frame step` set to 1, a ghost will be drawn for all frames that have a key within the next 6 frames.</callout>

The `Key Frames` section is identical to the `Frames` section, except ghosts are only shown for frames that have a key set.

![](/img/spine-user-guide/ghosting/key-frames.png)

# Motion Vectors 

<callout>For example if `Before Frames` is set to 6, we can see how far a vertex moves in those 6 frames. If `Before Frames` is set to 1, we can see how far a vertex moves in 1 frame.</callout>

The `Motion Vectors` section enables drawing motion lines for mesh and region attachments. Motion vectors display how much and in which direction vertices move over time. This can be useful to visualize speed.

![](/img/spine-user-guide/ghosting/motion-vectors.png)

The `Threshold` setting hides motion vectors smaller than the threshold. When 0, all motion vectors are drawn.

# Display

<callout>The `Images`, `Silhouette`, and `Xray` settings can use significant GPU resources when many ghosts are displayed.</callout>

Each section has color buttons for the ghosts. The left color button sets the color of ghosts for preceding frames and the right button is for subsequent frames.

The left select box controls how ghost attachments are displayed: 

* `None` No attachments are displayed.
* `Images` Attachment images are rendered normally. The images are tinted using the chosen color. White tint leaves the images unchanged.
* `Solid` Attachment images are rendered using a solid color.

The right select box controls outlines for ghost attachments:

* `None` No outlines are displayed.
* `Silhouette` The entire ghost is outlined.
* `Xray` Each attachment is outlined.

# Options

![](/img/spine-user-guide/ghosting/options.png)

## Anchor

When checked, ghosts are shown at fixed intervals relative to frame 0. This means the ghosts don't change their pose when the timeline position changes, making it easier to see how the skeleton is animating. This is especially true when `Frame step` is greater than 1. `Anchor` only affects `Frames` ghosts. `Key Frames` ghosts are always anchored.

When unchecked, ghosts are shown relative to the current frame. This means the ghosts animate as the skeleton does, just shifted in time.

When [offset](#Offset) is used, the position anchored ghosts are drawn is based on how close in time the ghosts are to the current frame. When the animation is played, the ghosts will appear to slide toward or away from the current pose. Ghosts that are not anchored are always drawn at the offset distance from the skeleton.

## On top

When checked, the ghosts are drawn on top of the skeleton.

## Loop

When checked and `Repeat` is enabled for the timeline, ghosts will be shown past the start and end of the animation.

## Offset

The `X offset` and `Y offset` sliders control the drawing position of the ghosts on the X and Y axes. This has a number of uses.

`X offset` can make it easier to see the ghosts, otherwise they can be difficult to see when drawn on top of each other or on top of or behind the skeleton.

The offset can be used to simulate the speed the skeleton will be moving at runtime. The offset is defined as pixels per frame. Spine uses 30 frames per second, so the speed the skeleton will be moving at runtime can easily be converted to pixels per frame.

Once the ghosts have an `X offset` that matches the skeleton speed at runtime, ghosts will show if the feet are sliding for a running or walking animation. The animation matches the `X offset` perfectly when all of the ghost's feet land in the same position.

![](/img/spine-user-guide/ghosting/feet.png) 

If the feet will slide at runtime, the ghost's feet will not land in the same position. 

![](/img/spine-user-guide/ghosting/feet-sliding.png)

In this case, the animation needs to be [scaled](/spine-dopesheet#Scaling) slower or faster to match the `X offset`, or the `X offset` and runtime speed needs to be adjusted to match the animation.

`Y offset` can be used in a similar way, for example for a character that jumps.

## Selection

The bone selection button causes ghosts to be shown only for attachments in slots for the currently selected bones. If no bones are selected, all attachments are shown.

![](/img/spine-user-guide/ghosting/bones.png)

![](/img/spine-user-guide/ghosting/foot.png)

The lock button prevents the ghosts for the selected bones from changing and the refresh button updates the ghosted bones to the current selection.

# Video

[youtube:1n-VmK2eawM&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b?modestbranding=1&rel=0]

[Next: Graph view](/spine-graph)
[Previous: Dopesheet view](/spine-dopesheet)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-graph.md
## Title: Graph - Spine User Guide
## URL: http://esotericsoftware.com/spine-graph
---

# Graph

The graph view displays and edits both the timing and values of an animation's [keys](/spine-keys). Key values are plotted on the Y axis and time is on the X axis. The resulting "curve" is a line that shows how the value changes over time.

In comparison, the [dopesheet](/spine-dopesheet) shows only the timing of the keys, not their values, but can show the keys for many different properties at once. The graph may be crowded when many keyed properties are shown at once.

![](/img/spine-user-guide/graph/view.png)

See the graph [tips](/spine-tips#Graph) for various ways to use the graph efficiently.

# Rows

<callout>The graph rows can be hidden with the `Hide rows` [view setting](#Hide-rows) or `Hide Graph Rows` [hotkey](/spine-settings#Hotkeys).</callout>

On the left, below the [timeline](/spine-keys#Timeline), rows are shown for each keyed property, grouped by bone. Each row has a visibility dot to set which properties' curves are shown in the graph. Right click or hold control when left clicking a visibility dot to set multiple visibility dots at the same time.

![](/img/spine-user-guide/graph/rows.png)

Scrolling the mouse wheel over the graph rows scrolls them up or down. Similar to the viewport, drag with the right mouse button to pan the graph rows up and down.

## Overview row

The first row in the graph is the "overview row" and shows the animation name. Setting the visibility dot for the overview row sets it for all the rows currently shown in the graph. When many curves are shown, the graph may be crowded and it may be easier to use the [dopesheet](/spine-dopesheet).

<callout>Clicking the animation name can be useful when another animation needs to be selected, though the [animations view](/spine-animations-view) is even faster.</callout>

When a project has multiple skeletons, an overview row will appear above the rows for each skeleton. Hiding a skeleton in the tree will also hide it in the graph.

Click the animation name to select the animation in the tree.

## Bone rows

![](/img/spine-user-guide/graph/rows-bone.png)

Keys are grouped by the bone most related to the keyed property. Setting the visibility dot for a bone row sets it for all the property rows under it.

<callout>Clicking a bone name is more useful when the graph is [locked](#Locked), since the graph rows won't change when the bone is selected.</callout>

Click the bone name to select the bone in the viewport. Hold `ctrl` (`cmd` on Mac) to toggle the selection or select multiple bones.

Bone rows can be dragged up or down to change their [order](#Row-order) in the graph.

## Property rows

![](/img/spine-user-guide/graph/rows-property.png)

Under a bone row are property rows for each keyed property. Setting the visibility dot for a property row causes the curves for that property to be shown in the graph. A single property may have multiple curves.

<callout>Clicking the name of a [bone transform](/spine-tools#Bone-transforms) property will also select the corresponding [transform tool](/spine-tools#Transform-tools) to make setting new keys faster.</callout>

Click the property name to select the item in the viewport or tree. Hold `ctrl` (`cmd` on Mac) to toggle the selection or select multiple items.

## Other rows

Rows for [draw order](/spine-keys#Draw-order) and [events](/spine-keys#Events) aren't associated with a bone, so they are shown at the bottom of the graph when they have keys. Those rows can be hidden using the [graph filter](#Filters).

# Contents

The graph has two modes to control which bone rows are shown: unlocked and locked.

## Unlocked

![](/img/spine-user-guide/graph/unlocked.png)

<callout>To see all bone rows, [deselect](/spine-tools#Deselect) by pressing `spacebar`, `escape`, or by double clicking anywhere in the viewport.</callout>

The graph is unlocked by default. When unlocked, which bone rows are shown depends on the viewport or tree selection. If bones (or items under a bone) are selected, only the bone rows for those bones are shown and their visibility dots are set automatically.

If no bones are selected in the viewport or tree, then all bone rows are shown. If there are only a few bones, their visibility dots are set automatically. However if there are many bones, only the first bone's visibility dots will be set because it's not usually useful to see all the curves for many bones at once.

Using the graph unlocked is useful when only needing to see the keys for one bone at a time. When working on multiple bones, locking the graph contents may be more convenient.

## Locked

![](/img/spine-user-guide/graph/lock.png)

Click the lock button to lock the graph, preserving which bone rows are shown. While locked, changing the viewport or tree selection does not affect which bone rows are shown.

Locking the graph is useful when working on multiple bones or a particular set of bones, allowing multiple bone rows to be seen while selecting different bones.

#### Refresh

![](/img/spine-user-guide/graph/lock-refresh.png)

The refresh button updates the graph to show the bone rows for the current selection. This is equivalent to unlocking and locking the graph again.

#### Select

![](/img/spine-user-guide/graph/lock-select.png)

The select button selects the bones in the viewport for all of the currently shown bone rows. It can be useful to select the bones, modify the selection, then click refresh to change the bone rows shown in the graph.

## Order

Bone rows appear in the graph using the order the bones were selected. Bone rows can be rearranged by dragging them up or down.

## Visibility

Bone rows for [bones in a skin](/spine-skins#Skin-bones) are only shown when the skin is active. The tree view setting [Hide viewport skin bones](/spine-tree#Hide-viewport-skin-bones) can be unchecked to see all bone rows.

Property rows for [attachments in a skin](/spine-skins#Skin-attachments) are only shown when the skin is active. The tree view setting [Show all skin attachments](/spine-tree#Show-all-skin-attachments) can be unchecked to see all attachment property rows.

# Filters

The graph can be filtered to show only the chosen types of properties. Click the filter button to select the property types that will be shown. When a filter is active, the filter button is red.

![](/img/spine-user-guide/graph/filter-graph.png)

Hold `ctrl` (`cmd` on Mac) or `shift` to select multiple filters. The `Reset` button selects all filters.

When `Current tool` is active, only the [bone transform](/spine-tools#Bone-transforms) properties that corresponding to the current [transform tool](/spine-tools#Transform-tools) are shown.

Right click the filter button to toggle the filters on or off.

# Curves

Keys are shown in the graph as squares. The position on the X axis represents the key's [frame](/spine-keys#Frames) and corresponds to the timeline at the top of the graph. The position on the Y axis represents the key's value and corresponds to the labels on the right edge of the graph.

![](/img/spine-user-guide/graph/keys.png)

Lines are drawn between keys to show how the value changes between the keys.

When a curve bends sharply or is very large, it may be possible to see the line segments that make up the curve. This is not a bug. The graph shows exactly how the curve is approximated at runtime. If a curve is not smooth enough, it is easily remedied by adding another key.

When the graph shows multiple curves, some curves may appear behind others. Select or hover over a key or handle to cause that curve to be drawn on top.

## Repeat

When [repeat](/spine-keys#Repeat) is disabled, the setup pose is shown left of the first key and the last key value is shown right of the last key.

![](/img/spine-user-guide/graph/repeat-disabled.png)

When repeat is enabled, the curves are shown dimly before and after the animation to allow seeing transitions at the animation's beginning and end. Also, if the first and last keys have the same value and are Bezier, the handle is shown on the opposite key.

![](/img/spine-user-guide/graph/repeat-enabled.png)

The arrow button at the bottom of the graph, under frame zero, adds more space before frame zero.

## Separate properties

![](/img/spine-user-guide/graph/separate-rgba.png)

A single property may have multiple curves. For example, an RGBA property has four curves: red, green, blue, and alpha. Each key for the property stores values for all the curves, but when using a Bezier curve, each curve has its own handles that can be adjusted independently.

Some values that are normally keyed together as a single property can be "separated" so each value can be keyed independently. Bone transform [X and Y](/spine-keys#Separate-X-and-Y) and slot [color and alpha](/spine-keys#Separate-color-and-alpha) properties can be separated.

## Curve types

Each key has a "curve type" which determines the interpolation between the key and the next key. To set the curve type, select one or more keys and click one of the curve type buttons.

#### Stepped

![](/img/spine-user-guide/graph/curvetype-stepped.png)

The stepped curve type holds the key's value until the next key is reached.

#### Linear

![](/img/spine-user-guide/graph/curvetype-linear.png)

The linear curve type interpolates between keys using a straight line. This means the value changes at a constant rate as the timeline position moves from the key to the next key.

#### Bezier

![](/img/spine-user-guide/graph/curvetype-bezier.png)

The Bezier (pronounced `bez-ee-ay`) curve type uses a Bézier curve to interpolate between key values. The curve has two handles that can be dragged to customize the rate at which the value changes between the keys.

If the selected keys are already Bezier and the Bezier button is clicked, the handles are reset to their default positions.

## Presets

![](/img/spine-user-guide/graph/presets.png)

A number of preset buttons are provided to position the Bezier handles. These buttons will also set the curve type to Bezier, if it is not already set.

#### Automatic

![](/img/spine-user-guide/graph/preset-automatic.png)

When enabled, the handles are set to automatic. The handle icons change to triangles and the angle of the handles is adjusted automatically based on the values of the keys before and after the key. If the handles are moved manually, they are changed back to manual handles.

Automatic handles often provide good results. It can be useful to first apply automatic handles, then adjust them manually only if necessary.

#### Separate

![](/img/spine-user-guide/graph/preset-separate.png)

When enabled, the handles are separated so moving a handle does not affect the handle on the other side of the key. This causes a cusp in the curve, where the transition of the value at the key is not smooth.

Hold `alt` (`option` on Mac) before dragging a handle will separate the handle. Pressing `alt` while dragging will toggle separate handles on and off.

#### Flat

![](/img/spine-user-guide/graph/preset-flat.png)

Moves the handles to be flat, aligning them vertically with the key.

#### Bounce

![](/img/spine-user-guide/graph/preset-bounce.png)

Separates the handles and moves them to point roughly in the direction of the previous and next keys. This can be useful when changing directions abruptly, such as when a ball bounces.

#### Ease out

![](/img/spine-user-guide/graph/preset-ease-out.png)

Moves the handles so the value changes more slowly near the key.

#### Ease in

![](/img/spine-user-guide/graph/preset-ease-in.png)

Moves the handles so the value changes more slowly near the next key.

# Navigation

<callout>Enabling [auto zoom](#Auto) greatly reduces the need to manually adjust the graph view.</callout>

The graph view shows curves for the [graph rows](#Rows) that have their visibility dot set. The curve area can be navigated by panning and zooming, just like the [viewport](/spine-ui#Viewport).

Use the right mouse button or hotkeys to [pan](/spine-ui#Panning).

Use the mouse wheel or hotkeys to [zoom](/spine-ui#Zooming) both the X and Y axes the same amount. To zoom each axis a different amount, hold `alt` (`option` on Mac) while dragging with the right mouse button.

## Frame

![](/img/spine-user-guide/graph/frame.png)

When the `Frame` button is clicked, the graph view is zoomed and panned so all the curves are visible. If keys or handles are selected in the graph, the graph view is zoomed and panned so only those visible.

## Auto

![](/img/spine-user-guide/graph/frame-auto.png)

When `Auto` is enabled, the graph view will automatically zoom to keep all the curves visible. Spine uses intelligent automatic zooming that avoids making unnecessary adjustments. Zoom can still be adjusted manually.

It is common to have `Auto` enabled most of the time because it greatly reduces the need to manually adjust the graph view.

# Selection

Click to select a key or handle. For a key, this will also set the timeline position to the selected key, if [jump to key](/spine-settings#Jump-to-key2) is enabled. Hold `ctrl` (`cmd` on Mac) to toggle the selection or select multiple keys or handles.

If the graph is [locked](#Locked) when a key is clicked, the item for the key is selected in the viewport or tree. This makes it easier to modify the selected key.

Right click a key to select the item for the key in the viewport or tree. When the graph is unlocked and many curves are shown, right clicking a key will change the graph to show only curves for the bone associated with that key.

When a key or handle is selected, press `ctrl+A` (`cmd+A` on Mac) to select all keys or handles in the same curve. Press it again to select all keys or handles shown in the graph.

When keys are selected in the graph, the same keys are selected in the dopesheet. Likewise, when keys are selected in the dopesheet, they are also selected in the graph.

## Sync

When dopesheet [sync](/spine-dopesheet#Sync) is enabled, the dopesheet shows the rows for the curves that are visible in the graph. In some cases it may be easier to use the dopesheet to move keys, especially the dopesheet [overview row](/spine-dopesheet#Overview-row).

## Box selection

When no keys or handles are selected, drag in empty space to box select keys. You may need to [deselect](/spine-tools#Deselect) first by pressing `spacebar`, `escape`, or by clicking in empty space in the graph.

![](/img/spine-user-guide/graph/box-select-nobox-gif.gif)

Hold `ctrl` (`cmd` on Mac) before dragging to make a box selection that starts on top of a key or handle.

To box select handles, first select a handle, then hold `ctrl` (`cmd` on Mac) before dragging to make a box selection.

To box select without leaving the box selection behind, drag and release the mouse button quickly. To keep the box selection when selecting keys, drag then pause briefly before releasing the mouse button.

![](/img/spine-user-guide/graph/box-select-gif.gif)

The edges of a box selection can be dragged to scale the selected keys. Scaling can be used to reverse the order of the keys by moving the left edge past the right, or the right edge past the left.

![](/img/spine-user-guide/graph/scale-gif.gif)

Hold `shift` to disable [frame snapping](/spine-keys#Frame-snapping) when creating or scaling a box selection.

# Manipulating keys

Selected keys and handles can be moved by dragging. When [drag to edit](/spine-settings#Drag-to-edit) is enabled, you can drag in empty space to make adjustments. Hold `ctrl+shift` (`cmd+shift` on Mac) when starting the drag to duplicate the selected keys. Hold `shift` while dragging to disable [frame snapping](/spine-keys#Frame-snapping).

Double click to delete a key.

When dragging a handle, press `alt` (`option` on Mac) while dragging to toggle [separate](#Separate). Hold `shift` to adjust only the length. Hold `ctrl+shift` (`cmd+shift` on Mac) to adjust the length of both handles at the same time.

## New keys

Normally new keys are assigned a linear curve type. However, if a key is placed between keys that are using Bezier or stepped, then the new key is assigned a Bezier or stepped curve type instead. When this is done for Bezier, the handles for the previous key, the new key, and the next key are adjusted so the curve does not change. This allows new keys to be added in the middle of an animation without changing the curves.

## Axes

![](/img/spine-user-guide/graph/axes.png)

The axes buttons allow moving keys to be restricted to only up/down or left/right.

## Snapping

![](/img/spine-user-guide/graph/snapping.png)

When a key is moved up or down, it is snapped horizontally to its original frame. This allows changing a key's value without accidentally changing its frame.

When a key is moved left or right, it is snapped vertically to its original value. This allows changing a key's frame without accidentally changing its values.

When key snapping is enabled, the key value snaps to other keys. This can help when a key needs to have the same value as another key. Key snapping can snap to any key, but prefers keys on the same curve. To snap to a specific key, first hover the mouse over the key briefly, then move the desired key and it will prefer to snap to the hovered key.

Key snapping can be enabled or disabled temporarily by holding `shit+alt` (`shit+option` on Mac).

When any snapping is applied, a white line is shown.

## Clipboard buttons

![](/img/spine-user-guide/graph/clipboard.png)

See [clipboard buttons](/spine-keys#Clipboard-buttons).

## Shift

![](/img/spine-user-guide/graph/key-shift.png)

See [shift](/spine-keys#Shift).

## Offset

![](/img/spine-user-guide/graph/key-offset.png)

See [offset](/spine-keys#Offset).

## Key shown

![](/img/spine-user-guide/key-frames/key-shown.png)

See [key shown](/spine-keys#Key-shown).

## Handle modes

When keys are moved left or right to adjust timing, normally the handles stay the same and may wreck the curves, especially when the handles aren't flat. Spine provides two handle modes so the handles of the key being moved and the handles of neighboring keys are adjusted automatically. This can reduce the need to adjust handles after moving keys.

#### Value

When enabled, the handles are scaled horizontally. The minimum and maximum values the curve reached remain the same.

#### Shape

When enabled, the handles are moved to keep the original shape of the curve. The minimum and maximum values the curve reached may change.

# Favor

[youtube:RUzXpwwt6hM]

The favor button shows the favor slider, which is a workflow tool that helps you to create a breakdown pose that is more like the previous key or the next key.

![](/img/spine-user-guide/graph/favor.png)

A breakdown pose is an intermediate pose. It doesn't work by itself, it needs the main poses to explain the action. The main poses describe *what* is happening and the breakdown poses between them tell *how* it is happening, meaning which parts move first, how far, in what direction, and so on. Breakdown poses add interest to the basic movements and greatly improve the quality of the animation.

To use the favor slider, position the timeline between two keys and drag the favor slider. Dragging it to the left moves the keys toward the key before the current frame. Dragging it to the right moves the keys toward the key after the current frame. Hotkeys can be used to make using the favor slider faster. See the video above for more usage details.

When keys are selected, dragging the favor slider adjusts those keys. When no keys are selected, dragging the favor slider sets keys for all the visible curves, like [key shown](/spine-keys#Key-shown), and adjusts those keys.

The favor slider has modes that control how the keys are moved. The `Favor` mode is used most often, but the others can come in handy occasionally.

* `Favor` Moves keys toward the previous/next keys. When multiple keys are selected, keys further from the next/previous key move more slowly.
* `Blend` Moves keys toward the previous/next keys, like `Favor`. When multiple keys are selected, all keys move at the same speed.
* `Shift` Moves keys toward the previous/next keys by moving them all together, they don't change relative to each other.
* `Linear` Moves keys toward being on a line between the next/previous keys. 
* `Average (curve)` Moves keys toward the average of the next/previous keys on the same curve.
* `Average (frame)` Moves keys toward the average of other selected keys on the same frame.
* `Average (all)` Moves keys toward the average of the next/previous keys for all curves with selected keys.
* `Default` Moves keys toward the default values. Usually this is 0, but some properties use other values. For example, scale uses 1.
* `Setup` Moves keys toward the setup pose value.
* `Store` Moves keys toward the stored curves. Use [store](#Store) to set the stored curves.

Dragging past the edge of the slider will move the keys beyond the next or previous key. This can be used to achieve overshoot.

Clicking the heart icon resets the slider to the middle. This is equivalent to deselecting then making the same selection again.

# Store

![](/img/spine-user-guide/graph/store.gif)

The `Store` button stores all the current keys and handles for the whole animation. The stored curves are drawn in the background and can be used as a reference when adjusting keys and handles. Clicking `Store` again clears the stored keys and handles.

The `Swap` button swaps the stored keys and handles with the current keys and handles.

You can `Store`, make changes to your animation, then `Swap` to see if you like the new changes better. It can also be used with the `Store` [favor](#Favor) mode to adjust keys toward or away from the stored curves.

# View settings

#### Hide toolbar

![](/img/spine-user-guide/graph/hide-toolbar.png)

When checked, the graph toolbar is hidden. This can save some vertical space when the toolbar buttons are not needed or hotkeys are being used.

#### Hide rows

![](/img/spine-user-guide/graph/hide-rows.png)

When checked, the graph rows are hidden. This can save horizontal space, but without the rows the visibility dots cannot be used to control which curves are visible.

# Video

[youtube:37CeFRzrjqc]

[Next: Mesh Tools](/spine-mesh-tools)
[Previous: Ghosting](/spine-ghosting)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-ik-constraints.md
## Title: IK constraints - Spine User Guide
## URL: http://esotericsoftware.com/spine-ik-constraints
---

# IK constraints

<callout>IK constraints are not available in Spine Essential.</callout>

An IK constraint sets bone rotations so the tip of a bone touches or points at a target bone. This has a wide variety of uses but the most common is to control limbs by moving a hand or foot.

The usual way of animating is called FK or "forward kinematics". FK is a top-down approach: to position the hand, first the upper arm is rotated, then the lower arm. Many movements can be achieved this way, but others are difficult. For example, to keep the hand in place as the skeleton stands up, the arm bones need to be adjusted continuously. It takes many keys to keep the hand in place.

IK or "inverse kinematics" can solve this more elegantly by using a bottom-up approach. For example, the hand position is set, then Spine automatically sets the rotation for the upper and lower arm bones.

![](/img/spine-user-guide/ik/ik.png)

IK is useful for many tasks such as keeping feet from penetrating the floor during a walk animation, adjusting the IK target at runtime to stand on uneven terrain, [chickens](/forum/viewtopic.php?f=8&t=2753), and more.

See the IK constraint [demo](/spine-demos#Inverse-kinematics), [example projects](/spine-examples#IK-Constraints), and [tips](/spine-tips#IK-Constraints) for usage examples.

# Setup

Spine IK's can constrain one or two bones. To create an IK constraint, first:

* For one bone, select the bone to constrain. After creating the IK constraint, the bone will rotate to point at the target bone.
* For two bones, select a bone to constrain and also select one of its children. After creating the IK constraint, the bones will rotate so the tip of the child bone is at the target bone.

<callout>Clicking a constrained bone creates the target at the tip, ensuring the constrained bones don't move when the IK constraint is created.</callout>

Next, choose `New...` `IK Constraint` in the tree properties to enter choose target mode. Choose the target bone by either clicking an existing bone or click in empty space to create a new bone. Clicking a constrained bone creates the target at the tip of that bone. The target bone cannot be a descendant of the constrained bones.

![](/img/spine-user-guide/ik/setup.png)

> Constraining three or more bones is not supported because it is nondeterministic and would be difficult to control. Instead, use multiple IK constraints or FK.

# Properties

For one bone IK:

![](/img/spine-user-guide/ik/properties1.png)

For two bone IK:

![](/img/spine-user-guide/ik/properties2.png)

## Parent

This shows the first constrained bone. Clicking the bone selects it.

A different bone can be chosen by clicking the pencil icon.

## Child

<callout>This property will be blank for one bone IK.</callout>

This shows the second constrained bone. Clicking the bone selects it.

A different bone can be chosen by clicking the pencil icon or the child bone can be cleared by clicking the `X` button.

## Target

This shows the target bone. Clicking the bone selects it.

A different bone can be chosen by clicking the pencil icon.

## Positive

<callout>This property is available only for two bone IK.</callout>

When checked, the child bone rotates in the positive direction (counterclockwise) relative to the parent bone.

![](/img/spine-user-guide/ik/bend-direction.png)

The positive bend direction property can be [keyed](/spine-keys#IK-constraints).

## Compress

<callout>This property is available only for one bone IK.</callout>

Compress causes the constrained bone to be scaled smaller when the distance to the target bone is smaller than the constrained bone's length.

The compress property can be [keyed](/spine-keys#IK-constraints).

## Stretch

Stretch causes the constrained bones to be scaled larger when the distance to the target bone is greater than the constrained bones' lengths.

The stretch property can be [keyed](/spine-keys#IK-constraints).

Limitations when used with two bone IK:

* The child bone's local Y translation is set to 0.
* Stretch is not applied when [softness](#Softness) is greater than 0.
* Stretch is not applied when the parent bone has local nonuniform scale.

![](/img/spine-user-guide/ik/stretch-gif.gif)

## Uniform

When checked and [compress](#Compress) or [stretch](#Stretch) is used, the bones are scaled the same on both the X and Y axes.

![](/img/spine-user-guide/ik/stretch-uniform-gif.gif)

## Softness

<callout>This property is available only for two bone IK.</callout>

Softness slows down the bones as the constrained bones straighten. With 0 softness, IK bones may move very quickly just before the target goes out of range, which is usually undesirable.

The softness value is the target bone's distance from the maximum reach of the bones where the bones start to slow down as they straighten. The bones won't be fully straightened until the target moves that far past the maximum reach of the bones.

The softness property can be [keyed](/spine-keys#IK-constraints).

![](/img/spine-user-guide/ik/softness-gif.gif)

## Mix

See [constraint mix](/spine-constraints#Mix). The mix property can be [keyed](/spine-keys#IK-constraints).

Often mixing FK and IK is only necessary briefly to transition to or from 0 (only FK) and 100 (only IK) during an animation. However, some situations can make use of mixing FK and IK to achieve combined motion that would otherwise be difficult to key. For example, arms waving up and down slightly using IK while also performing another animation using FK.

When the mix is greater than 0 and less than 100, moving the target bone may cause the rotation to suddenly use the other direction. This occurs because interpolation between the bone's rotation and the constraint's rotation uses the shortest rotation direction.

For two bone IK, when the mix is greater than 0 and the parent bone has local nonuniform scale, the child bone's local Y translation is set to 0.

# Limitations

Due to the interactions of IK and [bone transforms](/spine-bones#Bone-transforms), a few minor limitations apply:

* The target bone cannot be a child of the constrained bones.
* For two bone IK:
  * The child bone must be an immediate child of the parent bone.
  * Disabling inherit rotation, scale, and shear is not possible for either constrained bone.
  * The local shear of the parent IK bone is set to 0.
  * When the mix is greater than 0 and the parent bone has local nonuniform scale, the child bone's local Y translation is set to 0.
  * Stretch causes the child bone's local Y translation to be set to 0.
  * Stretch is not applied if softness is greater than 0.
  * Stretch is not applied when the parent bone has local nonuniform scale.

# Video

[youtube:sos36zmLFOc&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[Next: Path constraints](/spine-path-constraints)
[Previous: Constraints](/spine-constraints)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-images.md
## Title: Images - Spine User Guide
## URL: http://esotericsoftware.com/spine-images
---

# Images

<callout>Spine works only with individual image files. If your images are already in a texture atlas, it can be [unpacked](/spine-texture-packer#Texture-Unpacker).</callout>

A skeleton can have attachments that reference image files. Spine is not an image editor, so you will need to use your favorite image editing software to create the art for your skeleton. Each part of the skeleton that will move independently needs to be a separate image file.

If your images are on separate layers in Photoshop, Affinity Designer, or another image editor, a lot of time can be saved by [importing a PSD](/spine-import-psd) or using a [script](#Scripts) to bring them into Spine in the right positions. Otherwise, each image will need to be positioned manually in Spine.

The first step to setting up a skeleton is to bring in each image as a [region attachment](/spine-regions), which is a simple, rectangular image that is attached to a bone. However, before region attachments can be created, Spine needs to know where to find the skeleton's image files.

# Images path

The `Images` node in the tree has a path to a folder where Spine will find PNG and JPEG image files for the skeleton. The images path can be relative to where the project file is saved or can be an absolute path. The `Browse` button can be used to specify a path, or you can type a path and press `enter`.

Once the path is set, the image files in that folder appear under the `Images` node. Spine watches the images folder and immediately loads any changes to the image files.

![](/img/spine-user-guide/images/path.png)

By default, only the first 2,000 image files found in the image folder are shown. This prevents Spine from scanning millions of files if the wrong path is accidentally specified. Uncheck `Limit scanning` to allow Spine to find more than 2,000 image files.

## Creating region attachments

When an image file from under the `Images` node is dragged into the viewport, Spine will create a slot and a region attachment under the root bone for the image. Multiple images can be selected in the tree using `shift` or `ctrl` (`cmd` on Mac) and dragged into the viewport at the same time.

![](/img/spine-user-guide/images/slots.png)

Images can also be dragged to a bone, slot, or attachment in the tree. If dragged to a bone or slot, the new region attachment is centered on the bone. If dragged to an attachment, the transform of that attachment is applied to the new region attachment.

A region attachment can also be created by pressing `P` or clicking the `Set Parent` button in the image's tree properties, then choosing a bone in the viewport or a bone or slot in the tree. When a skeleton has many bones, it is often easiest to choose a bone in the viewport.

![](/img/spine-user-guide/images/set-parent.png)

Each image file under the `Images` node has an orange icon if it is not used by any attachment and a green icon if it is used by at least one attachment.

![](/img/spine-user-guide/images/used.png)

<callout>While it's possible to position region attachments manually, it saves a lot of time to use a [script](#Scripts) to bring them into Spine in the desired positions.</callout>

After creating region attachments, the `Rotate`, `Translate`, and `Scale` tools can be used to assemble them into the "setup pose", which is the pose of the skeleton before being animated. Next, the `Create` tool can be used to create bones and move the attachments to the bones. Using these tools is explained in the [next section](/spine-tools).

## Image file lookup

Spine finds the image file for an attachment by taking the path specified under the `Images` node and appending the attachment name. The attachment name does not need to include a file extension. Spine will look for files with `.png`, `.jpg`, or `.jpeg` file extensions, though PNG files are most common.

For example, for an images path of `./images/` and an attachment named `head`, Spine will look for `./images/head.png`, `./images/head.jpg`, and `./images/head.jpeg`. Note that some operating systems are case sensitive.

Attachment names can include subfolders. For example, for an images path of `./images/` and an attachment named `red/head`, Spine will find `./images/red/head.png`.

If an attachment has a `Path` set, the path is used to find the image file instead of the attachment name. Two attachments under the same slot cannot have the same name, but they can have the same path.

# Import PSD

When creating skeleton images using an image editor outside of Spine, the images are usually created on separate layers and oriented correctly for the skeleton's setup pose. It can be tedious to export the images then reposition them individually in Spine. To save time, Spine can import a PSD file saved using Adobe Photoshop or any other graphics software capable of writing a PSD file. See [Import PSD](/spine-import-psd) for more information.

## Scripts

As an alternative to [Import PSD](/spine-import-psd), scripts are provided for various image editors to export both images and a JSON data file. This data file can then be [imported](/spine-import) into Spine to save time when setting up skeletons: just import the data, create the bones, and rigging is complete.

The latest version of the scripts can always be found at [spine-scripts](https://github.com/EsotericSoftware/spine-scripts) on GitHub. Some image editors don't need a script because they have Spine export support built-in, such as [Affinity Designer](https://affinity.serif.com/).

Scripts are provided for [Adobe Photoshop](https://github.com/EsotericSoftware/spine-scripts/tree/master/photoshop), [Adobe Illustrator](https://github.com/EsotericSoftware/spine-scripts/tree/master/illustrator), [InkScape](https://github.com/EsotericSoftware/spine-scripts/tree/master/inkscape), [GIMP](https://github.com/EsotericSoftware/spine-scripts/tree/master/gimp), and [Adobe After Effects](https://github.com/EsotericSoftware/spine-scripts/tree/master/aftereffects). Currently the Photoshop script is the most sophisticated and provides the most features, such as tags in layer names to configure bones, slots, and skins.

# Video

[youtube:WRki3xKS1hM&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]
[youtube:p7yZET00GeE]

[Next: Tools](/spine-tools)
[Previous: Slots](/spine-slots)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-import-psd.md
## Title: Import PSD - Spine User Guide
## URL: http://esotericsoftware.com/spine-import-psd
---

# Import PSD

Spine can import the content of an Adobe Photoshop PSD file saved from Adobe Photoshop or any other graphics software capable of writing a PSD file. The layers in the PSD file are imported as attachments within a new or existing Spine project. Additionally, it is possible to automate the creation of skins, placeholders, slots, and more by annotating your layer names.

Import PSD provides similar functionality to our [PhotoshopToSpine script](https://github.com/EsotericSoftware/spine-scripts/tree/master/photoshop), except it is much faster and doesn't require purchasing Adobe Photoshop.

Below is a non-exhaustive list of software that generate PSD files:

- Affinity
- Clip Studio Paint
- GIMP
- Krita
- Paint Tool SAI
- Photopea
- Procreate

# Usage

To open the PSD import dialog, choose `Import PSD` from the main menu.

![](/img/spine-user-guide/import-psd/menu.png)

The `Import PSD` dialog has three sections: `Input PSD File`, `Output PNG File`, and `Import Data`.

![](/img/spine-user-guide/import-psd/dialog.png)

## Import PSD File

Choose the PSD file path and set options for the import process. The available options are:

- `PSD File`: The path to the PSD file you want to import.
- `Scale`: Scales the layers before writing the image files. This is often used when the PSD is high resolution and you want to use more reasonably sized images in Spine.
- `Padding`: The number of transparent pixels to add around each image. This can avoid aliasing artifacts for opaque pixels along the image border.
- `Trim whitespace`: When checked, whitespace around the edges of each layer is removed. When unchecked, all images are the size of the PSD canvas.
- `Ignore hidden layers`: Hidden groups and layers are not output.

## Output PNG Files

Choose the output folder where the images extracted from the PSD file will be saved. The available options are:

 - `Folder`: The folder where the extracted images will be saved.
 - `Overwrite confirmation`: When checked, a confirmation dialog is shown if saving the images would result in overwriting existing files.
 - `Images path`: The select box allows you to choose:
   - A skeleton in the current project. The path is set to the selected skeleton's image folder.
   - `PSD Path`: The path is set to the folder that contains the PSD file + `/images`.

<callout>Be careful when overwriting images. Once an image file is overwritten, it cannot be recovered.</callout>

## Import Data

This section works the same as the [Import Data](/spine-import#Data) dialog. Please refer to that documentation to understand its behavior.

# PSD Setup

The group and layer names in the PSD are used to control how Spine outputs the image files.

## Origin
The position of guides in the PSD determine the `0,0` origin in Spine. The first horizontal guide determines the `y`, while the first vertical guide determines the `x`. In the absence of horizontal and/or vertical guides, half of the width and half of the height will be used. Subsequent guides after the first for each axis are ignored by Spine, so they can be used without affecting the import process. You can also control the origin by using the `[origin]` tag on a layer, as explained in the section below.

The origin in the editor can end up at the edge of a pixel or in the center of a pixel, depending on the guide position (which can be placed between pixels) or, if there are no guides, on the canvas width/height (odd sizes result in the editor origin at the center of a pixel). It is recommended to place the origin at the edge of a pixel to avoid blurry filtering artifacts.

## Tags

Using tags in group or layer names tells Spine how to process those items. Tags are surrounded by square brackets, for example `[tag:value]`. The tag is mandatory, while the `:value` depends on the tag and may be mandatory or optional. If the `:value` is omitted, the name of the layer or group will be used as the value. Tags can be inserted at any point in the layer name, for example: `head [slot]` or `[slot] head`. Some tags can only be used on layers, others only on groups, but most can be used on both.

### Group and layer tags

- `[bone]` or `[bone:name]` Layers, slots, and other bones are placed under a new bone. The new bone is created at the center of the first visible layer. Groups with the bone tag can be nested. Bone positions aren't updated if the bone exists.
- `[slot]` or `[slot:name]` Layers are placed in a slot.
- `[skin]` or `[skin:name]` Layers are placed in a skin. Images of a layer with the skin tag are placed in a subfolder on disk with the name of the skin.
- `[scale:number]` Layers are scaled. Their attachments are scaled inversely so that they appear the same size in Spine.
- `[pad:number]` Padding of `number` is added to the layer or the children of the group. Useful to add different padding from what is set through the `Padding` option.
- `[folder]` or `[folder:name]` Layers are placed in a subfolder on disk. Groups with the folder tag can be nested.
- `[overlay]` The layer is used as if it was a clipping mask for all underlying layers.
- `[trim]` or `[trim:true]` or `[trim:ws]` or `[trim:false]` or `[trim:canvas]` or `[trim:mask]` If the value is:
  - Not set, `true`, or `ws`: Forces the layer to have whitespace removed.
  - `false` or `canvas`: Forces the layer to have the canvas size.
  - `mask`: Forces the layer to be trimmed based on the size of the layer mask. This allows control over the size of an image even when using the `Remove whitespace` option. A layer mask can be useful when a mesh needs empty space around the edges to insert vertices in Spine.
- `[ignore]` The layer, groups, and child groups will be ignored.
- `[!bones]` Prevents the effect of the `[bones]` tag on this layer or group.
- `[!slots]` Prevents the effect of the `[slots]` tag on this layer or group.
- `[!name]` Prevents the effect of the `[name:pattern]` tag on this layer or group.
- `[!path]` Prevents the effect of the `[path:pattern]` tag on this layer or group.
- `[!bone]` Prevents the effect of the `[bone:pattern]` tag on this layer or group.
- `[!slot]` Prevents the effect of the `[slot:pattern]` tag on this layer or group.

### Layer tags

These tags can only be applied to layers or groups having the `[merge]` tag.

- `[mesh]` or `[mesh:name]` The layer is a mesh or, when `name` is specified, a linked mesh. The `name` must match the name of an existing mesh. When `[mesh:name]` is used, the linked mesh uses the size of the source mesh.
- `[path:name]` Specifies the name of the image file on disk for the layer, for when it needs to be different from the attachment name.
- `[origin]` The center of the layer is used to determine the Spine editor origin. An image for the layer is not output.

### Group tags

These tags can only be applied to a group.

- `[merge]` Layers in this group will be merged into a single layer, resulting in a single image being output.
- `[bones]` Adds a `[bone]` tag to all immediate children.
- `[slots]` Adds a `[slot]` tag to all immediate children.

A pattern is a string that contains an asterisk (`*`). The pattern is used for all child layers, with the asterisk being replaced by a name or value in the child layer. For example: `[name:prefix*suffix]`

These tags have different behavior when the value is a pattern:

- `[name:pattern]` Adds a prefix or suffix to the layer names in the group. The name conversion happens before the other pattern tags described below are applied.
- `[path:pattern]` Adds a prefix or suffix to the layer paths in the group. The layer path pattern is applied even if the layer has no `[path]` tag.
- `[bone:pattern]` Adds a prefix or suffix to the layer bones in the group. 
- `[slot:pattern]` Adds a prefix or suffix to the layer slots in the group.

## Attachment properties

The layer order, tag values, and layer names determine how Spine creates slots, attachments, placeholders, skins, and image paths. When the PSD file contains many groups and layers and many tags are used, it is helpful to understand how Spine interprets them to achieve the desired result.

The layer hierarchy is obtained by traversing from the outermost ancestor group to the layer itself. If a layer or group contains both the `[skin]` tag and the `[folder]` tag, precedence will be given to the `[skin]` tag.

Spine assigns the following properties to the layer in this way:

- `Slot`: The value of the closest `[slot]` tag up the hierarchy, if present. Otherwise, it is the name of the layer. Use `/` in the slot name to create slot folders.

- `Skin`: Values of the `[skin]` tags from the hierarchy are selected. The closest `[skin]` tag up the hierarchy determines the name of the skin, and the remaining `[skin]` tags determine the folders where the skin image will be output.

- `Placeholder`: Values of the `[folder]` tags from the group hierarchy + the layer name.

- `Attachment`: Values of the `[folder]` and `[skin]` elements from the group hierarchy + the layer name.

- `Attachment image path`: Values of the `[folder]` tags from the group hierarchy + the layer name. If the layer has a `[path]` tag, it is used instead of the layer name.

### Slashes

Starting a layer name or slot, skin, folder, or path tag value with `/` prevents the value from being influenced by parent groups. For example, `[path:/name]` will not use `[folder]` tags from parent groups.

If the slash is instead inside the name or tag value, it denotes subfolders. For example, `[path:subfolder/name]` causes the image to be output in a subfolder at `subfolder/name.png`.

## Blending Modes

Spine recognizes a few Photoshop blending modes on groups or layers, causing the slot in Spine to have the appropriate blending mode.

- `Normal` corresponds to the `Normal` blending mode in Spine.
- `Multiply` corresponds to the `Multiply` blending mode in Spine.
- `Screen` corresponds to the `Screen` blending mode in Spine.
- `Linear Dodge` corresponds to the `Additive` blending mode in Spine.

## Draw order

When importing a PSD file, Spine will try to make the draw order reflect the layer order in the PSD. However, in some cases that is not possible. For example:

- `A [slot:slot-folder-1/A]`
- `B [slot:slot-folder-2/B]`
- `C [slot:slot-folder-1/C]`

`slot-folder-1` cannot be both before and after the `slot-folder-2`. In this case, the folder position is determined by the last slot found in the folder.

# Limitations

Spine can only import pixel data for each layer. PSD features that are rendered by Photoshop rather than being stored as pixel data in the PSD file include:

 - Layer styles
 - Gradient layer masks
 - Adjustment and fill layers (when not saved as pixel data)
 - Percentage fill of a layer

If these features are used, a workaround is required for Import PSD to obtain pixel data:

- Convert the unsupported layers into smart objects. Photoshop will then save pixel data of the resulting layer in the PSD file.
- Use the [PhotoshopToSpine script](https://github.com/EsotericSoftware/spine-scripts/tree/master/photoshop) or other scripts available in the [spine-script](https://github.com/EsotericSoftware/spine-scripts) repository.
- Create a Spine-compatible PSD using the [SpineCompatiblePsd script](https://github.com/EsotericSoftware/spine-scripts/tree/master/photoshop/SpineCompatiblePsd).

[Next: Command line interface](/spine-command-line-interface)
[Previous: Import](/spine-import)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-import.md
## Title: Import - Spine User Guide
## URL: http://esotericsoftware.com/spine-import
---

# Import

<callout>Spine project files and JSON or binary data can also be imported using the [command line interface](/spine-command-line-interface).</callout>

Spine can import data from other Spine projects, allowing projects to be combined. Spine can also import data in the same JSON and binary formats that Spine exports, allowing skeletons to be imported from other programs, such as image editor [scripts](/spine-images#Scripts).

# Project

Spine can import a skeleton or animation from another Spine project. This can be used to move skeletons from other projects into a single project. Importing an animation can be used to have multiple people working on the same project, with some limitations.

To open the import project dialog, choose `Import Project` from the main menu.

![](/img/spine-user-guide/import/menu-project.png)

Enter the path to the project file to import and choose to import a skeleton or animation.

![](/img/spine-user-guide/import/import-project.png)

## Skeleton

<callout>After the skeleton is imported, some items can be dragged in the tree from one skeleton to another.</callout>

When importing a skeleton, choose which skeleton to import and the name to use for the imported skeleton.

![](/img/spine-user-guide/import/import-skeleton.png) 

## Animation

<callout>An animation can be imported into a completely different skeleton, as long as it uses the same name for at least some bones and other items.</callout>

When importing an animation, choose which skeleton and animations to import, then the skeleton to which they will be imported.

![](/img/spine-user-guide/import/import-animation.png)

The skeleton that the animations are imported into must have bones, slots, attachments, events, and constraints with the same names as the skeleton that is being imported from, but only for those items that are actually keyed in the animations being imported. Additionally, for [deform keys](/spine-keys#Deform-keys), the mesh must have the same number of vertices in both skeletons.

If the skeleton is missing items keyed by an animation, the animation is imported without those keys and warnings are shown for the missing items.

# Data

<callout>You can import data into Spine from an image editor [script](/spine-images#Scripts), continue working in your image editor, and later import newer data into the same skeleton.</callout>

Spine can import data in the [JSON](/spine-json-format) or [binary](/spine-binary-format) formats that it [exports](/spine-export). This provides a path to bring data from other programs into Spine, such as from image editor [scripts](/spine-images#Scripts).

It can be useful to recreate a Spine project from JSON or binary data and a texture atlas. To do that, see the [Importing skeleton data](/blog/Importing-skeleton-data) blog post.

To open the import data dialog, choose `Import Data` from the main menu.

![](/img/spine-user-guide/import/menu-data.png)

Enter the path to the JSON or binary file to import, or the folder where they are located, and a name for the imported skeleton.

![](/img/spine-user-guide/import/import-data.png)

## Scale

<callout>For example, if a Spine project is created with images that are 4 times larger than necessary, it can be exported to JSON with `Nonessential` checked, then imported to a new project with a scale of 0.25. The images used for the new project should be 25% the size of the original images.</callout>

The import data `Scale` changes the size of the skeleton without changing the scale of any bones. All the data is scaled: the position and length of bones, attachment offsets, bounding boxes, meshes, animations, etc. 

If a Spine project was created with images that are the wrong size, the project can be [exported](/spine-export#JSON) to JSON with `Nonessential` checked and then imported again using `Scale` to change the size of the skeleton. The new project would then use images with a different size.

## New project

When checked, the data will be imported into a new project.

When unchecked, the data will be imported into the current project and more options appear.

![](/img/spine-user-guide/import/import-data-existing.png)

### Create a new skeleton

When checked, the data is imported into the current project as a new skeleton.

### Import into an existing skeleton

When checked, the data is imported into the chosen skeleton in the current project. This imports bones, slots, skins, and attachments, but not animations. It is primarily for importing data from [scripts](/spine-images#Scripts). To import animations into an existing skeleton, use [project import](/spine-import#Animation).

### Existing attachments

If the skeleton already contains an item from the data:
* When `Ignore` is checked, it is left as is. This preserves any changes that may have been made to the item.
* When `Replace` is checked, it is replaced with the item from the data.

## Nonessential data

When JSON or binary data is exported and the [Nonessential data](/spine-export#Nonessential-data) setting is checked, extra information is exported which is not normally used at runtime. If the data is later imported back into the Spine editor, that extra information is used to configure the imported skeleton.

If JSON or binary data is exported without `Nonessential data` being checked and is later imported back into the Spine editor, then the import will succeed but some information may be lost.

For example, the color of a bounding box is not normally needed at runtime, so it is only exported when `Nonessential data` is checked. If that exported data is imported back into the Spine editor, the bounding box will have a default color.

For mesh attachments, the manual (orange) [edges](/spine-meshes#Edges) inside the mesh hull are nonessential data. If `Nonessential data` is not checked when the mesh is exported and that exported data is imported back into the Spine editor, the mesh will not have any manual edges. The triangulation of the mesh from when it had manual edges is preserved. If [edit mesh](/spine-meshes#Edit-Mesh) is used to modify the mesh, a new triangulation will be computed.

[Next: Import PSD](/spine-import-psd)
[Previous: Texture packing](/spine-texture-packer)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-keys.md
## Title: Keys - Spine User Guide
## URL: http://esotericsoftware.com/spine-keys
---

# Keys

Animating in Spine is done by setting "keys". Keys define the start and end times and values of a transition. For any time between the keys, the value is interpolated. The art of animating a skeleton comes down to the poses defined by the keys and the times for the keys on the timeline.

# Animations

Before keys can be set, be sure you are in animate mode and that you have an animation active by setting its visibility dot in the tree view, or by selecting it in the [animations view](/spine-animations-view).

![](/img/spine-user-guide/key-frames/animation-visible.png)

A new animation can be created by selecting the `Animations` node in the tree and clicking `New...` `Animation`.

## Folders

Animations can be organized into folders. To create a folder, select an animation and click `New...` `Folder`. Animations can be moved between folders by dragging them.

![](/img/spine-user-guide/key-frames/animation-folder.png)

In exported skeleton data, folder names are prepended to the animation name to create the final name used in the Spine Runtimes. For example, if the folder `emotes` has an animation `wave`, then the animation name at runtime is `emotes/wave`.

# Timeline

In animate mode, the skeleton's pose comes from the current timeline position and the animation's keys. The timeline is shown on the graph, dopesheet, timeline, and audio views.

![](/img/spine-user-guide/dopesheet/timeline.png)

<callout>If you can't find the key causing the orange vertical line at the end of the animation, likely it is a deform key for a skin attachment or a bone is hidden. Check `Show all skin attachments` in the [tree settings](/spine-tree#View-settings) or press `ctrl+H` (`cmd+H` on Mac) for `Show All Bones/Slots`.</callout>

Once keys are set they will appear below the timeline in the [graph](/spine-graph) or [dopesheet](/spine-dopesheet) views. Orange diamonds on the timeline indicate which frames have at least one key. An orange vertical line marks the key with the highest frame, which determines the animation's duration.

Similar to panning in the viewport, dragging with the right mouse button pans the timeline left and right or up and down.

Scrolling the mouse wheel over the timeline zooms the timeline in or out. The zoom slider at the bottom left of the dopesheet indicates the current zoom level and can be dragged. To the right of the zoom slider is the `Zoom Keys` button that zooms the timeline so all keys are visible.

![](/img/spine-user-guide/dopesheet/zoom.png)

## Timeline position

The timeline position is indicated by a cyan vertical line. The timeline position can be set by left clicking or dragging. Dragging in the timeline is called "scrubbing" and is a quick way to see how the skeleton's pose changes over time. Hold `shift` to disable frame snapping (see [Frames](#Frames) below).

![](/img/spine-user-guide/key-frames/timeline-position.png)

When [repeat](#Repeat) is enabled and the timeline is scrubbed past the last frame, the position will loop back to the first frame, but only if the scrubbing started before the last frame. This allows scrubbing to be used on a looping animation. If this behavior is not desired then either begin scrubbing after the last frame or disable repeat.

## Frames

The timeline is divided into units of time called "frames". Frames make it easier to choose a discrete position in time and to set multiple keys at the exact same time. By default the timeline uses 30 frames per second, but this can be changed in the [playback view](/spine-playback#Timeline-FPS).

<callout>Sometimes an animation looks good on every frame, but during playback the interpolation between frames is undesirable.</callout>

Frames exist only for convenience. During playback the timeline position moves between frames (unless [interpolation](/spine-playback#Interpolated) is disabled). Playback can be done at a higher or lower frame rate than the timeline shows.

## Frame snapping

Hold `shift` when clicking or scrubbing the timeline to disable frame snapping and set the timeline position between frames. This allows you to see the animation interpolate smoothly, as it does when played, and to set keys between frames, if needed.

Fractional frames can also be used for a very short transition. For example, a bone could have a translate key on frame 15, then another key on frame 15.01.

![](/img/spine-user-guide/key-frames/non-integer.png) 

## Repeat

When disabled, playback continues past the end of the animation.

When enabled, playback starts over at frame 0 when it reaches the the highest frame that has a key. When multiple skeletons have an active animation, the highest frame with a key out of all of them is used.

Repeat is stored per animation, but it is not exported in JSON or binary data.

# Setting keys

<callout>When unkeyed changes are lost by setting a new timeline position, they can be recovered at the new timeline position using undo. This is helpful if the changes were initially made on the wrong frame.

If there is a change to redo when the timeline position changed, then the pose cannot be recovered this way.</callout>

When [auto key](#Auto-key) is not enabled and changes are made to a skeleton in animate mode, they are not automatically stored in the animation as keys. If the timeline position is changed, the unkeyed changes are lost. To keep the changes, they need to be keyed by clicking the key button for each  property that was changed. Alternatively, the `Key Edited` hotkey can be used to key all changed properties by pressing `K` on your keyboard.

The color of a property's key button is green if there is no key at the current frame, orange if a change has been made but not yet keyed, and red if there is a key at the current frame for that property.

## Auto key

When `Auto Key` is enabled on the [main toolbar](/spine-tools#Tools), a key will be set automatically any time a change is made. This is very convenient and it is common to have auto key enabled all the time. However, care must be taken not to accidentally create unwanted keys.

![](/img/spine-user-guide/key-frames/autokey.png)

## Key shown

The `Key Shown` button on the graph and dopesheet toolbars sets keys for all the curves shown in the graph or all the rows shown in the dopesheet. This can also be done using the hotkey `ctrl+shift+L` (`cmd+shift+L` on Mac).

![](/img/spine-user-guide/key-frames/key-shown.png)

Keying all the properties that already have keys results in keys that make up the current pose. This is very useful because those keys can then be moved to another frame to achieve the same pose there.

# Keyable properties

The following sections list all the properties that can be keyed in Spine and where to find the key buttons.

## Bone transforms

<callout>When typing a [rotation value](/spine-tools#Rotate-tool) larger than 360 degrees, make sure the `Local` or `Parent` axes are selected. When `World` is selected, you are setting the world direction that the bone points, so rotation is limited to 0-360.</callout>

A key for rotation, translation, scale, or shear is set by clicking the key button next to the numeric input for the respective tool in the main toolbar.

![](/img/spine-user-guide/key-frames/keys.png)

Additionally, when a bone has any unkeyed changes for rotation, translation, scale, or shear then an orange key button appears next to the bone in the tree. Clicking this button creates a key for the unkeyed transform changes.

![](/img/spine-user-guide/key-frames/bone.png)

Rotation, scale, and shear key values are stored using `Local` [axes](/spine-tools#Axes). Translation key values are stored using `Parent` axes.

### Setup pose

Unlike other types of keys, the key values for bone transforms are stored relative to the setup pose. If the setup pose is changed, the bone transforms in animation poses will also change.

### Separate X and Y

By default, each translate, scale, and shear key for a bone sets both X and Y. This is sufficient for many animations and reduces the number of timelines shown in the dopesheet and graph. It is also slightly more efficient, as there are fewer timelines that need to be applied at runtime.

For animations that need it, X and Y can be keyed separately by checking the `Separate` checkbox for a bone in the tree properties. Once separated, X and Y for the bone will show up separately in the graph and dopesheet for the current animation.

![](/img/spine-user-guide/bones/separate.png)

### Transform inheritance

To key the [transform inheritance](/spine-bones#Transform-inheritance), click the key button next to inherit in the tree.

## Slot attachment

<callout>Visibility dots in the tree for [bones](/spine-bones#Hiding-bones) and [slots](/spine-slots#Hiding-slots) are only for hiding the bones and slots in the editor to reduce clutter. Hiding bones and slots is not keyable and does not affect exported data.</callout>

To set which attachment is visible for a slot, click the visibility dot to hide or show the desired attachment in the tree. To key the slot's attachment visibility, click the key button next to the slot in the tree, shown orange here:

![](/img/spine-user-guide/key-frames/attachment.png)

Frame-by-frame animation can be achieved by keying the slot attachment so a different image is shown every few frames. See the frame-by-frame [demo](/spine-demos#Spine-with-frame-based-animation) or [example projects](/spine-examples#Frame-by-frame) for usage examples. Starting with Spine 4.1, region and mesh attachments have a `Sequence` checkbox for easier frame-by-frame animation.

## Slot color

To key the [slot color](/spine-slots#Color), click the key button next to color button in the tree.

![](/img/spine-user-guide/key-frames/color.png)

### Separate color and alpha

By default, each color key for a slot sets both color (RGB) and alpha (A). This is sufficient for many animations and reduces the number of timelines shown in the dopesheet and graph. It is also slightly more efficient, as there are fewer timelines that need to be applied at runtime.

For animations that need it, color and alpha can be keyed separately by checking the `Separate` checkbox for a slot in the tree properties.

![](/img/spine-user-guide/slots/separate.png)

Once separated, color (RGB) and alpha (A) timelines for the slot are shown separately in the graph and dopesheet for the current animation. Also, two color buttons appear for the [slot color](/spine-slots#Color). The left button shows the color with alpha and allows the alpha to be keyed. The right button shows the opaque color and allows the color to be keyed. Clicking either button opens the same slot color dialog which can change either the alpha, color, or both.

![](/img/spine-user-guide/slots/separate-buttons.png)

## Draw order

The key button next to the `Draw Order` node in the tree will set a key for the current draw order. See [draw order](/spine-slots#Draw-order) for more information.

![](/img/spine-user-guide/key-frames/draworder.png)

## Events

The key buttons for setting [event](/spine-events) keys are next to each event in the tree. The event's integer, float, string, volume, and balance properties are keyed together.

![](/img/spine-user-guide/key-frames/event.png)

The event's properties can be changed before setting a key. This can reduce the number of events needed. For example, you could have a single `particles` event and use the string value of each key for the name of the particles to show at runtime.

## Sequence keys

To set a sequence key for the region or mesh attachment, click the key button next to the sequence field in the attachment properties in the tree. 

Sequence options include:

* `Hold` holds the current frame.
* `Once` plays the sequence once.
* `Loop` plays the sequence on a loop.
* `Pingpong` plays the sequence until the end, then plays it in reverse. 
* `Once reverse` plays the sequence once in reverse.
* `Loop reverse` plays the sequence on a loop in reverse.
* `Pingpong reverse`  plays the sequence in reverse until the beginning, then plays it forward until the end.
* `FPS` sets the Frames Per Second at which to change to the next attachment.
* `Frame` sets the current frame to display of the sequence.

See [sequence](/spine-regions#Sequence) for more information.


## Deform keys

<callout>Setting a deform key is known in Spine as "keying deformation". In other software it is sometimes called "free form deformation".</callout>

To set a deform key for the vertex positions of a mesh, path, bounding box, or clipping attachment, click the key button next to attachment in the tree.

![](/img/spine-user-guide/key-frames/mesh.png)

Generally [weights](/spine-weights) should be preferred and deform keys used only sparingly for these reasons:

* Keying bones to deform using weights requires very little animation data.
* Deform keys can significantly increase the size of the animation data, especially when combined with weights. Each deform key stores a vertex position for every bone that affects each vertex (which is the number of [vertex transforms](/spine-meshes#) the attachment requires). This is especially a problem if [prune](/spine-weights#Prune) is not used.
* While both deform keys and weights can be used for [linked meshes](/spine-meshes#Linked-meshes), bones animated for weights can also be used for any other attachments.
* All vertices for an attachment are keyed together. This can make it difficult to animate different parts of the same attachment using deformation, requiring the deform keys to be set using [straight ahead](/spine-animating#Straight-ahead).
* If a mesh needs more vertices added later, the new vertices will not be deformed. Every deform key will need to be visited and the new vertices moved. When using weights, no extra effort is needed to add new vertices.
* While vertices can be rotated with the `Rotate` tool, interpolation between deform keys translates vertices in a straight line from one key to the next.
* When keying deform, it is not clear what the key does. When keying bones to deform a mesh via weights, the bones have names and it's easier to understand what the keys are doing.

#### Deform highlight

In animate mode, individual vertices that have been translated are shown in pink. Hold `ctrl` and double click a vertex to select all the deformed or undeformed vertices.

![](/img/blog/3.8-released/deformed-vertices.png)

## IK constraints

To set a key for an [IK constraint](/spine-ik-constraints), click the key button next to the IK constraint in the tree. The IK constraint's mix, softness, bend direction, compress, and stretch properties are keyed together.

![](/img/spine-user-guide/key-frames/ik.png)

## Transform constraints

To set a key for a [transform constraint](/spine-transform-constraints), click the key button next to the transform constraint in the tree. The transform constraints's rotate, X, Y, scale X, scale Y, and shear Y mixes are key together.

![](/img/spine-user-guide/key-frames/transform-constraint.png)

## Path constraints

To set a key for a [path constraint](/spine-path-constraints), click the key button next to spacing, position, or mixes for the path constraint in the tree properties. When keying the path constraint's mixes, the rotate and translate mixes are keyed together.

![](/img/spine-user-guide/key-frames/path-constraint.png)

When keying a path's position for a path that is not [closed](/spine-paths#Closed), sometimes it is desired to change the position from 0 to 100, then immediately from 0 to 100 again. This can be done using [fractional frames](/spine-keys#Frames). For example, set keys at frames 0, 30, 30.01, and 60 for positions 0, 100, 0, and 100.

# Manipulating keys

The [dopesheet](/spine-dopesheet) and [graph](/spine-graph) views provide toolbar buttons to manipulate keys.

## Clipboard buttons

![](/img/spine-user-guide/dopesheet/copy-paste-keys.png)

From left to right:

* `Copy` Copies the selected keys to the clipboard. Copy can also be performed by pressing `ctrl+C` (`cmd+C` on Mac).
* `Cut` Copies the selected keys to the clipboard and deletes them. Cut can also be performed by pressing `ctrl+X` (`cmd+X` on Mac).
* `Delete` Deletes the selected keys. Delete can also be performed by pressing `Delete` on the keyboard or by double clicking a key.
* `Paste` Pastes the last copied keys at the current timeline position. Paste can also be performed by pressing `ctrl+V` (`cmd+V` on Mac).

Bone transform, color, slot attachment, and deform keys can be pasted to a different bone, slot, or attachment by selecting it before pasting.

## Shift

![](/img/spine-user-guide/dopesheet/key-shift.png)

When `Shift` is enabled and a key is moved, all keys after the moved key are also moved. `Shift` can also be used by holding `alt` (`option` on Mac) while dragging a key. This can be useful when adjusting the timing between keys without affecting the timing of keys after the key that is moved.

## Offset

![](/img/spine-user-guide/dopesheet/key-offset.png)

The `Offset` button is used to move keys for looping animations, wrapping the keys back to the start if they pass the end of the animation. This makes it easy to adjust [follow through and overlapping action](https://youtu.be/ECM2WIN3cgY?t=202), which are important principles that make animations look natural.

When enabled and keys are moved past the end or beginning of the animation, the keys will wrap to stay within the animation's duration. Also, keys are set at the beginning and end of the animation to keep the looped movement.

![](/img/spine-user-guide/dopesheet/offset-gif.gif)

`Offset` can also be activated by holding `ctrl+alt` (`cmd+alt` on Mac) while dragging keys in the dopesheet or graph.

To use `Offset`, the first and last keys must be the same. This is almost always already the case for looping animations.

When `Offset` is used, it creates a new key where the animation loops. If the same keys are moved again, the original keys are remembered and offsetting is done again without creating a second new key. However, once other keys are selected then the original keys are forgotten and using `Offset` again will cause a second new key to be created.

[Loop](#Loop) can be used to control the start and end frames used for `Offset`, otherwise frame 0 and the highest frame for the animation are used.

# Clean Up

<callout>Multiple animations can be selected in the tree and `Clean Up` will process all of them at once.</callout>

The `Clean Up` button in the tree properties for an animation deletes all unnecessary keys. These are keys which can be safely deleted without affecting the poses in the animation. This includes keying the same value multiple times in a row, keying the same values as the setup pose, and many other scenarios.

![](/img/spine-user-guide/key-frames/clean-up.png)

Often it is convenient to set keys liberally when designing an animation, then use `Clean Up` afterward. Having fewer keys makes it easier to work on an animation and reduces the size of the exported animation data, especially when deform keys are removed. Also, fewer keys makes applying the animation at runtime use slightly less CPU.

While `Clean Up` is usually safe to use, there may be some cases where it removes keys that are needed. The most common scenario is when an animation is intended to be applied on a higher [AnimationState](/spine-applying-animations/#AnimationState-API) track. In that case, keys may be needed to override animations from lower tracks. When an animation has `Layered` checked then `Clean Up` will not remove those keys.

There may be other, rare scenarios such as when [AnimationState](/spine-applying-animations/#AnimationState-API) is not used at runtime or if runtime code is used to find a key and change its value. In those cases it may be better to not use `Clean Up`.

# Hands on

Now is a great time to explore firsthand how keying works in Spine. If you haven't yet set up your own skeleton, you can open one of the example projects and create a new animation by clicking the `Animations` node in the tree, then `New...` `Animation`. In animate mode, pose the skeleton at frame 0 and set keys (for example, by pressing `K` or enabling [auto key](#Auto-key)). Next, click frame 30, pose the skeleton differently, and set keys. Scrub the timeline by dragging or click play to see your animation in action.

# Video

Part 1:
[youtube:8ZvdFaPwMB0?list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

Part 2:
[youtube:P13n2rhQGLE?list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[Next: Animating](/spine-animating)
[Previous: Tools](/spine-tools)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-mesh-tools.md
## Title: Mesh Tools view - Spine User Guide
## URL: http://esotericsoftware.com/spine-mesh-tools
---

# Mesh Tools view

The mesh tools view provides "soft selection" for vertices. When the selected vertices are transformed, other vertices within the soft selection size are also transformed. This can help when manpulating many vertices or to move vertices with a gradual fall-off. It works with mesh, path, bounding box, and clipping attachment vertices.

![](/img/spine-user-guide/mesh-tools/mesh-tools.png)

# Size

The size slider controls how far the soft selection influences neighboring vertices. As always, selected vertices are drawn cyan and unselected vertices are drawn gray. Vertices affected by soft selection are drawn between cyan and dark blue, to indicate how much they are influenced based on the [feather slider](#Feather).

Vertices affected by soft selection are transformed by the `Rotate`, `Translate`, and `Scale` tools. Their weights are also manipulated by the [weights view](/spine-weights).

When adjusting the size slider, a circle is drawn in the viewport to show the size.

![](/img/spine-user-guide/mesh-tools/size.png)

# Feather

The feather slider controls the percentage of the size used as the "feathering" or fall-off of the soft selection. At 0, all vertices within the soft selection size are fully selected. At higher values, vertices within that percentage of the size are fully selected and vertices outside of that are partially selected.

When adjusting the feather slider, a circle is drawn in the viewport to show the size with another circle inside to show the feathering.

![](/img/spine-user-guide/mesh-tools/feather.png)

# Hull vertices

When unchecked, for mesh attachments the mesh hull is not affected by soft selection. This can be useful to manipulate the inside of a mesh to fake 3D effects, without changing its shape.

![](/img/blog/3.6-meshtools.gif)

# Video

[youtube:yMefmevOfNc&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b?modestbranding=1&rel=0]

[Next: Metrics view](/spine-metrics)
[Previous: Graph view](/spine-graph)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-meshes.md
## Title: Mesh attachments - Spine User Guide
## URL: http://esotericsoftware.com/spine-meshes
---

# Mesh attachments

<callout>Mesh attachments are not available in Spine Essential.</callout>

A mesh [attachment](/spine-attachments) is a polygon that is textured with an image. A polygon is defined inside the image, then its vertices can be manipulated to bend and deform the image. Meshes also have the advantage that the polygon can exclude parts of an image from rendering, which can [improve performance](#Hull-size).

![](/img/spine-user-guide/meshes/mesh.png)

Meshes can be deformed automatically when bones are transformed by using [weights](/spine-weights).

Mesh vertex positions can be [keyed](/spine-keys#Deform-keys) in animations.

See the mesh attachment [example projects](/spine-examples#Meshes) and [tips](/spine-tips#Meshes) for usage examples.

# Setup

To create a mesh, first create a [region attachment](/spine-regions), then check `Mesh` in the region attachment's tree properties.

![](/img/spine-user-guide/meshes/convert.png)

The region attachment is converted to a mesh attachment with 4 vertices, one in each corner. The mesh vertices can be modified using [edit mode](#Edit-mode).

![](/img/spine-user-guide/meshes/vertices.png)

# Properties

![](/img/spine-user-guide/meshes/properties.png)

See the [common attachment properties](/spine-attachments#Common-properties) for the `Select`, `Export`, `Name`, `Color`, and `Set Parent` properties.

## Image path

When the image path is blank, the mesh attachment's name is used to find the image. When the image path is set, it is used instead of the mesh attachment's name. See [image file lookup](/spine-images#Image-file-lookup) for more information.

## Mesh

When unchecked, the mesh attachment is changed back into a [region attachment](/spine-regions#Mesh).

## Wireframe

When checked, the meshes vertices and edges are drawn even when the mesh is not selected. This can be helpful for considering the mesh vertices when placing bone origins.

## Sequence

See [sequence](/spine-regions#Sequence) for more information.

## Edit Mesh

Clicking the `Edit Mesh` button enters [edit mode](#Edit-mode), which is for modifying the mesh's vertices.

## Freeze

The `Freeze` button sets rotation to 0 and scale to 1 for the current vertex positions.

This is possible because a mesh does not really have a rotation or scale. It has only a number of vertices, each of which has a position. Spine provides rotation and scale values for convenience, to allow manipulation similar to other attachments. The rotation and scale are adjusted when the `Rotate` or `Scale` tools are used on the entire attachment.

A mesh doesn't have translation, either. The translation values shown are the centroid of the hull vertices.

## Reset

<callout>This should not be confused with the [Reset](#Reset-vertices) button in edit mode.</callout>

The `Reset` button moves the mesh's vertex positions to match the UVs, so the mesh is not deformed. The vertices will match the UVs as defined in edit mode with `Deformed` unchecked. Since the vertices are given new positions, the mesh may shift position if it was deformed. All weights are removed from the mesh and any deform keys in animations are deleted.

When vertices are added, removed, or translated in edit mode, the vertices outside of edit mode may not be in the desired positions. `Reset` can be used to remove any deformation from the mesh.

# Edit mode

Edit mode allows for creating, modifying, and deleting the mesh's vertices.

![](/img/spine-user-guide/meshes/edit-mesh.png)

<callout>The [outline view](/spine-outline-view) can be used to see the entire skeleton while editing a mesh.</callout>

The [Edit Mesh](#Edit-Mesh) button enters edit mode. It can be exited at any time by clicking the `Edit Mesh` button again, by closing the edit mode dialog, or by pressing `spacebar` or `escape`.

Right click switches between the `Modify`, `Create`, and `Delete` tools.

## Modify tool

The `Modify` tool allows existing vertices to be moved. Double click to delete a vertex.

## Create tool

The `Create` tool allows new vertices to be created by clicking and new [edges](#Edges) to be created by dragging. Hold `shift` to disable snapping to a vertex. When dragging to create an edge, hold `shift` to snap vertically or horizontally. Double click to delete a vertex.

## Delete tool

The `Delete` tool allows vertices or edges to be deleted by clicking. Multiple vertices can be selected by holding `ctrl` (`cmd` on Mac) or dragging to box select.

## New vertices mode

The `New` button deletes all vertices and enters the new vertices mode. This mode allows the hull of the mesh to be defined by clicking to create new vertices. Vertices can also be translated by dragging or deleted by double clicking. To complete the mesh hull, exit the new vertices mode by clicking the first vertex to close the hull or by clicking the `New` button again.

![](/img/spine-user-guide/meshes/new-vertices.png)

The new vertices mode allows the mesh hull to be defined quickly. Alternatively, the `Create` tool can be used to create vertices and edges, then the `Delete` tool used to remove any unwanted vertices or edges.

## Reset vertices

<callout>This should not be confused with the [Reset](#Reset) button in the tree properties.</callout>

The `Reset` button removes all vertices and replaces them with 4 vertices, one in each corner. All weights are removed and any deform keys in animations are deleted. The `Reset` button is useful to start over.

## Generate

The `Generate` button adds new vertices to the mesh at positions that will benefit deformation the most. All weights are removed and any deform keys in animations are deleted.

`Generate` can be clicked multiple times to add more and more vertices. Existing vertices are not moved, so `Generate` can be used to automatically fill in a mesh after manually adding vertices around important features in the image.

If a mesh has vertices in all 4 corners, such as after clicking `Reset`, then `Generate` will create a grid with vertices arranged in rows and columns. Clicking `Generate` multiple times will create an increasingly dense grid of vertices.

## Trace

The `Trace` button creates a mesh hull automatically. All weights are removed and any deform keys in animations are deleted.

![](/img/spine-user-guide/meshes/trace.png)

A number of settings can be configured to affect how the mesh hull is created:

* `Detail` controls how many vertices are used.
* `Concavity` controls the priority for placing vertices into concave areas.
* `Refinement` controls the time and effort spent finding an optimal solution.
* `Alpha threshold` causes pixels which have an alpha value below the threshold to be ignored.
* `Padding` adds space between the image and the hull.

`Refresh` repeats creating the hull using the same settings. The hull is created slightly differently each time, so it can be useful to create it a few times and choose the hull that best matches your needs.

## Triangles

When checked, dashed lines are drawn between vertices to show how the mesh is triangulated. The triangulation determines how the mesh deforms. Seeing the triangles helps with deciding where [edges](#Edges) are needed.

## Dim

When checked, the mesh image is dimmed so the vertices, edges, and triangles can be seen more easily.

## Isolate

When checked, other attachments are not drawn so the mesh can be seen more easily.

## Deformed

When checked, the mesh is shown as it looks outside of edit mode. When a vertex is translated, it changes both the vertex position outside of edit mode and the texture coordinates. The vertex positions are limited to the image bounds and gray lines appear when near the boundary.

<callout>The [outline view](/spine-outline) can be used to visualize the mesh while changing the texture coordinates.</callout>

When unchecked, the entire mesh image is shown without any deformation. Vertices are shown at the position on the image that will used for the vertex when the mesh is drawn. This is known as the "texture coordinates" or UVs. When a vertex is translated, it changes the texture coordinates but does not change the position of the vertex outside of edit mode.

![](/img/spine-user-guide/meshes/uv1.png)

![](/img/spine-user-guide/meshes/uv2.png)

![](/img/spine-user-guide/meshes/uv3.png)

If this is undesirable, [Reset](#Reset) can be used outside edit mode so the vertex positions match the texture coordinates.

# Edges

In addition to vertices, a mesh also has "edges" which are connections between vertices. Spine automatically handles the edges around the mesh hull, shown in cyan. Inside the hull, Spine automatically connects all the vertices with edges, shown as dashed gray lines in edit mode when [Triangles](#Triangles) is checked.

![](/img/spine-user-guide/meshes/edges-triangles.png)

The edges between the vertices determine how the mesh will deform when vertices are translated. The [Create tool](#Create-tool) in edit mode can be used to create edges manually, shown in orange.

![](/img/spine-user-guide/meshes/edges-orange.png)

<callout>It is unnecessary to create manual edges (orange) over the edges Spine creates automatically (gray). Doing so does not change the mesh triangulation, but may make selection easier by clicking the edge or using [edge loop selection](#Edge-loop-selection).</callout>

Vertices and edges can be added inside the mesh around features on the image to control how they are deformed. The automatically computed edges (gray) will never cross a manual edge (orange), so specifying edges manually provides complete control over how vertices are connected.

## Edge examples

This example shows how to control mesh deformation by adding vertices and edges. We have made the hull for spineboy's head and now want to make the nose stretch.

![](/img/spine-user-guide/meshes/triangles1.png)

![](/img/spine-user-guide/meshes/triangles2.png)

When a vertex is translated, only the triangles that include the vertex are deformed. This stretches the tip but not the base of the nose and also stretches some of the cheek. By adding a new vertex, we get different triangles and the mesh will deform differently.

![](/img/spine-user-guide/meshes/triangles3.png)

![](/img/spine-user-guide/meshes/triangles4.png)

Above, a new vertex was added at the base of the nose, resulting in different triangles. Now the vertex we are translating belongs to two triangles. When the vertex is translated, it deforms both triangles. This stretches the entire nose, but also a lot of the cheek. Another vertex is needed to stop the cheek from deforming.

![](/img/spine-user-guide/meshes/triangles5.png)

![](/img/spine-user-guide/meshes/triangles6.png)

Above, a new vertex was added under the nose. The entire nose is now contained within two triangles, but translating the vertex deforms only one of them. To fix this, in edit mode we need to create an edge by selecting the [Create tool](#Create-tool) and dragging between the vertices. 

![](/img/spine-user-guide/meshes/triangles7.png)

![](/img/spine-user-guide/meshes/triangles8.png)

The new edge (orange) causes the nose triangles to connect differently and the nose can now be deformed without affecting the rest of the head.

## Edge loop selection

If a mesh edge is selected while `shift` is held, edge loop selection is performed. This selects the edge and all neighboring edges in a line. While holding `shift`, `ctrl` (`cmd` on Mac) can also be held to add to the current selection.

# Vertex placement

There are many factors to consider when choosing where to place mesh vertices. Besides the information below, our series of blog posts on meshes provides a lot of great tips for designing your meshes:

* [Vertex placement](/blog/Mesh-creation-tips-vertex-placement)
* [A taxonomy of meshes](/blog/A-taxonomy-of-meshes)
* [Mesh weight workflows](/blog/Mesh-weight-workflows)

## Hull size

<callout>[Trace](#Trace) can place vertices as close as possible to borders inside the image, without cutting off any pixels.</callout>

The mesh hull should exclude as much blank space as possible. For example, a tree image may have a lot of blank space on either side of the trunk. Even if the tree doesn't need to be deformed, using a mesh to exclude pixels can be beneficial.

Pixels outside the hull are not drawn at all and do not count against the [fill rate](/spine-metrics#Fill-rate). This can improve performance for a game that is fill rate limited, especially for large images with a lot of blank space.

When [texture packing](/spine-texture-packer) using polygons, mesh texture atlas regions can be packed very tightly, fitting more images in a single texture atlas page. Even when not packing using polygons, whitespace stripping can remove all pixels outside the mesh hull.

### Hull edges

<callout>MSAA is not needed if you never use a mesh hull to cut off nontransparent pixels.</callout>

If the mesh hull is used to cut off nontransparent pixels, the resulting edge will have aliasing. This means pixels along the edge are either shown or not shown &ndash; the edge will jagged, not smooth. To get smooth edges in this case, multisample anti-aliasing (MSAA) can be used when the mesh is rendered. This can be enabled for the Spine editor in the [settings dialog](/spine-settings#Multisample-anti-aliasing) and for image or video exports on the [export dialog](/spine-export#Multisample-anti-aliasing). To get smooth edges at runtime, MSAA needs to be configure for your game toolkit.

Nontransparent pixels at the edge of an image's bounds may also cause aliasing, even though the pixels are not being cut off. This occurs in the Spine editor because it loads individual images and pixels against the image edge don't have transparent pixels next to them for filtering to smooth. At runtime, when loading from a texture atlas there is usually at least 1 pixel of transparent space around the image, so this aliasing will not occur.

### Holes

Meshes can be concave but cannot have holes. If a hole is needed, usually it is sufficient to use transparent pixels in the mesh's image. For example, the image for a head mesh can use transparent pixels for the eye holes.

<callout>Using two meshes is done most easily by first making one mesh that encompasses the whole image and has vertices around the inside of the hole. Next, duplicate the mesh and modify both meshes by deleting vertices until each makes up one half around the hole.</callout>

If the hole needed is large, it may be undesirable to draw a large number of transparent pixels, which can negatively affect the [fill rate](/spine-metrics#Fill-rate). Also, a large image with a lot of blank space can take up a lot of room in the [texture atlas](/spine-texture-packer). In that case two meshes can be used, one for each half of the image around the hole.

## Vertex count

Generally the number of vertices in a mesh should be kept to a minimum to reduce CPU usage. The position of each vertex must be computed by the CPU each frame. This is a fast operation, but many skeletons on screen at once with many meshes, each having many vertices, can add up to thousands of positions that need to be computed.

When using [weights](/spine-weights), each bone affecting a vertex adds an additional [vertex transform](/spine-metrics#Vertex-transforms). For example, a mesh with 100 vertices requires 100 vertex transforms. If the same mesh has 2 bones affecting every vertex, it requires 200 vertex transforms. If a mesh is bound to many bones and [smoothing](/spine-weights#Smooth) is used to spread the weights out, it can greatly increase the number of vertex transforms required. Use [prune](/spine-weights#Prune) to remove unnecessary weights and limit the number of bones that can affect a vertex.

## Deformation

Where vertices are placed and how they are connected by [edges](#Edges) determines how the mesh deforms. Most or all deformation should be done using [weights](/spine-weights). Using [deform keys](/spine-keys#Deform-keys) should be avoided or kept to a minimum.

# Transform tools

Mesh vertices can be moved outside of edit mode by using the transform tools. The entire mesh can be rotated, translated, and scaled like any other attachment.

![](/img/spine-user-guide/meshes/rotate.png)

Individual vertices can be translated with any transform tool by dragging, which will deform the image. Multiple vertices can be selected by holding `ctrl` (`cmd` on Mac), then clicking or dragging to box select. The selected vertices can be deselected by pressing `spacebar` or `escape`, or by clicking in any empty space.

![](/img/spine-user-guide/meshes/multiple-vertices.png)

The origin used for rotation or scaling can be changed. Mouse over the small crosshair at the center of the `Rotate` or `Scale` tool until a circle appears, then drag the origin to the desired position. The origin will automatically snap to vertices.

![](/img/spine-user-guide/meshes/origin.png)

Moving vertices in setup mode changes the deformation for the setup pose. Moving vertices in animate mode is done to set [deform keys](/spine-keys#Deform-keys). Deform keys should generally be avoided and [weights](/spine-weights) used instead.

Rotation and scale are only used to move the vertices. The amount of rotation and scale used is not stored in deform keys. Only the vertex positions are stored and interpolation between deform keys always moves the vertices in a straight line.

# Image resize

If an image file a mesh uses is made larger outside of Spine, Spine will ask if you would like to scale the texture coordinates to keep the image contents the same size.

![](/img/spine-user-guide/meshes/resized-dialog.png)

This is useful when whitespace has been added to any of the edges of the image. When that is the case, answer `Yes` to adjust the texture coordinates so the image contents are kept the same size, centered by how much larger the image is. Afterward, if the whitespace was not added evenly to all sides of the image, the texture coordinates may need to be manually adjusted in edit mode. Select all vertices by holding `ctrl` (`cmd` on Mac), then drag to box select. Next, use the [Modify tool](#Modify-tool) to move the vertices to the correct position.

![](/img/spine-user-guide/meshes/image-resized.png)

If the image was made larger because its contents need to be bigger, keeping the texture coodinates at the old size may not be desirable. In that case, answering `No` will not modify the mesh. Since the texture coordinates are stored normalized, they will scale up or down when the image size changes.

# Linked meshes

It is common to need to reuse a mesh with a different image. For example, you have animated a mesh for a flag and now you want to use various different flag images with the same mesh and animations.

Duplicating the mesh and its deform keys isn't ideal because it results in two separate meshes and sets of keys, so any changes to the mesh or keys need to be made multiple times.

Linked meshes provide a better solution to this problem. To create a linked mesh, in the mesh's tree properties click `New...` `Linked Mesh`. The linked mesh shares its mesh structure with the source mesh: vertices, edges, texture coordinates, and weights. Any changes made to these for the source mesh will also affect all its linked meshes.

To indicate that changing a vertex will affect other meshes, the vertices appear with a ring around them:

![](/img/spine-user-guide/meshes/linked-mesh-vertices.png)

To use a different image for the linked mesh, rename it or set an [image path](#Image-path), as normal.

If `Inherit timelines` is checked, then any deform keys for the source mesh will also affect the linked mesh. If `Inherit timelines` is not checked, deform keys for the linked mesh can be set as normal, separately from the source mesh.

![](/img/spine-user-guide/meshes/linked-mesh.png)

Linked meshes must always be under the same slot as the source mesh. Moving the source mesh or any linked mesh to another slot will cause all the others to also be moved.

Linked meshes may be under skin placeholders in different [skins](/spine-skins), as long as they are under the same slot as the source mesh.

# Video

[youtube:76Var_oS8EM&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]
[youtube:3SqxwSN4xPo&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[Next: Bounding box attachments](/spine-bounding-boxes)
[Previous: Region attachments](/spine-regions)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-metrics.md
## Title: Metrics view - Spine User Guide
## URL: http://esotericsoftware.com/spine-metrics
---

# Metrics view

The metrics view provides insight into how the skeletons may perform at runtime.

![](/img/spine-user-guide/metrics/view.png)

The metrics shown are the sum for all visible skeletons.

The animation metrics are only shown in animate mode.

# Skeletons

## Bones

The total number of bones in the skeletons.

Computing a bone's world transform uses the CPU. It is relatively cheap, but can add up with many skeletons on screen that each have many bones. For example, if each skeleton has 30 bones and 50 of these skeletons are on screen at once, bone 1500 world transforms need to be computed.

At runtime, once a skeleton is posed by manipulating the local [bone transforms](/spine-bones#Bone-transforms) (often by applying an animation), the world transforms for each bone are computed ([typical code](/git/spine-runtimes/blob/spine-libgdx/spine-libgdx/src/com/esotericsoftware/spine/Bone.java#L102)). Usually this happens when Skeleton [updateWorldTransform](/spine-api-reference#Skeleton-updateWorldTransform2) is called.

On the desktop, many thousands of bones are generally not a problem. On mobile, more than a couple thousand bones may be an issue. For example, in some tests, a Nexus 4 can handle about 2000 bones before the framerate drops below 60 frames per second.

## Constraints

The total number of constraints in the skeletons.

Computing constraints uses the CPU. The computations are relatively cheap, but can add up with many skeletons on screen that are using constraints.

[IK constraints](/spine-ik-constraints) with 1 bone are quite cheap ([typical code](/git/spine-runtimes/blob/spine-libgdx/spine-libgdx/src/com/esotericsoftware/spine/IkConstraint.java#L138)) while 2 bone IK requires more operations ([typical code](/git/spine-runtimes/blob/spine-libgdx/spine-libgdx/src/com/esotericsoftware/spine/IkConstraint.java#L155), though some code paths are rarely taken).

[Transform constraints](/spine-transform-constraints) don't require many operations, though they are applied for each constrained bone ([typical code](/git/spine-runtimes/blob/spine-libgdx/spine-libgdx/src/com/esotericsoftware/spine/TransformConstraint.java#L98)).

[Path constraints](/spine-path-constraints) require quite a few operations, dependent on how many vertices and constrained bones the path has ([typical code](/git/spine-runtimes/blob/spine-libgdx/spine-libgdx/src/com/esotericsoftware/spine/PathConstraint.java#L95)).

## Slots

The total number of slots in the skeletons.

The number of slots has a negligible impact on performance. Since each slot can have 0 or 1 attachment visible, it indicates the maximum number of attachments that can be visible at any given time.

# Attachments

## Total

The total number of attachments in the skeletons.

The total number of attachments doesn't affect rendering performance and has a negligible affect on load time.

## Visible

The number of visible attachments in the skeletons.

An attachment simply being visible may not affect rendering performance. For example, nothing is rendered for a bounding box attachment.

## Vertices

The number of vertices for all visible attachments.

The number of vertices indicates how much geometry is sent to the GPU.

## Vertex transforms

The number of vertices that are transformed for all visible attachments.

Transforming a vertex uses the CPU. The computations are relatively cheap, but can add up with many skeletons on screen. The [vertex count](/spine-meshes#Vertex-count) and how many bones have [weight](/spine-weights) for each vertex determines the number of vertex transforms.

Similar to bones, attachment vertices need to be transformed from local to world coordinates (typical code: [region attachments](/git/spine-runtimes/blob/spine-libgdx/spine-libgdx/src/com/esotericsoftware/spine/attachments/RegionAttachment.java#L152), [mesh attachments](/git/spine-runtimes/blob/spine-libgdx/spine-libgdx/src/com/esotericsoftware/spine/attachments/VertexAttachment.java#L65)).

## Triangles

The number of triangles for all visible region and mesh attachments.

The number of triangles indicates how many vertex indices are sent to the GPU.

## Area

The number of pixels drawn when the skeletons are drawn at full size. This includes transparent pixels and pixels that are drawn multiple times due to overdraw.

The number of pixels drawn indicates how much GPU fill rate is used to render the skeletons.

## Clipping polygons

The number of convex clipping polygons. If the clipping attachment vertices are concave, they are decomposed into two or more convex polygons.

The best case for performance is when each clipping attachment is convex, resulting in one clipping polygon. Multiple clipping polygons increases the number of clipped triangles. See [clipping performance](/spine-clipping#Performance) for more information.

## Clipped triangles

The number of attachment triangles clipped by the visible clipping attachments.

It is best for performance to clip as few triangles as possible. See [clipping performance](/spine-clipping#Performance) for more information.

## Selection

When one or more attachments are selected, two sets of numbers are shown for some metrics. The numbers before the forward slash are for the selected attachments. The numbers after the forward slash are for all attachments.

![](/img/spine-user-guide/metrics/selected.png)

# Animation

## Timelines

The total number of timelines for the currently active animations.

Applying timelines uses the CPU. Applying a single timeline is relatively cheap, but can add up when many skeletons each have animations applied every frame. Also, multiple animations may be applied to a single skeleton each frame. For example, when running and shooting at the same time, or when animations are mixed for cross fading.

At runtime an animation is made up of a number of "timelines". Each timeline has a list of key values. When an animation is applied, each timeline for the animation is applied. The timeline looks through its list to find the key values for the current animation time, then manipulates the skeleton with those values ([typical code](/git/spine-runtimes/blob/spine-libgdx/spine-libgdx/src/com/esotericsoftware/spine/Animation.java#L506)). Even a timeline that has only 1 key at frame 0 is still applied every time the animation is applied to the skeleton.

# Performance

Performance is interesting because it is either a big problem or not a problem at all. Even the worst application running on terrible hardware doesn't need optimizations as long as the performance is acceptable. The rule is: if improving performance would not be noticeable to the user, then any time spent improving performance is a complete waste. That time is _always_ better spent on things noticeable to the user. In fact, optimizing more than necessary can reduce the quality of your animations and make your software more complex and harder to maintain, so it's important not to optimize needlessly.

This doesn't mean performance should be ignored during development, only that minimal performance considerations should be made as preemptive attempts to avoid performance problems. It's very easy to go too far and waste time, especially when so many variables are involved:

* what hardware the application is running on,
* everything done by the application and game toolkit besides rendering skeletons,
* how the game toolkit and Spine runtime perform rendering,
* how many skeletons are rendered,
* how those skeletons are configured,
* how many pixels are drawn,
* and much more.

When designing Spine animations, it's impossible for animators to take all of this into account and only deliver assets that perform well. Instead, reasonable effort should be made to avoid wasting performance, such as only using the number of mesh vertices required for the desired deformations. Only after a performance problem occurs should additional effort be made to simplify the skeletons.

Performance relies on so many variables that it isn't possible to generalize about which numbers in the metrics view are too high. If you intend to push performance to its limits, you will need to perform your own tests using your actual skeletons and the rest of your application on a variety of hardware to get an idea of the limits in your specific environment. If you aren't pushing the CPU or GPU to its limits, then there is no need to spend time worrying about performance or to sacrifice the quality of your animations.

If a performance problem is encountered, the first step is to identify the bottleneck that has the largest impact on performance, since focusing efforts there results in the largest gains. The most common bottlenecks when rendering Spine skeletons are CPU usage, fill rate, and draw calls.

## CPU usage

When CPU usage is too high, it means your application uses so much CPU that rendering falls below an acceptable frame rate (typically below 60 or 30 frames per second). The most important metrics for CPU usage are bones, timelines, vertex transforms, constraints, and clipping. Any of these can be an issue if used in excess.

Using weights can greatly increase the number of vertex transforms, depending on the [vertex count](/spine-meshes#Vertex-count) and how many bones have [weight](/spine-weights) for each vertex. Using [prune](/spine-weights#Prune) may reduce the number of vertex transforms.

The number of timelines increase the processing needed to apply an animation. Animation [clean up](/spine-keys#Clean-Up) may reduce the number of timelines.

Clipping is [very expensive](/spine-clipping#Performance) and should be avoided whenever possible, such as when the overdraw can be masked by other images. When clipping is used, it should be convex, use as few vertices as possible, and clip as few triangles as possible.

There may be options besides reducing the complexity of your skeletons. If you have many skeletons, it may be acceptable to only update a subset of them each frame, in a round-robin fashion. Another option may be to only animate a small number of skeletons and use those poses to render a larger number of skeletons.

## Fill rate

When GPU fill rate is exhausted, it means you are trying to draw more pixels than the GPU can draw at an acceptable frame rate. Each time a pixel is drawn it counts against the fill rate. This is true even when the pixel is completely transparent or when the same pixel is drawn multiple times (this is called "overdraw"), for example when attachments overlap.

The solution to being fill rate limited is always the same: draw fewer pixels. Meshes can be used to avoid drawing transparent pixels, though this likely means more vertices to transform on the CPU. Completely transparent pixels still use up fill rate, so attachments should be hidden rather than their alpha set to zero. Sometimes art can be constructed in a way to minimize overdraw, for example by using a single, larger image in place of two or more overlapping images.

## Draw calls

Asking the GPU to draw can be an expensive operation because it may need to finish what it is doing before accepting a new drawing task. If asked to draw too many times, the GPU won't be able to complete all of the drawing with an acceptable frame rate.

Most game toolkits batch up as much geometry as possible so the GPU is asked to draw fewer times. Usually a batch needs to be flushed when the GPU needs to draw from a different texture, so a [texture atlas](/spine-texture-packer) is used to reduce texture switches. Using [blending](/spine-slots#Blending) for slots may also cause a batch flush.

[Next: Outline view](/spine-outline)
[Previous: Mesh Tools view](/spine-mesh-tools)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-outline.md
## Title: Outline - Spine User Guide
## URL: http://esotericsoftware.com/spine-outline
---

# Outline view

<callout>The [preview view](/spine-preview) is similar but allows animations to be played rather than showing the current pose.</callout>

The outline view provides a secondary display of the skeleton pose shown in viewport that is not cluttered with bones, the current selection, or the other UI elements that are shown in the viewport.

The outline view is especially useful to see the entire skeleton animating while manipulating bones or attachments in the viewport. It can also be used to see how the skeleton looks while using [mesh edit mode](/spine-meshes#Edit-mode).

![](/img/spine-user-guide/outline/view.jpg)

The outline view works the same as the [viewport](/spine-ui#Viewport). Use the right mouse button or hotkeys to [pan](/spine-ui#Panning). Mouse wheel or use the zoom slider, buttons, or hotkeys to [zoom](/spine-ui#Zooming).

Additionally, clicking in the outline view centers the viewport at that location. An orange rectangle briefly indicates what is shown in the viewport. This can be useful when the viewport is zoomed in, to jump to another viewport position without panning or zooming out, then in again.

# View settings

![](/img/spine-user-guide/outline/view-settings.png)

#### Ghosting

When unchecked, [ghosting](/spine-ghosting) will not be shown in the outline view.

[Next: Playback view](/spine-playback)
[Previous: Metrics view](/spine-metrics)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-path-constraints.md
## Title: Path constraints - Spine User Guide
## URL: http://esotericsoftware.com/spine-path-constraints
---

# Path constraints

<callout>Path constraints are not available in Spine Essential.</callout>

A path constraint adjusts [bone transforms](/spine-bones#Bone-transforms) using a [path](/spine-paths). Bones can be translated along the path and have their rotation adjusted to point along the path.

![](/img/spine-user-guide/path-constraint/pathconstraint.png)

Path constraints can replace translation keys, allowing movement to be defined more easily by using a path. Many other uses involve constraining multiple bones to a path, then controlling the bones by manipulating the path rather than adjusting each bone individually. For example, bones can be spaced evenly along a path or can be scaled up, causing them to appear to grow along the path.

See the path constraint [demo](/spine-demos#Path-constraints), [example projects](/spine-examples#Path-Constraints), and [tips](/spine-tips#Path-Constraints) for usage examples.

# Setup

To create a path constraint, select the bones to be constrained, then click `New...` `Path Constraint` in the tree properties. Next, choose a slot in the tree or an existing path in the tree or viewport.

![](/img/spine-user-guide/path-constraint/setup.png)

The path constraint does not actually target a path, instead it targets a slot. The path constraint will use the path visible for that slot, if any. This provides extra flexibility because a single path constraint can work with multiple paths.

# Properties

![](/img/spine-user-guide/path-constraint/properties.png)

## Bones

This shows the constrained bones. When one bone is constrained, clicking the bones selects it.

When multiple bones are constrained, they are shown in a select box. The order the bones appear along the path can be modified by opening the select box and dragging the bones up or down.

Opening the select box and clicking a bone will select that bone. Right clicking a bone name without opening the select box will select that bone.

Different bones can be chosen by clicking the pencil icon. This clears all the constrained bones and allows new bones to be chosen. The order the bones are chosen determines the order they will appear along the path.

## Target

This property shows the target slot. If the slot has a path visible, it is also shown. Clicking either selects the slot or path.

A different slot can be chosen by clicking the pencil icon, then choosing a slot or path.

## Spacing

<callout>`Length` or `Proportional` are useful when different spacing is needed between each bone.</callout>

Spacing controls how the bones after the first bone are positioned along the path.

* `Length` places each bone using the length of the previous bone. The spacing value is added to the length of each bone.
* `Fixed` places the bones spaced equally using a fixed distance.
* `Percent` places the bones spaced equally using a percentage of the total path length.
* `Proportional` places the bones spaced to take up the entire path when the spacing value is 100. Each bone's length determines the proportion of the total path length used for spacing.

The spacing slider adjusts the spacing value. The spacing value can be [keyed](/spine-keys#Path-constraints).

## Position

Position controls where along the path the bones are positioned.

* `Fixed` places the bones at a fixed distance along the path.
* `Percent` places the bones at a distance along the path equal to a percentage of the total path length.

The position slider adjusts the position value. The position value can be [keyed](/spine-keys#Path-constraints).

If the path is not [closed](/spine-paths#Closed), when the position is before the start (negative) or past the end of the path, the position is determined using a straight line in the direction the start or end of the path is pointing. This is shown as dashed lines when the path is selected.

### Position handle

<callout>The position handle won't be selected if `ctrl` (`cmd` on Mac) is held. This can help to select a knot or handle under the position handle.</callout>

The position handle appears on the path in the viewport when the path is selected.

![](/img/spine-user-guide/path-constraint/position.jpg)

Dragging the position handle changes the position value and can be more convenient than using the position slider.

## Rotate Offset

The rotate offset is added to the rotation computed by the [rotate mix](#Rotate-mix). This is provided for convenience, so bones can point in a different direction without needing to use an extra bone to do so.

![](/img/spine-user-guide/path-constraint/offset.jpg)

## Rotate Mix

The rotate mix controls how the bones are rotated, translated, and scaled to match the path.

* `Tangent` rotates the bone to point in the direction of the path at the bone's position. This means when the path bends, the tip of the bone likely won't be on the path and the bone won't point at the next bone.<br>![](/img/spine-user-guide/path-constraint/tangent.jpg)
* `Chain` first translates the bone to be at the tip of the previous bone, then rotates the bone so it points at the next position along the path, determined by [spacing](#Spacing). When the [rotation offset](#Rotate-offset) is not zero, the translation is not applied. When the path bends sharply, the previous bone tip may not be on the path (see image below). `Chain` is useful when the bones represent something rigid, such as tank treads.<br>![](/img/spine-user-guide/path-constraint/chain.jpg)
* `Chain Scale` first rotates the bone so it points at the next position along the path, determined by [spacing](#Spacing), then it scales the bone so the tip is at that position. This ensures all bone positions and tips are on the path. `Chain Scale` is useful when the bones represent something flexible, such as a rope.<br>![](/img/spine-user-guide/path-constraint/chain-scale.jpg) When using `Chain Scale`, all of the constrained bones should have the same parent or the first bone should be the parent of the rest of the bones. If they don't, a warning icon is shown and the scale applied by the path constraint may be incorrect.

The rotate mix slider adjusts the rotate mix, see [constraint mix](/spine-constraints#Mix). The rotate mix can be [keyed](/spine-keys#Path-constraints).

When the rotate mix is greater than 0 and less than 100, moving the target bone may cause the rotation to suddenly use the other direction. This occurs because interpolation between the bone's rotation and the constraint's rotation uses the shortest rotation direction.

Often the rotate mix is used only briefly to transition to or from 0 and 100.

## Translate Mix

The translate mix controls how much the contraint affects the bones' translation, see [constraint mix](/spine-constraints#Mix). The translate mix can be [keyed](/spine-keys#Path-constraints).

When `Link sliders` is checked, the rotate and translate mix sliders will move together.

# Color

The color of the position handle and the path constraint's tree icon uses the color of the first constrained bone.

# Video

[youtube:ToJ6oGA73J4&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[Next: Transform constraints](/spine-transform-constraints)
[Previous: IK constraints](/spine-ik-constraints)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-paths.md
## Title: Paths - Spine User Guide
## URL: http://esotericsoftware.com/spine-paths
---

# Paths

A path [attachment](/spine-attachments) is a composite Bézier spline. It is made up of "knots" which are vertices on the path, and "handles" which are vertices that control the curve of the path between knots.

![](/img/spine-user-guide/paths/path.png)

Paths can be used with [path constraints](/spine-path-constraints) to position bones along the path.

Paths can be deformed automatically when bones are transformed by using [weights](/spine-weights). For best results, typically the knot and both handles are given the same weights.

Path vertex positions can be [keyed](/spine-keys#Deform-keys) in animations.

# Setup

To create a new path, select a bone or slot in the tree, then choose `New...` `Path` in the tree properties.

![](/img/spine-user-guide/paths/new.png)

The new path appears in the tree and [edit mode](#Edit-mode) opens automatically.
The [new vertices mode](#New-vertices-mode) inside of edit mode is also automatically selected.

# Properties

![](/img/spine-user-guide/paths/properties.png)

See the [common attachment properties](/spine-attachments#Common-properties) for the `Select`, `Export`, `Name`, `Color`, and `Set Parent` properties.

## Length

The total length of the path is shown. To change the length, move the path vertices in the viewport.

## Closed

When checked, the first and last knots are connected.

![](/img/spine-user-guide/paths/closed.png)

When unchecked, the first and last knots are not connected.

When an open path is selected, dashed lines at both ends of the path show the direction the path is pointing. This can be useful when a path constraint position is less than `0%` or greater than `100%`.

![](/img/spine-user-guide/paths/path-open.png)

## Constant speed

When checked, additional calculations are performed to make calculating positions along the path more accurate. When used with a [path constraint](/spine-path-constraints), this results in bones moving along the path at a constant speed.

When unchecked, fewer calculations are performed but calculating positions along the path is less accurate. The accuracy is worsened when the handles affecting a portion of the path have dissimilar distances to their respective knot. Accuracy may also be worsened if vertices are moved from their setup pose positions using deform keys or weights.

Unless performance for calculating positions along paths has proven to be an issue, it is recommended to leave `Constant Speed` checked. It can be unchecked when the limitations are understood and the non-constant speed behavior is acceptable.

## Edit Path

Clicking the `Edit Path` button enters [edit mode](#Edit-mode), which is for modifying the path's vertices.

## Freeze

The `Freeze` button sets rotation to 0 and scale to 1 for the current vertex positions.

This is possible because a path does not really have a rotation or scale. It has only a number of vertices, each of which has a position. Spine provides rotation and scale values for convenience, to allow manipulation similar to other attachments. The rotation and scale are adjusted when the `Rotate` or `Scale` tools are used on the entire attachment.

A path doesn't have translation, either. The translation values shown are the centroid of the vertices.

## Reverse

Clicking `Reverse` changes the direction of the path. A path constraint will go around the path in the opposite direction.

# Edit mode

Edit mode allows for creating, modifying, and deleting the path's vertices.

![](/img/spine-user-guide/paths/create.png)

The [Edit Path](#Edit-Path) button enters edit mode. It can be exited at any time by clicking the `Edit Path` button again, by closing the edit mode dialog, or by pressing `spacebar` or `escape`.

Right click switches between the `Create` and `Delete` tools.

## Create tool

The `Create` tool allows new knots to be created by clicking between existing knots. Drag to translate a vertex. Double click to delete a vertex.

## Delete tool

The `Delete` tool allows vertices to be deleted by clicking. Drag to translate a vertex. Multiple vertices can be selected by holding `ctrl` (`cmd` on Mac) or dragging to box select.

![](/img/spine-user-guide/paths/delete.png)

## New vertices mode

The `New` button deletes all vertices and enters the new vertices mode. This mode allows the path to be defined by clicking to create new knots. Drag to create a knot and adjust its handles. Vertices can also be translated by dragging or deleted by double clicking. To complete the path, exit the new vertices mode by clicking the first vertex to close the path or by clicking the `New` button again.

![](/img/spine-user-guide/paths/new-vertices.png)

# Transform tools

Path vertices can be moved outside of edit mode by using the transform tools. The entire path can be rotated, translated, and scaled like any other attachment.

![](/img/spine-user-guide/paths/rotate.png)

Individual vertices can be translated with any transform tool by dragging. Multiple vertices can be selected by holding `ctrl` (`cmd` on Mac), then clicking or dragging to box select. The selected vertices can be deselected by pressing `spacebar` or `escape`, or by clicking in any empty space.

![](/img/spine-user-guide/paths/multiple-vertices.png)

The origin used for rotation or scaling can be changed. Mouse over the small crosshair at the center of the `Rotate` or `Scale` tool until a circle appears, then drag the origin to the desired position. The origin will automatically snap to vertices.

![](/img/spine-user-guide/paths/origin.png)

Moving vertices in setup mode changes the path for the setup pose. Moving vertices in animate mode is done to set [deform keys](/spine-keys#Deform-keys). Deform keys should generally be avoided and [weights](/spine-weights) used instead.

Rotation and scale are only used to move the vertices. The amount of rotation and scale used is not stored in deform keys. Only the vertex positions are stored and interpolation between deform keys always moves the vertices in a straight line.

## Angle lock

When moving a handle, `shift` can be held to lock the angle of the handle, so it will only move toward or away from the knot. This can be useful to adjust the curve on only one side of the knot.

## Cusps

Normally when moving a handle, the handle on the opposite side of the knot also moves. By holding `alt` (`option` on Mac), a handle can be moved without affecting the other handle. This results in a cusp, where the transition from one curve to the next has a sharp turn.

# Video

[youtube:jlMqyyKq7MA&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[Next: Point attachments](/spine-points)
[Previous: Clipping attachments](/spine-clipping)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-physics-constraints.md
## Title: Physics constraints - Spine User Guide
## URL: http://esotericsoftware.com/spine-physics-constraints
---

# Physics constraints

<callout>Physics constraints are not available in Spine Essential.</callout>

A physics constraint simulates how physics and secondary motion would affect the movement of a bone.

Physics constraints can be used to animate secondary motion for hair, clothing, and other items. Anything that moves naturally can use physics to move automatically.
Besides saving time, physics also allows dynamic movement at runtime. Physics reacts fluidly and realistically both across animations and from movement of your character through the game world.

# Setup

To create a physics constraint, select the bone to be constrained, then click `New...` `Physics Constraint` in the tree properties. 

Each slider in the Setup section affects the overall setup for the physics constraint.
Setting a slider to 0 means the physics constraint moves fully with the unconstrained pose, as if there are no physics affecting it. 
Setting a slider to 100 gives the maximum physics offset due to movement of the bone.

## Bone

This shows the constrained bone. When a bone is constrained, clicking the bone selects it.

Opening the select box and clicking a bone will select that bone. Right clicking a bone name without opening the select box will select that bone.

A different bone can be chosen by clicking the pencil icon. This clears the constrained bone and allows a new bone to be chosen.

[Bone length](/spine-bones#Length) affects the movement of physics. For example, how much things rotate. Because of this, translation depends on the bone length.

The bigger effect of bone length is that when a bone moves, it adjusts to try to stay in its old position. There are no forces being applied, so there is no mass involved. Instead, it's an offset from the real bone position to make the bone lag behind the movement.

<callout> To have separate settings for different aspects such as rotation and shear, use multiple physics constraints on the same bone.</callout>

## Translate X
The translate X slider sets how much the bone's X translation is affected by the physics constraint.

## Translate Y
The translate Y slider sets how much the bone's Y translation is affected by the physics constraint.

## Rotation
The Rotation slider sets how much the bone's rotation is affected by the physics constraint.

## Shear X
The shear X slider sets how much the bone's shear X is affected by the physics constraint.

## Scale X
The scale X slider sets how much the bone's scale X is affected by the physics constraint.
Scale X works like rotation: when a bone is moved, the tip of the bone will resist this change and try to stay in the same place, resulting in the bone being compressed or stretched depending on the new position.

## Limit

The limit slider sets the maximum speed of translation that affects physics.

## FPS

Physics constraint FPS is the update rate. It determines how much time needs to pass before physics forces are applied again.
When a skeleton is moving, bones affected by physics are continuously adjusted to lag behind (inertia) but the forces are applied at a fixed rate.
This can be seen easily at low FPS, where the physics will start to look jumpy.
if the FPS are changed, the simulation is also affected, often resulting in needing to readjust the other sliders.
The lower the FPS the more likely the simulation is to fail. 30-60 is usually a good range.

# Properties

Properties can be [keyed](/spine-keys) in animations.

## Inertia
Inertia controls the degree of bone movement transferred to the properties' physics offset. 100% inertia means the property's offset is maximally affected by bone movement, while 0% means it's not affected at all. An inertia value of 100 creates an offset that maintains the bone's position prior to movement. Strength is responsible for moving the bone to its real (unconstrained) position.
In physics constraints, inertia is not used for force application. Instead, it's utilized when a bone moves and physics-controlled properties (x/y/rotation/scaleX/shearX) require adjustment to simulate lagging behind the action. The constrained pose from physics constraints is achieved by "offsetting" properties from the unconstrained pose based on bone movement.

## Strength
Strength is the force that attempts to return the scale to the unconstrained pose.

## Damping
Damping reduces speed more significantly at higher velocities. This feature allows for the reduction of large movements in the motion without slowing down all motion. It reduces oscillation by quickly diminishing large movements.

## Mass
When forces are applied, mass represents the resistance to acceleration. For example, it affects the acceleration resulting from strength trying to return to the unconstrained pose. Higher mass is more difficult for strength to manipulate. Strength can be increased to compensate. Different combinations of mass and strength produce varying motion characteristics.

## Wind

Wind applies a constant force along the world X axis.

## Gravity

Gravity applies a constant force along the world Y axis.

## Global

When checked for a property, it allows multiple physics constraints to be controlled by a single [timeline row](/spine-dopesheet#Rows).

##Mix

The percentage of influence from the constraint. 
See [constraint mix](/spine-constraints#Mix). The mix property can be [keyed](/spine-keys#physics-constraints).

## Simulate

This option applies all physics simulations for the current skeleton. When simulate is disabled and the timeline position is changed, physics are "fast forwarded" from frame zero to the current frame using the highest physics update rate on any constraint in the skeleton. This produces the pose that would result from playing the animation at normal speed from frame 0 to the current frame.
During export, fast forwarding is performed for each frame. This means the export fps and physics fps don't interact; each exported frame is equivalent to jumping the timeline to that position.

## Deterministic

This option applies physics simulations in animate mode starting from frame 0 instead of continuously, resulting in higher CPU usage. When enabled, the pose displayed in the editor is the result of applying the animation and physics multiple times from frame 0 to the current frame. This provides a consistent pose for any given frame.
Deterministic mode allows users to scrub back and forth on the timeline and observe the physics rewinding. It also facilitates easier animation without physics causing excessive bone movement, while still maintaining physics effects.
Note that this feature may cause a jump at the end of looping animations. For loops, it may be preferable to leave Deterministic unchecked.
The drawback of enabling Deterministic is increased computational load for Spine when posing each frame, with the workload increasing for higher frame numbers on the timeline. At runtime or when Deterministic is off, physics calculations are more efficient. Deterministic mode can cause frame rate drops due to the application of animation and physics hundreds or thousands of times for each editor frame.
Deterministic mode only affects the editor. At runtime, developers can implement "fast forward" physics if desired. The code can also control when physics are reset, or physics can be reset by keying the reset with the Reset and Reset All buttons in the Spine editor.

## Reset

Resets the current physics constraint.

## Reset All

Resets all the physics constraints in a project.

# Warnings

A warning is shown on a physics constraint's tree icon if:

- **The length of a bone is invalid**: If your physics constraint has properties like rotate, scaleX, or shearX greater than 0 and the bone length is 0, you will get a warning. The physics constraint cannot apply these properties to a bone with zero length.

- **Nothing is active**: If your physics constraint has all its properties (x, y, rotate, scaleX, shearX) set to 0, it will generate a warning because the constraint would effectively do nothing.

- **Constraint not in a skin affecting a skin bone**: If bones affected by a constraint are in a skin but the constraint itself is not in that skin, you will get a warning. This is because the constraint cannot be applied when the bone's skin is not active. To fix this, add the constraint to the same skin as the bones. See [skin warnings](/spine-skins#Warnings) for more information.

# Limitations

## Warm Up

Because Physics are simulated in real time based on the current state of the skeleton, when exporting looping gifs, it is possible to run an animation for the desired number of times to prepare them for exporting videos and images. This can be achieved using the [Warm up](/spine-export) slider.

## No baking

Physics are intended mostly for runtime use and use less resources thanks to the fact that they require to set less keys.

# Reference Scale
The [skeleton](/spine-skeletons) has a property called `Reference scale`. This is the base scale factor for applying physics and other effects based on distance to non-scalable properties such as angle or scale.

When an entire skeleton is scaled, such as during [Import Data](/spine-import#Data), many of the values are scaled to match. For example, if a skeleton is scaled to 10% of its size, then keys that translate a bone 100 will translate it 10 after the scaling.
However, some values are based on distance, but cannot be scaled. For example, physics constraint gravity is a force that can affect translation, scale, rotation, and/or shear. If we scale the gravity to 10% then it affects translation 10% less and everything looks the same, just smaller, because all the translation in the skeleton was scaled. That doesn't work for rotation or scale.
Rotation is based on angles and is not affected by scaling the entire skeleton. Gravity affects rotation a certain amount at 100 reference scale. If you scale the skeleton to 10%, the way gravity affects rotation will not be the same. If you also change reference scale from 100 to 10, then gravity will affect rotation the same as it did at the 100% skeleton size.
The exact value of the reference scale doesn't matter much. It is important to design physics constraints to behave as desired at a given reference scale. If the whole skeleton is scaled and it is desired to have the physics behave identically, just smaller or larger, scale the reference scale by the same amount.

# Video

[youtube:ymEMtYxPpbM]

[Next: Sliders](/spine-sliders)
[Previous: Transform constraints](/spine-transform-constraints)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-playback.md
## Title: Playback view - Spine User Guide
## URL: http://esotericsoftware.com/spine-playback
---

# Playback view

The playback view provides access to various animation playback settings.

![](/img/spine-user-guide/playback/playback-view.png)

# Timeline FPS

<callout>The [default timeline FPS](/spine-settings#Default-timeline-FPS) for new projects can be set on the settings dialog.</callout>

The timeline FPS (frames per second) slider sets the frames per second used by the [timeline](/spine-keys#Timeline). All the skeletons and animations in a project use the same timeline FPS.

While 30 FPS is a good default for most users, some animators have an intuitive sense of how many frames a certain movement will take when animating at 12 or 24 frames per second.

Changing the FPS can also be useful when animating fast movement. Holding `shift` allows setting keys between whole number [frames](/spine-keys#Frames), but if that is needed often it may be more comfortable to increase the FPS to retain the benefit of snapping to whole number frames.

## Changing the timeline FPS

When the timeline FPS is changed, the keys in your animations remain on the same frame numbers, but the time between frames is faster or slower. That means the speed of your animations in the Spine editor and at runtime will be faster or slower.

Since changing the timeline FPS changes the speed of animations, it should usually be set before creating any animations. To change the timeline FPS without changing the speed of animations (meaning the keys will be on different frames) perform these steps:

* [Export](/spine-export#JSON) the project to JSON (`ctrl+E`).
* Create a new project (`ctrl+shift+N`).
* Set the new timline FPS in the playback view (`alt+P` in animate mode).
* [Import](/spine-import#Data) the JSON data (`alt+F,D`). On the import data dialog, be sure to uncheck `New project` so the data is imported into the current project, where you have set the desired timeline FPS.
* You may want to set the [default timeline FPS](/spine-settings#Default-timeline-FPS) to avoid the wrong timeline FPS on new projects (`F12`).

# Speed

The speed slider controls the playback speed. This can be useful to play an animation slower than normal to ensure that there are no errors that would be hard to see at a faster speed. The percentage buttons provide shortcuts for setting the slider to the corresponding value.

The playback speed affects playback of all skeletons and animations equally. It is not stored between Spine editor runs, exported, or available at runtime. Code that applies an animation at runtime is free to use its own speed multiplier.

# Stepped

When enabled, a [stepped](/spine-graph#Stepped) transition is used between all keys. This means no interpolation will occur between keys. This can be useful to see the keyed poses of an animation without being distracted by interpolation between keys, such as when animating using [pose to pose](/spine-animating#Pose-to-pose).

# Interpolated

When `Interpolated` is not enabled, playback is rounded to the nearest frame. This means no interpolation will occur between [frames](/spine-keys#Frames). This is a stylistic choice which makes playback less smooth, resulting in a look similar to frame-by-frame animation.

[Next: Preview view](/spine-preview)
[Previous: Outline view](/spine-outline)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-points.md
## Title: Point attachments - Spine User Guide
## URL: http://esotericsoftware.com/spine-points
---

# Point attachments

A point [attachment](/spine-attachments) is a point in space with a rotation. It can be used to spawn particles or anything else that involves a position and/or rotation.

![](/img/spine-user-guide/point-attachments/point.png)

Like any other attachment, a point attachment can go in a [skin](/spine-skins). This allows each skin to have its own point attachments, so the position and rotation can change for different skins. For example, different guns may shoot from different positions.

Alternatively, a bone could be used instead of a point attachment, since a bone also has a position and rotation and bones can also go in a skin. However, bones have other features like scale or shear that require a little more processing at runtime.

The point attachment position and rotation cannot be keyed in animations. Instead, the point attachment's bone can be [keyed](/spine-keys#Bone-transforms).

# Setup

To create a new point attachment, select a bone or slot in the tree, then choose `New...` `Point` in the tree properties.

![](/img/spine-user-guide/point-attachments/new.png)

Like any other attachment, multiple point attachments can be under the same slot. This can be used for animations or code at runtime to choose from multiple positions.

![](/img/spine-user-guide/point-attachments/multiple.png)

# Properties

![](/img/spine-user-guide/point-attachments/properties.png)

See the [common attachment properties](/spine-attachments#Common-properties) for the `Select`, `Export`, `Name`, `Color`, and `Set Parent` properties.

[Next: Skins](/spine-skins)
[Previous: Path attachments](/spine-paths)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-preview.md
## Title: Preview view - Spine User Guide
## URL: http://esotericsoftware.com/spine-preview
---

# Preview view

<callout>The [outline view](/spine-outline) is similar but shows the current pose rather than showing animations.</callout>

The preview view allows animations to be played using many of the same controls that are available at runtime. This includes mixing (crossfading) between animations, playing multiple animations at the same time on different tracks, and combining animations additively. The preview view is also useful to see an animation playing while editing the setup pose or animation.

![](/img/spine-user-guide/preview/preview-view.png)

The preview view works the same as the [viewport](/spine-ui#Viewport). Use the right mouse button or hotkeys to [pan](/spine-ui#Panning). Mouse wheel or use the zoom slider, buttons, or hotkeys to [zoom](/spine-ui#Zooming).

See the preview [tips](/spine-tips#Preview) for various ways to use the preview view efficiently.

# Animations

At the top right of the preview view, all animations are listed for the currently selected skeleton, just as they appear in the tree. If a project has multiple skeletons, a select box indicates for which skeleton the animations are being shown.

![](/img/spine-user-guide/preview/animations.png)

<callout>Right click a track button to toggle the animation for that track.</callout>

Clicking an animation sets the animation for the active track, equivalent to AnimationState [setAnimation](/spine-api-reference#AnimationState-setAnimation2) at runtime. See [AnimationState playback](/spine-applying-animations#Playback) for more information.

Clicking the animation again clears the animation for the track, equivalent to AnimationState [setEmptyAnimation](/spine-api-reference#AnimationState-setEmptyAnimation) at runtime. See [empty animations](/spine-applying-animations#Empty-animations) for more information.

Right clicking an animation selects it in the tree.

# Tracks

Tracks allow multiple animations to be applied at the same time. See [AnimationState tracks](/spine-applying-animations#Tracks) for more information.

The track controls are shown at the bottom right of the preview view.

![](/img/spine-user-guide/preview/track-controls.png)

<callout>The repeat, hold previous, and additive buttons don't affect the currently playing animation. Instead, they affect the next animation that is played.</callout>

The track buttons control which track is active. The other controls show the settings for the active track.

Right click a track button to toggle the animation for that track.

The alpha slider, hold previous button, and additive button are not visible for track 0.

If an animation is set for the last track, another row of tracks will appear (up to 15 tracks).

## Speed

The speed slider sets the speed of animations played on the track. It is equivalent to TrackEntry [timeScale](/spine-api-reference#TrackEntry-timeScale) at runtime.

![](/img/spine-user-guide/preview/speed.png)

The speed slider can be useful to slow the animation so it is easier to see if it looks as desired, or to choose a speed that will be used at runtime.

The reset button sets the speed to 100%.

## Mix

The mix slider sets the mix duration when the current animation changes for the track. It is equivalent to TrackEntry [mixDuration](/spine-api-reference#TrackEntry-mixDuration) at runtime. See [mix times](/spine-applying-animations#Mix-times) for more information.

![](/img/spine-user-guide/preview/mix.png)

When the animation changes for the track, the mix duration crossfades from the old animation to the new animation. Set the mix duration to 0 to make the animation change instantaneous.

The preview view is useful to determine the ideal mix durations between various animation that will be used at runtime. See AnimationStateData [setMix](/spine-api-reference#AnimationStateData-setMix).

## Repeat

The repeat button sets whether the next animation played on the track will loop. It does not affect the currently playing animation. It is equivalent to TrackEntry [loop](/spine-api-reference#TrackEntry-loop) at runtime.

## Alpha

The alpha slider mixes the pose from the animation currently playing on the track with the pose from animations on lower tracks. It is equivalent to TrackEntry [alpha](/spine-api-reference#TrackEntry-alpha) at runtime.

![](/img/spine-user-guide/preview/alpha.png)

When the alpha is 0, this animation has no effect on the pose from lower tracks. When the alpha is 1, the pose from lower tracks is overwritten with this animation. Between 0 and 1 results in a pose between the lower tracks and this animation.

## Hold previous

![](/img/spine-user-guide/preview/hold-previous.png)

The hold previous button sets whether the next animation played on the track will use the "hold previous" feature, which is used to prevent "dipping" when the animation changes. It does not affect the currently playing animation. It is equivalent to TrackEntry [holdPrevious](/spine-api-reference#TrackEntry-holdPrevious) at runtime.

Usually, mixing between animations that key the same property works as you'd expect. However, when a lower track keys the property, the pose from the lower track can be seen when mixing between animations on a higher track. If this is undesireable, `Hold Previous` can be used.

Normally the previous animation mixes out as the next animation mixes in. With `Hold Previous`, the previous animation is applied fully while the next animation is mixed in. This ensures the pose from the lower track won't be seen.

Note that since the previous animation is not mixed out when `Hold Previous` is enabled, the next animation should key every property the previous animation keys, else the values will snap to the setup pose when the mix completes.

## Additive

![](/img/spine-user-guide/preview/additive.png)

The additive button sets whether the next animation played on the track will use the "additive" feature, which adds the animation's pose to the pose from animations on lower tracks. It does not affect the currently playing animation. It is equivalent to setting TrackEntry [mixBlend](/spine-api-reference#TrackEntry-mixBlend) to MixBlend [add](/spine-api-reference#MixBlend-add) at runtime.

The values for a pose from an animation are normally added to the setup pose to get the final pose used for the skeleton. When additive is active, the values are instead added to the pose from animations on lower tracks. Typically the alpha slider is used to control how much of the additive animation is added.

# View settings

![](/img/spine-user-guide/preview/view-settings.png)

#### Hide controls

When checked, the list of animations and playback controls are hidden.

#### Play current animation

When checked, the preview view will automatically play the active animation. This can save time when using the preview view to show the active animation.

#### Show bones

When checked, bones are displayed inside the preview view.

# Video

[youtube:ad1yYpy1yO8&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b?modestbranding=1&rel=0]

[Next: Skins view](/spine-skins-view)
[Previous: Playback view](/spine-playback)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-proxy-server.md
## Title: Proxy server - Spine User Guide
## URL: http://esotericsoftware.com/spine-proxy-server
---

# Proxy server

Spine can be configured to download updates via a proxy server. To do this, Spine must be started from the command line with a special flag:

```plain
-x, --proxy  Proxy server to use when checking for and downloading updates.

Example:
Spine -x server:1234
Spine --proxy server:1234
```

In this example, `server` is the IP or hostname of the proxy server and `1234` is the proxy server's port.

Running Spine from the command line varies per operating system:

# Windows

Open `Command Prompt`, type this command (with your own proxy server and port), then press `enter`:

```plain
"C:\Program Files\Spine\Spine.exe" -x server:1234
```

# Mac

Open `Terminal`, type this command (with your own proxy server and port), then press `enter`:

```plain
/Applications/Spine.app/Contents/MacOS/Spine -x server:1234
```

# Linux

Open a terminal and execute this command in the Spine directory (with your own proxy server and port):

```plain
./Spine.sh -x server:1234
```

[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-regions.md
## Title: Regions attachments - Spine User Guide
## URL: http://esotericsoftware.com/spine-regions
---

# Region attachments

A region [attachment](/spine-attachments) is a rectangular image. It gets the name "region" because at runtime (in your application) it is typically drawn using a region from a texture atlas.

![](/img/spine-user-guide/regions/region.png)

The region attachment's transform cannot be keyed in animations. Instead, the region attachment's bone can be [keyed](/spine-keys#Bone-transforms).

# Setup

A region attachment is created from an image under the [images node](/spine-images) in the tree, by [importing a PSD](/spine-import-psd), or by importing data from an image editor [script](/spine-images#Scripts).

# Properties

![](/img/spine-user-guide/regions/properties.png)

See the [common attachment properties](/spine-attachments#Common-properties) for the `Select`, `Export`, `Name`, `Color`, and `Set Parent` properties.

## Image path

When the image path is blank, the region attachment's name is used to find the image. When the image path is set, it is used instead of the region attachment's name. See [image file lookup](/spine-images#Image-file-lookup) for more information.

## Mesh

The `Mesh` checkbox changes the region attachment into a mesh attachment. See [meshes](/spine-meshes) for more information. 

## Sequence

The `Sequence` checkbox allows a sequence of images that have the same height and width and share the same image path in a numeric sequence to be used from the same attachment. The image path should be the full path without including the numbers. The sequence field allows to specify the range of image numbers to include.
`Frame` sets the current frame to display of the sequence.
A sequence can be [keyed](/spine-keys#Sequence-keys).

# Translation

The region attachment's translation is the location of the center of the image. If it is important for an image to align with world coordinates (ie screen pixels) and the image has odd dimensions, then it needs to be offset by `0.5`.

# Video

[youtube:76Var_oS8EM&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[Next: Mesh attachments](/spine-meshes)
[Previous: Attachments](/spine-attachments)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-settings.md
## Title: Settings - Spine User Guide
## URL: http://esotericsoftware.com/spine-settings
---

# Settings

Spine provides many settings to customize its behavior.

To open the `Settings` dialog, press `F12` or open the main menu by clicking the Spine logo in the upper left and choose `Settings`.

![](/img/spine-user-guide/settings/menu.png)

![](/img/spine-user-guide/settings/settings-dialog.png)

# Application

## Launcher

![](/img/spine-user-guide/settings/settings-launcher.png)

These settings affect the launcher, before a version of the Spine editor is started.

!table Setting, Description

!row Version
Sets the Spine editor version to use the next time Spine starts. This is the same as [choosing a version](/spine-versioning#Choosing-a-Spine-editor-version) on the Spine launcher dialog.

The select box shows all versions you have downloaded. You can click `Other...` and type the version number for [any version](/spine-changelog/archive) we've ever released.

See [versioning](/spine-versioning) for more information.

!row Start automatically
When checked, the Spine launcher will start the version of the Spine editor that was last used.

When unchecked, the Spine launcher stops to allow a version to be chosen. Clicking anywhere in the Spine launcher window when it first appears will prevent it from starting automatically.

!table

## Files

![](/img/spine-user-guide/settings/settings-files.png)

These buttons open the corresponding folder when clicked.

!table Setting, Description

!row Backups
This folder contains copies of project files made just before each save. Also, if [auto backup](#Automatic-backup) is enabled, copies of the project file are saved periodically.

```plain
Windows: <user home folder>\Spine\backups
Mac: <user home folder>/Library/Application Support/Spine/backups
Linux: <user home folder>/.spine/backups
```

!row Hotkeys
This text file contains all of Spine's hotkeys. The file can be edited to customize the hotkeys to your liking. See [key names](/spine-key-names) for a list of the key names that can be used.

When new hotkeys are added to Spine, they are added to the hotkeys file.

```plain
Windows: <user home folder>\Spine\hotkeys.txt
Mac: <user home folder>/Library/Application Support/Spine/hotkeys.txt
Linux: <user home folder>/.spine/hotkeys.txt
```

!row Log
The [spine.log](/spine-troubleshooting#spine.log) file is written each time Spine starts. It may provide more details in case something goes wrong.

```plain
Windows: <user home folder>\Spine\spine.log
Mac: <user home folder>/Library/Application Support/Spine/spine.log
Linux: <user home folder>/.spine/spine.log
```

!table

## General

![](/img/spine-user-guide/settings/settings-general.png)

These settings affect the entire application.

!table Setting, Description

!row Color management
When unchecked, colors are rendered to the monitor using sRGB using gamma blending. Most monitors use sRGB.

When checked, the monitor's color profile is used to render accurate colors. This is useful for monitors that use wide gamut colors or an ICC color profile other than sRGB. Enabling color management uses slightly more GPU resources.

When enabled, blending can be done in either gamma or linear space. Images are generally saved in gamma space and most game toolkits perform blending in gamma space because it requires less effort, even though the results are less accurate. When using linear blending at runtime, choosing linear blending allows you to see blending in Spine exactly as it will render at runtime.

Color management is not available for Linux.

!row Editor frame rate
Sets the maximum frames per second that Spine can render at. Generally it should be set to the refresh rate of your monitor. This setting does not affect the [timeline FPS](/spine-playback#Timeline-FPS).

Spine only renders when necessary, which is usually much less often than the editor frame rate, except when playing animations.

The editor frame rate may be overridden by GPU settings.

!row Reuse instance
When checked, if a file is opened via an OS file explorer, it is opened in an existing Spine instance, if one is running.

When unchecked, a new Spine instance is started to open the file.

This setting is not available for Mac, where double clicking a file always reuses an existing Spine instance if possible. To open multiple instances of Spine on Mac, this command can be used:
```
open -n -a /Applications/Spine.app
```

!row Show FPS
When checked, the editor framerate is shown in the title bar as frames per second during animation playback. When not playing an animation, the FPS is not shown.

!row Welcome screen
When checked, Spine will show the [welcome screen](/spine-welcome-screen) on startup.

When unchecked, Spine will open the last opened project on startup. The welcome screen can still be accessed by clicking the mail button in Spine's titlebar:

![](/img/blog/welcome-screen/mail-icon-open.jpg)

!table

# User interface

![](/img/spine-user-guide/settings/settings-user-interface.png)

These settings affect all of Spine's views and other parts of the [user interface](/spine-ui).

!table Setting, Description

!row Language
The language of the Spine user interface. It is set by default to the OS language, if possible.

!row Font
Sets the font used by Spine's user interface. Some language require their own font.

* `Bitmap` renders very efficiently, but supports only Latin, Greek, and Cyrillic characters and is available only for the medium and large font sizes.
* `Unicode` takes slightly more GPU resources but supports all sizes and has glyphs for most languages.
* When the language is set to Chinese, Japanese, or Korean, the corresponding font should be used.

!row Font size
Sets the font size used by Spine's user interface. Smaller font sizes allow more to be fit on screen at once, but may be harder to read. The `Bitmap` font is limited to the medium or large sizes.

!row Default timeline FPS
Sets the default [timeline FPS](/spine-playback#Timeline-FPS) for new projects.

!row Interface scale
Scales Spine's entire user interface larger or smaller. This allows the user interface to be a comfortable size for the size of monitor you are using.

When set higher than 100%, Spine uses 2x graphics so the user interface stays looking sharp. Scales other than 100% or 200% may appear less sharp.

!row Row height
Sets the height of each row in the dopesheet and graph. The default setting is the most visually appealing, but more rows can be shown at once with a smaller setting.

!row Toolbar position
Allows customizing the toolbar position to maximize the usable editor space for your window size by placing the [main toolbar](/spine-tools#Tools) on the left, center, or right.

!row Toolbar text labels
The text labels on the [main toolbar](/spine-tools#Tools) can be hidden to take up less space. `Automatic` hides them when the main toolbar no longer fits in the viewport.

!row Tree indentation
The amount in pixels to indent tree nodes in the [tree view](/spine-tree) hierarchy. Lower indentation allows more to be shown in the tree horizontally, but makes it less obvious which tree nodes are underneath others.

!table

# Viewport

![](/img/spine-user-guide/settings/settings-viewport.png)

These settings affect rendering of the skeletons and tools in the [viewport](/spine-ui#Viewport).

!table Setting, Description

!row Background
Sets the colors and patterns to use for the editor background. The alpha can be set to zero for some colors to hide that part of the background, such as the gradient.

When doing screen capture to a lossy format, like GIF, it can be helpful to use a solid background color.

!row Backface culling
When unchecked, all triangles are drawn.

When checked, triangles facing away from the screen are not drawn. This can be useful to hide portions of a mesh that are not facing the screen. The same effect can be enabled in some game toolkits.

!row Bone scale
Scales the size of the bones and zoom levels so they better match the size of the skeletons. This is helpful when working with very small or very large skeletons.

!row Color bleed
When greater than zero, when images are loaded color bleeding is performed to copy neighboring colors into transparent pixels. This prevents artifacts when downscaling, meaning when the images are zoomed out or otherwise displayed smaller than their actual size. Higher values increase image loading time but may be needed when downscaling a large amount.

!row Dim unselected skeletons
When checked and a project has multiple skeletons, skeletons that are not selected are drawn with more dimly. This can reduce clutter if many skeletons are visible at once.

!row Highlight attachments
When checked, edges of attachment images are highlighted when hovered or selected. When images have a lot of translucency, this may make the images difficult to see.

!row Highlight smoothing
When checked, the attachment highlight is smoothed when zoomed in.

When unchecked, the attachment highlight is pixelated when zoomed in. This may be desirable when working with pixel art.

!row Missing images
When checked, a red "missing" image is displayed when an image cannot be found for region and mesh attachments.

When unchecked, the image is shown as black.

!row Multisample anti-aliasing
When checked, Spine will use multisample anti-aliasing. This doesn't effect most of Spine's rendering but provides antialiasing when a [mesh edge](/spine-meshes#Hull-edges) or [clipping](/spine-clipping) cuts through an image.

GPU support for the chosen MSAA setting is required, else it will have no effect.

!row Pixel grid
When checked, the viewport rendering is rasterized to simulate pixel art. When enabled, the rendering for each skeleton is limited to 2048x2048.

!row Smoothing
Sets the smoothing to apply to images in the viewport. Smoothing is a way of blurring the image to hide the pixel structure when upscaling, meaning when images are zoomed in or otherwise displayed larger than their actual size.

* 0 disables smoothing, nearest neighbor filtering is used. This can be useful for pixel art.
* 1-10 uses linear filtering between 10% and 100%.
* 11 uses bicubic filtering. This may be sharper and preserve details slightly better than linear filtering.

When `Anisotropic filtering` is checked, the quality when downscaling images is improved. When enabled, 33% more GPU memory is required for each image that is loaded.

When `Keep edges` is checked, smoothing is not used for translucent pixels. This allows the edges of an image to be seen clearly while still using smoothing for the rest of the image.

!table

# Behavior

![](/img/spine-user-guide/settings/settings-behavior.png)

These settings affect the behavior of Spine's user interface.

!table Setting, Description

!row Automatic backup
When checked, the project is saved periodically in the [backup folder](#Backup-folder), if it has changes since the last save. This is normally very fast, but for extremely large projects this may introduce unwanted pauses and can be disabled.

!row Delete confirmation
When unchecked and you choose to delete an item, Spine will no longer ask if you are sure you want to delete it. If an item is deleted accidentally, you can always use undo by pressing `ctrl+Z` (`cmd+Z` on Mac).

!row Double click shortcuts
Spine uses double click for a number of optional shortcuts, for example to rename an item in the tree or deselect in the viewport. When unchecked, those shortcuts are disabled. This can be useful when using a pen tablet, where it may be easy to accidentally double click.

!row Interface animations
When unchecked, Spine will not use animations in the user interface. This means menus will not open using an animation, dialogs will not fade in, etc.

!row Middle mouse pans
When unchecked, the middle mouse button is used to make a new selection, regardless of the current selection. This is the default.

When checked, the middle mouse button is used for panning instead. This can be useful if coming from other software that uses the middle mouse button to pan.

!row Pan momentum
When checked, panning a large amount continues for a very short amount of time to make the movement smoother.

When unchecked, panning always stops abruptly.

!row Smooth scrolling
When checked, scrollbars are animated smoothly when scrolled instead of jumping instantly into position.

!row Tooltips
When unchecked, tooltips will not be shown by hovering the mouse. Tooltips can still be shown on demand by pressing `F1`.

!row Zoom to mouse
When checked, the mouse wheel or `Zoom` hotkey (`U` by default) will zoom in/out using the mouse cursor location. This is usually a very natural way of zooming, but may not work well for a pen tablet or touchpad/trackpad.

When unchecked, zooming in/out uses the center of the viewport.

!table

## Dopesheet

![](/img/spine-user-guide/settings/settings-dopesheet.png)

These settings affect the behavior of the [dopesheet view](/spine-dopesheet).

!table Setting, Description

!row Box select pause
When checked, a brief pause is required after selecting to prevent the selection box from disappearing.

!row Jump to frame
When checked, the timeline position is set when empty space is clicked in the dopesheet.

!row Jump to key
When checked, the timeline position is set to the key's frame when a key is clicked in the dopesheet.

!table

## Graph

![](/img/spine-user-guide/settings/settings-graph.png)

These settings affect the behavior of the [graph view](/spine-graph).

!table Setting, Description

!row Drag to edit
When checked, dragging in empty space manipulates the graph selection. Like in the viewport, this reduces fatigue from using the mouse to animate for long hours.

When unchecked, keys and curve handles in the graph must be dragged to manipulate them.

!row Jump to frame
When checked, the timeline position is set when empty space is clicked in the graph.

!row Jump to key
When checked, the timeline position is set to the key's frame when a key is clicked in the graph.

!table

[Previous: Command line interface](/spine-command-line-interface)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-skeletons.md
## Title: Skeletons - Spine User Guide
## URL: http://esotericsoftware.com/spine-skeletons
---

# Skeletons

A skeleton represents an animatable character or object. It has bones, slots, attachments, animations, and other parts which are all shown in the [tree view](/spine-tree).

A project may have multiple skeletons. To add additional skeletons, choose `New Skeleton` from the [main menu](/spine-ui#Main-menu) or press `ctrl+N` (`cmd+N` on Mac).

# Properties

![](/img/spine-user-guide/skeletons/properties.png)

## Export

<callout>Disabling export for an entire skeleton can be useful to store templates or background images that are only used as a reference in Spine.</callout>

When `Export` is unchecked, the skeleton won't be exported at all. No JSON or binary data will be exported and it won't appear in image or video exports.

## Reference scale

Baseline scale factor for applying [physics](spine-physics-constraints) and other effects based on distance to non-scalable properties, such as angle or scale.

# Skeleton draw order

When a project has multiple skeletons, they are drawn in the viewport in the order they appear in the tree view. Skeletons can be dragged in the tree view to change their draw order. Skeletons higher in the tree are drawn on top of those below.

Each skeleton is fully drawn before the next is drawn. In the Spine editor it is not possible for a skeleton to have some parts drawn in front of another skeleton and also have other parts drawn behind the other skeleton. If that is needed, it is easiest to use a single skeleton. Other options are to use 3 skeletons or split up the skeleton rendering [at runtime](/spine-unity#SkeletonRenderSeparator).

# Hiding skeletons

A skeleton can be hidden by clicking the visibility dot next to it in the tree. When hidden, all resources for the skeleton are unloaded and the skeleton will not appear in the viewport, graph, dopesheet, or other views. Hidden skeletons are still exported.

[Next: Bones](/spine-bones)
[Previous: User interface](/spine-ui)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-skins-view.md
## Title: Skins view - Spine User Guide
## URL: http://esotericsoftware.com/spine-skins-view
---

# Skins view

The skins view allows multiple [skins](/spine-skins) to be visisble at the same time in the viewport. It is especially useful to work on characters that mix and match skins for various items or body parts.

![Skins view](/img/blog/3.7-skinsview.gif)

The new skin icon to the right of the `Skins` tab creates a new skin.

# Skin list

At the top of the skins view, all skins are listed for the currently selected skeleton, just as they appear in the tree. If a project has multiple skeletons, a select box indicates for which skeleton the skins are being shown.

Clicking a skin sets it as the [active skin](/spine-skins#Active-skin). This is identical to clicking the visibility dot for the skin in the tree. Only attachments for the active skin can be selected or edited in the viewport. The active skin is always visible and if not pinned it is considered to be applied last.

Double clicking a skin opens the rename skin dialog. Right clicking a skin selects it in the tree, without making it active.

## Pins

Each skin has a pin at the right edge of the skins view when the mouse is over the skin. When the pin is clicked, it turns orange to indicate the skin is pinned and the skin appears in the [pinned skins list](#Pinned-skins). Clicking the orange pin will unpin the skin.

# Pinned skins

Pinned skins are shown in a list at the bottom of the skins view. All the pinned skins are visible in the viewport at the same time.

The pinned skins are applied starting with the bottommost skin first. If the [active skin](/spine-skins#Active-skin) is not pinned, it is applied last. When two skins have attachments for the same skin placeholder, the skin higher in the pinned skins list will override the lower skin.

The pinned skins can be dragged to change the order they are applied. Clicking the orange pin will unpin the skin and remove it from the list.

[Next: Slot Color view](/spine-slot-color)
[Previous: Preview view](/spine-preview)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-skins.md
## Title: Skins - Spine User Guide
## URL: http://esotericsoftware.com/spine-skins
---

# Skins

Skins allow a skeleton's animations to be reused with different sets of attachments. Skins can be used for simple outfits swaps or to assemble entire characters out of many different pieces.

![](/img/spine-user-guide/skins/skins.png)

Skins are made up of [attachments](/spine-attachments), [bones](/spine-bones), and [constraints](/spine-constraints) that are only active when the skin is visible. A skeleton can have multiple skins visible at once using the [skins view](/spine-skins-view).

The key to skins is the "skin placeholder", which is an attachment that goes under a slot in the tree, like any other attachment. However, it is just a placeholder for the actual attachment that will be used, which comes from the skins that are currently visible.

Animations can show and hide skin placeholders just like they do attachments, by keying the [slot attachment](/spine-keys#Slot-attachment). By doing this, animations are not tied to showing and hiding specific attachments. Instead, animations show and hide skin placeholders and which attachments are actually shown comes from which skins are visible, enabling animations to be used with any skins.

See the skin [demo](/spine-demos#Skins), [example projects](/spine-examples#Skins), and [tips](/spine-tips#Skins) for usage examples.

# Setup

Setting up a skin consists of creating the skin and skin placeholders, then populating the skin placeholders with attachments for that skin. Bones and constraints can also be added to the skin.

A skin is created by selecting the `Skins` node in the tree and clicking `New...` `Skin`.

![](/img/spine-user-guide/skins/new.png)

## Skin placeholders

<callout>When naming your skin placeholders, the name doesn't need to indicate which skin it is for. Instead, it should be named for the attachment represents.<br><br>For example, if you have a `red` and a `blue` skin, `head` would be a good skin placeholder name for the head, not `red head` or `blue head`.</callout>

Skin placeholders are created by selecting a bone, slot, or attachment in the tree and clicking `New...` `Skin Placeholder`. When an attachment is selected, this option is disabled if the skeleton doesn't have a skin [active](#Active-skin).

![](/img/spine-user-guide/skins/new-placeholder.png)

### Selected attachments

<callout>Multiple attachments can be selected before creating new skin placeholders. A skin placeholder will be created for each one.</callout>

If an attachment is selected when creating a new skin placeholder, the attachment will be moved to the [active skin](#Active-skin) under the new skin placeholder. However, first a dialog is shown to provide more options. Some of the options will only appear for mesh attachments or attachments with keys.

![](/img/spine-user-guide/skins/placeholder-options.png)

* `Duplicate attachments for each skin`: Duplicates the attachment for every skin. This is useful when adding an attachment that is the same in most or all skins.
  * `Linked meshes`: Instead of duplicating the meshes, [linked meshes](/spine-meshes#Linked-meshes) are created for the other skins.
    * `Inherit deform`: The linked meshes will share the deform keys for the source mesh.
  * `Duplicate keys`: The keys for each duplicated attachment in each animation are also duplicated.
  * `Rename attachments`: Prepends the name of the skin to each duplicated attachment. For example, `head` will be renamed to `red/head` for the `red` skin. This is useful when the images for each skin are organized into subfolders.

# Properties

![](/img/spine-user-guide/skins/properties.png)

## Export

When `Export` is unchecked, the skin won't be exported, meaning the skin and its attachments won't be in exported JSON or binary and won't appear in image or video exports.

If a mesh attachment is not exported, none of its [linked meshes](/spine-meshes#Linked-meshes) will be exported either.

If an attachment is not exported and is keyed in an animation, the keys won't be exported.

## Color

Changing the skin's color can help differentiate skins in the tree to make identification easier. The skin color has no effect at runtime and is only used for visualization in the Spine editor.

## Add to Skin

Clicking the `Add to Skin` button enters add to skin mode, for adding [skin bones](#Skin-bones) and [skin constraints](#Skin-constraints) to the skin. It can be exited at any time by clicking the `Add to Skin` button again or by pressing `spacebar` or `escape`.

## Folders

Skins can be organized into folders. To create a folder, select a skin and click `New...` `Folder`. Skins can be moved between folders by dragging them.

In exported skeleton data, folder names are prepended to the skin name to create the final name used in the Spine Runtimes. For example, if the folder `hair` has a subfolder `long` which has a skin `brown`, then the skin name at runtime is `hair/long/brown`.

# Active skin

The dot next to each skin in the tree controls which skin is "active".

![](/img/spine-user-guide/skins/active.png)

The skin placeholders throughout the tree show attachments for the currently active skin.

![](/img/blog/multi-pose/skins-content.gif)

The active skin is the one being edited and only one skin may be active at any given time. The active skin is always visible.

The [skins view](/spine-skins-view) allows many skins to be visible at the same time by pinning them, but only one skin may be active at any given time. Selecting a skin in the skins view makes it the active skin.

# Skin attachments

<callout>[Show all skin attachments](/spine-tree#Show-all-skin-attachments) can be used to see all the skin attachments for all skins at once.</callout>

A skin can have one [attachment](/spine-attachments) (or none) for each skin placeholder. To set a skin placeholder's attachment for the active skin, first ensure a skin is [active](#Active-skin), then drag an attachment to the skin placeholder or use [Set Parent](/spine-attachments#Set-Parent). Any previous attachment the active skin had for the skin placeholder is deleted.

If the attachment is dragged to an existing attachment under the skin placeholder instead of to the skin placeholder, then the transform for the existing attachment is copied to the new attachment.

To clear the attachment for a skin placeholder, delete it or drag it elsewhere.

Property rows for skin attachments in the [dopesheet](/spine-dopesheet#Visibility) and [graph](/spine-graph#Visibility) may not be visible depending the [tree view settings](/spine-tree#View-settings).

# Skin bones

<callout>[Hide skin bones and constraints](/spine-tree#Hide-skin-bones-and-constraints) hides inactive bones in the tree.<br><br>[Hide viewport skin bones](/spine-tree#Hide-viewport-skin-bones) hides inactive bones in the viewport. Unchecking this makes all bones active, regardless of skins, so should usually be checked.</callout>

A [bone](/spine-bones) can be added to one or more skins so the bone is active only when a skin it is in is active. This allows a skeleton to have bones that are only used for certain skins. Bones that are not active do not affect runtime performance.

To add a bone to the [active skin](#Active-skin), select the bone and click on `Add to skin` in the tree properties. You can also drag the bone in the tree and drop it on a skin. Or, select a skin and click on `Add to skin` in the tree properties, then click any number of bones or constraints to add them all to the skin.

If the bone is required by attachment weights or constraints that are in other skins, the bone will automatically be added to those other skins. When this occurs, a message is shown with a button to open the [spine.log](/spine-troubleshooting#spine.log) with details about the changes. The changes can be reverted using undo, but doing so will result in [warnings](#Warnings).

Skin bones have a skin icon to the right of the bone in the tree. Clicking it selects the bone under all its skins. This makes it easy to find the skins or remove the bone from all skins.

To remove a bone from a skin, select the bone under the skin in the tree, then click the remove button (where the delete button is usually found).

![](/img/spine-user-guide/skins/remove-bone-from-skin.png)

<callout>Skin bones are not available in Spine Essential.</callout>

Bone rows for skin bones in the [dopesheet](/spine-dopesheet#Visibility) and [graph](/spine-graph#Visibility) may not be visible depending on the [tree view settings](/spine-tree#View-settings).

# Skin constraints

<callout>[Hide skin bones and constraints](/spine-tree#Hide-skin-bones-and-constraints) hides inactive constraints in the tree.</callout>

A [constraint](/spine-constraints) can be added to one or more skins so the constraint is active only when a skin it is in is active. This allows a skeleton to have constraints that are only used for certain skins. Constraints that are not active do not affect runtime performance.

To add a constraint to the [active skin](#Active-skin), select the constraint and click on `Add to skin` in the tree properties. You can also drag the constraint in the tree and drop it on a skin. Or, select a skin and click on `Add to skin` in the tree properties, then click any number of constraints or bones to add them all to the skin.

<callout>Skin constraints have a skin icon to the right of the constraint in the tree. Clicking it selects the constraint under all its skins. This makes it easy to find the skins or remove the constraint from all skins.</callout>

To remove a constraint from a skin, select the constraint under the skin in the tree, then click the remove button (where the delete button is usually found).

![](/img/spine-user-guide/skins/remove-constraint-from-skin.png)

## Constrained bones

The constrained bones are the bones that the constraint will modify. When some of the constained bones are not active because they are in skins, the constraint will still work, it just won't modify the inactive bones.

If all the constrained bones are in skins, then the constraint should be in those skins too, because it has nothing to do when the all the constrained bones are not active. The constraint will have a [warning](#Constraint-warnings) until it is added to at least one of those skins.

## Skin constraints example

Skins can use constraints to move bones so a skeleton and all its animations can be reused for characters with different proportions. See [Skin constraints for different proportions](/blog/Skin-constraints-for-different-proportions) for more information.

![](/img/blog/3.8-released/tall-short.gif)

# Warnings

<callout>All warnings should be fixed before exporting data to use with the Spine Runtimes.</callout>

Warnings appear in the tree on the icons for bones, attachments, and constraints when skins are misconfigured.

This can happen because various parts of the skeleton depend on other parts. When some parts are added to a skin and that skin is not visible, those parts are not available. This can cause bone transforms to be invalid, prevent attachments from rendering, or prevent constraints from being applied.

## Bone warnings

A warning is shown on a bone's tree icon if the bone is not in the same skins as a parent bone. When this occurs, the bone and any attachments will not appear in the viewport.

![](/img/spine-user-guide/skins/bone-warning.png)

When a parent bone is not active, the [transform](/spine-bone#Bone-transforms) for descendant bones is invalid. Anything relying on the child bone's transform, such as attachments using [weights](/spine-weights), will also be invalid.

To fix bone warnings, add the child bone to the same skins as its parent bones.

> When [Hide viewport skin bones](/spine-tree#Hide-viewport-skin-bones) is unchecked, all bones are made active, regardless of which skins are visible. Bone warnings that will not render correctly at runtime may render correctly when this setting is unchecked.

## Attachment warnings

A warning is shown on an attachment's tree icon if:
* the attachment has [weights](/spine-weights) for a bone that has a [bone warning](#Bone-warnings), or
* the attachment is in a skin and has weights for a bone that is in a skin, but not in the attachment's skin.

![](/img/spine-user-guide/skins/attachment-warning.png)

Vertices weighted to a bone that is not active are invalid and are set to world 0,0. For example, invalid vertices for a mesh appear at world 0,0. If all the vertices are invalid, the entire mesh will be at world 0,0 and cannot be seen at all.

![](/img/spine-user-guide/skins/vertex-error.png)

To fix attachment warnings, first fix any [bone warnings](#Bone-warnings) for bones used by the attachment's weights. Then, if the attachment is in a skin and any of those bones are also in a skin, add the skin bones to the attachment's skin.

## Constraint warnings

A warning is shown on a constraint's tree icon if:
* the constraint's target bone is in a skin, but the constraint is not in that skin, or
* all of the constraint's constrained bones are in skins, but the constraint is not in any of those skins.
* other physics constraints [warnings](/spine-physics-constraints#Warnings).

![](/img/spine-user-guide/skins/constraint-warning.png)

When a constraint has a warning, it means that it either cannot be applied at all, or can only be applied sometimes, depending on which skins are visible.

To fix constraint warnings, add the constraint to the same skins as the target bone. Then, if all of the constrained bones are in skins, ensure the constraint is in at least on of the skins.

# Duplicating a skin

When a skin is duplicated, a dialog is shown to provide more options. Some of the options will only appear for mesh attachments or attachments with keys.

![](/img/spine-user-guide/skins/duplicate-options.png)

* `Linked meshes`: Instead of duplicating meshes for the new skin, [linked meshes](/spine-meshes#Linked-meshes) are created.
  * `Inherit deform`: The linked meshes will share the deform keys for the source mesh.
* `Duplicate keys`: The keys for each duplicated attachment in each animation are also duplicated.
* `Rename attachments`: Prepends the name of the skin to each duplicated attachment. For example, `head` will be renamed to `red/head` for the `red` skin. This is useful when the images for each skin are organized into subfolders.

# Skin workflows

Skins are powerful and there are many ways to make use of them. As you work with skins, keep in mind that using the right workflows can save an enormous amount of time.

## The first skin

If all your attachments have been created without using skin placeholders, it would be tedious to create skin placeholders and move the existing attachments one by one. To do this more efficiently, first use the [tree filter](/spine-tree#Filters) to hide bones and slots, so only attachments are shown. This makes selecting many attachments easier. Next, create a skin or make sure a skin is [active](#Active-skin), then select your attachments and choose `New...` `Skin Placeholder`. This will create a skin placeholder for each attachment using the same name and the attachments are moved under the skin placeholder for the active skin.

![](/img/spine-user-guide/skins/convert-placeholder.png)

If needed, [find and replace](/spine-tree#Find-and-replace) can be used to fix up the attachment names. For example, to add the skin name as a subfolder prefix, like `skinName/imageName`.

## Similar skins

When a new skin will be similar to an existing skin, it can be helpful to duplicate the existing skin, which also duplicates all its attachments, then modify the new skin.

If dragging images or attachments to the skin placeholders for the new skin, dropping them on an existing attachment will copy its transform, while dropping them on the skin placeholder will not.

[Find and replace](/spine-tree#Find-and-replace) can be used to quickly rename all the attachments in the new skin. If your images are the same size and use a naming convention (for example `skinName/imageName`), find and replace may be the only step needed to fully setup a new skin.

## Programmatic skins

If you find yourself creating a large number of skins using find and replace, you may benefit from using a different solution. There is no need to tediously create everything in the Spine project if it can derived using a simple pattern or naming convention.

If your skins only differ by the attachment names, work with your programmers to create a [runtime solution](/spine-runtime-skins). One approach is to create only a single skin in the Spine editor. Then, at runtime, code is written that duplicates the skin and changes the names as needed.

## Removing skin placeholders

If skin placeholders are no longer desired, it would be tedious to move the attachment to the slot and delete each skin placeholder. Instead, select the skin placeholders and click delete in the tree properties. On the delete dialog, check `Keep current attachment`. This will move the attachments for the active skin to the slot before deleting the skin placeholders. Attachments in any other skins are deleted.

![](/img/spine-user-guide/skins/delete.png)

## Mix and match

Simple projects may use skins so each skin outfits the entire skeleton. More complex projects may use skins to group attachments, where each skin is an individual item or body part, then multiple skins are made visible at once to outfit the skeleton. Our [mix-and-match example project](/spine-examples-mix-and-match) uses this approach.

In the Spine editor, the [skins view](/spine-skins-view) allows multiple skins to be visible at the same time. [At runtime](/spine-runtime-skins), it is done by creating a skin and adding multiple skins to it.

# Video

[youtube:xY4m3iNtSUQ]
[youtube:81XU7Uqpm6E]
[youtube:Jkd7Q5nkzX8]

[Next: Constraints](/spine-constraints)
[Previous: Path attachments](/spine-paths)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-sliders.md
## Title: Sliders - Spine User Guide
## URL: http://esotericsoftware.com/spine-sliders
---

# Sliders 

<callout>Sliders are not available in Spine Essential.</callout>

A slider constraints a [skeleton](/spine-skeletons) to an [animation](/spine-animations).

Sliders can also use the movement of a source bone to determine the frame of the animation to display, unlocking many powerful rigging possibilities.

# Setup

To create a slider, select an animation from the Animations node, then click `New...` `Slider`. 

![](/img/spine-user-guide/slider/setup.png)

# Properties

![](/img/spine-user-guide/slider/properties.png)

## Animation

This shows the constrained animation. 

Right clicking the animation name will select that animation.

A different animation can be chosen by clicking the pencil icon. This clears the constrained animation and allows a new animation to be chosen.


## Loop

When checked, the constrained animation repeats in a loop beyond the frames of the animation.

When unchecked, the constrained animation displays the first frame for any negative frame selected in the slider, and the last frame for any frame that is greater than the length of the animation.


## Additive

When checked, the existing pose is added to the slider animation. This means the resulting animation is relative to the constrained animation's pose before the transform constraint is applied.

When unchecked, the transform of the constrained bones is modified to match the source bone's transform. This means when the mix is 100, the constrained bone's transform before the transform constraint is applied has no affect on the resulting transform.

## Frame

The frame slider controls the frame of the constrained animation to display. This slider can be [keyed](/spine-keys) in other animations.

![](/img/spine-user-guide/slider/slider-bone.png)

## Bone

This shows the source bone. When one bone is constrained, clicking the bones selects it.

A different bone can be chosen by clicking the pencil icon. This clears the constrained bone and allows a new bone to be chosen.

When a bone is selected, the Frame slider is hidden, and the options Locan and Property are displayed.

## Local

When checked, the local transform of the sorce bone is used.

When unchecked, the world transform is used instead.

## Property

Property is used to map the range of a transform to the frames of the animation. A drop-down menu allows to choose the desired bone transform. the numbers on the left of the arrow represent the two limits of the source bone range. The numbers on the right allow to choose the first and last frame of the animation to match the range of the bone.

## Mix

The mix slider controls the percentage of influence of the slider, see [constraint mix](/spine-constraints#Mix). The mix can be [keyed](/spine-keys#Transform-constraints).


[Previous: Physics constraints](/spine-physics-constraints)
[Next: Events](/spine-events)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-slot-color.md
## Title: Slot Color view - Spine User Guide
## URL: http://esotericsoftware.com/spine-slot-color
---

# Slot Color view

The slot color view provides a color chooser for the currently selected slots.

![](/img/spine-user-guide/slot-color/view.png)

This can be more convenient than using the [slot color button](/spine-slots#Color) because slot colors can be adjusted without opening and closing a dialog. Also, when an attachment is selected the slot color view sets the color for the attachment's slot. This saves needing to select the slot.

The contents of the slot color view adapts to the view's size. When sized larger, the hue, saturation, brightness, red, green, blue, and alpha controls are visible. When sized smaller, the controls are hidden.

![](/img/spine-user-guide/slot-color/small.png)

[Next: Timeline view](/spine-timeline)
[Previous: Skins view](/spine-skins-view)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-slots.md
## Title: Slots - Spine User Guide
## URL: http://esotericsoftware.com/spine-slots
---

# Slots

<callout>The attachment that is visible for a slot can be [keyed](/spine-keys#Slot-attachment) in animations.</callout>

A slot is parented to a [bone](/spine-bones) is a container for [attachments](/spine-attachments), where only one attachment (or none) can be visible at any given time. Slots are very important for many reasons, even if at first they may be difficult to appreciate. A slot is only conceptual, it does not have a position and it is not drawn.

# Draw order

The draw order for a skeleton is a list of slots, where attachments for slots higher in the list are drawn on top of those below. The draw order can be seen under the skeleton in the tree.

![](/img/spine-user-guide/slots/draworder.png)

Slots group attachments of the same type. For example, a `weapon` slot may have a `knife`, `sword`, `axe`, etc. Since only the `weapon` slot appears in the draw order, the draw order list stays concise even if the skeleton has hundreds or thousands of weapons.

Slots also decouple bones from the draw order, allowing attachments on the same bone to be drawn above and below an attachment on a different bone. For example, the torso bone has slots `belly` and `shirt`, the hip bone has slot `pants`. Slots allow `belly` to be drawn under `pants` and `shirt` to be drawn above `pants`, even though both `belly` and `shirt` are on the same bone.

## Changing the draw order

<callout>When using an image editor [script](/spine-images#Scripts) the images will be imported into Spine under slots that already have the correct draw order.</callout>

Slots in the draw order can dragged up or down and the draw order can be [keyed](/spine-keys#Draw-order).

Alternatively, the plus (`+`) or minus (`-`) keys on your keyboard will change the draw order of the slot for the current selection. Rather than finding a slot in the tree, it can be convenient to select an attachment in the viewport, then use these hotkeys to adjust the draw order for the attachment's slot. Hold `shift` to jump by 5.

![](/img/spine-user-guide/slots/draworder1.png)
![](/img/spine-user-guide/slots/draworder2.png)

Here the `eye` slot was moved from above the `googles` slot to below it in the draw order.

### Tree filter

Adjusting the draw order can be made easier by using the [filter buttons](/spine-tree#Filter-buttons) in the upper left of the tree view to hide bones and attachments, leaving only slots visible in the tree under the `Slots` node. These slots represent the draw order and can be dragged up or down.

![](/img/spine-user-guide/slots/filter.png)

Normally when an attachment is selected in the viewport, it is also selected in the tree. When the tree is filtered so it doesn't contain attachments, the slot is selected in the tree instead, which instantly shows you where the slot is within the draw order.

# Properties

![](/img/spine-user-guide/slots/properties.png)

## Color

<callout>The [slot color view](/spine-slot-color) makes setting the slot color faster and more convenient than clicking the color button.</callout>

The slot color tints the slot's attachment, controls the attachment's alpha (opacity), and can be [keyed](/spine-keys#Slot-color). Attachments have their own, separate [color](/spine-attachments#Color) but it cannot be keyed.

The left half of the color button shows the color with alpha. The right half of the button shows the opaque color. Click the button to change the color and alpha.

<callout>Setting the alpha to zero to make an attachment invisible is not an efficient way to hide the attachment. Most game toolkits spend the same effort drawing an image with zero alpha as they do drawing an image that can be seen.

It is better to hide an attachment by setting a [slot attachment key](/spine-keys#Slot-attachment). To avoid an abrupt disappearance, the slot color can be used to fade to transparent before hiding.</callout>


![](/img/spine-user-guide/key-frames/color-alpha.png)

When the color and alpha have been [separated](/spine-keys#Separate-color-and-alpha) for an animation, two color buttons appear. Clicking either button opens the same slot color dialog which can change either the alpha, color, or both.

![](/img/spine-user-guide/slots/separate-buttons.png)

## Tint black

Tint black enables tinting an image's dark colors separately from its light colors. When used with grayscale images, this can achieve a wide variety of colored images. It also allows for effects such as a solid color silhouette, inverted colors, Super Mario invincibility star flashing, and more. Additional effects can be achieved when using the additive, screen, or multiply blend modes.

Tint black is enabled by checking `Tint Black` for a slot and causes a second color button to appear.

![](/img/spine-user-guide/slots/tintblack.png)

The first color button sets the "light" color, which tints the lighter portions of the image and controls opacity. The second color button sets the "dark" color, which tints the darker portions of the image. The light and dark colors can be [keyed](/spine-keys#Slot-color).

<table class="colortable">
<tr><th>Light</th><th>Dark</th><th>Image</th><th>Description</th></tr>
<tr><td style="background:#fff"></td><td style="background:#000"></td><td>!! <img style="margin:0" class="no-borders" src="/img/spine-user-guide/attachments/image.png"></td><td>The original black and white image.</td></tr>
<tr><td style="background:rgb(63,0,0)"></td><td style="background:rgb(0,0,0)"></td><td>!! <img style="margin:0" class="no-borders" src="/img/spine-user-guide/attachments/red-1-color.png"></td><td>Without tint black, the light color set to red. The black and white image is tinted uniformly with red, resulting in shades of the same red.</td></tr>
<tr><td  style="background:rgb(255,146,141)"></td><td  style="background:rgb(63,0,0)"></td><td><img style="margin:0" class="no-borders" src="/img/spine-user-guide/attachments/red-2-color.png"></td><td>With tint black, the light color set to salmon pink and the dark color to red. The image is not simply shades of the same color, so it has much more visual interest.</td></tr>
<tr><td  style="background:rgb(3,14,59)"></td><td  style="background:rgb(194,255,251)"></td><td><img style="margin:0" class="no-borders" src="/img/spine-user-guide/attachments/highlight-2-color.png"></td><td>With tint black, the light color set to blue and the dark color to light blue. Inverse colors, a solid color silhouette, flashing, and other effects can be achieved.</td></tr>
</table>
<style>.colortable td{vertical-align:middle}</style>!!

See the tint blank [example projects](/spine-examples#Tint-blank) for usage examples.

## Blending

<callout>The Photoshop [script](/spine-images#Scripts) will set the blending mode for slots it creates using the Photoshop layer's blending mode.</callout>

Blending controls how the slot attachment's pixels are combined with the pixels below:
* `Normal` is the default setting, normal blending is applied.
* `Additive` corresponds to Linear Dodge in Photoshop.
* `Multiply` corresponds to Multiply in Photoshop.
* `Screen` corresponds to Screen in Photoshop.

Blending modes other than `Normal` may affect performance for some game toolkits by increasing [draw calls](/spine-metrics#Draw-calls). Some game toolkits can avoid increased draw calls when using `Additive` and rendering with premultiplied alpha.

## Separate color and alpha

In animate mode, an additional row appears in the slot properties.

![](/img/spine-user-guide/slots/separate.png)

The `Alpha` checkbox allows color (RGB) and alpha (A) to be keyed separately for the current animation. See [separate color and alpha](/spine-keys#Separate-color-and-alpha) for more information.

# Hiding slots

![](/img/spine-user-guide/slots/slot-visibility.png)

Like bones, slots have a visibility dot in the tree. When hidden, attachments for the slot will not be drawn in the viewport and won't appear in image or video exports. However, this can't be keyed and the slot's attachments will still appear in data exports.

<callout>If you've hidden many slots or bones, `ctrl+H` will show them all again.</callout>

Hiding a slot's attachments is intended only for temporarily reducing clutter in the viewport and cannot be keyed. You may want to [hide](/spine-attachments#Hiding-attachments) the slot's attachment and [key it](/spine-keys#Slot-attachment) instead.

Right clicking a bone's visibility dot will toggle hiding the bone and all child bones and slots.

All attachments can be hidden in the viewport using the [viewport options](/spine-tools#Viewport-options).

# Folders

Slots can be organized into folders. To create a folder, select a slot and click `New...` `Folder`. Slots can be moved between folders by dragging them.

In exported skeleton data, folder names are prepended to the slot name to create the final name used in the Spine Runtimes. For example, if the folder `hair` has a subfolder `long` which has a slot `hair-strand-1`, then the slot name at runtime is `hair/long/hair-strand-1`.

[Next: Images](/spine-images)
[Previous: Bones](/spine-bones)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-texture-packer.md
## Title: Texture packing - Spine User Guide
## URL: http://esotericsoftware.com/spine-texture-packer
---

# Texture packing

Spine can pack your individual images into a texture atlas or grid (spritesheet) for more efficient rendering at runtime. Spine's texture packer is a general purpose tool. While it can be used for your Spine skeletons, it can also be run separately to pack all the images for your applications.

In most graphics APIs (for example, OpenGL), a texture is bound, some drawing is done, another texture is bound, more drawing is done, and so on. Binding the texture is relatively expensive, so it is ideal to store many smaller images on a larger image, bind the larger texture once, then draw portions of it many times. Spine can efficiently pack many smaller images into larger images, resulting in what is called a "texture atlas".

Spine uses multiple advanced packing algorithms. Packing is done with numerous heuristics at various sizes and the most efficient result is chosen.

<img src="/img/spine-user-guide/texture-packer/raptor-atlas.png" class="no-borders">!!

# Texture atlas files

A texture atlas consists of a text file with an `.atlas` file extension and one or more image files, called atlas "page images". The atlas file [describes](/spine-atlas-format) the locations within the page images of each of the packed smaller images, called atlas "regions". The regions are referenced in the atlas file by name.

A single texture atlas can have many page images, allowing all the images for an application to be packed into a single atlas. The only reason to use multiple atlases is when some of the images don't need to be loaded at the same time.

# Packing

<callout>Texture packing can also be done using the [command line interface](/spine-command-line-interface).</callout>

The texture packer can be run two ways:

## Packing during data export

When exporting [JSON](/spine-export#JSON) or [binary](/spine-export#Binary), check `Pack`:

![](/img/spine-user-guide/texture-packer/create-atlas.png)

Two options are provided for how to find the images files to pack:

* `Attachments` When chosen, only the image files used by attachments are packed. Any [pack.json](#JSON-Configuration) files are not used.
* `Image folders` When chosen, the image files found in each skeleton's [images path](/spine-images#Images-path) are packed. This allows use of a [pack.json](#JSON-Configuration) file to configure packing for each folder.

Two options are provided for how texture atlases are created:

* `Atlas per skeleton` An atlas is packed for each skeleton. Each atlas is named using the skeleton name, which matches the name of the corresponding skeleton data file.
* `Single atlas` The images for all the skeletons are packed into a single atlas. The atlas is named using the name of the project file without the file extension.

The `Pack Settings` button configures the texture packer settings.

This is a convenient way to export both the skeleton data and the texture atlas at the same time. However, it can be more flexible to run the texture packer separately.

## Running the texture packer separately

Choose `Texture Packer` from the main menu:

![](/img/spine-user-guide/texture-packer/menu.png)

On the texture packer dialog, specify the folder containing the images to pack, where to write the atlas files, and the name of the atlas.

![](/img/spine-user-guide/texture-packer/dialog.png)

The `Settings` button configures the texture packer settings.

# Settings

The texture packer has many settings to control how images are packed.

![](/img/spine-user-guide/texture-packer/settings.png)

This dialog can be intimidating at first, but many settings can be left at their defaults. Some notable settings:

* Max width and height. This determines how much can fit on a single atlas page image.
* Packing rectangles or polygons. Packing polygons is more efficient but slower and requires knowing the project file for context.
* Premultiplied alpha. This setting should match how the images are rendered at runtime.
* Strip whitespace.
* Scale.

## Regions

!table Setting, Description

!row Strip whitespace X/Y
Removes blank pixels around the edges of the input images. The amount removed is stored in the atlas data so the images can be drawn in your application as if they were not whitespace stripped.

!row Rotation
More efficient packing is achieved by rotating some images 90 degrees. Applications must take special care to draw these regions properly.

!row Alias
Two images that are pixel for pixel the same will only be packed once.

!row Ignore blank images
Images that are only transparent pixels will not be packed.

!row Alpha threshold
Alpha values below this are treated as zero when whitespace is stripped.

!table

## Region padding

!table Setting, Description

!row Padding X/Y
The number of pixels between packed images. Some texture filtering averages neighboring pixels, so a padding of 2 is recommended to avoid neighboring regions from affecting each other.

!row Edge padding
The padding will also be applied to the edge of the page images.

!row Duplicate padding
The padding will copy pixels from the closest region. This can hide "seam" artifacts if texture filtering selects padding pixels.</p><p>When whitespace stripping, duplicate padding is only applied on edges that have non-whitespace pixels. When packing polygons, duplicate padding is only applied to images used by a region attachment or by a mesh attachment that covers the entire image.

!table

## Pages

!table Setting, Description

!row Min width/height
The smallest size for any page image.

!row Max width/height
The maximum size of any page image. If the images don't fit in a page this size, multiple page images are output.

!row Power of two
Makes the output page dimensions a power of two. This is a requirement for some game toolkits.

!row Divisible by 4
Makes the output page dimensions divisible by 4. This is a requirement for some texture compression algorithms.

!row Square
Makes the width and height equal. This is a requirement for some texture compression algorithms (eg, PVRT).

!table

## Runtime

These settings are hints intended for the application loading the data to optionally apply at runtime.

!table Setting, Description

!row Filter min/mag
The texture minification and magnification settings.

!row Wrap X/Y
The texture wrap settings.

!row Format
The in-memory format.

!table

## Output

!table Setting, Description

!row Format
Output PNG or JPG pages.

!row JPG quality
The compression for JPG output.

!row Packing
Determines how the images are packed.
* `Grid` packs the images in a uniform grid (as known as a spritesheet).
* `Rectangles` packs the images using their rectangles.
* `Polygons` packs the images as tightly as possible, using mesh hulls from the Spine project.

!row Premultiply alpha
Multiplies pixel RGB values by the alpha value. Rendering the images at runtime must also use premultiplied alpha. This is recommended for [correct blending](/forum/d/3132-premultiplied-alpha-guide/2).

!row Bleed
Sets RGB values for transparent pixels to the RGB values of the nearest non-transparent pixels. When not using premultiplied alpha at runtime, this prevents texture [filtering artifacts](/forum/d/2765-why-is-bleed-an-option-black-lines-around-sprites/3) when RGB values are sampled for transparent pixels.

!row Scale
An entire atlas is output for each scale specified.

!row Suffix
The suffix for each scaled atlas. If blank, files for multiple scales will be output with the same name to a subfolder for each scale.

!row Resample
The algorithm to use for scaling.

!table

## Options

!table Setting, Description

!row Atlas extension
The file extension for the atlas data file.

!row Combine subdirectories
The current folder and all subfolders are packed on to the same pages. Any subfolder containing a `pack.json` file will not be combined.

!row Flatten paths
Subfolders are stripped from region file names. Image file names should be unique.

!row Indexes
Image names are stripped of everything after the last underscore. See [image indexes](#Image-indexes).

!row Legacy output
Writes the atlas file in a format that can be read by Spine Runtimes versions prior to 4.0.

!row Debug
Lines are drawn on the output pages to show the packed image bounds.

!row Auto Scale
Scale is reduced until all the images fit on one atlas page (slow).

!row Fast
Packing will not be as efficient but will execute much faster.

!row Limit memory
When unchecked, all images are loaded to memory at the same time to increase packing speed. Spine may crash if not enough memory is available.

!row Pretty print
The atlas file is written with extra whitespace to make it easier for a human to read.

!row Current project
When checked, mesh UVs for mesh image files in the current project are used to strip whitespace.

When packing as part of data export, this setting is ignored and meshes in the current project are always used to strip whitespace.


!table

## Other

These settings are not available on the settings dialog and may only be specified in the JSON configuration file.

!table Setting, Description

!row ignore
Images in this folder and any subfolders will not be packed.

!row bleedIterations
The number of times bleed is applied. Defaults to 2.

!row separator
The string to use when appending numbers to file names. Defaults to underscore (`_`).

!table

# Folder structure

<callout>When [packing during data export](#Packing-during-data-export) and `Attachments` is chosen, the folder structure is not used.</callout>

Spine can pack all images for an application in one shot. Given a folder, it recursively scans for image files. For each folder of images Spine encounters, it packs the images on to a larger page image. If the images in a folder don't fit on the maximum size of a single page, multiple pages will be used.

Images in the same folder go on the same set of pages. If all images fit on a single page, subfolders should not be used because with it is most efficient to have all the images on a single page. Otherwise, subfolders can be used to segregate related images to minimize texture binds.

![](/img/spine-user-guide/texture-packer/folder-structure.png)

For example, an application may want to place all the "game" images in a separate folder from the "pause menu" images, since these two sets of images are drawn serially: all the game images are drawn (one bind), then the pause menu is drawn on top (another bind). If the images were in a single folder that resulted in more than one page, each page could contain a mix of game and pause menu images. This would cause many texture binds to render the game and pause menu instead of just one each.

Subfolders are also useful to group images with related texture settings. Settings like runtime memory format (RGBA, RGB, etc) and filtering (nearest, linear, etc) are per texture. Images that need different per texture settings need to go on separate pages, so should be placed in separate subfolders.

To use subfolders for organization rather than for controlling which images are grouped together on a page, see the `Combine subdirectories` setting.

To avoid subfolder paths being used in region names in the atlas file, see the `Flatten paths` setting.

![](/img/spine-user-guide/texture-packer/folder-checkboxes.png)

# JSON Configuration

<callout>When [packing during data export](#Packing-during-data-export) and `Attachments` is chosen, the `pack.json` files are not used.</callout>

Each folder may contain a `pack.json` file to specify settings for that folder. Each subfolder inherits all the settings from its parent folder. Any settings set in the subfolder override those set in the parent folder.

A `pack.json` file can be created using Spine by clicking on the `Save` button at the bottom of the `Texture Packer Settings` dialog.

![](/img/spine-user-guide/command-line-interface/save-packer-settings.png)

Below is a JSON example with every available setting. Double quotes are optional in most cases.
```
{
stripWhitespaceX: true,
stripWhitespaceY: true,
rotation: true,
alias: true,
ignoreBlankImages: false,
alphaThreshold: 3,
minWidth: 16,
minHeight: 16,
maxWidth: 2048,
maxHeight: 2048,
pot: false,
multipleOfFour: false,
square: false,
outputFormat: png,
jpegQuality: 0.9,
premultiplyAlpha: true,
bleed: false,
bleedIterations: 2,
scale: [ 1 ],
scaleSuffix: [  ],
scaleResampling: [ bicubic ],
paddingX: 2,
paddingY: 2,
edgePadding: true,
duplicatePadding: false,
filterMin: Linear,
filterMag: Linear,
wrapX: ClampToEdge,
wrapY: ClampToEdge,
format: RGBA8888,
atlasExtension: .atlas,
combineSubdirectories: false,
flattenPaths: false,
useIndexes: false,
debug: false,
fast: false,
limitMemory: true,
currentProject: true,
packing: rectangles,
silent: false,
ignore: false
}
```

Not all settings need to be specified, any or all may be omitted. For example, to turn off padding and combining subfolders, this JSON can be used:
```
{
paddingX: 0,
paddingY: 0,
combineSubdirectories: false
}
```

To ignore all images in a folder and all subfolders:
```
{
ignore: true
}
```

## Texture atlas name

The texture atlas name is used to name the atlas and PNG files. For example, if the texture atlas name is `skeleton` then the atlas files would be named `skeleton.atlas`, `skeleton.png`, `skeleton2.png`, etc.

# Ninepatches

Ninepatches are not generally useful for Spine skeletons, but can be useful for other purposes.

If an image file name ends with ".9" just before the file extension, it is considered a ninepatch. Ninepatch images can be created manually or by using [this tool](http://developer.android.com/tools/help/draw9patch.html). The image must have a 1px transparent border. The upper and left edge may optionally have one contiguous line of black pixels which denote the split information, ie what part of the ninepatch will stretch. The bottom and right edge may optionally have one contiguous line of black pixels which denote the padding information, meaning how content on top of the ninepatch should be inset. When this image is packed, the 1px border is removed and the split and padding information stored in the atlas data file.

# Image indexes

Image indexes are not generally useful for Spine skeletons, but can be useful for other purposes.

If an image file name ends with underscore and then a number (eg `animation_23.png`), the number is considered the "index" and is stored for the region in the atlas data file. The image name is stored without the underscore and index. This allows a list of images with the same name to be retrieved, ordered by index, to make it easy to pack frame-by-frame animations without losing the order of the frames.

# Texture Unpacker

Spine provides a texture unpacking utility which takes a texture atlas and writes out individual images from it. Any rotation in the atlas is undone and any stripped whitespace is restored in the individual images.

![](/img/spine-user-guide/texture-packer/unpacker.png)

<callout>Texture unpacking can also be done using the [command line interface](spine-command-line-interface#Unpack).</callout>

Enter the path to the `Atlas` file and the `Output folder`, which is the path to the folder where you want the unpacked images to be stored.
Check `Unpremultiply alpha` if the atlas was packed with [premultiplied alpha](/spine-texture-packer#Premultiply-alpha). If the atlas file has "[pma:true](/spine-atlas-format#Page-sections)", that will be used instead of this checkbox.

[Next: Import](/spine-import)
[Previous: Export](/spine-export)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-timeline.md
## Title: Timeline view - Spine User Guide
## URL: http://esotericsoftware.com/spine-timeline
---

# Timeline view

The timeline view shows the [timeline](/spine-keys#Timeline), just like the graph, dopesheet, and audio views.

![](/img/spine-user-guide/timeline/timeline-view.png)

The timeline view allows the timeline to be placed closer to your work area. For example, if the dopesheet or graph is placed to the side of the viewport, the timeline they provide may be near the top of the Spine window. The timeline view can be placed under the viewport to reduce how far the mouse needs to be moved.

![](/img/spine-user-guide/timeline/timeline-view-screen.png)

[Next: Tree view](/spine-tree)
[Previous: Slot Color view](/spine-slot-color)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-tools.md
## Title: Tools - Spine User Guide
## URL: http://esotericsoftware.com/spine-tools
---

# Tools

Tools in Spine are found in the main toolbar:

![](/img/spine-user-guide/tools/toolbar.png)

Right clicking anywhere in the viewport will toggle between the current tool and the last selected tool. This makes using multiple tools more efficient as it is much faster than clicking the toolbar buttons. Otherwise there are default hotkeys for switching tools:

<table class="layout"><tr><td>
	<table>
	<tr><td>Pose</td><td>B</td></tr>
	<tr><td>Create</td><td>N</td></tr>
	<tr><td>Weights</td><td>G</td></tr>
	</table>
</td><td style="width:1em"></td><td>
	<table>
	<tr><td>Rotate</td><td>C</td></tr>
	<tr><td>Translate</td><td>V</td></tr>
	<tr><td>Scale</td><td>X</td></tr>
	<tr><td>Shear</td><td>Z</td></tr>
	</table>
</td></tr></table>

# Selection

Instead of a dedicated selection tool, Spine uses a smart selection system. Selecting an item in the viewport is done by simply clicking the item you want to select. With most tools, starting a drag on an unselected item will both select that item and begin manipulating it.

To select multiple items, hold `ctrl` (`cmd` on Mac) and click each item. To box select, hold `ctrl` (`cmd` on Mac) and drag. When nothing is selected, box selection can be done by dragging in empty space. Dragging with the middle mouse button will always box select, without needing to start in empty space.

## Deselect

Clearing the selection is often unnecessary but can be done by pressing `spacebar`, `escape`, or by double clicking anywhere in the viewport. It can be useful to deselect, then drag in an empty area to box select.

## Selection history

It is very common to need to select the same objects that you recently had selected. Finding and selecting them again is very slow, so Spine remembers your selections and you can navigate through them using `page down` and `page up`. This greatly reduces tedious hunting in the viewport and scrolling in the tree view.

## Selection groups

Selections can be stored by pressing `ctrl+1` (`cmd+1` on Mac), where `1` can be any of the number keys, 0-9. The selection can later be recalled by pressing the number key without holding `ctrl` (or `cmd`). Selection groups can save a lot of time when the same selections are needed often. For example, for a humanoid skeleton selection groups could be stored for the torso, head, arms and legs.

# Transform tools

The `Rotate`, `Translate`, `Scale`, and `Shear` tools each work similarly. The selected item is adjusted by dragging the mouse. The drag should start in empty space or on the item itself. If the drag starts on a different item, that item will be selected and adjusted.

Making adjustments by dragging in empty space reduces fatigue from using the mouse to animate for long hours. Adjustments are quick and precise, without requiring precise interaction with small control handles.

## Numeric entry

Each transform tool has a numeric display whose values depend on the selected axes. New values can be typed and will take effect when enter or tab is pressed.

![](/img/spine-user-guide/tools/transform.png)

<callout>A quick way to key a bone's full rotation in animate mode is to set the axis to `Local`, key the initial position, then move to the frame where the rotation should end and type `+360` or `+-360`.</callout>

Relative values can be entered by starting the number with `+`, for example `+123`. Relative negative values must also start with a plus, for example `+-123`.
Multiplications and divisions can be performed by starting the number respectively with `*` or `/`, for example `*2`.

The mouse can be used to change the value by scrolling the mouse wheel while over the number or by dragging up or down. Hold `shift` while using the mouse wheel or dragging to adjust the value in smaller increments.

The arrow keys can be used to change the value for the selected transform tool. Hold `shift` while using the arrow keys to adjust the value in smaller increments.

## Axes

The `Local`, `Parent`, and `World` axes determine the numeric values shown for rotation, translation, and scale, as well as the direction of the axes shown in the viewport. This gives more control over how items are transformed.

![](/img/spine-user-guide/tools/axes.png)

Rotation, scale, and shear values are stored using `Local` axes. Translation values are stored using `Parent` axes. When other axes are chosen, the stored values are converted to and from the chosen axes. How the chosen axes affects the numeric values shown for each transform tool is explained below.

## Rotate tool

The pivot point for rotating a bone is always the bone's origin. `shift` can be held while dragging to constrain rotation to 15 degree increments.

**Axes:**
* `Local`: The value is the counterclockwise rotation relative to the item's parent, where 0 is pointing the same direction as the parent's X axis.
* `Parent`: Rotation is not affected by choosing `Parent` axes. Local rotation is shown.
* `World`: The value is the counterclockwise world rotation, where 0 is to the right, 90 is up, 180 is left, and 270 is down.

For bones, rotation in setup mode is limited to 0-360 degrees, indicating which direction the bone is pointing. In animate mode, local rotation can be outside that range, indicating both the direction of rotation and the number of complete rotations the bone will make. However, be wary that when `World` axes are selected, the rotation is limited to 0-360 degrees even in animate mode because it indicates which direction the bone is pointing in world coordinates. In that case the `World` axes button is highlighted orange as a reminder while typing a rotation value.

## Translate tool

The X or Y handles on the `Translate` tool icon in the viewport can be dragged to restrict translation to a single axis.

**Axes:**
* `Local`: The value is the distance to the item's parent using the item's local axes. The X axis points in the direction of the item's rotation.
* `Parent`: The value is also the distance to the item's parent, but using the parent's local axes. The X axis points in the direction of the parent's rotation.
* `World`: The value is the distance to the world origin.

Translating multiple bones by `Local` or `Parent` axes can be useful to move the bones in different directions the same amount. For example, to make both arms longer.

![](/img/spine-user-guide/tools/translate.png)

Here the lower arms have been translated along the parent's X axis by choosing `Parent` axes and then dragging the red X axis arrow on the `Translate` tool icon.

## Scale tool

The X or Y handles on the `Scale` tool icon in the viewport can be dragged to restrict scaling to a single axis.

**Axes:**
* `Local`: The value is the local scale to apply. The X axis points in the direction of the item's rotation.
* `Parent`: Scale is not affected by choosing `Parent` axes. Local scale is shown.
* `World`: The value is the combined scale of the item and all parent bones.

Scale is always applied using the item's local axes. The X axis (red) for scaling always points in the direction of the item's rotation.

The world scale cannot be edited directly. When the scale text boxes are focused, the values change to local and the value entered is used as local scale. In that case the `Local` axes button is highlighted orange as a reminder while typing a scale value.

Flipping is achieved by scaling one or both axes to -1.

### Scale examples

![](/img/spine-user-guide/tools/scale-uniform.png)

Here spineboy's torso has been scaled down. The child bones of the torso inherit the scale from their parent and are also scaled down.

![](/img/spine-user-guide/tools/scale-flipped.png)

Here spineboy's torso has been scaled on the Y axis (green) to -1. That causes the Y axis to point in the opposite direction, without changing its size.

![](/img/spine-user-guide/tools/scale-nonuniform.png)

Here spineboy's torso has been scaled down, but only on the Y axis. When the X and Y scales have different values, it is called nonuniform scale. The child bones inherit the scale as before, but since the parent scale squashes them in the parent's Y direction, the child bones are sheared (skewed).

![](/img/spine-user-guide/tools/scale-shear.png)

The Y axis is normally 90 degrees to the X axis. Here spineboy's arm is selected to show that the torso bone's scale has sheared the child arm bone, changing the angle between the X and Y axes.

## Shear tool

<callout>Shear can be applied to an entire hierarchy of bones and is easier to apply than using deform keys or mesh weights. Also, shear is available in Spine Essential while meshes and weights require Spine Professional.</callout>

The X or Y handles on the `Shear` tool icon in the viewport can be dragged to adjust the angle between X and Y axes, causing attachments to be skewed.

Similar to scaling, shearing causes child bones and attachments to deform and is most commonly used in small amounts for organic squash and stretch in animations (for example, see [spineboy's head](/img/spine-user-guide/tools/shear-example.gif)). The deformation from shearing differs from scaling and can help prevent animations from looking rigid or robotic.

![](/img/spine-user-guide/tools/shear.jpg)

## Pose tool

The `Pose` tool can adjust both bone translation and rotation, allowing for quick bone manipulation without switching tools. While most other tools work by selecting a bone, then dragging in empty space to manipulate the bone, the `Pose` tool requires dragging handles on the bones.

To translate a bone, move the mouse over the bone's origin so a translate icon appears, then drag. When multiple bones are selected, only the dragged bone is translated.

To rotate a bone, move the mouse anywhere over the bone, except over its origin, so a target icon appears at the tip of the bone, then drag. The bone will rotate to point at the target. When multiple bones are selected, IK (inverse kinematics) is used to rotate all the bones until the tip of the last bone reaches the target.

Unlike other tools, clicking in empty space deselects and dragging in empty space does box selection, making it easy to select multiple bones.

### Pose examples

![](/img/spine-user-guide/tools/pose.png)

Here the tail is being adjusted by the `Pose` tool.

Multiple sets of bones that do not have a common parent can be adjusted without losing the selection.

![](/img/spine-user-guide/tools/pose-multiple.png)

Here both arms and legs are selected. Any selected bone can be dragged to adjust only that limb, without losing the selection of the bones that aren't being adjusted.

## Bone length tool

In setup mode and when the `Rotate`, `Translate`, or `Scale` tool is active, placing the mouse over the tip of a selected bone allows the bone's length to be adjusted. Multiple bones can be adjusted at the same time. The bone length can also be adjusted numerically using the bone's [length property](/spine-bones#Length).

![](/img/spine-user-guide/tools/bone-length.png)

Here the length of the sword bone is being adjusted.

If the bone length tool appears when trying to select a different bone, [deselect](#Deselect) first.

Hold `alt` (`option` on Mac) while dragging to move the child bones the same amount.

# Other tools

## Weights tool

The `Weights` tool is used in combination with the weights view to set the influence bones have on a mesh's vertices. See the [weights view](/spine-weights) for more information.

## Create tool

<callout>Mesh [wireframe](/spine-meshes#Wireframe) can be enabled so mesh vertices can be seen when creating bones.</callout>

The `Create` tool creates new bones, which can only be done in setup mode. Before creating a new bone, first select the bone that will be the parent. Next, either click to create a zero length bone or drag to create a bone and set its length.

![](/img/spine-user-guide/tools/bones.png)

<callout>When choosing where to create bones, keep in mind that bones pivot around their origin when rotated.<br><br>In Spine there are no limitations for where a bone is created. Child bones are not required to have their origin at the tip of the parent bone.</callout>

To easily fix a bone that is not in the correct position, select the bone, then hold `alt` (`option` on Mac) and drag or click to recreate the bone. Any child bones or attachments will be unaffected.

After a bone is created, the new bone is selected. To create a sibling of the new bone, the parent bone must be selected again. If `shift` is held when creating a bone, the new bone is not selected, making it easier to add multiple sibling bones.

### Create workflow

Creating bones, naming them, and moving attachments under them can be a tedious process. Spine provides a workflow to reduce the effort required.

<callout>Some image editor [scripts](/spine-images#Scripts), such as the script for Photoshop, can create bones so when the JSON data is imported into Spine, the bones are already there.</callout>

First create attachments to use as a reference for where to place bones. To create a bone, select a bone that will be the parent, then hold `ctrl` (`cmd` on Mac) and click or drag to select one or more attachments that you want on the new bone. Next, release `ctrl` and click or drag to create the new bone.

By following this process, the slots for the selected attachments are moved to the new bone and the new bone is named using the slot of the first attachment selected. This greatly reduces the time needed to setup a skeleton.

# Compensation

Normally when a bone's transform is adjusted, any attachments and child bones are also affected. Compensation allows a bone to be adjusted without appearing to affect the attachments or child bones. For example, a bone can be moved or rotated without moving or rotating attachments or child bones. This is done by transforming the attachments or child bones an opposite amount. In animate mode, those attachments and child bones will need to be keyed.

![](/img/spine-user-guide/tools/compensate.png)

<callout>Be sure to disable compensation when it is no longer needed to avoid confusion. The buttons flash orange when compensation is applied.</callout>

To move a bone without affecting its attachments, first enable image compensation (the `Images` button). This transforms attachments an opposite amount so they appear to not have changed. In animate mode, compensation is not supported for region attachments and changes bone compensation makes to mesh attachments need [deform keys](/spine-keys#Deform-keys). Interpolation between keys may still cause the mesh vertices to move.

To move a bone without affecting child bones, first enable bone compensation (the `Bones` button). This transforms child bones an opposite amount so they appear to not have changed. In animate mode, the changes bone compensation makes to child bones need keys. Interpolation between keys may still cause the child bones to move.

When a bone has nonuniform scaling (meaning the X scale is not the same as the Y scale), due to how attachment positions are stored, image compensation may not be able to adjust attachments so they appear not to move.

# Pixels

Region attachments might appear blurry if not positioned accurately, especially with pixel art. When the Pixels setting is enabled, region attachments snap to the nearest screen pixel. Consequently, the fractional parts of the translation values are limited to either `.0` or `.5`, meaning any value after the decimal point is rounded to these increments.

# Auto key

![](/img/spine-user-guide/dopesheet/autokey.png)

See [auto key](/spine-keys#Auto-key).

# Viewport options

The viewport options panel provides convenient access to disabling selection, visibility, and name tags for bones and attachments. 

![](/img/spine-user-guide/tools/options.png)

The first column controls whether bones, region and mesh attachments, and other attachments can be selected. This can make some tasks easier by preventing accidental selection. Items can still be selected by clicking them in the tree.

The second column controls visibility of bones, region and mesh attachments, and other attachments. It is often useful to hide bones to reduce clutter while animating. When bones are hidden, they can still be selected and appear when under the mouse cursor. 

The third column controls visibility of name tags for bones, region and mesh attachments, and other attachments. Name tags increase the amount of clutter for complex skeletons, but can make it much easier to find a specific bone or attachment. A name tag may be clicked to select the item.

# Rulers

<callout>Guides will be added to the rulers in a future version of Spine.</callout>

Rulers can be shown by clicking the ruler button above the [zoom slider](/spine-getting-started#Zoom) in the viewport. A red line on each ruler alongside a numeric value show the mouse position for that axis, which can help with alignment. The ruler units are in world coordinates, which correspond to pixels for images that have not been scaled.

![](/img/spine-user-guide/tools/rulers.jpg)

# Copy/paste

Bone transforms, attachment transforms, and vertex positions can be copied by selecting them and pressing `ctrl+C` (`cmd+C` on Mac). The copied information can later be applied to the same or different bones, attachments, or vertices by selecting them and pressing `ctrl+V` (`cmd+V` on Mac) to paste.

When copying, both the world and local positions are stored. When pasting, either `World` or `Local` axes must be chosen to apply the world or local positions.

#### Bone transforms

Pasting bone transforms sets the bone rotation, translation, scale, and shear. The bone hierarchy is used when applying the copied bone transforms. This can be useful to make one limb match another, or to copy all or part of a pose from one animation frame to another.

#### Attachment transforms

Pasting attachment transforms sets the attachment rotation, translation, and scale. This can also be achieved by dragging an attachment and dropping it on another attachment in the tree.

#### Vertex positions

Pasting vertex positions works for meshes, paths, bounding boxes, and clipping attachments. Vertex positions can be pasted to a different attachment, as long as the same number of vertices is selected. Also, the order the vertices were selected before copying and before pasting should match the order you want the positions to be applied.

![vertex-copy](/img/blog/3.7-vertex-copy-paste.gif)

# Video

Part 1:
[youtube:5zaNa7t_7N0&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

Part 2:
[youtube:tXP4rz6LIVw&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[Next: Keys](/spine-keys)
[Previous: Images](/spine-images)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-transform-constraints.md
## Title: Transform constraints - Spine User Guide
## URL: http://esotericsoftware.com/spine-transform-constraints
---

# Transform constraints

<callout>Transform constraints are not available in Spine Essential.</callout>

A transform constraint copies a bone's world rotation, translation, scale, and/or shear (it's [transform](/spine-bones#Bone-transforms)) to one or more other bones.

Transform constraints have many clever uses for advanced rigging. The simplest is moving a bone and having other bones also move. It can be used to simulate a bone having a different parent, for example to take off a hat, equip a weapon, or [throw an object](/img/spine-user-guide/tools/shear-example.gif). Interesting effects can be created by constraining only a subset of the transform, for example only scale or shear. A bone can be positioned automatically at any percentage of the distance between two other bones, and more.

See the transform constraint [demo](/spine-demos#Transform-constraints), [example projects](/spine-examples#Transform-Constraints), and [tips](/spine-tips#Transform-Constraints) for usage examples.

# Setup

To create a transform constraint, select any number of bones to be constrained, then click `New...` `Transform Constraint` to enter choose target mode. Choose the target bone by either clicking an existing bone or click in empty space to create a new bone. The target bone cannot be a descendant of the constrained bones.

![](/img/spine-user-guide/transform/setup.png)

# Properties

![](/img/spine-user-guide/transform/properties.png)

## Bones

This shows the constrained bones. When one bone is constrained, clicking the bones selects it.

When multiple bones are constrained, they are shown in a select box. The order of the bones is not important for a transform constraint.

Opening the select box and clicking a bone will select that bone. Right clicking a bone name without opening the select box will select that bone.

Different bones can be chosen by clicking the pencil icon. This clears all the constrained bones and allows new bones to be chosen.

## Local

When checked, the local transform of the constrained bones is modified to match the target bone.

When unchecked, the world transform is modified instead.

## Relative

When checked, the transform of the constrained bones is modified by adding the target bone's transform. This means the resulting transform is relative to the constrained bone's transform before the transform constraint is applied.

When unchecked, the transform of the constrained bones is modified to match the target bone's transform. This means when the mix is 100, the constrained bone's transform before the transform constraint is applied has no affect on the resulting transform.

When `Local` is unchecked and `Relative` is checked, flipping the target bone using negative scale can give unwanted results. For example, when scaling causes the target bone to point in the opposite direction, its world rotation is 180 degrees different than before the scaling. When using `Relative`, this results in the constrained bones being rotated 180 degrees.

## Target

This shows the target bone. Clicking the bone selects it.

A different bone can be chosen by clicking the pencil icon.

## Offset

The offset slider values are added to the target bone's transform values, allowing the resulting transform to be customized while still being based on the target bone. This is provided for convenience, so an extra bone is not needed to achieve the same result.

For example, with a rotate offset of 90 degrees, the rotation of the constrained bones is set to the target bone rotation plus 90 degrees.

### Match

The `Match` button sets the offset sliders to match the current transform of the first constrained bone. It can be convenient to set the mixes to 0, manipulate the transform of the first constrained bone as desired, then click `Match` to set the sliders to that offset.

Instead of adjusting each offset slider manually, it is often easier to use the standard tools to manipulate the transform of the first constrained bone as desired, then click `Match` to set the sliders to that offset.

## Mix

The mix sliders control how much the contraint affects the bones' transform, see [constraint mix](/spine-constraints#Mix). The mixes can be [keyed](/spine-keys#Transform-constraints).

When `Link sliders` is checked, all the mix sliders will move together.

# Video

[youtube:Cr3aQ_8R-7k&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[Next: Physics constraints](/spine-physics-constraints)
[Previous: Path constraints](/spine-path-constraints)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-tree.md
## Title: Tree view - Spine User Guide
## URL: http://esotericsoftware.com/spine-tree
---

# Tree view

The tree view provides a hierarchical view of your skeletons and everything they contain. The tree is central to using Spine and has many features to make navigating your project easier.

![](/img/spine-user-guide/tree/tree-view.png)

See the tree [tips](/spine-tips#Tree) for various ways to use the tree efficiently.

# Tree nodes

## Expand and collapse

Tree nodes can be expanded or collapsed by clicking anywhere left of the node's icon. Right clicking anywhere on a node will expand or collapse that node and all its children, which can greatly reduce the number of clicks needed to find a particular node.

<callout>After some time using Spine, many nodes will get expanded. To make the tree easier to navigate, double click the collapse button to collapse them all.</callout>

The expand and collapse buttons at the top of the tree can also be used to expand or collapse the selected nodes and all their children. If no nodes are selected or the buttons are double clicked, all nodes are expanded or collapsed.

![](/img/spine-user-guide/tree/expand-collapse.png)

## Selection

A tree node can be selected by clicking anywhere to the right of the node's icon. Hold `ctrl` (`cmd` on Mac) and click to select multiple nodes. Select a node, then hold `shift` and click another node to select all the nodes between them.

Spine keeps a [selection history](/spine-tools/#Selection-history) that is navigated by pressing `page down` and `page up`.

## Auto scroll

![](/img/spine-user-guide/tree/auto-scroll.png)

<callout>If the tree has scrolled away from an item you need, `page down` will usually take you back to it in the [selection history](/spine-tools/#Selection-history).</callout>

When auto scroll is enabled, the tree will automatically expand and scroll to nodes when items are selected in the viewport. Sometimes this is very useful, other times it is better to disable auto scroll so you don't lose your place in the tree.

Right click the button to scroll to the selected node.

## Visibility

Many tree nodes have a visibility dot along the left edge of the tree. Clicking the visibility dot will show or hide the item.

![](/img/spine-user-guide/slots/slot-visibility.png)

## Keying

In animate mode, some tree nodes have a key button along the left edge of the tree. Clicking the key will set a key for the item.

![](/img/spine-user-guide/key-frames/bone.png)

## Annotations

Annotations are displayed along the right edge of the tree to indicate a relationship with another item. For example, that an item belongs to a skin or has a constraint applied. The annotation icons can be clicked to select the related item. Right click to select the related item without scrolling to it, even when [auto scroll](/spine-tree#Auto-Scroll) is enabled.

![](/img/spine-user-guide/constraints/annotations.png)

## Properties

When an item is selected in the tree, its properties are shown at the bottom of the tree. These properties are where the items in your project are configured. Some properties can only be edited when a single node is selected.

Most properties have the same three buttons in the upper right for duplicate, rename, and delete.

![](/img/spine-user-guide/ui/properties-buttons.png)

Some properties have an additional button in the upper right that changes the selection to a related tree node.

![](/img/spine-user-guide/tree/select-button.png)

## Drag and drop

<callout>When a drag starts, it cannot be dropped for a very short period of time to prevent an accidental drag and drop.</callout>

Many tree nodes, such as bones, slots, or attachments, can be dragged to a new parent node. This is equivalent to clicking the `Set Parent` button and then clicking the new parent.

While dragging, if the mouse goes above or below the tree, the tree will automatically scroll. While dragging, the mouse wheel can be used to scroll, right click can be used to expand or collapse nodes, and hotkeys like `page down` for [selection history](/spine-tools/#Selection-history) can be used.

## Image preview

When the mouse is placed over the tree node for a slot, region attachment, or mesh attachment, after a moment the image for the tree node is displayed in a popup next to the tree and the attachment is shown on the skeleton in the viewport. `F1` can be used to show the image preview without waiting.

Once the image preview is shown, placing the mouse over other tree nodes will show the image preview for those nodes without a delay.

The image preview can be disabled by unchecking the [tooltips](/spine-settings#Tooltips) setting. In that case, the popup can still be seen by pressing `F1`.

![](/img/spine-user-guide/tree/image-preview.png)

## Shortcuts

* Pressing `F2` will open the rename dialog for the selected tree nodes.
* Double clicking a tree node that can be renamed will open the rename dialog.
* Double clicking the `Animations`, `Events`, or `Skins` node will create a new animation, event, or skin.
* Right clicking a visibility dot will [toggle it](/img/spine-user-guide/tree/right-click-dot.gif) for that tree node and all its children.
* [Selection groups](/spine-tools#Selection-groups) can be used to store and recall selections.

# Filters

The tree can be filtered to show only the chosen types of tree nodes. Click the filter button to select the tree node types that will be shown. When a filter is active, the filter button is red.

![](/img/spine-user-guide/tree/filters.png)

Hold `ctrl` (`cmd` on Mac) or `shift` to select multiple filters. The `Reset` button selects all filters.

When `Text search filters` is checked and [text search](#Text-search) is used, nodes that don't match the search are hidden.

Right click the filter button to toggle the filters on or off. 

## Filter buttons

Buttons are provided to quickly set the filter to show bones, slots, or attachments respectively.

![](/img/spine-user-guide/tree/filter-buttons.png)

## Using filters

The tree filters are very powerful and can make a number of tasks easier.

Normally when an attachment is selected in the viewport, it is also selected in the tree. When attachments are hidden in the tree, the attachment's slot is selected in the tree instead. This can make selecting slots easier by selecting an attachment in the viewport rather than digging through the tree to find the slot.

When bones are hidden in the tree, the `Draw Order` node disappears and the slots are shown in the draw order. The slots can be dragged up or down to change the draw order. Seeing the slots without bones makes it more convenient to select multiple slots, for example to change their color.

![](/img/spine-user-guide/tree/filter.png)

By hiding both bones and attachments in the tree, [adjusting the draw order](/spine-slots#Tree-filter) can be easier.

Any time the task is to select a particular type of tree nodes, the tree filters can be useful. For example, if you need to choose a path in a complex skeleton, you could filter to show only path attachments. Or you can filter the tree to show only region attachments so you can more easily select many region attachments to turn them into mesh attachments.

# Find and replace

![](/img/spine-user-guide/tree/find-and-replace-button.png)

The find and replace button opens a dialog for replacing text in the names and paths in your project.

![](/img/spine-user-guide/tree/find-and-replace.png)

The `Find` text box is the text to search for. The `Replace` text box is the text to replace it with.

Options are provided for how the `Find` text is matched:

* `Match case`: When checked, the capitalization of the `Find` text is important when searching.
* `First occurence`: When checked, only the first match within a name or path is replaced.
* `Regular expression`: When checked, the `Find` text is used as a [regular expression](http://www.regular-expressions.info/). This provides a somewhat cryptic but extremely powerful way to find and replace. Some examples:
  * `^` matches the start: `^something`<br>For example to prepend a subfolder, find: `^`, replace: `subfolder/`, result: `something` &rarr; `subfolder/something`.
  * `$` matches the end: `something$`
  * `.` matches any single character: `s.mething`
  * `.*` matches everything: `some.*`
  * Parenthesis group a match, which can then be used in the replacement.<br>For example, find: `some(th.*)`, replace: `other$1`, result: `something` &rarr; `otherthing`.

The panel on the right of the find and replace dialog displays the matches and shows the replacements. You can uncheck a match and it will not be replaced. A green arrow indicates that the replacement is valid. A red arrow indicates a problem with the replacement. For example, some names must be unique and blank names are not allowed.

![](/img/spine-user-guide/tree/invalid-replace.png)

`Scope` specifies what part of the project is searched:
* `Entire project` will consider all items in the project.
* `Tree selection` will only consider items that are selected in the tree. Tree filters can make selecting many tree items easier. 
* `Current skin` will only consider items that are in the current skin. 
* `Selected skeletons` will only consider items that are in the selected skeletons.

`Field` specifies whether the `Name` or `Path` fields are being searched.

`Types` specified which types of objects to consider. Hold `ctrl` (`cmd` on Mac) or `shift` to select multiple types.

`Unused` selects the items that don't have keys in any animation.

`Missing images` selects the items for which an image could not be found using their path field.

`Show folders` includes folders in the search results.

`All` selects all of the items in the search results.

`None` deselects all of the items in the search results.

`Select` selects the results in the tree view.

`Replace` replaces the results in the tree view.

# Text search

![](/img/spine-user-guide/tree/type-to-filter.png)

The search box at the top of the tree allows items in the tree to be found by typing. Click the search box or press `enter` to focus it. Typing in the search box will highlight matching items in the tree. If the `Text search filters` [tree filter](#Filters) is active, only matching items are shown.

Press `enter`, `F3`, or click the next arrow to select the next search result. Press `shift+enter`, `shift+F3`, or the previous search arrow to select the previous result. Press `escape` to clear the search.

The search text can contain special characters:
* `*` matches any characters.
* `?` matches any single character.
* `\` escapes any literal `*`, `?`, or `/`.

When the search text has a forward slash (`/`) at both the beginning and end, it will be treated as a [regular expression](http://www.regular-expressions.info/).

# View settings

![](/img/spine-user-guide/tree/view-settings.png)

#### Hide skeleton names

When checked, tree nodes that start with the name of the skeleton and a forward slash (`/`) have the skeleton name replaced with an ellipsis.

For example, if the skeleton name is `spineboy` and an attachment is named `spineboy/head` then the attachment will appear in the tree as `...head`.

This setting can reduce clutter in the tree by making the names shorter. Some projects use the same [images path](/spine-images#Images-path) for every skeleton with a subfolder that contains the images for each skeleton, meaning that every attachment name is prefixed with the skeleton name.

#### Show slot folders under bones

When checked, slot folders are displayed under the parent bones of the slots contained within them. A slot folder may be displayed under multiple bones if the slots have several parent bones.

#### Show slot paths

When checked, slot folders are displayed as part of the slot name in a dimmer color followed by a forward slash (`/`).

#### Show all skin attachments

When unchecked, under each skin placeholder the tree shows only the attachment for the [active skin](/spine-skins#Active-skin), if any. Also, property rows for attachments in a skin that isn't active are not shown in the [dopesheet](/spine-dopesheet#Visibility) or [graph](/spine-graph#Visibility).

![](/img/spine-user-guide/tree/show-all-skins1.png)

When checked, under each skin placeholder the tree shows the attachment for every skin that has an attachment for the skin placeholder.

![](/img/spine-user-guide/tree/show-all-skins2.png)

The active skin is always shown, even if it doesn't have an attachment, to allow an attachment to be set.

This setting shows a lot more nodes in the tree, but provides a look at all your skins at once and can make some tasks a lot easier.

#### Hide skin names

When checked, tree nodes that start with the name of the [active skin](/spine-skins#Active-skin) and a forward slash (`/`) have the skin name replaced with an ellipsis.

For example, if the skin name is `girl` and an attachment is named `girl/head` then the attachment will appear in the tree as `...head` when the `girl` skin is active.

This setting can reduce clutter in the tree by making the names shorter. Some projects use a subfolder that contains the images for each skin, meaning that every attachment name is prefixed with the skin name.

#### Hide skin bones and constraints

When checked, bones and constraints that are in a skin and are not active because their skin is not visible are not shown in the tree.

This setting can reduce clutter in the tree for projects that use many skin bones or constraints.

#### Hide viewport skin bones

When checked, bones that are in a skin and are not active because their skin is not visible are not shown in the viewport. Also, their bone rows are not shown in the [dopesheet](/spine-dopesheet#Visibility) or [graph](/spine-graph#Visibility).

When unchecked, all bones are made active, regardless of which skins are visible.

It can be helpful to see all the bones, but can also be misleading for skin bones to be active when their skin is not visible. [Bone warnings](/spine-skins#Bone-warnings) that will not render correctly at runtime may render correctly when this setting is unchecked. For that reason, this setting is checked by default and should be checked most of the time.

# Video

[youtube:guZ-zdr4IDw&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b?modestbranding=1&rel=0]

[Next: Weights view](/spine-weights)
[Previous: Timeline view](/spine-timeline)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-ui.md
## Title: User interface - Spine User Guide
## URL: http://esotericsoftware.com/spine-ui
---

# User interface

Spine looks a bit different from most applications because the entire user interface is custom built. This allows us to get exactly the behavior we want, without the compromises of a traditional application. Also, Spine uses hardware acceleration and renders at a high framerate, similar to how games are built, so it is very fast and animates smoothly.

## Main menu

Spine's main menu is accessed by clicking the Spine logo in the upper left corner of the Spine window. It can also be opened by pressing `alt+F` (`opt+F` on Mac).

![](/img/spine-user-guide/ui/menu.png)

From here you can open and save projects, import and export, and access Spine's settings.

### Titlebar buttons

<callout>The open button can be dragged to show the last few recent projects. This is the fastest way to switch projects. Hold `shift` to open a file dialog at the project file location.</callout>

Next to the Spine logo in the upper left are shortcut buttons to open and save the project, undo and redo, and to open the [welcome screen](/spine-welcome-screen). Hold `shift` when clicking the save button to open the "save as" dialog.

![](/img/spine-user-guide/ui/titlebar.png)

The welcome screen's envelope icon will change when there is unread news or changelog entries.

## Opening projects

There are many ways to open a project:
* Click `Open Project` on the main menu. Hold `shift` when clicking if you want the OS file chooser rather than Spine's file dialog.
* Click a recent project on the main menu.
* Press `ctrl+O` (`cmd+O` on Mac). If you want the OS file chooser use `ctrl+shift+O` (`cmd+shift+O` on Mac).
* Press `alt+F` to open the main menu, then `O` to open a project. Use `shift+O` for the OS file chooser.
* Click the open titlebar button near the main menu.
* Drag the open titlebar button to show the recent projects. This the fastest way to switch projects!
* You can double click a project file from your OS's file explorer or drag and drop it onto the Spine window.
* Choose an example project from the [welcome screen](/spine-getting-started#Welcome-to-Spine).

## File dialogs

Spine's file dialog shows the most recent files and folders for the particular type of file or folder you are selecting.

![](/img/spine-user-guide/ui/file-dialog.png)

The file dialog has a number of useful features:
* Clicking the icon next to a file entry opens a file chooser in that directory. This is very convenient!
* You can star files or folders so they always appear at the top of the list.
* Right clicking an entry removes it from the dialog.
* Type to filter the dialog entries and press `enter` to choose the first entry.
* Spacebar opens a file chooser for the first entry, the same as clicking `Browse`.
* Pasting by pressing `ctrl+V` will use the clipboard contents as a file path. You can copy a file using your OS's file explorer, then paste on the file dialog to choose that file.

## Views

<callout>If a view is inadvertently closed, it can be accessed again using the `Views` select box in the upper right of the Spine window.</callout>

By default, Spine has the viewport on the left and the tree view on the right.

![](/img/spine-user-guide/ui/views.png)

Views can be customized by dragging an edge to resize or dragging the tab to move it.

Additional views can be opened via the `Views` select box in the upper right of the Spine window. Animate mode has more views available than setup mode, so be sure to check the `Views` select box in animate mode. See [views](/spine-views) for more information. Currently views cannot be moved outside the [Spine window](/spine-views#Multiple-monitors).

![](/img/spine-user-guide/ui/open-view.png)

## Tree

The [tree view](/spine-tree) gives a hierarchical view of your skeletons and everything they contain. The tree is central to using Spine and has many features to make navigating your project easier. After learning the basics of getting around in Spine, be sure to check out the [tree view](/spine-tree) page.

When an item is selected in the tree, its properties are shown at the bottom of the tree. These properties are where the items in your project are configured. Most properties have the same three buttons in the upper right for duplicate, rename, and delete.

![](/img/spine-user-guide/ui/properties-buttons.png)

## Viewport

The viewport is the space outside of the views where your skeletons are shown. This is where you'll setup and animate your skeletons. The main toolbar at the bottom of the viewport provides access to various [tools and settings](/spine-tools).

### Panning

Panning in the viewport is accomplished by moving the mouse while holding the right mouse button.

If using an input device without a right mouse button, the `Pan Drag` hotkey can be used by holding the `J` key and dragging with the left mouse button. A number of other [hotkeys](/spine-settings#Hotkeys) are available for panning.

### Zooming

<callout>Mouse wheel zoom quickly becomes second nature. It is so convenient that zooming often replaces panning by zooming out, then zooming in to a new location.</callout>

Zooming is very important in Spine. To zoom in, place the mouse on what you'd like to see larger and scroll the mouse wheel upward. To zoom out, place the mouse near the edge of the screen where you want to see more and scroll the mouse wheel downward.

If you do not have a mouse wheel, you can alternatively hold `ctrl` (`cmd` on Mac) and drag the right mouse button up or down to zoom. Also the `Zoom Drag` hotkey can be used by holding the `U` key and dragging with the left mouse button. Other [hotkeys](/spine-settings#Hotkeys) are available for zooming.

The zoom level is indicated by a vertical slider in the lower left of the viewport. The slider shows the current zoom level and can be dragged, but is generally much less convenient than scrolling.

![](/img/spine-user-guide/ui/zoom.png)

Below the slider are two zoom buttons. The magnifying glass button zooms to 100%, so images appear at their actual size. The box button adjusts the zoom level so the skeleton fills the viewport. These can also be done by pressing `ctrl+F` and `ctrl+shift+F`, respectively (`cmd+F` and `cmd+shift+F` on Mac).

## Setup/animate mode

Switching between setup mode and animate mode is done by clicking the icon in the upper left of the viewport.

![](/img/spine-user-guide/ui/mode.png)

Setup mode is used to create and configure skeletons while animate mode is used to design your animations. This is explained in depth later in this guide. For now you can open an example projects from the [welcome screen](/spine-welcome-screen#Example-projects), such as spineboy, then switch to animate mode and click play in the graph view to see it animate.

In animate mode, by default Spine has the [graph view](/spine-graph) at the bottom and the [dopesheet view](/spine-dopesheet) as a tab next to it. The graph shows the keys and values in your animation and how they change over time. The dopesheet shows only the animation's keys, not their values, but can show many keys at once. We'll explain more about these views later in this guide.

![](/img/spine-user-guide/ui/graph-dopesheet.png)

## Undo/redo

Nearly any action in Spine can be undone by pressing `ctrl+Z` to undo and `ctrl+shift+Z` or `ctrl+Y` to redo (`cmd+Z` and `cmd+shift+Z` or `cmd+Y` on Mac). There are also undo and redo buttons on the titlebar near the main menu, in the upper left of the Spine window.

![](/img/spine-user-guide/ui/undo.png)

On macOS, if you are not using a QWERTY keyboard, the default hotkeys may use different keys. For example, `Y` instead of `Z` for a QWERTZ keyboard. To fix this, choose your keyboard layout in the [settings](/spine-settings). All hotkeys can be [customized](/spine-settings#Hotkeys).

# Video

[youtube:zZIpC9lwgPM&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[Next: Skeletons](/spine-skeletons)
[Previous: Getting started](/spine-getting-started)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-user-guide.md
## Title: Spine User Guide
## URL: http://esotericsoftware.com/spine-user-guide
---

# Spine User Guide

This user guide covers all of Spine's features and what they do. Everything is explained, from the most basic features to the most advanced, and topics are introduced in order, so the articles can be read from beginning to end.

Many articles include a video which covers the same information as the text, allowing you to see firsthand how things work in Spine. You may also browse the [Spine User Guide videos](https://www.youtube.com/playlist?list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b) on YouTube.

While this user guide explains how Spine works and what everything does, the [Animating with Spine videos](/spine-videos#videosAnimatingWithSpineTitle) teach how to use Spine to make great animation. Also see the [Spine example projects](/spine-examples) which explain the rigging in detail.

<div
  style="
    display: flex;
    flex-direction: column;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 16px 0;
    margin-bottom: 16px;
  "
>
  <div style="font-weight: bold">User Guide Search</div>
  <div class="btn-group" style="display: flex; align-items: center; margin: 16px 0">
    <input
      type="text"
      id="query"
      maxlength="128"
      title="Search the Spine User Guide using Google"
      class="input-search"
      style="height: 25px; margin: 0"
    />
    <button id="search" class="btn btn-round" style="margin: 0">
      <span class="iconfont-search"></span>
    </button>
  </div>
  <div id="queryResults" style="display: flex; flex-direction: column; gap: 16px; width: 100%; height: 100%">
  </div>
</div>

<script>
const sourceId = "65bcd4e65012e05d2353b62a"

const queryUi = document.querySelector("#query");
queryUi.addEventListener("keydown", (event) => {
   if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      search();
   }
});
const searchButtonUi = document.querySelector("#search");
searchButtonUi.addEventListener("click", () => search());
const resultsUi = document.querySelector("#queryResults");

async function search() {
   resultsUi.innerHTML = "<div>Searching ...</div>";
   try {
      const response = await fetch(`https://doxie.marioslab.io/api/search?sourceId=${sourceId}&query=${encodeURIComponent(queryUi.value)}`)
      if (!response.ok) throw new Error(await response.text());
      const results = (await response.json()).results;
      resultsUi.innerHTML = "";
      let i = 0;
      for (const result of results) {
         const row = renderResult(result);
         if (row) {
            resultsUi.append(row);
            i++;
            if (i == 5) break;
         }
      }
   } catch (e) {
      console.log("Search failed", e);
      resultsUi.innerHTML = "<div>Sorry, could not find any results.</div>"
   }
}

function renderResult(result) {
   const parts = result.text.split("\n\n");
   parts.shift();
   const text = stripMarkdown(parts.join(" "));
   if (text.length == 0) return;
   const resultUi = document.createElement("div");
resultUi.innerHTML = `
    <a
      href="${result.docUri}"
      style="font-size: 18px"
      >${result.docTitle}</a
    >
    <p style="margin-bottom: 0px;">${text.substring(0, 400)} ...</p>
`
   resultUi.style.display = "flex";
   resultUi.style.flexDirection = "column";
   return resultUi;
}

function stripMarkdown(markdownText) {
  const htmlText = markdownText
    .replace(/#/g, "")
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold **text** or __text__
    .replace(/(\*|_)(.*?)\1/g, '$2') // Italic *text* or _text_
    .replace(/\~\~(.*?)\~\~/g, '$1') // Strikethrough ~~text~~
    .replace(/\!\[[^\]]*\]\([^\)]*\)/g, '') // Remove images ![alt text](image.jpg)
    .replace(/\[([^\]]*)\]\([^\)]*\)/g, '$1') // Corrected: Remove links [text](http://) but keep the text
    .replace(/#+\s?(.*?)\n/g, '$1\n') // Remove headers, adjusted to capture text after #
    .replace(/\n-\s/g, '') // Remove lists
    .replace(/\n\d+\.\s/g, '') // Remove numbered lists
    .replace(/\n>/g, '') // Remove blockquotes
    .replace(/`{3}.*?`{3}/gs, '') // Remove fenced code blocks
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .replace(/\[.*?\]/g, '')
    .replace(/\n/g, ' '); // Replace new lines with spaces
  return htmlText.trim();
}
</script>

<!--<form method="get" action="//www.google.com/search" class="support-form forms" id="user-guide-form" style="margin-bottom:0.3em">
<fieldset>
	<legend>User Guide Search</legend>
	<table class="layout layout-form"><tr>
	<td>Keywords:</td>
	<td class="btn-group">
		<input type="text" id="user-guide-q" maxlength="128" title="Search the Spine User Guide using Google" class="input-search">
		<button class="btn btn-round" onclick="googleUserGuide(); return false"><span class="iconfont-search"></span></button>
	</td>
	</tr></table>
</fieldset>
</form>-->

<div style="float:left;margin-right:20px">!!
* [Getting started](/spine-getting-started)
  * [User interface](/spine-ui)
  * [Skeletons](/spine-skeletons)
  * [Bones](/spine-bones)
  * [Slots](/spine-slots)
  * [Images](/spine-images)
  * [Tools](/spine-tools)
  * [Keys](/spine-keys)
  * [Animating](/spine-animating)
* [Attachments](/spine-attachments)
  * [Region attachments](/spine-regions)
  * [Mesh attachments](/spine-meshes)
  * [Bounding box attachments](/spine-bounding-boxes)
  * [Clipping attachments](/spine-clipping)
  * [Path attachments](/spine-paths)
  * [Point attachments](/spine-points)
* [Skins](/spine-skins)
* [Constraints](/spine-constraints)
  * [IK constraints](/spine-ik-constraints)
  * [Path constraints](/spine-path-constraints)
  * [Transform constraints](/spine-transform-constraints)
  * [Physics constraints](/spine-physics-constraints)
  * [Sliders](/spine-sliders)
* [Events](/spine-events)
</div>

<div style="float:left">!!
* [Views](/spine-views)
  * [Animations view](/spine-animations-view)
  * [Audio view](/spine-audio-view)
  * [Dopesheet view](/spine-dopesheet)
  * [Ghosting view](/spine-ghosting)
  * [Graph view](/spine-graph)
  * [Mesh Tools view](/spine-mesh-tools)
  * [Metrics view](/spine-metrics)
  * [Outline view](/spine-outline)
  * [Playback view](/spine-playback)
  * [Preview view](/spine-preview)
  * [Skins view](/spine-skins-view)
  * [Slot Color view](/spine-slot-color)
  * [Timeline view](/spine-timeline)
  * [Tree view](/spine-tree)
  * [Weights view](/spine-weights)
* [Welcome screen](/spine-welcome-screen)
* [Versioning](/spine-versioning)
* [Export](/spine-export)
  * [Texture packing](/spine-texture-packer)
* [Import](/spine-import)
  * [Import PSD](/spine-import-psd)
* [Command line interface](/spine-command-line-interface)
* [Settings](/spine-settings)
</div>

<form method="get" action="//www.google.com/search" id="google" style="display:none">
<input type="hidden" name="q" id="google-q">
</form>

<script>
$("#user-guide-form").submit(function() {
	if (e.which == 13) {
		googleUserGuide();
		return false;
	}
});
function googleUserGuide () {
	$("#google-q").val('site:' + (langs[0] == "en" ? "" : (langs[0] + ".")) + 'esotericsoftware.com "Spine User Guide" ' + $("#user-guide-q").val());
	$("#google").submit();
}
</script>

---
## File: User Guide/spine-versioning.md
## Title: Versioning - Spine User Guide
## URL: http://esotericsoftware.com/spine-versioning
---

# Versioning

Keeping track of your Spine editor and Spine Runtimes versions is an important part to using Spine.

# Spine editor version numbers

Spine editor version numbers use the format `major.minor.patch`. For example, `3.8.75`.

When the major or minor version numbers change, it indicates a significant difference and caution should be used before updating to the newer version.

When only the patch version number changes, it means that we have fixed bugs or have done minor improvements and it is safe for you to update.

The [changelog archive](/spine-changelog/archive) provides a list of all Spine editor versions we have ever released.

# Spine Runtimes version numbers

The Spine Runtimes version numbers use the format `major.minor`. For example, `3.8`.

The source code for the Spine Runtimes is provided in the [Spine Runtimes GitHub repository](https://github.com/EsotericSoftware/spine-runtimes). Git branches are used for each version of the Spine Runtimes. Git commits to a branch are used instead of patch version numbers.

![](/img/spine-user-guide/versioning/branches.png)

Spine Runtimes which are published to package managment systems like NPM or Maven Central which have an additional, runtime specific patch version. E.g. the latest `spine-player` runtime version published to NPM may be 4.2.21, which means it is compatible with exports from Spine Editor version 4.2.x, including Spine Editor versions with a lower patch number than the runtime version, like 4.2.1.

For Spine Runtimes which are not published to package management systems, like spine-c, select the branch with the version number corresponding to the Spine Editor version you export from.

# Stable releases

A stable release is any that doesn't end with `-beta`. For example, `3.8.99` for the Spine editor and `3.8` for the Spine Runtimes.

We don't make risky changes to stable releases in order to reduce the chance that new problems are introduced. Updates to stable releases are mainly to fix bugs.

# Beta releases

A beta release is any that ends with `-beta`. For example, `4.0.73-beta` for the Spine editor and `4.0-beta` for the Spine Runtimes.

Beta versions let you use the latest new features, but the Spine editor may crash occasionally or have features that are not completely implemented. Also, exports from a beta version may not yet be supported by all Spine Runtimes.

Here are a few reasons you may want to use a beta release:
* You are exporting images or video, so lacking runtime support doesn't matter to you.
* You want to use the newest Spine features and don't mind waiting until the runtimes have been updated.
* You want to explore the newest Spine features. You can always go back to a stable or older Spine editor version, just **be careful not to save your projects with the newer version**.
* You know the runtime you are using has already been updated to work with the beta editor version. Some runtimes will be updated before others and we don't do a stable release until all runtimes are updated. Each runtime's README on GitHub specifies the most recent Spine version it works with.

Once out of beta, the beta Git branch for the Spine Runtimes is removed and replaced with a stable version number.

# Choosing a Spine editor version

When [Spine starts](/spine-getting-started#Running-Spine), the launcher window allows choosing which version of the Spine editor to use. You can also set the Spine editor version on the [settings dialog](/spine-settings).

![](/img/spine-user-guide/versioning/version-select.png)

If the launcher doesn't stop to let you choose a version, it's because you've previously checked `Start automatically`. In that case, to stop Spine from starting automatically, just click anywhere when the launcher window first appears.

## Latest stable

If you choose `Latest stable` in the version select box, it will run the newest stable, production ready release of the Spine editor.

## Latest beta

If you choose `Latest beta`, it will run the newest Spine editor beta. Beta versions let you try the latest new features, but exports may not yet be supported for all Spine Runtimes. You won't see the `Latest beta` option if there is currently no beta in progress.

## Specific version

You can also choose a specific Spine editor version. All versions you have downloaded are shown, or you can click `Other...` and type the version number for [any version](/spine-changelog/archive) we've ever released.

# Synchronizing versions

**The major and minor version for the Spine editor used to export JSON or binary data must always match the Spine Runtimes version.** If not, the Spine Runtimes will not be able to read the data. This dependency is very important.

Animators must make sure to use the right version of the Spine editor by choosing a [specific version](#Specific-version). Otherwise, it can be easy to accidentally update to a newer Spine editor version.

Developers must make sure to use the right version of the Spine Runtimes. It's not as easy to update to a newer Spine Runtimes version, as the new version needs to be downloaded, the old version replaced, and possibly code fixed up. Because of that, generally the developers dictate what version of the Spine editor should be used.

## Updating patch versions

It is always safe to update your Spine editor to a newer patch version, which means it has bug fixes. For example, if you are using `3.6.44`, you can update to the newer `3.6.53` without worrying that something breaks or that your exports will no longer work with the `3.6` Spine Runtimes.

It is always safe to update your Spine Runtimes to a newer Git commit on the same branch. For example, if you are using the `3.6` branch, you can update to the latest commit on that branch without worrying that something breaks. Exports from any `3.6.xx` Spine editor will continue to work.

## Updating major or minor versions

Animators and developers need to communicate when updating the major or minor versions so both the Spine editor and Spine Runtimes are updated at the same time.

After updating the Spine Runtimes to the branch for the new version, the Spine Runtimes will no longer be able to read any of the exports from the older Spine editor version. All of the Spine projects need to be exported again using the newer Spine editor version.

We suggest writing scripts using the [command line interface](/spine-command-line-interface) to automate exporting all your projects. This can be done as needed or as part of a build process.

# Project files

Spine project files are backward compatible, but not forward compatible. A newer Spine editor version can always open Spine project files saved from any older version. However, once a project is saved, it can no longer be opened by older Spine editor versions. Care must be taken not to accidentally save projects with a newer Spine editor version.

Spine shows a warning before saving a project with a newer Spine editor version.

![](/img/spine-user-guide/versioning/project-warning.png)

## Recovering work from a newer version

If work is done on a project and saved with a newer Spine editor version, it can no longer be opened by older versions. If the Spine Runtimes cannot be updated to match the Spine editor version, then the work may be lost. The project file for the old version may be found in the [backups](/spine-settings#Backups).

To attempt to recover the work, you can use [JSON export](/spine-export#JSON) and set the `Version` to the older Spine editor version. This may result in data loss if the older version does not have features used in the newer version. For example, when using `4.0` to export JSON data for `3.8`, the curves for all animations will be lost because `3.8` lacks the ability to express the curves created in `4.0`.

Next, run the older Spine editor version and use [data import](/spine-import#Data) to bring the JSON data into Spine. If the project looks OK, save it and continue using the older Spine editor version.

## File storage

Spine project files should be kept safe and stored for future use. Project files can always be opened by the same or newer versions of the Spine editor.

Exported JSON or binary files are not a good choice for storage. They can be [imported](/spine-import#Data) back into the Spine editor, but only into the same version that exported the data. If [nonessential data](/spine-import#Nonessential-data) was not exported, importing the data back into Spine will lose some information. Once imported, a Spine project file can be saved and that can be opened in a new version of the Spine editor.

If a large number of JSON or binary files need to be imported and saved as Spine project files, the [command line interface](/spine-command-line-interface#Import) can be used. For example, the first command below imports JSON that was exported with 3.6.51 and saves it as a project file. The second command uses 4.0.10 to export the project file as 4.0.10 JSON.

```
Spine -u 3.6.51 -i input.json -o project.spine --import
Spine -u 4.0.10 -i project.spine -o path/to/exports --export json
```

[Next: Export](/spine-export)
[Previous: Welcome screen](/spine-welcome-screen)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-views.md
## Title: Views - Spine User Guide
## URL: http://esotericsoftware.com/spine-views
---

# Views

Spine's user interface uses a tabbed view system to organize tools. This gives you the flexibility to customize the workspace to your liking.

Currently views cannot be moved outside the [Spine window](#Multiple-monitors).

# Open

Views are opened by clicking the `Views` select box at the top of the screen. The select box shows different views for setup mode and animate mode.

![](/img/spine-user-guide/views/open.png)

Views that are already open are shown in light gray but can still be clicked to focus that view.

# Tabs

Each view has a tab at the top.

![](/img/spine-user-guide/views/tab.png)

The tab can be dragged to move it to a new position. An orange rectangle will appear where the tab can be dropped.

![](/img/spine-user-guide/views/move.png)

A tab can also be dropped next to other tabs.

![](/img/spine-user-guide/views/tabs.png)

## Focus

The name shown on a view's tab is underlined when the view has focus. The graph, dopesheet, tree, and viewport gain focus when clicked. Some hotkeys behave differently depending on which view is focused.

# Resize

Views can be resized by dragging the edge of the view (highlighted in red below).

![](/img/spine-user-guide/views/resize.png)

# Minimize

A view can be minimized by left clicking the menu icon to the right of the tab, then choosing `Minimize`. Alternatively, a view can be minimized by right clicking the menu icon.

![](/img/spine-user-guide/views/minimize.png)

Minimized views appears as icons next to the `Views` select box. Clicking an icon restores the view to its previous position.

![](/img/spine-user-guide/views/minimized-icons.png)

All views can be minimized by clicking the minimize button next to the `Views` select box or pressing `F9`. Clicking it a second time or pressing `F9` again restores all the views that were previously minimized.

# Close

A view can be closed by left clicking the menu icon to the right of the tab, then choosing `Close`. Alternatively, a view can be closed by double clicking the menu icon.

![](/img/spine-user-guide/views/close.png)

Views remain closed until they are opened again using the `Views` select box.

# Multiple monitors

Spine currently does not support detaching a view as its own floating window so it can be moved to another monitor. That functionality is planned but until then the Spine window can be unmaximized, then stretched to span multiple monitors.

When using multiple monitors, the editor area toolbar may not be in the ideal position. It can be moved by clicking the small lock icon to the left of the toolbar, then dragging it left or right.

![](/img/spine-user-guide/views/toolbar.png)

When using multiple monitors, dialogs may open in the wrong position. To fix this, any dialog can be moved to the desired position and all subsequent dialogs will open at that position. If the Spine window is resized, the dialog position is reset.

# Video

[youtube:u0Z8b5k_gIE&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[Next: Animations view](/spine-animations-view)
[Previous: Events](/spine-events)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-weights.md
## Title: Weights view - Spine User Guide
## URL: http://esotericsoftware.com/spine-weights
---

# Weights view

Weights are used to bind attachment vertices to bones so when the bones are transformed, the vertices are also transformed. Weights allow bones to deform attachments automatically as the bones are manipulated, making it easier and more efficient than moving individual vertices to animate complex deformations.

<callout>Carefully [plan your weights](/blog/Mesh-weight-workflows) when setting up complex meshes.</callout>

Other names for allowing bones to affect mesh vertices include: linear blend skinning, blended skinning, multi-matrix skinning, skeletal subspace deformation, or sometimes simply "skinning". To avoid confusion with the unrelated [skins](/spine-skins) feature in Spine, we use the name "weights".

While weights are most commonly used with [mesh attachments](/spine-meshes), they also work with [path](/spine-paths), [bounding boxes](/spine-bounding-boxes), and [clipping attachments](/spine-clipping). For the rest of this page "mesh" is used in the text, but weights work with any of those types of attachments.

![](/img/spine-user-guide/weights/view.png)

See the weights [tips](/spine-tips#Weights) for some clever ways to make use of weights.

# Bind

Before weights can be adjusted, bones need to be bound to a mesh. There are two ways to do this:

1. **Select the mesh first**<br>Select a mesh with any tool, then click `Bind` in the weights view to enter bind mode. Next, click each bone you want to bind to the mesh. When finished, exit bind mode by clicking `Bind` again or pressing `spacebar` or `escape`.
1. **Select the bones first**<br>Select any number of bones with any tool, then click `Bind` in the weights view to enter bind mode. Next, click a mesh to bind the bones to that mesh.

![](/img/spine-user-guide/weights/bind-mode.png)

When bones are bound to a mesh for the first time, weights are [computed automatically](#Auto). After that, when the bones are transformed the vertices are affected and the image deforms.

![](/img/spine-user-guide/weights/rotate.png)

# Bones list

The bones list shows the bones bound to the selected mesh.

![](/img/spine-user-guide/weights/bones-list.png)

Each bone is assigned a color. When the `Weights` tool is selected, the bones are shown in the viewport with matching colors.

![](/img/spine-user-guide/weights/bound.png)

When a vertex is selected in the viewport, the bone list shows the weight each bone has for that vertex. If multiple vertices are selected and a bone has different weights for them, an asterisk (`*`) is shown instead. The names of bones that have weights are highlighted in the bones list.

Bones can be unbound by selecting them in the bones list and clicking `Remove`. The unbound bones will no longer affect the mesh. If all bones are removed, the mesh will return to being affected only by the transform of the bone to which it is attached.

Right clicking a bone selects that bone in the tree and viewport.

## Triangle order

The order of the bones in the bone list can be changed by dragging and bone up or down. The order of the bones determines which of the mesh's triangles are drawn on top of other triangles in the same mesh, which is important if the mesh ever overlaps itself.

A mesh's triangles are sorted by first determining which bone has the highest weights for the triangle's vertices. The order of that bone in the weights view is then used to determine which triangles are drawn on top of other triangles.

![](/img/spine-user-guide/meshes/weights-order.gif)

# Pies

When checked and the `Weights` tool is selected, pie charts are shown for each vertex to indicate the weights from each bone. The slices in the pie charts match the colors of each bone in the bones list. Selected vertices have larger pie charts.

![](/img/spine-user-guide/weights/pies.png)

# Overlay

When checked and the `Weights` tool is selected, the mesh is filled with the bone colors to show the weight of each bone.

![](/img/spine-user-guide/weights/overlay.png)

# Selected

When checked, pie charts are only drawn for selected vertices and vertices that have weights for bones that are selected in the bones list. Also, the overlay uses black for all bones that are not selected, which can make it easier to see faint colors.

![](/img/spine-user-guide/weights/selected-black.png)

# Weights tool

![](/img/spine-user-guide/weights/weights-tool.png)

Each vertex has a weight for each bone that determines the influence of the bone. While [automatic weights](#Auto) often does a good job, the `Weights` tool can be used to manually adjust weights.

To change weights for the selected vertices, first select the bones whose weight will increase or decrease. This can be done by clicking the bones in the bones list or in the viewport. Next, drag in the viewport to change the weight for the selected vertices, depending on the [mode](#Mode).

## Mode

![](/img/spine-user-guide/weights/mode.png)

The `Mode` and the sliders below it determine how the `Weights` tool works.

Before the `Weights` tool can be used, first select the bones whose weights will be adjusted. This can be done by clicking the bones in either the bones list or in the viewport.

### Direct

The `Direct` mode gives precise control of individual weight values. After selecting vertices and bones in the bones list, drag up or down in the viewport to adjust the weights for those bones. Alternatively, the `Weight` slider can be used to set an exact weight.

To select vertices when none are selected, drag to box select. Additional vertices can be selected by holding `ctrl` (`cmd` on Mac), then clicking or dragging to box select. All vertices in a mesh can be selected at once by pressing `ctrl + A` (`cmd + A` on Mac). The selected vertices can be deselected by pressing `spacebar` or `escape`, or by clicking in any empty space.

### Brushes

The `Weights` tool has three brush modes:

* `Add` adds weights for the selected bones.
* `Remove` removes weights for the selected bones.
* `Replace` sets weights for the selected bones to a specific value.

Each brush mode has three settings:

* `Strength` sets the maximum weight that will be applied.
* `Size` sets the size of the brush.
* `Feather` is the percentage of the brush size where the weight decreases from the `Strength` to 0%.

![](/img/spine-user-guide/weights/brush.png)

If no vertices are selected, the brushes affect all vertices. Otherwise, the brushes only affect the selected vertices.

Click to select a vertex or hold `ctrl` (`cmd` on Mac) to box select. The selected vertices can be deselected by pressing `spacebar` or `escape`, or by clicking in any empty space.

## Adjusting weights

When adding to a bone's weight, the weights of other bones that affect the vertex are decreased so the weights sum to 100%. It is almost always more intuitive to adjust weights only by adding to them.

When subtracting from a bone's weight, the weights of other bones that affect the vertex are increased so that the weights sum to 100%. If a bone has 100% weight, the weight cannot be reduced because there are no other bones to give the weight to.

## Weights copy and paste

Weights can be copied from one or more selected vertices by pressing `ctrl + C` (`cmd + C` on Mac) then pasted on a matching number of selected vertices by pressing `ctrl + V` (`cmd + V` on Mac).

## Testing weights

After adjusting weights, the bones can be transformed to see how the weights behave.

When switching to other tools, the selection for the `Weights` tool is saved. This enables switching to a transform tool, trying out the weights by manipulating the bones, then switching back to the `Weights` tool to further adjust the weights, without needing to change the selection.

Transforming the bones can be done in setup mode, then undo used to revert the changes to the bones. However, it is better to use animate mode to transform the bones, so your setup mode is not affected. When [auto key](/spine-keys#Auto-key) is disabled, clicking anywhere on the timeline will reset the transformed bones back to the setup pose.

It can be very helpful to create an animation that moves the bones through their maximum range as you adjust weights. This lets you focus on how the weights behave, without needing to switch to bone transform tools at all. The `Direct` mode for the `Weight` tool is easiest to use while an animation is playing. Also, the [preview view](/spine-preview) can be used to see an animation playing as you adjust weights, without having an animation playing in the viewport.

# Auto

The `Auto` button computes weights automatically. This does not use simple distance between vertices and bones, Spine uses a sophisticated algorithm that considers the mesh topography to choose the best weights.

If any vertices are selected in the viewport, the weights are computed only for the selected vertices. This can be helpful when you need to fix the weights for part of the mesh, but don't want to lose the weights you've set manually for the rest of the mesh.

If any bones are selected in the bones list, the weights are computed only for the selected bones. This can be helpful when auto weights would not compute weights for a bone the way that is needed. In that case, auto weights can be applied without the bone selected to give weights that are close to what you need, then further weights can be set manually.

# Smooth

The `Smooth` button averages the weights of the selected vertices with their neighbors. The neighbors of a vertex are those connected by a hull edge (cyan) or manually created internal edge (orange). If no vertices are selected, all are affected. `Smooth` spreads the weight of bones and can result in smoother deformations. It can be clicked multiple times to increasingly spread the weights.

Smoothing can cause unnecessary [vertex transforms](/spine-metrics#Vertex-transforms). `Prune` can be used to remove small weights.

# Prune

The `Prune` button removes weights below a threshold. When setting up weights, it is common to end up with some bones having a small effect on some vertices, especially after using `Smooth`. These weights are unlikely to make a visible difference but still cause extra [vertex transforms](/spine-metrics#Vertex-transforms) to be calculated. Removing unnecessary weights reduces the number of vertex transforms needed to render the mesh.

The `Bones` slider determines the maximum number of bones that can have weight for each vertex. When a vertex has weights for more bones than specified, the lowest weights are removed and distributed to the other bones that have weights.

The `Threshold` slider sets the threshold below which the weights are removed from a vertex. The removed weights are distributed to the other bones that have weights.

Adjusting these sliders provides a live preview of the result and the number of bones that will be removed is shown.

Multiple meshes can be pruned by using the [tree filter](/spine-tree#Filters) to show only meshes, then selecting all the meshes and clicking `Prune`.

# Weld

The `Weld` button matches weights across meshes, effectively welding them together. This allows multiple meshes to deform identically, as if they were a single image. Weld requires the selected mesh and the target mesh to be bound to at least the same two or more bones in order to work.

The weld button has two options: 
* `All` 
* `Overlapping`

# Swap

Weights can be swapped between two bones in the weights list. To swap weights, first select two bones in the weights view list, then press the `Swap` button. 

# Lock

Weights can be locked to prevent them from changing while altering the weights of bones that are not locked. To lock the weights for a bone, hover with the mouse on the colored square next to a bone in the weights view, then click on the lock. Repeat the process to unlock a bone. The lock only affects the given bone for the selected mesh.

# Update bindings

The `Update` button rebinds the current vertices to the bones, discarding the old binding positions.

![](/img/spine-user-guide/weights/update-bindings-button.png)

When bones are bound to a mesh, the mesh vertices at that time are stored in relation to each bone. When a bone is moved, the vertices also move to stay in the same position relative to the bone. The bone weights determine how much each bone influences the vertices. For example, if the weight for a bone is 100%, the vertices will move with the bone exactly.

<callout>For more `Update Bindings` examples, see our [mesh binding tutorial](/blog/Mesh-binding-tutorial) and [rotating diamond tutorial](/blog/Rotating-diamond-tutorial).</callout>

If bones have been transformed after being bound to a mesh, adjusting the weights will change the vertex positions. This happens because each bone wants the vertices to be in different positions. Sometimes it is acceptable for the vertices to move when adjusting weights. Other times it is not, and that is when `Update Bindings` is useful.

#### Example without update bindings

In this example update bindings is not needed. Adjusting the weights causes the vertices to move, but this acceptable.

Consider a skeleton with a long tail. The more an image is bent, the more it distorts, so it is best to start with an image near the center of the bending range. A long tail needs to bend a lot in both directions, so it's best to use a long, skinny rectangle, bound to bones and weighted.

![](/img/spine-user-guide/weights/tail1.png)

However, it may look odd to have the tail perfectly straight in setup mode, so the bones can be rotated so the tail is bent in setup mode.

![](/img/spine-user-guide/weights/tail2.png)

Since the bones were rotated to bend the tail, the bones transforms have changed since the mesh was bound. Now each bone wants the vertices to be in different positions, so when the weights are adjusted, the vertices move. This is acceptable because adjusting the weights controls how the bent tail deforms and it is not important that this setup pose keep an exact position.

#### Example with update bindings

In this example update bindings is used to prevent vertices from moving when the weights are adjusted.

Consider a skeleton with a weighted mesh for an arm. If the arm bones are rotated in setup mode to achieve the exact setup pose desired, then adjusting weights to fix how the arm bends in animations will move the vertices in setup mode, ruining the setup pose. In this case, `Update Bindings` can be used to set a new bind pose after rotating the arms. Then when the weights are changed, the vertices in setup mode will not move.

# Duplicating bones

When a bone is [duplicated](/spine-tree#Properties), all child bones, slots, and attachments under the bone are also duplicated. When attachments with weights are duplicated this way, the weights are modified to use the corresponding duplicated bones, if possible.

# Video

[youtube:d-YeActEi38&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b?modestbranding=1&rel=0]

[Next: Welcome screen](/spine-welcome-screen)
[Previous: Tree view](/spine-tree)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-welcome-screen.md
## Title: Welcome screen - Spine User Guide
## URL: http://esotericsoftware.com/spine-welcome-screen
---

# Welcome screen

The welcome screen is shown when Spine starts. It provides quick access to opening projects and makes it easy to stay on top of the latest Spine news.

![](/img/spine-user-guide/welcome/welcome-screen.jpg)

To exit the welcome screen, press `escape` or click the `X` in the upper right. The last opened project will be opened.

To visit the welcome screen later, click the mail button in Spine's titlebar:

![](/img/blog/welcome-screen/mail-icon-open.jpg)

If you'd rather the welcome screen not be shown when Spine starts, see the [settings dialog](/spine-settings#Welcome-Screen).

# Projects

Clicking `New Project` or `Open Project` will create a new project or open an existing one.

The `Recent` section is similar to a [file dialog](/spine-ui#File-dialogs) and displays the recently opened projects and project folders. Typing on the welcome screen will filter the recent projects and pressing `enter` will choose the first project listed.

The `Examples` section contains Spine's example projects. Click to open a project or visit the [examples page](/spine-examples) for details on how the project was built.

# News

The `News` section shows the latest Spine blog posts. Click a news item to visit the blog post.

# Tips

The `Tips` section displays a different tip each time you run Spine. Click a tip to visit the [tips page](/spine-tips) with the tip selected for easy sharing.

# Learn

The `Learn` section provides links to the Spine documentation, forums, and other [learning materials](/spine-academy).

# Changelog

The `Changelog` section displays the most recent fixes, changes, and additions by Spine's development team. The complete list of changes can be found on the [changelog page](/spine-changelog).

[Next: Versioning](/spine-versioning)
[Previous: Weights view](/spine-weights)
[Spine User Guide: Table of Contents]

---
## File: User Guide/spine-youtube-embed-multiple.md
## Title: Spine Youtube Embed Multiple
## URL: http://esotericsoftware.com/spine-youtube-embed-multiple
---

!!
<iframe width="560" height="315" src="http://www.youtube.com/embed/zZIpC9lwgPM?playlist=zZIpC9lwgPM,WRki3xKS1hM,p7yZET00GeE&rel=0&showinfo=0" frameborder="0" allowfullscreen></iframe>
http://esotericsoftware.com/spine-runtime-skeletons

[Runtime Skeletons - Spine Runtimes Guide]
[[]]

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
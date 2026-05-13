http://esotericsoftware.com/spine-attachments

[Attachments - Spine User Guide]
[[]]

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
http://esotericsoftware.com/spine-bones

[Bones - Spine User Guide]
[[]]

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
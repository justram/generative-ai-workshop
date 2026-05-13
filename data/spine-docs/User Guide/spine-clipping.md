http://esotericsoftware.com/spine-clipping

[Clipping attachments - Spine User Guide]
[[]]

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
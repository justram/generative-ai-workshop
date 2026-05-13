http://esotericsoftware.com/spine-bounding-boxes

[Bounding box attachments - Spine User Guide]
[[]]

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
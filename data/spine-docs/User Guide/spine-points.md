http://esotericsoftware.com/spine-points

[Point attachments - Spine User Guide]
[[]]

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
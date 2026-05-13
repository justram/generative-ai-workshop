http://esotericsoftware.com/spine-basic-concepts

[Basic Concepts - Spine User Guide]
[[]]

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
http://esotericsoftware.com/spine-skeletons

[Skeletons - Spine User Guide]
[[]]

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
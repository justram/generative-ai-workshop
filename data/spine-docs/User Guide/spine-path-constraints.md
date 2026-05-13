http://esotericsoftware.com/spine-path-constraints

[Path constraints - Spine User Guide]
[[]]

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
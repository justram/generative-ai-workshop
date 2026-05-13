http://esotericsoftware.com/spine-ik-constraints

[IK constraints - Spine User Guide]
[[Learn how to use inverse kinematics (IK) for more expressive power in your Spine animations.]]

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
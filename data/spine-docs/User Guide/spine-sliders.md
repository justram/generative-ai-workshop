http://esotericsoftware.com/spine-sliders

[Sliders - Spine User Guide]
[[Sliders make for more powerful and more flexible rigging of your skeletons.]]

# Sliders 

<callout>Sliders are not available in Spine Essential.</callout>

A slider constraints a [skeleton](/spine-skeletons) to an [animation](/spine-animations).

Sliders can also use the movement of a source bone to determine the frame of the animation to display, unlocking many powerful rigging possibilities.

# Setup

To create a slider, select an animation from the Animations node, then click `New...` `Slider`. 

![](/img/spine-user-guide/slider/setup.png)

# Properties

![](/img/spine-user-guide/slider/properties.png)

## Animation

This shows the constrained animation. 

Right clicking the animation name will select that animation.

A different animation can be chosen by clicking the pencil icon. This clears the constrained animation and allows a new animation to be chosen.


## Loop

When checked, the constrained animation repeats in a loop beyond the frames of the animation.

When unchecked, the constrained animation displays the first frame for any negative frame selected in the slider, and the last frame for any frame that is greater than the length of the animation.


## Additive

When checked, the existing pose is added to the slider animation. This means the resulting animation is relative to the constrained animation's pose before the transform constraint is applied.

When unchecked, the transform of the constrained bones is modified to match the source bone's transform. This means when the mix is 100, the constrained bone's transform before the transform constraint is applied has no affect on the resulting transform.

## Frame

The frame slider controls the frame of the constrained animation to display. This slider can be [keyed](/spine-keys) in other animations.

![](/img/spine-user-guide/slider/slider-bone.png)

## Bone

This shows the source bone. When one bone is constrained, clicking the bones selects it.

A different bone can be chosen by clicking the pencil icon. This clears the constrained bone and allows a new bone to be chosen.

When a bone is selected, the Frame slider is hidden, and the options Locan and Property are displayed.

## Local

When checked, the local transform of the sorce bone is used.

When unchecked, the world transform is used instead.

## Property

Property is used to map the range of a transform to the frames of the animation. A drop-down menu allows to choose the desired bone transform. the numbers on the left of the arrow represent the two limits of the source bone range. The numbers on the right allow to choose the first and last frame of the animation to match the range of the bone.

## Mix

The mix slider controls the percentage of influence of the slider, see [constraint mix](/spine-constraints#Mix). The mix can be [keyed](/spine-keys#Transform-constraints).


[Previous: Physics constraints](/spine-physics-constraints)
[Next: Events](/spine-events)
[Spine User Guide: Table of Contents]
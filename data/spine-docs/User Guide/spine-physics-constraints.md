http://esotericsoftware.com/spine-physics-constraints

[Physics constraints - Spine User Guide]
[[Learn how to use physics constraints for more expressive power in your Spine animations.]]

# Physics constraints

<callout>Physics constraints are not available in Spine Essential.</callout>

A physics constraint simulates how physics and secondary motion would affect the movement of a bone.

Physics constraints can be used to animate secondary motion for hair, clothing, and other items. Anything that moves naturally can use physics to move automatically.
Besides saving time, physics also allows dynamic movement at runtime. Physics reacts fluidly and realistically both across animations and from movement of your character through the game world.

# Setup

To create a physics constraint, select the bone to be constrained, then click `New...` `Physics Constraint` in the tree properties. 

Each slider in the Setup section affects the overall setup for the physics constraint.
Setting a slider to 0 means the physics constraint moves fully with the unconstrained pose, as if there are no physics affecting it. 
Setting a slider to 100 gives the maximum physics offset due to movement of the bone.

## Bone

This shows the constrained bone. When a bone is constrained, clicking the bone selects it.

Opening the select box and clicking a bone will select that bone. Right clicking a bone name without opening the select box will select that bone.

A different bone can be chosen by clicking the pencil icon. This clears the constrained bone and allows a new bone to be chosen.

[Bone length](/spine-bones#Length) affects the movement of physics. For example, how much things rotate. Because of this, translation depends on the bone length.

The bigger effect of bone length is that when a bone moves, it adjusts to try to stay in its old position. There are no forces being applied, so there is no mass involved. Instead, it's an offset from the real bone position to make the bone lag behind the movement.

<callout> To have separate settings for different aspects such as rotation and shear, use multiple physics constraints on the same bone.</callout>

## Translate X
The translate X slider sets how much the bone's X translation is affected by the physics constraint.

## Translate Y
The translate Y slider sets how much the bone's Y translation is affected by the physics constraint.

## Rotation
The Rotation slider sets how much the bone's rotation is affected by the physics constraint.

## Shear X
The shear X slider sets how much the bone's shear X is affected by the physics constraint.

## Scale X
The scale X slider sets how much the bone's scale X is affected by the physics constraint.
Scale X works like rotation: when a bone is moved, the tip of the bone will resist this change and try to stay in the same place, resulting in the bone being compressed or stretched depending on the new position.

## Limit

The limit slider sets the maximum speed of translation that affects physics.

## FPS

Physics constraint FPS is the update rate. It determines how much time needs to pass before physics forces are applied again.
When a skeleton is moving, bones affected by physics are continuously adjusted to lag behind (inertia) but the forces are applied at a fixed rate.
This can be seen easily at low FPS, where the physics will start to look jumpy.
if the FPS are changed, the simulation is also affected, often resulting in needing to readjust the other sliders.
The lower the FPS the more likely the simulation is to fail. 30-60 is usually a good range.

# Properties

Properties can be [keyed](/spine-keys) in animations.

## Inertia
Inertia controls the degree of bone movement transferred to the properties' physics offset. 100% inertia means the property's offset is maximally affected by bone movement, while 0% means it's not affected at all. An inertia value of 100 creates an offset that maintains the bone's position prior to movement. Strength is responsible for moving the bone to its real (unconstrained) position.
In physics constraints, inertia is not used for force application. Instead, it's utilized when a bone moves and physics-controlled properties (x/y/rotation/scaleX/shearX) require adjustment to simulate lagging behind the action. The constrained pose from physics constraints is achieved by "offsetting" properties from the unconstrained pose based on bone movement.

## Strength
Strength is the force that attempts to return the scale to the unconstrained pose.

## Damping
Damping reduces speed more significantly at higher velocities. This feature allows for the reduction of large movements in the motion without slowing down all motion. It reduces oscillation by quickly diminishing large movements.

## Mass
When forces are applied, mass represents the resistance to acceleration. For example, it affects the acceleration resulting from strength trying to return to the unconstrained pose. Higher mass is more difficult for strength to manipulate. Strength can be increased to compensate. Different combinations of mass and strength produce varying motion characteristics.

## Wind

Wind applies a constant force along the world X axis.

## Gravity

Gravity applies a constant force along the world Y axis.

## Global

When checked for a property, it allows multiple physics constraints to be controlled by a single [timeline row](/spine-dopesheet#Rows).

##Mix

The percentage of influence from the constraint. 
See [constraint mix](/spine-constraints#Mix). The mix property can be [keyed](/spine-keys#physics-constraints).

## Simulate

This option applies all physics simulations for the current skeleton. When simulate is disabled and the timeline position is changed, physics are "fast forwarded" from frame zero to the current frame using the highest physics update rate on any constraint in the skeleton. This produces the pose that would result from playing the animation at normal speed from frame 0 to the current frame.
During export, fast forwarding is performed for each frame. This means the export fps and physics fps don't interact; each exported frame is equivalent to jumping the timeline to that position.

## Deterministic

This option applies physics simulations in animate mode starting from frame 0 instead of continuously, resulting in higher CPU usage. When enabled, the pose displayed in the editor is the result of applying the animation and physics multiple times from frame 0 to the current frame. This provides a consistent pose for any given frame.
Deterministic mode allows users to scrub back and forth on the timeline and observe the physics rewinding. It also facilitates easier animation without physics causing excessive bone movement, while still maintaining physics effects.
Note that this feature may cause a jump at the end of looping animations. For loops, it may be preferable to leave Deterministic unchecked.
The drawback of enabling Deterministic is increased computational load for Spine when posing each frame, with the workload increasing for higher frame numbers on the timeline. At runtime or when Deterministic is off, physics calculations are more efficient. Deterministic mode can cause frame rate drops due to the application of animation and physics hundreds or thousands of times for each editor frame.
Deterministic mode only affects the editor. At runtime, developers can implement "fast forward" physics if desired. The code can also control when physics are reset, or physics can be reset by keying the reset with the Reset and Reset All buttons in the Spine editor.

## Reset

Resets the current physics constraint.

## Reset All

Resets all the physics constraints in a project.

# Warnings

A warning is shown on a physics constraint's tree icon if:

- **The length of a bone is invalid**: If your physics constraint has properties like rotate, scaleX, or shearX greater than 0 and the bone length is 0, you will get a warning. The physics constraint cannot apply these properties to a bone with zero length.

- **Nothing is active**: If your physics constraint has all its properties (x, y, rotate, scaleX, shearX) set to 0, it will generate a warning because the constraint would effectively do nothing.

- **Constraint not in a skin affecting a skin bone**: If bones affected by a constraint are in a skin but the constraint itself is not in that skin, you will get a warning. This is because the constraint cannot be applied when the bone's skin is not active. To fix this, add the constraint to the same skin as the bones. See [skin warnings](/spine-skins#Warnings) for more information.

# Limitations

## Warm Up

Because Physics are simulated in real time based on the current state of the skeleton, when exporting looping gifs, it is possible to run an animation for the desired number of times to prepare them for exporting videos and images. This can be achieved using the [Warm up](/spine-export) slider.

## No baking

Physics are intended mostly for runtime use and use less resources thanks to the fact that they require to set less keys.

# Reference Scale
The [skeleton](/spine-skeletons) has a property called `Reference scale`. This is the base scale factor for applying physics and other effects based on distance to non-scalable properties such as angle or scale.

When an entire skeleton is scaled, such as during [Import Data](/spine-import#Data), many of the values are scaled to match. For example, if a skeleton is scaled to 10% of its size, then keys that translate a bone 100 will translate it 10 after the scaling.
However, some values are based on distance, but cannot be scaled. For example, physics constraint gravity is a force that can affect translation, scale, rotation, and/or shear. If we scale the gravity to 10% then it affects translation 10% less and everything looks the same, just smaller, because all the translation in the skeleton was scaled. That doesn't work for rotation or scale.
Rotation is based on angles and is not affected by scaling the entire skeleton. Gravity affects rotation a certain amount at 100 reference scale. If you scale the skeleton to 10%, the way gravity affects rotation will not be the same. If you also change reference scale from 100 to 10, then gravity will affect rotation the same as it did at the 100% skeleton size.
The exact value of the reference scale doesn't matter much. It is important to design physics constraints to behave as desired at a given reference scale. If the whole skeleton is scaled and it is desired to have the physics behave identically, just smaller or larger, scale the reference scale by the same amount.

# Video

[youtube:ymEMtYxPpbM]

[Next: Sliders](/spine-sliders)
[Previous: Transform constraints](/spine-transform-constraints)
[Spine User Guide: Table of Contents]
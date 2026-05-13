http://esotericsoftware.com/spine-animating

[Animating - Spine User Guide]
[[]]

# Animating

Animating is an iterative process. The [graph](/spine-graph) and [dopesheet](/spine-dopesheet) are used extensively while animating to visualize [keys](/spine-keys) and adjust their timing and values. It is recommended to learn about how the graph and dopesheet work before applying the techniques below.

Becoming a great animator is a complex subject and deserves much more space than can be given here. We provide an ongoing video series called [Animating with Spine](/spine-videos#animatingWithSpine) and highly suggested reading [The Animator's Survival Kit](http://www.amazon.com/The-Animators-Survival-Richard-Williams/dp/0571202284) by Richard Williams. For a brief overview, see the "12 basic principles of animation" on [Wikipedia](http://en.wikipedia.org/wiki/12_basic_principles_of_animation) or this [video series](https://www.youtube.com/playlist?list=PL-bOh8btec4CXd2ya1NmSKpi92U_l6ZJd).

# Workflow

There are many possible workflows for designing animations with Spine. Below are some of the most common approaches. Each individual animator will decide which combination of techniques work best for them and for a particular animation task.

## Straight ahead

In this approach each frame is posed sequentially from the start to the end of the animation. This is straightforward and easy to understand, so it is often how beginners intuitively approach animating.

Straight ahead has the benefit that the action flows naturally because the poses from frame to frame are similar. The drawback is that it is easy to lose focus of the animation's goals, such as fitting the animation within a specific amount of time. Also it may take longer to produce results than other approaches.

The straight ahead workflow can be very creative. It often works best when something is moving along a path rather than between specific poses.

Our [12 Principles](https://www.youtube.com/watch?v=ECM2WIN3cgY) video has a great exercise at the end for practicing straight ahead:

[youtube:ECM2WIN3cgY]

## Pose to pose

Pose to pose, also called "blocking", is traditionally the preferred method of beginning a new animation. It is done by first identifying the most important major poses of the animation with minimal concern for timing. Once these major poses are finalized, their timing can be adjusted and the movements between them filled in.

This approach focuses on the most important aspects of the animation first. The major poses capture the entire range of movement with a minimal amount of effort and changes to the animation at this point are easy to make. The drawback is that such a logical approach can hinder the flow of the animation, causing it to appear choppy or unnatural.

When using pose to pose, `Stepped` can be enabled on the [playback view](/spine-playback). This disables tweening between all keys, meaning that only the key poses will be seen.

## Layered

The layered approach means to only work on a few specific parts at time, hiding the rest. Multiple passes are done over the animation until all the parts have been animated.

For example, it can be useful to hide most of the attachments for a skeleton and focus on just the body and limbs during the first pass. For some animations, it can help to hide a skeleton's arms and legs and only animate the hips and torso, then go over the animation again to animate the legs, and again to animate the arms.

The layered approach removes distractions and allows the animator to focus on the most important parts of the skeleton, which will then dictate how the rest of the parts are animated. The drawbacks are that it requires a deep understanding of body mechanics, does not have the flexibility of pose to pose for making early changes to the animation, and can result in disconnected movements between the parts that were animated separately.

Layered works well for animations where most of the movement is defined by a subset of the skeleton's parts.

## Combined

It is often useful to combine the techniques. For example, first create major poses only for movements that *must* be in the animation (pose to pose), then go over the animation from start to finish (straight ahead) multiple times and animate only a subset of parts each time (layered). A combined approach can provide a balance between logical planning and creativity.

# Curves

Curves allow the animator to adjust the speed of a transition between keys. When all the parts of a skeleton are moving at a constant speed, the movement tends to be robotic and lifeless. See the [graph view](/spine-graph) for more information. 

# Videos

[youtube:iHDtWbFLf_w&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[youtube:CDdrR2MVudE&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[Next: Attachments](/spine-attachments)
[Previous: Keys](/spine-keys)
[Spine User Guide: Table of Contents]
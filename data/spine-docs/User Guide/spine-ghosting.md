http://esotericsoftware.com/spine-ghosting

[Ghosting view - Spine User Guide]
[[]]

# Ghosting view

The ghosting view contains settings for displaying skeleton "ghosts", also known as "onion skinning". Ghosting allows skeleton poses from preceding or subsequent timeline positions to be seen at the same time. These poses can then be considered when making decisions about the current pose.

![](/img/spine-user-guide/ghosting/ghosting-view.png)

# Frames

The frames section controls ghosts that are shown for preceding or subsequent frames.

![](/img/spine-user-guide/ghosting/frames.png)

<callout>For example, with `After frames` set to 6 and `Frame step` set to 3, two ghost poses will be drawn: one 3 frames ahead of the current frame and one 6 frames ahead of the current frame.</callout>

When `Before` is checked, ghosts are shown for preceding frames. When `After` is checked, ghosts are shown for subsequent frames.

The `Before frames` and `After frames` sliders control how far behind and ahead to draw ghosts. The `Frame step` slider sets how often a ghost is draw within that range. Fractional values may be typed into any of the slider text boxes, though rendering many ghosts can be taxing for the GPU.

When `Current` is checked, a ghost is shown for the current frame. This can be useful when [auto key](/spine-keys#Auto-key) is not enabled to see the difference between the current pose and the keyed pose. It can also be useful when showing ghosts [on top](#Options), only for the [selection](#Selection), or when hiding all attachments using the [viewport options](/spine-tools#Viewport-options).

# Key Frames

<callout>For example, with `After frames` set to 6 and `Key frame step` set to 1, a ghost will be drawn for all frames that have a key within the next 6 frames.</callout>

The `Key Frames` section is identical to the `Frames` section, except ghosts are only shown for frames that have a key set.

![](/img/spine-user-guide/ghosting/key-frames.png)

# Motion Vectors 

<callout>For example if `Before Frames` is set to 6, we can see how far a vertex moves in those 6 frames. If `Before Frames` is set to 1, we can see how far a vertex moves in 1 frame.</callout>

The `Motion Vectors` section enables drawing motion lines for mesh and region attachments. Motion vectors display how much and in which direction vertices move over time. This can be useful to visualize speed.

![](/img/spine-user-guide/ghosting/motion-vectors.png)

The `Threshold` setting hides motion vectors smaller than the threshold. When 0, all motion vectors are drawn.

# Display

<callout>The `Images`, `Silhouette`, and `Xray` settings can use significant GPU resources when many ghosts are displayed.</callout>

Each section has color buttons for the ghosts. The left color button sets the color of ghosts for preceding frames and the right button is for subsequent frames.

The left select box controls how ghost attachments are displayed: 

* `None` No attachments are displayed.
* `Images` Attachment images are rendered normally. The images are tinted using the chosen color. White tint leaves the images unchanged.
* `Solid` Attachment images are rendered using a solid color.

The right select box controls outlines for ghost attachments:

* `None` No outlines are displayed.
* `Silhouette` The entire ghost is outlined.
* `Xray` Each attachment is outlined.

# Options

![](/img/spine-user-guide/ghosting/options.png)

## Anchor

When checked, ghosts are shown at fixed intervals relative to frame 0. This means the ghosts don't change their pose when the timeline position changes, making it easier to see how the skeleton is animating. This is especially true when `Frame step` is greater than 1. `Anchor` only affects `Frames` ghosts. `Key Frames` ghosts are always anchored.

When unchecked, ghosts are shown relative to the current frame. This means the ghosts animate as the skeleton does, just shifted in time.

When [offset](#Offset) is used, the position anchored ghosts are drawn is based on how close in time the ghosts are to the current frame. When the animation is played, the ghosts will appear to slide toward or away from the current pose. Ghosts that are not anchored are always drawn at the offset distance from the skeleton.

## On top

When checked, the ghosts are drawn on top of the skeleton.

## Loop

When checked and `Repeat` is enabled for the timeline, ghosts will be shown past the start and end of the animation.

## Offset

The `X offset` and `Y offset` sliders control the drawing position of the ghosts on the X and Y axes. This has a number of uses.

`X offset` can make it easier to see the ghosts, otherwise they can be difficult to see when drawn on top of each other or on top of or behind the skeleton.

The offset can be used to simulate the speed the skeleton will be moving at runtime. The offset is defined as pixels per frame. Spine uses 30 frames per second, so the speed the skeleton will be moving at runtime can easily be converted to pixels per frame.

Once the ghosts have an `X offset` that matches the skeleton speed at runtime, ghosts will show if the feet are sliding for a running or walking animation. The animation matches the `X offset` perfectly when all of the ghost's feet land in the same position.

![](/img/spine-user-guide/ghosting/feet.png) 

If the feet will slide at runtime, the ghost's feet will not land in the same position. 

![](/img/spine-user-guide/ghosting/feet-sliding.png)

In this case, the animation needs to be [scaled](/spine-dopesheet#Scaling) slower or faster to match the `X offset`, or the `X offset` and runtime speed needs to be adjusted to match the animation.

`Y offset` can be used in a similar way, for example for a character that jumps.

## Selection

The bone selection button causes ghosts to be shown only for attachments in slots for the currently selected bones. If no bones are selected, all attachments are shown.

![](/img/spine-user-guide/ghosting/bones.png)

![](/img/spine-user-guide/ghosting/foot.png)

The lock button prevents the ghosts for the selected bones from changing and the refresh button updates the ghosted bones to the current selection.

# Video

[youtube:1n-VmK2eawM&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b?modestbranding=1&rel=0]

[Next: Graph view](/spine-graph)
[Previous: Dopesheet view](/spine-dopesheet)
[Spine User Guide: Table of Contents]
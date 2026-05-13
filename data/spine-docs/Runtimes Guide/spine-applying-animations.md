http://esotericsoftware.com/spine-applying-animations

[Applying Animations - Spine Runtimes Guide]
[[]]

# Applying Animations

Spine provides two APIs for applying animations.

# AnimationState API

[AnimationState](/spine-api-reference#AnimationState) supports applying animations over time, queuing animations for later playback, mixing (crossfading) between animations, and applying multiple animations on top of each other (layering).

AnimationState is stateful. It stores the animation times and other parameters for applying the animations. While a single AnimationState can pose multiple skeletons, it's somewhat rare to want multiple skeletons in exactly the same pose. Typically a single AnimationState instance will be used for each [Skeleton](/spine-api-reference#Skeleton) instance.

AnimationState is built on top of the [Timeline API](#Timeline-API) and can handle most animation playback needs, except for playing backward. If reverse playback is needed, the Timeline API can be used directly or the animation can be duplicated and reversed in Spine using box select [scaling](/spine-dopesheet#Scaling).

The AnimationState `update` method takes the time that has elapsed since it was last called and updates the internal state. The `apply` method takes a skeleton and applies the appropriate animations.

```
AnimationState state = ...
...
// Every frame:
state.update(delta);
state.apply(skeleton);
```

## Mix times

Creating an AnimationState instance requires supplying an [AnimationStateData](/spine-api-reference#AnimationStateData). When the AnimationState changes the current animation, it will automatically mix (crossfade) between the animations using the mix durations defined in the AnimationStateData, resulting in smooth animation transitions.

```
AnimationStateData stateData = new AnimationStateData(skeletonData);
stateData.setDefaultMix(0.1);
stateData.setMix("walk", "jump", 0.2);
stateData.setMix("jump", "walk", 0.4);
stateData.setMix("jump", "run", 0.25);
stateData.setMix("walk", "shoot", 0);
AnimationState state = new AnimationState(stateData);
```

Rather than manually specifying the mix duration for every animation pair, a default mix duration can be set. Also, the mix duration can be set on a case-by-case basis using the TrackEntry [mixDuration](/spine-api-reference#TrackEntry-mixDuration) property:

```
TrackEntry entry = state.setAnimation(0, "walk", true);
entry.mixDuration = 0.6;
```

As indicated by the "Data" suffix, AnimationStateData is stateless. The same AnimationStateData instance can be used with multiple AnimationStates.

## Tracks

Tracks allow animations to be applied in layers. Each track stores an animation and playback parameters. Tracks are numbered increasingly starting at zero (track index is an array index internally). When the AnimationState is applied to a skeleton, the track animations are applied in order, starting with the lowest track number.

Tracks have many uses. For example, an animation that does not key everything can be played on a higher track, overriding the lower track only for what is keyed. Track 0 could have a walk, run, swim, or other animation and track one could have a shoot animation that keys only the arm and gun firing. Also, setting the TrackEntry [alpha](/spine-api-reference#TrackEntry-alpha) for a higher track allows it to mix with the tracks below it. For example, track 0 could have a walk animation and track 1 could have a limp animation. The alpha for track 1 is increased as the player takes damage, so they limp more and more.

## Playback

Setting the animation for a track is done by calling [setAnimation](/spine-api-reference#AnimationState-setAnimation). This replaces the current animation and any queued animations on that track with the specified animation. If a mix duration is defined between the previous animation and the current animation, then the current animation will be mixed out over the mix duration so the transition between animations is done smoothly.

`setAnimation` returns a [TrackEntry](#TrackEntry) which can be used to customize playback in many ways.

By default, the animation will continue to be applied until another animation is played or the track is cleared. To stop the animation after a specific amount of time, the TrackEntry [trackEnd](/spine-api-reference#TrackEntry-trackEnd) time can be set.

## Queuing

To queue animations to play in the future, call [addAnimation](/spine-api-reference#AnimationState-addAnimation). This schedules the animation to play after the current or last queued animation for the track. If the track is empty, it is equivalent to calling `setAnimation`.

`addAnimation` returns a [TrackEntry](#TrackEntry) which can be used to customize playback.

## Empty animations

When a track has no current animation and an animation is set, it begins playing right away. To instead mix in the animation from the setup pose, an empty animation can be used.

When a track is cleared, the track's animations are no longer applied, leaving the skeletons in their current pose. To instead mix out the animation to the setup pose, an empty animation can be used.

An empty animation has no timelines. It is used as a placeholder so a mix duration can be set. For convenience, the [setEmptyAnimation](/spine-api-reference#AnimationState-setEmptyAnimation) and [addEmptyAnimation](/spine-api-reference#AnimationState-addEmptyAnimation) methods are provided for setting or queuing an empty animation.

To mix an animation in from the setup pose, set an empty animation, add the animation to mix in, then set the mix duration:

```
state.setEmptyAnimation(track, 0);
TrackEntry entry = state.addAnimation(track, "run", true, 0);
entry.mixDuration = 1.5;
```

To mix an animation out to the setup pose, set or queue an empty animation specifying a mix duration:

```
state.setAnimation(track, "run", true, 0);
state.addEmptyAnimation(track, 1.5, 0);
```

When an animation reaches the TrackEntry [trackEnd](/spine-api-reference#TrackEntry-trackEnd) time, properties that the animation keyed are set to the setup pose and the track is cleared. It may be desired to use `setEmptyAnimation` or `addEmptyAnimation` to mix the skeletons back to the setup pose, rather than have it happen instantly.

## TrackEntry

The methods that set or queue animations return a TrackEntry which can be used to further customize playback. Refer to the [TrackEntry API reference](/spine-api-reference#TrackEntry) for the many settings that are available.

### References

It is possible to keep a reference to the TrackEntry, for example, to adjust the `alpha` or `timeScale` properties over time. However, care must be taken not to hold the reference past when the `dispose` listener event occurs.

## Listeners

An application can register a callback to be notified of TrackEntry lifecycle events. `addListener` on the AnimationState registers the listener for all TrackEntry events. A listener can also be set on a specific TrackEntry to receive only events from that entry.

The events that are possible are listed on [AnimationStateListener](/spine-api-reference#AnimationStateListener) and are guaranteed to occur in the order specified. Events are queued during the internal processing done by the AnimationState `update` or `apply` methods and listeners are notified afterward, just before the method returns. This makes it safe for listeners to manipulate the AnimationState, for example to set animations or clear tracks. However, all events that have already been queued will still be fired unless [clearListenerNotifications](/spine-api-reference#AnimationState-clearListenerNotifications) is used.

Changes made to the AnimationState in a listener, such as setting a new animation, are not applied to skeletons until the next time AnimationState `apply` is called. This can be done in the listener, but care must be taken to first call `update`:

```
// Inside a listener:
state.setAnimation(0, "jump", false);
state.update(0); // Advance internal state.
state.apply(skeleton);
```

The `apply` method does not change any internal state, allowing a single AnimationState to be applied to multiple skeletons. Calling `update` lets the AnimationState know all the applying is complete and subsequent `apply` calls are for the next frame. If `update` is not called, `apply` may trigger the same listener notification resulting in an infinite loop and stack overflow.

## Video

This video explains using AnimationState with [spine-unity](/spine-unity), but much of the information is applicable to all other Spine runtimes.

[youtube:DxDZtTK2nlE?start=190]

# Timeline API

The Timeline API is the lowest level API for applying animations and consists of the [Animation](/spine-api-reference#Animation) and [Timeline](/spine-api-reference#Timeline) classes. These classes are stateless, so the time and other parameters for applying the animation must be stored and manipulated externally. This API provides the most control over animation playback, but requires more work to manage the playback state yourself. Most users will prefer to use the [AnimationState API](#AnimationState-API).

An Animation is very simple, it has a name and a list of Timelines. Each timeline knows how to modify a specific skeleton property over time. Applying an animation to a skeleton is done by calling [apply](/spine-api-reference#Timeline-apply) for each timeline in the animation.

```
time += delta;
alpha = 1; // For mixing between the current or setup pose (0) or the animation pose (1).
blend = MixBlend.first; // How the current or setup pose is mixed with the animation pose.
direction = MixDirection.in; // Whether mixing out to the setup pose or in to the animation pose.

for (Timeline timeline : animation.timelines)
	timeline.apply(skeleton, lastTime, time, events, alpha, blend, direction);

// The events list contains any events fired between lastTime and time.
// Process them here, then clear the list.
events.clear();

lastTime = time;
```

Animation has an `apply` convenience method for doing this which has a `loop` parameter and simply calls `apply` on each timeline.

```
loop = true;
animation.apply(skeleton, lastTime, time, loop, events, alpha, blend, direction);
```

[Next: Runtime Skeletons](/spine-runtime-skeletons)
[Previous: Loading Skeleton Data](/spine-loading-skeleton-data)
[Spine Runtimes Guide: Table of Contents]
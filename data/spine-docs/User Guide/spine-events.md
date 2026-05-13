http://esotericsoftware.com/spine-events

[Events - Spine User Guide]
[[Use events to trigger sounds, special effects, and more during your animations.]]

# Events

<callout>Events are not available in Spine Essential.</callout>

An event is a trigger for something to happen during an animation. In the Spine editor, an event can be configured to play audio. Otherwise, events are intended to be handled at runtime, where you can write code to take whatever action you like in response to the events. For example, to spawn particle effects, hurt an enemy, open a door, etc.

While audio playback for audio events is a feature in the Spine editor, the Spine Runtimes do not manage audio playback. At runtime, code needs to be written to [handle events](/spine-applying-animations#Listeners) and play the appropriate audio using the event's audio path, volume, and balance properties.

Video exported from Spine can include audio from audio events. See [AVI export](/spine-export#AVI) and [MOV export](/spine-export#MOV) for more details.

# Setup

An event is created by selecting the `Events` node in the tree and clicking `New...` `Event`.

![](/img/spine-user-guide/events/new.png)

# Properties

![](/img/spine-user-guide/events/properties.png)

The `Integer`, `Float`, and `String` properties are values that give extra information or context for the event. The setup pose has defaults for these values and each event key may have different values.

## Integer

Stores a whole number, without a fractional component. It may be [keyed](/spine-keys#Events).

## Float

Stores a number that may have a fractional component. It may be [keyed](/spine-keys#Events).

## String

Stores a text string. It may be [keyed](/spine-keys#Events).

## Audio path

When the audio path is set, the Spine editor will play the corresponding audio file when keys for this event are encountered during animation playback. See [audio file lookup](#Audio-file-lookup) for more information.

Once the audio path is set, the event becomes an [audio event](#Audio-events) and the `Volume` and `Balance` properties appear.

### Volume

Sets the playback volume of the audio event when played in the Spine editor. It may be [keyed](/spine-keys#Events).

### Balance

Sets the balance of the audio event when played in the Spine editor. It may be [keyed](/spine-keys#Events).

For 2 channel audio, this sets the volume of the left and right channels. For 1 channel audio, this pans the audio left or right.

# Audio node

The `Audio` node in the tree has a path to a folder where Spine will find WAV, MP3, and OGG audio files for the skeleton. The audio path can be relative to where the project file is saved or can be an absolute path. The `Browse` button can be used to specify a path, or you can type a path and press `enter`. Once the path is set, the audio files in that folder appear under the `Audio` node. Spine watches the audio folder and immediately loads any changes to the audio files.

![](/img/spine-user-guide/events/audio.png)

By default, only the first 2,000 audio files found in the audio folder are shown. This prevents Spine from scanning millions of files if the wrong path is accidentally specified. Uncheck `Limit scanning` to allow Spine to find more than 2,000 audio files.

## Audio events

An "audio event" is an event that has an [audio path](#Audio-path) set. The audio path can be set by typing it or dragging an audio file to an event in the tree.

Alternatively, a new audio event can be created by selecting an audio file and clicking `New Event` in the tree properties. This creates an event with the same name and sets the audio path.

Each audio file under the `Audio` node has a red icon if it is not used by any event and a green icon if it is used by at least one event.

If the visibility dot next to the event in the tree is cleared, the audio will not be played and won't show in the [audio view](/spine-audio-view).

## Audio file lookup

Spine finds the audio file for an event by taking the path specified under the `Audio` node and appending the event's audio path. The event's audio path does not need to include a file extension. Spine will look for files with `.wav`, `.mp3`, or `.ogg` file extensions.

For example, if the audio node has `./audio/` and an event has an audio path of `footstep`, Spine will look for `./audio/footstep.wav`, `./audio/footstep.mp3`, and `./audio/footstep.ogg`. Note that some operating systems are case sensitive.

The audio path can include subfolders. For example, if the audio node has `./audio/` and an event has an audio path of `gun/reload`, Spine will find `./audio/gun/reload.wav`.

## Audio formats

Spine supports WAV, MP3, and OGG audio files. WAV files need to be PCM, 1 or 2 channels, and 16 bits per sample.

[SoX](http://sox.sourceforge.net/) is a free command line tool for converting audio files. For example, to convert a WAV file to 16 bits per sample:

```
sox input.wav -b 16 output.wav
```

# Viewport events

When an event key is encountered during animation playback, the event name is shown briefly above the skeleton in the viewport.

![](/img/spine-user-guide/events/viewport-name.png)

To hide an event name in the viewport, clear the visibility dot next to the event in the tree. If it is an audio event, it will not be played and won't show in the [audio view](/spine-audio-view).

To hide all event names in the viewport, set both the [graph filter](/spine-graph#Filters) and [dopesheet filter](/spine-dopesheet#Filters) to exclude events.

## Folders

Events can be organized into folders. To create a folder, selectn an event and click `New...` `Folder`. Events can be moved between folders by dragging them.

In exported skeleton data, folder names are prepended to the event name to create the final name used in the Spine Runtimes. For example, if the folder `attacks` has an event `reload`, then the event name at runtime is `attacks/reload`.

# Video

[youtube:gPj9ZkSb0gU&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[Next: Views](/spine-views)
[Previous: Sliders](/spine-sliders)
[Spine User Guide: Table of Contents]
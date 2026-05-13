http://esotericsoftware.com/spine-graph

[Graph - Spine User Guide]
[[]]

# Graph

The graph view displays and edits both the timing and values of an animation's [keys](/spine-keys). Key values are plotted on the Y axis and time is on the X axis. The resulting "curve" is a line that shows how the value changes over time.

In comparison, the [dopesheet](/spine-dopesheet) shows only the timing of the keys, not their values, but can show the keys for many different properties at once. The graph may be crowded when many keyed properties are shown at once.

![](/img/spine-user-guide/graph/view.png)

See the graph [tips](/spine-tips#Graph) for various ways to use the graph efficiently.

# Rows

<callout>The graph rows can be hidden with the `Hide rows` [view setting](#Hide-rows) or `Hide Graph Rows` [hotkey](/spine-settings#Hotkeys).</callout>

On the left, below the [timeline](/spine-keys#Timeline), rows are shown for each keyed property, grouped by bone. Each row has a visibility dot to set which properties' curves are shown in the graph. Right click or hold control when left clicking a visibility dot to set multiple visibility dots at the same time.

![](/img/spine-user-guide/graph/rows.png)

Scrolling the mouse wheel over the graph rows scrolls them up or down. Similar to the viewport, drag with the right mouse button to pan the graph rows up and down.

## Overview row

The first row in the graph is the "overview row" and shows the animation name. Setting the visibility dot for the overview row sets it for all the rows currently shown in the graph. When many curves are shown, the graph may be crowded and it may be easier to use the [dopesheet](/spine-dopesheet).

<callout>Clicking the animation name can be useful when another animation needs to be selected, though the [animations view](/spine-animations-view) is even faster.</callout>

When a project has multiple skeletons, an overview row will appear above the rows for each skeleton. Hiding a skeleton in the tree will also hide it in the graph.

Click the animation name to select the animation in the tree.

## Bone rows

![](/img/spine-user-guide/graph/rows-bone.png)

Keys are grouped by the bone most related to the keyed property. Setting the visibility dot for a bone row sets it for all the property rows under it.

<callout>Clicking a bone name is more useful when the graph is [locked](#Locked), since the graph rows won't change when the bone is selected.</callout>

Click the bone name to select the bone in the viewport. Hold `ctrl` (`cmd` on Mac) to toggle the selection or select multiple bones.

Bone rows can be dragged up or down to change their [order](#Row-order) in the graph.

## Property rows

![](/img/spine-user-guide/graph/rows-property.png)

Under a bone row are property rows for each keyed property. Setting the visibility dot for a property row causes the curves for that property to be shown in the graph. A single property may have multiple curves.

<callout>Clicking the name of a [bone transform](/spine-tools#Bone-transforms) property will also select the corresponding [transform tool](/spine-tools#Transform-tools) to make setting new keys faster.</callout>

Click the property name to select the item in the viewport or tree. Hold `ctrl` (`cmd` on Mac) to toggle the selection or select multiple items.

## Other rows

Rows for [draw order](/spine-keys#Draw-order) and [events](/spine-keys#Events) aren't associated with a bone, so they are shown at the bottom of the graph when they have keys. Those rows can be hidden using the [graph filter](#Filters).

# Contents

The graph has two modes to control which bone rows are shown: unlocked and locked.

## Unlocked

![](/img/spine-user-guide/graph/unlocked.png)

<callout>To see all bone rows, [deselect](/spine-tools#Deselect) by pressing `spacebar`, `escape`, or by double clicking anywhere in the viewport.</callout>

The graph is unlocked by default. When unlocked, which bone rows are shown depends on the viewport or tree selection. If bones (or items under a bone) are selected, only the bone rows for those bones are shown and their visibility dots are set automatically.

If no bones are selected in the viewport or tree, then all bone rows are shown. If there are only a few bones, their visibility dots are set automatically. However if there are many bones, only the first bone's visibility dots will be set because it's not usually useful to see all the curves for many bones at once.

Using the graph unlocked is useful when only needing to see the keys for one bone at a time. When working on multiple bones, locking the graph contents may be more convenient.

## Locked

![](/img/spine-user-guide/graph/lock.png)

Click the lock button to lock the graph, preserving which bone rows are shown. While locked, changing the viewport or tree selection does not affect which bone rows are shown.

Locking the graph is useful when working on multiple bones or a particular set of bones, allowing multiple bone rows to be seen while selecting different bones.

#### Refresh

![](/img/spine-user-guide/graph/lock-refresh.png)

The refresh button updates the graph to show the bone rows for the current selection. This is equivalent to unlocking and locking the graph again.

#### Select

![](/img/spine-user-guide/graph/lock-select.png)

The select button selects the bones in the viewport for all of the currently shown bone rows. It can be useful to select the bones, modify the selection, then click refresh to change the bone rows shown in the graph.

## Order

Bone rows appear in the graph using the order the bones were selected. Bone rows can be rearranged by dragging them up or down.

## Visibility

Bone rows for [bones in a skin](/spine-skins#Skin-bones) are only shown when the skin is active. The tree view setting [Hide viewport skin bones](/spine-tree#Hide-viewport-skin-bones) can be unchecked to see all bone rows.

Property rows for [attachments in a skin](/spine-skins#Skin-attachments) are only shown when the skin is active. The tree view setting [Show all skin attachments](/spine-tree#Show-all-skin-attachments) can be unchecked to see all attachment property rows.

# Filters

The graph can be filtered to show only the chosen types of properties. Click the filter button to select the property types that will be shown. When a filter is active, the filter button is red.

![](/img/spine-user-guide/graph/filter-graph.png)

Hold `ctrl` (`cmd` on Mac) or `shift` to select multiple filters. The `Reset` button selects all filters.

When `Current tool` is active, only the [bone transform](/spine-tools#Bone-transforms) properties that corresponding to the current [transform tool](/spine-tools#Transform-tools) are shown.

Right click the filter button to toggle the filters on or off.

# Curves

Keys are shown in the graph as squares. The position on the X axis represents the key's [frame](/spine-keys#Frames) and corresponds to the timeline at the top of the graph. The position on the Y axis represents the key's value and corresponds to the labels on the right edge of the graph.

![](/img/spine-user-guide/graph/keys.png)

Lines are drawn between keys to show how the value changes between the keys.

When a curve bends sharply or is very large, it may be possible to see the line segments that make up the curve. This is not a bug. The graph shows exactly how the curve is approximated at runtime. If a curve is not smooth enough, it is easily remedied by adding another key.

When the graph shows multiple curves, some curves may appear behind others. Select or hover over a key or handle to cause that curve to be drawn on top.

## Repeat

When [repeat](/spine-keys#Repeat) is disabled, the setup pose is shown left of the first key and the last key value is shown right of the last key.

![](/img/spine-user-guide/graph/repeat-disabled.png)

When repeat is enabled, the curves are shown dimly before and after the animation to allow seeing transitions at the animation's beginning and end. Also, if the first and last keys have the same value and are Bezier, the handle is shown on the opposite key.

![](/img/spine-user-guide/graph/repeat-enabled.png)

The arrow button at the bottom of the graph, under frame zero, adds more space before frame zero.

## Separate properties

![](/img/spine-user-guide/graph/separate-rgba.png)

A single property may have multiple curves. For example, an RGBA property has four curves: red, green, blue, and alpha. Each key for the property stores values for all the curves, but when using a Bezier curve, each curve has its own handles that can be adjusted independently.

Some values that are normally keyed together as a single property can be "separated" so each value can be keyed independently. Bone transform [X and Y](/spine-keys#Separate-X-and-Y) and slot [color and alpha](/spine-keys#Separate-color-and-alpha) properties can be separated.

## Curve types

Each key has a "curve type" which determines the interpolation between the key and the next key. To set the curve type, select one or more keys and click one of the curve type buttons.

#### Stepped

![](/img/spine-user-guide/graph/curvetype-stepped.png)

The stepped curve type holds the key's value until the next key is reached.

#### Linear

![](/img/spine-user-guide/graph/curvetype-linear.png)

The linear curve type interpolates between keys using a straight line. This means the value changes at a constant rate as the timeline position moves from the key to the next key.

#### Bezier

![](/img/spine-user-guide/graph/curvetype-bezier.png)

The Bezier (pronounced `bez-ee-ay`) curve type uses a Bézier curve to interpolate between key values. The curve has two handles that can be dragged to customize the rate at which the value changes between the keys.

If the selected keys are already Bezier and the Bezier button is clicked, the handles are reset to their default positions.

## Presets

![](/img/spine-user-guide/graph/presets.png)

A number of preset buttons are provided to position the Bezier handles. These buttons will also set the curve type to Bezier, if it is not already set.

#### Automatic

![](/img/spine-user-guide/graph/preset-automatic.png)

When enabled, the handles are set to automatic. The handle icons change to triangles and the angle of the handles is adjusted automatically based on the values of the keys before and after the key. If the handles are moved manually, they are changed back to manual handles.

Automatic handles often provide good results. It can be useful to first apply automatic handles, then adjust them manually only if necessary.

#### Separate

![](/img/spine-user-guide/graph/preset-separate.png)

When enabled, the handles are separated so moving a handle does not affect the handle on the other side of the key. This causes a cusp in the curve, where the transition of the value at the key is not smooth.

Hold `alt` (`option` on Mac) before dragging a handle will separate the handle. Pressing `alt` while dragging will toggle separate handles on and off.

#### Flat

![](/img/spine-user-guide/graph/preset-flat.png)

Moves the handles to be flat, aligning them vertically with the key.

#### Bounce

![](/img/spine-user-guide/graph/preset-bounce.png)

Separates the handles and moves them to point roughly in the direction of the previous and next keys. This can be useful when changing directions abruptly, such as when a ball bounces.

#### Ease out

![](/img/spine-user-guide/graph/preset-ease-out.png)

Moves the handles so the value changes more slowly near the key.

#### Ease in

![](/img/spine-user-guide/graph/preset-ease-in.png)

Moves the handles so the value changes more slowly near the next key.

# Navigation

<callout>Enabling [auto zoom](#Auto) greatly reduces the need to manually adjust the graph view.</callout>

The graph view shows curves for the [graph rows](#Rows) that have their visibility dot set. The curve area can be navigated by panning and zooming, just like the [viewport](/spine-ui#Viewport).

Use the right mouse button or hotkeys to [pan](/spine-ui#Panning).

Use the mouse wheel or hotkeys to [zoom](/spine-ui#Zooming) both the X and Y axes the same amount. To zoom each axis a different amount, hold `alt` (`option` on Mac) while dragging with the right mouse button.

## Frame

![](/img/spine-user-guide/graph/frame.png)

When the `Frame` button is clicked, the graph view is zoomed and panned so all the curves are visible. If keys or handles are selected in the graph, the graph view is zoomed and panned so only those visible.

## Auto

![](/img/spine-user-guide/graph/frame-auto.png)

When `Auto` is enabled, the graph view will automatically zoom to keep all the curves visible. Spine uses intelligent automatic zooming that avoids making unnecessary adjustments. Zoom can still be adjusted manually.

It is common to have `Auto` enabled most of the time because it greatly reduces the need to manually adjust the graph view.

# Selection

Click to select a key or handle. For a key, this will also set the timeline position to the selected key, if [jump to key](/spine-settings#Jump-to-key2) is enabled. Hold `ctrl` (`cmd` on Mac) to toggle the selection or select multiple keys or handles.

If the graph is [locked](#Locked) when a key is clicked, the item for the key is selected in the viewport or tree. This makes it easier to modify the selected key.

Right click a key to select the item for the key in the viewport or tree. When the graph is unlocked and many curves are shown, right clicking a key will change the graph to show only curves for the bone associated with that key.

When a key or handle is selected, press `ctrl+A` (`cmd+A` on Mac) to select all keys or handles in the same curve. Press it again to select all keys or handles shown in the graph.

When keys are selected in the graph, the same keys are selected in the dopesheet. Likewise, when keys are selected in the dopesheet, they are also selected in the graph.

## Sync

When dopesheet [sync](/spine-dopesheet#Sync) is enabled, the dopesheet shows the rows for the curves that are visible in the graph. In some cases it may be easier to use the dopesheet to move keys, especially the dopesheet [overview row](/spine-dopesheet#Overview-row).

## Box selection

When no keys or handles are selected, drag in empty space to box select keys. You may need to [deselect](/spine-tools#Deselect) first by pressing `spacebar`, `escape`, or by clicking in empty space in the graph.

![](/img/spine-user-guide/graph/box-select-nobox-gif.gif)

Hold `ctrl` (`cmd` on Mac) before dragging to make a box selection that starts on top of a key or handle.

To box select handles, first select a handle, then hold `ctrl` (`cmd` on Mac) before dragging to make a box selection.

To box select without leaving the box selection behind, drag and release the mouse button quickly. To keep the box selection when selecting keys, drag then pause briefly before releasing the mouse button.

![](/img/spine-user-guide/graph/box-select-gif.gif)

The edges of a box selection can be dragged to scale the selected keys. Scaling can be used to reverse the order of the keys by moving the left edge past the right, or the right edge past the left.

![](/img/spine-user-guide/graph/scale-gif.gif)

Hold `shift` to disable [frame snapping](/spine-keys#Frame-snapping) when creating or scaling a box selection.

# Manipulating keys

Selected keys and handles can be moved by dragging. When [drag to edit](/spine-settings#Drag-to-edit) is enabled, you can drag in empty space to make adjustments. Hold `ctrl+shift` (`cmd+shift` on Mac) when starting the drag to duplicate the selected keys. Hold `shift` while dragging to disable [frame snapping](/spine-keys#Frame-snapping).

Double click to delete a key.

When dragging a handle, press `alt` (`option` on Mac) while dragging to toggle [separate](#Separate). Hold `shift` to adjust only the length. Hold `ctrl+shift` (`cmd+shift` on Mac) to adjust the length of both handles at the same time.

## New keys

Normally new keys are assigned a linear curve type. However, if a key is placed between keys that are using Bezier or stepped, then the new key is assigned a Bezier or stepped curve type instead. When this is done for Bezier, the handles for the previous key, the new key, and the next key are adjusted so the curve does not change. This allows new keys to be added in the middle of an animation without changing the curves.

## Axes

![](/img/spine-user-guide/graph/axes.png)

The axes buttons allow moving keys to be restricted to only up/down or left/right.

## Snapping

![](/img/spine-user-guide/graph/snapping.png)

When a key is moved up or down, it is snapped horizontally to its original frame. This allows changing a key's value without accidentally changing its frame.

When a key is moved left or right, it is snapped vertically to its original value. This allows changing a key's frame without accidentally changing its values.

When key snapping is enabled, the key value snaps to other keys. This can help when a key needs to have the same value as another key. Key snapping can snap to any key, but prefers keys on the same curve. To snap to a specific key, first hover the mouse over the key briefly, then move the desired key and it will prefer to snap to the hovered key.

Key snapping can be enabled or disabled temporarily by holding `shit+alt` (`shit+option` on Mac).

When any snapping is applied, a white line is shown.

## Clipboard buttons

![](/img/spine-user-guide/graph/clipboard.png)

See [clipboard buttons](/spine-keys#Clipboard-buttons).

## Shift

![](/img/spine-user-guide/graph/key-shift.png)

See [shift](/spine-keys#Shift).

## Offset

![](/img/spine-user-guide/graph/key-offset.png)

See [offset](/spine-keys#Offset).

## Key shown

![](/img/spine-user-guide/key-frames/key-shown.png)

See [key shown](/spine-keys#Key-shown).

## Handle modes

When keys are moved left or right to adjust timing, normally the handles stay the same and may wreck the curves, especially when the handles aren't flat. Spine provides two handle modes so the handles of the key being moved and the handles of neighboring keys are adjusted automatically. This can reduce the need to adjust handles after moving keys.

#### Value

When enabled, the handles are scaled horizontally. The minimum and maximum values the curve reached remain the same.

#### Shape

When enabled, the handles are moved to keep the original shape of the curve. The minimum and maximum values the curve reached may change.

# Favor

[youtube:RUzXpwwt6hM]

The favor button shows the favor slider, which is a workflow tool that helps you to create a breakdown pose that is more like the previous key or the next key.

![](/img/spine-user-guide/graph/favor.png)

A breakdown pose is an intermediate pose. It doesn't work by itself, it needs the main poses to explain the action. The main poses describe *what* is happening and the breakdown poses between them tell *how* it is happening, meaning which parts move first, how far, in what direction, and so on. Breakdown poses add interest to the basic movements and greatly improve the quality of the animation.

To use the favor slider, position the timeline between two keys and drag the favor slider. Dragging it to the left moves the keys toward the key before the current frame. Dragging it to the right moves the keys toward the key after the current frame. Hotkeys can be used to make using the favor slider faster. See the video above for more usage details.

When keys are selected, dragging the favor slider adjusts those keys. When no keys are selected, dragging the favor slider sets keys for all the visible curves, like [key shown](/spine-keys#Key-shown), and adjusts those keys.

The favor slider has modes that control how the keys are moved. The `Favor` mode is used most often, but the others can come in handy occasionally.

* `Favor` Moves keys toward the previous/next keys. When multiple keys are selected, keys further from the next/previous key move more slowly.
* `Blend` Moves keys toward the previous/next keys, like `Favor`. When multiple keys are selected, all keys move at the same speed.
* `Shift` Moves keys toward the previous/next keys by moving them all together, they don't change relative to each other.
* `Linear` Moves keys toward being on a line between the next/previous keys. 
* `Average (curve)` Moves keys toward the average of the next/previous keys on the same curve.
* `Average (frame)` Moves keys toward the average of other selected keys on the same frame.
* `Average (all)` Moves keys toward the average of the next/previous keys for all curves with selected keys.
* `Default` Moves keys toward the default values. Usually this is 0, but some properties use other values. For example, scale uses 1.
* `Setup` Moves keys toward the setup pose value.
* `Store` Moves keys toward the stored curves. Use [store](#Store) to set the stored curves.

Dragging past the edge of the slider will move the keys beyond the next or previous key. This can be used to achieve overshoot.

Clicking the heart icon resets the slider to the middle. This is equivalent to deselecting then making the same selection again.

# Store

![](/img/spine-user-guide/graph/store.gif)

The `Store` button stores all the current keys and handles for the whole animation. The stored curves are drawn in the background and can be used as a reference when adjusting keys and handles. Clicking `Store` again clears the stored keys and handles.

The `Swap` button swaps the stored keys and handles with the current keys and handles.

You can `Store`, make changes to your animation, then `Swap` to see if you like the new changes better. It can also be used with the `Store` [favor](#Favor) mode to adjust keys toward or away from the stored curves.

# View settings

#### Hide toolbar

![](/img/spine-user-guide/graph/hide-toolbar.png)

When checked, the graph toolbar is hidden. This can save some vertical space when the toolbar buttons are not needed or hotkeys are being used.

#### Hide rows

![](/img/spine-user-guide/graph/hide-rows.png)

When checked, the graph rows are hidden. This can save horizontal space, but without the rows the visibility dots cannot be used to control which curves are visible.

# Video

[youtube:37CeFRzrjqc]

[Next: Mesh Tools](/spine-mesh-tools)
[Previous: Ghosting](/spine-ghosting)
[Spine User Guide: Table of Contents]
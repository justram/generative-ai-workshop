http://esotericsoftware.com/spine-cpp

[spine-cpp Runtime Documentation]
[[Integration guide for the spine-cpp runtime.]]

# spine-cpp Runtime Documentation

> **Licensing**
>
> Please see the [Spine Runtimes License](/spine-runtimes-license) before integrating the Spine Runtimes into your applications.

# Introduction
spine-cpp is a generic C++ runtime for integrating Spine animations in game engines and frameworks that can interface with C++.

spine-cpp provides functionality to:
* Load and manipulate [Spine skeletons](/spine-loading-skeleton-data) and [texture atlases](/spine-texture-packer)
* Apply and mix [animations](/spine-applying-animations) with crossfading
* Manage [skins](/spine-runtime-skins) for visual variations
* Manipulate and compute data required for rendering and physics based on the current [skeleton pose, slots & attachments states](/spine-runtime-skeletons)

The runtime is engine-agnostic. You provide texture loading through a TextureLoader implementation and feed render commands into your engine's rendering system.

spine-cpp is written in C++11. It is exposed as a plain C API via [spine-c](/spine-c) as well.

Example integrations:
* [spine-ios](/git/spine-runtimes/tree/spine-ios) - iOS integration
* [spine-flutter](/git/spine-runtimes/tree/spine-flutter) - Flutter integration
* [spine-sdl](/git/spine-runtimes/tree/spine-sdl) - SDL integration
* [spine-glfw](/git/spine-runtimes/tree/spine-glfw) - GLFW integration
* [spine-ue](/git/spine-runtimes/tree/spine-ue) - Unreal Engine integration
* [spine-godot](/git/spine-runtimes/tree/spine-godot) - Godot integration

> **Note:** This guide assumes familiarity with [Spine runtime architecture](/spine-runtime-architecture) and terminology. See the [API reference](/spine-api-reference) for detailed function documentation.

# Integrating spine-cpp

## CMake Integration (Recommended)

The easiest way to integrate spine-cpp into your project is via CMake FetchContent:

```cmake
include(FetchContent)
FetchContent_Declare(
    spine-cpp
    GIT_REPOSITORY https://github.com/esotericsoftware/spine-runtimes.git
    GIT_TAG 4.3
    SOURCE_SUBDIR spine-cpp
)
FetchContent_MakeAvailable(spine-cpp)

# Link against spine-cpp
target_link_libraries(your_target spine-cpp)
```

This will automatically fetch and build spine-cpp.

Include the spine-cpp headers in your code:
```cpp
#include <spine/spine.h>
using namespace spine;
```

## Manual Integration

If you prefer manual integration:

1. Download the Spine Runtimes source using git (`git clone https://github.com/esotericsoftware/spine-runtimes`) or download it as a zip
2. Add the required source files to your project:
   - Add sources from `spine-cpp/src`
3. Add the include directory: `spine-cpp/include`

Include the spine-cpp headers in your code:
```cpp
#include <spine/spine.h>
using namespace spine;
```

# Exporting Spine assets for spine-cpp
![](/img/spine-runtimes-guide/spine-ue4/export.png)

Follow the Spine User Guide to:
1. [Export skeleton & animation data](/spine-export) to JSON or binary format
2. [Export texture atlases](/spine-texture-packer) containing your skeleton's images

An export yields these files:

![](/img/spine-runtimes-guide/spine-ue4/exported-files.png)

1. `skeleton-name.json` or `skeleton-name.skel`: skeleton and animation data
2. `skeleton-name.atlas`: texture atlas information
3. One or more `.png` files: atlas pages with packed images

> **Note:** You can pack images from multiple skeletons into a single texture atlas for efficiency. See the [texture packing guide](/spine-texture-packer).

# Loading Spine assets
spine-cpp provides APIs to load texture atlases, Spine skeleton data (bones, slots, attachments, skins, animations) and define mix times between animations through [animation state data](/spine-applying-animations#Mix-times). These three types of data, also known as setup pose data, are generally loaded once and then shared by every game object. The sharing mechanism is achieved by giving each game object its own skeleton and [animation state](/spine-applying-animations#AnimationState-API), also known as instance data.

> **Note:** For a more detailed description of the overall loading architecture consult the generic [Spine Runtime Documentation](/spine-loading-skeleton-data).

## Loading texture atlases
Texture atlas data is stored in a custom [atlas format](/spine-atlas-format) that describes the location of individual images within atlas pages. The atlas pages themselves are stored as plain `.png` files next to the atlas.

spine-cpp uses a `TextureLoader` interface to load textures. You need to implement this interface for your engine:

### Implementing a TextureLoader

```cpp
class MyTextureLoader : public TextureLoader {
public:
    virtual void load(AtlasPage& page, const String& path) {
        // Load texture from path
        void* texture = engine_load_texture(path.buffer());

        // Store the texture in the page
        page.texture = texture;

        // Set texture dimensions (required)
        page.width = texture_width;
        page.height = texture_height;
    }

    virtual void unload(void* texture) {
        // Unload the texture
        engine_unload_texture(texture);
    }
};
```

### Loading an atlas

With a TextureLoader implementation, you can load an atlas:

```cpp
// Create your texture loader
MyTextureLoader* textureLoader = new MyTextureLoader();

// Load atlas from file, the textureLoader is retained by the atlas until the atlas is disposed
// Atlas will use the DefaultExtension to load the file from the given path. This assumes
// stdio.h is available on the system.
Atlas* atlas = new Atlas("path/to/skeleton.atlas", textureLoader);

// Or load atlas from memory
const char* atlasData = read_file_to_string("path/to/skeleton.atlas");
Atlas* atlas = new Atlas(atlasData, strlen(atlasData), "path/to/atlas/dir", textureLoader);
```

The Atlas constructor automatically:
1. Parses the atlas data
2. Calls your TextureLoader for each atlas page
3. Sets up all regions with their texture references

## Loading skeleton data
Skeleton data (bones, slots, attachments, skins, animations) can be exported to human readable [JSON](/spine-json-format) or a custom [binary format](/spine-binary-format). spine-cpp stores skeleton data in `SkeletonData` objects.

### Loading from JSON

```cpp
// Create a JSON loader using the atlas
SkeletonJson json(*atlas);

// Optionally set the scale
json.setScale(0.5f);  // Scale skeleton to 50%

// Load skeleton data from file
SkeletonData* skeletonData = json.readSkeletonDataFile("path/to/skeleton.json");

// Or load from memory
const char* jsonString = read_file_to_string("path/to/skeleton.json");
SkeletonData* skeletonData = json.readSkeletonData(jsonString);

// Check for errors
if (!skeletonData) {
    printf("Error loading skeleton: %s\n", json.getError().buffer());
    exit(1);
}
```

### Loading from binary

```cpp
// Create a binary loader using the atlas
SkeletonBinary binary(*atlas);

// Optionally set the scale
binary.setScale(0.5f);  // Scale skeleton to 50%

// Load skeleton data from file
SkeletonData* skeletonData = binary.readSkeletonDataFile("path/to/skeleton.skel");

// Or load from memory
unsigned char* binaryData = read_file_to_bytes("path/to/skeleton.skel", &dataLength);
SkeletonData* skeletonData = binary.readSkeletonData(binaryData, dataLength);

// Check for errors
if (!skeletonData) {
    printf("Error loading skeleton: %s\n", binary.getError().buffer());
    exit(1);
}
```

> **Note:** Binary format is preferred for production as it's smaller and faster to load than JSON.

## Preparing animation state data
Spine supports smooth transitions (crossfades) when switching from one animation to another. The crossfades are achieved by mixing one animation with another for a specific mix time. spine-cpp provides the `AnimationStateData` class to define these mix times:

```cpp
// Create the animation state data
AnimationStateData* animStateData = new AnimationStateData(skeletonData);

// Set the default mix time between any pair of animations in seconds
animStateData->setDefaultMix(0.1f);

// Set the mix time between specific animations, overwriting the default
animStateData->setMix("jump", "walk", 0.2f);
```

The mix times defined in `AnimationStateData` can also be overwritten explicitly when applying animations (see below).

# Skeletons
Setup pose data (skeleton data, texture atlases) is shared between game objects. Each game object gets its own `Skeleton` instance that references the shared `SkeletonData` and `Atlas`.

Skeletons can be freely modified (procedural bone manipulation, animations, attachments, skins) while the underlying data stays intact. This allows efficient sharing across any number of game objects.

## Creating skeletons
```cpp
Skeleton* skeleton = new Skeleton(skeletonData);
```

Each game object needs its own skeleton instance. The bulk data remains shared to reduce memory consumption and texture switches.

> **Note:** Skeletons must be explicitly deleted with `delete skeleton` when no longer needed.

## Bones
A skeleton is a hierarchy of bones, with slots attached to bones, and attachments attached to slots.

### Finding bones
All bones in a skeleton have a unique name:

```cpp
// Returns NULL if no bone of that name exists
Bone* bone = skeleton->findBone("mybone");
```

### Local transform
A bone is affected by its parent bone, all the way back to the root bone. How a bone inherits from its parent is controlled by its [transform inheritance](/spine-bones#Transform-inheritance) setting. Each bone has a local transform relative to its parent consisting of:

* `x` and `y` coordinates relative to the parent
* `rotation` in degrees
* `scaleX` and `scaleY`
* `shearX` and `shearY` in degrees

The local transform is accessed through the bone's pose (`BoneLocal`):

```cpp
Bone* bone = skeleton->findBone("mybone");
BoneLocal& pose = bone->getPose();

// Get local transform properties
float x = pose.getX();
float y = pose.getY();
float rotation = pose.getRotation();
float scaleX = pose.getScaleX();
float scaleY = pose.getScaleY();
float shearX = pose.getShearX();
float shearY = pose.getShearY();

// Modify local transform
pose.setPosition(100, 50);
pose.setRotation(45);
pose.setScale(2, 2);
```

The local transform can be manipulated procedurally or via animations. Both can be done simultaneously, with the combined result stored in the pose.

### World transform
After setting up local transforms (procedurally or via animations), you need the world transform of each bone for rendering and physics.

The calculation starts at the root bone and recursively calculates all child bone world transforms. It also applies [IK](/spine-ik-constraints), [transform](/spine-transform-constraints), [path](/spine-path-constraints) and [slider](/spine-sliders) constraints.

To calculate world transforms:

```cpp
skeleton->update(deltaTime);
skeleton->updateWorldTransform(Physics_Update);
```

`deltaTime` is the time between frames in seconds. The second parameter specifies physics behavior, with `Physics_Update` being a good default.

The world transform is accessed through the bone's applied pose (`BonePose`):

```cpp
BonePose& applied = bone->getAppliedPose();

// Get world transform matrix components
float a = applied.getA();  // 2x2 matrix encoding
float b = applied.getB();  // rotation, scale
float c = applied.getC();  // and shear
float d = applied.getD();

// Get world position
float worldX = applied.getWorldX();
float worldY = applied.getWorldY();
```

Note that `worldX` and `worldY` are offset by the skeleton's x and y position.

World transforms should never be modified directly. They're always derived from local transforms by calling `skeleton->updateWorldTransform()`.

### Converting between coordinate systems
spine-cpp provides functions to convert between coordinate systems. These assume world transforms have been calculated:

```cpp
Bone* bone = skeleton->findBone("mybone");
BonePose& applied = bone->getAppliedPose();

// Get world rotation and scale
float rotationX = applied.getWorldRotationX();
float rotationY = applied.getWorldRotationY();
float scaleX = applied.getWorldScaleX();
float scaleY = applied.getWorldScaleY();

// Transform between world and local space
float localX, localY, worldX, worldY;
applied.worldToLocal(worldX, worldY, localX, localY);
applied.localToWorld(localX, localY, worldX, worldY);

// Transform rotations
float localRotation = applied.worldToLocalRotation(worldRotation);
float worldRotation = applied.localToWorldRotation(localRotation);
```

> **Note:** Modifications to a bone's local transform (and its children) are reflected in world transforms after calling `skeleton->updateWorldTransform()`.

## Positioning
By default, a skeleton is at the origin of the world coordinate system. To position a skeleton in your game world:

```cpp
// Make a skeleton follow a game object
skeleton->setX(myGameObject->worldX);
skeleton->setY(myGameObject->worldY);

// Or set both at once
skeleton->setPosition(myGameObject->worldX, myGameObject->worldY);
```

> **Note:** Changes to the skeleton's position are reflected in bone world transforms after calling `skeleton->updateWorldTransform()`.

## Flipping
A skeleton can be flipped to reuse animations for the opposite direction:

```cpp
skeleton->setScaleX(-1);  // Flip horizontally
skeleton->setScaleY(-1);  // Flip vertically

// Or both at once
skeleton->setScale(-1, 1);  // Flip horizontally
skeleton->setScale(1, -1);  // Flip vertically
```

For coordinate systems with y-axis pointing down (Spine assumes y-up by default), set this globally:

```cpp
Bone::setYDown(true);  // Affects all skeletons
```

> **Note:** Scale changes are reflected in bone world transforms after calling `skeleton->updateWorldTransform()`.

## Setting skins
Artists can create multiple [skins](/spine-runtime-skins) to provide visual variations of the same skeleton (e.g., different characters or equipment). A [skin at runtime](/spine-runtime-skins) maps which [attachment](/spine-basic-concepts#Attachments) goes into which [slot](/spine-basic-concepts#Slots).

Every skeleton has at least one skin defining the setup pose. Additional skins have names:

```cpp
// Set a skin by name
skeleton->setSkin("my_skin_name");

// Set the default setup pose skin
skeleton->setSkin(nullptr);
```

### Creating custom skins
You can create custom skins at runtime by combining existing skins (mix and match):

```cpp
// Create a new custom skin
Skin* customSkin = new Skin("custom-character");

// Add multiple skins to create a mix-and-match combination
customSkin->addSkin(skeletonData->findSkin("skin-base"));
customSkin->addSkin(skeletonData->findSkin("armor/heavy"));
customSkin->addSkin(skeletonData->findSkin("weapon/sword"));
customSkin->addSkin(skeletonData->findSkin("hair/long"));

// Apply the custom skin to the skeleton
skeleton->setSkin(customSkin);
```

> **Note:** Custom skins must be manually deleted with `delete customSkin` when no longer needed.

> **Note:** Setting a skin considers previously active attachments. See [skin changes](/spine-runtime-skins#Skin-changes) for details.

## Setting attachments
You can set individual attachments on slots directly, useful for switching equipment:

```cpp
// Set the "sword" attachment on the "hand" slot
skeleton->setAttachment("hand", "sword");

// Clear the attachment on the "hand" slot
skeleton->setAttachment("hand", nullptr);
```

The attachment is searched first in the active skin, then in the default skin.

## Tinting
You can tint all attachments in a skeleton:

```cpp
// Tint all attachments red with half transparency
skeleton->getColor().set(1.0f, 0.0f, 0.0f, 0.5f);

// Or using individual components
skeleton->getColor().r = 1.0f;
skeleton->getColor().g = 0.0f;
skeleton->getColor().b = 0.0f;
skeleton->getColor().a = 0.5f;
```

> **Note:** Colors in spine-cpp are RGBA with values in the range [0-1].

Each slot also has its own color that can be manipulated:

```cpp
Slot* slot = skeleton->findSlot("mySlot");
SlotPose& pose = slot->getPose();
Color& slotColor = pose.getColor();
// The slot color is multiplied with the skeleton color when rendering
```

Slot colors can be animated. Manual changes will be overwritten if an animation keys that slot's color.

# Applying animations
The Spine editor lets artists create multiple, uniquely named [animations](/spine-animating). An animation is a set of [timelines](/spine-api-reference#Timeline). Each timeline specifies values over time for properties like bone transforms, attachment visibility, slot colors, etc.

## Timeline API
spine-cpp provides a [timeline API](/spine-applying-animations#Timeline-API) for direct timeline manipulation. This low-level functionality allows full customization of how animations are applied.

## Animation state API
For most use cases, use the [animation state API](/spine-applying-animations#AnimationState-API) instead of the timeline API. It handles:
- Applying animations over time
- Queueing animations
- Mixing between animations (crossfading)
- Applying multiple animations simultaneously (layering)

The animation state API uses the timeline API internally.

spine-cpp represents animation state via `AnimationState`. Each game object needs its own skeleton and animation state instance. These share the underlying `SkeletonData` and `AnimationStateData` with all other instances to reduce memory consumption.

### Creating animation states
```cpp
AnimationState* animationState = new AnimationState(animationStateData);
```

The constructor takes the `AnimationStateData` created during loading, which defines default mix times and mix times between specific animations for [crossfades](/spine-applying-animations#Mix-times).

> **Note:** Animation states must be explicitly deleted with `delete animationState` when no longer needed.

### Tracks & Queueing
An animation state manages one or more [tracks](/spine-applying-animations#Tracks). Each track is a list of animations played in sequence ([queuing](/spine-applying-animations#Queuing)). Tracks are indexed starting from 0.

Queue an animation on a track:

```cpp
// Add "walk" animation to track 0, looping, without delay
int track = 0;
bool loop = true;
float delay = 0;
animationState->addAnimation(track, "walk", loop, delay);
```

Queue multiple animations to create sequences:

```cpp
// Start walking (looping)
animationState->addAnimation(0, "walk", true, 0);

// Jump after 3 seconds
animationState->addAnimation(0, "jump", false, 3);

// Idle indefinitely after jumping
animationState->addAnimation(0, "idle", true, 0);
```

Clear animations:

```cpp
// Clear track 0
animationState->clearTrack(0);

// Clear all tracks
animationState->clearTracks();
```

To clear and set a new animation with crossfading from the previous animation:

```cpp
// Clear track 0 and crossfade to "shot" (not looped)
animationState->setAnimation(0, "shot", false);

// Queue "idle" to play after "shot"
animationState->addAnimation(0, "idle", true, 0);
```

To crossfade to the setup pose:

```cpp
// Clear track 0 and crossfade to setup pose over 0.5 seconds
animationState->setEmptyAnimation(0, 0.5f);

// Or queue a crossfade to setup pose as part of a sequence
animationState->addEmptyAnimation(0, 0.5f, 0);
```

For complex games, use multiple tracks to layer animations:

```cpp
// Walk on track 0
animationState->setAnimation(0, "walk", true);

// Simultaneously shoot on track 1
animationState->setAnimation(1, "shoot", false);
```

> **Note:** Higher track animations overwrite lower track animations for any properties both animate. Ensure layered animations don't key the same properties.

### Track entries
When setting or queueing an animation, a [track entry](/spine-api-reference#TrackEntry) is returned:

```cpp
TrackEntry& entry = animationState->setAnimation(0, "walk", true);
```

The track entry lets you further customize this specific playback instance of an animation:

```cpp
// Override the mix duration when transitioning to this animation
entry.setMixDuration(0.5f);
```

The track entry is valid until the animation it represents is finished. It can be stored when setting the animation and reused as long as the animation is applied. Alternatively, call `getCurrent` to get the track entry for the animation currently playing on a track:

```cpp
TrackEntry* current = animationState->getCurrent(0);
```

### Events
An animation state generates events while playing back queued animations:
* An animation **started**
* An animation was **interrupted**, e.g. by clearing a track
* An animation was **completed**, which may occur multiple times if looped
* An animation has **ended**, either due to interruption or completion
* An animation and its corresponding track entry have been **disposed**
* A [user defined **event**](/spine-events) was fired

You can listen for these events by registering a listener with the animation state or individual track entries. Using C++11 lambdas:

```cpp
// Lambda with captured context
MyGameContext* context = getMyGameContext();

auto listener = [context](AnimationState* state, EventType type, TrackEntry* entry, Event* event) {
    switch (type) {
        case EventType_Start:
            printf("Animation %s started\n", entry->getAnimation()->getName().buffer());
            break;
        case EventType_Interrupt:
            printf("Animation interrupted\n");
            break;
        case EventType_End:
            printf("Animation ended\n");
            break;
        case EventType_Complete:
            printf("Animation completed (loops fire this each loop)\n");
            context->onAnimationComplete();  // Access captured context
            break;
        case EventType_Dispose:
            printf("Track entry disposed\n");
            break;
        case EventType_Event:
            // User-defined event from animation
            if (event) {
                const String& name = event->getData().getName();
                printf("Event: %s\n", name.buffer());

                // Access event data
                int intValue = event->getIntValue();
                float floatValue = event->getFloatValue();
                const String& stringValue = event->getStringValue();

                // Handle specific events
                if (name == "footstep") {
                    context->playFootstepSound(intValue);  // Use int as foot ID
                }
            }
            break;
    }
};

// Register listener for all tracks
animationState->setListener(listener);

// Or register listener for a specific track entry
TrackEntry& entry = animationState->setAnimation(0, "walk", true);
entry.setListener(listener);

// Alternative: inline lambda for simple cases
animationState->setListener([](AnimationState* state, EventType type, TrackEntry* entry, Event* event) {
    if (type == EventType_Complete) {
        printf("Animation loop completed: %s\n", entry->getAnimation()->getName().buffer());
    }
});

// Clear listeners by setting to nullptr
animationState->setListener(nullptr);
entry.setListener(nullptr);
```

For more complex event handling, you can use `AnimationStateListenerObject`:

```cpp
class MyAnimationListener : public AnimationStateListenerObject {
    MyGameContext* context;

public:
    MyAnimationListener(MyGameContext* ctx) : context(ctx) {}

    virtual void callback(AnimationState* state, EventType type, TrackEntry* entry, Event* event) override {
        switch (type) {
            case EventType_Start:
                context->onAnimationStart(entry->getAnimation()->getName());
                break;
            case EventType_Event:
                if (event && event->getData().getName() == "attack") {
                    context->dealDamage(event->getFloatValue());
                }
                break;
            // Handle other events...
        }
    }
};

// Use the listener object
MyAnimationListener* listener = new MyAnimationListener(context);
animationState->setListener(listener);

// Remember to delete when done
delete listener;
```

The track entry is valid until the animation it represents is finished. Any registered listener will be called for events until the track entry is disposed.

### Updating and applying
Each frame, advance the animation state by the frame delta time, then apply it to the skeleton:

```cpp
// In your game loop
void update(float deltaTime) {
    // Advance the animation state by deltaTime seconds
    animationState->update(deltaTime);

    // Apply the animation state to the skeleton's local transforms
    animationState->apply(*skeleton);

    // Calculate world transforms for rendering
    skeleton->update(deltaTime);
    skeleton->updateWorldTransform(Physics_Update);
}
```

`animationState->update()` advances all tracks by the delta time, potentially triggering [events](/spine-events).

`animationState->apply()` poses the skeleton's local transforms based on the current state of all tracks. This includes:
- Applying individual animations
- Crossfading between animations
- Layering animations from multiple tracks

After applying animations, call `skeleton->updateWorldTransform()` to calculate world transforms for rendering.

# Rendering

spine-cpp provides a renderer-agnostic interface for drawing skeletons. The rendering process produces `RenderCommand` objects, each representing a batch of textured triangles with blend mode and texture information that can be submitted to any graphics API.

## Render commands

After updating a skeleton's world transforms, generate render commands:

```cpp
// Using skeleton renderer (reusable for multiple skeletons, not thread-safe)
SkeletonRenderer renderer;
RenderCommand* command = renderer.render(*skeleton);
```

The renderer handles everything automatically:
* Batches triangles from consecutive region and mesh attachments that share the same texture and blend mode
* Applies clipping for clipping attachments
* Generates optimized draw calls

Each render command represents a batch with:
* Vertex data (positions, UVs, colors)
* Index data for triangles
* Texture to sample from
* Blend mode (normal, additive, multiply, screen)

## Processing render commands

Iterate through commands and submit them to your graphics API:

```cpp
// Simplified graphics API for illustration
void render_skeleton(RenderCommand* firstCommand) {
    RenderCommand* command = firstCommand;

    while (command) {
        // Get command data
        float* positions = command->positions;
        float* uvs = command->uvs;
        uint32_t* colors = command->colors;
        uint16_t* indices = command->indices;
        int numVertices = command->numVertices;
        int numIndices = command->numIndices;

        // Get texture and blend mode
        void* texture = command->texture;
        BlendMode blendMode = command->blendMode;

        // Set graphics state
        graphics_bind_texture(texture);
        graphics_set_blend_mode(blendMode);

        // Submit vertices and indices to GPU
        graphics_set_vertices(positions, uvs, colors, numVertices);
        graphics_draw_indexed(indices, numIndices);

        // Move to next command
        command = command->next;
    }
}
```

## Blend modes

Configure your graphics API blend function based on the blend mode:

```cpp
void graphics_set_blend_mode(BlendMode mode, bool premultipliedAlpha) {
    switch (mode) {
        case BlendMode_Normal:
            // Premultiplied: src=GL_ONE, dst=GL_ONE_MINUS_SRC_ALPHA
            // Straight: src=GL_SRC_ALPHA, dst=GL_ONE_MINUS_SRC_ALPHA
            break;
        case BlendMode_Additive:
            // Premultiplied: src=GL_ONE, dst=GL_ONE
            // Straight: src=GL_SRC_ALPHA, dst=GL_ONE
            break;
        case BlendMode_Multiply:
            // Both: src=GL_DST_COLOR, dst=GL_ONE_MINUS_SRC_ALPHA
            break;
        case BlendMode_Screen:
            // Both: src=GL_ONE, dst=GL_ONE_MINUS_SRC_COLOR
            break;
    }
}
```

## Example implementations

For complete rendering implementations, see:
* [spine-sfml](/spine-sfml): SFML-based renderer
* [spine-sdl](/spine-sdl): SDL-based renderer
* [spine-glfw](/spine-glfw): OpenGL renderer with GLFW
* [spine-ue](/spine-ue): Unreal Engine renderer
* [spine-godot](/spine-godot): Godot renderer

These examples show how to integrate spine-cpp rendering with different graphics APIs and frameworks.

# Memory management

spine-cpp uses standard C++ memory management. Objects created with `new` must be deleted with `delete`.

Lifetime guidelines:
* Create setup pose data shared by instances (`Atlas`, `SkeletonData`, `AnimationStateData`) at game or level startup, delete at game or level end.
* Create instance data (`Skeleton`, `AnimationState`) when the game object is created, delete when the game object is destroyed.

Track entries (`TrackEntry`) are managed by the `AnimationState` and should not be deleted manually. They're valid from when an animation is queued until the dispose event is triggered.

When creating objects, you pass references to other objects. The referencing object never deletes the referenced object:
* Deleting `Skeleton` does not delete `SkeletonData` or `Atlas`. The skeleton data is likely shared by other skeleton instances.
* Deleting `SkeletonData` does not delete `Atlas`. The atlas may be shared by multiple skeleton data instances.

## Custom memory allocation and file I/O

spine-cpp uses an Extension system for memory allocation and file I/O. You can customize this by creating your own Extension class:

```cpp
class MyExtension : public spine::SpineExtension {
public:
    virtual void* _alloc(size_t size, const char* file, int line) override {
        // Your custom allocator
        return my_custom_malloc(size);
    }
    
    virtual void* _calloc(size_t size, const char* file, int line) override {
        void* ptr = my_custom_malloc(size);
        if (ptr) memset(ptr, 0, size);
        return ptr;
    }
    
    virtual void* _realloc(void* ptr, size_t size, const char* file, int line) override {
        return my_custom_realloc(ptr, size);
    }
    
    virtual void _free(void* mem, const char* file, int line) override {
        my_custom_free(mem);
    }
    
    virtual char* _readFile(const String& path, int* length) override {
        // Your custom file reader
        return my_custom_file_reader(path.buffer(), length);
    }
};

// Set your extension before using spine-cpp
MyExtension* extension = new MyExtension();
spine::SpineExtension::setInstance(extension);
```

## Memory leak detection

spine-cpp provides a `DebugExtension` that wraps another extension to track allocations and detect leaks:

```cpp
// Create your base extension (or use the default)
spine::DefaultSpineExtension* baseExtension = new spine::DefaultSpineExtension();

// Wrap it with DebugExtension
spine::DebugExtension* debugExtension = new spine::DebugExtension(baseExtension);
spine::SpineExtension::setInstance(debugExtension);

// ... use spine-cpp normally ...

// Check for leaks
debugExtension->reportLeaks();  // Prints all unfreed allocations
size_t usedMemory = debugExtension->getUsedMemory();  // Get current memory usage

// Clear tracking (useful for resetting between tests)
debugExtension->clearAllocations();
```

The DebugExtension tracks:
* All allocations with file names and line numbers
* Memory usage statistics
* Double-free detection
* Untracked memory warnings

To track allocations of spine objects in your own code with file and line information, use the placement new operator:

```cpp
// Instead of:
Skeleton* skeleton = new Skeleton(skeletonData);

// Use:
Skeleton* skeleton = new (__FILE__, __LINE__) Skeleton(skeletonData);

// This allows DebugExtension to report the exact location of allocations
```

This is invaluable for finding memory leaks during development.
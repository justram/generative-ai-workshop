http://esotericsoftware.com/spine-sdl

[spine-sdl Runtime Documentation]
[[Integration guide for the spine-sdl runtime.]]

# spine-sdl Runtime Documentation

> **Licensing**
>
> Please see the [Spine Runtimes License](/spine-runtimes-license) before integrating the Spine Runtimes into your applications.

# Getting Started
spine-sdl is a C and C++ based runtime to load, manipulate and render Spine skeletons with [SDL](https://www.libsdl.org/).

spine-sdl requires SDL 2.0.18+ and supports all Spine features except two-color tinting.

## Installation

The spine-sdl runtime is available as a C and C++ API. Both APIs are based on [spine-c](/spine-c) and [spine-cpp](/spine-cpp) runtimes. Note that spine-c depends on spine-cpp, so both are required regardless of which API you choose to use.

### Integration with CMake (Recommended)

The easiest way to integrate spine-sdl into your project is via CMake FetchContent:

```cmake
cmake_minimum_required(VERSION 3.16)
project(MySpineProject)

include(FetchContent)
FetchContent_Declare(
    spine-sdl
    GIT_REPOSITORY https://github.com/esotericsoftware/spine-runtimes.git
    GIT_TAG 4.3
    SOURCE_SUBDIR spine-sdl
)
FetchContent_MakeAvailable(spine-sdl)

# Create your executable
add_executable(MyApp main.cpp)

# For C API
target_link_libraries(MyApp spine-sdl-c)

# For C++ API
target_link_libraries(MyApp spine-sdl-cpp)
```

This will automatically fetch and build spine-sdl along with all its dependencies (spine-c, spine-cpp, and SDL).

### Manual Integration

If you prefer manual integration:

1. Download the Spine Runtimes source using git (`git clone https://github.com/esotericsoftware/spine-runtimes`) or download as a zip.
2. Add the required source files to your project:
   - For C API: Add sources from `spine-cpp/src`, `spine-c/src`, and `spine-sdl/src/spine-sdl-c.c`
   - For C++ API: Add sources from `spine-cpp/src`, `spine-c/src`, and `spine-sdl/src/spine-sdl-cpp.cpp`
3. Add the include directories: `spine-cpp/include`, `spine-c/include`, and `spine-sdl/src`
4. Link against SDL2

In your C or C++ code, include either of the following header files to get access to the `spine-sdl` API:

```cpp
// C API
#include <spine-sdl-c.h>

// C++ API
#include <spine-sdl-cpp.h>
```

> *Note:* spine-sdl requires the [`SDL_RenderGeometry`](https://wiki.libsdl.org/SDL_RenderGeometry) API which is available since SDL 2.0.18. Earlier versions of SDL are not compatible with spine-sdl.

## Samples
The spine-sdl example works on Windows, Linux and Mac OS X. For a [spine-c](/spine-c) based example, see [example/main.c](/git/spine-runtimes/tree/spine-sdl/example/main.c), for a spine-cpp example see [example/main.cpp](/git/spine-runtimes/tree/spine-sdl/example/main.cpp).

### Windows

1. Install [Visual Studio Community](https://visualstudio.microsoft.com/downloads/). Make sure you install support for C++ and CMake.
2. Download the Spine Runtimes repository using git (`git clone https://github.com/esotericsoftware/spine-runtimes`) or download it as a zip.
3. Open Visual Studio Community, then open `spine-sdl/` via the **Open a local folder** button in the Visual Studio Community launcher.
4. Wait for CMake to finish, then select either `spine-sdl-c-example.exe` or `spine-sdl-cpp-example.exe` as the start-up project and start debugging.

### Linux

1. Install dependencies:
   ```bash
   sudo apt-get install cmake ninja-build  # Ubuntu/Debian
   # or equivalent for your distribution
   ```
2. Clone the repository: `git clone https://github.com/esotericsoftware/spine-runtimes`
3. Build and run:
   ```bash
   cd spine-runtimes/spine-sdl
   ./build.sh
   ./build/debug/spine-sdl-c-example    # Run C example
   ./build/debug/spine-sdl-cpp-example  # Run C++ example
   ```

### macOS

1. Install [Xcode](https://developer.apple.com/xcode/)
2. Install [Homebrew](http://brew.sh/)
3. Install dependencies:
   ```bash
   brew install cmake ninja
   ```
4. Clone the repository: `git clone https://github.com/esotericsoftware/spine-runtimes`
5. Build and run:
   ```bash
   cd spine-runtimes/spine-sdl
   ./build.sh
   ./build/debug/spine-sdl-c-example    # Run C example
   ./build/debug/spine-sdl-cpp-example  # Run C++ example
   ```

## Using spine-sdl
The spine-sdl runtime supports playback and manipulation of animations created with Spine with [SDL](https://www.libsdl.org). The spine-sdl runtime comes as both a C and C++ implementation, based on the generic [spine-c](/spine-c) and [spine-cpp](/spine-cpp) runtimes. It adds loading and rendering implementations based on the SDL APIs.

Please consult the [Spine Runtimes Guide](/spine-runtimes) for a detailed overview of the Spine Runtime architecture, and the [spine-c](/spine-c) and [spine-cpp](/spine-cpp) documentation for information on the core APIs used to playback and manipulate animations created with Spine with C and C++.

### Exporting for SDL
![](/img/spine-runtimes-guide/spine-ue4/export.png)
Please follow the instructions in the Spine User Guide on how to

1. [Export skeleton & animation data](/spine-export)
2. [Export texture atlases containing the images of your skeleton](/spine-texture-packer)

An export of the skeleton data and texture atlas of your skeleton will yield the following files:

![](/img/spine-runtimes-guide/spine-ue4/exported-files.png)

1. `skeleton-name.json` or `skeleton-name.skel`, containing your skeleton and animation data.
2. `skeleton-name.atlas`, containing information about the texture atlas.
3. One or more `.png` files, each representing on page of your texture atlas containing the packed images your skeleton uses.

> **Note:** The spine-sdl runtime does not support two-color tinting.

### Loading Spine skeletons
The spine-sdl runtime uses the [`SDL_Renderer`](https://wiki.libsdl.org/SDL_Renderer) API to display skeletons. Before a skeleton can be loaded from exported files, an `SDL_Renderer` must be created:

```cpp
SDL_Renderer *renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC);
```

#### Loading with C API

With the spine-c API, loading requires texture loading callbacks and manual file reading:

```cpp
// Global renderer for texture loading callbacks
static SDL_Renderer *g_renderer;

// Texture loading callbacks
void *load_texture_callback(const char *path) {
    extern void *load_texture(const char *path, SDL_Renderer *renderer);
    return load_texture(path, g_renderer);
}

void unload_texture_callback(void *texture) {
    SDL_DestroyTexture((SDL_Texture*)texture);
}

// Set the global renderer
g_renderer = renderer;

// Read atlas file into memory
int atlas_length;
char *atlas_data = read_file("data/spineboy-pma.atlas", &atlas_length);

// Load atlas with callbacks
spine_atlas_result atlas_result = spine_atlas_load_callback(
    atlas_data, "data/", load_texture_callback, unload_texture_callback);
spine_atlas atlas = spine_atlas_result_get_atlas(atlas_result);

// Read skeleton file into memory
int skeleton_length;
char *skeleton_data = read_file("data/spineboy-pro.json", &skeleton_length);

// Load skeleton data
spine_skeleton_data_result skeleton_result = spine_skeleton_data_load_json(
    atlas, skeleton_data, "data/");
spine_skeleton_data skeleton_data_handle = spine_skeleton_data_result_get_data(skeleton_result);

// Free file data
free(atlas_data);
free(skeleton_data);
```

#### Loading with C++ API

For the C++ API, a `SDLTextureLoader` is needed:

```cpp
// C++ API
spine::SDLTextureLoader textureLoader(renderer);
spine::Atlas atlas("data/spineboy-pma.atlas", &textureLoader);
spine::SkeletonJson json(atlas);
spine::SkeletonData *skeletonData = json.readSkeletonDataFile("data/spineboy-pro.json");
```

The loaded skeleton data and atlas can and should be shared across skeleton instances to reduce memory consumption and enable batched rendering of skeletons that share the same atlas data.

### Rendering Skeletons

spine-sdl provides simple rendering functions that work directly with skeletons and skeleton drawables.

#### C API

```cpp
// Create skeleton drawable (combines skeleton + animation state)
spine_skeleton_drawable drawable = spine_skeleton_drawable_create(skeleton_data_handle);
spine_skeleton skeleton = spine_skeleton_drawable_get_skeleton(drawable);
spine_animation_state animation_state = spine_skeleton_drawable_get_animation_state(drawable);

// Setup skeleton
spine_skeleton_set_position(skeleton, 400, 500);
spine_skeleton_set_scale(skeleton, 0.5f, 0.5f);
spine_skeleton_setup_pose(skeleton);

// Setup animation
spine_animation_state_set_animation_1(animation_state, 0, "portal", false);
spine_animation_state_add_animation_1(animation_state, 0, "run", true, 0);

// Update and render (in your main loop)
spine_skeleton_drawable_update(drawable, deltaTime);
spine_sdl_draw(drawable, renderer, true); // true for premultiplied alpha

// Or draw skeleton directly without drawable
spine_sdl_draw_skeleton(skeleton, renderer, true);

// Cleanup
spine_skeleton_drawable_dispose(drawable);
spine_skeleton_data_dispose(skeleton_data_handle);
spine_atlas_dispose(atlas);
spine_skeleton_data_result_dispose(skeleton_result);
spine_atlas_result_dispose(atlas_result);
```

#### C++ API

```cpp
// Create skeleton and animation state
spine::Skeleton skeleton(*skeletonData);
spine::AnimationStateData animationStateData(*skeletonData);
spine::AnimationState animationState(animationStateData);

// Setup skeleton
skeleton.setPosition(400, 500);
skeleton.setupPose();

// Setup animation
animationState.setAnimation(0, "portal", false);
animationState.addAnimation(0, "run", true, 0);

// Update and render (in your main loop)
animationState.update(deltaTime);
animationState.apply(skeleton);
skeleton.update(deltaTime);
skeleton.updateWorldTransform(spine::Physics_Update);

// Draw using the simple SDL_draw function
spine::SDL_draw(skeleton, renderer, true); // true for premultiplied alpha

// Cleanup
delete skeletonData;
delete &atlas;
```

Please refer to the [spine-c](/spine-c) and [spine-cpp](/spine-cpp) documentation for more information on the APIs to manipulate skeletons and animation states.

### Cleanup

When you no longer need the skeleton and atlas data, free their memory:

#### C API
```cpp
// Dispose skeleton drawable and data
spine_skeleton_drawable_dispose(drawable);
spine_skeleton_data_dispose(skeleton_data_handle);
spine_atlas_dispose(atlas);
spine_skeleton_data_result_dispose(skeleton_result);
spine_atlas_result_dispose(atlas_result);

// Free manually allocated file data
free(atlas_data);
free(skeleton_data);
```

#### C++ API
```cpp
// C++ API cleanup
delete skeletonData;
delete &atlas; // If allocated with new
```

> *Note:* Freeing skeleton data and atlas instances will automatically dispose of any associated SDL textures through the texture loader.
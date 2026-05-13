http://esotericsoftware.com/spine-glfw

[spine-glfw Runtime Documentation]
[[Integration guide for the spine-glfw runtime.]]

# spine-glfw Runtime Documentation

> **Licensing**
>
> Please see the [Spine Runtimes License](/spine-runtimes-license) before integrating the Spine Runtimes into your applications.

# Getting Started
spine-glfw is a C and C++ based runtime to load, manipulate and render Spine skeletons with [GLFW](https://www.glfw.org/) and OpenGL.

spine-glfw requires GLFW 3.0+ and OpenGL 3.3+ and supports all Spine features.

## Installation

The spine-glfw runtime is available as a C and C++ API. Both APIs are based on [spine-c](/spine-c) and [spine-cpp](/spine-cpp) runtimes. Note that spine-c depends on spine-cpp, so both are required regardless of which API you choose to use.

### Integration with CMake (Recommended)

The easiest way to integrate spine-glfw into your project is via CMake FetchContent:

```cmake
cmake_minimum_required(VERSION 3.16)
project(MySpineProject)

include(FetchContent)
FetchContent_Declare(
    spine-glfw
    GIT_REPOSITORY https://github.com/esotericsoftware/spine-runtimes.git
    GIT_TAG 4.3
    SOURCE_SUBDIR spine-glfw
)
FetchContent_MakeAvailable(spine-glfw)

# Create your executable
add_executable(MyApp main.cpp)

# Link against spine-glfw (includes spine-cpp, spine-c, GLFW, and glbinding)
target_link_libraries(MyApp spine-glfw)
```

This will automatically fetch and build spine-glfw along with all its dependencies (spine-c, spine-cpp, GLFW, and glbinding).

### Manual Integration

If you prefer manual integration:

1. Download the Spine Runtimes source using git (`git clone https://github.com/esotericsoftware/spine-runtimes`) or download as a zip.
2. Add the required source files to your project:
   - Add sources from `spine-cpp/src`, `spine-c/src`, and `spine-glfw/src/spine-glfw.cpp`
3. Add the include directories: `spine-cpp/include`, `spine-c/include`, and `spine-glfw/src`
4. Link against GLFW, OpenGL, and glbinding libraries

In your C++ code, include the following header file to get access to the `spine-glfw` API:

```cpp
#include <spine-glfw.h>
```

> *Note:* spine-glfw requires OpenGL 3.3 Core Profile or higher. The runtime uses modern OpenGL features including vertex array objects, vertex buffer objects, and GLSL shaders.

## Samples
The spine-glfw example works on Windows, Linux and Mac OS X. For a [spine-cpp](/spine-cpp) based example, see [example/main.cpp](/git/spine-runtimes/tree/spine-glfw/example/main.cpp), for a spine-c example see [example/main-c.cpp](/git/spine-runtimes/tree/spine-glfw/example/main-c.cpp).

### Windows

1. Install [Visual Studio Community](https://visualstudio.microsoft.com/downloads/). Make sure you install support for C++ and CMake.
2. Download the Spine Runtimes repository using git (`git clone https://github.com/esotericsoftware/spine-runtimes`) or download it as a zip.
3. Open Visual Studio Community, then open `spine-glfw/` via the **Open a local folder** button in the Visual Studio Community launcher.
4. Wait for CMake to finish, then select either `spine-glfw-example.exe` or `spine-glfw-example-c.exe` as the start-up project and start debugging.

### Linux

1. Install dependencies:
   ```bash
   sudo apt-get install cmake ninja-build libgl1-mesa-dev libx11-dev libxrandr-dev libxinerama-dev libxcursor-dev libxi-dev  # Ubuntu/Debian
   # or equivalent for your distribution
   ```
2. Clone the repository: `git clone https://github.com/esotericsoftware/spine-runtimes`
3. Build and run:
   ```bash
   cd spine-runtimes/spine-glfw
   ./build.sh
   ./build/debug/spine-glfw-example-c    # Run C example
   ./build/debug/spine-glfw-example      # Run C++ example
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
   cd spine-runtimes/spine-glfw
   ./build.sh
   ./build/debug/spine-glfw-example-c    # Run C example
   ./build/debug/spine-glfw-example      # Run C++ example
   ```

## Using spine-glfw
The spine-glfw runtime supports playback and manipulation of animations created with Spine using [GLFW](https://www.glfw.org/) and OpenGL. The spine-glfw runtime comes as both a C and C++ implementation, based on the generic [spine-c](/spine-c) and [spine-cpp](/spine-cpp) runtimes. It adds loading and rendering implementations based on OpenGL APIs.

Please consult the [Spine Runtimes Guide](/spine-runtimes) for a detailed overview of the Spine Runtime architecture, and the [spine-c](/spine-c) and [spine-cpp](/spine-cpp) documentation for information on the core APIs used to playback and manipulate animations created with Spine with C and C++.

### Exporting for GLFW
![](/img/spine-runtimes-guide/spine-ue4/export.png)
Please follow the instructions in the Spine User Guide on how to

1. [Export skeleton & animation data](/spine-export)
2. [Export texture atlases containing the images of your skeleton](/spine-texture-packer)

An export of the skeleton data and texture atlas of your skeleton will yield the following files:

![](/img/spine-runtimes-guide/spine-ue4/exported-files.png)

1. `skeleton-name.json` or `skeleton-name.skel`, containing your skeleton and animation data.
2. `skeleton-name.atlas`, containing information about the texture atlas.
3. One or more `.png` files, each representing on page of your texture atlas containing the packed images your skeleton uses.

### Loading Spine skeletons
The spine-glfw runtime uses OpenGL for rendering skeletons. Before a skeleton can be loaded from exported files, a GLFW window and OpenGL context must be created:

```cpp
// Initialize GLFW
if (!glfwInit()) {
    // Handle error
    return -1;
}

// Set OpenGL version to 3.3 Core Profile
glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

// Create window
GLFWwindow* window = glfwCreateWindow(800, 600, "Spine GLFW", NULL, NULL);
glfwMakeContextCurrent(window);

// Initialize OpenGL function loading (e.g., with glbinding)
glbinding::initialize(glfwGetProcAddress);
```

#### Loading with C API

With the C API, loading requires texture loading callbacks and manual file reading:

```cpp
// Texture loading callbacks
void *load_texture(const char *path) {
    return (void *)(uintptr_t)texture_load(path);
}

void unload_texture(void *texture) {
    texture_dispose((texture_t)(uintptr_t)texture);
}

// Read atlas file into memory
int atlas_length = 0;
uint8_t *atlas_bytes = read_file("data/spineboy-pma.atlas", &atlas_length);

// Load atlas with callbacks
spine_atlas_result atlas_result = spine_atlas_load_callback(
    (const char*)atlas_bytes, "data/", load_texture, unload_texture);
spine_atlas atlas = spine_atlas_result_get_atlas(atlas_result);

// Read skeleton file into memory
int skeleton_length = 0;
uint8_t *skeleton_bytes = read_file("data/spineboy-pro.skel", &skeleton_length);

// Load skeleton data
spine_skeleton_data_result skeleton_result = spine_skeleton_data_load_binary(
    atlas, skeleton_bytes, skeleton_length, "data/");
spine_skeleton_data skeleton_data = spine_skeleton_data_result_get_data(skeleton_result);

// Free file data
free(atlas_bytes);
free(skeleton_bytes);
```

#### Loading with C++ API

For the C++ API, a `GlTextureLoader` is needed:

```cpp
// C++ API
spine::GlTextureLoader textureLoader;
spine::Atlas *atlas = new spine::Atlas("data/spineboy-pma.atlas", &textureLoader);

// Load skeleton data from binary
spine::SkeletonBinary binary(*atlas);
spine::SkeletonData *skeletonData = binary.readSkeletonDataFile("data/spineboy-pro.skel");

// Or load from JSON
spine::SkeletonJson json(*atlas);
spine::SkeletonData *skeletonData = json.readSkeletonDataFile("data/spineboy-pro.json");
```

The loaded skeleton data and atlas can and should be shared across skeleton instances to reduce memory consumption and enable batched rendering of skeletons that share the same atlas data.

### Renderer

The main addition of spine-glfw on top of [spine-c](/spine-c) and [spine-cpp](/spine-cpp) is the renderer system. The renderer handles the OpenGL rendering pipeline including shaders, meshes, and textures.

```cpp
// Create the renderer and set viewport size
renderer_t *renderer = renderer_create();
renderer_set_viewport_size(renderer, windowWidth, windowHeight);
```

The renderer automatically creates and manages OpenGL shaders optimized for Spine skeleton rendering.

### Rendering Skeletons

spine-glfw provides rendering functions that work directly with skeletons and skeleton drawables.

#### C API

```cpp
// Create skeleton drawable (combines skeleton + animation state)
spine_skeleton_drawable drawable = spine_skeleton_drawable_create(skeleton_data);
spine_skeleton skeleton = spine_skeleton_drawable_get_skeleton(drawable);
spine_animation_state animation_state = spine_skeleton_drawable_get_animation_state(drawable);

// Setup skeleton
spine_skeleton_set_position(skeleton, 400, 500);
spine_skeleton_set_scale(skeleton, 0.3f, 0.3f);
spine_skeleton_setup_pose(skeleton);

// Setup animation
spine_animation_state_set_animation_1(animation_state, 0, "portal", false);
spine_animation_state_add_animation_1(animation_state, 0, "run", true, 0);

// Update and render (in your main loop)
spine_skeleton_drawable_update(drawable, deltaTime);
renderer_draw_c(renderer, skeleton, true); // true for premultiplied alpha

// Cleanup
spine_skeleton_drawable_dispose(drawable);
spine_skeleton_data_dispose(skeleton_data);
spine_atlas_dispose(atlas);
spine_skeleton_data_result_dispose(skeleton_result);
spine_atlas_result_dispose(atlas_result);
```

#### C++ API

```cpp
// Set coordinate system (spine-glfw uses y-down by default)
spine::Bone::setYDown(true);

// Create skeleton and animation state
spine::Skeleton skeleton(*skeletonData);
spine::AnimationStateData animationStateData(*skeletonData);
spine::AnimationState animationState(animationStateData);

// Setup skeleton
skeleton.setPosition(400, 500);
skeleton.setScaleX(0.5f);
skeleton.setScaleY(0.5f);
skeleton.setupPose();

// Setup animation
animationStateData.setDefaultMix(0.2f);
animationState.setAnimation(0, "portal", false);
animationState.addAnimation(0, "run", true, 0);

// Update and render (in your main loop)
animationState.update(deltaTime);
animationState.apply(skeleton);
skeleton.update(deltaTime);
skeleton.updateWorldTransform(spine::Physics_Update);

// Clear screen
gl::glClear(gl::GL_COLOR_BUFFER_BIT);

// Render skeleton
renderer_draw(renderer, &skeleton, true); // true for premultiplied alpha

// Cleanup
delete skeletonData;
delete atlas;
```

Please refer to the [spine-c](/spine-c) and [spine-cpp](/spine-cpp) documentation for more information on the APIs to manipulate skeletons and animation states.


### Cleanup

When you no longer need the skeleton and atlas data, free their memory:

#### C API
```cpp
// Dispose renderer and skeleton data
renderer_dispose(renderer);
spine_skeleton_drawable_dispose(drawable);
spine_skeleton_data_dispose(skeleton_data);
spine_atlas_dispose(atlas);
spine_skeleton_data_result_dispose(skeleton_result);
spine_atlas_result_dispose(atlas_result);

// Free manually allocated file data
free(atlas_bytes);
free(skeleton_bytes);

// Cleanup GLFW
glfwTerminate();
```

#### C++ API
```cpp
// Dispose renderer and skeleton data
renderer_dispose(renderer);
delete skeletonData;
delete atlas;

// Cleanup GLFW
glfwTerminate();
```

> *Note:* Freeing skeleton data and atlas instances will automatically dispose of any associated OpenGL textures through the texture loader. With spine-c, you must also free any memory you allocated for file data using `malloc()`/`read_file()`.
http://esotericsoftware.com/spine-sfml

[spine-sfml Runtime Documentation]
[[Integration guide for the spine-sfml runtime.]]

# spine-sfml Runtime Documentation

> **Licensing**
>
> Please see the [Spine Runtimes License](/spine-runtimes-license) before integrating the Spine Runtimes into your applications.

# Getting Started
spine-sfml is a C++ based runtime to load, manipulate and render Spine skeletons with [SFML](https://www.sfml-dev.org/).

spine-sfml requires SFML 2.6+ and supports all Spine features.

## Installation

The spine-sfml runtime is available as a C++ API based on the generic [spine-cpp](/spine-cpp) runtime.

### Integration with CMake (Recommended)

The easiest way to integrate spine-sfml into your project is via CMake FetchContent:

```cmake
cmake_minimum_required(VERSION 3.16)
project(MySpineProject)

include(FetchContent)
FetchContent_Declare(
    spine-sfml
    GIT_REPOSITORY https://github.com/esotericsoftware/spine-runtimes.git
    GIT_TAG 4.3
    SOURCE_SUBDIR spine-sfml
)
FetchContent_MakeAvailable(spine-sfml)

# Create your executable
add_executable(MyApp main.cpp)

# Link against spine-sfml
target_link_libraries(MyApp spine-sfml)
```

This will automatically fetch and build spine-sfml along with all its dependencies (spine-cpp and SFML).

### Manual Integration

If you prefer manual integration:

1. Download the Spine Runtimes source using git (`git clone https://github.com/esotericsoftware/spine-runtimes`) or download as a zip.
2. Add the required source files to your project:
   - Add sources from `spine-cpp/src` and `spine-sfml/src/spine-sfml.cpp`
3. Add the include directories: `spine-cpp/include` and `spine-sfml/src`
4. Link against SFML libraries (sfml-graphics, sfml-window, sfml-system)

In your C++ code, include the following header file to get access to the `spine-sfml` API:

```cpp
#include <spine-sfml.h>
```

> *Note:* spine-sfml is built on top of the SFML C++ library. There is no C API available for spine-sfml.

## Samples
The spine-sfml example works on Windows, Linux and Mac OS X. See [example/main.cpp](/git/spine-runtimes/tree/spine-sfml/example/main.cpp).

### Windows

1. Install [Visual Studio Community](https://visualstudio.microsoft.com/downloads/). Make sure you install support for C++ and CMake.
2. Download the Spine Runtimes repository using git (`git clone https://github.com/esotericsoftware/spine-runtimes`) or download it as a zip.
3. Open Visual Studio Community, then open `spine-sfml/` via the **Open a local folder** button in the Visual Studio Community launcher.
4. Wait for CMake to finish, then select `spine-sfml-example.exe` as the start-up project and start debugging.

### Linux

1. Install dependencies:
   ```bash
   sudo apt-get install cmake ninja-build libsfml-dev  # Ubuntu/Debian
   # or equivalent for your distribution
   ```
2. Clone the repository: `git clone https://github.com/esotericsoftware/spine-runtimes`
3. Build and run:
   ```bash
   cd spine-runtimes/spine-sfml
   ./build.sh
   ./build/debug/spine-sfml-example
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
   cd spine-runtimes/spine-sfml
   ./build.sh
   ./build/debug/spine-sfml-example
   ```

## Using spine-sfml
The spine-sfml runtime supports playback and manipulation of animations created with Spine with [SFML](https://www.sfml-dev.org/). The spine-sfml runtime is implemented in C++ and is based on the generic [spine-cpp](/spine-cpp) runtime. It adds loading and rendering implementations based on the SFML APIs.

Please consult the [Spine Runtimes Guide](/spine-runtimes) for a detailed overview of the Spine Runtime architecture, and the [spine-cpp](/spine-cpp) documentation for information on the core APIs used to playback and manipulate animations created with Spine with C++.

### Exporting for SFML
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
The spine-sfml runtime uses SFML's rendering API to display skeletons. Before a skeleton can be loaded from exported files, an `sf::RenderWindow` must be created:

```cpp
// Create SFML window
sf::RenderWindow window(sf::VideoMode(800, 600), "Spine SFML");
window.setFramerateLimit(60);
```

#### Loading with C++ API

The spine-sfml runtime provides an `SFMLTextureLoader` for loading textures:

```cpp
// Create texture loader
spine::SFMLTextureLoader textureLoader;

// Load atlas
spine::Atlas atlas("data/spineboy-pma.atlas", &textureLoader);

// Load skeleton data from binary
spine::SkeletonBinary binary(atlas);
spine::SkeletonData *skeletonData = binary.readSkeletonDataFile("data/spineboy-pro.skel");

// Or load from JSON
spine::SkeletonJson json(atlas);
spine::SkeletonData *skeletonData = json.readSkeletonDataFile("data/spineboy-pro.json");
```

The loaded skeleton data and atlas can and should be shared across skeleton instances to reduce memory consumption and enable batched rendering of skeletons that share the same atlas data.

### Rendering Skeletons

spine-sfml provides a simple rendering function that works directly with skeletons.

```cpp
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

// Clear and draw
window.clear(sf::Color::Black);
spine::SFML_draw(skeleton, window, true); // true for premultiplied alpha
window.display();

// Cleanup
delete skeletonData;
```

### Complete Example

Here's a complete example showing how to load and render a Spine skeleton with SFML:

```cpp
#include <spine-sfml.h>
#include <SFML/Graphics.hpp>

int main() {
    // Create SFML window
    sf::RenderWindow window(sf::VideoMode(800, 600), "Spine SFML Example");
    window.setFramerateLimit(60);
    
    // Load atlas and skeleton
    spine::SFMLTextureLoader textureLoader;
    spine::Atlas atlas("data/spineboy-pma.atlas", &textureLoader);
    
    spine::SkeletonJson json(atlas);
    spine::SkeletonData* skeletonData = json.readSkeletonDataFile("data/spineboy-pro.json");
    if (!skeletonData) {
        printf("Failed to load skeleton data\n");
        return 1;
    }
    
    // Create skeleton and animation state
    spine::Skeleton skeleton(*skeletonData);
    spine::AnimationStateData animationStateData(*skeletonData);
    animationStateData.setDefaultMix(0.2f);
    spine::AnimationState animationState(animationStateData);
    
    // Setup skeleton
    skeleton.setPosition(400, 500);
    skeleton.setScaleX(0.5f);
    skeleton.setScaleY(0.5f);
    skeleton.setupPose();
    
    // Setup animation
    animationState.setAnimation(0, "portal", false);
    animationState.addAnimation(0, "run", true, 0);
    
    // Main loop
    sf::Clock clock;
    while (window.isOpen()) {
        // Handle events
        sf::Event event;
        while (window.pollEvent(event)) {
            if (event.type == sf::Event::Closed) {
                window.close();
            }
        }
        
        // Update animation
        float deltaTime = clock.restart().asSeconds();
        animationState.update(deltaTime);
        animationState.apply(skeleton);
        skeleton.update(deltaTime);
        skeleton.updateWorldTransform(spine::Physics_Update);
        
        // Clear and draw
        window.clear(sf::Color::Black);
        spine::SFML_draw(skeleton, window, true);
        window.display();
    }
    
    // Cleanup
    delete skeletonData;
    
    return 0;
}
```

Please refer to the [spine-cpp](/spine-cpp) documentation for more information on the APIs to manipulate skeletons and animation states.

### Cleanup

When you no longer need the skeleton and atlas data, free their memory:

```cpp
// Delete skeleton data and atlas
delete skeletonData;
// Atlas is stack allocated in the examples above, so it will be automatically cleaned up
// If you allocated it with new, delete it:
// delete atlas;
```

> *Note:* Freeing skeleton data and atlas instances will automatically dispose of any associated SFML textures through the texture loader.
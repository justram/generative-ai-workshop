http://esotericsoftware.com/spine-runtime-architecture

[Runtime Architecture - Spine Runtimes Guide]
[[]]

# Runtime Architecture

The Spine Runtimes are software components that are integrated into your application to load and render skeleton data exported from Spine. The runtimes are very flexible, allowing for customization of when and how textures are loaded, bone manipulation and procedural animation, mixing and layering animations, and much more.

The [runtimes page](/spine-runtimes) lists runtimes available for many different programming languages and game toolkits.

# Licensing

Permission to use the Spine Runtimes is granted by licensing Spine. If you have a Spine license, you may use the Spine Runtimes in any number of applications. See the [Spine Editor License Agreement](/spine-editor-license) for details.

# Source code

The source code for the Spine Runtimes is available in its entirety on [GitHub](https://github.com/EsotericSoftware/spine-runtimes). Access to the source code is essential for such a fundamental component of your applications, enabling customization or optimization for your specific needs.

The source code can be downloaded using Git or by clicking the green "Clone or download button" on GitHub and choosing "Download ZIP".

The code examples in this documentation use pseudo code that is easily translated to runtimes in any language. See the runtime specific pages (README.md files) on GitHub for runtime specific documentation.

# Versioning

The Spine Runtimes load data [exported](/spine-export) from Spine. Care must be taken to use the correct version of Spine so the Spine Runtimes can successfully load the data. It is suggested to freeze your [editor version](/spine-settings#Version) and keep it in lock step with your runtime version. Spine and the Spine Runtimes are constantly being improved, so you may want to periodically update both your runtimes and your editor version.

The [default branch](/git/spine-runtimes/tree) works with the latest non-beta version of Spine. Each runtime's README.md file lists the exact version it works with.

By definition, [beta versions](/spine-versioning#Beta-releases) may not have support for every supported runtime. However, some runtimes will become ready for use before others. If you need the very latest runtimes, look for a branch with the name of the beta version, such as `4.2-beta`. If the runtime you are interested in has been updated, that branch is where you will find the latest code until the next non-beta release. Keep in mind new development happens in the beta branch and may be a work in progress.

# Class diagram

This diagram illustrates how the various pieces of the runtimes fit together. Click for full resolution.

[![](/img/runtimes-diagram.png)](/img/runtimes-diagram.png)

The [API reference](/spine-api-reference) has detailed information about properties and methods for each type of object.

# Data objects

At a high level, skeleton data is loaded into the "Setup Pose Data" objects and usually combined with a texture atlas. These data objects are then used to create skeleton "Instance Data" objects, which are stateful objects that usually correspond to each on-screen skeleton. The data objects are stateless, which means they can be shared across any number of skeleton instances.

Data object class names that have an instance data counterpart end with "Data". Data objects that don't have an instance data counterpart don't have a suffix, such as Attachment, Skin, and Animation.

Sharing the data objects across many skeleton instances is efficient because the data only needs to be loaded once. However, if the data objects are modified, the changes will affect all skeleton instances. To modify a data object only for a single instance, the object must be copied and the original replaced for only that instance.

# Instance objects

Each instance object has the same class name as its data object, but without the "Data" suffix. For example, SkeletonData is the data object and Skeleton is the instance object.

The instance object has many of the same properties as the data object. The properties in the data object represent the setup pose and don't normally change. The same properties in the instance object represent the current pose for that instance as it is animated.

Every instance object keeps a reference to its data object. This is used to reset the instance object back to the setup pose. Also, some properties exist only on the data object and not on the instance object, such as the object's name.

[Next: Loading Skeleton Data](/spine-loading-skeleton-data)
[Spine Runtimes Guide: Table of Contents]
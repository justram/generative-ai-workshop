http://esotericsoftware.com/spine-godot

[spine-godot Runtime Documentation]
[[Integration guide for the spine-godot runtime.]]

# spine-godot Runtime Documentation

> **Licensing**
>
> Please see the [Spine Runtimes License](/spine-runtimes-license) before integrating the Spine Runtimes into your applications.

# Getting Started

## Installation
The spine-godot runtime comes in two flavors:
* **spine-godot [GDExtension](https://docs.godotengine.org/en/stable/tutorials/scripting/gdextension/index.html)**: A single package you drop into your existing Godot project's `bin/` folder. Supports all platforms Godot supports, possibly including consoles in the future powered by [W4Games](https://www.w4games.com/). Lacks support for `AnimationPlayer`, does not have [dedicated C# bindings](https://github.com/godotengine/godot-proposals/issues/8191), and is missing a [minor editor feature](https://github.com/godotengine/godot-proposals/issues/10985).
* **spine-godot [custom C++ engine module](https://docs.godotengine.org/en/stable/development/cpp/custom_modules_in_cpp.html)**: requires you to use a custom Godot Editor build and Godot templates. Unlikely to support consoles in the future. Supports additional features, like `AnimationPlayer`, and dedicated C# bindings.


### spine-godot GDExtension downloads
<script>
let baseURL = "https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/refs/heads/";
let spineVersion = undefined;

async function getSpineVersion() {
    if (!spineVersion) {
        const response = await fetch("/spine/version");
        spineVersion = await response.text();
    }
    return spineVersion;
}

async function getV4ExtensionVersions() {
    const response = await fetch(baseURL + spineVersion + "/.github/workflows/spine-godot-extension-v4-all.yml");
    const v4Data = await response.text();
    const pattern = /{\s*"tag":\s*"(.*?)",\s*"version":\s*"(.*?)",\s*"dev":\s*(true|false)\s*}/g;
    const matches = v4Data.match(pattern);
    return matches.map(match => JSON.parse(match));
}

(async () => {
    const spineVersion = await getSpineVersion();
    const versions = [...(await getV4ExtensionVersions())];

    let html = "<ul>";
    for (const version of versions) {
        const versionLabel = "Godot " + version.tag.substring(0, version.tag.indexOf("-"));
        html += `<li><a href="https://spine-godot.s3.eu-central-1.amazonaws.com/${spineVersion}/${version.tag}/spine-godot-extension-${spineVersion}-${version.tag}.zip">${versionLabel}</a></li>`
    }
    html += "</ul>"
    document.querySelector("#ext-urls").innerHTML = html;
 })()
 </script>

 <div id="ext-urls"></div>
!!

Download the spine-godot GDExtension version for the Godot version you are using. Unpack the `.zip` file and copy the `bin/` folder to the root folder of your project. E.g. you should have a folder `your-project/bin` and a file `your-project/bin/spine_godot_extension.gdextension`. Then run the Godot editor.

### spine-godot engine module downloads
<script>
async function getV4Versions() {
    const response = await fetch(baseURL + spineVersion + "/.github/workflows/spine-godot-v4-all.yml");
    const v4Data = await response.text();
    const pattern = /{\s*"tag":\s*"(.*?)",\s*"version":\s*"(.*?)",\s*"mono":\s*(true|false)\s*}/g;
    const matches = v4Data.match(pattern);
    return matches.map(match => JSON.parse(match));
}

async function getV3Versions() {
    const response = await fetch(baseURL + spineVersion + "/.github/workflows/spine-godot.yml");
    const v3Data = await response.text();
    const tagPattern = /GODOT_TAG:\s*(.*)/;
    const versionPattern = /GODOT_VERSION:\s*(.*)/;
    function extractValue(pattern, str) {
        const match = str.match(pattern);
        return match ? match[1] : null;
    }
    const godotTag = extractValue(tagPattern, v3Data);
    const godotVersion = extractValue(versionPattern, v3Data);

    return [{
        tag: godotTag,
        version: godotVersion,
        mono: false
    }];
}

(async () => {
    const spineVersion = (await getSpineVersion());
    const versions = [...(await getV3Versions()), ...(await getV4Versions())];

    let html = "<ul>";
    for (const version of versions) {
        const mono = version.mono ? "-mono" : "";
        html += "<li>Godot " + version.tag.substring(0, version.tag.indexOf("-")) + (version.mono ? " with C# support" : "");
        html += `
            <ul>
                <li><a href="https://spine-godot.s3.eu-central-1.amazonaws.com/${spineVersion}/${version.tag}/godot-editor-windows${mono}.zip">Editor Windows</a></li>
                <li><a href="https://spine-godot.s3.eu-central-1.amazonaws.com/${spineVersion}/${version.tag}/godot-editor-linux${mono}.zip">Editor Linux</a></li>
                <li><a href="https://spine-godot.s3.eu-central-1.amazonaws.com/${spineVersion}/${version.tag}/godot-editor-macos${mono}.zip">Editor macOS</a></li>
                <li><a href="https://spine-godot.s3.eu-central-1.amazonaws.com/${spineVersion}/${version.tag}/spine-godot-templates-${spineVersion}-${version.tag}${mono}.tpz">Export templates for Windows, Linux, macOS${!version.mono ? ", Web, Android, iOS" : ""}</a></li>
            </ul>
        `
        html += "</li>"
    }
    html += "</ul>"
    document.querySelector("#urls").innerHTML = html;
 })()
 </script>

 <div id="urls"></div>
!!

> **Note**: All editor builds require 64-bit support. The export templates for Windows, Linux and macOS also require 64-bit support. The export template for iOS devices only supports 64-bit ARM devices, which is a requirement by Apple.

Download the Godot editor for your operating system as well as the Godot export templates from the links above.

For Windows and Linux, unpack the `.zip` file and place the extracted executable file anywhere you like. For macOS, unpack the `.zip` file and place the `Godot.app` into your `/Applications/` folder. If you have a pre-existing Godot installation, you can rename the `Godot.app` package.

To install the export templates `.tpz` file, open the Godot editor, then go to `Editor >  Manage export templates ...`. Click `Install from file` and select the `.tzp` you downloaded from the link above. You can now [export your project](https://docs.godotengine.org/en/stable/tutorials/export/index.html) for Windows, Linux, macOS, iOS, Android, and the web as usual. You can also use Godot's [one-click deploy](https://docs.godotengine.org/en/stable/tutorials/export/one-click_deploy.html) for Android and the web right from within the Godot editor.

## Samples
The spine-godot runtime comes with many samples that demonstrate its feature set. To inspect and play around with the samples:

1. Download either the GDExtension or the pre-built Godot editor from the links in the "Installation" section above.
2. Clone the [spine-runtimes Git repository](https://github.com/esotericsoftware/spine-runtimes). If you don't want to use Git, download the [latest version as a ZIP](/git/spine-runtimes/archive) and unpack it.
3. Open the Godot editor and click `Import`, then select the example folder based on your spine-godot and Godot Editor version:
   - GDExtension: `spine-runtimes/spine-godot/example-v4-extension/project.godot`.
      - Unpack the GDExtension you downloaded and copy the `bin/` to the project root before opening the project in the Godot editor!
   - C++ Engine Module:
      - Godot 3.x: `spine-runtimes/spine-godot/example/project.godot`.
      - Godot 4.x: `spine-runtimes/spine-godot/example-v4/project.godot`.
      - Godot 4.x with C# support: `spine-runtimes/spine-godot/example-v4-csharp/project.godot`.
   

The following examples are available:
* `01-helloworld`: demonstrates how to use a `SpineSprite` node to display and animate a Spine skeleton.
* `02-animation-state-listener`: demonstrates how to listen for animation state changes on a `SpineSprite` via signals.
* `03-mix-and-match`. demonstrates how to create a custom skin composed from other skins for mix-and-match avatar creation scenarios.
* `04-simple-input`: demonstrates how to playback animations in reaction to input events.
* `05-mouse-following`: demonstrates how to manually let a bone in a `SpineSprite` skeleton follow the mouse or touch events.
* `06-bone-following`: demonstrates how to use a `SpineBoneNode` on a `SpineSprite` to let a child node follow a bone in the skeleton.
* `07-slot-node`: demonstrates how to use a `SpineSlotNode` to let a child node follow a slot in the skeleton, correctly inserting the child node in the `SpineSprite`'s rendering order.
* `08-animation-player`: demonstrates how to use a `SpineAnimationTrack` node to create cut-scenes using Godot's `AnimationPlayer` user interface. *Note: this example if not available in the GDExtension version of spine-godot*
* `09-custom-material`: demonstrates how to apply custom materials to an entire `SpineSprite` as well as individual slots via a `SpineSlotNode`.
* `10-2d-lighting`: demonstrates how to use normal maps in combination with a `SpineSprite` to support Godot's 2D lighting system.
* `11-bone-node`: demonstrates using `SpineBoneNode` instances to drive a `SpineSprite`'s bones via Godot physics. 
* `12-bone-node`: demonstrates Spine's physics using the Celestial Circus skeleton.
* `13-load-from-disk`: demonstrates how to load Spine .skel/.json and .atlas files from disk at runtime. 

## Compiling spine-godot from source
If you need to compile the spine-godot GDExtension, or spine-godot engine module (Godot editor, export templates) yourself, e.g. because you want to use a different Godot version, have other custom C++ modules, or want to work on the spine-godot runtime, we provide shell scripts to ease the process.

> *NOTE:* Make sure you have all build dependencies installed before attempting this, as per the [official instructions by Godot](https://docs.godotengine.org/en/stable/development/compiling/index.html).

### Compiling the GDExtension
To build the GDExtension binaries, clone the [spine-runtimes repository](https://github.com/esotericsoftware/spine-runtimes). Run the following in a Bash shell (use Git Bash on Windows) from inside the directory you cloned the Spine Runtimes to:

```
cd spine-godot
./build/setup-extension.sh 4.4.1-stable false
./build/build-extension.sh <os> <arch>?
```

The `setup-extension.sh` build is responsible for cloning external dependencies and setting up the build. The first argument to `setup-extension.sh` is the Godot repository branch or commit hash you want to build the GDExtension against. The second argument specifies whether you want to compile a build with debug information. This can be useful for development purposes. The setup script will clone the appropriate version of [`godot-cpp`](https://github.com/godotengine/godot-cpp) and optionally the Godot editor repository, if a debug build should be created. It will also copy the `spine-godot/spine_godot_extension.gdextension` file to `spine-godot/example-v4-extension/bin`.

The `build-extension.sh` script is responsible for executing the build and generating the GDExtension binaries for a specific operating system. The &lt;os&gt; argument to `build-extension.sh` specifies the OS you want to build for. You can omit it if you want to build for your host OS and architecture. Valid values for &lt;os&gt; are `windows`, `linux`, `macos`, `ios`, `android`, and `web`. You can optionally pass the `arch` argument to build for a specific CPU architecture, e.g. `x86_32 `, `x86_64`, `arm64`, etc, as per the Godot build system documentatio. The GDExtension binaries will be placed in the `spine-godot/example-v4-extension/bin` folder in their respective operating system specific subfolder.

#### Building via GitHub Actions
The [Spine Runtimes repository](https://github.com/EsotericSoftware/spine-runtimes) contains a GitHub workflows in `.github/workflows/spine-godot-extension-v4.yml`, and `.github/workflows/spine-godot-extension-v4-all.yml`that allow building the spine-godot GDExtension through GitHub actions. This may be simpler than compiling these artifacts locally. To use the GitHub workflow:

1. Clone the [Spine Runtimes repository](https://github.com/EsotericSoftware/spine-runtimes)
2. Enable GitHub workflows on the cloned repository
3. Manually trigger the `spine-godot-extension-v4-all` workflow.

The resulting binaries will be attached as artifacts to a successful workflow run.

### Compiling C++ Engine Module
#### Godot 3.5.x

To build a Godot editor binary, clone the [spine-runtimes repository](https://github.com/esotericsoftware/spine-runtimes). Run the following in a Bash shell (use Git Bash on Windows) from inside the directory you cloned the Spine Runtimes to:

```
cd spine-godot
./build/setup.sh 3.5.2-stable false
./build/build.sh release_debug
```

The first argument to `setup.sh` is the Godot repository branch or commit hash you want to build the Godot editor from. The second argument specifies whether you want to compile the editor for development. Valid values are `true` and `false`. If set to true, the build will add support for [Live++](https://liveplusplus.tech/) on Windows if you have set the `LIVEPP` environment variable to your Live++ installation directory, and disable many modules to speed up compilation.

The first argument to `build.sh` specifies the optimization level of the resulting binary. Supported values are `debug`, which allows full debugging but may be slow due to missing optimizations, and `release_debug`, which is generally used for release builds of the Godot editor.

The resulting Godot editor binary can then be found in `spine-godot/godot/bin`.

To build the export template for a specific platform, run the following in a Bash shell (use Git Bash on Windows):

```
cd spine-godot
./build/setup.sh 3.5.2-stable false
./build/build-templates.sh windows
```

The first argument to `setup.sh` is the Godot repository branch or commit hash you want to build the Godot editor from. The second argument must be `false`.

The first argument to `built-templates.sh` is the platform to compile the template for. Valid values are `windows`, `linux`, `macos`, `web`, `android`, and `ios`. Note that macOS and iOS export templates can only be build on a machine running macOS. See the [official instructions by Godot](https://docs.godotengine.org/en/stable/development/compiling/index.html).

The resulting Godot export template binary can then be found in `spine-godot/godot/bin`.

#### Godot 4.x
To build a Godot editor binary, clone the [spine-runtimes repository](https://github.com/esotericsoftware/spine-runtimes). Run the following in a Bash shell (use Git Bash on Windows) from inside the directory you cloned the Spine Runtimes to:

```
cd spine-godot
./build/setup.sh 4.1-stable false
./build/build-v4.sh
```

The first argument to `setup.sh` is the Godot repository branch or commit hash you want to build the Godot editor from. The second argument specifies whether you want to compile the editor for development. Valid values are `true` and `false`. If set to true, the build will add support for [Live++](https://liveplusplus.tech/) on Windows if you have set the `LIVEPP` environment variable to your Live++ installation directory, and disable many modules to speed up compilation.

The resulting Godot editor binary can then be found in `spine-godot/godot/bin`.

To build the export template for a specific platform, run the following in a Bash shell (use Git Bash on Windows):

```
cd spine-godot
./build/setup.sh 4.1-stable false
./build/build-templates-v4.sh windows
```

The first argument to `setup.sh` is the Godot repository branch or commit hash you want to build the Godot editor from. The second argument must be `false`.

The first argument to `built-templates-v4.sh` is the platform to compile the template for. Valid values are `windows`, `linux`, `macos`, `web`, `android`, and `ios`. Note that macOS and iOS export templates can only be build on a machine running macOS. See the [official instructions by Godot](https://docs.godotengine.org/en/stable/development/compiling/index.html).

The resulting Godot export template binary can then be found in `spine-godot/godot/bin`.

#### Godot 4.x with C# support
> **Note**: Godot 4.x with C# support currently only works on Windows, Linux, and macOS. As soon as upstream Godot releases support for mobile and the web, the spine-godot runtime will follow suit.

To build a Godot editor binary with C# support, clone the [spine-runtimes repository](https://github.com/esotericsoftware/spine-runtimes). Ensure you have the additional requirements for C# installed, as per the [Godot documentation](https://docs.godotengine.org/en/stable/contributing/development/compiling/compiling_with_dotnet.html) Run the following in a Bash shell (use Git Bash on Windows) from inside the directory you cloned the Spine Runtimes to:

```
cd spine-godot
./build/setup.sh 4.1-stable false true
./build/build-v4.sh true
```

The first argument to `setup.sh` is the Godot repository branch or commit hash you want to build the Godot editor from. The second argument specifies whether you want to compile the editor for development. Valid values are `true` and `false`. If set to true, the build will add support for [Live++](https://liveplusplus.tech/) on Windows if you have set the `LIVEPP` environment variable to your Live++ installation directory, and disable many modules to speed up compilation. The third argument is optional and specifies whether to build with C# support. Valid values are `true` and `false`. In this case it is set to true to enable C# support.

The argument to `build-v4.sh` is optional and specifies whether to build wiht C# support. Valid values are `true` and `false`. In this case it is set to true to enable C# support.

The resulting Godot editor binary can then be found in `spine-godot/godot/bin`. 
Additionally, you will find a folder `GodotSharp` in the `spine-godot/godot/bin` directory. It contains all the C# binding assemblies for the Godot API, including the spine-godot runtime APIs. When creating a new project, you will need to wire these up via [NuGet](https://www.nuget.org/). Read the section "C# project setup" below for more information.

To build the export template for a specific platform, run the following in a Bash shell (use Git Bash on Windows):

```
cd spine-godot
./build/setup.sh 4.1-stable false
./build/build-templates-v4.sh windows
```

The first argument to `setup.sh` is the Godot repository branch or commit hash you want to build the Godot editor from. The second argument must be `false`.

The first argument to `built-templates-v4.sh` is the platform to compile the template for. Valid values are `windows`, `linux`, `macos`, `web`, `android`, and `ios`. Note that macOS and iOS export templates can only be build on a machine running macOS. See the [official instructions by Godot](https://docs.godotengine.org/en/stable/development/compiling/index.html).

The resulting Godot export template binary can then be found in `spine-godot/godot/bin`.

#### Building via GitHub Actions
The [Spine Runtimes repository](https://github.com/EsotericSoftware/spine-runtimes/issues) contains a GitHub workflows in `.github/workflows/spine-godot.yml`, `.github/workflows/spine-godot-v4.yml`, and `.github/workflows/spine-godot-v4-all.yml`that allow building all Godot editor and export template binaries through GitHub actions. This may be simpler than compiling these artifacts locally. To use the GitHub workflow:

1. Clone the [Spine Runtimes repository](https://github.com/EsotericSoftware/spine-runtimes)
2. Enable GitHub workflows on the cloned repository
3. Manually trigger the `spine-godot`, `spine-godot-v4`, or `spine-godot-v4-all` workflow.

The resulting binaries will be attached as artifacts to a successful workflow run.

## C# Project Setup
> **Note:** the spine-godot GDExtension currently does not come with [C# bindings](https://github.com/godotengine/godot-proposals/issues/8191). The instructions below are for the spine-godot C++ engine module and corresponding custom Godot Editor build provided above.

If you use our Godot editor binaries with C# support, you have to take one extra step when setting up a new Godot project.

First, create the Godot project using the Godot Editor binary with C# support you downloaded from the installation section above.

Next, close Godot and open your project folder. In the root directory, create a new folder called `godot-nuget`.

Copy the Godot C# assemblies from the downloaded Godot editor ZIP file to that folder. These are the files you need to copy:

* <code>GodotSharpEditor.&lt;version>.snupkg</code>
* <code>Godot.NET.Sdk.&lt;version>.nupkg</code>
* <code>Godot.SourceGenerators.&lt;version>.nupkg</code>
* <code>GodotSharp.&lt;version>.nupkg</code>
* <code>GodotSharp.&lt;version>.snupkg</code>
* <code>GodotSharpEditor.&lt;version>.nupkg</code>

The <code>&lt;version></code> depends on which Godot version you downloaded from this page, e.g. `4.1.1`.

When you download and extract the Godot editor ZIP, you can find these files in the following folder:

* Windows: `godot-editor-windows-mono.zip\GodotSharp\Tools\`
* Linux: `godot-editor-linux-mono.zip/GodotSharp/Tools/`
* macOS: `Godot.app/Contents/Resources/GodotSharp/Tools`, or alternatively right click the Godot.app file in Finder, select `Show Package Contents`, then navigate to `Contents/Resources/GodotSharp/Tools/`

Finally, create a new file called nuget.config in the root directory of your project with the following content:

```
<configuration>
    <packageSources>
        <!-- package source is additive -->
        <add key="godot-nuget" value="./godot-nuget" />
    </packageSources>
</configuration>
```

This configures the `godot-nuget` directory to be a package source for NuGet packages. Instead of fetching the official Godot C# assemblies from the NuGet package registry, the assemblies from the `godot-nuget` directory will be used, which also include the C# bindings for the spine-godot runtime.

You can now open your project in Godot again and use the Godot and spine-godot C# APIs instead of GDScript!

> **NOTE**: if you have previously used the official Godot C# editor build, your NuGet cache will likely have the official Godot C# assemblies in NuGet cache at `$USER_HOME/.nuget`. Sadly, NuGet will not replace those with the Spine enabled assemblies. Please clear your NuGet cache before building your Spine-enabled Godot C# project!

Please read the [official Godot C# documentation](https://docs.godotengine.org/en/stable/tutorials/scripting/c_sharp/index.html) for the details.

## Updating the spine-godot Runtime
Before updating your project's spine-godot runtime, please consult our [guide on Spine editor and runtime version management](/spine-runtime-architecture#Versioning).

To update the spine-godot GDExtension, download the latest version from the `Installation` section above and copy it to your Godot project.

To update the spine-godot C++ engine module:
1. Download the latest pre-built Godot editor binaries for the Spine Runtimes and Editor version you want to use from the `Installation` section above.
2. Download the latest pre-built Godot export template binaries for the Spine Runtimes and Editor version you want to use from the `Installation` section above.
3. Open the Godot editor and install the export templates by navigating to `Editor >  Manage export templates ...`. Click `Install from file` and select the `.tzp` you downloaded.
4. If you are switching from one Spine major version to another, re-export your Spine projects with the Spine Editor version matching the Spine Runtimes version you just updated to, and replace your old exported files in your Godot project. Open your Godot project in Godot to trigger a re-import of the updated files.
5. If you are using C# with Godot, copy the new assemblies from the `GodotSharp` directory included in the editor download to your project's `godot-nuget/` directory as described above.

# Using spine-godot
The spine-godot runtime supports loading, playback and manipulation of animations created with Spine. The [spine-godot](/git/spine-runtimes/tree/spine-godot) runtime is written in C++ and based on the generic [spine-cpp](/spine-cpp) runtime. The spine-godot runtime wraps the spine-cpp classes and functions and exposes them to GDScript and C#. In addition to exposing most of the spine-cpp API, the spine-godot runtime also provides Godot nodes to easily display and interact with Spine skeletons.

Please consult the [Spine Runtimes Guide](/spine-runtimes-guide) 
for a detailed overview of the Spine Runtime architecture.

## Asset Management
### Exporting for Godot
![](/img/spine-runtimes-guide/spine-ue4/export.png)
Please follow the instructions in the Spine User Guide on how to 

1. [Export skeleton & animation data](/spine-export)
2. [Export texture atlases containing the images of your skeleton](/spine-texture-packer)

An export of the skeleton data and texture atlas of your skeleton will yield the following files:

![](/img/spine-runtimes-guide/spine-godot/exported-files.png)

1. `skeleton-name.spine-json` or `skeleton-name.skel`, containing your skeleton and animation data.
2. `skeleton-name.atlas`, containing information about the texture atlas.
3. One or more `.png` files, each representing on page of your texture atlas containing the packed images your skeleton uses.

> **Note**: You should prefer binary skeleton exports over JSON exports, as they are smaller in size and faster to load. If you must use JSON, make sure the file extension is `.spine-json` instead of `.json`. If you have an existing project that still uses `.json` export files, you can use this [Python script](/git/spine-runtimes/spine-godot/convert.py) to convert it to the new `.spine-json` extension.

The spine-godot runtime can import these files into special Godot resource types.

> **Note**: The spine-godot runtime currently does not support atlases exported using pre-multiplied alpha due to technical limitations in Godot. Godot performs a bleed operation on non-premultiplied texture images by default. This is generally enough to avoid artifacts usually fixed by using pre-multiplied alpha.

### Importing into Godot
![](/img/spine-runtimes-guide/spine-godot/import-general.png)
1. Open your Godot project in the Godot editor.
2. Drag your `.skel/.spine-json`, `.atlas`, and `.png` files into a folder of your choice

The asset importer will create a `SpineSkeletonFileResource` for the `.skel` or `.spine-json` skeleton file, a `SpineAtlasAssetResource` for the `.atlas` file, and a Godot texture resource for each `.png` file of the atlas.

> **Note:** In the import settings of a `SpineAtlasResource` you can also specify the prefix for normal map images that should be used for each atlas page. By default, the prefix is `n`. Normal maps are required for 2D lighting support and are optional.

With the source files imported, you can now create a `SpineSkeletonDataResource`, which combines a `SpineSkeletonFileResource` and a `SpineAtlasResource` for use by a `SpineSprite`.

In the file system panel in the Godot editor, right click the folder you placed your Spine assets in, then select `New Resource...`. In the pop-up dialog, select `SpineSkeletonDataResource`, click `Create`, give the resource a name, and click `Save`.

Double-click the newly created resource so it shows up in the inspector panel. Assign the previously imported atlas resource and skeleton file resource of your skeleton. The skeleton data resource also stores [animation mix times](/spine-applying-animations#Mix-times), which you can modify in the inspector.

![](/img/spine-runtimes-guide/spine-godot/skeleton-data-resource.png)

> **Note:** A skeleton data resource for a specific skeleton file and atlas combination should be shared by all all instances of `SpineSprite` that should display this combination. Do not define skeleton data resources as inline resources in a `SpineSprite`, as that will duplicate the amount of data that is being loaded by your game.


### Updating Spine Assets
During development, you may frequently update your Spine skeleton data and texture atlas files. You can simply overwrite these source files (`.spine-json`, `.skel`, `.atlas`, `.png`) by re-exporting from the Spine Editor and replacing the existing files in your Godot project. 

The Godot editor will detect changes to these source files and re-import the assets accordingly, updating any other resources referencing these assets in the process. If the Godot editor fails to recognize the source file change, you can force a re-import in the [import settings panel](https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/import_process.html#changing-import-parameters) of the file in the Godot editor.

## Nodes
The spine-godot runtime provides you with a set of nodes that allow to display, animate, and modify skeletons exported from Spine.

### SpineSprite Node
![](/img/spine-runtimes-guide/spine-godot/sprite-node.png)

The `SpineSprite` node displays the skeleton data and atlas stored in a `SkeletonDataResource`. The node exposes an [animation state](/spine-applying-animations) through which the skeleton can be animated. The `SpineAnimationState` can be accesssed via `SpineSprite.get_animation_state()`. The node also exposes the [skeleton instance](/spine-runtime-skeletons) (`SpineSkeleton`) via `SpineSprite.get_skeleton()`, through which you can query all of a skeleton's properties, like bones, slots, attachments, skins, or constraints.

#### Creating a SpineSprite

To create a `SpineSprite` node, click the `+` button in the scene panel and select `SpineSprite`. Next, assign a `SkeletonDataResource` the `SpineSprite` node should display to the respective property in the inspector, as shown in the image above.

You can freely transform the `SpineSprite` node in the Godot editor viewport using the respective tools and keyboard shortcuts. The in-editor bounding box of the `SpineSprite` coincides with the bounding box the skeleton has in the Spine Editor in setup mode.

#### Inspecting bones, slots, and attachments
Once you have assigned a `SkeletonDataResource` to a `SpineSprite`, you can inspect the bones, slots, and attachments of the skeleton.

Select the `SpineSprite` in the editor viewport. In the `Debug` property section, check the skeleton components you want to inspect.

![](/img/spine-runtimes-guide/spine-godot/debug.png)

You can hover your mouse in the editor viewport over parts you are interested in to show their names.

#### Previewing animations
The `Preview` property section lets you set an animation to be played back right in the editor viewport.

![](/img/spine-runtimes-guide/spine-godot/preview.png)

When `Preview Frame` is checked, the animation frame at the current `Preview Time` is displayed. You can scrub through the animation via the `Preview Time` slider.

#### Setting custom materials
The `Materials` property section lets you set a custom material for each supported Spine blend mode. The materials will be applied to all slots and their attachments in the `SpineSprite`.

![](/img/spine-runtimes-guide/spine-godot/materials.png)

You can use the `SpineSlotNode` to set materials for a single slot, which will ovewrite the custom materials set on the `SpineSprite`.

See the `example/09-custom-material` scene in the example project.

#### Setting the Update Mode
By default, a `SpineSprite` updates its underlying data as fast as possible, every frame. Changing this behaviour can be done via the `Update Mode` property.

![](/img/spine-runtimes-guide/spine-godot/update-mode.png)

The `Process` mode is the default and is dependent on the frame rate. The `Physics` mode updates the `SpineSprite` in fixed intervals (60 times per second by default) and is useful for code related to the Godot physics engine. The `Manual` mode disables all automatic updates. When set, the `SpineSprite` needs to be updated manually when overriding `_process(delta)` or `_physics_process(delta)` by calling `SpineSprite.update_skeleton()`. This mode gives full control over when a `SpineSprite` is  updated.

See [Idle and Physics Processing](https://docs.godotengine.org/en/stable/tutorials/scripting/idle_and_physics_processing.html) in the official Godot documentation for more information.

#### Animating a `SpineSprite`
Animating a `SpineSprite` is done in code via GDScript or C#. Below, you'll find example code using GDScript which directly translates to the spine-godot C# API as well. See the [Godot C# documentation](https://docs.godotengine.org/en/stable/tutorials/scripting/c_sharp/index.html) on how the APIs are mapped from GDScript to C#.

The `SpineSprite` exposes a `SpineAnimationState` via `get_animation_state()`. See [Applying Animations](/spine-applying-animations#AnimationState-API) in the Spine Runtimes Guide for more in-depth information, specifically about animation tracks and animation queueing.

To set a specific animation on track 0 of a `SpineSprite`, call `SpineAnimationState.set_animation()`:

```
extends SpineSprite

func _ready():
   var animation_state = get_animation_state()
   animation_state.set_animation("walk", true, 0)
```

The first parameter is the name of the animation, the second parameter specifies whether to loop the animation, and the last parameter specifies the animation track the animation should be played back on.

Queuing animations is also done through the animation state methods:

```
extends SpineSprite

func _ready():
   var animation_state = get_animation_state()
   animation_state.set_animation("idle", true, 0)
   animation_state.add_animation("walk", 0.5, true, 0)
```

The first parameter to `add_animation()` is the animation name. The second parameter specifies the delay in seconds, after which this animation should replace the previous animation on the track. The third parameter specifies whether the animation should be looped. The final parameter specifies the track the animation should be played back on.

When setting or adding an animation to an animation state track, a `SpineTrackEntry` is returned, which allows to further modify the properties of this specific animation playback. For example, you can set the track entry to reverse the animation playback:

```
var track_entry = animation_state.add_animation("walk", 0.5, true, 0)
track_entry.set_reverse(true)
```

> **Note:** Do not hold on to `SpineTrackEntry` instance outside the function you are using them in. Track entries are re-used internally and will thus become invalid once the animation it represents has been completed.

You can set or queue empty animations on an animation track to smoothly reset the skeleton back to the setup pose via the `set_empty_animation()` and `add_empty_animation()`:

```
animation_state.set_empty_animation(0, 0.5)
animation_state.add_empty_animation(0, 0.5, 0.5)
```

The first parameter to `set_empty_animation()` specifies the track. The second parameter specifies the mix duration in seconds used to mix out the previous animation and mix in the "empty" animation.

The first parameter to `add_empty_animation()` specifies the track.  The second parameter specifies the mix duration in seconds used to mix out the previous animation and mix in the "empty" animation. The third parameter is the delay in seconds, after which the "empty" animation should replace the previous animation on the track via mixing.

All animations on a track can be cleared immediately via `clear_track(track_id)`. To clear all tracks at once, `clear_tracks()` can be used. This will leave the skeleton in the last pose it was in.

To reset the pose of a skeleton to the setup pose, use `SpineSprite.get_skeleton().set_to_setup_pose()`. This will reset both bones and slots to their setup pose configuration. Use `SpineSprite.get_skeleton().set_slots_to_setup_pose()` to only reset the slots to their setup pose configuration.

#### Signals
A `SpineSprite` exposes multiple signals to react to events throughout its life-cycle.

To react to changes of the animation state, you can connect to these signals:

* `animation_started`, emitted when an animation has started.
* `animation_interrupted`, emitted when the animation's track was cleared, or a new animation was set.
* `animation_completed`, emitted whenever an animation on a track completes a loop.
* `animation_ended`, emitted when the animation will never be applied again.
* `animation_disposed`, emitted when the animation track entry is disposed.
* `animation_event`, emitted when a user defined [event](/spine-events#Events) happened.

In addition to animation state events, a `SpineSprite` also exposes signals for its higher-level life-cycle:

* `before_animation_state_update`, emitted before the animation state is updated with the current delta time.
* `before_animation_state_apply`, emitted before the animation state is applied to the skeleton pose.
* `before_world_transforms_change`, emitted before the world transforms of the skeleton's bones are updated.
* `world_transforms_changed`, emitted after the world transforms of the skeleton's bones are updated.

These signals can come in handy when updating bones or other skeleton components manually. Generally, it is advised to use `SpineBoneNode` or `SpineSlotNode` instead, as they hide the intricacies of such manual updates, while covering 99% of the uses cases, like positioning a bone based on a mouse cursor position.

See `example/02-animation-state-listeners` scene in the example project.

#### Mix-and-match Skins
![](/img/spine-runtimes-guide/spine-godot/mix-and-match.png)

Many applications and games allow their users to create custom avatars out of many individual items, such as hair, eyes, pants, or accessories like earrings or bags. In Spine, this can be achieved by [mixing and matching skins](/spine-examples-mix-and-match).

You can create custom skins from other skins as follows:

```
var custom_skin = new_skin("custom-skin")
var data = get_skeleton().get_data()
custom_skin.add_skin(data.find_skin("skin-base"))
custom_skin.add_skin(data.find_skin("nose/short"))
custom_skin.add_skin(data.find_skin("eyelids/girly"))
custom_skin.add_skin(data.find_skin("eyes/violet"))
custom_skin.add_skin(data.find_skin("hair/brown"))
custom_skin.add_skin(data.find_skin("clothes/hoodie-orange"))
custom_skin.add_skin(data.find_skin("legs/pants-jeans"))
custom_skin.add_skin(data.find_skin("accessories/bag"))
custom_skin.add_skin(data.find_skin("accessories/hat-red-yellow"))
get_skeleton().set_skin(custom_skin)
get_skeleton().set_slots_to_setup_pose()
```

Create a custom skin via `SpineSprite.new_skin(name)`. Next, fetch the `SpineSkeletonData` from the `SpineSkeleton` the `SpineSprite` manages. This is used to look up skins by name via `SpineSkeletonData.find_skin()`. Add all the skins you want to combine via `SpineSkin.add_skin()`. Finally, set the new skin on the skeleton via `SpineSkeleton.set_skin()`.

See the `example/03-mix-and-match` scene in the example project.

#### Getting and setting bone transforms
A `SpineSprite` wraps a Spine [runtime skeleton](/spine-runtime-skeletons), which itself consists of bones, slots, attachments, and constraints. The skeleton manages the transforms of bones in a coordinate system relative to the skeleton's origin in the Spine Editor.

The `SpineSprite` class exposes the helper methods `get_global_bone_transform(name)` and `set_global_bone_transform(name, transform)` to let you get and set a bone's transform in the Godot canvas space. Note that a retrieved or set transform will not encode skew.

If you want to set the transform of a bone manually, you must do so before the `SpineSprite` updates the world transforms of the skeleton's bones. This can be done in reaction to the `before_world_transforms_change` signal.

An alternative to setting a bone's transform directly is to use a `SpineBoneNode`.

### SpineBoneNode
![](/img/spine-runtimes-guide/spine-godot/bone-node.png)
A `SpineBoneNode` can either follow a skeleton's bone, or drive its transform. Use a `SpineBoneNode` in drive mode in scenarios where you want to control the transform of a bone based on some input, e.g. the mouse position. Use a `SpineBoneNode` in follow mode if you want another node to follow a bone in a skeleton, e.g. to attach a `CollisionShape` to a bone of a `SpineSprite`.

To create a `SpineBoneNode`, right-click the `SpineSprite` you want to attach the node to, and select `Add child node...`. Select `SpineBoneNode` from the list of available node types and give it a name. You can then modify the node's configuration in the inspector.

> **Note**: A `SpineBoneNode` must always be a direct child of a `SpineSprite`, otherwise it will be unable to locate the bone it should follow or drive.

![](/img/spine-runtimes-guide/spine-godot/bone-node-properties.png)

The `Bone Name` property dropdown displays all available bones to select from. The `Bone Mode` specifies whether the node should follow a bone in the `SpineSprite` or drive it. The node can be enabled or disabled, allowing to turn following and driving on and off on demand.

The `SpineBoneNode` will also be displayed in the editor viewport. The properties in the `Debug` section define its appearance.

See the `example/05-mouse-following` scene for an example on how to use a `SpineBoneNode` to drive a bone inside a `SpineSprite` using mouse movement.

See the `example/06-bone-following` scene for an example on how to use a `SpineBoneNode` to follow a bone in a `SpineSprite`. In this example, the `SpineBoneNode` itself has a child, which will appear to follow the bone in the `SpineSprite`.

> **Note:** The child node will not be properly inserted into the `SpineSprite` drawing order. The `SpineSlotNode` is better suited for use cases, where you want to insert arbitrary nodes into the drawing order of the parts making up a `SpineSprite`.

### SpineSlotNode
![](/img/spine-runtimes-guide/spine-godot/slot-node.png)

A `SpineSlotNode` lets you insert your own nodes into the drawing order of a `SpineSprite`. It can be used to attach particle system, custom sprites, or even other `SpineSprite` nodes to specific [slots](/spine-slots) of the skeleton. The children of the `SpineSlotNode` will be rendered on top of any active attachment of the slot. You can also use a `SpineSlotNode` to override the materials of a specific slot.

To create a `SpineSlotNode`, right-click the `SpineSprite` you want to attach the node to, and select `Add child node...`. Select `SpineSlotNode` from the list of available node types and give it a name. You can then modify the node's configuration in the inspector.

> **Note**: A `SpineSlotNode` must always be a direct child of a `SpineSprite`, otherwise it will be unable to locate the slot it is assigned to.

![](/img/spine-runtimes-guide/spine-godot/slot-node-properties.png)

The `Slot Name` property dropdown displays all available slots to select from. The `Materials` section lets you set the materials that should be used to override the default materials of this slot.

See the `example/07-slot-node` scene for an example on how to use a `SpineSlotNode` to insert nodes into the drawing order of a `SpineSprite`.

See the `example/09-custom-material` scene for an example on how to use a `SpineSlotNode` to override the materials of a specific slot in a `SpineSprite`.

### SpineAnimationTrack
![](/img/spine-runtimes-guide/spine-godot/animation-track.png)

> **Note:** `SpineAnimationTrack` is highly experimental due to Godot's animation engine not being open enough for 3rd party plugins to support the full fidelty as found in e.g. animation imported 3D characters. It is not available in the spine-godot GDExtension.

A `SpineAnimationTrack` node lets you animate a `SpineSprite` via Godot's [animation player](https://docs.godotengine.org/en/stable/classes/class_animationplayer.html) and powerful [animation editor](https://docs.godotengine.org/en/stable/tutorials/animation/introduction.html). It's ideally suited to create cut scenes using Godot's animation editor instead of handcrafting them by code.

To create a `SpineAnimationTrack`, right-click the `SpineSprite` you want to attach the node to, and select `Add child node...`. Select `SpineAnimationTrack` from the list of available node types and give it a name. You can then modify the node's configuration in the inspector.

> **Note**: A `SpineAnimationTrack` must always be a direct child of a `SpineSprite`, otherwise it will be unable to locate the slot it is assigned to.

When creating a `SpineAnimationTrack`, an `AnimationPlayer` node is created and attached as a child.

A `SpineSprite` is then animated by keying both the `SpineAnimationTrack` and its child `AnimationPlayer`. You set the animation to be played back by keying the child `AnimationPlayer`. To modify animation properties, like whether it should be looped, played in reverse, and so on, you key the `SpineAnimationTrack` properties.

This two tiered setup allows the animation editor to display the duration of keyed animations of the child `AnimationPlayer`, which makes creating complex animation sequences a lot easier. It also allows scrubbing the timeline in the animation editor for previewing.

> **Note:** Mix times defined in the `SpineSkeletonDataResource` used by a `SpineSprite` can not be previewed in the editor due to technical limitations of the Godot animation editor.

You can attach multiple `SpineAnimationTrack` nodes to a single `SpineSprite`. This can be used to layer multiple animations on top of each other. Each `SpineAnimationTrack` is assigned a [track index](/spine-applying-animations#Tracks). Animations on higher tracks override effects of animations on lower tracks if they key the same skeleton property.

See the `example/08-animation-player` scene for an example. The `AnimationPlayer` attached to the root of the scene has two animations that key the `SpineAnimationTrack` nodes and their child `AnimationPlayer` nodes. The `slow-moonwalk` animation is a simple illustration of the basic principles of `SpineAnimationTrack`. The `cutscene` animation is a more elaborate animation, demonstrating multi-track keying and complex animation sequences.

# 2D Lighting
![](/img/spine-runtimes-guide/spine-godot/2d-lighting.png)

spine-godot integrates with [Godot's 2D lighting system](https://docs.godotengine.org/en/stable/tutorials/2d/2d_lights_and_shadows.html).

To support Godot's 2D lighting system, you must provide normal maps for your texture atlas. Each `.png` making up a texture atlas page must have a corresponding `.png` normal map image next to it in the file hierarchy. The normal map image files must have a common prefix. The default prefix is `n_`. E.g. a texture atlas page image called `raptor.png` must have a normal map image called `n_raptor.png` next to it.

Upon importing a texture atlas, spine-godot will try to locate and load normal map images for each texture atlas page image. You can define your own normal map image prefix in the texture atlas import view.

![](/img/spine-runtimes-guide/spine-godot/normal-map.png)

Once the texture atlas page and normal map images have been successfully imported, you can apply Godot's 2D lighting system to your `SpineSprite` nodes.

See the `10-2d-lighting` scene in the examples.

# Loading .skel/.json/.atlas files from disk
For modding purposes, it might be useful to be able to load export Spine assets from an arbitrary location on disk. You can achieve this by using the `SpineSkeletonFileResource.load_from_file()` function for `.skel` and `.json` skeleton files, and the `SpineAtlasResource.load_from_atlas_file()` function for `.atlas` files.

The general principle:
- Load the skeleton file
- Load the atlas file
- Construct a `SpineSkeletonDataResource` from the skeleton and atlas
- Create one or more `SpineSprite` instances from the `SpineSkeletonDataResource`. The data resource is shared!

The whole process in GDScript:

```
	# Load the skeleton file
	var skeleton_file_res = SpineSkeletonFileResource.new();
	skeleton_file_res.load_from_file("/Users/badlogic/workspaces/spine-runtimes/examples/coin/export/coin-pro.skel");
	
	# Load the atlas file
	var atlas_res = SpineAtlasResource.new();
	atlas_res.load_from_atlas_file("/Users/badlogic/workspaces/spine-runtimes/examples/coin/export/coin.atlas");
	
	# Create a skeleton data resource, you can share this across multiple sprites
	var skeleton_data_res = SpineSkeletonDataResource.new();
	skeleton_data_res.skeleton_file_res = skeleton_file_res;
	skeleton_data_res.atlas_res = atlas_res
	
	# Create a sprite from the skeleton data and add it as a child
	var sprite = SpineSprite.new();
	sprite.skeleton_data_res = skeleton_data_res;
	sprite.position.x = 200;
	sprite.position.y = 200;
	sprite.get_animation_state().set_animation("animation", true, 0);
	self.add_child(sprite)
```

See also the `13-load-from-disk` example.

# Spine Runtimes API access
spine-godot maps almost all of the Spine Runtime API to GDSCript. Objects returned by `SpineSprite`, like `SpineSkeleton` via `SpineSprite.get_skeleton()` are 1:1 translations of the spine-cpp API to GDScript. You can thus apply almost all of the materials in the generic [Spine Runtimes Guide](/spine-runtimes-guide) to your GDScripts.

Due to the nature of GDScript, there are however a few limitations:

* Any returned array or map is a copy of the internal array. Modification will not have an effect.
* You can not set listeners on individual `SpineTrackEntry` objects. Setup signals on `SpineSprite` instead.
* You can not create, add or remove bones, slots, and other Spine objects directly.
* The C++ class hierarchies of attachments and timelines are not exposed in GDScript.
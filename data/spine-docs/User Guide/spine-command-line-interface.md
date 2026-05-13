http://esotericsoftware.com/spine-command-line-interface

[Command line interface - Spine User Guide]
[[]]

# Command line interface

<callout>Our [export scripts](https://github.com/EsotericSoftware/spine-scripts/tree/master/export) can automate exporting many projects at once.</callout>

Spine's command line interface (CLI) allows Spine to be run from the command line to export, import, pack texture atlases, and more. This is most commonly used to automate exporting all your projects and packing texture atlases as part of the build process for your software.

When run in this way, Spine starts, does one or more exports or texture packings, then exits.

Most CLI parameters can be used headless, which means on a computer that is not configured to display a user interface. However, to export images or video an OS windowing system and OpenGL are required.

# Usage

Descriptions of CLI parameters are shown when Spine is run with the `--help` parameter. Additional, advanced parameters are shown when Spine is run with the `--advanced` parameter.

## Editor

```plain,full-height
Spine [-hvlft] [-x <host:port>] [-u <version>] [<path>]

-h, --help      Print basic CLI help and exit.
--advanced      Print advanced CLI help and exit.
-v, --version   Print version information and exit.
-l, --logout    Logout, removing activation code.
-u, --update    The version number of the Spine update to load.
-f, --force     Force download of the Spine update.
-x, --proxy     Proxy server to use when checking for and downloading updates.
-t, --notimeout Disable timeout when checking for and downloading updates.
project.spine   Path to a Spine project file to open.
```

The patch part of the [version number](/spine-versioning#Spine-editor-version-numbers) used with `-u` or `--update` can be `xx` to get the latest patch version. For example, to get the latest 4.0 version:

```plain,full-height
Spine --update 4.0.xx
```

If you want to get the latest stable version, you can specify `latest`, `lateststable` or `stable` to the version number. If you want to get the latest beta version, you can specify `latestbeta` or `beta`.

## Export

```plain,full-height
Spine [-i <path>] [-m] [-o <path>] -e <path>
Spine [-i <path>] [-m] [-o <path>] -e json[+pack]|binary[+pack]

Export JSON, binary, images, or video:
-i, --input   Path to a folder, project, or data file. Overrides export JSON.
-m, --clean   Animation clean up is performed before export.
-o, --output  Path to write export file(s). Overrides export JSON.
-e, --export  Path to export settings JSON file.
```

The export settings JSON file is created using Spine by clicking on the `Save` button at the bottom of the `Export` dialog.

![](/img/spine-user-guide/command-line-interface/save-export-settings.png)

<callout>Most build scripts that perform exports will want to use `--update` to specify the Spine editor version.</callout>

Input and output paths specified on the CLI are optional. If specified, they override any input or output paths specified in the export settings JSON file.

The input path is a path to a project, JSON, or binary file. The output path may be a file or folder, depending on the export settings.

<callout>The `--clean-all` parameter will clean all exports, so `--clean` doesn't have to be specified for each one.</callout>

If the `--clean` parameter is specified, animation [clean up](/spine-keys#Clean-Up) is performed before export. This does not modify the project file.

If `json` or `binary` is specified instead of a path to an export settings JSON file, then a JSON or binary export is performed using default settings. If `json+pack` or `binary+pack` is specified, [texture packing](/spine-texture-packer) is also performed using default settings.

## Import

```plain,full-height
Spine -i <path> [-s <scale>] -o <path> -r [<name>]

Import JSON, binary, or a project's skeletons into another project:
-i, --input   Path to a folder, project, or data file to be imported.
-o, --output  Path to project file to import into. Created if nonexistent.
-s, --scale   Scale the project being imported.
-r, --import  Perform a skeleton import. The skeleton name may be omitted.
```

The input path is a project, JSON, or binary file. Alternatively, it can be a folder containing `.spine`, `.json`, or `.skel` files.

The output path is a project file.

If `--scale` is specified, the project's skeletons are [scaled](/spine-import#Scale) before they are imported.

If a project is imported into another project, all skeletons are imported. If a skeleton name is specified using `--import` and only one skeleton is imported, then the skeleton is renamed. If multiple skeletons are imported, the skeleton name is ignored and the skeletons keep their existing names.

If a JSON or binary file is imported into a project and a skeleton name is specified using `--import`, then the skeleton is renamed. If a skeleton name is not specified, the skeleton is named using the JSON or binary file name without the extension.

## Clean up

```plain,full-height
Clean up: Spine -i <path> -m

Animation clean up:
-i, --input   Path to project file or folder.
-m, --clean   Animation clean up is performed and the project is saved.
```

Animation [clean up](/spine-keys#Clean-Up) is performed for all animations in the project and the project file is saved with the changes.

The input path is a project file or folder containing `.spine` files.

## Pack

```plain,full-height
Spine -i <path> [-j <path>]... -o <path> -p <name>
Spine -i <path> [-j <path>]... -o <path> [-n <name>] -p <path>

Texture atlas packing:
-i, --input   Path to folder of images to be packed.
-o, --output  Path to write texture atlas and PNG files.
-j, --project Path to a project to determine which images are used by meshes.
-n, --name    Texture atlas name, the prefix for the atlas and PNG files.
-p, --pack    Texture atlas name or path to pack settings JSON file.
```

The input and output paths are folder paths.

The `--pack` or `-p` parameter is either:
* The [texture atlas name](/spine-texture-packer#Texture-atlas-name) to use when writing output files. In this case, the default texture packing settings are used but can be customized by [pack.json](/spine-texture-packer#JSON-Configuration) files in the input folders.
* The path to a pack settings JSON file, which is created using Spine by clicking on the `Save` button at the bottom of the `Texture Packer Settings` dialog.
![](/img/spine-user-guide/command-line-interface/save-packer-settings.png)
If a name is not specified, the pack settings JSON file name without the file extension is used as the texture atlas name.

One or more project files can be specified using `--project`. When whitespace stripping is enabled, the texture packer looks in these projects for each image file. Any meshes found to use the image file are taken into account so whitespace stripping will not remove parts of the images within the meshes. When `--project` or `-j` is specified, the `currentProject` texture packer setting is ignored, as if it were set to `true`.

## Unpack

```
Spine -i <path> -o <path> -c <path>

Texture atlas unpacking:
-i, --input   Path to folder of atlas images.
-o, --output  Path to write unpacked image files.
-c, --unpack  Path to texture atlas file.
```

## Info

```plain,full-height
Spine -i <path>

Project information:
-i, --input   Path to a folder, project, or data file.
```

Information is output for each project file. This can useful to know what version of Spine a project was saved with, how many animations are in the project, and other information.

The input path is a folder containing `.spine` files, a project file, or a JSON or binary data file.

## Advanced

```plain,full-height
Advanced:
-Xmx2048m          Set the maximum memory usage in megabytes (2048 default).
--trace            Enable additional logging and diagnostic checks.
--auto-start       Start automatically.
--no-auto-start    Do not start automatically.
--ping             Test latency to each server (otherwise done every 4 days).
--server x         Set the preferred server regardless of ping (eg jp/us/eu).
--disable-audio    Disable all audio support.
--pretty-settings  Format settings files more nicely.
--keys             Enable hotkey popups by default.
--hide-license     Don't show name and email on launcher (eg for streaming).
--ui-scale x       Set the interface scale (eg 200).
--icc-profile x    Set the path to the ICC profile file for color management.
--intro            Show the Esoteric Software logo intro.
--clean-all        Animation clean up for all exports.
--mesh-debug       Show debug information on top of meshes.
--export-selection Editor selection is shown in image and video exports.
--ignore-unknown   Don't error if a CLI parameter is not recognized.
```

## Examples

```plain,full-height
Spine --export /path/to/export.json
Spine --export "/path/with spaces/to/export.json"
Spine --input /path/to/project.spine --output /path/to/output/
      --export /path/to/export.json
Spine -i /path/to/project.spine -o /path/to/output/ -e /path/to/export.json
Spine -i /path/to/project.spine -o /path/to/output/ -e binary+pack
Spine -e /path/to/export1.json -e /path/to/export2.json
Spine -i /path/to/images/ -o /path/to/output/ --pack /path/to/pack.json
Spine -i /path/to/images/ -o /path/to/output/ -n name -p /path/to/pack.json
Spine -i /path/to/project1.spine -o /path/to/output/ -e /path/to/export1.json
      -i /path/to/project2.spine -e /path/to/export2.json -i /path/to/images/
      -o /path/to/output/ -p /path/to/pack.json
Spine -i /path/to/skeleton.json -o /path/to/project.spine -r skeletonName
```

Multiple commands can be specified in one Spine ivocation, as seen in some of the examples above.

The folders for output paths are created if they don't exist.

If a command fails, Spine returns a non-zero error code.

The [export script](/git/spine-runtimes/blob/examples/export/export.sh) used to export all of Spine's example projects can serve as a real life example of Spine's CLI usage. Windows users can use [Cygwin](https://www.cygwin.com/) to write similar scripts using bash.

## Unknown parameters

The Spine launcher checks that the specified parameters are allowed, before passing them to the Spine editor. If some CLI parameters are not accepted, it could be that those parameters were not available when your Spine launcher was installed, but a newer version of the Spine editor can still understand them.

In that case, you can download and reinstall the Spine launcher or use the `--ignore-unknown` parameter so the Spine launcher will allow parameters it doesn't recognize. It will print a warning for unrecognized parameters, but will still pass them to the Spine editor. If the Spine editor doesn't recognize them, they will be ignored.

# Running Spine with CLI parameters

## Windows

Spine for Windows comes with two executables: `Spine.exe` and `Spine.com`. The EXE file is a GUI application, it starts Spine without a console window and doesn't wait for Spine to exit. The COM file is a command line application, it directs Spine's output to a console window and waits for Spine to exit.

Either executable can be used for the command line interface, but generally the COM file is preferred. If the Spine installation folder is on the system path or is the current working directory, specifying `Spine` without an extension will always execute `Spine.com`. For example:

```
Spine -e C:\path\to\export.json
```

## Mac

Command line export when using Spine for Mac is done by launching the Spine executable file directly rather than opening `Spine.app`. The executable is found inside `Spine.app` at `Spine.app/Contents/MacOS/Spine`. For example:

```
/Applications/Spine.app/Contents/MacOS/Spine -e /path/to/export.json
```

## Linux

Command line export when using Spine for Linux is done by running the `Spine.sh` script. For example:

```
./Spine.sh -e /path/to/export.json
```

[Next: Settings](/spine-settings)
[Previous: Import PSD](/spine-import-psd)
[Spine User Guide: Table of Contents]
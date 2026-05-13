http://esotericsoftware.com/spine-texture-packer

[Texture packing - Spine User Guide]
[[Spine can pack sprite sheets and texture atlases for your games.]]

# Texture packing

Spine can pack your individual images into a texture atlas or grid (spritesheet) for more efficient rendering at runtime. Spine's texture packer is a general purpose tool. While it can be used for your Spine skeletons, it can also be run separately to pack all the images for your applications.

In most graphics APIs (for example, OpenGL), a texture is bound, some drawing is done, another texture is bound, more drawing is done, and so on. Binding the texture is relatively expensive, so it is ideal to store many smaller images on a larger image, bind the larger texture once, then draw portions of it many times. Spine can efficiently pack many smaller images into larger images, resulting in what is called a "texture atlas".

Spine uses multiple advanced packing algorithms. Packing is done with numerous heuristics at various sizes and the most efficient result is chosen.

<img src="/img/spine-user-guide/texture-packer/raptor-atlas.png" class="no-borders">!!

# Texture atlas files

A texture atlas consists of a text file with an `.atlas` file extension and one or more image files, called atlas "page images". The atlas file [describes](/spine-atlas-format) the locations within the page images of each of the packed smaller images, called atlas "regions". The regions are referenced in the atlas file by name.

A single texture atlas can have many page images, allowing all the images for an application to be packed into a single atlas. The only reason to use multiple atlases is when some of the images don't need to be loaded at the same time.

# Packing

<callout>Texture packing can also be done using the [command line interface](/spine-command-line-interface).</callout>

The texture packer can be run two ways:

## Packing during data export

When exporting [JSON](/spine-export#JSON) or [binary](/spine-export#Binary), check `Pack`:

![](/img/spine-user-guide/texture-packer/create-atlas.png)

Two options are provided for how to find the images files to pack:

* `Attachments` When chosen, only the image files used by attachments are packed. Any [pack.json](#JSON-Configuration) files are not used.
* `Image folders` When chosen, the image files found in each skeleton's [images path](/spine-images#Images-path) are packed. This allows use of a [pack.json](#JSON-Configuration) file to configure packing for each folder.

Two options are provided for how texture atlases are created:

* `Atlas per skeleton` An atlas is packed for each skeleton. Each atlas is named using the skeleton name, which matches the name of the corresponding skeleton data file.
* `Single atlas` The images for all the skeletons are packed into a single atlas. The atlas is named using the name of the project file without the file extension.

The `Pack Settings` button configures the texture packer settings.

This is a convenient way to export both the skeleton data and the texture atlas at the same time. However, it can be more flexible to run the texture packer separately.

## Running the texture packer separately

Choose `Texture Packer` from the main menu:

![](/img/spine-user-guide/texture-packer/menu.png)

On the texture packer dialog, specify the folder containing the images to pack, where to write the atlas files, and the name of the atlas.

![](/img/spine-user-guide/texture-packer/dialog.png)

The `Settings` button configures the texture packer settings.

# Settings

The texture packer has many settings to control how images are packed.

![](/img/spine-user-guide/texture-packer/settings.png)

This dialog can be intimidating at first, but many settings can be left at their defaults. Some notable settings:

* Max width and height. This determines how much can fit on a single atlas page image.
* Packing rectangles or polygons. Packing polygons is more efficient but slower and requires knowing the project file for context.
* Premultiplied alpha. This setting should match how the images are rendered at runtime.
* Strip whitespace.
* Scale.

## Regions

!table Setting, Description

!row Strip whitespace X/Y
Removes blank pixels around the edges of the input images. The amount removed is stored in the atlas data so the images can be drawn in your application as if they were not whitespace stripped.

!row Rotation
More efficient packing is achieved by rotating some images 90 degrees. Applications must take special care to draw these regions properly.

!row Alias
Two images that are pixel for pixel the same will only be packed once.

!row Ignore blank images
Images that are only transparent pixels will not be packed.

!row Alpha threshold
Alpha values below this are treated as zero when whitespace is stripped.

!table

## Region padding

!table Setting, Description

!row Padding X/Y
The number of pixels between packed images. Some texture filtering averages neighboring pixels, so a padding of 2 is recommended to avoid neighboring regions from affecting each other.

!row Edge padding
The padding will also be applied to the edge of the page images.

!row Duplicate padding
The padding will copy pixels from the closest region. This can hide "seam" artifacts if texture filtering selects padding pixels.</p><p>When whitespace stripping, duplicate padding is only applied on edges that have non-whitespace pixels. When packing polygons, duplicate padding is only applied to images used by a region attachment or by a mesh attachment that covers the entire image.

!table

## Pages

!table Setting, Description

!row Min width/height
The smallest size for any page image.

!row Max width/height
The maximum size of any page image. If the images don't fit in a page this size, multiple page images are output.

!row Power of two
Makes the output page dimensions a power of two. This is a requirement for some game toolkits.

!row Divisible by 4
Makes the output page dimensions divisible by 4. This is a requirement for some texture compression algorithms.

!row Square
Makes the width and height equal. This is a requirement for some texture compression algorithms (eg, PVRT).

!table

## Runtime

These settings are hints intended for the application loading the data to optionally apply at runtime.

!table Setting, Description

!row Filter min/mag
The texture minification and magnification settings.

!row Wrap X/Y
The texture wrap settings.

!row Format
The in-memory format.

!table

## Output

!table Setting, Description

!row Format
Output PNG or JPG pages.

!row JPG quality
The compression for JPG output.

!row Packing
Determines how the images are packed.
* `Grid` packs the images in a uniform grid (as known as a spritesheet).
* `Rectangles` packs the images using their rectangles.
* `Polygons` packs the images as tightly as possible, using mesh hulls from the Spine project.

!row Premultiply alpha
Multiplies pixel RGB values by the alpha value. Rendering the images at runtime must also use premultiplied alpha. This is recommended for [correct blending](/forum/d/3132-premultiplied-alpha-guide/2).

!row Bleed
Sets RGB values for transparent pixels to the RGB values of the nearest non-transparent pixels. When not using premultiplied alpha at runtime, this prevents texture [filtering artifacts](/forum/d/2765-why-is-bleed-an-option-black-lines-around-sprites/3) when RGB values are sampled for transparent pixels.

!row Scale
An entire atlas is output for each scale specified.

!row Suffix
The suffix for each scaled atlas. If blank, files for multiple scales will be output with the same name to a subfolder for each scale.

!row Resample
The algorithm to use for scaling.

!table

## Options

!table Setting, Description

!row Atlas extension
The file extension for the atlas data file.

!row Combine subdirectories
The current folder and all subfolders are packed on to the same pages. Any subfolder containing a `pack.json` file will not be combined.

!row Flatten paths
Subfolders are stripped from region file names. Image file names should be unique.

!row Indexes
Image names are stripped of everything after the last underscore. See [image indexes](#Image-indexes).

!row Legacy output
Writes the atlas file in a format that can be read by Spine Runtimes versions prior to 4.0.

!row Debug
Lines are drawn on the output pages to show the packed image bounds.

!row Auto Scale
Scale is reduced until all the images fit on one atlas page (slow).

!row Fast
Packing will not be as efficient but will execute much faster.

!row Limit memory
When unchecked, all images are loaded to memory at the same time to increase packing speed. Spine may crash if not enough memory is available.

!row Pretty print
The atlas file is written with extra whitespace to make it easier for a human to read.

!row Current project
When checked, mesh UVs for mesh image files in the current project are used to strip whitespace.

When packing as part of data export, this setting is ignored and meshes in the current project are always used to strip whitespace.


!table

## Other

These settings are not available on the settings dialog and may only be specified in the JSON configuration file.

!table Setting, Description

!row ignore
Images in this folder and any subfolders will not be packed.

!row bleedIterations
The number of times bleed is applied. Defaults to 2.

!row separator
The string to use when appending numbers to file names. Defaults to underscore (`_`).

!table

# Folder structure

<callout>When [packing during data export](#Packing-during-data-export) and `Attachments` is chosen, the folder structure is not used.</callout>

Spine can pack all images for an application in one shot. Given a folder, it recursively scans for image files. For each folder of images Spine encounters, it packs the images on to a larger page image. If the images in a folder don't fit on the maximum size of a single page, multiple pages will be used.

Images in the same folder go on the same set of pages. If all images fit on a single page, subfolders should not be used because with it is most efficient to have all the images on a single page. Otherwise, subfolders can be used to segregate related images to minimize texture binds.

![](/img/spine-user-guide/texture-packer/folder-structure.png)

For example, an application may want to place all the "game" images in a separate folder from the "pause menu" images, since these two sets of images are drawn serially: all the game images are drawn (one bind), then the pause menu is drawn on top (another bind). If the images were in a single folder that resulted in more than one page, each page could contain a mix of game and pause menu images. This would cause many texture binds to render the game and pause menu instead of just one each.

Subfolders are also useful to group images with related texture settings. Settings like runtime memory format (RGBA, RGB, etc) and filtering (nearest, linear, etc) are per texture. Images that need different per texture settings need to go on separate pages, so should be placed in separate subfolders.

To use subfolders for organization rather than for controlling which images are grouped together on a page, see the `Combine subdirectories` setting.

To avoid subfolder paths being used in region names in the atlas file, see the `Flatten paths` setting.

![](/img/spine-user-guide/texture-packer/folder-checkboxes.png)

# JSON Configuration

<callout>When [packing during data export](#Packing-during-data-export) and `Attachments` is chosen, the `pack.json` files are not used.</callout>

Each folder may contain a `pack.json` file to specify settings for that folder. Each subfolder inherits all the settings from its parent folder. Any settings set in the subfolder override those set in the parent folder.

A `pack.json` file can be created using Spine by clicking on the `Save` button at the bottom of the `Texture Packer Settings` dialog.

![](/img/spine-user-guide/command-line-interface/save-packer-settings.png)

Below is a JSON example with every available setting. Double quotes are optional in most cases.
```
{
stripWhitespaceX: true,
stripWhitespaceY: true,
rotation: true,
alias: true,
ignoreBlankImages: false,
alphaThreshold: 3,
minWidth: 16,
minHeight: 16,
maxWidth: 2048,
maxHeight: 2048,
pot: false,
multipleOfFour: false,
square: false,
outputFormat: png,
jpegQuality: 0.9,
premultiplyAlpha: true,
bleed: false,
bleedIterations: 2,
scale: [ 1 ],
scaleSuffix: [  ],
scaleResampling: [ bicubic ],
paddingX: 2,
paddingY: 2,
edgePadding: true,
duplicatePadding: false,
filterMin: Linear,
filterMag: Linear,
wrapX: ClampToEdge,
wrapY: ClampToEdge,
format: RGBA8888,
atlasExtension: .atlas,
combineSubdirectories: false,
flattenPaths: false,
useIndexes: false,
debug: false,
fast: false,
limitMemory: true,
currentProject: true,
packing: rectangles,
silent: false,
ignore: false
}
```

Not all settings need to be specified, any or all may be omitted. For example, to turn off padding and combining subfolders, this JSON can be used:
```
{
paddingX: 0,
paddingY: 0,
combineSubdirectories: false
}
```

To ignore all images in a folder and all subfolders:
```
{
ignore: true
}
```

## Texture atlas name

The texture atlas name is used to name the atlas and PNG files. For example, if the texture atlas name is `skeleton` then the atlas files would be named `skeleton.atlas`, `skeleton.png`, `skeleton2.png`, etc.

# Ninepatches

Ninepatches are not generally useful for Spine skeletons, but can be useful for other purposes.

If an image file name ends with ".9" just before the file extension, it is considered a ninepatch. Ninepatch images can be created manually or by using [this tool](http://developer.android.com/tools/help/draw9patch.html). The image must have a 1px transparent border. The upper and left edge may optionally have one contiguous line of black pixels which denote the split information, ie what part of the ninepatch will stretch. The bottom and right edge may optionally have one contiguous line of black pixels which denote the padding information, meaning how content on top of the ninepatch should be inset. When this image is packed, the 1px border is removed and the split and padding information stored in the atlas data file.

# Image indexes

Image indexes are not generally useful for Spine skeletons, but can be useful for other purposes.

If an image file name ends with underscore and then a number (eg `animation_23.png`), the number is considered the "index" and is stored for the region in the atlas data file. The image name is stored without the underscore and index. This allows a list of images with the same name to be retrieved, ordered by index, to make it easy to pack frame-by-frame animations without losing the order of the frames.

# Texture Unpacker

Spine provides a texture unpacking utility which takes a texture atlas and writes out individual images from it. Any rotation in the atlas is undone and any stripped whitespace is restored in the individual images.

![](/img/spine-user-guide/texture-packer/unpacker.png)

<callout>Texture unpacking can also be done using the [command line interface](spine-command-line-interface#Unpack).</callout>

Enter the path to the `Atlas` file and the `Output folder`, which is the path to the folder where you want the unpacked images to be stored.
Check `Unpremultiply alpha` if the atlas was packed with [premultiplied alpha](/spine-texture-packer#Premultiply-alpha). If the atlas file has "[pma:true](/spine-atlas-format#Page-sections)", that will be used instead of this checkbox.

[Next: Import](/spine-import)
[Previous: Export](/spine-export)
[Spine User Guide: Table of Contents]
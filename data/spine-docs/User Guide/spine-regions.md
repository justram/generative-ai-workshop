http://esotericsoftware.com/spine-regions

[Regions attachments - Spine User Guide]
[[]]

# Region attachments

A region [attachment](/spine-attachments) is a rectangular image. It gets the name "region" because at runtime (in your application) it is typically drawn using a region from a texture atlas.

![](/img/spine-user-guide/regions/region.png)

The region attachment's transform cannot be keyed in animations. Instead, the region attachment's bone can be [keyed](/spine-keys#Bone-transforms).

# Setup

A region attachment is created from an image under the [images node](/spine-images) in the tree, by [importing a PSD](/spine-import-psd), or by importing data from an image editor [script](/spine-images#Scripts).

# Properties

![](/img/spine-user-guide/regions/properties.png)

See the [common attachment properties](/spine-attachments#Common-properties) for the `Select`, `Export`, `Name`, `Color`, and `Set Parent` properties.

## Image path

When the image path is blank, the region attachment's name is used to find the image. When the image path is set, it is used instead of the region attachment's name. See [image file lookup](/spine-images#Image-file-lookup) for more information.

## Mesh

The `Mesh` checkbox changes the region attachment into a mesh attachment. See [meshes](/spine-meshes) for more information. 

## Sequence

The `Sequence` checkbox allows a sequence of images that have the same height and width and share the same image path in a numeric sequence to be used from the same attachment. The image path should be the full path without including the numbers. The sequence field allows to specify the range of image numbers to include.
`Frame` sets the current frame to display of the sequence.
A sequence can be [keyed](/spine-keys#Sequence-keys).

# Translation

The region attachment's translation is the location of the center of the image. If it is important for an image to align with world coordinates (ie screen pixels) and the image has odd dimensions, then it needs to be offset by `0.5`.

# Video

[youtube:76Var_oS8EM&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b]

[Next: Mesh attachments](/spine-meshes)
[Previous: Attachments](/spine-attachments)
[Spine User Guide: Table of Contents]
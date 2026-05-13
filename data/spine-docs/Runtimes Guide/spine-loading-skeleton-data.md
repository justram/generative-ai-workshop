http://esotericsoftware.com/spine-loading-skeleton-data

[Loading Skeleton Data - Spine Runtimes Guide]
[[]]

# Loading Skeleton Data

The first step to getting your Spine animations in your application is to load a texture atlas and skeleton data that have been [exported](/spine-export) from Spine.

# Texture atlas

Spine can [pack](/spine-texture-packer) a texture atlas, which makes rendering skeletons more efficient. Other tools can also be used to pack a texture atlas in the Spine atlas format, such as [Texture Packer Pro](https://www.codeandweb.com/texturepacker) using the "libgdx" atlas format. The Spine Runtimes load an atlas using:

```
TextureLoader textureLoader = ...
Atlas atlas = new Atlas("myAtlas.atlas", textureLoader);
```

Creating an atlas parses the atlas text file which contains information about where the regions are in the atlas page images. It also loads the image files for each atlas page.

# TextureLoader

Loading images is game toolkit specific, so the TextureLoader is what creates and disposes of images. Runtimes for a specific game toolkit come with a TextureLoader for that game toolkit. When using a generic runtime, you will need to write your own TextureLoader. It has two methods:

```
void load (AtlasPage page, String path)
void unload (Object rendererObject)
```

The `load` method loads an image using the path and sets the `rendererObject` field on the [AtlasPage](/spine-api-reference#AtlasPage). The `unload` method disposes of the previously loaded image. For example, here Texture is a game toolkit type:

```
void load (AtlasPage page, String path) {
	Texture texture = GameToolkit.loadTexture(path);
	page.rendererObject = texture;
}

void unload (Object rendererObject) {
	Texture texture = (Texture)rendererObject;
	texture.dispose();
}
```

The `rendererObject` on the AtlasPage is used by the [rendering code](/spine-runtime-skeletons#Generic-rendering).

# JSON and binary data

Loading JSON or binary skeleton data is done using [SkeletonJson](/spine-api-reference#SkeletonJson) or [SkeletonBinary](/spine-api-reference#SkeletonBindy). JSON is human readable but has a larger file size and is slower to parse. Binary is very small and fast, but is not human readable. Both SkeletonJson and SkeletonBinary have a `readSkeletonData` method which returns a [SkeletonData](/spine-api-reference#SkeletonData).

Creating a SkeletonJson or SkeletonBinary instance requires specifying an [AttachmentLoader](/spine-api-reference#AttachmentLoader), which has methods that return new attachment instances. The AttachmentLoader provides a way to customize attachments as they are loaded, such as setting the attachment's atlas region for later rendering. This is so common that the Spine Runtimes comes with [AtlasAttachmentLoader](/spine-api-reference#AtlasAttachmentLoader) which does exactly that:

```
AtlasAttachmentLoader attachmentLoader = new AtlasAttachmentLoader(atlas);
SkeletonJson json = new SkeletonJson(attachmentLoader);
SkeletonData skeletonData = json.readSkeletonData("mySkeleton.json");
```

The AtlasAttachmentLoader uses the attachment's `path` string to find a region in the texture atlas, then sets the attachment's `rendererObject` field to that region for later use by the [rendering code](/spine-runtime-skeletons#Generic-rendering).

# AttachmentLoader

Rather than use AtlasAttachmentLoader, advanced users may want to specify their own AttachmentLoader which has a method for each attachment type:

```
RegionAttachment newRegionAttachment (Skin skin, String name, String path)
MeshAttachment newMeshAttachment (Skin skin, String name, String path)
BoundingBoxAttachment newBoundingBoxAttachment (Skin skin, String name, String path)
PathAttachment newPathAttachment (Skin skin, String name, String path)
```

At a minimum, a new attachment of the appropriate type (or a subclass) should be created and returned, which will then be further configured by data from the JSON or binary file. If a method returns null, the attachment will be ignored as if it did not exist in the data at all.

For region and mesh attachments, the `rendererObject` field may be set to any object that the rendering code needs, though this is optional. For example, you may be using the skeleton data for purposes other than rendering and don't need to load any images. Or maybe you have thousands of attachments and it would not be feasible to load all the images when the skeleton data is loaded. In this case you could defer loading images until later, once you know which attachments will actually be in use.

At some point before rendering occurs, the `rendererObject` and a few properties about the atlas region must be set, such as the UVs, the whitespace stripped region size, the original image size, and if the region was rotated 90 degrees by the texture packer. Refer to the AtlasAttachmentLoader source for the runtime of your choice for as example of setting these properties.

# Scaling

When the skeleton data is loaded, the SkeletonJson or SkeletonBinary class can scale the bone positions, image sizes, and translations:

```
SkeletonJson json = new SkeletonJson(attachmentLoader);
json.scale = 2;
SkeletonData skeletonData = json.readSkeletonData("mySkeleton.json");
```

This causes a skeleton to be drawn at a different size, twice as large in this example. Scaling can be useful when using different sized images than were used when designing the skeleton in Spine. For example, if using images that are half the size than were used in Spine, a scale of 0.5 can be used. Some games include different sized texture atlases and choose which to use based on the player's screen resolution.

Using a loader scale changes the units used. For example, if a bone has a local position of 50,100 then with a scale of 2 it will be changed at load time to 100,200. This can be useful when not using a pixel unit scale at runtime. For example, Box2D prefers meters so a scale of 0.01 could be used to convert pixels to meters.

A skeleton can also be scaled without affecting the units by scaling the root bone:

```
SkeletonJson json = new SkeletonJson(attachmentLoader);
SkeletonData skeletonData = json.readSkeletonData("mySkeleton.json");
BoneData root = skeletonData.findBone("root");
root.scaleX = 2;
root.scaleY = 2;
```

In this case, if a bone has a local position of 50,100 then it will remain at that position. However, when the bone's world transform is computed, its position will be scaled. This may not work as desired if your skeleton has bones that have disabled inheriting scale.

[Next: Applying Animations](/spine-applying-animations)
[Previous: Runtime Architecture](/spine-runtime-architecture)
[Spine Runtimes Guide: Table of Contents]
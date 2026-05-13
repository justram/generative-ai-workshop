http://esotericsoftware.com/spine-runtime-skins

[Runtime Skins - Spine Runtimes Guide]
[[]]

# Runtime Skins

Skins are used to control what attachments a skeleton uses at runtime. A [Skin](/spine-api-reference#Skin) is a map where the key is a slot and a name, while the value is an attachment. The name is the skin placeholder name defined in the Spine editor and is not necessarily the name of the attachment. This allows code and animations to set attachments by skin placeholder name, without having to reference a specific attachment.

For example, a skin might have a key `slot=head,name=head` and a value for that key `attachment=fish-head`. Another skin might have the same key `slot=head,name=head` and a value `attachment=donkey-head`. The skin decouples code and animations from which attachments are actually used. Code and animations change the attachment using the name `head`, but which attachment is shown for the head depends on the skeleton's current skin.

All attachments defined in the skeleton data are placed in a skin. Attachments that were not in a skin in the Spine editor will appear at runtime in a skin named `default`, where the name in the skin is the same as the attachment's name. When Skeleton `getAttachment` needs to find an attachment by name, it first looks in the skeleton's current skin. If the attachment is not found, then it looks in the SkeletonData's default skin.

# Customization

Skeletons are not limited by the skins that are defined it the Spine editor. A new, empty skin can be created at runtime and populated with attachments. For example, consider a skeleton that can have a dog head or a snake head, and can have feathered wings or burning wings. Creating a skin for every combination of head and wings would be tedious, especially as more are added. Instead, a skin can be created programmatically with the desired head, wings, and other attachments.

# Grouping attachments

While the primary purpose for skins is decoupling, they are also useful to simply group attachments. Most commonly a skin is used to swap the entire look of the skeleton.

Skins can also be used to group a subset of attachments. For example, sometimes an "item" to be equipped by a character is actually made up of multiple attachments. A shirt might be made up of a torso attachment plus two more attachments for each sleeve. In this case a skin can be created containing the 3 shirt attachments.

At runtime a skeleton can only have one skin (plus the "default" skin in SkeletonData as a fallback). A skin can be created programmatically, then populated with the attachments from other skins. In this way, multiple "item" skins can be combined to outfit the skeletons.
```
Skin newSkin = new Skin("new-skin"); // 1. Create a new empty skin
newSkin.addSkin(skeletonData.findSkin("shirt/pink"); // 2. Add items
newSkin.addSkin(skeletonData.findSkin("pants/green");
newSkin.addSkin(skeletonData.findSkin("shoes/sneakers");
```
In the Spine editor, you can use the [Skins view](/spine-skins-view) to preview multiple skins at once.

# Skin changes

When a new skin is set and the skeleton does not already have a skin, any attachments in the skin that are visible in the setup pose are attached. 

When a new skin is set and the skeleton already has a skin, then attachments from the new skin are attached if the slot had the attachment from the old skin attached. Otherwise, no attachments are changed.

To ensure all the attachments reflect the active skin setup, all the systems that affect attachments need to be told to set the slots again.
```
skeleton.setSkin(newSkin); // 1. Set the active skin
skeleton.setSlotsToSetupPose(); // 2. Use setup pose to set base attachments.
animationState.apply(skeleton); // 3. Use AnimationState to set attachments active in the current movement.
// 4. Set attachments that were manually changed.
```

The call to `animationState.apply` may be omitted if the skin is set before animationState.apply is going to be called in that frame.

To get any other behavior, you will need to set the desired attachments after changing the skin.

# Creating attachments

Similar to creating skins at runtime, attachments can also be created programmatically. This can be useful when there are many attachments that would be tedious to create manually in Spine.

In Spine, attachments are positioned relative to their parent bone. When creating an attachment programmatically, some convention is needed to know where to place the attachment. The main problem is that when images are a different sizes, they will need to be positioned differently.

To solve this, you can outfit the skeleton with template images that have enough whitespace to accommodate art for all your different attachments. Now any number of attachment images can be created from the template images, but don't need to be added to the skeleton in Spine. At runtime, the attachments for the template images can be copied, then the texture regions changed. Since every image is the same size as the corresponding template image, they attach to the bone in the same position.

It is helpful for creating the art to have the template images mark the bone locations. Also, the extra whitespace in the attachment images can be stripped by the texture packer or a similar process.

[Next: API Reference](/spine-api-reference)
[Previous: Runtime Skeletons](/spine-runtime-skeletons)
[Spine Runtimes Guide: Table of Contents]
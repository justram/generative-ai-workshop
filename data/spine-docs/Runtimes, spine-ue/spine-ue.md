http://esotericsoftware.com/spine-ue

[spine-ue Runtime Documentation]
[[Integration guide for the spine-ue runtime.]]

# spine-ue Runtime Documentation

> **Licensing**
>
> Please see the [Spine Runtimes License](/spine-runtimes-license) before integrating the Spine Runtimes into your applications.

# Getting Started

## Installation
To use the spine-ue runtime in your Unreal Engine project:

1. Download and install [Unreal Engine](https://www.unrealengine.com/). *Currently compatible with UE 4.27+. **Please see the [upgrading to Unreal Engine 5.3+](#Updating-to-Unreal-Engine-5.3-) section!**
2. Download and install [Visual Studio Community](https://www.visualstudio.com/downloads/) or the latest [Xcode](https://developer.apple.com/xcode/) depending on your operating system. If in doubt about the Visual Studio version, you may want to choose according to the list [here](https://docs.unrealengine.com/en-US/ProductionPipelines/DevelopmentSetup/VisualStudioSetup/index.html). When installing and setting up Visual Studio, please follow the guide [here](https://docs.unrealengine.com/en-US/ProductionPipelines/DevelopmentSetup/VisualStudioSetup/index.html), section *Options for a New Visual Studio Installation*.
2. Create a new empty C++ code project in the Unreal Engine Editor. You can use Blueprint in your C++ project, but a Blueprints only project will not work because the Spine plugin is written in C++.
3. Clone the [spine-runtimes Git repository](https://github.com/esotericsoftware/spine-runtimes). If you don't want to use Git, download the [latest version as a ZIP](/git/spine-runtimes/archive) and unpack it.
4. In your project folder, create a subfolder called `Plugins`.
5. Copy the contents of `spine-runtimes/spine-ue/Plugins/` to your project's `Plugins/` folder.
6. Copy the folder `spine-runtimes/spine-cpp/spine-cpp` to your project's `Plugins/SpinePlugin/Source/SpinePlugin/Public/` folder.
6. Add `SpinePlugin` to `PublicDependencyModuleNames` in your project's `Build.cs` file.

View the [samples Build.cs](/git/spine-runtimes/blob/spine-ue/Source/SpineUE/SpineUE.Build.cs#L9) for a full example.

You can inspect the C++ code of both your game and the spine-ue runtime by opening the project in the Unreal Engine Editor and selecting `File -> Open Visual Studio` or `File -> Open Xcode`.

## Samples

The `spine-runtimes/spine-ue` directory is a project ready to be opened in the Unreal Engine Editor.

To explore the spine-ue runtime samples:
1. Download and install [Unreal Engine](https://www.unrealengine.com/). *Currently compatible with UE 5.5+
2. Download and install [Visual Studio 2022 Community](https://www.visualstudio.com/downloads/) or the latest [Xcode](https://developer.apple.com/xcode/) depending on your operating system. If in doubt about the Visual Studio version, you may want to choose according to the list [here](https://docs.unrealengine.com/en-US/ProductionPipelines/DevelopmentSetup/VisualStudioSetup/index.html). When installing and setting up Visual Studio, please follow the guide [here](https://docs.unrealengine.com/en-US/ProductionPipelines/DevelopmentSetup/VisualStudioSetup/index.html), section *Options for a New Visual Studio Installation*.
3. Clone the [spine-runtimes Git repository](https://github.com/esotericsoftware/spine-runtimes). If you don't want to use Git, download the [latest version as a ZIP](/git/spine-runtimes/archive) and unpack it.
4. Copy the folder `spine-runtimes/spine-cpp/spine-cpp` to the `spine-runtimes/spine-ue/Plugins/SpinePlugin/Source/SpinePlugin/Public/` folder.
5. Open the project `spine-runtimes/spine-ue/SpineUE.uproject` in the Unreal Engine Editor. As the project is not yet listed in the Unreal Project Brower under *Recent Projects*, choose *More* and then *Browse* and point it to the `SpineUE.uproject` file.
6. Checkout the different example levels in the `Content/GettingStarted` folder in the Content Browser. Each level has text instructions on how to run it and a description of what you see.

	> **Note:** In order for the editor to render your skeletons, please turn on realtime mode in your viewport
![](/img/spine-runtimes-guide/spine-ue/realtimemode.png)

You can inspect and modify the C++ code of both the samples and the spine-ue runtime by opening the project in the Unreal Engine Editor and selecting `File -> Open Visual Studio` or `File -> Open  Xcode`.

## Updating the spine-ue Runtime
Before updating your project' spine-ue runtime, please consult our [guide on Spine editor and runtime version management](/spine-runtime-architecture#Versioning).

Once you are sure you want to update to the latest spine-ue runtime:

1. Get the latest spine-ue runtime by pulling the latest changes from the [spine-runtimes Git repository](https://github.com/esotericsoftware/spine-runtimes) via Git, or download the [latest version as a ZIP](/git/spine-runtimes/archive) and unpack it.
2. Close the Unreal Engine Editor and Visual Studio/Xcode.
3. Remove the folder `Plugins/SpinePlugin` from your Unreal Engine project.
4. Copy the contents of `spine-runtimes/spine-ue/Plugins/` to your project's `Plugins/` folder.
5. Copy the folder `spine-runtimes/spine-cpp/spine-cpp` to your project's `Plugins/SpinePlugin/Source/SpinePlugin/Public/` folder.
6. Open the project in the Unreal Engine Editor, then select `File -> Generate Visual Studio project files` on Windows or `File -> Generate Xcode project files` on macOS.
7. Recompile your project's source code as well as the plugin's source code.

> **Note:** The spine-ue runtime is based on the generic [spine-cpp](/spine-cpp) runtime. Make sure to watch changes to both the spine-ue and spine-cpp runtime on [GitHub](https://github.com/esotericsoftware/spine-runtimes). It is a typical update mistake to forget to also update (copy) the `spine-cpp` part of the plugin as described in `(5.)` above.

## Updating to Unreal Engine 5.3+
Starting with Unreal Engine 5.3, Epic has introduced a breaking change in the way they handle `UAssets`. Imported `.skel`, `.json`, and`.atlas` files can no longer share a common prefix. E.g. `skeleton.skel` and `skeleton.atlas` will not work. However, `skeleton-data.skel` and `skeleton.atlas` will work.

For projects created with Unreal Engine versions before 5.3, it is not possible to automatically upgrade the imported assets. If you upgrade such a project to Unreal Engine 5.3+, the content browser will no longer show the imported skeleton data and atlas resources due to the regression introduced by Epic. The only way to upgrade a project to Unreal Engine 5.3+ is to manually re-name, re-import and re-wire all skeleton data and .atlas files.

We have filed a bug report with Epic right after the release of Unreal Engine 5.3 but have not heard back from them since. We therefore assume that Epic will not fix this regression, and that the above work around and limitations will stay in place.

# Using spine-ue
## Overview
The spine-ue runtime is an Unreal Engine plugin supporting playback and manipulation of animations created with Spine. The [spine-ue](/git/spine-runtimes/tree/spine-ue) runtime is written in C++ and based on the generic [spine-cpp runtime](/spine-cpp). The spine-ue runtime wraps the spine-cpp structs and functions and exposes them in both code and as Unreal Engine Blueprints. Additionally, the spine-ue runtime imports files exported from the Spine Editor and stores them in custom Unreal Engine asset types.

Please consult the [Spine Runtimes Guide](/spine-runtimes-guide) 
for a detailed overview of the Spine Runtime architecture.

## Asset Management
### Exporting for Unreal Engine
![](/img/spine-runtimes-guide/spine-ue/export.png)
Please follow the instructions in the Spine User Guide on how to 

1. [Export skeleton & animation data](/spine-export)
2. [Export texture atlases containing the images of your skeleton](/spine-texture-packer)

An export of the skeleton data and texture atlas of your skeleton will yield the following files:

![](/img/spine-runtimes-guide/spine-ue/exported-files.png)

1. `skeleton-name.json` or `skeleton-name.skel`, containing your skeleton and animation data.
2. `skeleton-name.atlas`, containing information about the texture atlas.
3. One or more `.png` files, each representing on page of your texture atlas containing the packed images your skeleton uses.

You need to ensure that your **asset files do not share a common prefix**. Example:
```
skeleton.skel
skeleton.atlas
```

This will not work, as the two files share a common prefix `skeleton`. Instead, rename the files to, e.g.

```
skeleton-data.skel
skeleton.atlas
```

The spine-ue runtime can import these files into special Unreal Engine asset types.

> **Note:** The spine-ue runtime currently does not support atlases exported using pre-multiplied alpha.

### Importing into Unreal Engine
![](/img/spine-runtimes-guide/spine-ue/import-general.png)
1. Open your Unreal Engine project in the Unreal Engine Editor
2. Click `Import` in the content browser
3. Select the `.json` or `.skel` file and the `.atlas` file you exported from the Spine Editor

The asset importer will create Unreal Engine assets for the skeleton data and texture atlas automatically. 

The import creates 

1. A Spine skeleton data asset for skeleton data files (`.json`, `.skel`)
2. A Spine texture atlas asset for the texture atlas file (`.atlas`)
3. A texture asset for each texture atlas page (`.png`), which will be put in a content folder called `Textures` next to the texture atlas asset

![](/img/spine-runtimes-guide/spine-ue/imported-files.png)

### Updating Spine Assets
During development, you may frequently update your Spine skeleton data and texture atlas files. You can simply overwrite these source files (`.json`, `.skel`, `.atlas`, `.png`) by re-exporting from the Spine Editor.

The Unreal Engine Editor will detect changes to these source files and prompt you to re-import the assets from these source files. After re-import, all references to previously imported Spine assets will be intact and use the latest source data.

> **Note:** The Unreal Engine Editor sometimes fails to recognize source file changes. In this case, locate your Spine skeleton data or texture atlas asset in the content browser, double click it, then select `Asset -> Reimport` from the menu of the newly opened window.


### Skeleton Data Asset
The skeleton data asset stores information about the bone hierarchy, slots, draw order, animations and other data that constitutes your skeleton. Other components provided by the spine-ue runtime reference and share this skeleton data asset to animate and display a skeleton as part of an Unreal Engine actor instance.

![](/img/spine-runtimes-guide/spine-ue/skeletondataasset.png)

The skeleton data asset allows you to specify [animation mix times](/spine-applying-animations#Mix-times). Double click the asset in the content browser, then enter the default mix time or define mix times for two specific animations by clicking the `+` sign on the `Mix Data` property of the asset.

Components using the skeleton data asset, like the skeleton animation component, use these mix times when playing back animations.

The detail panel for a skeleton data asset also shows all bones, slots, animations, skins, and events contained in the asset.

![](/img/blog/Unreal-Engine-4-quality-of-life-improvements/details-view.png)

### Texture Atlas Asset
The texture atlas asset contains information about the images used by your skeleton, namely on what texture atlas page an image is stored, as well as its UV texture coordinates on the texture atlas page.

![](/img/spine-runtimes-guide/spine-ue/textureatlasasset.png)

You can view the texture of the texture atlas pages when double clicking the asset in the content browser.

> **Note:** You can modify the textures referenced by the texture atlas asset. In this case, make sure the UV texture coordinates stay valid.

## Components
The spine-ue runtime provides you with a set of components that allow to display, animate and modify skeletons exported from Spine. These components reference skeleton data and texture atlas assets you import as described above.

### Adding a Skeleton to a Level
To quickly display a Spine skeleton in your Unreal Engine project:

1. Import the skeleton data and texture atlas as described above.
2. Create an empty actor in your level.
3. Add a `Spine Skeleton Animation` component to your actor in its detail panel and set the skeleton data and texture atlas properties to your assets.
![](/img/spine-runtimes-guide/spine-ue/addanimationcomponent.png)
5. Add a `Spine Skeleton Renderer Component` to your actor
![](/img/spine-runtimes-guide/spine-ue/addrenderercomponent.png)

You can now either use blueprints or the components' C++ API to animate the skeleton, react to events triggered by animations, etc. Refer to the component documentation below for more details.

> **Note:** In order for the editor to render your skeleton, please turn on realtime mode in your viewport
![](/img/spine-runtimes-guide/spine-ue/realtimemode.png)

### Skeleton Component
The skeleton component stores references to a skeleton data and texture atlas asset and will [update the world transforms](/spine-runtime-skeletons#updateWorldTransform) of each bone in every `Tick()`. It serves as the base component for the skeleton animation component or your own custom component.

> **Note:** In general, you want to use the skeleton animation component described below. It allows you to apply animations to your skeleton. Use the plain skeleton component as the base for your own custom skeleton components.

#### Setting Skeleton Data & Texture Atlas
A skeleton component requires references to a skeleton data asset from which it can get the information about a skeleton's bone hierarchy, slots etc., as well as a reference to a texture atlas asset, from which it gets information about the images used by the skeleton.

To set the skeleton data and texture atlas

1. Select the component in an actor's detail panel
2. Set the `Atlas` and `Skeleton Data` properties

> **Note:** Both the skeleton data and the atlas asset references have to be set for the component to function properly. If one or both are undefined, the component will gracefully ignore all interaction via C++ and blueprints.

#### Life-cycle
The skeleton component implements the `UActorComponent::Tick()` method in which it updates the world transforms of all bones of the skeleton.

The component exposes the multicast delegates `BeforeUpdateWorldTransform` and `AfterUpdateWorldTransform` as properties that allow you to intercept this life-cycle before and after the world transforms of all bones are calculated. You can bind to these delegates to modify bone positions and other aspects of the skeleton without having to care for the update order of your actors and components.

##### **C++**
In the class that should intercept the life-cycle, add a `UFUNCTION` declaration to the class header file:

```
UFUNCTION()
void BeforeUpdateWorldTransform(USpineSkeletonComponent* skeleton);
```

> **Note:** It is important to mark the method as a `UFUNCTION`, otherwise it can not be bound to the delegate.

Next, add a definition of this function to your class' `.cpp` file:

```
void MyClass::BeforeUpdateWorldTransform(USpineSkeletonComponent* skeleton) {
   ... modify the skeleton here ...
}
```

Finally, bind the method to the delegate, e.g. in `BeginPlay()` of your actor or component. Assuming you have a reference to the `AActor` containing the skeleton component:

```
AActor* actor = ...
USpineSkeletonComponent* skeletonComponent = static_cast<USpineSkeletonComponent*>(Actor->GetComponentByClass(USpineSkeletonComponent::StaticClass()));
skeletonComponent->BeforeUpdateWorldTransform.AddDynamic(this, &USpineBoneDriverComponent::BeforeUpdateWorldTransform);
```

Binding to the `AfterUpdateWorldTransform` delegate works the same.

##### **Blueprint**
Assuming you have a blueprint for the actor containing the skeleton component

1. Open the blueprint in the blueprint editor
2. In the components window, select the skeleton component
![](/img/spine-runtimes-guide/spine-ue/selectskeletoncomponent.png)
3. In the details panel for the skeleton component, click on the `+` for the `Before Update World Transorm` or `After Update World Transform`
![](/img/spine-runtimes-guide/spine-ue/addbeforeupdateworldevent.png)
4. Connect other blueprint nodes to the exec pin of the event to implement your custom update logic
![](/img/spine-runtimes-guide/spine-ue/beforeupdatenode.png)

Binding to the `AfterUpdateWorldTransform` event works the same.

#### Setting Skins
A Spine skeleton may have multiple [skins](/spine-runtime-skins) that define which attachment go on which slot. The skeleton component provides a simple way to switch between skins.

##### **C++**
```
bool success = skeletonComponent->SetSkin(FString(TEXT("skinName"));
```

##### **Blueprint**
![](/img/spine-runtimes-guide/spine-ue/setskin.png)

#### Setting Attachments
To set an attachment, provide the slot and attachment name.

##### **C++**
```
bool success = skeletonComponent->SetAttachment(FString(TEXT("slotName")), FString(TEXT("attachmentName"));
```

##### **Blueprint**
![](/img/spine-runtimes-guide/spine-ue/setattachment.png)

#### Resetting to Setup Pose
For [procedural animation](/spine-runtime-skeletons#Procedural-animation) it is sometimes necessary to reset bones and/or slots to their setup pose.

##### **C++**
```
skeletonComponent->SetToSetupPose();
skeletonComponent->SetBonesToSetupPose();
skeletonComponent->SetSlotsToSetupPose();
```

##### **Blueprint**
![](/img/spine-runtimes-guide/spine-ue/setsetuppose.png)

#### Flipping a Skeleton
Flipping a skeleton vertically or horizontally allows you to reuse animations, e.g. a walk animation facing left can be played back to face right.

##### **C++**
```
bool isFlippedX = skeletonComponent->GetScaleX() < 1;
skeletonComponent->SetScaleX(-1);
bool isFlippedY = skeletonComponent->GetScaleY() < 1;
skeletonComponent->SetScaleY(-1);
```

##### **Blueprint**
![](/img/spine-runtimes-guide/spine-ue/flipUpdated.png)

#### Getting and Setting Bone Transforms
The skeleton component lets you set and get bone transforms so you can implement IK terrain following or let other actors and components such as particle systems follow the bones in your skeleton. All transforms are given in the world coordinate system to make interaction easier.

> **Note:** Should you require to modify the local transform of a bone, please use the spine-cpp runtime API in your C++ code.

> **Note:** Make sure you apply new bone positions as part of the update world transform life-cycle, otherwise your modifications may be overwritten by animations.

> **Note:** The Spine bone follower and Spine bone driver components are an easier way to interact with bones.

##### **C++**
```
FTransform boneWorldTransform = skeletonComponent->GetBoneWorldTransform(FString(TEXT("boneName"));
skeletonComponent->SetBoneWorldPosition(FString(TEXT("boneName"), FVector(x, y, z));
```

##### **Blueprint**
![](/img/spine-runtimes-guide/spine-ue/worldtransform.png)



### Skeleton Animation Component
The skeleton animation component is the heart of the spine-ue runtime. It allows you to add a Spine skeleton to an actor, animate it, react to animation events, and so on. 

> **Note:** The skeleton animation component is based on the skeleton component, and hence inherits all of skeleton components features described above!

#### Life-cycle
The skeleton animation component implements the `UActorComponent::Tick()` method in which it updates the underlying [AnimationState](/spine-applying-animations#AnimationState-API) based on the delta time, applies the `AnimationState` to the skeleton, and updates the world transforms of all bones of the skeleton.

As the skeleton animation component is based on the skeleton component, you can bind to the `BeforeUpdateWorldTransform` and `AfterUpdateWorldTransform` as described above.

The skeleton animation component exposes the [AnimationState](/spine-api-reference#AnimationState) API to both blueprints and C++. This section assumes a familiarity with concepts like tracks, track entries, mix times, or animation queuing as described in the section [Applying Animations](/spine-applying-animations) in the generic Spine Runtime Guide.

#### Time Scale
You can set the time scale of the skeleton animation component to slow down or speed up the playback of animations. The delta time used to advance animations is simply multiplied with the time scale, e.g. a time scale of 0.5 slows the animation down to half the normal speed, a time scale of 2 speeds it up to twice the normal speed.

##### **C++**
```
float timeScale = animationComponent->GetTimeScale();
animationComponent->SetTimeScale(0.5);
```

##### **Blueprint**
![](/img/spine-runtimes-guide/spine-ue/timescale.png)

#### Setting Animations
To set an animation, provide the track index, animation name and whether to loop the animation-

##### **C++**
```
USpineSkeletonAnimationComponent* animationComponent = ... fetch from actor ..
UTrackEntry* entry = animationComponent->SetAnimation(trackIndex, FString(TEXT("walk")), true);
```
##### **Blueprint**

![](/img/spine-runtimes-guide/spine-ue/setanimationnode.png)

##### Queueing Animations
To queue an animation, provide the track index, animation name, whether to loop the animation, and the delay after which this animation should start playing on the track in seconds.

##### **C++**
```
UTrackEntry* entry = animationComponent->AddAnimation(trackIndex, FString(TEXT("run")), true, 2);
```

##### **Blueprint**
![](/img/spine-runtimes-guide/spine-ue/addanimationnode.png)

#### Setting and Queueing Empty Animations, Clearing Tracks
The skeleton animation component also provides methods and blueprint nodes to set an empty animation, queue an empty animation, or clear one or all tracks. All of these work analogous to the methods and nodes shown above.

##### **C++**
```
UTrackEntry* entry = animationComponent->SetEmptyAnimation(trackIndex, mixDuration);
entry = animationComponent->AddEmptyAnimation(trackIndex, mixDuration, delay);
animationComponent->ClearTrack(trackIndex);
animationComponent->ClearTracks();
```

##### **Blueprint**
![](/img/spine-runtimes-guide/spine-ue/cleartrack.png)

#### Track Entries
You'll receive a [TrackEntry](/spine-api-reference#TrackEntry) from all the methods/nodes that allows you to further customize the playback of this specific animation, as well as bind to delegates of track entry specific events. See the section *Processing AnimationState Events* below.

> **Note:** The returned track entries will only be valid until the corresponding animation is removed from the underlying animation state. The Unreal Engine garbage collector will automatically free them. After a dipose event is received for a track entry, it should no longer be stored or accessed. The C++ wrapper around the underlying `spTrackEntry` guards against invalid access.

##### **C++**
```
UTrackEntry* entry = ...
entry->SetEventThreshold(2);
float trackEnd = entry->GetTrackEnd();
```

##### **Blueprint**
![](/img/spine-runtimes-guide/spine-ue/trackentry.png)

#### Processing AnimationState Events
While animations are played back by the underlying `AnimationState`, various events will be emitted that notify listeners that

1. An animation **started**.
2. An animation was **interrupted**, e.g. by clearing a track or setting a new animation.
4. An animation was **completed**, which may occur multiple times if looped.
3. An animation has **ended**
5. An animation and its corresponding `TrackEntry` have been **disposed**
6. A user defined **event** was fired

The skeleton animation component provides delegates to which C++ code or blueprints can bind in order to react to these events for all queued animations on all tracks. Listeners can also be bound to the corresponding delegates of a specific `TrackEntry` only.

##### **C++**
In the class that should react to `AnimationState` events, add `UFUNCTION` declarations for the events you want to listen to the class header file:

```
UFUNCTION()
void AnimationComplete(UTrackEntry* entry);

UFUNCTION()
void UserDefinedEvent(UTrackEntry* entry, FSpineEvent evt);
```

In the corresponding `.cpp` implementation file, add the definitions:

```
void MyClass::AnimationComplete(UTrackEntry* entry) {
   ... react to complete event here ...
}

void MyClass::UserDefinedEvent(UTrackEntry* entry, FSpineEvent evt) {
   ... react to user defined event here ...
}
```

Finally, bind to the corresponding delegates of a `USkeletonAnimationComponent` or `UTrackEntry`:

```
USpineAnimationComponent* animationComponent = ...
animationComponent->AnimationComplete.AddDynamic(this, &MyClass::AnimationComplete);

UTrackEntry* entry = ...
animationComponet->AnimationEvent.AddDynamic(this, &MyClass::UserDefinedEvent);
```

##### **Blueprint**
To bind to `AnimationState` events on the skeleton animation component:

![](/img/spine-runtimes-guide/spine-ue/listenercomponent.png)

1. Open the blueprint
2. Select the skeleton animation component on your actor
3. In the detail panel, click on the `+` button next to the event you want to react to

To bind to the delegates of a specific `TrackEntry`:

![](/img/spine-runtimes-guide/spine-ue/listenertrackentry.png)

1. Drag the return value pin of an `Set Animation`, `Add Animation`, `Set Empty Animation` or `Add Empty Animation` node to an empty space in the blueprint.
2. Select `Assign Animation XXX` from the `Components -> Spine -> TrackEntry` category in the popup
3. Make sure the `Bind Event to` node is wired in such a way that it is executed.

#### Viewport preview
You can preview animations and skins in the UE editor viewports using the `Preview Animation` and `Preview Skin` properties of the skeleton animation component. Simply enter the name of the animation and skin.

![](/img/blog/Unreal-Engine-4-quality-of-life-improvements/preview.gif)

The reset the animation or skin, set the respective property to an empty text.

### Skeleton Renderer Component
The skeleton renderer component is responsible for drawing the current state of a skeleton or skeleton animation component on the same actor. Rendering is performed via a procedural mesh. The component uses the texture atlas asset referenced by the skeleton (animation) component to find the textures needed to draw the attachments of the skeleton.

#### Materials
![](/img/spine-runtimes-guide/spine-ue/materials.png)

The skeleton renderer component has 4 material properties, one for each blend mode supported by Spine. By default, these 4 materials are set to unlit materials that are part of the spine-ue plugin (see the `Contents` folder of the plugin).

To modify the materials used by all skeleton renderer components, modify the default materials of the plugin.

To modify the materials used by a specific skeleton renderer component, simply create a new material and assign it to the material property of the skeleton renderer component.

In all cases, you must provide a parameterized material that allows the skeleton renderer component to set the texture source. By default, the renderer component assumes the texture parameter is called `"SpriteTexture"`. You can customize the parameter name on the skeleton renderer component.

#### Depth Offset
![](/img/spine-runtimes-guide/spine-ue/depthoffset.png)
Attachments are rendered back to front in the x/z plane by the skeleton renderer component. Each attachment is offset by a customizable depth offset value on the y-axis to avoid [z-fighting](https://en.wikipedia.org/wiki/Z-fighting). The depth offset is freely customizable in both C++ and blueprints.

### Skeleton Follower Component
This component references a bone of a skeleton (animation) component and sets its own transform to that of the bone on every `Tick`.

Use this to let objects like particle systems follow a specific bone on the skeleton.

### Skeleton Driver Component
This component references a bone of a skeleton (animation) component and sets the bones position to its own position on every `Tick`. The component will set the bone position before the skeleton (animation) component updates the world transforms.

Use this for use cases such as letting the user drag a bone of the skeleton around.

### Spine widget for UMG UI
Since Spine 3.8, the spine-ue runtime offers the Spine widget for integration of Spine skeletons with your [UMG UI](https://docs.unrealengine.com/en-us/Engine/UMG/UserGuide). The widget has the same interface as the Skeleton Animation Component, for both blueprints and C++ code. The widget also shares some interface with the Skeleton Renderer Component, namely allowing you to set the depth offset between attachments, and changing the materials used to render the skeleton. Please refer to the sections on these two components for the details.

To add a Spine skeleton to your UMG UI, start by creating a new [widget blueprint](https://docs.unrealengine.com/en-us/Engine/UMG/UserGuide/WidgetBlueprints). Open the blueprint, then add a Spine widget to it via the palette.

![](/img/spine-runtimes-guide/spine-ue/ui-palette.png)

Next, set the atlas and skeleton data asset on the Spine widget, and resize it in the designer viewport to fit your requirements.

![](/img/spine-runtimes-guide/spine-ue/spine-widget.png)

The skeleton will resize automatically, keeping its aspect ratio, filling as much space within the widget as possible. You can scale it further up or down by via the `Scale` property.

After switching from `Design` to `Graph` editing mode in the widget editor window, you can modify the blueprint of the widget. Here's an example blueprint:

![](/img/spine-runtimes-guide/spine-ue/spine-widget-blueprint.png)

We set the initial animation of the raptor widget when the `Construct` event is fired. We also need to wire up the `Tick` event with the widget's `Tick` function so it animates.

Finally, we need to open the level blueprint and add the UMG widget to the viewport:

![](/img/spine-runtimes-guide/spine-ue/widget-level-blueprint.png)

In the blueprint, we first create the widget, specified by its class name, and then add it to the viewport.

### Motion blur post processing
spine-ue's default materials use the [translucent blend mode](https://docs.unrealengine.com/4.26/en-US/RenderingAndGraphics/Materials/MaterialProperties/BlendModes/) supported by Unreal Engine. For this blend mode to work with motion blur post processing, enable the `OutputVelocity` option in the material details.
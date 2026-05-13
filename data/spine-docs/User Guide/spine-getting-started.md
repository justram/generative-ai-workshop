http://esotericsoftware.com/spine-getting-started

[Getting started - Spine User Guide]
[[Quickly get up and running with using Spine.]]

# Getting started

On this page we will briefly introduce you to all the bits and pieces needed to get you up and running with Spine.

Let's go!

## Trying and purchasing Spine

<callout>If you purchased Spine but lost your Spine license email, use the [Spine license recovery page](/spine-license-recovery) to retrieve it.</callout>

If you want to evaluate Spine before purchasing, visit the [Spine Trial download page](/spine-download), click the button for your operating system, and install the Spine Trial. The Spine Trial lets you try out all functionality the Spine editor offers, except for saving and exporting projects.

To purchase Spine, head over to the [Spine web store](/spine-purchase), select the Spine license you want to purchase, and complete the checkout process. Afterward you will receive an email with a link to your license page. Your license page contains download links, your activation code, and your invoices.

If you run into issues or have questions about purchasing Spine, you can [post on the Spine forum](/forum), look through the [FAQ](/support), or [contact us](/support#Contact-Us).

## Activation

The first time you run Spine you will be asked to enter your activation code.

![](/img/quickstart/activation.png)

Enter the activation code from your [license page](/spine-license-recovery) and press `Submit` to activate your Spine installation.

Spine needs an internet connection to activate and to download the chosen editor version (a [proxy server](/spine-proxy-server) can be specified). After that, Spine can run offline.

## Running Spine

When you run Spine, the launcher screen is shown.

![](/img/quickstart/launcher.png)

If you check `Start automatically`, you won't need to click `Start` each time you run Spine. In that case, to stop Spine from starting automatically, just click anywhere when the launcher window first appears.

Before clicking `Start`, you can choose the user interface language and the Spine editor version you want to run.

### Spine editor versions

<h4>Latest stable</h4>!!

<callout>When using Spine in production, we highly suggest explicitly setting the Spine editor version to match your Spine Runtimes version. This ensures you won't accidentally use a newer editor version that is incompatible with the Spine Runtimes version you are using.<br><br>See [versioning](/spine-versioning) for more information.</callout>

If you choose `Latest stable` in the version select box, it will run the newest stable, production ready release of the Spine editor. This is a good choice for new users.

<h4 style="clear:none">Latest beta</h4>!!

If you choose `Latest beta`, it will run the newest Spine editor beta. Beta versions let you try new features and are a great way to give us early feedback! However, exports may not yet be supported for all Spine Runtimes. You won't see the `Latest beta` option if there is currently no beta in progress.

<h4>Specific version</h4>!!

You can also choose a specific Spine editor version. All versions you have downloaded are shown, or you can click `Other...` and type the version number for [any version](/spine-changelog/archive) we've ever released.

Once you are happy with your version and language settings, click `Start` to run the Spine editor.

## Welcome to Spine

![](/img/quickstart/welcome.png)

The [welcome screen](/spine-welcome-screen) is your window into the Spine world! From here you can open one of the many example projects that come with Spine or create or open your own projects.

You can also read the latest Spine news and review the latest changes we have made to the Spine editor. This is a great way to stay on top of what is happening.

The `Tips` section displays handy [workflow tips](/spine-tips) that make your day-to-day work with Spine more efficient, while the items in the `Learn` section give you quick access to our [in-depth documentation](/spine-academy) and [forum](/forum), should you have any questions.

Go ahead, open one of the example projects!

## Getting to know the Spine editor

![](/img/quickstart/editor.png)

The Spine editor offers powerful tools and features to make editing your 2D animations as simple and efficient as possible. We have prepared lots of learning materials to get you up and running in no time.

[Spine Academy](/spine-academy) is your point of entry into Spine's documentation. The [Spine User Guide](/spine-user-guide) gives you a basic understanding of everything the Spine editor can do.

As you make your way through the Spine User Guide, it is helpful to explore Spine's example projects. You can open them from the welcome screen. We have in-depth explanations of how each example project is setup on our [example projects page](/spine-examples).

For your first Spine project you will need to prepare the images you want to animate using image editing software like Adobe Photoshop or Affinity Designer. We provide [scripts and plugins](/spine-images#Scripts) for various image editing software to make bringing your images into your Spine project a breeze.

Once you are comfortable working with Spine, check out our [Animating with Spine](/spine-videos#animatingWithSpine) video series to learn about animation theory and how to apply it in Spine to make amazing animation!

Eventually you'll want to display your animations in your games, apps, or on your websites. This is were Spine's powerful [export functionality](/spine-export) comes into play. Besides exporting standard image and video formats, Spine also exports to efficient binary and JSON formats that allow you to display your animations in games, apps, and websites using our Spine Runtimes.

## Getting to know the Spine Runtimes

![](/img/academy/runtime-documentation.jpg)

The [Spine Runtimes](/spine-runtime-documentation) are code libraries that you can use in your games, apps, or websites to load and render your animations. But we don't stop there &ndash; games and apps are dynamic and interactive and your animations should be too.

Our APIs provide direct access to your skeletons and animations, allowing them to interact with your users and game world. You can also combine animations, crossfade them, and more. Check out our [Spine demos](/spine-demos) to see some of these possibilities in action.

The Spine Runtimes integrate with many popular [game engines and frameworks](/spine-runtimes#runtimesOfficial), such as Unity, Unreal Engine, Cocos2d-x, PixiJS, and Game Maker. These engine and framework integrations sit on top of our programming language specific [generic runtimes](/spine-runtimes#runtimesGeneric), which can be used to integrate Spine into custom game engines or frameworks. The Spine community has also created many [third party runtimes](/spine-runtimes#runtimesThirdParty).

To get started using the Spine Runtimes, take a look at our [Spine Runtimes Guide](/spine-runtimes-guide). We also have documentation for specific game toolkits like [Unity](/spine-unity), [Unreal Engine](/spine-ue), and [others](/spine-runtime-documentation).

You can find the source code and example projects for all the official Spine Runtimes in the [Spine Runtimes GitHub repository](https://github.com/EsotericSoftware/spine-runtimes). There you can also file issues for any bugs you find or send pull requests if you want to contribute to the Spine Runtimes.

## Finding help

<img class="no-borders" src="/img/academy/forum.jpg">!!

If our documentation does not answer all your questions, we are happy to support you on the [Spine forum](/forum). Not only can you ask us and the community questions there, but you can also show off your work and geek out about Spine and animation with like-minded individuals!

For licensing and business related inquiries, please contact us via our [contact form](/support#Contact-Us).

## Keeping up-to-date

Spine will prompt when a new version is available, but make sure to keep your Spine editor version in sync with your Spine Runtimes version.

![](/img/spine-user-guide/getting-started/update.png)

To stay up-to-date with the latest news and developments surrounding Spine, keep an eye on the welcome screen news, make sure to read our [blog](/blog), and follow us on [Twitter](https://twitter.com/esotericsoftware).

Check out the [changelog](/spine-changelog) to see the latest feature additions and bug fixes we've made, and have look at our [roadmap](/spine-roadmap) to see what's coming next.

## Next steps

The Spine User Guide will teach you how skeletal animation in Spine works, how to set up and animate your skeletons, and will explain all the features that Spine has to offer. Continue on to the next page to begin learning.

Happy animating!

[Next: User interface](/spine-ui)
[Spine User Guide: Table of Contents]
http://esotericsoftware.com/spine-versioning

[Versioning - Spine User Guide]
[[]]

# Versioning

Keeping track of your Spine editor and Spine Runtimes versions is an important part to using Spine.

# Spine editor version numbers

Spine editor version numbers use the format `major.minor.patch`. For example, `3.8.75`.

When the major or minor version numbers change, it indicates a significant difference and caution should be used before updating to the newer version.

When only the patch version number changes, it means that we have fixed bugs or have done minor improvements and it is safe for you to update.

The [changelog archive](/spine-changelog/archive) provides a list of all Spine editor versions we have ever released.

# Spine Runtimes version numbers

The Spine Runtimes version numbers use the format `major.minor`. For example, `3.8`.

The source code for the Spine Runtimes is provided in the [Spine Runtimes GitHub repository](https://github.com/EsotericSoftware/spine-runtimes). Git branches are used for each version of the Spine Runtimes. Git commits to a branch are used instead of patch version numbers.

![](/img/spine-user-guide/versioning/branches.png)

Spine Runtimes which are published to package managment systems like NPM or Maven Central which have an additional, runtime specific patch version. E.g. the latest `spine-player` runtime version published to NPM may be 4.2.21, which means it is compatible with exports from Spine Editor version 4.2.x, including Spine Editor versions with a lower patch number than the runtime version, like 4.2.1.

For Spine Runtimes which are not published to package management systems, like spine-c, select the branch with the version number corresponding to the Spine Editor version you export from.

# Stable releases

A stable release is any that doesn't end with `-beta`. For example, `3.8.99` for the Spine editor and `3.8` for the Spine Runtimes.

We don't make risky changes to stable releases in order to reduce the chance that new problems are introduced. Updates to stable releases are mainly to fix bugs.

# Beta releases

A beta release is any that ends with `-beta`. For example, `4.0.73-beta` for the Spine editor and `4.0-beta` for the Spine Runtimes.

Beta versions let you use the latest new features, but the Spine editor may crash occasionally or have features that are not completely implemented. Also, exports from a beta version may not yet be supported by all Spine Runtimes.

Here are a few reasons you may want to use a beta release:
* You are exporting images or video, so lacking runtime support doesn't matter to you.
* You want to use the newest Spine features and don't mind waiting until the runtimes have been updated.
* You want to explore the newest Spine features. You can always go back to a stable or older Spine editor version, just **be careful not to save your projects with the newer version**.
* You know the runtime you are using has already been updated to work with the beta editor version. Some runtimes will be updated before others and we don't do a stable release until all runtimes are updated. Each runtime's README on GitHub specifies the most recent Spine version it works with.

Once out of beta, the beta Git branch for the Spine Runtimes is removed and replaced with a stable version number.

# Choosing a Spine editor version

When [Spine starts](/spine-getting-started#Running-Spine), the launcher window allows choosing which version of the Spine editor to use. You can also set the Spine editor version on the [settings dialog](/spine-settings).

![](/img/spine-user-guide/versioning/version-select.png)

If the launcher doesn't stop to let you choose a version, it's because you've previously checked `Start automatically`. In that case, to stop Spine from starting automatically, just click anywhere when the launcher window first appears.

## Latest stable

If you choose `Latest stable` in the version select box, it will run the newest stable, production ready release of the Spine editor.

## Latest beta

If you choose `Latest beta`, it will run the newest Spine editor beta. Beta versions let you try the latest new features, but exports may not yet be supported for all Spine Runtimes. You won't see the `Latest beta` option if there is currently no beta in progress.

## Specific version

You can also choose a specific Spine editor version. All versions you have downloaded are shown, or you can click `Other...` and type the version number for [any version](/spine-changelog/archive) we've ever released.

# Synchronizing versions

**The major and minor version for the Spine editor used to export JSON or binary data must always match the Spine Runtimes version.** If not, the Spine Runtimes will not be able to read the data. This dependency is very important.

Animators must make sure to use the right version of the Spine editor by choosing a [specific version](#Specific-version). Otherwise, it can be easy to accidentally update to a newer Spine editor version.

Developers must make sure to use the right version of the Spine Runtimes. It's not as easy to update to a newer Spine Runtimes version, as the new version needs to be downloaded, the old version replaced, and possibly code fixed up. Because of that, generally the developers dictate what version of the Spine editor should be used.

## Updating patch versions

It is always safe to update your Spine editor to a newer patch version, which means it has bug fixes. For example, if you are using `3.6.44`, you can update to the newer `3.6.53` without worrying that something breaks or that your exports will no longer work with the `3.6` Spine Runtimes.

It is always safe to update your Spine Runtimes to a newer Git commit on the same branch. For example, if you are using the `3.6` branch, you can update to the latest commit on that branch without worrying that something breaks. Exports from any `3.6.xx` Spine editor will continue to work.

## Updating major or minor versions

Animators and developers need to communicate when updating the major or minor versions so both the Spine editor and Spine Runtimes are updated at the same time.

After updating the Spine Runtimes to the branch for the new version, the Spine Runtimes will no longer be able to read any of the exports from the older Spine editor version. All of the Spine projects need to be exported again using the newer Spine editor version.

We suggest writing scripts using the [command line interface](/spine-command-line-interface) to automate exporting all your projects. This can be done as needed or as part of a build process.

# Project files

Spine project files are backward compatible, but not forward compatible. A newer Spine editor version can always open Spine project files saved from any older version. However, once a project is saved, it can no longer be opened by older Spine editor versions. Care must be taken not to accidentally save projects with a newer Spine editor version.

Spine shows a warning before saving a project with a newer Spine editor version.

![](/img/spine-user-guide/versioning/project-warning.png)

## Recovering work from a newer version

If work is done on a project and saved with a newer Spine editor version, it can no longer be opened by older versions. If the Spine Runtimes cannot be updated to match the Spine editor version, then the work may be lost. The project file for the old version may be found in the [backups](/spine-settings#Backups).

To attempt to recover the work, you can use [JSON export](/spine-export#JSON) and set the `Version` to the older Spine editor version. This may result in data loss if the older version does not have features used in the newer version. For example, when using `4.0` to export JSON data for `3.8`, the curves for all animations will be lost because `3.8` lacks the ability to express the curves created in `4.0`.

Next, run the older Spine editor version and use [data import](/spine-import#Data) to bring the JSON data into Spine. If the project looks OK, save it and continue using the older Spine editor version.

## File storage

Spine project files should be kept safe and stored for future use. Project files can always be opened by the same or newer versions of the Spine editor.

Exported JSON or binary files are not a good choice for storage. They can be [imported](/spine-import#Data) back into the Spine editor, but only into the same version that exported the data. If [nonessential data](/spine-import#Nonessential-data) was not exported, importing the data back into Spine will lose some information. Once imported, a Spine project file can be saved and that can be opened in a new version of the Spine editor.

If a large number of JSON or binary files need to be imported and saved as Spine project files, the [command line interface](/spine-command-line-interface#Import) can be used. For example, the first command below imports JSON that was exported with 3.6.51 and saves it as a project file. The second command uses 4.0.10 to export the project file as 4.0.10 JSON.

```
Spine -u 3.6.51 -i input.json -o project.spine --import
Spine -u 4.0.10 -i project.spine -o path/to/exports --export json
```

[Next: Export](/spine-export)
[Previous: Welcome screen](/spine-welcome-screen)
[Spine User Guide: Table of Contents]
http://esotericsoftware.com/spine-mesh-tools

[Mesh Tools view - Spine User Guide]
[[]]

# Mesh Tools view

The mesh tools view provides "soft selection" for vertices. When the selected vertices are transformed, other vertices within the soft selection size are also transformed. This can help when manpulating many vertices or to move vertices with a gradual fall-off. It works with mesh, path, bounding box, and clipping attachment vertices.

![](/img/spine-user-guide/mesh-tools/mesh-tools.png)

# Size

The size slider controls how far the soft selection influences neighboring vertices. As always, selected vertices are drawn cyan and unselected vertices are drawn gray. Vertices affected by soft selection are drawn between cyan and dark blue, to indicate how much they are influenced based on the [feather slider](#Feather).

Vertices affected by soft selection are transformed by the `Rotate`, `Translate`, and `Scale` tools. Their weights are also manipulated by the [weights view](/spine-weights).

When adjusting the size slider, a circle is drawn in the viewport to show the size.

![](/img/spine-user-guide/mesh-tools/size.png)

# Feather

The feather slider controls the percentage of the size used as the "feathering" or fall-off of the soft selection. At 0, all vertices within the soft selection size are fully selected. At higher values, vertices within that percentage of the size are fully selected and vertices outside of that are partially selected.

When adjusting the feather slider, a circle is drawn in the viewport to show the size with another circle inside to show the feathering.

![](/img/spine-user-guide/mesh-tools/feather.png)

# Hull vertices

When unchecked, for mesh attachments the mesh hull is not affected by soft selection. This can be useful to manipulate the inside of a mesh to fake 3D effects, without changing its shape.

![](/img/blog/3.6-meshtools.gif)

# Video

[youtube:yMefmevOfNc&list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b?modestbranding=1&rel=0]

[Next: Metrics view](/spine-metrics)
[Previous: Graph view](/spine-graph)
[Spine User Guide: Table of Contents]
http://esotericsoftware.com/spine-user-guide

[Spine User Guide]
[[]]

# Spine User Guide

This user guide covers all of Spine's features and what they do. Everything is explained, from the most basic features to the most advanced, and topics are introduced in order, so the articles can be read from beginning to end.

Many articles include a video which covers the same information as the text, allowing you to see firsthand how things work in Spine. You may also browse the [Spine User Guide videos](https://www.youtube.com/playlist?list=PLwGl7Ikd_6GRFo7d0uRu_fN2RIlvkxW7b) on YouTube.

While this user guide explains how Spine works and what everything does, the [Animating with Spine videos](/spine-videos#videosAnimatingWithSpineTitle) teach how to use Spine to make great animation. Also see the [Spine example projects](/spine-examples) which explain the rigging in detail.

<div
  style="
    display: flex;
    flex-direction: column;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 16px 0;
    margin-bottom: 16px;
  "
>
  <div style="font-weight: bold">User Guide Search</div>
  <div class="btn-group" style="display: flex; align-items: center; margin: 16px 0">
    <input
      type="text"
      id="query"
      maxlength="128"
      title="Search the Spine User Guide using Google"
      class="input-search"
      style="height: 25px; margin: 0"
    />
    <button id="search" class="btn btn-round" style="margin: 0">
      <span class="iconfont-search"></span>
    </button>
  </div>
  <div id="queryResults" style="display: flex; flex-direction: column; gap: 16px; width: 100%; height: 100%">
  </div>
</div>

<script>
const sourceId = "65bcd4e65012e05d2353b62a"

const queryUi = document.querySelector("#query");
queryUi.addEventListener("keydown", (event) => {
   if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      search();
   }
});
const searchButtonUi = document.querySelector("#search");
searchButtonUi.addEventListener("click", () => search());
const resultsUi = document.querySelector("#queryResults");

async function search() {
   resultsUi.innerHTML = "<div>Searching ...</div>";
   try {
      const response = await fetch(`https://doxie.marioslab.io/api/search?sourceId=${sourceId}&query=${encodeURIComponent(queryUi.value)}`)
      if (!response.ok) throw new Error(await response.text());
      const results = (await response.json()).results;
      resultsUi.innerHTML = "";
      let i = 0;
      for (const result of results) {
         const row = renderResult(result);
         if (row) {
            resultsUi.append(row);
            i++;
            if (i == 5) break;
         }
      }
   } catch (e) {
      console.log("Search failed", e);
      resultsUi.innerHTML = "<div>Sorry, could not find any results.</div>"
   }
}

function renderResult(result) {
   const parts = result.text.split("\n\n");
   parts.shift();
   const text = stripMarkdown(parts.join(" "));
   if (text.length == 0) return;
   const resultUi = document.createElement("div");
resultUi.innerHTML = `
    <a
      href="${result.docUri}"
      style="font-size: 18px"
      >${result.docTitle}</a
    >
    <p style="margin-bottom: 0px;">${text.substring(0, 400)} ...</p>
`
   resultUi.style.display = "flex";
   resultUi.style.flexDirection = "column";
   return resultUi;
}

function stripMarkdown(markdownText) {
  const htmlText = markdownText
    .replace(/#/g, "")
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold **text** or __text__
    .replace(/(\*|_)(.*?)\1/g, '$2') // Italic *text* or _text_
    .replace(/\~\~(.*?)\~\~/g, '$1') // Strikethrough ~~text~~
    .replace(/\!\[[^\]]*\]\([^\)]*\)/g, '') // Remove images ![alt text](image.jpg)
    .replace(/\[([^\]]*)\]\([^\)]*\)/g, '$1') // Corrected: Remove links [text](http://) but keep the text
    .replace(/#+\s?(.*?)\n/g, '$1\n') // Remove headers, adjusted to capture text after #
    .replace(/\n-\s/g, '') // Remove lists
    .replace(/\n\d+\.\s/g, '') // Remove numbered lists
    .replace(/\n>/g, '') // Remove blockquotes
    .replace(/`{3}.*?`{3}/gs, '') // Remove fenced code blocks
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .replace(/\[.*?\]/g, '')
    .replace(/\n/g, ' '); // Replace new lines with spaces
  return htmlText.trim();
}
</script>

<!--<form method="get" action="//www.google.com/search" class="support-form forms" id="user-guide-form" style="margin-bottom:0.3em">
<fieldset>
	<legend>User Guide Search</legend>
	<table class="layout layout-form"><tr>
	<td>Keywords:</td>
	<td class="btn-group">
		<input type="text" id="user-guide-q" maxlength="128" title="Search the Spine User Guide using Google" class="input-search">
		<button class="btn btn-round" onclick="googleUserGuide(); return false"><span class="iconfont-search"></span></button>
	</td>
	</tr></table>
</fieldset>
</form>-->

<div style="float:left;margin-right:20px">!!
* [Getting started](/spine-getting-started)
  * [User interface](/spine-ui)
  * [Skeletons](/spine-skeletons)
  * [Bones](/spine-bones)
  * [Slots](/spine-slots)
  * [Images](/spine-images)
  * [Tools](/spine-tools)
  * [Keys](/spine-keys)
  * [Animating](/spine-animating)
* [Attachments](/spine-attachments)
  * [Region attachments](/spine-regions)
  * [Mesh attachments](/spine-meshes)
  * [Bounding box attachments](/spine-bounding-boxes)
  * [Clipping attachments](/spine-clipping)
  * [Path attachments](/spine-paths)
  * [Point attachments](/spine-points)
* [Skins](/spine-skins)
* [Constraints](/spine-constraints)
  * [IK constraints](/spine-ik-constraints)
  * [Path constraints](/spine-path-constraints)
  * [Transform constraints](/spine-transform-constraints)
  * [Physics constraints](/spine-physics-constraints)
  * [Sliders](/spine-sliders)
* [Events](/spine-events)
</div>

<div style="float:left">!!
* [Views](/spine-views)
  * [Animations view](/spine-animations-view)
  * [Audio view](/spine-audio-view)
  * [Dopesheet view](/spine-dopesheet)
  * [Ghosting view](/spine-ghosting)
  * [Graph view](/spine-graph)
  * [Mesh Tools view](/spine-mesh-tools)
  * [Metrics view](/spine-metrics)
  * [Outline view](/spine-outline)
  * [Playback view](/spine-playback)
  * [Preview view](/spine-preview)
  * [Skins view](/spine-skins-view)
  * [Slot Color view](/spine-slot-color)
  * [Timeline view](/spine-timeline)
  * [Tree view](/spine-tree)
  * [Weights view](/spine-weights)
* [Welcome screen](/spine-welcome-screen)
* [Versioning](/spine-versioning)
* [Export](/spine-export)
  * [Texture packing](/spine-texture-packer)
* [Import](/spine-import)
  * [Import PSD](/spine-import-psd)
* [Command line interface](/spine-command-line-interface)
* [Settings](/spine-settings)
</div>

<form method="get" action="//www.google.com/search" id="google" style="display:none">
<input type="hidden" name="q" id="google-q">
</form>

<script>
$("#user-guide-form").submit(function() {
	if (e.which == 13) {
		googleUserGuide();
		return false;
	}
});
function googleUserGuide () {
	$("#google-q").val('site:' + (langs[0] == "en" ? "" : (langs[0] + ".")) + 'esotericsoftware.com "Spine User Guide" ' + $("#user-guide-q").val());
	$("#google").submit();
}
</script>
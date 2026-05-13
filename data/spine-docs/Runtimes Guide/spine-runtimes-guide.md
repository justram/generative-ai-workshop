http://esotericsoftware.com/spine-runtimes-guide

[Spine Runtimes Guide]
[[]]

# Spine Runtimes Guide

This guide will teach you how to load, render, and manipulate skeletons in your applications using the Spine Runtimes.

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
// See https://doxie.marioslab.io/admin for source ids
const sourceId = "65cb43073ec0ffabf4624e4d"

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

<!--<form method="get" action="//www.google.com/search" class="support-form forms" id="runtimes-guide-form" style="margin-bottom:-0.5em">
<fieldset>
	<legend>Runtimes Guide Search</legend>
	<table class="layout layout-form"><tr>
	<td>Keywords:</td>
	<td class="btn-group">
		<input type="text" id="runtimes-guide-q" maxlength="128" title="Search the Spine Runtimes Guide using Google" class="input-search">
		<button class="btn btn-round" onclick="googleRuntimesGuide(); return false"><span class="iconfont-search"></span></button>
	</td>
	</tr></table>
</fieldset>
</form>-->

!!* [Runtime Architecture](/spine-runtime-architecture)
* [Loading Skeleton Data](/spine-loading-skeleton-data)
* [Applying Animations](/spine-applying-animations)
* [Runtime Skeletons](/spine-runtime-skeletons)
* [Runtime Skins](/spine-runtime-skins)
* [API Reference](/spine-api-reference)

<form method="get" action="//www.google.com/search" id="google" style="display:none">
<input type="hidden" name="q" id="google-q">
</form>

<script>
$("#runtimes-guide-form").submit(function() {
	if (e.which == 13) {
		googleRuntimesGuide();
		return false;
	}
});
function googleRuntimesGuide () {
	$("#google-q").val('site:' + (langs[0] == "en" ? "" : (langs[0] + ".")) + 'esotericsoftware.com "Spine Runtimes Guide" ' + $("#runtimes-guide-q").val());
	$("#google").submit();
}
</script>
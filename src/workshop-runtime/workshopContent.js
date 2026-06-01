import { getCurrentLanguage, i18n } from "../mini-lit/index.js";
import englishMarkdown from "../workshop-content/en.md";
import traditionalChineseMarkdown from "../workshop-content/zh-TW.md";

const sourceByLanguage = {
  en: englishMarkdown,
  "zh-TW": traditionalChineseMarkdown,
  zh: traditionalChineseMarkdown,
};

const parsedByLanguage = new Map();

function escapeRegExp(value) {
  return value.replace(/[.+^${}()|[\]\\]/g, "\\$&");
}

function renderSection(section) {
  const content = section.content.join("\n").trim();
  const heading = `${"#".repeat(section.level + 1)} ${section.id}. ${section.title}`;
  return content ? `${heading}\n${content}` : heading;
}

export function parseWorkshopMarkdown(markdown) {
  const headings = [];
  const toc = [];
  const lines = markdown.split("\n");

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const match = lines[lineIndex].match(/^(#{2,})\s+([\d.]+)\.?\s+(.+)$/);
    if (!match) continue;
    const level = match[1].length - 1;
    const id = match[2].replace(/\.$/, "");
    const title = match[3];
    headings.push({ line: lineIndex, id, level, title });
    toc.push({ id, title: `${id}. ${title}`, level });
  }

  const sections = headings.map((heading, index) => {
    const nextHeadingLine = headings[index + 1]?.line ?? lines.length;
    return {
      id: heading.id,
      title: heading.title,
      level: heading.level,
      content: lines.slice(heading.line + 1, nextHeadingLine),
    };
  });

  const getFullContentWithTOC = () => {
    let tocMarkdown = `## ${i18n("Table of Contents")}\n\n`;
    for (const item of toc) {
      const indent = "  ".repeat(item.level - 1);
      const anchor = `section-${item.id.replace(/\./g, "-")}`;
      tocMarkdown += `${indent}- [${item.title}](#${anchor})\n`;
    }

    let anchoredMarkdown = markdown;
    for (const item of toc) {
      const anchor = `section-${item.id.replace(/\./g, "-")}`;
      const pattern = new RegExp(`^(#{2,3})\\s+${item.id.replace(/\./g, "\\.")}\\s+(.+)$`, "gm");
      anchoredMarkdown = anchoredMarkdown.replace(pattern, `$1 <span id="${anchor}"></span>$2`);
    }

    return `${tocMarkdown}\n---\n\n${anchoredMarkdown}`;
  };

  return {
    fullContent: markdown,
    toc,
    sections,
    getFullContentWithTOC,
    getMarkdown: (options = {}) => {
      const id = options.id?.trim();
      if (!id) return options.withTOC ? getFullContentWithTOC() : markdown;
      if (id === "*") return options.withTOC ? getFullContentWithTOC() : markdown;

      if (/[*?]/.test(id)) {
        const pattern = new RegExp(
          `^${escapeRegExp(id).replace(/\\\*/g, ".*").replace(/\\\?/g, ".")}$`,
        );
        return sections
          .filter((section) => pattern.test(section.id))
          .map(renderSection)
          .join("\n\n---\n\n");
      }

      const matching = [];
      for (const section of sections) {
        if (section.id === id) {
          matching.push(renderSection(section));
          if (!options.includeChildren) break;
        } else if (options.includeChildren && section.id.startsWith(`${id}.`)) {
          matching.push(renderSection(section));
        }
      }
      return matching.join("\n\n---\n\n");
    },
  };
}

export function getWorkshopContent(language = getCurrentLanguage()) {
  const resolvedLanguage = sourceByLanguage[language] ? language : "en";
  if (!parsedByLanguage.has(resolvedLanguage)) {
    parsedByLanguage.set(
      resolvedLanguage,
      parseWorkshopMarkdown(sourceByLanguage[resolvedLanguage]),
    );
  }
  return parsedByLanguage.get(resolvedLanguage);
}

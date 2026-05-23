import { css, html, LitElement, nothing, render } from "lit";
import { Directive, directive, PartType } from "lit/directive.js";
import {
  getCommittedValue,
  insertPart,
  setChildPartValue,
  setCommittedValue,
} from "lit/directive-helpers.js";
import { customElement, property, query, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { Badge } from "@mariozechner/mini-lit/dist/Badge.js";
import { Button } from "@mariozechner/mini-lit/dist/Button.js";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@mariozechner/mini-lit/dist/Card.js";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@mariozechner/mini-lit/dist/Dialog.js";
import { Input } from "@mariozechner/mini-lit/dist/Input.js";
import { MarkdownBlock } from "@mariozechner/mini-lit/dist/MarkdownBlock.js";
import { Textarea } from "@mariozechner/mini-lit/dist/Textarea.js";
import { fc } from "@mariozechner/mini-lit/dist/mini.js";
import { icon } from "@mariozechner/mini-lit/dist/icons.js";
import {
  ArrowLeft,
  Brain,
  Bug,
  Check,
  ChevronDown,
  Code,
  Download,
  Eye,
  File,
  FileSpreadsheet,
  FileText,
  FileType,
  Globe,
  Image,
  LoaderCircle,
  Paperclip,
  Play,
  Send,
  Square,
  SlidersHorizontal,
  Terminal,
  Wrench,
  X,
} from "lucide";
import { EN_TO_ZH_TW, ZH_TW_TO_EN } from "./translations.js";

const LANGUAGE_KEY = "language";
const SUPPORTED_LANGUAGES = new Set(["en", "zh-TW", "zh"]);
const dictionaries = {
  en: ZH_TW_TO_EN,
  "zh-TW": EN_TO_ZH_TW,
  zh: EN_TO_ZH_TW,
};

export function setTranslations(language, values) {
  dictionaries[language] = { ...dictionaries[language], ...values };
}

export function getTranslations(language = getCurrentLanguage()) {
  return dictionaries[language] || dictionaries.en;
}

export function getCurrentLanguage() {
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem(LANGUAGE_KEY) : null;
  const language = SUPPORTED_LANGUAGES.has(stored) ? stored : "zh-TW";
  if (typeof document !== "undefined") {
    document.documentElement.lang = language === "en" ? "en" : "zh-Hant-TW";
  }
  return language;
}

export function setLanguage(language) {
  const next = SUPPORTED_LANGUAGES.has(language) ? language : "zh-TW";
  localStorage.setItem(LANGUAGE_KEY, next);
  window.location.reload();
}

export function i18n(key, fallback) {
  const language = getCurrentLanguage();
  const dictionary = dictionaries[language] || dictionaries.en;
  if (fallback !== undefined) return dictionary[key]?.[fallback] ?? fallback;
  return dictionary[key] ?? key;
}

export const defaultEnglish = dictionaries.en;
export const defaultGerman = {};

export function __decorate(decorators, target, key, desc) {
  let c = arguments.length;
  let r =
    c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc;
  let d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
    r = Reflect.decorate(decorators, target, key, desc);
  } else {
    for (let i = decorators.length - 1; i >= 0; i -= 1) {
      d = decorators[i];
      if (d) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
  }
  if (c > 3 && r) Object.defineProperty(target, key, r);
  return r;
}

function iconLine(component) {
  return (size = "md") => icon(component, size);
}

export const iconArrowDownSLine = iconLine(ChevronDown);
export const iconArrowLeftLine = iconLine(ArrowLeft);
export const iconArticleLine = iconLine(FileText);
export const iconAttachment2 = iconLine(Paperclip);
export const iconBrain2Line = iconLine(Brain);
export const iconBrainLine = iconLine(Brain);
export const iconBugLine = iconLine(Bug);
export const iconCheckLine = iconLine(Check);
export const iconCloseLine = iconLine(X);
export const iconCodeView = iconLine(Code);
export const iconDownloadLine = iconLine(Download);
export const iconEqualizerLine = iconLine(SlidersHorizontal);
export const iconEyeLine = iconLine(Eye);
export const iconFileCopy2Line = iconLine(FileText);
export const iconFileExcel2Line = iconLine(FileSpreadsheet);
export const iconFilePpt2Line = iconLine(FileType);
export const iconFileTextLine = iconLine(File);
export const iconFileWord2Line = iconLine(FileText);
export const iconGlobalLine = iconLine(Globe);
export const iconImageLine = iconLine(Image);
export const iconLoader4Line = iconLine(LoaderCircle);
export const iconPlayLine = iconLine(Play);
export const iconSendPlane2Line = iconLine(Send);
export const iconSquareFill = iconLine(Square);
export const iconToolsLine = iconLine(Wrench);

export {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Input,
  LitElement as i$1,
  PartType as t,
  MarkdownBlock,
  Terminal as M,
  Textarea,
  Directive as i,
  customElement as t$1,
  customElement,
  css as i$2,
  directive as e$1,
  fc,
  getCommittedValue as p,
  html as x,
  html,
  insertPart as s,
  nothing as T,
  nothing,
  property as n$1,
  property,
  query,
  query as e$2,
  ref as n,
  ref,
  render as B,
  createRef as e,
  createRef,
  setChildPartValue as v,
  setCommittedValue as m,
  state as r,
  state,
  unsafeHTML as o,
  unsafeHTML,
};

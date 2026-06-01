const statusUrl = "/api/auth/status";
const redirectUrl = "/api/auth/start-redirect";
const logoutUrl = "/api/auth/logout";

const root = document.createElement("div");
root.id = "local-pi-auth";
root.innerHTML = `
  <style>
    #local-pi-auth {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      flex: 0 0 auto;
    }
    #local-pi-auth .auth-light {
      width: 28px;
      height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: inherit;
      cursor: default;
      padding: 0;
    }
    #local-pi-auth .auth-light:hover {
      background: rgba(148, 163, 184, 0.12);
    }
    #local-pi-auth .auth-light:active {
      transform: translateY(1px);
    }
    #local-pi-auth .auth-light:focus-visible {
      outline: 2px solid rgba(96, 165, 250, 0.9);
      outline-offset: 2px;
    }
    #local-pi-auth .dot {
      width: 9px;
      height: 9px;
      border-radius: 999px;
      background: #ef4444;
      box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.18);
    }
    #local-pi-auth.connected .dot {
      background: #22c55e;
      box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.18);
    }
    #local-pi-auth.pending .dot {
      background: #f59e0b;
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.18);
    }
    #local-pi-auth .label {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
    }
    workshop-index p.text-sm.text-muted-foreground {
      overflow-wrap: anywhere;
      word-break: break-word;
    }
  </style>
  <button class="auth-light" type="button" aria-label="ChatGPT 登入狀態">
    <span class="dot" aria-hidden="true"></span>
    <span class="label">正在檢查 ChatGPT 登入狀態</span>
  </button>
`;

const button = root.querySelector(".auth-light");
const label = root.querySelector(".label");
let loggedIn = false;

function isEnglish() {
  return localStorage.getItem("language") === "en";
}

function copy(en, zhTw) {
  return isEnglish() ? en : zhTw;
}

function mount() {
  const anchor = document.querySelector("language-selector") || document.querySelector("theme-toggle");
  if (anchor?.parentElement && root.parentElement !== anchor.parentElement) {
    anchor.parentElement.insertBefore(root, anchor);
    return true;
  }
  if (!root.isConnected && document.body) document.body.appendChild(root);
  return false;
}

function setState({ loggedIn: isLoggedIn, loginPending }) {
  loggedIn = Boolean(isLoggedIn);
  root.classList.toggle("connected", loggedIn);
  root.classList.toggle("pending", Boolean(loginPending) && !loggedIn);
  const status = loggedIn
    ? copy("ChatGPT connected", "ChatGPT 已連線")
    : loginPending
      ? copy("Waiting for ChatGPT login", "等待 ChatGPT 登入完成")
      : copy("ChatGPT not connected", "ChatGPT 未連線");
  label.textContent = status;
  button.title = loggedIn
    ? copy("ChatGPT connected. Click to log out.", "ChatGPT 已連線。點一下可登出。")
    : copy("ChatGPT not connected. Click to log in.", "ChatGPT 未連線。點一下登入。");
  button.setAttribute("aria-label", button.title);
}

async function getStatus() {
  const response = await fetch(statusUrl, { cache: "no-store" });
  if (!response.ok) throw new Error("Could not read local auth status");
  return response.json();
}

async function refresh() {
  try {
    setState(await getStatus());
  } catch {
    setState({ loggedIn: false, loginPending: false });
    button.title = copy("Local GPT backend is not reachable", "本機 GPT 後端目前無法連線");
  }
}

async function pollUntilConnected() {
  for (let attempt = 0; attempt < 240; attempt += 1) {
    const status = await getStatus();
    setState(status);
    if (status.loggedIn) return true;
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  await refresh();
  return false;
}

function closeLoginWindow(popup) {
  try {
    if (popup && !popup.closed) popup.close();
  } catch {
    // Some OAuth pages briefly move across origins; Electron also cleans up the child window.
  }
}

button.addEventListener("click", async () => {
  if (loggedIn) {
    await fetch(logoutUrl, { method: "POST" });
    await refresh();
    return;
  }

  setState({ loggedIn: false, loginPending: true });
  const popup = window.open(redirectUrl, "_blank");
  if (!popup) {
    window.location.href = redirectUrl;
    return;
  }
  const connected = await pollUntilConnected();
  if (connected) {
    closeLoginWindow(popup);
    window.focus();
    await refresh();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  mount();
  const observer = new MutationObserver(() => {
    if (mount()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  refresh();
});

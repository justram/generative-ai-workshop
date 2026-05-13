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
      cursor: pointer;
      padding: 0;
    }
    #local-pi-auth .auth-light:hover {
      background: rgba(148, 163, 184, 0.12);
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
  <button class="auth-light" type="button" aria-label="ChatGPT login status">
    <span class="dot" aria-hidden="true"></span>
    <span class="label">Checking ChatGPT login</span>
  </button>
`;

const button = root.querySelector(".auth-light");
const label = root.querySelector(".label");
let loggedIn = false;

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
  const status = loggedIn ? "ChatGPT connected" : loginPending ? "Waiting for ChatGPT login" : "ChatGPT not connected";
  label.textContent = status;
  button.title = loggedIn ? "ChatGPT connected. Click to log out." : "ChatGPT not connected. Click to log in.";
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
    button.title = "Local GPT backend is unavailable";
  }
}

async function pollUntilConnected() {
  for (let attempt = 0; attempt < 240; attempt += 1) {
    const status = await getStatus();
    setState(status);
    if (status.loggedIn) return;
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  await refresh();
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
  await pollUntilConnected();
});

document.addEventListener("DOMContentLoaded", () => {
  mount();
  const observer = new MutationObserver(() => {
    if (mount()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  refresh();
});

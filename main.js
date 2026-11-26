const REPO = "story-squish/storysquish";

const SCHEMES = {
  "Parchment": { board: "#c9b79c", header: "#3a2c1e", headerText: "#f4ead6", ink: "#2b2118", muted: "#7a6a52", card: "#fdfaf2", line: "#d8cdb6", sidebar: "#f2ecdd", accent: "#8a5a2b", statuses: ["#cfe0e8", "#e8dcc0", "#f3e0c0", "#d5ecd0", "#e2e2e2"] },
  "Linen": { board: "#d6d3cc", header: "#33363b", headerText: "#f1efe9", ink: "#24262a", muted: "#6b6e74", card: "#ffffff", line: "#d9d6cf", sidebar: "#efede8", accent: "#3f6e8c", statuses: ["#dbe6ee", "#ece4d2", "#f2dfc8", "#d8ead6", "#e4e4e4"] },
  "Sage": { board: "#a9b8a0", header: "#2f3d2c", headerText: "#eef2e6", ink: "#1f2a1d", muted: "#5d6b58", card: "#fbfcf7", line: "#cdd6c4", sidebar: "#e9eee2", accent: "#4c7a3d", statuses: ["#d3e2ea", "#e8e2c4", "#f0dcc0", "#cfe8c8", "#e0e2dc"] },
  "Harbor": { board: "#9fb4c7", header: "#1e2f40", headerText: "#e8f0f7", ink: "#18232e", muted: "#586a7c", card: "#fbfdff", line: "#cbd7e2", sidebar: "#e6edf4", accent: "#2f6690", statuses: ["#d3e3f0", "#e6e0cc", "#f0dcc4", "#d2eadb", "#e1e4e8"] },
  "Rosewood": { board: "#c7a9a6", header: "#3d2428", headerText: "#f7e9ea", ink: "#2e1a1d", muted: "#7a5c60", card: "#fffafa", line: "#e2cfd0", sidebar: "#f4e9e9", accent: "#9c3d54", statuses: ["#dcdcef", "#efe0cc", "#f5d9cc", "#d9ead3", "#e6e1e2"] },
  "Lavender": { board: "#b3aac8", header: "#2c2640", headerText: "#eeeaf7", ink: "#221d30", muted: "#655d7a", card: "#fdfcff", line: "#d8d2e6", sidebar: "#ece8f4", accent: "#6a4fa3", statuses: ["#d6dcf2", "#ece2cf", "#f2dccb", "#d6ebd8", "#e3e1e8"] },
  "Slate": { board: "#2b3036", header: "#1b1e22", headerText: "#e6e8eb", ink: "#e4e6e9", muted: "#9aa1a9", card: "#3a4048", line: "#4c535c", sidebar: "#23272c", accent: "#6ea8d8", statuses: ["#2f4a5c", "#524a33", "#5c4630", "#2f5238", "#474b51"] },
  "Midnight": { board: "#141b2d", header: "#0b1020", headerText: "#dde4f5", ink: "#e1e7f5", muted: "#8b96b3", card: "#1f2840", line: "#323d5c", sidebar: "#111829", accent: "#8ca8ff", statuses: ["#2a3a66", "#4d4530", "#5a4030", "#24503e", "#3a3f4f"] },
  "Ember": { board: "#2a201b", header: "#17110e", headerText: "#f2e3d3", ink: "#f0e2d2", muted: "#ab9682", card: "#3a2d26", line: "#54433a", sidebar: "#211915", accent: "#e08a4a", statuses: ["#3a4a58", "#5a4a2e", "#66442c", "#3a5030", "#4a423d"] },
  "Forest Night": { board: "#1c2620", header: "#101712", headerText: "#dfeadf", ink: "#e0ebe0", muted: "#92a596", card: "#28352c", line: "#3b4b3f", sidebar: "#172019", accent: "#7cc48a", statuses: ["#2d4a4f", "#4f4a2c", "#5a442c", "#2f5a35", "#3c4540"] },
};

function applyScheme(mock, scheme) {
  const vars = {
    board: scheme.board, header: scheme.header, "header-text": scheme.headerText, ink: scheme.ink,
    muted: scheme.muted, card: scheme.card, line: scheme.line, sidebar: scheme.sidebar, accent: scheme.accent,
  };
  ["outline", "draft", "revision", "final", "archived"].forEach((status, i) => { vars[status] = scheme.statuses[i]; });
  for (const [name, value] of Object.entries(vars)) mock.style.setProperty(`--m-${name}`, value);
}

function setUpSchemes() {
  const mock = document.getElementById("mock");
  const container = document.getElementById("swatches");
  if (!mock || !container) return;
  const buttons = Object.entries(SCHEMES).map(([name, scheme], index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "swatch";
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(index === 0));
    button.setAttribute("aria-label", name);
    button.title = name;
    button.tabIndex = index === 0 ? 0 : -1;
    button.style.setProperty("--a", scheme.header);
    button.style.setProperty("--b", scheme.accent);
    button.addEventListener("click", () => select(button, scheme));
    container.append(button);
    return button;
  });
  function select(button, scheme) {
    buttons.forEach((b) => { b.setAttribute("aria-checked", String(b === button)); b.tabIndex = b === button ? 0 : -1; });
    applyScheme(mock, scheme);
  }
  container.addEventListener("keydown", (event) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const current = buttons.indexOf(document.activeElement);
    const next = buttons[(current + step + buttons.length) % buttons.length];
    next.focus();
    next.click();
  });
}

function setUpTabs(tablist) {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const activate = (tab, focus) => {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab) => tab.addEventListener("click", () => activate(tab, false)));
  tablist.addEventListener("keydown", (event) => {
    const index = tabs.indexOf(document.activeElement);
    if (index < 0) return;
    const targets = {
      ArrowRight: (index + 1) % tabs.length, ArrowDown: (index + 1) % tabs.length,
      ArrowLeft: (index - 1 + tabs.length) % tabs.length, ArrowUp: (index - 1 + tabs.length) % tabs.length,
      Home: 0, End: tabs.length - 1,
    };
    if (!(event.key in targets)) return;
    event.preventDefault();
    activate(tabs[targets[event.key]], true);
  });
  return activate;
}

function detectOs() {
  const platform = (navigator.userAgentData?.platform || navigator.platform || navigator.userAgent).toLowerCase();
  if (/iphone|ipad|android/.test(navigator.userAgent.toLowerCase())) return null;
  if (platform.includes("mac")) return "mac";
  if (platform.includes("win")) return "win";
  if (platform.includes("linux")) return "linux";
  return null;
}

const OS_LABELS = { mac: "Download for macOS", win: "Download for Windows", linux: "Install on Linux" };

function setUpDownloads(activateOsTab) {
  const os = detectOs();
  const label = document.getElementById("download-label");
  if (os) {
    label.textContent = OS_LABELS[os];
    activateOsTab(document.getElementById(`ot-${os}`), false);
  }
  document.getElementById("download-primary").addEventListener("click", () => {
    if (os) activateOsTab(document.getElementById(`ot-${os}`), false);
  });

  fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers: { Accept: "application/vnd.github+json" } })
    .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
    .then((release) => {
      document.querySelectorAll("[data-version]").forEach((el) => { el.textContent = release.tag_name; });
      const published = new Date(release.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
      document.querySelectorAll("[data-version-sentence]").forEach((el) => {
        el.innerHTML = "";
        const link = document.createElement("a");
        link.href = release.html_url;
        link.textContent = release.tag_name;
        el.append("Latest release: ", link, `, ${published}.`);
      });
      const assetUrls = {};
      document.querySelectorAll("[data-asset]").forEach((anchor) => {
        const asset = release.assets.find((a) => a.name.endsWith(anchor.dataset.asset));
        if (asset) {
          anchor.href = asset.browser_download_url;
          assetUrls[anchor.dataset.asset] = asset.browser_download_url;
        }
      });
      const primary = document.getElementById("download-primary");
      const directAsset = { mac: "macos-universal.pkg", win: "windows-x86_64.zip" }[os];
      if (directAsset && assetUrls[directAsset]) primary.href = assetUrls[directAsset];
    })
    .catch(() => {});
}

function setUpCopyButtons() {
  if (!navigator.clipboard) return;
  document.querySelectorAll("pre").forEach((pre) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy";
    button.textContent = "Copy";
    button.addEventListener("click", async () => {
      const text = pre.querySelector("code").innerText
        .split("\n")
        .map((line) => line.replace(/\s+#.*$/, ""))
        .join("\n");
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = "Copied";
      } catch {
        button.textContent = "Press ⌘C";
      }
      setTimeout(() => { button.textContent = "Copy"; }, 1600);
    });
    pre.append(button);
  });
}

function setUpNav() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    links.classList.toggle("open", open);
  });
  links.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      toggle.setAttribute("aria-expanded", "false");
      links.classList.remove("open");
    }
  });
}

setUpNav();
setUpSchemes();
setUpTabs(document.querySelector(".view-tabs"));
setUpDownloads(setUpTabs(document.querySelector(".os-tabs")));
setUpCopyButtons();

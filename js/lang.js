/* 繁體是頁面原文。简體用 OpenCC 香港繁體轉簡體。 */
(function () {
  const KEY = "24twg-lang";
  const originals = new WeakMap();
  const attrOriginals = new WeakMap();
  let hans = null;
  let openccPromise = null;
  let titleOriginal = "";

  const current = () => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "en") localStorage.removeItem(KEY);
      if (saved === "zh-Hans") return "zh-Hans";
    } catch (error) { /* keep traditional */ }
    return "zh-Hant";
  };

  const render = (value) => {
    if (current() !== "zh-Hans" || value == null) return value;
    return hans ? hans(value) : value;
  };

  const paintText = (node) => {
    if (!originals.has(node)) originals.set(node, node.nodeValue);
    node.nodeValue = render(originals.get(node));
  };

  const paint = () => {
    document.documentElement.lang = current();
    if (!titleOriginal) titleOriginal = document.title;
    document.title = render(titleOriginal);
    document.querySelectorAll("[data-zh]").forEach((el) => {
      el.textContent = render(el.dataset.zh);
    });
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || !node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (parent.closest("script, style, noscript, textarea, .lang-switch, [data-zh]")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(paintText);
    document.querySelectorAll("[alt], [aria-label], [title], [placeholder]").forEach((el) => {
      if (el.closest(".lang-switch")) return;
      let saved = attrOriginals.get(el);
      if (!saved) {
        saved = {};
        ["alt", "aria-label", "title", "placeholder"].forEach((name) => {
          if (el.hasAttribute(name)) saved[name] = el.getAttribute(name);
        });
        attrOriginals.set(el, saved);
      }
      Object.keys(saved).forEach((name) => {
        if (saved[name]) el.setAttribute(name, render(saved[name]));
      });
    });
    document.querySelectorAll(".lang-switch button").forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.lang === current() ? "true" : "false");
    });
  };

  const loadOpenCC = () => {
    if (window.OpenCC) return Promise.resolve();
    if (!openccPromise) {
      openccPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "js/vendor/opencc-js.js";
        script.onload = () => resolve();
        script.onerror = () => {
          openccPromise = null;
          reject(new Error("OpenCC failed"));
        };
        document.head.appendChild(script);
      });
    }
    return openccPromise;
  };

  const apply = () => {
    if (current() !== "zh-Hans") {
      paint();
      return;
    }
    loadOpenCC()
      .then(() => {
        if (!hans) hans = OpenCC.Converter({ from: "hk", to: "cn" });
        paint();
      })
      .catch(() => paint());
  };

  const brand = document.querySelector("header .brand");
  if (brand && !document.querySelector(".lang-switch")) {
    const group = document.createElement("div");
    group.className = "lang-switch ignore-opencc";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", "語言");
    [
      ["zh-Hant", "繁"],
      ["zh-Hans", "简"],
    ].forEach(([lang, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.lang = lang;
      button.textContent = label;
      button.setAttribute("aria-pressed", current() === lang ? "true" : "false");
      button.addEventListener("click", () => {
        try { localStorage.setItem(KEY, lang); } catch (error) { /* still switch this view */ }
        apply();
      });
      group.appendChild(button);
    });
    const block = document.createElement("div");
    block.className = "brand-block";
    brand.parentElement.insertBefore(block, brand);
    block.append(brand, group);
  }

  window.siteLang = {
    apply,
    text: render,
  };

  const waitingForAlbums = document.querySelector(".album-block") && !document.querySelector(".album-cards");
  if (!waitingForAlbums) apply();
})();

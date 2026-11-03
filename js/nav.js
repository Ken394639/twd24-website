const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const header = document.querySelector(".top");
const narrow = () => window.matchMedia("(max-width: 1100px)").matches;
const fitNav = () => {
  if (!nav || !header || !narrow() || !nav.classList.contains("is-open")) {
    if (nav) nav.style.maxHeight = "";
    return;
  }
  const bottom = Math.ceil(header.getBoundingClientRect().bottom);
  nav.style.maxHeight = Math.max(120, window.innerHeight - bottom) + "px";
};
const setNavOpen = (open) => {
  nav.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  document.body.classList.toggle("nav-lock", open);
  if (!open) nav.querySelectorAll(".has-sub.is-open").forEach((item) => item.classList.remove("is-open"));
  fitNav();
};
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    setNavOpen(!nav.classList.contains("is-open"));
  });
  nav.querySelectorAll(".has-sub > a").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!narrow()) return;
      event.preventDefault();
      const item = link.parentElement;
      const willOpen = !item.classList.contains("is-open");
      item.parentElement.querySelectorAll(":scope > .has-sub.is-open").forEach((openItem) => {
        if (openItem === item) return;
        openItem.classList.remove("is-open");
        openItem.querySelectorAll(".has-sub.is-open").forEach((child) => child.classList.remove("is-open"));
      });
      if (!willOpen) item.querySelectorAll(".has-sub.is-open").forEach((child) => child.classList.remove("is-open"));
      item.classList.toggle("is-open", willOpen);
      if (!willOpen) return;
      requestAnimationFrame(() => {
        const delta = link.getBoundingClientRect().top - nav.getBoundingClientRect().top;
        nav.scrollTo({ top: nav.scrollTop + delta, behavior: "smooth" });
      });
    });
  });
  nav.querySelectorAll(".sub a").forEach((link) => {
    link.addEventListener("click", () => {
      if (!narrow()) return;
      if (link.parentElement.classList.contains("has-sub")) return;
      setNavOpen(false);
    });
  });
  window.addEventListener("resize", () => {
    if (!narrow()) setNavOpen(false);
    else fitNav();
  });
}

const filterBar = document.querySelector(".filters");
if (filterBar) {
  const buttons = [...filterBar.querySelectorAll("button[data-filter]")];
  const sectionButtons = [...filterBar.querySelectorAll("button[data-section]")];
  const blocks = [...document.querySelectorAll(".album-block")];
  const known = new Set(buttons.map((button) => button.dataset.filter));
  const header = document.querySelector(".top");
  const yearSelect = document.querySelector("#year-filter");
  const emptyNote = document.querySelector("#filter-empty");
  const intros = [...document.querySelectorAll(".social-intro")];
  let category = "all";
  let year = "";
  let section = "";

  const years = [...new Set(
    [...document.querySelectorAll("tbody tr")]
      .map((row) => row.dataset.year)
      .filter(Boolean)
  )].sort((a, b) => b - a);
  years.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    yearSelect.appendChild(option);
  });

  const pin = () => {
    if (header) filterBar.style.top = header.offsetHeight + "px";
  };
  const docTop = (el) => {
    let y = 0;
    let node = el;
    while (node) {
      y += node.offsetTop;
      node = node.offsetParent;
    }
    return y;
  };
  const blockOn = (name) => {
    if (category === "all") return name === "all" || name === "social";
    if (category === "social") return name === "social";
    return name === category || name === "social";
  };
  const apply = () => {
    buttons.forEach((button) => {
      const on = button.dataset.filter === category;
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });
    sectionButtons.forEach((button) => {
      const on = (button.dataset.section || "") === section;
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });
    intros.forEach((intro) => {
      intro.hidden = category !== "all" && category !== "social";
    });
    let visible = 0;
    blocks.forEach((block) => {
      const name = block.dataset.filter;
      const on = blockOn(name);
      block.classList.toggle("is-on", on);
      let count = 0;
      block.querySelectorAll("tbody tr").forEach((row, index) => {
        let ok = !year || row.dataset.year === year;
        if (section) {
          ok = ok && (row.dataset.sections || "").split(" ").includes(section);
        }
        if (name === "social" && category !== "all" && category !== "social") {
          ok = ok && row.dataset.cat === category;
        }
        row.hidden = !ok;
        if (!ok) return;
        row.classList.toggle("is-odd", count % 2 === 1);
        count += 1;
      });
      const heading = block.querySelector("h2");
      if (heading && heading.dataset.label) {
        heading.textContent = heading.dataset.label + "（" + count + "）";
      }
      block.classList.toggle("is-empty", on && count === 0);
      if (on && count > 0) visible += count;
    });
    if (emptyNote) emptyNote.hidden = visible > 0;
  };
  const scrollToFilters = () => {
    pin();
    const top = docTop(filterBar) - (header ? header.offsetHeight : 0);
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      category = button.dataset.filter;
      apply();
      if (location.hash !== "#" + category) location.hash = category;
      scrollToFilters();
    });
  });
  sectionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      section = button.dataset.section || "";
      apply();
      scrollToFilters();
    });
  });
  yearSelect.addEventListener("change", () => {
    year = yearSelect.value;
    apply();
  });
  const fromHash = location.hash.replace("#", "");
  category = known.has(fromHash) ? fromHash : "all";
  apply();
  pin();
  window.addEventListener("resize", pin);
  window.addEventListener("hashchange", () => {
    const name = location.hash.replace("#", "");
    if (!known.has(name) || name === category) return;
    category = name;
    apply();
    scrollToFilters();
  });
}

const slides = [...document.querySelectorAll(".slide")];
const dots = document.querySelector(".dots");
if (slides.length && dots) {
  let index = 0;
  slides.forEach((_, n) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", "第 " + (n + 1) + " 張");
    dot.addEventListener("click", () => show(n));
    dots.appendChild(dot);
  });
  const dotButtons = [...dots.children];
  let leaveTimer = 0;
  function show(n) {
    const next = (n + slides.length) % slides.length;
    if (next === index && slides[index].classList.contains("is-on")) return;
    slides.forEach((slide) => slide.classList.remove("is-leaving"));
    if (slides[index].classList.contains("is-on")) {
      const leaving = slides[index];
      leaving.classList.add("is-leaving");
      window.clearTimeout(leaveTimer);
      leaveTimer = window.setTimeout(() => leaving.classList.remove("is-leaving"), 400);
    }
    index = next;
    slides.forEach((slide, i) => slide.classList.toggle("is-on", i === index));
    dotButtons.forEach((dot, i) => dot.classList.toggle("is-on", i === index));
  }
  document.querySelector(".slider-btn.next").addEventListener("click", () => show(index + 1));
  document.querySelector(".slider-btn.prev").addEventListener("click", () => show(index - 1));
  show(0);
  setInterval(() => show(index + 1), 5000);
}

const zone = document.createElement("div");
zone.className = "to-top-zone";
const toTop = document.createElement("button");
toTop.type = "button";
toTop.className = "to-top";
toTop.textContent = "回到最頂";
zone.appendChild(toTop);
document.body.appendChild(zone);
const placeToTop = () => {
  zone.style.right = "0px";
  zone.style.bottom = "0px";
  const rect = toTop.getBoundingClientRect();
  zone.style.right = (0 - (window.innerWidth - rect.right - 18)) + "px";
  zone.style.bottom = (0 - (window.innerHeight - rect.bottom - 18)) + "px";
};
placeToTop();
window.addEventListener("resize", placeToTop);
toTop.addEventListener("click", () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
});

const zoomDialog = document.createElement("dialog");
zoomDialog.id = "photo-zoom";
zoomDialog.innerHTML = '<button type="button" class="zoom-close">關閉</button><img alt="">';
document.body.appendChild(zoomDialog);
const zoomImg = zoomDialog.querySelector("img");
const openZoom = (img) => {
  zoomImg.src = img.currentSrc || img.src;
  zoomImg.alt = img.alt || "";
  zoomDialog.classList.remove("is-in");
  if (!zoomDialog.open) zoomDialog.showModal();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => zoomDialog.classList.add("is-in"));
  });
};
document.addEventListener("click", (event) => {
  if (event.target.closest("#photo-zoom")) return;
  const button = event.target.closest("button.zoom");
  const img = button ? button.querySelector("img") : event.target.closest("img");
  if (!img || img.closest("header")) return;
  event.preventDefault();
  openZoom(img);
});
zoomDialog.querySelector(".zoom-close").addEventListener("click", () => zoomDialog.close());
zoomDialog.addEventListener("click", (event) => {
  if (event.target === zoomDialog) zoomDialog.close();
});
zoomDialog.addEventListener("close", () => {
  zoomDialog.classList.remove("is-in");
  zoomImg.removeAttribute("src");
});

const marks = {
  instagram: '<svg class="mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.15" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.15" fill="currentColor"/></svg>',
  facebook: '<svg class="mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M22 12.1C22 6.6 17.5 2.1 12 2.1S2 6.6 2 12.1c0 5 3.7 9.1 8.4 9.9v-7H7.9v-2.9h2.5V9.9c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6v1.9h2.8l-.4 2.9h-2.4v7c4.7-.8 8.5-4.9 8.5-9.9z"/></svg>',
  threads: '<svg class="mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16.7 11.1c-.1-2.6-1.5-4.3-4.2-4.4-2.3-.1-3.8 1.1-4.4 3.2l1.9.4c.3-1.2 1-2 2.4-1.9 1.6.1 2.4 1 2.5 2.7-.7-.3-1.6-.5-2.5-.5-2.4 0-4 1.4-4 3.6s1.5 3.4 3.6 3.4c1.8 0 3.1-.8 3.7-2.4.4 1.4 1.3 2.1 2.7 2.1 1.2 0 2-.7 2-1.8 0-.2 0-.4-.1-.6 1 .4 1.6 1.2 1.6 2.4 0 1.8-1.6 3.2-4.1 3.2-2.8 0-4.6-1.6-5-3.8-2.2-.3-3.7-1.8-3.7-4s2.1-4.6 5.2-4.6c2.7 0 4.5 1.5 4.9 3.7h-2.5zm-1.2 3.1c-.5 1.1-1.4 1.6-2.6 1.6-1.2 0-2-.7-2-1.7s.8-1.7 2.1-1.7c.8 0 1.6.1 2.3.4.1.4.2.9.2 1.4z"/></svg>',
  flickr: '<svg class="mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="7.1" cy="12" r="3.15" fill="currentColor"/><circle cx="16.9" cy="12" r="3.15" fill="currentColor"/></svg>',
  linktree: '<svg class="mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M10.6 2h2.8v6.2H17v2.8h-3.6V22h-2.8v-11H7V8.2h3.6V2z"/></svg>',
  mail: '<svg class="mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="5.2" width="18" height="13.6" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 7.2 12 13l8-5.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'
};

const channelOf = (href) => {
  if (!href) return "";
  if (href.startsWith("mailto:")) return "mail";
  let url;
  try {
    url = new URL(href, location.href);
  } catch (error) {
    return "";
  }
  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");
  const path = url.pathname.replace(/\/+$/, "") || "/";
  if (host === "instagram.com" && path.toLowerCase() === "/24twg") return "instagram";
  if (host === "facebook.com" && path.toLowerCase() === "/24thtwg") return "facebook";
  if ((host === "threads.com" || host === "threads.net") && path.toLowerCase() === "/@24twg") return "threads";
  if (host === "flickr.com" && /\/albums$/i.test(path)) return "flickr";
  if (host === "linktr.ee") return "linktree";
  return "";
};

document.querySelectorAll("a[href]").forEach((link) => {
  if (link.closest("table") || link.querySelector(".mark") || link.classList.contains("btn")) return;
  const kind = channelOf(link.getAttribute("href"));
  if (!marks[kind]) return;
  link.insertAdjacentHTML("afterbegin", marks[kind]);
});

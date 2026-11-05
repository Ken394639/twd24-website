/* Leader filter, page search, activity cards. Album covers are files in images/album-covers/. */
(function () {
  const thumbs = {
    contest: "images/act-contest.jpg",
    service: "images/act-service.jpg",
    training: "images/act-training.jpg",
    camp: "images/act-camp.jpg",
    hike: "images/act-hike.jpg",
    water: "images/act-water.jpg",
    travel: "images/act-travel.jpg",
    gathering: "images/act-bbq.jpg",
    other: "images/hero.jpg",
  };

  let posterByCode = {};

  const eventCover = {
    DXzRBfokTA4: "images/album-covers/72177720333401952.jpg",
    DUuW0wZAZBs: "images/album-covers/72177720332025238.jpg",
    DUA2pQcDFZD: "images/album-covers/72177720331692274.jpg",
    DJNz2guBkFi: "images/album-covers/72177720325771315.jpg",
    DGZ1OLCykD2: "images/album-covers/72177720324010018.jpg",
    DF7pxMpv9Lr: "images/album-covers/72177720323722391.jpg",
    DFPkVvrBG9Y: "images/album-covers/72177720323366687.jpg",
    DCMa_caya3K: "images/album-covers/72177720321514135.jpg",
    "DAdd9-rNhZW": "images/album-covers/72177720321321025.jpg",
    "C_nUTR4BrOY": "images/album-covers/72177720320049972.jpg",
    C9mE_Ptxlgv: "images/album-covers/72177720319137436.jpg",
    C9qs2ntJAL4: "images/album-covers/72177720318978669.jpg",
    C7ashcMPi6v: "images/album-covers/72177720316223046.jpg",
    C6d7UfULE8V: "images/album-covers/72177720332980912.jpg",
    "C7ZLDbXMHw-": "images/album-covers/72177720317294556.jpg",
    C5yPXXtrJtO: "images/album-covers/72177720316223046.jpg",
  };

  const asThumb = (path) => (
    path && path.indexOf("images/album-covers/") === 0 && path.indexOf("/thumbs/") === -1
      ? path.replace("images/album-covers/", "images/album-covers/thumbs/")
      : ""
  );

  const coverFor = (href, cat) => {
    const last = thumbs[cat] || "images/hero.jpg";
    const album = (href || "").match(/\/albums\/(\d+)/);
    if (album) {
      const full = "images/album-covers/" + album[1] + ".jpg";
      return { src: "images/album-covers/thumbs/" + album[1] + ".jpg", fallback: full, last };
    }
    const ig = (href || "").match(/instagram\.com\/[^/]+\/(?:p|reel)\/([^/?#]+)/i);
    if (ig) {
      const code = ig[1];
      const raw = posterByCode[code] || eventCover[code] || ("images/social/post-covers/" + code + ".jpg");
      const thumb = asThumb(raw);
      if (thumb) return { src: thumb, fallback: raw, last };
      return { src: raw, fallback: last, last: "" };
    }
    if ((href || "").indexOf("pfbid0m1LdouJGXDitHqYj8DF7mscZpHPCmw3VBHYKXRBtpStoUSU3M1NSgHSjAcpr1KTQl") !== -1) {
      return { src: "images/social/posters/parade-2026.jpg", fallback: last, last: "" };
    }
    return { src: last, fallback: "", last: "" };
  };

  const bindCover = (img, cover) => {
    const chain = [cover.src, cover.fallback, cover.last].filter((item, index, list) => item && list.indexOf(item) === index);
    img.dataset.src = chain[0] || "";
    img.dataset.fallbacks = chain.slice(1).join("|");
    img.addEventListener("error", () => {
      const rest = (img.dataset.fallbacks || "").split("|").filter(Boolean);
      if (!rest.length) return;
      img.dataset.fallbacks = rest.slice(1).join("|");
      img.src = rest[0];
    });
  };

  const BATCH = 24;
  const albumLimits = new WeakMap();
  const capOf = (block) => albumLimits.get(block) || BATCH;
  const showCard = (card) => {
    card.dataset.shown = "1";
    const img = card.querySelector("img");
    if (img && img.dataset.src && !img.getAttribute("src")) img.src = img.dataset.src;
  };
  const syncAlbums = () => {
    document.querySelectorAll(".album-block").forEach((block) => {
      const grid = block.querySelector(".album-cards");
      const more = block.querySelector(".album-more");
      if (!grid) return;
      const cards = [...grid.querySelectorAll(".album-card")];
      const visible = cards.filter((card) => !card.hidden);
      const cap = capOf(block);
      const open = block.classList.contains("is-on");
      visible.forEach((card, index) => {
        if (open && index < cap) showCard(card);
        else delete card.dataset.shown;
      });
      cards.forEach((card) => {
        if (card.hidden) delete card.dataset.shown;
      });
      if (more) more.hidden = !open || visible.length <= cap;
    });
  };
  const moreAlbums = (block) => {
    const more = block.querySelector(".album-more");
    if (more) more.dataset.arm = "0";
    albumLimits.set(block, capOf(block) + BATCH);
    syncAlbums();
  };
  const moreWatcher = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.arm !== "1" || entry.target.hidden) return;
      const block = entry.target.closest(".album-block");
      if (!block || !block.classList.contains("is-on")) return;
      moreAlbums(block);
    });
  });
  window.addEventListener("scroll", () => {
    document.querySelectorAll(".album-more").forEach((button) => {
      if (button.dataset.arm === "1" || button.hidden) return;
      const rect = button.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) button.dataset.arm = "1";
    });
  }, { passive: true });

  const toCards = () => {
    document.querySelectorAll(".album-block").forEach((block) => {
      if (block.querySelector(".album-cards")) return;
      const table = block.querySelector("table");
      if (!table) return;
      const wrap = table.closest(".table-scroll") || table.parentElement;
      const grid = document.createElement("div");
      grid.className = "album-cards";
      table.querySelectorAll("tbody tr").forEach((row) => {
        const link = row.querySelector("a[href]");
        if (!link) return;
        const cat = row.dataset.cat || "";
        const card = document.createElement("a");
        card.className = "album-card";
        card.href = link.href;
        if (link.target) card.target = link.target;
        if (link.rel) card.rel = link.rel;
        card.dataset.year = row.dataset.year || "";
        card.dataset.sections = row.dataset.sections || "";
        card.dataset.cat = cat;
        const label = link.textContent.trim();
        const img = document.createElement("img");
        img.alt = label;
        img.loading = "lazy";
        img.decoding = "async";
        bindCover(img, coverFor(link.getAttribute("href") || "", cat));
        const body = document.createElement("div");
        body.className = "album-card-body";
        const title = document.createElement("strong");
        title.textContent = label;
        const meta = document.createElement("span");
        const date = row.cells[0] ? row.cells[0].textContent.trim() : "";
        const kind = row.cells[2] ? row.cells[2].textContent.trim() : "";
        const platform = row.cells[3] ? row.cells[3].textContent.trim() : "";
        meta.textContent = [date, kind || platform, platform && kind ? platform : ""].filter(Boolean).join(" · ");
        body.append(title, meta);
        card.append(img, body);
        grid.appendChild(card);
      });
      const more = document.createElement("button");
      more.type = "button";
      more.className = "album-more";
      more.textContent = "再顯示";
      more.hidden = true;
      more.dataset.arm = "1";
      more.addEventListener("click", () => moreAlbums(block));
      wrap.hidden = true;
      wrap.insertAdjacentElement("afterend", grid);
      grid.insertAdjacentElement("afterend", more);
      moreWatcher.observe(more);
    });
    syncAlbums();
  };
  window.siteAlbums = { sync: syncAlbums };

  const setupLeaderFilter = () => {
    const roster = document.querySelector(".roster");
    if (!roster || !roster.querySelector(".person")) return;

    const sectionLabel = {
      group: "旅團領導",
      cub: "幼童軍",
      scout: "童軍",
      venture: "深資",
      rover: "樂行",
      training: "訓練員",
    };
    const rankOrder = ["藍膊", "綠膊", "紅膊", "黃膊"];
    const sectionOrder = ["group", "cub", "scout", "venture", "rover", "training"];

    roster.querySelectorAll(".person").forEach((person) => {
      const role = (person.querySelector("p") || {}).textContent || "";
      let section = person.dataset.section || "";
      if (!section) {
        section = "group";
        if (role.includes("幼童軍")) section = "cub";
        else if (role.includes("深資")) section = "venture";
        else if (role.includes("樂行")) section = "rover";
        else if (role.includes("訓練員")) section = "training";
        else if (role.includes("童軍")) section = "scout";
      }
      let rank = person.dataset.rank || "";
      if (!rank) {
        if (role.includes("藍膊")) rank = "藍膊";
        else if (role.includes("綠膊")) rank = "綠膊";
        else if (role.includes("紅膊")) rank = "紅膊";
        else if (role.includes("黃膊")) rank = "黃膊";
      }
      person.dataset.section = section;
      person.dataset.rank = rank;
      person.dataset.name = (person.querySelector("h3") || {}).textContent || "";
    });

    // 只顯示本頁名單實際有的支部／肩章（例如幼童軍頁不會有藍膊）
    const presentSections = sectionOrder.filter((key) =>
      [...roster.querySelectorAll(".person")].some((p) => p.dataset.section === key)
    );
    const presentRanks = rankOrder.filter((key) =>
      [...roster.querySelectorAll(".person")].some((p) => p.dataset.rank === key)
    );
    const multiSection = presentSections.length > 1;
    const multiRank = presentRanks.length > 1;

    // 若頁上只有搜尋有用（單一支部且單一肩章），仍保留搜尋
    if (!multiSection && !multiRank && roster.querySelectorAll(".person").length < 2) return;

    const bar = document.createElement("div");
    bar.className = "filters roster-filters";
    bar.setAttribute("role", "toolbar");
    bar.setAttribute("aria-label", "領袖篩選");

    let html = `<label class="site-search"><span class="visually-hidden">搜尋領袖</span>
      <input type="search" id="leader-search" placeholder="搜尋職位…" autocomplete="off">
    </label>`;
    if (multiSection) {
      html += `<span class="filter-label">支部</span>`;
      html += `<button type="button" data-section="" aria-pressed="true" class="is-on">全部</button>`;
      presentSections.forEach((key) => {
        html += `<button type="button" data-section="${key}" aria-pressed="false">${sectionLabel[key]}</button>`;
      });
    }
    if (multiRank) {
      html += `<span class="filter-label">肩章</span>`;
      html += `<button type="button" data-rank="" aria-pressed="true" class="is-on">全部</button>`;
      presentRanks.forEach((key) => {
        html += `<button type="button" data-rank="${key}" aria-pressed="false">${key}</button>`;
      });
    }
    bar.innerHTML = html;

    const empty = document.createElement("p");
    empty.className = "filter-empty";
    empty.hidden = true;
    empty.textContent = "沒有符合的領袖。";
    roster.insertAdjacentElement("beforebegin", bar);
    roster.insertAdjacentElement("beforebegin", empty);

    let section = "";
    let rank = "";
    let q = "";
    const syncHeadings = () => {
      roster.querySelectorAll("h2, h3.role-label").forEach((heading) => {
        let node = heading.nextElementSibling;
        while (node && !node.classList.contains("people") && !node.matches("h2, h3.role-label")) {
          node = node.nextElementSibling;
        }
        const people = node && node.classList.contains("people") ? node : null;
        const has = people && [...people.querySelectorAll(".person")].some((p) => !p.hidden);
        heading.hidden = !has;
        if (people) people.hidden = !has;
        const more = people && people.nextElementSibling;
        if (more && more.matches("p") && more.querySelector("a") && !more.classList.contains("rank-note")) {
          more.hidden = !has;
        }
      });
    };
    const apply = () => {
      bar.querySelectorAll("button[data-section]").forEach((b) => {
        const on = (b.dataset.section || "") === section;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      bar.querySelectorAll("button[data-rank]").forEach((b) => {
        const on = (b.dataset.rank || "") === rank;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      let visible = 0;
      roster.querySelectorAll(".person").forEach((person) => {
        const okSection = !section || person.dataset.section === section;
        const okRank = !rank || person.dataset.rank === rank;
        const okQ = !q || (person.dataset.name || "").includes(q) || (person.textContent || "").includes(q);
        const show = okSection && okRank && okQ;
        person.hidden = !show;
        if (show) visible += 1;
      });
      syncHeadings();
      empty.hidden = visible > 0;
    };
    bar.querySelectorAll("button[data-section]").forEach((b) => {
      b.addEventListener("click", () => {
        section = b.dataset.section || "";
        apply();
      });
    });
    bar.querySelectorAll("button[data-rank]").forEach((b) => {
      b.addEventListener("click", () => {
        rank = b.dataset.rank || "";
        apply();
      });
    });
    const search = bar.querySelector("#leader-search");
    if (search) {
      search.addEventListener("input", (e) => {
        q = e.target.value.trim();
        apply();
      });
    }
  };

  const setupPageSearch = () => {
    const main = document.querySelector("main");
    if (!main) return;
    const isDocs = /documents\.html/i.test(location.pathname) || document.title.includes("有用文件");
    const isActs = !!document.querySelector(".album-block");
    if (!isDocs && !isActs) return;
    if (document.getElementById("page-search")) return;
    const box = document.createElement("label");
    box.className = "site-search page-search";
    box.innerHTML = `<span class="visually-hidden">搜尋本頁</span><input type="search" id="page-search" placeholder="${isActs ? "搜尋相簿或貼文標題…" : "搜尋文件名稱…"}" autocomplete="off">`;
    const h1 = main.querySelector("h1");
    if (h1) h1.insertAdjacentElement("afterend", box);
    else main.insertAdjacentElement("afterbegin", box);
    const input = box.querySelector("input");
    const empty = document.createElement("p");
    empty.className = "filter-empty";
    empty.id = "search-empty";
    empty.hidden = true;
    empty.textContent = "沒有符合的項目。";
    box.insertAdjacentElement("afterend", empty);

    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      let visible = 0;
      if (isActs) {
        const cards = document.querySelectorAll(".album-card");
        const nodes = cards.length ? cards : document.querySelectorAll(".album-block tbody tr");
        nodes.forEach((card) => {
          const ok = !q || card.textContent.toLowerCase().includes(q);
          card.dataset.searchHide = ok ? "" : "1";
          card.hidden = card.dataset.searchHide === "1" || card.dataset.filterHide === "1";
          if (!card.hidden) visible += 1;
        });
        if (window.siteAlbums) window.siteAlbums.sync();
      } else {
        document.querySelectorAll("main .page a[href], main.page a[href]").forEach((link) => {
          if (link.closest(".nav, .crumbs, .jump, .btn, header, footer, .site-search")) return;
          const block = link.closest("li, p, tr, figure") || link;
          const ok = !q || link.textContent.toLowerCase().includes(q) || (link.getAttribute("href") || "").toLowerCase().includes(q);
          block.hidden = !ok;
          if (ok) visible += 1;
        });
      }
      empty.hidden = !q || visible > 0;
    });
  };

  const boot = (posters) => {
    posterByCode = posters || {};
    toCards();
    setupLeaderFilter();
    setupPageSearch();
    if (window.siteLang) window.siteLang.apply();
  };
  fetch("images/social/posters/index.json")
    .then((response) => (response.ok ? response.json() : []))
    .then((items) => {
      const map = {};
      (items || []).forEach((item) => {
        if (item.code && item.files && item.files[0]) {
          map[item.code] = "images/social/posters/" + item.files[0];
        }
      });
      map.Dc4yPWRiIUg = "images/social/recruit-2026-1.jpg";
      boot(map);
    })
    .catch(() => boot({}));
})();

/* Leader filter, page search, activity cards — runs before nav.js filters when ordered correctly. */
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
        const img = document.createElement("img");
        img.src = thumbs[cat] || "images/hero.jpg";
        img.alt = "";
        img.loading = "lazy";
        const body = document.createElement("div");
        body.className = "album-card-body";
        const title = document.createElement("strong");
        title.textContent = link.textContent.trim();
        const meta = document.createElement("span");
        const date = row.cells[0] ? row.cells[0].textContent.trim() : "";
        const kind = row.cells[2] ? row.cells[2].textContent.trim() : (row.cells[1] && row.cells.length > 2 ? "" : "");
        const platform = row.cells[3] ? row.cells[3].textContent.trim() : "";
        meta.textContent = [date, kind || platform, platform && kind ? platform : ""].filter(Boolean).join(" · ");
        body.append(title, meta);
        card.append(img, body);
        grid.appendChild(card);
      });
      wrap.hidden = true;
      wrap.insertAdjacentElement("afterend", grid);
    });
  };

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
      <input type="search" id="leader-search" placeholder="搜尋領袖姓名…" autocomplete="off">
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
        document.querySelectorAll(".album-card").forEach((card) => {
          const ok = !q || card.textContent.toLowerCase().includes(q);
          card.dataset.searchHide = ok ? "" : "1";
          card.hidden = card.dataset.searchHide === "1" || card.dataset.filterHide === "1";
          if (!card.hidden) visible += 1;
        });
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

  toCards();
  setupLeaderFilter();
  setupPageSearch();
})();

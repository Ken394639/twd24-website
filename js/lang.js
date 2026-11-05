/* 繁體是頁面原文。简體用 OpenCC 香港繁體轉簡體。
   英文只換選單和童軍專有名詞，其餘句子保持中文。
   用詞依據：香港童軍總會《政策、組織及規條》（2024-11-15）、
   獎章表 PT/18、PT/19、PT/20、PT/22、PT/68，以及總會訓練綱要英文版。
   紅膊、綠膊是本港肩章顏色的說法，對應助理領袖和領袖。 */
(function () {
  const KEY = "24twg-lang";
  const exact = {
    "跳至主要內容": "Skip to content",
    "主頁": "Home",
    "關於本旅": "About the Group",
    "本旅簡介": "About the Group",
    "歷史回顧": "History",
    "比賽成績": "Results",
    "優異旅團": "Excellent Group",
    "旅務委員會": "Group Committee",
    "旅團領袖": "Group Leaders",
    "歷任旅長": "Past Group Scout Leaders",
    "木章持有人": "Wood Badge holders",
    "常見問題": "FAQ",
    "幼童軍": "Cub Scouts",
    "幼童軍介紹": "About Cub Scouts",
    "幼童軍領袖": "Cub Scout Leaders",
    "歷任幼童軍團長": "Past Cub Scout Leaders",
    "紫帶獎章持有人": "Purple Cord holders",
    "童軍": "Scouts",
    "童軍介紹": "About Scouts",
    "童軍領袖": "Scout Leaders",
    "歷任童軍團長": "Past Scout Leaders",
    "總領袖獎章持有人": "Chief Scout's Award holders",
    "深資童軍": "Venture Scouts",
    "深資童軍介紹": "About Venture Scouts",
    "深資童軍領袖": "Venture Scout Leaders",
    "歷任深資童軍團長": "Past Venture Scout Leaders",
    "榮譽童軍獎章持有人": "Dragon Scout Award holders",
    "樂行童軍": "Rover Scouts",
    "樂行童軍介紹": "About Rover Scouts",
    "樂行童軍領袖": "Rover Scout Leaders",
    "歷任樂行童軍團長": "Past Rover Scout Leaders",
    "貝登堡獎章持有人": "Baden-Powell Award holders",
    "旅團活動": "Group activities",
    "全部相簿": "All albums",
    "比賽": "Competitions",
    "服務": "Service",
    "訓練": "Training",
    "營地活動": "Camps",
    "遠足": "Hikes",
    "水上活動": "Water activities",
    "旅行與交流": "Travel and exchange",
    "集會與典禮": "Gatherings",
    "其他": "Other",
    "社交媒體貼文": "Social posts",
    "貼文": "Posts",
    "有用文件": "Documents",
    "制服": "Uniform",
    "制服圖": "Uniform charts",
    "縫章": "Sewing badges",
    "佩戴": "How to wear badges",
    "右袖旅章、優異旅團": "Group badge and Excellent Group flash",
    "右胸袋": "Right chest pocket",
    "服務年星": "Service stars",
    "帽章、姓名布條": "Cap badge and name tape",
    "章的樣子": "Badge shapes",
    "隊長章": "Sixer badge",
    "童軍小隊章": "Scout Patrol badge",
    "家庭章、先修章": "Family badge and Link Badge",
    "最高獎布標": "Highest award flash",
    "宗教章、公教章": "Religion badge and Catholic badge",
    "進度性獎章": "Progressive badges",
    "各支部": "Sections",
    "幼童軍佩戴": "Cub Scout uniform",
    "童軍佩戴": "Scout uniform",
    "深資佩戴": "Venture Scout uniform",
    "樂行佩戴": "Rover Scout uniform",
    "領袖佩戴": "Leader uniform",
    "訓練綱要": "Training scheme",
    "新成員": "New members",
    "家長": "Parents",
    "已宣誓成員": "Invested members",
    "領袖": "Leaders",
    "繩結": "Knots",
    "舊站存檔": "Older site archive",
    "獎章": "Awards",
    "政策與安全": "Rules and safety",
    "常用連結": "Links",
    "小遊戲": "Games",
    "社群海報": "Posters",
    "一日童軍": "A day with Scouts",
    "我會啱邊個支部？": "Which section?",
    "參加步驟": "How to join",
    "參加申請表": "Join form",
    "Flickr 相簿": "Flickr albums",
    "聯絡我們": "Contact",
    "加入我們": "Join us",
    "選單": "Menu",
    "測試": "Demo",
    "虛擬領袖": "Sample leaders",
    "能力圖樣式": "Chart styles",
    "回到最頂": "Back to top",
    "去到最底": "To the bottom",
    "關閉": "Close",
    "搜尋本頁": "Search this page",
    "搜尋相簿或貼文標題…": "Search albums or posts…",
    "搜尋文件名稱…": "Search documents…",
    "沒有符合的項目。": "No matches.",
    "尚未寫上。": "Not written yet.",
    "返回主頁": "Back to home",
    "返回旅團領袖": "Back to Group Leaders",
    "對外": "Connect",
    "日期": "Date",
    "相簿": "Album",
    "種類": "Category",
    "來源": "Source",
    "年份": "Year",
    "全部年份": "All years",
    "支部": "Section",
    "全部支部": "All sections",
    "全部": "All",
    "總會幼童軍網站": "Cub Scouts (Association)",
    "總會童軍網站": "Scouts (Association)",
    "總會深資童軍網站": "Venture Scouts (Association)",
    "總會樂行童軍網站": "Rover Scouts (Association)",
    "陪伴": "Being there",
    "帶領": "Leading",
    "技能": "Skills",
    "照顧": "Care",
    "籌劃": "Planning",
    "路程": "Path",
    "介紹": "About",
    "能力": "Strengths",
    "一句話": "In short",
    "再顯示": "Show more",
    "© 2026 荃灣第二十四旅童軍 24th Tsuen Wan Group, Scout Association of Hong Kong": "© 2026 24th Tsuen Wan Group, Scout Association of Hong Kong",
    "如果網站發生問題，請通知景sir。": "If something goes wrong with the website, please tell 景sir.",
    "本網站的相片只供瀏覽。如要轉載相片、放上網絡、作商業用途，或作超出一般私人用途的使用，請先電郵": "Photos on this website are for viewing here. To reproduce them, put them online, use them commercially, or use them beyond ordinary private use, email",
    "詢問。未獲同意而使用，本旅會要求立即刪除，並保留追究的權利。": "to ask first. Used without permission, this Group will require them to be deleted at once and reserves the right to pursue the matter.",
  };
  const terms = [
    ["荃灣第二十四旅童軍", "24th Tsuen Wan Group"],
    ["荃灣第二十四旅", "24th Tsuen Wan Group"],
    ["香港童軍總會", "Scout Association of Hong Kong"],
    ["歷任幼童軍團長", "Past Cub Scout Leaders"],
    ["歷任深資童軍團長", "Past Venture Scout Leaders"],
    ["歷任樂行童軍團長", "Past Rover Scout Leaders"],
    ["歷任童軍團長", "Past Scout Leaders"],
    ["總領袖獎章持有人", "Chief Scout's Award holders"],
    ["榮譽童軍獎章持有人", "Dragon Scout Award holders"],
    ["貝登堡獎章持有人", "Baden-Powell Award holders"],
    ["紫帶獎章持有人", "Purple Cord holders"],
    ["木章持有人", "Wood Badge holders"],
    ["金紫荊獎章", "Golden Bauhinia Award"],
    ["總領袖獎章", "Chief Scout's Award"],
    ["榮譽童軍獎章", "Dragon Scout Award"],
    ["貝登堡獎章", "Baden-Powell Award"],
    ["紫帶獎章", "Purple Cord"],
    ["深資童軍獎章", "Venture Scout Award"],
    ["樂行童軍獎章", "Rover Scout Award"],
    ["童軍探索獎章", "Scout Pathfinder Award"],
    ["童軍標準獎章", "Scout Standard Award"],
    ["童軍高級獎章", "Scout Advanced Award"],
    ["進度性獎章", "progressive badges"],
    ["幼童軍副團長", "Assistant Cub Scout Leader"],
    ["深資童軍副團長", "Assistant Venture Scout Leader"],
    ["樂行童軍副團長", "Assistant Rover Scout Leader"],
    ["童軍副團長", "Assistant Scout Leader"],
    ["幼童軍團長", "Cub Scout Leader"],
    ["深資童軍團長", "Venture Scout Leader"],
    ["樂行童軍團長", "Rover Scout Leader"],
    ["童軍團長", "Scout Leader"],
    ["副旅長", "Assistant Group Scout Leader"],
    ["歷任旅長", "Past Group Scout Leaders"],
    ["旅長", "Group Scout Leader"],
    ["小童軍", "Grasshopper Scout"],
    ["幼童軍", "Cub Scout"],
    ["深資童軍", "Venture Scout"],
    ["樂行童軍", "Rover Scout"],
    ["海童軍", "Sea Scout"],
    ["空童軍", "Air Scout"],
    ["新界地域", "New Territories Region"],
    ["荃灣區", "Tsuen Wan District"],
    ["優異旅團", "Excellent Group"],
    ["木章訓練員", "Wood Badge Trainer"],
    ["木章", "Wood Badge"],
    ["先鋒工程", "pioneering"],
    ["野外烹飪", "outdoor cooking"],
    ["宣誓禮", "investiture"],
    ["大會操", "Rally"],
    ["服務年星", "service stars"],
    ["專科徽章", "Proficiency Badge"],
    ["專科章", "Proficiency Badge"],
    ["會員章", "Membership Badge"],
    ["先修章", "Link Badge"],
    ["營藝", "campcraft"],
    ["紅膊", "red epaulettes"],
    ["綠膊", "green epaulettes"],
    ["肩章", "epaulettes"],
    ["副團長", "Assistant Leader"],
    ["團長", "Leader"],
    ["小隊長", "Patrol Leader"],
    ["旅團", "Scout Group"],
    ["本旅", "this Group"],
    ["支部", "Section"],
    ["小隊", "Patrol"],
    ["領袖", "Leader"],
    ["誓詞", "Scout Promise"],
    ["規律", "Scout Law"],
    ["步操", "foot drill"],
    ["繩結", "knots"],
    ["紮作", "lashings"],
    ["遠足", "hiking"],
    ["露營", "camping"],
    ["宿營", "overnight camp"],
    ["急救", "first aid"],
    ["地圖", "map reading"],
    ["週會", "weekly meeting"],
    ["渣馬", "Hong Kong Marathon"],
    ["旅團領袖", "Group Leaders"],
    ["旅團活動", "Group activities"],
    ["幼童軍團", "Cub Scout Pack"],
    ["深資童軍團", "Venture Scout Unit"],
    ["樂行童軍團", "Rover Scout Crew"],
    ["童軍團", "Scout Troop"],
    ["示範領袖", "Sample leader"],
    ["虛擬領袖", "Sample leader"],
    ["一句話", "In short"],
    ["深資", "Venture"],
    ["樂行", "Rover"],
    ["先鋒", "pioneering"],
    ["童軍", "Scout"],
  ].sort((a, b) => b[0].length - a[0].length);

  const originals = new WeakMap();
  const attrOriginals = new WeakMap();
  let hans = null;
  let openccPromise = null;
  let titleOriginal = "";

  const current = () => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "zh-Hans" || saved === "en" || saved === "zh-Hant") return saved;
    } catch (error) { /* keep traditional */ }
    return "zh-Hant";
  };

  const toEn = (value) => {
    const trimmed = value.trim();
    if (exact[trimmed]) return value.replace(trimmed, exact[trimmed]);
    const newest = trimmed.match(/^(.+?)（由新到舊）$/);
    if (newest && exact[newest[1]]) return value.replace(trimmed, exact[newest[1]] + " (newest first)");
    const count = trimmed.match(/^(.+?)（(\d+)）$/);
    if (count && exact[count[1]]) return value.replace(trimmed, exact[count[1]] + " (" + count[2] + ")");
    let out = value;
    terms.forEach(([zh, en]) => {
      if (out.includes(zh)) out = out.split(zh).join(en);
    });
    return out;
  };

  const render = (value) => {
    const lang = current();
    if (lang === "zh-Hant" || value == null) return value;
    if (lang === "zh-Hans") return hans ? hans(value) : value;
    return toEn(value);
  };

  const paintText = (node) => {
    if (!originals.has(node)) originals.set(node, node.nodeValue);
    node.nodeValue = render(originals.get(node));
  };

  const paint = () => {
    document.documentElement.lang = current() === "en" ? "en" : current();
    if (!titleOriginal) titleOriginal = document.title;
    document.title = render(titleOriginal);
    document.querySelectorAll("[data-zh]").forEach((el) => {
      el.textContent = render(el.dataset.zh);
    });
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || !node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (parent.closest("script, style, noscript, textarea, .lang-switch, .lang-note, [data-zh]")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(paintText);
    document.querySelectorAll("[alt], [aria-label], [title], [placeholder]").forEach((el) => {
      if (el.closest(".lang-switch, .lang-note")) return;
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
    const note = document.querySelector(".lang-note");
    if (note) note.hidden = current() !== "en";
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
      ["en", "EN"],
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

  const main = document.querySelector("main");
  if (main && !main.querySelector(".lang-note")) {
    const note = document.createElement("p");
    note.className = "lang-note";
    note.hidden = true;
    note.textContent = "Menu and Scout terms are shown in English. Other sentences stay in Chinese.";
    main.insertBefore(note, main.firstChild);
  }

  window.siteLang = {
    apply,
    text: render,
  };

  const waitingForAlbums = document.querySelector(".album-block") && !document.querySelector(".album-cards");
  if (!waitingForAlbums) apply();
})();

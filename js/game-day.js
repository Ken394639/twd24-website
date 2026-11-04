(function () {
  "use strict";

  var root = document.getElementById("game-day");
  if (!root) return;

  var NODES = {
    start: {
      scene: "清晨 · 林百欣中學",
      text: "星期六。你第一次嚟本旅集會。校門有人揮手，小隊喺操場圍成一圈。隊長笑住問：「今日你想點開始？」",
      choices: [
        { label: "即刻過嚟自我介紹", next: "intro", tags: ["brave"] },
        { label: "企喺後排偷偷觀察先", next: "watch", tags: ["careful"] },
        { label: "問邊度放背包同水樽", next: "pack", tags: ["helper"] },
      ],
    },
    intro: {
      scene: "認識小隊",
      text: "你講完名，有人拍下你膊頭：「歡迎呀！」氣氛即刻熱起嚟。下一項係小隊比賽熱身。",
      choices: [
        { label: "主動報名做傳訊員", next: "relay", tags: ["brave", "outdoor"] },
        { label: "負責計分同打氣", next: "cheer", tags: ["helper"] },
      ],
    },
    watch: {
      scene: "靜靜睇",
      text: "你睇到佢哋點集合、點互相提醒。隊長行過嚟：「唔使驚，一齊嚟。」你點頭，決定今日盡量試。",
      choices: [
        { label: "跟住入熱身遊戲", next: "relay", tags: ["outdoor"] },
        { label: "幫手執場地先", next: "cheer", tags: ["helper", "careful"] },
      ],
    },
    pack: {
      scene: "裝備就緒",
      text: "你擺好嘢，仲順手幫其他人排齊水樽。隊長豎起拇指：「有觀察力。」熱身開始！",
      choices: [
        { label: "衝入傳訊接力", next: "relay", tags: ["outdoor", "helper"] },
        { label: "留喺旁打氣", next: "cheer", tags: ["helper"] },
      ],
    },
    relay: {
      scene: "操場 · 傳訊接力",
      text: "口訊係「三條繩、兩個水樽、一個笑」。你跑到半路突然忘咗……",
      choices: [
        { label: "喊返隊友確認再跑", next: "knot", tags: ["careful", "helper"] },
        { label: "靠感覺喊完衝過終點", next: "knot-funny", tags: ["brave", "funny"] },
      ],
    },
    cheer: {
      scene: "打氣席",
      text: "你拍掌拍到手紅。有位隊友跌親，你即刻遞水同問「得唔得」——領袖睇到笑一笑。",
      choices: [
        { label: "跟大隊去學結繩", next: "knot", tags: ["helper"] },
        { label: "提議休息五分鐘再學", next: "knot", tags: ["careful", "helper"] },
      ],
    },
    knot: {
      scene: "課室走廊 · 結繩",
      text: "今日學平結。繩頭左右交叉……你第一次打得歪歪斜斜。",
      choices: [
        { label: "慢慢拆開重打，直至靚仔", next: "hike", tags: ["careful"] },
        { label: "問鄰座互評，兩人一齊改", next: "hike", tags: ["helper"] },
        { label: "打成「藝術結」展示畀大家笑", next: "hike", tags: ["funny", "brave"] },
      ],
    },
    "knot-funny": {
      scene: "傳訊意外",
      text: "你喊成「三個笑、兩條繩、一個水樽」。全隊爆笑，但照樣過關——領袖話：「溝通最緊要大聲同敢試。」",
      choices: [{ label: "含羞去學結繩", next: "knot", tags: ["funny"] }],
    },
    hike: {
      scene: "午後 · 小遠足準備",
      text: "小隊要喺附近行一圈認路標。天色有少少悶熱。隊長問邊個拎地圖。",
      choices: [
        { label: "我拎！邊行邊指", next: "trail", tags: ["brave", "outdoor"] },
        { label: "我幫手睇時間同水", next: "trail", tags: ["helper", "careful"] },
        { label: "我負責講冷笑話提神", next: "trail", tags: ["funny"] },
      ],
    },
    trail: {
      scene: "小路岔口",
      text: "前面有兩條路：一條短但斜，一條長但平。小隊等你一句話。",
      choices: [
        { label: "行斜路，當訓練！", next: "campfire", tags: ["brave", "outdoor"] },
        { label: "行平路，照顧節奏慢嘅隊友", next: "campfire", tags: ["helper", "careful"] },
        { label: "猜拳決定，輸嘅人講故事", next: "campfire", tags: ["funny"] },
      ],
    },
    campfire: {
      scene: "黃昏 · 營火氣氛（室內版）",
      text: "返到學校，大家圍坐。有人講今日笑料，有人講下次想試露營。輪到你分享一句。",
      choices: [
        { label: "「多謝你哋今日帶我。」", next: "end", tags: ["helper"] },
        { label: "「下次我要學露營爐！」", next: "end", tags: ["brave", "outdoor"] },
        { label: "「我個藝術結應該申請專利。」", next: "end", tags: ["funny"] },
      ],
    },
  };

  var TITLES = [
    {
      id: "outdoor",
      name: "遠足火花",
      line: "你今日最閃嘅係戶外同挑戰。適合繼續睇童軍／深資活動。",
    },
    {
      id: "helper",
      name: "小隊貼心人",
      line: "你成日留意隊友。小隊最需要你呢種人。",
    },
    {
      id: "brave",
      name: "敢敢試",
      line: "你唔怕出聲、唔怕帶頭。第一步已經好醒。",
    },
    {
      id: "funny",
      name: "營火笑匠",
      line: "你令氣氛變輕鬆——童軍日都要有歡愉。",
    },
    {
      id: "careful",
      name: "細心觀察員",
      line: "你睇得清、行得穩。技能同安全都啱你。",
    },
  ];

  var tags = {};
  var path = [];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function addTags(list) {
    (list || []).forEach(function (t) {
      tags[t] = (tags[t] || 0) + 1;
    });
  }

  function topTitle() {
    var best = TITLES[0];
    var score = -1;
    TITLES.forEach(function (t) {
      var s = tags[t.id] || 0;
      if (s > score) {
        score = s;
        best = t;
      }
    });
    return best;
  }

  function render(id) {
    var node = NODES[id];
    path.push(id);
    root.innerHTML = "";

    if (id === "end") {
      var title = topTitle();
      root.appendChild(el("p", "game-scene", "一日完結"));
      root.appendChild(el("h2", "game-day-title", "你今日係：「" + title.name + "」"));
      root.appendChild(el("p", null, title.line));
      var card = el("div", "game-result-card");
      card.appendChild(el("p", "game-result-kicker", "可截圖分享"));
      card.appendChild(el("h3", null, title.name + " · 24TWG"));
      card.appendChild(
        el("p", null, "荃灣第二十四旅 · 虛構小隊一日體驗（唔係真實人物故事）")
      );
      root.appendChild(card);
      var cta = el("p", "game-cta");
      var a1 = el("a", "btn", "我會啱邊個支部？");
      a1.href = "quiz.html";
      var a2 = el("a", "btn btn-dark", "其他遊戲");
      a2.href = "games.html";
      var a3 = el("a", "btn btn-dark", "填申請表");
      a3.href =
        "https://docs.google.com/forms/d/e/1FAIpQLSe7oQyxBVJnE-P_0_-1Vw58znKZBa8_nJDrMNaN5IyqU7UAsw/viewform";
      cta.appendChild(a1);
      cta.appendChild(a2);
      cta.appendChild(a3);
      root.appendChild(cta);
      var again = el("button", "btn btn-dark", "再過一日");
      again.type = "button";
      again.className = "btn btn-dark game-restart";
      again.addEventListener("click", restart);
      root.appendChild(again);
      return;
    }

    root.appendChild(el("p", "game-scene", node.scene));
    root.appendChild(el("p", "game-day-text", node.text));
    var list = el("div", "game-choices");
    node.choices.forEach(function (c) {
      var btn = el("button", "game-choice", c.label);
      btn.type = "button";
      btn.addEventListener("click", function () {
        addTags(c.tags);
        render(c.next);
        root.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      list.appendChild(btn);
    });
    root.appendChild(list);
  }

  function restart() {
    tags = {};
    path = [];
    render("start");
  }

  restart();
})();

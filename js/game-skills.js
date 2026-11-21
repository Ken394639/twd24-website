(function () {
  "use strict";

  var root = document.getElementById("game-skills");
  if (!root) return;

  var KNOTS = [
    {
      id: "reef",
      name: "平結",
      tip: "左右繩頭交叉，再反向打一次，兩結靠攏。",
      steps: ["左繩搭過右繩", "穿底拉緊成半結", "右繩搭過左繩（反向）", "穿底拉緊成平結"],
    },
    {
      id: "clove",
      name: "丁香結",
      tip: "繞柱兩圈，繩尾穿過兩圈之間拉緊。",
      steps: ["繩繞柱第一圈", "交叉再繞第二圈", "繩尾穿入兩圈中間", "兩邊拉緊固定"],
    },
    {
      id: "bowline",
      name: "稱人結（簡化）",
      tip: "兔子出洞、繞樹、返洞——固定活套。",
      steps: ["繩做一個小圈（洞）", "繩尾由下向上穿出（兔）", "繞過長繩（樹）", "再穿返小圈拉緊"],
    },
  ];

  var knotIndex = 0;
  var order = [];
  var selected = [];
  var knotScore = 0;

  var rhythm = {
    running: false,
    total: 12,
    index: 0,
    hits: 0,
    misses: 0,
    expectAt: 0,
    hitThis: false,
    pulseTimer: null,
    loopTimer: null,
    windowMs: 200,
    gap: 750,
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function stopRhythm() {
    rhythm.running = false;
    if (rhythm.pulseTimer) clearTimeout(rhythm.pulseTimer);
    if (rhythm.loopTimer) clearTimeout(rhythm.loopTimer);
    rhythm.pulseTimer = null;
    rhythm.loopTimer = null;
  }

  function showMenu() {
    stopRhythm();
    root.innerHTML = "";
    root.appendChild(el("p", "game-scene", "揀一個玩"));
    var row = el("div", "game-mode-row");
    var k = el("button", "game-mode-card", null);
    k.type = "button";
    k.appendChild(el("strong", null, "結繩排序"));
    k.appendChild(el("span", null, "將步驟撳正確次序"));
    k.addEventListener("click", startKnot);
    var r = el("button", "game-mode-card", null);
    r.type = "button";
    r.appendChild(el("strong", null, "營火節奏"));
    r.appendChild(el("span", null, "跟住節拍撳火堆"));
    r.addEventListener("click", startRhythm);
    row.appendChild(k);
    row.appendChild(r);
    root.appendChild(row);
  }

  function startKnot() {
    knotIndex = 0;
    knotScore = 0;
    renderKnot();
  }

  function renderKnot() {
    stopRhythm();
    var knot = KNOTS[knotIndex];
    order = shuffle(
      knot.steps.map(function (s, i) {
        return { text: s, i: i };
      })
    );
    selected = [];
    paintKnot();
  }

  function paintKnot() {
    var knot = KNOTS[knotIndex];
    root.innerHTML = "";
    root.appendChild(
      el("p", "game-scene", "結繩 " + (knotIndex + 1) + "／" + KNOTS.length + " · " + knot.name)
    );
    root.appendChild(el("p", "game-hint", knot.tip));
    root.appendChild(
      el("p", "game-progress-label", "已選 " + selected.length + "／" + knot.steps.length)
    );
    var track = el("div", "game-step-track");
    selected.forEach(function (s, idx) {
      track.appendChild(el("span", "game-step-chip", idx + 1 + ". " + s.text));
    });
    root.appendChild(track);
    var list = el("div", "game-choices");
    order.forEach(function (step) {
      if (
        selected.some(function (s) {
          return s.i === step.i;
        })
      )
        return;
      var btn = el("button", "game-choice", step.text);
      btn.type = "button";
      btn.addEventListener("click", function () {
        selected.push(step);
        if (selected.length === knot.steps.length) checkKnot();
        else paintKnot();
      });
      list.appendChild(btn);
    });
    root.appendChild(list);
    var back = el("button", "btn btn-dark game-restart", "返回選單");
    back.type = "button";
    back.addEventListener("click", showMenu);
    root.appendChild(back);
  }

  function checkKnot() {
    var ok = selected.every(function (s, idx) {
      return s.i === idx;
    });
    if (ok) knotScore += 1;
    root.innerHTML = "";
    root.appendChild(
      el("h2", null, ok ? "靚結！纜繩服咗你。" : "次序差少少，再試過就得。")
    );
    root.appendChild(el("p", null, "正確係：" + KNOTS[knotIndex].steps.join(" → ")));
    var next = el("button", "btn", knotIndex < KNOTS.length - 1 ? "下一條結" : "睇成績");
    next.type = "button";
    next.addEventListener("click", function () {
      if (knotIndex < KNOTS.length - 1) {
        knotIndex += 1;
        renderKnot();
      } else showKnotEnd();
    });
    root.appendChild(next);
  }

  function showKnotEnd() {
    root.innerHTML = "";
    root.appendChild(el("h2", null, "結繩完成"));
    root.appendChild(el("p", null, "你打對咗 " + knotScore + "／" + KNOTS.length + " 條。"));
    var card = el("div", "game-result-card");
    card.appendChild(el("p", "game-result-kicker", "稱號"));
    card.appendChild(
      el(
        "h3",
        null,
        knotScore === 3 ? "繩結小達人" : knotScore >= 1 ? "練習中繩手" : "繩結學徒（加油）"
      )
    );
    root.appendChild(card);
    endCtas();
  }

  function startRhythm() {
    stopRhythm();
    rhythm.index = 0;
    rhythm.hits = 0;
    rhythm.misses = 0;
    rhythm.running = true;
    rhythm.hitThis = false;
    renderRhythmShell();
    rhythm.loopTimer = setTimeout(tickBeat, 600);
  }

  function renderRhythmShell() {
    root.innerHTML = "";
    root.appendChild(el("p", "game-scene", "營火節奏 · 撳中拍子"));
    root.appendChild(el("p", "game-hint", "光圈一亮就撳。連中會旺啲。"));
    var stage = el("div", "campfire-stage");
    var fire = el("button", "campfire-btn", null);
    fire.type = "button";
    fire.setAttribute("aria-label", "跟拍撳營火");
    fire.appendChild(el("span", "campfire-flame", ""));
    fire.appendChild(el("span", "campfire-logs", ""));
    fire.addEventListener("click", hitBeat);
    stage.appendChild(fire);
    stage.appendChild(el("div", "campfire-pulse", ""));
    root.appendChild(stage);
    root.appendChild(el("p", "campfire-score", scoreText()));
    var stop = el("button", "btn btn-dark game-restart", "結束／返回");
    stop.type = "button";
    stop.addEventListener("click", function () {
      stopRhythm();
      showRhythmEnd();
    });
    root.appendChild(stop);
  }

  function scoreText() {
    return (
      "命中 " +
      rhythm.hits +
      " · 失手 " +
      rhythm.misses +
      " · 拍子 " +
      Math.min(rhythm.index, rhythm.total) +
      "／" +
      rhythm.total
    );
  }

  function updateScore() {
    var s = root.querySelector(".campfire-score");
    if (s) s.textContent = scoreText();
    var btn = root.querySelector(".campfire-btn");
    if (btn) btn.dataset.level = String(Math.min(3, Math.floor(rhythm.hits / 3)));
  }

  function tickBeat() {
    if (!rhythm.running) return;
    if (rhythm.index >= rhythm.total) {
      stopRhythm();
      showRhythmEnd();
      return;
    }
    if (rhythm.index > 0 && !rhythm.hitThis) rhythm.misses += 1;
    rhythm.index += 1;
    rhythm.hitThis = false;
    rhythm.expectAt = Date.now();
    pulse();
    updateScore();
    rhythm.loopTimer = setTimeout(tickBeat, rhythm.gap);
  }

  function pulse() {
    var p = root.querySelector(".campfire-pulse");
    var b = root.querySelector(".campfire-btn");
    if (p) {
      p.classList.remove("is-on");
      void p.offsetWidth;
      p.classList.add("is-on");
    }
    if (b) {
      b.classList.remove("is-flash");
      void b.offsetWidth;
      b.classList.add("is-flash");
    }
  }

  function hitBeat() {
    if (!rhythm.running || rhythm.index === 0) return;
    var delta = Math.abs(Date.now() - rhythm.expectAt);
    var b = root.querySelector(".campfire-btn");
    if (!rhythm.hitThis && delta <= rhythm.windowMs) {
      rhythm.hits += 1;
      rhythm.hitThis = true;
      if (b) b.classList.add("is-hit");
    } else if (!rhythm.hitThis) {
      rhythm.misses += 1;
      rhythm.hitThis = true;
      if (b) b.classList.add("is-miss");
    }
    setTimeout(function () {
      if (b) b.classList.remove("is-hit", "is-miss");
    }, 160);
    updateScore();
  }

  function showRhythmEnd() {
    stopRhythm();
    root.innerHTML = "";
    root.appendChild(el("h2", null, "營火散場"));
    root.appendChild(
      el("p", null, "命中 " + rhythm.hits + " 下，失手 " + rhythm.misses + " 下。")
    );
    var card = el("div", "game-result-card");
    card.appendChild(el("p", "game-result-kicker", "稱號"));
    card.appendChild(
      el(
        "h3",
        null,
        rhythm.hits >= 9 ? "營火拍子王" : rhythm.hits >= 5 ? "篝火跟拍手" : "暖場學徒"
      )
    );
    root.appendChild(card);
    endCtas();
  }

  function endCtas() {
    var cta = el("p", "game-cta");
    var a1 = el("button", "btn", "再玩技能");
    a1.type = "button";
    a1.addEventListener("click", showMenu);
    var a2 = el("a", "btn btn-dark", "其他遊戲");
    a2.href = "games.html";
    var a3 = el("a", "btn btn-dark", "一日童軍");
    a3.href = "game-day.html";
    cta.appendChild(a1);
    cta.appendChild(a2);
    cta.appendChild(a3);
    root.appendChild(cta);
  }

  showMenu();
})();

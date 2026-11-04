(function () {
  "use strict";

  var root = document.getElementById("game-hunt");
  if (!root) return;

  var SPOTS = [
    {
      id: "gate",
      x: 12,
      y: 62,
      name: "校門",
      item: "歡迎繩圈",
      blurb: "星期六集會由呢度開始。認路：荃威花園／荃灣中心行約五分鐘。",
      unlock: "join.html",
      unlockLabel: "參加步驟",
    },
    {
      id: "field",
      x: 48,
      y: 55,
      name: "操場",
      item: "小隊旗角",
      blurb: "集合、遊戲、傳訊接力好多時喺度。大聲啲、笑大聲啲。",
      unlock: "activities.html",
      unlockLabel: "旅團活動相簿",
    },
    {
      id: "hall",
      x: 72,
      y: 38,
      name: "禮堂方向",
      item: "營火木片",
      blurb: "典禮、分享、室內營火氣氛——歡愉同儀式感並存。",
      unlock: "about.html",
      unlockLabel: "本旅簡介",
    },
    {
      id: "room",
      x: 28,
      y: 30,
      name: "課室走廊",
      item: "平結練習繩",
      blurb: "結繩、進度、小隊會議——技能喺日常練習長大。",
      unlock: "game-skills.html",
      unlockLabel: "玩結繩遊戲",
    },
    {
      id: "memory",
      x: 80,
      y: 72,
      name: "時光角落",
      item: "1984 紀念章",
      blurb: "本旅創立於 1984 年。真正歷史喺「歷史回顧」——呢度只係遊戲彩蛋。",
      unlock: "record.html",
      unlockLabel: "歷史回顧",
    },
  ];

  var found = {};
  var active = null;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function countFound() {
    return Object.keys(found).length;
  }

  function render() {
    root.innerHTML = "";
    root.appendChild(
      el(
        "p",
        "game-scene",
        "尋寶進度 " + countFound() + "／" + SPOTS.length + " · 撳地圖光點"
      )
    );

    var map = el("div", "hunt-map");
    map.setAttribute("role", "img");
    map.setAttribute("aria-label", "簡化校園尋寶地圖");

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("class", "hunt-svg");
    svg.innerHTML =
      '<rect class="hunt-ground" x="0" y="0" width="100" height="100" rx="2"/>' +
      '<rect class="hunt-block" x="8" y="48" width="28" height="22" rx="1"/>' +
      '<rect class="hunt-block" x="40" y="42" width="36" height="28" rx="1"/>' +
      '<rect class="hunt-block hunt-block-tall" x="62" y="18" width="26" height="30" rx="1"/>' +
      '<rect class="hunt-block" x="18" y="16" width="30" height="20" rx="1"/>' +
      '<path class="hunt-path" d="M10 70 H90 M48 70 V90 M20 40 H55"/>' +
      '<text class="hunt-label" x="14" y="60">門</text>' +
      '<text class="hunt-label" x="50" y="58">操場</text>' +
      '<text class="hunt-label" x="68" y="35">禮堂</text>' +
      '<text class="hunt-label" x="24" y="28">走廊</text>';
    map.appendChild(svg);

    SPOTS.forEach(function (spot) {
      var btn = el("button", "hunt-spot" + (found[spot.id] ? " is-found" : ""), "");
      btn.type = "button";
      btn.style.left = spot.x + "%";
      btn.style.top = spot.y + "%";
      btn.setAttribute("aria-label", spot.name + (found[spot.id] ? "（已找到）" : ""));
      btn.title = spot.name;
      btn.addEventListener("click", function () {
        openSpot(spot);
      });
      map.appendChild(btn);
    });
    root.appendChild(map);

    var bag = el("div", "hunt-bag");
    bag.appendChild(el("h2", null, "背囊"));
    var ul = el("ul", "hunt-bag-list");
    SPOTS.forEach(function (s) {
      var li = el("li", found[s.id] ? "is-got" : "", found[s.id] ? "✓ " + s.item : "？？？");
      ul.appendChild(li);
    });
    bag.appendChild(ul);
    root.appendChild(bag);

    if (active) root.appendChild(panel(active));

    if (countFound() === SPOTS.length) {
      var done = el("div", "game-result-card");
      done.appendChild(el("p", "game-result-kicker", "尋寶完成"));
      done.appendChild(el("h3", null, "校園探險家 · 24TWG"));
      done.appendChild(el("p", null, "你集齊五件彩蛋。真正加入仍然靠申請表同年齡。"));
      root.appendChild(done);
      var cta = el("p", "game-cta");
      var q = el("a", "btn", "我會啱邊個支部？");
      q.href = "quiz.html";
      var g = el("a", "btn btn-dark", "其他遊戲");
      g.href = "games.html";
      var j = el("a", "btn btn-dark", "填申請表");
      j.href =
        "https://docs.google.com/forms/d/e/1FAIpQLSe7oQyxBVJnE-P_0_-1Vw58znKZBa8_nJDrMNaN5IyqU7UAsw/viewform";
      cta.appendChild(q);
      cta.appendChild(g);
      cta.appendChild(j);
      root.appendChild(cta);
    }
  }

  function panel(spot) {
    var box = el("div", "hunt-panel");
    box.appendChild(el("h2", null, spot.name));
    box.appendChild(el("p", "hunt-item", "發現：" + spot.item));
    box.appendChild(el("p", null, spot.blurb));
    var row = el("p", "game-cta");
    if (!found[spot.id]) {
      var take = el("button", "btn", "放入背囊");
      take.type = "button";
      take.addEventListener("click", function () {
        found[spot.id] = true;
        active = spot;
        render();
      });
      row.appendChild(take);
    } else {
      var link = el("a", "btn", spot.unlockLabel);
      link.href = spot.unlock;
      row.appendChild(link);
    }
    var close = el("button", "btn btn-dark", "收起");
    close.type = "button";
    close.addEventListener("click", function () {
      active = null;
      render();
    });
    row.appendChild(close);
    box.appendChild(row);
    return box;
  }

  function openSpot(spot) {
    active = spot;
    render();
    var panelEl = root.querySelector(".hunt-panel");
    if (panelEl) panelEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  render();
})();

(function () {
  "use strict";

  var root = document.getElementById("poster-gallery");
  if (!root) return;

  var CAT_LABEL = {
    gathering: "集會與節日",
    contest: "比賽",
    training: "訓練",
    camp: "營地",
    travel: "旅行",
    service: "服務",
    hike: "遠足",
    other: "其他",
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function render(items) {
    root.innerHTML = "";
    var filter = root.getAttribute("data-filter");
    var limit = parseInt(root.getAttribute("data-limit") || "0", 10);
    var list = items;
    if (filter) {
      list = items.filter(function (it) {
        return it.cat === filter;
      });
    }
    if (limit > 0) list = list.slice(0, limit);

    var grid = el("div", "poster-grid");
    list.forEach(function (it) {
      var file = (it.files && it.files[0]) || "";
      if (!file) return;
      var card = el("article", "poster-card");
      var link = document.createElement("a");
      link.className = "poster-card-link";
      link.href = "images/social/posters/" + file;
      link.setAttribute("data-ig", it.href);
      var img = document.createElement("img");
      img.src = "images/social/posters/" + file;
      img.alt = it.title;
      img.loading = "lazy";
      img.width = 540;
      img.height = 675;
      link.appendChild(img);
      card.appendChild(link);
      card.appendChild(el("h3", null, it.title));
      var meta = el("p", "poster-meta", CAT_LABEL[it.cat] || it.cat);
      card.appendChild(meta);
      var row = el("p", "poster-links");
      var ig = document.createElement("a");
      ig.href = it.href;
      ig.textContent = "Instagram 原帖";
      ig.rel = "noopener";
      row.appendChild(ig);
      if (it.files.length > 1) {
        row.appendChild(document.createTextNode(" · "));
        var more = document.createElement("a");
        more.href = "posters.html#" + it.id;
        more.textContent = "共 " + it.files.length + " 張";
        row.appendChild(more);
      }
      card.appendChild(row);
      card.id = it.id;
      grid.appendChild(card);

      if (root.getAttribute("data-expand") === "1" && it.files.length > 1) {
        var extras = el("div", "poster-extras");
        it.files.slice(1).forEach(function (f) {
          var a = document.createElement("a");
          a.href = "images/social/posters/" + f;
          var im = document.createElement("img");
          im.src = "images/social/posters/" + f;
          im.alt = it.title + " 續圖";
          im.loading = "lazy";
          a.appendChild(im);
          extras.appendChild(a);
        });
        card.appendChild(extras);
      }
    });
    root.appendChild(grid);
  }

  function fail() {
    if (root.querySelector(".poster-grid")) return;
    root.appendChild(el("p", null, "暫時未能載入海報。請稍後再試，或到 Instagram @24twg 睇。"));
  }

  function show(items) {
    if (!items || !items.length) {
      fail();
      return;
    }
    try {
      render(items);
    } catch (e) {
      fail();
    }
  }

  if (window.TWG_POSTERS && window.TWG_POSTERS.length) {
    show(window.TWG_POSTERS);
    return;
  }

  fetch("images/social/posters/index.json")
    .then(function (r) {
      if (!r.ok) throw new Error("posters");
      return r.json();
    })
    .then(show)
    .catch(fail);
})();

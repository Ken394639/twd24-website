(function () {
  "use strict";

  var APPLY =
    "https://docs.google.com/forms/d/e/1FAIpQLSe7oQyxBVJnE-P_0_-1Vw58znKZBa8_nJDrMNaN5IyqU7UAsw/viewform";

  var SECTIONS = {
    cub: {
      id: "cub",
      name: "幼童軍",
      age: "6–11 歲",
      time: "星期六 15:00–17:00",
      page: "cub.html",
      blurb: "目標係寓學習於遊戲。學綁鞋帶、平結、手作同短途遠足，也學盡所能、先顧別人。適合小學校齡。",
    },
    scout: {
      id: "scout",
      name: "童軍",
      age: "11–15 歲",
      time: "星期六 14:00–17:00",
      page: "scout.html",
      blurb: "目標係實踐中學習。學摺衫、繩結、先鋒、露營同遠足，也學帶人同尊重他人。適合中學前半段。",
    },
    venture: {
      id: "venture",
      name: "深資童軍",
      age: "15–20 歲",
      time: "星期六 14:00–17:00",
      page: "venture.html",
      blurb: "目標係自務自治，自立自強。自己籌遠足、烹飪同交流，也學同人共事。適合中學後半段至青年。",
    },
    rover: {
      id: "rover",
      name: "樂行童軍",
      age: "18–25 歲",
      time: "每月一次",
      page: "rover.html",
      blurb: "目標係自強不息，服務社群。按需要再用露營、急救同籌辦，重點係服務同幫其他支部。適合大學生同在職青年。",
    },
  };

  var QUESTIONS = [
    {
      key: "who",
      title: "你係邊位嚟睇？",
      hint: "只係幫我哋調整講法，唔會儲存資料。",
      options: [
        { value: "parent", label: "家長／監護人" },
        { value: "self", label: "自己想參加" },
        { value: "friend", label: "朋友／同學介紹" },
      ],
    },
    {
      key: "age",
      title: "參加者大約幾歲？",
      hint: "年齡係對支部嘅最重要條件。",
      options: [
        { value: "under6", label: "未滿 6 歲" },
        { value: "6-10", label: "6–10 歲" },
        { value: "11", label: "剛滿／約 11 歲" },
        { value: "12-14", label: "12–14 歲" },
        { value: "15", label: "剛滿／約 15 歲" },
        { value: "16-17", label: "16–17 歲" },
        { value: "18-20", label: "18–20 歲" },
        { value: "21-25", label: "21–25 歲" },
        { value: "over25", label: "超過 25 歲" },
      ],
    },
    {
      key: "saturday",
      title: "星期六下午得唔得閒？",
      hint: "幼童軍、童軍、深資多數喺星期六集會。",
      options: [
        { value: "yes", label: "得，多數星期六得閒" },
        { value: "sometimes", label: "有時得閒" },
        { value: "no", label: "星期六好難得閒" },
      ],
    },
    {
      key: "interest",
      title: "最想試邊樣？",
      hint: "揀最接近嗰個就得，唔使好精準。",
      options: [
        { value: "play", label: "遊戲、小隊、學生活技能" },
        { value: "outdoor", label: "遠足、露營、戶外挑戰" },
        { value: "lead", label: "策劃活動、帶隊、服務社區" },
        { value: "flex", label: "想參與但時間要靈活啲" },
      ],
    },
  ];

  var root = document.getElementById("section-quiz");
  if (!root) return;

  var answers = {};
  var step = 0;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function primaryFromAge(age) {
    switch (age) {
      case "6-10":
        return { primary: "cub", alt: null, note: null };
      case "11":
        return {
          primary: "scout",
          alt: "cub",
          note: "剛滿 11 歲可視乎情況留喺幼童軍或轉童軍，申請後領袖會同你傾。",
        };
      case "12-14":
        return { primary: "scout", alt: null, note: null };
      case "15":
        return {
          primary: "venture",
          alt: "scout",
          note: "約 15 歲可考慮童軍或深資，視乎進度同意願，領袖會協助銜接。",
        };
      case "16-17":
        return { primary: "venture", alt: null, note: null };
      case "18-20":
        return {
          primary: "venture",
          alt: "rover",
          note: "18–20 歲可揀深資或樂行；深資逢星期六，樂行每月一次。",
        };
      case "21-25":
        return { primary: "rover", alt: null, note: null };
      default:
        return null;
    }
  }

  function refine(result, interest, saturday) {
    if (!result) return result;
    if (result.primary === "venture" && interest === "flex") {
      if (answers.age === "18-20" || answers.age === "21-25") {
        result = {
          primary: "rover",
          alt: result.primary === "venture" ? "venture" : result.alt,
          note:
            (result.note ? result.note + " " : "") +
            "你較睇重時間彈性，樂行每月一次可能更啱。",
        };
      }
    }
    if (interest === "lead" && (result.primary === "scout" || result.primary === "cub")) {
      result.note =
        (result.note ? result.note + " " : "") +
        "想學策劃同帶領，可喺支部入面一步步做到隊長／幹部。";
    }
    if (saturday === "no" && result.primary !== "rover") {
      result.note =
        (result.note ? result.note + " " : "") +
        "本旅主要支部喺星期六集會；若星期六長期唔得閒，可先電郵查詢有冇其他安排。";
    }
    return result;
  }

  function renderProgress() {
    var bar = root.querySelector(".quiz-progress");
    if (!bar) return;
    var pct = Math.round((step / QUESTIONS.length) * 100);
    bar.style.width = pct + "%";
    bar.setAttribute("aria-valuenow", String(pct));
  }

  function renderQuestion() {
    var q = QUESTIONS[step];
    var panel = root.querySelector(".quiz-panel");
    panel.innerHTML = "";

    var heading = el("h2", "quiz-q-title", q.title);
    heading.id = "quiz-q-heading";
    panel.appendChild(heading);
    if (q.hint) panel.appendChild(el("p", "quiz-hint", q.hint));

    var list = el("div", "quiz-options");
    list.setAttribute("role", "group");
    list.setAttribute("aria-labelledby", "quiz-q-heading");

    q.options.forEach(function (opt) {
      var btn = el("button", "quiz-option", opt.label);
      btn.type = "button";
      btn.addEventListener("click", function () {
        answers[q.key] = opt.value;
        step += 1;
        if (step >= QUESTIONS.length) renderResult();
        else {
          renderProgress();
          renderQuestion();
        }
      });
      list.appendChild(btn);
    });
    panel.appendChild(list);

    var nav = el("div", "quiz-nav");
    if (step > 0) {
      var back = el("button", "btn btn-dark", "上一題");
      back.type = "button";
      back.addEventListener("click", function () {
        step -= 1;
        delete answers[QUESTIONS[step].key];
        renderProgress();
        renderQuestion();
      });
      nav.appendChild(back);
    }
    panel.appendChild(nav);
    renderProgress();
  }

  function card(section, label) {
    var art = el("article", "quiz-result-card");
    if (label) art.appendChild(el("p", "quiz-result-label", label));
    art.appendChild(el("h3", null, section.name));
    art.appendChild(el("p", "quiz-meta", section.age + " · " + section.time));
    art.appendChild(el("p", null, section.blurb));
    var links = el("p", "quiz-card-cta");
    var more = el("a", "btn btn-dark", "睇" + section.name + "介紹");
    more.href = section.page;
    links.appendChild(more);
    art.appendChild(links);
    return art;
  }

  function renderResult() {
    var panel = root.querySelector(".quiz-panel");
    panel.innerHTML = "";
    renderProgress();
    var bar = root.querySelector(".quiz-progress");
    if (bar) {
      bar.style.width = "100%";
      bar.setAttribute("aria-valuenow", "100");
    }

    var age = answers.age;
    if (age === "under6") {
      panel.appendChild(el("h2", null, "暫時未到年齡"));
      panel.appendChild(
        el(
          "p",
          null,
          "本旅幼童軍由 6 歲起收。到咗年齡再嚟填表就得；而家可以先睇本旅簡介同活動相片。"
        )
      );
      panel.appendChild(ctaRow(false));
      panel.appendChild(restartBtn());
      return;
    }
    if (age === "over25") {
      panel.appendChild(el("h2", null, "樂行年齡以上"));
      panel.appendChild(
        el(
          "p",
          null,
          "青少年支部最高至 25 歲。若你想做領袖或義工，歡迎電郵查詢；成年人參與方式同青少年支部唔同。"
        )
      );
      var contact = el("p", "quiz-card-cta");
      var mail = el("a", "btn", "電郵查詢");
      mail.href = "mailto:info@24twg.org";
      contact.appendChild(mail);
      var about = el("a", "btn btn-dark", "本旅簡介");
      about.href = "about.html";
      contact.appendChild(about);
      panel.appendChild(contact);
      panel.appendChild(restartBtn());
      return;
    }

    var result = refine(primaryFromAge(age), answers.interest, answers.saturday);
    var primary = SECTIONS[result.primary];
    var who = answers.who;

    panel.appendChild(el("h2", null, "建議你睇：" + primary.name));
    if (who === "parent") {
      panel.appendChild(
        el("p", "quiz-hint", "家長版重點：對好年齡同星期六時間，再填申請表等旅團聯絡。")
      );
    } else if (who === "friend") {
      panel.appendChild(
        el("p", "quiz-hint", "可以同朋友一齊睇介紹；申請表要由參加者／家長填。")
      );
    }

    panel.appendChild(card(primary, "最啱先睇"));
    if (result.alt && SECTIONS[result.alt]) {
      panel.appendChild(card(SECTIONS[result.alt], "都可以了解"));
    }
    if (result.note) panel.appendChild(el("p", "quiz-note", result.note));

    panel.appendChild(
      el(
        "p",
        "quiz-place",
        "集會：仁濟醫院林百欣中學（荃威花園／荃灣中心步行約五分鐘）· 廣東話"
      )
    );
    panel.appendChild(ctaRow(true));
    panel.appendChild(restartBtn());
  }

  function ctaRow(showApply) {
    var row = el("p", "quiz-card-cta glance-cta");
    if (showApply) {
      var apply = el("a", "btn", "填申請表");
      apply.href = APPLY;
      row.appendChild(apply);
    }
    var join = el("a", "btn btn-dark", "參加步驟");
    join.href = "join.html";
    row.appendChild(join);
    var glance = el("a", "btn btn-dark", "集會時間");
    glance.href = "index.html#join-glance";
    row.appendChild(glance);
    return row;
  }

  function restartBtn() {
    var wrap = el("p", "quiz-restart");
    var btn = el("button", "btn btn-dark", "再玩一次");
    btn.type = "button";
    btn.addEventListener("click", function () {
      answers = {};
      step = 0;
      renderProgress();
      renderQuestion();
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    wrap.appendChild(btn);
    return wrap;
  }

  renderQuestion();
})();

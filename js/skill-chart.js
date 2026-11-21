const skills = [
  { name: "人際關係", note: "週會坐在一起、出營同行、聽成員傾偈、讓新成員敢開口問" },
  { name: "領導才", note: "帶週會、帶小隊、帶遠足和露營、比賽前陪練" },
  { name: "技能", note: "步操、繩結、紮作、先鋒、地圖、遠足、露營、野外烹飪、急救" },
  { name: "服務", note: "社區服務、渣馬補給、畢業禮和大會的崗位、為旅團做事" },
  { name: "關懷", note: "看顧較年幼的成員、集合點名、遊戲、安全和情緒" },
  { name: "策劃", note: "行程和人數、集合時間、惡劣天氣安排、崗位和更表" },
];
const skillBlue = "#0e6abd";
const skillFont = "Microsoft JhengHei, PingFang TC, Noto Sans TC, sans-serif";

function drawSkillChart(host) {
  const values = (host.dataset.skills || "1 1 1 1 1 1").trim().split(/\s+/).map(Number);
  const cx = 220;
  const cy = 220;
  const radius = 108;
  const at = (i, scale) => {
    const angle = -Math.PI / 2 + (i * Math.PI) / 3;
    return [cx + Math.cos(angle) * radius * scale, cy + Math.sin(angle) * radius * scale];
  };
  const pts = (scales) => scales.map((scale, i) => at(i, scale).map((n) => n.toFixed(1)).join(",")).join(" ");
  const ring = (scale, attrs) => `<polygon points="${pts([scale, scale, scale, scale, scale, scale])}" fill="none" ${attrs}/>`;
  const spokes = [0, 1, 2, 3, 4, 5].map((i) => {
    const [x, y] = at(i, 1);
    return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#d5e3f2" stroke-width="1"/>`;
  }).join("");

  let minX = cx;
  let minY = cy;
  let maxX = cx;
  let maxY = cy;
  const include = (x, y, slack = 12) => {
    minX = Math.min(minX, x - slack);
    minY = Math.min(minY, y - slack);
    maxX = Math.max(maxX, x + slack);
    maxY = Math.max(maxY, y + slack);
  };
  [0.25, 0.5, 0.75, 1].forEach((scale) => {
    for (let i = 0; i < 6; i += 1) {
      const [x, y] = at(i, scale);
      include(x, y, 4);
    }
  });

  const arms = skills.map((skill, i) => {
    const value = values[i];
    const tip = at(i, value);
    const score = Math.round(value * 100);
    const nameScale = Math.max(1.52, value + 0.38);
    const scoreScale = Math.max(1.12, Math.min(value + 0.06, nameScale - 0.3));
    const [sx, sy] = at(i, scoreScale);
    const [lx, ly] = at(i, nameScale);
    include(tip[0], tip[1], 8);
    include(lx, ly, 18 + skill.name.length * 16);
    include(sx, sy, 18);
    const edge = Math.max(1.02, value);
    const left = (() => {
      const angle = -Math.PI / 2 + ((i - 0.5) * Math.PI) / 3;
      return [cx + Math.cos(angle) * radius * edge, cy + Math.sin(angle) * radius * edge];
    })();
    const right = (() => {
      const angle = -Math.PI / 2 + ((i + 0.5) * Math.PI) / 3;
      return [cx + Math.cos(angle) * radius * edge, cy + Math.sin(angle) * radius * edge];
    })();
    const cell = [[cx, cy], left, tip, right].map((p) => p.map((n) => n.toFixed(1)).join(",")).join(" ");
    const outward = Math.cos(-Math.PI / 2 + (i * Math.PI) / 3);
    const nameAnchor = outward > 0.3 ? "start" : outward < -0.3 ? "end" : "middle";
    return `<g class="skill-arm" data-i="${i}" tabindex="0">
      <polygon class="skill-cell" points="${cell}" fill="transparent"/>
      <circle class="skill-dot" cx="${tip[0].toFixed(1)}" cy="${tip[1].toFixed(1)}" r="3.5" fill="${skillBlue}"/>
      <text class="skill-score" x="${sx.toFixed(1)}" y="${sy.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="16" font-weight="700" fill="#333" font-family="${skillFont}">${score}</text>
      <text class="skill-name" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${nameAnchor}" dominant-baseline="middle" font-size="15" fill="#333" font-family="${skillFont}">${skill.name}</text>
    </g>`;
  }).join("");

  const summary = skills.map((skill, i) => `${skill.name} ${Math.round(values[i] * 100)}`).join("、");
  const vbX = Math.floor(minX);
  const vbY = Math.floor(minY);
  const vbW = Math.ceil(maxX - minX);
  const vbH = Math.ceil(maxY - minY);
  host.insertAdjacentHTML(
    "afterbegin",
    `<svg viewBox="${vbX} ${vbY} ${vbW} ${vbH}" role="img" aria-label="六項能力：${summary}。">${spokes}${ring(0.25, 'stroke="#c5d6ea" stroke-width="1" stroke-dasharray="4 4"')}${ring(0.5, 'stroke="#c5d6ea" stroke-width="1" stroke-dasharray="4 4"')}${ring(0.75, 'stroke="#c5d6ea" stroke-width="1" stroke-dasharray="4 4"')}${ring(1, 'stroke="#c5d6ea" stroke-width="1" stroke-dasharray="4 4"')}<polygon class="skill-fill" points="${pts(values)}" fill="rgba(14,106,189,0.26)" stroke="${skillBlue}" stroke-width="2.4" stroke-linejoin="miter" stroke-miterlimit="8"/>${arms}</svg>`
  );
  const canvas = host.querySelector("canvas");
  if (canvas) canvas.remove();

  const tip = document.createElement("p");
  tip.className = "skill-tip";
  host.appendChild(tip);

  const clear = () => {
    host.querySelectorAll(".skill-arm.is-hot").forEach((arm) => arm.classList.remove("is-hot"));
    tip.classList.remove("is-shown");
  };
  const show = (index) => {
    const skill = skills[index];
    if (!skill) return;
    host.querySelectorAll(".skill-arm").forEach((arm) => {
      arm.classList.toggle("is-hot", Number(arm.dataset.i) === index);
    });
    tip.replaceChildren();
    const name = document.createElement("strong");
    name.textContent = skill.name;
    name.style.color = skillBlue;
    tip.append(name, document.createTextNode("：" + skill.note));
    tip.classList.add("is-shown");
  };

  const bind = (node) => {
    const index = () => Number(node.dataset.i);
    let touch = false;
    node.addEventListener("pointerdown", (event) => {
      touch = event.pointerType === "touch";
    });
    node.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      show(index());
    });
    node.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "touch") return;
      clear();
    });
    node.addEventListener("click", () => {
      if (!touch) return;
      const already = node.classList.contains("is-hot");
      clear();
      if (!already) show(index());
    });
    node.addEventListener("focus", () => {
      if (touch) return;
      show(index());
    });
    node.addEventListener("blur", () => {
      if (touch) return;
      clear();
    });
  };
  host.querySelectorAll(".skill-arm").forEach(bind);
}

document.querySelectorAll(".skill-chart").forEach((host) => {
  const canvas = host.querySelector("canvas.skill-radar");
  if (canvas && canvas.dataset.skills) host.dataset.skills = canvas.dataset.skills;
  if (!host.dataset.skills || host.querySelector("svg")) return;
  drawSkillChart(host);
});

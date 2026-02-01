// TeamStreamTeam - main.js
// This JS is intentionally small: it handles nav "active" state,
// renders the team grid and store grid from JSON, and updates the footer year.

function safeText(s){
  return String(s ?? "").replace(/[<>]/g, "");
}

function setActiveNav(){
  const page = document.body.dataset.page;
  if(!page) return;
  document.querySelectorAll("[data-nav]").forEach(a => {
    const key = a.getAttribute("data-nav");
    a.classList.toggle("active", key === page);
  });
}

function setYear(){
  const el = document.getElementById("year");
  if(el) el.textContent = String(new Date().getFullYear());
}

function buildIconButton({root, kind, label, href, staticOnly}){
  const iconPath = `${root}assets/logos/${kind}.png`;
  const a = document.createElement(staticOnly ? "span" : "a");
  a.className = `icon-btn ${staticOnly ? "static" : ""}`;
  if(!staticOnly){
    a.href = href || "#";
    a.target = "_blank";
    a.rel = "noopener";
  }
  a.innerHTML = `
    <img src="${iconPath}" alt="${safeText(label)} logo" loading="lazy" />
    <span>${safeText(label)}</span>
  `;
  return a;
}

async function renderTeam(){
  const grid = document.getElementById("team-grid");
  if(!grid) return;

  const root = document.body.dataset.root || "./";
  const url = `${root}data/team.json`;

  try{
    const res = await fetch(url, { cache: "no-store" });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const team = await res.json();

    grid.innerHTML = "";
    team.forEach(member => {
      const card = document.createElement("article");
      card.className = "team-card card";

      const pfpPath = `${root}assets/pfps/${member.id}.png`;

      const name = document.createElement("h3");
      name.className = "team-name";
      name.textContent = member.name;

      const pfp = document.createElement("div");
      pfp.className = "pfp";
      // If the image fails, we show a friendly fallback.
      pfp.innerHTML = `
        <img src="${pfpPath}" alt="${safeText(member.name)} profile picture" loading="lazy" />
        <div class="pfp-fallback" hidden>
          Add: <code>${safeText(pfpPath)}</code>
        </div>
      `;

      const iconRow = document.createElement("div");
      iconRow.className = "icon-row";
      iconRow.appendChild(buildIconButton({root, kind:"youtube",  label:"YouTube",  href: member.youtube}));
      iconRow.appendChild(buildIconButton({root, kind:"twitter",  label:"X",        href: member.twitter}));
      iconRow.appendChild(buildIconButton({root, kind:"abstract", label:"Abstract", href: member.abstract}));
      iconRow.appendChild(buildIconButton({root, kind:"discord",  label:"Discord",  staticOnly: true}));

      const handle = document.createElement("div");
      handle.className = "discord-handle";
      handle.textContent = member.discord || "";

      const blurb = document.createElement("p");
      blurb.className = "blurb";
      blurb.textContent = member.blurb || "";

      card.appendChild(name);
      card.appendChild(pfp);
      card.appendChild(iconRow);
      card.appendChild(handle);
      card.appendChild(blurb);
      grid.appendChild(card);

      const img = pfp.querySelector("img");
      const fallback = pfp.querySelector(".pfp-fallback");
      img.addEventListener("error", () => {
        img.remove();
        fallback.hidden = false;
      });
    });
  }catch(err){
    grid.innerHTML = `
      <div class="card" style="padding:14px;">
        <strong>Couldn’t load team data.</strong>
        <div style="margin-top:6px; color: rgba(235,244,252,0.72);">
          Make sure <code>${safeText(url)}</code> exists and GitHub Pages is serving it.
        </div>
      </div>
    `;
  }
}

async function renderProducts(){
  const grid = document.getElementById("product-grid");
  if(!grid) return;

  const root = document.body.dataset.root || "./";
  const url = `${root}data/products.json`;

  try{
    const res = await fetch(url, { cache: "no-store" });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const products = await res.json();

    grid.innerHTML = "";
    products.forEach(p => {
      const card = document.createElement("article");
      card.className = "product-card card";

      const thumb = document.createElement("div");
      thumb.className = "product-thumb" + (p.image ? "" : " placeholder");
      if(p.image){
        // image can be absolute URL or relative to site root.
        const src = p.image.startsWith("http") ? p.image : `${root}${p.image.replace(/^\/?/, "")}`;
        thumb.innerHTML = `<img src="${src}" alt="${safeText(p.name)}" loading="lazy" />`;
      }else{
        thumb.innerHTML = `<div style="padding:14px; color: rgba(235,244,252,0.72); text-align:center;">
          Product image (optional)
        </div>`;
      }

      const name = document.createElement("h3");
      name.className = "product-name";
      name.textContent = p.name;

      const meta = document.createElement("div");
      meta.className = "product-meta";
      meta.innerHTML = `
        <span>${safeText(p.category || "Merch")}</span>
        <span>${safeText(p.price || "")}</span>
      `;

      const btn = document.createElement("a");
      btn.className = "btn";
      btn.href = p.url || "#";
      btn.target = "_blank";
      btn.rel = "noopener";
      btn.textContent = p.cta || "View";

      card.appendChild(thumb);
      card.appendChild(name);
      card.appendChild(meta);
      card.appendChild(btn);
      grid.appendChild(card);
    });

  }catch(err){
    grid.innerHTML = `
      <div class="card" style="padding:14px;">
        <strong>Couldn’t load products.</strong>
        <div style="margin-top:6px; color: rgba(235,244,252,0.72);">
          Add your products to <code>${safeText(url)}</code>.
        </div>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  setYear();
  renderTeam();
  renderProducts();
});

// ================================================================
// EDIT TRACK NAMES HERE.
// When you decide the final names for Track 02 and Track 04,
// replace only the "title" values below.
// You can also edit the genre / note text here.
// ================================================================

const tracks = [
  {
    title: "Ain't U Feel",
    genre: "Electronic / Instrumental",
    note: "Composition · Arrangement · Production",
    src: "audio/01-aint-u-feel.mp3"
  },
  {
    title: "TRACK NAME 02",
    genre: "Electronic / Atmospheric",
    note: "Composition · Arrangement · Production",
    src: "audio/02-track-02.mp3"
  },
  {
    title: "Collapse",
    genre: "Cinematic Electronic / Instrumental",
    note: "Composition · Arrangement · Production",
    src: "audio/03-collapse.mp3"
  },
  {
    title: "TRACK NAME 04",
    genre: "Soundtrack-Oriented / Electronic",
    note: "Composition · Arrangement · Production",
    src: "audio/04-track-04.mp3"
  }
];

const list = document.getElementById("track-list");
const players = [];

function icon(playing) {
  return playing
    ? `<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="2.5" y="2" width="3" height="10" rx="1" fill="currentColor"/><rect x="8.5" y="2" width="3" height="10" rx="1" fill="currentColor"/></svg>`
    : `<svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true"><path d="M4 2.6v9.8L12 7.5 4 2.6Z" fill="currentColor"/></svg>`;
}

function timeString(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

tracks.forEach((track, i) => {
  const row = document.createElement("article");
  row.className = "track";
  row.innerHTML = `
    <div class="track-index">${String(i + 1).padStart(2, "0")}</div>
    <div>
      <h3 class="track-title">${track.title}</h3>
    </div>
    <div class="track-meta">
      <div>${track.genre}</div>
      <div>${track.note}</div>
    </div>
    <div class="player">
      <button class="play-button" type="button" aria-label="Play ${track.title}">
        ${icon(false)}
      </button>
      <div class="progress-wrap" aria-label="Seek through ${track.title}">
        <div class="progress"><div class="progress-fill"></div></div>
      </div>
      <div class="track-time">0:00</div>
      <audio preload="metadata" src="${track.src}"></audio>
    </div>
  `;
  list.appendChild(row);

  const audio = row.querySelector("audio");
  const button = row.querySelector(".play-button");
  const fill = row.querySelector(".progress-fill");
  const progressWrap = row.querySelector(".progress-wrap");
  const time = row.querySelector(".track-time");

  players.push({ audio, button, fill, time });

  audio.addEventListener("loadedmetadata", () => {
    time.textContent = timeString(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    fill.style.width = `${pct}%`;
    time.textContent = timeString(audio.currentTime);
  });

  audio.addEventListener("ended", () => {
    button.classList.remove("is-playing");
    button.innerHTML = icon(false);
    button.setAttribute("aria-label", `Play ${track.title}`);
    fill.style.width = "0%";
    time.textContent = timeString(audio.duration);
  });

  button.addEventListener("click", () => {
    players.forEach((p) => {
      if (p.audio !== audio && !p.audio.paused) {
        p.audio.pause();
        p.button.classList.remove("is-playing");
        p.button.innerHTML = icon(false);
      }
    });

    if (audio.paused) {
      audio.play();
      button.classList.add("is-playing");
      button.innerHTML = icon(true);
      button.setAttribute("aria-label", `Pause ${track.title}`);
    } else {
      audio.pause();
      button.classList.remove("is-playing");
      button.innerHTML = icon(false);
      button.setAttribute("aria-label", `Play ${track.title}`);
    }
  });

  progressWrap.addEventListener("click", (event) => {
    if (!audio.duration) return;
    const rect = progressWrap.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

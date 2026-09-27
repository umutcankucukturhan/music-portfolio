// ================================================================
// MUSIC PORTFOLIO — AUDIO PLAYER
// Umut Can Kucukturhan
// ================================================================

const tracks = [
  {
    title: "Ain't U Feel",
    genre: "Electronic / Instrumental",
    note: "Composition · Arrangement · Production",
    src: "audio/01-aint-u-feel.mp3"
  },
  {
    title: "Never Give Up",
    genre: "Electronic / Atmospheric",
    note: "Composition · Arrangement · Production",
    src: "audio/02-never-give-up.mp3"
  },
  {
    title: "Collapse",
    genre: "Cinematic Electronic / Instrumental",
    note: "Composition · Arrangement · Production",
    src: "audio/03-collapse.mp3"
  },
  {
    title: "Intro",
    genre: "Soundtrack-Oriented / Electronic",
    note: "Composition · Arrangement · Production",
    src: "audio/04-intro.mp3"
  }
];

const list = document.getElementById("track-list");
const players = [];

// ------------------------------------------------
// Icons
// ------------------------------------------------

function icon(playing) {
  return playing
    ? `
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <rect x="2.5" y="2" width="3" height="10" rx="1" fill="currentColor"/>
        <rect x="8.5" y="2" width="3" height="10" rx="1" fill="currentColor"/>
      </svg>
    `
    : `
      <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true">
        <path d="M4 2.6v9.8L12 7.5 4 2.6Z" fill="currentColor"/>
      </svg>
    `;
}

// ------------------------------------------------
// Time formatting
// ------------------------------------------------

function timeString(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${secs}`;
}

function timeDisplay(current, duration) {
  return `${timeString(current)} / ${timeString(duration)}`;
}

// ------------------------------------------------
// Stop every player except selected one
// ------------------------------------------------

function pauseOtherPlayers(currentAudio) {
  players.forEach((player) => {
    if (player.audio !== currentAudio && !player.audio.paused) {
      player.audio.pause();
    }
  });
}

// ------------------------------------------------
// Build player rows
// ------------------------------------------------

tracks.forEach((track, index) => {
  const row = document.createElement("article");
  row.className = "track";

  row.innerHTML = `
    <div class="track-index">
      ${String(index + 1).padStart(2, "0")}
    </div>

    <div class="track-heading">
      <h3 class="track-title">${track.title}</h3>
    </div>

    <div class="track-meta">
      <div>${track.genre}</div>
      <div>${track.note}</div>
    </div>

    <div class="player">

      <button
        class="play-button"
        type="button"
        aria-label="Play ${track.title}"
      >
        ${icon(false)}
      </button>

      <div
        class="progress-wrap"
        role="slider"
        tabindex="0"
        aria-label="Seek through ${track.title}"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="0"
      >
        <div class="progress">
          <div class="progress-fill"></div>
        </div>
      </div>

      <div class="track-time">
        0:00 / 0:00
      </div>

      <audio
        preload="metadata"
        src="${track.src}"
      ></audio>

    </div>
  `;

  list.appendChild(row);

  const audio = row.querySelector("audio");
  const button = row.querySelector(".play-button");
  const fill = row.querySelector(".progress-fill");
  const progressWrap = row.querySelector(".progress-wrap");
  const time = row.querySelector(".track-time");

  const player = {
    audio,
    button,
    fill,
    progressWrap,
    time,
    track
  };

  players.push(player);

  // ------------------------------------------------
  // Metadata loaded
  // ------------------------------------------------

  audio.addEventListener("loadedmetadata", () => {
    time.textContent = timeDisplay(
      audio.currentTime,
      audio.duration
    );
  });

  // ------------------------------------------------
  // Playing progress
  // ------------------------------------------------

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;

    const percentage =
      (audio.currentTime / audio.duration) * 100;

    fill.style.width = `${percentage}%`;

    progressWrap.setAttribute(
      "aria-valuenow",
      Math.round(percentage)
    );

    time.textContent = timeDisplay(
      audio.currentTime,
      audio.duration
    );
  });

  // ------------------------------------------------
  // Play
  // ------------------------------------------------

  audio.addEventListener("play", () => {
    pauseOtherPlayers(audio);

    button.classList.add("is-playing");
    button.innerHTML = icon(true);

    button.setAttribute(
      "aria-label",
      `Pause ${track.title}`
    );
  });

  // ------------------------------------------------
  // Pause
  // ------------------------------------------------

  audio.addEventListener("pause", () => {
    button.classList.remove("is-playing");
    button.innerHTML = icon(false);

    button.setAttribute(
      "aria-label",
      `Play ${track.title}`
    );
  });

  // ------------------------------------------------
  // Track finished
  // ------------------------------------------------

  audio.addEventListener("ended", () => {
    audio.currentTime = 0;

    fill.style.width = "0%";

    progressWrap.setAttribute(
      "aria-valuenow",
      "0"
    );

    time.textContent = timeDisplay(
      0,
      audio.duration
    );
  });

  // ------------------------------------------------
  // Audio loading error
  // ------------------------------------------------

  audio.addEventListener("error", () => {
    row.classList.add("track-error");

    time.textContent = "Unavailable";

    button.disabled = true;

    button.setAttribute(
      "aria-label",
      `${track.title} is unavailable`
    );
  });

  // ------------------------------------------------
  // Play / pause button
  // ------------------------------------------------

  button.addEventListener("click", async () => {
    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      console.error(
        `Could not play ${track.title}:`,
        error
      );
    }
  });

  // ------------------------------------------------
  // Seek helper
  // ------------------------------------------------

  function seekToRatio(ratio) {
    if (!audio.duration) return;

    const safeRatio = Math.min(
      1,
      Math.max(0, ratio)
    );

    audio.currentTime =
      safeRatio * audio.duration;
  }

  // Mouse / touch seek
  progressWrap.addEventListener("click", (event) => {
    const rect =
      progressWrap.getBoundingClientRect();

    const ratio =
      (event.clientX - rect.left) /
      rect.width;

    seekToRatio(ratio);
  });

  // Keyboard seek
  progressWrap.addEventListener("keydown", (event) => {
    if (!audio.duration) return;

    const step = 5;

    if (event.key === "ArrowRight") {
      event.preventDefault();

      audio.currentTime = Math.min(
        audio.duration,
        audio.currentTime + step
      );
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();

      audio.currentTime = Math.max(
        0,
        audio.currentTime - step
      );
    }

    if (event.key === "Home") {
      event.preventDefault();
      audio.currentTime = 0;
    }

    if (event.key === "End") {
      event.preventDefault();
      audio.currentTime = audio.duration;
    }
  });
});

// ------------------------------------------------
// Footer year
// ------------------------------------------------

const yearElement =
  document.getElementById("year");

if (yearElement) {
  yearElement.textContent =
    new Date().getFullYear();
}

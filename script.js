"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const main = $("#main");
const hero = $(".hero");
const manual = $("#manual");
const film = $("#film");
const screen = $("#film-content");
const notice = $("#notice");
const shareBox = $("#share-box");
const canvas = $("#rain");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const question = new URLSearchParams(location.search).get("q")?.trim() || "";
const duration = 42;

const prologue = [
  "У каждого вопроса есть надежда.",
  "У каждой надежды есть шанс.",
  "Но не сегодня.",
];
const deliberation = [
  "Мы рассмотрели ваш вопрос.",
  "Мы изучили все возможности.",
  "Мы искали другой путь.",
  "Мы верили до последнего.",
  "Но некоторые вещи невозможно изменить.",
];
const stats = [
  ["0%", "вероятность согласия"],
  ["100%", "окончательность решения"],
  ["3", "буквы, изменившие всё"],
  ["404", "надежда не найдена"],
  ["∞", "пространство для сожалений"],
  ["0", "альтернативных вариантов"],
];
const technologies = [
  ["NO ENGINE 2.0", "Фундаментальная архитектура отрицательного ответа."],
  [
    "HOPE REDUCTION",
    "Интеллектуальная система устранения неоправданных ожиданий.",
  ],
  ["DISAPPOINTMENT MAX", "Максимальная эмоциональная глубина отказа."],
  ["ANTI-YES PROTECTION", "Надёжная защита от случайного согласия."],
  ["EMOTIONAL DAMAGE PRO", "Отказ, который останется с вами надолго."],
  ["FINAL DECISION", "Решение, не требующее дальнейшего обсуждения."],
  ["UNIVERSAL NO", "Один отказ. Бесконечное количество вопросов."],
];
const questions = [
  "Может быть?",
  "Ты согласен?",
  "Ты придёшь?",
  "А если попробовать?",
  "Ну пожалуйста?",
  "Хотя бы один раз?",
  "Ты точно уверен?",
];
const stages = [
  ["Отрицание", "Наверное, сайт неправильно загрузился.", "#445874", "piano"],
  ["Гнев", "Да как вообще так можно?", "#61424c", "thunder"],
  ["Торг", "А если спросить ещё раз?", "#544c65", "transition"],
  ["Печаль", "Понятно. Всё понятно.", "#30445e", "piano"],
  ["Принятие", "Нет.", "#20303f", "impact"],
];
const goodbye = [
  "Не все истории заканчиваются счастливо.",
  "Не все вопросы получают желаемый ответ.",
  "Иногда нужно просто отпустить.",
];
const titles = [
  "Последняя надежда",
  "Как рушатся надежды",
  "Инженерия отказа",
  "Технологии разочарования",
  "Музей несбывшихся надежд",
  "Стадии принятия отказа",
  "Последнее прощание",
];
const chapters = [
  "Пролог",
  "Акт I",
  "Акт II",
  "Акт III",
  "Акт IV",
  "Акт V",
  "Акт VI",
];
const slogans = [
  "Ответ, после которого стало тише.",
  "Будущее отменяется. Дождь остаётся.",
  "Всё могло быть иначе. Ответ остался прежним.",
];

function element(tag, className = "", value = "") {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = value;
  return node;
}

function button(text, className, handler) {
  const control = element("button", className, text);
  control.type = "button";
  control.addEventListener("click", handler);
  return control;
}

function makeVerdict(value = "НЕТ.") {
  return element("p", "no", value);
}

function finalControls(inFilm) {
  const actions = element("div", "actions");
  actions.append(
    button("Пережить это снова", "primary", () => startFilm(true)),
    button("Поделиться разочарованием", "secondary", openShare),
    button("Попытаться изменить решение", "secondary", retry),
    button("Пожаловаться на судьбу", "secondary", complain),
  );
  if (inFilm)
    actions.append(button("К первому экрану", "secondary", closeFilm));
  return actions;
}

function credits() {
  const footer = element("footer", "end-footer");
  const contacts = element("nav", "end-contacts");
  contacts.setAttribute("aria-label", "Контакты");
  for (const [label, href] of [
    ["Telegram", "https://t.me/nillks_rss"],
    ["WhatsApp", "https://wa.me/77055837474"],
    ["Email", "mailto:daniil.troyanovvv@gmail.com"],
  ]) {
    const link = element("a", "", label);
    link.href = href;
    contacts.append(link);
  }
  const license = element("a", "", "Музыка и лицензии");
  license.href = "LICENSES.md";
  contacts.append(license);
  footer.append(
    element("p", "end-notes", "Спасибо за ваши неоправданные ожидания."),
    element(
      "p",
      "end-notes",
      "Designed in Kazakhstan. · Engineered to disappoint.",
    ),
    contacts,
  );
  return footer;
}

function mountManual() {
  const copy = (lines) => {
    const block = element("div", "copy");
    block.append(...lines.map((line) => element("p", "", line)));
    return block;
  };
  const rows = (entries, isStat) => {
    const list = element("dl", isStat ? "stat-list" : "tech-list");
    for (const [label, description] of entries) {
      const row = element("div", isStat ? "stat" : "technology");
      row.append(
        element("dt", isStat ? "" : "tech-name", label),
        element("dd", "", description),
      );
      list.append(row);
    }
    return list;
  };
  const stageControls = element("div", "stage-controls");
  const stageNavigation = element("div", "stage-navigation");
  const stageGuide = element("div", "stage-guide");
  const stageHint = element(
    "p",
    "",
    "Нажмите на название, чтобы выбрать стадию.",
  );
  stageHint.id = "stage-hint";
  stageControls.setAttribute("role", "group");
  stageControls.setAttribute("aria-label", "Стадии принятия отказа");
  stageControls.setAttribute("aria-describedby", stageHint.id);
  const scene = element("div", "stage-scene");
  const stageVisual = element("div", "stage-visual");
  stageVisual.setAttribute("aria-hidden", "true");
  for (const layer of ["portrait", "light", "rain", "shade"]) {
    stageVisual.append(element("div", `stage-${layer}`));
  }
  const stageText = element("div", "stage-text");
  const stageTitle = element("h3");
  const stageCopy = element("p");
  stageText.setAttribute("aria-live", "polite");
  stageText.setAttribute("aria-atomic", "true");
  stageText.append(stageTitle, stageCopy);
  let stageIndex = 0;
  let stageVisible = false;
  let stageTimer;
  let stageAuto = !reduced.matches && "IntersectionObserver" in window;
  const stagePlayback = button("", "stage-playback", () => {
    stageAuto = !stageAuto;
    if (stageAuto && stageIndex === stages.length - 1) selectStage(0, true);
    scheduleStage();
  });
  stageGuide.append(stageHint, stagePlayback);
  stageNavigation.append(stageGuide, stageControls);
  scene.append(stageVisual, stageText, stageNavigation);
  const stageButtons = stages.map(([label], index) =>
    button(label, "stage-step", () => {
      stageAuto = false;
      scheduleStage();
      selectStage(index, true);
    }),
  );
  function revealStageTitle(label) {
    stageTitle.textContent = label;
    stageTitle.setAttribute("aria-label", label);
    if (reduced.matches) return;
    stageTitle.replaceChildren(
      ...Array.from(label, (letter, index) => {
        const glyph = element("span", "stage-letter", letter);
        glyph.setAttribute("aria-hidden", "true");
        glyph.style.setProperty("--letter-delay", `${index * 38}ms`);
        return glyph;
      }),
    );
  }
  function scheduleStage() {
    clearTimeout(stageTimer);
    stagePlayback.textContent = stageAuto ? "Пауза" : "Автопоказ";
    stageText.setAttribute("aria-live", stageAuto ? "off" : "polite");
    if (!stageAuto || !stageVisible || document.hidden || main.inert) return;
    stageTimer = setTimeout(() => {
      selectStage(stageIndex + 1, false);
      if (stageIndex === stages.length - 1) stageAuto = false;
      scheduleStage();
    }, 4600);
  }
  function selectStage(index, withSound) {
    stageIndex = index;
    const [label, line, tone, effect] = stages[index];
    stageButtons.forEach((control, position) =>
      control.setAttribute("aria-pressed", String(position === index)),
    );
    scene.style.setProperty("--tone", tone);
    revealStageTitle(label);
    stageCopy.textContent = line;
    scene.dataset.stage = index;
    scene.style.setProperty("--stage-progress", `${index * 20 + 10}%`);
    if (!reduced.matches) {
      stageCopy.getAnimations().forEach((animation) => animation.cancel());
      stageCopy.animate(
        [
          { opacity: 0.24, filter: "blur(7px)", transform: "translateY(12px)" },
          { opacity: 1, filter: "blur(0)", transform: "none" },
        ],
        { duration: 630, easing: "cubic-bezier(.17,.67,.28,1)" },
      );
    }
    if (withSound) sound.effect(effect);
  }
  stageControls.append(...stageButtons);
  selectStage(0, false);
  scheduleStage();

  const museum = element("ul", "folios");
  museum.append(...questions.map((line) => element("li", "", line)));
  const crack = element("div", "crack");
  const museumPlay = button("Погасить надежды", "secondary museum-play", () => {
    const replay = museumPlay.getAttribute("aria-pressed") === "true";
    museumPlay.setAttribute("aria-pressed", String(!replay));
    museumPlay.textContent = replay ? "Погасить надежды" : "Вернуть вопросы";
    museum.classList.toggle("extinguish", !replay);
    museum
      .closest("section")
      .classList.toggle("fracture", !replay && !reduced.matches);
    if (!replay) sound.effect("transition");
  });
  museumPlay.setAttribute("aria-pressed", "false");
  [...museum.children].forEach((node, index) =>
    node.style.setProperty("--delay", `${index * 0.19}s`),
  );

  const content = [
    [
      ...(question ? [element("blockquote", "personal", question)] : []),
      copy(prologue),
      makeVerdict(),
      element("p", "", "Мне тоже хотелось, чтобы всё было иначе."),
    ],
    [copy([...deliberation, "Ответ остался прежним."]), makeVerdict()],
    [
      rows(stats, true),
      element("p", "", "Мы довели искусство отказа до совершенства."),
    ],
    [rows(technologies, false)],
    [
      crack,
      museum,
      museumPlay,
      makeVerdict("Нет."),
      element("p", "", "Здесь могла быть ваша надежда."),
    ],
    [scene],
    [
      copy(goodbye),
      makeVerdict(),
      element("p", "", "Я не хотел. Но так было нужно."),
      finalControls(false),
      credits(),
    ],
  ];
  const names = [
    "prologue",
    "hopes",
    "engineering",
    "technology",
    "museum",
    "stages",
    "final",
  ];
  const sections = content.map((nodes, index) => {
    const section = element("section", `act act--${names[index]}`);
    section.id = names[index];
    const heading = element("header", "act-header");
    heading.append(
      element("p", "eyebrow", chapters[index]),
      element("h2", "", titles[index]),
    );
    const atmosphere = element("div", "act-atmosphere");
    atmosphere.setAttribute("aria-hidden", "true");
    if (section.id === "stages") {
      scene.insertBefore(heading, stageText);
      section.append(scene);
    } else {
      section.append(atmosphere, heading, ...nodes);
    }
    return section;
  });
  manual.append(...sections);
  manual.tabIndex = -1;
  if ("IntersectionObserver" in window) {
    const stageObserver = new IntersectionObserver(
      ([entry]) => {
        stageVisible = entry.intersectionRatio >= 0.42;
        if (stageVisible && stageIndex === 0) revealStageTitle(stages[0][0]);
        scheduleStage();
      },
      { threshold: 0.42 },
    );
    stageObserver.observe(scene);
    document.addEventListener("visibilitychange", scheduleStage);
    new MutationObserver(scheduleStage).observe(main, {
      attributeFilter: ["inert"],
    });
    reduced.addEventListener("change", () => {
      if (reduced.matches) stageAuto = false;
      scheduleStage();
    });
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("entered");
          reveal.unobserve(entry.target);
        }
      },
      { threshold: 0.12 },
    );
    for (const group of manual.querySelectorAll(".copy")) {
      [...group.children].forEach((node, index) =>
        node.style.setProperty(
          "--reveal-delay",
          `${Math.min(index, 5) * 95}ms`,
        ),
      );
    }
    for (const node of manual.querySelectorAll(
      ".act-header, .copy > p, .stat, .technology, .act > .no, .stage-scene, .end-footer",
    ))
      reveal.observe(node);
    const ambient = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle("in-view", entry.isIntersecting);
      }
    });
    sections.forEach((section) => ambient.observe(section));
  }
}

function createSound() {
  const music = new Audio("assets/sad-theme.mp3");
  const rain = new Audio("assets/rain.mp3");
  const effects = Object.fromEntries(
    ["thunder", "impact", "piano", "transition"].map((name) => [
      name,
      new Audio(`assets/sfx/${name}.mp3`),
    ]),
  );
  music.preload = "metadata";
  rain.preload = "none";
  rain.loop = true;
  music.loop = true;
  const control = $("#sound");
  const volume = $("#volume");
  const volumes = [
    [music, 0.9],
    [rain, 0.52],
    ...Object.values(effects).map((audio) => [audio, 0.64]),
  ];
  const caption = $("span:last-child", control);
  let enabled = true;
  let interacted = false;
  let quiet = false;
  let scoreFinished = false;

  function mix() {
    const level = enabled && !quiet ? Number(volume.value) : 0;
    for (const [audio, levelFactor] of volumes) {
      audio.volume = level * levelFactor;
      audio.muted = level === 0;
    }
    control.setAttribute("aria-pressed", String(enabled));
    control.setAttribute(
      "aria-label",
      enabled ? "Выключить звук" : "Включить звук",
    );
  }

  function play(audio) {
    if (
      !interacted ||
      !enabled ||
      quiet ||
      document.hidden ||
      (audio === music && scoreFinished)
    )
      return;
    audio.play().catch((error) => {
      if (
        audio !== music ||
        error.name === "AbortError" ||
        !enabled ||
        !music.paused
      )
        return;
      setEnabled(false);
      caption.textContent = "Включить звук";
      control.title = "Браузер не запустил музыку. Нажмите, чтобы повторить.";
    });
  }

  function setEnabled(value) {
    enabled = value;
    caption.textContent = "Звук";
    control.removeAttribute("title");
    mix();
    if (enabled) {
      if (navigator.audioSession) navigator.audioSession.type = "playback";
      play(music);
      play(rain);
    } else {
      for (const [audio] of volumes) audio.pause();
    }
  }

  function reset(at, loop) {
    scoreFinished = false;
    music.loop = loop;
    if (music.currentTime !== at) music.currentTime = at;
    play(music);
  }

  mix();
  const unlock = (event) => {
    if (
      interacted ||
      event.target === control ||
      control.contains(event.target)
    )
      return;
    if (
      event.type === "keydown" &&
      ["Tab", "Escape", "Shift", "Control", "Alt", "Meta"].includes(event.key)
    )
      return;
    interacted = true;
    setEnabled(enabled);
  };
  document.addEventListener("click", unlock, true);
  document.addEventListener("keydown", unlock, true);
  control.addEventListener("click", () => {
    interacted = true;
    setEnabled(!enabled);
  });
  volume.addEventListener("input", mix);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      for (const [audio] of volumes) audio.pause();
    } else {
      play(music);
      play(rain);
    }
  });
  return {
    reset,
    begin() {
      if (!interacted) {
        interacted = true;
        setEnabled(enabled);
      }
    },
    finish() {
      scoreFinished = true;
      music.pause();
    },
    scoreTime() {
      return !music.paused && music.currentTime > 0 ? music.currentTime : null;
    },
    quiet(value) {
      quiet = value;
      mix();
      if (value) {
        for (const [audio] of volumes) audio.pause();
      } else {
        play(music);
        play(rain);
      }
    },
    effect(name) {
      const audio = effects[name];
      if (audio) {
        audio.currentTime = 0;
        play(audio);
      }
    },
  };
}

const sound = createSound();
mountManual();

const cues = [
  { at: 0, act: 0, lines: [prologue[0]], personal: true },
  { at: 2.2, act: 0, lines: [prologue[1]] },
  { at: 4.4, act: 0, lines: [prologue[2]] },
  {
    at: 6.5,
    act: 0,
    verdict: true,
    small: "Мне тоже хотелось, чтобы всё было иначе.",
    portrait: 0.85,
    effect: "impact",
  },
  { at: 9, act: 1, lines: deliberation.slice(0, 3) },
  { at: 11.4, act: 1, lines: deliberation.slice(3), effect: "transition" },
  { at: 13.5, act: 1, lines: ["Ответ остался прежним."], verdict: true },
  {
    at: 15.1,
    act: 2,
    entries: stats,
    small: "Мы довели искусство отказа до совершенства.",
  },
  { at: 18.6, act: 3, entries: technologies },
  { at: 23, act: 4, museum: true, portrait: 0.58, blur: "2px" },
  {
    at: 27,
    act: 4,
    verdict: true,
    small: "Здесь могла быть ваша надежда.",
    portrait: 0.42,
    fracture: true,
    effect: "impact",
  },
  ...stages.map((stage, index) => ({
    at: 29.5 + index * 0.9,
    act: 5,
    stage,
    portrait: 0.28,
  })),
  {
    at: 34,
    act: 6,
    lines: [goodbye[0]],
    portrait: 0.68,
    zoom: 1.085,
    effect: "thunder",
  },
  { at: 35.5, act: 6, lines: [goodbye[1]], portrait: 0.68, zoom: 1.06 },
  { at: 37, act: 6, lines: [goodbye[2]], portrait: 0.66, zoom: 1.035 },
  {
    at: 38.5,
    act: 6,
    verdict: true,
    small: "Я не хотел. Но так было нужно.",
    portrait: 0.58,
    zoom: 1,
    effect: "impact",
  },
];
let cueIndex = -1;
let elapsed = 0;
let previousFrame = 0;
let filmFrame = 0;
let playing = false;
let filmFinished = false;
let filmReturnFocus;
let runs = 0;

function renderCue(cue) {
  const {
    act,
    lines,
    entries,
    verdict,
    small,
    museum,
    stage,
    portrait = 0,
    zoom = 1.05,
    blur = "0px",
  } = cue;
  $("#chapter").textContent = `${chapters[act]} · ${titles[act]}`;
  film.style.setProperty("--portrait", portrait);
  film.style.setProperty("--zoom", zoom);
  film.style.setProperty("--blur", blur);
  film.style.setProperty("--saturation", act === 6 ? ".32" : ".57");
  film.style.setProperty(
    "--tone",
    stage?.[2] || (act === 6 ? "#7991ab" : "#23364c"),
  );
  film.classList.toggle("fracture", Boolean(cue.fracture));
  film.dataset.act = act;
  const nodes = [];
  if (cue.personal && question)
    nodes.push(element("blockquote", "cue personal", question));
  if (lines) {
    nodes.push(
      ...lines.map((line, index) => {
        const paragraph = element("p", "cue line", line);
        paragraph.style.animationDelay = `${index * 0.33}s`;
        return paragraph;
      }),
    );
  }
  if (entries) {
    const group = element(
      "div",
      act === 2 ? "cue screen-stats" : "cue screen-tech",
    );
    for (const [index, [label, description]] of entries.entries()) {
      const row = element("p");
      row.style.setProperty("--reveal-delay", `${index * 105}ms`);
      row.append(
        element("strong", "", label),
        document.createTextNode(description),
      );
      group.append(row);
    }
    nodes.push(group);
  }
  if (museum) {
    const field = element("div", "folio-field");
    questions.forEach((line, index) => {
      const word = element("span", "", line);
      word.style.setProperty("--delay", `${index * 0.2}s`);
      field.append(word);
    });
    nodes.push(field);
  }
  if (stage)
    nodes.push(
      element("h2", "cue", stage[0]),
      element("p", "cue film-small", stage[1]),
    );
  if (verdict) nodes.push(makeVerdict(act === 4 ? "Нет." : "НЕТ."));
  if (small) nodes.push(element("p", "cue film-small", small));
  screen.replaceChildren(...nodes);
  if (reduced.matches && paint) paintRain(0, 0);
  if (cue.effect || stage) sound.effect(cue.effect || stage[3]);
}

function setProgress(value) {
  $("#progress").value = value;
  $("#remaining").textContent =
    `0:${String(Math.max(0, Math.ceil(duration - value))).padStart(2, "0")}`;
}

function finishFilm() {
  if (filmFinished) return;
  playing = false;
  filmFinished = true;
  cancelAnimationFrame(filmFrame);
  setProgress(duration);
  renderCue({ ...cues.at(-1), effect: undefined });
  screen.append(finalControls(true), credits());
  $("#skip").textContent = "Закрыть";
  sound.finish();
  screen.focus();
}

function advance(now) {
  if (!playing || document.hidden) return;
  if (previousFrame) elapsed += (now - previousFrame) / 1000;
  previousFrame = now;
  const scoreTime = sound.scoreTime();
  if (scoreTime !== null && Math.abs(scoreTime - elapsed) < 0.5) {
    elapsed += (scoreTime - elapsed) * 0.04;
  }
  if (elapsed >= duration) {
    finishFilm();
    return;
  }
  let index = cueIndex;
  while (index + 1 < cues.length && cues[index + 1].at <= elapsed) index++;
  if (cueIndex !== index) {
    if ([1, 2, 4].includes(cues[cueIndex].act)) scatterType();
    cueIndex = index;
    renderCue(cues[index]);
  }
  setProgress(elapsed);
  filmFrame = requestAnimationFrame(advance);
}

function startFilm(replay = false) {
  sound.begin();
  cancelAnimationFrame(filmFrame);
  if (film.hidden) filmReturnFocus = document.activeElement;
  if (runs > 0 || replay) {
    const slogan = slogans[(Math.max(1, runs) - 1) % slogans.length];
    $("#tagline").textContent = slogan;
  }
  runs++;
  cueIndex = 0;
  elapsed = 0;
  previousFrame = 0;
  filmFinished = false;
  shards = [];
  playing = true;
  document.body.classList.add("filming");
  film.hidden = false;
  main.inert = true;
  $("#skip").textContent = "Пропустить";
  film.append(canvas);
  resizeRain();
  setProgress(0);
  sound.reset(0, false);
  renderCue(cues[0]);
  screen.focus();
  filmFrame = requestAnimationFrame(advance);
}

function closeFilm() {
  playing = false;
  filmFinished = false;
  cancelAnimationFrame(filmFrame);
  film.hidden = true;
  document.body.classList.remove("filming");
  main.inert = false;
  hero.insertBefore(canvas, $(".grain", hero));
  resizeRain();
  sound.reset(0, true);
  filmReturnFocus?.focus();
}

$("#start").addEventListener("click", () => startFilm());
$("#skip").addEventListener("click", () => {
  if (filmFinished) closeFilm();
  else finishFilm();
});
$("#manual-link").addEventListener("click", () => {
  manual.focus({ preventScroll: true });
});
document.addEventListener("visibilitychange", () => {
  document.body.classList.toggle("tab-hidden", document.hidden);
  cancelAnimationFrame(filmFrame);
  previousFrame = 0;
  if (!document.hidden && playing) filmFrame = requestAnimationFrame(advance);
});

let attempts = 0;
let taps = 0;
let dialogTimer = 0;
let dialogSequence = 0;
let silenced = false;
const retryMessages = [
  "Мы понимаем ваши чувства. Но нет.",
  "Ваш запрос был рассмотрен повторно. Нет.",
  "К сожалению, надежда не прошла модерацию.",
  "Мы привлекли независимую комиссию. Единогласно — нет.",
];

function openDialog(dialog) {
  if (!dialog.open) dialog.showModal();
  document.body.classList.add("modal-open");
}
for (const dialog of [notice, shareBox]) {
  $("[data-close]", dialog).addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (!notice.open && !shareBox.open)
      document.body.classList.remove("modal-open");
  });
}

function showNotice(title, detail, black = false) {
  dialogSequence++;
  clearTimeout(dialogTimer);
  notice.classList.toggle("notice-black", black);
  const heading = element("h2", "", title);
  heading.id = "notice-title";
  const body = $("#notice-content");
  body.replaceChildren(heading);
  if (detail) body.append(element("p", "", detail));
  openDialog(notice);
  return body;
}

notice.addEventListener("close", () => {
  clearTimeout(dialogTimer);
  dialogSequence++;
  if (silenced) {
    silenced = false;
    sound.quiet(false);
  }
});

function retry() {
  attempts++;
  if (attempts <= retryMessages.length) {
    showNotice(retryMessages[attempts - 1]);
    return;
  }
  if (attempts === 5) {
    const body = showNotice("Системный анализ");
    const sequence = dialogSequence;
    const list = element("ol", "terminal");
    body.append(list);
    const log = [
      "Проверка альтернативных решений.",
      "Поиск возможности согласия.",
      "Восстановление надежды.",
      "Результат: 0%.",
      "Даже технологии оказались бессильны.",
    ];
    log.forEach((line, index) =>
      setTimeout(() => {
        if (notice.open && sequence === dialogSequence)
          list.append(element("li", "", line));
      }, 320 * index),
    );
    return;
  }
  silenced = true;
  sound.quiet(true);
  showNotice("НУ НЕТ ЖЕ.", "", true);
  dialogTimer = setTimeout(() => notice.close(), 2300);
}

$(".retry").addEventListener("click", retry);
function complain() {
  showNotice(
    "Пожаловаться на судьбу",
    "Ваша жалоба принята. Решение не изменилось",
  );
}

$("#brand").addEventListener("click", () => {
  taps++;
  if (taps !== 7) return;
  document.body.classList.add("ultra");
  sound.effect("thunder");
  showNotice(
    "Нет. Ultra Depression Edition",
    "Дождь усилился. Решение осталось прежним.",
  );
});

let keys = "";
let lastKey = 0;
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    !film.hidden &&
    !notice.open &&
    !shareBox.open
  ) {
    event.preventDefault();
    if (filmFinished) closeFilm();
    else finishFilm();
    return;
  }
  if (
    event.target.matches?.("input, textarea, [contenteditable]") ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.repeat ||
    notice.open ||
    shareBox.open
  )
    return;
  if (!/^[a-z]$/i.test(event.key)) return;
  const now = performance.now();
  keys = (
    now - lastKey < 1150
      ? keys + event.key.toUpperCase()
      : event.key.toUpperCase()
  ).slice(-3);
  lastKey = now;
  if (keys.endsWith("YES")) {
    showNotice("Надежда обнаружена. Надежда устранена");
    keys = "";
  } else if (keys.endsWith("NO")) {
    sound.effect("piano");
    showNotice("Нет.", "Даже эхо не решилось ответить иначе.", true);
    keys = "";
  }
});

const input = $("#question");
const generated = $("#generated");
const status = $("#share-status");
function updateURL() {
  const url = new URL(location.href);
  url.hash = "";
  const value = input.value.trim();
  if (value) url.searchParams.set("q", value);
  else url.searchParams.delete("q");
  generated.value = url.href;
  status.textContent = "";
}
function openShare() {
  input.value = question;
  updateURL();
  openDialog(shareBox);
  input.focus();
}
async function copyLink() {
  try {
    await navigator.clipboard.writeText(generated.value);
    status.textContent = "Ссылка скопирована.";
  } catch {
    generated.focus();
    generated.select();
    status.textContent = "Ссылка выделена. Скопируйте её вручную.";
  }
}
$("#open-share").addEventListener("click", openShare);
input.addEventListener("input", updateURL);
$("#copy").addEventListener("click", copyLink);
$("#share").addEventListener("click", async () => {
  if (!navigator.share) {
    await copyLink();
    return;
  }
  try {
    await navigator.share({ title: document.title, url: generated.value });
  } catch (error) {
    if (error.name !== "AbortError") await copyLink();
  }
});

const paint = canvas.getContext("2d");
let rainWidth = 0;
let rainHeight = 0;
let drops = [];
let streaks = [];
let dust = [];
let shards = [];
let lastFracture = false;
let rainFrame = 0;
let rainTime = 0;
let holdTimer = 0;
let heavyUntil = 0;
let economy = 1;
let slowFrames = 0;
const heroVisible = new IntersectionObserver(([entry]) => {
  heroOnScreen = entry.isIntersecting;
  queueRain();
});
let heroOnScreen = true;

function scatterType() {
  if (reduced.matches || !paint) return;
  const range = document.createRange();
  for (const node of screen.querySelectorAll(
    ".line, .screen-stats strong, .folio-field span",
  )) {
    const text = node.firstChild;
    if (!text || !text.length) continue;
    for (let letter = 0; letter < text.length; letter += 2) {
      if (/\s/.test(text.data[letter])) continue;
      range.setStart(text, letter);
      range.setEnd(text, letter + 1);
      const glyph = range.getBoundingClientRect();
      shards.push({
        x: glyph.left + glyph.width * Math.random(),
        y: glyph.top + glyph.height * (0.35 + Math.random() * 0.35),
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.04 - Math.random() * 0.09,
        age: 0,
      });
    }
  }
}

function seedRain() {
  const density =
    Math.min(350, Math.max(76, Math.round(rainWidth / 4.2))) * economy;
  drops = Array.from({ length: density }, () => ({
    x: Math.random() * rainWidth,
    y: Math.random() * rainHeight,
    depth: Math.random(),
    speed: 0.34 + Math.random() * 0.81,
  }));
  streaks = Array.from(
    { length: Math.min(19, Math.ceil(rainWidth / 80)) },
    () => ({
      x: Math.random() * rainWidth,
      y: Math.random() * rainHeight,
      radius: 0.65 + Math.random() * 1.9,
      drift: 0.012 + Math.random() * 0.045,
    }),
  );
  dust = Array.from({ length: 34 }, () => ({
    x: Math.random() * rainWidth,
    y: Math.random() * rainHeight,
    speed: 0.02 + Math.random() * 0.09,
    alpha: 0.05 + Math.random() * 0.2,
  }));
}

function resizeRain() {
  if (!paint) return;
  const bounds = canvas.getBoundingClientRect();
  const ratio = Math.min(
    devicePixelRatio || 1,
    bounds.width < 710 ? 1.35 : 1.6,
  );
  rainWidth = bounds.width;
  rainHeight = bounds.height;
  canvas.width = Math.round(rainWidth * ratio);
  canvas.height = Math.round(rainHeight * ratio);
  paint.setTransform(ratio, 0, 0, ratio, 0, 0);
  seedRain();
  if (reduced.matches) paintRain(0, 0);
  queueRain();
}

function paintRain(now, dt) {
  paint.clearRect(0, 0, rainWidth, rainHeight);
  const inFilm = !film.hidden;
  if (inFilm && cueIndex < 3) return;
  const heavy =
    now < heavyUntil ||
    document.body.classList.contains("ultra") ||
    (inFilm && film.dataset.act === "6");
  const rate = heavy ? 1.85 : 1;
  const still = reduced.matches;
  const sheen = paint.createLinearGradient(0, rainHeight * 0.73, 0, rainHeight);
  sheen.addColorStop(0, "#9ab9f000");
  sheen.addColorStop(0.72, "#92b1dc0c");
  sheen.addColorStop(1, "#90afd900");
  paint.fillStyle = sheen;
  paint.fillRect(0, rainHeight * 0.73, rainWidth, rainHeight * 0.27);
  for (const drop of drops) {
    const length = (7 + drop.depth * 29) * (heavy ? 1.26 : 1);
    paint.beginPath();
    paint.lineWidth = 0.45 + drop.depth * 0.61;
    const alpha = (0.085 + drop.depth * 0.28) * (heavy ? 1.2 : 1);
    paint.strokeStyle = `rgba(162,191,221,${alpha})`;
    paint.moveTo(drop.x, drop.y);
    paint.lineTo(drop.x - length * 0.32, drop.y + length);
    paint.stroke();
    drop.x -= drop.speed * dt * 0.27 * rate;
    drop.y += drop.speed * dt * rate;
    if (drop.y > rainHeight + 25) {
      drop.y = -length;
      drop.x = Math.random() * (rainWidth + 32);
    }
    if (drop.x < -40) drop.x = rainWidth + 22;
  }
  if (still) return;
  for (const bead of streaks) {
    const trail = 7 + bead.radius * 13;
    const reflection = paint.createLinearGradient(
      bead.x,
      bead.y - trail,
      bead.x,
      bead.y + bead.radius,
    );
    reflection.addColorStop(0, "#bcd6f100");
    reflection.addColorStop(0.8, "#92b5d536");
    reflection.addColorStop(1, "#d8edff74");
    paint.strokeStyle = reflection;
    paint.lineWidth = bead.radius;
    paint.beginPath();
    paint.moveTo(bead.x + 0.4, bead.y - trail);
    paint.quadraticCurveTo(bead.x - 1.5, bead.y - 3, bead.x, bead.y);
    paint.stroke();
    paint.fillStyle = "#bcd6ed60";
    paint.beginPath();
    paint.ellipse(
      bead.x,
      bead.y,
      bead.radius * 0.59,
      bead.radius,
      0,
      0,
      Math.PI * 2,
    );
    paint.fill();
    bead.y += dt * bead.drift * rate;
    if (bead.y > rainHeight + 20) bead.y = -14;
  }
  if (inFilm && ["1", "2", "4"].includes(film.dataset.act)) {
    for (const mote of dust) {
      paint.fillStyle = `rgba(212,229,249,${mote.alpha})`;
      paint.fillRect(mote.x, mote.y, 1.7, 1.7);
      mote.y = (mote.y + dt * mote.speed) % rainHeight;
      mote.x = (mote.x + dt * 0.025) % rainWidth;
    }
  }
  const fracturing = inFilm && film.classList.contains("fracture");
  if (fracturing && !lastFracture) {
    shards.push(
      ...Array.from({ length: 40 }, () => ({
        x: rainWidth * (0.48 + Math.random() * 0.04),
        y: rainHeight * (0.44 + Math.random() * 0.1),
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        age: 0,
      })),
    );
  }
  lastFracture = fracturing;
  for (const shard of shards) {
    if (shard.age >= 1000) continue;
    paint.fillStyle = `rgba(207,229,253,${0.4 * (1 - shard.age / 1000)})`;
    paint.fillRect(shard.x, shard.y, 2, 1);
    shard.x += shard.vx * dt;
    shard.y += shard.vy * dt + shard.age * 0.00018 * dt;
    shard.age += dt;
  }
  shards = shards.filter((shard) => shard.age < 1000);
}

function queueRain() {
  if (
    !paint ||
    rainFrame ||
    reduced.matches ||
    document.hidden ||
    (!heroOnScreen && film.hidden)
  )
    return;
  rainFrame = requestAnimationFrame(animateRain);
}

function animateRain(now) {
  rainFrame = 0;
  const difference = rainTime ? now - rainTime : 16;
  rainTime = now;
  if (difference > 27 && difference < 100) slowFrames++;
  if (slowFrames > 45 && economy > 0.49) {
    economy *= 0.72;
    slowFrames = 0;
    seedRain();
  }
  paintRain(now, Math.min(35, difference));
  queueRain();
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(rainFrame);
    rainFrame = 0;
    rainTime = 0;
  } else queueRain();
});

const hold = $("#hold");
function beginHold() {
  clearTimeout(holdTimer);
  holdTimer = setTimeout(() => {
    heavyUntil = performance.now() + 5600;
    sound.effect("thunder");
  }, 560);
}
function endHold() {
  clearTimeout(holdTimer);
}
hold.addEventListener("pointerdown", beginHold);
for (const event of ["pointerup", "pointercancel", "pointerleave", "blur"])
  hold.addEventListener(event, endHold);
hold.addEventListener("keydown", (event) => {
  if ([" ", "Enter"].includes(event.key) && !event.repeat) beginHold();
});
hold.addEventListener("keyup", endHold);
hold.addEventListener("contextmenu", (event) => event.preventDefault());

hero.addEventListener("pointermove", (event) => {
  if (reduced.matches || event.pointerType !== "mouse") return;
  hero.style.setProperty(
    "--px",
    `${(event.clientX / innerWidth - 0.5) * -13}px`,
  );
  hero.style.setProperty(
    "--py",
    `${(event.clientY / innerHeight - 0.5) * -9}px`,
  );
});
hero.addEventListener("pointerleave", () => {
  hero.style.removeProperty("--px");
  hero.style.removeProperty("--py");
});

heroVisible.observe(hero);
window.addEventListener("resize", resizeRain, { passive: true });
reduced.addEventListener("change", () => {
  cancelAnimationFrame(rainFrame);
  rainFrame = 0;
  resizeRain();
});
resizeRain();

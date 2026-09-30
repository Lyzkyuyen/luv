// ---------- Fill the portrait text block ----------
// >>> PASTE YOUR EXISTING `const line = `...`;` BLOCK OVER THE NEXT LINE (unchanged). <<<
const line = `When you were here, the stars disappear
Nothing can outshine the dress that you wear
We should be dancing 'cause girl you look stunning
Let's spend the night together 'til reach the morning
Up and above, never enough
I wanna hold your hand and show what is love
When you are smiling and when you are laughing
We should keep dancing to treasure the feelings
Like it's the old love (it's the old love)
This is the way that we both wanna feel
Under the moonlight we made our first kiss
'Cause this is the moment that you made me feel
Like it's the old love (it's the old love)
Come on and hold me, I want you right here
Stay close to me, so you don't feel the fear
I'll never let go 'cause I'm just right here
When I'm with you, it's like déjà vu
I realize that dreams really come true
We keep on talking for the moment we live in
Let's keep drinking 'til the moon disappear
You are the one, the one that I want
The one that will stay by my side 'til I'm gone
The love of my life and I'll sacrifice
Just for the moment we last long forever
Like it's the old love (it's the old love)
This is the way that we both wanna feel
Under the moonlight we made our first kiss
'Cause this is the moment that you made me feel
Like it's the old love
Come on and hold me, I want you right here
Stay close to me, so you don't feel the fear
I'll never let go 'cause I'm just right here
Like it's the old love
It's the old love
This is the way that we both wanna feel
Under the moonlight we made our first kiss
'Cause this is the moment that you made me feel
Like it's the old love`;

const txt = document.getElementById("txt");

function fillText() {
  if (!txt) return;

  txt.textContent = line;

  while (
    txt.scrollHeight <= txt.clientHeight * 1.5 &&
    txt.textContent.length < 200000
  ) {
    txt.textContent += line;
  }
}

fillText();
if (document.fonts?.ready) document.fonts.ready.then(fillText);

gsap.registerPlugin(ScrollTrigger);

// ---------- Smooth wheel scrolling ----------
let lenis;

if (window.Lenis) {
  lenis = new Lenis({
    lerp: 0.09,
    smoothWheel: true,
  });
  window.__pageLenis = lenis;

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

// ---------- Custom overlay scrollbar ----------
// This reproduces the narrow floating thumb from the Savor reference.
(() => {
  const THUMB_HEIGHT = 42;
  const track = document.createElement("div");
  const thumb = document.createElement("div");

  track.className = "custom-scrollbar";
  track.setAttribute("aria-hidden", "true");
  thumb.className = "custom-scrollbar-thumb";
  track.appendChild(thumb);
  document.body.appendChild(track);

  let isDragging = false;
  let pointerStartY = 0;
  let thumbStartY = 0;
  let hideTimer = null;
  let isPointerOverTrack = false;

  function showScrollbar() {
    track.classList.add("is-visible");
    clearTimeout(hideTimer);
  }

  function scheduleScrollbarHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!isDragging && !isPointerOverTrack) {
        track.classList.remove("is-visible");
      }
    }, 1000);
  }

  function handleScroll() {
    updateThumb();
    showScrollbar();
    scheduleScrollbarHide();
  }

  function maxScroll() {
    return Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
  }

  function currentScroll() {
    return window.__pageLenis
      ? window.__pageLenis.scroll
      : window.scrollY;
  }

  function maxThumbTop() {
    return Math.max(0, window.innerHeight - THUMB_HEIGHT);
  }

  function updateThumb() {
    const scrollLimit = maxScroll();
    const thumbTravel = maxThumbTop();

    if (scrollLimit <= 0) {
      track.style.display = "none";
      return;
    }

    track.style.display = "block";
    const progress = Math.min(1, Math.max(0, currentScroll() / scrollLimit));
    thumb.style.transform = `translate3d(0, ${progress * thumbTravel}px, 0)`;
  }

  function scrollToThumbTop(top) {
    const thumbTravel = maxThumbTop();
    const progress = thumbTravel ? Math.min(1, Math.max(0, top / thumbTravel)) : 0;
    const targetScroll = progress * maxScroll();

    if (window.__pageLenis) {
      window.__pageLenis.scrollTo(targetScroll, { immediate: true, force: true });
    } else {
      window.scrollTo(0, targetScroll);
    }

    updateThumb();
  }

  thumb.addEventListener("pointerdown", (event) => {
    showScrollbar();
    isDragging = true;
    pointerStartY = event.clientY;
    thumbStartY = currentScroll() / Math.max(1, maxScroll()) * maxThumbTop();
    thumb.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  thumb.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    scrollToThumbTop(thumbStartY + event.clientY - pointerStartY);
  });

  function stopDragging() {
    isDragging = false;
    scheduleScrollbarHide();
  }

  thumb.addEventListener("pointerup", stopDragging);
  thumb.addEventListener("pointercancel", stopDragging);

  track.addEventListener("pointerenter", () => {
    isPointerOverTrack = true;
    showScrollbar();
  });

  track.addEventListener("pointerleave", () => {
    isPointerOverTrack = false;
    scheduleScrollbarHide();
  });

  track.addEventListener("pointerdown", (event) => {
    showScrollbar();
    if (event.target === thumb) return;
    scrollToThumbTop(event.clientY - THUMB_HEIGHT / 2);
  });

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("pointermove", (event) => {
    if (event.clientX >= window.innerWidth - 24) {
      showScrollbar();
    } else if (!isDragging && !isPointerOverTrack) {
      scheduleScrollbarHide();
    }
  }, { passive: true });
  window.addEventListener("resize", updateThumb);
  window.addEventListener("load", updateThumb);

  if (window.__pageLenis) {
    window.__pageLenis.on("scroll", handleScroll);
  }

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(updateThumb);
    resizeObserver.observe(document.documentElement);
    resizeObserver.observe(document.body);
  }

  if (document.fonts?.ready) document.fonts.ready.then(updateThumb);
  requestAnimationFrame(updateThumb);
})();

// ---------- Page-load entrance ----------
const introTl = gsap.timeline({
  defaults: { ease: "power3.out" },
});

introTl
  .to(".title-inner", {
    y: 0,
    duration: 1.1,
    stagger: 0.1,
    ease: "power4.out",
  }, 0.1)
  .fromTo(".n-player-glass", {
    y: 30,
    opacity: 0,
  }, {
    y: 0,
    opacity: 1,
    duration: 1.1,
    ease: "power4.out",
  }, 0.35)
  .to(".hero-sub", {
    opacity: 1,
    duration: 1,
  }, 0.7);

// ---------- Compact music player glass tab + synchronized details ----------
const musicPlayer = document.querySelector(".n-player");
const playerMinimizer = document.querySelector(".player-minimizer");
const compactPlayer = document.querySelector(".player-popover");
const compactPlayerClose = document.querySelector(".mini-player-close");

if (musicPlayer && playerMinimizer && compactPlayer) {
  const mainTitle = musicPlayer.querySelector(".n-player-title");
  const mainArtist = musicPlayer.querySelector(".n-player-artist");
  const mainArtwork = musicPlayer.querySelector(".n-player-cover");
  const mainProgress = musicPlayer.querySelector(".n-player-scrub .n-slider");
  const mainTimes = musicPlayer.querySelectorAll(".n-player-times span");

  const compactTitle = compactPlayer.querySelector(".mini-player-title");
  const compactArtist = compactPlayer.querySelector(".mini-player-artist");
  const compactArtwork = compactPlayer.querySelector(".mini-player-art");
  const compactProgress = compactPlayer.querySelector(".mini-player-progress");
  const compactTimes = compactPlayer.querySelectorAll(".mini-player-times span");

  function syncCompactPlayer() {
    if (mainTitle && compactTitle) compactTitle.textContent = mainTitle.textContent.trim();
    if (mainArtist && compactArtist) compactArtist.textContent = mainArtist.textContent.trim();

    if (mainArtwork && compactArtwork) {
      const artwork = getComputedStyle(mainArtwork).backgroundImage;
      compactArtwork.style.backgroundImage = artwork;
      compactArtwork.setAttribute(
        "aria-label",
        mainArtwork.getAttribute("aria-label") || "Current album artwork"
      );
    }

    if (mainProgress && compactProgress) {
      const progress = getComputedStyle(mainProgress).getPropertyValue("--val").trim();
      if (progress) compactProgress.style.setProperty("--val", progress);
    }

    mainTimes.forEach((time, index) => {
      if (compactTimes[index]) compactTimes[index].textContent = time.textContent.trim();
    });
  }

  function setCompactPlayerOpen(open, returnFocus = false) {
    syncCompactPlayer();
    compactPlayer.classList.toggle("is-open", open);
    compactPlayer.setAttribute("aria-hidden", String(!open));
    compactPlayer.inert = !open;
    playerMinimizer.classList.toggle("is-open", open);
    playerMinimizer.setAttribute("aria-expanded", String(open));

    if (open) {
      requestAnimationFrame(() => compactPlayerClose?.focus({ preventScroll: true }));
    } else if (returnFocus) {
      playerMinimizer.focus({ preventScroll: true });
    }
  }

  playerMinimizer.addEventListener("click", () => {
    setCompactPlayerOpen(!compactPlayer.classList.contains("is-open"));
  });
  compactPlayerClose?.addEventListener("click", () => setCompactPlayerOpen(false, true));

  document.addEventListener("pointerdown", (event) => {
    if (
      compactPlayer.classList.contains("is-open") &&
      !compactPlayer.contains(event.target) &&
      !playerMinimizer.contains(event.target)
    ) {
      setCompactPlayerOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && compactPlayer.classList.contains("is-open")) {
      setCompactPlayerOpen(false, true);
    }
  });

  // Keep displayed title, artist, artwork, and progress in sync if the main
  // player is updated later (for example, when a track is selected).
  if ("MutationObserver" in window) {
    const playerContentObserver = new MutationObserver(syncCompactPlayer);
    [mainTitle, mainArtist, mainArtwork, mainProgress, ...mainTimes]
      .filter(Boolean)
      .forEach((element) => {
        playerContentObserver.observe(element, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true,
        });
      });
  }

  syncCompactPlayer();

  if ("IntersectionObserver" in window) {
    const playerVisibilityObserver = new IntersectionObserver(([entry]) => {
      const playerIsOffscreen = !entry.isIntersecting;
      playerMinimizer.classList.toggle("is-visible", playerIsOffscreen);

      if (!playerIsOffscreen && compactPlayer.classList.contains("is-open")) {
        setCompactPlayerOpen(false);
      }
    }, { threshold: 0 });

    playerVisibilityObserver.observe(musicPlayer);
  }
}
// ---------- Hero content fades as it scrolls away ----------
gsap.to(".hero-content", {
  y: 60,
  opacity: 0.4,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
  },
});

// ---------- Wave divider ----------
// Keep the divider in normal document flow so it stays joined to the reveal.
// Animate the SVG paths themselves, not the wrapper's position.

const waveEl = document.querySelector(".wave-divider");

if (waveEl && "IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => {
    waveEl.classList.toggle("is-paused", !entry.isIntersecting);
  }).observe(waveEl);
}

// ---------- Bowl / portrait scroll sequence ----------
const reveal = document.querySelector(".reveal");

if (!reveal) {
  console.warn('Scroll animation not initialized: ".reveal" was not found.');
} else {
  const cover = reveal.querySelector(".reveal-cover");
  const comp = reveal.querySelector(".reveal-comp");
  const arc = reveal.querySelector(".arc");
  const comp2 = reveal.querySelector(".comp-2");
  const comp3 = reveal.querySelector(".comp-3");
  const comp4 = reveal.querySelector(".comp-4");

    if (!cover || !comp) {
    console.warn("Scroll animation not initialized: .reveal-cover or .reveal-comp is missing.");
  } else {
    let W = cover.clientWidth;
    let H = cover.clientHeight;

    function measure() {
      W = cover.clientWidth;
      H = cover.clientHeight;
    }

    const SOFT = 0.8;
    const WIDEN = 1.05;
    const DROP = 0.05;
    const PUSH = 0.04;

    // h < 0 = arch; h > 0 = hanging bowl.
    const START_SHAPE = {
      yE: 1 + DROP + PUSH,
      h: -0.47,
      rx: 0.62,
    };

    const shape = { ...START_SHAPE };

    function drawCover() {
      if (!W || !H) return;

      const isArch = shape.h < 0;
      const soft = isArch ? SOFT : 1;
      const widen = isArch ? WIDEN : 1;

      const mid = W / 2;
      const yE = shape.yE * H;
      const h = shape.h * H;
      const rx = shape.rx * W * widen;

      const points = [
        [-W, -10],
        [2 * W, -10],
        [2 * W, yE],
        [mid + rx, yE],
      ];

      const sampleCount = 90;

      for (let i = 1; i < sampleCount; i++) {
        const angle = (Math.PI * i) / sampleCount;

        points.push([
          mid + rx * Math.cos(angle),
          yE + h * Math.pow(Math.sin(angle), soft),
        ]);
      }

      points.push([mid - rx, yE], [-W, yE]);

      cover.style.clipPath =
        "polygon(" +
        points
          .map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`)
          .join(",") +
        ")";


      
    }

    function fitComp() {
      gsap.set([comp, comp2, comp3, comp4].filter(Boolean), {
        scale: Math.min(innerWidth / 1920, innerHeight / 870),
      });
    }

    // Prepare the curve so the stroke draws from its start to its endpoint.
    if (arc) {
      const arcLength = arc.getTotalLength();

      gsap.set(arc, {
        strokeDasharray: arcLength,
        strokeDashoffset: arcLength,
        opacity: 1,
      });
    }

    // Bring the arch into position before the pinned sequence begins.
    const entranceTrigger = () => ({
      trigger: ".reveal",
      start: "top bottom",
      end: "top top",
      scrub: true,
      invalidateOnRefresh: true,
    });

    // Position and height: unchanged, linear.
    gsap.fromTo(
      shape,
      { yE: 1.15, h: -0.43 },
      {
        yE: START_SHAPE.yE,
        h: START_SHAPE.h,
        ease: "none",
        onUpdate: drawCover,
        scrollTrigger: entranceTrigger(),
      }
    );

    // Width: starts narrow and opens up as the dome rises.
    gsap.fromTo(
      shape,
      { rx: 0.16 },
      {
        rx: START_SHAPE.rx,
        ease: "power3.in",
        onUpdate: drawCover,
        scrollTrigger: entranceTrigger(),
      }
    );

    fitComp();
    drawCover();

    window.addEventListener("resize", () => {
      measure();
      fitComp();
      drawCover();

      if (arc) {
        const arcLength = arc.getTotalLength();
        gsap.set(arc, {
          strokeDasharray: arcLength,
          strokeDashoffset: arcLength,
        });
      }
    });

    ScrollTrigger.addEventListener("refresh", () => {
      measure();
      drawCover();
    });

    const scrollTl = gsap.timeline({
      defaults: { ease: "none" },
      onUpdate: drawCover,
      scrollTrigger: {
        trigger: ".reveal",
        start: "top top",
        end: "+=468.75%", // 30 timeline units x 15.625% (was 390.625% for 25 units)
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    function showText(selector, at) {
      scrollTl.fromTo(
        `${selector} .in`,
        {
          yPercent: 110,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.5,
          immediateRender: false,
        },
        at
      );
    }

    // Arch rises, turns into a bowl, then clears away.
    scrollTl
      .fromTo(
        shape,
        { ...START_SHAPE },
        {
          yE: 0.09,
          h: 0.3,
          rx: 0.66,
          duration: 0.6,
          ease: "none",
          immediateRender: false,
        },
        0
      )
      .to(shape, {
        yE: 0,
        h: 0.3,
        rx: 0.62,
        duration: 0.7,
        ease: "power1.out",
      })
      .to(shape, {
        yE: -0.15,
        h: 0.3,
        rx: 0.35,
        duration: 0.7,
        ease: "power1.inOut",
      })
      .to(shape, {
        yE: -0.45,
        h: 0.3,
        rx: 0.06,
        duration: 0.4,
        ease: "power1.in",
      });

    scrollTl.fromTo(
      ".bg-a",
      { scale: 1 },
      { scale: 1, duration: 3.9 },
      0
    );

    // Text and horizontal rule.
    showText(".t-from", 3.3);

    scrollTl.fromTo(
      ".rule",
      { scaleX: 0 },
      { scaleX: 1, duration: 0.56 },
      3.74
    );

    scrollTl.to(
      ".bg-b",
      { opacity: 1, duration: 0.48 },
      3.98
    );

    showText(".t-to", 4.22);

    // Draw the curve progressively from its start to its endpoint.
    if (arc) {
      scrollTl.to(
        arc,
        {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "none",
        },
        4.54
      );
    }

    scrollTl.to(
      ".bg-c",
      { opacity: 1, duration: 0.48 },
      5.18
    );

    showText(".t-craft", 5.58);
    showText(".t-without", 5.94);

    // Final background transition.
    scrollTl.to(
      ".bg-d",
      { opacity: 1, duration: 0.48 },
      6.46
    );

    // ---- Scene 2: first composition scrolls away, "Without ..." takes over ----

    // Rises at roughly scroll speed (1 timeline unit ≈ 0.156 viewport heights of scroll).
    scrollTl.to(
      comp,
      {
        y: () => -innerHeight * 0.95,
        duration: 5.4,
        ease: "none",
      },
      6.9
    );

    function showLine(selector, at) {
      scrollTl.fromTo(
        `${selector} .in`,
        { yPercent: 110, rotate: 3, opacity: 0, transformOrigin: "0% 100%" },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          duration: 0.5,
          immediateRender: false,
        },
        at
      );
    }

    showLine(".t2-label", 10.7);
    showLine(".t2-l1", 10.9);
    showLine(".t2-l2", 11.2);
    showLine(".t2-l3", 11.5);
    showLine(".t2-l4", 11.8);
    showLine(".t2-l5", 12.1);

    // ---- Comp 2 now exits (rises at scroll speed) as the new background arrives ----
    if (comp2) {
      scrollTl.to(
        comp2,
        { y: () => -innerHeight * 0.6, duration: 3.8, ease: "none" },
        13.4
      );
    }

    scrollTl.to(".bg-e", { opacity: 1, duration: 0.5 }, 13.4);

    // ---- Scene 3: "We're talking about a world where there's ..." ----
    if (comp3) {
      // Small upward settle while the sentence arrives.
      scrollTl.fromTo(
        comp3,
        { y: () => innerHeight * 0.08 },
        { y: 0, duration: 1.2, ease: "power1.out", immediateRender: false },
        15.6
      );
    }

    showLine(".t3-lead", 15.6);

    // Dashed curve draws in after the sentence lands.
    const curveMask = reveal.querySelector(".curve-mask");
    if (curveMask) {
      const curveLen = curveMask.getTotalLength();
      gsap.set(curveMask, { strokeDasharray: curveLen, strokeDashoffset: curveLen });
      scrollTl.to(curveMask, { strokeDashoffset: 0, duration: 1.4, ease: "none" }, 16.1);
    }

    // Stacked "more" lines.
    showLine(".t3-m1", 17.0);
    showLine(".t3-m2", 17.3);
    showLine(".t3-m3", 17.6);
    showLine(".t3-m4", 17.9);
    showLine(".t3-m5", 18.2);

    showLine(".t3-of", 18.5);

    // "& more  room for ..." arrive together.
    showLine(".t3-m6", 18.9);
    showLine(".t3-amp", 18.9);
    showLine(".t3-room", 19.2);

    // ---- Scene 4: background shrinks into a card, "Inspired by ..." arrives ----

    const TOTAL = 30; // keep in sync with `end` above (TOTAL x 15.625%)

    // Split a headline into letters so they can rise one after another.
    function splitChars(el) {
      if (!el) return [];
      const text = el.textContent;
      el.textContent = "";
      return [...text].map((c) => {
        const s = document.createElement("span");
        s.className = "ch";
        s.textContent = c === " " ? "\u00A0" : c;
        el.appendChild(s);
        return s;
      });
    }

    const h1Chars = splitChars(reveal.querySelector(".t4-h1 .hl"));
    const h2Chars = splitChars(reveal.querySelector(".t4-h2 .hl"));
    gsap.set([...h1Chars, ...h2Chars], { yPercent: 110 });

    // Invisible optimisation: once bg-e is fully in, the layers under it can't be
    // seen. Stop drawing them (bg-a also carries a full-screen saturate filter).
    scrollTl.to(
      [".bg-a", ".bg-b", ".bg-c", ".bg-d"],
      { autoAlpha: 0, duration: 0.01, immediateRender: false },
      14.1
    );

    // Scene 3 text fades while the card starts to shrink (same as before, just slower).
    if (comp3) {
      scrollTl.to(comp3, { opacity: 0, duration: 1.4, ease: "none" }, 20.0);
    }

    // The card: original technique and numbers, only stretched over more scroll.
    const SHRINK_AT = 19.9;
    const SHRINK_DUR = 5.6; // was 3.6

    scrollTl.fromTo(
      ".bg-stack",
      { left: "0%", right: "0%", top: "0%", bottom: "0%" },
      {
        left: "37.8%",
        right: "37.7%",
        top: "9.1%",
        bottom: "31%",
        duration: SHRINK_DUR,
        ease: "power1.inOut", // original ease
        immediateRender: false,
      },
      SHRINK_AT
    );

    // Pictures crossfade inside the shrinking card, evenly spaced.
    const FADE = 1.0;
    const seqStarts = [20.8, 21.8, 22.8, 23.8, 24.8];
    const beneath = [".bg-e", ".bg-f", ".bg-g", ".bg-h", ".bg-i"]; // layer each picture covers

    gsap.utils.toArray(".bg-seq").forEach((el, i) => {
      const at = seqStarts[i] ?? 24.8;
      scrollTl.to(el, { opacity: 1, duration: FADE }, at);

      // Invisible optimisation: once a picture is fully in, stop drawing the one under it.
      if (beneath[i]) {
        scrollTl.to(
          beneath[i],
          { autoAlpha: 0, duration: 0.01, immediateRender: false },
          at + FADE
        );
      }
    });

    // Headline, paragraph, button: same fades as before, just slower. The headline
    // starts as the card nears its end; line 2 follows line 1; copy + button fade in place.
    scrollTl.to(h1Chars, { yPercent: 0, duration: 1.0, stagger: 0.07 }, 25.2);
    scrollTl.to(h2Chars, { yPercent: 0, duration: 1.0, stagger: 0.05 }, 26.5);
    scrollTl.to(".t4-copy", { opacity: 1, duration: 1.0 }, 26.5);
    scrollTl.to(".t4-btn", { opacity: 1, duration: 1.0 }, 27.0);

    // Short hold at the end, and pin the timeline to TOTAL units.
    scrollTl.to({}, { duration: 0.2 }, TOTAL - 0.2);
  }

  // ---------- Next page reveal (curtain / footer-reveal effect) ----------
// The page itself is fixed underneath (see .page-next in CSS); the section above scrolls
// away and uncovers it. This scrub only adds the slower "parallax" on the page's content.
const nextPage = document.querySelector(".page-next");

if (nextPage) {
  gsap.fromTo(
    ".page-next-inner",
    { yPercent: 20 },
    {
      yPercent: 0,
      ease: "none",
      scrollTrigger: {
        trigger: nextPage,
        start: "top bottom", // page starts being uncovered
        end: "top top",      // page fully uncovered
        scrub: true,
        invalidateOnRefresh: true,
      },
    }
  );
}

// ---------- Proximity-scale star grid on the next page ----------
(() => {
  const canvas = document.querySelector(".n-grid");
  const page = document.querySelector(".page-next");
  const hole = document.querySelector(".n-portrait"); // the grid keeps this area clear
  if (!canvas || !page) return;
  const ctx = canvas.getContext("2d");

  // ---- tweak here ----
  const SHAPE = "star";     // "star" (4-point sparkle) or "dot"
  const GAP = 46;           // px between grid points
  const BASE = 3;           // resting size (radius, px)
  const MAX_SCALE = 4.5;    // how many times bigger a point gets right under the cursor
  const REACH = 240;        // px: how far the cursor's influence reaches
  const REST_ALPHA = 0.22;  // resting opacity
  // --------------------

  const ptr = { x: -9999, y: -9999, sx: -9999, sy: -9999 }; // raw and smoothed pointer
  let w = 0, h = 0, dpr = 1, visible = false;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }

  function sparkle(x, y, r) {
    const k = r * 0.28; // waist of the star
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.quadraticCurveTo(x + k, y - k, x + r, y);
    ctx.quadraticCurveTo(x + k, y + k, x, y + r);
    ctx.quadraticCurveTo(x - k, y + k, x - r, y);
    ctx.quadraticCurveTo(x - k, y - k, x, y - r);
    ctx.fill();
  }

  function draw() {
    if (!w || !h) return;

    // ease the pointer so the scaling glides instead of snapping
    if (ptr.x < -1000 || ptr.sx < -1000) {
      ptr.sx = ptr.x;
      ptr.sy = ptr.y;
    } else {
      ptr.sx += (ptr.x - ptr.sx) * 0.2;
      ptr.sy += (ptr.y - ptr.sy) * 0.2;
    }

    // pointer and portrait, measured relative to the canvas (it moves during the reveal)
    const cr = canvas.getBoundingClientRect();
    const mx = ptr.sx - cr.left;
    const my = ptr.sy - cr.top;
    let hx = 0, hy = 0, hrx = 0, hry = 0;
    if (hole) {
      const hr = hole.getBoundingClientRect();
      hx = hr.left - cr.left + hr.width / 2;
      hy = hr.top - cr.top + hr.height / 2;
      hrx = hr.width / 2;
      hry = hr.height / 2;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fff";

    const cols = Math.floor(w / GAP);
    const rows = Math.floor(h / GAP);
    const ox = (w - (cols - 1) * GAP) / 2;
    const oy = (h - (rows - 1) * GAP) / 2;

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = ox + i * GAP;
        const y = oy + j * GAP;

        if (hrx) {
          const nx = (x - hx) / hrx;
          const ny = (y - hy) / hry;
          if (nx * nx + ny * ny < 1) continue; // inside the portrait's oval
        }

        const d = Math.hypot(x - mx, y - my);
        const t = d < REACH ? 1 - d / REACH : 0;
        const k = t * t * (3 - 2 * t); // smoothstep falloff
        const size = BASE * (1 + (MAX_SCALE - 1) * k);

        ctx.globalAlpha = REST_ALPHA + (1 - REST_ALPHA) * k;
        if (SHAPE === "dot") {
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          sparkle(x, y, size);
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  window.addEventListener("pointermove", (e) => {
    ptr.x = e.clientX;
    ptr.y = e.clientY;
  }, { passive: true });
  document.documentElement.addEventListener("mouseleave", () => {
    ptr.x = ptr.y = -9999;
  });

  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas);
  resize();

  // only draw while the page is actually on screen
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !visible) {
      visible = true;
      gsap.ticker.add(draw);
    } else if (!entry.isIntersecting && visible) {
      visible = false;
      gsap.ticker.remove(draw);
    }
  }).observe(page);
})();

// ---------- Big stars swell as the cursor gets close (proximity scale) ----------
(() => {
  const stars = gsap.utils.toArray(".n-star");
  const page = document.querySelector(".page-next");
  if (!stars.length || !page) return;

  // ---- tweak here ----
  const REST = 0.8;   // resting scale: keep equal to the fallback in the CSS var(--s, 0.8)
  const MAX = 0.85;   // scale when the cursor is right on a star ("a bit" bigger)
  const REACH = 1.2;  // how far away it starts to react, in star-radiuses
  // --------------------

  const toScale = gsap.utils.mapRange(0, 1, REST, MAX); // closeness (0..1) -> scale
  gsap.set(stars, { "--s": REST });

  let visible = false;
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }).observe(page);

  window.addEventListener("pointermove", (e) => {
    if (!visible || e.pointerType === "touch") return;

    stars.forEach((el) => {
      const r = el.getBoundingClientRect();
      const radius = (Math.max(el.offsetWidth, el.offsetHeight) * REST) / 2;
      const d = Math.hypot(
        e.clientX - (r.left + r.width / 2),
        e.clientY - (r.top + r.height / 2)
      );
      const close = gsap.utils.clamp(0, 1, 1 - d / (radius * REACH));
      const eased = close * close * (3 - 2 * close); // smoothstep falloff

      gsap.to(el, {
        "--s": toScale(eased),
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  }, { passive: true });

  // cursor left the window: settle back to rest
  document.documentElement.addEventListener("mouseleave", () => {
    gsap.to(stars, { "--s": REST, duration: 0.8, ease: "power3.out", overwrite: "auto" });
  });
})();



}

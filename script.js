// ---------- Fill the portrait text block ----------
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
  .to(
    ".title-inner",
    {
      y: 0,
      duration: 1.1,
      stagger: 0.08,
      ease: "power4.out",
    },
    0.1
  )
  .to(
    ".hero-text",
    {
      opacity: 1,
      duration: 1,
    },
    0.6
  )
  .to(
    ".swoosh",
    {
      scaleX: 1,
      duration: 0.6,
      ease: "power2.out",
    },
    1.1
  );

// ---------- Hero content fades as it scrolls away ----------
gsap.to(".hero-left", {
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

gsap.to(".hero-right", {
  y: 100,
  scale: 0.92,
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
  const portrait = reveal.querySelector(".portrait-pin");
  const frame = reveal.querySelector(".frame");
  const arc = reveal.querySelector(".arc");

  if (!cover || !comp || !portrait || !frame) {
    console.warn(
      "Scroll animation not initialized: .reveal-cover, .reveal-comp, .portrait-pin, or .frame is missing."
    );
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

      // Keep the portrait above the arch, then hide it as the arch becomes a bowl.
      if (shape.h < 0) {
        const peak = yE + h;
        const gap = 0.04 * H;
        const lift = Math.max(0, (shape.h + 0.4) / 0.4) * 0.25 * H;

        portrait.style.opacity = Math.min(1, -shape.h / 0.25);
        portrait.style.transform =
          `translate3d(0,${(
            peak -
            DROP * H -
            gap -
            frame.offsetHeight -
            lift
          ).toFixed(1)}px,0)`;
      } else {
        portrait.style.opacity = 0;
      }
    }

    function fitComp() {
      gsap.set(comp, {
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
    gsap.fromTo(
      shape,
      {
        yE: 1,
        h: -0.43,
        rx: 0.36,
      },
      {
        ...START_SHAPE,
        ease: "none",
        onUpdate: drawCover,
        scrollTrigger: {
          trigger: ".reveal",
          start: "top bottom",
          end: "top top",
          scrub: true,
          invalidateOnRefresh: true,
        },
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
        end: "+=125%",
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,

        // Eight landing points through the pinned sequence.
        
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

    // Fade the composition away without moving it upward.
    scrollTl.to(
      comp,
      {
        opacity: 0,
        duration: 0.8,
        ease: "none",
      },
      6.9
    );

    // Keep the pinned section's total timeline at eight portions.
    scrollTl.to({}, { duration: 0.2 }, 7.8);
  }
}




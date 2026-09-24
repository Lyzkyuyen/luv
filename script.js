// ---------- Fill the portrait text block ----------
// Paste your own text into `line`. The loop below keeps appending it until the
// frame is full, so any length works (short phrases repeat, long ones just fill).
//
// >>> KEEP YOUR EXISTING TEXT HERE: replace PASTE_YOUR_TEXT_HERE with your original block. <<<
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
Like it's the old love `;

const txt = document.getElementById('txt');

function fillText() {
  txt.textContent = line;
  // Overfill by 50% so a font swap or resize can never leave a gap at the bottom.
  while (txt.scrollHeight <= txt.clientHeight * 1.5 && txt.textContent.length < 200000) {
    txt.textContent += line;
  }
}
fillText();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fillText);

gsap.registerPlugin(ScrollTrigger);

// ---------- Smooth wheel scrolling ----------
// A mouse wheel scrolls in big discrete jumps; Lenis glides between them like a trackpad.
// It is driven by GSAP's ticker so ScrollTrigger always sees the same scroll position.
if (window.Lenis) {
  const lenis = new Lenis({ lerp: 0.09 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ---------- Page-load entrance: headline lines rise up, "Sharlene" fades in, swoosh draws ----------
const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

tl.to(".title-inner", {
  y: 0,
  duration: 1.1,
  stagger: 0.08,
  ease: "power4.out",
}, 0.1)
.to(".hero-text", {
  opacity: 1,
  duration: 1,
}, 0.6)
.to(".swoosh", {
  scaleX: 1,
  duration: 0.6,
  ease: "power2.out",
}, 1.1);


// ---------- Scroll fade-away: hero content drifts and fades as you scroll past it ----------
gsap.to(".hero-left", {
  y: 60,
  opacity: 0.4,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
  }
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
  }
});


// ---------- Wave divider: drifts at a different rate than the page scroll ----------
gsap.to(".wave-divider", {
  yPercent: -25,
  ease: "none",
  scrollTrigger: {
    trigger: ".wave-divider",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  }
});


// The wave's path animation repaints every frame; only run it while visible.
const waveEl = document.querySelector(".wave-divider");
if ("IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => {
    waveEl.classList.toggle("is-paused", !entry.isIntersecting);
  }).observe(waveEl);
}

// ---------- Scroll sequence: arc reveal (pinned, portrait inside) ----------
const reveal = document.querySelector(".reveal");
const cover  = reveal.querySelector(".reveal-cover");
const comp   = reveal.querySelector(".reveal-comp");
const portrait = reveal.querySelector(".portrait-pin");
const frame    = reveal.querySelector(".frame");

// Cached size of the cover; re-measured only on resize / ScrollTrigger refresh.
let W = cover.clientWidth, H = cover.clientHeight;
function measure() { W = cover.clientWidth; H = cover.clientHeight; }

// Dome profile. An ellipse meets the flat edge at a right angle, which shows up as a
// hard "corner" at the sides. This profile eases into the edge with zero slope instead,
// so the dome melts into the line seamlessly.
//   SOFT = 1    -> plain ellipse (matches savor.it). Higher values give a pointier, bell-like dome.
// WIDEN compensates so the dome keeps roughly the same visual width as the ellipse.
// (Declared before anything that can call drawCover.)
const SOFT = 1;
const WIDEN = 1;

// Shape of the cover. yE and h are fractions of viewport height, rx of width.
//   h < 0  -> arch (the rising arc)      h > 0  -> bowl (hanging from the top)
// START_SHAPE is what you see while the section scrolls in and at the moment it pins.
const START_SHAPE = { yE: 1, h: -0.47, rx: 0.66 };
const shape = { ...START_SHAPE };

// Entry: runs the whole time the section scrolls in (top bottom -> top top).
// Stays narrow like savor.it for most of the scroll, then opens quickly before the pin.
gsap.fromTo(shape,
  { yE: 1, h: -0.43, rx: 0.36 },   // slightly lower and narrower start
  {
    ...START_SHAPE,                 // unchanged: h -0.47, rx 0.66 at the pin
    ease: "expo.in",                // was power1.in
    onUpdate: drawCover,
    scrollTrigger: {
      trigger: ".reveal",
      start: "top bottom",
      end: "top top",
      scrub: true,
    },
  }
);

function drawCover() {
  // Dome (h < 0): soft shoulders so it melts into the flat edge.
  // Bowl (h > 0): a plain elliptical bowl, no wavy shoulders.
  const soft  = shape.h < 0 ? SOFT  : 1;
  const widen = shape.h < 0 ? WIDEN : 1;
  const mid = W / 2, yE = shape.yE * H, h = shape.h * H, rx = shape.rx * W * widen;

  const pts = [[-W, -10], [2 * W, -10], [2 * W, yE], [mid + rx, yE]];
  const N = 90;
  for (let i = 1; i < N; i++) {
    const a = (Math.PI * i) / N;
    pts.push([mid + rx * Math.cos(a), yE + h * Math.pow(Math.sin(a), soft)]);
  }
  pts.push([mid - rx, yE], [-W, yE]);

  const clip =
    "polygon(" + pts.map(p => p[0].toFixed(1) + "px " + p[1].toFixed(1) + "px").join(",") + ")";

  cover.style.clipPath = clip;

  // Portrait rides on top of the dome's peak, so the dome never overlaps it.
  // As the arch flips into a bowl (h -> 0) it lifts away and fades out.
  if (shape.h < 0) {
    const peak = yE + h;                                  // y of the dome's top at centre
    const gap  = 0.04 * H;                                // breathing room above the peak
    const lift = Math.max(0, (shape.h + 0.4) / 0.4) * 0.25 * H;
    portrait.style.opacity = Math.min(1, -shape.h / 0.25);
    portrait.style.transform =
      "translate3d(0," + (peak - gap - frame.offsetHeight - lift).toFixed(1) + "px,0)";
  } else {
    portrait.style.opacity = 0;
  }
}

function fitComp() {
  gsap.set(comp, { scale: Math.min(innerWidth / 1920, innerHeight / 870) });
}

fitComp();
drawCover();
window.addEventListener("resize", () => { measure(); fitComp(); drawCover(); });
ScrollTrigger.addEventListener("refresh", () => { measure(); drawCover(); });

const scrollTl = gsap.timeline({
  defaults: { ease: "none" },
  onUpdate: drawCover,
  scrollTrigger: {
    trigger: ".reveal",
    start: "top top",
    end: "+=125%",          // scroll length of the pinned sequence (~8 timeline units, ~14% of a screen each)
    pin: true,
    scrub: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  },
});

// Masked slide-up + fade for a text line
const showText = (sel, at) =>
  scrollTl.fromTo(sel + " .in", { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5 }, at);

// 1) Arch flips into a bowl, rises, shrinks and vanishes (0 -> ~4)
// The cream boundary never disappears: the arch's peak (53% of the screen) becomes the
// bowl's bottom (39%) in one step, while its sides rise much faster.
scrollTl
  // arch flips into a bowl (bottom ≈ 39%)
  .fromTo(shape, { ...START_SHAPE },
    { yE: 0.09, h: 0.30, rx: 0.66, duration: 0.6, ease: "none", immediateRender: false }, 0)
  // bowl goes up, then shrinks
  .to(shape, { yE: 0.0,   h: 0.30, rx: 0.62, duration: 0.7, ease: "power1.out" })
  .to(shape, { yE: -0.15, h: 0.30, rx: 0.35, duration: 0.7, ease: "power1.inOut" })
  // gone (whole bowl sequence = 2.4 units)
  .to(shape, { yE: -0.45, h: 0.30, rx: 0.06, duration: 0.4, ease: "power1.in" });

scrollTl.fromTo(".bg-a", { scale: 1.25 }, { scale: 1, duration: 3.9 }, 0);

// 2) "From ..." -> line grows -> background swaps -> "to ..."
showText(".t-from", 3.3);
scrollTl.fromTo(".rule", { scaleX: 0 }, { scaleX: 1, duration: 0.56 }, 3.74);
scrollTl.to(".bg-b", { opacity: 1, duration: 0.48 }, 3.98);
showText(".t-to", 4.22);

// 3) Arc draws from under "to ...", dark background comes in, closing lines
scrollTl.fromTo(".arc", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2 }, 4.54);
scrollTl.to(".bg-c", { opacity: 1, duration: 0.48 }, 5.18);
showText(".t-craft", 5.58);
showText(".t-without", 5.94);

// 4) Everything drifts up, last background arrives, text fades out
scrollTl.to(comp, { y: () => -innerHeight * 0.16, duration: 0.64 }, 5.82);
scrollTl.to(".bg-d", { opacity: 1, duration: 0.48 }, 6.46);
scrollTl.to(comp, { y: () => -innerHeight * 0.45, duration: 0.72 }, 6.46);
scrollTl.to(comp, { opacity: 0, duration: 0.4 }, 6.94);
scrollTl.to({}, { duration: 0.3 }); // short hold before the pin releases
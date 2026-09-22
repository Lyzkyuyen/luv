// ---------- Fill the portrait text block ----------
const line = "I gotta take a little time A little time to think things over I better read between the lines In case I need it when I'm older Now this mountain I must climb Feels like a world upon my shoulders I through the clouds I see love shine It keeps me warm as life grows colder In my life there's been heartache and pain I don't know if I can face it again Can't stop now, I've travelled so far To change this lonely life I wanna know what love is I want you to show me I wanna feel what love is I know you can show me I'm gonna take a little time A little time to look around me I've got nowhere left to hide It looks like love has finally found me ";
document.getElementById('txt').textContent = line.repeat(40);

gsap.registerPlugin(ScrollTrigger);

// ---------- Page-load entrance: headline lines rise up, "Sharlene" fades in ----------
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
}, 0.6);


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
.to(".swoosh", {                 // NEW — the arc "draws in" right after Sharlene appears
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
    scrub: 1,
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
    scrub: 1,
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

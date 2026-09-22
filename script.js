// ---------- Fill the portrait text block ----------
const line = "I gotta take a little time A little time to think things over I better read between the lines In case I need it when I'm older Now this mountain I must climb Feels like a world upon my shoulders I through the clouds I see love shine It keeps me warm as life grows colder In my life there's been heartache and pain I don't know if I can face it again Can't stop now, I've travelled so far To change this lonely life I wanna know what love is I want you to show me I wanna feel what love is I know you can show me I'm gonna take a little time A little time to look around me I've got nowhere left to hide It looks like love has finally found me ";
document.getElementById('txt').textContent = line.repeat(40);

gsap.registerPlugin(ScrollTrigger);

// ---------- "Sharlene" pins, shrinks, and rises to a fixed spot near the top ----------
gsap.set(".hero-text", { xPercent: -50, yPercent: -50 });

gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "+=100%",
    scrub: true,
    pin: true,
  }
})
.to(".hero-text", {
  top: "8vh",
  yPercent: -50,
  scale: 0.65,
  ease: "none",
});

// ---------- Wave divider: drifts at a different rate than the page scroll ----------
// this is what makes it feel like a separate depth layer rather than static decoration
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
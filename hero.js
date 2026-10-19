/* Hero reel: plays the clips below one after another with a 1 s crossfade. Add or remove entries here; each needs a .mp4 (1920x1080, muted)
   and a .jpg poster of the same name in media/. The first entry is also the poster shown before playback starts. */
(function () {
  var CLIPS = [
    "diablo_lazarus_rain", "hero_moreina_hearth", "hero_minicenter_door", "hero_jazreth", "hero_aidan_hearth", "diablo_moreina_rain",
    "hero_cain_candle", "hero_minicenter_shop", "hero_moreina_bow", "diablo_lazarus_hall", "hero_aidan_steps", "hero_moreina_window",
    "hero_aidan_fists", "hero_cain_dawn"
  ];
  var FADE = 1.0;            // seconds of crossfade; the next clip starts this long before the current one ends
  var reel = document.querySelector(".hero-reel");
  if (!reel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var vids = reel.querySelectorAll("video"), cur = 0, idx = 0, switching = false;
  function src(i) { return "media/" + CLIPS[i % CLIPS.length] + ".mp4"; }
  function load(v, i) { v.src = src(i); v.load(); }
  function show(v) { v.classList.add("on"); }
  function hide(v) { v.classList.remove("on"); }
  function start() {
    var a = vids[cur], b = vids[1 - cur];
    load(b, idx + 1);                                   // the next clip is always loaded before it is needed
    show(a);
    var p = a.play(); if (p && p.catch) p.catch(function () {});   // autoplay refused: the poster stays
  }
  function step() {
    var a = vids[cur], b = vids[1 - cur];
    if (switching || !a.duration || a.duration - a.currentTime > FADE) return;
    switching = true;
    if (!b.src) load(b, idx + 1);
    var p = b.play();
    var go = function () {
      show(b); hide(a);
      setTimeout(function () { a.pause(); cur = 1 - cur; idx += 1; load(a, idx + 1); switching = false; }, FADE * 1000 + 50);
    };
    if (p && p.then) p.then(go).catch(function () { switching = false; }); else go();
  }
  vids.forEach(function (v) { v.muted = true; v.setAttribute("muted", ""); v.playsInline = true; v.addEventListener("timeupdate", step); v.addEventListener("ended", step); });
  load(vids[0], 0); start();
})();

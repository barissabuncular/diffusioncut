/* Hero reel: plays the clips below one after another with a 1 s crossfade. Add or remove entries here; each needs a .mp4 (1920x1080, muted)
   in media/. The first entry's .jpg is the poster shown before playback starts. The fade is driven by this script on a wrapper
   around each video, because a stylesheet transition on the video itself is lost when the other video loads its next source. */
(function () {
  var CLIPS = [
    "diablo_lazarus_rain", "hero_moreina_hearth", "hero_minicenter_door", "hero_jazreth", "hero_aidan_hearth", "diablo_moreina_rain",
    "hero_cain_candle", "hero_minicenter_shop", "hero_moreina_bow", "diablo_lazarus_hall", "hero_aidan_steps", "hero_moreina_window",
    "hero_aidan_fists", "hero_cain_dawn"
  ];
  var FADE = 1.0, LEVEL = 0.55;   // crossfade seconds; the reel's opacity under the text
  var reel = document.querySelector(".hero-reel");
  if (!reel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var slots = reel.querySelectorAll(".slot"), vids = [], cur = 0, idx = 0, switching = false;
  slots.forEach(function (s) { vids.push(s.querySelector("video")); });
  function src(i) { return "media/" + CLIPS[i % CLIPS.length] + ".mp4"; }
  function load(v, i) { v.src = src(i); v.load(); }
  function fade(inSlot, outSlot, done) {
    var t0 = null;
    function tick(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / (FADE * 1000));
      inSlot.style.opacity = (LEVEL * p).toFixed(3); outSlot.style.opacity = (LEVEL * (1 - p)).toFixed(3);
      if (p < 1) requestAnimationFrame(tick); else done();
    }
    requestAnimationFrame(tick);
  }
  function step() {
    var a = vids[cur], b = vids[1 - cur];
    if (switching || !a.duration || a.duration - a.currentTime > FADE) return;
    switching = true;
    if (!b.src) load(b, idx + 1);
    var p = b.play();
    var go = function () {
      fade(slots[1 - cur], slots[cur], function () {
        a.pause(); cur = 1 - cur; idx += 1; load(vids[1 - cur], idx + 1); switching = false;
      });
    };
    if (p && p.then) p.then(go).catch(function () { switching = false; }); else go();
  }
  vids.forEach(function (v) { v.muted = true; v.setAttribute("muted", ""); v.playsInline = true; v.addEventListener("timeupdate", step); v.addEventListener("ended", step); });
  load(vids[0], 0); load(vids[1], 1); slots[0].style.opacity = LEVEL;
  var p0 = vids[0].play(); if (p0 && p0.catch) p0.catch(function () {});   // autoplay refused: the poster stays
})();

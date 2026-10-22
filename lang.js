// Language pick. An English page that has a Turkish twin (data-tr) sends visitors
// in Turkey there. "In Turkey" means the device is set to Istanbul time; no IP lookup.
// The footer language links add ?lang=en or ?lang=tr, and that choice is remembered.
(function () {
  var twin = document.currentScript && document.currentScript.getAttribute('data-tr');
  var m = /[?&]lang=(en|tr)\b/.exec(location.search);
  var pref = m && m[1];
  try {
    if (pref) localStorage.setItem('dc_lang', pref);
    else pref = localStorage.getItem('dc_lang');
  } catch (e) {}
  if (!twin || pref === 'en') return;
  var tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
  if (pref === 'tr' || tz === 'Europe/Istanbul' || tz === 'Asia/Istanbul') {
    var q = location.search.replace(/([?&])lang=(en|tr)&?/, '$1').replace(/[?&]$/, '');
    location.replace(twin + q + location.hash);
  }
})();

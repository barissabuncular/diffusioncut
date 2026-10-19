// Order form: preselects the plan from ?plan=product|brand|monthly, posts to
// Web3Forms, and falls back to a prefilled mail while the access key is not set.
(function () {
  var form = document.getElementById('order');
  if (!form) return;
  var tr = document.documentElement.lang === 'tr';
  var t = tr ? {
    sending: 'Gönderiliyor…', fail: 'Gönderilemedi. Lütfen hello@diffusioncut.com adresine yazın.',
    missing: 'Lütfen işaretli alanları doldurun.', mailSubject: 'Sipariş: '
  } : {
    sending: 'Sending…', fail: 'Could not send. Please email hello@diffusioncut.com instead.',
    missing: 'Please fill in the marked fields.', mailSubject: 'Order: '
  };

  var want = new URLSearchParams(location.search).get('plan');
  if (want) {
    var r = form.querySelector('input[name=plan][data-plan="' + want + '"]');
    if (r) r.checked = true;
  }

  var msg = document.getElementById('msg');
  var key = form.access_key.value;
  var hasKey = key && key.indexOf('WEB3FORMS') !== 0;

  function show(text, bad) { msg.textContent = text; msg.hidden = false; msg.classList.toggle('bad', !!bad); }

  function done() {
    document.getElementById('done-email').textContent = form.email.value;
    form.hidden = true;
    document.getElementById('done').hidden = false;
    window.scrollTo(0, 0);
  }

  function mailFallback() {
    var f = form;
    var body = [
      'Plan: ' + f.plan.value, 'Brand: ' + f.brand.value, 'Site: ' + f.site.value,
      'Product: ' + f.product.value, 'Goal: ' + f.goal.value, 'Name: ' + f.name.value, 'Email: ' + f.email.value
    ].join('\n');
    location.href = 'mailto:hello@diffusioncut.com?subject=' + encodeURIComponent(t.mailSubject + f.brand.value) +
      '&body=' + encodeURIComponent(body);
    done();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = false;
    form.querySelectorAll('[required]').forEach(function (el) {
      var ok = el.value.trim() && (el.type !== 'email' || el.validity.valid);
      el.classList.toggle('invalid', !ok);
      if (!ok) bad = true;
    });
    if (bad) { show(t.missing, true); return; }
    if (form.botcheck.checked) return;
    if (!hasKey) { mailFallback(); return; }

    show(t.sending);
    var btn = form.querySelector('button'); btn.disabled = true;
    var data = {};
    new FormData(form).forEach(function (v, k) { if (k !== 'botcheck') data[k] = v; });
    fetch('https://api.web3forms.com/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (j.success) done(); else throw new Error(j.message);
    }).catch(function () { show(t.fail, true); btn.disabled = false; });
  });
})();

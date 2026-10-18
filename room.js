/* Shared helpers for the Campfire pages. */

/* ---------- The flame cursor (v3, layered) ----------
   Three nested layers, each owning exactly ONE job, so no two effects
   can ever fight over the same property:
     .flame-cursor -> position only (moved by this script)
     .flame-inner  -> the "hot" flare only (a CSS scale)
     .flame-core   -> the flicker only (a CSS animation)
   The system arrow hides on our site (mouse devices only) and the
   flame follows the hand with a slight lag, dimming and brightening. */
(function () {
  var fine = window.matchMedia('(pointer: fine)').matches;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || calm) return;   // touchscreens and calm-motion users keep the normal cursor

  var flame = document.createElement('div');
  flame.className = 'flame-cursor';
  flame.innerHTML = '<div class="flame-inner"><div class="flame-glow"></div><div class="flame-core"></div></div>';
  document.documentElement.appendChild(flame);
  document.documentElement.classList.add('has-flame-cursor');

  var x = -100, y = -100, tx = -100, ty = -100, started = false;
  window.addEventListener('pointermove', function (e) {
    tx = e.clientX; ty = e.clientY;
    if (!started) { x = tx; y = ty; started = true; flame.classList.add('lit'); }
  }, { passive: true });

  (function follow() {
    x += (tx - x) * 0.45;      // the lag: the flame chases the hand, never glued to it
    y += (ty - y) * 0.45;
    flame.style.transform = 'translate3d(' + (x - 13) + 'px,' + (y - 24) + 'px,0)';
    requestAnimationFrame(follow);
  })();

  // Burn stronger over anything clickable.
  document.addEventListener('mouseover', function (e) {
    var hot = e.target.closest ? e.target.closest('a, button, input, select, textarea, label') : null;
    flame.classList.toggle('hot', !!hot);
  });
})();

/* Shared helpers for the Campfire pages. */

/* ---------- The flame cursor ----------
   Not a picture of a fire: a living flame rendered by the page.
   The system arrow hides on our site (only when a real mouse exists)
   and this flame follows the hand with a slight lag, flickering and
   dimming like a real flame, leaning with the speed of the movement.
   Near anything clickable, it burns stronger. */
(function () {
  var fine = window.matchMedia('(pointer: fine)').matches;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || calm) return;   // touchscreens and calm-motion users keep the normal cursor

  var flame = document.createElement('div');
  flame.className = 'flame-cursor';
  flame.innerHTML = '<div class="flame-glow"></div><div class="flame-core"></div>';
  // On <html>, not <body>: a fixed element is framed by the viewport only
  // if no ancestor traps it — <html> never carries our page animations.
  document.documentElement.appendChild(flame);
  document.documentElement.classList.add('has-flame-cursor');

  var x = -100, y = -100, tx = -100, ty = -100, started = false;
  document.addEventListener('mousemove', function (e) {
    tx = e.clientX; ty = e.clientY;
    if (!started) { x = tx; y = ty; started = true; }   // first move: start on the hand, no long chase
  });

  (function follow() {
    var dx = tx - x;
    x += dx * 0.35;            // the lag: the flame chases the hand, never glued to it
    y += (ty - y) * 0.35;
    var lean = Math.max(-18, Math.min(18, dx * 0.45));   // wind: fast moves tilt the flame
    flame.style.transform = 'translate3d(' + (x - 13) + 'px,' + (y - 24) + 'px,0) rotate(' + lean + 'deg)';
    requestAnimationFrame(follow);
  })();

  // Burn stronger over anything clickable.
  document.addEventListener('mouseover', function (e) {
    var hot = e.target.closest ? e.target.closest('a, button, input, select, textarea, label') : null;
    flame.classList.toggle('hot', !!hot);
  });
})();

// Gentle page transitions: when a link leads to another Campfire page,
// fade this page out first instead of blinking away. Pages fade/rise
// back in through the CSS animations.
document.addEventListener('click', function (e) {
  var a = e.target.closest ? e.target.closest('a[href]') : null;
  if (!a) return;
  var href = a.getAttribute('href');
  if (!href || href.charAt(0) === '#' || a.target === '_blank') return;
  if (!/\.html($|[?#])/.test(href)) return;
  e.preventDefault();
  document.body.classList.add('leaving');
  setTimeout(function () { window.location.href = href; }, 180);
});

// Make a random string of letters+digits of the given length.
// Uses the browser's cryptographic randomness — room addresses and
// creator keys must be unguessable, so Math.random() is not good enough.
function makeSlug(length) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var out = '';
  var bytes = new Uint8Array(length);
  window.crypto.getRandomValues(bytes);
  for (var i = 0; i < length; i++) {
    out += chars[bytes[i] % chars.length];
  }
  return out;
}

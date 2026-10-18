/* Shared helpers for the Campfire pages. */

/* ---------- The flame cursor (v5, event-driven, single) ----------
   The flame is positioned INSIDE the pointermove handler itself, so
   it can never be anywhere except on the hand — no animation loop,
   no lag state, nothing that can stall or drift at any frame rate.
   No CSS transition on position: instant steps, no ghost trail. Layers:
     .flame-cursor -> position only (set by this script)
     .flame-inner  -> the "hot" flare only (a CSS scale)
     .flame-core   -> the flicker only (a CSS animation) */
(function () {
  var fine = window.matchMedia('(pointer: fine)').matches;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || calm) return;   // touchscreens and calm-motion users keep the normal cursor

  // Hide the system arrow. Injected by this script so the rule exists
  // exactly when (and only when) the flame itself is alive.
  var style = document.createElement('style');
  style.textContent = '* { cursor: none !important; }';
  document.head.appendChild(style);

  var flame = document.createElement('div');
  flame.className = 'flame-cursor';
  flame.innerHTML = '<div class="flame-inner"><div class="flame-glow"></div><div class="flame-core"></div></div>';
  document.documentElement.appendChild(flame);

  window.addEventListener('pointermove', function (e) {
    flame.style.transform = 'translate3d(' + (e.clientX - 10) + 'px,' + (e.clientY - 17) + 'px,0)';
    flame.classList.add('lit');
  }, { passive: true });

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

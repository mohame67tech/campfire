/* Shared helpers for the Campfire pages. */

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

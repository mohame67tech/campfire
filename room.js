/* Shared helpers for the Campfire pages. */

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

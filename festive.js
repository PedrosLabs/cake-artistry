// Christmas holly on the home page logo.
// To remove it, delete the <script src="festive.js"> line in index.html,
// plus images/holly.svg and the "Christmas holly" block in styles.css.
(() => {
  // Same end date as the snow (see snow.js). Change it to keep the holly up
  // for longer or shorter.
  const FESTIVE_UNTIL = new Date('2027-01-07T00:00:00');
  if (new Date() >= FESTIVE_UNTIL) return;

  const wrap = document.querySelector('.hero-logo-wrap');
  if (!wrap) return;

  // Laid over the logo so the original logo file stays untouched
  const holly = document.createElement('img');
  holly.src = 'images/holly.svg';
  holly.alt = ''; // decoration only, so screen readers skip it
  holly.className = 'hero-holly';
  wrap.append(holly);
})();

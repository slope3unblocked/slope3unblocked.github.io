(function (d, s) {
  'use strict';
  var counter = d.getElementById('licntF2E9');
  if (!counter || counter.getAttribute('data-liveinternet-initialized') === 'true') return;
  counter.setAttribute('data-liveinternet-initialized', 'true');
  counter.src = 'https://counter.yadro.ru/hit?t45.18;r' + escape(d.referrer) +
    (typeof s === 'undefined' ? '' : ';s' + s.width + '*' + s.height + '*' +
      (s.colorDepth ? s.colorDepth : s.pixelDepth)) +
    ';u' + escape(d.URL) + ';h' + escape(d.title.substring(0, 150)) + ';' + Math.random();
})(document, typeof screen === 'undefined' ? undefined : screen);

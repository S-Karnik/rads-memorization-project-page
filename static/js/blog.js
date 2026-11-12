// Interactions for the blog-style sections: side TOC highlighting, plot tabs, BibTeX copy.
(function () {
  // Highlight the TOC entry for the section nearest the top of the viewport.
  var links = Array.prototype.slice.call(document.querySelectorAll('.toc a'));
  var targets = links
    .map(function (a) { return { link: a, el: document.querySelector(a.getAttribute('href')) }; })
    .filter(function (x) { return x.el; });
  if (targets.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      var visible = entries
        .filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
      if (!visible.length) return;
      var hit = targets.find(function (t) { return t.el === visible[0].target; });
      if (!hit) return;
      links.forEach(function (l) { l.classList.toggle('active', l === hit.link); });
    }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });
    targets.forEach(function (t) { observer.observe(t.el); });
  }

  // Tabs that switch between result plots.
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var buttons = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          var selected = b === btn;
          b.setAttribute('aria-selected', selected ? 'true' : 'false');
          var panel = document.getElementById(b.getAttribute('aria-controls'));
          if (panel) panel.hidden = !selected;
        });
      });
    });
  });

  // Copy BibTeX to the clipboard.
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pre = btn.parentElement.querySelector('pre');
      if (!pre || !navigator.clipboard) return;
      navigator.clipboard.writeText(pre.innerText.trim()).then(function () {
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
      });
    });
  });
})();

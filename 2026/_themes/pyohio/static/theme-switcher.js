(function () {
  'use strict';
  var STORAGE_KEY = 'pyohio-theme';
  var STATES = ['system', 'standard', 'high-contrast'];
  var THEME_FOR = { 'standard': 'pyohio-light', 'high-contrast': 'pyohio-high-contrast' };
  var ANNOUNCE = {
    'system': 'Display contrast: System (auto)',
    'standard': 'Display contrast: Standard',
    'high-contrast': 'Display contrast: High contrast'
  };

  var contrastQuery = window.matchMedia('(prefers-contrast: more)');

  function getSaved() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return STATES.indexOf(v) >= 0 ? v : 'system';
    } catch (e) {
      return 'system';
    }
  }

  function setSaved(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  function effectiveTheme(saved) {
    if (saved === 'system') {
      return contrastQuery.matches ? 'high-contrast' : 'standard';
    }
    return saved;
  }

  function getLiveRegion() {
    var el = document.getElementById('theme-switcher-live');
    if (!el) {
      el = document.createElement('div');
      el.id = 'theme-switcher-live';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.className = 'sr-only';
      document.body.appendChild(el);
    }
    return el;
  }

  function applyTheme(saved, opts) {
    opts = opts || {};
    var eff = effectiveTheme(saved);
    document.documentElement.setAttribute('data-theme', THEME_FOR[eff]);
    syncControls(saved);
    if (opts.announce) {
      // Tiny delay so SR re-reads the message even if it matches the previous one
      var live = getLiveRegion();
      live.textContent = '';
      setTimeout(function () { live.textContent = ANNOUNCE[saved]; }, 50);
    }
  }

  function syncControls(saved) {
    // Quick toggle: swap the visible icon on the trigger summary
    var triggers = document.querySelectorAll('.theme-switcher-quick-trigger');
    triggers.forEach(function (trigger) {
      trigger.querySelectorAll('[data-theme-icon]').forEach(function (icon) {
        if (icon.getAttribute('data-theme-icon') === saved) {
          icon.removeAttribute('hidden');
        } else {
          icon.setAttribute('hidden', '');
        }
      });
    });
    // Update all radios (both quick and detailed)
    var radios = document.querySelectorAll('[data-theme-control]');
    radios.forEach(function (radio) {
      radio.checked = (radio.value === saved);
    });
  }

  function init() {
    applyTheme(getSaved());

    // Safari/WebKit doesn't fire `click` on the absolutely-positioned overlay
    // input (mousedown lands but click never completes), so the radio never
    // toggles. Handle the click at the label level and drive the radio +
    // change event ourselves. Other browsers fire change natively, in which
    // case our `radio.checked` short-circuit makes this a no-op.
    document.addEventListener('click', function (e) {
      var label = e.target.closest('label');
      if (!label) return;
      var radio = label.querySelector('input[type="radio"][data-theme-control]');
      if (!radio || radio.checked) return;
      document.querySelectorAll('input[type="radio"][name="' + radio.name + '"]').forEach(function (r) {
        r.checked = (r === radio);
      });
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Radio group changes (covers both navbar popover and footer)
    document.addEventListener('change', function (e) {
      var radio = e.target.closest('[data-theme-control]');
      if (!radio || !radio.checked) return;
      setSaved(radio.value);
      applyTheme(radio.value, { announce: true });
      // Close the popover if the change came from inside the navbar variant
      var details = radio.closest('details.theme-switcher-quick');
      if (details && details.open) {
        // Defer so the radio's checked state is committed first
        setTimeout(function () {
          details.open = false;
          var trigger = details.querySelector('summary');
          if (trigger) trigger.focus();
        }, 0);
      }
    });

    // Click outside the navbar popover closes it
    document.addEventListener('click', function (e) {
      document.querySelectorAll('details.theme-switcher-quick[open]').forEach(function (d) {
        if (!d.contains(e.target)) d.open = false;
      });
    });

    // Escape closes the popover and refocuses the trigger
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('details.theme-switcher-quick[open]').forEach(function (d) {
          d.open = false;
          var trigger = d.querySelector('summary');
          if (trigger) trigger.focus();
        });
      }
    });

    // Close popover when focus leaves the details (covers Tab forward / Shift+Tab backward).
    // Require an actual relatedTarget so we don't close on transient mouse-induced
    // blurs — Safari blurs the summary when mousedown lands on the radio with no
    // immediate focus destination, which would otherwise hide the popover before
    // mouseup fires and make the click land on the wrong element.
    document.querySelectorAll('details.theme-switcher-quick').forEach(function (d) {
      d.addEventListener('focusout', function (e) {
        if (e.relatedTarget && !d.contains(e.relatedTarget)) {
          d.open = false;
        }
      });
    });

    // Re-resolve theme if OS contrast changes and we're in 'system' mode
    var onContrastChange = function () {
      if (getSaved() === 'system') applyTheme('system');
    };
    if (contrastQuery.addEventListener) {
      contrastQuery.addEventListener('change', onContrastChange);
    } else if (contrastQuery.addListener) {
      contrastQuery.addListener(onContrastChange);
    }

    // Cross-tab sync
    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE_KEY) applyTheme(getSaved());
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

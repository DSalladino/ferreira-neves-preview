(function () {
  'use strict';

  /* ---------- Medição sem cookies ----------
     Os eventos ficam disponíveis em window.dataLayer para uma futura
     integração com GTM/GA4. Nenhum dado é enviado para terceiros por
     este site enquanto não houver uma ferramenta de analytics instalada. */
  window.dataLayer = window.dataLayer || [];
  function track(event, params) {
    var payload = { event: event };
    if (params) {
      Object.keys(params).forEach(function (key) { payload[key] = params[key]; });
    }
    window.dataLayer.push(payload);
  }
  window.fnTrack = track;

  document.addEventListener('click', function (event) {
    var link = event.target.closest ? event.target.closest('a[href^="tel:"], a[href^="mailto:"]') : null;
    if (!link) return;
    track(link.getAttribute('href').indexOf('tel:') === 0 ? 'click_telefone' : 'click_email', {
      link_url: link.getAttribute('href')
    });
  });

  /* ---------- Header on scroll ---------- */
  var header = document.getElementById('siteHeader');
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var nav = document.getElementById('mainNav');
  var navToggle = document.querySelector('.nav-toggle');

  function setNav(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('nav-open', open);
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = !nav.classList.contains('is-open');
      setNav(open);
      if (open) {
        window.setTimeout(function () {
          if (!nav.classList.contains('is-open')) return;
          var firstLink = nav.querySelector('a');
          if (firstLink) firstLink.focus();
        }, 430);
      }
    });

    nav.addEventListener('keydown', function (event) {
      if (event.key !== 'Tab' || !nav.classList.contains('is-open')) return;
      var focusable = Array.prototype.filter.call(
        nav.querySelectorAll('a, button'),
        function (el) { return el.offsetParent !== null; }
      );
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setNav(false); });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setNav(false);
        navToggle.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(event.target) || navToggle.contains(event.target)) return;
      setNav(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1180) setNav(false);
    });
  }

  /* ---------- Alert bar ---------- */
  var alertBar = document.getElementById('alertBar');
  var alertClose = document.querySelector('[data-alert-close]');

  try {
    if (alertBar && sessionStorage.getItem('fn-alert-dismissed') === '1') {
      alertBar.hidden = true;
    }
  } catch (error) { /* storage may be unavailable */ }

  if (alertClose && alertBar) {
    alertClose.addEventListener('click', function () {
      alertBar.hidden = true;
      try { sessionStorage.setItem('fn-alert-dismissed', '1'); } catch (error) {}
    });
  }

  /* ---------- Mapa com consentimento ---------- */
  var mapConsent = document.querySelector('[data-map-consent]');
  var mapLoad = document.querySelector('[data-map-load]');

  if (mapConsent && mapLoad) {
    mapLoad.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.title = 'Mapa da localização do Ferreira Neves Advogados no Centro do Rio de Janeiro';
      iframe.src = 'https://www.google.com/maps?q=Rua%20Primeiro%20de%20Mar%C3%A7o%2C%2017%2C%20Centro%2C%20Rio%20de%20Janeiro%20-%20RJ&output=embed';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;
      mapConsent.innerHTML = '';
      mapConsent.appendChild(iframe);
      mapConsent.classList.add('is-loaded');
      track('map_load');
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -4% 0px', threshold: 0.01 });

    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  function setError(field, message) {
    if (!field || !form) return;
    var error = form.querySelector('[data-error-for="' + field.id + '"]');
    if (message) {
      field.setAttribute('aria-invalid', 'true');
      if (error) error.textContent = message;
    } else {
      field.removeAttribute('aria-invalid');
      if (error) error.textContent = '';
    }
  }

  function validate() {
    var firstInvalid = null;
    var fields = [
      { id: 'nome', message: 'Informe seu nome.' },
      { id: 'email', message: 'Informe um e-mail válido.' },
      { id: 'mensagem', message: 'Escreva uma breve mensagem.' }
    ];

    fields.forEach(function (item) {
      var field = document.getElementById(item.id);
      if (!field) return;
      var value = field.value.trim();
      var invalid = !value;

      if (item.id === 'email' && value) {
        invalid = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      }

      setError(field, invalid ? item.message : '');
      if (invalid && !firstInvalid) firstInvalid = field;
    });

    var consent = document.getElementById('lgpd');
    if (consent && !consent.checked) {
      consent.setAttribute('aria-invalid', 'true');
      var consentError = form.querySelector('[data-error-for="lgpd"]');
      if (consentError) consentError.textContent = 'É necessário autorizar o contato.';
      if (!firstInvalid) firstInvalid = consent;
    } else if (consent) {
      consent.removeAttribute('aria-invalid');
      var consentErrorClear = form.querySelector('[data-error-for="lgpd"]');
      if (consentErrorClear) consentErrorClear.textContent = '';
    }

    return firstInvalid;
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var invalid = validate();

      if (invalid) {
        if (status) {
          status.textContent = 'Revise os campos destacados para continuar.';
          status.classList.add('is-visible');
        }
        invalid.focus();
        return;
      }

      var nome = document.getElementById('nome').value.trim();
      var email = document.getElementById('email').value.trim();
      var telefone = document.getElementById('telefone').value.trim();
      var assunto = document.getElementById('assunto').value;
      var mensagem = document.getElementById('mensagem').value.trim();

      var subject = 'Contato pelo site' + (assunto ? ' — ' + assunto : '');
      var body = [
        'Nome: ' + nome,
        'E-mail: ' + email,
        telefone ? 'Telefone: ' + telefone : '',
        assunto ? 'Assunto: ' + assunto : '',
        '',
        mensagem
      ].filter(Boolean).join('\n');

      track('contact_form_submit', { assunto: assunto || 'nao_informado' });

      window.location.href = 'mailto:contato@ferreiranevesadvogados.com.br'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);

      if (status) {
        status.textContent = 'Abrimos seu aplicativo de e-mail com a mensagem preenchida. Se nada acontecer, escreva para contato@ferreiranevesadvogados.com.br.';
        status.classList.add('is-visible');
      }
    });

    ['nome', 'email', 'mensagem'].forEach(function (id) {
      var field = document.getElementById(id);
      if (!field) return;
      field.addEventListener('input', function () { setError(field, ''); });
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();

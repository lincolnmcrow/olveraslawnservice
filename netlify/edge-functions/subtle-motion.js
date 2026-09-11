const motionStyles = `
<style id="olvera-subtle-motion">
  /* Subtle motion layer: visual polish only, no layout/content changes. */
  @media (prefers-reduced-motion: no-preference) {
    .ols-motion-target {
      opacity: 0;
      transform: translateY(18px);
      transition: opacity 700ms cubic-bezier(.22,1,.36,1), transform 700ms cubic-bezier(.22,1,.36,1);
      transition-delay: var(--ols-delay, 0ms);
    }

    .ols-motion-target.ols-in {
      opacity: 1;
      transform: translateY(0);
    }

    .ols-motion-child {
      opacity: 0;
      transform: translateY(12px);
      transition: opacity 550ms cubic-bezier(.22,1,.36,1), transform 550ms cubic-bezier(.22,1,.36,1);
      transition-delay: var(--ols-delay, 0ms);
    }

    .ols-motion-target.ols-in .ols-motion-child {
      opacity: 1;
      transform: translateY(0);
    }

    .service-card,
    .trust-card,
    .how-step,
    .why-us-item,
    .insta-thumb,
    .ba-card,
    .inquiry-container,
    .hours-container,
    .map-container,
    .local-banner-inner {
      transition: transform 350ms cubic-bezier(.22,1,.36,1), box-shadow 350ms ease, border-color 350ms ease;
      will-change: transform;
    }

    .service-card:hover,
    .trust-card:hover,
    .how-step:hover,
    .why-us-item:hover,
    .ba-card:hover,
    .inquiry-container:hover,
    .hours-container:hover,
    .map-container:hover {
      transform: translateY(-3px);
    }

    .insta-thumb:hover {
      transform: translateY(-5px) scale(1.01);
    }

    .hero-card {
      animation: olsHeroFloat 7s ease-in-out 1.2s infinite;
    }

    .hero-play-btn {
      animation: olsSoftPulse 3.5s ease-in-out infinite;
    }

    .nav-btn,
    .btn-main,
    .btn-outline,
    .btn-secondary {
      transition: transform 220ms ease, box-shadow 220ms ease, background-color 220ms ease, border-color 220ms ease, color 220ms ease;
    }

    .nav-btn:hover,
    .btn-main:hover,
    .btn-outline:hover,
    .btn-secondary:hover {
      transform: translateY(-2px);
    }

    .serving-list li {
      transition: transform 220ms ease, box-shadow 220ms ease;
    }

    .serving-list li:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 18px rgba(20,33,24,.08);
    }

    @keyframes olsHeroFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }

    @keyframes olsSoftPulse {
      0%, 100% { transform: scale(1); opacity: .92; }
      50% { transform: scale(1.04); opacity: 1; }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ols-motion-target,
    .ols-motion-child { opacity: 1 !important; transform: none !important; transition: none !important; }
  }
</style>`;

const motionScript = `
<script id="olvera-subtle-motion-script">
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const selectors = [
    '.serving-section', '.trust-section', '.how-it-works', '.founder-section',
    '.local-banner', '.services', '.ba-section', '.instagram-section', '.why-us',
    '.service-table-section', '.gallery-slider', '.info-reviews-map-section',
    '#service-checker', '#faq', '.inquiry-section'
  ];

  const targets = document.querySelectorAll(selectors.join(','));
  targets.forEach((el) => {
    el.classList.add('ols-motion-target');
    const children = el.querySelectorAll('.trust-card, .how-step, .service-card, .why-us-item, .insta-thumb');
    children.forEach((child, index) => {
      child.classList.add('ols-motion-child');
      child.style.setProperty('--ols-delay', Math.min(index * 55, 330) + 'ms');
    });
  });

  const reveal = (el) => el.classList.add('ols-in');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        reveal(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -45px 0px' });

  targets.forEach((el) => observer.observe(el));
})();
</script>`;

export default async (_req, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) return response;

  const html = await response.text();
  const enhanced = html.replace('</head>', motionStyles + '\n</head>').replace('</body>', motionScript + '\n</body>');
  const headers = new Headers(response.headers);
  headers.delete("content-length");

  return new Response(enhanced, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};

export const config = {
  path: "/*",
  onError: "bypass"
};

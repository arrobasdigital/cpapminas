(function () {
  const config = window.CPAP_CONFIG || {};
  const whatsappNumber = config.whatsappNumber || "5531983653829";
  const defaultMessage = config.defaultMessage || "Olá, vim do Google e gostaria de falar com a CPAP Minas.";

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  function getStoredUtm() {
    const params = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid"];
    const incoming = {};

    keys.forEach((key) => {
      const value = params.get(key);
      if (value) incoming[key] = value;
    });

    if (Object.keys(incoming).length) {
      localStorage.setItem("cpap_utm", JSON.stringify(incoming));
      return incoming;
    }

    try {
      return JSON.parse(localStorage.getItem("cpap_utm") || "{}");
    } catch (error) {
      return {};
    }
  }

  const utm = getStoredUtm();

  function buildWhatsappUrl(message) {
    let finalMessage = message || defaultMessage;

    if (config.includeUtmInWhatsapp && Object.keys(utm).length) {
      const utmText = Object.entries(utm)
        .map(([key, value]) => `${key}: ${value}`)
        .join(" | ");
      finalMessage += `\n\nOrigem do contato: ${utmText}`;
    }

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(finalMessage)}`;
  }

  function trackEvent(name, payload = {}) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, payload);

      if (name === "whatsapp_click" && config.googleAdsConversionLabel) {
        window.gtag("event", "conversion", {
          send_to: config.googleAdsConversionLabel
        });
      }
    }

    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...payload });
    }
  }

  function setupWhatsappLinks() {
    $$(".js-whatsapp").forEach((link) => {
      const message = link.dataset.message || defaultMessage;
      link.setAttribute("href", buildWhatsappUrl(message));
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");

      link.addEventListener("click", () => {
        trackEvent("whatsapp_click", {
          button_id: link.dataset.track || "whatsapp_button",
          page_path: window.location.pathname
        });
      });
    });
  }

  function setupForm() {
    const form = $("#leadForm");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const nome = data.get("nome") || "";
      const telefone = data.get("telefone") || "";
      const servico = data.get("servico") || "";
      const mensagem = data.get("mensagem") || "";

      const text = [
        "Olá, vim do Google e gostaria de atendimento com a CPAP Minas.",
        "",
        `Nome: ${nome}`,
        `Meu WhatsApp: ${telefone}`,
        `Serviço de interesse: ${servico}`,
        mensagem ? `Mensagem: ${mensagem}` : ""
      ].filter(Boolean).join("\n");

      trackEvent("lead_form_submit", {
        service_interest: servico,
        page_path: window.location.pathname
      });

      window.open(buildWhatsappUrl(text), "_blank", "noopener");
      form.reset();
    });
  }

  function setupMenu() {
    const button = $(".menu-toggle");
    const nav = $("#menuPrincipal");
    if (!button || !nav) return;

    button.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("menu-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });

    $$("a", nav).forEach((anchor) => {
      anchor.addEventListener("click", () => {
        document.body.classList.remove("menu-open");
        button.setAttribute("aria-expanded", "false");
      });
    });
  }

  function setupActiveNav() {
    const links = $$(".nav a[href^='#']");
    const sections = links
      .map((link) => $(link.getAttribute("href")))
      .filter(Boolean);

    if (!sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === id));
      });
    }, { rootMargin: "-45% 0px -45% 0px" });

    sections.forEach((section) => observer.observe(section));
  }

  function setupReveal() {
    const items = $$(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach((item) => observer.observe(item));
  }

  function setupYear() {
    const year = $("#currentYear");
    if (year) year.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupWhatsappLinks();
    setupForm();
    setupMenu();
    setupActiveNav();
    setupReveal();
    setupYear();
  });
})();

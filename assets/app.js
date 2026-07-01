const app = document.querySelector("#app");
    const languageSwitcher = document.querySelector("#languageSwitcher");
    const imageLightbox = document.querySelector("#imageLightbox");
    const descriptionMeta = document.querySelector('meta[name="description"]');
    let currentLang = "es";

    function el(tag, className, text) {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined && text !== null) node.textContent = text;
      return node;
    }

    function iconEl(name, className = "icon-chip") {
      if (name && name.startsWith("mascot")) {
        const variant = name.split(":")[1] || "wave";
        return mascotEl(variant, `${className} mascot-holder`.trim());
      }
      const span = el("span", className);
      span.innerHTML = icons[name] || icons.home;
      return span;
    }

    function mascotEl(variant = "wave", className = "mascot-holder") {
      const span = el("span", className);
      span.innerHTML = houseMascotSvg(variant);
      return span;
    }

    function houseMascotSvg(variant = "wave") {
      return `
        <svg class="house-mascot house-mascot--${escapeHtml(variant)}" viewBox="0 0 82 74" aria-hidden="true">
          <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="3">
            <path d="M18 35 41 16l23 19" stroke="#12366c"/>
            <path d="M24 33v19h34V33" stroke="#12366c"/>
            <path d="M41 32c-4.8-5-13-1.4-13 5.8 0 7.2 9.8 12.5 13 16.5 3.2-4 13-9.3 13-16.5C54 30.6 45.8 27 41 32Z" stroke="#12366c"/>
            <path d="M10 62c7-6 14-6 21 0s14 6 21 0 14-6 21 0" stroke="#bd8735"/>
          </g>
        </svg>
      `;
    }

    function appendParagraphs(parent, paragraphs) {
      paragraphs.forEach((text) => parent.appendChild(el("p", "", text)));
    }

    function sectionShell(content, extraClass = "") {
      const section = el("section", `page-section ${extraClass} reveal`.trim());
      const inner = el("div", "section-inner");
      section.appendChild(inner);

      const heading = el("div", "section-heading");
      heading.appendChild(iconEl(content.icon || "heart", "section-heading__icon"));

      const titleWrap = el("div", "section-title");
      if (content.eyebrow) titleWrap.appendChild(el("p", "eyebrow", content.eyebrow));
      titleWrap.appendChild(el("h2", "", content.title));
      if (content.intro) titleWrap.appendChild(el("p", "", content.intro));
      heading.appendChild(titleWrap);
      inner.appendChild(heading);

      return { section, inner };
    }

    function renderHero(content) {
      const hero = el("section", "hero");
      const heroImageUrl = new URL(content.image, window.location.href).href;
      hero.style.setProperty("--hero-image", `url("${heroImageUrl}")`);
      hero.setAttribute("role", "img");
      hero.setAttribute("aria-label", content.imageLabel);

      const wrap = el("div", "hero__content");
      wrap.appendChild(el("p", "eyebrow", content.eyebrow));
      wrap.appendChild(el("h1", "", content.title));

      const scene = el("div", "hero__scene");
      const speech = el("div", "speech-pop");
      speech.appendChild(mascotEl("wave", "speech-pop__logo"));
      if (Array.isArray(content.speech)) {
        appendParagraphs(speech, content.speech);
      } else {
        speech.appendChild(el("p", "", content.intro || ""));
      }
      scene.appendChild(speech);
      wrap.appendChild(scene);

      const badges = el("div", "hero__badges");
      content.badges.forEach((badge) => {
        const item = el("div", "hero-badge");
        item.appendChild(iconEl(badge.icon, "inline-icon"));
        const text = el("div");
        text.appendChild(el("span", "", badge.label));
        text.appendChild(el("strong", "", badge.value));
        item.appendChild(text);
        badges.appendChild(item);
      });
      wrap.appendChild(badges);
      hero.appendChild(wrap);
      app.appendChild(hero);
    }

    function renderRules(content) {
      const shell = sectionShell({ ...content, icon: "heart" }, "rules-section");
      const grid = el("div", "rule-grid");
      content.items.forEach((item) => {
        const card = el("article", "rule-card");
        const title = el("h3");
        title.appendChild(iconEl(item.icon));
        title.appendChild(document.createTextNode(item.title));
        card.appendChild(title);
        card.appendChild(el("p", "", item.text));
        grid.appendChild(card);
      });
      shell.inner.appendChild(grid);
      app.appendChild(shell.section);
    }

    function renderPhotoStory() {
      const section = el("section", "photo-story reveal");
      const grid = el("div", "photo-story__grid");
      brochurePhotos.forEach((photo) => {
        const figure = el("figure", photo.wide ? "brochure-photo brochure-photo--wide" : "brochure-photo");
        const img = el("img");
        img.src = photo.src;
        img.alt = photo.alt;
        img.loading = "lazy";
        figure.appendChild(img);
        grid.appendChild(figure);
      });
      section.appendChild(grid);
      app.appendChild(section);
    }

    function renderBasics(content, ui) {
      const shell = sectionShell({ ...content, icon: "key" });
      const grid = el("div", "info-grid");
      content.cards.forEach((item) => {
        const card = el("article", "info-card");
        const title = el("h3");
        title.appendChild(iconEl(item.icon));
        title.appendChild(document.createTextNode(item.title));
        card.appendChild(title);
        if (item.value) card.appendChild(el("div", "info-value", item.value));
        card.appendChild(el("p", "", item.text));
        if (item.contacts) {
          const contacts = el("div", "contact-list");
          item.contacts.forEach((contact) => {
            const link = el("a", "contact-link");
            link.href = `tel:${contact.tel}`;
            link.setAttribute("aria-label", `${ui.call} ${contact.name}`);
            link.appendChild(el("span", "", contact.name));
            link.appendChild(el("strong", "", contact.phone));
            contacts.appendChild(link);
          });
          card.appendChild(contacts);
        }
        grid.appendChild(card);
      });
      shell.inner.appendChild(grid);
      app.appendChild(shell.section);
    }

    function renderWifi(content, ui) {
      const shell = sectionShell({ ...content, icon: "wifi" }, "wifi-section");
      const panel = el("div", "wifi-panel");
      const credentials = el("div", "wifi-credentials");

      const user = el("div", "credential");
      user.appendChild(el("span", "", content.userLabel));
      user.appendChild(el("strong", "", content.user));
      credentials.appendChild(user);

      const password = el("div", "credential");
      password.appendChild(el("span", "", content.passwordLabel));
      password.appendChild(el("strong", "", content.password));
      credentials.appendChild(password);

      const button = el("button", "copy-button", ui.copyPassword);
      button.type = "button";
      button.prepend(iconEl("copy", "inline-icon"));
      button.addEventListener("click", () => copyToClipboard(content.password, button, ui.copyPassword, ui.copied));

      panel.appendChild(credentials);
      panel.appendChild(button);
      shell.inner.appendChild(panel);
      app.appendChild(shell.section);
    }

    function renderPractical(content) {
      const shell = sectionShell({ ...content, icon: "pool" });
      const stack = el("div", "feature-stack");
      content.items.forEach((item) => {
        const panel = el("article", "soft-panel soft-panel--accent");
        const title = el("h3");
        title.appendChild(iconEl(item.icon));
        title.appendChild(document.createTextNode(item.title));
        panel.appendChild(title);
        panel.appendChild(el("p", "", item.text));
        if (item.steps) {
          if (item.stepsTitle) panel.appendChild(el("h3", "", item.stepsTitle));
          panel.appendChild(renderList(item.steps, "step-list"));
        }
        stack.appendChild(panel);
      });
      shell.inner.appendChild(stack);
      app.appendChild(shell.section);
    }

    function renderAccesses(content) {
      const shell = sectionShell({ ...content, icon: "beach" });
      const grid = el("div", "access-grid");
      content.cards.forEach((item) => {
        const card = el("article", "access-card");
        const title = el("h3");
        title.appendChild(iconEl(item.icon));
        title.appendChild(document.createTextNode(item.title));
        card.appendChild(title);
        card.appendChild(el("p", "", item.text));
        grid.appendChild(card);
      });
      shell.inner.appendChild(grid);

      const tip = el("div", "soft-panel");
      const title = el("h3");
      title.appendChild(iconEl("heart"));
      title.appendChild(document.createTextNode(content.tipTitle));
      tip.appendChild(title);
      tip.appendChild(el("p", "", content.tip));
      tip.style.marginTop = "18px";
      shell.inner.appendChild(tip);

      app.appendChild(shell.section);
    }

    function renderImprovement(content) {
      const shell = sectionShell({ ...content, icon: "home" });
      const panel = el("div", "soft-panel");
      panel.appendChild(el("p", "", content.text));
      shell.inner.appendChild(panel);
      app.appendChild(shell.section);
    }

    function renderAccordionSection(content, iconName, listType) {
      const shell = sectionShell({ ...content, icon: iconName });
      const list = el("div", "accordion-list");
      content.groups.forEach((group) => {
        const details = el("details", "guide-accordion");
        const summary = el("summary");
        const title = el("span", "summary-title");
        title.appendChild(iconEl(group.icon || iconName));
        title.appendChild(document.createTextNode(group.title));
        summary.appendChild(title);
        summary.appendChild(el("span", "chevron"));
        details.appendChild(summary);

        const body = el("div", "accordion-body");
        if (group.steps) body.appendChild(renderList(group.steps, "step-list"));
        if (group.items) body.appendChild(renderList(group.items, listType || "text-list"));
        if (group.images) body.appendChild(renderMediaStrip(group.images));
        details.appendChild(body);
        list.appendChild(details);
      });
      shell.inner.appendChild(list);
      app.appendChild(shell.section);
    }

    function renderMediaStrip(images) {
      const strip = el("div", "media-strip");
      images.forEach((image) => {
        const figure = el("figure", "media-card");
        figure.tabIndex = 0;
        figure.setAttribute("role", "button");
        figure.setAttribute("aria-label", image.caption || image.alt || "");
        const img = el("img");
        img.src = image.src;
        img.alt = image.alt || image.caption || "";
        img.loading = "lazy";
        figure.appendChild(img);
        if (image.caption) figure.appendChild(el("figcaption", "", image.caption));
        figure.addEventListener("click", () => openImageLightbox(image.src, image.alt || "", image.caption || ""));
        figure.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openImageLightbox(image.src, image.alt || "", image.caption || "");
          }
        });
        strip.appendChild(figure);
      });
      return strip;
    }

    function renderFavorites(content) {
      const shell = sectionShell({ ...content, icon: "sparkleHeart" });
      const highlight = el("div", "soft-panel");
      highlight.appendChild(el("p", "", content.highlight));
      shell.inner.appendChild(highlight);

      const grid = el("div", "restaurant-grid");
      grid.style.marginTop = "18px";
      content.restaurants.forEach((item) => {
        const card = el("article", "restaurant-card");
        const title = el("h3");
        title.appendChild(iconEl("sparkleHeart"));
        title.appendChild(document.createTextNode(item.name));
        card.appendChild(title);
        card.appendChild(el("p", "", item.text));
        grid.appendChild(card);
      });
      shell.inner.appendChild(grid);
      app.appendChild(shell.section);
    }

    function renderThanks(content) {
      const section = el("section", "page-section thanks-section reveal");
      const inner = el("div", "section-inner");
      const card = el("div", "thanks-card popup-card");
      const icon = el("div", "thanks-card__icon");
      icon.appendChild(mascotEl("cozy", "mascot-holder"));
      card.appendChild(icon);
      const photo = el("img", "thanks-card__photo");
      photo.src = "assets/photos/raul-vanessa.jpeg";
      photo.alt = "Raúl y Vanessa";
      photo.loading = "lazy";
      card.appendChild(photo);
      card.appendChild(el("p", "eyebrow", content.eyebrow));
      card.appendChild(el("h2", "", content.title));
      appendParagraphs(card, content.paragraphs);
      card.appendChild(el("p", "signature", content.signature));
      inner.appendChild(card);
      section.appendChild(inner);
      app.appendChild(section);
    }

    function renderList(items, className) {
      const list = el(className === "text-list" ? "ul" : "ol", className);
      items.forEach((item) => list.appendChild(el("li", "", item)));
      return list;
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]);
    }

    function renderLanguageSwitcher() {
      languageSwitcher.textContent = "";
      languages.forEach((language) => {
        const button = el("button", "", language.label);
        button.type = "button";
        button.setAttribute("aria-label", language.name);
        button.setAttribute("aria-pressed", String(language.code === currentLang));
        button.addEventListener("click", () => setLanguage(language.code));
        languageSwitcher.appendChild(button);
      });
    }

    function renderPage() {
      const content = guideContent[currentLang];
      app.textContent = "";
      document.documentElement.lang = currentLang;
      document.title = content.meta.title;
      descriptionMeta.setAttribute("content", content.meta.description);

      renderHero(content.hero);
      renderRules(content.rules);
      renderPhotoStory();
      renderBasics(content.basics, content.meta);
      renderWifi(content.wifi, content.meta);
      renderPractical(content.practical);
      renderAccesses(content.accesses);
      renderImprovement(content.improvement);
      renderAccordionSection(content.apartment, "mascot:peek", "step-list");
      renderAccordionSection(content.events, "calendar", "text-list");
      renderFavorites(content.favorites);
      renderThanks(content.thanks);
      revealOnScroll();
    }

    function setLanguage(languageCode) {
      currentLang = guideContent[languageCode] ? languageCode : "es";
      try {
        localStorage.setItem("welcomeGuide.lang", currentLang);
      } catch (error) {
        // Local storage may be unavailable in private browsing.
      }
      renderLanguageSwitcher();
      renderPage();
    }

    async function copyToClipboard(text, button, defaultLabel, copiedLabel) {
      const originalContent = button.innerHTML;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          const textarea = el("textarea");
          textarea.value = text;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          textarea.remove();
        }
        button.textContent = copiedLabel;
      } catch (error) {
        button.textContent = defaultLabel;
      }
      window.setTimeout(() => {
        button.innerHTML = originalContent;
      }, 1600);
    }

    function openImageLightbox(src, alt, caption) {
      const img = imageLightbox.querySelector("img");
      const figcaption = imageLightbox.querySelector("figcaption");
      img.src = src;
      img.alt = alt;
      figcaption.textContent = caption;
      imageLightbox.classList.add("is-open");
      imageLightbox.setAttribute("aria-hidden", "false");
    }

    function closeImageLightbox() {
      imageLightbox.classList.remove("is-open");
      imageLightbox.setAttribute("aria-hidden", "true");
      imageLightbox.querySelector("img").removeAttribute("src");
    }

    function revealOnScroll() {
      const items = Array.from(document.querySelectorAll(".reveal"));
      if (!("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      items.forEach((item) => observer.observe(item));
    }

    function updateProgress() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
      document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);
    }

    function init() {
      try {
        const saved = localStorage.getItem("welcomeGuide.lang");
        currentLang = guideContent[saved] ? saved : "es";
      } catch (error) {
        currentLang = "es";
      }
      renderLanguageSwitcher();
      renderPage();
      updateProgress();
      window.addEventListener("scroll", updateProgress, { passive: true });
      window.addEventListener("resize", updateProgress);
      imageLightbox.addEventListener("click", (event) => {
        if (event.target === imageLightbox) closeImageLightbox();
      });
      window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && imageLightbox.classList.contains("is-open")) closeImageLightbox();
      });
    }

    init();



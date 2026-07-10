document.addEventListener("DOMContentLoaded", () => {
  // --- LANGUAGE SWITCHER (i18n) ---
  const langSelectors = document.querySelectorAll(".lang-btn");
  let currentLang = localStorage.getItem("vulcan-steel-lang") || "es";

  // Function to update texts based on translations object
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("vulcan-steel-lang", lang);

    // Update active state in selectors
    langSelectors.forEach(btn => {
      if (btn.getAttribute("data-lang") === lang) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update all elements with data-i18n attribute
    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.getAttribute("data-i18n");
      if (translations[key] && translations[key][lang]) {
        element.textContent = translations[key][lang];
      }
    });

    // Update placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
      const key = element.getAttribute("data-i18n-placeholder");
      if (translations[key] && translations[key][lang]) {
        element.setAttribute("placeholder", translations[key][lang]);
      }
    });

    // Update HTML lang attribute
    document.documentElement.setAttribute("lang", lang);
  }

  // Bind click event to language buttons
  langSelectors.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedLang = btn.getAttribute("data-lang");
      setLanguage(selectedLang);
    });
  });

  // Set default language on load
  setLanguage(currentLang);


  // --- FLOATING ACTION BUTTON (FAB) ---
  const fabToggle = document.getElementById("fabToggle");
  const fabContainer = document.querySelector(".fab-container");

  if (fabToggle && fabContainer) {
    fabToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      fabContainer.classList.toggle("active");
    });

    // Close FAB when clicking anywhere else
    document.addEventListener("click", () => {
      fabContainer.classList.remove("active");
    });

    // Close FAB on scroll
    window.addEventListener("scroll", () => {
      fabContainer.classList.remove("active");
    }, { passive: true });
  }


  // --- INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ---
  const revealElements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => observer.observe(el));


  // --- CONTACT FORM SUBMISSION ---
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Simple validation
      const name = document.getElementById("formName").value.trim();
      const email = document.getElementById("formEmail").value.trim();
      const phone = document.getElementById("formPhone").value.trim();
      const product = document.getElementById("formProduct").value;
      const message = document.getElementById("formMessage").value.trim();

      if (!name || !email || !phone || !product || !message) {
        showStatus(translations["form_error_msg"][currentLang], "error");
        return;
      }

      // Simulate API call
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = currentLang === "es" ? "Enviando..." : "Sending...";

      setTimeout(() => {
        showStatus(translations["form_success_msg"][currentLang], "success");
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 1500);
    });
  }

  function showStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = "block";

    setTimeout(() => {
      formStatus.style.display = "none";
    }, 6000);
  }

  // --- STICKY NAV ON SCROLL ---
  const header = document.querySelector(".header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }, { passive: true });
});

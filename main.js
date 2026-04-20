(function () {
  "use strict";

  var cartKey = "michaelCoachingCart";
  var whatsappBase = "https://wa.me/33625187472";
  var toastTimer;

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(cartKey)) || [];
    } catch (error) {
      return [];
    }
  }

  function saveCart(items) {
    localStorage.setItem(cartKey, JSON.stringify(items));
  }

  function showToast(message) {
    var toast = qs(".toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 3600);
  }

  function updateCartCount() {
    var items = getCart();
    qsa(".cart-count").forEach(function (count) {
      count.textContent = String(items.length);
    });
  }

  function buildWhatsappUrl(items) {
    var list = items.length ? items.map(function (item) {
      return item.name + " (" + item.price + ")";
    }).join(", ") : "un accompagnement Michael Coaching Sportif";
    var message = "Bonjour Michael, je souhaite commander : " + list + ". Pouvez-vous me recontacter ?";
    return whatsappBase + "?text=" + encodeURIComponent(message);
  }

  function renderCart() {
    var items = getCart();
    var container = qs(".cart-items");
    var empty = qs(".cart-empty");
    var checkout = qs(".whatsapp-checkout");
    var clear = qs(".cart-clear");
    if (!container) return;

    container.innerHTML = "";
    items.forEach(function (item, index) {
      var row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = "<div><strong></strong><span></span></div><button type=\"button\" aria-label=\"Retirer ce produit\">×</button>";
      qs("strong", row).textContent = item.name;
      qs("span", row).textContent = item.price;
      qs("button", row).addEventListener("click", function () {
        var nextItems = getCart();
        nextItems.splice(index, 1);
        saveCart(nextItems);
        renderCart();
        updateCartCount();
      });
      container.appendChild(row);
    });

    if (empty) empty.style.display = items.length ? "none" : "block";
    if (clear) clear.disabled = !items.length;
    if (checkout) checkout.href = buildWhatsappUrl(items);
  }

  function openCart() {
    var panel = qs(".cart-panel");
    var overlay = qs(".cart-overlay");
    if (panel) {
      panel.classList.add("is-open");
      panel.setAttribute("aria-hidden", "false");
    }
    if (overlay) {
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
    }
    renderCart();
  }

  function closeCart() {
    var panel = qs(".cart-panel");
    var overlay = qs(".cart-overlay");
    if (panel) {
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
    }
    if (overlay) {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
    }
  }

  function setupMenu() {
    var toggle = qs(".menu-toggle");
    var nav = qs(".primary-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
    });

    qsa("a", nav).forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Ouvrir le menu");
      });
    });
  }

  function setupFadeIn() {
    var elements = qsa(".fade-in");
    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
      elements.forEach(function (element) {
        element.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }

  function setupCart() {
    qsa(".cart-toggle").forEach(function (button) {
      button.addEventListener("click", openCart);
    });

    qsa(".cart-close, .cart-overlay").forEach(function (button) {
      button.addEventListener("click", closeCart);
    });

    qsa(".cart-clear").forEach(function (button) {
      button.addEventListener("click", function () {
        saveCart([]);
        renderCart();
        updateCartCount();
      });
    });

    qsa(".add-to-cart").forEach(function (button) {
      button.addEventListener("click", function () {
        var items = getCart();
        items.push({
          name: button.dataset.name || "Programme Michael Coaching",
          price: button.dataset.price || "Sur demande"
        });
        saveCart(items);
        updateCartCount();
        renderCart();
        showToast("Produit ajouté. Michael te recontactera pour finaliser la commande.");
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeCart();
    });

    renderCart();
    updateCartCount();
  }

  function setupContactForm() {
    var form = qs(".contact-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var confirmation = qs(".form-confirmation", form);
      var data = new FormData(form);
      var body = [
        "Nom : " + (data.get("Nom") || ""),
        "Email : " + (data.get("Email") || ""),
        "Téléphone : " + (data.get("Telephone") || ""),
        "Objectif : " + (data.get("Objectif") || ""),
        "",
        "Message :",
        data.get("Message") || ""
      ].join("\n");

      if (confirmation) {
        confirmation.textContent = "Merci, votre demande est prête à être envoyée. Vous pouvez aussi contacter Michael directement par WhatsApp.";
      }

      window.location.href = "mailto:michael.coachingsportif@gmail.com?subject=" + encodeURIComponent("Demande de bilan gratuit") + "&body=" + encodeURIComponent(body);
    });
  }

  function setupSmoothAnchors() {
    qsa("a[href^=\"#\"]").forEach(function (link) {
      link.addEventListener("click", function (event) {
        var target = qs(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupMenu();
    setupFadeIn();
    setupCart();
    setupContactForm();
    setupSmoothAnchors();
  });
})();

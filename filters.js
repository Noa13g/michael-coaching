(function () {
  "use strict";

  function normalizeFilter(value) {
    var aliases = {
      entrainement: "entrainement",
      entrainements: "entrainement",
      nutrition: "nutrition",
      pack: "packs",
      packs: "packs",
      "pack-nutrition": "packs",
      "offre-complete": "offre-complete",
      complete: "offre-complete",
      all: "all",
      tous: "all"
    };

    return aliases[value] || "all";
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function applyFilter(filter, filters, cards) {
    filters.forEach(function (item) {
      var isActive = item.dataset.filter === filter;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    cards.forEach(function (card) {
      var categories = (card.dataset.category || "").split(" ");
      var shouldShow = filter === "all" || categories.indexOf(filter) !== -1;
      card.hidden = !shouldShow;
      card.classList.toggle("is-hidden", !shouldShow);
      card.style.display = shouldShow ? "" : "none";
    });

    var url = new URL(window.location.href);
    if (filter === "all") {
      url.searchParams.delete("filter");
    } else {
      url.searchParams.set("filter", filter);
    }
    window.history.replaceState({}, "", url.toString());
  }

  document.addEventListener("DOMContentLoaded", function () {
    var filters = qsa(".filter-btn");
    var cards = qsa("[data-category]");
    if (!filters.length || !cards.length) return;

    filters.forEach(function (button) {
      button.setAttribute("aria-pressed", button.classList.contains("is-active") ? "true" : "false");
      button.addEventListener("click", function () {
        applyFilter(normalizeFilter(button.dataset.filter || "all"), filters, cards);
      });
    });

    var initial = normalizeFilter(new URLSearchParams(window.location.search).get("filter") || "all");
    applyFilter(initial, filters, cards);
  });
})();

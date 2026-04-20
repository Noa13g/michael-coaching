(function () {
  "use strict";

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  document.addEventListener("DOMContentLoaded", function () {
    var filters = qsa(".filter-btn");
    var cards = qsa("[data-category]");
    if (!filters.length || !cards.length) return;

    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.dataset.filter || "all";

        filters.forEach(function (item) {
          item.classList.toggle("is-active", item === button);
        });

        cards.forEach(function (card) {
          var categories = (card.dataset.category || "").split(" ");
          var shouldShow = filter === "all" || categories.indexOf(filter) !== -1;
          card.hidden = !shouldShow;
        });

        var grid = qs(".products-grid");
        if (grid) {
          grid.setAttribute("data-active-filter", filter);
        }
      });
    });
  });
})();

(function () {
  var header = document.querySelector(".site-header");
  var burger = document.querySelector(".burger");
  var mobileMenu = document.querySelector(".mobile-menu");
  var popup = document.querySelector(".popup");
  var lastFocus = null;

  function closeMenu() {
    header.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
  }

  function openPopup() {
    lastFocus = document.activeElement;
    popup.classList.add("open");
    popup.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    popup.querySelector(".popup-close").focus();
  }

  function closePopup() {
    popup.classList.remove("open");
    popup.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lastFocus) lastFocus.focus();
  }

  if (burger) {
    burger.addEventListener("click", function () {
      var open = header.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  if (popup) {
    document.querySelectorAll("[data-popup-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        closeMenu();
        openPopup();
      });
    });
    popup.addEventListener("click", function (e) {
      if (e.target.closest("[data-popup-close]")) closePopup();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (popup.classList.contains("open")) closePopup();
      else if (header.classList.contains("menu-open")) closeMenu();
    });
  }

  document.querySelectorAll("img[data-fallback]").forEach(function (img) {
    function fail() {
      img.classList.add("is-broken");
      img.parentElement.classList.add("no-img");
    }
    function ok() {
      img.classList.remove("is-broken");
      img.parentElement.classList.remove("no-img");
    }
    img.addEventListener("error", fail);
    img.addEventListener("load", ok);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  document.querySelectorAll("[data-photo-title]").forEach(function (el) {
    var src = el.getAttribute("data-photo-title");
    var probe = new Image();
    probe.onload = function () {
      el.style.backgroundImage = 'url("' + src + '")';
      el.classList.add("has-photo");
    };
    probe.src = src;
  });

  function fitTitle(el) {
    el.style.fontSize = "";
    var styles = getComputedStyle(el);
    var base = parseFloat(styles.fontSize);
    var ratio = parseFloat(styles.getPropertyValue("--fit")) || 1;
    var text = el.scrollWidth;
    var parent = el.parentElement;
    var pcs = getComputedStyle(parent);
    var room =
      parent.clientWidth -
      parseFloat(pcs.paddingLeft) -
      parseFloat(pcs.paddingRight);
    if (text > 0 && room > 0) {
      el.style.fontSize = Math.floor((base * room * ratio) / text) + "px";
    }
  }
  window.fitTitle = fitTitle;

  var fitTitles = document.querySelectorAll(".hero-title, .teaser-title");
  function fitAll() {
    fitTitles.forEach(fitTitle);
  }
  if (fitTitles.length) {
    fitAll();
    window.addEventListener("resize", fitAll);
    if (document.fonts) document.fonts.ready.then(fitAll);
  }

  document.querySelectorAll(".project-gallery").forEach(function (gallery) {
    var main = gallery.querySelector(".gallery-main img");
    gallery.querySelectorAll(".gallery-thumb").forEach(function (thumbBtn) {
      var thumb = thumbBtn.querySelector("img");
      thumbBtn.addEventListener("click", function () {
        var src = main.src;
        main.src = thumb.src;
        thumb.src = src;
        var alt = main.alt;
        main.alt = thumb.alt;
        thumb.alt = alt;
      });
    });
  });
})();

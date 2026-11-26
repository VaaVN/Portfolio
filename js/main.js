(function () {
  var states = {
    web: {
      title: "САЙТЫ",
      caption: "И ПРИЛОЖЕНИЯ",
      photo: "assets/img/WebTitlePhoto.png",
    },
    graphic: {
      title: "ГРАФИКА",
      caption: "2Д И 3Д",
      photo: "assets/img/GraphicTitlePhoto.png",
    },
    games: {
      title: "ИГРЫ",
      caption: "НА РАЗНЫЕ ПЛАТФОРМЫ",
      photo: "assets/img/GamesTitlePhoto.png",
    },
    nechaev: {
      title: "НЕЧАЕВ",
      caption: "ПРОГРАММИСТ И ХУДОЖНИК",
      photo: "assets/img/NechaevTitlePhoto.png",
    },
  };
  var dpadFiles = {
    web: "WebDpad",
    graphic: "GraphicDpad",
    games: "GamesDpad",
    nechaev: "NechaevDpad",
  };
  var order = ["web", "graphic", "games", "nechaev"];
  var title = document.getElementById("heroTitle");
  var caption = document.getElementById("heroCaption");
  var content = document.querySelector(".hero-content");
  var buttons = document.querySelectorAll(".dpad-btn");
  var current = 0;
  var cycleTimer = null;
  var fadeTimer = null;
  var photoReady = {};
  var dpadArt = {};

  order.forEach(function (key) {
    var normal = "assets/img/" + dpadFiles[key] + ".svg";
    var active = "assets/img/" + dpadFiles[key] + "Active.svg";
    dpadArt[key] = { normal: normal, active: normal };
    var probe = new Image();
    probe.onload = function () {
      dpadArt[key].active = active;
      if (order[current] === key) markButtons(key);
    };
    probe.src = active;
  });

  function applyPhoto(key) {
    if (photoReady[key]) {
      title.style.backgroundImage = 'url("' + states[key].photo + '")';
      title.classList.add("has-photo");
    } else {
      title.style.backgroundImage = "";
      title.classList.remove("has-photo");
    }
  }

  function markButtons(key) {
    buttons.forEach(function (btn) {
      var state = btn.getAttribute("data-state");
      var active = state === key;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
      var img = btn.querySelector("img");
      if (img && dpadArt[state]) {
        img.src = active ? dpadArt[state].active : dpadArt[state].normal;
      }
    });
  }

  function applyState(key) {
    title.textContent = states[key].title;
    caption.textContent = states[key].caption;
    applyPhoto(key);
    fitTitle(title);
  }

  function setState(key) {
    current = order.indexOf(key);
    markButtons(key);
    clearTimeout(fadeTimer);
    content.classList.add("is-switching");
    fadeTimer = setTimeout(function () {
      applyState(key);
      content.classList.remove("is-switching");
    }, 250);
  }

  function startCycle() {
    clearInterval(cycleTimer);
    cycleTimer = setInterval(function () {
      setState(order[(current + 1) % order.length]);
    }, 6000);
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setState(btn.getAttribute("data-state"));
      startCycle();
    });
  });

  order.forEach(function (key) {
    var probe = new Image();
    probe.onload = function () {
      photoReady[key] = true;
      if (order[current] === key) applyPhoto(key);
    };
    probe.src = states[key].photo;
  });

  applyState("web");
  markButtons("web");
  startCycle();

  renderCards("gamesCards", "assets/db/games.csv");
  renderCards("productsCards", "assets/db/products.csv");
  renderCards("graphicCards", "assets/db/graphic.csv");
})();

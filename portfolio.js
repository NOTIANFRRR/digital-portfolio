var data = portfolioData;

var modal = document.getElementById("modal");
var windowBox = document.getElementById("window");
var content = document.getElementById("content");
var closeButton = document.getElementById("close");

function list(items) {
  if (items.length == 0) {
    return "<p>Nothing added yet.</p>";
  }
  var html = "<ul>";
  for (var i = 0; i < items.length; i++) {
    html += "<li>" + items[i] + "</li>";
  }
  html += "</ul>";
  return html;
}

function openWindow(html, wide) {
  content.innerHTML = html;
  windowBox.classList.toggle("wide", wide);
  modal.hidden = false;
  closeButton.focus();
}

function closeWindow() {
  modal.hidden = true;
  content.innerHTML = "";
}

closeButton.onclick = closeWindow;

modal.onclick = function (event) {
  if (event.target == modal) {
    closeWindow();
  }
};

document.onkeydown = function (event) {
  if (event.key == "Escape") {
    closeWindow();
  }
};

function showContacts() {
  var c = data.contacts;
  var links = "";
  for (var i = 0; i < c.social.length; i++) {
    links += '<li><a href="' + c.social[i].url + '" target="_blank" rel="noopener">' + c.social[i].name + "</a></li>";
  }
  openWindow(
    "<h2>Contacts</h2>" +
    '<p><b>Email:</b> <a href="mailto:' + c.email + '">' + c.email + "</a></p>" +
    "<p><b>Phone:</b> " + c.phone + "</p>" +
    "<p><b>Address:</b> " + c.address + "</p>" +
    "<h4>Social media</h4><ul>" + links + "</ul>", false);
}

function showAwards() {
  var a = data.achievements;
  openWindow(
    "<h2>Awards and Achievements</h2>" +
    "<h4>Academic achievements</h4>" + list(a.academic) +
    "<h4>Awards and certificates</h4>" + list(a.awards) +
    "<h4>School activities</h4>" + list(a.activities), false);
}

function showAbout() {
  var a = data.about;
  openWindow(
    "<h2>About Me</h2>" +
    "<h3>" + a.name + "</h3>" +
    "<p>" + a.title + "<br>" + a.school + "</p>" +
    "<p>" + a.bio + "</p>", false);
}

var mapBox;
var continents = [];
var hovered = null;

function showMap() {
  openWindow(
    "<h2>Goals and Travel</h2>" +
    '<div class="map-area">' +
    '<div class="map-box" id="map-box" data-art="art/map-paper.png&#10;320 x 180 px">' +
    '<img class="base" src="art/map-paper.png" alt="World map" onerror="this.parentElement.classList.add(\'missing\')">' +
    "</div>" +
    '<div class="map-info" id="map-info"><p>Hover over a continent, or tap it, to see my travel goals.</p></div>' +
    "</div>", true);
  setupMap();
}

function setupMap() {
  mapBox = document.getElementById("map-box");
  hovered = null;
  continents = [];
  for (var i = 0; i < data.continents.length; i++) {
    if (!data.continents[i].hidden) {
      continents.push(data.continents[i]);
      addContinent(data.continents[i]);
    }
  }

  mapBox.onpointermove = function (event) {
    highlight(findContinent(event));
  };
  mapBox.onpointerdown = function (event) {
    highlight(findContinent(event));
  };
  mapBox.onpointerleave = function () {
    highlight(null);
  };
  mapBox.onclick = function (event) {
    var c = findContinent(event);
    if (c) {
      showContinent(c);
    }
  };
}

function addContinent(c) {
  c.img = document.createElement("img");
  c.img.className = "layer";
  c.img.alt = "";
  c.ctx = null;
  c.missing = false;

  c.zone = document.createElement("div");
  c.zone.className = "zone";
  c.zone.hidden = true;
  c.zone.innerHTML = c.name + "<small>" + c.file.replace("art/", "") + "</small>";
  c.zone.style.left = c.box[0] + "%";
  c.zone.style.top = c.box[1] + "%";
  c.zone.style.width = c.box[2] + "%";
  c.zone.style.height = c.box[3] + "%";

  c.img.onload = function () {
    c.ctx = makeReader(c.img);
  };
  c.img.onerror = function () {
    c.missing = true;
    c.img.hidden = true;
    c.zone.hidden = false;
  };
  c.img.src = c.file;

  mapBox.append(c.img, c.zone);
}

function makeReader(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  var ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  return ctx;
}

function findContinent(event) {
  var rect = mapBox.getBoundingClientRect();
  var x = (event.clientX - rect.left) / rect.width;
  var y = (event.clientY - rect.top) / rect.height;
  if (x < 0 || x > 1 || y < 0 || y > 1) {
    return null;
  }

  for (var i = continents.length - 1; i >= 0; i--) {
    var c = continents[i];
    if (c.ctx) {
      try {
        var w = c.ctx.canvas.width;
        var h = c.ctx.canvas.height;
        var px = Math.min(w - 1, Math.floor(x * w));
        var py = Math.min(h - 1, Math.floor(y * h));
        if (c.ctx.getImageData(px, py, 1, 1).data[3] > 0) {
          return c;
        }
        continue;
      } catch (error) {
        c.ctx = null;
        c.blocked = true;
      }
    }
    if (c.missing || c.blocked) {
      if (x * 100 >= c.box[0] && x * 100 <= c.box[0] + c.box[2] &&
          y * 100 >= c.box[1] && y * 100 <= c.box[1] + c.box[3]) {
        return c;
      }
    }
  }
  return null;
}

function highlight(c) {
  if (c == hovered) {
    return;
  }
  if (hovered) {
    hovered.img.classList.remove("hot");
    hovered.zone.classList.remove("hot");
  }
  if (c) {
    c.img.classList.add("hot");
    c.zone.classList.add("hot");
  }
  hovered = c;
  if (c) {
    mapBox.style.cursor = "pointer";
  } else {
    mapBox.style.cursor = "default";
  }
}

function showContinent(c) {
  for (var i = 0; i < continents.length; i++) {
    continents[i].img.classList.toggle("selected", continents[i] == c);
    continents[i].zone.classList.toggle("selected", continents[i] == c);
  }

  var info = document.getElementById("map-info");
  info.innerHTML =
    "<h3>" + c.name + "</h3>" +
    "<h4>Travel goals</h4>" + list(c.goals) +
    "<h4>Desired destinations</h4>" + list(c.destinations) +
    "<h4>Mountains to climb</h4>" + list(c.mountains);
  info.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

var actions = {
  contacts: showContacts,
  awards: showAwards,
  about: showAbout,
  map: showMap
};

var buttons = document.querySelectorAll(".object");
for (var i = 0; i < buttons.length; i++) {
  buttons[i].onclick = function () {
    actions[this.dataset.open]();
  };
}

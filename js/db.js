function parseCSV(text) {
  var rows = [];
  var row = [];
  var field = '';
  var quoted = false;
  for (var i = 0; i < text.length; i++) {
    var c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function cardFallback(title) {
  var box = document.createElement('div');
  box.className = 'card-fallback';
  box.textContent = title || '';
  return box;
}

function buildCard(item) {
  var card = document.createElement('a');
  card.className = 'card';
  card.href = item.link || '#';
  card.target = '_blank';
  card.rel = 'noopener';

  var inner = document.createElement('div');
  inner.className = 'card-inner';

  var front = document.createElement('div');
  front.className = 'card-face card-front';
  if (item.img) {
    var img = document.createElement('img');
    img.className = 'card-img';
    img.alt = item.title || '';
    img.loading = 'lazy';
    img.onerror = function () {
      img.remove();
      front.appendChild(cardFallback(item.title));
    };
    img.src = item.img;
    front.appendChild(img);
  } else {
    front.appendChild(cardFallback(item.title));
  }

  var back = document.createElement('div');
  back.className = 'card-face card-back';
  var title = document.createElement('h3');
  title.className = 'card-title';
  title.textContent = item.title || '';
  var desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = item.description || '';
  back.appendChild(title);
  back.appendChild(desc);

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  card.addEventListener('click', function (e) {
    if (!window.matchMedia('(hover: none)').matches) return;
    if (card.classList.contains('flipped')) return;
    e.preventDefault();
    document.querySelectorAll('.card.flipped').forEach(function (other) {
      other.classList.remove('flipped');
    });
    card.classList.add('flipped');
  });

  return card;
}

function renderCards(containerId, url) {
  var container = document.getElementById(containerId);
  if (!container) return;
  fetch(url)
    .then(function (res) {
      if (!res.ok) throw new Error(res.status);
      return res.text();
    })
    .then(function (text) {
      var rows = parseCSV(text.replace(/^\uFEFF/, ''));
      var head = rows.shift() || [];
      container.innerHTML = '';
      rows.forEach(function (row) {
        var item = {};
        head.forEach(function (key, i) {
          item[key.trim()] = (row[i] || '').trim();
        });
        container.appendChild(buildCard(item));
      });
    })
    .catch(function () {});
}
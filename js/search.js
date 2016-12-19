'use strict';
const $searchResults = document.querySelector('.search-results');

const sampleQueries = ['mnke', 'kqqkqh', 'enhh'];

const randomArrayValue = arr => arr[parseInt(Math.random(arr.length))];

const H3 = children => h('h3', { class: 'text-center' }, children);

window.onload = () => {
  const [type, source, q] = ['type', 'source', 'q'].map(v => getParameterByName(v))
  document.querySelector(`[name=q]`).value = q;

  if (q === '') {
    const randomQuery = randomArrayValue(sampleQueries);
    $searchResults.appendChild(H3([
      h('span', {}, 'Write a query like '),
      h('a', { href: `?q=${randomQuery}`, class: 'gurbani-font-normal' }, randomQuery),
    ]));
    return;
  }

  $searchResults.appendChild(H3('Loading...'));
  fetch(buildApiUrl({ q, type, source }))
    .then(r => r.json())
    .then(result => {
      $searchResults.innerHTML = '';
      result.count != 0 
        ? result.shabads.forEach(({ shabad }) => addSearchResult(shabad, q))
        : noResults();
    })
    .catch(error => showError(error));
}

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function addSearchResult(shabad, q) {
  const { Gurmukhi, English, ShabadID, SourceID, PageNo, RaagEnglish, WriterEnglish } = shabad;
  const url = `${window.location.origin + window.location.pathname.replace('search.html', 'shabad.html')}?id=${ShabadID}`;
  $searchResults.appendChild(
    h('li', { class: 'search-result' }, [
      h('a', { href: `shabad.html?id=${ShabadID}&q=${q}`, class: 'gurbani-font' }, Gurmukhi),
      h('a', { href: `shabad.html?id=${ShabadID}`, class: 'url', }, url),
      h('p', { }, English),
      h('div', { class: 'meta flex wrap'} , [
        h('a', { href: '#', }, `${SOURCES[SourceID]} - ${PageNo}`),
        h('a', { href: '#', }, `${WriterEnglish}`),
        h('a', { href: '#', }, `${RaagEnglish}`),
      ]),
    ])
  );
}

function noResults() {
  $searchResults.appendChild(H3('No results found'));
}

function showError(error) {
  $searchResults.appendChild(h('h2', { }, [
    h('h3', { class: 'text-center' }, 'Facing some issues'),
    h('code', {}, JSON.stringify(error, null, 2))
  ]));
}

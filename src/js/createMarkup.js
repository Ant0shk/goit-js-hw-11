export function createCard(hits) {
  return hits
    .map(hitsEl => {
      const {
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = hitsEl;
      return `
        <li class="photo-card">
          <a href="${largeImageURL}" class="thumb-link">
            <img class="thumb-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item">${likes} <b>Likes</b></p>
            <p class="info-item">${views} <b>Views</b></p>
            <p class="info-item">${comments} <b>Comments</b></p>
            <p class="info-item">${downloads} <b>Downloads</b></p>
          </div>
        </li>
      `;
    })
    .join('');
}

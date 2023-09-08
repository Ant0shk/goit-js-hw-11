import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImgApi } from './img-api';
import { createCard } from './createMarkup';
import { refs } from './refs';

Notiflix.Notify.init({
  position: 'center-center',
  fontFamily: 'Georgia',
  fontSize: '18px',
  cssAnimationDuration: 100,
});
const lightbox = new SimpleLightbox('.gallery a', {
  closeText: '&#10007',
  navText: ['&#10094', '&#10095'],
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

let currentPage = 1;
let searchQuery = '';

refs.formEl.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn); //буде догружати зображення
refs.loadMoreBtn.disabled = true;
refs.loadMoreBtn.style.display = 'none';

//Пошук зображень
async function onFormSubmit(event) {
  event.preventDefault();
  refs.loadMoreBtn.disabled = false;
  refs.loadMoreBtn.style.display = 'none';
  searchQuery = event.target.elements.searchQuery.value.trim();
  if (searchQuery === '') {
    refs.loadMoreBtn.disabled = true;
    refs.loadMoreBtn.style.display = 'none';
    Notiflix.Notify.failure(
      'It is hard to search with such little information'
    );
    return;
  }

  try {
    const { total, totalHits, hits } = await getImgApi(
      searchQuery,
      currentPage
    );
    if (total === 0) {
      refs.loadMoreBtn.style.display = 'none';
      throw 'Sorry, there are no images matching your search query. Please try again.';
    }
    refs.gallery.innerHTML = '';
    refs.loadMoreBtn.style.display = 'block';
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    const cardMarkup = createCard(hits);
    refs.gallery.insertAdjacentHTML('beforeend', cardMarkup);
    lightbox.refresh();
  } catch (error) {
    Notiflix.Notify.failure(error);
  }

  event.target.reset();
}

//Догрузка зображень
async function onLoadMoreBtn(event) {
  try {
    currentPage += 1;
    const { total, totalHits, hits } = await getImgApi(
      searchQuery,
      currentPage
    );
    console.log(totalHits);
    const totalPage = Math.ceil(totalHits / 40);
    if (currentPage > totalPage) {
      currentPage = 1;
      refs.loadMoreBtn.style.display = 'none';
      throw 'We are sorry, but you have reached the end of search results.';
    }
    const cardMarkup = createCard(hits);
    refs.gallery.insertAdjacentHTML('beforeend', cardMarkup);
    lightbox.refresh();
  } catch (error) {
    Notiflix.Notify.failure(error);
  }
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

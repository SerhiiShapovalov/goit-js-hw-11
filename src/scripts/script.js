import { Notify } from 'notiflix/build/notiflix-notify-aio';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

import { PixabayAPI } from './api';
import { createMarkup } from './markup';
import { refs } from './refs';
import { spinnerPlay, spinnerStop } from './spinner';

const modalLightboxGallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,  
});

spinnerPlay();

window.addEventListener('load', () => {
  console.log('All resources finished loading!');

  spinnerStop();
});

refs.btnLoadMore.classList.add('is-hidden');

const pixaby = new PixabayAPI();

const onSubmitClick = async event => {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.target;

  const search_query = searchQuery.value.trim().toLowerCase();

  if (!search_query) {
    clearPage();
    Notify.info('Enter data to search!');

    refs.searchInput.placeholder = 'What`re we looking for?';
    return;
  }

  pixaby.query = search_query;

  clearPage();

  try {
    spinnerPlay();
    const { hits, total } = await pixaby.getPhotos();

    if (hits.length === 0) {
      Notify.failure(
        `Sorry, there are no images matching your ${search_query}. Please try again.`
      );

      return;
    }

    const markup = createMarkup(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);

    pixaby.setTotal(total);
    Notify.success(`Hooray! We found ${total} images.`);

    if (pixaby.hasMorePhotos) {
      refs.btnLoadMore.classList.remove('is-hidden');
    } else refs.btnLoadMore.classList.add('is-hidden');
    modalLightboxGallery.refresh();
    scrollPage();
  } catch (error) {
    Notify.failure(error.message, 'Something went wrong!');

    clearPage();
  } finally {
    spinnerStop();
  }
};

const onLoadMore = async () => {
  pixaby.incrementPage();

  if (!pixaby.hasMorePhotos) {
    refs.btnLoadMore.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  try {
    const { hits } = await pixaby.getPhotos();
    const markup = createMarkup(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);

    modalLightboxGallery.refresh();
  } catch (error) {
    Notify.failure(error.message, 'Something went wrong!');

    clearPage();
  }
};

function clearPage() {
  pixaby.resetPage();
  refs.gallery.innerHTML = '';
  refs.btnLoadMore.classList.add('is-hidden');
}

refs.form.addEventListener('submit', onSubmitClick);
refs.btnLoadMore.addEventListener('click', onLoadMore);

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.photo-gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

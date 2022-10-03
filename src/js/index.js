// CSS&SCSS
import 'modern-normalize';
import '../scss/styles.scss';
// JS files
import { ref } from './ref-el';
import { fetchPictures, paginationInfo } from './fetchPictures';
// Libraries
import Notiflix from 'notiflix';

const { searchForm, cardWrapper, loadMoreBtn } = ref;
const { imageSearchRequest } = paginationInfo;

searchForm.addEventListener('submit', onSearchFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

async function onLoadMoreBtnClick(e) {
  e.preventDefault();

  try {
    const countryResponse = await fetchPictures(searchForm.searchQuery.value);

    if (countryResponse.hits.length < 40) {
      loadMoreBtn.classList.add('visually-hidden');
    }

    if (countryResponse.hits.length === 0) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }

    createPicturesCardMarkUp(countryResponse.hits);
  } catch {
    Notiflix.Notify.failure(
      'Sorry, there is a mistake occured. We are working on it!'
    );
  }
}

async function onSearchFormSubmit(e) {
  e.preventDefault();
  const searchInput = searchForm.searchQuery.value;

  try {
    if (imageSearchRequest !== searchInput) {
      cardWrapper.innerHTML = '';
    }

    const countryResponse = await fetchPictures(searchInput);

    if (countryResponse.hits.length < 40) {
      loadMoreBtn.classList.add('visually-hidden');
    } else {
      loadMoreBtn.classList.remove('visually-hidden');
    }

    if (countryResponse.totalHits === 0) {
      throw new Error('');
    }

    Notiflix.Notify.success(
      `Hooray! We found ${countryResponse.total} images.`
    );

    createPicturesCardMarkUp(countryResponse.hits);
  } catch {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function createPicturesCardMarkUp(results) {
  const createdMarkUp = results.map(createOnePictureCardMarkUp).join('');
  cardWrapper.insertAdjacentHTML('beforeend', createdMarkUp);
}

function createOnePictureCardMarkUp(pictureResult) {
  let { webformatURL, tags, likes, views, comments, downloads } = pictureResult;

  const cardMarkUp = `
    <div class="col mb-3">
        <div class="photo-card card" style="height: 100%; max-height: 400px;">
            <img src="${webformatURL}" alt="${tags}" class="card-img-top img-fluid card-img" loading="lazy" style="height: 300px; object-fit: cover" />
            <div class="info card-body d-flex justify-content-center text-center">
                <p class="info-item card-text d-flex flex-column me-2">
                    <b>Likes</b>
                    <b class="fw-normal">${likes}</b>
                </p>
                <p class="info-item card-text d-flex flex-column me-2">
                    <b>Views</b>
                    <b class="fw-normal">${views}</b>
                </p>
                <p class="info-item card-text d-flex flex-column me-2">
                    <b>Comments</b>
                    <b class="fw-normal">${comments}</b>
                </p>
                <p class="info-item card-text d-flex flex-column me-2">
                    <b>Downloads</b>
                    <b class="fw-normal">${downloads}</b>
                </p>
            </div>
        </div>
    </div>
    `;

  return cardMarkUp;
}

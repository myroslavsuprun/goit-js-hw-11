import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '30287979-f096ac17a6ade7f989feb3ac6';

const paginationInfo = {
  imageRequestNumber: 1,
  imageSearchRequest: '',

  incrementImageRequestNumber() {
    this.imageRequestNumber += 1;
  },

  setImageRequestNumberValue(value) {
    this.imageRequestNumber = value;
  },

  updateImageSearchRequest(newSearchRequest) {
    this.imageSearchRequest = newSearchRequest;
  },
};

async function fetchPictures(pictureName) {
  try {
    if (paginationInfo.imageSearchRequest !== pictureName) {
      paginationInfo.setImageRequestNumberValue(1);
    }

    const response = await fetch(
      `${BASE_URL}/?key=${API_KEY}&q=${pictureName}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${paginationInfo.imageRequestNumber}`
    );

    const responseJSON = await response.json();

    paginationInfo.updateImageSearchRequest(pictureName);
    paginationInfo.incrementImageRequestNumber();

    return responseJSON;
  } catch (r) {
    Notiflix.Notify.failure(r);
  }
}

export { fetchPictures, paginationInfo };

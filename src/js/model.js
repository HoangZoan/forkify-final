import { async } from 'regenerator-runtime';
import {
  API_URL,
  RESUTLS_PER_PAGE,
  UPLOAD_ID_LENGTH,
  IMG_ALT_LINK,
} from './config';
import { getJSON } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESUTLS_PER_PAGE,
  },
  bookmarks: [],
  uploads: [],
};

const createRecipeObject = function (data, upload = false) {
  let recipe;
  if (!upload) {
    recipe = data.data.recipe;
  } else {
    recipe = data;
  }
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url || recipe.sourceUrl,
    image: recipe.image_url || recipe.image,
    servings: +recipe.servings,
    cookingTime: recipe.cooking_time || recipe.cookingTime,
    ingredients: recipe.ingredients,
    ...(upload && { upload: true }),
  };
};

const createPreviewObject = function (data) {
  return data.map(rec => {
    return {
      bookmarked: false,
      id: rec.id,
      title: rec.title,
      publisher: rec.publisher,
      image: rec.image_url || rec.image,
      ...(rec.upload && { upload: true }),
    };
  });
};

export const loadRecipe = async function (id) {
  try {
    if (id.length === UPLOAD_ID_LENGTH) {
      state.recipe = state.uploads.find(bm => bm.id === id);
    } else {
      const data = await getJSON(`${API_URL}${id}`);
      state.recipe = createRecipeObject(data);
    }
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await getJSON(`${API_URL}?search=${query}`);
    const searchResults = data.data.recipes;

    state.search.results = createPreviewObject(searchResults);
  } catch (err) {
    console.log('model error');
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RESUTLS_PER_PAGE; // 0, 9, 19...
  const end = page * 10; // 10, 20, 30...
  return state.search.results.slice(start, end);
};

export const updateNewServings = function (newServings) {
  state.recipe.ingredients
    .filter(ing => ing.quantity !== null)
    .forEach(
      ing =>
        (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
    );
  state.recipe.servings = newServings;
};

const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
  localStorage.setItem('uploads', JSON.stringify(state.uploads));
};

const addBookmark = function (recipe) {
  // Store new recipe to the 'upload'
  state.uploads.push(recipe);
  if (recipe.upload) window.location.hash = recipe.id;

  // Add bookmarked recipe to bookmarks
  state.recipe.bookmarked = true;
  state.bookmarks.push(recipe);
  state.bookmarks = createPreviewObject(state.bookmarks);
  state.bookmarks[state.bookmarks.length - 1].bookmarked = true;

  // Add bookmarks to local storage
  persistBookmark();
};

const removeBookmark = function (recipe) {
  // If uploaded recipe is deleted, remove the hash from location address
  // Remove recipe from 'uploads'
  if (recipe.upload) {
    window.location.hash = '';
    const index = state.uploads.findIndex(upload => upload.id === recipe.id);
    state.uploads.splice(index, 1);
  }
  // Remove bookmarked recipe to bookmarks
  state.recipe.bookmarked = false;
  const index = state.bookmarks.findIndex(bm => bm.id === recipe.id);
  state.bookmarks.splice(index, 1);

  // Add bookmarks to local storage
  persistBookmark();
};

const initBookmark = function () {
  const storageBookmarks = localStorage.getItem('bookmarks');
  const storageUupload = localStorage.getItem('uploads');
  if (storageBookmarks) state.bookmarks = JSON.parse(storageBookmarks);
  if (storageUupload) state.uploads = JSON.parse(storageUupload);
};
initBookmark();

const clearStorage = function () {
  localStorage.clear('bookmarks');
  localStorage.clear('uploads');
};
// clearStorage();

export const updateBookmark = function (recipe) {
  if (!state.bookmarks.some(bm => bm.id === recipe.id)) addBookmark(recipe);
  else removeBookmark(recipe);
};

export const updateNewRecipe = function (newRecipe) {
  // Format data from form
  let ingredients = [];
  for (let i = 1; i < 9; i++) {
    if (newRecipe[`ing-${i}_description`] !== '')
      ingredients.push({
        quantity: +newRecipe[`ing-${i}_quantity`],
        unit: newRecipe[`ing-${i}_unit`],
        description: newRecipe[`ing-${i}_description`],
      });
  }

  // If there is NO image URL, show the default picture
  newRecipe.id = Date.now().toString().slice(-UPLOAD_ID_LENGTH);
  newRecipe.ingredients = ingredients;

  const data = createRecipeObject(newRecipe, true);

  // Add new recipe to 'state'
  state.recipe = data;
  window.location.hash = data.id;

  // Add new recipe as bookmarked and save to the local storage
  addBookmark(data);
};

/**
 * Created by albertogiovanelli on 13/03/18.
 */
import '../css/style.css';
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as SearchView from './views/SearchView';
import * as RecipeView from './views/RecipeView';
import * as ListView from './views/ListView';
import * as LikesView from './views/LikesView';

import {elements, renderLoader, clearLoader} from './views/base';
// http://food2fork.com/api/search

// Global app controller

/**
 * Globa state of the app
 * Search Object
 * Current recipe object
 * Shopping list object
 * liked recipes
 * */
const state = {};

/**
 *
 * Search controller
 */
const controlSearch = async() => {
    // 1) get a query from the view
    const query = SearchView.getInput();

    if (query) {
        // 2) new serach object and add to state
        state.search = new Search(query);

        // 3) prepare UI for results
        SearchView.clearInput();
        SearchView.clearResult();
        renderLoader(elements.searchRes);

        // 4) search for recipes
        try {
            await state.search.getResult();
        } catch (err) {

        }

        // 5) render results to UI
        clearLoader();
        SearchView.renderResults(state.search.result);
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        SearchView.clearResult();
        SearchView.renderResults(state.search.result, goToPage);
    }

});


/**
 *
 * Recipe controller
 */

const controlRecipe = async() => {
    //get id from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        //prepare ui for changes
        RecipeView.clearRecipe();
        renderLoader(elements.recipe);

        //highlight selected item
        //if (state.search) SearchView.highlightSelected(id);

        //create new recipe object
        state.recipe = new Recipe(id);


        //Get recipe data
        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
        } catch (err) {
            console.log("Error processing recipe", err);
        }

        // calculate servingsre
        state.recipe.calcTime();
        state.recipe.calcServing();

        //render recipe
        clearLoader();

        RecipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    }
};

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

/**
 *
 * List controller
 */
const controlList = () => {
    //create a list if there is not yet
    if (!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        ListView.renderItem(item);
    })
};

/**
 *
 * Like controller
 */
//testing
state.likes = new Likes();
LikesView.toggleLikeMenu(state.likes.getNumberOflikes());

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;
    if (!state.likes.isLiked(currentId)) {
        // user not liked current recipe

        //add like to the state
        const newLike = state.likes.addLike(
            currentId, state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        //toggle the like button
        LikesView.toggleLikeBtn(true);

        //add like to ui list
        LikesView.renderLike(newLike);
    } else {
        // user has liked the current recipe

        //remove like from the state
        state.likes.deleteLike(currentId);

        //toggle the like button
        LikesView.toggleLikeBtn(false);

        //remove like from the ui state
        LikesView.deleteLike(currentId);
    }
    LikesView.toggleLikeMenu(state.likes.getNumberOflikes());
};

window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();
    LikesView.toggleLikeMenu(state.likes.getNumberOflikes())

    //render existing likes
    state.likes.likes.forEach(like => LikesView.renderLike(like))
});

//handle delete and update items event
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    //handle delete btn
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        //delete from state
        state.list.deleteItem(id);
        //delete from ui
        ListView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = e.target.value;
        //update state
        if (val > 0) state.list.updateCount(id, val);
    }

});

//handling recipe clicks
elements.recipe.addEventListener('click', e => {

    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //decrease button is clicked

        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            RecipeView.updateServingsingredients(state.recipe);
        }
    }
    else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //increase button is clicked
        state.recipe.updateServings('inc');
        RecipeView.updateServingsingredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // add recipe to likes
        controlLike();
    }
});










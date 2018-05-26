/**
 * Created by albertogiovanelli on 14/05/18.
 */
export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = {
            id,
            title,
            author,
            img
        };
        this.likes.push(like);

        //persist data in local storage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumberOflikes() {
        return this.likes.length;
    }

    persistData(){
        localStorage.setItem('likes', JSON.stringify(this.likes))
    }

    readStorage(){
        const storage = JSON.parse(localStorage.getItem('likes'));

        //restore from the local storage
        if (storage) {
            this.likes = storage;
        }
    }
}
/**
 * Created by albertogiovanelli on 14/05/18.
 */
import uniqid from 'uniqid';
export default class List {
    constructor() {
        this.items = [];
    }
    addItem(count ,unit, ingredient){
        const item = {
            id : uniqid(),
            count,
            unit,
            ingredient
        };
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id);
        //.splice mutate the original array, .slice don't mutate
        this.items.splice(index,1);
    }

    updateCount(id, newCount){
        this.items.find(el => el.id === id).count = newCount;
    }
}
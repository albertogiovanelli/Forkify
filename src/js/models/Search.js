import axios from 'axios';
import {proxy, API_KEY} from '../config'

export default class Search {
    constructor(query){
        this.query = query;
    }

    async getResult() {
        try {
            const res = await axios.get(`${proxy}http://food2fork.com/api/search?key=${API_KEY}&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result);
        } catch (err) {
            console.log(err);
        }
    }
}
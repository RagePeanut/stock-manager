import uuid from 'uuid';

import { Transaction } from './transaction';

export class Item {

    public id: string;
    public name: string;
    public purchase: Transaction;
    public sale: Transaction;
    public selected: boolean = false;
    public state: string;

    constructor(name: string, state: string);
    constructor(name: string, state: string, purchase: Transaction, sale: Transaction)
    constructor(name: string, state: string, purchase?: Transaction, sale?: Transaction) {
        this.id = uuid.v4();
        this.name = name;
        this.purchase = purchase || new Transaction();
        this.sale = sale || new Transaction();
        this.state = state;
    }

    public switchSelected() {
        this.selected = !this.selected;
    }

}

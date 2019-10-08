export class Transaction {

    public date: string | undefined;
    public price: number | undefined;

    constructor();
    constructor(date: string, price: number);
    constructor(date?: string, price?: number) {
        this.date = date;
        this.price = price;
    }

}

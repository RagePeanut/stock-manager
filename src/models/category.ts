import { Item } from './item';

export class Category {

    public name: string;
    public items: Item[];

    constructor(name: string);
    constructor(name: string, items: Item[]);
    constructor(name: string, items?: Item[]) {
        this.name = name;
        this.items = items || [];
    }

    public addItem(item: Item): void {
        this.items.push(item);
    }

    public addItems(items: Item[]): void {
        this.items.push(...items);
    }

    public removeItem(index: number): void {
        if (index < 0 || index >= this.items.length) {
            throw new Error('Index out of bound');
        }
        this.items.splice(index, 1);
    }

    public removeItems(ids: string[]): void {
        ids.forEach((id: string) => {
            const index = this.items.findIndex((item: Item) => item.id === id);
            this.removeItem(index);
        });
    }

}

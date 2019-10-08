import { Category } from '@/models/category';
import { Item } from '@/models/item';
import { Transaction } from '@/models/transaction';

const state: any = {
    categories: []
};

const getters: any = {
    categories: (state: any) => state.categories,
    categoryNames: (state: any) => state.categories.map((category: any) => category.name)
};

const actions: any = {
    addCategory: async ({ commit }: any, name: string): Promise<void> => {
        const trimmed: string = name.trim();
        const lowerCased: string = trimmed.toLowerCase();
        if (state.categories.every((category: any) => category.name.toLowerCase() !== lowerCased)) {
            commit('addCategory', name);
        }
    },
    fetchCategories: async ({ commit }: any): Promise<void> => {
        commit('setCategories', [
            new Category('Books', [
                new Item('Devoir de vérité - Tariq Ramadan', 'New', new Transaction('18/07/2018', 15), new Transaction('18/07/2018', 20)),
                new Item('Changer l\'eau des fleurs - Valérie Perrin', 'Used', new Transaction('18/07/2018', 5.5), new Transaction())
            ]),
            new Category('Toys', [
                new Item('La grue araignée', 'New', new Transaction('18/07/2018', 15), new Transaction('18/07/2018', 20)),
                new Item('Little circuit', 'Used', new Transaction('18/07/2018', 5.5), new Transaction())
            ])
        ]);
    },
    moveSelectedItems: async ({ commit }: any, destination: string): Promise<void> => {
        if (!state.categories.some((category: any) => category.name === destination)) {
            commit('addCategory', destination);
        }
        commit('moveSelectedItems', destination);
    },
    removeSelectedItems: async ({ commit }: any, unremovableCategoryName: string): Promise<void> => {
        commit('removeSelectedItems', unremovableCategoryName);
    }
};

const mutations: any = {
    addCategory: (state: any, name: string): void => state.categories.push(new Category(name)),
    moveSelectedItems: (state: any, destination: string): void => {
        const selectedItems: Item[] = [];
        state.categories.forEach((category: Category) => {
            const canMove: boolean = category.name !== destination;
            const selectedItemsIds: string[] = [];
            category.items.forEach((item: Item) => {
                const keep: boolean = !(item.selected && canMove);
                item.selected = false;
                if (!keep) {
                    selectedItems.push(item);
                    selectedItemsIds.push(item.id);
                }
            });
            category.removeItems(selectedItemsIds);
        });
        state.categories.find((category: Category) => category.name === destination)
                        .addItems(selectedItems);
        state.categories = state.categories.filter((category: Category) => category.items.length > 0);
    },
    removeSelectedItems: (state: any, unremovableCategoryName: string): void => {
        state.categories = state.categories.filter((category: Category) => {
            const canRemove: boolean = category.name !== unremovableCategoryName;
            const itemIdsToRemove: string[] = [];
            category.items.forEach((item: Item) => {
                const keep: boolean = !(item.selected && canRemove);
                item.selected = false;
                if (!keep) {
                    itemIdsToRemove.push(item.id);
                }
            });
            category.removeItems(itemIdsToRemove);
            return category.items.length > 0;
        });
    },
    setCategories: (state: any, categories: any): void => state.categories = categories
};

export default {
    state,
    getters,
    actions,
    mutations
};

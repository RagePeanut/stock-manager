import uuid from 'uuid';

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
            {
                name: 'Books',
                items: [
                // tslint:disable:max-line-length
                    { id: uuid.v1(), name: 'Devoir de vérité - Tariq Ramadan', state: 'New', purchase: { date: '18/07/2018', price: 15 }, sale: { date: '18/07/2018', price: 20 }, selected: false },
                    { id: uuid.v1(), name: 'Changer l\'eau des fleurs - Valérie Perrin', state: 'Used', purchase: { date: '18/07/2018', price: 5.5 }, sale: { date: undefined, price: undefined }, selected: false }
                // tslint:enable:max-line-length
                ]
            },
            {
                name: 'Toys',
                items: [
                // tslint:disable:max-line-length
                    { id: uuid.v1(), name: 'La grue araignée', state: 'New', purchase: { date: '18/07/2018', price: 15 }, sale: { date: '18/07/2018', price: 20 }, selected: false },
                    { id: uuid.v1(), name: 'Little circuit', state: 'Used', purchase: { date: '18/07/2018', price: 5.5 }, sale: { date: undefined, price: undefined }, selected: false }
                // tslint:enable:max-line-length
                ]
            }
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
    addCategory: (state: any, category: any): void => state.categories.push({ name: category, items: [] }),
    moveSelectedItems: (state: any, destination: string): void => {
        const selectedItems: any[] = [];
        state.categories = state.categories.map((category: any) => {
            const canMove: boolean = category.name !== destination;
            category.items = category.items.filter((item: any) => {
                const keep = !(item.selected && canMove);
                item.selected = false;
                if (!keep) {
                    selectedItems.push(item);
                }
                return keep;
            });
            return category;
        });
        state.categories.find((category: any) => category.name === destination).items
                        .push(...selectedItems);
        state.categories = state.categories.filter((category: any) => category.items.length > 0);
    },
    removeSelectedItems: (state: any, unremovableCategoryName: string): void => {
        state.categories = state.categories.map((category: any) => {
            const canRemove: boolean = category.name !== unremovableCategoryName;
            category.items = category.items.filter((item: any) => {
                const keep = !(item.selected && canRemove);
                item.selected = false;
                return keep;
            });
            return category;
        }).filter((category: any) => category.items.length > 0);
    },
    setCategories: (state: any, categories: any): void => state.categories = categories
};

export default {
    state,
    getters,
    actions,
    mutations
};

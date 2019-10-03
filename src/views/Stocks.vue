<template>
  <q-page padding>
    <q-input class="q-pb-lg searchbar"
             placeholder="Search"
             type="text"
             v-model="filter">
        <template v-slot:prepend>
            <q-icon name="search"/>
        </template>
    </q-input>
    <div class="actions q-pb-lg q-pl-md">
        <q-btn-dropdown v-model="categoryDropdown" label="Category" color="primary">
            <q-select input-debounce="0"
                      v-model="categoryModel"
                      :options="filteredCategories"
                      @filter="filterCategories"
                      @input="moveItems(categoryModel)"
                      @new-value="createCategory"
                      filled
                      fill-input
                      hide-selected
                      use-input>
                <template v-slot:no-option>
                    <q-item>
                        <q-item-section top avatar>
                            No results, press enter to create
                        </q-item-section>
                    </q-item>
                </template>
            </q-select>
        </q-btn-dropdown>
        <q-btn color="negative" icon="delete" label="Remove" @click="confirmRemove = true"/>
    </div>
    <q-dialog v-model="confirmRemove">
        <q-card>
            <q-card-section class="row items-center">
                <span class="text-h6">Are you sure?</span>
                <span class="q-mt-sm">
                    You are about to <strong>permanently</strong> remove the selected items from your stocks. Once removed, you <strong>won't</strong> be able to access them <strong>ever</strong> again.
                </span>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="Cancel" color="primary" v-close-popup flat/>
                <q-btn label="Remove" color="primary" @click="removeSelected" v-close-popup flat/>
            </q-card-actions>
        </q-card>
    </q-dialog>
    <Category
        v-for="category of categories"
        ref="categories"
        :category="category.name"
        :data="category.items"
        :filter="filter"
        :key="category.name"/>
  </q-page>
</template>

<script lang="ts">
    import uuid from 'uuid';
    import Vue from 'vue';

    import Category from '../components/Category.vue';

    export default Vue.extend({
        name: 'PageStocks',
        components: {
            Category
        },
        data: () => {
            return {
                categories: [
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
                ],
                categoryDropdown: false,
                categoryFilter: '',
                categoryModel: '',
                categoryNames: [ 'Books', 'Toys' ],
                confirmRemove: false,
                filter: '',
                filteredCategories: [ 'Books', 'Toys' ]
            };
        },
        methods: {
            createCategory: function(val: string): void {
                const trimmed = val.trim();
                if (trimmed !== '') {
                    if (!this.categoryNames.map((name: string) => name.toLowerCase()).includes(trimmed.toLowerCase())) {
                        this.categories.push({ name: trimmed, items: [] });
                        this.categoryNames.push(trimmed);
                    }
                    this.moveItems(trimmed);
                }
            },
            filterCategories: function(val: string, update: any): void {
                    this.categoryFilter = val;
                    update(() => {
                        if (val === '') {
                            this.filteredCategories = this.categoryNames;
                        } else {
                            const filter: string = val.toLowerCase();
                            this.filteredCategories = this.categoryNames.filter((name: string) => name.toLowerCase().indexOf(filter) > -1);
                        }
                    });
            },
            moveItems: function(destination: string): any {
                const category = this.categories.find((category: any) => category.name.toLowerCase() === destination.toLowerCase());
                if (category) {
                    category.items = category.items.concat(this.removeSelected(category.name));
                    this.categoryModel = '';
                    this.categoryDropdown = false;
                } else {
                    this.createCategory(destination);
                }
            },
            removeSelected: function(unremovableCategory?: any): any[] {
                const removed: any[] = [];
                for (const category of this.categories) {
                    const canRemove: boolean = category.name !== unremovableCategory;
                    category.items = category.items.filter((item: any) => {
                        if (item.selected && canRemove) {
                            item.selected = false;
                            removed.push(item);
                            return false;
                        }
                        item.selected = false;
                        return true;
                    });
                }
                // Removing the categories that don't have any items anymore
                this.categories = this.categories.filter((category: any) => category.items.length > 0);
                this.categoryNames = this.categories.map((category: any) => category.name);
                for (const category of this.$refs.categories as Vue[]) {
                    category.$data.selected = [];
                }
                return removed;
            }
        }
    });
</script>

<style lang="sass">
    .searchbar
        width: 35%
        margin: 0 auto
    .q-item
        padding-left: 10px
        padding-right: 0
        .q-item__section--avatar
            min-width: unset
            padding-right: 8px
</style>

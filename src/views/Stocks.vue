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
    import { mapActions, mapGetters } from 'vuex';

    import Category from '../components/Category.vue';

    export default Vue.extend({
        name: 'PageStocks',
        components: {
            Category
        },
        computed: {
            ...mapGetters([ 'categories', 'categoryNames' ]) as {
                categories: () => any[],
                categoryNames: () => string[]
            },
            filteredCategories: function(): string[] {
                return this.categoryFilter.length === 0
                    ? this.categoryNames
                    : this.categoryNames.filter((name: string) => name.toLowerCase().indexOf(this.categoryFilter) > -1);
            },
            someSelected: function(): boolean {
                return this.categories.some((category: any) => category.items.some((item: any) => item.selected));
            }
        },
        created: function() {
            this.fetchCategories();
        },
        data: () => {
            return {
                categoryDropdown: false,
                categoryFilter: '',
                categoryModel: '',
                confirmRemove: false,
                filter: ''
            };
        },
        methods: {
            ...mapActions([ 'addCategory', 'fetchCategories', 'moveSelectedItems', 'removeSelectedItems' ]) as {
                addCategory: any,
                fetchCategories: any,
                moveSelectedItems: any,
                removeSelectedItems: any
            },
            createCategory: function(name: any): void {
                this.someSelected ? this.moveSelectedItems(name) : this.addCategory(name);
            },
            filterCategories: function(val: string, update: any): void {
                update(() => {
                    this.categoryFilter = val.toLowerCase();
                });
            },
            moveItems: function(destination: string): any {
                this.moveSelectedItems(destination);
                this.categoryModel = '';
                this.categoryDropdown = false;
                this.uncheckAll();
            },
            removeSelected: function(unremovableCategoryName?: string): void {
                this.removeSelectedItems(unremovableCategoryName);
                this.uncheckAll();
            },
            uncheckAll: function(): void {
                for (const category of this.$refs.categories as Vue[]) {
                    category.$data.selected = [];
                }
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

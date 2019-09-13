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
        :category="category.name"
        :data="category.items"
        :filter="filter"
        :key="category.name"/>
  </q-page>
</template>

<script lang="ts">
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
                            { id: 1, name: 'Devoir de vérité - Tariq Ramadan', state: 'New', purchase: { date: '18/07/2018', price: 15 }, sale: { date: '18/07/2018', price: 20 }, selected: false },
                            { id: 2, name: 'Changer l\'eau des fleurs - Valérie Perrin', state: 'Used', purchase: { date: '18/07/2018', price: 5.5 }, sale: { date: undefined, price: undefined }, selected: false }
                        // tslint:enable:max-line-length
                        ]
                    },
                    {
                        name: 'Toys',
                        items: [
                        // tslint:disable:max-line-length
                            { id: 1, name: 'La grue araignée', state: 'New', purchase: { date: '18/07/2018', price: 15 }, sale: { date: '18/07/2018', price: 20 }, selected: false },
                            { id: 2, name: 'Little circuit', state: 'Used', purchase: { date: '18/07/2018', price: 5.5 }, sale: { date: undefined, price: undefined }, selected: false }
                        // tslint:enable:max-line-length
                        ]
                    }
                ],
                confirmRemove: false,
                filter: ''
            };
        },
        methods: {
            removeSelected: function() {
                for (const category of this.categories) {
                    category.items = category.items.filter((item: any) => !item.selected);
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

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
                            { id: 1, name: 'Devoir de vérité - Tariq Ramadan', purchase: { date: '18/07/2018', price: 15 }, sale: { date: '18/07/2018', price: 20 } },
                            { id: 2, name: 'Changer l\'eau des fleurs - Valérie Perrin', purchase: { date: '18/07/2018', price: 5.5 }, sale: { date: undefined, price: undefined } }
                        // tslint:enable:max-line-length
                        ]
                    },
                    {
                        name: 'Toys',
                        items: [
                        // tslint:disable:max-line-length
                            { id: 1, name: 'La grue araignée', purchase: { date: '18/07/2018', price: 15 }, sale: { date: '18/07/2018', price: 20 } },
                            { id: 2, name: 'Little circuit', purchase: { date: '18/07/2018', price: 5.5 }, sale: { date: undefined, price: undefined } }
                        // tslint:enable:max-line-length
                        ]
                    }
                ],
                filter: ''
            };
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

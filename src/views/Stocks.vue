<template>
  <q-page padding>
    <q-input class="q-pb-lg"
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
                            { id: 1, name: 'La grue araignée', purchase: { date: new Date(), price: 15 }, sale: { date: new Date(), price: 20 } },
                            { id: 2, name: 'Little circuit', purchase: { date: new Date(), price: 5.5 }, sale: { date: undefined, price: undefined } }
                        // tslint:enable:max-line-length
                        ]
                    },
                    {
                        name: 'Toys',
                        items: [
                        // tslint:disable:max-line-length
                            { id: 1, name: 'La grue araignée', purchase: { date: new Date(), price: 15 }, sale: { date: new Date(), price: 20 } },
                            { id: 2, name: 'Little circuit', purchase: { date: new Date(), price: 5.5 }, sale: { date: undefined, price: undefined } }
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
    .q-field
        width: 35%
        margin: 0 auto
    .q-item
        padding-left: 10px
        padding-right: 0
        .q-item__section--avatar
            min-width: unset
            padding-right: 8px
</style>

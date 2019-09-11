<template>
  <q-page padding>
    <Category
        v-for="category of categories"
        :category="category.name"
        :data="category.items"
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
                        name: 'Toys',
                        items: [
                        // tslint:disable:max-line-length
                            { id: 1, brand: 'LEGO', name: 'La grue araignée', purchase: { date: new Date(), price: 15 }, sale: { date: new Date(), price: 20 } },
                            { id: 2, brand: 'Djeco', name: 'Little circuit', purchase: { date: new Date(), price: 5.5 }, sale: { date: undefined, price: undefined } }
                        // tslint:enable:max-line-length
                        ]
                    }
                ]
            };
        }
    });
</script>

<style lang="sass">
    h6
        margin: 0
    .q-item
        padding-left: 10px
        padding-right: 0
        .q-item__section--avatar
            min-width: unset
    .q-table
        tr
            th
                opacity: 1
                text-align: center
                i
                    width: 0
                    margin-left: 0
                    position: relative
                    left: 10px
            &.sold
                background-color: #21BA45
                color: floralwhite
                &:hover
                    background-color: #21BA45
    .q-table__card
        box-shadow: unset
</style>

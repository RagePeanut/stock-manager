<template>
  <q-page padding>
    <q-table
        ref="stocksTable"
        row-key="id"
        :columns="columns"
        :data="data"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        binary-state-sort
        hide-bottom
    />
  </q-page>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { formatDate, formatPrice } from '../utils/formatter';

    export default Vue.extend({
        name: 'PageStocks',
        data: () => {
            return {
                columns: [
                    // tslint:disable:max-line-length
                    { name: 'brand', align: 'left', label: 'Brand', field: 'brand', sortable: true },
                    { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
                    { name: 'dateOfPurchase', align: 'center', label: 'Date of Purchase', field: (row: any) => row.purchase.date, format: (date: Date) => formatDate(date), sortable: true},
                    { name: 'dateOfSale', align: 'center', label: 'Date of Sale', field: (row: any) => row.sale.date, format: (date: Date) => date ? formatDate(date) : '', sortable: true},
                    { name: 'buyingPrice', align: 'center', label: 'Buying Price', field: (row: any) => row.purchase.price, format: (price: number) => formatPrice(price), sortable: true },
                    { name: 'sellingPrice', align: 'center', label: 'Selling Price', field: (row: any) => row.sale.price, format: (price: number) => price ? formatPrice(price) : '', sortable: true },
                    { name: 'profit', align: 'center', label: 'Profit', field: (row: any) => row.sale.price - row.purchase.price, format: (profit: number) => profit ? formatPrice(profit) : '', sortable: true}
                ],
                data: [
                    { id: 1, brand: 'LEGO', name: 'La grue araignée', purchase: { date: new Date(), price: 15 }, sale: { date: new Date(), price: 20 } },
                    { id: 2, brand: 'Djeco', name: 'Little circuit', purchase: { date: new Date(), price: 5.5 }, sale: { date: undefined, price: undefined } }
                    // tslint:enable:max-line-length
                ],
                pagination: {
                    page: 1,
                    rowsPerPage: 0
                }
            };
        },
        mounted: function() {
            const stocksTable = this.$refs.stocksTable as any;
            const stocksTableElt = stocksTable.$el as HTMLElement;
            stocksTableElt.querySelectorAll('tr > td:last-child:not(:empty)').forEach((el: Element) => {
                (el.parentElement as HTMLElement).classList.add('sold');
            });
        }
    });
</script>

<style lang="sass">
    .q-table
        tr
            th
                background-color: white !important
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
</style>

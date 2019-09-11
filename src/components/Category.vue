<template>
    <q-expansion-item
        header-class="bg-white text-h6"
        :label="category"
        dense-toggle
        expand-separator
        switch-toggle-side>
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
    </q-expansion-item>
</template>

<script lang="ts">
    import Vue from 'vue';

    import { formatDate, formatPrice } from '../utils/formatter';

    export default Vue.extend({
        name: 'Category',
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
                pagination: {
                    page: 1,
                    rowsPerPage: 0
                }
            };
        },
        props: [
            'category',
            'data'
        ],
        mounted: function() {
            const stocksTable = this.$refs.stocksTable as any;
            const stocksTableElt = stocksTable.$el as HTMLElement;
            stocksTableElt.querySelectorAll('tr > td:last-child:not(:empty)').forEach((el: Element) => {
                (el.parentElement as HTMLElement).classList.add('sold');
            });
        }
    });
</script>
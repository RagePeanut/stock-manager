<template>
    <q-expansion-item
        header-class="bg-white text-h6"
        :label="category"
        dense-toggle
        switch-toggle-side>
        <q-table
            ref="stocksTable"
            row-key="id"
            :columns="columns"
            :data="data"
            :filter="filter"
            :rows-per-page-options="[0]"
            :pagination.sync="pagination"
            binary-state-sort
            hide-bottom>
            <template v-slot:body="props">
                <q-tr :props="props"
                      :class="{ 'bg-green text-grey-1': isSold(props.row) }">
                    <q-td key="name" :props="props">
                        {{ props.row.name }}
                    </q-td>
                    <q-td key="dateOfPurchase" :props="props">
                        {{ formatDate(props.row.purchase.date) }}
                    </q-td>
                    <q-td key="dateOfSale" :props="props">
                        {{ formatDate(props.row.sale.date) }}
                    </q-td>
                    <q-td key="buyingPrice" :props="props">
                        {{ formatPrice(props.row.purchase.price) }}
                    </q-td>
                    <q-td key="sellingPrice" :props="props">
                        {{ formatPrice(props.row.sale.price) }}
                    </q-td>
                    <q-td key="profit" :props="props">
                        {{ formatPrice(props.row.sale.price - props.row.purchase.price) }}
                    </q-td>
                </q-tr>
            </template>
        </q-table>
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
                    { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
                    { name: 'dateOfPurchase', align: 'center', label: 'Date of Purchase', sortable: true},
                    { name: 'dateOfSale', align: 'center', label: 'Date of Sale', sortable: true},
                    { name: 'buyingPrice', align: 'center', label: 'Buying Price', sortable: true },
                    { name: 'sellingPrice', align: 'center', label: 'Selling Price', sortable: true },
                    { name: 'profit', align: 'center', label: 'Profit', sortable: true}
                ],
                pagination: {
                    page: 1,
                    rowsPerPage: 0
                }
            };
        },
        props: [
            'category',
            'data',
            'filter'
        ],
        methods: {
            formatDate,
            formatPrice,
            isSold(row: any) {
                return row.sale && row.sale.price && row.sale.date;
            }
        }
    });
</script>

<style lang="sass">
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
    .q-table__card
        box-shadow: unset
</style>
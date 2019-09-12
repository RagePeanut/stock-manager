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
                        <q-input v-model="props.row.name" type="text" spellcheck="false" borderless/>
                    </q-td>
                    <q-td key="dateOfPurchase" :props="props">
                        <datetime v-model="props.row.purchase.date" input-class="cursor-pointer"/>
                    </q-td>
                    <q-td key="dateOfSale" :props="props">
                        <datetime v-model="props.row.sale.date" input-class="cursor-pointer"/>
                    </q-td>
                    <q-td key="buyingPrice" :props="props">
                        <money v-model="props.row.purchase.price" v-bind="money"/>
                    </q-td>
                    <q-td key="sellingPrice" :props="props">
                        <money v-model="props.row.sale.price" v-bind="money"/>
                    </q-td>
                    <q-td key="profit" :props="props" style="pointer-events: none">
                        {{ props.row.sale.date ? formatPrice(props.row.sale.price - props.row.purchase.price) : ''}}
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
                money: {
                    decimal: '.',
                    thousands: ',',
                    prefix: '',
                    suffix: '€',
                    precision: 2,
                    masked: false
                },
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
            isSold: (row: any) => {
                return row.sale && row.sale.price && row.sale.date;
            }
        }
    });
</script>

<style lang="sass">
    .q-table tr
        th
            opacity: 1
            text-align: center
            i
                width: 0
                margin-left: 0
                position: relative
                left: 10px
        th, td
            font-size: unset
        input
            outline: none
            border: none
            background-color: unset
            &.vdatetime-input, &.v-money
                text-align: center
        &.bg-green
            input
                color: #fafafa // .text-grey-1
    .q-table__card
        box-shadow: unset
    .vdatetime-calendar__month
        display: flex
        flex-wrap: wrap
</style>
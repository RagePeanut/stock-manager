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
                    <q-td key="state" :props="props">
                        <q-select v-model="props.row.state" :options="options" borderless/>
                    </q-td>
                    <q-td key="dateOfPurchase" :props="props">
                        <!-- <datetime v-model="props.row.purchase.date" input-class="cursor-pointer"/> -->
                        <q-btn :ripple="false" :label="props.row.purchase.date" clear-label="test" flat>
                            <q-popup-proxy>
                                <q-date v-model="props.row.purchase.date" :locale="locale" :mask="mask"/>
                            </q-popup-proxy>
                        </q-btn>
                    </q-td>
                    <q-td key="dateOfSale" :props="props">
                        <q-btn :ripple="false" :label="props.row.sale.date" flat>
                            <q-popup-proxy ref="datePopup">
                                <q-date v-model="props.row.sale.date" :locale="locale" :mask="mask"/>
                                <q-btn class="clear-btn" label="Clear" color="primary" @click="props.row.sale.date = undefined" v-close-popup flat/>
                            </q-popup-proxy>
                        </q-btn>
                    </q-td>
                    <!-- TODO: fix ::before being highlighted when mouse isn't over the input -->
                    <q-td key="buyingPrice" class="td-money" :props="props">
                        <money class="q-field__native" v-model="props.row.purchase.price" v-bind="money"/>
                    </q-td>
                    <q-td key="sellingPrice" class="td-money" :props="props">
                        <money class="q-field__native" v-model="props.row.sale.price" v-bind="money"/>
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

    import config from '../app.config';
    import { formatDate, formatPrice } from '../utils/formatter';

    export default Vue.extend({
        name: 'Category',
        data: () => {
            return {
                columns: [
                    { name: 'name', align: 'left', label: 'Name', sortable: true },
                    { name: 'state', align: 'center', label: 'State', sortable: true},
                    { name: 'dateOfPurchase', align: 'center', label: 'Date of Purchase', sortable: true},
                    { name: 'dateOfSale', align: 'center', label: 'Date of Sale', sortable: true},
                    { name: 'buyingPrice', align: 'center', label: 'Buying Price', sortable: true },
                    { name: 'sellingPrice', align: 'center', label: 'Selling Price', sortable: true },
                    { name: 'profit', align: 'center', label: 'Profit', sortable: true}
                ],
                locale: config.date.locale,
                mask: config.date.mask,
                money: {
                    decimal: '.',
                    thousands: ',',
                    prefix: '',
                    suffix: '€',
                    precision: 2,
                    masked: false
                },
                options: [
                    'New',
                    'Used'
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
            isSold: (row: any): boolean => row.sale && row.sale.price && row.sale.date
        }
    });
</script>

<style lang="sass">
    .q-date
        width: 340px
    .clear-btn
        position: absolute
        right: 12px
        bottom: 12px
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
        td
            padding-top: 0
            padding-bottom: 0
            .q-btn__content
                font-weight: normal
        button
            width: 100%
            &.q-btn
                transition: unset
        input
            outline: none
            border: none
            background-color: unset
            &.vdatetime-input, &.v-money
                text-align: center
        .q-field__control
            input
                padding-left: 16px
            span
                padding: 0 16px
                margin: 0 auto
        .q-field__control, .td-money
            height: 56px
            &::before
                content: ''
                position: absolute
                left: 0
                top: 0
                right: 0
                bottom: 0
                margin: 10px 0
                background-color: dimgrey
                border-radius: 3px
                opacity: 0
                transition: opacity 0.3s
                pointer-events: none
            &:hover::before
                opacity: 0.15
        .q-field__append
            display: none
        .td-money
            position: relative
            &::before
                width: calc(100% - 32px)
                margin: 10px 16px
        &.bg-green
            input, .q-select .q-field__native
                color: #fafafa // .text-grey-1
            .q-field__control::before, .td-money::before
                background-color: white
    .q-table__card
        box-shadow: unset
    .vdatetime-calendar__month
        display: flex
        flex-wrap: wrap
</style>
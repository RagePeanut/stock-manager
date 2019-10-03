<template>
    <q-expansion-item
        header-class="bg-white text-h6 non-selectable"
        :label="category"
        dense-toggle
        switch-toggle-side>
        <q-table
            v-if="data.length > 0"
            class="q-pb-lg"
            ref="stocksTable"
            row-key="id"
            selection="multiple"
            separator="none"
            table-style="overflow: unset"
            :columns="columns"
            :data="data"
            :filter="filter"
            :pagination.sync="pagination"
            :rows-per-page-options="[0]"
            :selected.sync="selected"
            :sort-method="sortTable"
            binary-state-sort
            hide-bottom>
            <template v-slot:body="props">
                <q-tr :props="props"
                      :class="{ 'bg-green text-grey-1': isSold(props.row) }">
                    <q-td auto-width>
                        <q-checkbox :value="props.selected" @input="props.selected = !props.selected; props.row.selected = !props.row.selected"/>
                    </q-td>
                    <q-td key="name" :props="props">
                        <q-input v-model="props.row.name" type="text" spellcheck="false" borderless/>
                    </q-td>
                    <q-td key="state" :props="props">
                        <q-select v-model="props.row.state" :options="options" borderless/>
                    </q-td>
                    <q-td key="dateOfPurchase" :props="props">
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
                        <div>
                            <money class="q-field__native" v-model="props.row.purchase.price" v-bind="money"/>
                        </div>
                    </q-td>
                    <q-td key="sellingPrice" class="td-money" :props="props">
                        <div>
                            <money class="q-field__native" v-model="props.row.sale.price" v-bind="money"/>
                        </div>
                    </q-td>
                    <q-td key="profit" class="non-selectable" :props="props">
                        {{ props.row.sale.date ? formatPrice(props.row.sale.price - props.row.purchase.price) : ''}}
                    </q-td>
                </q-tr>
            </template>
        </q-table>
    </q-expansion-item>
</template>

<script lang="ts">
    import { date } from 'quasar';
    import Vue from 'vue';

    import config from '../app.config';
    import { formatPrice } from '../utils/formatter';

    export default Vue.extend({
        name: 'Category',
        data: () => {
            return {
                columns: [
                    { name: 'name', align: 'left', label: 'Name', sortable: true },
                    { name: 'state', align: 'center', label: 'State', sortable: true, style: 'width: 10%' },
                    { name: 'dateOfPurchase', align: 'center', label: 'Date of Purchase', sortable: true, style: 'width: 10%' },
                    { name: 'dateOfSale', align: 'center', label: 'Date of Sale', sortable: true, style: 'width: 10%' },
                    { name: 'buyingPrice', align: 'center', label: 'Buying Price', sortable: true, style: 'width: 10%' },
                    { name: 'sellingPrice', align: 'center', label: 'Selling Price', sortable: true, style: 'width: 10%' },
                    { name: 'profit', align: 'center', label: 'Profit', sortable: true, style: 'width: 10%' }
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
                },
                selected: []
            };
        },
        props: [
            'category',
            'data',
            'filter'
        ],
        methods: {
            formatPrice,
            isSold: (row: any): boolean => row.sale && row.sale.price && row.sale.date,
            sortTable: function(rows: any[], sortBy: string, isDescending: boolean) {
                const data = [...rows];
                return data.sort((a: any, b: any) => {
                    const { x, y }: any = isDescending ? { x: b, y: a } : { x: a, y: b };
                    switch (sortBy) {
                        case 'buyingPrice':
                            return x.purchase.price - y.purchase.price;
                        case 'sellingPrice':
                            return x.sale.price - y.sale.price;
                        case 'profit':
                            return (x.sale.price - x.purchase.price) - (y.sale.price - y.purchase.price);
                        case 'dateOfPurchase':
                            return date.getDateDiff(
                                            date.extractDate(x.purchase.date, this.mask),
                                            date.extractDate(y.purchase.date, this.mask)
                                        ).valueOf();
                        case 'dateOfSale':
                            return date.getDateDiff(
                                            date.extractDate(x.sale.date, this.mask),
                                            date.extractDate(y.sale.date, this.mask)
                                        ).valueOf();
                        default:
                            return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0;
                    }
                });
            }
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
        input, .q-select .q-field__native
            height: 36px
            padding-top: 0
            padding-bottom: 0
        .q-field__control
            height: 36px
            min-height: 36px
            input
                padding-left: 16px
            span
                padding: 0 16px
                margin: 0 auto
            .q-field__native
                min-height: 36px
        .q-field__control, .td-money div
            &::before
                content: ''
                position: absolute
                left: 0
                top: 0
                right: 0
                bottom: 0
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
            padding: 0
            height: 56px
            div
                margin: 0 16px
                input
                    margin: 10px 0
                &::before
                    width: calc(100% - 32px)
                    margin: 10px 16px
        &.bg-green
            input, .q-select .q-field__native
                color: #fafafa // .text-grey-1
            .q-field__control::before, .td-money div::before
                background-color: white
    .q-table__card
        box-shadow: unset
    .vdatetime-calendar__month
        display: flex
        flex-wrap: wrap
</style>
<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-primary text-white" height-hint="98">
      <q-tabs align="justify">
          <q-tab :ripple="false" name="manage" icon="shopping_basket" label="Stocks"/>
          <q-tab :ripple="false" name="addItems" icon="add_circle" label="Add items"/>
          <q-tab :ripple="false" name="settings" icon="settings_applications" label="Settings"/>
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
    import Vue from 'vue';
    export default Vue.extend({
        name: 'LayoutDefault'
    });
</script>
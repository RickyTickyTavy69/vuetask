<script setup lang="ts">

import { Item } from '@/app/types/items.types';

import { ref } from 'vue';

import DB from '@/db';

const props = defineProps<{
    updateItemsList :(item: Item) => void;
    items: Array<Item>;
  }>();


const newItem = ref<string>('');
const count = ref<number>(1);


const addItem = () => {
  const value = newItem.value && newItem.value.trim();
  const item = {
    id: props.items.length + 1,
    title: value,
    completed: false,
    count: count.value,
  };

  if (!value) {
    return;
  }
  props.updateItemsList(item);
  DB.saveItem(item);
  newItem.value = '';
};

</script>

<template>
  <v-container class="d-flex flex-column mb-10 mx-auto border-md">
      <div class="d-flex ga-10">
        <v-text-field
          class="w-25"
          label="item to buy"
          placeholder="what do I need to buy?"
          autofocus
          autocomplete="off"
          v-model="newItem"
          @keyup.enter="addItem"
        />
        <v-text-field
          class="w-25"
          label="amount"
          placeholder="how many"
          autofocus
          autocomplete="off"
          type="number"
          @keyup.enter="addItem"
          v-model="count"
        />
      </div>
      <div class="d-flex ga-10">
        <v-btn class="w-25" @click="addItem">ADD to List</v-btn>
      </div>
    </v-container>
</template>

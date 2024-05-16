<script setup lang="ts">

import { Item } from '@/app/types/items.types';

// vue
import {
  computed, onMounted, ref, defineProps,
} from 'vue';

import DB from '@/db';

const props = defineProps<{
    updateItemsList :(item: Item) => void;
  }>();

// data
const newItem = ref<string>('');
const count = ref<number>(1);
const items = ref<Array<Item>>([]);

const activeTasks = computed(() => items.value.filter((item) => !item.completed));
const remaining = computed(() => activeTasks.value.length);

const allDone = computed({
  get() {
    return remaining.value === 0;
  },
  set(value: boolean) {
    items.value.forEach((item, idx) => {
      items.value[idx].completed = value;
      DB.saveItem({
        ...item,
      });
    });
  },
});

// methods
const addItem = () => {
  const value = newItem.value && newItem.value.trim();
  const item = {
    id: items.value.length + 1,
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

// lifecycle
onMounted(async () => {
  items.value = await DB.getItems();
});

</script>

<template>
  <div class="d-flex mb-10">
    <div>
      <v-text-field
        placeholder="what do I need to buy?"
        autofocus
        autocomplete="off"
        v-model="newItem"
        @keyup.enter="addItem"
      />
      <v-text-field
        placeholder="price €"
        autofocus
        autocomplete="off"
        type="number"
        @keyup.enter="addItem"
      />
    </div>
    <v-text-field
      placeholder="count"
      autofocus
      autocomplete="off"
      type="number"
      @keyup.enter="addItem"
      v-model="count"
    />
    <v-btn @click="addItem">ADD to List</v-btn>
  </div>

  <div class="mb-10">
    <v-checkbox-btn
      class="border-md"
      color="primary"
      v-model="allDone"
      label="mark all as complete"
    />
  </div>
</template>

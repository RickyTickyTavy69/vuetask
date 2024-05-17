<script setup lang="ts">
import DB from '@/db';
import { onMounted, ref } from 'vue';

import { Item } from '@/app/types/items.types';

const props = defineProps<{
    filteredItems: Array<Item>,
    removeItem:(item: Item) => void,
    updateItem: (item: Item) => void,
  }>();

const items = ref([props.filteredItems]);

const previousItem = ref<string>('');
const editedItem = ref();

onMounted(async () => {
  items.value = await DB.getItems();
});

// editing

const editItem = (item: Item) => {
  previousItem.value = item.title;
  editedItem.value = item;
};

const cancelEdit = (item: Item) => {
  editedItem.value = null;
  // item.title = previousItem.value.toString();
  // what does it do
};

const doneEdit = (item : Item) => {
  console.log('item', item);
  if (!editedItem.value) {
    return;
  }
  editedItem.value = null;
  // item.title = item.title.trim();
  // what does it do
  DB.saveItem({
    ...item,
    title: item.title,
  });
  if (!item.title) {
    DB.deleteItem(item);
  }
};


</script>

<template>
  <div>
    <v-card
      class="overflow-y-auto mx-auto"
      v-show="props.filteredItems.length"
      max-height="400"
      max-width="1000"
    >

      <v-row
        class="d-flex justify-space-around w-100 mx-auto ga-10 border-md my-2"
        v-for="item in filteredItems"
        :key="item.id"
        :class="{ completed: item.completed }"
      >
        <div>
          <v-text-field
            class="toggle"
            type="checkbox"
            @click="updateItem(item)"
            :checked="item.completed"
          />
        </div>
        <h4 @dblclick="editItem(item)" v-if="item !==editedItem" :class="{
        'text-h4' : true,
        'text-decoration-line-through': item.completed,
      }">{{ item.title }} - ({{item.count}}) </h4>
        <v-text-field
          autocomplete="off"
          autofocus
          v-if="item === editedItem"
          v-model="item.title"
          @blur="doneEdit(item)"
          @keyup.enter="doneEdit(item)"
          @keyup.esc="cancelEdit(item)"
        />
        <v-btn
          color="red"
          @click="removeItem(item)">
          delete
        </v-btn>
      </v-row>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import DB from '@/db';
import { ref } from 'vue';

import { Item } from '@/app/types/items.types';

defineProps<{
    filteredItems: Array<Item>,
    removeItem:(item: Item) => void,
    updateItem: (item: Item) => void,
    markAllDone: () => void,
    propsItems: Array<Item>,
  }>();


const previousItem = ref<string>('');
const editedItem = ref();


const editItem = (item: Item) => {
  previousItem.value = item.title;
  editedItem.value = item;
};

const cancelEdit = () => {
  editedItem.value = null;
};

const doneEdit = (item : Item) => {
  if (!editedItem.value) {
    return;
  }
  editedItem.value = null;
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
  <v-card
    v-show="propsItems.length"
    class="w-100 mx-auto"
    max-width="700"
  >
    <div class="mb-10 d-flex justify-center">
      <div class="w-25">
        <v-btn
          @click="markAllDone"
          color="primary"
        >
          mark all Done
        </v-btn>
      </div>
    </div>

    <v-card
      class="overflow-y-auto border-md w-100 mx-auto"
      max-height="350"
      max-width="700"
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
          max-width="110"
          autocomplete="off"
          autofocus
          v-if="item === editedItem"
          v-model="item.title"
          @blur="doneEdit(item)"
          @keyup.enter="doneEdit(item)"
          @keyup.esc="cancelEdit()"
        />
        <div class="d-flex flex-column ga-5">
          <v-btn
            color="red"
            @click="removeItem(item)">
            delete
          </v-btn>
          <v-btn
            @click="editItem(item)"
            color="orange"
          >
            Edit
          </v-btn>
        </div>
      </v-row>
    </v-card>
  </v-card>
</template>

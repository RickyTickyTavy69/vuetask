<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';

import { Item, Visibility } from '@/app/types/items.types';

import AppHeader from '@/widgets/Header/App-header.vue';
import ShoppingList from '@/widgets/ShoppingList/ShoppingList.vue';
import AddItemForm from '@/widgets/AddItemForm/AddItemForm.vue';
import AppFooter from '@/widgets/Footer/App-footer.vue';

import DB from '@/db';

onMounted(async () => {
  items.value = await DB.getItems();
});

// data
const items = ref<Array<Item>>([]);
const visibility = ref<Visibility>('all');

const filteredTodos = computed(() => {
  if (visibility.value === 'all') {
    return items.value;
  } if (visibility.value === 'active') {
    return items.value.filter((item) => !item.completed);
  }
  return items.value.filter((item) => item.completed);
});

const changeVisibility = (newValue: Visibility) => {
  visibility.value = newValue;
};

const updateItemsList = (item: Item) => {
  items.value.push(item);
};

const removeItem = async (item: Item) => {
  const index = items.value.indexOf(item);
  items.value.splice(index, 1);
  await DB.deleteItem(item);
};

const updateItem = async (item: Item) => {
  if (items.value.length >= 1) {
    items.value.find((el) => el === item).completed = !item.completed;
  }
  await DB.saveItem({
    ...item,
  });
};

const removeCompleted = () => {
  items.value = items.value.filter((item) => {
    if (item.completed) {
      DB.deleteItem(item);
    } else {
      return item;
    }
  });
};


const markAllDone = () => {
  const done = items.value.filter((item) => !item.completed);
  if(done.length){
    items.value.forEach((item, idx) => {
      items.value[idx].completed = true;
      DB.saveItem({
        ...item,
      });
    });
  } else {
    items.value.forEach((item, idx) => {
      items.value[idx].completed = false;
      DB.saveItem({
        ...item,
      });
    });
  }
}

</script>

<template>
  <v-app>
    <AppHeader/>
    <v-container class="fill-height border-md">
        <AddItemForm
          :items="items"
          :updateItemsList="updateItemsList
        "/>
        <ShoppingList
          :propsItems="items"
          :items="items"
          :filtered-items="filteredTodos"
          :removeItem="removeItem"
          :updateItem="updateItem"
          :markAllDone="markAllDone"
        />
    </v-container>
    <AppFooter
      :items="items"
      :visibility="visibility"
      :change-visibility="changeVisibility"
      :remove-completed="removeCompleted"
    />
  </v-app>
</template>

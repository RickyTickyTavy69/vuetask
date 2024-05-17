<script setup lang="ts">

// vue
import { computed, ref, onMounted } from 'vue';

// types
import { Item, Visibility } from '@/app/types/items.types';

// components
import AppHeader from '@/widgets/Header/App-header.vue';
import ShoppingList from '@/widgets/ShoppingList/ShoppingList.vue';

// DB
import DB from '@/db';

// styles
import { useDisplay } from 'vuetify';
import AppFooter from '@/widgets/Footer/App-footer.vue';
import AddItemForm from '@/widgets/AddItemForm/AddItemForm.vue';

const { mobile } = useDisplay();

// data
const items = ref<Array<Item>>([]);
const updatedTodo = ref<Item>();
const visibility = ref<Visibility>('all');

const filteredTodos = computed(() => {
  if (visibility.value === 'all') {
    return items.value;
  } if (visibility.value === 'active') {
    return items.value.filter((item) => !item.completed);
  }
  return items.value.filter((item) => item.completed);
});

// lifecycle
onMounted(async () => {
  console.log('is mobile app', mobile.value);
  items.value = await DB.getItems();
});

const changeVisibility = (newValue: Visibility) => {
  console.log("change visibility")
  visibility.value = newValue;
};

const updateItemsList = (item: Item) => {
  items.value.push(item);
  updatedTodo.value = item;
};

// items

const removeItem = (item: Item) => {
  const index = items.value.indexOf(item);
  items.value.splice(index, 1);
  DB.deleteItem(item);
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
  // eslint-disable-next-line array-callback-return
  items.value = items.value.filter((item) => {
    if (item.completed) {
      DB.deleteItem(item);
    } else {
      return !item.completed;
    }
  });
};



const markAllDone = () => {
  console.log("mark done");
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

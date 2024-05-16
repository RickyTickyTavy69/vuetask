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
const todos = ref<Array<Item>>([]);
const updatedTodo = ref<Item>();
const visibility = ref<Visibility>('all');

const activeTasks = computed(() => todos.value.filter((todo) => !todo.completed));

const filteredTodos = computed(() => {
  if (visibility.value === 'all') {
    return todos.value;
  } if (visibility.value === 'active') {
    return activeTasks;
  }
  return todos.value.filter((todo) => todo.completed);
});

// lifecycle
onMounted(async () => {
  console.log('is mobile app', mobile.value);
  todos.value = await DB.getItems();
});

const changeVisibility = (newValue: Visibility) => {
  visibility.value = newValue;
};

const updateItemsList = (item: Item) => {
  todos.value.push(item);
  updatedTodo.value = item;
};

// items

const removeItem = (item: Item) => {
  const index = todos.value.indexOf(item);
  todos.value.splice(index, 1);
  DB.deleteItem(item);
};

const updateItem = async (item: Item) => {
  if (todos.value.length >= 1) {
    todos.value.find((el) => el === item).completed = !item.completed;
  }
  await DB.saveItem({
    ...item,
  });
};

const removeCompleted = () => {
  // eslint-disable-next-line array-callback-return
  todos.value = todos.value.filter((item) => {
    if (item.completed) {
      DB.deleteItem(item);
    } else {
      return !item.completed;
    }
  });
};

</script>

<template>
    <AppHeader/>
    <v-card class="mx-auto" width="1000">
      <AddItemForm :updateItemsList="updateItemsList"/>

      <ShoppingList
        :items="todos"
        :filtered-items="filteredTodos as Array<Item>"
        :removeItem="removeItem"
        :updateItem="updateItem"
      />
      <AppFooter
        :items="todos"
        :visibility="visibility"
        :change-visibility="changeVisibility"
        :remove-completed="removeCompleted"
      />
    </v-card>
</template>

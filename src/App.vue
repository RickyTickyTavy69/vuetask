<script setup>

// vue
import { computed, ref, onMounted } from 'vue';

// components
import AppHeader from '@/widgets/Header/App-header.vue';
import ShoppingList from '@/widgets/ShoppingList/ShoppingList.vue';

// DB
import DB from '@/db';

// styles
import { useDisplay } from 'vuetify'
import AppFooter from '@/widgets/Footer/App-footer.vue';
import AddItemForm from '@/widgets/AddItemForm/AddItemForm.vue';
const { mobile } = useDisplay()


// data
const todos = ref([]);
const updatedTodo = ref("");
const visibility = ref('all');
const updateReady = ref(false);


const activeTasks = computed(() => todos.value.filter((todo) => !todo.completed));
const filteredTodos = computed(() => {
  if (visibility.value === 'all') {
    return todos.value;
  } if (visibility.value === 'active') {
    return activeTasks;
  }
  return todos.value.filter((todo) => todo.completed);
})




// lifecycle
onMounted(async () => {
  console.log("is mobile app", mobile.value);
  todos.value = await DB.getItems();
})


const changeVisibility = (newValue) => {
  visibility.value = newValue;
}

const updateItemsList = (item) => {
  // console.log("updated");
  // const newTodos = [...todos.value, item];
  todos.value.push(item);
  updatedTodo.value = item;
}

const onUpdateCompleted = (updatedTodo) => {
  console.log("update completed")
  updateReady.value = true;
}

</script>


<template>
  <AppHeader/>
    <v-card class="mx-auto" width="1000">
      <AddItemForm :updatedTodo="updatedTodo" :updateItemsList="updateItemsList" @update-completed="onUpdateCompleted"/>
      <ShoppingList :filtered-items="filteredTodos"/>
      <AppFooter :visibility="visibility" :change-visibility="changeVisibility" />
    </v-card>
</template>







/*

const beforeEditCache = ref();

const editTodo = (todo) => {
beforeEditCache.value = todo.title;
editedTodo.value = todo;
}

const cancelEdit = (todo) => {
editedTodo.value = null;
todo.title = beforeEditCache.value;
}

const doneEdit = (todo) => {
// console.log("done edit")
if (!editedTodo.value) {
return;
}
editedTodo.value = null;
todo.title = todo.title.trim();
DB.saveItem({
...todo,
title: todo.title,
});
if (!todo.title) {
removeTodo(todo);
}
} */

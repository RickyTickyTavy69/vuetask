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
const { mobile } = useDisplay()


/****************************/
import { shallowRef } from 'vue'

const model = shallowRef('Egg plant')
/*****************************/

// data
const todos = ref([]);
const newTodo = ref('');
const editedTodo = ref(null);
const visibility = ref('all');


const activeTasks = computed(() => todos.value.filter((todo) => !todo.completed));
const filteredTodos = computed(() => {
  if (visibility.value === 'all') {
    return todos.value;
  } if (visibility.value === 'active') {
    return activeTasks;
  }
  return todos.value.filter((todo) => todo.completed);
})

const remaining = computed(() => activeTasks.value.length);

const allDone = computed({
  get() {
    return remaining.value === 0;
  },
  set(value) {
    todos.value.forEach((todo) => {
      todo.completed = value;
      DB.saveItem({
        ...todo,
      })
    });
  }
});


// lifecycle
onMounted(async () => {
  console.log("is mobile app", mobile.value);
  todos.value = await DB.getItems();
})

// methods
// todos

const addTodo = () => {
  const value = newTodo.value && newTodo.value.trim();
  const todoItem = {
    id: todos.value.length + 1,
    title: value,
    completed: false,
  };

  if (!value) {
    return;
  }
  todos.value.push(todoItem);
  DB.saveItem(todoItem);
  newTodo.value = '';
}

const changeVisibility = (newValue) => {
  visibility.value = newValue;
}

</script>


<template>
  <AppHeader/>

  <v-card
    class="mx-auto"
    width="1000"
  >
      <div class="d-flex mb-10">
       <v-text-field
         placeholder="what do I need to buy?"
         autofocus
         autocomplete="off"
         v-model="newTodo"
         @keyup.enter="addTodo"
       />
       <v-text-field
         placeholder="price €"
         autofocus
         autocomplete="off"
         type="number"
         @keyup.enter="addTodo"
       />
       <v-btn @click="addTodo">ADD to List</v-btn>
     </div>

     <div class="mb-10">
       <v-checkbox-btn
         class="border-md"
         color="primary"
         v-model="allDone"
         label="mark all as complete"
       />
     </div>


  <ShoppingList
    :filtered-items="filteredTodos"
  />

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

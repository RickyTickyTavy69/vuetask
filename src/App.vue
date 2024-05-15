<script setup>

// components
import AppHeader from '@/widgets/Header/App-header.vue';
import ShoppingList from '@/widgets/ShoppingList/ShoppingList.vue';

// DB
import DB from '@/db';

import { useDisplay } from 'vuetify'

import { computed, ref, onMounted } from 'vue';


const { mobile } = useDisplay()

// const user = reactive({ firstName: 'John', lastName: 'Doe', age: 25 });
const dataBase = ref(null);
const todos = ref([]);
const newTodo = ref('');
const editedTodo = ref(null);
const visibility = ref('all');
const beforeEditCache = ref();

onMounted(() => {
  console.log("is mobile app", mobile.value);
})



  const updateTodo = (todo) => {

    todos.value.find((item) => item === todo).completed = !todo.completed;

    saveTodo({
      ...todo
    })
  };



/* async created() {
  this.todos = await this.getToDoStore();
} */

const removeCompleted =() => {
  todos.value = todos.value.filter((item) => {
    if(item.completed){
      deleteTodo(item);
    } else {
      return !item.completed
    }
  });
}

const saveTodo = async (todo) => {
  dataBase.value = await DB.getDataBase();

  return new Promise((resolve, reject) => {
    const transaction = dataBase.value.transaction('items', 'readwrite');
    const store = transaction.objectStore('items');

    store.put(todo);

    transaction.oncomplete = () => {
      resolve('Item successfully saved.');
    }

    transaction.onerror = (event) => {
      reject(event)
    }
  })
}

const deleteTodo = async (todo) => {
  const data = await getDatabase();

  return new Promise((resolve, reject) => {
    const transaction = data.transaction('items', 'readwrite');
    const store = transaction.objectStore('items');

    store.delete(todo.id);

    transaction.oncomplete = () => {
      resolve('Item successfully deleted.');
    }

    transaction.onerror = (event) => {
      reject(event);
    }
  })
}

onMounted(
  async () => {
    todos.value = await DB.getItems();
  }
)

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
  saveTodo({
    ...todo,
    title: todo.title,
  });
  if (!todo.title) {
    removeTodo(todo);
  }
}

const pluralize = (word, count) => {
  return word + (count === 1 ? '' : 's');
}



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
  saveTodo(todoItem);
  newTodo.value = '';
}


const removeTodo = (todo) => {
  const index = todos.value.indexOf(todo);
  todos.value.splice(index, 1);
  deleteTodo(todo);
}



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
      saveTodo({
        ...todo,
      })
    });
  }
});
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
    :todos="todos"
    :filtered-todos="filteredTodos"
    :update-todo="updateTodo"
    :remove-todo="removeTodo"
    :edited-todo="editedTodo"
  />


    <footer class="footer" v-show="todos.length">
      <span class="todo-count">
        <strong v-text="remaining"></strong>
        {{ pluralize('item', remaining) }} left
      </span>

      <v-list class="d-flex justify-space-around">
        <li>
          <button
            @click="visibility = 'all'"
            :class="{ selected: visibility == 'all' }"
            class="btn"
          >
            All
          </button>
        </li>
        <li>
          <button
            @click="visibility = 'active'"
            :class="{ selected: visibility == 'active' }"
            class="btn"
          >
            Active
          </button>
        </li>
        <li>
          <button
            @click="visibility = 'completed'"
            :class="{ selected: visibility == 'completed' }"
            class="btn"
          >
            Completed
          </button>
        </li>
      </v-list>
      <button
        class="clear-completed"
        @click="removeCompleted"
        v-show="todos.length > remaining"
      >
        Clear completed
      </button>
    </footer>
  </v-card>
</template>

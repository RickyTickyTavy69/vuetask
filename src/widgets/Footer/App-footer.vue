<script setup lang="ts">

const props = defineProps<{
  visibility: any,
  changeVisibility: (visibility: string) => void,
}>()

import { computed, onMounted, ref } from 'vue';
import DB from '@/db';

const todos = ref([]);


const activeTasks = computed(() => todos.value.filter((todo) => !todo.completed));
const remaining = computed(() => activeTasks.value.length);

const pluralize = (word, count) => {
  return word + (count === 1 ? '' : 's');
}

const removeCompleted = () => {
  todos.value = todos.value.filter((item) => {
    if(item.completed){
      DB.deleteItem(item);
    } else {
      return !item.completed
    }
  });
}

onMounted(async () => {
  todos.value = await DB.getItems();
})

</script>


<template>
  <footer class="footer" v-show="todos.length">
      <span class="todo-count">
        <strong v-text="remaining"></strong>
        {{ pluralize('item', remaining) }} left
      </span>

    <v-list class="d-flex justify-space-around">
      <li>
        <button
          @click="changeVisibility('all')"
          :class="{ selected: visibility == 'all' }"
          class="btn"
        >
          All
        </button>
      </li>
      <li>
        <button
          @click="changeVisibility('active')"
          :class="{ selected: visibility == 'active' }"
          class="btn"
        >
          Active
        </button>
      </li>
      <li>
        <button
          @click="changeVisibility('completed')"
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
</template>

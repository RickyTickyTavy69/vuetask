<script setup lang="ts">

import { Item, Visibility } from '@/app/types/items.types';

import { computed } from 'vue';

const props = defineProps<{
  visibility: Visibility,
  changeVisibility:(visibility: Visibility) => void,
  items: Array<Item>,
  removeCompleted: () => void,
}>();

const activeTasks = computed(() => props.items.filter((todo) => !todo.completed));
const remaining = computed(() => activeTasks.value.length);

const pluralize = (word: string, count: number) => word + (count === 1 ? '' : 's');

</script>

<template>
  <footer class="footer" v-show="props.items.length">
    <div class="d-flex justify-center">
      <span class="todo-count">
        <strong v-text="remaining"></strong>
        {{ pluralize('item', remaining) }} left
      </span>
    </div>


    <v-list class="d-flex justify-space-around">
      <li>
        <v-btn
          @click="changeVisibility('all')"
          :class="{ selected: visibility == 'all' }"
          class="btn"
          data-testid="btn-visibility-all"
        >
          All
        </v-btn>
      </li>
      <li>
        <v-btn
          @click="changeVisibility('active')"
          :class="{ selected: visibility == 'active' }"
          class="btn"
          data-testid="btn-visibility-active"
        >
          Active
        </v-btn>
      </li>
      <li>
        <v-btn
          @click="changeVisibility('completed')"
          :class="{ selected: visibility == 'completed' }"
          class="btn"
          data-testid="btn-visibility-completed"
        >
          Completed
        </v-btn>
      </li>
    </v-list>
    <v-btn
      class="clear-completed"
      @click="removeCompleted"
      v-show="items.length > remaining"
    >
      Clear completed
    </v-btn>
  </footer>
</template>

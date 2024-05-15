<script setup lang="ts">
  defineProps<{
    todos: [],
    filteredTodos: [],
    editedTodo: any,
    updateTodo: (todo: any) => void,
    removeTodo: (todo: any) => void,
  }>();
</script>


<template>
  <div v-show="todos.length">

    <div
      class="d-flex justify-space-between ga-10 border-md"
      v-for="todo in filteredTodos"
      :key="todo.id"
      :class="{ completed: todo.completed, editing: todo == editedTodo }"
    >
      <div>
        <v-text-field
          class="toggle"
          type="checkbox"
          @click="updateTodo(todo)"
          :checked="todo.completed"
        />
      </div>
      <!-- <label @dblclick="editTodo(todo)">{{ todo.title }}</label> -->
      <h4 class="text-h4">{{todo.title}}</h4>
      <v-btn
        color="red"
        @click="removeTodo(todo)">
        delete
      </v-btn>
    </div>
  </div>
</template>

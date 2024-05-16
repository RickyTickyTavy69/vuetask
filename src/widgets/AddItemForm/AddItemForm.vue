<script setup lang="ts">

  const props = defineProps<{
    updateItemsList : (item: any) => void;
    updatedTodo: any;
  }>()

  // vue
  import { computed, onMounted, ref } from 'vue';
  import DB from '@/db';

  // data
  const newItem = ref('');
  const items = ref([]);

  const remaining = computed(() => activeTasks.value.length);
  const activeTasks = computed(() => items.value.filter((item) => !item.completed));

  const emit = defineEmits<{
    (e: 'update-completed', value: string): void
  }>()

  const completedInputModel = computed({
    // getter
    get() {
      return props.updatedTodo
    },
    // setter
    set(newValue: string) {
      emit('update-completed', newValue)
    },
  })

  const allDone = computed({
    get() {
      return remaining.value === 0;
    },
    set(value) {
      items.value.forEach((item) => {
        item.completed = value;
        DB.saveItem({
          ...item,
        })
      });
    }
  });

  // methods
  const addItem = () => {
    const value = newItem.value && newItem.value.trim();
    const Item = {
      id: items.value.length + 1,
      title: value,
      completed: false,
    };

    if (!value) {
      return;
    }
    props.updateItemsList(Item);
    items.value.push(Item);
    DB.saveItem(Item);
    emit('update-completed', "newValue");
    newItem.value = '';
  }

  // lifecycle
  onMounted(async () => {
    items.value = await DB.getItems();
  })


</script>

<template>
  <div class="d-flex mb-10">
    <v-text-field
      placeholder="what do I need to buy?"
      autofocus
      autocomplete="off"
      v-model="newItem"
      @keyup.enter="addItem"
    />
    <v-text-field
      placeholder="price €"
      autofocus
      autocomplete="off"
      type="number"
      @keyup.enter="addItem"
    />
    <v-btn @click="addItem">ADD to List</v-btn>
  </div>

  <div class="mb-10">
    <v-checkbox-btn
      class="border-md"
      color="primary"
      v-model="allDone"
      label="mark all as complete"
    />
  </div>
</template>

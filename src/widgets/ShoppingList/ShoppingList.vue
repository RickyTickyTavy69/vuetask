<script setup lang="ts">
  import DB from '@/db';
  import { onMounted, ref } from 'vue';

  const props = defineProps<{
    filteredItems: [],
  }>();

  const items = ref([]);

  const previousItem = ref<string>();
  const editedItem = ref();

  onMounted(async () => {
    items.value = await DB.getItems();
  })

  const removeItem = (item: any) => {
    const index = items.value.indexOf(item);
    items.value.splice(index, 1);
    DB.deleteItem(item);
  }

  const updateItem = async (item: any) => {
    items.value.find((el) => el === item).completed = !item.completed;
    await DB.saveItem({
      ...item
    })
  };

  // editing

  const editItem = (item: any) => {
    previousItem.value = item.title;
    editedItem.value = item;
  }

  const cancelEdit = (item: any) => {
    editedItem.value = null;
    item.title = previousItem;
  }

  const doneEdit = (item : any) => {
    console.log("item", item);
    if (!editedItem.value) {
      return;
    }
    editedItem.value = null;
    item.title = item.title.trim();
    DB.saveItem({
      ...item,
      title: item.title,
    });
    if (!item.title) {
      DB.deleteItem(item)
    }
  }

</script>


<template>
  <div v-show="items.length">

    <div
      class="d-flex justify-space-between ga-10 border-md"
      v-for="item in filteredItems"
      :key="item.id"
      :class="{ completed: item.completed }"
    >
      <div>
        <v-text-field
          class="toggle"
          type="checkbox"
          @click="updateItem(item)"
          :checked="item.completed"
        />
      </div>
      <h4 @dblclick="editItem(item)" v-if="item !==editedItem" class="text-h4">{{item.title}}</h4>
      <v-text-field
        autocomplete="off"
        autofocus
        v-if="item === editedItem"
        v-model="item.title"
        @blur="doneEdit(item)"
        @keyup.enter="doneEdit(item)"
        @keyup.esc="cancelEdit(item)"
      />
      <v-btn
        color="red"
        @click="removeItem(item)">
        delete
      </v-btn>
    </div>
  </div>
</template>










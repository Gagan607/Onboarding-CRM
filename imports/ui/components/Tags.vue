<template>
  <div>
    <div>
      <!-- Button to trigger the modal -->
      <button class="tag-btn" @click="showModal = true">Create Tags</button>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <!-- Modal header -->
        <div class="modal-header">
          <h2>New Tag</h2>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <input
            v-model="tags"
            id="tag-input" type="text"
            placeholder="Enter tag"
          />
        </div>

        <!-- Modal footer -->
        <div class="modal-footer">
          <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2" @click="addTag">Save</button>
          <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>   
    <!-- display tags table    -->
    <TagsTable />

  </div>

 
    
</template>

<script setup>
import { Meteor } from 'meteor/meteor';
import { ref } from 'vue';

import TagsTable from '../tables/TagsTable.vue';

const showModal = ref(false);
const tags = ref('');

const addTag = () => {
  const trimmedTag = tags.value.trim();
  Meteor.call('tags.insert', { tags: trimmedTag });
  tags.value = '';
  showModal.value = false;
};

const closeModal = () => {
  showModal.value = false;
};

</script>

<style scoped>
/* Your existing styles */
.tag-btn {
  border-radius: 3px;
  margin-top: 8rem; /* Adjust margin top */
  margin-left: 45rem;
  padding: 10px;
  background-color: purple;
  color: white;
  font-weight: bold;
}

#tag-input {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  z-index: 1000;
}

.modal-content {
  margin-left: 10rem;
  width: 400px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); /* Shadow for depth */
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.modal-header h2 {
  margin: 0;
}

.close {
  cursor: pointer;
}

.modal-body {
  margin-bottom: 10px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.Cancel-btn,
.Save-btn {
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

</style>

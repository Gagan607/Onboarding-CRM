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
          <span class="close" @click="closeModal">&times;</span>
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
          <button class="Cancel-btn" @click="closeModal">Cancel</button>
          <button class="Save-btn" @click="addTag">Save</button>
        </div>
      </div>
    </div>

    <!-- Display Table -->
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

const onKeyDown = (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
};
</script>

<style scoped>
/* Your existing styles */
.tag-btn {
  border-radius: 3px;
  margin-top: 80px;
  margin-left: 50%;
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

.modal-footer {
  display: flex;
  justify-content: space-between;
}

.modal-footer > .Save-btn {
  margin-right: 20px;
  background-color: blueviolet;
  color: white;
  border-color: black;
  width: 4rem;
  border: solid;
  border-radius: 4px;
}

/* Close button in the modal header */
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
}

/* Modal header */
.modal-header {
  padding: 10px 20px;
 
  color: white;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

/* Modal footer */
.modal-footer {
  padding: 10px 20px;
  background-color: #f3f3f3;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}


</style>

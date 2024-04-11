<script>
import { Meteor } from 'meteor/meteor';
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  data() {
    return {
      showModal: false,
      tags: '',
    };
  },
  methods: {
    addTag() {
      const trimmedTag = this.tags.trim();

      Meteor.call('tags.insert', { tags: trimmedTag });

      // Clear the input after saving
      this.tags = '';

      // Close the modal
      this.showModal = false;
    },
    closeModal() {
      this.showModal = false;
    },
    onKeyDown(event) {
      // Close the modal when the 'Escape' key is pressed
      if (event.key === 'Escape') {
        this.closeModal();
      }
    },
  },
  mounted() {
    // Attach key event listener when the component is mounted
    document.addEventListener('keydown', this.onKeyDown);
  },
  beforeUnmount() {
    // Remove key event listener before the component is destroyed
    document.removeEventListener('keydown', this.onKeyDown);
  },
};
</script>

<template>
  <div>
    <!-- Button to trigger the modal -->
    <button @click="showModal = true">Create Tags</button>

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
          <p>
            <input
              v-model="tags"
              class="border border-gray-300 rounded-md py-2 px-4 mr-2 text-gray-600 text-sm focus:outline-none focus:border-gray-400 focus:ring-0"
              type="text"
              placeholder="Tag"
            />
          </p>
        </div>

        <!-- Modal footer -->
        <div class="modal-footer">
          <button @click="closeModal">Cancel</button> <br />
          <button @click="addTag">Save</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Display Table -->

  <div>
      <h2>Tags Table</h2>
      <table>
        <thead>
          <tr>
            <th>Tag</th>
           
          </tr>
        </thead>
        <tbody>
          <tr v-for="tag in tags" :key="tag._id">
            <td>{{ tag.tags }}</td>
           
          </tr>
        </tbody>
      </table>
    </div>

</template>

<style scoped>
/* Your existing styles */
</style>

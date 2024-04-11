<template>
  <!-- Display Table -->
  <div class="tags-table">
    <h2>Tags </h2>
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Created</th>
          <th>Actions</th>

        </tr>
      </thead>
      <tbody>
        
        <tr v-for="tag in tags" :key="tag._id">
          <td>{{ tag.tags }}</td>
          <td>{{ tag.createdAt }}</td>
          <td>
            <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2" @click="updateTag(tag)">Update</button>

            <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2" @click="deleteTag(tag._id)"> Delete </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { Meteor } from 'meteor/meteor';
import { ref, onMounted } from 'vue';
import { subscribe, autorun } from 'vue-meteor-tracker';
import { TagsCollection } from '../../db/TagsCollection';

const tags = ref([]);

subscribe('tags');

onMounted(() => {
  autorun(() => {
    const userId = Meteor.userId();

    tags.value = TagsCollection.find({
      userId:userId
    }).fetch();
  });
});

const deleteTag = (tagId) => {
  Meteor.call('tags.remove', tagId, (error, result) => {
    if (error) {
      console.error(error);
    } else {
      // Remove the tag from the local array after successful removal
      tags.value = tags.value.filter(tag => tag._id !== tagId);
    }
  });
};

const updateTag = (tag) => {
  const updatedTags = prompt("Enter updated tags:", tag.tags);
  if (updatedTags !== null) { // Check if the user clicked cancel
    const updatedData = { tags: updatedTags };
    Meteor.call('tags.update', tag._id, updatedData, (error, result) => {
      if (error) {
        console.error(error);
      } else {
        // Update the tag in the local array after successful update
        const index = tags.value.findIndex(t => t._id === tag._id);
        if (index !== -1) {
          tags.value[index].tags = updatedData.tags;
        }
      }
    });
  }
};
</script>

<style scoped>
/* Your existing styles */

.tags-table{
  padding-top: 10rem;
  margin-left: 20%;
  border-color: black;

}

th, td {
  height: 1rem;
  text-align: left;
  width: 40rem;
  border-bottom: 1px solid #ddd;
}

.Action-btn{
  width: 4rem;
  border: solid;
  border-radius: 5px;
  border-color: purple;
  background-color: purple;
  font-weight: bold;
  color: white;
} 
</style>

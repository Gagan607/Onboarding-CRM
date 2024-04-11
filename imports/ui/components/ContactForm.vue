<script setup>
import { Meteor } from 'meteor/meteor';
import { ref, onMounted } from 'vue';
import ContactTable from '../tables/ContactTable.vue';
import { TagsCollection } from '../../db/TagsCollection';
import { subscribe,autorun } from 'vue-meteor-tracker';


const firstName = ref('');
const middleName = ref('');
const lastName = ref('');
const email = ref('');
const tags = ref([]); 
const selectedTag = ref('');


subscribe('tags');

onMounted(() => {
  autorun(() => {
    const userId = Meteor.userId();

    tags.value = TagsCollection.find({
      userId:userId
    }).fetch();
  });
});;

const addContact = () => {
  const trimmedFirstName = firstName.value.trim();
  const trimmedMiddleName = middleName.value.trim();
  const trimmedLastName = lastName.value.trim();
  const trimmedemail = email.value.trim();


  if (trimmedFirstName && trimmedLastName && trimmedemail) {
    Meteor.call('contacts.insert', { 
        firstName: trimmedFirstName, 
        middleName:trimmedMiddleName,
        lastName: trimmedLastName, 
        email: trimmedemail,
        tags: selectedTag.value
    
    });
        
    firstName.value = '';
    middleName.value = '';
    lastName.value = '';
    email.value = '';
    selectedTag.value = '';

  }
};

</script>

<template>
  <div class="contact-form">
    <h1>ContactForm</h1>

    <form @submit.prevent="addContact">
      <input
        v-model="firstName"
        class="border border-gray-300 rounded-md py-2 px-4 mr-2 text-gray-600 text-sm focus:outline-none focus:border-gray-400 focus:ring-0"
        type="text"
        placeholder="First Name"
      />
      <input
        v-model="middleName"
        class="border border-gray-300 rounded-md py-2 px-4 mr-2 text-gray-600 text-sm focus:outline-none focus:border-gray-400 focus:ring-0"
        type="text"
        placeholder="Midle Name"
      />
      <input
        v-model="lastName"
        class="border border-gray-300 rounded-md py-2 px-4 mr-2 text-gray-600 text-sm focus:outline-none focus:border-gray-400 focus:ring-0"
        type="text"
        placeholder="Last Name"
      />
      <input
        v-model="email"
        class="border border-gray-300 rounded-md py-2 px-4 mr-2 text-gray-600 text-sm focus:outline-none focus:border-gray-400 focus:ring-0"
        type="text"
        placeholder="Email"
      />
      <br/><br/>

      <!-- Dropdown field for tags -->
      <select v-model="selectedTag" class="border border-gray-300 rounded-md py-2 px-4 mr-2 text-gray-600 text-sm focus:outline-none focus:border-gray-400 focus:ring-0">
        <option value="" disabled>Select Tag</option>
        <option v-for="tag in tags" :key="tag._id" :value="tag.tags">{{ tag.tags }}</option>
      </select>
      <br/><br/>
      <button  id="Save-btn"  class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2"type="submit">
        Save
      </button>
    </form>
  </div>

<div class="contact-table">
  <ContactTable/>
</div>

</template>



<style>
#Save-btn{
  border: 1px solid;
  width: 4rem;
  margin-left: 2rem;
  margin-bottom: 2rem;
  font-weight: bold;
}
.contact-form{
  margin-top: 8rem; 
  margin-left: 25rem;
  border: 1px solid;
  width: 55rem;
  
}
.contatc-table{
  padding-top: 5rem;
  margin-left: 15%;
  border-color: black;
  

}
</style>
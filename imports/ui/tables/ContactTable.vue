<template>
  <div>
    <h2>Contact Table</h2>
    <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Middle Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Tags</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contact in contacts" :key="contact._id">
          <td>{{ contact.firstName }}</td>
          <td>{{ contact.middleName }}</td>
          <td>{{ contact.lastName }}</td>
          <td>{{ contact.email }}</td>
          <td>{{ contact.tags }}</td>

          <td>
            <button @click="updateContact(contact._id)"class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2">Update</button>
          </td>
          <td>
            <button @click="deleteContact(contact._id)"class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { subscribe, autorun } from 'vue-meteor-tracker';
import { ContactsCollection } from '../../db/ContactsCollection';

const contacts = ref([]);

subscribe('contacts');

onMounted(() => {
  autorun(() => {
    const userId = Meteor.userId();

    contacts.value = ContactsCollection.find({
      userId: userId
    }).fetch();
  });
});

const updateContact = (contactId) => {
  const contact = ContactsCollection.findOne(contactId);
  
  if (!contact) {
    console.error('Contact not found:', contactId);
    return;
  }

  const updatedData = {
    firstName: prompt('Enter updated first name:', contact.firstName),
    middleName: prompt('Enter updated middle name:', contact.middleName),
    lastName: prompt('Enter updated last name:', contact.lastName),
    email: prompt('Enter updated email:', contact.email),
  };

  if (Object.values(updatedData).some(val => val === null || val.trim() === '')) {
    return;
  }

  Meteor.call('contacts.update', contactId, updatedData, (error, result) => {
    if (error) {
      console.error('Failed to update contact:', error);
    } else {
      console.log('Contact updated successfully:', result);
    }
  });
};

const deleteContact = (contactId) => {
  if (!confirm('Are you sure you want to delete this contact?')) {
    return;
  }

  Meteor.call('contacts.remove', contactId, (error, result) => {
    if (error) {
      console.error('Failed to delete contact:', error);
    } else {
      console.log('Contact deleted successfully:', result);
    }
  });
};
</script>

<style scoped>
/* Add your table styling here if needed */
table {
  width: 75%;
  border-collapse: collapse;
  margin-top: 15px;
  margin-left: 20rem;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
</style>

<template>
    <div>
      <table>
        <thead>
          <tr>
            <th class="px-4 py-2">Organization Name</th>
            <th class="px-4 py-2">Email</th>
            <th class="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="organization in organizations" :key="organization._id">
            <td class="px-4 py-2">{{ organization.OrganizationName }}</td>
            <td class="px-4 py-2">{{ organization.email }}</td>
            <td class="px-4 py-2">
              <button @click="updateOrganization(organization._id)" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2">Update</button>
              <button @click="deleteOrganization(organization._id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { subscribe, autorun } from 'vue-meteor-tracker';
  import { OrganizationsCollection } from '../../db/OrganizationsCollection';
  
  const organizations = ref([]);
  
  subscribe('organizations');

  onMounted(() => {
    autorun(() => {
      organizations.value = OrganizationsCollection.find({}).fetch();
    });
    
  });
  
  const updateOrganization = (organizationId) => {
    const organization = OrganizationsCollection.findOne(organizationId);
  
  if (!organization) {
    console.error('Organization not found:', organizationId);
    return;
  }

  const updatedData = {
    OrganizationName: prompt('Enter updated organization name:', organization.OrganizationName),
    email: prompt('Enter updated email:', organization.email),
  };

  if (Object.values(updatedData).some(val => val === null || val.trim() === '')) {
    return;
  }

  Meteor.call('organizations.update', organizationId, updatedData, (error, result) => {
    if (error) {
      console.error('Failed to update organization:', error);
    } else {
      console.log('Organization updated successfully:', result);
    }
  });
    // Placeholder for update logic
    console.log('Update organization with ID:', organizationId);
  };
  
  const deleteOrganization = (organizationId) => {
    if (!confirm('Are you sure you want to delete this organization?')) {
    return;
  }

  Meteor.call('organizations.remove', organizationId, (error, result) => {
    if (error) {
      console.error('Failed to delete organization:', error);
    } else {
      console.log('Organization deleted successfully:', result);
    }
  });
    // Placeholder for delete logic
    console.log('Delete organization with ID:', organizationId);
  };
  </script>
  
  <style scoped>
table {
  padding-top: 10rem;
  margin-left: 20rem;
  border-color: black;
}

th, td {
  height: 1rem;
  text-align: left;
  width: 50rem;
  border-bottom: 1px solid #ddd;
}
  </style>
  
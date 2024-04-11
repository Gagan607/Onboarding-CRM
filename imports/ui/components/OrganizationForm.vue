<template>
    <div>
        <div>
            <button class="modal-btn" @click="openModal">Add Organizations</button>
        </div>
        <div class="modal" v-if="modalVisible" @click="closeModal">
            <div class="modal-content" @click.stop>
                <h1>Organizations Form</h1>
                <!-- Add your form elements here -->
                <form @submit.prevent="addOrganization">
                    <input
                        v-model="organizationName"
                        class="border border-gray-300 rounded-md py-2 px-4 mr-2 text-gray-600 text-sm focus:outline-none focus:border-gray-400 focus:ring-0"
                        type="text"
                        placeholder="Organization Name"
                    />
                    <br/><br/>

                    <input
                        v-model="email"
                        class="border border-gray-300 rounded-md py-2 px-4 mr-2 text-gray-600 text-sm focus:outline-none focus:border-gray-400 focus:ring-0"
                        type="text"
                        placeholder="Email"
                    />
                    <br/><br/>
                    <button id="Save-btn" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2"type="submit">
                        Save
                    </button>
                    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2" @click="closeModal">Cancel</button>

                </form>
            </div>
        </div>
        <div class="organization-table">
            <!-- Include the OrganizationsTable component -->
            <OrganizationsTable />
        </div>
    </div>
</template>

<script>
import { Meteor } from 'meteor/meteor';
import { ref } from 'vue';
import { OrganizationsCollection } from '../../db/OrganizationsCollection';
import OrganizationsTable from '../tables/OrganizationsTable.vue'; // Import the OrganizationsTable component

export default {
  data() {
    return {
      modalVisible: false,
      organizationName: '',
      email: ''
    };
  },
  methods: {
    openModal() {
      this.modalVisible = true;
    },
    closeModal() {
      this.modalVisible = false;
    },
    addOrganization() {
      const trimmedOrganizationName = this.organizationName.trim();
      const trimmedEmail = this.email.trim();

      if (trimmedOrganizationName && trimmedEmail) {
        Meteor.call('organizations.insert', { 
          OrganizationName: trimmedOrganizationName, 
          email: trimmedEmail,
        }, (error) => {
          if (error) {
            console.error('Failed to add organization:', error);
            // Handle error, show a message to the user, etc.
          } else {
            this.organizationName = '';
            this.email = '';
            this.closeModal();
          }
        });
      } else {
        // Handle form validation error, show a message to the user, etc.
      }
    }
  },
  components: {
    OrganizationsTable ,
  
  }
};
</script>

<style scoped>
.modal-btn{
  border-radius: 3px;
  margin-top: 8rem; /* Adjust margin top */
  margin-left: 45rem;
  padding: 10px;
  background-color: purple;
  color: white;
  font-weight: bold;
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
.modal-content{
  margin-left: 10rem;
  width: 400px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); /* Shadow for depth */
}
.organization-table{
  margin-top: 5rem;
}
</style>

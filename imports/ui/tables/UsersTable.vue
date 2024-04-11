<template>
  <div>
    <div class="modal-btn">
      <button @click="openModal">Add Users</button>
    </div>

    <div class="modal-overlay" v-if="modalVisible" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="registration-container">
          <form @submit.prevent="addUser" class="registration-form">
            <div class="form-group">
              <label for="first-name" class="input-label">First Name</label>
              <input v-model="firstName" class="input-field" type="text" required />
            </div>
            <div class="form-group">
              <label for="middle-name" class="input-label">Middle Name</label>
              <input v-model="middleName" class="input-field" type="text" />
            </div>
            <div class="form-group">
              <label for="last-name" class="input-label">Last Name</label>
              <input v-model="lastName" class="input-field" type="text" />
            </div>
            <div class="form-group">
              <label for="email" class="input-label">Email</label>
              <input v-model="email" class="input-field" type="email" required />
            </div>
            <div class="form-group">
              <label for="password" class="input-label">Password</label>
              <input v-model="password" class="input-field" type="password" required minlength="8" />
            </div>
            <div class="form-group">
              <label for="rePassword" class="input-label">Re-enter Password</label>
              <input v-model="rePassword" class="input-field" type="password" required minlength="8" />
            </div>
            <div class="form-group">
              <label for="role" class="input-label">Role</label>
              <select v-model="selectedRole" class="input-field">
                <option value="" disabled>Select Role</option>
                <option value="manager">Manager</option>
                <option value="coordinator">Coordinator</option>
              </select>
            </div>
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
            <button @click="closeModal" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
          </form>
        </div>
      </div>
    </div>

    <div class="users-table" v-if="currentUser && currentUser.profile && currentUser.profile.role === 'keelaAdmin'">
      <h2 class="text-2xl font-bold mb-4">Users</h2>
      <table class="w-full">
        <thead>
          <tr>
            <th class="px-4 py-2">Name</th>
            <th class="px-4 py-2">Email</th>
            <th class="px-4 py-2">Organization</th>
            <th class="px-4 py-2">Role</th>
            <th class="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td class="px-4 py-2">{{ user.profile.firstName }} {{ user.profile.lastName }}</td>
            <td class="px-4 py-2">{{ user.emails[0].address }}</td>
            <td class="px-4 py-2">{{ user.profile.organizationName }}</td>
            <td class="px-4 py-2">{{ user.profile.role }}</td>
            <td class="px-4 py-2">
              <button @click="updateUser(user)" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2">Update</button>
              <button @click="deleteUser(user._id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p class="m-28">You are not authorized to view this table.</p>
    </div>
  </div>
</template>

<script>
import { Meteor } from 'meteor/meteor';
import { ref, onMounted } from 'vue';
import { Tracker } from 'meteor/tracker';

export default {
  setup() {
    const users = ref([]);
    const currentUser = ref(null);
    const modalVisible = ref(false);
    const firstName = ref('');
    const middleName = ref('');
    const lastName = ref('');
    const email = ref('');
    const password = ref('');
    const rePassword = ref('');
    const selectedRole = ref('manager'); // Default selected role

    const addUser = () => {
      const trimmedFirstName = firstName.value.trim();
      const trimmedMiddleName = middleName.value.trim();
      const trimmedLastName = lastName.value.trim();
      const trimmedEmail = email.value.trim();
      const trimmedPassword = password.value.trim();
      const trimmedRePassword = rePassword.value.trim();
      const trimmedSelectedRole = selectedRole.value.trim();
  
      if (trimmedFirstName && trimmedLastName && trimmedEmail) {
        Meteor.call('registers.insert', {
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          middleName: trimmedMiddleName,
          email: trimmedEmail,
          password: trimmedPassword,
          rePassword: trimmedRePassword,
          selectedRole: trimmedSelectedRole
        });
  
        // Clear input fields after submission
        firstName.value = '';
        middleName.value = '';
        lastName.value = '';
        email.value = '';
        password.value = '';
        rePassword.value = '';
        // Reset selected role to default
        selectedRole.value = 'manager';
  
        // Optionally, you can close the modal after submission
        closeModal();
      }
    };

    const deleteUser = (userId) => {
      if (!confirm('Are you sure you want to delete this user?')) {
        return;
      }

      Meteor.call('users.remove', userId, (error, result) => {
        if (error) {
          console.error('Failed to delete user:', error);
        } else {
          console.log('User deleted successfully:', result);
        }
      });
    };

    const updateUser = (user) => {
      const updatedData = {
        firstName: prompt('Enter updated first name:', user.profile.firstName) || user.profile.firstName,
        middleName: prompt('Enter updated middle name:', user.profile.middleName) || user.profile.middleName,
        lastName: prompt('Enter updated last name:', user.profile.lastName) || user.profile.lastName,
        email: prompt('Enter updated email:', user.emails[0].address) || user.emails[0].address,
      };

      Meteor.call('registers.update', user._id, updatedData, (error, result) => {
        if (error) {
          console.error('Error updating user:', error);
        } else {
          console.log('User updated successfully:', result);
          // Update local user data
          const updatedUser = { ...user };
          updatedUser.profile.firstName = updatedData.firstName;
          updatedUser.profile.middleName = updatedData.middleName;
          updatedUser.profile.lastName = updatedData.lastName;
          updatedUser.emails[0].address = updatedData.email;

          // Update the user in the local users array
          const index = users.value.findIndex(u => u._id === user._id);
          if (index !== -1) {
            users.value.splice(index, 1, updatedUser);
          }
        }
      });
    };

    const openModal = () => {
      modalVisible.value = true;
    };

    const closeModal = () => {
      modalVisible.value = false;
    };

    onMounted(() => {
      const handle = Meteor.subscribe('users');
      Tracker.autorun(() => {
        if (handle.ready()) {
          users.value = Meteor.users.find().fetch();
          currentUser.value = Meteor.user(); // Set currentUser value
        }
      });
    });

    return {
      users,
      currentUser,
      addUser,
      deleteUser,
      updateUser,
      modalVisible,
      openModal,
      closeModal,
      firstName,
      middleName,
      lastName,
      email,
      password,
      rePassword,
      selectedRole
    };
  }
};
</script>



<style scoped>
.registration-form {
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
}

.input-field {
  width: 100%;
  padding: 1px;
  border: solid #ced4da;
  border-radius: 6px;
  font-size: 16px;
  color: #495057;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #007bff;
}

.users-table {
  padding-top: 10rem;
  margin-left: 20%;
  border-color: black;
}

th,
td {
  border-bottom: 1px solid #ddd;
}
</style>

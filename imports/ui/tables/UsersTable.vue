<template>
  <div>
    <div>
      <button class="modal-btn" @click="openModal">Add Users</button>
    </div>

    <div class="modal" v-if="modalVisible" @click="closeModal">
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
            <button type="submit" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">Submit</button>
            <button @click="closeModal" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
          </form>
        </div>
      </div>
    </div>

    <div class="users-table" v-if="currentUser && currentUser.profile && currentUser.profile.role === 'keelaAdmin'">
      <h2 class="text-2xl font-bold mb-4">Users</h2>
      <table class="w-full">
        <thead>
          <tr>
            <th >Name</th>
            <th >Email</th>
            <th>Organization</th>
            <th >Role</th>
            <th >Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td >{{ user.profile.firstName }} {{ user.profile.lastName }}</td>
            <td >{{ user.emails[0].address }}</td>
            <td >{{ user.profile.organizationName }}</td>
            <td >{{ user.profile.role }}</td>
            <td >
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
    const selectedRole = ref(''); 

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
.modal-btn {
  border-radius: 3px;
  margin-top: 8rem; 
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
  align-items: left;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  z-index: 1000;
}

.modal-content {
  height: 1%;
  width: 30%;
  margin-top: 1rem;
  margin-left: 10rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.registration-form {
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px; 
  margin: 0 auto; /* Center the form horizontally */
}

.form-group {
  margin-bottom: 4px; /* Adjust spacing between form groups */
}

.input-label {
  display: block;
  font-weight: bold;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 16px;
  color: #495057;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #007bff;
}

select.input-field {
  width: calc(100% - 22px); /* Adjust select width */
}

.btn-container {
  display: flex;
  justify-content: space-between;
}

.btn-container button {
  flex: 1;
  margin-right: 10px; /* Adjust spacing between buttons */
}

table {
  padding-top: 10rem;
  margin-left: 20rem;
  border-color: black;
}

th, td {
  height: 1rem;
  text-align: left;
  width: 3rem;
  border-bottom: 1px solid #ddd;
}
</style>



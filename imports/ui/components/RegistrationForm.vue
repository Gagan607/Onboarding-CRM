<template>
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
  
        <button id="Submit-btn" type="submit">Submit</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { Meteor } from 'meteor/meteor';
  import { useRouter } from 'vue-router'
  
  const router = useRouter();
  
  const firstName = ref('');
  const middleName = ref('');
  const lastName = ref('');
  const email = ref('');
  const password = ref('');
  const rePassword = ref('');
  const selectedRole = ref('');
  const userId = Meteor.userId();
  
  const addUser = () => {
    console.log('addUser function called');
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
  
      firstName.value = '';
      middleName.value = '';
      lastName.value = '';
      email.value = '';
      password.value = '';
      rePassword.value = '';
      selectedRole.value = 'manager';
  
      router.push('/login');
    }
  };
  </script>
  
  <style scoped>
  .registration-container {
    max-width: 400px;
    margin: 0 auto;
  }
  
  .registration-form {
    background-color: #f8f9fa;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .input-label {
    display: block;
    font-weight: bold;
    margin-bottom: 8px;
    color: #495057;
  }
  
  .input-field {
    width: 100%;
    padding: 12px;
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
  
  #Submit-btn {
    padding: 14px 28px;
    border: none;
    border-radius: 6px;
    background-color: #007bff;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  #Submit-btn:hover {
    background-color: #0056b3;
  }
  </style>
  
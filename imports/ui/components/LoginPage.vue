<template>
    <div class="logo">
      <img id="keela-logo" src="keela-logo-2.png" alt="logo">
    </div>
    <form @submit.prevent="loginUser">
      <div class="container">
        <div class="form-component">  
          <label for="email" style="color:#999;font-family: Roboto,sans-serif;font-size: 12px;font-weight: bold;">EMAIL</label> 
          <br/>
          <input v-model="email" class="email" id="email" type="text" required/>
          <br/><br/>
          <label for="password" style="color: #999;font-family: Roboto,sans-serif;font-size: 12px;font-weight: bold;">PASSWORD</label>
          <br/>
          <input v-model="password" class="password" id="password" type="password" required/>
          <br/><br/>
          <button id="login-btn">Login</button>
          <div v-if="error" class="error">{{ error }}</div>
          <div class="register">
            <!-- navigate to Registration Page -->
            <router-link to="/register">Register here</router-link> 
          </div>
        </div>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { Meteor } from 'meteor/meteor';
  import { useRouter } from 'vue-router';
  
  const email = ref('');
  const password = ref('');
  const error = ref('');
  
  const router = useRouter();
  
  const loginUser = () => {
    const trimmedEmail = email.value.trim();
    const trimmedPassword = password.value.trim();
  
    if (trimmedEmail && trimmedPassword) {
      Meteor.loginWithPassword(trimmedEmail, trimmedPassword, (error) => {
        if (error) {
          console.error('Login failed:', error.reason || error.message);
          error.value = 'Login failed. Please try again.';
        } else {
          console.log('Login successful');
          router.push('/dashboard'); // Redirect to dashboard after successful login
        }
      });
    } else {
      error.value = 'Please provide email and password';
    }
  };
  </script>
  
  <style scoped>
  #keela-logo {
    height: 30px;
    margin-bottom: 1.25rem;
    margin-top: 1rem;
    margin-left: 8rem;
  }
  
  .container {
    border: 1px solid;
    border-color: gray;
    border-radius: 4px;
    height: 345px;
    margin-top: 5%;
    margin-left: 30%;
    width: 500px;
  }
  
  .form-component {
    margin-top: 100px;
    align-content: center;
    margin-left: 35px;
  }
  
  .email, .password {
    border: 1px solid;
    border-color: grey;
    margin-top: 8px;
    height: 25px;
    width: 425px;
  }
  
  #login-btn {
    margin-left: 15%;
    border-style: solid;
    border-color: blueviolet;
    background-color: blueviolet;
    color: white;
    height: 40px;
    width: 300px;
    border-radius: 5px;
    font-family: Roboto,sans-serif;
    font-size: 1rem;
    font-weight: bold;
  }
  
  .error {
    color: red;
  }
  </style>
  
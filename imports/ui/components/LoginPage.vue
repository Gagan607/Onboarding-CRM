<template>
  <div class="login-container">
    <div class="logo">
      <img id="keela-logo" src="keela-logo-2.png" alt="logo">
    </div>
    <form @submit.prevent="loginUser" class="login-form">
      <div class="form-component">  
        <label for="email">Email</label> 
        <input v-model="email" class="email" id="email" type="email" placeholder="Enter your email" required/>
        <label for="password">Password</label>
        <input v-model="password" class="password" id="password" type="password" placeholder="Enter your password" required/>
        <button id="login-btn">Login</button>
        <div v-if="error" class="error">{{ error }}</div>
        <div class="register">
          <!-- navigate to Registration Page -->
          <router-link to="/register">Register here</router-link> 
        </div>
      </div>
    </form>
  </div>
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
    Meteor.loginWithPassword(trimmedEmail, trimmedPassword, (err) => {
      if (err) {
        console.error('Login failed:', err.reason || err.message);
        error.value = 'Login failed. Please try again.';
      } else {
        console.log('Login successful');
        router.push('/dashboard'); 
      }
    });
  } else {
    error.value = 'Please provide email and password';
  }
};

</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.logo {
  text-align: center;
}

#keela-logo {
  height: 100px;
}

.login-form {
  background-color: #fcfcfc;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-component {
  margin-left: 2px;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: blueviolet;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

#login-btn{
  margin-top: 8px;
  height: 40px;
}

.error {
  color: red;
  margin-top: 10px;
}

.register {
  text-align: center;
  margin-top: 10px;
}

.register a {
  color: blue;
}
</style>

<template>
  <div>
    <div class="content">    
      <h1 v-if="currentUser">Welcome, {{ currentUser.profile.firstName }} {{ currentUser.profile.lastName }}</h1>
      <h1 v-if="currentUser">Organization : {{ currentUser.profile.organizationName }} </h1>

    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { Meteor } from 'meteor/meteor';
import { ref, onMounted } from 'vue';
import { Tracker } from 'meteor/tracker';

export default {
  setup() {
    const currentUser = ref(null); // Use ref to store the current user

    onMounted(() => {
      const handle = Meteor.subscribe('users'); // Assuming 'userData' is the publication name
      Tracker.autorun(() => {
        if (handle.ready()) {
          currentUser.value = Meteor.user(); // Set the current user when subscription is ready
        }
      });
    });

    return {
      currentUser
    };
  }
};
</script>

<style>
.content {
  margin-top: 20%;
  margin-left: 50%; 
}
</style>

import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './components/LoginPage.vue'
import Tags from './components/Tags.vue'
import RegistrationForm from './components/RegistrationForm.vue'
import ContactForm from './components/ContactForm.vue'
import Dashboard from './components/Dashboard.vue'
import Layout from './components/Layout.vue'
import Users from './tables/UsersTable.vue'
import Organizations from './components/OrganizationForm.vue'
import App from './App.vue'

import OrganizationsTable from './tables/OrganizationsTable.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [

    {
      path: '/register',
      name: 'register',
      component: RegistrationForm,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
  
    {
      path: '/',
      component: Layout,
      children:[
        {
          path:'',
          name:'home',
          component:App,
          meta: {
            requiresAuth: true
          }
        },
        {
          path:'/dashboard',
          name:'dashboard',
          component:Dashboard,
          meta: {
            requiresAuth: true
          }
        },
        {
          path:'/contacts',
          name:'contacts',
          component:ContactForm,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/tags',
          name: 'tags',
          component: Tags, // Use the layout component for the root route
          meta: {
            requiresAuth: true
          }
        
        },
        {
          path: '/users',
          name: 'users',
          component: Users, // Use the layout component for the root route
          meta: {
            requiresAuth: true
          }
        
        },
        {
          path: '/organizations',
          name: 'organizations',
          component: Organizations, // Use the layout component for the root route
          meta: {
            requiresAuth: true
          }
        
        },


      ]
    },

    
  
  ]
})

router.beforeEach((to, from, next) => {
  const loggedIn = Meteor.userId();

  if (to.meta.requiresAuth && !loggedIn) {
    next('/login'); // Redirect to login page if route requires authentication and user is not logged in
  } else {
    next(); // Proceed to the next route
  }
});

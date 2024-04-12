import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Accounts } from 'meteor/accounts-base';
import { UsersCollection } from "../db/UsersCollection";

Meteor.methods({
  'registers.insert'(data) {
    // Validate input fields
    check(data.firstName, String);
    check(data.middleName, String);
    check(data.lastName, String);
    check(data.email, String);
    check(data.password, String);
    check(data.rePassword, String);
    check(data.selectedRole, String);


    // Create the user
    const userId = Accounts.createUser({
      username: data.email, // Set username as email
      email: data.email,
      password: data.password,
      profile: {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        role:data.selectedRole
      },
    });

    if (userId) {
      console.log('User created successfully');
    } else {
      throw new Meteor.Error('user-creation-failed', 'Failed to create user');
    }
  },

  'registers.update'(userId, updatedData) {
    // Validate input parameters
    check(userId, String);
    check(updatedData, {
      firstName: String,
      middleName: String,
      lastName: String,
      email: String,
      // role: String
      
      
    });

    try {
      // Update the user profile
      Meteor.users.update(userId, { 
        $set: {
          'profile.firstName': updatedData.firstName,
          'profile.middleName': updatedData.middleName,
          'profile.lastName': updatedData.lastName,
          'emails.0.address': updatedData.email, 
          'profile.role': updatedData.selectedRole
        }
      });
      return { success: true, message: 'User updated successfully' };
    } catch (error) {
      throw new Meteor.Error('update-failed', 'Failed to update user', error.message);
    }
  },

  'users.remove'(userId) {
    // Ensure the user is logged in and has permission to remove users
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to remove users');
    }
  
    // Check if the user to be removed is the current user
    if (userId === this.userId) {
      throw new Meteor.Error('not-allowed', 'You cannot remove your own account');
    }
    
    // Retrieve the user to be removed
    const userToRemove = Meteor.users.findOne(userId);
  
    // Check if the user to be removed is the keelaAdmin
    if (userToRemove && userToRemove.emails[0].address === 'keelaadmin@keela.com') {
      throw new Meteor.Error('not-allowed', 'The keelaAdmin account cannot be deleted');
    }
  
    // Perform role-based access control here if needed
  
    // Remove the user
    Meteor.users.remove(userId);
  
    console.log('User removed successfully');
  }
});

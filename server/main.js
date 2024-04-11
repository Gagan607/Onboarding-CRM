import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Importing collections
import { ContactsCollection } from '../imports/db/ContactsCollection';
import { TagsCollection } from '../imports/db/TagsCollection';
import { UsersCollection } from '../imports/db/UsersCollection';
import { OrganizationsCollection } from '../imports/db/OrganizationsCollection';

// Importing methods for API interaction
import '../imports/api/contatcsMethods';
import '../imports/api/TagsMethods';
import '../imports/api/usersMethods';
import '../imports/api/organizationsMethods';

Meteor.startup(() => {
  if (!Accounts.findUserByEmail('admin@keela.com')) {
    Accounts.createUser({
      email: 'admin@keela.com',
      password: 'admin',
      profile: {
        firstName: 'Keela',
        lastName: 'Admin',
            role: 'keelaAdmin',
            organizationId: '009',
            organizationName: 'KEELA'
      },
    });
  }

})


Meteor.methods({
  'loginUser'(email, password) {
    try {
      // Attempt to log in the user with the provided email and password
      const loggedIn = Meteor.loginWithPassword(email, password);

      if (loggedIn) {
        return { success: true };
      } else {
        return { success: false, message: 'Incorrect email or password' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
});
// Publish collections to the client for data access
Meteor.publish('registers', function () {
  return UsersCollection.find();
});

Meteor.publish('contacts', function () {
  return ContactsCollection.find();
});

Meteor.publish('tags', function () {
  return TagsCollection.find();
});

Meteor.publish('users', function () {
  return Meteor.users.find({});
});

Meteor.publish('organizations',function () {
  return OrganizationsCollection.find();
});

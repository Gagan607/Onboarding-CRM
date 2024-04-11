import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { ContactsCollection } from "../db/ContactsCollection";

Meteor.methods({
    'contacts.insert'(data) {
        check(data.firstName, String);
        check(data.lastName, String);
        check(data.middleName, String);
        check(data.email, String);
        check(data.tags,String)
   
        ContactsCollection.insert({
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            email: data.email,
            tags: data.tags,
            createdAt: new Date(),
            userId: this.userId,
        });
    },

    'contacts.update'(contactId, updatedData) {
        // Validate input parameters
        check(contactId, String);
        check(updatedData, {
            firstName: String,
            middleName: String,
            lastName: String,
            email: String,
            // tags: String
        });
  
        try {
            // Update the contact
            ContactsCollection.update(contactId, {
                $set: updatedData,
            });
            return { success: true, message: 'Contact updated successfully' };
        } catch (error) {
            throw new Meteor.Error('update-failed', 'Failed to update contact', error.message);
        }
    },

    'contacts.remove'(contactId) {
        check(contactId, String);

        try {
            // Remove the contact
            ContactsCollection.remove(contactId);
            return { success: true, message: 'Contact removed successfully' };
        } catch (error) {
            throw new Meteor.Error('remove-failed', 'Failed to remove contact', error.message);
        }
    }
});
  
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { OrganizationsCollection } from "../db/OrganizationsCollection";

Meteor.methods({
    'organizations.insert'(data) {
        check(data.OrganizationName, String);
        check(data.email, String);

   
        OrganizationsCollection.insert({
            OrganizationName: data.OrganizationName,
            email: data.email,
            createdAt: new Date(),
            userId: this.userId,
        });
    },

    'organizations.update'(organizationsId, updatedData) {
        // Validate input parameters
        check(organizationsId, String);
        check(updatedData, {
            OrganizationName: String,
            email: String,
           
        });
  
        try {
            // Update the contact
            OrganizationsCollection.update(organizationsId, {
                $set: updatedData,
            });
            return { success: true, message: 'Organization updated successfully' };
        } catch (error) {
            throw new Meteor.Error('update-failed', 'Failed to update organization', error.message);
        }
    },

    'organizations.remove'(organizationId) {
        check(organizationId, String);

        try {
            // Remove the contact
            OrganizationsCollection.remove(organizationId);
            return { success: true, message: 'Organization removed successfully' };
        } catch (error) {
            throw new Meteor.Error('remove-failed', 'Failed to remove organization', error.message);
        }
    }
});
  
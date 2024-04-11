import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { TagsCollection } from "../db/TagsCollection";



Meteor.methods({
    'tags.insert'(data) {
      const userId = Meteor.userId();
      
      check(data.tags, String);

      TagsCollection.insert({
        tags: data.tags,
        createdAt: new Date(),
        userId: userId,
      });
      
    },
    'tags.getAll'() {
      return TagsCollection.find().fetch();
     },
     
    'tags.remove'(tagId) {
      const tag = TagsCollection.findOne(tagId);
  
      if (!tag) {
        throw new Meteor.Error('not-found', 'Tag not found');
      }
  
      TagsCollection.remove(tagId);
      return 'Tag deleted successfully';
    },
    
    'tags.update'(tagId, updatedData) {
      check(tagId, String);
      check(updatedData, { tags: String });
  
      const tag = TagsCollection.findOne(tagId);
  
      if (!tag) {
        throw new Meteor.Error('not-found', 'Tag not found');
      }
  
      try {
        TagsCollection.update(tagId, {
          $set: {
            tags: updatedData.tags,
            updatedAt: new Date(),
          },
        });
  
        return { success: true, message: 'Tag updated successfully' };
      } catch (error) {
        throw new Meteor.Error('update-failed', 'Failed to update tag');
      }
    }
});

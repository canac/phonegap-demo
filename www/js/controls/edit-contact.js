define(function(require) {
  'use strict';

  var can = require('can');
  var Navigator = require('navigator');

  var models = require('models');
  return can.Control.extend('EditContact', {
    // Initialize the control
    init: function(element) {
      // This data will be available to the template
      this.scope = new can.Map({
        contact: null
      });

      // Render the control using the contact and insert it into the control's DOM element
      var fragment = can.view('edit-contact', this.scope);
      this.element.html(fragment);
    },

    /*
     * Revert all changes made to the contact and stop editing the contact.
     */
    revertContact: function() {
      this.getContact().restore();
    },

    /*
     * Save all changes made to the contact and stop editing the contact.
     */
    saveContact: function() {
      var contact = this.getContact();
      if (contact.isNew() || contact.isDirty()) {
        contact.save();
      }
    },

    /*
     * Return the contact that is currently being edited.
     */
    getContact: function() {
      return this.scope.attr('contact');
    },
    /*
     * Set the contact that is being edited to the provided contact model
     */
    setContact: function(contact) {
      this.scope.attr('contact', contact);
    },

    /*
     * Respond to control events.
     */
    '.save click': function() {
      this.saveContact();
      Navigator.openParentPage();

      // Prevent the default submit behavior
      return false;
    },
    '.cancel click': function() {
      this.revertContact();
      Navigator.openParentPage();
    },

    /*
     * Listen for changes to the route's "contactId" attribute.
     */
    '{can.route} contactId': function(route, event, contactId) {
      if (Navigator.getOpenPage() !== 'contact') {
        // Ignore since this page is not open
        return;
      }

      var contact = null;
      if (contactId === 'new') {
        // Create a new contact to edit
        contact = new models.Contact();
      }
      else {
        // Lookup the contact in the global list by its contact
        contact = models.Contact.store[contactId];
        if (contact) {
          // Save a copy of the contact's attributes so that it can be reverted later if necessary
          contact.backup();
        }
        else {
          // No contact has that contactId
          console.error('Attempting to navigate to a non-existent contact!');
          Navigator.openParentPage();
        }
      }
      this.setContact(contact);
    }
  });
});

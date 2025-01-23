const express = require('express');
const Contact = require('../models/contacts');

const ContactsController = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};

async function listContacts(ownerId) {
  try {
    const data = await Contact.find({ owner: ownerId });
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function getContactById(contactId) {
  try {
    const contact = await Contact.findById(contactId);
    return contact || null;
  } catch (error) {
    console.error(error);
  }
}

async function removeContact(contactId) {
  try {
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    return deletedContact;
  } catch (error) {
    console.error(error);
  }
}

async function addContact(body, user) {
  try {
    const { name, email, phone } = body;
    const { _id: owner } = user;
    const newContact = await Contact.create({ name, email, phone, owner });
    return newContact;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateContact(contactId, body) {
  try {
    const updateContact = await Contact.findByIdAndUpdate(contactId, body);
    return updateContact;
  } catch (error) {
    console.error(error);
  }
}
async function updateStatusContact(contactId, body) {
  try {
    if (!('favorite' in body)) {
      throw new Error('Missing field favorite');
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite: body.favorite },
      { new: true }
    );

    return updatedContact;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = ContactsController;

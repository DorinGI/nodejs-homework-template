const express = require('express');
const Joi = require('joi');
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require('../../models/contacts');

const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9-]+$/)
    .required(),
});

router.get('/', async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
  // res.json({ message: 'template message' });
});

router.get('/:contactId', async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);
  if (!contact) return res.status(404).json({ message: 'Not found' });
  res.status(200).json(contact);
  // res.json({ message: 'template message' });
});

router.post('/', async (req, res, next) => {
  const { error } = contactSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
  // res.json({ message: 'template message' });
});

router.delete('/:contactId', async (req, res, next) => {
  const result = await removeContact(req.params.contactId);
  if (!result) return res.status(404).json({ message: 'Not found' });
  res.status(200).json({ message: 'contact deleted' });
  // res.json({ message: 'template message' });
});

router.put('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const updates = req.body;

  if (!Object.keys(updates).length) {
    return res.status(400).json({ message: 'missing fields' });
  }

  const updatedContact = await updateContact(contactId, updates);
  if (!updatedContact) return res.status(404).json({ message: 'Not found' });

  res.status(200).json(updatedContact);
  // res.json({ message: 'template message' });
});

module.exports = router;

const express = require('express');
const Joi = require('joi');
const auth = require('../../middlewares/auth');
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require('../../controller/contactsController');

const router = express.Router();
router.use(auth);

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9-]+$/)
    .required(),
});

const favoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res
      .status(200)
      .json({ message: 'Contacts list succesfully returned.', data: contacts });
  } catch (error) {
    console.error(error);
  }
});
router.get('/', auth, async (req, res) => {
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  const filter = { owner: req.user._id };
  if (favorite) {
    filter.favorite = favorite === 'true';
  }

  const contacts = await Contact.find(filter).skip(skip).limit(Number(limit));
  res.status(200).json({ data: contacts });
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (!contact) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Contact found by ID', data: contact });
  } catch (error) {
    console.error(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const newContact = await addContact(req.body, req.user);
    res.status(201).json({ message: 'New Contact created', data: newContact });
  } catch (error) {
    console.error(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const result = await removeContact(req.params.contactId);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.status(204).json({ message: `The contact was deleted` });
  } catch (error) {
    console.error(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updates = req.body;

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: 'missing fields' });
    }

    const updatedContact = await updateContact(contactId, updates);
    if (!updatedContact) return res.status(404).json({ message: 'Not found' });

    res.status(200).json({
      message: `The contact was updated`,
      data: updatedContact,
    });
  } catch (error) {
    console.error(error);
  }
});
router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const { error } = favoriteSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'missing field favorite' });
    }

    const updatedContact = await updateStatusContact(contactId, req.body);

    if (!updatedContact) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.status(200).json({
      message: 'Contact favorite status updated',
      data: updatedContact,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;

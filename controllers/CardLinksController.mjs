import { Router } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middleware/auth'; // Middleware to verify JWT
import CardLink, { find, findById } from '../models/CardLink'; // CardLink Mongoose Model
require('dotenv').config();

const router = Router();

// GET: api/card-links
router.get('/', verifyToken, async (req, res) => {
    try {
        const cardLinks = await find();
        res.status(200).json(cardLinks);
    } catch (error) {
        console.error('Error occurred while fetching card links:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET: api/card-links/:id
router.get('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const cardLink = await findById(id);
        if (!cardLink) {
            return res.status(404).json({ message: 'CardLink not found' });
        }
        res.status(200).json(cardLink);
    } catch (error) {
        console.error('Error occurred while fetching the card link:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST: api/card-links
router.post('/', verifyToken, async (req, res) => {
    const cardLinkData = req.body;

    try {
        const cardLink = new CardLink(cardLinkData);
        await cardLink.save();
        res.status(201).json(cardLink);
    } catch (error) {
        console.error('Error occurred while creating the card link:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT: api/card-links/:id
router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const cardLink = await findById(id);
        if (!cardLink) {
            return res.status(404).json({ message: 'CardLink not found' });
        }

        // Update the cardLink with new data
        Object.assign(cardLink, updatedData);
        await cardLink.save();

        res.status(200).json(cardLink);
    } catch (error) {
        console.error('Error occurred while updating the card link:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE: api/card-links/:id
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const cardLink = await findById(id);
        if (!cardLink) {
            return res.status(404).json({ message: 'CardLink not found' });
        }

        await cardLink.remove();
        res.status(204).send();
    } catch (error) {
        console.error('Error occurred while deleting the card link:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;

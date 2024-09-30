// controllers/cardLinkController.mjs

import CardLink from '../mongoose/schemas/CardLink.mjs';

// Get all card links
export const getCardLinks = async (req, res) => {
    try {
        const cardLinks = await CardLink.find();
        res.status(200).json(cardLinks);
    } catch (error) {
        console.error('Error occurred while fetching card links:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a specific card link by ID
export const getCardLinkById = async (req, res) => {
    const { id } = req.params;
    try {
        const cardLink = await CardLink.findById(id);
        if (!cardLink) {
            return res.status(404).json({ message: 'CardLink not found' });
        }
        res.status(200).json(cardLink);
    } catch (error) {
        console.error('Error occurred while fetching the card link:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create a new card link
export const createCardLink = async (req, res) => {
    const cardLinkData = req.body;

    try {
        const cardLink = new CardLink(cardLinkData);
        await cardLink.save();
        res.status(201).json(cardLink);
    } catch (error) {
        console.error('Error occurred while creating the card link:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update an existing card link by ID
export const updateCardLink = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const cardLink = await CardLink.findById(id);
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
};

// Delete a card link by ID
export const deleteCardLink = async (req, res) => {
    const { id } = req.params;

    try {
        const cardLink = await CardLink.findById(id);
        if (!cardLink) {
            return res.status(404).json({ message: 'CardLink not found' });
        }

        await cardLink.remove();
        res.status(204).send();
    } catch (error) {
        console.error('Error occurred while deleting the card link:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

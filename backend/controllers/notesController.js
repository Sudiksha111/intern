const Note = require('../models/Note');
const Tenant = require('../models/Tenant');

const NOTE_LIMIT_FREE_PLAN = 3;

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user._id;
  const tenantId = req.user.tenant._id;

  try {
    // Check subscription plan for note limit
    const tenant = await Tenant.findById(tenantId);
    if (tenant.plan === 'free') {
      const noteCount = await Note.countDocuments({ tenant: tenantId });
      if (noteCount >= NOTE_LIMIT_FREE_PLAN) {
        return res.status(403).json({
          message: 'Note limit reached. Please upgrade to the Pro plan to create more notes.',
        });
      }
    }
    console.log('✅ SENDING DATA TO FRONTEND:', notes);

    const note = new Note({
      title,
      content,
      user: userId,
      tenant: tenantId,
    });

    const createdNote = await note.save();
    res.status(201).json(createdNote);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all notes for the logged-in user's tenant
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
    // Tenant isolation is enforced by filtering notes by the user's tenant ID
    const notes = await Note.find({ tenant: req.user.tenant._id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single note by ID
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (note) {
      // Enforce tenant isolation
      if (note.tenant.toString() !== req.user.tenant._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: You do not have access to this note.' });
      }
      res.json(note);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  const { title, content } = req.body;

  try {
    const note = await Note.findById(req.params.id);

    if (note) {
       // Enforce tenant isolation
      if (note.tenant.toString() !== req.user.tenant._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: You cannot edit this note.' });
      }
      note.title = title || note.title;
      note.content = content || note.content;
      const updatedNote = await note.save();
      res.json(updatedNote);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (note) {
      // Enforce tenant isolation
      if (note.tenant.toString() !== req.user.tenant._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: You cannot delete this note.' });
      }
      await note.deleteOne();
      res.json({ message: 'Note removed' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
};
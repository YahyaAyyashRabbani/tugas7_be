import Notes from "../models/NotesModel.js";

export const createNotes = async (req, res) => {
  const { title, content } = req.body;
  const id = req.user.id;

  try {
    const notes = await Notes.create({
      title,
      content,
      userId: id,
    });
    res.status(201).json({
      message: "Notes berhasil dibuat",
      userId: id,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotes = async (req, res) => {
  const id = req.user.id;

  try {
    const notes = await Notes.findAll({ where: { userId: id } });

    res.status(200).json({
      message: "Notes berhasil diambil",
      userId: id,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNotes = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title dan content harus diisi" });
  }

  try {
    const [updatedCount] = await Notes.update(
      { title, content },
      { where: { id, userId } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Notes tidak ditemukan atau bukan milik Anda" });
    }

    // Query ulang data yang baru diupdate
    const updatedNote = await Notes.findOne({ where: { id, userId } });

    res.status(200).json({
      message: "Notes berhasil diupdate",
      userId,
      data: updatedNote,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteNotes = async (req, res) => {
  const { id } = req.params;
  console.log("ID NOTES = ", id);

  const userId = req.user.id;
  try {
    const notes = await Notes.destroy({
      where: {
        id,
      },
    });
    res.status(200).json({
      message: "Notes berhasil dihapus",
      userId,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

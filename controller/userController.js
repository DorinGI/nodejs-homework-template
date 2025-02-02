const fs = require('fs/promises');
const path = require('path');
//const Jimp = require('jimp');
const { Jimp } = require('jimp');
const User = require('../models/user');

const avatarsDir = path.join(__dirname, '../public/avatars');

const updateAvatar = async (req, res, next) => {
  try {
    const { path: tmpPath, originalname } = req.file;
    const { _id } = req.user;

    const newFileName = `${_id}-${originalname}`;
    const resultPath = path.join(avatarsDir, newFileName);

    const avatar = await Jimp.read(tmpPath);
    // console.log(tmpPath);
    // console.log(resultPath);
    // console.log('Avatar loaded successfully:', avatar);
    await avatar.resize(250, 250).writeAsync(resultPath);

    await fs.unlink(tmpPath);

    const avatarURL = `/avatars/${newFileName}`;

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    // console.error('Error processing avatar:', error.message);
    next(error);
  }
};

module.exports = { updateAvatar };

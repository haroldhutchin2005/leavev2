const axios = require('axios');
const express = require('express');
const fs = require('fs');
const LeaveBuilder = require('discord-card-canvas'); 
const app = express();
const port = proces.env.PORT || 3000;

const getAvtmot = async (id) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: 'arraybuffer' }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching Facebook avatar:', error.message);
    throw error;
  }
};

app.get('/wcard', async (req, res) => {
  const nicknameText = req.query.name;
  const senderId = req.query.id;
  const setSecondText = req.query.gcname;

  try {
    // Fetch and save avatar image
    const avatarBuffer = await getAvtmot(senderId);
    fs.writeFileSync('./avatar.jpg', avatarBuffer);

    // Generate welcome card
    const cv = new LeaveBuilder({
      nicknameText: { content: nicknameText },
      avatarImgBuffer: avatarBuffer,
    });

    cv.setFontDefault('Inter');
    cv.setSecondText({ content: setSecondText }).build();

    // Save welcome card
    const imageBuffer = cv.toBuffer();
    fs.writeFileSync('./welcome-2.png', imageBuffer);

    // Set headers for serving as an attachment
    res.setHeader('Content-Disposition', 'attachment; filename=welcome-2.png');
    res.setHeader('Content-Type', 'image/png');

    // Send welcome card as an attachment
    res.sendFile('./welcome-2.png', { root: __dirname });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

const express = require('express');
const VK = require('vk-io');
require('dotenv').config();

const app = express();

app.get('/', (req, res) => {
  res.send('It Works!!!!');
});

app.get('/vkls/:id', (req, res) => {
  const idu = req.params.id;

  const vk = new VK({
    login: process.env.VK_USER,
    pass: process.env.VK_PASS
  });

  const auth = vk.auth.windows();

  auth.run()
    .then(account => {
      console.log('Authorised user:', account.user);
      getFriends(account.token);
    })
    .catch(error => console.error(error));

  function getFriends(access_token) {
    console.log('Getting friends of id', idu);

    vk.api.friends.get({
      user_id: idu,
      access_token
    })
      .then(resp => {
        const users = resp.items;
        const randomId = users[Math.floor(Math.random() * users.length)];
        console.log('randomId', randomId);

        getUserInfo(randomId, access_token);
      })
      .catch(error => console.error(error));
  }

  function getUserInfo(id, access_token) {
    vk.api.users.get({
      user_ids: id,
      fields: 'first_name, last_name, photo_100',
      access_token
    })
      .then(resp => {
        resp = resp[0];
        console.log(resp.first_name, resp.last_name, resp.photo_100);

        res.send(`Random friend is: ${resp.first_name} ${resp.last_name} with avatar ${resp.photo_100}`);
      })
      .catch(error => console.error(error));
  }
});

app.listen(3000);

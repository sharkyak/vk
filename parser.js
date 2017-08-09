const express = require('express');
const VK = require('vk-io');
require('dotenv').config();

const app = express();

const vk = new VK({
  login: process.env.VK_USER,
  pass: process.env.VK_PASS
});
let accessToken = '';

app.get('/', (req, res) => {
  res.send('It Works!!!!');
});

app.get('/vkls/:id', (req, res) => {
  const idu = req.params.id;
  getFriends(idu, res);
});

function getFriends(idu, res) {
  console.log('Getting friends of id', idu);

  vk.api.friends.get({
    user_id: idu,
    access_token: accessToken
  })
    .then(resp => {
      const users = resp.items;
      const randomId = users[Math.floor(Math.random() * users.length)];
      console.log('randomId', randomId);

      getUserInfo(idu, randomId, res);
    })
    .catch(error => console.error(error));
}

function getUserInfo(idu, id, res) {
  vk.api.users.get({
    user_ids: id,
    fields: 'first_name, last_name, photo_100, deactivated',
    access_token: accessToken
  })
    .then(resp => {
      resp = resp[0];
      console.log(resp.deactivated, resp.first_name, resp.last_name, resp.photo_100);

      if (resp.deactivated === 'deleted' || resp.deactivated === 'banned') {
        getFriends(idu, res);
        return;
      }

      res.send(`Random friend is: ${resp.first_name} ${resp.last_name} with avatar ${resp.photo_100}`);
    })
    .catch(error => console.error(error));
}

app.listen(3000, () => {
  console.log('Server started');

  const auth = vk.auth.windows();

  auth.run()
    .then(account => {
      console.log('Authorised user:', account.user);
      accessToken = account.token;
    })
    .catch(error => console.error(error));
});

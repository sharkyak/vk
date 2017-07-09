var express = require('express');
var app = express();
const VK = require('vk-io');
require('dotenv').config();

app.get('/', function (req, res) {
  res.send('It Works!!!!')
})

app.get('/vkls/:id', function (req, res) {
  let idu = req.params.id;

  const vk = new VK({
      login: process.env.VK_USER,
      pass: process.env.VK_PASS
  });

  const auth = vk.auth.windows();

  auth.run()
  .then(account => {
      console.log('Authorised user:',account.user);
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
      const randomId = users[Math.floor(Math.random()*users.length)];
      console.log(randomId);

      res.send('Random friend Id is: ' + randomId);
    })
    .catch(error => console.error(error));
  }
});

app.listen(3000);

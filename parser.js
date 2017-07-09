const VK = require('vk-io');
require('dotenv').config();

const vk = new VK({
    login: process.env.VK_USER,
    pass: process.env.VK_PASS
});

const auth = vk.auth.windows();

auth.run()
.then((account) => {
    console.log('User:',account.user);
    console.log('Token:',account.token);
    console.log('Expires:',account.expires);

    getWall(account.token);
})
.catch(error => console.error(error));


function getWall(access_token) {
  console.log('Getting first 5 wall posts of group', process.env.GROUP_ID);

  vk.api.wall.get({
    domain: process.env.GROUP_ID,
    count: 5,
    access_token
  })
  .then(notes => console.log(notes))
  .catch(error => console.error(error));
}

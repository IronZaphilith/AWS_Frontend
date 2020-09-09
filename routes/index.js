const express = require('express');
const router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let photos=[];
  await axios.get(process.env.BACKEND_URL + '/get-images').then(res => {
    photos = res.data;
  }).catch(err => console.log(err))
  res.render('index', { title: 'Uploaded images', photos, type: 'index' });
});

router.post('/', async function (req, res) {
  console.log(req);
  let responseStatus = 201;
  // Setup the sendMessage parameter object
  await axios.post(process.env.BACKEND_URL + '/send-sqs-message', {
    key: req.body.key,
    rotation: req.body.rotation
  }).then(res => {
    console.log(res);
  }).catch(err => {
    responseStatus = res.statusCode;
    console.log(err);
    res.status(responseStatus).json({message: err.message});
  });
  console.log('Sent to queue!');
  res.status(responseStatus).json({message: 'Image is sent to queue!'});
});


module.exports = router;


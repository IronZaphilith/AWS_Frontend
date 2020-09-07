const express = require('express');
const router = express.Router();
const axios = require('axios');
const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});
// Create SQS service client
const sqs = new AWS.SQS();

/* GET home page. */
router.get('/', async function(req, res, next) {
  let photos=[];
  await axios.get('http://localhost:5000/get-images').then(res => {
    photos = res.data;
  }).catch(err => console.log(err))
  res.render('index', { title: 'Uploaded images', photos, type: 'index' });
});

router.post('/', async function (req, res) {
  console.log(req);
  let responseStatus = 201;
  // Setup the sendMessage parameter object
  const params = {
    MessageBody: JSON.stringify({
      key: req.body.key,
      rotation: req.body.rotation
    }),
    QueueUrl: `https://sqs.us-east-1.amazonaws.com/575075258561/images-queue`
  };
  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.log("Error", err);
      res.status(400).json({message: err.message});
    } else {
      console.log("Successfully added message", data.MessageId);
    }
  });
  console.log('Sent to queue!');
  res.status(responseStatus).json({message: 'Image is sent to queue!'});
});


module.exports = router;


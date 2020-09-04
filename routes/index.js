const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require("path");
const router = express.Router();
const axios = require('axios');
const utf8 = require('utf8');
const FormData = require('form-data');
var aws4  = require('aws4')


function generateEncodedPolicy(currentDate) {
  const expiryDate = new Date(currentDate);
  expiryDate.setHours(new Date().getHours() + 1);
  let policy = {
    expiration: expiryDate.toISOString(),
    conditions: [
      {"bucket": "mstokfisz-to-process"},
      {"acl": "public-read"},
      ["starts-with", "$Content-Type", "image/"],
      {"x-amz-server-side-encryption": "AES256"},
      {"x-amz-credential": "ASIAYLZJICDARW34EVWV/"+currentDate.toISOString().slice(0,10).replace(/-/g,"")+"/us-east-1/s3/aws4_request"},
      {"x-amz-algorithm": "AWS4-HMAC-SHA256"},
      {"x-amz-date": currentDate.toISOString() }
    ]
  };
  return new Buffer(utf8.encode(JSON.stringify(policy))).toString('base64');
}

const sendForm = function (fileName, policy, signature, currentDate) {
  let formData = new FormData();
  formData.append("acl", "public-read");
  formData.append("key", fileName);
  formData.append("policy", policy);
  formData.append("x-amz-algorithm", "AWS4-HMAC-SHA256");
  formData.append("x-amz-credential", "ASIAYLZJICDARW34EVWV/"+currentDate.toISOString().slice(0,10).replace(/-/g,"")+"/us-east-1/s3/aws4_request");
  formData.append("x-amz-date", currentDate.toISOString().slice(0,19).replace(/[-:]/g, "") + "Z");
  formData.append("x-amz-signature", signature);
  formData.append("file", fs.readFileSync(path.join(__dirname, "./tmp/"+fileName), { encoding: 'base64' }), fileName);

  console.log(currentDate.toISOString());
  var opts = {headers: formData.getHeaders()};

  axios.post("http://mstokfisz-to-process.s3.amazonaws.com/", formData, {headers: formData.getHeaders()}).catch((err) => {
    console.log(err);
  });
}

const upload = multer({
  dest: path.join(__dirname, "./tmp")
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'AWS Photo Editor' });
});

router.post('/', upload.single("photo" /* name attribute of <file> element in your form */),
async function (req, res) {
  console.log(req.body.rotation);
  const tempPath = req.file.path;
  fs.rename(tempPath, path.join(__dirname, "./tmp/"+req.file.originalname), err => {
    if (err) return handleError(err, res);
  });
  const currentDate = new Date();
  let signature = "";
  const policy = generateEncodedPolicy(currentDate);
  await axios.post('http://localhost:5000/get-signature', {
    policy,
    date: currentDate.toISOString().slice(0,10).replace(/-/g,""),
    region: 'us-east-1'
  }).then(res => {
    signature = res.data.signature;
  }).catch(err => {
    console.log(err);
  });
  sendForm(req.file.originalname, policy, signature, currentDate);
});

module.exports = router;


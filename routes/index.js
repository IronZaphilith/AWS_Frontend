const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require("path");
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');

const upload = multer({
  dest: path.join(__dirname, "./tmp")
});

function createForm(fields) {
  let form_data = new FormData();
  for (let key in fields) {
    form_data.append(key, fields[key]);
  }
  return form_data;
}

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
  let form;
  await axios.post('http://localhost:5000/signed-form-upload', {
    filename: req.file.originalname
  }).then(res => {
    console.log("Test");
    form = res.data;
  }).catch(err => {
    console.log(err);
  });
  const form_data = createForm(form.fields);
  // form_data.append('Success_Action_Status', '201');
  form_data.append('file', fs.createReadStream(path.join(__dirname, "./tmp/"+req.file.originalname)));
  console.log(form_data);
  form_data.submit("https://images-to-process-mstokfisz.s3.amazonaws.com", function(err, res) {
    console.log(res.statusCode + " " + res.statusMessage);
    if (err) {
      console.log("ERROR:\n"+err);
    }
  });
});

module.exports = router;


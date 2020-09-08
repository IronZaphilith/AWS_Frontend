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

/* GET upload page. */
router.get('/', function(req, res, next) {
  res.render('upload', { title: 'AWS Photo Editor' });
});

router.post('/', upload.single("photo" /* name attribute of <file> element in your form */),
async function (req, res) {
  let responseStatus = 201;
  const tempPath = req.file.path;
  fs.rename(tempPath, path.join(__dirname, "./tmp/"+req.file.originalname), err => {
    if (err) return handleError(err, res);
  });
  let form;
  await axios.post(process.env.BACKEND_URL + '/signed-form-upload', {
    filename: req.file.originalname,
  }).then(res => {
    form = res.data;
  }).catch(err => {
    responseStatus = res.statusCode;
    console.log(err);
    res.status(responseStatus).json({message: err.message});
  });
  const form_data = createForm(form.fields);
  form_data.append('file', fs.createReadStream(path.join(__dirname, "./tmp/"+req.file.originalname)));
  await form_data.submit("https://images-to-process-mstokfisz.s3.amazonaws.com", function(err, res) {
    console.log(res.statusCode + " " + res.statusMessage);
    if (err) {
      responseStatus = res.statusCode;
      res.status(responseStatus).json({message: err.message});
      console.log("ERROR:\n"+err);
    }
  });
  console.log('Uploaded!');
  res.status(responseStatus).json({message: 'Image uploaded!'});
  fs.unlinkSync(path.join(__dirname, "./tmp/"+req.file.originalname));
});

module.exports = router;


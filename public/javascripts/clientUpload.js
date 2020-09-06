let isRotationValid = false;
let isFileValid = false;
let isFileUploading = false;

$('#uploadNav').addClass('active');

$('#photoInput').on('change',function(e){
    //get the file name
    const allowedExtensions = ['png', 'jpg', 'bmp', 'jpeg', 'tiff', 'gif'];
    let fileName = e.target.files[0].name;
    let extension = fileName.split('.').pop();
    if (!allowedExtensions.some(el => extension.toLowerCase().includes(el))) {
        window.alert("Wrong file extension!");
        isFileValid = false;
        $('#uploadBtn').attr("disabled", true);
        $(this).next('.custom-file-label').html('Choose file');
    } else {
        isFileValid = true;
        //replace the "Choose a file" label
        $(this).next('.custom-file-label').html(fileName);
        if (isRotationValid && !isFileUploading) {
            $('#uploadBtn').removeAttr("disabled");
        }
    }
})

$('#rotationSelect').on('change', function(e) {
    if (e.target.value !== 'Choose...') {
        isRotationValid = true;
        if (isFileValid && !isFileUploading) {
            $('#uploadBtn').removeAttr("disabled");
        }
    } else {
        isRotationValid = false;
        $('#uploadBtn').attr("disabled", true);
    }
})

$('#photoUploadForm').ajaxForm({
        beforeSubmit: function () {
            isFileUploading = true;
            $('#uploadBtn').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Uploading...').attr('disabled', true);
        },
        success : function (responseText, statusText) {
            isFileUploading = false;
            if (isRotationValid && isFileValid) {
                $('#uploadBtn').html('Upload!').removeAttr("disabled");
            }
            alert("File uploaded!");
        },
        error: function (response) {
            isFileUploading = false;
            if (isRotationValid && isFileValid) {
                $('#uploadBtn').html('Upload!').removeAttr("disabled");
            }
            if (response.status === 404) {
                alert("File not uploaded! Response code 404!");
            } else {
                alert("File not uploaded! Response: " + response.responseJSON.message);
            }
        }
    });
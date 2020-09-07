if (window.location.href.includes('transformed')) {
    $('#transformedNav').addClass('active');
} else {
    $('#homeNav').addClass('active');
}

$('a.photo-class').on('click', function (e) {
    console.log("click"+e.target.getAttribute('alt'));
    $('#imagepreview').attr('src', e.target.getAttribute('src')).attr('key', e.target.getAttribute('alt'));
    $('#imagemodal').modal('show');
})

let isRotationValid = false;
let isFileUploading = false;

$('#rotationSelect').on('change', function(e) {
    if (e.target.value !== 'Choose...') {
        isRotationValid = true;
        if (!isFileUploading) {
            $('#processBtn').removeAttr("disabled");
        }
    } else {
        isRotationValid = false;
        $('#processBtn').attr("disabled", true);
    }
})

$('#photoEditForm').ajaxForm({
    beforeSubmit: function () {
        console.log('Submitted!');
        $('#imagemodal').modal('hide');
        isFileUploading = true;
        $('#processBtn').attr('disabled', true);
    },
    success : function (responseText, statusText) {
        isFileUploading = false;
        if (isRotationValid) {
            $('#processBtn').removeAttr("disabled");
        }
        alert("Image is being processed!");
    },
    error: function (response) {
        isFileUploading = false;
        if (isRotationValid) {
            $('#uploadBtn').removeAttr("disabled");
        }
        if (response.status === 404) {
            alert("Image will not be processed! 404 error");
        } else {
            alert("Image will not be processed! Response: " + response.responseJSON.message);
        }
    }
});
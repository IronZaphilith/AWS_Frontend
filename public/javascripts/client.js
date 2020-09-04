$('#photoInput').on('change',function(e){
    //get the file name
    const allowedExtensions = ['png', 'jpg', 'bmp', 'jpeg', 'tiff', 'gif'];
    let fileName = e.target.files[0].name;
    let extension = fileName.split('.').pop();
    if (!allowedExtensions.some(el => extension.toLowerCase().includes(el))) {
        window.alert("Wrong file extension!");
        console.log('test');
        $('#uploadBtn').attr("disabled", true);
        console.log('test2');
    } else {
        //replace the "Choose a file" label
        $(this).next('.custom-file-label').html(fileName);
        $('#uploadBtn').removeAttr("disabled");
    }
})

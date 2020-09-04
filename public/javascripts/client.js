// const getSignedURL = () => {
//     return new Promise((resolve, reject) => {
//         axios
//             .get("localhost:5000/get-signed-url")
//             .then(data => {
//                 resolve(data);
//             })
//             .catch(err => {
//                 reject(err);
//             });
//     });
// };
//
// const uploadMediaToS3 = () => {
//     console.log('lol');
//     const config = {
//         onUploadProgress: function(progressEvent) {
//             var percentCompleted = Math.round(
//                 (progressEvent.loaded * 100) / progressEvent.total
//             );
//             console.log(percentCompleted);
//         }
//     };
//     const files = document.getElementById('photoInput').files;
//     let fd = new FormData();
//     fd.append(files[0].name, files[0]);
//
//     getSignedURL().then(data => {
//         axios
//             .put(data.urls[0], fd, config)
//             .then(res => console.log("Upload Completed", res))
//             .catch(err => console.log("Upload Interrupted", err));
//     });
// };

// add event listener to a html element
// window.onload(() => {
//     let uploadButton = document.getElementById("uploadBtn");
//     uploadButton.addEventListener("onclick", uploadMediaToS3);
// })
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

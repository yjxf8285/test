$('#upload-file').on('change', function () {
    var formData = new FormData();
    formData.append("uploadedFile", $('#upload-file')[0].files[0]);
    $.ajax({
        url: '/mcupload',
        type: 'post',
        data: formData,
        /**
         * 必须false才会避开jQuery对 formdata 的默认处理
         * XMLHttpRequest会对 formdata 进行正确的处理
         */
        processData: false,
        /**
         *必须false才会自动加上正确的Content-Type
         */
        contentType: false,
        success: function (response) {
            console.info(response)
        }
    });
});


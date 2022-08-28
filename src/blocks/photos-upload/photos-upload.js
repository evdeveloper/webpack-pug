/**
 *
 *
 * @export
 * @param {HTMLElement} uploadNode
 */
export default async function photosUploadInit(uploadNode) {
    const Dropzone = await loadDropzone();
    const photosNodes = uploadNode.querySelectorAll('.photos-upload__photo');
    const previewTemplate = uploadNode.querySelector(
        '.photos-upload__preview-template'
    ).innerHTML;

    /**
     * @type
     */
    const dzInstances = [...photosNodes].map(el => {
        return new Dropzone(el, createDropzoneOptions(el, previewTemplate));
    });
    console.log(dzInstances);

    return dzInstances;
}

async function loadDropzone() {
    const module = await import(/* webpackChunkName: "Dropzone" */ 'dropzone');
    return module.default;
}

/**
 *
 * @param {HTMLElement} el
 */
function createDropzoneOptions(el, previewTemplate) {
    const clickable = el.querySelector('.photos-upload__dropzone');
    const previewsContainer = el.querySelector('.photos-upload__preview');

    function toggleClasses() {
        clickable.classList.toggle('hidden');
        previewsContainer.classList.toggle('visible');
    }

    return {
        clickable,
        previewsContainer,
        url: '/photos-upload',
        autoProcessQueue: false,
        uploadMultiple: true,
        parallelUploads: 1,
        maxFiles: 1,
        createImageThumbnails: true,
        acceptedFiles: 'image/*',
        maxFilesize: 2,
        previewTemplate,

        //translations
        dictFileTooBig: 'Файл больше допустимых {{maxFilesize}} МБ',
        dictInvalidFileType: 'Недопустимый формат файла',
        dictMaxFilesExceeded: 'Максмальное количество файлов: {{maxFiles}}',

        // The setting up of the dropzone
        init: function () {
            this.on('error', function (file) {
                this.removeFile(file);
            });

            this.on('addedfile', function () {
                toggleClasses();
            });

            this.on('removedfile', function () {
                toggleClasses();
            });
        },
    };
}

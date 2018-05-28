import './modal-edit.scss';
import 'croppie/croppie.css';
import { Croppie } from 'croppie';
import { Relative } from '../relative-element';
import { FilePicker } from '../google-drive/file-picker';

export class ModalEditController {

    private editImage;
    private contentElement;
    private funcListener;
    private params;
    private crop;
    private custom;
    private filters;
    private fileDrag;
    private inputFile;
    private mode = 'view';

    constructor($scope, private $element) {
        this.contentElement = this.$element.querySelector('.content-image-crop-edit');
    }

    $onInit() {
        this.setDefaultFilters();
    }

    setDefaultFilters() {
        this.filters = [
            {
                label: 'Brilho',
                name: 'brightness',
                value: 1,
                min: 0,
                max: 2,
                step: 0.1,
                measure: ''
            },
            {
                label: 'Contraste',
                name: 'contrast',
                value: 1,
                min: 0,
                max: 2,
                step: 0.1,
                measure: ''
            },
            {
                label: 'Saturação',
                name: 'grayscale',
                value: 0,
                min: 0,
                max: 1,
                step: 0.1,
                measure: ''
            },
            {
                label: 'Matriz',
                name: 'hue-rotate',
                value: 0,
                min: -100,
                max: 100,
                step: 1,
                measure: 'deg'
            }
        ];
    }

    setImageCrop(image) {
        this.inputFile.value = '';
        this.editImage = image;
        this.createCrop();
        this.mode = 'crop';
    }

    fileSelectFunc(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        const target = document.querySelector('.content-image-crop-edit.small .content-left');
        const files = evt.target.files || evt.dataTransfer.files;
        if (files[0] && files[0].type.match('image/*')) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = () => {
                target['$scope'].scope.$ctrl.setImageCrop(reader.result);
            }
            reader.readAsDataURL(file);
        }
    }

    dragOverFunc(evt) {
        const target = document.querySelector('.content-image-crop-edit.small .content-left');
        evt.stopPropagation();
        evt.preventDefault();
        setTimeout(() => {
            if (evt.type == 'dragover') {
                target.classList.add('hover');
            } else {
                target.classList.remove('hover');
            }
        });
    }

    chooseFile() {
        this.$element.querySelector('input[type="file"]').click();
    }

    $onViewInit() {
        this.fileDrag = this.$element.querySelector('.content-image-crop-edit.small .content-left');
        this.inputFile = this.$element.querySelector('input[type="file"]');
        this.fileDrag.addEventListener('drop', this.fileSelectFunc);
        this.inputFile.addEventListener('change', this.fileSelectFunc);
        this.fileDrag.addEventListener('dragover', this.dragOverFunc);
        this.fileDrag.addEventListener('dragleave', this.dragOverFunc);
    }

    setFilterInElement(elm) {
        if (elm) {
            const filter = this.filters.reduce((prev, next) => prev += `${next['name']}(${next['value']}${next['measure'] || ''}) `, '');
            Relative.handlingCss(elm, { filter });
        }
    }

    $onChanges() {
        if (this.mode == 'crop') {
            this.setFilterInElement(document.querySelector('canvas.cr-image'));
            this.setFilterInElement(document.querySelector('div.cr-viewport'));
        }
    }

    modalParams(params) {
        this.params = params;
    }

    $destroy() {
        this.fileDrag.removeEventListener('dragover', this.dragOverFunc);
        this.fileDrag.removeEventListener('dragleave', this.dragOverFunc);
    }

    close() {
        this.params.modalInstance.close();
    }

    ok(){
        this.params.modalInstance.ok(this.params.image);
    }

    createCrop() {
        const defaultCrop = {
            viewport: {
                width: 170,
                height: 170,
                type: this.params.type == 'circle' ? 'circle' : 'square'
            },
            zoomOnWheel: true,
            enableOrientation: true,
            checkCrossOrigin: false,
        };

        const config = Object.assign(defaultCrop, this.params.crop);
        this.crop = new Croppie(document.getElementById('cropElem'), config);
        this.crop.bind({ url: this.editImage }).then(() => { });
    }

    destroyCrop() {
        this.crop.destroy();
        this.mode = 'view';
    }

    saveCrop() {
        this.crop.result({ type: 'rawcanvas' }).then((resp) => {
            const imgBase64 = resp.toDataURL("image/png");
            const canvas = document.createElement('canvas');
            canvas.width = resp.width;
            canvas.height = resp.height;
            const ctx = canvas.getContext("2d");
            ctx['filter'] = this.filters.reduce((prev, next) => prev += `${next['name']}(${next['value']}${next['measure'] || ''}) `, '');
            const image = new Image();
            image.onload = () => {
                ctx.drawImage(image, 0, 0);
                this.saveImage(canvas.toDataURL("image/png"));
                this.destroyCrop();
                this.ok();
            };
            image.src = imgBase64;
        })
    }

    openPickerGoogle() {
        const picker = new FilePicker({
            apiKey: this.params.drive.apiKey,
            clientId: this.params.drive.clientId,
            onSelect: (file) => {
                this.setImageCrop(file.downloadUrl);
            }
        });
        picker.open();
    }

    saveImage(base64) {
        this.params.image = base64;
    }

}
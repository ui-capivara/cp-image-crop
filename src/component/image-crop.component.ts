import capivara from '../index';
import modalViewTemplate from './modal-view/modal-view.template.html';
import modalEditTemplate from './modal-edit/modal-edit.template.html';
import { ModalViewController } from './modal-view/modal-view.controller';
import { ModalEditController } from './modal-edit/modal-edit.controller';

export class CapivaraImageCrop {
    private $constants;
    private $functions;
    private $bindings;
    private url;

    constructor() {
    }

    /**
     * @description Method executed when a component is created
     */
    $onInit() {
        if (this.$constants.drive && this.$constants.drive.apiKey && this.$constants.drive.clientId) {
            document.write(`<script async src="https://www.google.com/jsapi?key=${this.$constants.drive.apiKey}"></script>`);
            document.write('<script async src="https://apis.google.com/js/client.js"></script>');
        }
    }

    /**
     * @description Generate a dynamic style to element
     */
    getCropStyle() {
        return {
            'width': (this.$constants && this.$constants.width) ? this.$constants.width : '170px',
            'height': (this.$constants && this.$constants.height) ? this.$constants.height : '170px',
            'border-radius': (this.$constants && this.$constants.type == 'circle') ? '50%' : '3px'
        };
    }

    /**
     * @description Create a new modal instance
     * @param template Modal template
     * @param controller Modal Controller
     */
    createModal(config) {
        const ModalInstance = function (instanceConfig) {
            const modal = document.createElement('div');
            modal.innerHTML = instanceConfig.template;
            modal.classList.add('modal-cp-image-crop');
            document.body.appendChild(modal);

            const close = (...args) => {
                window.removeEventListener('keyup', onKeyPress);
                document.body.removeChild(modal);
                if (this.onClose) {
                    this.onClose(...args);
                }
            }

            const ok = (...args) => {
                close(...args);
                if (this.onOK) {
                    this.onOK(...args);
                }
            };

            const onKeyPress = (evt) => {
                if (evt.keyCode === 27) {
                    close();
                }
            };

            if (config.keyboard) {
                window.addEventListener('keyup', onKeyPress);
            };

            if (instanceConfig.controller) {
                capivara.controller(modal, instanceConfig.controller);
                if (modal['$scope'].scope.$ctrl.modalParams) {
                    config.params.modalInstance = this;
                    modal['$scope'].scope.$ctrl.modalParams(config.params);
                }
            }

            this.close = close;
            this.ok = ok;

        };
        return new ModalInstance(config);
    }

    /**
     * @description View a image in full screen mode
     * @param url Image to view
     */
    viewImage(url: string) {
        const modalInstance = this.createModal({
            template: modalViewTemplate,
            keyboard: true,
            controller: ModalViewController,
            params: {
                url: url || ''
            }
        });
    }

    openModalEditImage() {
        const modalInstance = this.createModal({
            template: modalEditTemplate,
            controller: ModalEditController,
            keyboard: true,
            params: Object.assign(this.$constants, {
                image: this.$bindings.cpModel
            })
        });
        modalInstance.onOK = (image) => {
            this.saveImageInModel(image);
        }
    }

    saveImageInModel(image) {
        this.$bindings.cpModel = image;
    }

}
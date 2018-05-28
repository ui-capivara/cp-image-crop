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
        this.$constants = this.$constants || {};
    }

    $onViewInit() {
        this.appendDriverAPI();
    }

    insertScript(url, elm) {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        elm.appendChild(script);
    }

    appendDriverAPI() {
        if (this.$constants.drive && this.$constants.drive.apiKey && this.$constants.drive.clientId) {
            const SRC_GOOGLE_CLIENT = 'https://apis.google.com/js/client.js';
            const SRC_DRIVE_CLIENT = `https://www.google.com/jsapi?key=${this.$constants.drive.apiKey}`;
            const head = document.getElementsByTagName('head')[0];
            if (!head.querySelector(`script[src="${SRC_DRIVE_CLIENT}"]`)) {
                this.insertScript(SRC_DRIVE_CLIENT, head);
            }
            if (!head.querySelector(`script[src="${SRC_GOOGLE_CLIENT}"]`)) {
                this.insertScript(SRC_GOOGLE_CLIENT, head);
            }
        }
    }

    /**
     * @description Method executed when a component is build
     */
    $onBuild() {
        this.appendDriverAPI();
    }

    /**
     * @description Generate a dynamic style to element
     */
    getCropStyle() {
        return {
            'width': (this.$constants && this.$constants.width) ? this.$constants.width : '170px',
            'height': (this.$constants && this.$constants.height) ? this.$constants.height : '170px',
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
                url: url || '',
                constants: this.$constants,
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
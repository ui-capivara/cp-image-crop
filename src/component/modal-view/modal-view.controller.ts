import { Relative } from '../relative-element';

export class ModalViewController {

    private element;
    private imageElement;
    private wrapper;
    private image;
    private funcListener;
    private modalInstance;
    private $constants;

    constructor($scope, $element) {
        this.element = $element;
        this.imageElement = $element.querySelector('img');
        this.funcListener = Relative.relativeImage(this.imageElement);
    }

    modalParams(params){
        this.image = params.url;
        this.$constants = params.constants;
        this.modalInstance = params.modalInstance;
    }

    $destroy(){
        Relative.destroy(this.funcListener);
    }

    close() {
        this.modalInstance.close();
    }

}

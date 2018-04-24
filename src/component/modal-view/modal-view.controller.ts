import { Relative } from '../relative-element';

export class ModalViewController {

    private element;
    private imageElement;
    private wrapper;
    private image;
    private funcListener;
    private modalInstance;

    constructor(scope) {
        this.element = scope.element;
        this.imageElement = scope.element.querySelector('img');
        this.funcListener = Relative.relativeImage(this.imageElement);
    }

    modalParams(params){
        this.image = params.url;
        this.modalInstance = params.modalInstance;
    }

    $destroy(){
        Relative.destroy(this.funcListener);
    }

    close() {
        this.modalInstance.close();
    }

}

/* 
    Component created by capivara-cli https://capivarajs.github.io/
*/
import capivara from 'capivarajs';
import template from './component/image-crop.template.html';
import style from './component/image-crop.style.scss';
import { CapivaraImageCrop } from './component/image-crop.component';

const Component = {
    /**
     * @name template
     * @description Applies the visual part of the component
     */
    template: template,
    /**
     * @name style
     * @description Import component style
     */
    style: style,
    /**
     * @name constants
     * @description Declares the constants that will be accepted by component. See https://capivarajs.github.io/components.html#constants
     */
    constants: ['crop', 'drive', 'width', 'height', 'type', 'defaultImage'],
    /**
     * @name functions
     * @description Declares the functions that will be accepted by component. See https://capivarajs.github.io/components.html#functions
     */
    functions: [],
    /**
     * @name bindings
     * @description Declares the variables that will be accepted by component. See https://capivarajs.github.io/components.html#bindings
     */
    bindings: ['cpModel'],
    /**
     * @name controller
     * @description Sets the scope of the component
     */
    controller: CapivaraImageCrop
};

capivara.component('cp-image-crop', Component);

export default capivara;
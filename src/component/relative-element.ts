export namespace Relative {

    export function onResize(element) {
        applyRelativeSize(element);
    }

    export function relativeImage(element) {
        const wrapper = element.parentNode;
        defaultStyle(element, wrapper);
        applyRelativeSize(element);
        const resize = () => onResize(element);
        window.addEventListener('resize', resize);
        return resize;
    }

    export function destroy(funcToRemove) {
        window.removeEventListener('resize', funcToRemove);
    }

    export function applyRelativeSize(element) {
        let elHeight = window.outerHeight, elWidth = window.outerWidth;
        let scale = Math.min(
            element.parentNode.clientWidth / elWidth,
            element.parentNode.clientHeight / elHeight
        );
        handlingCss(element, {
            transform: "translate(-50%, -50%) " + "scale(" + scale + ")"
        });
    }

    export function handlingCss(element, css) {
        Object.keys(css).forEach((key) => element.style[key] = css[key]);
    }

    export function defaultStyle(element, wrapper) {
        handlingCss(wrapper, {
            'position': 'relative'
        });
        handlingCss(element, {
            'position': 'absolute',
            'left': '50%',
            'top': '50%',
            'transform': 'translate(-50%, -50%)',
            'transform-origin': 'center center'
        });
    }

}
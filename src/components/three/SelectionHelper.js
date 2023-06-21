import { Vector2 } from 'three';
import * as THREE from "three";
const ALT_KEY = 18;
const CTRL_KEY = 17;
const CMD_KEY = 91;
class SelectionHelper {



	constructor(renderer, controls, cssClassName) {

		this.element = document.createElement('div');
		this.element.classList.add(cssClassName);
		this.element.style.pointerEvents = 'none';

		this.renderer = renderer;
		this.controls = controls;
		this.startPoint = new Vector2();
		this.pointTopLeft = new Vector2();
		this.pointBottomRight = new Vector2();
		this.isShiftPressed = false;
		this.isDown = false;
		// console.log(controls , this.controls)
		this.onPointerDown = function (event) {

			this.isDown = true;
			this.onSelectStart(event);

		}.bind(this);

		this.onPointerMove = function (event) {

			if (this.isDown) {

				this.onSelectMove(event);

			}

		}.bind(this);

		this.onPointerUp = function () {

			this.isDown = false;
			this.onSelectOver();

		}.bind(this);

		this.onKeyDown = function (event) {
			if (event.key === 'Shift') {
				// enableControls = false;
				this.isShiftPressed = true;
				// this.controls.mouseButtons = {
				// LEFT: null, // make pan the default instead of rotate
				// MIDDLE:null,
				// RIGHT: null,
				// };
				this.controls.keys = []
			}
		}.bind(this)

		// 按键放开事件处理函数
		this.onKeyUp = function (event) {
			if (event.key === 'Shift') {
				// enableControls = true;
				this.isShiftPressed = false;
				this.controls.mouseButtons = {
					LEFT: THREE.MOUSE.PAN, // make pan the default instead of rotate
					MIDDLE: THREE.MOUSE.ZOOM,
					RIGHT: THREE.MOUSE.ROTATE,
				};
				this.controls.keys = [
					ALT_KEY, // orbit
					CTRL_KEY, // zoom
					CMD_KEY, // pan
				];
			}
		}.bind(this)


		this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
		this.renderer.domElement.addEventListener('pointermove', this.onPointerMove);
		this.renderer.domElement.addEventListener('pointerup', this.onPointerUp);


		window.addEventListener('keydown', this.onKeyDown);
		window.addEventListener('keyup', this.onKeyUp);
	}

	dispose() {

		this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
		this.renderer.domElement.removeEventListener('pointermove', this.onPointerMove);
		this.renderer.domElement.removeEventListener('pointerup', this.onPointerUp);

	}

	onSelectStart(event) {

		this.element.style.display = 'none';

		this.renderer.domElement.parentElement.appendChild(this.element);

		this.element.style.left = event.clientX + 'px';
		this.element.style.top = event.clientY + 'px';
		this.element.style.width = '0px';
		this.element.style.height = '0px';

		this.startPoint.x = event.clientX;
		this.startPoint.y = event.clientY;

	}

	onSelectMove(event) {

		// 按下shift键
		if (this.isShiftPressed) {
			this.element.style.display = 'block';

			this.pointBottomRight.x = Math.max(this.startPoint.x, event.clientX);
			this.pointBottomRight.y = Math.max(this.startPoint.y, event.clientY);
			this.pointTopLeft.x = Math.min(this.startPoint.x, event.clientX);
			this.pointTopLeft.y = Math.min(this.startPoint.y, event.clientY);

			this.element.style.left = this.pointTopLeft.x + 'px';
			this.element.style.top = this.pointTopLeft.y + 'px';
			this.element.style.width = (this.pointBottomRight.x - this.pointTopLeft.x) + 'px';
			this.element.style.height = (this.pointBottomRight.y - this.pointTopLeft.y) + 'px';
		}

	}

	onSelectOver() {
		if (this.element) {
			this.element.parentElement?.removeChild(this.element);
		}


	}

}

export { SelectionHelper };
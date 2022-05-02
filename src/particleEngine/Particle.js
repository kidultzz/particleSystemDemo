import * as THREE from "three";
import Tween from "./Tween.js";

/**粒子构造 */
export default class Particle {
	//static 属性  描述size,color,opacity的变化
	static sizeTween = new Tween();
	static colorTween = new Tween();
	static opacityTween = new Tween();

	constructor() {
		this.position = new THREE.Vector3();
		this.velocity = new THREE.Vector3(); //速度
		this.acceleration = new THREE.Vector3(); //加速度

		this.angle = 0;
		this.angleVelocity = 0; // 角速度
		this.angleAcceleration = 0; // 角加速度

		this.size = 16.0;

		this.color = new THREE.Color();
		this.opacity = 1.0;

		this.age = 0;//寿命
		this.alive = false;//是否激活中

	}

	update(dt) {
		//更新粒子位置
		this.position.add(this.velocity.clone().multiplyScalar(dt));
		//更新粒子速度
		this.velocity.add(this.acceleration.clone().multiplyScalar(dt));

		// 更新角度和角速度
		this.angle += this.angleVelocity * Math.PI / 180 * dt;
		this.angleVelocity += this.angleAcceleration * Math.PI / 180 * dt;

		this.age += dt;
		
		// 如果tween 属性值不为空，则更新以下属性
		if (Particle.sizeTween.times.length > 0)
			this.size = Particle.sizeTween.lerp(this.age);

		if (Particle.colorTween.times.length > 0) {
			var colorHSL = Particle.colorTween.lerp(this.age);
			this.color = new THREE.Color().setHSL(colorHSL.x, colorHSL.y, colorHSL.z);
		}

		if (Particle.opacityTween.times.length > 0)
			this.opacity = Particle.opacityTween.lerp(this.age);
	}

}

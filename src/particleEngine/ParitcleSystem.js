import * as THREE from "three";
import Particle from "./Particle.js";

const particleShader = {
    uniforms: {

      "texture":{type: "t", value: null},

    },
   
    vertexShader: `attribute vec3  customColor;\n\
    attribute float customOpacity;\n\
    attribute float customSize;\n\
    attribute float customAngle;\n\
    attribute float customVisible;\n\
    varying vec4  vColor;\n\
	varying float vAngle;\n\
    void main() {\n\
		if ( customVisible > 0.5 )\n\
			vColor = vec4( customColor, customOpacity );\n\
		else\n\
			vColor = vec4(0.0, 0.0, 0.0, 0.0);\n\
		vAngle = customAngle;\n\
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\
        gl_PointSize = customSize * ( 300.0 / length( mvPosition.xyz ) );\n\
        gl_Position = projectionMatrix * mvPosition;\n\
    }\n\
	`,
	//绘制模式为gl.POINTS，WebGL把顶点渲染为一个方形区域
	//gl_PointCoord描述每个方形区域中片元的坐标，方形区域的左上角坐标是(0.0,0.0),每个方形区域几何中心坐标是(0.5,0.5)，右下角坐标是(1.0,1.0)
    fragmentShader: `uniform sampler2D texture;\n\
    varying vec4 vColor;\n\
	varying float vAngle;\n\
    void main() {\n\

        float c = cos(vAngle);\n\
        float s = sin(vAngle);\n\

		vec2 rotatedUV = vec2(c * (gl_PointCoord.x - 0.5) + s * (gl_PointCoord.y - 0.5) + 0.5, c * (gl_PointCoord.y - 0.5) - s * (gl_PointCoord.x - 0.5) + 0.5);\n\
		vec4 rotatedTexture = texture2D( texture,  rotatedUV );\n\
		//vec4 rotatedTexture = texture2D(texture, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));\n\
        gl_FragColor = vColor * rotatedTexture;\n\
    }\n\
    `
}

//粒子发射类型(开发中...)
const Type = Object.freeze({ "CUBE": 1, "SPHERE": 2 });

export default class ParticleEngine {
	constructor() {

		this.positionStyle = Type.CUBE;
		this.positionBase = new THREE.Vector3();
		// cube 模型
		this.positionSpread = new THREE.Vector3();
		// sphere 模型
		this.positionRadius = 0; // base

		this.velocityStyle = Type.CUBE;
		// cube模型运动参数
		this.velocityBase = new THREE.Vector3();
		this.velocitySpread = new THREE.Vector3();
		// sphere模型运动参数
		this.speedBase = 0;
		this.speedSpread = 0;

		this.accelerationBase = new THREE.Vector3();
		this.accelerationSpread = new THREE.Vector3();

		this.angleBase = 0;
		this.angleSpread = 0;
		this.angleVelocityBase = 0;
		this.angleVelocitySpread = 0;
		this.angleAccelerationBase = 0;
		this.angleAccelerationSpread = 0;

		this.sizeBase = 0.0;
		this.sizeSpread = 0.0;

		// 把颜色转换为HSL模式处理
		this.colorBase = new THREE.Vector3(0.0, 1.0, 0.5);
		this.colorSpread = new THREE.Vector3(0.0, 0.0, 0.0);

		this.opacityBase = 1.0;
		this.opacitySpread = 0.0;

		this.particleArray = [];//存储粒子
		this.particlesPerSecond = 100;//每秒发射数
		this.particleDeathAge = 1.0;//粒子死亡周期

		this.emitterAge = 0.0; //发射器寿命
		this.emitterAlive = true;//发射器状态
		this.emitterDeathAge = 60; //发射器生命周期

		// 粒子活跃数
		this.particleCount = 0;

		this.particleGeometry = null;
		this.particleTexture = null;
		this.particleMaterial = null;
		this.particleMesh = null;

		this.onlyOnce = false;//是否只运行一次
	}

	setValues(parameters) {
		if (parameters === undefined)
			return;

		for (let key in parameters) {
            this[key] = parameters[key];
        }

		// 赋给Particle类的静态属性
		if (this.sizeTween) Particle.sizeTween = this.sizeTween;
		if (this.colorTween) Particle.colorTween = this.colorTween;
		if (this.opacityTween) Particle.opacityTween = this.opacityTween;

		this.particleArray = [];
		this.emitterAge = 0.0;
		this.emitterAlive = true;
		this.particleCount = this.particlesPerSecond * Math.min(this.particleDeathAge, this.emitterDeathAge);

        this.particleGeometry = new THREE.BufferGeometry();

        particleShader.uniforms["texture"].value = this.particleTexture;
		this.particleMaterial = new THREE.ShaderMaterial({
            ...particleShader,
            transparent: true,
			alphaTest: 0.5,
			depthWrite: false,
			depthTest: false,
			// side: THREE.BackSide
            // vertexColors: true
        });
		this.particleMesh = new THREE.Points();

	}

	// 生成随机数
	randomValue(base, spread) {
		return base + spread * (Math.random() - 0.5);
	}
	// 生成随机向量
	randomVector3(base, spread) {
		let rand3 = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);//[-0.5 - 0.5]
		return new THREE.Vector3().addVectors(base, new THREE.Vector3().multiplyVectors(spread, rand3));
	}

	//创建粒子
	createParticle() {
		const particle = new Particle();

		if (this.positionStyle == Type.CUBE)
			particle.position = this.randomVector3(this.positionBase, this.positionSpread);
			
		if (this.positionStyle == Type.SPHERE) {
			let z = 2 * Math.random() - 1;
			let t = Math.PI * 2 * Math.random();
			let r = Math.sqrt(1 - z * z);
			let vec3 = new THREE.Vector3(r * Math.cos(t), r * Math.sin(t), z);
			particle.position = new THREE.Vector3().addVectors(this.positionBase, vec3.multiplyScalar(this.positionRadius));
			
		}

		if (this.velocityStyle == Type.CUBE) {
			particle.velocity = this.randomVector3(this.velocityBase, this.velocitySpread);
		}

		if (this.velocityStyle == Type.SPHERE) {
			let direction = new THREE.Vector3().subVectors(particle.position, this.positionBase);
			let speed = this.randomValue(this.speedBase, this.speedSpread);
			particle.velocity = direction.normalize().multiplyScalar(speed);
		}

		particle.acceleration = this.randomVector3(this.accelerationBase, this.accelerationSpread);

		particle.angle = this.randomValue(this.angleBase, this.angleSpread);
		particle.angleVelocity = this.randomValue(this.angleVelocityBase, this.angleVelocitySpread);
		particle.angleAcceleration = this.randomValue(this.angleAccelerationBase, this.angleAccelerationSpread);

		particle.size = this.randomValue(this.sizeBase, this.sizeSpread);

		var color = this.randomVector3(this.colorBase, this.colorSpread);
		particle.color = new THREE.Color().setHSL(color.x, color.y, color.z);

		particle.opacity = this.randomValue(this.opacityBase, this.opacitySpread);

		particle.age = 0;//粒子初始化寿命为0
		particle.alive = 0; //粒子初始化为未激活状态

		return particle;
	}

	//初始化
	initialize() {
		//输送到shader的顶点属性
        const particlePositionArr = [];//位置属性
        const customVisibleArr = [];//可见性属性
        const customColorArr = [];//颜色属性
        const customOpacityArr = [];//透明度属性
        const customSizeArr = [];//尺寸属性
        const customAngleArr = [];//角度属性

		// 赋值粒子的顶点属性值
		for (let i = 0; i < this.particleCount; i++) {
			//创建粒子
			this.particleArray[i] = this.createParticle();

            const x = this.particleArray[i].position.x;
            const y = this.particleArray[i].position.y;
            const z = this.particleArray[i].position.z;
            particlePositionArr.push(x, y, z);
            customVisibleArr.push(this.particleArray[i].alive);

            const r = this.particleArray[i].color.r;
            const g = this.particleArray[i].color.g;
            const b = this.particleArray[i].color.b;

            customColorArr.push(r, g, b);
            customOpacityArr.push(this.particleArray[i].opacity);
            customSizeArr.push(this.particleArray[i].size);
            customAngleArr.push(this.particleArray[i].angle);
		}

        this.particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(particlePositionArr, 3));
        this.particleGeometry.setAttribute("customVisible", new THREE.Float32BufferAttribute(customVisibleArr, 1));
        this.particleGeometry.setAttribute("customColor", new THREE.Float32BufferAttribute(customColorArr, 3));
        this.particleGeometry.setAttribute("customOpacity", new THREE.Float32BufferAttribute(customOpacityArr, 1));
        this.particleGeometry.setAttribute("customSize", new THREE.Float32BufferAttribute(customSizeArr, 1));
		this.particleGeometry.setAttribute("customAngle", new THREE.Float32BufferAttribute(customAngleArr, 1));

        // const material = new THREE.PointsMaterial( { color: 0xff0000, size: 4 } );
        this.particleMesh = new THREE.Points(this.particleGeometry, this.particleMaterial);

		return this.particleMesh;

	}

	update(dt) {

		const recycleIndices = [];//粒子回收索引器

		let position = this.particleMesh.geometry.attributes.position;
		let color = this.particleMesh.geometry.attributes.customColor;
		let angle = this.particleMesh.geometry.attributes.customAngle;
		let opacity = this.particleMesh.geometry.attributes.customOpacity;
		let size = this.particleMesh.geometry.attributes.customSize;
		let visible = this.particleMesh.geometry.attributes.customVisible;

		// 更新粒子
		for (let i = 0; i < this.particleCount; i++) {

			if (this.particleArray[i].alive) {

				this.particleArray[i].update(dt);
				if (this.onlyOnce) {
					
				} else {
					// 检测粒子寿命是否耗尽，并进行回收
					if (this.particleArray[i].age > this.particleDeathAge) {
						this.particleArray[i].alive = false;
						recycleIndices.push(i);
					}
				}
				
				//更新每个顶点中定义的属性，用于在shader中计算
				position.setXYZ( i, this.particleArray[i].position.x, this.particleArray[i].position.y, this.particleArray[i].position.z );
				color.setXYZ( i, this.particleArray[i].color.r, this.particleArray[i].color.g, this.particleArray[i].color.b );
				visible.setX(i,this.particleArray[i].alive);
				opacity.setX(i, this.particleArray[i].opacity);
				size.setX(i, this.particleArray[i].size);
				angle.setX(i, this.particleArray[i].angle);

			}
		}
		//设置允许各个顶点属性实时更新
		position.needsUpdate = true;
		color.needsUpdate = true;
		angle.needsUpdate = true;
		opacity.needsUpdate = true;
		size.needsUpdate = true;
		visible.needsUpdate = true;

		// 检查粒子发射器是否运行中
		if (!this.emitterAlive) {

            return;
        }

		// 控制粒子激活
		if (this.emitterAge < this.particleDeathAge) {

			//每次update实际的粒子发射数 = 每秒发射数 * time
			let startIndex = Math.round(this.particlesPerSecond * (this.emitterAge + 0));
			let endIndex = Math.round(this.particlesPerSecond * (this.emitterAge + dt));
			if (endIndex > this.particleCount) {
				if (this.onlyOnce) {
					return;

				} else
				endIndex = this.particleCount;
			}
			for (let i = startIndex; i < endIndex; i++)
				this.particleArray[i].alive = true;
		}

		// 重新创建粒子取代回收的粒子
		for (let j = 0; j < recycleIndices.length; j++) {
			let i = recycleIndices[j];
			this.particleArray[i] = this.createParticle();
			this.particleArray[i].alive = true; // 立即激活粒子
			// 更新新创建的粒子位置
			position.setXYZ( i, this.particleArray[i].position.x, this.particleArray[i].position.y, this.particleArray[i].position.z );
		}

		// 停止发射
		this.emitterAge += dt;

		if (this.emitterAge > this.emitterDeathAge) {

			this.emitterAlive = false;
		}
	}

    //销毁粒子
	destroy() {
		scene.remove(this.particleMesh);
    }

}


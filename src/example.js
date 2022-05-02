/**
 * 粒子系统生成的部分通用效果，可在项目中直接引用
 * 部分参数可根据需求自行调整 
 * 
 * */
 import * as THREE from "three";
 import Tween from "./particleEngine/Tween.js";
 //引入粒子所用贴图 
 import starImg from "../assets/star.png";
 import smokeparticleImg from "../assets/smokeparticle.png";
 import snowImg from "../assets/snowflake.png";
 import raindropImg from "../assets/raindrop2flip.png";
 import spikeyImg from "../assets/spikey.png";
 import sparkImg from "../assets/spark.png";
 
 //粒子发射类型;(后续可增加多种发射类型的开发)
 let Type = Object.freeze({ "CUBE": 1, "SPHERE": 2 });
 
 //喷泉效果
 export const fountain = {
     positionStyle: Type.CUBE,
     positionBase: new THREE.Vector3(0, 5, 0),
     positionSpread: new THREE.Vector3(10, 0, 10),
 
     velocityStyle: Type.CUBE,
     velocityBase: new THREE.Vector3(0, 160, 0),
     velocitySpread: new THREE.Vector3(100, 20, 100),
 
     accelerationBase: new THREE.Vector3(0, -100, 0),
 
     particleTexture: new THREE.TextureLoader().load(starImg),
 
     angleBase: 0,
     angleSpread: 180,
     angleVelocityBase: 0,
     angleVelocitySpread: 360 * 4,
 
     sizeTween: new Tween([0, 1], [1, 20]),
     opacityTween: new Tween([2, 3], [1, 0]),
     colorTween: new Tween([0.5, 2], [new THREE.Vector3(0, 1, 0.5), new THREE.Vector3(0.8, 1, 0.5)]),
 
     particlesPerSecond: 200,
     particleDeathAge: 3.0,
     emitterDeathAge: 60
 };
 
 //火球效果
 export const fireball = { //fireball
 
     positionStyle: 2,
     positionBase: new THREE.Vector3(0, 50, 0),
     positionRadius: 0.5,
 
     velocityStyle: 2,
     speedBase: 40,
     speedSpread: 2,
 
     particleTexture: new THREE.TextureLoader().load(smokeparticleImg),
 
     sizeTween: new Tween([0, 0.1], [1, 350]),//粒子大小变化
     opacityTween: new Tween([0.7, 1], [1, 0]),//透明度变化
     colorBase: new THREE.Vector3(0.02, 1, 0.4),//颜色变化
     blendStyle: THREE.AdditiveBlending,
 
     particlesPerSecond: 100,//每秒发射粒子个数
     particleDeathAge: 1,//粒子生命周期
     emitterDeathAge: 60//发射器生命周期
 
 };
 
 //烟雾效果
 export const smoke = { //smoke
     positionStyle: Type.CUBE,
     positionBase: new THREE.Vector3(0, 0, 0),
     positionSpread: new THREE.Vector3(0.1, 0, 0.1),
 
     velocityStyle: Type.CUBE,
     velocityBase: new THREE.Vector3(0, 120, 0),
     velocitySpread: new THREE.Vector3(40, 25, 40),
     accelerationBase: new THREE.Vector3(0, 0, 0),
 
     particleTexture: new THREE.TextureLoader().load(smokeparticleImg),
 
     angleBase: 0,
     angleSpread: 720,
     angleVelocityBase: 0,
     angleVelocitySpread: 720,
 
     sizeTween: new Tween([0, 1], [60, 240]),
     opacityTween: new Tween([0.8, 2], [0.5, 0]),
     colorTween: new Tween([0.4, 1], [new THREE.Vector3(0, 0, 0.2), new THREE.Vector3(0, 0, 0.5)]),
 
     particlesPerSecond: 200,
     particleDeathAge: 2.0,
     emitterDeathAge: 60,
 
     onlyOnce: true
 
 };
 
 //云雾效果
 export const cloud = { //cloud
     positionStyle  : Type.CUBE,
     positionBase   : new THREE.Vector3( -10, 10, 0 ),
     positionSpread : new THREE.Vector3( 0,  2, 2 ),
     
     velocityStyle  : Type.CUBE,
     velocityBase   : new THREE.Vector3( 40, 0, 0 ),
     velocitySpread : new THREE.Vector3( 20, 0, 0 ), 
     
     particleTexture : new THREE.TextureLoader().load(smokeparticleImg),
 
     sizeBase     : 80.0,
     sizeSpread   : 0.0,
     colorBase    : new THREE.Vector3(0.0, 0.0, 1.0), // H,S,L
     opacityTween : new Tween([0,1,4,5],[0,1,1,0]),
 
     particlesPerSecond : 60,
     particleDeathAge   : 10.0,		
     emitterDeathAge    : 60
 
 };
 
 //雪花效果
 export const snow = { //snow
     positionStyle: Type.CUBE,
     positionBase1: new THREE.Vector3(0, 200, 0),
     positionSpread: new THREE.Vector3(500, 0, 500),
 
     velocityStyle: Type.CUBE,
     velocityBase: new THREE.Vector3(0, -60, 0),
     velocitySpread: new THREE.Vector3(50, 20, 50),
     accelerationBase: new THREE.Vector3(0, -10, 0),
 
     angleBase: 0,
     angleSpread: 720,
     angleVelocityBase: 0,
     angleVelocitySpread: 60,
 
     particleTexture: new THREE.TextureLoader().load(snowImg),
 
     sizeTween: new Tween([0, 0.25], [1, 10]),
     colorBase: new THREE.Vector3(0.66, 1.0, 0.9), // H,S,L
     opacityTween: new Tween([2, 3], [0.8, 0]),
 
     particlesPerSecond: 200,
     particleDeathAge: 4.0,
     emitterDeathAge: 60
 };
 
 //雨滴效果
 export const rain = { //rain
     positionStyle: Type.CUBE,
     positionBase: new THREE.Vector3(0, 200, 0),
     positionSpread: new THREE.Vector3(600, 0, 600),
 
     velocityStyle: Type.CUBE,
     velocityBase: new THREE.Vector3(0, -400, 0),
     velocitySpread: new THREE.Vector3(10, 50, 10),
     accelerationBase: new THREE.Vector3(0, -10, 0),
 
     particleTexture: new THREE.TextureLoader().load(raindropImg),
 
     sizeBase: 8.0,
     sizeSpread: 4.0,
     colorBase: new THREE.Vector3(0.66, 1.0, 0.7), // H,S,L
     colorSpread: new THREE.Vector3(0.00, 0.0, 0.2),
     opacityBase: 0.6,
 
     particlesPerSecond: 1000,
     particleDeathAge: 1.0,
     emitterDeathAge: 60
 };
 
 //星空效果
 export const starfield = { //starfield星空效果
 
     positionStyle: Type.CUBE,
     positionBase: new THREE.Vector3(0, 200, 0),
     positionSpread: new THREE.Vector3(300, 200, 300),
 
     velocityStyle: Type.CUBE,
     velocityBase: new THREE.Vector3(0, 0, 0),
     velocitySpread: new THREE.Vector3(0.5, 0.5, 0.5),
 
     angleBase: 0,
     angleSpread: 720,
     angleVelocityBase: 0,
     angleVelocitySpread: 2,
 
     particleTexture: new THREE.TextureLoader().load(spikeyImg),
 
     sizeBase: 10.0,
     sizeSpread: 4.0,
     colorBase: new THREE.Vector3(0.15, 1.0, 0.9), // H,S,L
     colorSpread: new THREE.Vector3(0.00, 0.0, 0.2),
     opacityBase: 1,
 
     particlesPerSecond: 20000,
     particleDeathAge: 60.0,
     emitterDeathAge: 0.1
 };
 
 //萤光效果
 export const fluorescence = {
     positionStyle: Type.CUBE,
     positionBase: new THREE.Vector3(0, 0, 0),
     positionSpread: new THREE.Vector3(200, 100, 200),
 
     velocityStyle: Type.CUBE,
     velocityBase: new THREE.Vector3(0, 0, 0),
     velocitySpread: new THREE.Vector3(30, 10, 30),
 
     particleTexture: new THREE.TextureLoader().load(sparkImg),
 
     sizeBase: 30.0,
     sizeSpread: 2.0,
     opacityTween: new Tween(
         [0.0, 1.0, 1.1, 2.0, 2.1, 3.0, 3.1, 4.0, 4.1, 5.0, 5.1, 6.0, 6.1],
         [0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2]
         ),
     colorBase: new THREE.Vector3(0.30, 1.0, 0.8), // H,S,L
     colorSpread: new THREE.Vector3(0.3, 0.0, 0.0),
 
     particlesPerSecond: 15,
     particleDeathAge: 6.1,
     emitterDeathAge: 600
 };
 
  //星空隧道效果
  export const startunnel = {
     positionStyle: Type.CUBE,
     positionBase: new THREE.Vector3(0, 0, 0),
     positionSpread: new THREE.Vector3(8, 8, 8),
 
     velocityStyle: Type.CUBE,
     velocityBase: new THREE.Vector3(0, 150, 250),
     velocitySpread: new THREE.Vector3(50, 50, 150),
 
     angleBase: 0,
     angleSpread: 720,
     angleVelocityBase: 100,
     angleVelocitySpread: 0,
 
     particleTexture: new THREE.TextureLoader().load(spikeyImg),
 
     sizeBase: 6.0,
     sizeSpread: 10.0,
     colorBase: new THREE.Vector3(0.15, 1.0, 0.8), // H,S,L
     opacityBase: 1,
     blendStyle: THREE.AdditiveBlending,
 
     particlesPerSecond: 400,
     particleDeathAge: 4.0,
     emitterDeathAge: 60
 };
 
 //烟花效果
 export const firework = {
     positionStyle: Type.SPHERE,
     positionBase: new THREE.Vector3(0, 10, 0),
     positionRadius: 10,
 
     velocityStyle: Type.SPHERE,
     speedBase: 90,
     speedSpread: 10,
 
     accelerationBase: new THREE.Vector3(0, -80, 0),
 
     particleTexture: new THREE.TextureLoader().load(sparkImg),
 
     sizeTween: new Tween([0.5, 0.7, 1.3], [5, 40, 1]),
     opacityTween: new Tween([0.2, 0.7, 2.5], [0.75, 1, 0]),
     colorTween: new Tween([0.4, 0.8, 1.0], [new THREE.Vector3(0, 1, 1), new THREE.Vector3(0, 1, 0.6), new THREE.Vector3(0.8, 1, 0.6)]),
     blendStyle: THREE.AdditiveBlending,
 
     particlesPerSecond: 3000,
     particleDeathAge: 2.5,
     emitterDeathAge: 0.2
 };
 
 //candle 烛光效果
 export const candle = {
     positionStyle: Type.SPHERE,
     positionBase: new THREE.Vector3(0, 50, 0),
     positionRadius: 2,
 
     velocityStyle: Type.CUBE,
     velocityBase: new THREE.Vector3(0, 100, 0),
     velocitySpread: new THREE.Vector3(20, 0, 20),
 
     particleTexture: new THREE.TextureLoader().load(smokeparticleImg),
 
     sizeTween: new Tween([0, 0.3, 1.2], [20, 150, 1]),
     opacityTween: new Tween([0.9, 1.5], [1, 0]),
     colorTween: new Tween([0.5, 1.0], [new THREE.Vector3(0.02, 1, 0.5), new THREE.Vector3(0.05, 1, 0)]),
     blendStyle: THREE.AdditiveBlending,
 
     particlesPerSecond: 60,
     particleDeathAge: 1.5,
     emitterDeathAge: 60
 }
 
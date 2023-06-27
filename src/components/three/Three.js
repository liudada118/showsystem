import Stats from "three/examples/jsm/libs/stats.module.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
// import { SelectionBox } from 'three/addons/interactive/SelectionBox.js';
// import { SelectionHelper } from 'three/addons/interactive/SelectionHelper.js';
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { TextureLoader } from "three";
import { SelectionBox } from './SelectionBox.js';
import { SelectionHelper } from './SelectionHelper.js';
import {
  addSide,
  gaussBlur_1,
  interp1016,
  jet,
} from "../../assets/util/util";
// import { withData } from "./WithData";
import './index.scss'
import { obj } from "../../assets/util/config";
import { getPointCoordinate } from "./threeUtil.js";
const group = new THREE.Group();
const sitInit = 0;
const backInit = 0;
var newDiv
var animationRequestId
const sitnum1 = 16;
const sitnum2 = 32;
const sitInterp = 2;
const sitOrder = 4;
const backnum1 = 16;
const backnum2 = 32;
const backInterp = 2;
const backOrder = 4;
let controlsFlag = true;
var ndata = new Array(backnum1 * backnum2).fill(0), ndata1 = new Array(sitnum1 * sitnum2).fill(0);

let valuej1 = 500,
  valueg1 = 2,
  value1 = 5,
  valuel1 = 5,
  valuef1 = 5,
  valuej2 = 500,
  valueg2 = 2,
  value2 = 5,
  valuel2 = 5,
  valuef2 = 5,
  valuelInit1 = 1,
  valuelInit2 = 2;
let enableControls = true;
let isShiftPressed = false;


const Canvas = React.forwardRef((props, refs) => {
  let dataFlag = false;
  const changeDataFlag = () => {
    dataFlag = true;

  };
  let particles,
    particles1,
    material,
    backGeometry,
    sitGeometry,

    bigArr1 = new Array(backnum1 * backInterp * backnum2 * backInterp).fill(1),
    bigArrg1 = new Array(
      (backnum1 * backInterp + 2 * backOrder) *
      (backnum2 * backInterp + 2 * backOrder)
    ).fill(1),
    bigArrg1new = new Array(
      (backnum1 * backInterp + 2 * backOrder) *
      (backnum2 * backInterp + 2 * backOrder)
    ).fill(1),
    smoothBig1 = new Array(
      (backnum1 * backInterp + 2 * backOrder) *
      (backnum2 * backInterp + 2 * backOrder)
    ).fill(1),
    ndata1Num,
    ndataNum;

  let bigArr = new Array(sitnum1 * sitInterp * sitnum2 * sitInterp).fill(1);
  let bigArrg = new Array(
    (sitnum1 * sitInterp + sitOrder * 2) *
    (sitnum2 * sitInterp + sitOrder * 2)
  ).fill(1),
    bigArrgnew = new Array(
      (sitnum1 * sitInterp + sitOrder * 2) *
      (sitnum2 * sitInterp + sitOrder * 2)
    ).fill(1),
    smoothBig = new Array(
      (sitnum1 * sitInterp + sitOrder * 2) *
      (sitnum2 * sitInterp + sitOrder * 2)
    ).fill(1);
  let i = 0;
  let ws,
    wsPointData,
    ws1


  let container, stats;

  let camera, scene, renderer;
  let controls;
  let cube, chair, mixer, clips;
  const clock = new THREE.Clock();
  const ALT_KEY = 18;
  const CTRL_KEY = 17;
  const CMD_KEY = 91;
  const AMOUNTX = sitnum1 * sitInterp + sitOrder * 2;
  const AMOUNTY = sitnum2 * sitInterp + sitOrder * 2;
  const AMOUNTX1 = backnum1 * backInterp + backOrder * 2;
  const AMOUNTY1 = backnum2 * backInterp + backOrder * 2;
  const SEPARATION = 100;
  let group = new THREE.Group();

  let positions1;
  let colors1, scales1;
  let positions;
  let colors, scales;

  function init() {
    container = document.getElementById(`canvas`);
    // camera

    camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      150000
    );


    camera.position.z = 300;
    camera.position.y = 200;
    // camera.position.z = 0;
    // camera.position.y = 50;
    // camera.position.x = 100;

    // scene



    scene = new THREE.Scene();

    // model
    const loader = new GLTFLoader();

    // const selectionBox = new SelectionBox( camera, scene );
    // const selectHelper = new SelectionHelper( renderer, 'selectBox' );

    // document.addEventListener( 'pointerdown', function ( event ) {

    //   for ( const item of selectionBox.collection ) {

    //     item.material.emissive.set( 0x000000 );

    //   }

    //   selectionBox.startPoint.set(
    //     ( event.clientX / window.innerWidth ) * 2 - 1,
    //     - ( event.clientY / window.innerHeight ) * 2 + 1,
    //     0.5 );

    // } );


    // document.addEventListener( 'pointermove', function ( event ) {

    //   if ( selectHelper.isDown ) {

    //     for ( let i = 0; i < selectionBox.collection.length; i ++ ) {

    //       selectionBox.collection[ i ].material.emissive.set( 0x000000 );

    //     }

    //     selectionBox.endPoint.set(
    //       ( event.clientX / window.innerWidth ) * 2 - 1,
    //       - ( event.clientY / window.innerHeight ) * 2 + 1,
    //       0.5 );

    //     const allSelected = selectionBox.select();

    //     for ( let i = 0; i < allSelected.length; i ++ ) {

    //       allSelected[ i ].material.emissive.set( 0xffffff );

    //     }

    //   }

    // } );

    // document.addEventListener( 'pointerup', function ( event ) {

    //   selectionBox.endPoint.set(
    //     ( event.clientX / window.innerWidth ) * 2 - 1,
    //     - ( event.clientY / window.innerHeight ) * 2 + 1,
    //     0.5 );

    //   const allSelected = selectionBox.select();

    //   for ( let i = 0; i < allSelected.length; i ++ ) {

    //     allSelected[ i ].material.emissive.set( 0xffffff );

    //   }

    // } );

    // points  座椅

    initSet();
    initBack();
    // scene.add(group);
    group.rotation.x = -(Math.PI * 2) / 6
    group.position.x = -15
    group.position.y = -600
    group.position.z = -1000
    scene.add(group);
    const helper = new THREE.GridHelper(2000, 100);
    helper.position.y = -199;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    scene.add(helper);

    // lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 200, 10);
    scene.add(dirLight);
    const dirLight1 = new THREE.DirectionalLight(0xffffff);
    dirLight1.position.set(0, 10, 200);
    scene.add(dirLight1);

    // renderer

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.outputEncoding = THREE.sRGBEncoding;
    if (container.childNodes.length == 0) {
      container.appendChild(renderer.domElement);
    }

    renderer.setClearColor(0x000000);

    //FlyControls
    controls = new TrackballControls(camera, renderer.domElement);
    controls.dynamicDampingFactor = 0.2;
    controls.domElement = container;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN, // make pan the default instead of rotate
      MIDDLE: THREE.MOUSE.ZOOM,
      RIGHT: THREE.MOUSE.ROTATE,
    };
    controls.keys = [
      ALT_KEY, // orbit
      CTRL_KEY, // zoom
      CMD_KEY, // pan
    ];

    window.addEventListener("resize", onWindowResize);

    renderer.domElement.addEventListener(
      "click",
      () => {

      },
      false
    );

    const selectionBox = new SelectionBox(camera, scene);
    const selectHelper = new SelectionHelper(renderer, controls, 'selectBox');




    document.addEventListener('pointerdown', function (event) {

      for (const item of selectionBox.collection) {

        item.material.emissive?.set(0x000000);

      }

      selectionBox.startPoint.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        - (event.clientY / window.innerHeight) * 2 + 1,
        0.5);

      let arr = getPointCoordinate(particles , camera)

      newDiv = document.createElement('div');

      newDiv.classList.add('my-class');
      // 设置 <div> 的属性、内容或样式
      newDiv.style.backgroundColor = 'lightblue';
      // newDiv.style.padding = '10px';
      newDiv.style.width = `${100}px`
      newDiv.style.height = `${100}px`
      // newDiv.style.left = `${viewportPosition.x}px`
      // newDiv.style.top = `${viewportPosition.y}px`
      // newDiv.style.left = `${vector.x}px`
      // newDiv.style.top = `${vector.y}px`
      newDiv.style.left = `${arr[1].x}px`
      newDiv.style.top = `${arr[1].y}px`

      // 将 <div> 元素添加到页面中的某个元素中
      document.body?.appendChild(newDiv);

    });

    document.addEventListener('pointermove', function (event) {

      if (helper.isDown) {

        for (let i = 0; i < selectionBox.collection.length; i++) {

          selectionBox.collection[i].material.emissive.set(0x000000);

        }

        selectionBox.endPoint.set(
          (event.clientX / window.innerWidth) * 2 - 1,
          - (event.clientY / window.innerHeight) * 2 + 1,
          0.5);

        const allSelected = selectionBox.select();
        console.log(allSelected)
        for (let i = 0; i < allSelected.length; i++) {

          allSelected[i].material.emissive.set(0xffffff);

        }

      }

    });

    document.addEventListener('pointerup', function (event) {

      selectionBox.endPoint.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        - (event.clientY / window.innerHeight) * 2 + 1,
        0.5);

      const allSelected = selectionBox.select();
      console.log(allSelected)
      for (let i = 0; i < allSelected.length; i++) {

        allSelected[i].material.emissive?.set(0xffffff);

      }

    });

  }
  //   初始化座椅
  function initSet() {
    // const AMOUNTX = 1
    // const AMOUNTY = 1
    const numParticles = AMOUNTX * AMOUNTY;
    positions = new Float32Array(numParticles * 3);
    scales = new Float32Array(numParticles);
    colors = new Float32Array(numParticles * 3);
    let i = 0,
      j = 0;

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2 + ix * 20; // x
        positions[i + 1] = 0; // y
        positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z

        scales[j] = 1;
        colors[i] = 0 / 255;
        colors[i + 1] = 0 / 255;
        colors[i + 2] = 255 / 255;
        i += 3;
        j++;
      }
    }

    sitGeometry = new THREE.BufferGeometry();
    sitGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    function getTexture() {
      return new TextureLoader().load("");
    }
    // require("../../assets/images/circle.png")
    const spite = new THREE.TextureLoader().load("./circle.png");
    material = new THREE.PointsMaterial({
      vertexColors: true,
      transparent: true,
      //   color: 0xffffff,
      map: spite,
      size: 2,
    });
    sitGeometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));
    sitGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    particles = new THREE.Points(sitGeometry, material);

    particles.scale.x = 0.0062;
    particles.scale.y = 0.0062;
    particles.scale.z = 0.0062;


    // particles.rotation.x = Math.PI / 2;
    // particles.rotation.y = 0; //-Math.PI / 2;
    // particles.rotation.y = Math.PI 
    // particles.rotation.z = Math.PI
    // scene.add(particles);
    group.add(particles);


    // 
    const position = particles.geometry.attributes.position;

    const screenCoordinates = [];
    const dataArr = [0, 2879]
    for (let i = 0; i < dataArr.length; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(position, dataArr[i]); // 获取顶点的世界坐标
      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([vertex.x, vertex.y, vertex.z])
      const colors = new Float32Array([1, 0, 0])
      console.log(vertices, 'vertices')
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const point = new THREE.Points(geometry, material);

      group.add(point);
      point.scale.x = 0.0062;
      point.scale.y = 0.0062;
      point.scale.z = 0.0062;
      point.position.x = -15
      point.position.y = -1000  
      point.position.z = 230

      const vector = new THREE.Vector3();
      var widthHalf = 0.5 * window.innerWidth;  //此处应使用画布长和宽
      var heightHalf = 0.5 * window.innerHeight;

      point.updateMatrixWorld(); // 函数updateMatrix()和updateMatrixWorld(force)将根据position，rotation或quaternion，scale参数更新matrix和matrixWorld。updateMatrixWorld还会更新所有后代元素的matrixWorld，如果force值为真则调用者本身的matrixWorldNeedsUpdate值为真。

      //getPositionFromMatrix()方法已经删除,使用setFromMatrixPosition()替换, setFromMatrixPosition方法将返回从矩阵中的元素得到的新的向量值的向量
      vector.setFromMatrixPosition(point.matrixWorld);

      //projectOnVector方法在将当前三维向量(x,y,z)投影一个向量到另一个向量,参数vector(x,y,z). 
      vector.project(camera);

      vector.x = (vector.x * widthHalf) + widthHalf;
      vector.y = -(vector.y * heightHalf) + heightHalf;
      console.log(vector.x, vector.y,)
    }
    console.log(group)
  }
  // 初始化靠背
  function initBack() {
    // points 靠背
    const numParticles1 = AMOUNTX1 * AMOUNTY1;

    positions1 = new Float32Array(numParticles1 * 3);
    scales1 = new Float32Array(numParticles1);
    colors1 = new Float32Array(numParticles1 * 3);
    let k = 0,
      l = 0;

    for (let ix = 0; ix < AMOUNTX1; ix++) {
      for (let iy = 0; iy < AMOUNTY1; iy++) {
        positions1[k] = ix * SEPARATION - (AMOUNTX1 * SEPARATION) / 2; // x
        positions1[k + 1] = 0; // y
        positions1[k + 2] = iy * SEPARATION - (AMOUNTY1 * SEPARATION) / 2; // z

        scales1[l] = 1;
        colors1[k] = 0 / 255;
        colors1[k + 1] = 0 / 255;
        colors1[k + 2] = 255 / 255;
        k += 3;
        l++;
      }
    }

    backGeometry = new THREE.BufferGeometry();
    backGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions1, 3)
    );
    backGeometry.setAttribute("scale", new THREE.BufferAttribute(scales1, 1));
    backGeometry.setAttribute("color", new THREE.BufferAttribute(colors1, 3));
    const spite = new THREE.TextureLoader().load("./circle.png");
    const material1 = new THREE.PointsMaterial({
      vertexColors: true,
      transparent: true,
      map: spite,
      size: 2,
    });

    particles1 = new THREE.Points(backGeometry, material1);
    particles1.geometry.attributes.position.needsUpdate = true;
    particles1.geometry.attributes.color.needsUpdate = true;

    particles1.scale.x = 0.0062;
    particles1.scale.y = 0.0062;
    particles1.scale.z = 0.0062;


    particles1.position.x = 30;
    particles1.rotation.x = Math.PI / 2
    // particles1.rotation.y = Math.PI 
    // particles1.rotation.z = Math.PI
    // scene.add(particles1);
    group.add(particles1);
  }
  //

  function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;

    // camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  //模型动画

  function animate() {
    animationRequestId = requestAnimationFrame(animate);
    const date = new Date().getTime();

    render();
  }


  //  更新靠背数据
  function backRenew() {

    // valueg2 = 2
    // valuej2 = 500 
    // value2 =2
    interp1016(ndata, bigArr1, backnum1, backnum2, backInterp);
    //高斯滤波

    let bigarr1 = [];

    bigarr1 = addSide(
      bigArr1,
      backnum2 * backInterp,
      backnum1 * backInterp,
      backOrder,
      backOrder
    );

    gaussBlur_1(
      bigarr1,
      bigArrg1,
      backnum2 * backInterp + 2 * backOrder,
      backnum1 * backInterp + 2 * backOrder,
      valueg2
    );

    let k = 0,
      l = 0;

    for (let ix = 0; ix < AMOUNTX1; ix++) {
      for (let iy = 0; iy < AMOUNTY1; iy++) {
        const value = bigArrg1[l] * 10;

        //柔化处理smooth
        smoothBig1[l] = smoothBig1[l] + (value - smoothBig1[l] + 0.5) / valuel2;

        positions1[k + 1] = smoothBig1[l] / value2; // y
        const rgb = jet(0, valuej2, smoothBig1[l]);

        colors1[k] = rgb[0] / 255;
        colors1[k + 1] = rgb[1] / 255;
        colors1[k + 2] = rgb[2] / 255;
        k += 3;
        l++;
      }
    }

    particles1.geometry.attributes.position.needsUpdate = true;
    particles1.geometry.attributes.color.needsUpdate = true;

    backGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions1, 3)
    );
    backGeometry.setAttribute("color", new THREE.BufferAttribute(colors1, 3));
  }

  //  更新座椅数据
  function sitRenew() {

    // valueg1 = 2
    // valuej1 = 500 
    // value1 =2

    interp1016(ndata1, bigArr, sitnum1, sitnum2, sitInterp);
    let bigArrs = addSide(
      bigArr,
      sitnum2 * sitInterp,
      sitnum1 * sitInterp,
      sitOrder,
      sitOrder
    );

    gaussBlur_1(
      bigArrs,
      bigArrg,
      sitnum2 * sitInterp + sitOrder * 2,
      sitnum1 * sitInterp + sitOrder * 2,
      valueg1
    );

    let k = 0,
      l = 0;

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const value = bigArrg[l] * 10;

        //柔化处理smooth
        smoothBig[l] = smoothBig[l] + (value - smoothBig[l] + 0.5) / valuel1;

        positions[k] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
        positions[k + 1] = smoothBig[l] / value1; // y
        positions[k + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z
        const rgb = jet(0, valuej1, smoothBig[l]);

        colors[k] = rgb[0] / 255;
        colors[k + 1] = rgb[1] / 255;
        colors[k + 2] = rgb[2] / 255;

        k += 3;
        l++;
      }
    }

    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.color.needsUpdate = true;

    sitGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    sitGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  }

  function render() {

    backRenew();
    sitRenew();
    if (enableControls && !isShiftPressed) {
      controls.update();
    }

    renderer.render(scene, camera);
  }

  //   靠背数据
  function backData(prop) {
    const {
      wsPointData: wsPointData,
      valuej,
      valueg,
      value,
      valuel,
      valuef,
      valuelInit,
    } = prop;
    // valuej2 = valuej;
    // valueg2 = valueg;
    // value2 = value;
    // valuel2 = valuel;
    // valuef2 = valuef;
    // valuelInit2 = valuelInit;
    //处理空数组

    ndata = wsPointData

    // 修改线序 坐垫
    ndataNum = ndata.reduce((a, b) => a + b, 0);
    ndata = ndata.map((a, index) => (a - valuef2 < 0 ? 0 : a - valuef2));

    // if (ndataNum < valuelInit) {
    //   ndata = new Array(120).fill(1);
    // }
  }
  function backValue(prop) {
    const { valuej, valueg, value, valuel, valuef, valuelInit } = prop;
    if (valuej) valuej2 = valuej;
    if (valueg) valueg2 = valueg;
    if (value) value2 = value;
    if (valuel) valuel2 = valuel;
    if (valuef) valuef2 = valuef;

    if (valuelInit) valuelInit2 = valuelInit;
    ndata = ndata.map((a, index) => (a - valuef2 < 0 ? 0 : a - valuef2));
    ndataNum = ndata.reduce((a, b) => a + b, 0);
    // if (ndataNum < valuelInit2) {
    //   ndata = new Array(120).fill(1);
    // }
  }
  // 座椅数据
  function sitValue(prop) {

    const { valuej, valueg, value, valuel, valuef, valuelInit } = prop;
    if (valuej) valuej1 = valuej;
    if (valueg) valueg1 = valueg;
    if (value) value1 = value;
    if (valuel) valuel1 = valuel;
    if (valuef) valuef1 = valuef;
    if (valuelInit) valuelInit1 = valuelInit;
    ndata1 = ndata1.map((a, index) => (a - valuef1 < 0 ? 0 : a - valuef1));

    ndata1Num = ndata1.reduce((a, b) => a + b, 0);
    if (ndata1Num < valuelInit1) {
      ndata1 = new Array(sitnum1 * sitnum2).fill(0);
    }

  }
  function sitData(prop) {

    if (i < 50) {
      i++;
    } else {
      i = 0;
    }
    const {
      wsPointData: wsPointData,
      valuej,
      valueg,
      value,
      valuel,
      valuef,
      valuelInit,
    } = prop;

    // valuej1 = valuej;
    // valueg1 = valueg;
    // value1 = value;
    // valuel1 = valuel;
    // valuef1 = valuef;
    // ndata1 = [];
    ndata1 = wsPointData;

    // valuelInit1 = valuelInit;
    // 修改线序 坐垫
    ndata1 = ndata1.map((a, index) => (a - valuef1 < 0 ? 0 : a - valuef1));

    ndata1Num = ndata1.reduce((a, b) => a + b, 0);

    if (ndata1Num < valuelInit) {
      ndata1 = new Array(sitnum1 * sitnum2).fill(0);
    }

  }

  function changeGroupRotate(obj) {

    if (typeof obj.x === 'number') {
      group.rotation.x = -(Math.PI * 2 + (obj.x) * 4) / 12
    }
    if (typeof obj.y === 'number') {
      group.rotation.y = -(obj.y) * 6 / 12
    }
  }

  function reset() {

    camera.position.z = 300;
    camera.position.y = 200;
    camera.position.x = 0;
    camera.rotation._x = 0;
    camera.rotation._y = 0;
    camera.rotation._z = 0;

    // camera = new THREE.PerspectiveCamera(
    //   40,
    //   window.innerWidth / window.innerHeight,
    //   1,
    //   150000
    // );


    // camera.position.z = 300;
    // camera.position.y = 200;

    // camera.position.set(0,200,300)

    // renderer.render(scene, camera);

    group.rotation.x = -(Math.PI * 2) / 12
    group.rotation.y = 0
    group.position.x = -15
    group.position.y = 150
    group.position.z = 230
  }

  useImperativeHandle(refs, () => ({
    backData: backData,
    sitData: sitData,
    changeDataFlag: changeDataFlag,
    sitValue,
    backValue,
    backRenew,
    sitRenew,
    changeGroupRotate,
    reset
    // actionAll: actionAll,
    // actionSit: actionSit,
    // actionBack: actionBack,
  }));
  //   视图数据

  function onKeyDown(event) {
    if (event.key === 'Shift') {
      // enableControls = false;
      // isShiftPressed = true;

      controls.mouseButtons = null
      controls.keys = null
    }
  }

  // 按键放开事件处理函数
  function onKeyUp(event) {
    if (event.key === 'Shift') {
      // enableControls = true;
      // isShiftPressed = false;
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN, // make pan the default instead of rotate
        MIDDLE: THREE.MOUSE.ZOOM,
        RIGHT: THREE.MOUSE.ROTATE,
      };
      controls.keys = [
        ALT_KEY, // orbit
        CTRL_KEY, // zoom
        CMD_KEY, // pan
      ];
    }
  }





  const changeValue = (obj) => { };
  useEffect(() => {
    // 靠垫数据

    init();
    // window.addEventListener("mousemove", () => {}, false);
    animate();


    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      cancelAnimationFrame(animationRequestId);
    };
  }, []);
  return (
    <div>
      <div
        // style={{ width: "100%", height: "100%" }}
        id={`canvas`}
      ></div>
    </div>
  );
});
export default Canvas;

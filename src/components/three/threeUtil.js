import * as THREE from "three";

export function getPointCoordinate(particles, camera) {
    const position = particles.geometry.attributes.position;
    const screenCoordinates = [];
    const dataArr = [0, 2879]
    for (let i = 0; i < dataArr.length; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(position, dataArr[i]); // 获取顶点的世界坐标
        const geometry = new THREE.BufferGeometry();
        const vertices = new THREE.Vector3([vertex.x, vertex.y, vertex.z])
        console.log(vertices, 'vertices')
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial({ color: 0xff0000 });
        const point = new THREE.Points(geometry, material);

        point.scale.x = 0.0062;
        point.scale.y = 0.0062;
        point.scale.z = 0.0062;
        if (i == 0) {
            point.position.x = -15 - 2000 * 0.0062
            point.position.y = -600
            point.position.z = -1000 - 3600 * 0.0062
            point.rotation.x = -(Math.PI * 2) / 12
        } else {
            point.position.x = -15 + 2000 * 0.0062
            point.position.y = -600
            point.position.z = -1000 + 3600 * 0.0062
            point.rotation.x = -(Math.PI * 2) / 12
        }

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
        screenCoordinates.push(vector)
    }
    return screenCoordinates
}
// Simple parametric building demo using three.js
const container = document.getElementById('container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

camera.position.set(30, 40, 60);
camera.lookAt(0, 0, 0);

const ambient = new THREE.AmbientLight(0xaaaaaa);
scene.add(ambient);
const directional = new THREE.DirectionalLight(0xffffff, 0.8);
directional.position.set(50, 100, 50);
scene.add(directional);

const params = {
    floors: 10,
    towerWidth: 10,
    towerDepth: 10,
    scenario: 'Прямой',
    facadeColor: '#8fbcd4'
};

let buildingGroup;
function createBuilding() {
    if (buildingGroup) {
        scene.remove(buildingGroup);
    }
    buildingGroup = new THREE.Group();
    const floorHeight = 3;
    for (let i = 0; i < params.floors; i++) {
        let scale = 1;
        if (params.scenario === 'Ступенчатый') {
            scale = 1 - 0.1 * Math.floor(i / 5);
        } else if (params.scenario === 'Сужение') {
            scale = 1 - (i / params.floors) * 0.5;
        }
        const geometry = new THREE.BoxGeometry(
            params.towerWidth * scale,
            floorHeight,
            params.towerDepth * scale
        );
        const material = new THREE.MeshLambertMaterial({ color: params.facadeColor });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = floorHeight / 2 + i * floorHeight;
        buildingGroup.add(mesh);
    }
    scene.add(buildingGroup);
}

createBuilding();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// dat.GUI controls
const gui = new dat.GUI();

gui.add(params, 'floors', 1, 50, 1).name('Этажей').onChange(createBuilding);

gui.add(params, 'towerWidth', 5, 30, 1).name('Ширина').onChange(createBuilding);

gui.add(params, 'towerDepth', 5, 30, 1).name('Глубина').onChange(createBuilding);

gui.add(params, 'scenario', ['Прямой', 'Ступенчатый', 'Сужение']).name('Сценарий').onChange(createBuilding);

gui.addColor(params, 'facadeColor').name('Цвет фасада').onChange(createBuilding);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


window.onload = function init()
{
	//------------------------------------------------------
	// Canvas & threeJs settings
	//------------------------------------------------------
	const canvas = document.getElementById( "gl-canvas" );
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const renderer = new THREE.WebGLRenderer({canvas});
	renderer.setSize(canvas.width,canvas.height);

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0xb8f8fb);

	// renderer shadow settings
	renderer.shadowMap.enabled = true
	renderer.shadowMapSoft = true;
	renderer.shadowMapType = THREE.PCFSoftShadowMap;

	//------------------------------------------------------
	// Camera settings
	//------------------------------------------------------
	camera = new THREE.PerspectiveCamera(45,canvas.width / canvas.height, 1, 1000);
	camera.position.x = 60;
	camera.position.y = 20;
	camera.position.z = 60;

	// !! OrbitContols 사용시 시점 초기화 !!
	const controls = new THREE.OrbitControls(camera, renderer.domElement);
	// start point
	camera.lookAt(50, 0, 50)

	//------------------------------------------------------
	// Light settings
	//------------------------------------------------------
	hlight = new THREE.AmbientLight(0x404040,3);

	const dirLight = new THREE.DirectionalLight(0xffffff, 1);
	dirLight.position.set(120, 300, 120);

	// shadow settings
	dirLight.castShadow = true;
  	dirLight.shadow.camera.top = 200;
  	dirLight.shadow.camera.bottom = -200;
  	dirLight.shadow.camera.left = - 200;
  	dirLight.shadow.camera.right = 200;
  	dirLight.shadow.camera.near = 0.1;
  	dirLight.shadow.camera.far = 500;
	dirLight.shadow.bias = -0.01;

	scene.add(hlight);
	scene.add(dirLight);

	//------------------------------------------------------
	// Load fields & objects
	//------------------------------------------------------
	let FieldObj = new GameObject();
	FieldObj.load(scene, "./model/forest_low_poly/scene.gltf", getFieldPos(), [5,5,5]);

	let TreasureObj = new GameObject();
	TreasureObj.load(scene, "./model/gold_coin_material/scene.gltf", getTreasurePos(), [0.05,0.05,0.05]);

	//------------------------------------------------------
	// Treasure color changing test
	//------------------------------------------------------
	var colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffffff];
	var nextColor = 0;
	// if press a button
	document.addEventListener('keydown', (event)=>{
		if(event.key == 'a'){
			// change all treasures colors
			for(i in TreasureObj.objectArray){
				// change color
				TreasureObj.objectArray[i].traverse( function ( object ) {
					if (object.isMesh) {
						object.material.color = new THREE.Color(colors[nextColor]);
					}
				} );
			}
			nextColor = (nextColor+1) % colors.length;
		}
	})

	console.log(canvas);
	animate(renderer, scene, camera);
}

/////////////////////////////////////////////////
//
// GameObject class
//
/////////////////////////////////////////////////]

class GameObject
{
	constructor()
	{
		this.objectArray = new Array();
	};

	/**
	 * 
	 * @param {ThreeJsScene} scene 
	 * @param {string} gltfLoc 
	 * @param {float[][]} posArray 
	 * @param {float[]} scale 
	 */
	load(scene, gltfLoc, posArray, scale)
	{
		var i = 0;
		for(i in posArray){
			this.loadGltf(scene, gltfLoc, posArray[i], scale, this.objectArray);
		}
	}

	/**
	 * 
	 * @param {string} gltfLoc 
	 * @param {ThreeJsScene} scene 
	 * @param {float[]} pos
	 * @param {float[]} scale
	 * @param {Array} objectArray
	 */
	loadGltf(scene, gltfLoc, pos, scale, objectArray)
	{
		const loader = new THREE.GLTFLoader();
		loader.load(gltfLoc, function(gltf){
			// gltf shadow
			gltf.scene.traverse( function ( object ) {
				if (object.isMesh) {
					object.receiveShadow = true;
					object.castShadow = true;
				}
			} );

			var obj = gltf.scene.children[0];
			obj.position.set(pos[0], pos[1], pos[2]);
			obj.scale.set(scale[0], scale[1], scale[2]);	
			objectArray.push(obj);

			scene.add(gltf.scene);
		}, undefined, function (error) {
			console.error(error);
		});
	}
}

/////////////////////////////////////////////////
//
// Animate function
//
/////////////////////////////////////////////////

/**
 * 
 * @param {ThreeJsRenderer} renderer 
 * @param {ThreeJSScene} scene 
 * @param {ThreeJsCamera} camera 
 */
function animate(renderer, scene, camera) 
{
	renderer.render(scene, camera);
	requestAnimationFrame(()=>animate(renderer, scene, camera));
}

/////////////////////////////////////////////////
//
// Field postions
//
/////////////////////////////////////////////////

/**
 * 
 * @returns {float[]}
 */
function getFieldPos()
{
	return [
		[0,-23,0],
		[85,-23,0],
		[0,-23,85],
		[85,-23,85],
	];
}

/////////////////////////////////////////////////
//
// Object postions
//
/////////////////////////////////////////////////

/**
 * 
 * @returns {float[]}
 */
function getTreasurePos()
{
	return[
		[20,0,-30],
		[-30,0,40],
		[12,0,110],
		[103,0,103],
		[103,0,32],
	];
}
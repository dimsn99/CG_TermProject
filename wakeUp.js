
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
	scene.background = new THREE.Color(0x000000);

	//------------------------------------------------------
	// Camera settings
	//------------------------------------------------------
	camera = new THREE.PerspectiveCamera(75,canvas.width / canvas.height,0.1, 1000);
	camera.rotation.y = 45/180*Math.PI;
	camera.position.x = 150;
	camera.position.y = 150;
	camera.position.z = 150;

	const controls = new THREE.OrbitControls(camera, renderer.domElement);

	//------------------------------------------------------
	// Light settings
	//------------------------------------------------------
	hlight = new THREE.AmbientLight (0x404040,5);
	scene.add(hlight);

	//------------------------------------------------------
	// Load field & objects
	//------------------------------------------------------
	load(scene);

	animate(renderer, scene, camera);
}

/////////////////////////////////////////////////
//
// Object load functions
//
/////////////////////////////////////////////////

/**
 * 
 * @param {ThreeJsScene} scene 
 */
function load(scene)
{
	//------------------------------------------------------
	// Load field
	//------------------------------------------------------
	loadGltf('./model/field_of_flowers/scene.gltf', scene, [0,0,0], [1,1,1]);

	//------------------------------------------------------
	// Load objects
	//------------------------------------------------------

	// Load trees
	const treePos = getTreePos()
	for(i in treePos){
		loadGltf('./model/stylized_tree/scene.gltf', scene, treePos[i], [30,30,30]);
	}

	// Load wells
	const wellPos = getWellPos();
	for(i in wellPos){
		loadGltf('./model/ancient_well/scene.gltf', scene, wellPos[i], [0.003,0.003,0.003]);
	}

	// Load columns
	const columnPos = getColumnPos();
	for(i in columnPos){
		loadGltf('./model/ancient_column/scene.gltf', scene, columnPos[i], [0.02,0.02,0.02]);
	}
}

/**
 * 
 * @param {string} gltfLoc 
 * @param {ThreeJsScene} scene 
 * @param {float[]} pos
 * @param {float[]} scale
 */
function loadGltf(gltfLoc, scene, pos, scale)
{
	const loader = new THREE.GLTFLoader();
	loader.load(gltfLoc, function(gltf){
		obj = gltf.scene.children[0];

		obj.position.set(pos[0], pos[1], pos[2]);
		obj.scale.set(scale[0], scale[1], scale[2]);	

		scene.add(gltf.scene);
	}, undefined, function (error) {
		console.error(error);
	});
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
// Object postions
//
/////////////////////////////////////////////////

/**
 * 
 * @returns {float[]}
 */
function getTreePos()
{
	return [
		[74, 0, -92],
		[17, 0, 7],
		[-84, 0, 70],
		[-10, 0, 23],
		[-65, 0, -7],
		[16, 0, -8],
		[-71, 0, 91],
		[4, 0, 22],
		[-62, 0, -20],
		[77, 0, 52],
		[67, 0, 3],
		[-11, 0, 15],
		[58, 0, 32],
		[-26, 0, -51],
		[8, 0, -28],
		[-72, 0, 0],
		[69, 0, 32],
		[82, 0, -48],
		[37, 0, -86],
		[70, 0, 65],
		[11, 0, -30],
		[7, 0, -75],
		[-1, 0, 86],
		[-79, 0, 4],
		[-57, 0, 67],
		[49, 0, -52],
		[-81, 0, -15],
		[6, 0, 10],
		[-14, 0, -97],
		[-54, 0, 92],
		[64, 0, 34],
		[55, 0, -36],
		[95, 0, -88],
		[-59, 0, -76],
		[-100, 0, -79],
		[5, 0, -49],
		[-32, 0, 58],
		[90, 0, -89],
		[82, 0, 41],
		[16, 0, 16],
		[85, 0, 82],
		[53, 0, -26],
		[-88, 0, -67],
		[-71, 0, 22],
		[-96, 0, -45],
		[-27, 0, -87],
		[-17, 0, -18],
		[45, 0, 14],
		[59, 0, 52],
		[-9, 0, -51],
		[13, 0, 81],
		[95, 0, 11],
		[100, 0, 33],
		[-70, 0, 14],
		[32, 0, -29],
		[-20, 0, 63],
		[-14, 0, 20],
		[-9, 0, 0],
		[-97, 0, 57],
		[-48, 0, -31],
		[-17, 0, -65],
		[-66, 0, 98],
		[-29, 0, 88],
		[59, 0, 44],
		[81, 0, 64],
		[-1, 0, -37],
		[-24, 0, -41],
		[-30, 0, -70],
		[-84, 0, -28],
		[-16, 0, -18],
		[-34, 0, 50],
		[-18, 0, -41],
		[-83, 0, -40],
		[94, 0, 6],
		[13, 0, 60],
		[-46, 0, 34],
		[-46, 0, -86],
		[-16, 0, -2],
		[39, 0, 85],
		[80, 0, 18],
		[-36, 0, -83],
		[-45, 0, 5],
		[-10, 0, 7],
		[-58, 0, -46],
		[-59, 0, 32],
		[23, 0, -18],
		[5, 0, 62],
		[-87, 0, 64],
		[-49, 0, -67],
		[63, 0, -21],
		[-10, 0, 17],
		[59, 0, -19],
		[-62, 0, 34],
		[-80, 0, -53],
		[48, 0, 79],
		[-30, 0, 20],
		[47, 0, 48],
		[50, 0, 67],
		[69, 0, 97],
		[83, 0, 11],
	];
}

/**
 * 
 * @returns {float[]}
 */
function getWellPos()
{
	return [
		[44, 0, -55],
		[4, 0, -1],
		[-82, 0, 81],
		[-28, 0, -50],
	];
}

/**
 * 
 * @returns {float []}
 */
function getColumnPos()
{
	return [
		[-68, 0, 26],
		[-41, 0, 93],
		[-31, 0, -10],
		[-77, 0, -89],
		[53, 0, -11],
		[48, 0, 34],
		[88, 0, -84],
		[-37, 0, -3],
		[19, 0, -82],
		[7, 0, 28],
	];
}
const CAMERA_INIT_X = 10;
const CAMERA_INIT_Y = 30;
const CAMERA_INIT_Z = 20;

const PLAYER_INIT_X = 35;
const PLAYER_INIT_Y = 0.6;
const PLAYER_INIT_Z = 35;

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

	// Prespective Camera
	const camera = new THREE.PerspectiveCamera(45,canvas.width / canvas.height, 1, 1000);
	camera.position.x = CAMERA_INIT_X;
	camera.position.y = CAMERA_INIT_Y;
	camera.position.z = CAMERA_INIT_Z;

	// Orbit Controls
	const controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.target = new THREE.Vector3(PLAYER_INIT_X, PLAYER_INIT_Y, PLAYER_INIT_Z);
	controls.enabled = false;
	controls.update()

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
	// Load player object
	//------------------------------------------------------
	let PlayerObj = new PlayerObject();
	var playerPos = [[PLAYER_INIT_X, PLAYER_INIT_Y, PLAYER_INIT_Z]]
	PlayerObj.load(scene, "./model/character_model/scene.gltf", playerPos, [0.03,0.03,0.03]);

	//------------------------------------------------------
	// Enable keyboard
	//------------------------------------------------------
	const Clock = new THREE.Clock();
	const Keyboard = new KeyboardControl();
	Keyboard.keyboardState();

	//------------------------------------------------------
	// Animate
	//------------------------------------------------------
	function run(){
		try{
			// Keyboard control
			PlayerObj.control(Clock, camera, controls, Keyboard.keys);

			// Collision detection
			// 함수 (충돌 확인할 게임 오브젝트, 충돌 확인할 구역 크기, 충돌 시 실행할 함수)
			PlayerObj.checkCollision(TreasureObj, 3, (object)=>{	
				// 여기에서부터 플레이어 오브젝트가 보물 오브젝트에 닿았다면 실행할 내용
				// 플레이어와 충돌한 오브젝트는 object.~ 로 접근 가능

				console.log('detect');
				console.log(object.position); // 충돌 오브젝트 접근 예시
			});
		}catch(e){ console.log(e) }

		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(run);
	}	

	requestAnimationFrame(run);
}

/////////////////////////////////////////////////
//
// GameObject class
//
/////////////////////////////////////////////////

class GameObject
{
	constructor()
	{
		this.objectArray = new Array();
		this.mixerArray = new Array();
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
			this.loadGltf(scene, gltfLoc, posArray[i], scale, this.objectArray, this.mixerArray);
		}
	}

	/**
	 * 
	 * @param {string} gltfLoc 
	 * @param {ThreeJsScene} scene 
	 * @param {float[]} pos
	 * @param {float[]} scale
	 * @param {Array} objectArray
	 * @param {Array} mixerArray
	 */
	loadGltf(scene, gltfLoc, pos, scale, objectArray, mixerArray)
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

			// animation
			if(gltf.animations[0] != undefined){
				var mixer = new THREE.AnimationMixer(gltf.scene);
        		const action = mixer.clipAction(gltf.animations[0]);
        		action.play()

				mixerArray.push(mixer);
			}

		},undefined,function (error) {
			console.error(error);
		});
	}

	/**
	 * 
	 * @param {int} objectNum 
	 * @param {ThreeJsColor} color 
	 */
	changeColor(objectNum, color)
	{
		this.objectArray[objectNum].traverse( function ( object ) {
			if (object.isMesh) {
				object.material.color = new THREE.Color(color);
			}
		} );
	}

	/**
	 * 
	 * @param {int} objectNum 
	 * @param {float[]} pos 
	 */
	changePosition(objectNum, pos)
	{
		this.objectArray[objectNum].position.set(pos[0], pos[1], pos[2]);
	}
	
	/**
	 * 
	 * @param {int} objectNum 
	 * @param {float[]} value 
	 */
	move(objectNum, value)
	{
		var objPos = this.objectArray[objectNum].position
		var x = objPos.x + value[0];
		var y = objPos.y + value[1];
		var z = objPos.z + value[2];

		objPos.set(x, y, z);
	}
}

/////////////////////////////////////////////////
//
// PlayerObject class
//
/////////////////////////////////////////////////

class PlayerObject extends GameObject
{
	constructor()
	{
		super();
	}

	/**
	 * 
	 * @param {ThreeJsColock} Clock 
	 * @param {ThreeJsCamera} camera 
	 * @param {ThreeJsOrbitControls} controls 
	 * @param {Set} keys
	 */
	control(Clock, camera, controls, keys)
	{
		const axis = new THREE.Vector3(0,0,1);
		const speed = 0.4;
		const rotSpeed = 0.05;
		var Obj3d =  this.objectArray[0];

		// Update camera target & position
		controls.target = Obj3d.position;
		camera.position.x = Obj3d.position.x - PLAYER_INIT_X + CAMERA_INIT_X;
		camera.position.y = Obj3d.position.y - PLAYER_INIT_Y + CAMERA_INIT_Y;
		camera.position.z = Obj3d.position.z - PLAYER_INIT_Z + CAMERA_INIT_Z;

		// Animation
		if(keys.size != 0)
			this.mixerArray[0].update(Clock.getDelta());
	
		var key = null;
		for(key of keys){
			// Forward
			if(key == 'w'){
				Obj3d.translateY(-speed);
			}
			// Back
			if(key == 's'){
				Obj3d.translateY(speed);
			}
			// Left Rotation
			if(key == 'a'){
				Obj3d.rotateOnAxis(axis,rotSpeed);
			}
			// Right Rotation
			if(key =='d'){
				Obj3d.rotateOnAxis(axis,-rotSpeed);
			}
		}

		// Map Border
		if(Obj3d.position.x < -45){
			Obj3d.position.x = -45;
		}
		if(Obj3d.position.x > 130){
			Obj3d.position.x = 130;
		}
		if(Obj3d.position.z < -50){
			Obj3d.position.z = -50;
		}
		if(Obj3d.position.z > 135){
			Obj3d.position.z = 135;
		}
	}

	/**
	 * 
	 * @param {GameObject} Other 
	 * @param {float} collisionSize
	 * @param {function} func 
	 */
	checkCollision(Other, collisionSize, func)
	{
		const COL_SIZE = collisionSize;

		const thisX = this.objectArray[0].position.x;
		const thisZ = this.objectArray[0].position.z;

		// Collision detection
		for(var i in Other.objectArray){
			const otherX = Other.objectArray[i].position.x;
			const otherZ = Other.objectArray[i].position.z;

			if( otherX - COL_SIZE < thisX && thisX < otherX + COL_SIZE &&
				otherZ - COL_SIZE < thisZ && thisZ < otherZ + COL_SIZE ){

				// Function
				func(Other.objectArray[i]);
			}
		}
	}
}

/////////////////////////////////////////////////
//
// Keyboard Class
//
/////////////////////////////////////////////////

class KeyboardControl{
	constructor()
	{
		this.keys = new Set();
	}

	keyboardState()
	{
		var keys = this.keys;
		window.addEventListener('keydown', (event)=>{
			keys.add(event.key);
		});
		window.addEventListener('keyup', (event)=>{
			keys.delete(event.key);
		});
	}
}

/////////////////////////////////////////////////
//
// Functions
//
/////////////////////////////////////////////////



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
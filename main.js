///Laura Gabriela Chaves
///Brahian David Salazar

//Variables
var WIDTH = window.innerWidth*1;
var HEIGHT = window.innerHeight;
var container;
var camara,camara_1,camara_2,camara_3,scene,sphere,textura,ambientLight,point_light,pointLight_1,spotLight,cubeCamera2;
var controls;
var video, videoImage, videoImageContext, videoTexture;
var container,stats;



//Render
var Render=new THREE.WebGLRenderer({ antialias: true });
Render.shadowMapEnabled = true;

init();
animate();


function normalize(objeto) {

    objeto.computeBoundingBox();

    var center = objeto.boundingSphere.center;
    var radius = objeto.boundingSphere.radius;

    var s = radius === 0 ? 1 : 1.0 / radius;

    var matrix = new Matrix4();
    matrix.set(
	s, 0, 0, - s * center.x,
	0, s, 0, - s * center.y,
	0, 0, s, - s * center.z,
	0, 0, 0, 1
    );

    objeto.applyMatrix( matrix );

    return objeto;

}

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    //Camara para visualizar la escena
    camara_1 = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camara_2 = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camara_3 = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    //camara = new THREE.OrthographicCamera( window.width / - 2, window.width / 2, window.height / 2, window.height / - 2, 1, 1000 );
    camara_1.position.z = 150;
    camara_2.position.x=150;
    camara_3.position.y=150;

     camara= camara_1;
    //camara.position.y = 100;
    
    //camara.fov = 90;

    //Render del tamaño de la ventaña
    Render.setSize( window.innerWidth, window.innerHeight );
    //Se agrega el render al documento html
    container.appendChild( Render.domElement );

    //La escena
    scene = new THREE.Scene();

    //Luces
    ambientLight = new THREE.AmbientLight( 0xF2F5A9, 0.4 );
    scene.add( ambientLight );
    point_light = new THREE.PointLight( 0xff0000, 1, 100 );
    point_light.position.set( 50, 50, 50 );
    scene.add( point_light );

    pointLight_1 = new THREE.PointLight( 0xA9E2F3, 0.8 );
    var pointLight_2 = new THREE.PointLight( 0x0080FF, 0.8 );
    var pointLight_3 = new THREE.PointLight( 0xF5A9A9, 0.8 );
    camara_1.add( pointLight_1 );

     spotLight = new THREE.SpotLight( 0xffffff );
     spotLight.position.set( 100, 1000, 100 );

     spotLight.castShadow = true;

     spotLight.shadow.mapSize.width = 1024;
     spotLight.shadow.mapSize.height = 1024;

     spotLight.shadow.camera.near = 500;
     spotLight.shadow.camera.far = 4000;
     spotLight.shadow.camera.fov = 30;

     scene.add( spotLight )

    scene.add( camara );
    //sonido 
    /*var listener = new THREE.AudioListener();
				camara.add( listener );
	var audioLoader = new THREE.AudioLoader();
				var mesh1 = new THREE.Mesh( sphere, Material_plano );
				mesh1.position.set( -250, 30, 0 );
				scene.add( mesh1 );
				var sound1 = new THREE.PositionalAudio( listener );
				audioLoader.load( 'sounds/nelly.ogg', function( buffer ) {
					sound1.setBuffer( buffer );
					sound1.setRefDistance( 20 );
					sound1.play();
				});
				mesh1.add( sound1 );*/


//============== espejo 1 (vertical) ============================
var verticalMirror = new THREE.Mirror( 200,300, {
	clipBias: 0.0033,
	textureWidth: WIDTH * window.devicePixelRatio,
	textureHeight: HEIGHT * window.devicePixelRatio,
	color: 0x889999
    } );
    verticalMirror.position.set(40,50,195);
    verticalMirror.rotation.y=(1)*Math.PI;
    
    scene.add( verticalMirror );
    //Control por mouse de la escena
    controls_1=new THREE.OrbitControls(camara_1,Render.domElement);
    controls_2=new THREE.OrbitControls(camara_2,Render.domElement);
    controls_3=new THREE.OrbitControls(camara_3,Render.domElement);

//============== espejo 2 (horizontal) ============================
var verticalMirror = new THREE.Mirror( 400,100, {
	clipBias: 0.0033,
	textureWidth: WIDTH * window.devicePixelRatio,
	textureHeight: HEIGHT * window.devicePixelRatio,
	color: 0x889999
    } );
    verticalMirror.position.set(195,-70,0);
    verticalMirror.rotation.y=(-1/2)*Math.PI;
    
    scene.add( verticalMirror );
 


    //Fondo
 //    var background = new THREE.CubeTextureLoader()
	// .setPath( 'textures/' )
	// .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
 //    background.format = THREE.RGBFormat;
 //    scene.background = background;

    //Modelo 3D .obj
    var onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
	    var percentComplete = xhr.loaded / xhr.total * 100;
	    console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
    };

    var onError = function ( xhr ) { };

    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

    /*var torus = new THREE.TorusKnotBufferGeometry( 5, 1.15, 150, 20 );
    var matTorus = new THREE.MeshStandardMaterial( { roughness: 0.01, metalness: 0.2, envMap: background } );
    var mesh = new THREE.Mesh( torus, matTorus );
    mesh.position.y = 0;
    mesh.position.z = 0;
    mesh.position.x = 0;
    scene.add(mesh);*/

    
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'modelos/' );
    /*mtlLoader.load( 'victor.mtl', function( materials ) {

	materials.preload();

	var objLoader = new THREE.OBJLoader();
	objLoader.setMaterials( materials );
	objLoader.setPath( 'modelos/' );
	objLoader.load( 'victor.obj', function ( object ) {
	    object.scale.set(0.1,0.1,0.1);
//	    object.position.set(0,0,0);
	    object.position.y = 0;
	    object.position.z = 0;
	    object.position.x = 0;	    
//	    object.rotation.y=(1/2)*Math.PI;
	    var helper = new THREE.BoundingBoxHelper(object, 0xff0000);
	    helper.update();
	    //normalize(object).
	    //object.center();
	    //object.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 20, 0 ) );
	    var pivot = new THREE.Object3D();
	  
	      
	    //pivot.translate(0,0,0);
	    object.traverse(function ( child ) {
		if ( child instanceof THREE.Mesh ) {
		    child.geometry.computeBoundingBox();
		    object.bBox = child.geometry.boundingBox;//<-- Actually get the variable
		    var offset = object.bBox.getCenter().negate();
		    console.log('x: ',offset.x+' y: ',offset.y);	    
		    object.position.x = -offset.x;
		    //object.position.z = offset.y;
		    //object.position.x = offset.z;
		    //child.translate( 0, 0, 0 );
		    //object.position.x = 
		    scene.add(object);
		    
		}
	    });

	    //pivot.translate( offset.x, offset.y, offset.z );
	    //scene.add(  );
	    scene.add(helper);

	}, onProgress, onError );

    });*/

    mtlLoader.load( 'manuelfelipe.mtl', function( materials ) {
	materials.preload();
	var objLoader = new THREE.OBJLoader();
	objLoader.setMaterials( materials );
	objLoader.setPath( 'modelos/' );
	objLoader.load( 'manuelfelipe.obj', function ( object ) {
	    object.scale.set(0.1,0.1,0.1);
	    object.position.set(0,22,0);
	    object.rotation.y=(1/2)*Math.PI;
	    scene.add( object );
	}, onProgress, onError );
    });


    mtlLoader.load( 'anfelbar.mtl', function( materials ) {
	materials.preload();
	var objLoader = new THREE.OBJLoader();
	objLoader.setMaterials( materials );
	objLoader.setPath( 'modelos/' );
	objLoader.load( 'anfelbar.obj', function ( object ) {
	     object.scale.set(0.1,0.1,0.1);
	    object.position.set(0,110,0);
	    object.rotation.y=(5/3)*Math.PI;
	    scene.add( object );
	}, onProgress, onError );
    });


	mtlLoader.load( 'mesa.mtl', function( materials ) {
	materials.preload();
	var objLoader = new THREE.OBJLoader();
	objLoader.setMaterials( materials );
	objLoader.setPath( 'modelos/' );
	objLoader.load( 'mesa.obj', function ( object ) {
	     object.scale.set(2.2,2.2,2.2);
	    object.position.set(130,-145,-90);
	    object.rotation.y=(2)*Math.PI;
	    scene.add( object );
	}, onProgress, onError );
    });


	mtlLoader.load( 'laptop.mtl', function( materials ) {
	materials.preload();
	var objLoader = new THREE.OBJLoader();
	objLoader.setMaterials( materials );
	objLoader.setPath( 'modelos/' );
	objLoader.load( 'laptop.obj', function ( object ) {
	     object.scale.set(2.5,2.5,2.5);
	    object.position.set(130,-60,-90);
	    object.rotation.y=(1/2)*Math.PI;
	    scene.add( object );
	}, onProgress, onError );
    });


	mtlLoader.load( 'estanteria.mtl', function( materials ) {
	materials.preload();
	var objLoader = new THREE.OBJLoader();
	objLoader.setMaterials( materials );
	objLoader.setPath( 'modelos/' );
	objLoader.load( 'estanteria.obj', function ( object ) {
	     object.scale.set(2.5,2.5,2.5);
	    object.position.set(-184.5,50,-50);
	    object.rotation.y=(1/2)*Math.PI;
	    scene.add( object );
	}, onProgress, onError );
    });
	

    mtlLoader.load( 'daniel.mtl', function( materials ) {
	materials.preload();
	var objLoader = new THREE.OBJLoader();
	objLoader.setMaterials( materials );
	objLoader.setPath( 'modelos/' );
	objLoader.load( 'daniel.obj', function ( object ) {
	object.scale.set(0.1,0.1,0.1);
	    object.position.set(0,18,80);
	    object.rotation.y=(1/2)*Math.PI;
	    scene.add( object );
	}, onProgress, onError );
    });


    mtlLoader.load( 'cristianriascos.mtl', function( materials ) {
	materials.preload();
	var objLoader = new THREE.OBJLoader();
	objLoader.setMaterials( materials );
	objLoader.setPath( 'modelos/' );
	objLoader.load( 'cristianriascos.obj', function ( object ) {
	object.scale.set(0.1,0.1,0.1);
	    object.position.set(-60,18,80);
	    object.rotation.y=(1/2)*Math.PI;
	    scene.add( object );
	}, onProgress, onError );
    });


    mtlLoader.load( 'josevaldez.mtl', function( materials ) {
	materials.preload();
	var objLoader = new THREE.OBJLoader();
	objLoader.setMaterials( materials );
	objLoader.setPath( 'modelos/' );
	objLoader.load( 'josevaldez.obj', function ( object ) {
	object.scale.set(0.1,0.1,0.1);
	    object.position.set(0,18,160);
	    object.rotation.y=(1/2)*Math.PI;
	    scene.add( object );
	}, onProgress, onError );
    });


	mtlLoader.load( 'video-projector.mtl', function( materials ) {
	materials.preload();
	var objLoader = new THREE.OBJLoader();
	objLoader.setMaterials( materials );
	objLoader.setPath( 'modelos/' );
	objLoader.load( 'video-projector.obj', function ( object ) {
	     object.scale.set(0.5,0.5,0.5);
	    object.position.set(110,-70,-10);
	    object.rotation.y=(1/2)*Math.PI;
	    scene.add( object );
	}, onProgress, onError );
    });

    

//===========================================================================
//=============================VIDEO===================================
//===========================================================================
	document.addEventListener( 'keypress', mover, false );

	THREEx.WindowResize(Render, camara);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

	video = document.createElement( 'video' );
	video.src = "viiiddd/fornite.mp4";
	video.load(); 
	video.play();
	
	//-----------------------------------------------------
	videoImage = document.createElement( 'canvas' );
	videoImage.width =640;
	videoImage.height = 360;

	videoImageContext = videoImage.getContext( '2d' );
	// background color if no video present
	videoImageContext.fillStyle = '#000000';
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height);

    //----creamos la textura del video (imagen del video)
	videoTexture = new THREE.Texture( videoImage );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
	
	var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
	var movieGeometry = new THREE.PlaneGeometry( 150, 90, 50, 50 );
	var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
	movieScreen.position.set(195,50,0);
	movieScreen.rotation.y=(-1/2)*Math.PI;
	scene.add(movieScreen);

}
//==========================================================================
//==========================================================================


//Mover por teclado (letras por codigo / )
function mover (event) {
    console.log(event.which);

    if(event.which===97){//a
	//LEFT	 
	camara.position.x-= 200;		
    }else if(event.which===119){//w
	//UP
	camara.position.y+= 100;
    }else if(event.which===100){//d
	//RIGTH
	camara.position.x+= 200;
    }else if(event.which===115){//s
	//DOWN
	camara.position.y-= 100;
    }else if(event.which===113){//q
	//ZOOM+
	camara.position.z -=200;
    }else if(event.which===101){//e
	//ZOOM-
	camara.position.z +=200;
    }else if (event.which===50){//e
	//cam_2
	camara=camara_2;}
	else if (event.which===51){//e
	//cam_2
	camara=camara_3;}
	else if (event.which===49){//e
	//cam_2
	camara=camara_1;}
}

//===========================================================================
//=============================REPRODUCTOR===================================
//===========================================================================

var lcd = document.getElementById("lcd");
var audio = document.getElementById("song"); //meter en el audio la canción

var songs = ["sounds/Alante alante.mp3", "sounds/la mini mini.mp3","sounds/CrackBaby.mp3"]; //dirección de canción

var currentSong = 0; //canción en la que estoy
audio.src = songs[currentSong];

function reproducir() {
  audio.play();
  mostrar();
}

function pausa() {
  audio.pause();
}

function parar() {
  audio.pause();
  audio.currentTime = 0;
}

function siguiente() {
  if (currentSong < songs.length - 1) {
    audio.src = songs[++currentSong];
    reproducir();

  } else {
    currentSong = 0;
    audio.src = songs[0];
    reproducir();
  }
}

function atras() {
  if (currentSong > 0) {
    audio.src = songs[--currentSong];
    reproducir();
  } else {
    currentSong = songs.length;
    reproducir();
  }
}

//==========================================================================
//==========================================================================


function crear_plano(){
    //Crear plano
    Geometria_plano=new THREE.PlaneGeometry(400,400,10,10);
    balon=new THREE.SphereGeometry( 15, 50, 50 );
    cubo= new THREE.BoxGeometry(35,35,35);
    Plano_2 = new THREE.PlaneGeometry(400,400,10,10);
    Plano_3 = new THREE.PlaneGeometry(400,400,10,10);
    Plano_4 = new THREE.PlaneGeometry(400,400,10,10);
    Plano_5 = new THREE.PlaneGeometry(400,400,10,10);
    Plano_6 = new THREE.PlaneGeometry(400,400,10,10);
    

    //Textura
    var bmap =  THREE.ImageUtils.loadTexture("textura/rubik.png", {}, function(){});
    var smap =  THREE.ImageUtils.loadTexture("textura/cubo_dis.png", {}, function(){});
    var dsmap =  THREE.ImageUtils.loadTexture("textura/cubo_dis.png", {}, function(){});
    var aomap =  THREE.ImageUtils.loadTexture("textura/cubo_ao.png", {}, function(){});
    var bmap1 =  THREE.ImageUtils.loadTexture("textura/balon.jpg", {}, function(){});
    var smap1 =  THREE.ImageUtils.loadTexture("textura/spec_balon.png", {}, function(){});
    var dsmap1 =  THREE.ImageUtils.loadTexture("textura/balon_dis.png", {}, function(){});
    var aomap1 =  THREE.ImageUtils.loadTexture("textura/balon_ao.png", {}, function(){});
    Textura_plano=new THREE.ImageUtils.loadTexture("textura/suelo_madera.jpg");
    Textura_plano.wrapS=Textura_plano.wrapT=THREE.RepeatWrapping;
    Textura_plano.repeat.set(10,10);
    Textura_plano_2=new THREE.ImageUtils.loadTexture("textura/Salon_Frente.jpg");
    Textura_plano_2.wrapS=Textura_plano.wrapT=THREE.RepeatWrapping;
    Textura_plano_2.repeat.set(1,1);
    Textura_plano_3=new THREE.ImageUtils.loadTexture("textura/Techo.jpg");
    Textura_plano_3.wrapS=Textura_plano.wrapT=THREE.RepeatWrapping;
    Textura_plano_3.repeat.set(1,1);
    Textura_plano_4=new THREE.ImageUtils.loadTexture("textura/ladrillo.jpg");
    Textura_plano_4.wrapS=Textura_plano.wrapT=THREE.RepeatWrapping;
    Textura_plano_4.repeat.set(1,1);
    Textura_plano_5=new THREE.ImageUtils.loadTexture("textura/ladrillo_puerta.jpg");
    Textura_plano_5.wrapS=Textura_plano.wrapT=THREE.RepeatWrapping;
    Textura_plano_5.repeat.set(1,1);
    Textura_plano_6=new THREE.ImageUtils.loadTexture("textura/ventana.jpg");
    Textura_plano_6.wrapS=Textura_plano.wrapT=THREE.RepeatWrapping;
    Textura_plano_6.repeat.set(1,1);
    Textura_plano_7=new THREE.ImageUtils.loadTexture("textura/rubik.png");
    Textura_plano_7.wrapS=Textura_plano.wrapT=THREE.RepeatWrapping;
    Textura_plano_7.repeat.set(1,1);
    Textura_plano_8=new THREE.ImageUtils.loadTexture("textura/balon.jpg");
    Textura_plano_8.wrapS=Textura_plano.wrapT=THREE.RepeatWrapping;
    Textura_plano_8.repeat.set(1,1);
    //Agregar la textura
    Bump_Map=new THREE.MeshPhongMaterial({bumpMap:smap,map:bmap,side:THREE.DoubleSide,bumpScale:0.75});
    Bump_Map1=new THREE.MeshPhongMaterial({bumpMap:smap1,map:bmap1,side:THREE.DoubleSide,bumpScale:0.75});
    Dis_Map=new THREE.MeshPhongMaterial({displacementMap:dsmap,map:bmap,side:THREE.DoubleSide,displacementScale:10,displacementBias:0});
    Dis_Map1=new THREE.MeshPhongMaterial({displacementMap:dsmap1,map:bmap1,side:THREE.DoubleSide,displacementScale:1,displacementBias :0});
    Ao_Map=new THREE.MeshPhongMaterial({aoMap :aomap,map:bmap,side:THREE.DoubleSide,aoMapIntensity :1});
    Ao_Map1=new THREE.MeshPhongMaterial({aoMap :aomap1,map:bmap1,side:THREE.DoubleSide,aoMapIntensity :1});
    Material_plano=new THREE.MeshBasicMaterial({map:Textura_plano,side:THREE.DoubleSide});
    Material_plano_2=new THREE.MeshBasicMaterial({map:Textura_plano_2,side:THREE.DoubleSide});
    Material_plano_3=new THREE.MeshBasicMaterial({map:Textura_plano_3,side:THREE.DoubleSide});
    Material_plano_4=new THREE.MeshBasicMaterial({map:Textura_plano_4,side:THREE.DoubleSide});
    Material_plano_5=new THREE.MeshBasicMaterial({map:Textura_plano_5,side:THREE.DoubleSide});
    Material_plano_6=new THREE.MeshBasicMaterial({map:Textura_plano_6,side:THREE.DoubleSide});
    Material_plano_7=new THREE.MeshBasicMaterial({map:Textura_plano_7,side:THREE.DoubleSide});
    Material_plano_8=new THREE.MeshBasicMaterial({map:Textura_plano_8,side:THREE.DoubleSide});
    //textura=Bump_Map;
    //Plano + textura (terreno)
    cubo_text=new THREE.Mesh(cubo,Material_plano_7);
    balon_text= new THREE.Mesh(balon,Material_plano_8);
    terreno=new THREE.Mesh(Geometria_plano,Material_plano);
    pared_1= new THREE.Mesh(Plano_2,Material_plano_4);
    pared_2= new THREE.Mesh(Plano_3,Material_plano_4);
    pared_3= new THREE.Mesh(Plano_4,Material_plano_3);
    pared_4= new THREE.Mesh(Plano_5,Material_plano_2);
    pared_5= new THREE.Mesh(Plano_6,Material_plano_4);
    terreno.position.set(0,-150,0);
    cubo_text.position.set(130,-60,-140);
    balon_text.position.set(0,-130,130);
    pared_1.position.set(0,50,200);
    pared_2.position.set(0,50,-200);
    pared_3.position.set(0,250,0);
    pared_4.position.set(200,50,0);
    pared_5.position.set(-200,50,0);
    
    terreno.rotation.x=Math.PI/2;
    pared_3.rotation.x=Math.PI/2;
    pared_4.rotation.y=Math.PI/2;
    pared_5.rotation.y=Math.PI/2;
    //pared_1.rotation.x=Math.PI/2;
    
    scene.add(terreno);
    scene.add(balon_text);
    scene.add(cubo_text);
    scene.add(pared_1);
    scene.add(pared_2);
    scene.add(pared_3);
    scene.add(pared_4);
    scene.add(pared_5);

    //Axis=new THREE.AxisHelper(300,300,300);
    //scene.add(Axis);
}
crear_plano();
//****************************************************
function animate() {

    requestAnimationFrame( animate );
    render();  

    
    
}
function bump_mapping(){
	scene.remove(cubo_text);
	scene.remove(balon_text);
    balon_text=new THREE.Mesh(balon,Bump_Map1);
	cubo_text=new THREE.Mesh(cubo,Bump_Map);
	cubo_text.position.set(130,-60,-140);;
	balon_text.position.set(0,-130,130);
	scene.add(balon_text);
	scene.add(cubo_text);
}
function displacement(){
scene.remove(cubo_text);
	scene.remove(balon_text);
    balon_text=new THREE.Mesh(balon,Dis_Map1);
	cubo_text=new THREE.Mesh(cubo,Dis_Map);
	cubo_text.position.set(130,-60,-140);;
	balon_text.position.set(0,-130,130);
	scene.add(balon_text);
	scene.add(cubo_text);
}
function ambientocc(){
scene.remove(cubo_text);
	scene.remove(balon_text);
    balon_text=new THREE.Mesh(balon,Ao_Map1);
	cubo_text=new THREE.Mesh(cubo,Ao_Map);
	cubo_text.position.set(130,-60,-140);;
	balon_text.position.set(0,-130,130);
	scene.add(balon_text);
	scene.add(cubo_text);
}
function luz_ambiente(){
	scene.add(ambientLight);
}
function apagar_amb(){
	scene.remove(ambientLight);
}
function pointlight(){
	camara_1.add( pointLight_1 );
}
function apagar_poi(){
	camara_1.remove( pointLight_1 );
}
function spotlight(){
	scene.add(spotLight);
}
function apagar_spo(){
	scene.remove(spotLight);
}


//***************************************************

function render() {

if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
	{
		videoImageContext.drawImage( video, 0, 0 );
		if ( videoTexture ) 
			videoTexture.needsUpdate = true;
	}

    /*scene.traverse( function(child) {
	if(child instanceof THREE.Sprite) {
	    if(camara.position.distanceToSquared(child.position) < 300){
		child.visible = true;
	    } else {
		child.visible = false;
	    }
	}
    });*/

    controls_1.update();
    controls_2.update();
    controls_3.update();

    Render.render(scene,camara);
}
var aboutDemoLoop = {
    /*============= Creating a canvas =================*/
    interval: null,
    startGameLoop: function () {
        var NUM_STARTING_ASTEROIDS = 5;

        var c = document.getElementById("demoCanvas");
        var gameOver = false;

        gameArgs.A_SCREEN_WIDTH = 300;
        gameArgs.A_SCREEN_HEIGHT = 300;

        c.width = gameArgs.A_SCREEN_WIDTH;
        c.height = gameArgs.A_SCREEN_HEIGHT;
        var ctx = c.getContext("2d");
        ctx.strokeStyle = "#ffffff";

        this.interval = setInterval(function () {
            ctx.clearRect(0, 0, gameArgs.A_SCREEN_WIDTH, gameArgs.A_SCREEN_HEIGHT);
            advance();
            draw();
        }, 33);

        var asteroids = [];

        function initializeAsteroids() {
            asteroids = [];
            for (var i = 0; i < NUM_STARTING_ASTEROIDS; i++) {
                asteroids.push(new largeAsteroid(ctx));
            }
        }

        function advance() {
            for (var i = 0; i < asteroids.length; i++) {
                var asteroid = asteroids[i];
                asteroid.advance();
            }
        }

        function draw() {
            ctx.font = "16px Arial";
            for (var i = 0; i < asteroids.length; i++) {
                asteroids[i].draw();
            }
        }

        initializeAsteroids();
    },
    endGameLoop: function () {
        if (this.interval)
            clearInterval(this.interval);
    }


};

//Do the 3D animation for the initial splash screen
(function () {
    // global variables
    var renderer;
    var scene;
    var camera;
    var moonMesh;
    var sphere;
    var earthMesh;

    var camControl;
    var pivotPoint;

    function init() {

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        scene = new THREE.Scene();


        // create a camera, which defines where we're looking at.
        var earthAndMoon = document.getElementById('earthAndMoon');
        var height = 800;
        var width = 800;
        camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 3000);

        // create a render, sets the background color and the size
        renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(width, height);
        renderer.shadowMapEnabled = true;
        renderer.shadowMapType = THREE.PCFSoftShadowMap;


        // create a simple sphere
        sphere = new THREE.SphereGeometry(13, 60, 60);
        var spherMat = new THREE.MeshLambertMaterial({ color: 0xdbcc5c });

        var earthMaterial = new THREE.MeshPhongMaterial();
        earthMaterial.map = THREE.ImageUtils.loadTexture("/images/Asteroids/earth_small.jpg");
        earthMesh = new THREE.Mesh(sphere, earthMaterial);
        earthMesh.receiveShadow = true;
        earthMesh.position.set(0, 2, 0);
        scene.add(earthMesh);

        // add an object as pivot point to the sphere
        pivotPoint = new THREE.Object3D();
        pivotPoint.rotation.x = 0.4;

        scene.add(pivotPoint);

        // create a moon and add to scene
        var moonGeometry = new THREE.SphereGeometry(3, 60, 60);

        var moonMaterial = new THREE.MeshPhongMaterial();
        moonMaterial.map = THREE.ImageUtils.loadTexture("/images/Asteroids/moon2.jpg");
        moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
        // position is relative to it's parent
        moonMesh.position.set(20, 6, 0);
        moonMesh.name = 'cube';
        moonMesh.castShadow = true;
        // make the pivotpoint the moon's parent.
        pivotPoint.add(moonMesh);

        // add some light
        var light = new THREE.SpotLight();
        light.position.set(60,60,60);
        light.castShadow = true;
        light.shadowMapEnabled = true;
        light.shadowCameraNear = 20;
        light.shadowCameraFar = 100;

        scene.add(light);


        // position and point the camera to the center of the scene
        camera.position.x = 150;
        camera.position.y = 6;
        camera.position.z = 23;
        camera.lookAt(scene.position);

        // add the output of the renderer to the html element
        document.getElementById('earthAndMoon').appendChild(renderer.domElement);

        render();
    }

    function render() {
        renderer.render(scene, camera);
        pivotPoint.rotation.y += .01;

        earthMesh.rotation.y += .01;
        moonMesh.rotation.y -= .01;
        requestAnimationFrame(render);
        if (camera.position.x > 50) {
            camera.position.x -= .1;
            camera.position.z -= .02;
            camera.position.y -= .01;
        }
    }

    // calls the init function when the window is done loading.
    $(function () {
        //Give the browser just a little time to settle before doing intense 3D stuff
        //setTimeout(init, 1000);
    });
})();





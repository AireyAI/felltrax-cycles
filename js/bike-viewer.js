/**
 * Felltrax Cycles — Three.js 3D Bike Viewer
 * Procedural 3D mountain bike model with orbit controls.
 */
(function () {
  'use strict';

  var container = document.getElementById('bikeViewer');
  var btnPhoto = document.getElementById('btnPhoto');
  var btn3D = document.getElementById('btn3D');
  if (!container || !btnPhoto || !btn3D) return;

  var scene, camera, renderer, bike, animId;
  var isActive = false;
  var mouseX = 0, mouseY = 0;
  var isDragging = false;
  var prevMouseX = 0, prevMouseY = 0;
  var rotationX = 0.3;
  var rotationY = 0;

  function init() {
    if (typeof THREE === 'undefined') return;

    scene = new THREE.Scene();

    // Get brand color from CSS
    var style = getComputedStyle(document.documentElement);
    var brandHex = style.getPropertyValue('--brand').trim() || '#C4FF2B';
    var bgHex = style.getPropertyValue('--surface-raised').trim() || '#111111';

    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.015);

    var w = container.clientWidth;
    var h = container.clientHeight;
    camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(4, 2.5, 5);
    camera.lookAt(0, 0.5, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lights
    var ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    var key = new THREE.DirectionalLight(0xffffff, 0.8);
    key.position.set(5, 8, 5);
    key.castShadow = true;
    key.shadow.mapSize.width = 1024;
    key.shadow.mapSize.height = 1024;
    scene.add(key);

    var fill = new THREE.DirectionalLight(brandHex, 0.3);
    fill.position.set(-3, 2, -3);
    scene.add(fill);

    var rim = new THREE.PointLight(brandHex, 0.5, 15);
    rim.position.set(-2, 3, -4);
    scene.add(rim);

    // Ground
    var groundGeo = new THREE.PlaneGeometry(20, 20);
    var groundMat = new THREE.MeshStandardMaterial({ color: bgHex, roughness: 0.9 });
    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid
    var grid = new THREE.GridHelper(10, 20, new THREE.Color(brandHex).multiplyScalar(0.15), new THREE.Color(brandHex).multiplyScalar(0.05));
    grid.position.y = -0.49;
    scene.add(grid);

    // Build procedural bike
    bike = buildBike(brandHex);
    scene.add(bike);

    // Mouse interaction
    container.addEventListener('mousedown', function (e) {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });
    window.addEventListener('mouseup', function () { isDragging = false; });
    window.addEventListener('mousemove', function (e) {
      if (isDragging) {
        var dx = e.clientX - prevMouseX;
        var dy = e.clientY - prevMouseY;
        rotationY += dx * 0.005;
        rotationX += dy * 0.005;
        rotationX = Math.max(-0.5, Math.min(1.2, rotationX));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    });

    // Touch support
    container.addEventListener('touchstart', function (e) {
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    }, { passive: true });
    container.addEventListener('touchmove', function (e) {
      if (isDragging) {
        var dx = e.touches[0].clientX - prevMouseX;
        var dy = e.touches[0].clientY - prevMouseY;
        rotationY += dx * 0.005;
        rotationX += dy * 0.005;
        rotationX = Math.max(-0.5, Math.min(1.2, rotationX));
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    }, { passive: true });
    container.addEventListener('touchend', function () { isDragging = false; }, { passive: true });

    // Scroll zoom
    container.addEventListener('wheel', function (e) {
      e.preventDefault();
      var z = camera.position.length();
      z += e.deltaY * 0.005;
      z = Math.max(3, Math.min(10, z));
      camera.position.normalize().multiplyScalar(z);
    });

    // Resize
    window.addEventListener('resize', function () {
      var w2 = container.clientWidth;
      var h2 = container.clientHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    });

    animate();
  }

  function buildBike(brandHex) {
    var group = new THREE.Group();
    var frameMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3, metalness: 0.8 });
    var brandMat = new THREE.MeshStandardMaterial({ color: brandHex, roughness: 0.2, metalness: 0.6, emissive: brandHex, emissiveIntensity: 0.1 });
    var darkMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6, metalness: 0.4 });
    var tireMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    var spokeMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.3, metalness: 0.9 });

    // Wheels
    function makeWheel(x) {
      var wheelGroup = new THREE.Group();
      // Tire (torus)
      var tire = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.12, 12, 32), tireMat);
      wheelGroup.add(tire);
      // Rim
      var rim = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.03, 8, 32), spokeMat);
      wheelGroup.add(rim);
      // Hub
      var hub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.15, 12), spokeMat);
      hub.rotation.x = Math.PI / 2;
      wheelGroup.add(hub);
      // Spokes
      for (var i = 0; i < 16; i++) {
        var angle = (i / 16) * Math.PI * 2;
        var spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.56, 4), spokeMat);
        spoke.position.set(Math.cos(angle) * 0.28, Math.sin(angle) * 0.28, 0);
        spoke.rotation.z = angle + Math.PI / 2;
        wheelGroup.add(spoke);
      }
      // Disc brake rotor
      var rotor = new THREE.Mesh(new THREE.RingGeometry(0.08, 0.18, 24), spokeMat);
      rotor.position.z = 0.08;
      wheelGroup.add(rotor);

      wheelGroup.position.set(x, 0.2, 0);
      wheelGroup.rotation.y = Math.PI / 2;
      return wheelGroup;
    }

    var rearWheel = makeWheel(-1.1);
    var frontWheel = makeWheel(1.1);
    group.add(rearWheel);
    group.add(frontWheel);

    // Frame tubes
    function tube(from, to, radius, mat) {
      var dir = new THREE.Vector3().subVectors(to, from);
      var len = dir.length();
      var geo = new THREE.CylinderGeometry(radius, radius, len, 8);
      var mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(from).add(to).multiplyScalar(0.5);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      mesh.castShadow = true;
      return mesh;
    }

    // Frame points
    var bb = new THREE.Vector3(-0.15, 0.1, 0); // bottom bracket
    var st = new THREE.Vector3(-0.35, 0.95, 0); // seat tube top
    var ht = new THREE.Vector3(0.75, 1.0, 0); // head tube top
    var hb = new THREE.Vector3(0.6, 0.55, 0); // head tube bottom
    var cs = new THREE.Vector3(-1.1, 0.2, 0); // chainstay rear
    var ss = new THREE.Vector3(-1.1, 0.75, 0); // seatstay rear

    // Main triangle
    group.add(tube(bb, st, 0.03, frameMat)); // seat tube
    group.add(tube(bb, hb, 0.035, frameMat)); // down tube
    group.add(tube(st, ht, 0.028, frameMat)); // top tube
    group.add(tube(hb, ht, 0.03, brandMat)); // head tube (brand color)

    // Rear triangle
    group.add(tube(bb, cs, 0.02, frameMat)); // chainstay
    group.add(tube(st, ss, 0.02, frameMat)); // seatstay

    // Fork
    var forkTop = new THREE.Vector3(0.68, 0.85, 0);
    var forkBottom = new THREE.Vector3(1.1, 0.2, 0);
    group.add(tube(forkTop, forkBottom, 0.03, darkMat));
    // Fork stanchion (brand color)
    var stanchionTop = new THREE.Vector3(0.72, 0.75, 0);
    var stanchionBot = new THREE.Vector3(0.9, 0.45, 0);
    group.add(tube(stanchionTop, stanchionBot, 0.022, brandMat));

    // Handlebars
    var barCenter = new THREE.Vector3(0.75, 1.1, 0);
    var barLeft = new THREE.Vector3(0.75, 1.1, 0.4);
    var barRight = new THREE.Vector3(0.75, 1.1, -0.4);
    group.add(tube(barCenter, barLeft, 0.015, darkMat));
    group.add(tube(barCenter, barRight, 0.015, darkMat));
    // Stem
    group.add(tube(ht, barCenter, 0.02, darkMat));

    // Seat
    var seatGeo = new THREE.BoxGeometry(0.28, 0.04, 0.14);
    seatGeo.translate(0, 0.02, 0);
    var seat = new THREE.Mesh(seatGeo, darkMat);
    seat.position.copy(st).add(new THREE.Vector3(0, 0.06, 0));
    seat.castShadow = true;
    group.add(seat);

    // Seatpost
    group.add(tube(st, new THREE.Vector3(-0.35, 0.55, 0), 0.018, spokeMat));

    // Cranks + pedals
    var crankLen = 0.2;
    var crank1 = tube(bb, new THREE.Vector3(bb.x, bb.y - crankLen, 0.1), 0.015, spokeMat);
    var crank2 = tube(bb, new THREE.Vector3(bb.x, bb.y - crankLen, -0.1), 0.015, spokeMat);
    group.add(crank1);
    group.add(crank2);

    // Chainring
    var chainring = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.12, 24), spokeMat);
    chainring.position.set(bb.x, bb.y, 0.08);
    chainring.rotation.y = Math.PI / 2;
    group.add(chainring);

    // Rear shock (brand accent)
    var shockTop = new THREE.Vector3(-0.1, 0.75, 0);
    var shockBot = new THREE.Vector3(-0.4, 0.35, 0);
    group.add(tube(shockTop, shockBot, 0.02, brandMat));

    group.position.y = 0;
    return group;
  }

  function animate() {
    animId = requestAnimationFrame(animate);
    if (!isActive) return;

    // Auto-rotate when not dragging
    if (!isDragging) {
      rotationY += 0.003;
    }

    // Orbit camera
    var radius = camera.position.length();
    camera.position.x = Math.sin(rotationY) * Math.cos(rotationX) * radius;
    camera.position.y = Math.sin(rotationX) * radius + 1;
    camera.position.z = Math.cos(rotationY) * Math.cos(rotationX) * radius;
    camera.lookAt(0, 0.4, 0);

    renderer.render(scene, camera);
  }

  // Toggle buttons
  btnPhoto.addEventListener('click', function () {
    isActive = false;
    container.classList.remove('active');
    btnPhoto.classList.add('active');
    btn3D.classList.remove('active');
  });

  btn3D.addEventListener('click', function () {
    if (!scene) init();
    isActive = true;
    container.classList.add('active');
    btn3D.classList.add('active');
    btnPhoto.classList.remove('active');
    // Resize on show
    if (renderer) {
      var w = container.clientWidth;
      var h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
  });
})();

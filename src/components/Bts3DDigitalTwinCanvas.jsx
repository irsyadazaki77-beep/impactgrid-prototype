import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Eye,
  Maximize2,
  Minimize2,
  Layers,
  Thermometer,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Sliders,
  Radio,
  Box,
  Cpu,
  Sun,
  Zap,
  BatteryCharging,
  Wind,
  Info,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

/**
 * 3D Procedural BTS & Subsystem Shelter Twin (Enhanced)
 * Featuring:
 * - Silky-smooth OrbitControls without lerp-fighting
 * - Procedural feeder cables & optional solar PV array
 * - Subsystem raycasting & interactive diagnostic inspection
 * - PINN thermal shader gradients
 * - Collapsible bottom dock & McKinsey aesthetic
 */
export default function Bts3DDigitalTwinCanvas({
  site,
  trafficLoadPct = 50,
  ambientTempC = 31.5,
  internalTempC = 25.4,
  rfPowerKw = 2.4,
  hvacPowerKw = 0.8,
  bessDischargeKw = 0,
  optimizationMode = 'autonomous'
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const meshesRef = useRef({});
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const isUserControllingRef = useRef(false);

  // UI state for bottom dock
  const [cameraPreset, setCameraPreset] = useState('tower'); // 'tower' | 'antennas' | 'cabinet' | 'thermal'
  const [explodedFactor, setExplodedFactor] = useState(0); // 0.0 to 1.0
  const [viewMode, setViewMode] = useState('solid'); // 'solid' | 'wireframe' | 'thermal'
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [showSolarPv, setShowSolarPv] = useState(site?.id === 'BGR-SNT-P03');
  const [selectedSubsystem, setSelectedSubsystem] = useState(null); // 'antenna' | 'bbu' | 'rectifier' | 'bess' | 'hvac' | null

  // Target camera state for smooth damping
  const targetCamPosRef = useRef(new THREE.Vector3(12, 14, 18));
  const targetCamLookRef = useRef(new THREE.Vector3(0, 8, 0));

  // Sync solar panel display with hybrid site selection
  useEffect(() => {
    if (site?.id === 'BGR-SNT-P03') {
      setShowSolarPv(true);
    }
  }, [site?.id]);

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    // 1. Software WebGL detector
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 2. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Scene and Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1122);
    scene.fog = new THREE.FogExp2(0x0a1122, 0.015);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(12, 14, 18);
    cameraRef.current = camera;

    // 4. Orbit Controls (Configured to avoid fighting scripted damping)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.minDistance = 3;
    controls.maxDistance = 45;
    controls.target.set(0, 8, 0);

    controls.addEventListener('start', () => {
      isUserControllingRef.current = true;
    });
    controls.addEventListener('end', () => {
      isUserControllingRef.current = false;
      targetCamPosRef.current.copy(camera.position);
      targetCamLookRef.current.copy(controls.target);
    });

    controlsRef.current = controls;

    // 5. Studio Environment & Lighting
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch {
      // Fallback
    }

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 1.8);
    keyLight.position.set(16, 24, 14);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x729ec4, 0x1a2638, 0.9);
    hemiLight.position.set(0, 30, 0);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-16, 12, -14);
    scene.add(rimLight);

    // 6. Ground & Foundation
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = !isSoftwareGl;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(40, 40, 0x334155, 0x1e293b);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Concrete BTS Foundation Plinth
    const plinthGeo = new THREE.BoxGeometry(10, 0.4, 10);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.85,
      metalness: 0.15
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.set(0, 0.2, 0);
    plinth.receiveShadow = !isSoftwareGl;
    plinth.castShadow = !isSoftwareGl;
    scene.add(plinth);

    // 7. Tower Lattice Group
    const towerGroup = new THREE.Group();
    towerGroup.position.set(-2, 0.4, 0);

    const legMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.75,
      roughness: 0.25
    });
    const braceMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.65,
      roughness: 0.35
    });

    const towerHeight = 18;
    const baseW = 1.6;
    const topW = 0.8;
    const legRadius = 0.05;

    const legOffsets = [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1]
    ];

    legOffsets.forEach(([ox, oz]) => {
      const legGeo = new THREE.CylinderGeometry(legRadius * (topW / baseW), legRadius, towerHeight, 8);
      const legMesh = new THREE.Mesh(legGeo, legMat);
      legMesh.position.set(ox * (baseW + topW) / 4, towerHeight / 2, oz * (baseW + topW) / 4);
      legMesh.castShadow = !isSoftwareGl;
      towerGroup.add(legMesh);
    });

    const numSections = 10;
    for (let i = 1; i <= numSections; i++) {
      const y = (i / numSections) * towerHeight;
      const frac = i / numSections;
      const w = baseW * (1 - frac) + topW * frac;

      const ringGeo = new THREE.BoxGeometry(w, 0.04, 0.04);
      const ringNorth = new THREE.Mesh(ringGeo, braceMat);
      ringNorth.position.set(0, y, w / 2);
      towerGroup.add(ringNorth);

      const ringSouth = new THREE.Mesh(ringGeo, braceMat);
      ringSouth.position.set(0, y, -w / 2);
      towerGroup.add(ringSouth);

      const ringEast = new THREE.Mesh(ringGeo, braceMat);
      ringEast.rotation.y = Math.PI / 2;
      ringEast.position.set(w / 2, y, 0);
      towerGroup.add(ringEast);

      const ringWest = new THREE.Mesh(ringGeo, braceMat);
      ringWest.rotation.y = Math.PI / 2;
      ringWest.position.set(-w / 2, y, 0);
      towerGroup.add(ringWest);
    }

    // Top Work Platform
    const platformGeo = new THREE.CylinderGeometry(topW * 1.4, topW * 1.3, 0.15, 8);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.8,
      roughness: 0.3
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.set(0, towerHeight, 0);
    towerGroup.add(platform);

    // Feeder Cable Conduit running vertically down the tower leg
    const cableGeo = new THREE.CylinderGeometry(0.035, 0.035, towerHeight, 6);
    const cableMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.1
    });
    const feederCable = new THREE.Mesh(cableGeo, cableMat);
    feederCable.position.set((baseW + topW) / 4 + 0.05, towerHeight / 2, (baseW + topW) / 4);
    towerGroup.add(feederCable);

    scene.add(towerGroup);

    // 8. Massive MIMO Antenna Array (3 Sectors Alpha, Beta, Gamma)
    const antennasGroup = new THREE.Group();
    antennasGroup.position.set(-2, towerHeight + 0.2, 0);

    const antennaMeshes = [];
    const interactiveObjects = [];

    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const radius = 1.1;

      const sectorGroup = new THREE.Group();
      sectorGroup.position.set(Math.cos(angle) * radius, 0.6, Math.sin(angle) * radius);
      sectorGroup.rotation.y = -angle + Math.PI / 2;

      const boomGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
      const boom = new THREE.Mesh(boomGeo, braceMat);
      boom.position.set(0, 0, 0);
      sectorGroup.add(boom);

      // Massive MIMO AAU Radome
      const aauGeo = new THREE.BoxGeometry(0.35, 1.1, 0.18);
      const aauMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.3,
        metalness: 0.2,
        emissive: new THREE.Color(0x0284c7),
        emissiveIntensity: 0.35
      });
      const aau = new THREE.Mesh(aauGeo, aauMat);
      aau.position.set(0, 0.2, 0.15);
      aau.castShadow = !isSoftwareGl;
      aau.userData = { subsystemType: 'antenna', sector: i + 1 };
      sectorGroup.add(aau);

      const rruGeo = new THREE.BoxGeometry(0.28, 0.45, 0.14);
      const rruMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.6,
        metalness: 0.5
      });
      const rru = new THREE.Mesh(rruGeo, rruMat);
      rru.position.set(0, 0.2, -0.05);
      sectorGroup.add(rru);

      antennasGroup.add(sectorGroup);
      antennaMeshes.push(aau);
      interactiveObjects.push(aau);
    }
    scene.add(antennasGroup);

    // 9. Outdoor Shelter Cabinet (PINN Subsystems)
    const cabinetGroup = new THREE.Group();
    cabinetGroup.position.set(2.8, 0.4, 0);

    // Cabinet Main Shell
    const shellGeo = new THREE.BoxGeometry(2.2, 2.4, 1.4);
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.4,
      metalness: 0.3,
      transparent: true,
      opacity: 0.85
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.position.set(0, 1.2, 0);
    shell.castShadow = !isSoftwareGl;
    shell.receiveShadow = !isSoftwareGl;
    cabinetGroup.add(shell);

    // Cabinet Door
    const doorGeo = new THREE.BoxGeometry(2.1, 2.3, 0.08);
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0xcfd8dc,
      roughness: 0.35,
      metalness: 0.4,
      transparent: true,
      opacity: 0.5
    });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 1.2, 0.72);
    cabinetGroup.add(door);

    // Subsystem (A): BBU 5900 Baseband Rack
    const bbuGeo = new THREE.BoxGeometry(1.8, 0.3, 1.0);
    const bbuMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.6,
      roughness: 0.3,
      emissive: new THREE.Color(0x38bdf8),
      emissiveIntensity: 0.25
    });
    const bbu = new THREE.Mesh(bbuGeo, bbuMat);
    bbu.position.set(0, 1.9, 0);
    bbu.userData = { subsystemType: 'bbu' };
    cabinetGroup.add(bbu);
    interactiveObjects.push(bbu);

    // Subsystem (B): Rectifier AC-DC 48V
    const rectifierGeo = new THREE.BoxGeometry(1.8, 0.35, 1.0);
    const rectifierMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      metalness: 0.7,
      roughness: 0.25,
      emissive: new THREE.Color(0x9333ea),
      emissiveIntensity: 0.25
    });
    const rectifier = new THREE.Mesh(rectifierGeo, rectifierMat);
    rectifier.position.set(0, 1.45, 0);
    rectifier.userData = { subsystemType: 'rectifier' };
    cabinetGroup.add(rectifier);
    interactiveObjects.push(rectifier);

    // Subsystem (C): BESS LiFePO4 Battery String
    const bessGeo = new THREE.BoxGeometry(1.8, 0.65, 1.0);
    const bessMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      metalness: 0.5,
      roughness: 0.4,
      emissive: new THREE.Color(0x10b981),
      emissiveIntensity: 0.3
    });
    const bess = new THREE.Mesh(bessGeo, bessMat);
    bess.position.set(0, 0.85, 0);
    bess.userData = { subsystemType: 'bess' };
    cabinetGroup.add(bess);
    interactiveObjects.push(bess);

    // Subsystem (D): HVAC Inverter Cooler
    const hvacGeo = new THREE.BoxGeometry(0.5, 1.2, 0.8);
    const hvacMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.6,
      roughness: 0.3
    });
    const hvac = new THREE.Mesh(hvacGeo, hvacMat);
    hvac.position.set(1.35, 1.2, 0);
    hvac.userData = { subsystemType: 'hvac' };
    cabinetGroup.add(hvac);
    interactiveObjects.push(hvac);

    // HVAC Blower Fan Rotor
    const fanGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 8);
    const fanMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.8,
      roughness: 0.2
    });
    const fanRotor = new THREE.Mesh(fanGeo, fanMat);
    fanRotor.rotation.z = Math.PI / 2;
    fanRotor.position.set(1.62, 1.4, 0);
    cabinetGroup.add(fanRotor);

    // Rooftop Solar Photovoltaic Array (for hybrid sites)
    const solarGroup = new THREE.Group();
    solarGroup.position.set(0, 2.5, 0);
    solarGroup.rotation.x = -0.25; // 15-degree tilt

    const panelGeo = new THREE.BoxGeometry(2.3, 0.04, 1.5);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      metalness: 0.8,
      roughness: 0.2,
      emissive: new THREE.Color(0x1d4ed8),
      emissiveIntensity: 0.2
    });
    const solarPanel = new THREE.Mesh(panelGeo, panelMat);
    solarGroup.add(solarPanel);
    cabinetGroup.add(solarGroup);

    scene.add(cabinetGroup);

    // Save mesh references
    meshesRef.current = {
      towerGroup,
      antennasGroup,
      cabinetGroup,
      antennaMeshes,
      shell,
      door,
      bbu,
      rectifier,
      bess,
      hvac,
      fanRotor,
      solarGroup,
      interactiveObjects
    };

    // 10. Click Raycaster for interactive component selection
    const handleCanvasClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.subsystemType) {
          setSelectedSubsystem(hit.userData.subsystemType);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // 11. Animation Loop (using performance.now() instead of deprecated THREE.Clock)
    const startTimeMs = performance.now();
    let prevTimeMs = startTimeMs;

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const nowMs = performance.now();
      const delta = Math.min(0.1, Math.max(0.001, (nowMs - prevTimeMs) / 1000));
      const elapsed = (nowMs - startTimeMs) / 1000;
      prevTimeMs = nowMs;

      // Only lerp camera when user is NOT manually dragging OrbitControls
      if (!isUserControllingRef.current) {
        camera.position.lerp(targetCamPosRef.current, delta * 3.5);
        controls.target.lerp(targetCamLookRef.current, delta * 3.5);
      }

      // Subtle HVAC fan spin
      if (fanRotor) {
        fanRotor.rotation.x += delta * 14;
      }

      // Auto-rotation around target if enabled
      if (isRotating && !isUserControllingRef.current) {
        towerGroup.rotation.y = Math.sin(elapsed * 0.1) * 0.05;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 12. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update exploded view offsets
  useEffect(() => {
    const { antennasGroup, cabinetGroup, door, bess, rectifier, bbu } = meshesRef.current;

    if (antennasGroup) {
      antennasGroup.position.y = 18.2 + explodedFactor * 3.5;
    }

    if (cabinetGroup && door) {
      cabinetGroup.position.x = 2.8 + explodedFactor * 2.2;
      door.position.z = 0.72 + explodedFactor * 1.8;
      door.rotation.y = explodedFactor * 0.8;
    }

    if (bess) bess.position.x = explodedFactor * 0.8;
    if (rectifier) rectifier.position.x = -explodedFactor * 0.6;
    if (bbu) bbu.position.y = 1.9 + explodedFactor * 0.5;
  }, [explodedFactor]);

  // Update dynamic thermal & RF emissions
  useEffect(() => {
    const { antennaMeshes, shell, bess, solarGroup } = meshesRef.current;
    if (!antennaMeshes) return;

    if (solarGroup) {
      solarGroup.visible = showSolarPv;
    }

    // Dynamic Antenna Color based on PRB load
    let antennaColorHex = 0x0284c7;
    if (trafficLoadPct > 75) antennaColorHex = 0xef4444;
    else if (trafficLoadPct > 45) antennaColorHex = 0xf59e0b;

    antennaMeshes.forEach(mesh => {
      if (mesh.material) {
        mesh.material.emissive.setHex(antennaColorHex);
        mesh.material.emissiveIntensity = 0.2 + (trafficLoadPct / 100) * 0.5;
      }
    });

    // Thermal view coloring on cabinet shell
    if (shell && shell.material) {
      if (viewMode === 'thermal') {
        const heatNorm = Math.min(1, Math.max(0, (internalTempC - 24) / 12));
        const thermalColor = new THREE.Color().setHSL(0.6 - heatNorm * 0.6, 0.9, 0.5);
        shell.material.color = thermalColor;
        shell.material.wireframe = false;
        shell.material.opacity = 0.9;
      } else if (viewMode === 'wireframe') {
        shell.material.wireframe = true;
        shell.material.color.setHex(0x38bdf8);
        shell.material.opacity = 0.8;
      } else {
        shell.material.wireframe = false;
        shell.material.color.setHex(0xe2e8f0);
        shell.material.opacity = 0.85;
      }
    }

    // BESS battery glow
    if (bess && bess.material) {
      if (bessDischargeKw > 0) {
        bess.material.emissive.setHex(0xf59e0b);
        bess.material.emissiveIntensity = 0.6;
      } else {
        bess.material.emissive.setHex(0x10b981);
        bess.material.emissiveIntensity = 0.25;
      }
    }
  }, [trafficLoadPct, internalTempC, viewMode, bessDischargeKw, showSolarPv]);

  // Camera preset handlers
  const handleCameraPreset = useCallback((preset) => {
    setCameraPreset(preset);
    if (!cameraRef.current || !controlsRef.current) return;

    isUserControllingRef.current = false;

    if (preset === 'tower') {
      targetCamPosRef.current.set(12, 14, 18);
      targetCamLookRef.current.set(0, 8, 0);
    } else if (preset === 'antennas') {
      targetCamPosRef.current.set(-2, 20.5, 4.5);
      targetCamLookRef.current.set(-2, 18.5, 0);
      setSelectedSubsystem('antenna');
    } else if (preset === 'cabinet') {
      targetCamPosRef.current.set(4.5, 2.8, 3.8);
      targetCamLookRef.current.set(2.8, 1.4, 0);
      setSelectedSubsystem('bbu');
    } else if (preset === 'thermal') {
      setViewMode('thermal');
      targetCamPosRef.current.set(3.8, 2.2, 3.2);
      targetCamLookRef.current.set(2.8, 1.4, 0);
      setSelectedSubsystem('hvac');
    }
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#0A1122] shadow-sm select-none">
      {/* 3D WebGL Canvas */}
      <div 
        ref={mountRef} 
        className="w-full h-[450px] md:h-[520px] cursor-grab active:cursor-grabbing outline-none"
        aria-label="3D Viewport Digital Twin Menara BTS dan Shelter Telkomsel"
      />

      {/* Top Left Minimal Spec HUD */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-[11px] font-semibold text-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>SITE 3D TWIN: {site?.id || 'BDG-DGO-P04'}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-300 font-mono">42m Lattice + Shelter IP55</span>
        </div>

        <div className="inline-flex items-center gap-3 px-2.5 py-1 rounded-md bg-slate-900/75 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 font-mono">
          <span>RF Load: <strong className="text-sky-400">{trafficLoadPct}%</strong></span>
          <span>·</span>
          <span>Suhu Kabinet: <strong className="text-emerald-400">{internalTempC}°C</strong></span>
          <span>·</span>
          <span>Daya RF: <strong className="text-amber-300">{rfPowerKw} kW</strong></span>
        </div>
      </div>

      {/* Top Right Quick View Modes */}
      <div className="absolute top-4 right-4 z-10 flex flex-wrap items-center justify-end gap-1.5">
        <button
          onClick={() => setShowSolarPv(prev => !prev)}
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition border ${
            showSolarPv
              ? 'bg-amber-950/80 border-amber-600 text-amber-200'
              : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
          title="Toggle Panel Surya PV Rooftop"
        >
          <Sun className="h-3 w-3 inline mr-1 text-amber-400" />
          Solar PV {showSolarPv ? 'ON' : 'OFF'}
        </button>

        <button
          onClick={() => setIsRotating(prev => !prev)}
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition border ${
            isRotating
              ? 'bg-sky-950/80 border-sky-600 text-sky-200'
              : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
          title="Auto-rotasi Orbit 3D"
        >
          <RotateCcw className={`h-3 w-3 inline mr-1 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          Orbit
        </button>

        <button
          onClick={() => setViewMode(m => (m === 'wireframe' ? 'solid' : 'wireframe'))}
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition border ${
            viewMode === 'wireframe'
              ? 'bg-purple-950/80 border-purple-600 text-purple-200'
              : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
          title="Mode Kawat Kerangka (Wireframe)"
        >
          <Layers className="h-3 w-3 inline mr-1" />
          Wireframe
        </button>

        <button
          onClick={() => {
            setViewMode(m => (m === 'thermal' ? 'solid' : 'thermal'));
            if (viewMode !== 'thermal') handleCameraPreset('thermal');
          }}
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition border ${
            viewMode === 'thermal'
              ? 'bg-amber-950/80 border-amber-600 text-amber-200'
              : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
          title="Inspeksi Termal Gradien Panas"
        >
          <Thermometer className="h-3 w-3 inline mr-1" />
          Thermal PINN
        </button>
      </div>

      {/* Interactive Subsystem Diagnostic Flyout (Appears when clicking 3D part) */}
      {selectedSubsystem && (
        <aside className="absolute top-16 right-4 z-20 w-72 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/90 p-3.5 shadow-2xl text-slate-200 space-y-2 pointer-events-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              {selectedSubsystem === 'antenna' && <Radio className="h-4 w-4 text-sky-400" />}
              {selectedSubsystem === 'bbu' && <Cpu className="h-4 w-4 text-purple-400" />}
              {selectedSubsystem === 'rectifier' && <Zap className="h-4 w-4 text-amber-400" />}
              {selectedSubsystem === 'bess' && <BatteryCharging className="h-4 w-4 text-emerald-400" />}
              {selectedSubsystem === 'hvac' && <Wind className="h-4 w-4 text-cyan-400" />}
              <span>
                {selectedSubsystem === 'antenna' && 'Antena AAU 64T64R'}
                {selectedSubsystem === 'bbu' && 'Baseband Unit BBU5900'}
                {selectedSubsystem === 'rectifier' && 'Rectifier AC/DC -48V'}
                {selectedSubsystem === 'bess' && 'String Baterai LiFePO4'}
                {selectedSubsystem === 'hvac' && 'HVAC Inverter Cooler'}
              </span>
            </div>
            <button
              onClick={() => setSelectedSubsystem(null)}
              className="text-slate-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 text-[11px] font-mono">
            {selectedSubsystem === 'antenna' && (
              <>
                <div className="flex justify-between text-slate-300">
                  <span>Sektor Aktif:</span>
                  <span className="text-sky-400 font-bold">3 / 3 (Alpha, Beta, Gamma)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Daya Transmisi RF:</span>
                  <span className="text-amber-300 font-bold">{rfPowerKw} kW</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Status Sleep O-RAN:</span>
                  <span className="text-emerald-400">{trafficLoadPct <= 50 ? 'Micro-Sleep ON' : 'Normal'}</span>
                </div>
              </>
            )}

            {selectedSubsystem === 'bbu' && (
              <>
                <div className="flex justify-between text-slate-300">
                  <span>Konsumsi Baseband:</span>
                  <span className="text-sky-400 font-bold">0.45 kW</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Protokol Kendali:</span>
                  <span className="text-purple-300">O-RAN O1 / NETCONF</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Carrier Band:</span>
                  <span className="text-slate-200">900/1800/2100/2300 MHz</span>
                </div>
              </>
            )}

            {selectedSubsystem === 'rectifier' && (
              <>
                <div className="flex justify-between text-slate-300">
                  <span>Tegangan Output:</span>
                  <span className="text-amber-400 font-bold">-48.2 VDC</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Efisiensi Konversi:</span>
                  <span className="text-emerald-400 font-bold">96.2%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Jumlah Modul:</span>
                  <span className="text-slate-200">4x 50A Paralel</span>
                </div>
              </>
            )}

            {selectedSubsystem === 'bess' && (
              <>
                <div className="flex justify-between text-slate-300">
                  <span>Kapasitas String:</span>
                  <span className="text-emerald-400 font-bold">{site?.bessCapacity?.split(' (')[0] || '48V 200Ah'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>State of Health (SoH):</span>
                  <span className="text-sky-400 font-bold">98.6%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Discharge Peak-Shaving:</span>
                  <span className="text-amber-300 font-bold">
                    {bessDischargeKw > 0 ? `-${bessDischargeKw} kW` : 'Standby Float'}
                  </span>
                </div>
              </>
            )}

            {selectedSubsystem === 'hvac' && (
              <>
                <div className="flex justify-between text-slate-300">
                  <span>Daya Inverter Kompresor:</span>
                  <span className="text-cyan-400 font-bold">{hvacPowerKw} kW</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Suhu Kabinet Internal:</span>
                  <span className="text-emerald-400 font-bold">{internalTempC}°C</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Suhu Luar (Ambient):</span>
                  <span className="text-amber-300">{ambientTempC}°C</span>
                </div>
              </>
            )}
          </div>
        </aside>
      )}

      {/* Ergonomic Collapsible Bottom Control Dock */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[860px] pointer-events-auto">
        {/* Toggle Collapse Button */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setIsDockCollapsed(prev => !prev)}
            className="px-3.5 py-1 rounded-t-lg bg-slate-900/90 hover:bg-slate-800 border-t border-x border-slate-700/80 text-[10px] font-medium text-slate-300 flex items-center gap-1 transition"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp className="h-3 w-3" />
                <span>Buka Panel Kontrol 3D</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" />
                <span>Sembunyikan Kontrol (Cinema Mode)</span>
              </>
            )}
          </button>
        </div>

        {/* Dock Interior */}
        {!isDockCollapsed && (
          <div className="rounded-xl bg-slate-900/92 backdrop-blur-md border border-slate-700/80 p-3 shadow-xl text-slate-200 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Camera Presets Segmented Tabs */}
              <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5 hidden sm:inline">Kamera:</span>
                <button
                  onClick={() => handleCameraPreset('tower')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                    cameraPreset === 'tower' ? 'bg-[#ED0226] text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Menara
                </button>
                <button
                  onClick={() => handleCameraPreset('antennas')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                    cameraPreset === 'antennas' ? 'bg-[#ED0226] text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Antena 5G
                </button>
                <button
                  onClick={() => handleCameraPreset('cabinet')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                    cameraPreset === 'cabinet' ? 'bg-[#ED0226] text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Kabinet
                </button>
                <button
                  onClick={() => handleCameraPreset('thermal')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                    cameraPreset === 'thermal' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Termal
                </button>
              </div>

              {/* Exploded View Slider */}
              <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 flex-1 min-w-[200px]">
                <Box className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                <span className="text-[10px] font-bold text-slate-300 whitespace-nowrap">Exploded View:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={explodedFactor}
                  onChange={(e) => setExplodedFactor(parseFloat(e.target.value))}
                  className="w-full accent-[#ED0226] h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  title="Pisahkan komponen menara dan rak kabinet"
                />
                <span className="font-mono text-[10px] text-slate-300 w-8 text-right font-bold">
                  {Math.round(explodedFactor * 100)}%
                </span>
              </div>
            </div>

            {/* Quick Component Spec Footnote */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 px-1">
              <span>Klik komponen 3D (Antena/Kabinet/Baterai) untuk inspeksi diagnostik · Drag untuk rotasi</span>
              <span className="font-mono text-emerald-400">Three.js Engine · Zero 404 Procedural PBR</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

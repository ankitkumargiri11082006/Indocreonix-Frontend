import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  Float, 
  OrbitControls, 
  Environment, 
  useTexture, 
  ContactShadows,
  Center,
  Sparkles
} from '@react-three/drei'
import * as THREE from 'three'

function CleanBrandLogo({ texture }) {
  // We use an internal canvas to programmatically remove the solid white background
  // and convert it into a perfectly soft-edged transparent texture
  const transparentTexture = useMemo(() => {
    if (!texture || !texture.image) return texture;
    
    const canvas = document.createElement('canvas');
    canvas.width = texture.image.width;
    canvas.height = texture.image.height;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(texture.image, 0, 0, canvas.width, canvas.height);
    
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      // Chroma key processing to strip white
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        
        const brightness = (r + g + b) / 3;
        
        // Target pixels that are very close to white
        if (brightness > 240 && Math.abs(r - g) < 15 && Math.abs(g - b) < 15) {
          // Calculate an alpha curve so edges blend smoothly
          const alphaFade = Math.max(0, 255 - (brightness - 240) * 17);
          data[i + 3] = alphaFade;
        }
      }
      
      ctx.putImageData(imgData, 0, 0);
      const newTex = new THREE.CanvasTexture(canvas);
      newTex.colorSpace = THREE.SRGBColorSpace;
      newTex.minFilter = texture.minFilter;
      newTex.magFilter = texture.magFilter;
      newTex.anisotropy = texture.anisotropy;
      return newTex;
    } catch (e) {
      console.warn("Could not process transparency", e);
      return texture;
    }
  }, [texture]);

  const logoAspect = texture.image?.width && texture.image?.height 
    ? texture.image.width / texture.image.height 
    : 1.55
  const logoWidth = 5.6
  const logoHeight = logoWidth / logoAspect

  return (
    <group>
      {/* PERFECTLY CLEAR TRANSPARENT LOGO */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[logoWidth, logoHeight]} />
        <meshBasicMaterial 
          map={transparentTexture} 
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function AnimatedTechRings() {
  const ringRef = useRef(null)

  useFrame((state, delta) => {
    if (ringRef.current) {
        ringRef.current.rotation.x += delta * 0.15
        ringRef.current.rotation.y += delta * 0.2
        ringRef.current.rotation.z -= delta * 0.1
    }
  })

  return (
    <group ref={ringRef}>
        {/* Thin, elegant, glossy rings orbiting the clear logo to provide 3D depth */}
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[3.8, 0.012, 32, 128]} />
          <meshPhysicalMaterial color="#4285f4" metalness={0.8} roughness={0.1} emissive="#4285f4" emissiveIntensity={0.5} />
        </mesh>
        
        <mesh rotation={[0, Math.PI / 3, 0]}>
          <torusGeometry args={[4.2, 0.008, 32, 128]} />
          <meshPhysicalMaterial color="#ea4335" metalness={0.8} roughness={0.1} emissive="#ea4335" emissiveIntensity={0.2} />
        </mesh>
        
        <mesh rotation={[0, 0, Math.PI / 6]}>
          <torusGeometry args={[4.6, 0.01, 32, 128]} />
          <meshPhysicalMaterial color="#34a853" metalness={0.8} roughness={0.1} emissive="#34a853" emissiveIntensity={0.2} />
        </mesh>
    </group>
  )
}

function GoogleModelScene() {
  const groupRef = useRef(null)
  
  const logoTexture = useTexture('/logo.png')
  logoTexture.colorSpace = THREE.SRGBColorSpace
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
       groupRef.current.position.y = Math.sin(t * 1.5) * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Center>
          <CleanBrandLogo texture={logoTexture} />
        </Center>
      </Float>
      
      <AnimatedTechRings />
      
      {/* Subtle background tech particles */}
      <Sparkles count={50} scale={10} size={2.5} speed={0.4} opacity={0.6} color="#4285f4" />
      <Sparkles count={30} scale={10} size={2.5} speed={0.4} opacity={0.6} color="#ea4335" />
    </group>
  )
}

function TechCore3DModel() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 7.5], fov: 45 }}>
        <color attach="background" args={['transparent']} />
        
        {/* Soft, professional lighting */}
        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight position={[10, 10, 10]} intensity={2.0} color="#ffffff" />
        <pointLight position={[-8, 0, 5]} intensity={1.0} color="#4285f4" distance={15} />

        <Suspense fallback={null}>
          <GoogleModelScene />
          <Environment preset="city" />
        </Suspense>
        
        <ContactShadows position={[0, -2.8, 0]} opacity={0.15} scale={14} blur={3} far={5} color="#202124" />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate 
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={Math.PI / 2 - 0.2}
        />
      </Canvas>
    </div>
  )
}

export default TechCore3DModel


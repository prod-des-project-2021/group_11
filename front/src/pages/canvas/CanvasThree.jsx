import React, { useRef, useState, useEffect, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { OrbitControls, Line } from "@react-three/drei"



function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => (mesh.current.rotation.x += 0.01))

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}



export default function thisCanvas(props) {

  return <>
    <Canvas id="models">
      <gridHelper />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />

      <Box position={[-1.2, 0, 0]} />
      <OrbitControls camera={props.camera}>
      </OrbitControls>

      <Line
        points={[[0, 0, 0], [12, 50, 60]]}       // Array of points
        color="red"                   // Default
        lineWidth={1}                   // In pixels (default)
        dashed={true}                  // Default
        
      />

    </Canvas>
  </>
}

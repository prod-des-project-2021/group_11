import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, useFrame } from '@react-three/fiber'


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

/*function Keen() {
    const orbit = useRef()
    const transform = useRef()
    const mode = useControl("mode", { type: "select", items: ["scale", "rotate", "translate"] })
    useEffect(() => {
      if (transform.current) {
        const controls = transform.current
        controls.setMode(mode)
        const callback = event => (orbit.current.enabled = !event.value)
        controls.addEventListener("dragging-changed", callback)
        return () => controls.removeEventListener("dragging-changed", callback)
      }
    })
    return (
      <>
        <TransformControls ref={transform}>
        </TransformControls>
        <OrbitControls ref={orbit} />
      </>
    )
  }*/
  

export default function thisCanvas (props){

    return <>
        <Canvas id="models">
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
        </Canvas>
    </>
}

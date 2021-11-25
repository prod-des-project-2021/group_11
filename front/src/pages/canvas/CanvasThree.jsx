import React, { Suspense, useEffect, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { Controls, useControl } from "react-three-gui"
import { OrbitControls, TransformControls } from "@react-three/drei"

function Keen() {
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
  }
  

const thisCanvas = props =>{

    return (
        <Canvas id="models">

            <gridHelper/>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <Suspense fallback={null}>
               <Keen />
            </Suspense>
            <Controls />
            {props.shapes}
        </Canvas>
    )
}
export default thisCanvas
import { useRef, useState, useEffect, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, TransformControls} from "@react-three/drei"

export default function ThisCanvas (props){
  let [controlTarget, setTarget] = useState()
  var [shapeArray, setShapeArray] = useState([])
  let [size, divs] = [100,100]
    
  useEffect(()=>{
    setShapeArray([<Box position={[0, 0, 0]} />])
  }, [])

  let addShape =()=>{
    let [x, z] = [(Math.random() * size/2) * (Math.round(Math.random()) ? 1 : -1), (Math.random() * size/2) * (Math.round(Math.random()) ? 1 : -1)]
    setShapeArray([...shapeArray, <Box position={[x, 0,z]}/>])
  }

  function Box(props) {
    // This reference will give us direct access to the mesh
    const mesh = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(() => (mesh.current.rotation.x += Math.random()*(0.1 - 0)  +0))
    return (
      <mesh
        {...props}
        ref={mesh}
        onClick={(event) => {setTarget(mesh.current)}}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
    )
  }
  
  var checkPos=(target)=>{
    console.log(target.worldPosition.x, target.worldPosition.y, target.worldPosition.z)
  }

    return <>
        <button onClick={()=>addShape()}>add box</button>
        <Canvas id="models" onClick={()=>console.log("perjelk")}>
            <pointLight position={[10, 10, 10]} />        
          <gridHelper args={[size,divs]}/>
          <TransformControls mode="translate" object={controlTarget}>
          </TransformControls>
          <OrbitControls makeDefault/>
          {shapeArray}
        </Canvas>
    </>
}



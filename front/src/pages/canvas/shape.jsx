import { useRef, useState, useEffect, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, TransformControls, Line } from "@react-three/drei"


export default function Shape(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  const [hovered, setHover] = useState(false)
  useEffect(()=>{
    let key
    if(props.keyid === undefined)
      key = 1
    else 
      key = props.keyid
    let meshObj = {"id":key, "mesh" : mesh.current}
    props.newMesh(meshObj)
  },[])

  return (
    <mesh
      {...props}
      ref={mesh}
      onClick={(event) => { props.setTarget(mesh.current)}}
      onPointerOver={(event) => {setHover(true)}}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[2,2,2]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

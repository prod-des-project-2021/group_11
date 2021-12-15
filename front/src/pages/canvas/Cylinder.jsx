import { useRef, useState, useEffect, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, useThree, useFrame } from '@react-three/fiber'

export default function Cylinder(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  const [hovered, setHover] = useState(false)
  let newSize
  switch(props.newSize) {
    case "small": {newSize = [0.25, 0.25, 0.5,8,1]} break;
    case "medium": {newSize = [0.5, 0.5, 0.5,8,1]} break;
    case "large": {newSize = [1, 1, 0.5,8,1]} break;
    case "huge": {newSize = [1.5, 1.5, 0.5,8,1]} break;
    case "gargantuan": {newSize = [2, 2, 0.5,8,1]} break;

  }

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
      <cylinderGeometry args={newSize} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

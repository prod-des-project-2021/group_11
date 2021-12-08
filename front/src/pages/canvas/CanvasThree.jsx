import { useRef, useState, useEffect, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, TransformControls, Line } from "@react-three/drei"
import {IonToggle} from '@ionic/react'


export default function ThisCanvas(props) {
  let [controlTarget, setTarget] = useState()
  let [shapeArray, setShapeArray] = useState([])
  let [tempVars, setTempVars] = useState({})
  let [meshData, setMeshData] = useState([])
  let [size, divs] = [100, 100]
  const [checked, setChecked] = useState(false);


  useEffect(() => {
    setShapeArray([])
    setMeshData([])
  }, [])

  let getId= (id) =>{
    return id
  }

  let addShape = (newSize) => {
    let [x, z] = [Math.floor(Math.random() * size / 2) * (Math.round(Math.random()) ? 1 : -1), Math.floor(Math.random() * size / 2) * (Math.round(Math.random()) ? 1 : -1)]
    //setShapeArray([...shapeArray, <Cylinder position={[x, 0, z]} />])
    let tempArray = shapeArray.flat()
    let newShape =  <Cylinder position={[x, 0, z]} newSize={newSize} /*getPos={(pos, id)=>getPos(pos,id)}*/keyid={tempArray.length} key={tempArray.length}/>
    tempArray.push(newShape)
    setShapeArray([])
    setShapeArray([tempArray.flat()])
  }

  let line = checked ? <Line points={[[0, 0, 0], [-1.2, 0, 0]]} color="red" lineWidth={1} dashed={true} /> :null
  function Cylinder(props) {
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
      let meshObj = {"id":props.keyid, "mesh" : mesh.current}
      let tempdata = meshData
      tempdata.push(meshObj)
      setMeshData(tempdata)
    },[])

    useEffect(() => {
      if(mesh.current.position)
      {
        //props.getPos(mesh.current.position, id)
      }
    })


    return (
      <mesh
        {...props}
        ref={mesh}
        onClick={(event) => { setTarget(mesh.current)}}
        onPointerOver={(event) => {setHover(true); meshData.map(i=>console.log(i.mesh.position))}}
        onPointerOut={(event) => setHover(false)}>
        <cylinderGeometry args={newSize} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
    )
  }
  meshData.map(i=> console.log(i.mesh.position))
  return <>
    <button onClick={() => addShape("gargantuan")}>add box</button>
    <button >get Json data</button>
    <IonToggle checked={checked} onIonChange={e => setChecked(e.detail.checked)} />
    <Canvas id="models">
      <pointLight position={[10, 10, 10]} />
      <gridHelper args={[size, divs]}/>
      <TransformControls mode="translate" object={controlTarget} size={1} translationSnap={1}>
      </TransformControls>
      <OrbitControls makeDefault />
      {shapeArray}
      {line}
    </Canvas>
  </>
}

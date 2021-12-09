import { useRef, useState, useEffect, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, TransformControls, Line } from "@react-three/drei"
import {IonToggle, IonItem,
  IonLabel,IonSelect,
  IonSelectOption} from '@ionic/react'
import axios from 'axios'
import Shape from './shape.jsx'


export default function ThisCanvas(props) {
  axios.defaults.baseURL = 'http://localhost:8000'
  let [controlTarget, setTarget] = useState()
  let [shapeArray, setShapeArray] = useState([])
  let [tempVars, setTempVars] = useState({})
  let [meshData, setMeshData] = useState([])
  let [nsize, setNSize] = useState("")
  let [size, divs] = [100, 100]
  let [ctrlMode, setCtrlMode] = useState("")
  const [checked, setChecked] = useState(false);

  //initialise empty arrays incase of reloads
  useEffect(() => {
    setShapeArray([])
    setMeshData([])
  }, [])

  //switch between camera modes
  useEffect(()=>{
    if(!props.ctrlMode)
      setCtrlMode("translate")
    else
      setCtrlMode(props.ctrlMode)

  },[props.ctrlMode])
  let addShape = (newSize) => {
    let [x, z] = [Math.floor(Math.random() * size / 2) * (Math.round(Math.random()) ? 1 : -1), Math.floor(Math.random() * size / 2) * (Math.round(Math.random()) ? 1 : -1)]
    let tempArray = shapeArray.flat()
    let newShape =  <Cylinder position={[x, 0, z]} newSize={newSize} keyid={tempArray.length} key={tempArray.length}/>
    tempArray.push(newShape)
    setShapeArray([tempArray.flat()])
  }

  let addMesh= (nmesh)=>{
    let tempData = meshData
    tempData.push(nmesh)
    setMeshData(tempData)
  }
  let addNewShapeToArray=(shape)=>{
    let tempArray = shapeArray.flat()
    tempArray.push(shape)
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
    return (
      <mesh
        {...props}
        ref={mesh}
        onClick={(event) => { setTarget(mesh.current)}}
        onPointerOver={(event) => {setHover(true)}}
        onPointerOut={(event) => setHover(false)}>
        <cylinderGeometry args={newSize} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
    )
  }

  let sendData=()=>{
    let postData =[]
    for(let i=0; i<shapeArray[0].length;i++){
      let shape = shapeArray[0][i]
      let mesh = meshData.find(x=>x.id == shape.key)
      let savesize = shape.props.newSize? shape.props.newSize : "large"
      postData.push({"id":shape.key,"type":mesh.mesh.geometry.type,"size":savesize,"pos":mesh.mesh.position, "rot": [mesh.mesh.rotation.x,mesh.mesh.rotation.y,mesh.mesh.rotation.z], "scale": mesh.mesh.scale})
    }
    console.log(postData)
    axios.get("/lol").then(function (res){console.log(res)}).catch(function(err){console.log(err)})
  }

  function makeShape(){
    let newShape = <Shape setTarget={(mesh)=>setTarget(mesh)} newMesh={(nmesh)=>addMesh(nmesh)} position={[0,0,0]} keyid={shapeArray.length} key={shapeArray.length}/>
    addNewShapeToArray(newShape)
  }

  return <>
    <IonItem>
      <IonLabel>Size</IonLabel>
      <IonSelect value = {nsize} onIonChange={(e)=>setNSize(e.detail.value)} okText="Okay" cancelText="Dismiss">
        <IonSelectOption value="small">small</IonSelectOption>
        <IonSelectOption value="medium">medium</IonSelectOption>
        <IonSelectOption value="large">large</IonSelectOption>
        <IonSelectOption value="huge">huge</IonSelectOption>
        <IonSelectOption value="gargantuan">gargantuan</IonSelectOption>
      </IonSelect>
    </IonItem>
    <button onClick={() => makeShape()}>add thing</button>
    <button onClick={() => addShape(nsize)}>add unit</button>
    <button onClick={()=>sendData()}>get Json data</button>
    <IonToggle checked={checked} onIonChange={e => setChecked(e.detail.checked)} />
    <Canvas id="models" onPointerMissed={(e)=>console.log(e.pageX, e.pageY)}>
      <pointLight position={[0, 100, 0]} />
      <gridHelper args={[size, divs]}/>
      <TransformControls mode={ctrlMode} object={controlTarget} size={0.5} translationSnap={1}>
      </TransformControls>
      <OrbitControls makeDefault />
      {shapeArray}
      {line}
    </Canvas>
  </>
}

import { useRef, useState, useEffect, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, useThree, useFrame,Group } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, TransformControls, Line, Plane,group, Billboard, Text} from "@react-three/drei"
import {
  IonToggle, IonItem,
  IonLabel, IonSelect,
  IonSelectOption
} from '@ionic/react'
import axios from 'axios'
import Shape from './shape.jsx'
import Cylinder from './Cylinder.jsx'
import { v4 as uuidv4 } from 'uuid';
//import './canvasStyle.css'
import { PopoverExample } from '../menu.jsx'

function MeasureLine(props) {
  let [pos, setPos] = useState([])

  const ref = useRef()

  let [line, setLine] = useState(<Line ref={ref} points={[[1,1,1],props.endPos]} lineWidth={3}/>)
  let [dis , setDis] = useState()


  let updateLine = (newPos) => {
    setPos(newPos)
    setLine(<Line ref={ref} points={[pos,props.endPos]} lineWidth={2}/>)
    let difx = Math.pow(pos.x-props.endPos[0],2)
    let dify = Math.pow(pos.y-props.endPos[1],2)
    let difz = Math.pow(pos.z-props.endPos[2],2)
    setDis(Math.sqrt(difx+dify+difz))
  }

  useFrame(()=>{
    let tempP = props.Pos(props.keyid)
    updateLine(tempP) 
  }, [])



  let toReturn = <group>
    {line}
    <Billboard
    position={[(pos.x-props.endPos[0])/2,(pos.y-props.endPos[1])/2,(pos.z-props.endPos[2])/2]}  
    follow={true}
    lockX={false}
    lockY={false}
    lockZ={false}>
      <Text fontSize={1} outlineWidth={0.1} outlineColor={"black"}>{(dis*5).toFixed(3)}</Text>
    </Billboard>
  </group>
  return toReturn
}


export default function ThisCanvas(props) {
  //set axios default url, only type /addr in axios requests to make it work
  axios.defaults.baseURL = 'http://localhost:8000'
  let [controlTarget, setTarget] = useState()
  let [shapeArray, setShapeArray] = useState([])
  let [tempVars, setTempVars] = useState({})
  let [meshData, setMeshData] = useState([])
  
  let [size, divs] = [100, 100]
  let [ctrlMode, setCtrlMode] = useState("")
  const [checked, setChecked] = useState(false);

  //initialise arrays incase of reloads
  useEffect(() => {
    setShapeArray([<Plane args={[size,divs]} rotation={[-1.57,0,0]} key={0}/>])
    setMeshData([])
  }, [])

  //switch between camera modes
  useEffect(() => {
    if (!props.ctrlMode)
      setCtrlMode("translate")
    else
      setCtrlMode(props.ctrlMode)
  }, [props.ctrlMode])


  //add meshes into meshData without fucking things over
  let addMesh = (nmesh) => {
    let tempData = meshData
    tempData.push(nmesh)
    setMeshData(tempData)
  }

  //add things into shapeArray so that the data is readable when posting to server
  let newShapeToArray = (shape) => {
    let tempArray = shapeArray.flat()
    tempArray.push(shape)
    setShapeArray([tempArray.flat()])
  }



  //add new units
  let addUnit = (newSize) => {
    //random x & z coords for units
    let [x, z] = [Math.floor(Math.random() * size / 2) * (Math.round(Math.random()) ? 1 : -1), Math.floor(Math.random() * size / 2) * (Math.round(Math.random()) ? 1 : -1)]
    let key = shapeArray[0].length != undefined ? shapeArray[0].length : 1
    let newShape = <Cylinder position={[x, 0, z]} newSize={newSize} keyid={key} setTarget={(mesh) => setTarget(mesh)} key={key} newMesh={(nmesh) => addMesh(nmesh)} />
    newShapeToArray(newShape)
  }

  //create new shape, use as terrain or buildings or some shit
  function makeShape() {
    let key = shapeArray[0].length != undefined ? shapeArray[0].length : 1
    let newShape = <Shape setTarget={(mesh) => setTarget(mesh)} newMesh={(nmesh) => addMesh(nmesh)} position={[0, 0, 0]} keyid={key} key={key} />
    newShapeToArray(newShape)
  }
  //nabeels line, very important
  let line = checked ? <Line points={[[0, 0, 0], [-1.2, 0, 0]]} color="red" lineWidth={5} dashed={true} /> : null

  let getTargetPos=(key)=>{
    let mesh = meshData.find(mesh=>mesh.id === controlTarget.keyid).mesh.position
    return mesh
  }
    
  let smth = controlTarget ? <MeasureLine Pos={(key)=>getTargetPos(key)} startPos={[15,1,1]} endPos={[0, 0, 0]} keyid={controlTarget.keyid}/>
  : null

  //send data to server
  let sendData=()=>{
    let postData =[]
    console.log(shapeArray[0].length)
    for(let i=1; i<shapeArray[0].length;i++){
      let shape = shapeArray[0][i]
      let mesh = meshData[i-1]
      let savesize = shape.props.newSize ? shape.props.newSize : "large"
      postData.push({ "id": shape.key, "gtype": mesh.mesh.geometry.type, "size": savesize, "pos": mesh.mesh.position, "rot": [mesh.mesh.rotation.x, mesh.mesh.rotation.y, mesh.mesh.rotation.z], "scale": mesh.mesh.scale, "uuid":mesh.mesh.uuid })
    }
    console.log({"postData":postData})
    axios.post("/newmap", {"post_data":postData, "map_id":uuidv4(), "user_id": 1}).then(function (res) { console.log(res) }).catch(function (err) { console.log(err) })
  }

  return <>
    <PopoverExample makeShape={() => makeShape()} addUnit={(nsize) => addUnit(nsize)} sendData={() => sendData}/>
    <IonToggle checked={checked} onIonChange={e => setChecked(e.detail.checked)} />
    <Canvas id="models" onPointerMissed={(e) => console.log(e.pageX, e.pageY)}>
      <pointLight position={[0, 100, 0]} />
      <gridHelper args={[size, divs]} />
      <TransformControls mode={ctrlMode} object={controlTarget} translationSnap={1}>
      </TransformControls>
      <OrbitControls makeDefault />
      {shapeArray}
      {line}
      {smth}
    </Canvas>
  </>

}

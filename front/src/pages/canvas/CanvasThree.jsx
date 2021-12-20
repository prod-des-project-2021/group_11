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
import MapDataTab from '../MapDataTab.jsx'
import Sphere from './Sphere.jsx'
import Login from '../login.jsx'
function MeasureLine(props) {
  let [pos, setPos] = useState([1,1,1])
  let [endPos, setEndPos] = useState([0,0,0])
  const ref = useRef()

  let [line, setLine] = useState(<Line ref={ref} points={[pos,endPos]} lineWidth={3}/>)
  let [dis , setDis] = useState()


  let updateLine = (newPos, keyId) => {
    if(keyId === -1)
      setEndPos(newPos)
    else
      setPos(newPos)
    
    setLine(<Line ref={ref} points={[pos,endPos]} lineWidth={2}/>)
    let difx = Math.pow(pos.x-endPos.x,2)
    let dify = Math.pow(pos.y-endPos.y,2)
    let difz = Math.pow(pos.z-endPos.z,2)
    setDis(Math.sqrt(difx+dify+difz))
  }

  useFrame(()=>{
    let tempS = props.Pos(props.keyid)
    updateLine(tempS, props.keyid) 
  }, [])



  let toReturn = <group>
    {line}
    <Billboard
    position={[endPos.x,endPos.y+1,endPos.z]}  
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
  //switch between camera modes
  useEffect(() => {
    if (!props.ctrlMode)
      setCtrlMode("translate")
    else
      setCtrlMode(props.ctrlMode)
  }, [props.ctrlMode])

  //login things
  let [id, setId] = useState()
  let [maps, setMaps] = useState()
  let [selMap, setMap] = useState(-1)
  const [succLog, setSuccLog] = useState(false)

  let get_maps = (idn)=>{
    axios.get("/maps/"+idn).then(res=>{console.log(res.data); if(res.data) setMaps(res.data)})
  }
  let login =(username, password) => {
    axios.post("login",{username: username, password: password})
    .then((res)=>{
      if(res.data.id)
        setId(res.data.id)
        setSuccLog(true)
        get_maps(res.data.id)
      console.log(res)
    })
  }

  let loggedin = succLog === false?<Login login={(username, password)=>login(username, password)}/>:null


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

  //load map from maps array
  useEffect(() => {
    if(selMap != -1)
    {
      let tempArray = [<Plane args={[size,divs]} rotation={[-1.57,0,0]} key={0}/>]
      for(let i = 0; i < maps[selMap].post_data.length; i++){
        let datapl = maps[selMap].post_data[i]
        let newShape
        if(datapl.gtype === "CylinderGeometry")
          newShape = <Cylinder position={[datapl.pos.x, datapl.pos.y, datapl.pos.z]} scale={[datapl.scale.x, datapl.scale.y, datapl.scale.z]} rotation={datapl.rot} newSize={datapl.size} keyid={datapl.id} setTarget={(mesh) => setTarget(mesh)} key={datapl.id} newMesh={(nmesh) => addMesh(nmesh)} />
        else 
          newShape = <Shape setTarget={(mesh) => setTarget(mesh)} newMesh={(nmesh) => addMesh(nmesh)} position={[0, 0, 0]} keyid={datapl.id} key={datapl.id} scale={[datapl.scale.x, datapl.scale.y, datapl.scale.z]} rotation={datapl.rot}/>
        
        tempArray.push(newShape);
       }
       setShapeArray([tempArray.flat()])
    }
  },[selMap])

  console.log(meshData)
  //nabeels line, very important
  let sphere = <Sphere color="red" position={[0,0,0]} setTarget={(mesh) => setTarget(mesh)} newMesh={(nmesh) => addMesh(nmesh)} keyid={-1} key={-1}/>


  let getTargetPos=(key)=>{
    let mesh = meshData.find(mesh=>mesh.id === controlTarget.keyid).mesh.position
    return mesh
  }
  
  let smth = controlTarget && checked ? <MeasureLine Pos={(key)=>getTargetPos(key)} keyid={controlTarget.keyid}/>
  : null

  //send data to server
  let sendData=()=>{
    let postData =[]
    console.log("sending data")
    console.log(shapeArray[0].length)
    for(let i=1; i<shapeArray[0].length;i++){
      let shape = shapeArray[0][i]
      let mesh = meshData[i-1]
      console.log(mesh)
      let savesize = shape.props.newSize ? shape.props.newSize : "large"
      postData.push({ "id": shape.key, "gtype": mesh.mesh.geometry.type, "size": savesize, "pos": mesh.mesh.position, "rot": [mesh.mesh.rotation.x, mesh.mesh.rotation.y, mesh.mesh.rotation.z], "scale": mesh.mesh.scale, "uuid":mesh.mesh.uuid })
    }
    console.log({"postData":postData})

    //handles new or update map
    if(selMap != -1)
    axios.post("/update", {"post_data":postData, "map_id":maps[selMap].map_id, "user_id": id}).then(function (res) { console.log(res) }).catch(function (err) { console.log(err) })
    else
      axios.post("/newmap", {"post_data":postData, "map_id":uuidv4(), "user_id": id}).then(function (res) { console.log(res) }).catch(function (err) { console.log(err) })
  }

  return <>
    {loggedin}
    <PopoverExample makeShape={() => makeShape()} addUnit={(nsize) => addUnit(nsize)} sendData={() => sendData()}/>
    <MapDataTab  get_maps={()=>get_maps()} maps={maps} setMap={(it) => setMap(it)}/>
    <IonToggle checked={checked} onIonChange={e => setChecked(e.detail.checked)} />
    <Canvas id="models" onPointerMissed={(e) => console.log(e.pageX, e.pageY)}>
      <pointLight position={[0, 100, 0]} />
      <gridHelper args={[size, divs]} />
      <TransformControls mode={ctrlMode} object={controlTarget} translationSnap={1}>
      </TransformControls>
      <OrbitControls makeDefault />
      {shapeArray}
      {sphere}
      {smth}
    </Canvas>
  </>

}

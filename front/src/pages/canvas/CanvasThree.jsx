import { useRef, useState, useEffect, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, useThree , useFrame} from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, TransformControls, Line, Plane, Environment } from "@react-three/drei"
import {IonToggle, IonItem,
  IonLabel,IonSelect,
  IonSelectOption} from '@ionic/react'
import axios from 'axios'
import Shape from './shape.jsx'
import Cylinder from './Cylinder.jsx'


export default function ThisCanvas(props) {
  //set axios default url, only type /addr in axios requests to make it work
  axios.defaults.baseURL = 'http://localhost:8000'
  let [controlTarget, setTarget] = useState()
  let [shapeArray, setShapeArray] = useState([])
  let [tempVars, setTempVars] = useState({})
  let [meshData, setMeshData] = useState([])
  let [nsize, setNSize] = useState("")
  let [size, divs] = [100, 100]
  let [ctrlMode, setCtrlMode] = useState("")
  const [checked, setChecked] = useState(false);

  //initialise arrays incase of reloads
  useEffect(() => {
    setShapeArray([<Plane args={[size,divs]} rotation={[-1.57,0,0]} key={0}/>])
    setMeshData([])
  }, [])

  //switch between camera modes
  useEffect(()=>{
    if(!props.ctrlMode)
      setCtrlMode("translate")
    else
      setCtrlMode(props.ctrlMode)
  },[props.ctrlMode])


//add meshes into meshData without fucking things over
  let addMesh= (nmesh)=>{
    let tempData = meshData
    tempData.push(nmesh)
    setMeshData(tempData)
  }

//add things into shapeArray so that the data is readable when posting to server
  let newShapeToArray=(shape)=>{
    let tempArray = shapeArray.flat()
    tempArray.push(shape)
    setShapeArray([tempArray.flat()])
  }

   //current x and previous x
   var [currX, setXn] = useState(0)
   var [prevX, setXp] = useState(0)
 
   //current y and previous y
   var [currY, setYn] = useState(0)
   var [prevY, setYp] = useState(0)
 
   //current z and previous z
   var [currZ, setZn] = useState(0)
   var [prevZ, setZp] = useState(0)
 
   let red_line = checked ? <Line points={[[prevX, prevY, prevZ], [currX, currY, currZ]]} color="red" lineWidth={1} dashed={true} /* {...lineProps}  All THREE.Line2 props are valid {...materialProps} /* All THREE.LineMaterial props are valid */ /> : null
 
 
   var begin = (x, y, z, name) => {
     switch (name) {
       case "down": {
 
       }
     }
   }
 

  //add new units
  let addUnit = (newSize) => {
    //random x & z coords for units
    let [x, z] = [Math.floor(Math.random() * size / 2) * (Math.round(Math.random()) ? 1 : -1), Math.floor(Math.random() * size / 2) * (Math.round(Math.random()) ? 1 : -1)]
    let newShape =  <Cylinder position={[x, 0, z]} newSize={newSize} keyid={shapeArray[0].length} setTarget={(mesh)=>setTarget(mesh)} key={shapeArray[0].length} newMesh={(nmesh)=>addMesh(nmesh)}/>
    newShapeToArray(newShape)
  }

  //create new shape, use as terrain or buildings or some shit
  function makeShape(){
    let newShape = <Shape setTarget={(mesh)=>setTarget(mesh)} newMesh={(nmesh)=>addMesh(nmesh)} position={[0,0,0]} keyid={shapeArray[0].length} key={shapeArray[0].length}/>
    newShapeToArray(newShape)
  }
  //nabeels line, very important
  let line = (checked && controlTarget) ? <Line points={[controlTarget.position, [0, 0, 0]]} color="red" lineWidth={2} /> :null
  const measure =(start) =>{
    console.log(line)
  }

//send data to server
  let sendData=()=>{
    let postData =[]
    console.log(shapeArray[0].length)
    for(let i=1; i<shapeArray[0].length;i++){
      let shape = shapeArray[0][i]
      let mesh = meshData[i-1]
      let savesize = shape.props.newSize? shape.props.newSize : "large"
      console.log(mesh)
      postData.push({"id":shape.key,"type":mesh.mesh.geometry.type,"size":savesize,"pos":mesh.mesh.position, "rot": [mesh.mesh.rotation.x,mesh.mesh.rotation.y,mesh.mesh.rotation.z], "scale": mesh.mesh.scale})
    }
    console.log(postData)
    axios.get("/lol").then(function (res){console.log(res)}).catch(function(err){console.log(err)})
  }

  return <>
    <IonItem>
      <IonLabel>Size</IonLabel>
      <IonSelect value={nsize} onIonChange={(e) => setNSize(e.detail.value)} okText="Okay" cancelText="Dismiss">
        <IonSelectOption value="small">small</IonSelectOption>
        <IonSelectOption value="medium">medium</IonSelectOption>
        <IonSelectOption value="large">large</IonSelectOption>
        <IonSelectOption value="huge">huge</IonSelectOption>
        <IonSelectOption value="gargantuan">gargantuan</IonSelectOption>
      </IonSelect>
    </IonItem>
    <button onClick={() => makeShape()}>add thing</button>
    <button onClick={() => addUnit(nsize)}>add unit</button>
    <button onClick={()=>sendData()}>get Json data</button>
    <IonToggle checked={checked} onIonChange={e => setChecked(e.detail.checked)} />
    <Canvas id="models" onPointerMissed={(e)=>console.log(e.pageX, e.pageY)}>
      <pointLight position={[0, 100, 0]} />
      <gridHelper args={[size, divs]}/>
      <TransformControls mode={ctrlMode} object={controlTarget} translationSnap={1}>
      </TransformControls>
      <OrbitControls makeDefault />
      {shapeArray}
      {line}


    </Canvas>
  </>

}

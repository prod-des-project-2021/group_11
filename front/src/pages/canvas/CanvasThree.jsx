import { useRef, useState, useEffect, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, TransformControls, Line, Plane, Environment, QuadraticBezierLine } from "@react-three/drei"
import {
  IonToggle, IonItem,
  IonLabel, IonSelect,
  IonSelectOption
} from '@ionic/react'
import axios from 'axios'
import Shape from './shape.jsx'
import Cylinder from './Cylinder.jsx'

function MeasureLine(props) {
  const ref = useRef()
  console.log(props.startPos)
  useFrame((state) => {
    ref.current.setPoints(
      [props.startPos.x, props.startPos.y, props.startPos.z],
      [props.endPos.x, props.endPos.y, props.endPos.z],
      // [5, 0, 0] // Optional: mid-point
    )
  }, [])
  return <QuadraticBezierLine ref={ref} 
    color="black"
    lineWidth={1}
    dashed={false} />
}


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
    setShapeArray([<Plane args={[size, divs]} rotation={[-1.57, 0, 0]} />])
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
    let newShape = <Cylinder position={[x, 0, z]} newSize={newSize} keyid={shapeArray.length} setTarget={(mesh) => setTarget(mesh)} key={shapeArray.length} newMesh={(nmesh) => addMesh(nmesh)} />
    newShapeToArray(newShape)
  }

  //create new shape, use as terrain or buildings or some shit
  function makeShape() {
    let newShape = <Shape setTarget={(mesh) => setTarget(mesh)} newMesh={(nmesh) => addMesh(nmesh)} position={[0, 0, 0]} keyid={shapeArray.length} key={shapeArray.length} />
    newShapeToArray(newShape)
  }
  //nabeels line, very important
  let line = checked ? <Line points={[[0, 0, 0], [-1.2, 0, 0]]} color="red" lineWidth={5} dashed={true} /> : null

  const positions = [];
  let splinePointsLength = 4;
  const splines = {};
  const ARC_SEGMENTS = 200;
  const splineHelperObjects = [];
  let scene;
  /*const geometry = new THREE.BoxGeometry(20, 20, 20);*/

  /*var makeLine = () => {
    for (let i = 0; i < splinePointsLength; i++) {

      addSplineObject(positions[i]);

    }

    positions.length = 0;

    for (let i = 0; i < splinePointsLength; i++) {

      positions.push(splineHelperObjects[i].position);

    }

    const geometry = <bufferGeometry position = {[]}/>;
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ARC_SEGMENTS * 3), 3));

    let curve = new THREE.CatmullRomCurve3(positions);
    curve.curveType = 'catmullrom';
    curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
      color: 0xff0000,
      opacity: 0.35
    }));
    curve.mesh.castShadow = true;
    splines.uniform = curve;

  }

  function addSplineObject(position) {

    const material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
    const object = new THREE.Mesh(geometry, material);

    if (position) {

      object.position.copy(position);

    } else {

      object.position.x = Math.random() * 1000 - 500;
      object.position.y = Math.random() * 600;
      object.position.z = Math.random() * 800 - 400;

    }

    object.castShadow = true;
    object.receiveShadow = true;
    scene.add(object);
    splineHelperObjects.push(object);
    return object;

  }*/



  let smth = controlTarget ? <MeasureLine startPos={controlTarget.position} endPos={[10, 0, 10]}
  /> : null







  //send data to server
  let sendData = () => {
    let postData = []
    for (let i = 0; i < shapeArray[0].length; i++) {
      let shape = shapeArray[0][i]
      let mesh = meshData.find(x => x.id == shape.key)
      let savesize = shape.props.newSize ? shape.props.newSize : "large"
      postData.push({ "id": shape.key, "type": mesh.mesh.geometry.type, "size": savesize, "pos": mesh.mesh.position, "rot": [mesh.mesh.rotation.x, mesh.mesh.rotation.y, mesh.mesh.rotation.z], "scale": mesh.mesh.scale })
    }
    console.log(postData)
    axios.get("/lol").then(function (res) { console.log(res) }).catch(function (err) { console.log(err) })
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
    <button onClick={() => sendData()}>get Json data</button>
    <IonToggle checked={checked} onIonChange={e => setChecked(e.detail.checked)} />
    <Canvas id="models" onPointerMissed={(e) => console.log(e.pageX, e.pageY)}>
      <pointLight position={[0, 100, 0]} />
      <gridHelper args={[size, divs]} />
      <TransformControls change={console.log(controlTarget)} mode={ctrlMode} object={controlTarget} translationSnap={1}>
      </TransformControls>
      <OrbitControls makeDefault />
      {shapeArray}
      {line}
      {smth}



    </Canvas>
  </>

}

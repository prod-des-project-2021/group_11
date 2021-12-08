import { useRef, useState, useEffect, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, TransformControls, Line } from "@react-three/drei"
import {
  IonToggle, IonItem,
  IonLabel, IonSelect,
  IonSelectOption
} from '@ionic/react'
import axios from 'axios'


export default function ThisCanvas(props) {
  axios.defaults.baseURL = 'http://localhost:8000'
  let [controlTarget, setTarget] = useState()
  let [shapeArray, setShapeArray] = useState([])
  let [tempVars, setTempVars] = useState({})
  let [meshData, setMeshData] = useState([])
  let [nsize, setNSize] = useState("")
  let [size, divs] = [100, 100]
  const [checked, setChecked] = useState(false);


  useEffect(() => {
    setShapeArray([])
    setMeshData([])
  }, [])


  let addShape = (newSize) => {
    let [x, z] = [Math.floor(Math.random() * size / 2) * (Math.round(Math.random()) ? 1 : -1), Math.floor(Math.random() * size / 2) * (Math.round(Math.random()) ? 1 : -1)]
    let tempArray = shapeArray.flat()
    let newShape = <Cylinder position={[x, 0, z]} newSize={newSize} keyid={tempArray.length} key={tempArray.length} />
    tempArray.push(newShape)
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

  let line = checked ? <Line points={[[prevX, prevY, prevZ], [currX, currY, currZ]]} color="red" lineWidth={1} dashed={true} /* {...lineProps}  All THREE.Line2 props are valid {...materialProps} /* All THREE.LineMaterial props are valid */ /> : null


  var begin = (x, y, z, name) => {
    switch (name) {
      case "down": {

      }
    }
  }


  function Box(props) {
    let line = checked ? <Line points={[[0, 0, 0], [-1.2, 0, 0]]} color="red" lineWidth={1} dashed={true} /> : null
    function Cylinder(props) {
      // This reference will give us direct access to the mesh
      const mesh = useRef()
      const [hovered, setHover] = useState(false)
      let newSize
      switch (props.newSize) {
        case "small": { newSize = [0.25, 0.25, 0.5, 8, 1] } break;
        case "medium": { newSize = [0.5, 0.5, 0.5, 8, 1] } break;
        case "large": { newSize = [1, 1, 0.5, 8, 1] } break;
        case "huge": { newSize = [1.5, 1.5, 0.5, 8, 1] } break;
        case "gargantuan": { newSize = [2, 2, 0.5, 8, 1] } break;
      }

      useEffect(() => {
        let meshObj = { "id": props.keyid, "mesh": mesh.current }
        let tempdata = meshData
        tempdata.push(meshObj)
        setMeshData(tempdata)
      }, [])
      return (
        <mesh
          {...props}
          ref={mesh}
          onClick={(event) => { setTarget(mesh.current) }}
          onPointerOver={(event) => { setHover(true) }}
          onPointerOut={(event) => setHover(false)}>
          <cylinderGeometry args={newSize} />
          <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
      )
    }

    let sendData = () => {
      let postData = []
      for (let i = 0; i < shapeArray[0].length; i++) {
        let shape = shapeArray[0][i]
        let mesh = meshData.find(x => x.id == shape.key)
        postData.push({ "id": shape.key, "shape": shape.type.name, "size": shape.props.newSize, "pos": mesh.mesh.position })
      }
      console.log(postData)
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
      <button onClick={() => addShape(nsize)}>add unit</button>
      <button onClick={() => sendData()}>get Json data</button>
      <IonToggle checked={checked} onIonChange={e => setChecked(e.detail.checked)} />
      <Canvas id="models">
        <pointLight position={[10, 10, 10]} />
        <gridHelper args={[size, divs]} />
        <TransformControls mode="translate" object={controlTarget} size={1} translationSnap={1}>
        </TransformControls>
        <OrbitControls makeDefault />
        {shapeArray}
        {line}

        onMouseDown={(e) => begin(e.pageX, e.pageY, e.pageZ, "down")}
      </Canvas>
    </>
  }
}

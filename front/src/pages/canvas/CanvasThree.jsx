import { useRef, useState, useEffect, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, TransformControls, Line, } from "@react-three/drei"
import { IonToggle } from '@ionic/react';

export default function ThisCanvas(props) {
  let [controlTarget, setTarget] = useState()
  var [shapeArray, setShapeArray] = useState([])
  let [size, divs] = [100, 100]
  const [checked, setChecked] = useState(false);


  useEffect(() => {
    setShapeArray([])
  }, [])

  let addShape = () => {
    let [x, z] = [(Math.random() * size / 2) * (Math.round(Math.random()) ? 1 : -1), (Math.random() * size / 2) * (Math.round(Math.random()) ? 1 : -1)]
    setShapeArray([...shapeArray, <Box position={[x, 0, z]} />])
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
    switch(name) {
      case "down": {
        
      }
    }
  }


  function Box(props) {
    // This reference will give us direct access to the mesh
    const mesh = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(() => (mesh.current.rotation.x += Math.random() * (0.1 - 0) + 0))
    return (
      <mesh
        {...props}
        ref={mesh}
        onClick={(event) => { setTarget(mesh.current) }}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
    )
  }

  var checkPos = (target) => {
    console.log(target.worldPosition.x, target.worldPosition.y, target.worldPosition.z)
  }

  return <>
    <button onClick={() => addShape()}>add box</button>
    <IonToggle checked={checked} onIonChange={e => setChecked(e.detail.checked)} />
    <Canvas id="models" onClick={() => console.log("perjelk")}>
      <pointLight position={[10, 10, 10]} />
      <gridHelper args={[size, divs]} />
      <TransformControls mode="translate" object={controlTarget}>
      </TransformControls>
      <OrbitControls makeDefault />
      {shapeArray}
      {line}

      onMouseDown={(e) => begin(e.pageX, e.pageY, e.pageZ, "down")}
    </Canvas>
  </>
}



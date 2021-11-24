import { createPublicKey } from 'crypto';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react'

const Canvas = props => {

  var [ctx, setctx] = useState()
  var [size, setSize]= useState(50)
  var [imgData, setImgData] = useState()

  //units array will probably look something like this [{unit: {x: 1, y:1,size:1}}]
  var [units, modUnits] = useState([])

  let drawGrid= (width, height, canvas, context) => {
      canvas.setAttribute('width', width)
      canvas.setAttribute('height',height)
      context.fillStyle = 'white'
      context.fillRect(0, 0, context.canvas.width, context.canvas.height)
      let i = 0
      context.beginPath()
      while(i < canvas.width){
        context.moveTo(i, 0)
        context.lineTo(i, canvas.height)
        i = i + 50
      }
      i = 0
      while(i < canvas.height){
        context.moveTo(0, i)
        context.lineTo(canvas.width, i)
        context.strokeStyle = 'black'
        i = i + 50
    }
      context.strokeStyle = 'black'
      context.lineWidth = 3
      context.stroke()
      context.closePath()

    /* for loop takes up too much memory for some reason, using 2 while loops works for some reason?
    for (let i = 0; i <= canvas.width; i + 50){
      context.moveTo(i, 0)
      context.lineTo(i, canvas.height)
      context.strokeStyle = 'black'
      context.stroke()
    }
    for (let o = 0; o <= canvas.height; o + 50){
      context.moveTo(0, o)
      context.lineTo(canvas.width, o)
      context.strokeStyle = 'black'
      context.stroke()
    }*/
  }


  //set up canvas, redraws canvas on screen size change
  useEffect(() => {

    let canvas = canvasRef.current
    canvas.setAttribute('width', window.innerWidth)
    canvas.setAttribute('height',window.innerHeight)
    const context = canvas.getContext('2d')

    setctx(context)    
    drawGrid(canvas.width, canvas.height, canvas, context)  
    setImgData(context.getImageData(0,0,canvas.width,canvas.height))

    //'https://upload.wikimedia.org/wikipedia/commons/7/70/Graph_paper_scan_1600x1000_%286509259561%29.jpg'
  }, [])

  useEffect(() =>{
    if(ctx != undefined || ctx != null){
      setImgData(ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height))
      drawGrid(window.innerWidth, window.innerHeight, ctx.canvas, ctx)
      ctx.putImageData(imgData, 0, 0)
      console.log(imgData)
    }
  },[window.innerWidth, window.innerHeight])

  //current x and previous x
  var [currX, setXn] = useState(0)
  var [prevX, setXp] = useState(0)

  //current y and previous y
  var [currY, setYn] = useState(0)
  var [prevY, setYp] = useState(0)

  //is drawing allowed?
  var [flag, setFlag] = useState(false)

  const canvasRef = useRef(null)

  var draw = () => {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  }

  let [slcKey, setKey] = useState()
  var keyPressed = (key) => {
    setKey(key);
  }
  //drawing the measurment line
  let addUnit = () =>{
    ctx.beginPath()
    ctx.fillStyle = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')
    console.log(ctx.fillStyle)
    ctx.arc(Math.floor(Math.random()*(window.innerWidth)), Math.floor(Math.random()*(window.innerHeight)),25,0, 2*Math.PI, true)
    ctx.fill()
    console.log("perkele")
    ctx.closePath()
  }
  var measurement_start = () => {
      ctx.beginPath()
      ctx.moveTo(prevX, prevY);
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 3;
      ctx.lineTo(currX, currY);
      ctx.stroke();
      ctx.closePath()
  }

  var begin = (x,y,name) =>{
    //this switch checks wether to draw or not
    switch (name) {
      case "down": {
        if(slcKey != undefined){
          console.log("measuring active")
          setXn(x)
          setYn(y - ctx.canvas.offsetTop + document.body.scrollTop)
        }
        else{
        setXp(x)
        setYp(y - ctx.canvas.offsetTop + document.body.scrollTop)
        setXn(x)
        setYn(y - ctx.canvas.offsetTop + document.body.scrollTop)
        setFlag(true)
        }
      } break;
      case "up":{
        setFlag(false)
        if(slcKey != undefined)
          measurement_start()
      }break;
      case "move": {
        if(slcKey != undefined)
          setFlag(false)
        if (flag) {
          setXp(currX)
          setYp(currY)
          setXn(x)
          setYn(y - ctx.canvas.offsetTop + document.body.scrollTop)
          draw()
        }
      } break;
      default: {
        setFlag(false)
      } break;
    }

  }



  return <><button onClick={() => addUnit()} style={{display: "float"}}>click me you fucker</button>
  <canvas 
  id = "canvasThing"
  ref={canvasRef} {...props} 
  //these handle mouse position changes
  onKeyDown={(e) => keyPressed(e.key)}
  onKeyUp={(e) => keyPressed()}
  onMouseMove={(e) => begin(e.pageX, e.pageY, "move")} 
  onMouseDown={(e) => begin(e.pageX, e.pageY, "down")} 
  onMouseLeave={(e) => begin(e.pageX, e.pageY, "out")}
  onMouseUp={(e) => begin(e.pageX, e.pageY, "up")}
  tabIndex={0}
  />
  
</>
}

export default Canvas
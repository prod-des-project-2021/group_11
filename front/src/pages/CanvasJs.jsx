import * as React from 'react';
import { useState, useEffect, useRef } from 'react'

const Canvas = props => {

  var [ctx, setctx] = useState()
  var [size, setSize]= useState(50)
  var [imgData, setImgData] = useState()

  let drawGrid= (width, height, canvas, context) => {
      canvas.setAttribute('width', width)
      canvas.setAttribute('height',height)
      context.fillStyle = 'white'
      context.fillRect(0, 0, context.canvas.width, context.canvas.height)
      let i = 0
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

  //drawing the measurment line

  let [measurement_flag, setLine] = useState([]);
  const measurement_start = () => {

    if (measurement_flag.length < 2) {
      measurement_flag.push({'x':currX, 'y':currY})
      console.log(measurement_flag)
    }
    else if (measurement_flag.length == 2) {
      console.log("jsx")
      ctx.beginPath();
      ctx.strokeStyle = '#00FF00';
      ctx.moveTo(measurement_flag[0].x, measurement_flag[0].y);

      ctx.lineTo(measurement_flag[1].x, measurement_flag[1].y);
      ctx.stroke();
      setLine([]);
      console.log(measurement_flag)
    }
  }

  var begin = (x,y,name) =>{
    //this switch checks wether to draw or not
    switch (name) {
      case "down": {
        setXp(x)
        setYp(y - ctx.canvas.offsetTop + document.body.scrollTop)
        setXn(x)
        setYn(y - ctx.canvas.offsetTop + document.body.scrollTop)
        setFlag(true)
        //draw()
        measurement_start()
        console.log(y, currY)
        draw()
      } break;
      case "move": {
        if (flag) {
          setXp(currX)
          setYp(currY)
          setXn(x)
          //draw()
          setYn(y - ctx.canvas.offsetTop + document.body.scrollTop)
          draw()
        }
      } break;
      default: {
        setFlag(false)
      } break;
    }

  }


  return <canvas 
  id = "canvasThing"
  ref={canvasRef} {...props} 
  //these handle mouse position changes
  onMouseMove={(e) => begin(e.pageX, e.pageY, "move")} 
  onMouseDown={(e) => begin(e.pageX, e.pageY, "down")} 
  onMouseUp={(e) => begin(e.pageX, e.pageY, "up")} 
  onMouseLeave={(e) => begin(e.pageX, e.pageY, "out")}
  />

}

export default Canvas
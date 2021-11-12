
import * as React from 'react';
import {useState, useEffect, useRef} from 'react'

const Canvas = props => {

  var [ctx, setctx] = useState([])
  let [scaleX, setXScale] = useState(0)
  let [scaleY, setYScale] = useState(0)
  let [rect, setRect] = useState()

  //set up canvas
  useEffect(() => {
    let canvas = canvasRef.current
    canvas.setAttribute('width', window.innerWidth)
    canvas.setAttribute('height',window.innerHeight)
    const context = canvas.getContext('2d')
    setctx(context)
    //setXScale = context.width / rect.width
    //setYScale = context.height / rect.height
    //'https://upload.wikimedia.org/wikipedia/commons/7/70/Graph_paper_scan_1600x1000_%286509259561%29.jpg'
  }, [])


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




  var begin = (x,y,name) =>{
  
    //this switch checks wether to draw or not
    switch(name){
      case "down": {
        setXp(x)
        setYp(y - ctx.canvas.offsetTop)
        setXn(x)
        setYn(y - ctx.canvas.offsetTop)
        setFlag(true)
        draw()
      } break;
      case "move": {
        if(flag){
          setXp(currX)
          setYp(currY)
          setXn(x)
          setYn(y - ctx.canvas.offsetTop)
          draw()
        }
      }break;
      default:{
        setFlag(false)
      }break;
    }
    
  }
  




  return <canvas 
  ref={canvasRef} {...props} 
  
  //these handle mouse position changes
  onMouseMove={(e) => begin(e.clientX, e.clientY, "move")} 
  onMouseDown={(e) => begin(e.clientX, e.clientY, "down")} 
  onMouseUp={(e) => begin(e.clientX, e.clientY, "up")} 
  onMouseLeave={(e) => begin(e.clientX, e.clientY, "out")}
  />
}

export default Canvas
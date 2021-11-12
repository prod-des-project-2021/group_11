import * as React from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';

const styles = {
  border: '0.0625rem solid #9c9c9c',
  borderRadius: '0.25rem',
};

const Canvas = () => {
  return (
    <ReactSketchCanvas
      style={styles}
      height='100vh'
      width='100vw'
      strokeWidth={4}
      strokeColor="red"
      backgroundImage='https://upload.wikimedia.org/wikipedia/commons/7/70/Graph_paper_scan_1600x1000_%286509259561%29.jpg'
    />
  );
};


export default Canvas
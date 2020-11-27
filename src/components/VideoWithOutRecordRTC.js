import React, { useRef } from 'react';
import Modal from 'react-modal';

const customStyles= {
  content: {
    top                   : 'calc((100vh - 36vw) / 2)',
    left                  : '26vw',
    right                 : '26vw',
    bottom                : 'calc(((100vh - 36vw) / 2) - 50px)',
    padding               : '0',
    backgroundColor       : 'transparent',
    overflow              : 'hidden'
  }
};

export const Video = (props) => {
  const { closeVideo }= props.props;
  const video = useRef();
  const canvasRef = useRef();
  let camera;

  const start= async () => {
    try {
      camera= await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
      video.current.srcObject = camera;
    } catch (error) {
      alert('Unable to capture your camera. Please check console logs.');
      console.error(error);
    }
  };

  start();

  const takePicture= () => {
    const left= -1 * (video.current.videoWidth - video.current.videoHeight) / 2;
    canvasRef.current.width = video.current.videoHeight;
    canvasRef.current.height = video.current.videoHeight;
    canvasRef.current.getContext('2d')
      .drawImage(video.current, left, 0);
    video.current.src = video.current.srcObject = null;
    camera.getTracks().forEach(function(track) {
      track.stop();
    });
  };

  return (
    <div>
      <canvas hidden ref={canvasRef}>
        Your browser does not support the HTML canvas tag.
      </canvas>
      <Modal
        isOpen={true}
        style={customStyles}
      >
        <div className='video-margins'></div>
        <video muted autoPlay playsInline ref={video} className='video'></video>
        <button className='button video-button' onClick={() => {
          takePicture();
          closeVideo(canvasRef.current.toDataURL());
        }}>Tomar foto</button>
      </Modal>
    </div>
  )
};
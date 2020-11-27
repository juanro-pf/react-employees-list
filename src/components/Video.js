import React, { useRef } from 'react';
import Modal from 'react-modal';
import RecordRTC from 'recordrtc';

const customStyles= {
  content: {
    backgroundColor       : 'transparent',
    bottom                : 'calc(((100vh - 36vw) / 2) - 50px)',
    left                  : '26vw',
    overflow              : 'hidden',
    padding               : '0',
    right                 : '26vw',
    top                   : 'calc((100vh - 36vw) / 2)',
  }
};

export const Video = props => {
  const { closeVideo }= props.props;
  const video = useRef();
  const canvasRef = useRef();
  let camera;
  let recorder;

  const start= async () => {
    try {
      camera= await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
      video.current.srcObject = camera;
      recorder = RecordRTC(camera, {
        type: 'video'
      });
      recorder.camera = camera;
    } catch (error) {
      alert('No pudimos accesar a tu camara, por favor revisa la consola para más información sobre el error.');
      console.error(error);
      closeVideo();
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
    recorder.camera.stop();
    recorder.destroy();
    recorder = null;
  };

  const cancelVideo = () => {
    video.current.src = video.current.srcObject = null;
    recorder.camera.stop();
    recorder.destroy();
    recorder = null;
    closeVideo();
  };

  return (
    <div>
      <canvas hidden ref={canvasRef}>
        Your browser does not support the HTML canvas tag.
      </canvas>
      <Modal
        isOpen={true}
        style={customStyles}
        onRequestClose={cancelVideo}
      >
        <div className='video-margins'></div>
        <video muted autoPlay playsInline ref={video} className='video'></video>
        <button className='button video-button' onClick={() => {
          takePicture();
          closeVideo(canvasRef.current.toDataURL());
        }}>Tomar foto</button>
      </Modal>
    </div>
  );
};
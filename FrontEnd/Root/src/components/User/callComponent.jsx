import React, { useEffect, useRef, useState } from 'react';
import { X, Mic, MicOff, Video as VideoIcon, VideoOff } from 'lucide-react';

const CallInterface = ({ callType, remoteUser, onEndCall, ws }) => {
  const [localStream, setLocalStream] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === 'audio');
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    const initializeCall = async () => {
      try {
        // Get user media based on call type
        const mediaConstraints = {
          audio: true,
          video: callType === 'video'
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Initialize WebRTC peer connection
        const configuration = {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            // Add your TURN server configuration here if needed
          ]
        };

        const pc = new RTCPeerConnection(configuration);
        peerConnection.current = pc;

        // Add local stream to peer connection
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });

        // Handle incoming tracks
        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            ws.current.send(JSON.stringify({
              type: 'ice_candidate',
              peer_id: remoteUser.id,
              candidate: event.candidate
            }));
          }
        };

        // Create and send offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        ws.current.send(JSON.stringify({
          type: 'call_offer',
          receiver_id: remoteUser.id,
          chat_id: remoteUser.chat_id,
          call_type: callType,
          offer: offer
        }));

      } catch (error) {
        console.error('Error initializing call:', error);
        onEndCall();
      }
    };

    initializeCall();

    return () => {
      // Cleanup
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const handleWebRTCMessage = async (message) => {
      switch (message.type) {
        case 'call_answered':
          try {
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(message.answer)
            );
            setIsConnected(true);
          } catch (error) {
            console.error('Error handling call answer:', error);
          }
          break;

        case 'ice_candidate':
          try {
            if (message.candidate) {
              await peerConnection.current.addIceCandidate(
                new RTCIceCandidate(message.candidate)
              );
            }
          } catch (error) {
            console.error('Error handling ICE candidate:', error);
          }
          break;

        case 'call_ended':
          onEndCall();
          break;
      }
    };

    // Add message handler to websocket
    const currentWs = ws.current;
    currentWs.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      handleWebRTCMessage(data);
    });

    return () => {
      currentWs.removeEventListener('message', handleWebRTCMessage);
    };
  }, []);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream && callType === 'video') {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleEndCall = () => {
    ws.current.send(JSON.stringify({
      type: 'end_call',
      peer_id: remoteUser.id,
      call_id: remoteUser.call_id
    }));
    onEndCall();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-4 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {callType === 'video' ? 'Video' : 'Audio'} Call with {remoteUser.id}
          </h2>
          <button
            onClick={handleEndCall}
            className="p-2 hover:bg-gray-700 rounded-full"
          >
            <X className="w-6 h-6 text-red-500" />
          </button>
        </div>

        <div className="relative">
          {callType === 'video' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg bg-gray-700"
                />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white bg-gray-900 bg-opacity-75 px-2 py-1 rounded">
                    {remoteUser.name}
                  </p>
                </div>
              </div>
              <div className="relative">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg bg-gray-700"
                />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white bg-gray-900 bg-opacity-75 px-2 py-1 rounded">
                    You
                  </p>
                </div>
              </div>
            </div>
          )}

          {callType === 'audio' && (
            <div className="flex items-center justify-center h-64 bg-gray-700 rounded-lg">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {remoteUser.id}
                </div>
                <h3 className="text-xl font-semibold">{remoteUser.id}</h3>
                <p className="text-gray-400">
                  {isConnected ? 'Connected' : 'Connecting...'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full ${
              isMuted ? 'bg-red-500' : 'bg-gray-700'
            }`}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>
          
          {callType === 'video' && (
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full ${
                isVideoOff ? 'bg-red-500' : 'bg-gray-700'
              }`}
            >
              {isVideoOff ? (
                <VideoOff className="w-6 h-6" />
              ) : (
                <VideoIcon className="w-6 h-6" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallInterface;
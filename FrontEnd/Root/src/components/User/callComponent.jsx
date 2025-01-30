import React, { useEffect, useRef, useState } from 'react';
import { X, Mic, MicOff, Video as VideoIcon, VideoOff } from 'lucide-react';
import { useSelector } from 'react-redux';

const CallInterface = ({ callType, remoteUser, onEndCall, ws }) => {
  const [localStream, setLocalStream] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === 'audio');
  const auth = useSelector((select) => select.auth);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    const initializeCall = async () => {
      try {
        const mediaConstraints = {
          audio: true,
          video: callType === 'video'
        };
        console.log('1');
        
        const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
        setLocalStream(stream);
        console.log('2');
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        console.log('3');
        
        const configuration = {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
          ]
        };
        console.log('4');

        const pc = new RTCPeerConnection(configuration);
        peerConnection.current = pc;

        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });

        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };
        console.log(remoteUser,'remoteuser checking ..');
        
        // If this is an incoming call (we have an offer)
        if (remoteUser.offer) {
        
          await pc.setRemoteDescription(new RTCSessionDescription(remoteUser.offer));
          
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          
          ws.current.send(JSON.stringify({
            type: 'call_answer',
            caller_id: remoteUser.caller_id,
            call_id: remoteUser.call_id,
            answer: answer
          }));
        } else {
          // This is an outgoing call
          const receiver = remoteUser.members.find(member => member.user_id !== auth.id);
          
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          ws.current.send(JSON.stringify({
            type: 'call_offer',
            receiver_id: receiver.user_id,
            chat_id: remoteUser.id,
            call_type: callType,
            offer: offer
          }));
        }

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            const peerId = remoteUser.caller_id || remoteUser.members.find(member => member.user_id !== auth.id).user_id;
            ws.current.send(JSON.stringify({
              type: 'ice_candidate',
              peer_id: peerId,
              candidate: event.candidate
            }));
          }
        };

      } catch (error) {
        console.error('Error initializing call:', error);
        onEndCall();
      }
    };

    initializeCall();
    
    // Clean up function
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  // Add WebSocket message handler
  useEffect(() => {
    const handleWebRTCMessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log('Call WebSocket message:', data);

      try {
        switch (data.type) {
          case 'call_answered':
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );
            setIsConnected(true);
            break;

          case 'ice_candidate':
            console.log('haiaa');
            console.log(peerConnection,data,'kkkkk');
            
            if (peerConnection.current && data.candidate) {
              console.log('llll');
              
              await peerConnection.current.addIceCandidate(
                new RTCIceCandidate(data.candidate)
              );
            }
            break;

          case 'call_ended':
            onEndCall();
            break;
        }
      } catch (error) {
        console.error('Error handling WebRTC message:', error);
      }
    };

    ws.current.addEventListener('message', handleWebRTCMessage);

    return () => {
      ws.current.removeEventListener('message', handleWebRTCMessage);
    };
  }, [ws.current]);
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
    const receiver = remoteUser.members.find(member => member.user_id !== auth.id);
    ws.current.send(JSON.stringify({
      type: 'end_call',
      peer_id: receiver.user_id,
      call_id: remoteUser.call_id
    }));
    onEndCall();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 sm:p-6">
  <div className="bg-gray-800 rounded-lg p-4 w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg sm:text-xl font-semibold text-white">
        {callType === 'video' ? 'Video' : 'Audio'} Call
      </h2>
      <button
        onClick={handleEndCall}
        className="p-2 hover:bg-gray-700 rounded-full"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
      </button>
    </div>

    <div className="relative">
      {callType === 'video' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-52 sm:h-64 md:h-72 rounded-lg bg-gray-700 object-cover"
            />
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
              <p className="text-white bg-gray-900 bg-opacity-75 px-2 py-1 rounded text-xs sm:text-sm">
                Remote User
              </p>
            </div>
          </div>
          <div className="relative">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-52 sm:h-64 md:h-72 rounded-lg bg-gray-700 object-cover"
            />
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
              <p className="text-white bg-gray-900 bg-opacity-75 px-2 py-1 rounded text-xs sm:text-sm">
                You
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-52 sm:h-64 md:h-72 bg-gray-700 rounded-lg">
          <div className="text-center text-white">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              {remoteUser.name?.[0] || '?'}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold">{remoteUser.name || 'Remote User'}</h3>
            <p className="text-gray-400 text-sm sm:text-base">
              {isConnected ? 'Connected' : 'Connecting...'}
            </p>
          </div>
        </div>
      )}
    </div>

    <div className="flex justify-center space-x-4 mt-4">
      <button
        onClick={toggleMute}
        className={`p-3 sm:p-4 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700'} hover:opacity-90 transition-opacity`}
      >
        {isMuted ? (
          <MicOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        ) : (
          <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        )}
      </button>

      {callType === 'video' && (
        <button
          onClick={toggleVideo}
          className={`p-3 sm:p-4 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-700'} hover:opacity-90 transition-opacity`}
        >
          {isVideoOff ? (
            <VideoOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          ) : (
            <VideoIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          )}
        </button>
      )}
    </div>
  </div>
</div>
  );
};

export default CallInterface;
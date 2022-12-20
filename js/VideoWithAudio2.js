let videoWithAudio = document.querySelector(".videoWithAudioCtr");


// Navigator audio stream
async function videoWithAudioCall() {
    await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(function (mediaStreamObj) {

            // buttons
            let videoWithAudioPause = document.getElementById('videoWithAudiobtnPauseReco');
            let videoWithAudioResume = document.getElementById('videoWithAudiobtnResumeReco');
            let videoWithAudioStop = document.getElementById('videoWithAudiobtnStopReco');

            // getting media tracks
            videoTrackWithAudio = mediaStreamObj.getTracks();
            // Chunk array to store the audio data
            let _recordedChunks = [];
            videoWithAudio.srcObject = mediaStreamObj;
            // setup media recorder 
            let mediaRecorder = new MediaRecorder(mediaStreamObj);

            // Start event
            mediaRecorder.start();
            videoWithAudioPause.addEventListener('click', () => { mediaRecorder.pause(); });
            videoWithAudioResume.addEventListener('click', () => { mediaRecorder.resume(); });
            videoWithAudioStop.addEventListener('click', () => { mediaRecorder.stop(); });



            // If audio data available then push
            // it to the chunk array
            mediaRecorder.ondataavailable = function (e) {
                if (e.data.size > 0)
                    _recordedChunks.push(e.data);
            }
            mediaRecorder.onpause = async () => {
                videoWithAudioPause.style.display = "none";
                videoWithAudioResume.style.display = "inline-block";
            };
            mediaRecorder.onresume = async () => {
                videoWithAudioResume.style.display = "none";
                videoWithAudioPause.style.display = "inline-block";
                videoWithAudioStop.style.display = "inline-block";
            };

            // Convert the audio data in to blob
            // after stopping the recording
            mediaRecorder.onstop = function (ev) {
                videoTrackWithAudio.forEach((track) => {
                    track.stop();
                });
                videoWithAudioSec.style.display = "none";
                var blob = new Blob(_recordedChunks, { type: 'video/mp4' });
                let url = window.URL.createObjectURL(blob);
                // take file input
                let fileName = prompt("Enter file name", "my-video");
                // save audio file
                let anchorTag = document.createElement('a');
                anchorTag.href = url;
                anchorTag.download = `${fileName}.mp4`;
                document.body.appendChild(anchorTag);
                anchorTag.click();
            }
        })

        // If any error occurs then handles the error
        .catch(function (err) {
            console.log(err.name, err.message);
        });
}

document.querySelector(".video-rec-withAudio").addEventListener("click", async () => {

    for (let i = 0; i < cBtn.length; i++) {
        const element = document.querySelector(`.${cBtn[i]}`);
        if (element.classList.contains(`active`)) {
            element.classList.remove('active');
        }
    }
    document.querySelector('.video-rec-withAudio').classList.add("active");

    if (screenTrackWithAudio !== undefined) {
        screenTrackWithAudio.forEach((track) => {
            track.stop();
        });
        screenTrackWithAudio = undefined;
    }

    if (audioTracks !== undefined) {
        audioTracks.forEach((track) => {
            track.stop();
        });
        audioTracks = undefined;
    }

    if (videoTrackWithoutAudio !== undefined) {
        videoTrackWithoutAudio.forEach((track) => {
            track.stop();
        });
        videoTrackWithoutAudio = undefined;
    }

    if (ssTracks != undefined) {
        ssTracks.forEach((track) => {
            track.stop();
        });
        ssTracks = undefined;
    }
    videoWithAudioSec.style.display = "flex";
    ssSec.style.display = "none";
    audioSec.style.display = "none";
    screenWithoutAudioSec.style.display = "none";
    screenWithAudioSec.style.display = "none";
    videoWithoutAudioSec.style.display = "none";
    videoWithAudioCall();
})
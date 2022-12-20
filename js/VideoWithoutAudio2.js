let videoWithoutAudio = document.querySelector(".videoWithoutAudioCtr");


// Navigator audio stream
async function videoWithoutAudioCall() {
    await navigator.mediaDevices.getUserMedia({ audio: false, video: true })
        .then(function (mediaStreamObj) {

            // buttons
            let videoPause = document.getElementById('videobtnPauseReco');
            let videoResume = document.getElementById('videobtnResumeReco');
            let videoStop = document.getElementById('videobtnStopReco');

            // getting media tracks
            videoTrackWithoutAudio = mediaStreamObj.getTracks();
            // Chunk array to store the audio data
            let _recordedChunks = [];
            videoWithoutAudio.srcObject = mediaStreamObj;
            // setup media recorder 
            let mediaRecorder = new MediaRecorder(mediaStreamObj);

            // Start event
            mediaRecorder.start();
            videoPause.addEventListener('click', () => { mediaRecorder.pause(); });
            videoResume.addEventListener('click', () => { mediaRecorder.resume(); });
            videoStop.addEventListener('click', () => { mediaRecorder.stop(); });

            // If audio data available then push
            // it to the chunk array
            mediaRecorder.ondataavailable = function (e) {
                if (e.data.size > 0)
                    _recordedChunks.push(e.data);
            }
            mediaRecorder.onpause = async () => {
                videoPause.style.display = "none";
                videoResume.style.display = "inline-block";
            };
            mediaRecorder.onresume = async () => {
                videoResume.style.display = "none";
                videoPause.style.display = "inline-block";
                videoStop.style.display = "inline-block";
            };

            // Convert the audio data in to blob
            // after stopping the recording
            mediaRecorder.onstop = function (ev) {
                videoTrackWithoutAudio.forEach((track) => {
                    track.stop();
                });
                videoWithoutAudioSec.style.display = "none";
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

document.querySelector(".video-rec-withoutAudio").addEventListener("click", async () => {

    for (let i = 0; i < cBtn.length; i++) {
        const element = document.querySelector(`.${cBtn[i]}`);
        if (element.classList.contains(`active`)) {
            element.classList.remove('active');
        }
    }
    document.querySelector('.video-rec-withoutAudio').classList.add("active");



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

    if (ssTracks !== undefined) {
        ssTracks.forEach((track) => {
            track.stop();
        });
        ssTracks = undefined;
    }

    if (videoTrackWithAudio != undefined) {
        videoTrackWithAudio.forEach((track) => {
            track.stop();
        });
        videoTrackWithAudio = undefined;
    }
    videoWithoutAudioSec.style.display = "flex";
    ssSec.style.display = "none";
    audioSec.style.display = "none";
    screenWithoutAudioSec.style.display = "none";
    screenWithAudioSec.style.display = "none";
    videoWithAudioSec.style.display = "none";
    videoWithoutAudioCall();
})
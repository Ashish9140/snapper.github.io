let screenWithAudio = document.querySelector(".screenWithAudioCtr");

// Navigator audio stream
async function screenReco() {
    navigator.mediaDevices.getDisplayMedia({
        video: {
            mediaSource: 'screen',
        },
        audio: true,
    }).then(async (mediaStreamObj) => {

        // buttons
        let screenWithAudioPause = document.getElementById('screenWithAudiobtnPauseReco');
        let screenWithAudioResume = document.getElementById('screenWithAudiobtnResumeReco');
        let screenWithAudioStop = document.getElementById('screenWithAudiobtnStopReco');

        // Chunk array to store the audio data
        let _recordedChunks = [];
        screenWithAudio.srcObject = mediaStreamObj;

        // getting media tracks
        screenTrackWithAudio = mediaStreamObj.getTracks();

        // setup media recorder 
        let mediaRecorder = new MediaRecorder(mediaStreamObj);

        // Start event
        mediaRecorder.start();
        screenWithAudioPause.addEventListener('click', () => { mediaRecorder.pause(); });
        screenWithAudioResume.addEventListener('click', () => { mediaRecorder.resume(); });
        screenWithAudioStop.addEventListener('click', () => { mediaRecorder.stop(); });

        // If audio data available then push
        // it to the chunk array
        mediaRecorder.ondataavailable = function (e) {
            if (e.data.size > 0)
                _recordedChunks.push(e.data);
        }
        mediaRecorder.onpause = async () => {
            screenWithAudioPause.style.display = "none";
            screenWithAudioResume.style.display = "inline-block";
        };
        mediaRecorder.onresume = async () => {
            screenWithAudioResume.style.display = "none";
            screenWithAudioPause.style.display = "inline-block";
            screenWithAudioStop.style.display = "inline-block";
        };

        // Convert the audio data in to blob
        // after stopping the recording
        mediaRecorder.onstop = function (ev) {
            screenTrackWithAudio.forEach((track) => {
                track.stop();
            });
            screenWithAudioSec.style.display = "none";
            var blob = new Blob(_recordedChunks, { type: 'video/mp4' });
            let url = window.URL.createObjectURL(blob);
            // take file input
            let fileName = prompt("Enter file name", "my-screen");
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


document.querySelector(".screen-rec-withAudio").addEventListener("click", () => {

    for (let i = 0; i < cBtn.length; i++) {
        const element = document.querySelector(`.${cBtn[i]}`);
        if (element.classList.contains(`active`)) {
            element.classList.remove('active');
        }
    }
    document.querySelector('.screen-rec-withAudio').classList.add("active");

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

    if (videoTrackWithoutAudio !== undefined) {
        videoTrackWithoutAudio.forEach((track) => {
            track.stop();
        });
        videoTrackWithoutAudio = undefined;
    }

    if (videoTrackWithAudio != undefined) {
        videoTrackWithAudio.forEach((track) => {
            track.stop();
        });
        videoTrackWithAudio = undefined;
    }
    screenWithAudioSec.style.display = "flex";
    audioSec.style.display = "none";
    screenWithoutAudioSec.style.display = "none";
    ssSec.style.display = "none";
    videoWithAudioSec.style.display = "none";
    videoWithoutAudioSec.style.display = "none";
    screenReco();
})
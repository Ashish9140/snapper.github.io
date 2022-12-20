let audio = document.querySelector(".audioCtr");

// Navigator audio stream
async function audioCall() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(function (mediaStreamObj) {

            // buttons
            let audioPause = document.getElementById('audiobtnPauseReco');
            let audioResume = document.getElementById('audiobtnResumeReco');
            let audioStop = document.getElementById('audiobtnStopReco');

            // getting media tracks
            audioTracks = mediaStreamObj.getTracks();
            // Chunk array to store the audio data
            let _recordedChunks = [];
            audio.srcObject = mediaStreamObj;
            // setup media recorder 
            let mediaRecorder = new MediaRecorder(mediaStreamObj);

            // Start event
            mediaRecorder.start();
            audioPause.addEventListener('click', () => { mediaRecorder.pause(); });
            audioResume.addEventListener('click', () => { mediaRecorder.resume() });
            audioStop.addEventListener('click', () => { mediaRecorder.stop(); });

            mediaRecorder.ondataavailable = function (e) {
                if (e.data.size > 0)
                    _recordedChunks.push(e.data);
            }
            mediaRecorder.onpause = async () => {
                audioPause.style.display = "none";
                audioResume.style.display = "inline-block";
            };
            mediaRecorder.onresume = async () => {
                audioResume.style.display = "none";
                audioPause.style.display = "inline-block";
                audioStop.style.display = "inline-block";
            };

            mediaRecorder.onstop = function (ev) {
                audioTracks.forEach((track) => {
                    track.stop();
                });
                audioSec.style.display = "none";
                let blob = new Blob(_recordedChunks, { type: 'audio/mp3' });
                let url = window.URL.createObjectURL(blob);
                let fileName = prompt("Enter file name", "my-audio");
                // save audio file
                let anchorTag = document.createElement('a');
                anchorTag.href = url;
                anchorTag.download = `${fileName}.mp3`;
                document.body.appendChild(anchorTag);
                anchorTag.click();
            }
        })
        .catch(function (err) {
            console.log(err.name, err.message);
        });
}


document.querySelector(".audio-rec").addEventListener("click", () => {

    for (let i = 0; i < cBtn.length; i++) {
        const element = document.querySelector(`.${cBtn[i]}`);
        if (element.classList.contains(`active`)) {
            element.classList.remove('active');
        }
    }
    document.querySelector('.audio-rec').classList.add("active");

    if (screenTrackWithAudio !== undefined) {
        screenTrackWithAudio.forEach((track) => {
            track.stop();
        });
        screenTrackWithAudio = undefined;
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
    audioSec.style.display = "flex";
    ssSec.style.display = "none";
    screenWithoutAudioSec.style.display = "none";
    videoWithAudioSec.style.display = "none";
    screenWithAudioSec.style.display = "none";
    videoWithoutAudioSec.style.display = "none";
    audioCall();
})
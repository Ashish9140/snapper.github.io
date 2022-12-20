let screenWithoutAudio = document.querySelector(".screenWithoutAudioCtr");

// Navigator audio stream
async function screenReco2() {
    navigator.mediaDevices.getDisplayMedia({
        video: {
            mediaSource: 'screen',
        },
        audio: true,
    }).then(async (e) => {

        // For recording the mic audio
        let audio = await navigator.mediaDevices.getUserMedia({
            audio: true, video: false
        })

        // Combine both video/audio stream with MediaStream object
        let mediaStreamObj = new MediaStream(
            [...e.getTracks(), ...audio.getTracks()])

        // buttons
        let screenWithoutAudioPause = document.getElementById('screenWithoutAudiobtnPauseReco');
        let screenWithoutAudioResume = document.getElementById('screenWithoutAudiobtnResumeReco');
        let screenWithoutAudioStop = document.getElementById('screenWithoutAudiobtnStopReco');

        // Chunk array to store the audio data
        let _recordedChunks = [];
        screenWithoutAudio.srcObject = e;

        // getting media tracks
        screenTrackWithAudio = e.getTracks();
        audioTracks = audio.getTracks();

        // setup media recorder 
        let mediaRecorder = new MediaRecorder(mediaStreamObj);

        // Start event
        mediaRecorder.start();
        screenWithoutAudioPause.addEventListener('click', () => { mediaRecorder.pause(); });
        screenWithoutAudioResume.addEventListener('click', () => { mediaRecorder.resume(); });
        screenWithoutAudioStop.addEventListener('click', () => { mediaRecorder.stop(); });

        // If audio data available then push
        // it to the chunk array
        mediaRecorder.ondataavailable = function (e) {
            if (e.data.size > 0)
                _recordedChunks.push(e.data);
        }
        mediaRecorder.onpause = async () => {
            screenWithoutAudioPause.style.display = "none";
            screenWithoutAudioResume.style.display = "inline-block";
        };
        mediaRecorder.onresume = async () => {
            screenWithoutAudioResume.style.display = "none";
            screenWithoutAudioPause.style.display = "inline-block";
            screenWithoutAudioStop.style.display = "inline-block";
        };

        // Convert the audio data in to blob
        // after stopping the recording
        mediaRecorder.onstop = function (ev) {
            screenTrackWithAudio.forEach((track) => {
                track.stop();
            });
            audioTracks.forEach((track) => {
                track.stop();
            });
            screenWithoutAudioSec.style.display = "none";
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


document.querySelector(".screen-rec-withoutAudio").addEventListener("click", () => {

    for (let i = 0; i < cBtn.length; i++) {
        const element = document.querySelector(`.${cBtn[i]}`);
        if (element.classList.contains(`active`)) {
            element.classList.remove('active');
        }
    }
    document.querySelector('.screen-rec-withoutAudio').classList.add("active");



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
    screenWithoutAudioSec.style.display = "flex";
    screenWithAudioSec.style.display = "none";
    audioSec.style.display = "none";
    ssSec.style.display = "none";
    videoWithAudioSec.style.display = "none";
    videoWithoutAudioSec.style.display = "none";
    screenReco2();
})
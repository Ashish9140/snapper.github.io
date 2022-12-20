let ssSec = document.querySelector('.ss-sec');
let audioSec = document.querySelector('.audio-sec');
let videoWithAudioSec = document.querySelector('.videoWithAudio-sec');
let videoWithoutAudioSec = document.querySelector('.videoWithoutAudio-sec');
let screenWithAudioSec = document.querySelector('.screenWithAudio-sec');
let screenWithoutAudioSec = document.querySelector('.screenWithoutAudio-sec');


let video = document.querySelector(".ssCtr");
let textInput = document.querySelector(".modal");


// record buttons
let cBtn = ['take-ss', 'audio-rec', 'video-rec-withoutAudio', 'video-rec-withAudio', 'screen-rec-withoutAudio', 'screen-rec-withAudio'];

// tracks
let ssTracks;
let audioTracks;
let videoTrackWithoutAudio;
let videoTrackWithAudio;
let screenTrackWithAudio;
let screenTrackWithoutAudio;

// Navigator video stream
async function videoStream() {
    try {
        const stream = await navigator.mediaDevices.
            getUserMedia({
                video: true,
                audio: false
            });

        ssTracks = stream.getTracks();

        // set video source
        video.srcObject = stream;

        // take a picture on K press
        document.querySelector('.ss-save').addEventListener('click', () => {
            let canvas = document.createElement('canvas');
            // set canvas width and height
            canvas.width = 850;
            canvas.height = 638;
            // Draw a new image
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            // Take a shot
            let img = canvas.toDataURL('image/jpeg').replace("image/jpeg", 1.0)
            // save image file
            let anchorTag = document.createElement('a');
            anchorTag.href = img;
            // take the file name
            let fileName = prompt("Enter file name", "my-image");
            // textInput.style = "visibility:visible; opacity:1;";
            anchorTag.download = `${fileName}.jpeg`;
            document.body.appendChild(anchorTag);
            anchorTag.click();
            ssTracks.forEach((track) => {
                track.stop();
            });
            ssSec.style.display = "none";
        })

    } catch (err) {
        console.log(err);
    }
}

document.querySelector('.take-ss').addEventListener("click", async () => {

    for (let i = 0; i < cBtn.length; i++) {
        const element = document.querySelector(`.${cBtn[i]}`);
        if (element.classList.contains(`active`)) {
            element.classList.remove('active');
        }
    }
    document.querySelector('.take-ss').classList.add("active");

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

    if (videoTrackWithAudio != undefined) {
        videoTrackWithAudio.forEach((track) => {
            track.stop();
        });
        videoTrackWithAudio = undefined;
    }

    ssSec.style.display = "flex";
    screenWithAudioSec.style.display = "none";
    audioSec.style.display = "none";
    screenWithoutAudioSec.style.display = "none";
    videoWithAudioSec.style.display = "none";
    videoWithoutAudioSec.style.display = "none";
    videoStream();
})
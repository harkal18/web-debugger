

declare var MediaRecorder: any;

export class ScreenRecorder {

    recorder: any;

    constructor() {
        const canvas: any = document.querySelector('canvas');
        // Optional frames per second argument.
        const stream = canvas.captureStream(25);
        const options = { mimeType: 'video/webm; codecs=vp9' };
        this.recorder = new MediaRecorder(stream, options);
        const blobs: Blob[] = [];

        this.recorder.ondataavailable = (event: Event | any) => {
            console.log(event.data); if (event.data && event.data.size > 0) blobs.push(event.data)
        };
        this.recorder.onstop = (event: Event | any) => {
            this.download(new Blob(blobs, { type: 'video/webm' }));
        }
    }

    start(timespan: number) {
        this.recorder.start(10); 
        setTimeout(() => this.recorder.stop(), 10000);
    }

    download(blob: Blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }

}
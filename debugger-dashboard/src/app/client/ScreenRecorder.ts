import html2canvas from 'html2canvas';

declare var MediaRecorder: any;

export class ScreenRecorder {

    recorder: any;
    mirrorCanvas: any;

    constructor(public fps: number, public timespan: number) {
        this.mirrorCanvas = document.createElement("canvas");
        this.mirrorCanvas.style.display = 'none';
        this.setCanvasDimensions();
        window.onresize = (e: Event) => {
            this.setCanvasDimensions();
        };
        document.body.append(this.mirrorCanvas);
        this.render();
        // Optional frames per second argument.
        const stream = this.mirrorCanvas.captureStream();
        const options = { mimeType: 'video/webm; codecs=vp9' };
        this.recorder = new MediaRecorder(stream, options);
        const blobs: Blob[] = [];

        this.recorder.ondataavailable = (event: Event | any) => {
            // console.log(event.data); 
            if (event.data && event.data.size > 0) {
                blobs.push(event.data);
            }
        };
        this.recorder.onstop = (event: Event | any) => {
            this.download(new Blob(blobs, { type: 'video/webm' }));
        }
    }

    start() {
        this.recorder.start();
        // setTimeout(() => this.recorder.stop(), this.timespan);
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

    private setCanvasDimensions() {
        this.mirrorCanvas.width = window.innerWidth;
        this.mirrorCanvas.height = window.innerHeight;
    }

    private getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

    private render() {
        // document.body.style.background = this.getRandomColor();
        setTimeout(async () => {
            try {
                const canvas = await html2canvas(document.body);
                const mirrorCanvasContext: any = this.mirrorCanvas.getContext('2d');
                mirrorCanvasContext.drawImage(canvas, 0, 0);
            }catch(error){
                console.log(error);
            }
            this.render();
        }, 1000 / this.fps);
    }

}
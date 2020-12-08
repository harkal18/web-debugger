import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DebuggerService } from 'src/app/debugger.service';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})
export class WindowComponent implements AfterViewInit {

  @ViewChild('container') container: ElementRef | any;
  @ViewChild('canvas') canvas: ElementRef | any;

  constructor(public debuggerService: DebuggerService) { }
  
  ngAfterViewInit(): void {
    this.canvas.nativeElement.width = this.container.nativeElement.clientWidth;
    this.canvas.nativeElement.height = this.container.nativeElement.clientHeight;
    this.canvas.nativeElement.style.display = 'block';
    const sessionId = new URL(window.location.href).pathname.split("/")[1];

    const context = this.canvas.nativeElement.getContext("2d");
    const image = new Image();

    this.debuggerService.syncClientFrames(sessionId).subscribe((frame: string) => {
      image.onload = () => {
        context.drawImage(image, 0, 0);
      };
      image.src = frame;
    });
  }

}

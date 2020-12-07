import { Component, OnInit } from '@angular/core';
import { DebuggerService, Log } from '../debugger.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  logs: Array<Log> = [];
  data: any;

  constructor(
    public debuggerService: DebuggerService
  ) { 
    // lets create two windows here one for showing the live state of the screen
    // another one for debug tools
  }

  ngOnInit(): void {
    // new ScreenRecorder(5, 5000).start();
    const sessionId = new URL(window.location.href).pathname.split("/")[1];
    this.debuggerService.syncClientLogs(sessionId).subscribe((logs: Array<Log>) => {
      this.logs = logs;
      this.data = JSON.stringify(this.logs);
      //@ts-ignore
      window.logs = logs;
    })
  }

}

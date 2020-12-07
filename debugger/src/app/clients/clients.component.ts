import { Component, OnInit } from '@angular/core';
import { DebuggerService, Session } from '../debugger.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  sessions: Session[] = [];

  constructor(
    public debuggerService: DebuggerService
  ) { 
    this.debuggerService.sessions.subscribe((sessions: Map<string, Session>) => {
      sessions.forEach((session: Session | any) => {
        const temp: Session[] = [];
        if(session.lastSeen > Date.now() - 10000){
          temp.push(session);
        }
        this.sessions = temp;
      })
    });
  }

  ngOnInit(): void {
  }

}

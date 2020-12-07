import { Component, OnInit } from '@angular/core';
import { ScreenRecorder } from './ScreenRecorder';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  constructor() { 
    // lets create two windows here one for showing the live state of the screen
    // another one for debug tools
  }

  ngOnInit(): void {
    new ScreenRecorder(5, 5000).start();
  }

}

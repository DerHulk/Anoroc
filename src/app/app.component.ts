import { Component } from '@angular/core';
import { faDisease } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  public faDisease = faDisease;
  public title = 'anoroc';
}

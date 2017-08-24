import { Component, OnInit } from '@angular/core';

import { YoutubeApiService } from '../../services/youtube-api.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  video: any;

  constructor(private youtubeApi:YoutubeApiService) { }

  ngOnInit() {
    this.youtubeApi._playerComponentReady.subscribe(() => {
      this.getVideoById();
    });
  }

  getVideoById() {
    this.youtubeApi.getVideoById().subscribe((res) => {
      this.video = res.json().items[0];
      console.log(this.video);
    });
  }
}
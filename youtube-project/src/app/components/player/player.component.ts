import { Component, OnInit } from '@angular/core';

import { YoutubeApiService } from '../../services/youtube-api.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  video: any;
  videoId: string;
  player: YT.Player;
  playPause: boolean = false;

  constructor(private youtubeApi:YoutubeApiService) { }

  ngOnInit() {
    this.youtubeApi._playerComponentReady.subscribe(() => {
      this.getVideoById();
    });
  }

  getVideoById() {
    this.youtubeApi.getVideoById().subscribe((res) => {
      this.video = res.json().items[0];
      this.videoId = this.video.id;
    });
  }

  savePlayer(player) {
    this.player = player;
    this.player.playVideo();
    this.playPause = true;
  }

  toggleVideoState() {
    this.playPause = !this.playPause;
    if (this.playPause === true) {
      this.player.playVideo();
    }
    else {
      this.player.pauseVideo();
    }
  }
}
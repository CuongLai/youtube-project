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
  playlist: Array<number>;
  playPause: boolean = false;
  progress: number = 0;
  timeUpdateInterval: any;
  fullScreen: boolean = false;
  currentVolume: number;
  volume: number;
  muted: boolean = false;

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
      if (this.player != null) {
        this.player.loadVideoById(this.videoId);
      }
    });
  }

  savePlayer(player) {
    this.player = player;
    this.player.playVideo();
    this.playPause = true;

    this.updateProgressBar();
    this.updateTimerDisplay();
    this.updateVolumeBar();

    this.timeUpdateInterval = setInterval(() => { 
      this.updateProgressBar();
      this.updateTimerDisplay();
    }, 1000);
  }

  toggleVideoState() {
    this.playPause = !this.playPause;
    if (this.playPause === true) {
      this.player.playVideo();
      document.getElementById('play-pause-btn').className = "glyphicon glyphicon-pause";
    }
    else {
      this.player.pauseVideo();
      document.getElementById('play-pause-btn').className = "glyphicon glyphicon-play";
    }
  }

  updateProgressBar() {
    this.progress = this.player.getCurrentTime() / this.player.getDuration() * 100;
  }

  updateTimerDisplay() {
    document.getElementById('current-time').innerHTML = this.formatTime(this.player.getCurrentTime());
    document.getElementById('duration').innerHTML = this.formatTime(this.player.getDuration());
  }

  formatTime(time) {
    time = Math.round(time);
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    var secondsString = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ":" + secondsString;
  }

  updateVolumeBar() {
    this.volume = this.player.getVolume();
    this.changeVolumeIcon();
  }

  seek(event) {
    var newTime = this.player.getDuration() * (event.target.value / 100);
    this.player.seekTo(newTime, true);
    //this.player.getPlayerState() == ended
  }

  changeVolume(event) {
    this.volume = event.target.value;
    this.player.setVolume(this.volume);
    this.changeVolumeIcon();
  }

  muteVolume() {
    if (this.muted === false) {
      this.player.mute();
      this.volume = 0;
    }
    else {
      this.player.unMute();
      this.volume = this.player.getVolume();
    }
    this.changeVolumeIcon();
    this.muted = !this.muted;
  }

  changeVolumeIcon() {
    if (this.volume == 0) {
      document.getElementById('video-player-mute').className = "glyphicon glyphicon-volume-off";
    }
    else if (this.volume < 50) {
      document.getElementById('video-player-mute').className = "glyphicon glyphicon-volume-down";
    }
    else {
      document.getElementById('video-player-mute').className = "glyphicon glyphicon-volume-up";
    }
  }

  toggleFullScreen() {
    if (this.fullScreen === false) {
      document.getElementById('player').style.height = "100%";
      document.getElementById('youtube-player').style.display = "block";
      document.getElementById('video-player-fullscreen').className = "glyphicon glyphicon-resize-small";
    }
    else {
      document.getElementById('player').style.height = null;
      document.getElementById('youtube-player').style.display = "none";
      document.getElementById('video-player-fullscreen').className = "glyphicon glyphicon-resize-full";
    }
    this.fullScreen = !this.fullScreen;
  }
}
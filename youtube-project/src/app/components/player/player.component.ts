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
  queue: Array<any> = [];
  historyQueue: Array<any> = [];
  tempQueue: Array<any> = [];
  isShuffleOn: boolean = false;
  repeatCounter: number = 1; // 1=off, 2=on, 3=repeat single

  constructor(private youtubeApi:YoutubeApiService) { }

  ngOnInit() {
    this.youtubeApi._sendVideoSourceReady.subscribe(() => {
      this.getVideoById();
    });
    this.youtubeApi._addToQueueReady.subscribe(() => {
      this.addToQueue();
    })
  }

  /// Moving current vid to history, setting video/videoId to play,
  /// and playing a video by id if a video has been picked already
  getVideoById() {
    this.youtubeApi.getVideoById().subscribe((res) => {
      this.moveToHistoryQueue();
      this.video = res.json().items[0];
      this.videoId = this.video.id;
      document.getElementById('play-pause-btn').className = "glyphicon glyphicon-pause";
      if (this.player != null) {
        this.player.loadVideoById(this.videoId);
      }
    });
  }

  /// Adding and removing from queue
  addToQueue() {
    this.youtubeApi.getVideoById().subscribe((res) => {
      this.queue.push(res.json().items[0]);
      this.tempQueue.push(res.json().items[0]);
      console.log(this.queue);
    })
  }

  moveToHistoryQueue() {
    if (this.video != null) {
      this.historyQueue.unshift(this.video);
    }
  }

  loadNextVideo() {
    if (this.queue.length > 0) {
      this.historyQueue.unshift(this.video);
      this.video = this.queue.shift();
      this.videoId = this.video.id;
      this.player.loadVideoById(this.videoId);
    }
  }

  loadPreviousVideo() {
    if (this.historyQueue.length > 0) {
      this.queue.unshift(this.video);
      this.video = this.historyQueue.shift();
      this.videoId = this.video.id;
      this.player.loadVideoById(this.videoId);
    }
  }

  /// TODO : fix this
  /// Shuffle functionality
  shuffle() {
    this.isShuffleOn = !this.isShuffleOn;
    if (this.isShuffleOn == true) {
      document.getElementById('shuffle-btn').style.backgroundColor = "blue";
      var currentIndex = this.queue.length, temporaryValue, randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = this.queue[currentIndex];
        this.queue[currentIndex] = this.queue[randomIndex];
        this.queue[randomIndex] = temporaryValue;
      }
    }
    else {
      document.getElementById('shuffle-btn').style.backgroundColor = null;
      console.log(this.tempQueue);
      this.queue = this.tempQueue;
    }
  }

  repeat() {
    switch (this.repeatCounter) {
      case 1:
        this.repeatCounter += 1;
        document.getElementById('repeat-btn').style.backgroundColor = "blue";
        break;
      case 2:
        this.repeatCounter += 1;
        document.getElementById('repeat-btn').style.backgroundColor = "red";
        break
      case 3:
        this.repeatCounter = 1;
        document.getElementById('repeat-btn').style.backgroundColor = null;
        break;
    }
  }

  /// Start the youtube player
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

  /// Play and pause functionality
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

  /// TODO
  updateTimerDisplay() {
    document.getElementById('current-time').innerHTML = this.formatTime(this.player.getCurrentTime());
    document.getElementById('duration').innerHTML = this.formatTime(this.player.getDuration());
    if (this.player.getPlayerState() == 0) {
      if (this.repeatCounter == 3) {
        this.player.loadVideoById(this.videoId);
      }
      else if (this.repeatCounter == 2) {
        if (this.queue.length == 0) {
          this.player.loadVideoById(this.videoId);
        }
        else {
          this.queue = this.historyQueue.reverse();
          this.loadNextVideo();
        }
      }
      else {
        document.getElementById('play-pause-btn').className = "glyphicon glyphicon-repeat";
        this.playPause = false;
      }
    }
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
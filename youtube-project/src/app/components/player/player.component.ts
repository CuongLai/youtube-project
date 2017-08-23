import { Component, OnInit, Input } from '@angular/core';
import { YoutubeApiService } from '../../services/youtube-api.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  @Input() videoId: string;
  video: any;

  constructor(private youtubeApi:YoutubeApiService) { }

  ngOnInit() {
  }

  getVideoById() {
    console.log(this.videoId);
    this.youtubeApi.getVideoById(this.videoId).subscribe((res) => {
      this.video = res.json().items[0];
      console.log(this.video);
    });
  }
}
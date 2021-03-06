import { Component, OnInit } from '@angular/core';

import { YoutubeApiService } from '../../services/youtube-api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchItems: any = null;
  videoIndex: number = null;
  searchClicked: boolean = false;

  constructor(private youtubeApi:YoutubeApiService) { }

  ngOnInit() { }

  search(query) {
    this.searchClicked = false;
    this.youtubeApi.getVideos(query).subscribe((res) => {
      this.searchClicked = true;
      this.searchItems = res.json().items;
      for (let item of this.searchItems) {
        console.log(item);
      }
    });
  }

  callPlayerComponent(videoId) {
    this.youtubeApi.sendVideoToPlayerComponent(videoId);
  }

  addToQueue(videoId) {
    this.youtubeApi.queueToPlayerComponent(videoId);
  }
}
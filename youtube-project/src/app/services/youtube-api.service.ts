import { Injectable } from '@angular/core';
import { Http, Request, RequestOptions, RequestMethod } from '@angular/http';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class YoutubeApiService {
  private playerComponentSource = new Subject<any>();
  _playerComponentReady = this.playerComponentSource.asObservable();

  videoId: number;

  constructor(public http:Http) { }

  /// GET list of videos
  getVideos(query) {
    return this.http.request(new Request(this.getOptions(query)));
  }

  getOptions(query) {
    let options = new RequestOptions({
      method: RequestMethod.Get,
      url: 'https://www.googleapis.com/youtube/v3/search',
      search: 'part=snippet&q='+query+'&maxResults=10&key=AIzaSyALl8PIo2ZtBHAeQYxz4hEkzSRkQY1LxZk'
    });
    return options;
  }

  /// GET video by id
  getVideoById() {
    return this.http.request(new Request(this.getOptionsById()));
  }

  /// GET options by id
  getOptionsById() {
    let options = new RequestOptions({
      method: RequestMethod.Get,
      url: 'https://www.googleapis.com/youtube/v3/videos',
      search: 'part=snippet&id='+this.videoId+'&key=AIzaSyALl8PIo2ZtBHAeQYxz4hEkzSRkQY1LxZk'
    });
    return options;
  }

  /// CALL player component
  callPlayerComponent(videoId) {
    this.videoId = videoId;
    this.playerComponentSource.next();
  }
}
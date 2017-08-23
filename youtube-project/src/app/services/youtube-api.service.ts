import { Injectable } from '@angular/core';
import { Http, Request, RequestOptions, RequestMethod } from '@angular/http';

@Injectable()
export class YoutubeApiService {
  videoId: number;

  constructor(public http:Http) { }

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

  storeVideoId(videoId) {
    this.videoId = videoId;
  }

  getVideoById(videoId) {
    return this.http.request(new Request(this.getOptionsById(videoId)));
  }

  getOptionsById(videoId) {
    let options = new RequestOptions({
      method: RequestMethod.Get,
      url: 'https://www.googleapis.com/youtube/v3/videos',
      search: 'part=snippet&id='+videoId+'&key=AIzaSyALl8PIo2ZtBHAeQYxz4hEkzSRkQY1LxZk'
    });
    return options;
  }
}
import { Injectable } from '@angular/core';
import { Http, Request, RequestOptions, RequestMethod } from '@angular/http';

@Injectable()
export class YoutubeApiService {

  constructor(public http:Http) {
    console.log('Youtube API service connected');
  }

  getSearchResults(query) {
    return this.http.request(new Request(this.options(query)));
  }

  options(query) {
    let options = new RequestOptions({
      method: RequestMethod.Get,
      url: 'https://www.googleapis.com/youtube/v3/search',
      search: 'part=snippet&q='+query+'&maxResults=10&key=AIzaSyALl8PIo2ZtBHAeQYxz4hEkzSRkQY1LxZk'
    });
    return options;
  }
}

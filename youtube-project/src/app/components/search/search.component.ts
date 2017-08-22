import { Component, OnInit } from '@angular/core';
import { YoutubeApiService } from '../../services/youtube-api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchItems: SearchItems[];

  constructor(private youtubeApi:YoutubeApiService) { }

  ngOnInit() { }

  search(query) {
    this.youtubeApi.search(query).subscribe((res) => {
      this.searchItems = res.json().items;
      for (let item of this.searchItems) {
        console.log(item);
      }
    });
  }
}

interface SearchItems { }

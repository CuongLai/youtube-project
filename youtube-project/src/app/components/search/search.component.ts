import { Component, OnInit } from '@angular/core';
import { YoutubeApiService } from '../../services/youtube-api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchResults: SearchResults[];

  constructor(private youtubeApi:YoutubeApiService) { }

  ngOnInit() { }

  search(query) {
    this.youtubeApi.getSearchResults(query).subscribe((res) => {
      this.searchResults = res.json().items;
      for (let searchResult of this.searchResults) {
        console.log(searchResult);
      }
    });
  }

}

interface SearchResults { }

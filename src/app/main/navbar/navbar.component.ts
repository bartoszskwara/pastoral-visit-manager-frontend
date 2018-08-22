import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  isBackVisible() {
    return !this.location.isCurrentPathEqualTo('/app/home');
  }

  private goBack(): void {
    this.location.back();
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
  standalone: false,
})
export class NotFoundPage {
  readonly year = new Date().getFullYear();
}

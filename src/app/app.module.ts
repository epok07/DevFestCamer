import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular/lazy';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { InitialsPipe } from './shared/initials.pipe';
import { YearSwitcherComponent } from './shared/year-switcher/year-switcher.component';

import { TabsPage } from './pages/tabs/tabs.page';
import { HighlightsPage } from './pages/highlights/highlights.page';
import { AgendaPage } from './pages/agenda/agenda.page';
import { SpeakersPage } from './pages/speakers/speakers.page';
import { SpeakerDetailPage } from './pages/speaker-detail/speaker-detail.page';
import { VenuePage } from './pages/venue/venue.page';
import { MorePage } from './pages/more/more.page';
import { MaterialsPage } from './pages/materials/materials.page';
import { ParticipantsPage } from './pages/participants/participants.page';
import { ParticipantDetailPage } from './pages/participant-detail/participant-detail.page';
import { SponsorsPage } from './pages/sponsors/sponsors.page';
import { TestimonialsPage } from './pages/testimonials/testimonials.page';
import { TeamPage } from './pages/team/team.page';
import { AboutPage } from './pages/about/about.page';
import { NotFoundPage } from './pages/not-found/not-found.page';

@NgModule({
  declarations: [
    AppComponent,
    InitialsPipe,
    YearSwitcherComponent,
    TabsPage,
    HighlightsPage,
    AgendaPage,
    SpeakersPage,
    SpeakerDetailPage,
    VenuePage,
    MorePage,
    MaterialsPage,
    ParticipantsPage,
    ParticipantDetailPage,
    SponsorsPage,
    TestimonialsPage,
    TeamPage,
    AboutPage,
    NotFoundPage,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    IonicModule.forRoot(),
  ],
  providers: [
    provideHttpClient(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

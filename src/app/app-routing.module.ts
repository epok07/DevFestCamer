import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { ConferenceResolver } from './core/conference.resolver';
import { EditionGuard, RootRedirectGuard } from './core/edition.guard';
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

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [RootRedirectGuard],
    children: [],
  },
  {
    path: 'not-found',
    component: NotFoundPage,
  },
  {
    path: ':year',
    component: TabsPage,
    canActivate: [EditionGuard],
    resolve: { conference: ConferenceResolver },
    children: [
      { path: 'highlights', component: HighlightsPage },
      { path: 'agenda', component: AgendaPage },
      { path: 'speakers', component: SpeakersPage },
      { path: 'speakers/:id', component: SpeakerDetailPage },
      { path: 'venue', component: VenuePage },
      {
        path: 'more',
        children: [
          { path: '', component: MorePage },
          { path: 'materials', component: MaterialsPage },
          { path: 'participants', component: ParticipantsPage },
          { path: 'participants/:id', component: ParticipantDetailPage },
          { path: 'sponsors', component: SponsorsPage },
          { path: 'testimonials', component: TestimonialsPage },
          { path: 'team', component: TeamPage },
          { path: 'about', component: AboutPage },
        ],
      },
      { path: '', redirectTo: 'highlights', pathMatch: 'full' },
    ],
  },
  { path: '**', component: NotFoundPage },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

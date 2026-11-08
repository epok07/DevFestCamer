import { Component, inject } from '@angular/core';

import { ConferenceService } from '../../core/conference.service';
import { Conference } from '../../core/models';
import { ThemeService } from '../../core/theme.service';

interface MoreTile {
  path: string;
  icon: string;
  title: string;
  description: string;
  meta?: string;
}

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
  standalone: false,
})
export class MorePage {
  readonly conf = inject(ConferenceService);
  readonly theme = inject(ThemeService);

  get c(): Conference {
    return this.conf.data()!;
  }

  get tiles(): MoreTile[] {
    const conference = this.conf.data();
    if (!conference) {
      return [];
    }

    return [
      {
        path: 'participants',
        icon: 'people-circle-outline',
        title: 'Participant·es',
        description:
          'Annuaire des personnes présentes et de leurs liens : trouvez qui rencontrer avant, pendant et après.',
        meta: `${conference.participants.length} profils`,
      },
      {
        path: 'materials',
        icon: 'folder-open-outline',
        title: 'Ressources',
        description:
          'Guide du participant, code de conduite, kit presse et supports publiés après l’événement.',
        meta: `${conference.materials.filter((item) => item.available).length} disponibles`,
      },
      {
        path: 'sponsors',
        icon: 'ribbon-outline',
        title: 'Partenaires',
        description:
          'Les entreprises et communautés qui rendent l’édition possible, par niveau de partenariat.',
        meta: `${conference.sponsors.length} partenaires`,
      },
      {
        path: 'testimonials',
        icon: 'chatbubbles-outline',
        title: 'Témoignages',
        description:
          'Ce que la communauté retient des éditions précédentes, en quelques mots.',
        meta: `${conference.testimonials.length} retours`,
      },
      {
        path: 'team',
        icon: 'construct-outline',
        title: 'Équipe & contacts',
        description:
          'Les bénévoles et organisateur·rices de GDG Douala, avec les bons contacts selon votre besoin.',
        meta: `${conference.team.length} personnes`,
      },
      {
        path: 'about',
        icon: 'information-circle-outline',
        title: 'À propos',
        description:
          'Le manifeste de l’édition, les principes de l’application et la manière de mettre les données à jour.',
        meta: 'DevFestCamer',
      },
    ];
  }

  get externalLinks() {
    const links = this.c.links;
    return [
      { label: 'Site officiel', url: links.site, icon: 'globe-outline' },
      { label: 'Inscription', url: links.register, icon: 'ticket-outline' },
      { label: 'Proposer un talk', url: links.cfp, icon: 'mic-outline' },
      { label: 'Challenge DevFest', url: links.challenge, icon: 'trophy-outline' },
      { label: 'Code de conduite', url: links.codeOfConduct, icon: 'shield-checkmark-outline' },
    ].filter((item) => !!item.url);
  }
}

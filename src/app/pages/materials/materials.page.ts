import { Component, computed, inject } from '@angular/core';

import { ConferenceService } from '../../core/conference.service';
import { Conference, Material, MaterialType } from '../../core/models';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.page.html',
  styleUrls: ['./materials.page.scss'],
  standalone: false,
})
export class MaterialsPage {
  readonly conf = inject(ConferenceService);

  readonly available = computed<Material[]>(() =>
    (this.conf.data()?.materials ?? []).filter((material) => material.available)
  );

  readonly coming = computed<Material[]>(() =>
    (this.conf.data()?.materials ?? []).filter((material) => !material.available)
  );

  get c(): Conference {
    return this.conf.data()!;
  }

  icon(type: MaterialType): string {
    switch (type) {
      case 'PDF':
      case 'Document':
        return 'document-text-outline';
      case 'Slides':
        return 'easel-outline';
      case 'Lien':
        return 'link-outline';
      case 'Archive':
        return 'archive-outline';
      case 'Code':
        return 'code-slash-outline';
      default:
        return 'document-outline';
    }
  }
}

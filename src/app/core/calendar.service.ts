import { Injectable } from '@angular/core';

import { Conference, Day, Session } from './models';

interface IcsEvent {
  uid: string;
  start: string;
  end: string;
  title: string;
  description: string;
  location: string;
}

@Injectable({ providedIn: 'root' })
export class CalendarService {
  addSession(conference: Conference, session: Session): void {
    const track = conference.tracks.find((item) => item.id === session.trackId);
    const room = conference.venue.rooms.find((item) => item.id === session.roomId);
    const speakers = conference.speakers
      .filter((speaker) => session.speakerIds.includes(speaker.id))
      .map((speaker) => speaker.name)
      .join(', ');

    this.save(
      `devfest-${conference.year}-${session.id}.ics`,
      this.build(conference, [
        {
          uid: `${conference.year}-${session.id}@devfestcamer`,
          start: `${conference.days[0].date} ${session.start}`,
          end: `${conference.days[0].date} ${session.end}`,
          title: session.title,
          description: [
            session.abstract,
            speakers ? `Intervenant·es : ${speakers}` : '',
            track ? `Track : ${track.name}` : '',
          ]
            .filter(Boolean)
            .join('\n'),
          location: room ? `${room.name}, ${conference.venue.name}` : conference.venue.name,
        },
      ])
    );
  }

  addDay(conference: Conference, day: Day): void {
    this.save(
      `devfest-${conference.year}-${day.date}.ics`,
      this.build(
        conference,
        day.sessions.map((session) => {
          const room = conference.venue.rooms.find((item) => item.id === session.roomId);
          return {
            uid: `${conference.year}-${session.id}@devfestcamer`,
            start: `${day.date} ${session.start}`,
            end: `${day.date} ${session.end}`,
            title: session.title,
            description: session.abstract,
            location: room ? `${room.name}, ${conference.venue.name}` : conference.venue.name,
          };
        })
      )
    );
  }

  private build(conference: Conference, events: IcsEvent[]): string {
    const stamp = new Date()
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//DevFestCamer//Companion//FR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:${this.escape(conference.name)}`,
    ];

    for (const event of events) {
      lines.push(
        'BEGIN:VEVENT',
        `UID:${this.escape(event.uid)}`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${this.localStamp(event.start)}`,
        `DTEND:${this.localStamp(event.end)}`,
        `SUMMARY:${this.escape(event.title)}`,
        `DESCRIPTION:${this.escape(event.description)}`,
        `LOCATION:${this.escape(event.location)}`,
        'END:VEVENT'
      );
    }

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  private localStamp(value: string): string {
    const [date, time] = value.split(' ');
    return `${date.replace(/-/g, '')}T${time.replace(':', '')}00`;
  }

  private escape(value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  }

  private save(filename: string, content: string): void {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}

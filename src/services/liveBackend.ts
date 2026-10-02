import { RealParticipantCapsule } from '../server/db.ts';

export interface RealLiveCallback {
  onNewLight?: (participant: RealParticipantCapsule, totalCount: number) => void;
  onConnection?: (connection: {
    senderStarId: string;
    recipientStarId: string;
    from: [number, number];
    to: [number, number];
    giftType: string;
  }) => void;
  onInit?: (participants: RealParticipantCapsule[], totalCount: number) => void;
}

class RealBackendClient {
  private eventSource: EventSource | null = null;
  private listeners: Set<RealLiveCallback> = new Set();
  private reconnectTimeout: number | null = null;

  public connect() {
    if (this.eventSource) return;

    try {
      this.eventSource = new EventSource('/api/live-stream');

      this.eventSource.addEventListener('init', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          this.listeners.forEach((l) => {
            if (l.onInit) l.onInit(data.participants || [], data.totalCount || 0);
          });
        } catch {}
      });

      this.eventSource.addEventListener('new_light', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (data.participant) {
            this.listeners.forEach((l) => {
              if (l.onNewLight) l.onNewLight(data.participant, data.totalCount);
            });
          }
        } catch {}
      });

      this.eventSource.addEventListener('light_connection', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          this.listeners.forEach((l) => {
            if (l.onConnection) l.onConnection(data);
          });
        } catch {}
      });

      this.eventSource.onerror = () => {
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        if (!this.reconnectTimeout) {
          this.reconnectTimeout = window.setTimeout(() => {
            this.reconnectTimeout = null;
            this.connect();
          }, 4000);
        }
      };
    } catch {}
  }

  public subscribe(callbacks: RealLiveCallback) {
    this.listeners.add(callbacks);
    this.connect();
    return () => {
      this.listeners.delete(callbacks);
    };
  }

  public async fetchParticipants(): Promise<RealParticipantCapsule[]> {
    try {
      const res = await fetch('/api/participants');
      if (res.ok) {
        const data = await res.json();
        return data.participants || [];
      }
    } catch {}
    return [];
  }

  public async fetchStats(): Promise<{ count: number; targetTime: string }> {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        return {
          count: data.realParticipantCount || 0,
          targetTime: data.targetEventTime,
        };
      }
    } catch {}
    return { count: 0, targetTime: '2026-12-31T23:59:59Z' };
  }

  public async fetchStranger(excludeId?: string): Promise<RealParticipantCapsule | null> {
    try {
      const url = excludeId ? `/api/stranger?exclude=${encodeURIComponent(excludeId)}` : '/api/stranger';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return data as RealParticipantCapsule;
      }
    } catch {}
    return null;
  }

  public async postCapsule(capsule: RealParticipantCapsule): Promise<boolean> {
    try {
      const res = await fetch('/api/capsules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(capsule),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  public async sendConnection(
    senderStarId: string,
    recipientStarId: string,
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number,
    giftType: string
  ): Promise<void> {
    try {
      await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderStarId,
          recipientStarId,
          fromLat,
          fromLng,
          toLat,
          toLng,
          giftType,
        }),
      });
    } catch {}
  }

  public async savePostEventLine(starId: string, line: string): Promise<void> {
    try {
      await fetch('/api/post-event-line', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ starId, line }),
      });
    } catch {}
  }
}

export const liveBackend = new RealBackendClient();

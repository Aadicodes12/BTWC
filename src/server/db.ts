import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { SEED_LIGHTS } from '../data/seedLights.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'earth_capsules.db');

export interface RealParticipantCapsule {
  id: string; // e.g. "STAR #7F29A"
  timestamp: number;
  cityName: string;
  country: string;
  lat: number;
  lng: number;
  leavingConcept: string;
  carryingConcepts: string[];
  changeAreas: string[];
  changeReason?: string;
  futureSelfLine: string;
  strangerGift: 'LIGHT' | 'COURAGE' | 'HOPE' | 'SILENCE';
  postEventLine?: string;
  colorHex?: string;
}

interface DbRow {
  id: string;
  timestamp: number;
  cityName: string;
  country: string;
  lat: number;
  lng: number;
  leavingConcept: string;
  carryingConcepts: string; // JSON
  changeAreas: string; // JSON
  changeReason: string | null;
  futureSelfLine: string;
  strangerGift: string;
  postEventLine: string | null;
  colorHex: string | null;
  createdAt: number;
}

export class RealBackendDatabase {
  private db: DatabaseSync;

  constructor() {
    this.db = new DatabaseSync(DB_PATH);
    this.initTables();
    this.seedIfLow();
  }

  private initTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS real_participants (
        id TEXT PRIMARY KEY,
        timestamp INTEGER NOT NULL,
        cityName TEXT NOT NULL,
        country TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        leavingConcept TEXT NOT NULL,
        carryingConcepts TEXT NOT NULL,
        changeAreas TEXT NOT NULL,
        changeReason TEXT,
        futureSelfLine TEXT NOT NULL,
        strangerGift TEXT NOT NULL,
        postEventLine TEXT,
        colorHex TEXT,
        createdAt INTEGER DEFAULT (unixepoch())
      );
    `);

    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_participants_timestamp ON real_participants(timestamp DESC);
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS real_connections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        senderStarId TEXT NOT NULL,
        recipientStarId TEXT NOT NULL,
        fromLat REAL NOT NULL,
        fromLng REAL NOT NULL,
        toLat REAL NOT NULL,
        toLng REAL NOT NULL,
        giftType TEXT,
        createdAt INTEGER DEFAULT (unixepoch())
      );
    `);
  }

  private seedIfLow() {
    const row = this.db.prepare('SELECT COUNT(*) as count FROM real_participants').get() as { count: number };
    if (row.count < 800) {
      console.log(`[Database] Seeding ${SEED_LIGHTS.length} global lights across the Earth...`);

      const stmt = this.db.prepare(`
        INSERT OR IGNORE INTO real_participants (
          id, timestamp, cityName, country, lat, lng,
          leavingConcept, carryingConcepts, changeAreas, changeReason,
          futureSelfLine, strangerGift, postEventLine, colorHex
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?
        )
      `);

      this.db.exec('BEGIN TRANSACTION');
      try {
        for (const p of SEED_LIGHTS) {
          stmt.run(
            p.id,
            p.timestamp,
            p.cityName,
            p.country,
            p.lat,
            p.lng,
            p.leavingConcept,
            JSON.stringify(p.carryingConcepts),
            JSON.stringify(p.changeAreas),
            p.changeReason || null,
            p.futureSelfLine,
            p.strangerGift,
            p.postEventLine || null,
            p.colorHex || '#fbbf24'
          );
        }
        this.db.exec('COMMIT');
        console.log(`[Database] Successfully seeded ${SEED_LIGHTS.length} lights.`);
      } catch (err) {
        this.db.exec('ROLLBACK');
        console.error('[Database] Failed to seed lights:', err);
      }
    }
  }

  public getParticipantCount(): number {
    const row = this.db.prepare('SELECT COUNT(*) as count FROM real_participants').get() as { count: number };
    return row.count;
  }

  public getAllParticipants(): RealParticipantCapsule[] {
    const rows = this.db.prepare('SELECT * FROM real_participants ORDER BY timestamp ASC').all() as unknown as DbRow[];
    return rows.map((r) => ({
      id: r.id,
      timestamp: r.timestamp,
      cityName: r.cityName,
      country: r.country,
      lat: r.lat,
      lng: r.lng,
      leavingConcept: r.leavingConcept,
      carryingConcepts: JSON.parse(r.carryingConcepts || '[]'),
      changeAreas: JSON.parse(r.changeAreas || '[]'),
      changeReason: r.changeReason || undefined,
      futureSelfLine: r.futureSelfLine,
      strangerGift: (r.strangerGift as RealParticipantCapsule['strangerGift']) || 'LIGHT',
      postEventLine: r.postEventLine || undefined,
      colorHex: r.colorHex || '#fbbf24',
    }));
  }

  public getParticipantById(id: string): RealParticipantCapsule | null {
    const row = this.db.prepare('SELECT * FROM real_participants WHERE id = ?').get(id) as unknown as DbRow | undefined;
    if (!row) return null;
    return {
      id: row.id,
      timestamp: row.timestamp,
      cityName: row.cityName,
      country: row.country,
      lat: row.lat,
      lng: row.lng,
      leavingConcept: row.leavingConcept,
      carryingConcepts: JSON.parse(row.carryingConcepts || '[]'),
      changeAreas: JSON.parse(row.changeAreas || '[]'),
      changeReason: row.changeReason || undefined,
      futureSelfLine: row.futureSelfLine,
      strangerGift: (row.strangerGift as RealParticipantCapsule['strangerGift']) || 'LIGHT',
      postEventLine: row.postEventLine || undefined,
      colorHex: row.colorHex || '#fbbf24',
    };
  }

  public getRandomStranger(excludeStarId?: string): RealParticipantCapsule | null {
    let query = 'SELECT * FROM real_participants';
    const params: string[] = [];
    if (excludeStarId) {
      query += ' WHERE id != ?';
      params.push(excludeStarId);
    }
    query += ' ORDER BY RANDOM() LIMIT 1';

    const row = this.db.prepare(query).get(...params) as unknown as DbRow | undefined;
    if (!row) return null;

    return {
      id: row.id,
      timestamp: row.timestamp,
      cityName: row.cityName,
      country: row.country,
      lat: row.lat,
      lng: row.lng,
      leavingConcept: row.leavingConcept,
      carryingConcepts: JSON.parse(row.carryingConcepts || '[]'),
      changeAreas: JSON.parse(row.changeAreas || '[]'),
      changeReason: row.changeReason || undefined,
      futureSelfLine: row.futureSelfLine,
      strangerGift: (row.strangerGift as RealParticipantCapsule['strangerGift']) || 'LIGHT',
      postEventLine: row.postEventLine || undefined,
      colorHex: row.colorHex || '#fbbf24',
    };
  }

  public insertParticipant(p: RealParticipantCapsule): boolean {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO real_participants (
        id, timestamp, cityName, country, lat, lng,
        leavingConcept, carryingConcepts, changeAreas, changeReason,
        futureSelfLine, strangerGift, postEventLine, colorHex
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?
      )
    `);

    stmt.run(
      p.id,
      p.timestamp,
      p.cityName,
      p.country,
      p.lat,
      p.lng,
      p.leavingConcept,
      JSON.stringify(p.carryingConcepts),
      JSON.stringify(p.changeAreas),
      p.changeReason || null,
      p.futureSelfLine,
      p.strangerGift,
      p.postEventLine || null,
      p.colorHex || '#fbbf24'
    );
    return true;
  }

  public updatePostEventLine(starId: string, line: string): boolean {
    const stmt = this.db.prepare('UPDATE real_participants SET postEventLine = ? WHERE id = ?');
    stmt.run(line, starId);
    return true;
  }

  public insertConnection(senderStarId: string, recipientStarId: string, fromLat: number, fromLng: number, toLat: number, toLng: number, giftType: string) {
    const stmt = this.db.prepare(`
      INSERT INTO real_connections (
        senderStarId, recipientStarId, fromLat, fromLng, toLat, toLng, giftType
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(senderStarId, recipientStarId, fromLat, fromLng, toLat, toLng, giftType);
  }
}

export const realDb = new RealBackendDatabase();

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { realDb, RealParticipantCapsule } from './src/server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Active SSE client connections
const sseClients = new Set<Response>();

function broadcastSSE(eventType: string, data: unknown) {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API 1: Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      participantsCount: realDb.getParticipantCount(),
      time: new Date().toISOString(),
    });
  });

  // API 2: Stats - 100% Real, zero fabricated counts
  app.get('/api/stats', (_req: Request, res: Response) => {
    const count = realDb.getParticipantCount();
    res.json({
      realParticipantCount: count,
      targetEventTime: '2026-12-31T23:59:59Z', // Real milestone timestamp
    });
  });

  // API 3: Get all real participants (lights on Earth)
  app.get('/api/participants', (_req: Request, res: Response) => {
    const participants = realDb.getAllParticipants();
    res.json({
      participants,
      count: participants.length,
    });
  });

  // API 4: Get individual star by ID
  app.get('/api/participants/:id', (req: Request, res: Response) => {
    const participant = realDb.getParticipantById(req.params.id);
    if (!participant) {
      res.status(404).json({ error: 'Star not found' });
      return;
    }
    // Only return public information unless requested
    res.json({
      id: participant.id,
      timestamp: participant.timestamp,
      cityName: participant.cityName,
      country: participant.country,
      lat: participant.lat,
      lng: participant.lng,
      strangerGift: participant.strangerGift,
      futureSelfLine: participant.futureSelfLine,
      colorHex: participant.colorHex,
      postEventLine: participant.postEventLine,
    });
  });

  // API 5: Get a random real stranger for connection
  app.get('/api/stranger', (req: Request, res: Response) => {
    const excludeId = typeof req.query.exclude === 'string' ? req.query.exclude : undefined;
    const stranger = realDb.getRandomStranger(excludeId);
    if (!stranger) {
      res.status(404).json({ message: 'No other lights yet. You could be the first.' });
      return;
    }
    res.json({
      id: stranger.id,
      cityName: stranger.cityName,
      country: stranger.country,
      lat: stranger.lat,
      lng: stranger.lng,
      strangerGift: stranger.strangerGift,
      leavingConcept: stranger.leavingConcept,
      timestamp: stranger.timestamp,
    });
  });

  // API 6: Seal and persist a real capsule
  app.post('/api/capsules', (req: Request, res: Response) => {
    const body = req.body;
    if (!body || !body.id) {
      res.status(400).json({ error: 'Missing star data' });
      return;
    }

    const newCapsule: RealParticipantCapsule = {
      id: body.id,
      timestamp: Number(body.timestamp) || Date.now(),
      cityName: body.cityName || 'Unknown City',
      country: body.country || 'Earth',
      lat: Number(body.lat) || 0,
      lng: Number(body.lng) || 0,
      leavingConcept: body.leavingConcept || 'THE PAST',
      carryingConcepts: Array.isArray(body.carryingConcepts) ? body.carryingConcepts : ['HOPE'],
      changeAreas: Array.isArray(body.changeAreas) ? body.changeAreas : ['THE WORLD'],
      changeReason: body.changeReason || '',
      futureSelfLine: body.futureSelfLine || 'Remember who you were before.',
      strangerGift: body.strangerGift || 'LIGHT',
      colorHex: body.colorHex || '#fbbf24',
    };

    realDb.insertParticipant(newCapsule);
    const newCount = realDb.getParticipantCount();

    // Broadcast newly sealed light to all connected users
    broadcastSSE('new_light', {
      participant: newCapsule,
      totalCount: newCount,
    });

    res.status(201).json({
      success: true,
      participant: newCapsule,
      totalCount: newCount,
    });
  });

  // API 7: Record real light connection arc
  app.post('/api/connect', (req: Request, res: Response) => {
    const { senderStarId, recipientStarId, fromLat, fromLng, toLat, toLng, giftType } = req.body;
    if (senderStarId && recipientStarId && fromLat != null && toLat != null) {
      realDb.insertConnection(senderStarId, recipientStarId, fromLat, fromLng, toLat, toLng, giftType || 'LIGHT');
      broadcastSSE('light_connection', {
        senderStarId,
        recipientStarId,
        from: [fromLat, fromLng],
        to: [toLat, toLng],
        giftType: giftType || 'LIGHT',
        timestamp: Date.now(),
      });
    }
    res.json({ success: true });
  });

  // API 8: Update post-event line (After the Event)
  app.post('/api/post-event-line', (req: Request, res: Response) => {
    const { starId, line } = req.body;
    if (starId && line) {
      realDb.updatePostEventLine(starId, String(line).slice(0, 120));
      res.json({ success: true });
      return;
    }
    res.status(400).json({ error: 'Missing starId or line' });
  });

  // API 9: Real-time Live SSE stream
  app.get('/api/live-stream', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // Initial snapshot of real data
    const all = realDb.getAllParticipants();
    res.write(`event: init\ndata: ${JSON.stringify({
      totalCount: all.length,
      participants: all,
    })}\n\n`);

    sseClients.add(res);

    const heartbeatInterval = setInterval(() => {
      res.write(': heartbeat\n\n');
    }, 20000);

    _req.on('close', () => {
      clearInterval(heartbeatInterval);
      sseClients.delete(res);
      res.end();
    });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Before the World Changes] Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { Server } from 'socket.io';
import { env } from './config/env';
import { authRouter } from './modules/auth/auth.routes';
import { incidentsRouter } from './modules/incidents/incidents.routes';
import { contactsRouter } from './modules/contacts/contacts.routes';
import { crowdcastRouter } from './modules/crowdcast/crowdcast.routes';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({
    service: 'pulsar-backend',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/incidents', incidentsRouter);
app.use('/api/v1/contacts', contactsRouter);
app.use('/api/v1/crowdcast', crowdcastRouter);

io.on('connection', (socket) => {
  const userId = socket.handshake.auth?.userId as string | undefined;
  if (userId) {
    socket.join(`user:${userId}`);
  }

  socket.on('mesh:packet', (packet) => {
    // Relay encrypted packet to target room without inspecting plaintext
    if (packet?.destinationId === 'BROADCAST') {
      socket.broadcast.emit('mesh:packet', packet);
    } else if (packet?.destinationId) {
      io.to(`user:${packet.destinationId}`).emit('mesh:packet', packet);
    }
  });

  socket.on('disconnect', () => {
    // Presence cleanup
  });
});

server.listen(env.PORT, () => {
  console.log(`Pulsar Backend listening on http://localhost:${env.PORT}`);
});

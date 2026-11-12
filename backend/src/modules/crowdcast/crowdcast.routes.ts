import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAuth, AuthenticatedRequest } from '../../lib/crypto';

export const crowdcastRouter = Router();

crowdcastRouter.get('/channels', requireAuth, async (_req, res) => {
  try {
    const channels = await prisma.announcementChannel.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ channels });
  } catch (err) {
    console.error('List channels error:', err);
    res.status(500).json({ error: 'Failed to load channels' });
  }
});

crowdcastRouter.post('/channels', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { name, description, scopeType = 'COMMUNITY', geoScope } = req.body as {
      name?: string;
      description?: string;
      scopeType?: string;
      geoScope?: string;
    };
    if (!name?.trim()) {
      res.status(400).json({ error: 'Channel name is required' });
      return;
    }

    const channel = await prisma.announcementChannel.create({
      data: {
        name: name.trim(),
        description,
        creatorId: req.user!.userId,
        scopeType,
        geoScope,
        verificationStatus: req.user!.role === 'ADMIN' ? 'VERIFIED' : 'UNVERIFIED',
      },
    });
    res.status(201).json({ channel });
  } catch (err) {
    console.error('Create channel error:', err);
    res.status(500).json({ error: 'Failed to create channel' });
  }
});

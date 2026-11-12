import { Router } from 'express';
import { getEmergencyNumbers } from '@pulsar/emergency-config';
import { prisma } from '../../lib/prisma';
import { requireAuth, AuthenticatedRequest } from '../../lib/crypto';

export const incidentsRouter = Router();

/**
 * Get country-specific official emergency numbers.
 */
incidentsRouter.get('/numbers/:countryCode', (req, res) => {
  const numbers = getEmergencyNumbers(req.params.countryCode);
  res.json({ countryCode: req.params.countryCode.toUpperCase(), numbers });
});

/**
 * Create an emergency incident (test mode enforced when isTestMode is true).
 */
incidentsRouter.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      category,
      priority = 'CRITICAL',
      latitude,
      longitude,
      locationAccuracy,
      description,
      isTestMode = true,
    } = req.body as {
      category: string;
      priority?: string;
      latitude?: number;
      longitude?: number;
      locationAccuracy?: number;
      description?: string;
      isTestMode?: boolean;
    };

    if (!category) {
      res.status(400).json({ error: 'Emergency category is required' });
      return;
    }

    const incident = await prisma.emergencyIncident.create({
      data: {
        reporterId: req.user!.userId,
        category,
        priority,
        latitude,
        longitude,
        locationAccuracy,
        description: isTestMode ? `[TEST] ${description ?? ''}`.trim() : description,
        status: 'DISPATCHED_SERVER',
        isTestMode,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user!.userId,
        action: 'INCIDENT_CREATED',
        resourceType: 'EmergencyIncident',
        resourceId: incident.id,
        metadata: JSON.stringify({ category, priority, isTestMode }),
      },
    });

    res.status(201).json({
      incident,
      officialGovIntegration: {
        connected: false,
        message:
          'No authorized government dispatch API is connected. Use native phone call (112) or SMS for official emergency services.',
      },
    });
  } catch (err) {
    console.error('Create incident error:', err);
    res.status(500).json({ error: 'Failed to create incident' });
  }
});

/**
 * List incidents for the authenticated user (or all for responders/admins).
 */
incidentsRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const isStaff = ['ADMIN', 'RESPONDER', 'FOREST_ADMIN', 'FOREST_OFFICER'].includes(req.user!.role);
    const incidents = await prisma.emergencyIncident.findMany({
      where: isStaff ? undefined : { reporterId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ incidents });
  } catch (err) {
    console.error('List incidents error:', err);
    res.status(500).json({ error: 'Failed to list incidents' });
  }
});

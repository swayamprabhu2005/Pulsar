import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAuth, AuthenticatedRequest } from '../../lib/crypto';

export const contactsRouter = Router();

/**
 * Privacy-preserving contact discovery: accepts SHA-256 phone hashes,
 * never raw phone numbers, and returns which hashes match registered Pulsar users.
 */
contactsRouter.post('/discover', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { contacts } = req.body as { contacts?: Array<{ phoneHash: string; displayName: string }> };
    if (!Array.isArray(contacts)) {
      res.status(400).json({ error: 'contacts array is required' });
      return;
    }

    const hashes = contacts.map((c) => c.phoneHash).slice(0, 500);
    const registeredUsers = await prisma.user.findMany({
      where: { phoneHash: { in: hashes }, deletedAt: null },
      select: { id: true, phoneHash: true, name: true },
    });

    const userByHash = new Map(registeredUsers.map((u) => [u.phoneHash, u]));

    const results = contacts.map((c) => {
      const match = userByHash.get(c.phoneHash);
      return {
        phoneHash: c.phoneHash,
        displayName: c.displayName,
        isRegistered: Boolean(match),
        registeredUserId: match?.id ?? null,
      };
    });

    res.json({ results });
  } catch (err) {
    console.error('Contact discovery error:', err);
    res.status(500).json({ error: 'Contact discovery failed' });
  }
});

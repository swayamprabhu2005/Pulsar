import { Router } from 'express';
import crypto from 'crypto';
import { prisma } from '../../lib/prisma';
import { hashPhone, maskPhone, hashOtp, signTokens, requireAuth, AuthenticatedRequest } from '../../lib/crypto';
import { env } from '../../config/env';

export const authRouter = Router();

/**
 * Step 1: Request OTP for mandatory phone number login.
 */
authRouter.post('/otp/request', async (req, res) => {
  try {
    const { phone, countryCode = 'IN' } = req.body as { phone?: string; countryCode?: string };
    if (!phone || phone.trim().length < 7) {
      res.status(400).json({ error: 'Valid phone number is required' });
      return;
    }

    const phoneHash = hashPhone(phone);
    // Generate 6-digit OTP
    const code = String(crypto.randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await prisma.otpVerification.create({
      data: {
        phoneHash,
        codeHash: hashOtp(code),
        expiresAt,
      },
    });

    if (env.OTP_PROVIDER === 'dev') {
      console.log(`[Pulsar OTP][DEV] ${maskPhone(phone)} (${countryCode}) => ${code}`);
    }

    res.json({
      success: true,
      message: 'OTP dispatched',
      expiresInSeconds: 300,
      // Only expose devCode in explicit development mode
      ...(env.NODE_ENV === 'development' ? { devOtp: code } : {}),
    });
  } catch (err) {
    console.error('OTP request error:', err);
    res.status(500).json({ error: 'Failed to dispatch OTP. Check database connection.' });
  }
});

/**
 * Step 2: Verify OTP & issue JWT access + refresh tokens.
 */
authRouter.post('/otp/verify', async (req, res) => {
  try {
    const { phone, code, countryCode = 'IN', name } = req.body as {
      phone?: string;
      code?: string;
      countryCode?: string;
      name?: string;
    };

    if (!phone || !code) {
      res.status(400).json({ error: 'Phone number and OTP code are required' });
      return;
    }

    const phoneHash = hashPhone(phone);
    const latestOtp = await prisma.otpVerification.findFirst({
      where: { phoneHash, verified: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestOtp || latestOtp.expiresAt < new Date()) {
      res.status(400).json({ error: 'OTP expired or not found' });
      return;
    }

    if (latestOtp.attempts >= 5) {
      res.status(429).json({ error: 'Too many invalid attempts. Request a new OTP.' });
      return;
    }

    if (latestOtp.codeHash !== hashOtp(code)) {
      await prisma.otpVerification.update({
        where: { id: latestOtp.id },
        data: { attempts: { increment: 1 } },
      });
      res.status(401).json({ error: 'Incorrect OTP code' });
      return;
    }

    await prisma.otpVerification.update({
      where: { id: latestOtp.id },
      data: { verified: true },
    });

    let user = await prisma.user.findUnique({ where: { phoneHash } });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = await prisma.user.create({
        data: {
          phoneHash,
          phoneMasked: maskPhone(phone),
          name: name?.trim() || 'Pulsar User',
          countryCode,
          isVerified: true,
        },
      });
    } else if (!user.isVerified) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });
    }

    const tokens = signTokens({ userId: user.id, role: user.role });

    res.json({
      success: true,
      isNewUser,
      user: {
        id: user.id,
        phoneMasked: user.phoneMasked,
        name: user.name,
        countryCode: user.countryCode,
        role: user.role,
        isVerified: user.isVerified,
      },
      ...tokens,
    });
  } catch (err) {
    console.error('OTP verify error:', err);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

/**
 * Step 3: Complete or update user profile.
 */
authRouter.patch('/profile', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { name, countryCode } = req.body as { name?: string; countryCode?: string };
    const updated = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(countryCode ? { countryCode } : {}),
      },
    });
    res.json({
      id: updated.id,
      phoneMasked: updated.phoneMasked,
      name: updated.name,
      countryCode: updated.countryCode,
      role: updated.role,
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

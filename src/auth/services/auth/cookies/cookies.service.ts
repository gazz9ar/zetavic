import { Response } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CookiesService {
  public setAuthCookies(response: Response, accessToken: string) {
    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: false, // Set to false for local development
      sameSite: 'lax' as const, // More permissive for cross-origin in development
      path: '/',
      // Don't set domain for localhost development
    };

    const prodCookieOptions = {
      httpOnly: true,
      secure: true, // HTTPS only in production
      sameSite: 'strict' as const,
      path: '/',
      domain: process.env.COOKIE_DOMAIN, // Set your production domain
    };

    const options = isProduction ? prodCookieOptions : cookieOptions;

    // Access token cookie (shorter expiry)
    response.cookie('access_token', accessToken, {
      ...options,
      maxAge: 36 * 60 * 1000,
    });
  }
}


import { seconds, ThrottlerException, ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.ips.length ? req.ips[0] : req.ip; // individualize IP extraction to meet your own needs
  }

  protected async throwThrottlingException(context: ExecutionContext, throttlerLimitDetail: ThrottlerLimitDetail): Promise<void> {
    const ttl = throttlerLimitDetail.timeToExpire;
    const ttlMessage = `after ${ttl} ${ttl === 1 ? 'second' : 'seconds'}`;
    throw new ThrottlerException(`Too many requests attempted. Please try again ${ttlMessage}.`);
  }
}

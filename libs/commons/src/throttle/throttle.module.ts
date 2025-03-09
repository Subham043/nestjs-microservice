import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerBehindProxyGuard } from './throttler-behind-proxy.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                throttlers: [
                    {
                        name: 'default',
                        ttl: 1000,
                        limit: 60,
                    },
                ],
                storage: new ThrottlerStorageRedisService(config.get('REDIS_URL')),
            }),
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerBehindProxyGuard
        }
    ],
})
export class ThrottleModule { }

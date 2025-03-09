import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerBehindProxyGuard } from './throttler-behind-proxy.guard';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import redisConfig from '@app/commons/config/redis.config';

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [redisConfig.KEY],
            useFactory: (config: ConfigType<typeof redisConfig>) => ({
                throttlers: [
                    {
                        name: 'default',
                        ttl: 1000,
                        limit: 60,
                    },
                ],
                storage: new ThrottlerStorageRedisService(config.url),
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

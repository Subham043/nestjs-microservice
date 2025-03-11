import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerBehindProxyGuard } from './throttler-behind-proxy.guard';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import redisConfig from '@app/commons/config/redis.config';

@Module({})
export class ThrottleModule { 
    static forRootAsync(): DynamicModule {
        return {
          module: ThrottleModule,
          imports: [
            ThrottlerModule.forRootAsync({
                imports: [ConfigModule],
                inject: [redisConfig.KEY],
                useFactory: (config: ConfigType<typeof redisConfig>) => ({
                    throttlers: [
                        {
                            name: 'default',
                            ttl: 60000,
                            limit: 100,
                        },
                    ],
                    storage: new ThrottlerStorageRedisService(config.url),
                }),
            }),
          ],
          exports: [ThrottlerModule],
          providers: [
            {
                provide: APP_GUARD,
                useClass: ThrottlerBehindProxyGuard
            }
          ],
        };
      }
}

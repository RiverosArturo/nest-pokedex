import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { EnvConfiguration } from './config/env.config';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { JoiValidationSchema } from './config/joi.validation';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ EnvConfiguration ],
      validationSchema: JoiValidationSchema ,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
      }),
    
    MongooseModule.forRoot( process.env.MONGODB ),
    
    PokemonModule,
    
    CommonModule,
    
    SeedModule,
  ],
})
export class AppModule {}

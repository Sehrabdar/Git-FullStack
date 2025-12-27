import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GithubModule } from './github/github.module';
import githubConfig from './config/github.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load:[githubConfig]
    }),
    GithubModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

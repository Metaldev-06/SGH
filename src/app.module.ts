import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './features/auth/auth.module';
import { CategoryModule } from './features/category/category.module';
import { ClientsModule } from './features/clients/clients.module';
import { ReservationModule } from './features/reservation/reservation.module';
import { RoomsModule } from './features/rooms/rooms.module';
import { UsersModule } from './features/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db-sgh.sqlite',
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    ClientsModule,
    ReservationModule,
    RoomsModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

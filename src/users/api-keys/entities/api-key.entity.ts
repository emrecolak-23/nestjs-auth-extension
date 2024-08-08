import { User } from 'src/users/entities/user.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class ApiKey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  uuid: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((type) => User, (user) => user.apiKeys)
  user: User;
}

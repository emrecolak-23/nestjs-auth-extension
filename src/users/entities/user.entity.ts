import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import {
  Permission,
  PermissionType,
} from 'src/iam/authorization/permission.type';
import { ApiKey } from '../api-keys/entities/api-key.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isTfaEnabled: boolean;

  @Column({ nullable: true })
  tfaSecret: string;

  @Column({ enum: Role, default: Role.Regular })
  role: Role;

  @JoinTable()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((type) => ApiKey, (apiKey) => apiKey.user)
  apiKeys: ApiKey[];

  @Column({ enum: Permission, default: [], type: 'json' })
  permissions: PermissionType[];
}

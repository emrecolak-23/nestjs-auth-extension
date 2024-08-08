import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Role } from 'src/users/enums/role.enum';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';
// import { Permissions } from 'src/iam/authorization/decorators/permission.decorator';
// import { Permission } from 'src/iam/authorization/permission.type';
import { Policies } from 'src/iam/authorization/decorators/policies.decorator';
import { FrameworkContributorPolicy } from 'src/iam/authorization/policies/framework-contributor.policy';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';

@Auth(AuthType.Bearer, AuthType.ApiKey)
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Post()
  // @Permissions(Permission.CreateCoffee)
  // @Roles(Role.Admin)
  @Policies(new FrameworkContributorPolicy())
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Get()
  findAll(@ActiveUser() user: ActiveUserData) {
    console.log(user, 'user');
    return this.coffeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coffeesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(+id, updateCoffeeDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(+id);
  }
}

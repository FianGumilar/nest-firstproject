import { Controller, Body, Post, Get, Patch, Param, Query, Delete, NotFoundException, Session } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service'; 

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(
        private usersService: UsersService,
        private authService: AuthService) {}

    //CREATE USER
    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signUp(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signIn(body.email, body.password);
        session.userId = user.id;
        return user;
    }   

    @Get('/whoami') 
    whoAmI(@Session() session: any) {
        return this.usersService.findOne(session.userId)
    }

    //GET ALL 
    @Get()
    findAllUsers(@Query() paginationQuery) {
        return this.usersService.findAll();
    }

    //GET BY EMAIL
    @Get()
    findUserByEmail(@Query('email') email: string) {
        return this.usersService.findByEmail(email);
    }

    //GET BY ID
    @Serialize(UserDto)
    @Get('/:id')
    async findUserById(@Param('id') id: string) {
        const user = await this.usersService.findOne(parseInt(id));
        if(!user) {
            throw new NotFoundException(`User with id ${id} not found`)
        }
        return user;
    }

    //UPDATE USER
    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body)
    }

    //DELETE USER
    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }
}

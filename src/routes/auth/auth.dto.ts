import { Exclude, Expose, Type } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
import { Match } from '../../shared/decorators/custom-validator.decorator';
import { SussessResDTO } from '../../shared/shared.dto';

export class LoginBodyDto {
    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @IsString()
    @Length(6, 20, {
        message: 'Password must be between 6 and 20 characters',
    })
    password: string;
}

export class RegisterBodyDto extends LoginBodyDto {
    @IsString()
    name: string;

    @IsString()
    @Match('password', {
        message: 'Confirm password must match password',
    })
    confirmPassword: string;
}

export class RegisterResponseEntityDto {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;

    @Exclude()
    password: string;

    @Expose()
    get userIdAndName(): string {
        return `${this.id} - ${this.name}`;
    }

    constructor(partial: Partial<RegisterResponseEntityDto>) {
        Object.assign(this, partial);
    }
}

export class RegisterResponseDto extends SussessResDTO<RegisterResponseEntityDto> {
    @Type(() => RegisterResponseEntityDto)
    declare data: RegisterResponseEntityDto;
    constructor(data: RegisterResponseEntityDto) {
        super(data);
    }
}

export class LoginResponseDto {
    accessToken: string;
    refreshToken: string;

    constructor(data: LoginResponseDto) {
        Object.assign(this, data);
    }
}

export class RefreshTokenBodyDto {
    @IsString()
    refreshToken: string;
}

export class RefreshTokenResponseDto extends LoginResponseDto {}

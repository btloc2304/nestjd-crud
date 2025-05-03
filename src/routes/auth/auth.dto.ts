import { Exclude, Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { SussessResDTO } from '../../shared/shared.dto';

export class LoginBodyDto {
    @IsString()
    email: string;

    @IsString()
    password: string;
}

export class RegisterBodyDto extends LoginBodyDto {
    @IsString()
    name: string;

    @IsString()
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

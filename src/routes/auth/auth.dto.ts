import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

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

export class RegisterResponseDto {
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

    constructor(partial: Partial<RegisterResponseDto>) {
        Object.assign(this, partial);
    }
}

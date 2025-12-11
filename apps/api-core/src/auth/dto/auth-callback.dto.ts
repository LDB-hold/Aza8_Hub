import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthCallbackDto {
  @IsString()
  provider!: string;

  @IsString()
  providerId!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  tenantSlug?: string;

  @IsOptional()
  @IsString()
  tenantName?: string;
}

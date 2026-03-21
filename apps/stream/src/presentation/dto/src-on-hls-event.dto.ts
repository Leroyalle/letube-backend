import { IsIn, IsIP, IsNumber, IsString, IsUrl } from 'class-validator';

export class SrsOnHlsEvent {
  @IsString()
  server_id!: string;

  @IsString()
  service_id!: string;

  @IsIn(['on_hls'])
  action!: 'on_hls';

  @IsString()
  client_id!: string;

  @IsIP()
  ip!: string;

  @IsString()
  vhost!: string;

  @IsString()
  app!: string;

  @IsUrl({ require_tld: false })
  tcUrl!: string;

  @IsString()
  stream!: string;

  @IsString()
  param!: string;

  @IsNumber()
  duration!: number;

  @IsString()
  cwd!: string;

  @IsString()
  file!: string;

  @IsString()
  url!: string;

  @IsString()
  m3u8!: string;

  @IsString()
  m3u8_url!: string;

  @IsNumber()
  seq_no!: number;

  @IsString()
  stream_url!: string;

  @IsString()
  stream_id!: string;
}

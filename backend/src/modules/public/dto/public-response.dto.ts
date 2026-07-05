import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class PublicTempleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional({ nullable: true })
  name: string | null;

  @ApiPropertyOptional({ nullable: true })
  displayName: string | null;

  @ApiPropertyOptional({ nullable: true })
  shortDescription: string | null;

  @ApiPropertyOptional({ nullable: true })
  description: string | null;

  @ApiPropertyOptional({ nullable: true })
  seoTitle: string | null;

  @ApiPropertyOptional({ nullable: true })
  seoDescription: string | null;

  @ApiProperty()
  featured: boolean;

  @ApiProperty()
  popular: boolean;

  @ApiProperty()
  verified: boolean;

  @ApiPropertyOptional({ nullable: true })
  publishedAt: Date | null;
}

export class PublicFestivalResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional({ nullable: true })
  name: string | null;

  @ApiPropertyOptional({ nullable: true })
  displayName: string | null;

  @ApiPropertyOptional({ nullable: true })
  shortDescription: string | null;

  @ApiPropertyOptional({ nullable: true })
  description: string | null;

  @ApiPropertyOptional({ nullable: true })
  festivalType: string | null;

  @ApiProperty()
  isFeatured: boolean;

  @ApiProperty()
  isPopular: boolean;
}

export class PublicDeityResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional({ nullable: true })
  name: string | null;

  @ApiPropertyOptional({ nullable: true })
  displayName: string | null;

  @ApiPropertyOptional({ nullable: true })
  description: string | null;

  @ApiPropertyOptional({ nullable: true })
  image: string | null;

  @ApiProperty()
  isFeatured: boolean;

  @ApiProperty()
  isPopular: boolean;
}

export class PublicPanchangResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ nullable: true })
  description: string | null;

  @ApiPropertyOptional({ nullable: true })
  calendarType: string | null;

  @ApiPropertyOptional({ nullable: true })
  timezone: string | null;

  @ApiProperty()
  isDefault: boolean;
}

export class PublicPanchangDateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  calendarDate: Date;

  @ApiPropertyOptional({ nullable: true })
  weekday: string | null;

  @ApiPropertyOptional({ nullable: true })
  paksha: string | null;

  @ApiPropertyOptional({ nullable: true })
  masa: string | null;
}

export class PublicContentItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional({ nullable: true })
  shortDescription: string | null;

  @ApiPropertyOptional({ nullable: true })
  publishedAt: Date | null;

  @ApiProperty()
  isFeatured: boolean;

  @ApiProperty()
  isPopular: boolean;
}

export class PublicLegacyContentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional({ nullable: true })
  publishedAt: Date | null;
}

export class PublicMediaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: "/public/media/{id}/file" })
  url: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  originalName: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  extension: string;

  @ApiProperty()
  size: number;

  @ApiPropertyOptional({ nullable: true })
  width: number | null;

  @ApiPropertyOptional({ nullable: true })
  height: number | null;

  @ApiPropertyOptional({ nullable: true })
  alt: string | null;

  @ApiProperty()
  title: string;

  @ApiProperty()
  createdAt: Date;
}

export class PublicSeoRedirectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fromPath: string;

  @ApiProperty()
  toPath: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PublicSeoLandingPageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  language: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional({ nullable: true })
  metaTitle: string | null;

  @ApiPropertyOptional({ nullable: true })
  metaDescription: string | null;

  @ApiPropertyOptional({ nullable: true })
  content: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

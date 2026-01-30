import { ApiProperty } from '@nestjs/swagger';

export class MemberDto {
  @ApiProperty({ example: '6797a56ca19834f20ff90313' })
  _id: string;

  @ApiProperty({ example: 20 })
  age: number;

  @ApiProperty({ example: 'brown' })
  eyeColor: string;

  @ApiProperty({ example: 'Anderson Hopper' })
  name: string;

  @ApiProperty({ example: 'male' })
  gender: string;

  @ApiProperty({ example: 'andersonhopper@naxdis.com' })
  email: string;

  @ApiProperty({ example: '383 Melba Court' })
  street: string;

  @ApiProperty({ example: 'Lancaster' })
  city: string;

  @ApiProperty({ example: '2020-10-23T04:03:37 -01:00' })
  registered: string;

  @ApiProperty({ example: 'squash' })
  favoriteSport: string;

  @ApiProperty({ example: 'Well done, Anderson Hopper! You have completed 117 minutes of training.' })
  greeting: string;
}

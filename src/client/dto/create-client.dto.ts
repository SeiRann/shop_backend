export class CreateClientDto {
  username: string;
  password: string;
  email: string;
  phone_number: number;
  address: string;
}

export interface CreateClientRequestInterface {
  body: {
    username: string;
    password: string;
    email: string;
    phone_number: number;
    address: string;
  };
}

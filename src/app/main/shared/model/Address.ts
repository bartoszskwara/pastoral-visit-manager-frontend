import {Apartment} from "./Apartment";

export class Address {
  id: number;
  prefix: string;
  streetName: string;
  blockNumber: string;
  apartments: Apartment[];
}

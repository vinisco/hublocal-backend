import { faker } from '@faker-js/faker';
import { generate } from './cnpj.util';
import { v4 as uuidV4 } from 'uuid';

faker.setLocale('pt_BR');

const genFake = {
  userName: () => faker.name.firstName(),
  userEmail: () => faker.internet.email(),
  userPassword: () => faker.internet.password(),
  companyName: () => faker.company.name(),
  companyWebsite: () => faker.internet.domainName(),
  companyCNPJ: () => generate(),
  localName: () => faker.name.jobArea(),
  localCEP: () => faker.address.zipCode(),
  localStreet: () => faker.address.street(),
  localNumber: () => faker.address.buildingNumber(),
  localNeighbor: () => faker.address.street(),
  localCity: () => faker.address.cityName(),
  localState: () => faker.address.state(),

  uuid: () => uuidV4(),
};

export default genFake;

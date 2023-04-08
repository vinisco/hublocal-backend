import { MockRepository } from '../../../common/types/mock-repository';
import genFake from '../../../common/utils/genFake.util';

const userMockRepository = <T = any>(userEntityList): MockRepository<T> => ({
  create: jest.fn().mockImplementation((dto) => dto),
  findOne: jest.fn().mockImplementation((email) => {
    return Promise.resolve(
      userEntityList.find((el) => el.email === email.where.email),
    );
  }),
  save: jest.fn().mockImplementation((dto) => {
    const user = { id: genFake.uuid(), ...dto };
    userEntityList.push(user);
    return Promise.resolve(user);
  }),
});

export default userMockRepository;

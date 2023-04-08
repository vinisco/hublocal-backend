import { MockRepository } from '../../../common/types/mock-repository';
import genFake from '../../../common/utils/genFake.util';

const localMockRepository = <T = any>(localEntityList): MockRepository<T> => ({
  create: jest.fn().mockImplementation((dto) => dto),
  findOne: jest.fn().mockImplementation((query) => {
    return Promise.resolve(
      localEntityList.find((el) => el.id === query.where.id),
    );
  }),
  find: jest.fn().mockImplementation((query) => {
    return Promise.resolve(
      localEntityList.filter((el) => el.company_id === query.where.company_id),
    );
  }),
  count: jest.fn().mockImplementation((query) => {
    return Promise.resolve(
      localEntityList.filter((el) => el.company_id === query.where.company_id)
        .length,
    );
  }),
  save: jest.fn().mockImplementation((dto) => {
    const local = { ...dto, id: dto?.id ? dto.id : genFake.uuid() };
    localEntityList.push(local);
    return Promise.resolve(local);
  }),
  remove: jest.fn().mockImplementation((dto) => {
    const local = localEntityList.find((el) => el.id === dto.id);
    localEntityList = localEntityList.filter((el) => el.id !== dto.id);
    return Promise.resolve(local);
  }),
});

export default localMockRepository;

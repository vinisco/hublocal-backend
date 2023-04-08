import { MockRepository } from '../../../common/types/mock-repository';
import genFake from '../../../common/utils/genFake.util';

const companyMockRepository = <T = any>(
  companyEntityList,
): MockRepository<T> => ({
  create: jest.fn().mockImplementation((dto) => dto),
  findOne: jest.fn().mockImplementation((query) => {
    if (query.where.user_id) {
      return Promise.resolve(
        companyEntityList.find(
          (el) =>
            el.id === query.where.id && el.user_id === query.where.user_id,
        ),
      );
    }
    return Promise.resolve(
      companyEntityList.find((el) => el.id === query.where.id),
    );
  }),
  find: jest.fn().mockImplementation((query) => {
    return Promise.resolve(
      companyEntityList.filter((el) => el.user_id === query.where.user_id),
    );
  }),
  count: jest.fn().mockImplementation((query) => {
    return Promise.resolve(
      companyEntityList.filter((el) => el.user_id === query.where.user_id)
        .length,
    );
  }),
  save: jest.fn().mockImplementation((dto) => {
    const company = { id: dto?.id ? dto.id : genFake.uuid(), ...dto };
    companyEntityList.push(company);
    return Promise.resolve(company);
  }),
  remove: jest.fn().mockImplementation((dto) => {
    const company = companyEntityList.find((el) => el.id === dto.id);
    companyEntityList = companyEntityList.filter((el) => el.id !== dto.id);
    return Promise.resolve(company);
  }),
});

export default companyMockRepository;

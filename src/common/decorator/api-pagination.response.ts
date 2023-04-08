import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginationRequestDto } from '../dto/pagination-request.dto';

interface IPaginatedDecoratorApiResponse {
  model: Type<any>;
  description?: string;
}

export const ApiPaginatedResponse = (
  options: IPaginatedDecoratorApiResponse,
) => {
  return applyDecorators(
    ApiExtraModels(PaginationRequestDto),
    ApiOkResponse({
      description: options.description || 'Successfully received model list',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationRequestDto) },
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(options.model) },
              },
              total: {
                type: 'number',
                default: 0,
              },
              page: {
                type: 'number',
                default: 1,
              },
              limit: {
                type: 'number',
                default: 10,
              },
            },
          },
        ],
      },
    }),
  );
};

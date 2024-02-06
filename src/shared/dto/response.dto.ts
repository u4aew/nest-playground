import { RESPONSE_HTTP_STATUS } from '../types';

export class ResponseDto<T> {
  data: T;
  status: RESPONSE_HTTP_STATUS;

  constructor({
    data = undefined,
    status = RESPONSE_HTTP_STATUS.SUCCESS,
  }: { data?: T; status?: RESPONSE_HTTP_STATUS } = {}) {
    this.data = data;
    this.status = status;
  }
}

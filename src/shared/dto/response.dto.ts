import { ResponseHttpStatus } from '../types';

export class ResponseDto<T> {
  data: T;
  status: ResponseHttpStatus;

  constructor({
    data = undefined,
    status = ResponseHttpStatus.SUCCESS,
  }: { data?: T; status?: ResponseHttpStatus } = {}) {
    this.data = data;
    this.status = status;
  }
}

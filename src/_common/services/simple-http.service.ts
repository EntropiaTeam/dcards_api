import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';

type HttpResponse<T> = {
  data: T;
};

@Injectable()
export class SimpleHttpService {
  constructor(private readonly httpService: HttpService) {}

  public async getData<T>(url:string): Promise<T> {
    return this.httpService
      .get(url)
      .pipe(map((axiosResponse: HttpResponse<T>) => axiosResponse.data))
      .toPromise();
  }

  public async getDataAsBuffer<T>(url: string): Promise<T> {
    return this.httpService
      .get(url, { responseType: 'arraybuffer' })
      .pipe(map((axiosResponse: HttpResponse<T>) => axiosResponse.data))
      .toPromise();
  }
}

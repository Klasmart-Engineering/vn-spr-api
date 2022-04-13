import { Get, OperationId, Route, Tags } from 'tsoa';

interface PingResponse {
  message: string;
}

@Route('ping')
@Tags('ping')
@OperationId('ping')
export default class PingController {
  /**
   * For health check only, this API won't need access token
   */
  @Get('/')
  public async getMessage(): Promise<PingResponse> {
    return {
      message: 'pong',
    };
  }
}

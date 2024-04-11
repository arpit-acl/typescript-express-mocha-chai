import { Response, Request } from 'express';
import  Messages from '@config/messages';

class request {
  static helper(res: Response, isSuccess: boolean, message: string, data: object, status: number, language = 'en') {
    const msg = Messages[`${language}`][`${message}`];
    return res.status(status).send({
      isSuccess,
      message: msg || message,
      data,
    });
  }
  static notFound() {
    return (req: Request, res: Response) => {
      return res.status(404).send({
        notFound: true,
        message: 'Route Not Found',
        status: 404,
      });
    };   
  }
}

export default request;
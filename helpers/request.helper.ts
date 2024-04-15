import { Response, Request } from 'express';
import  Messages from '../config/messages';

class request {
  success(res: Response, message: string, data: object, language = 'en') {
    const msg = Messages[`${language}`][`${message}`];
    return res.status(200).send({
      isSuccess: true,
      message: msg || message,
      data,
    });
  }
  error(res: Response, message: string, data: object, language = 'en') {
    const msg = Messages[`${language}`][`${message}`];
    return res.status(500).send({
      isSuccess: false,
      message: msg || message,
      data,
    });
  }
  unAuthorized(res: Response, language = 'en') {
    return res.status(401).send({
      isSuccess: false,
      message: 'un-authorized access'
    });
  }
  notFound() {
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
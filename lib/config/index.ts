import { QuotiAuth } from 'quoti-auth';

class Config {
  public quotiAuth: QuotiAuth;

  public setup(quotiAuth: QuotiAuth) {
    this.quotiAuth = quotiAuth;
  }
}

export = new Config();

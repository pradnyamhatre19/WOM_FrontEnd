import { ApplicationPipeModule } from './application-pipe.module';

describe('ApplicationPipeModule', () => {
  let applicationPipeModule: ApplicationPipeModule;

  beforeEach(() => {
    applicationPipeModule = new ApplicationPipeModule();
  });

  it('should create an instance', () => {
    expect(applicationPipeModule).toBeTruthy();
  });
});

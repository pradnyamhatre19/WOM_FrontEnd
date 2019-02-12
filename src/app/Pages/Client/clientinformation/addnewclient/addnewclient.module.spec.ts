import { AddnewclientModule } from './addnewclient.module';

describe('AddnewclientModule', () => {
  let addnewclientModule: AddnewclientModule;

  beforeEach(() => {
    addnewclientModule = new AddnewclientModule();
  });

  it('should create an instance', () => {
    expect(addnewclientModule).toBeTruthy();
  });
});

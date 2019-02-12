import { BoqModule } from './boq.module';

describe('BoqModule', () => {
  let boqModule: BoqModule;

  beforeEach(() => {
    boqModule = new BoqModule();
  });

  it('should create an instance', () => {
    expect(boqModule).toBeTruthy();
  });
});

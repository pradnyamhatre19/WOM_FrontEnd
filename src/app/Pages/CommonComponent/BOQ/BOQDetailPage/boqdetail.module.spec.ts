import { BOQDetailModule } from './boqdetail.module';

describe('BOQDetailModule', () => {
  let bOQDetailModule: BOQDetailModule;

  beforeEach(() => {
    bOQDetailModule = new BOQDetailModule();
  });

  it('should create an instance', () => {
    expect(bOQDetailModule).toBeTruthy();
  });
});

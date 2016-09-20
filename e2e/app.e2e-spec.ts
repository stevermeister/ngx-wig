import { Ng2wigPage } from './app.po';

describe('ng2wig App', function() {
  let page: Ng2wigPage;

  beforeEach(() => {
    page = new Ng2wigPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

import { NgxWigToolbarService } from './ngx-wig-toolbar.service';

describe('NgxWigToolbarService', () => {
  let service: NgxWigToolbarService;

  beforeEach(() => { service = new NgxWigToolbarService(); });

  it('should set buttons', () => {
    service.setButtons(['list1', 'list2']);
    expect(service.getToolbarButtons()).toEqual([
      {
        title: 'Unordered List',
        command: 'insertunorderedlist',
        styleClass: 'list-ul'
      },
      {
        title: 'Ordered List',
        command: 'insertorderedlist',
        styleClass: 'list-ol'
      }
    ]);
  });

  describe('addStandardButton', () => {
    it('should throw an error if name/title/command is not provided', () => {
      let errorMsg = 'Arguments "name", "title" and "command" are required';
      expect(() => service.addStandardButton('', '', '', '')).toThrow(errorMsg);
      expect(() => service.addStandardButton('button1', '', '', '')).toThrow(errorMsg);
      expect(() => service.addStandardButton('button1', 'My button', '', '')).toThrow(errorMsg);
    });

    it('should add a standard button', () => {
      service.addStandardButton('button1', 'My button', 'fakeCmd()', 'fakeStyle');
      expect(service.getToolbarButtons()[5]).toEqual(
        {
          title: 'My button',
          command: 'fakeCmd()',
          styleClass: 'fakeStyle'
        }
      );
    });
  });

  describe('addCustomButton', () => {
    it('should throw an error if name/plugin is not provided', () => {
      let errorMsg = 'Arguments "name" and "pluginName" are required';
      expect(() => { service.addCustomButton('', '') }).toThrow(errorMsg);
      expect(() => { service.addCustomButton('button1', '') }).toThrow(errorMsg);
    });

    it('should add a custom button', () => {
      service.addCustomButton('button1', 'my-button');
      expect(service.getToolbarButtons()[5]).toEqual(
        {
          pluginName: 'my-button',
          isComplex: true
        }
      );
    });
  });

  describe('getToolbarButtons', () => {
    it('should throw an error if provided buttons have not been added first', () => {
      expect(() => {
          service.getToolbarButtons('button1')
      }).toThrow('There is no "button1" in your library. Possible variants: list1,list2,bold,italic,link');
    });

    it('should return 8 buttons by default', () => {
      expect(service.getToolbarButtons().length).toEqual(5);
    });

    it('should return 1 button', () => {
      service.addCustomButton('button1', 'my-button');

      expect(service.getToolbarButtons('button1').length).toEqual(1);
    });
  });
});

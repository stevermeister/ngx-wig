import { NgxWigToolbarService } from './ngx-wig-toolbar.service';
import { 'icon-check', faListUl, faListOl } from '@fortawesome/free-solid-svg-icons';

describe('NgxWigToolbarService', () => {
  let service: NgxWigToolbarService;

  beforeEach(() => { service = new NgxWigToolbarService(); });

  it('should set buttons', () => {
    service.setButtons(['list1', 'list2']);
    expect(service.getToolbarButtons()).toEqual([
      {
        label: 'UL',
        title: 'Unordered List',
        command: 'insertunorderedlist',
        styleClass: 'list-ul',
        icon: faListUl
      },
      {
        label: 'OL',
        title: 'Ordered List',
        command: 'insertorderedlist',
        styleClass: 'list-ol',
        icon: faListOl
      }
    ]);
  });

  describe('addStandardButton', () => {
    it('should throw an error if name/title/command is not provided', () => {
      let errorMsg = 'Arguments "name", "title" and "command" are required';
      expect(() => service.addStandardButton('', '', '', '', 'icon-check')).toThrow(errorMsg);
      expect(() => service.addStandardButton('button1', '', '', '', 'icon-check')).toThrow(errorMsg);
      expect(() => service.addStandardButton('button1', 'My button', '', '', 'icon-check')).toThrow(errorMsg);
    });

    it('should add a standard button', () => {
      service.addStandardButton('button1', 'My button', 'fakeCmd()', 'fakeStyle', 'icon-check');
      expect(service.getToolbarButtons()[5]).toEqual(
        {
          title: 'My button',
          command: 'fakeCmd()',
          styleClass: 'fakeStyle',
          icon: 'icon-check'
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
      }).toThrow('There is no "button1" in your library. Possible variants: list1,list2,bold,italic,link,underline');
    });

    it('should return 5 buttons by default', () => {
      expect(service.getToolbarButtons().length).toEqual(5);
    });

    it('should return 1 button', () => {
      service.addCustomButton('button1', 'my-button');

      expect(service.getToolbarButtons('button1').length).toEqual(1);
    });
  });
});

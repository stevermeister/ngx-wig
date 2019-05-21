import { NgxWigToolbarService } from './ngx-wig-toolbar.service';
import { DEFAULT_LIBRARY_BUTTONS } from './config';

describe('NgxWigToolbarService', () => {
  let service: NgxWigToolbarService;

  beforeEach(() => { service = new NgxWigToolbarService([DEFAULT_LIBRARY_BUTTONS]); });

  it('should set buttons', () => {
    service.setButtons(['list1', 'list2']);
    expect(service.getToolbarButtons()).toEqual([
      {
        label: 'UL',
        title: 'Unordered List',
        command: 'insertunorderedlist',
        styleClass: 'list-ul',
        icon: 'icon-list-ul'
      },
      {
        label: 'OL',
        title: 'Ordered List',
        command: 'insertorderedlist',
        styleClass: 'list-ol',
        icon: 'icon-list-ol'
      }
    ]);
  });

  describe('addStandardButton', () => {
    it('should throw an error if name/title/command is not provided', () => {
      const errorMsg = 'Arguments "name", "title" and "command" are required';
      expect(() => service.addStandardButton('', '', '', '', 'icon-check')).toThrow(new Error(errorMsg));
      expect(() => service.addStandardButton('button1', '', '', '', 'icon-check')).toThrow(new Error(errorMsg));
      expect(() => service.addStandardButton('button1', 'My button', '', '', 'icon-check')).toThrow(new Error(errorMsg));
    });

    it('should add a standard button', () => {
      service.addStandardButton('button1', 'My button', 'fakeCmd()', 'fakeStyle', 'icon-check');
      expect(service.getToolbarButtons()[6]).toEqual(
        {
          title: 'My button',
          command: 'fakeCmd()',
          styleClass: 'fakeStyle',
          icon: 'icon-check'
        }
      );
    });
  });

  describe('getToolbarButtons', () => {
    it('should throw an error if provided buttons have not been added first', () => {
      expect(() => {
          service.getToolbarButtons('button1');
      }).toThrow(new Error('There is no "button1" in your library. Possible variants: list1,list2,bold,italic,link,underline'));
    });

    it('should return 6 buttons by default', () => {
      expect(service.getToolbarButtons().length).toEqual(6);
    });
  });
});

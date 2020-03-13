import { Toaster, Position, Intent } from '@blueprintjs/core';

const toaster = Toaster.create({
  className: 'recipe-toaster',
  position: Position.BOTTOM_RIGHT,
});

export default {
  success(message: string) {
    toaster.show({ message, intent: Intent.SUCCESS });
  },
  error(message: string) {
    toaster.show({ message, intent: Intent.DANGER });
  },
};

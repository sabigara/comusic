import { Toaster, Position, Intent } from '@blueprintjs/core';

const toaster = Toaster.create({
  className: 'recipe-toaster',
  position: Position.TOP,
});

export default {
  showErr(message: string) {
    toaster.show({ message, intent: Intent.DANGER });
  },
};

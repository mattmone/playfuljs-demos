export function pointerTracker(element, callback, container = document.body) {
  let trackerTarget;
  element.addEventListener(
    'pointerdown',
    event => {
      event.stopPropagation();
      const callerId = event.pointerId;
      trackerTarget = event.target;
      callback({
        currentTarget: trackerTarget,
        target: trackerTarget,
        detail: {
          state: 'start',
          x: event.x,
          y: event.y,
        },
      });
      const pointerMove = event => {
        // we make a pointerMove generic up here so we can successfully `removeEventListener`
        event.stopPropagation();
        if (event.pointerId !== callerId) return;
        callback({
          currentTarget: trackerTarget,
          target: trackerTarget,
          detail: {
            state: 'moving',
            x: event.x,
            y: event.y,
          },
        });
      };
      container.addEventListener(
        'pointerup',
        event => {
          // we have to move to the container element so we don't stop moving if we move faster than the draggable item can keep up with us
          event.stopPropagation();
          if (event.pointerId !== callerId) return;
          container.removeEventListener('pointermove', pointerMove);
          callback({
            currentTarget: trackerTarget,
            target: trackerTarget,
            detail: {
              state: 'end',
              x: event.x,
              y: event.y,
            },
          });
        },
        { once: true },
      ); // we only do this once since it will re-add on next `pointerdown`
      container.addEventListener('pointermove', pointerMove, { passive: true });
    },
    { passive: true },
  );
}

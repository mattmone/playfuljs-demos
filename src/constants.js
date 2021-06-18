export const CIRCLE = Math.PI * 2;
export const MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

export const TEXTURE = {
  WALL: 1,
  STAIRS: {
    IN: {
      NORTH: 2,
      EAST: 3,
      SOUTH: 4,
      WEST: 5,
    },
    OUT: {
      NORTH: 6,
      EAST: 7,
      SOUTH: 8,
      WEST: 9,
    },
  },
};

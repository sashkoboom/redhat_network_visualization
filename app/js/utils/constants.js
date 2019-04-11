/**
 * Created by sashkoboom on 12. 3. 2018.
 */

// w h of render plane
export const WIDTH = window.innerWidth * 0.9;

export const HEIGHT = window.innerHeight * 0.8;

export const INTERFACE_BOX = {
  width: 140,
  height: 100,
}

// namespace box
export const NS_BOX = {
  padding: {
    left: 0,
    right: 0,
    top: 5,
    bottom: 0,
    between: 20,
  },
  width_factor: 150,
  text: {
    padding: {
      left: 30,
      right: 0,
      top: 15,
      bottom: 0,
    },
  },
};

NS_BOX.height = HEIGHT - 2 * NS_BOX.padding.top;


export const NS_CLASS_PADDING = 'namespace';

export const NS_TEXT_PADDING_TOP = 15;
export const NS_TEXT_PADDING_LEFT = 30;

export const STROKE_COLOR = 'black';
export const HIGHLIGHT_STROKE_COLOR = 'blue';

export const STROKE_WIDTH = 3;
export const HIGHLIGHT_STROKE_WIDTH = 5;

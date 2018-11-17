/**
 * Created by sashkoboom on 12. 3. 2018.
 */

//w h of render plane
const WIDTH = window.innerWidth * 0.9;
const HEIGHT = window.innerHeight * 0.8;


//namespace box
const NS_BOX = {
    "padding" : {
        "left" : 30,
        "right" : 0,
        "top" : 5,
        "bottom" : 0,
        "between" : 20
    },
    "height_factor" : 100,
    "text" : {
        "padding" : {
            "left" : 30,
            "right" : 0,
            "top" : 15,
            "bottom" : 0
        }
    }
};

NS_BOX.width = WIDTH - 2 * NS_BOX.padding.left;

const NS_CLASS_PADDING = "namespace";


const NS_TEXT_PADDING_TOP = 15;
const NS_TEXT_PADDING_LEFT = 30;

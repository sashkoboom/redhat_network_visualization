/**
 * Created by sashkoboom on 12. 3. 2018.
 */

//w h of svg plane
const WIDTH = 1800;
const HEIGHT = 800;


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

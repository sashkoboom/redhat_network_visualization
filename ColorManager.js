/**
 * Created by sashkoboom on 5. 3. 2018.
 */
/*Tool to generate color scheme for future graph*/

const ColorManager = class{

    constructor(namespaces = []){

        //generate colors for each namespace
        this.colors = {};
        //make new arr, fill it with indexes 0...namespace.length a than with interpolated indexes, mix it randomly
        let arr = [...Array(namespaces.length).keys()]
            .map(x => x * 360 / namespaces.length)
            .map(x => `hsl(${x}, 60%, 89%)`);
        shuffleArray(arr);

        //generate object {namespace : color}
        for(const namespace of namespaces){
            this.colors[namespace] = arr[namespaces.indexOf(namespace)];
        }

        //make list of CSS classnames corresponding namespace names
        this.classNames = {};
        for(const namespace of namespaces){
            const cropped = namespace.replace("/", "");
            this.classNames[namespace] =  cropped === "" ? "main_ns" : cropped;
        }

        //Make a stylesheet for further color manipulation
        let sheet = document.createElement('style');
        for(const namespace of Object.keys(this.colors)){
            sheet.innerHTML += `.${this.classNames[namespace]}{
            background-color : ${this.colors[namespace]} ;
            fill : ${this.colors[namespace]}
            
            }\n`
        }
        console.log(sheet);
        document.body.appendChild(sheet);

    }


    getColor(str){
        return this.colors[str];
    }

    getClassName (str){
        return this.classNames[str]
            ;}
};


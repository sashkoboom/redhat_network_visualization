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
        (namespaces).forEach(
            (namespace) => this.colors[namespace] = arr[namespaces.indexOf(namespace)]
        );
        //make list of CSS classnames corresponding namespace names
        this.classNames = {};
        (namespaces).forEach(namespace => {
            const cropped = namespace.replace("/", "");
            this.classNames[namespace] =  cropped === "" ? "main_ns" : cropped;
        });
        //make a stylesheet for further color manipulation
        const sheet = document.createElement('style');
        Object.keys(this.colors).forEach((namespace) =>{
            sheet.innerHTML += `.${this.classNames[namespace]}{
            background-color : ${this.colors[namespace]} ;
            fill : ${this.colors[namespace]}}\n`
        });
        console.log(sheet);
        document.body.appendChild(sheet);
    }


    getColor(str){
        return this.colors[str];
    }

    getClassName (str){return this.classNames[str];}
};


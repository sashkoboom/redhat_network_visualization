/* eslint-disable */
export function flatten(input) {
    const stack = [...input];
    const res = [];
  while (stack.length) {
        const next = stack.pop();
        if (Array.isArray(next)) {
            stack.push(...next);
        } else {
            res.push(next);
        }
    }
    return res;
}

export function validSelectorFromString(str){
    return  btoa(unescape(encodeURIComponent(str))).replace("/", "_1").replace("==", "_2").replace("+", "_3").replace("=", "_4")

}


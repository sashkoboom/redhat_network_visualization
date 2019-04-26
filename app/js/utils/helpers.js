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


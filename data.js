// export // <-- uncomment for ES modules
// module.exports = // <-- uncomment for CommonJS modules
function DataClass(name, { props, prototype }) {
    prototype.__storage__ ??= new Map();
    let valclass = changeName(name, function() {
        let args, newtarget, myprops;

        args = [...arguments];

        newtarget = args[0]; args.shift();
        if(!newtarget) return new valclass.meta(...args);

        myprops = [];
        for (let prop in prototype) {
            if (props[prop]) {
                myprops.push(prop);
                this[prop] = props[prop](args[0]);
                args.shift();
            }
        }

        let oldmap = null, curmap = prototype.__storage__, tail = myprops.pop();
        for (let myprop of myprops) {
            oldmap = curmap;
            if (curmap.has(this[myprop]))
                curmap = curmap.get(this[myprop]);
            else
                curmap = curmap.set(this[myprop], new Map()).get(this[myprop]);
        }
        if (curmap.has(this[tail])) return curmap.get(this[tail]).deref();
        else curmap.set(this[tail], new WeakRef(this));
        
        Object.freeze(this);
    });
    valclass.prototype = prototype;
    valclass.meta = valclass;
    return valclass;
}
function changeName(name, func) {
    return (new Function("f", "return function " + name + "() {return f.call(this, new.target, ...arguments)}"))(func);
}


// ooga booga mooga

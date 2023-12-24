'use strict'

//A promise is es6 way of handling async code
// a wrap is a wrapper function to make some change
// a generator is a special js function that can be paused and continues it yield a next a value rather then running
const promiseWrapGenerator = require('co').wrap;

//Memoize  as an optimization for caching a functions results.
//if a small set of parameters are used and computation is a proper strict function of inputs only then this is great
const memoize = require('lodash.memoize')


function isPromise(obj) {
    return obj && obj.then && typeof obj.then === 'function'
}

/**
 *
 * @returns {function(*): {toInstance: function(*): void, toFactory: function(*): void, toConstructor: function(*): void}}
 */
function pluto() {
    const namesToResolvers = new Map()

    function createInstanceResolver(instance) {
        return function () {
            return Promise.resolve(instance)
        }
    }

    function getArgumentNames(func) {
        const funStr = func.toString()
        const argumentNames = funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).match(/([^\s,]+)/g)

        // the above can return `null` when there are no argumentNames
        return argumentNames || []
    }

    function createFactoryResolver(factory) {
        return promiseWrapGenerator(function* () {
            if (isPromise(factory)) {
                factory = yield factory
            }

            const argumentNames = getArgumentNames(factory)
            const args = yield getAll(argumentNames)
            return factory.apply(factory, args)
        })
    }

    function createConstructorResolver(Constructor) {
        return promiseWrapGenerator(function* () {
            if (isPromise(Constructor)) {
                Constructor = yield Constructor
            }
            const argumentNames = getArgumentNames(Constructor)
            const args = yield getAll(argumentNames)

            // For future reference,
            //   this can be done with the spread operator in Node versions >= v5. e.g.,
            //
            //   return new Constructor(...args)
            //
            // For now, this workaround is a good middle ground.

            // eslint-disable-next-line
            return new(Constructor.bind.apply(Constructor, [null].concat(args)))
        })
    }

    const get = memoize((name) => {
        return new Promise((resolve, reject) => {
            const resolver = namesToResolvers.get(name)
            if (!resolver) {
                reject(new Error(`nothing is mapped for name '${name}'`))
            }
            resolve(resolver())
        })
    })

    function getAll(names) {
        const promises = names.map(function (name) {
            return get(name)
        })
        return Promise.all(promises)
    }

    function bootstrap() {
        const result = new Map()
        bind('plutoApp').toInstance(result)
        const promises = []
        for (let name of namesToResolvers.keys()) {
            promises.push(get(name).then((value) => {
                result.set(name, value)
            }))
        }
        return Promise.all(promises).then(() => {
            return result
        })
    }

  /*  function bind(name) {
        function validateBinding(target) {
            if (namesToResolvers.has(name)) {
                throw Error(`module already contains a mapping with the name '${name}'`)
            }
            if (typeof target === 'undefined') {
                throw Error(`cannot bind '${name}' because the specified target is undefined.`)
            }
            if (target === null) {
                throw Error(`cannot bind '${name}' because the specified target is null.`)
            }
        }

        function validateTargetIsAFunctionOrPromise(factory) {
            if (typeof factory !== 'function' && !isPromise(factory)) {
                throw Error(`cannot bind '${name}' because the specified target is not a function or Promise.`)
            }
        }

        return {
            toInstance: function (instance) {
                validateBinding(instance)
                namesToResolvers.set(name, createInstanceResolver(instance))
            },
            toFactory: function (factory) {
                validateBinding(factory)
                validateTargetIsAFunctionOrPromise(factory)
                namesToResolvers.set(name, createFactoryResolver(factory))
            },
            toConstructor: function (constructor) {
                validateBinding(constructor)
                validateTargetIsAFunctionOrPromise(constructor)
                namesToResolvers.set(name, createConstructorResolver(constructor))
            }
        }
    }
*/

    /**
     * Creates a binder object that is used to define bindings between names and objects in the Pluto IoC container.
     *
     * @param {string} name - The name to which the binding will be associated.
     * @returns {Binder} A binder object with methods for specifying binding types and target objects.
     * @throws {Error} If a mapping with the same name already exists in the container.
     * @throws {Error} If the specified target is undefined or null during binding.
     * @throws {Error} If the specified target is not a function or a Promise during binding.
     * @example
     *
     * const binder = bind('serviceName');
     * binder.toInstance(instance); // Bind the name to a specific instance.
     * binder.toFactory(factoryFunction); // Bind the name to a factory function.
     * binder.toConstructor(ConstructorClass); // Bind the name to a constructor function.
     */
    function bind(name) {
        /**
         * Validates the binding process by checking for conflicts and target validity.
         *
         * @private
         * @param {*} target - The target object being bound.
         * @throws {Error} If a mapping with the same name already exists in the container.
         * @throws {Error} If the specified target is undefined or null during binding.
         */
        function validateBinding(target) {
            if (namesToResolvers.has(name)) {
                throw new Error(`A mapping with the name '${name}' already exists.`);
            }
            if (typeof target === 'undefined') {
                throw new Error(`Cannot bind '${name}' because the specified target is undefined.`);
            }
            if (target === null) {
                throw new Error(`Cannot bind '${name}' because the specified target is null.`);
            }
        }

        /**
         * Validates that the target is a function or a Promise, which are acceptable binding types.
         *
         * @private
         * @param {*} target - The target object being bound.
         * @throws {Error} If the specified target is not a function or a Promise.
         */
        function validateTargetIsAFunctionOrPromise(target) {
            if (typeof target !== 'function' && !isPromise(target)) {
                throw new Error(`Cannot bind '${name}' because the specified target is not a function or Promise.`);
            }
        }

        return {
            /**
             * Binds the name to a specific instance, ensuring the same instance is returned upon resolution.
             *
             * @function
             * @param {*} instance - The instance to bind to the name.
             * @throws {Error} If validation conditions are not met.
             */
            toInstance: function (instance) {
                validateBinding(instance);
                namesToResolvers.set(name, createInstanceResolver(instance));
            },
            /**
             * Binds the name to a factory function or a Promise that resolves to a factory function.
             * The factory is used to create the object when the name is resolved.
             *
             * @function
             * @param {function|Promise<function>} factory - The factory function or a Promise that resolves to a factory function.
             * @throws {Error} If validation conditions are not met.
             */
            toFactory: function (factory) {
                validateBinding(factory);
                validateTargetIsAFunctionOrPromise(factory);
                namesToResolvers.set(name, createFactoryResolver(factory));
            },
            /**
             * Binds the name to a constructor function or a Promise that resolves to a constructor function.
             * The constructor is used to create new instances of the object when the name is resolved.
             *
             * @function
             * @param {function|Promise<function>} constructor - The constructor function or a Promise that resolves to a constructor function.
             * @throws {Error} If validation conditions are not met.
             */
            toConstructor: function (constructor) {
                validateBinding(constructor);
                validateTargetIsAFunctionOrPromise(constructor);
                namesToResolvers.set(name, createConstructorResolver(constructor));
            },
        };
    }





    //actualy get an dependancy
    bind.get = get
    //get all loded dependancies
    bind.getAll = getAll
    //
    bind.bootstrap = bootstrap

    bind('plutoBinder').toInstance(bind)

    return bind
}



module.exports = pluto


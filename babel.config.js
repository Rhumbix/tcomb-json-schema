module.exports = function(api) {
    const isTest = api.env("test")

    // Cache based on environment
    api.cache.using(() => process.env.NODE_ENV)

    const targets = isTest ? { node: "current" } : "last 2 versions, ie 11"

    const presets = [
        // Import core-js and regenerator-runtime in index.jsx to
        // auto-include required polyfills
        [
            "@babel/preset-env",
            {
                corejs: 3,
                modules: false,
                targets: targets,
                useBuiltIns: "entry"
            }
        ],
        // Support for TypeScript syntax
        "@babel/preset-typescript",
        // Support for React JSX
        "@babel/preset-react"
    ]

    const plugins = [
        // Stops us from bundling unused parts of lodash
        "lodash",
        // `async function*() { await 1; yield 2; }`
        "@babel/plugin-proposal-async-generator-functions",
        // `const { foo, ...rest } = { foo: 1, bar: 2, baz: 3 }`
        "@babel/plugin-proposal-object-rest-spread",
        // These are used to support "experimental" TypeScript syntax
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["@babel/plugin-proposal-class-properties", { loose: true }]
    ]

    if (isTest) {
        // Transpile modules to commonjs format
        plugins.push("@babel/plugin-transform-modules-commonjs")
        // Support dynamic import statements
        plugins.push("@babel/plugin-syntax-dynamic-import")
        plugins.push("dynamic-import-node")
    }

    return {
        presets,
        plugins
    }
}

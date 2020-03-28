const { FuseBox, CSSPlugin, HTMLPlugin, EnvPlugin, TerserPlugin, QuantumPlugin, WebIndexPlugin } = require("fuse-box");
const { src, task } = require("fuse-box/sparky");

let run = (production) => {
    const fuse = FuseBox.init({
        target: "browser@es6",
        homeDir: 'temp_src',
        output: 'dist/$name.js',
        runAllMatchedPlugins: true,
        plugins: [
            production && TerserPlugin(),
            //production && QuantumPlugin(),
            CSSPlugin(),
            EnvPlugin({
                devMode: !production
            }),
            HTMLPlugin(),
            WebIndexPlugin({
                template: './index.html'
            })
        ]
    });
    fuse.bundle("vendor")
        .cache(true)
        .instructions(`~ main.ts
        + fuse-box-css
        `);
    if (!production) {
        fuse.bundle("app")
            .instructions(" > [main.ts]")
            .hmr()
            .watch();
        fuse.dev();
    } else {
        fuse.bundle('app').instructions(" > [main.ts]")
    }
    fuse.run();
};

task('clean', async () => await src('dist/*').clean('dist').exec());
task("dev",     ['clean'], () => run(false));
task("prod",    ['clean'], () => run(true)); 

const { FuseBox, CSSPlugin, HTMLPlugin, EnvPlugin, TerserPlugin, QuantumPlugin, WebIndexPlugin } = require("fuse-box");
const { src, task } = require("fuse-box/sparky");

const gulp = require('gulp');
const replace = require('gulp-replace');
const au2 = require('@aurelia/plugin-gulp').default;
const chokidar = require('chokidar');
const temp = 'temp_src';

let run = (production) => {
    const fuse = FuseBox.init({
        target: "browser@es6",
        homeDir: temp,
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

function watchForChanges() {
    chokidar.watch('src').on('all', (event, path) => {
      console.log(event, path);
      gulp.src(path)
        .pipe(au2())
        .pipe(replace(/(import.*\s+from\s+['"].*)(\.html)(["'];)/g, "$1$2.js$3"))
        .pipe(gulp.dest(temp));
    });
}

task('clean', async () => await src('dist/*').clean('dist').exec());
task("dev",     ['clean'], () => {
    watchForChanges();
    run(false);
});
task("prod",    ['clean'], () => run(true)); 

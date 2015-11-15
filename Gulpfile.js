var gulp = require('gulp'),
    spawn = require('child_process').spawn,
    node;

/**
 * $ gulp serve:prod
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', function() {
    if (node) node.kill()
    node = spawn('node', ['src/dev.index.js'], {stdio: 'inherit'})
    node.on('close', function (code) {
        if (code === 8) {
            console.log('Error detected, waiting for changes...');
        }
    });
});

/**
 * $ gulp serve:dev
 * description: start the development environment
 */
gulp.task('serve', function() {
    gulp.run('server');

    gulp.watch(['src/**/*'], function() {
        gulp.run('server');
    });
});

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node){
        node.kill();
    }
});

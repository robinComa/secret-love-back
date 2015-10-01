var gulp = require('gulp'),
    spawn = require('child_process').spawn,
    node;

/**
 * $ gulp serve:prod
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('serve:prod', function() {
    if (node) node.kill()
    node = spawn('node', ['src/index.js'], {stdio: 'inherit'})
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
gulp.task('serve:dev', function() {
    gulp.run('serve:prod');

    gulp.watch(['src/**/*'], function() {
        gulp.run('serve:prod');
    });
});

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node){
        node.kill();
    }
});
module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    zip: {
      'build': {
        src: ["*.html","css/*.*","js/*.js","js/libs/*.js","icon.png","package.json"],
        dest: 'build/<%= pkg.name %>_v<%= pkg.version %>.fma'
      }
    },
    clean:{
      current_version:{
        src:'build/<%= pkg.name %>_v<%= pkg.version %>.fma'
        },
      all:{
        src:'build'
        }
      },
  });
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-zip');
  grunt.registerTask('clean',function(arg){
    grunt.file.delete(grunt.config('clean.current_version.src'));
  });
  grunt.registerTask('clean_all',function(arg){
    grunt.file.delete(grunt.config('clean.all.src'));
  });
  grunt.registerTask('build', ['clean','zip']);
};

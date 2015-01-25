module.exports = function(grunt) {

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	var BUILD_DIR = '.';

	// 1. All configuration goes here
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		tag: {
			banner: '/*!\n' +
			' * <%= pkg.name %>\n' +
			' * @version <%= pkg.version %>\n' +
			' */\n'
		},

		express: {
			all: {
				options: {
					bases: [BUILD_DIR],
					port: 3000,
					hostname: "0.0.0.0",
					livereload: true
				}
			}
		},

		svgmin: { //minimize SVG files
			options: {
				plugins: [
				{ removeViewBox: false },
				{ removeUselessStrokeAndFill: false }
				]
			},
			dist: {
				expand: true,
				cwd: 'img',
				src: ['*.svg'],
				dest: 'img',
				ext: '.svg'
			}
		},

		svgstore: {
			options: {
				/*
				prefix all icons with an unambiguous label
				*/
				prefix : 'shape-',
				/* 
				cleans fill, stroke, stroke-width attributes 
				so that we can style them from CSS
				*/
				cleanup: true,
			},
			default : {
				files: {
					'img/svg-defs.svg': ['img/svgs/*.svg'],
				}
			}
		},

		// Sass task
		sass: {

			// Sass development options
			dev: {
				options: {
					style: 'expanded',
					compass: true,
					banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n',
				},
				files: {
					'css/styles.css': 'Sass/styles.scss'
				}
			},

			// Sass distribution options
			dist: {
				options: {
					style: 'compressed',
					compass: true,
					banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n',
				},
				files: {
					'css/build/styles.css': 'Sass/styles.scss'
				}
			}
		},

		css: {
			files: ['Sass/*.scss'],
			tasks: ['sass'],
			options: {
				spawn: false,
			}
		},

		concat: {
			options: {
				banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
			},
			dist: {
				//ensures all js files are compiled and scripts is last. Very important.
				src: ['js/jquery-ui.js', 'js/owl.carousel.js', 'js/*.js', '!js/scripts.js', 'js/scripts.js'],
				dest: 'js/build/site.js',
			}
		},

		uglify: {
			options: {
				banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
			},
			build: {
				src: 'js/build/site.js',
				dest: 'js/build/site.min.js'
			}
		},

		// Watch files
		watch: {

			all: {
				files: '**/*.html',
				options: {
					livereload: true
				}
			},

			// Watch .scss files
			sass: {
				files: ['Sass/**/*.scss'],
				tasks: ['sass:dev'],
			},

			js: {
				files: ['**/scripts.js'],
				tasks: ['concat','uglify']
			},

			// Live reload files
			livereload: {
				options: { livereload: true },
				files: [
				'css/**/*.css',
				'**/*.html',
				]
			}
		},

		open: {
			all: {
				// Gets the port from the connect configuration
				path: 'http://localhost:<%= express.all.options.port%>'
			}
		}

	});

	grunt.registerTask('default', ['concat', 'uglify']);

	grunt.registerTask('dev', [
	'sass:dev',
	'express',
	'open',
	'watch'
	]);

	grunt.registerTask('svg', [
	'svgstore'
	]);

	grunt.registerTask('dist', [
	'sass:dist'
	]);

};

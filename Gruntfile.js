module.exports = function(grunt) {

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

		tag: {
		  banner: '/*!\n' +
		          ' * <%= pkg.name %>\n' +
		          ' * @version <%= pkg.version %>\n' +
		          ' */\n'
		},

		// Sass task
		sass: {

		  // Sass development options
		  dev: {
		    options: {
		      style: 'expanded',
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
		        src: [
		            'js/*.js', // All JS in the libs folder
		            'js/scripts.js'  // This specific file
		        ],
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

		  // Watch .scss files
		  sass: {
		    files: ['Sass/**/*.scss'],
		    tasks: ['sass:dev'],
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

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    // grunt.loadNpmTasks('grunt-contrib-concat');
    // grunt.loadNpmTasks('grunt-contrib-uglify');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify']);

    // Create Default Task
	grunt.registerTask('dev', [
	  'sass:dev', // Compile Sass with dev settings
	  'watch'
	]);

	// Create Distribution Task
	grunt.registerTask('dist', [
	  'sass:dist' // Compile Sass with distribution settings
	]);

};

/*
 * Copyright (c) 2013-2016, The SeedStack authors <http://seedstack.org>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* global module: false, grunt: false, process: false */
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: [
            'node_modules/**',
            'docs/**',
            'dist/**',
            'coverage/**'
        ],
        jshint: {
            extra: {
                src: ['modules/**/*.js']
            }
        },
        karma: {
            test: {
                configFile: 'karma.conf.js',
                singleRun: true
            },
            watch: {
                configFile: 'karma.conf.js',
                autoWatch: true
            }
        },
        coveralls: {
            src: ['coverage/lcov.info'],
            options: {
                force: true
            }
        },
        ngdocs: {
            extras: {
                src: ['modules/**/*.js', 'index.ngdoc'],
                title: 'Core',
                api: true
            }
        },
        connect: {
            docs: {
                options: {
                    port: 9000,
                    base: 'docs',
                    keepalive: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('docs', ['ngdocs', 'connect:docs']);

    grunt.registerTask('default', ['jshint', 'karma:test', 'coveralls', 'ngdocs']);
};

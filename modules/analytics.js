/*
 * Copyright (c) 2013-2016, The SeedStack authors <http://seedstack.org>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

define([
    'module',
    'require',
    '{angular}/angular',
    '{angulartics}/angulartics.min'
], function (module, require, angular) {
    'use strict';

    var config = module && module.config() || {};

    var availableProviders = {
        adobe:          { suffix: 'adobe.analytics' },
        chartbeat:      { suffix: 'chartbeat' },
        flurry:         { suffix: 'flurry' },
        ga:             { suffix: 'google.analytics' },
        'ga-cordova':   { suffix: 'google.analytics.cordova' },
        gtm:            { suffix: 'google.tagmanager' },
        kissmetrics:    { suffix: 'kissmetrics' },
        mixpanel:       { suffix: 'mixpanel' },
        piwik:          { suffix: 'piwik', settings: config.settings },
        segmentio:      { suffix: 'segment.io' },
        splunk:         { suffix: 'splunk' },
        woopra:         { suffix: 'woopra' }
    };

    var configuredProvider = availableProviders[config.provider];

    if (!configuredProvider) {
        throw new Error ('Analytic provider \'' + config.provider + '\' not found. Check the available list of providers ' +
                         'and set it using the \'provider\' property in the analytic module configuration.');
    } else {
        if(config.provider === "piwik"){
            require(['{angulartics-piwik}/angulartics-piwik.min']);
        }else{
            require(['{angulartics}/angulartics-' + config.provider+'.min']);
        }
        

        if (configuredProvider.settings) {

            require(['{w20-extra}/modules/providers/' + config.provider + '-config'], function(provider) {

                var $injector = angular.injector(provider.angularModules, true);

                $injector.invoke([provider.service, function (providerService) {
                    if (providerService.configure) {
                        providerService.configure(configuredProvider.settings);
                    } else {
                        throw new Error('Analytic provider service must implement a \'configure\' method');
                    }
                }]);
            });
        }

        var W20ExtraAnalytics = angular.module('W20ExtraAnalytics', ['angulartics', 'angulartics.'.concat(configuredProvider.suffix)]);
        console.info('Analytic provider: ' + config.provider);

        W20ExtraAnalytics.config(['$analyticsProvider', function ($analyticsProvider) {
            /* Enable/disable track all views */
            $analyticsProvider.virtualPageviews(config.virtualPageViews || true);
        }]);

        return {
            angularModules: [ 'W20ExtraAnalytics' ]
        };
    }
});



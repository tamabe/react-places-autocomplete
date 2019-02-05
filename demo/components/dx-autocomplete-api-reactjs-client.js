/*jshint esversion: 6 */
/*global fetch, btoa */
import Q from 'q';

/**
 * Service for autocompleting places using Google Autocomplete API
 * @class AutocompleteService
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
let AutocompleteService = (function() {
    'use strict';

    function AutocompleteService(options) {
        let domain = (typeof options === 'object') ? options.domain : options;
        this.domain = domain ? domain : '';
        if (this.domain.length === 0) {
            throw new Error('Domain parameter must be specified as a string.');
        }
    }

    function serializeQueryParams(parameters) {
        let str = [];
        for (let p in parameters) {
            if (parameters.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(parameters[p]));
            }
        }
        return str.join('&');
    }

    function mergeQueryParams(parameters, queryParameters) {
        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    let parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }
        return queryParameters;
    }

    /**
     * HTTP Request
     * @method
     * @name AutocompleteService#request
     * @param {string} method - http method
     * @param {string} url - url to do request
     * @param {object} parameters
     * @param {object} body - body parameters / object
     * @param {object} headers - header parameters
     * @param {object} queryParameters - querystring parameters
     * @param {object} form - form data object
     * @param {object} deferred - promise object
     */
    AutocompleteService.prototype.request = function(method, url, parameters, body, headers, queryParameters, form, deferred) {
        const queryParams = queryParameters && Object.keys(queryParameters).length ? serializeQueryParams(queryParameters) : null;
        const urlWithParams = url + (queryParams ? '?' + queryParams : '');

        if (body && !Object.keys(body).length) {
            body = undefined;
        }

        fetch(urlWithParams, {
            method,
            headers,
            body: JSON.stringify(body)
        }).then((response) => {
            return response.json();
        }).then((body) => {
            deferred.resolve(body);
        }).catch((error) => {
            deferred.reject(error);
        });
    };

    /**
     * Autocompletes places using Google Autocomplete API
     * @method
     * @name AutocompleteService#getDxCustomerAutocomplete
     * @param {object} parameters - method options and parameters
     * @param {array} parameters.components - A components filter with elements separated by a pipe (|). The components filter is required if the request doesn't include an address. Each element in the components filter consists of a component:value pair, and fully restricts the results from the geocoder
     * @param {string} parameters.input - The text string on which to search. The Place Autocomplete service will return candidate matches based on this string and order results based on their perceived relevance.
     * @param {string} parameters.language - The language code, indicating in which language the results should be returned, if possible.
     * @param {string} parameters.location - The point around which you wish to retrieve place information. Must be specified as latitude,longitude.
     * @param {number} parameters.offset - The position, in the input term, of the last character that the service uses to match predictions.
     * @param {number} parameters.radius - The distance (in meters) within which to return place results. Note that setting a radius biases results to the indicated area, but may not fully restrict results to the specified area.
     * @param {string} parameters.sessiontoken - A random string which identifies an autocomplete session for billing purposes. If this parameter is omitted from an autocomplete request, the request is billed independently.
     * @param {boolean} parameters.strictbounds - Returns only those places that are strictly within the region defined by location and radius.
     * @param {string} parameters.types - The types of place results to return.
     */
    AutocompleteService.prototype.getDxCustomerAutocomplete = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/dx-customer/autocomplete';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json'];

        if (parameters['components'] !== undefined) {
            queryParameters['components'] = parameters['components'];
        }

        if (parameters['input'] !== undefined) {
            queryParameters['input'] = parameters['input'];
        }

        if (parameters['input'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: input'));
            return deferred.promise;
        }

        if (parameters['language'] !== undefined) {
            queryParameters['language'] = parameters['language'];
        }

        if (parameters['location'] !== undefined) {
            queryParameters['location'] = parameters['location'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['radius'] !== undefined) {
            queryParameters['radius'] = parameters['radius'];
        }

        if (parameters['sessiontoken'] !== undefined) {
            queryParameters['sessiontoken'] = parameters['sessiontoken'];
        }

        if (parameters['strictbounds'] !== undefined) {
            queryParameters['strictbounds'] = parameters['strictbounds'];
        }

        if (parameters['types'] !== undefined) {
            queryParameters['types'] = parameters['types'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };

    return AutocompleteService;
})();

exports.AutocompleteService = AutocompleteService;

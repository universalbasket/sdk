(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@ubio/sdk'), require('form-serialize'), require('camelcase-keys'), require('lodash.kebabcase')) : typeof define === 'function' && define.amd ? define(['exports', '@ubio/sdk', 'form-serialize', 'camelcase-keys', 'lodash.kebabcase'], factory) : (global = global || self, factory(global['ubio-app-sdk'] = {}, global.sdk$1, global.formSerialize, global.camelCaseKeys, global.kebabCase));
})(this, function (exports, sdk$1, formSerialize, camelCaseKeys, kebabCase) {
  'use strict';

  formSerialize = formSerialize && formSerialize.hasOwnProperty('default') ? formSerialize['default'] : formSerialize;
  camelCaseKeys = camelCaseKeys && camelCaseKeys.hasOwnProperty('default') ? camelCaseKeys['default'] : camelCaseKeys;
  kebabCase = kebabCase && kebabCase.hasOwnProperty('default') ? kebabCase['default'] : kebabCase;
  const initialInputs = {
    url: 'https://pet.morethan.com/h5/pet/step-1?path=%2FquoteAndBuy.do%3Fe%3De1s1%26curPage%3DcaptureDetails'
  };
  const TYPES = ['input', 'output', 'cache'];

  function getAll() {
    const length = localStorage.length;
    const inputs = {};
    const outputs = {};
    const caches = {};

    for (let i = 0; i < length; i += 1) {
      const key = localStorage.key(i);

      if (key.startsWith('input.')) {
        const trimmed = key.replace('input.', '');
        const data = JSON.parse(localStorage.getItem(key));
        inputs[trimmed] = data;
      }

      if (key.startsWith('output.')) {
        const trimmed = key.replace('output.', '');
        const data = JSON.parse(localStorage.getItem(key));
        outputs[trimmed] = data;
      }

      if (key.startsWith('cache.')) {
        const trimmed = key.replace('cache.', '');
        const data = JSON.parse(localStorage.getItem(key));
        caches[trimmed] = data;
      }
    }

    return {
      inputs,
      outputs,
      caches
    };
  }

  function objectToArray(inputs) {
    const arr = Object.keys(inputs).map(key => {
      return {
        key,
        data: inputs[key]
      };
    });
    return arr;
  }

  function get(type, key) {
    if (!TYPES.includes(type)) {
      throw new Error(`InputOutput.get(): type must be one of ${TYPES.join(', ')}`);
    }

    const inputOrOutput = localStorage.getItem(`${type}.${key}`);

    if (!inputOrOutput) {
      return null;
    }

    return JSON.parse(inputOrOutput);
  }

  function set(type, key, data) {
    if (!TYPES.includes(type)) {
      throw new Error(`InputOutput.set(): type must be one of ${TYPES.join(', ')}`);
    }

    localStorage.setItem(`${type}.${key}`, JSON.stringify(data));
  }

  var InputOutput =
  /*#__PURE__*/
  Object.freeze({
    getAll: getAll,
    get: get,
    set: set,
    objectToArray: objectToArray
  });
  let jobId = localStorage.getItem('jobId') || null;
  let token = localStorage.getItem('token') || null;
  let serviceId = localStorage.getItem('serviceId') || null;

  class EndUserSdk {
    constructor() {
      this.sdk = null;
      this.initiated = false;
    }

    async create(fields = {}) {
      if (jobId && token && serviceId) {
        let previous;

        try {
          previous = sdk$1.createEndUserSdk({
            token,
            jobId,
            serviceId
          });
          await previous.cancelJob();
        } catch (err) {
          console.log('failed to cancel previous job. it will be abandoned');
        }
      }

      localStorage.clear();
      const newJob = await createJob(fields);
      jobId = newJob.jobId;
      token = newJob.token;
      serviceId = newJob.serviceId;
      localStorage.setItem('jobId', jobId);
      localStorage.setItem('token', token);
      localStorage.setItem('serviceId', serviceId);
      this.sdk = sdk$1.createEndUserSdk({
        token,
        jobId,
        serviceId
      });
      this.initiated = true;
    }

    async retrieve() {
      this.sdk = sdk$1.createEndUserSdk({
        token,
        jobId,
        serviceId
      });
      this.initiated = true;
    }

    async createJobInputs(inputs) {
      const pan = Object.keys(inputs).find(key => key === 'pan');

      if (pan) {
        const panToken = await this.sdk.vaultPan(inputs['pan']);
        inputs['panToken'] = panToken;
        delete inputs.pan;
      }

      const keys = Object.keys(inputs);
      const createInputs = keys.map(async key => {
        const data = inputs[key];
        await this.sdk.createJobInput(key, data);
        set('input', key, data);
      });
      await Promise.all(createInputs);
      return inputs;
    }

    async waitForJobOutput(outputKey, inputKey) {
      const outputs = await this.sdk.getJob(); // TODO: job

      const output = Array.isArray(outputs.data) && outputs.data.find(ou => ou.key === outputKey);

      if (output) {
        return output.data;
      }

      return await this.trackJobOutput(outputKey, inputKey);
    }

    async getCache({
      key: outputKey,
      sourceInputKeys
    }) {
      const sourceInputs = sourceInputKeys.map(key => {
        return {
          key,
          data: get('input', key)
        };
      });
      const {
        data: caches = null
      } = (await this.sdk.getPreviousJobOutputs(sourceInputs)) || {};
      const cache = caches && caches.find(c => c.key === outputKey) || null;
      return cache ? {
        key: cache.key,
        data: cache.data
      } : null;
    }

    async getDefaultCache(keys = []) {
      const {
        data: caches = null
      } = (await this.sdk.getPreviousJobOutputs([])) || {};
      return caches.filter(cache => keys.includes(cache.key)).map(cache => {
        return {
          key: cache.key,
          data: cache.data
        };
      });
    }

    trackJobOutput(outputKey, inputKey) {
      return new Promise((res, rej) => {
        let awaitingInputProcessing = false;
        let createdOutputProcessing = false;
        const stopTracking = this.sdk.trackJob((event, error) => {
          console.log(`event ${event}`);
          console.log(event);

          if (event === 'createOutput' && !createdOutputProcessing) {
            createdOutputProcessing = true;
            this.sdk.getJobOutputs().then(outputs => {
              outputs.data.forEach(output => {
                set('output', output.key, output.data);
              });
              const output = outputs.data.find(jo => jo.key === outputKey);

              if (output) {
                stopTracking();
                res(output.data);
              }

              createdOutputProcessing = false;
            });
          }

          if (event === 'awaitingInput' && !awaitingInputProcessing) {
            awaitingInputProcessing = true;
            this.sdk.getJob().then(job => {
              const {
                state,
                awaitingInputKey
              } = job;

              if (state === 'awaitingInput' && awaitingInputKey !== inputKey) {
                const error = {
                  name: 'jobExpectsDifferentInputKey',
                  details: {
                    state,
                    awaitingInputKey
                  }
                };
                stopTracking();
                rej(error);
              }

              awaitingInputProcessing = false;
            });
          }
        });
      });
    }

    async submitPan(pan) {
      const panToken = await this.sdk.vaultPan(pan);
      await this.createJobInputs({
        panToken
      });
    }

    trackJob(callback) {
      const stopTracking = this.sdk.trackJob((event, error) => {
        console.log(`event ${event}`);
        console.log(event);

        if (event) {
          callback(event, null);
        }

        if (error) {
          stopTracking();
          callback(null, error);
        }
      });
    }

    async getPreviousOutputs() {
      const {
        inputs
      } = getAll();
      return await this.sdk.getPreviousJobOutputs(inputs);
    }

    async getPreviousOutput(outputKey) {
      const {
        inputs
      } = getAll();
      const outputs = await this.sdk.getPreviousJobOutputs(inputs);
      return outputs.find(output => output.key = outputKey);
    }

  }

  async function createJob({
    input = {},
    category = 'test'
  }) {
    input = { ...initialInputs,
      ...input
    };
    const SERVER_URL = "https://ubio-application-bundle-dummy-server.glitch.me";
    const res = await fetch(`${SERVER_URL}/create-job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input,
        category
      }),
      mode: 'cors'
    });

    if (!res.ok) {
      throw new Error(`Unexpected status from server: ${res.status}`);
    }

    return await res.json();
  }

  const sdk = new EndUserSdk(); // The router code. Takes a URL, checks against the list of supported routes and then renders the corresponding content page.

  var Router = (routes, titles, notFoundTemplate, ProgressBarTemplate) => new Router$1(routes, titles, notFoundTemplate, ProgressBarTemplate);

  class Router$1 {
    constructor(routes, titles, notFoundTemplate, ProgressBarTemplate) {
      this.routes = routes;
      this.titles = titles;
      this.notFoundTemplate = notFoundTemplate;
      this.ProgressBarTemplate = ProgressBarTemplate;
    }

    navigate() {
      let request = parseRequestURL(); // Parse the URL and if it has an id part, change it with the string ":id"

      let parsedURL = (request.section ? '/' + request.section : '/') + (request.input ? '/' + request.input : ''); // Get the page from our hash of supported routes.
      // If the parsed URL is not in our list of supported routes, select the 404 page instead

      let route = this.routes[parsedURL] ? this.routes[parsedURL] : this.notFoundTemplate;
      route.render();
      this.ProgressBarTemplate(this.titles, route.step);
    }

  }

  function parseRequestURL() {
    let url = location.hash.slice(1).toLowerCase() || '/';
    let r = url.split("/");
    let request = {
      section: null,
      input: null
    };
    request.section = r[1];
    request.input = r[2];
    return request;
  }
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */


  const directives = new WeakMap();

  const isDirective = o => {
    return typeof o === 'function' && directives.has(o);
  };
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * True if the custom elements polyfill is in use.
   */


  const isCEPolyfill = window.customElements !== undefined && window.customElements.polyfillWrapFlushCallback !== undefined;
  /**
   * Removes nodes, starting from `startNode` (inclusive) to `endNode`
   * (exclusive), from `container`.
   */

  const removeNodes = (container, startNode, endNode = null) => {
    let node = startNode;

    while (node !== endNode) {
      const n = node.nextSibling;
      container.removeChild(node);
      node = n;
    }
  };
  /**
   * @license
   * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * A sentinel value that signals that a value was handled by a directive and
   * should not be written to the DOM.
   */


  const noChange = {};
  /**
   * A sentinel value that signals a NodePart to fully clear its content.
   */

  const nothing = {};
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * An expression marker with embedded unique key to avoid collision with
   * possible text in templates.
   */

  const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
  /**
   * An expression marker used text-positions, multi-binding attributes, and
   * attributes with markup-like text values.
   */

  const nodeMarker = `<!--${marker}-->`;
  const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
  /**
   * Suffix appended to all bound attribute names.
   */

  const boundAttributeSuffix = '$lit$';
  /**
   * An updateable Template that tracks the location of dynamic parts.
   */

  class Template {
    constructor(result, element) {
      this.parts = [];
      this.element = element;
      let index = -1;
      let partIndex = 0;
      const nodesToRemove = [];

      const _prepareTemplate = template => {
        const content = template.content; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
        // null

        const walker = document.createTreeWalker(content, 133
        /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
        , null, false); // Keeps track of the last index associated with a part. We try to delete
        // unnecessary nodes, but we never want to associate two different parts
        // to the same index. They must have a constant node between.

        let lastPartIndex = 0;

        while (walker.nextNode()) {
          index++;
          const node = walker.currentNode;

          if (node.nodeType === 1
          /* Node.ELEMENT_NODE */
          ) {
              if (node.hasAttributes()) {
                const attributes = node.attributes; // Per
                // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                // attributes are not guaranteed to be returned in document order.
                // In particular, Edge/IE can return them out of order, so we cannot
                // assume a correspondance between part index and attribute index.

                let count = 0;

                for (let i = 0; i < attributes.length; i++) {
                  if (attributes[i].value.indexOf(marker) >= 0) {
                    count++;
                  }
                }

                while (count-- > 0) {
                  // Get the template literal section leading up to the first
                  // expression in this attribute
                  const stringForPart = result.strings[partIndex]; // Find the attribute name

                  const name = lastAttributeNameRegex.exec(stringForPart)[2]; // Find the corresponding attribute
                  // All bound attributes have had a suffix added in
                  // TemplateResult#getHTML to opt out of special attribute
                  // handling. To look up the attribute value we also need to add
                  // the suffix.

                  const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                  const attributeValue = node.getAttribute(attributeLookupName);
                  const strings = attributeValue.split(markerRegex);
                  this.parts.push({
                    type: 'attribute',
                    index,
                    name,
                    strings
                  });
                  node.removeAttribute(attributeLookupName);
                  partIndex += strings.length - 1;
                }
              }

              if (node.tagName === 'TEMPLATE') {
                _prepareTemplate(node);
              }
            } else if (node.nodeType === 3
          /* Node.TEXT_NODE */
          ) {
              const data = node.data;

              if (data.indexOf(marker) >= 0) {
                const parent = node.parentNode;
                const strings = data.split(markerRegex);
                const lastIndex = strings.length - 1; // Generate a new text node for each literal section
                // These nodes are also used as the markers for node parts

                for (let i = 0; i < lastIndex; i++) {
                  parent.insertBefore(strings[i] === '' ? createMarker() : document.createTextNode(strings[i]), node);
                  this.parts.push({
                    type: 'node',
                    index: ++index
                  });
                } // If there's no text, we must insert a comment to mark our place.
                // Else, we can trust it will stick around after cloning.


                if (strings[lastIndex] === '') {
                  parent.insertBefore(createMarker(), node);
                  nodesToRemove.push(node);
                } else {
                  node.data = strings[lastIndex];
                } // We have a part for each match found


                partIndex += lastIndex;
              }
            } else if (node.nodeType === 8
          /* Node.COMMENT_NODE */
          ) {
              if (node.data === marker) {
                const parent = node.parentNode; // Add a new marker node to be the startNode of the Part if any of
                // the following are true:
                //  * We don't have a previousSibling
                //  * The previousSibling is already the start of a previous part

                if (node.previousSibling === null || index === lastPartIndex) {
                  index++;
                  parent.insertBefore(createMarker(), node);
                }

                lastPartIndex = index;
                this.parts.push({
                  type: 'node',
                  index
                }); // If we don't have a nextSibling, keep this node so we have an end.
                // Else, we can remove it to save future costs.

                if (node.nextSibling === null) {
                  node.data = '';
                } else {
                  nodesToRemove.push(node);
                  index--;
                }

                partIndex++;
              } else {
                let i = -1;

                while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                  // Comment node has a binding marker inside, make an inactive part
                  // The binding won't work, but subsequent bindings will
                  // TODO (justinfagnani): consider whether it's even worth it to
                  // make bindings in comments work
                  this.parts.push({
                    type: 'node',
                    index: -1
                  });
                }
              }
            }
        }
      };

      _prepareTemplate(element); // Remove text binding nodes after the walk to not disturb the TreeWalker


      for (const n of nodesToRemove) {
        n.parentNode.removeChild(n);
      }
    }

  }

  const isTemplatePartActive = part => part.index !== -1; // Allows `document.createComment('')` to be renamed for a
  // small manual size-savings.


  const createMarker = () => document.createComment('');
  /**
   * This regex extracts the attribute name preceding an attribute-position
   * expression. It does this by matching the syntax allowed for attributes
   * against the string literal directly preceding the expression, assuming that
   * the expression is in an attribute-value position.
   *
   * See attributes in the HTML spec:
   * https://www.w3.org/TR/html5/syntax.html#attributes-0
   *
   * "\0-\x1F\x7F-\x9F" are Unicode control characters
   *
   * " \x09\x0a\x0c\x0d" are HTML space characters:
   * https://www.w3.org/TR/html5/infrastructure.html#space-character
   *
   * So an attribute is:
   *  * The name: any character except a control character, space character, ('),
   *    ("), ">", "=", or "/"
   *  * Followed by zero or more space characters
   *  * Followed by "="
   *  * Followed by zero or more space characters
   *  * Followed by:
   *    * Any character except space, ('), ("), "<", ">", "=", (`), or
   *    * (") then any non-("), or
   *    * (') then any non-(')
   */


  const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * An instance of a `Template` that can be attached to the DOM and updated
   * with new values.
   */

  class TemplateInstance {
    constructor(template, processor, options) {
      this._parts = [];
      this.template = template;
      this.processor = processor;
      this.options = options;
    }

    update(values) {
      let i = 0;

      for (const part of this._parts) {
        if (part !== undefined) {
          part.setValue(values[i]);
        }

        i++;
      }

      for (const part of this._parts) {
        if (part !== undefined) {
          part.commit();
        }
      }
    }

    _clone() {
      // When using the Custom Elements polyfill, clone the node, rather than
      // importing it, to keep the fragment in the template's document. This
      // leaves the fragment inert so custom elements won't upgrade and
      // potentially modify their contents by creating a polyfilled ShadowRoot
      // while we traverse the tree.
      const fragment = isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
      const parts = this.template.parts;
      let partIndex = 0;
      let nodeIndex = 0;

      const _prepareInstance = fragment => {
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
        // null
        const walker = document.createTreeWalker(fragment, 133
        /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
        , null, false);
        let node = walker.nextNode(); // Loop through all the nodes and parts of a template

        while (partIndex < parts.length && node !== null) {
          const part = parts[partIndex]; // Consecutive Parts may have the same node index, in the case of
          // multiple bound attributes on an element. So each iteration we either
          // increment the nodeIndex, if we aren't on a node with a part, or the
          // partIndex if we are. By not incrementing the nodeIndex when we find a
          // part, we allow for the next part to be associated with the current
          // node if neccessasry.

          if (!isTemplatePartActive(part)) {
            this._parts.push(undefined);

            partIndex++;
          } else if (nodeIndex === part.index) {
            if (part.type === 'node') {
              const part = this.processor.handleTextExpression(this.options);
              part.insertAfterNode(node.previousSibling);

              this._parts.push(part);
            } else {
              this._parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
            }

            partIndex++;
          } else {
            nodeIndex++;

            if (node.nodeName === 'TEMPLATE') {
              _prepareInstance(node.content);
            }

            node = walker.nextNode();
          }
        }
      };

      _prepareInstance(fragment);

      if (isCEPolyfill) {
        document.adoptNode(fragment);
        customElements.upgrade(fragment);
      }

      return fragment;
    }

  }
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * The return type of `html`, which holds a Template and the values from
   * interpolated expressions.
   */


  class TemplateResult {
    constructor(strings, values, type, processor) {
      this.strings = strings;
      this.values = values;
      this.type = type;
      this.processor = processor;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */


    getHTML() {
      const endIndex = this.strings.length - 1;
      let html = '';

      for (let i = 0; i < endIndex; i++) {
        const s = this.strings[i]; // This exec() call does two things:
        // 1) Appends a suffix to the bound attribute name to opt out of special
        // attribute value parsing that IE11 and Edge do, like for style and
        // many SVG attributes. The Template class also appends the same suffix
        // when looking up attributes to create Parts.
        // 2) Adds an unquoted-attribute-safe marker for the first expression in
        // an attribute. Subsequent attribute expressions will use node markers,
        // and this is safe since attributes with multiple expressions are
        // guaranteed to be quoted.

        const match = lastAttributeNameRegex.exec(s);

        if (match) {
          // We're starting a new bound attribute.
          // Add the safe attribute suffix, and use unquoted-attribute-safe
          // marker.
          html += s.substr(0, match.index) + match[1] + match[2] + boundAttributeSuffix + match[3] + marker;
        } else {
          // We're either in a bound node, or trailing bound attribute.
          // Either way, nodeMarker is safe to use.
          html += s + nodeMarker;
        }
      }

      return html + this.strings[endIndex];
    }

    getTemplateElement() {
      const template = document.createElement('template');
      template.innerHTML = this.getHTML();
      return template;
    }

  }
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */


  const isPrimitive = value => {
    return value === null || !(typeof value === 'object' || typeof value === 'function');
  };
  /**
   * Sets attribute values for AttributeParts, so that the value is only set once
   * even if there are multiple parts for an attribute.
   */


  class AttributeCommitter {
    constructor(element, name, strings) {
      this.dirty = true;
      this.element = element;
      this.name = name;
      this.strings = strings;
      this.parts = [];

      for (let i = 0; i < strings.length - 1; i++) {
        this.parts[i] = this._createPart();
      }
    }
    /**
     * Creates a single part. Override this to create a differnt type of part.
     */


    _createPart() {
      return new AttributePart(this);
    }

    _getValue() {
      const strings = this.strings;
      const l = strings.length - 1;
      let text = '';

      for (let i = 0; i < l; i++) {
        text += strings[i];
        const part = this.parts[i];

        if (part !== undefined) {
          const v = part.value;

          if (v != null && (Array.isArray(v) || // tslint:disable-next-line:no-any
          typeof v !== 'string' && v[Symbol.iterator])) {
            for (const t of v) {
              text += typeof t === 'string' ? t : String(t);
            }
          } else {
            text += typeof v === 'string' ? v : String(v);
          }
        }
      }

      text += strings[l];
      return text;
    }

    commit() {
      if (this.dirty) {
        this.dirty = false;
        this.element.setAttribute(this.name, this._getValue());
      }
    }

  }

  class AttributePart {
    constructor(comitter) {
      this.value = undefined;
      this.committer = comitter;
    }

    setValue(value) {
      if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
        this.value = value; // If the value is a not a directive, dirty the committer so that it'll
        // call setAttribute. If the value is a directive, it'll dirty the
        // committer if it calls setValue().

        if (!isDirective(value)) {
          this.committer.dirty = true;
        }
      }
    }

    commit() {
      while (isDirective(this.value)) {
        const directive = this.value;
        this.value = noChange;
        directive(this);
      }

      if (this.value === noChange) {
        return;
      }

      this.committer.commit();
    }

  }

  class NodePart {
    constructor(options) {
      this.value = undefined;
      this._pendingValue = undefined;
      this.options = options;
    }
    /**
     * Inserts this part into a container.
     *
     * This part must be empty, as its contents are not automatically moved.
     */


    appendInto(container) {
      this.startNode = container.appendChild(createMarker());
      this.endNode = container.appendChild(createMarker());
    }
    /**
     * Inserts this part between `ref` and `ref`'s next sibling. Both `ref` and
     * its next sibling must be static, unchanging nodes such as those that appear
     * in a literal section of a template.
     *
     * This part must be empty, as its contents are not automatically moved.
     */


    insertAfterNode(ref) {
      this.startNode = ref;
      this.endNode = ref.nextSibling;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */


    appendIntoPart(part) {
      part._insert(this.startNode = createMarker());

      part._insert(this.endNode = createMarker());
    }
    /**
     * Appends this part after `ref`
     *
     * This part must be empty, as its contents are not automatically moved.
     */


    insertAfterPart(ref) {
      ref._insert(this.startNode = createMarker());

      this.endNode = ref.endNode;
      ref.endNode = this.startNode;
    }

    setValue(value) {
      this._pendingValue = value;
    }

    commit() {
      while (isDirective(this._pendingValue)) {
        const directive = this._pendingValue;
        this._pendingValue = noChange;
        directive(this);
      }

      const value = this._pendingValue;

      if (value === noChange) {
        return;
      }

      if (isPrimitive(value)) {
        if (value !== this.value) {
          this._commitText(value);
        }
      } else if (value instanceof TemplateResult) {
        this._commitTemplateResult(value);
      } else if (value instanceof Node) {
        this._commitNode(value);
      } else if (Array.isArray(value) || // tslint:disable-next-line:no-any
      value[Symbol.iterator]) {
        this._commitIterable(value);
      } else if (value === nothing) {
        this.value = nothing;
        this.clear();
      } else {
        // Fallback, will render the string representation
        this._commitText(value);
      }
    }

    _insert(node) {
      this.endNode.parentNode.insertBefore(node, this.endNode);
    }

    _commitNode(value) {
      if (this.value === value) {
        return;
      }

      this.clear();

      this._insert(value);

      this.value = value;
    }

    _commitText(value) {
      const node = this.startNode.nextSibling;
      value = value == null ? '' : value;

      if (node === this.endNode.previousSibling && node.nodeType === 3
      /* Node.TEXT_NODE */
      ) {
          // If we only have a single text node between the markers, we can just
          // set its value, rather than replacing it.
          // TODO(justinfagnani): Can we just check if this.value is primitive?
          node.data = value;
        } else {
        this._commitNode(document.createTextNode(typeof value === 'string' ? value : String(value)));
      }

      this.value = value;
    }

    _commitTemplateResult(value) {
      const template = this.options.templateFactory(value);

      if (this.value instanceof TemplateInstance && this.value.template === template) {
        this.value.update(value.values);
      } else {
        // Make sure we propagate the template processor from the TemplateResult
        // so that we use its syntax extension, etc. The template factory comes
        // from the render function options so that it can control template
        // caching and preprocessing.
        const instance = new TemplateInstance(template, value.processor, this.options);

        const fragment = instance._clone();

        instance.update(value.values);

        this._commitNode(fragment);

        this.value = instance;
      }
    }

    _commitIterable(value) {
      // For an Iterable, we create a new InstancePart per item, then set its
      // value to the item. This is a little bit of overhead for every item in
      // an Iterable, but it lets us recurse easily and efficiently update Arrays
      // of TemplateResults that will be commonly returned from expressions like:
      // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
      // If _value is an array, then the previous render was of an
      // iterable and _value will contain the NodeParts from the previous
      // render. If _value is not an array, clear this part and make a new
      // array for NodeParts.
      if (!Array.isArray(this.value)) {
        this.value = [];
        this.clear();
      } // Lets us keep track of how many items we stamped so we can clear leftover
      // items from a previous render


      const itemParts = this.value;
      let partIndex = 0;
      let itemPart;

      for (const item of value) {
        // Try to reuse an existing part
        itemPart = itemParts[partIndex]; // If no existing part, create a new one

        if (itemPart === undefined) {
          itemPart = new NodePart(this.options);
          itemParts.push(itemPart);

          if (partIndex === 0) {
            itemPart.appendIntoPart(this);
          } else {
            itemPart.insertAfterPart(itemParts[partIndex - 1]);
          }
        }

        itemPart.setValue(item);
        itemPart.commit();
        partIndex++;
      }

      if (partIndex < itemParts.length) {
        // Truncate the parts array so _value reflects the current state
        itemParts.length = partIndex;
        this.clear(itemPart && itemPart.endNode);
      }
    }

    clear(startNode = this.startNode) {
      removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }

  }
  /**
   * Implements a boolean attribute, roughly as defined in the HTML
   * specification.
   *
   * If the value is truthy, then the attribute is present with a value of
   * ''. If the value is falsey, the attribute is removed.
   */


  class BooleanAttributePart {
    constructor(element, name, strings) {
      this.value = undefined;
      this._pendingValue = undefined;

      if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
        throw new Error('Boolean attributes can only contain a single expression');
      }

      this.element = element;
      this.name = name;
      this.strings = strings;
    }

    setValue(value) {
      this._pendingValue = value;
    }

    commit() {
      while (isDirective(this._pendingValue)) {
        const directive = this._pendingValue;
        this._pendingValue = noChange;
        directive(this);
      }

      if (this._pendingValue === noChange) {
        return;
      }

      const value = !!this._pendingValue;

      if (this.value !== value) {
        if (value) {
          this.element.setAttribute(this.name, '');
        } else {
          this.element.removeAttribute(this.name);
        }
      }

      this.value = value;
      this._pendingValue = noChange;
    }

  }
  /**
   * Sets attribute values for PropertyParts, so that the value is only set once
   * even if there are multiple parts for a property.
   *
   * If an expression controls the whole property value, then the value is simply
   * assigned to the property under control. If there are string literals or
   * multiple expressions, then the strings are expressions are interpolated into
   * a string first.
   */


  class PropertyCommitter extends AttributeCommitter {
    constructor(element, name, strings) {
      super(element, name, strings);
      this.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
    }

    _createPart() {
      return new PropertyPart(this);
    }

    _getValue() {
      if (this.single) {
        return this.parts[0].value;
      }

      return super._getValue();
    }

    commit() {
      if (this.dirty) {
        this.dirty = false; // tslint:disable-next-line:no-any

        this.element[this.name] = this._getValue();
      }
    }

  }

  class PropertyPart extends AttributePart {} // Detect event listener options support. If the `capture` property is read
  // from the options object, then options are supported. If not, then the thrid
  // argument to add/removeEventListener is interpreted as the boolean capture
  // value so we should only pass the `capture` property.


  let eventOptionsSupported = false;

  try {
    const options = {
      get capture() {
        eventOptionsSupported = true;
        return false;
      }

    }; // tslint:disable-next-line:no-any

    window.addEventListener('test', options, options); // tslint:disable-next-line:no-any

    window.removeEventListener('test', options, options);
  } catch (_e) {}

  class EventPart {
    constructor(element, eventName, eventContext) {
      this.value = undefined;
      this._pendingValue = undefined;
      this.element = element;
      this.eventName = eventName;
      this.eventContext = eventContext;

      this._boundHandleEvent = e => this.handleEvent(e);
    }

    setValue(value) {
      this._pendingValue = value;
    }

    commit() {
      while (isDirective(this._pendingValue)) {
        const directive = this._pendingValue;
        this._pendingValue = noChange;
        directive(this);
      }

      if (this._pendingValue === noChange) {
        return;
      }

      const newListener = this._pendingValue;
      const oldListener = this.value;
      const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
      const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);

      if (shouldRemoveListener) {
        this.element.removeEventListener(this.eventName, this._boundHandleEvent, this._options);
      }

      if (shouldAddListener) {
        this._options = getOptions(newListener);
        this.element.addEventListener(this.eventName, this._boundHandleEvent, this._options);
      }

      this.value = newListener;
      this._pendingValue = noChange;
    }

    handleEvent(event) {
      if (typeof this.value === 'function') {
        this.value.call(this.eventContext || this.element, event);
      } else {
        this.value.handleEvent(event);
      }
    }

  } // We copy options because of the inconsistent behavior of browsers when reading
  // the third argument of add/removeEventListener. IE11 doesn't support options
  // at all. Chrome 41 only reads `capture` if the argument is an object.


  const getOptions = o => o && (eventOptionsSupported ? {
    capture: o.capture,
    passive: o.passive,
    once: o.once
  } : o.capture);
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * Creates Parts when a template is instantiated.
   */


  class DefaultTemplateProcessor {
    /**
     * Create parts for an attribute-position binding, given the event, attribute
     * name, and string literals.
     *
     * @param element The element containing the binding
     * @param name  The attribute name
     * @param strings The string literals. There are always at least two strings,
     *   event for fully-controlled bindings with a single expression.
     */
    handleAttributeExpressions(element, name, strings, options) {
      const prefix = name[0];

      if (prefix === '.') {
        const comitter = new PropertyCommitter(element, name.slice(1), strings);
        return comitter.parts;
      }

      if (prefix === '@') {
        return [new EventPart(element, name.slice(1), options.eventContext)];
      }

      if (prefix === '?') {
        return [new BooleanAttributePart(element, name.slice(1), strings)];
      }

      const comitter = new AttributeCommitter(element, name, strings);
      return comitter.parts;
    }
    /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */


    handleTextExpression(options) {
      return new NodePart(options);
    }

  }

  const defaultTemplateProcessor = new DefaultTemplateProcessor();
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * The default TemplateFactory which caches Templates keyed on
   * result.type and result.strings.
   */

  function templateFactory(result) {
    let templateCache = templateCaches.get(result.type);

    if (templateCache === undefined) {
      templateCache = {
        stringsArray: new WeakMap(),
        keyString: new Map()
      };
      templateCaches.set(result.type, templateCache);
    }

    let template = templateCache.stringsArray.get(result.strings);

    if (template !== undefined) {
      return template;
    } // If the TemplateStringsArray is new, generate a key from the strings
    // This key is shared between all templates with identical content


    const key = result.strings.join(marker); // Check if we already have a Template for this key

    template = templateCache.keyString.get(key);

    if (template === undefined) {
      // If we have not seen this key before, create a new Template
      template = new Template(result, result.getTemplateElement()); // Cache the Template for this key

      templateCache.keyString.set(key, template);
    } // Cache all future queries for this TemplateStringsArray


    templateCache.stringsArray.set(result.strings, template);
    return template;
  }

  const templateCaches = new Map();
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  const parts = new WeakMap();
  /**
   * Renders a template to a container.
   *
   * To update a container with new values, reevaluate the template literal and
   * call `render` with the new result.
   *
   * @param result a TemplateResult created by evaluating a template tag like
   *     `html` or `svg`.
   * @param container A DOM parent to render to. The entire contents are either
   *     replaced, or efficiently updated if the same result type was previous
   *     rendered there.
   * @param options RenderOptions for the entire render tree rendered to this
   *     container. Render options must *not* change between renders to the same
   *     container, as those changes will not effect previously rendered DOM.
   */

  const render = (result, container, options) => {
    let part = parts.get(container);

    if (part === undefined) {
      removeNodes(container, container.firstChild);
      parts.set(container, part = new NodePart(Object.assign({
        templateFactory
      }, options)));
      part.appendInto(container);
    }

    part.setValue(result);
    part.commit();
  };
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // IMPORTANT: do not change the property name or the assignment expression.
  // This line will be used in regexes to search for lit-html usage.
  // TODO(justinfagnani): inject version number at build time


  (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.0.0');
  /**
   * Interprets a template literal as an HTML template that can efficiently
   * render to and update a container.
   */

  const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */


  function poll(CACHE_CONFIG, newInputKey) {
    if (!newInputKey) {
      pollDefault(CACHE_CONFIG);
    } else {
      const {
        inputs
      } = getAll();
      CACHE_CONFIG.forEach(config => {
        if (config.sourceInputKeys.includes[newInputKey]) {
          const readyToFetch = config.sourceInputKeys.every(input => inputs[input]);

          if (readyToFetch) {
            fetchAndSave(config);
          }
        }
      });
    }
  }

  function pollDefault(CACHE_CONFIG) {
    const DEFAULT_KEYS = CACHE_CONFIG.filter(config => config.sourceInputKeys.length === 0).map(config => config.key);
    sdk.getDefaultCache(DEFAULT_KEYS).then(caches => {
      console.log('caches', caches);
      caches.map(cache => set('cache', cache.key, cache.data));
    }).catch(err => console.error('failed to fetch default caches', err));
  }

  function fetchAndSave(config) {
    sdk.getCache(config).then(cache => {
      if (cache) {
        set('cache', cache.key, cache.data);
      }
    }).catch(err => console.error('failed to fetch cache', err));
  }
  /*
  see https://lit-html.polymer-project.org/guide/template-reference#cache
  for details view and summary view for mobile version.
  */
  //get service name & domain


  var Summary = (inputs = {}, outputs = {}) => html`
<div class="summary">
    <div class="summary__header">
        <b>MoreThan</b>
        <span class="dimmed">Pet Insurance</span>
    </div>

    <section class="summary__body">
        ${inputs.pets ? html`
            <div id="pet-detail" class="summary__block">
                ${pet(inputs.pets[0])}
            </div>
            ` : ''}


        ${inputs.policyOptions || inputs.selectedCover || inputs.selectedVoluntaryExcess || inputs.selectedPaymentTerm ? html`
        <div id="policy-detail" class="summary__block">
            <h5 class="summary__block-title"> Your Policy </h5>
            <ul>
                ${inputs.policyOptions && inputs.policyOptions.coverStartDate ? startDate(inputs.policyOptions) : ''}
                ${inputs.selectedCover ? html`<li>Cover: ${inputs.selectedCover}</li>` : ''}
                ${inputs.selectedVetPaymentTerm ? html`<li> Vet Payment Term: ${inputs.selectedVetPaymentTerm}</li>` : ''}
                ${inputs.selectedPaymentTerm ? html`<li>Payment term: ${inputs.selectedPaymentTerm}</li>` : ''}
                ${inputs.selectedCoverType ? html`<li>Cover type: ${inputs.selectedCoverType.coverName} - ${(inputs.selectedCoverType.price.value * 0.01).toFixed(2)} ${inputs.selectedCoverType.price.currencyCode} </li>` : ''}
                ${inputs.selectedVetFee ? html`<li>Vet Fee:  - <p>${inputs.selectedVetFee.price.value * 0.01} ${inputs.selectedVetFee.price.currencyCode} </li>` : ''}
                ${inputs.selectedVoluntaryExcess ? html`<li>Voluntary Excess: ${inputs.selectedVoluntaryExcess.name}</li>` : ''}
                ${inputs.selectedCoverOptions ? html`<li>Cover options: ${inputs.selectedCoverOptions}</li>` : ''}
            </ul>
        </div>` : ''}

        ${outputs.insuranceProductInformationDocument || outputs.essentialInformation || outputs.policyWording || outputs.eligibilityConditions ? html`
        <div id="policy-info" class="summary__block">
            <h5 class="summary__block-title"> Your Documents </h5>
            <ul>
                ${outputs.insuranceProductInformationDocument ? fileType(outputs.insuranceProductInformationDocument) : ''}
                ${outputs.essentialInformation ? fileType(outputs.essentialInformation) : ''}
                ${outputs.policyWording ? fileType(outputs.policyWording) : ''}
                ${outputs.eligibilityConditions ? htmlType(outputs.eligibilityConditions) : ''}
            </ul>
        </div>` : ''}

        ${outputs.estimatedPrice ? html`<div id="price" class="summary__block">
                ${price(outputs.estimatedPrice)}
            </div>` : ''}

    </section>
</div>`;

  const pet = pet => html`
<h5 class="summary__block-title"> Your ${pet.name} </h5>
<ul>
    <li> Breed Name: ${pet.breedName}</li>
    <li> Date of Birth: ${pet.dateOfBirth}</li>
    <li> Paid/Donated: £ ${Number(pet.petPrice).toFixed(2)}</li>
</ul>
`;

  const startDate = policyOptions => {
    const {
      coverStartDate
    } = policyOptions;
    return html`
        <li>
            Starts on ${coverStartDate}
        </li>
    `;
  };

  const fileType = data => {
    return html`
    <div>
        <h5>${data.name}</h5>
        <a>${data.filename}</a>
    </div>
`;
  };

  const htmlType = data => {
    return html`
    <div>
        <h5>${data.name}</h5>
        ${data.html}
    </div>`;
  };

  const price = data => {
    return html`
        <h5>Price</h5>
        <span>${(data.price.value * 0.01).toFixed(2)} ${data.price.countryCode}</span>
    `;
  };
  /**
   *
   *  insuranceProductInformationDocument
   * 	essentialInformation
   * 	policyWording
   *  eligibilityConditions
   *  estimatedPrice
   *
   */


  var Header = () => html`
<div class="header">
    <h2>Here goes brand</h2>
</div>`;

  var Footer = () => html`
<div class="footer">
    <span></span>
</div>`;
  /**
   * @param {String} formId
   * @return {Object}
   */


  function serializeForm(formId = '') {
    const selector = formId ? `#${formId}` : 'form';
    const form = document.querySelector(selector);

    if (!form || !(form instanceof HTMLFormElement)) {
      throw new Error('specified form not found');
    }

    const serialized = formSerialize(form, {
      empty: false,
      serializer: hash_serializer
    });
    return camelCaseKeys(serialized, {
      deep: true
    });
  }
  /**
   *
   * Below is copied over from form-serialize(https://github.com/defunctzombie/form-serialize) with customization:
   * Added `-$number`, `-$boolean` and `-$object` convention in the name, parse these value with specified data type, and remove the identifier
   */


  var brackets = /(\[[^\[\]]*\])/g;

  function hash_serializer(result, key, value) {
    var matches = key.match(brackets); // Has brackets? Use the recursive assignment function to walk the keys,
    // construct any missing objects in the result tree and make the assignment
    // at the end of the chain.

    if (matches) {
      var keys = parse_keys(key);
      hash_assign(result, keys, value);
    } else {
      // Non bracket notation can make assignments directly.
      console.log('[pre]key,value', key, value);
      const parsed = parse_type(key, value);
      key = parsed.key;
      value = parsed.value;
      console.log('[post]key,value', key, value);
      var existing = result[key]; // If the value has been assigned already (for instance when a radio and
      // a checkbox have the same name attribute) convert the previous value
      // into an array before pushing into it.
      //
      // NOTE: If this requirement were removed all hash creation and
      // assignment could go through `hash_assign`.

      if (existing) {
        if (!Array.isArray(existing)) {
          result[key] = [existing];
        }

        result[key].push(value);
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  function parse_keys(string) {
    var keys = [];
    var prefix = /^([^\[\]]*)/;
    var children = new RegExp(brackets);
    var match = prefix.exec(string);

    if (match[1]) {
      keys.push(match[1]);
    }

    while ((match = children.exec(string)) !== null) {
      keys.push(match[1]);
    }

    return keys;
  }

  function parse_type(key, value) {
    if (key.includes('-$number')) {
      key = key.replace('-$number', '');
      const num = Number.parseInt(value);

      if (isNaN(num)) {
        console.error('number type is specified but non-number value is provided:', value);
      } else {
        value = num;
      }
    }

    if (key.includes('-$boolean') || key.includes('-$object')) {
      key = key.replace('-$boolean', '');
      key = key.replace('-$object', '');

      try {
        value = JSON.parse(value);
      } catch (err) {
        // do nothing
        console.error('boolean/object type is specified but could not parse the value:', value);
      }
    }

    return {
      key,
      value
    };
  }

  function hash_assign(result, keys, value) {
    if (keys.length === 0) {
      result = value;
      return result;
    }

    var key = keys.shift();

    if (key.includes('-$number')) {
      key = key.replace('-$number', '');
      const num = Number.parseInt(value);

      if (isNaN(num)) {
        console.error('number type is specified but non-number value is provided:', value);
      } else {
        value = num;
      }
    }

    if (key.includes('-$boolean') || key.includes('-$object')) {
      key = key.replace('-$boolean', '');
      key = key.replace('-$object', '');

      try {
        value = JSON.parse(value);
      } catch (err) {
        // do nothing
        console.error('boolean/object type is specified but could not parse the value:', value);
      }
    }

    var between = key.match(/^\[(.+?)\]$/);

    if (key === '[]') {
      result = result || [];

      if (Array.isArray(result)) {
        result.push(hash_assign(null, keys, value));
      } else {
        // This might be the result of bad name attributes like "[][foo]",
        // in this case the original `result` object will already be
        // assigned to an object literal. Rather than coerce the object to
        // an array, or cause an exception the attribute "_values" is
        // assigned as an array.
        result._values = result._values || [];

        result._values.push(hash_assign(null, keys, value));
      }

      return result;
    } // Key is an attribute name and can be assigned directly.


    if (!between) {
      result[key] = hash_assign(result[key], keys, value);
    } else {
      var string = between[1]; // +var converts the variable into a number
      // better than parseInt because it doesn't truncate away trailing
      // letters and actually fails if whole thing is not a number

      var index = +string; // If the characters between the brackets is not a number it is an
      // attribute name and can be assigned directly.

      if (isNaN(index)) {
        result = result || {};
        result[string] = hash_assign(result[string], keys, value);
      } else {
        result = result || [];
        result[index] = hash_assign(result[index], keys, value);
      }
    }

    return result;
  }

  var Loading = (selector = '#app') => render(template, document.querySelector(selector));

  const template = html`
<div class="loading">
    <h2 id="loading-message">
        We are preparing your form...
    </h2>
</div>
`;

  var section = () => html`
    <div class="section">
        <pre id="error"></pre>
        <form class="section__body" id="target"></form>

        <div class="section__actions">
            <button type="button" class="button button--right button--primary" id="submitBtn">Continue</button>
        </div>
    </div>
`;

  var selectOne = (meta, output) => {
    return html`
    <div class="field field-set">
        <span class="field__name">${meta.title || meta.key}</span>
        <select name="${kebabCase(meta.key)}">
            ${output.map(o => html`
                <option value="${o}"> ${o}</option>`)}
        </select>
    </div>
`;
  };

  var selectMany = (meta, output) => {
    return html`
    <div id="${meta.key}">
        <div class="field field-set">
            <span class="field__name">${meta.title || meta.key}</span>
            <select name="${meta.key}">
                ${output.map(o => html`
                    <option value="${o}"> ${o}</option>`)}
            </select>
        </div>
    </div>
`;
  };

  let availableBreedTypes = {};

  var petsSelectedBreedType = (meta, outputOrCache) => {
    availableBreedTypes = outputOrCache.availableBreedTypes;
    return petsAndSelectedBreedType();
  };

  const petsAndSelectedBreedType = () => html`
<div class="job-input">
    <div class="pet" name="pets[0]">
        <div class="field field-set">
            <label class="field__name" for="pets[0][name]">Pet Name</label>
            <input type="text" name="pets[0][name]" placeholder="Rex" value="Rex" required />
        </div>

        <div class="field field-set">
            <span class="field__name">Pet type</span>
            <div class="field__inputs group group--merged">
                <input type="radio" name="pets[0][animal-type]" id="pets[0][animal-type]-dog" value="dog" @change="${breedTypeHandler}"
                    required />
                <label for="pets[0][animal-type]-dog" class="button">Dog</label>

                <input type="radio" name="pets[0][animal-type]" id="pets[0][animal-type]-cat" value="cat" @change="${breedTypeHandler}" />
                <label for="pets[0][animal-type]-cat" class="button">Cat</label>
            </div>
        </div>

        <div class="field field-set">
        <span class="field__name">Breed Type</span>
            <select name="selected-breed-type" id="selected-breed-type" required>
                <option>Please select pet type</option>
            </select>
        </div>

        <div class="field field-set">
            <span class="field__name">Gender</span>
            <div class="field__inputs group group--merged">
                <input type="radio" name="pets[0][gender]" value="male" id="pets[0][gender]-male" required checked>
                <label for="pets[0][gender]-male" class="button">Male</label>

                <input type="radio" name="pets[0][gender]" id="pets[0][gender]-female" value="female">
                <label for="pets[0][gender]-female" class="button">Female</label>
            </div>
        </div>

        <div class="field field-set">
            <label class="field__name" for="pets[0][breed-name]">Breed Name</label>
            <input type="text" name="pets[0][breed-name]" value="Afghan Hound" required>
        </div>

        <div class="field field-set">
            <label class="field__name" for="pets[0][date-of-birth]">Date Of Birth</label>
            <input type="date" name="pets[0][date-of-birth]" value="2019-01-02" minDate="${new Date()}" required>
        </div>

        <div class="field field-set">
            <label class="field__name" for="pets[0][pet-price]">How much did you pay or donate</label>
            <input type="number" name="pets[0][pet-price]" value="0" min="0">
        </div>

        <div class="pet-related-questions">
            <div class="field field-set">
                <span class="field__name">Is your pet spayed or neutered?</span>
                <div class="field__inputs group group--merged">
                    <input type="radio" name="pets[0][related-questions][is-spayed-or-neutered-$boolean]" id="pets[0]-neutered-yes"
                        value="true" required checked>
                    <label for="pets[0]-neutered-yes" class="button">Yes</label>

                    <input type="radio" class="button" name="pets[0][related-questions][is-spayed-or-neutered-$boolean]"
                        id="pets[0]-neutered-no" value="false">
                    <label for="pets[0]-neutered-no" class="button">No</label>
                </div>
            </div>

            <div class="field field-set">
                <span class="field__name">Has your pet had any behaviour complains?</span>
                <div class="field__inputs group group--merged">
                    <input type="radio" name="pets[0][related-questions][has-behaviour-complains-$boolean]" id="pets[0]-behaviour-complains-yes"
                        value="true" required>
                    <label for="pets[0]-behaviour-complains-yes" class="button">Yes</label>

                    <input type="radio" name="pets[0][related-questions][has-behaviour-complains-$boolean]" id="pets[0]-behaviour-complains-no"
                        value="false" required checked>
                    <label for="pets[0]-behaviour-complains-no" class="button">No</label>
                </div>
            </div>

            <div class="field field-set">
                <span class="field__name">Does your pet have chip or tag?</span>
                <div class="field__inputs group group--merged">
                    <input type="radio" name="pets[0][related-questions][has-chip-or-tag-$boolean]" id="pets[0]-has-chip-yes"
                        value="true" required checked>
                    <label for="pets[0]-has-chip-yes" class="button">Yes</label>

                    <input type="radio" name="pets[0][related-questions][has-chip-or-tag-$boolean]" id="pets[0]-has-chip-no"
                        value="false" required>
                    <label for="pets[0]-has-chip-no" class="button">No</label>
                </div>
            </div>

            <div class="field field-set">
                <span class="field__name">Is your pet kept at your address?</span>
                <div class="field__inputs group group--merged">
                    <input type="radio" name="pets[0][related-questions][is-kept-at-your-address-$boolean]" id="pets[0]-kept-at-yours-yes"
                        value="true" required checked>
                    <label for="pets[0]-kept-at-yours-yes" class="button">Yes</label>

                    <input type="radio" name="pets[0][related-questions][is-kept-at-your-address-$boolean]" id="pets[0]-kept-at-yours-no"
                        value="false" required>
                    <label for="pets[0]-kept-at-yours-no" class="button">No</label>
                </div>
            </div>

            <div class="field field-set">
                <span class="field__name">Is your pet kept indoor?</span>
                <div class="field__inputs group group--merged">
                    <input type="radio" name="pets[0][related-questions][is-indoor-$boolean]" id="pets[0]-indoor-yes"
                        value="true" required checked>
                    <label for="pets[0]-indoor-yes" class="button">Yes</label>

                    <input type="radio" name="pets[0][related-questions][is-indoor-$boolean]" id="pets[0]-indoor-no"
                        value="false" required>
                    <label for="pets[0]-indoor-no" class="button">No</label>
                </div>
            </div>

            <div class="field field-set">
                <span class="field__name">Is your pet in good health, and not showing any sign of illness, injury or
                    other medical conditions?</span>
                <div class="field__inputs group group--merged">
                    <input type="radio" name="pets[0][related-questions][is-your-pet-healthy-$boolean]" id="pets[0]-healthy-yes"
                        value="true" required checked>
                    <label for="pets[0]-healthy-yes" class="button">Yes</label>

                    <input type="radio" name="pets[0][related-questions][is-your-pet-healthy-$boolean]" id="pets[0]-healthy-no"
                        value="false" required>
                    <label for="pets[0]-healthy-no" class="button">No</label>
                </div>
            </div>

            <div class="field field-set">
                <span class="field__name">Has there been legal action resulting from an incident involving your pet?</span>
                <div class="field__inputs group group--merged">
                    <input type="radio" name="pets[0][related-questions][has-legal-action-$boolean]" id="pets[0]-legal-yes"
                        value="true" required checked>
                    <label for="pets[0]-legal-yes" class="button">Yes</label>

                    <input type="radio" name="pets[0][related-questions][has-legal-action-$boolean]" id="pets[0]-legal-no"
                        value="false" required checked>
                    <label for="pets[0]-legal-no" class="button">No</label>
                </div>
            </div>
        </div>
    </div>
</div>
`;

  const breedTypeOptions = options => html`
    ${options.map(o => html`
        <option value="${o}"> ${o}</option>`)}`;

  const breedTypeHandler = {
    // handleEvent method is required.
    handleEvent(e) {
      console.log('e.target.value', e.target.value);
      const animalType = e.target.value;
      const options = availableBreedTypes[animalType] || [];
      render(breedTypeOptions(options), document.querySelector('#selected-breed-type'));
    }

  };

  var account = () => html`
<div name="account" class="filed-set">
    Contact
    <div class="field filed-set">
        <label class="field__name" for="account[email]">Email</label>
        <input type="email" name="account[email]" placeholder="example@example.com" value="example@example.com" required>
    </div>

    <div class="field filed-set">
        <label class="field__name" for="account[phone]">Mobile</label>
        <input type="hidden" name="account[phone][country-code]" value="gb">
        <input type="tel" name="account[phone][number]" placeholder="phone number" value="07912341234" required>
    </div>

    <div>
        <input type="hidden" name="account[password]" value="">
        <input type="hidden" name="account[is-existing-$boolean]" value="false">
    </div>
</div>`;

  const TITLES = ['mr', 'ms', 'mrs', 'miss'];
  const MARITAL_STATUS = ["Civil Partner", "Cohabiting", "Divorced", "Married", "Separated", "Single", "Widowed"];

  var owner = () => html`
    <div name="owner">
        <div name="owner[person]" class="filed-set">
            <div class="field">
                <label class="field__name">Title</label>
                <select name="owner[person][title]">
                    ${TITLES.map(t => html`
                    <option value="${t}" /> ${t.toUpperCase()}</option>`)}
                </select>
            </div>

            <div class="field">
                <label class="field__name" for="owner[person][first-name]">First Name</label>
                <input type="text" name="owner[person][first-name]" placeholder="Jane" required />
            </div>

            <div class="field">
                <label class="field__name" for="owner[person][middle-name]">Middle Name</label>
                <input type="text" name="owner[person][middle-name]" placeholder="" />
            </div>

            <div class="field">
                <label class="field__name" for="owner[person][last-name]">Last Name</label>
                <input type="text" name="owner[person][last-name]" placeholder="Doe" />
            </div>

            <div class="field">
                <label class="field__name" for="owner[person][date-of-birth]">Date Of Birth</label>
                <input type="date" name="owner[person][date-of-birth]" value="1990-04-02" required>
            </div>

            <div class="field">
                <label class="field__name" for="owner[person][marital-status]">Marital Status</label>
                <select name="owner[person][marital-status]">
                    ${MARITAL_STATUS.map(ms => html`
                        <option value="${ms}"> ${ms}</option>`)}
                </select>
            </div>
        </div>

        <div name="owner[address]" class="filed-set">
            <div class="field">
                <label for="owner[address][property-number]" class="field__name">Number of Property</label>
                <input type="text" name="owner[address][property-number]" id="owner[address][property-number]" value="12" required />
            </div>

            <div class="field">
                <label for="owner[address][postcode]" class="field__name">Postcode</label>
                <input type="text" name="owner[address][postcode]" id="owner[address][postcode]" value="HP4 2PE" required />
            </div>
        </div>
    </div>
`;

  var policyOptions = () => html`
<div name="policy-options" class="filed-set">
    <div class="field">
        <label class="field__name" for="policy-options[cover-start-date]">Cover start date</label>
        <input type="date" name="policy-options[cover-start-date]" value="2019-06-01" minDate="${new Date()}" required>
    </div>

    <div class="field">
        <label class="field__name" for="policy-options[number-of-pets-owned-$number]">How Many cats and dogs are in your household?</label>
        <input type="tel" name="policy-options[number-of-pets-owned-$number]" value="1" required />
    </div>
</div>`;

  var selectedCoverType = (meta, output) => {
    const key = kebabCase(meta.key);
    return html`
    <div class="field field-set">
        <span class="field__name">${meta.title || meta.key}</span>
        ${output.map(optionObj => html`
            <input
                type="radio"
                id="${key}-${optionObj.coverName}"
                name="${key}-$object"
                value="${JSON.stringify(optionObj)}">

            <label for="${key}-${optionObj.coverName}" class="button">
                <div><b>${optionObj.coverName}</b> <p>${(optionObj.price.value * 0.01).toFixed(2)} ${optionObj.price.currencyCode}</p></div>
            </label>`)}
    </div>
`;
  };

  var selectedVetFee = (meta, output) => {
    const key = kebabCase(meta.key);
    return html`
    <div class="field field-set">
        <span class="field__name">${meta.title || meta.key}</span>
        <div class="field__inputs group group--merged">
            ${output.map(optionObj => html`
                <input
                    type="radio"
                    id="${key}-${optionObj.price.value}"
                    name="${key}-$object"
                    value="${JSON.stringify(optionObj)}">
                <label
                    for="${key}-${optionObj.price.value}"
                    class="button">
                    <div><b>${optionObj.text}</b> <p>${optionObj.price.value * 0.01} ${optionObj.price.currencyCode}</p></div>
                </label>`)}
            </div>
    </div>
`;
  };

  var selectedVoluntaryExcess = (meta, output) => {
    const key = kebabCase(meta.key);
    return html`
    <div class="field field-set">
        <span class="field__name">${meta.title || meta.key}</span>
        <div class="field__inputs group group--merged">
        ${output.map(optionObj => html`
        <div>
            <input
                type="radio"
                id="${key}-${optionObj.priceLine}"
                name="${key}-$object"
                value="${JSON.stringify(optionObj)}">

            <label for="${key}-${optionObj.priceLine}" class="button">
                <div>
                    <b>${optionObj.name}</b>
                    <pre>${optionObj.details}</pre>
                </div>
            </label>
            <p>${optionObj.priceLine}</p>
        </div>
            `)}
        </div>
    </div>
`;
  };

  var selectedCoverOptions = (meta, output) => {
    return html`
    <div id="${meta.key}">
        <div class="field field-set">
            <span class="field__name">${meta.title || meta.key}</span>
            ${output.map(o => html`
            <input type="checkbox" value="${JSON.stringify(o)}" name="${meta.key}-$object[]" id="${meta.key}-${o.name}"/>
            <label for="${meta.key}-${o.name}" class="button">
                <div>
                    <b>${o.name}</b>
                    <pre>${o.detail}</pre>
                    <p>${(o.price.value * 0.01).toFixed(2)} ${o.price.currencyCode}</p>
                </div>
            </label>`)}
        </div>
    </div>
`;
  };

  const TITLES$1 = ['mr', 'ms', 'mrs', 'miss'];

  var Person = (prefix = 'person') => html`
<div class="section">
    <div class="section__body">
        <div name="${prefix}" class="filed-set">
            <div class="field">
                <label class="field__name">Title</label>
                <select name="${prefix}[title]">
                    ${TITLES$1.map(t => html`
                    <option value="${t}"> ${t.toUpperCase()}</option>`)}
                </select>
            </div>

            <div class="field">
                <label class="field__name" for="${prefix}[first-name]">First Name</label>
                <input type="text" name="${prefix}[first-name]" placeholder="Jane" required />
            </div>

            <div class="field">
                <label class="field__name" for="${prefix}[middle-name]">Middle Name</label>
                <input type="text" name="${prefix}[middle-name]" placeholder="" />
            </div>

            <div class="field">
                <label class="field__name" for="${prefix}[last-name]">Last Name</label>
                <input type="text" name="${prefix}[last-name]" placeholder="Doe" required />
            </div>
        </div>
    </div>
</div>
`;

  var Address = (prefix = 'address') => html`
<div name="${prefix}" class="filed-set">
    <div class="field">
        <label for="${prefix}[line1]" class="field__name">Line 1</label>
        <input type="text" name="${prefix}[line1]" id="${prefix}[line1]" value="587" required />
    </div>

    <div class="field">
        <label for="${prefix}[line2]" class="field__name">Line 2</label>
        <input type="text" name="${prefix}[line2]" id="${prefix}[line2]" value="high road" />
    </div>

    <div class="field">
        <label for="${prefix}[city]" class="field__name">City</label>
        <input type="text" name="${prefix}[city]" id="${prefix}[city]" value="london" required />
    </div>

    <div class="field">
        <label for="${prefix}[country-subdivision]" class="field__name">County</label>
        <input type="text" name="${prefix}[country-subdivision]" id="${prefix}[country-subdivision]" value="London" required/>
    </div>

    <div class="field">
    <!-- select -->
        <label for="${prefix}[country-code]" class="field__name">Country Code</label>
        <input type="text" name="${prefix}[country-code]" id="${prefix}[country-code]" value="gb" required />
    </div>

    <div class="field">
        <label for="${prefix}[postcode]" class="field__name">Postcode</label>
        <input type="text" name="${prefix}[postcode]" id="${prefix}[postcode]" value="E11 4PB" required />
    </div>
</div>
`;

  const CARD_BRANDS = ['visa', 'mastercard', 'amex', 'discover'];

  var Payment = (prefix = 'payment') => html`
<div class="filed-set">
    ${Person(`${prefix}[person]`)}

    <div name="${prefix}[card]" class="filed-set">
        <div class="field">
            <span class="field__name">Type</span>
            <div class="field__inputs group group--merged">
                <input type="radio" name="${prefix}[card][type]" id="${prefix}[card][type]-debit" value="debit"/>
                <label for="${prefix}[card][type]-debit" class="button">debit</label>

                <input type="radio" name="${prefix}[card][type]" id="${prefix}[card][type]-credit" value="credit"/>
                <label for="${prefix}[card][type]-credit" class="button">credit</label>
            </div>
        </div>

        <div class="field">
            <label class="field__name">brand</label>
            <select name="${prefix}[card][brand]">
                ${CARD_BRANDS.map(c => html`
                <option value="${c}"> ${c}</option>`)}
            </select>
        </div>

        <div class="field">
            <label class="field__name" for="pan">Card Number</label>
            <input type="text"
                name="pan"
                id= "pan",
                maxlength="19"
                placeholder="XXXX XXXX XXXX XXXX"
                required />
        </div>

        <div class="field">
            <label class="field__name" for="${prefix}[card][expiration-date]">Expiry Date</label>
            <input type="text"
                name="${prefix}[card][expiration-date]"
                id= "expiry-year",
                maxlength="8"
                placeholder="YYYY-MM"
                value="2020-10"
                required />
        </div>

        <div class="field">
            <label class="field__name" for="${prefix}[card][name]">name</label>
            <input type="text"
                name="${prefix}[card][name]"
                placeholder="Jane Doe"
                value="Jane Doe"
                required />
        </div>

        <div class="field">
            <label class="field__name" for="${prefix}[card][cvv]">cvv</label>
            <input type="tel"
                name="${prefix}[card][cvv]"
                placeholder="000"
                maxlength="4"
                value="123"
                required />
        </div>
    </div>

    ${Address(`${prefix}[address]`)}
</div>
`;

  var payment = () => Payment('payment');

  var directDebit = () => html`
<div class="section">
    <div class="section__body">
        <div name="direct-debit" class="filed-set">
            <div class="field">
                <label class="field__name" for="direct-debit[sort-code]">Sort Code</label>
                <input type="text" name="direct-debit[sort-code]" placeholder="56-00-29" required />
            </div>

            <div class="field">
                <label class="field__name" for="direct-debit[account-number]">Account Number</label>
                <input type="text" name="direct-debit[account-number]" placeholder="26207729" required/>
            </div>

            ${Person('direct-debit[account-holder]')}

            ${Address('direct-debit[account-holder-address]')}

            <div class="field">
                <label class="field__name" for="direct-debit[selected-payment-day]">Selected Payment Day</label>
                <input type="text" name="direct-debit[selected-payment-day]" placeholder="10" />
            </div>
        </div>
    </div>
</div>
`;

  var finalPriceConsent = (meta, priceConsent) => {
    return html`
    <div class="field field-set">
        <span class="field__name">${meta.title || meta.key}</span>
        <h4 class="warning">By clicking continue, we are going to process your payment</h4>
        <input type="radio" name="${kebabCase(meta.key)}-$object" value="${JSON.stringify(priceConsent)}" required>
        <b>${priceConsent.price.value} ${priceConsent.price.currencyCode}</b>
    </div>
`;
  };

  var inputs = {
    petsSelectedBreedType,
    account,
    owner,
    policyOptions,
    selectedCoverType,
    selectedVetFee,
    selectedVoluntaryExcess,
    selectedCoverOptions,
    payment,
    directDebit,
    finalPriceConsent
  };
  /** Global */
  //TODO-test: run this function for all given inputMetas;

  var templates = {
    loading: Loading,
    section,
    getInput
  };

  function getInput(meta) {
    const {
      key,
      inputMethod
    } = meta;
    let templateFunc = inputs[key];

    if (!templateFunc && inputMethod === 'SelectOne') {
      templateFunc = selectOne;
    }

    if (!templateFunc && inputMethod === 'SelectMany') {
      templateFunc = selectMany;
    }
    /*
    if (!template && inputMethod === 'Consent') {
        template = consent;
    } */


    if (templateFunc && typeof templateFunc === 'function') {
      console.log('templateFunc found');
      return templateFunc;
    }

    return null;
  }

  var cache = {
    availableBreedTypes: {
      "cat": ["Pedigree", "Non-Pedigree"],
      "dog": ["Cross Breed", "Pedigree", "Small mixed breed (up to 10kg)", "Medium mixed breed (10 - 20kg)", "Large mixed breed (above 20kg)"]
    }
  };

  class Section {
    constructor(name, inputsMeta = [], selector, onFinish) {
      this.name = name;
      this.selector = selector;
      this.inputsMeta = inputsMeta;
      this.onFinish = onFinish;
      this.keysToRender = this.inputsMeta.map(nd => nd.key);
      this.keysRendered = [];
      this.cachedTemplates = [];
      Promise.resolve(this.init());
    }

    init() {
      if (!sdk.initiated) {
        try {
          sdk.retrieve(); //TODO: if it's retrieved, check which input has provided. s
          // add submitted input to keysRendered, and render the next one.
        } catch (err) {
          window.location.hash = '/';
          return;
        }
      }

      this.renderWrapper();
      this.renderNextContent();
    }

    renderWrapper() {
      render(html``, document.querySelector(this.selector));
      render(templates.section(), document.querySelector(this.selector));
      this.addListener();
    }

    addListener() {
      const submitBtn = document.querySelector(`#submitBtn`);
      submitBtn.addEventListener('click', () => {
        // TODO: validate the input (using protocol?)
        const form = document.querySelector('form');

        if (!form.reportValidity()) {
          console.log('invalid form');
          return;
        }

        submitBtn.setAttribute('disabled', 'true');
        const inputs = serializeForm(); // send input sdk

        sdk.createJobInputs(inputs).then(submittedInputs => {
          const event = new CustomEvent('submitinput', {
            detail: submittedInputs
          });
          window.dispatchEvent(event);

          if (this.keysToRender.length !== 0) {
            render(html`Loading...`, document.querySelector('#next-of-pets')); //TODO: create template

            this.renderNextContent();
            submitBtn.removeAttribute('disabled');
          } else {
            render(html``, document.querySelector(this.selector));
            this.onFinish();
          }
        }).catch(err => {
          if (document.querySelector('#error')) {
            render(html`${err}`, document.querySelector('#error'));
          }

          submitBtn.removeAttribute('disabled');
        });
      });
    }

    renderNextContent() {
      const nextKey = this.keysToRender.shift();

      if (!nextKey) {
        return this.onFinish();
      }

      const inputMeta = this.inputsMeta.find(im => im.key === nextKey); //error handling?

      const template = templates.getInput(inputMeta); // render if the output is here.
      // when the awaitingInput event has happened, check nextKey and awaitingInputKey.
      // if it's different, skip this one, and render the awaitingInputKey.

      if (inputMeta.sourceOutputKey != null) {
        sdk.waitForJobOutput(inputMeta.sourceOutputKey, nextKey).then(output => {
          render(html`${template(inputMeta, output)}`, document.querySelector('#target'));
          this.keysRendered.push(nextKey);
        }).catch(err => {
          if (err.name === 'jobExpectsDifferentInputKey') {
            console.log('got jobExpectsDifferentInputKey!', err.details.awaitingInputKey);
            const input = this.inputsMeta.find(im => im.key === err.details.awaitingInputKey);

            if (!input) {
              // not found in this section! finish
              return this.onFinish();
            }

            const idx = this.keysToRender.indexOf(input.key);
            this.keysToRender.splice(idx, 1);
            this.keysToRender.unshift(...[input.key, nextKey]);
            return this.renderNextContent();
          }
        });
      } else {
        render(html`${template(null, cache)}<div id="next-of-${inputMeta.key}"></div>`, document.querySelector('#target'));
        this.keysRendered.push(nextKey);
      }
    }

  }
  /**
   * @param {String} name
   * @param {Array} inputMeta
   * @param {Function} onFinish
   */


  function getSection(name, inputMeta, selector, onFinish) {
    return new Section(name, inputMeta, selector, onFinish);
  }

  var NotFound = selector => {};

  const stepTemplate = (title, index, activeIndex) => html`
    <li class="progress-bar__step ${index === activeIndex ? 'progress-bar__step--active' : ''}">
        <div class="progress-bar__icon-container">
            <div class="progress-bar__icon">
                <span class="progress-bar__step-index">${index}</span>
            </div>
        </div>
        <div class="progress-bar__label">${title}</div>
    </li>`;

  var progressBar = (titles, activeIndex) => {
    console.log(titles, activeIndex);
    return html`
<ol class="progress-bar-list">
    ${titles.map((title, index) => stepTemplate(title, index + 1, activeIndex))}
</ol>
`;
  };

  var ProgressBar = selector => {
    return (titles, activeIndex) => render(progressBar(titles, activeIndex), document.querySelector(selector));
  };
  /** TODOS:
   * [v] need to navigate to awaitingInput's page, when waiting for the output
   * []need to assign all the sub-route so that they can navigate directly there
   * [v] gets output from previous-input-output as well
   * CSS - responsive
   * (?) Should we give a flexibility of showing some inputs together?
   */


  function createSection(config = {}, selector, callback) {
    //TODO: make config validator
    const {
      name,
      title,
      inputs
    } = config;

    if (!name) {
      throw new Error('name is needed for section');
    }

    if (!title) {
      throw new Error('title is needed for section');
    }

    if (!Array.isArray(inputs)) {
      throw new Error('inputs needed for section');
    }

    return {
      init: () => {
        sdk.create().then(() => getSection(name, inputs, selector, callback)).catch(err => console.log(err));
      }
    };
  }

  function createApp(SECTION_CONFIGS = [], CACHE_CONFIGS = [], selector, callback) {
    //TODO: maybe this core app fetches all domain's meta and store them.
    // config will accept input keys rather than whole meta
    const isValidConfig = SECTION_CONFIGS.length > 0 && SECTION_CONFIGS.every(config => config.name && config.title && config.inputs && config.route);

    if (!isValidConfig) {
      throw new Error('invalid config');
    }

    const flow = SECTION_CONFIGS.map(con => con.route);
    const titles = SECTION_CONFIGS.map(con => con.title);
    flow.push('/finish');
    const routes = {
      '/': selector => Loading(selector),
      '/finish': () => callback(null, 'finish')
    };
    SECTION_CONFIGS.forEach((config, idx) => {
      const {
        title,
        inputs,
        route
      } = config;
      const next = flow[idx + 1];

      const render = () => getSection(name, inputs, selector, () => setTimeout(() => {
        window.location.hash = next;
      }, 1000));

      routes[route] = {
        render,
        title,
        step: idx + 1
      };
    });
    const entryPoint = flow[0];
    return {
      init: () => {
        const router = Router(routes, titles, NotFound(selector), ProgressBar('#progress-bar'));
        render(Header(), document.querySelector('#header'));
        render(Summary(), document.querySelector('#summary'));
        render(Footer(), document.querySelector('#footer'));
        window.addEventListener('hashchange', () => {
          router.navigate();
          const {
            inputs,
            outputs
          } = getAll();
          render(Summary(inputs, outputs), document.querySelector('#summary'));
        }); // Listen on page load:

        window.addEventListener('load', () => {
          console.info('onload!');
          router.navigate();
        }); //

        window.addEventListener('beforeunload', function (e) {
          // Cancel the job
          console.info('unload!');
        }); //custom event when input submitted

        window.addEventListener('submitinput', e => {
          //TODO: get cache using output
          poll(CACHE_CONFIGS, Object.keys(e.detail.key));
          const {
            inputs,
            outputs
          } = getAll();
          render(Summary(inputs, outputs), document.querySelector('#summary'));
        });
        window.addEventListener('createoutput', () => {
          const {
            inputs,
            outputs
          } = getAll();
          render(Summary(inputs, outputs), document.querySelector('#summary'));
        });

        if (window.location.hash && window.location.hash !== '/') {
          try {
            sdk.retrieve();
            pollDefault(CACHE_CONFIGS);
            return;
          } catch (err) {
            console.log('error');
          }
        } else {
          sdk.create().then(() => {
            window.location.hash = entryPoint;
            pollDefault(CACHE_CONFIGS);
          }).catch(err => console.log(err));
        }
      }
    };
  }
  /* examples for createSection and createApp
   const config = {
      name: 'aboutYourPet',
      title: 'Tell Me About Your Pet',
      inputs: [
          { key: 'pets', sourceOutputKey: null },
          { key: 'selectedBreedType', sourceOutputKey: 'availableBreedTypes', title: 'select breed type' }
      ],
  };
   var section = createSection(config, '#app', () => { console.log('finished!')});
   section.init();
  */


  const CACHE = [{
    name: 'priceBreakdown',
    key: 'priceBreakdown',
    sourceInputKeys: ['selectedOption1', 'selectedOption2']
  }, {
    key: 'availableCovers',
    sourceInputKeys: []
  }, {
    key: 'availableVetPaymentTerms',
    sourceInputKeys: ['selectedCover']
  }, {
    key: 'availablePaymentTerms',
    sourceInputKeys: []
  }];
  const SECTIONS = [{
    name: 'aboutYourPet',
    route: '/about-your-pet',
    title: 'About Your Pet',
    inputs: [{
      key: 'petsSelectedBreedType',
      sourceOutputKey: null
    }]
  }, {
    name: 'aboutYou',
    route: '/about-you',
    title: 'About You',
    inputs: [{
      key: 'account',
      sourceOutputKey: null
    }, {
      key: 'owner',
      sourceOutputKey: null
    }, {
      key: 'selectedAddress',
      sourceOutputKey: 'availableAddresses'
    }]
  }, {
    name: 'yourPolicy',
    route: '/your-policy',
    title: 'Your Policy',
    inputs: [{
      key: 'policyOptions',
      sourceOutputKey: null
    }, //todo: allowCache config for previous
    {
      key: 'selectedCover',
      sourceOutputKey: 'availableCovers'
    }, {
      key: 'selectedVetPaymentTerm',
      sourceOutputKey: 'availableVetPaymentTerms'
    }, {
      key: 'selectedPaymentTerm',
      sourceOutputKey: 'availablePaymentTerms'
    }, {
      key: 'selectedCoverType',
      sourceOutputKey: 'availableCoverTypes'
    }, {
      key: 'selectedVoluntaryExcess',
      sourceOutputKey: 'availableVoluntaryExcesses'
    }, {
      key: 'selectedCoverOptions',
      sourceOutputKey: 'availableCoverOptions'
    }, {
      key: 'selectedVetFee',
      sourceOutputKey: 'availableVetFees'
    }]
  }, {
    name: 'paymentDetail',
    route: '/payment',
    title: 'Payment Details',
    inputs: [{
      key: 'payment',
      sourceOutputKey: null
    }, {
      key: 'directDebit',
      sourceOutputKey: null
    }]
  }, {
    name: 'consentPayment',
    route: '/consent-payment',
    title: 'Ready to insure your pet',
    inputs: [{
      key: 'finalPriceConsent',
      sourceOutputKey: 'finalPrice'
    }]
  }];
  var app = createApp(SECTIONS, CACHE, '#app', () => {
    console.log('finished!');
  });
  app.init();
  exports.createApp = createApp;
  exports.createSection = createSection;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

},{"@ubio/sdk":2,"camelcase-keys":5,"form-serialize":7,"lodash.kebabcase":9}],2:[function(require,module,exports){
(function (Buffer){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.ubioSdk = {}));
}(this, function (exports) { 'use strict';

    var defaultApiUrl = 'https://api.automationcloud.net';
    var defaultVaultUrl = 'https://vault.automationcloud.net';
    var defaultFetch = typeof self !== 'undefined' && self.fetch && self.fetch.bind(self);
    var base64Encode;

    if (typeof btoa === 'function') {
        base64Encode = function(string) {
            return btoa(string);
        };
    } else if (typeof Buffer === 'function') {
        base64Encode = function(string) {
            return Buffer.from(string).toString('base64');
        };
    } else {
        throw new Error('No way to convert to base64.');
    }

    function assertStringArguments(obj) {
        Object.keys(obj || {}).forEach(function(key) {
            if (typeof obj[key] !== 'string') {
                throw new TypeError('"' + key + '" must be a string.');
            }
        });
    }

    function createSearch(parameters) {
        if (!parameters) {
            return '';
        }

        var query = [];

        Object.keys(parameters).forEach(function(key) {
            if (parameters[key] !== void 0) {
                query.push(encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]));
            }
        });

        var search = query.join('&');

        return search.length ? '?' + search : '';
    }


    function fetchWrapper(url, fetch, token, opts) {
        var options = opts || {};
        var method = options.method || 'GET';
        var query = options.query;

        if (!token) {
            throw new Error('No token.');
        }

        var headers = {};

        Object.keys(options.headers || {}).forEach(function(key) {
            headers[key] = options.headers[key];
        });

        headers['Authorization'] = 'Basic ' + base64Encode(token + ':');

        var body = options.body === void 0 ? void 0 : JSON.stringify(options.body);
        var search = createSearch(query);

        if (typeof body === 'string') {
            headers['Content-Type'] = 'application/json';
        }

        var fetchOptions = {
            method: method,
            headers: headers,
            body: body,
            mode: 'cors',
            credentials: 'omit',
            cache: 'no-store',
            redirect: 'follow',
            referrer: 'client',
            referrerPolicy: 'origin',
            keepalive: false
        };

        return fetch(url + search, fetchOptions)
            .then(function(response) {
                if (!response.ok) {
                    return response.json()
                        .then(function(body) {
                            // TODO: Better errors from error bodies.
                            const error = new Error(body.message || 'Unexpected response');
                            error.status = response.status;
                            throw error;
                        });
                }

                if (options.parse !== false) {
                    return response.json();
                }

                return response;
            });
    }

    function makeApiClient(baseUrl, fetch, token) {
        var canonicalizedBaseiUrl = baseUrl.slice(-1) === '/' ? baseUrl : (baseUrl + '/');

        function apiFetch(path, options) {
            return fetchWrapper(canonicalizedBaseiUrl + path, fetch, token, options);
        }

        var api = {
            raw: function(path, options) {
                assertStringArguments({ path: path });
                return apiFetch(path, options);
            },
            getServices: function() {
                return apiFetch('services');
            },
            getService: function(serviceId) {
                assertStringArguments({ serviceId: serviceId });
                return apiFetch('services/' + serviceId);
            },
            getPreviousJobOutputs: function(serviceId, inputs) {
                assertStringArguments({ serviceId: serviceId });
                const body = { inputs: inputs || [] };

                return apiFetch('services/' + serviceId + '/previous-job-outputs', { method: 'POST', body: body });
            },
            getJobs: function(query) {
                return apiFetch('jobs', { query: query });
            },
            createJob: function(fields) {
                return apiFetch('jobs', { method: 'POST', body: fields });
            },
            getJob: function(jobId) {
                assertStringArguments({ jobId: jobId });
                return apiFetch('jobs/' + jobId);
            },
            cancelJob: function(jobId) {
                assertStringArguments({ jobId: jobId });
                return apiFetch('jobs/' + jobId + '/cancel', { method: 'POST' });
            },
            resetJob: function(jobId, fromInputKey, preserveInputs) {
                assertStringArguments({ jobId: jobId });
                const body = { fromInputKey: fromInputKey, preserveInputs: preserveInputs || [] };

                return apiFetch('jobs/' + jobId + '/reset', { method: 'POST', body: body });
            },
            createJobInput: function(jobId, key, data, stage) {
                assertStringArguments({ jobId: jobId, key: key });
                return apiFetch('jobs/' + jobId + '/inputs', { method: 'POST', body: { key, stage, data } });
            },
            getJobOutputs: function(jobId) {
                assertStringArguments({ jobId: jobId });
                return apiFetch('jobs/' + jobId + '/outputs');
            },
            getJobOutput: function(jobId, key, stage) {
                assertStringArguments({ jobId: jobId, key: key });

                var path = 'jobs/' + jobId + '/outputs/' + key;

                if (stage) {
                    path += '/' + stage;
                }

                return apiFetch(path);
            },
            getJobScreenshots: function(jobId) {
                assertStringArguments({ jobId: jobId });
                return apiFetch('jobs/' + jobId + '/screenshots');
            },
            getJobScreenshot: function(jobIdOrPath, id, ext) {
                function toBlob(res) {
                    return res.blob();
                }

                if (jobIdOrPath && jobIdOrPath[0] === '/') {
                    return apiFetch(jobIdOrPath, { parse: false })
                        .then(toBlob);
                }

                assertStringArguments({ jobId: jobIdOrPath, id: id, ext: ext });

                return apiFetch('jobs/' + jobIdOrPath + '/screenshots/' + id + '.png', { parse: false })
                    .then(toBlob);
            },
            getJobMimoLogs: function(jobId) {
                assertStringArguments({ jobId: jobId });
                return apiFetch('jobs/' + jobId + '/mimo-logs');
            },
            getJobEndUser: function(jobId) {
                assertStringArguments({ jobId: jobId });
                return apiFetch('jobs/' + jobId + '/end-user');
            },
            getJobEvents: function(jobId, offset) {
                assertStringArguments({ jobId: jobId });

                if (offset >>> 0 !== offset) {
                    throw new RangeError('offset must be a positive integer.');
                }

                return apiFetch('jobs/' + jobId + '/events', { query: { offset: offset || 0 } });
            },
            trackJob: function(jobId, callback) {
                assertStringArguments({ jobId: jobId });

                return poll(jobId, callback, 1000);
            }
        };

        function delay(t) {
            return new Promise(function(resolve) {
                setTimeout(resolve, t);
            });
        }

        function poll(jobId, callback, dt) {
            var offset = 0;
            var backoff = 0;
            var stopped = false;

            function stop() {
                if (!stopped) {
                    stopped = true;
                    callback('close');
                }
            }

            function run() {
                return delay(dt)
                    .then(function() {
                        if (!stopped) {
                            return api.getJobEvents(jobId, offset)
                                .then(function(body) {
                                    backoff = 0;
                                    return body;
                                })
                                .catch(function(error) {
                                    const message = error.stack || error.message;

                                    // 4xy errors don't lead to a retry, since the
                                    // client must change something before the
                                    // request can work.
                                    if (error.status < 500) {
                                        callback('error', error);
                                        stop();
                                        return;
                                    }

                                    // 5xy errors lead to retries with backoff.
                                    callback('error', error);

                                    backoff += 1;

                                    const backoffTime = ((dt + backoff * dt) / 1000).toFixed(1);

                                    console.warn('Error contacting API. Retrying in ' + backoffTime + ' s. ', message);

                                    return delay(backoff * dt)
                                        .then(function() {
                                            return { data: [] };
                                        });
                                });
                        }
                    })
                    .then(function(body) {
                        if (stopped) {
                            return;
                        }

                        var events = body.data.slice();

                        offset += events.length;

                        events.sort(function(a, b) {
                            return a.createdAt - b.createdAt;
                        });

                        events.forEach(function(event) {
                            callback(event.name);

                            if (event.name === 'success' || event.name === 'fail') {
                                stop();
                            }
                        });
                    })
                    .then(function() {
                        if (!stopped) {
                            return run();
                        }
                    });
            }

            run();

            return stop;
        }

        return api;
    }

    function makeVaultClient(baseUrl, fetch, token) {
        var canonicalizedBaseiUrl = baseUrl.slice(-1) === '/' ? baseUrl : (baseUrl + '/');

        function vaultFetch(path, options) {
            return fetchWrapper(canonicalizedBaseiUrl + path, fetch, token, options);
        }

        return {
            vaultPan: function(pan) {
                return vaultFetch('otp', { method: 'POST' })
                    .then(function(otp) {
                        return vaultFetch('pan', {
                            method: 'POST',
                            body: {
                                otp: otp.id,
                                pan: pan
                            }
                        });
                    })
                    .then(function(pan) {
                        return vaultFetch('pan/temporary', {
                            method: 'POST',
                            body: {
                                panId: pan.id,
                                key: pan.key
                            }
                        });
                    })
                    .then(function(temp) {
                        return temp.panToken;
                    });
            }
        };
    }

    /**
     * @param {Object} options
     * @param {string} options.token
     * @param {string} options.apiUrl
     * @param {function} options.fetch
     */
    function createClientSdk(options) {
        if (!options || !options.token) {
            throw new Error('Token required.');
        }

        var apiUrl = options.apiUrl || defaultApiUrl;
        var fetch = options.fetch || defaultFetch;
        var token = options.token;

        return makeApiClient(apiUrl, fetch, token);
    }

    /**
     * @param {Object} options
     * @param {string} options.token
     * @param {string} options.jobId
     * @param {string} options.serviceId
     * @param {string} options.apiUrl
     * @param {string} options.vaultUrl
     * @param {function} options.fetch
     */
    function createEndUserSdk(options) {
        if (!options || !options.token) {
            throw new Error('A token required.');
        }

        if (!options.jobId) {
            throw new Error('A jobId is required.');
        }

        if (!options.serviceId) {
            throw new Error('A serviceId is required.');
        }

        var jobId = options.jobId;
        var serviceId = options.serviceId;
        var apiUrl = options.apiUrl || defaultApiUrl;
        var vaultUrl = options.vaultUrl || defaultVaultUrl;
        var fetch = options.fetch || defaultFetch;
        var token = options.token;

        var apiClient = makeApiClient(apiUrl, fetch, token);
        var vaultClient = makeVaultClient(vaultUrl, fetch, token);

        return {
            getService: function() {
                return apiClient.getService(serviceId);
            },
            getPreviousJobOutputs: function(inputs) {
                return apiClient.getPreviousJobOutputs(serviceId, inputs);
            },
            getJob: function() {
                return apiClient.getJob(jobId);
            },
            cancelJob: function() {
                return apiClient.cancelJob(jobId);
            },
            resetJob: function(jobId, fromInputKey, preserveInputs) {
                return apiClient.resetJob(jobId, fromInputKey, preserveInputs);
            },
            createJobInput: function(key, data, stage) {
                return apiClient.createJobInput(jobId, key, data, stage);
            },
            getJobOutputs: function() {
                return apiClient.getJobOutputs(jobId);
            },
            getJobOutput: function(key, stage) {
                return apiClient.getJobOutput(jobId, key, stage);
            },
            getJobScreenshots: function() {
                return apiClient.getJobScreenshots(jobId);
            },
            getJobScreenshot: function(idOrPath) {
                if (idOrPath && idOrPath[0] === '/') {
                    return apiClient.getJobScreenshot(idOrPath);
                }

                return apiClient.getJobScreenshot(jobId, idOrPath);
            },
            getJobMimoLogs: function() {
                return apiClient.getJobMimoLogs(jobId);
            },
            getJobEvents: function(offset) {
                return apiClient.getJobEvents(jobId, offset);
            },
            trackJob: function(callback) {
                return apiClient.trackJob(jobId, callback);
            },
            vaultPan: function(pan) {
                return vaultClient.vaultPan(pan);
            }
        };
    }

    exports.createClientSdk = createClientSdk;
    exports.createEndUserSdk = createEndUserSdk;

    Object.defineProperty(exports, '__esModule', { value: true });

}));

}).call(this,require("buffer").Buffer)
},{"buffer":4}],3:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],4:[function(require,module,exports){
(function (Buffer){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this,require("buffer").Buffer)
},{"base64-js":3,"buffer":4,"ieee754":8}],5:[function(require,module,exports){
'use strict';
const mapObj = require('map-obj');
const camelCase = require('camelcase');
const QuickLru = require('quick-lru');

const has = (array, key) => array.some(x => typeof x === 'string' ? x === key : x.test(key));
const cache = new QuickLru({maxSize: 100000});

const camelCaseConvert = (input, options) => {
	options = Object.assign({
		deep: false
	}, options);

	const {exclude} = options;

	return mapObj(input, (key, value) => {
		if (!(exclude && has(exclude, key))) {
			if (cache.has(key)) {
				key = cache.get(key);
			} else {
				const ret = camelCase(key);

				if (key.length < 100) { // Prevent abuse
					cache.set(key, ret);
				}

				key = ret;
			}
		}

		return [key, value];
	}, {deep: options.deep});
};

module.exports = (input, options) => {
	if (Array.isArray(input)) {
		return Object.keys(input).map(key => camelCaseConvert(input[key], options));
	}

	return camelCaseConvert(input, options);
};


},{"camelcase":6,"map-obj":10,"quick-lru":11}],6:[function(require,module,exports){
'use strict';

const preserveCamelCase = string => {
	let isLastCharLower = false;
	let isLastCharUpper = false;
	let isLastLastCharUpper = false;

	for (let i = 0; i < string.length; i++) {
		const character = string[i];

		if (isLastCharLower && /[a-zA-Z]/.test(character) && character.toUpperCase() === character) {
			string = string.slice(0, i) + '-' + string.slice(i);
			isLastCharLower = false;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = true;
			i++;
		} else if (isLastCharUpper && isLastLastCharUpper && /[a-zA-Z]/.test(character) && character.toLowerCase() === character) {
			string = string.slice(0, i - 1) + '-' + string.slice(i - 1);
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = false;
			isLastCharLower = true;
		} else {
			isLastCharLower = character.toLowerCase() === character && character.toUpperCase() !== character;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = character.toUpperCase() === character && character.toLowerCase() !== character;
		}
	}

	return string;
};

const camelCase = (input, options) => {
	if (!(typeof input === 'string' || Array.isArray(input))) {
		throw new TypeError('Expected the input to be `string | string[]`');
	}

	options = Object.assign({
		pascalCase: false
	}, options);

	const postProcess = x => options.pascalCase ? x.charAt(0).toUpperCase() + x.slice(1) : x;

	if (Array.isArray(input)) {
		input = input.map(x => x.trim())
			.filter(x => x.length)
			.join('-');
	} else {
		input = input.trim();
	}

	if (input.length === 0) {
		return '';
	}

	if (input.length === 1) {
		return options.pascalCase ? input.toUpperCase() : input.toLowerCase();
	}

	const hasUpperCase = input !== input.toLowerCase();

	if (hasUpperCase) {
		input = preserveCamelCase(input);
	}

	input = input
		.replace(/^[_.\- ]+/, '')
		.toLowerCase()
		.replace(/[_.\- ]+(\w|$)/g, (_, p1) => p1.toUpperCase())
		.replace(/\d+(\w|$)/g, m => m.toUpperCase());

	return postProcess(input);
};

module.exports = camelCase;
// TODO: Remove this for the next major release
module.exports.default = camelCase;

},{}],7:[function(require,module,exports){
// get successful control from form and assemble into object
// http://www.w3.org/TR/html401/interact/forms.html#h-17.13.2

// types which indicate a submit action and are not successful controls
// these will be ignored
var k_r_submitter = /^(?:submit|button|image|reset|file)$/i;

// node names which could be successful controls
var k_r_success_contrls = /^(?:input|select|textarea|keygen)/i;

// Matches bracket notation.
var brackets = /(\[[^\[\]]*\])/g;

// serializes form fields
// @param form MUST be an HTMLForm element
// @param options is an optional argument to configure the serialization. Default output
// with no options specified is a url encoded string
//    - hash: [true | false] Configure the output type. If true, the output will
//    be a js object.
//    - serializer: [function] Optional serializer function to override the default one.
//    The function takes 3 arguments (result, key, value) and should return new result
//    hash and url encoded str serializers are provided with this module
//    - disabled: [true | false]. If true serialize disabled fields.
//    - empty: [true | false]. If true serialize empty fields
function serialize(form, options) {
    if (typeof options != 'object') {
        options = { hash: !!options };
    }
    else if (options.hash === undefined) {
        options.hash = true;
    }

    var result = (options.hash) ? {} : '';
    var serializer = options.serializer || ((options.hash) ? hash_serializer : str_serialize);

    var elements = form && form.elements ? form.elements : [];

    //Object store each radio and set if it's empty or not
    var radio_store = Object.create(null);

    for (var i=0 ; i<elements.length ; ++i) {
        var element = elements[i];

        // ingore disabled fields
        if ((!options.disabled && element.disabled) || !element.name) {
            continue;
        }
        // ignore anyhting that is not considered a success field
        if (!k_r_success_contrls.test(element.nodeName) ||
            k_r_submitter.test(element.type)) {
            continue;
        }

        var key = element.name;
        var val = element.value;

        // we can't just use element.value for checkboxes cause some browsers lie to us
        // they say "on" for value when the box isn't checked
        if ((element.type === 'checkbox' || element.type === 'radio') && !element.checked) {
            val = undefined;
        }

        // If we want empty elements
        if (options.empty) {
            // for checkbox
            if (element.type === 'checkbox' && !element.checked) {
                val = '';
            }

            // for radio
            if (element.type === 'radio') {
                if (!radio_store[element.name] && !element.checked) {
                    radio_store[element.name] = false;
                }
                else if (element.checked) {
                    radio_store[element.name] = true;
                }
            }

            // if options empty is true, continue only if its radio
            if (val == undefined && element.type == 'radio') {
                continue;
            }
        }
        else {
            // value-less fields are ignored unless options.empty is true
            if (!val) {
                continue;
            }
        }

        // multi select boxes
        if (element.type === 'select-multiple') {
            val = [];

            var selectOptions = element.options;
            var isSelectedOptions = false;
            for (var j=0 ; j<selectOptions.length ; ++j) {
                var option = selectOptions[j];
                var allowedEmpty = options.empty && !option.value;
                var hasValue = (option.value || allowedEmpty);
                if (option.selected && hasValue) {
                    isSelectedOptions = true;

                    // If using a hash serializer be sure to add the
                    // correct notation for an array in the multi-select
                    // context. Here the name attribute on the select element
                    // might be missing the trailing bracket pair. Both names
                    // "foo" and "foo[]" should be arrays.
                    if (options.hash && key.slice(key.length - 2) !== '[]') {
                        result = serializer(result, key + '[]', option.value);
                    }
                    else {
                        result = serializer(result, key, option.value);
                    }
                }
            }

            // Serialize if no selected options and options.empty is true
            if (!isSelectedOptions && options.empty) {
                result = serializer(result, key, '');
            }

            continue;
        }

        result = serializer(result, key, val);
    }

    // Check for all empty radio buttons and serialize them with key=""
    if (options.empty) {
        for (var key in radio_store) {
            if (!radio_store[key]) {
                result = serializer(result, key, '');
            }
        }
    }

    return result;
}

function parse_keys(string) {
    var keys = [];
    var prefix = /^([^\[\]]*)/;
    var children = new RegExp(brackets);
    var match = prefix.exec(string);

    if (match[1]) {
        keys.push(match[1]);
    }

    while ((match = children.exec(string)) !== null) {
        keys.push(match[1]);
    }

    return keys;
}

function hash_assign(result, keys, value) {
    if (keys.length === 0) {
        result = value;
        return result;
    }

    var key = keys.shift();
    var between = key.match(/^\[(.+?)\]$/);

    if (key === '[]') {
        result = result || [];

        if (Array.isArray(result)) {
            result.push(hash_assign(null, keys, value));
        }
        else {
            // This might be the result of bad name attributes like "[][foo]",
            // in this case the original `result` object will already be
            // assigned to an object literal. Rather than coerce the object to
            // an array, or cause an exception the attribute "_values" is
            // assigned as an array.
            result._values = result._values || [];
            result._values.push(hash_assign(null, keys, value));
        }

        return result;
    }

    // Key is an attribute name and can be assigned directly.
    if (!between) {
        result[key] = hash_assign(result[key], keys, value);
    }
    else {
        var string = between[1];
        // +var converts the variable into a number
        // better than parseInt because it doesn't truncate away trailing
        // letters and actually fails if whole thing is not a number
        var index = +string;

        // If the characters between the brackets is not a number it is an
        // attribute name and can be assigned directly.
        if (isNaN(index)) {
            result = result || {};
            result[string] = hash_assign(result[string], keys, value);
        }
        else {
            result = result || [];
            result[index] = hash_assign(result[index], keys, value);
        }
    }

    return result;
}

// Object/hash encoding serializer.
function hash_serializer(result, key, value) {
    var matches = key.match(brackets);

    // Has brackets? Use the recursive assignment function to walk the keys,
    // construct any missing objects in the result tree and make the assignment
    // at the end of the chain.
    if (matches) {
        var keys = parse_keys(key);
        hash_assign(result, keys, value);
    }
    else {
        // Non bracket notation can make assignments directly.
        var existing = result[key];

        // If the value has been assigned already (for instance when a radio and
        // a checkbox have the same name attribute) convert the previous value
        // into an array before pushing into it.
        //
        // NOTE: If this requirement were removed all hash creation and
        // assignment could go through `hash_assign`.
        if (existing) {
            if (!Array.isArray(existing)) {
                result[key] = [ existing ];
            }

            result[key].push(value);
        }
        else {
            result[key] = value;
        }
    }

    return result;
}

// urlform encoding serializer
function str_serialize(result, key, value) {
    // encode newlines as \r\n cause the html spec says so
    value = value.replace(/(\r)?\n/g, '\r\n');
    value = encodeURIComponent(value);

    // spaces should be '+' rather than '%20'.
    value = value.replace(/%20/g, '+');
    return result + (result ? '&' : '') + encodeURIComponent(key) + '=' + value;
}

module.exports = serialize;

},{}],8:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],9:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match words composed of alphanumeric characters. */
var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

/** Used to match Latin Unicode letters (excluding mathematical operators). */
var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
    rsComboSymbolsRange = '\\u20d0-\\u20f0',
    rsDingbatRange = '\\u2700-\\u27bf',
    rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
    rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
    rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
    rsPunctuationRange = '\\u2000-\\u206f',
    rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
    rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
    rsVarRange = '\\ufe0e\\ufe0f',
    rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

/** Used to compose unicode capture groups. */
var rsApos = "['\u2019]",
    rsBreak = '[' + rsBreakRange + ']',
    rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
    rsDigits = '\\d+',
    rsDingbat = '[' + rsDingbatRange + ']',
    rsLower = '[' + rsLowerRange + ']',
    rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsUpper = '[' + rsUpperRange + ']',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var rsLowerMisc = '(?:' + rsLower + '|' + rsMisc + ')',
    rsUpperMisc = '(?:' + rsUpper + '|' + rsMisc + ')',
    rsOptLowerContr = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
    rsOptUpperContr = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
    reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq;

/** Used to match apostrophes. */
var reApos = RegExp(rsApos, 'g');

/**
 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
 */
var reComboMark = RegExp(rsCombo, 'g');

/** Used to match complex or compound words. */
var reUnicodeWord = RegExp([
  rsUpper + '?' + rsLower + '+' + rsOptLowerContr + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
  rsUpperMisc + '+' + rsOptUpperContr + '(?=' + [rsBreak, rsUpper + rsLowerMisc, '$'].join('|') + ')',
  rsUpper + '?' + rsLowerMisc + '+' + rsOptLowerContr,
  rsUpper + '+' + rsOptUpperContr,
  rsDigits,
  rsEmoji
].join('|'), 'g');

/** Used to detect strings that need a more robust regexp to match words. */
var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

/** Used to map Latin Unicode letters to basic Latin letters. */
var deburredLetters = {
  // Latin-1 Supplement block.
  '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
  '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
  '\xc7': 'C',  '\xe7': 'c',
  '\xd0': 'D',  '\xf0': 'd',
  '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
  '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
  '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
  '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
  '\xd1': 'N',  '\xf1': 'n',
  '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
  '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
  '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
  '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
  '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
  '\xc6': 'Ae', '\xe6': 'ae',
  '\xde': 'Th', '\xfe': 'th',
  '\xdf': 'ss',
  // Latin Extended-A block.
  '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
  '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
  '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
  '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
  '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
  '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
  '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
  '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
  '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
  '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
  '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
  '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
  '\u0134': 'J',  '\u0135': 'j',
  '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
  '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
  '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
  '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
  '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
  '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
  '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
  '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
  '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
  '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
  '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
  '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
  '\u0163': 't',  '\u0165': 't', '\u0167': 't',
  '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
  '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
  '\u0174': 'W',  '\u0175': 'w',
  '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
  '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
  '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
  '\u0132': 'IJ', '\u0133': 'ij',
  '\u0152': 'Oe', '\u0153': 'oe',
  '\u0149': "'n", '\u017f': 'ss'
};

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * Splits an ASCII `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function asciiWords(string) {
  return string.match(reAsciiWord) || [];
}

/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function(key) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
 * letters to basic Latin letters.
 *
 * @private
 * @param {string} letter The matched letter to deburr.
 * @returns {string} Returns the deburred letter.
 */
var deburrLetter = basePropertyOf(deburredLetters);

/**
 * Checks if `string` contains a word composed of Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a word is found, else `false`.
 */
function hasUnicodeWord(string) {
  return reHasUnicodeWord.test(string);
}

/**
 * Splits a Unicode `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function unicodeWords(string) {
  return string.match(reUnicodeWord) || [];
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol = root.Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Creates a function like `_.camelCase`.
 *
 * @private
 * @param {Function} callback The function to combine each word.
 * @returns {Function} Returns the new compounder function.
 */
function createCompounder(callback) {
  return function(string) {
    return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
  };
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Deburrs `string` by converting
 * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
 * letters to basic Latin letters and removing
 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to deburr.
 * @returns {string} Returns the deburred string.
 * @example
 *
 * _.deburr('déjà vu');
 * // => 'deja vu'
 */
function deburr(string) {
  string = toString(string);
  return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
}

/**
 * Converts `string` to
 * [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the kebab cased string.
 * @example
 *
 * _.kebabCase('Foo Bar');
 * // => 'foo-bar'
 *
 * _.kebabCase('fooBar');
 * // => 'foo-bar'
 *
 * _.kebabCase('__FOO_BAR__');
 * // => 'foo-bar'
 */
var kebabCase = createCompounder(function(result, word, index) {
  return result + (index ? '-' : '') + word.toLowerCase();
});

/**
 * Splits `string` into an array of its words.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {RegExp|string} [pattern] The pattern to match words.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the words of `string`.
 * @example
 *
 * _.words('fred, barney, & pebbles');
 * // => ['fred', 'barney', 'pebbles']
 *
 * _.words('fred, barney, & pebbles', /[^, ]+/g);
 * // => ['fred', 'barney', '&', 'pebbles']
 */
function words(string, pattern, guard) {
  string = toString(string);
  pattern = guard ? undefined : pattern;

  if (pattern === undefined) {
    return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
  }
  return string.match(pattern) || [];
}

module.exports = kebabCase;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],10:[function(require,module,exports){
'use strict';

// Customized for this use-case
const isObject = value =>
	typeof value === 'object' &&
	value !== null &&
	!(value instanceof RegExp) &&
	!(value instanceof Error) &&
	!(value instanceof Date);

const mapObject = (object, fn, options, isSeen = new WeakMap()) => {
	options = Object.assign({
		deep: false,
		target: {}
	}, options);

	if (isSeen.has(object)) {
		return isSeen.get(object);
	}

	isSeen.set(object, options.target);

	const {target} = options;
	delete options.target;

	const mapArray = array => array.map(x => isObject(x) ? mapObject(x, fn, options, isSeen) : x);
	if (Array.isArray(object)) {
		return mapArray(object);
	}

	/// TODO: Use `Object.entries()` when targeting Node.js 8
	for (const key of Object.keys(object)) {
		const value = object[key];
		let [newKey, newValue] = fn(key, value, object);

		if (options.deep && isObject(newValue)) {
			newValue = Array.isArray(newValue) ?
				mapArray(newValue) :
				mapObject(newValue, fn, options, isSeen);
		}

		target[newKey] = newValue;
	}

	return target;
};

module.exports = mapObject;

},{}],11:[function(require,module,exports){
'use strict';

class QuickLRU {
	constructor(opts) {
		opts = Object.assign({}, opts);

		if (!(opts.maxSize && opts.maxSize > 0)) {
			throw new TypeError('`maxSize` must be a number greater than 0');
		}

		this.maxSize = opts.maxSize;
		this.cache = new Map();
		this.oldCache = new Map();
		this._size = 0;
	}

	_set(key, value) {
		this.cache.set(key, value);
		this._size++;

		if (this._size >= this.maxSize) {
			this._size = 0;
			this.oldCache = this.cache;
			this.cache = new Map();
		}
	}

	get(key) {
		if (this.cache.has(key)) {
			return this.cache.get(key);
		}

		if (this.oldCache.has(key)) {
			const value = this.oldCache.get(key);
			this._set(key, value);
			return value;
		}
	}

	set(key, value) {
		if (this.cache.has(key)) {
			this.cache.set(key, value);
		} else {
			this._set(key, value);
		}

		return this;
	}

	has(key) {
		return this.cache.has(key) || this.oldCache.has(key);
	}

	peek(key) {
		if (this.cache.has(key)) {
			return this.cache.get(key);
		}

		if (this.oldCache.has(key)) {
			return this.oldCache.get(key);
		}
	}

	delete(key) {
		if (this.cache.delete(key)) {
			this._size--;
		}

		this.oldCache.delete(key);
	}

	clear() {
		this.cache.clear();
		this.oldCache.clear();
		this._size = 0;
	}

	* keys() {
		for (const el of this) {
			yield el[0];
		}
	}

	* values() {
		for (const el of this) {
			yield el[1];
		}
	}

	* [Symbol.iterator]() {
		for (const el of this.cache) {
			yield el;
		}

		for (const el of this.oldCache) {
			if (!this.cache.has(el[0])) {
				yield el;
			}
		}
	}

	get size() {
		let oldCacheSize = 0;
		for (const el of this.oldCache) {
			if (!this.cache.has(el[0])) {
				oldCacheSize++;
			}
		}

		return this._size + oldCacheSize;
	}
}

module.exports = QuickLRU;

},{}]},{},[1]);

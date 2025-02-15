(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FaceDetector = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
    var FaceDetector = require('./src/FaceDetector.js');
    
    
    module.exports = FaceDetector;
    
    
    },{"./src/FaceDetector.js":5}],2:[function(require,module,exports){
    var LowpassFilter = require('./src/LowpassFilter');
    
    //export the module
    module.exports = LowpassFilter;
    
    
    },{"./src/LowpassFilter":3}],3:[function(require,module,exports){
    /*
     *  Copyright (c) 2010-2017 Tom Misawa(riversun.org@gmail.com)
     *  
     *  Permission is hereby granted, free of charge, to any person obtaining a
     *  copy of this software and associated documentation files (the "Software"),
     *  to deal in the Software without restriction, including without limitation
     *  the rights to use, copy, modify, merge, publish, distribute, sublicense,
     *  and/or sell copies of the Software, and to permit persons to whom the
     *  Software is furnished to do so, subject to the following conditions:
     *  
     *  The above copyright notice and this permission notice shall be included in
     *  all copies or substantial portions of the Software.
     *  
     *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
     *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
     *  DEALINGS IN THE SOFTWARE.
     *  
     */
    var LowpassFilter = (function () {
    
            /**
             * Calculate Simple Moving Average
             * @param params
             * @constructor
             */
            function LowpassFilter(params) {
                this.mSamplingRange = 0;
                this.mSamplingBuffer = [];
                this.mCurrentFilterVal = 0;
                this.mCurrentDataNumber = 0;
                this.setSamplingRange(20);
    
                //set linear weight moving average logic as default
                this.calcLogic = this.LinearWeightAverage;
                //this.calcLogic = this.SimpleAverage;
            }
    
            LowpassFilter.prototype.setLogic = function (func) {
                var _this = this;
                _this.calcLogic = func;
            };
    
            LowpassFilter.prototype.LinearWeightAverage = function (numerator, range, n, samplingBuffer, denominator) {
                numerator += (range - n) * samplingBuffer[n];
                denominator += (range - n);
                return {numerator: numerator, denominator: denominator};
            };
    
            LowpassFilter.prototype.SimpleAverage = function (numerator, range, n, samplingBuffer, denominator) {
                numerator += samplingBuffer[n];
                denominator = range;
                return {numerator: numerator, denominator: denominator};
            };
    
            /**
             * Set sampling range(DEFAULT is 20)
             * @param range
             */
            LowpassFilter.prototype.setSamplingRange = function (range) {
                var _this = this;
                _this.mSamplingRange = range;
                _this.mSamplingBuffer = new Array(_this.mSamplingRange);
            };
    
            /**
             * Returns total count
             * @param range
             * @returns {number}
             */
            LowpassFilter.prototype.getTotalCount = function (range) {
                var _this = this;
                return _this.mCurrentDataNumber;
            };
    
            /**
             * Get the latest filtered(linear weighted) value
             *
             * @return
             */
            LowpassFilter.prototype.getFilteredValue = function () {
                var _this = this;
                var filteredVal = _this.mCurrentFilterVal;
                return filteredVal;
            };
    
            /**
             * Put the current value to filter
             *
             * @param val
             */
            LowpassFilter.prototype.putValue = function (val) {
                var _this = this;
                _this.mCurrentFilterVal = _this.filter(val, _this.mSamplingBuffer);
            };
    
            /**
             * Get raw buffer
             * @returns {Array}
             */
            LowpassFilter.prototype.getSampingBuffer = function () {
                var _this = this;
                return _this.mSamplingBuffer;
            };
    
            /**
             * Get sampling range you specified
             * @returns {number|*}
             */
            LowpassFilter.prototype.getSamplingRange = function () {
                var _this = this;
                return _this.mSamplingRange;
            };
    
            /**
             * Fill out buffer by specified value
             * @param val
             */
            LowpassFilter.prototype.fillValue = function (val) {
                var _this = this;
                for (var i = 0; i < _this.mSamplingBuffer.length; i++) {
                    _this.mSamplingBuffer[i] = val;
                }
            };
    
    
            /**
             * Do filter
             * @param inputValue the latest(current) value
             * @param samplingBuffer
             * @returns {number}
             */
            LowpassFilter.prototype.filter = function (inputValue, samplingBuffer) {
                var _this = this;
    
                _this.mCurrentDataNumber++;
    
                var range = samplingBuffer.length;
    
                if (_this.mCurrentDataNumber < range) {
                    range = _this.mCurrentDataNumber;
                }
    
                for (var i = (range - 1) - 1; i >= 0; i--) {
                    // copy next element to prev element
                    samplingBuffer[i + 1] = samplingBuffer[i];
                }
    
                // Add current value to last
                samplingBuffer[0] = inputValue;
    
                var numerator = 0;
    
                var denominator = 0;
    
                for (var n = 0; n < range; n++) {
    
                    var result = _this.calcLogic(numerator, range, n, samplingBuffer, denominator);
                    numerator = result.numerator;
                    denominator = result.denominator;
    
                }
    
                var currentOutputVal = numerator / denominator;
    
                return currentOutputVal;
    
            };
    
            return LowpassFilter;
        }()
    );
    
    if (typeof(module) !== "undefined") {
        module.exports = LowpassFilter;
    }
    },{}],4:[function(require,module,exports){
    /*
     *
     * Copyright 2016-2017 Tom Misawa, riversun.org@gmail.com
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy of
     * this software and associated documentation files (the "Software"), to deal in the
     * Software without restriction, including without limitation the rights to use,
     * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
     * Software, and to permit persons to whom the Software is furnished to do so,
     * subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
     *  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
     * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
     * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
     * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
     * IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     *
     */
    var LowpassFilter = require('lowpassf');
    
    /**
     * Face
     *
     * @author Tom Misawa
     */
    var Face = (function () {
    
            function Face(params) {
    
                //Maximum number of samples when calculating moving average
                var LOWPASS_SAMPLING_RANGE = 10;
    
                //The maximum moving distance(ratio of the width of the screen)
                // that can be recognized as the same face.
                var DEFAULT_MAX_MOVING_DISTANCE_RATIO = 0.15;
    
                this.faceId = "NOINDEX";
                this.faceIndex = -1;
                this.x = 0;
                this.y = 0;
                this.width = 0;
                this.height = 0;
    
                //A flag indicating whether or not the position of the cached face has been updated is first set to false
                this._isUpdatedFacePosition = false;
    
                //setup lowpass filters
                this._lowpass4x = new LowpassFilter();
                this._lowpass4x.setSamplingRange(LOWPASS_SAMPLING_RANGE);
                this._lowpass4y = new LowpassFilter();
                this._lowpass4y.setSamplingRange(LOWPASS_SAMPLING_RANGE);
    
                this._lowpass4w = new LowpassFilter();
                this._lowpass4w.setSamplingRange(LOWPASS_SAMPLING_RANGE);
    
                this._lowpass4h = new LowpassFilter();
                this._lowpass4h.setSamplingRange(LOWPASS_SAMPLING_RANGE);
    
    
                //The maximum moving distance(ratio of the width of the screen)
                // that can be recognized as the same face.
                if (params && params.trackingDistanceRatio) {
                    this.maxMovingDistanceRatio = params.trackingDistanceRatio;
                } else {
                    this.maxMovingDistanceRatio = DEFAULT_MAX_MOVING_DISTANCE_RATIO;
                }
    
            }
    
            
            var latestUpdatedPosition;
            /**
             * Update coordinates
             * 
             * 1.Enter the latest coordinates(x,y) into the lowpass filter.
             * 2.Update coordinates(this.x,this.y) with a value filtered by lowpass filter.
             *
             * @param x
             * @param y
             */
            Face.prototype.updatePos = function (x, y) {
                if(this.latestUpdatedPosition && this.isClosingToPositionThan(
                    {x: this._lowpass4x.getFilteredValue(), y: this._lowpass4y.getFilteredValue()},
                    {x, y}, this.latestUpdatedPosition )) {
                    var _this = this;
    
                    // 1.Enter the latest coordinates(x,y) into the lowpass filter.
                    _this._lowpass4x.putValue(this.latestUpdatedPosition.x);
                    _this._lowpass4y.putValue(this.latestUpdatedPosition.y);
    
                    // 2.Update coordinates(this.x,this.y) with a value filtered by lowpass filter.
                    _this.x = _this._lowpass4x.getFilteredValue();
                    _this.y = _this._lowpass4y.getFilteredValue();
                }
                this.latestUpdatedPosition = {x, y};
            };
    
            Face.prototype.isClosingToPositionThan = function (refPosition, newPosition, latestPosition) {
                var distRefNew = Math.sqrt(Math.pow(refPosition.x - newPosition.x, 2) + Math.pow(refPosition.y - newPosition.y, 2));
                var distRefLatest = Math.sqrt(Math.pow(refPosition.x - latestPosition.x, 2) + Math.pow(refPosition.y - latestPosition.y, 2));
                return distRefLatest < distRefNew;
            };
    
            //
            /**
             * Update width/height
             *
             * @see  #updatePos
             * @param width
             * @param height
             */
            Face.prototype.updateSize = function (width, height) {
                var _this = this;
    
                _this._lowpass4w.putValue(width);
                _this._lowpass4h.putValue(height);
    
                _this.width = _this._lowpass4w.getFilteredValue();
                _this.height = _this._lowpass4h.getFilteredValue();
            };
    
    
            /**
             * Update cacehed face's position.
             * The detected face's position CLOSEST to the cached face's position is considered as the destination of the cached face.
             * 
             * @param detectedNewFaces latest faces detected(array)
             * @returns {boolean}
             */
            Face.prototype.updateFace = function (detectedNewFaces) {
    
                var _this = this;
                var minDistance = Number.MAX_SAFE_INTEGER;
                var minDistanceFace = null;
    
    
                if (detectedNewFaces[0]) {
                    _this.updatePos(detectedNewFaces[0].x, detectedNewFaces[0].y);
                    _this.updateSize(detectedNewFaces[0].width, detectedNewFaces[0].height);
                }
    
    
            };
            return Face;
        }()
    );
    
    module.exports = Face;
    
    },{"lowpassf":2}],5:[function(require,module,exports){
    /*
     *
     * Copyright 2016-2017 Tom Misawa, riversun.org@gmail.com
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy of
     * this software and associated documentation files (the "Software"), to deal in the
     * Software without restriction, including without limitation the rights to use,
     * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
     * Software, and to permit persons to whom the Software is furnished to do so,
     * subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
     *  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
     * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
     * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
     * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
     * IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     *
     */
    var LowpassFilter = require('lowpassf');
    var Face = require('./Face.js');
    var ObjectDetect = require('./objectdetect.js');
    var FrontalFaceAlt = require('./objectdetect.frontalface_alt.js');
    
    /**
     * Face detector
     *
     * @author Tom Misawa
     */
    var FaceDetector = (function () {
    
            /**
             * Multi Face Detector / Tracker
             *
             * @param params
             * @constructor
             */
            function FaceDetector(params) {
    
                //After detecting the face for more than a certain number(default is 50) of times,
                // when it stabilizes, the face integration logic starts.
                this.MIN_NUM_OF_PREPARE_DETECTION = 50;
    
                this.DEFAULT_MAX_MOVING_DISTANCE_RATIO = 0.15;
    
                //For example, if detectHeight = 60,
                //face search uses the rectangle image that is shrinked to 60pixels height.
                //The longer the length of the detectHeight, the greater the load , longer the processing time.
    
                this.detectHeight = 60;
                
                if (params && params.detectHeight) {
                    this.detectHeight = params.detectHeight;
                }
    
                //this value will be automatically adjusted.
                this.detectWidth = null;
    
                this.video = params.video;
    
                //Booleanvalue for mirroring
                this.flipLeftRight = params.flipUpsideDown;
    
                //Boolean value for upside-down
                this.flipUpsideDown = params.flipUpsideDown;
    
                this._onFaceUpdatedCallback = null;
                this._onFaceAddedCallback = null;
                this._onFaceLostCallback = null;
    
                this._lowpassFilter4faceCount = new LowpassFilter();
                this._lowpassFilter4faceCount.setSamplingRange(200);
    
                this._cachedFaces = {};
    
                this._onSnapShotCallback = null;
                this._snapShotCanvas = null;
                this._snapShotContext = null;
    
                this._ttlFaceIndex = 0;
    
                //NodeJS timer (interval)
                this.updateTimer = undefined;
                //Start with a low update delay, in order to quickly have the 50 first pictures
                this.updateDelayLocal = 1;
                //To register the specified update delay
                this.updateDelayParam = undefined;
    
            }
    
            //[begin]setter for facial detection callback ///////////////////////////////
    
            /**
             * Set callback when face detection processing is updated
             *
             * @param callbackFunc
             */
            FaceDetector.prototype.setOnFaceUpdatedCallback = function (callbackFunc) {
                var _this = this;
                _this._onFaceUpdatedCallback = callbackFunc;
            };
    
            /**
             * Set callback when new face is found
             *
             * @param callbackFunc
             */
            FaceDetector.prototype.setOnFaceAddedCallback = function (callbackFunc) {
                var _this = this;
                _this._onFaceAddedCallback = callbackFunc;
            };
    
            /**
             * Set callback when face is lost
             *
             * @param callbackFunc
             */
            FaceDetector.prototype.setOnFaceLostCallback = function (callbackFunc) {
                var _this = this;
                _this._onFaceLostCallback = callbackFunc;
            };
            //[end]setter for facial detection callback ///////////////////////////////
    
            /**
             * Start face detection
             */
            FaceDetector.prototype.startDetecting = function (updateDelay = 60) {
                this.updateDelayParam = updateDelay;
                if (this.updateTimer) {
                    clearInterval(this.updateTimer);
                }
                var _this = this;
                this.updateTimer = setInterval(function () {
                    _this.doRawDetectionLoop(_this)
                }, _this.updateDelayLocal);
            };
            
            /**
             * Stop face detection
             */
            FaceDetector.prototype.stop = function () {
                if (this.updateTimer) {
                    clearInterval(this.updateTimer);
                    this.updateTimer = undefined;
                }
                if(this._onFaceLostCallback) {
                    this._onFaceLostCallback();
                }
            };
    
            FaceDetector.prototype.isRunning = function () {
                return this.updateTimer !== undefined;
            }
    
            FaceDetector.prototype.doRawDetectionLoop = function (_this) {
    
                //(Pay attention to call with "bind" on the caller so that following "this" points "FaceDetector")
                //var _this = this;
    
                //requestAnimationFrame(_this.doRawDetectionLoop.bind(_this));
    
                var video = _this.video;
    
                if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
                    // - if video stream is ready
    
                    if (!_this.detector) {
                        // - if detector is not instanciated
    
                        //Use the tilde (~~) to round the decimal point of the value
                        _this.detectWidth = ~~(_this.detectHeight * video.videoWidth / video.videoHeight);
    
                        //Once know the size of the video, prepare the detector:
                        _this.detector = new ObjectDetect.detector(_this.detectWidth, _this.detectHeight, 1.1, new FrontalFaceAlt());
                    }
    
    
                    if (_this._onSnapShotCallback) {
                        // - if snapshotCallback set
    
                        //capture image from media stream.
                        _this._snapShotContext.drawImage(video, 0, 0, _this._snapShotCanvas.width, _this._snapShotCanvas.height);
                        var snapshotImageData = _this._snapShotContext.getImageData(0, 0, _this._snapShotCanvas.width, _this._snapShotCanvas.height);
    
                        this._onSnapShotCallback(snapshotImageData);
                    }
    
                    // Perform the actual detection
    
                    
                    var coords = _this.detector.detect(video, 1);
    
                    //detected faces
                    var rawDetectedFaces = [];
    
                    if (coords[0]) {
                        //- when one or more faces are found
    
                        var numOfFacesFound = coords.length;
    
                        for (var i = 0; i < numOfFacesFound; i++) {
    
                            //Coordinate information of the i-th face
                            var coord = coords[i];
    
                            var faceArea = {};
    
                            if (_this.flipUpsideDown) {
    
                                // - if do upside-down
                                // then coordinate (0,0) is set at (left,bottom)
    
                                if (_this.flipLeftRight) {
                                    // - if flip left-right
                                    // then the position that becomes the starting point of the position (x, y) is (left, bottom) of the face area.
                                    faceArea = {
                                        x: (_this.detectWidth - coord[0]) - coord[2],
                                        y: (_this.detectHeight - (coord[1] + coord[3])),
                                        width: coord[2],
                                        height: coord[3],
                                        rawX: coord[0],
                                        rawY: coord[1],
                                    };
    
                                } else {
                                    //- if normal(non-mirrored)
                                    faceArea = {
                                        x: coord[0],
                                        y: (_this.detectHeight - (coord[1] + coord[3])),
                                        width: coord[2],
                                        height: coord[3],
                                        rawX: coord[0],
                                        rawY: coord[1],
                                    };
    
                                }
                            } else {
    
                                //- if normal(do not upside-down)
    
                                if (_this.flipLeftRight) {
                                    // - if flip left-right
                                    // then the position that becomes the starting point of the position (x, y) is (left, bottom) of the face area.
                                    faceArea = {
                                        x: (_this.detectWidth - coord[0]) - coord[2],
                                        y: coord[1],
                                        width: coord[2],
                                        height: coord[3],
                                        rawX: coord[0],
                                        rawY: coord[1],
                                    };
    
                                } else {
                                    //- if normal(non-mirrored)
                                    faceArea = {
                                        x: coord[0],
                                        y: coord[1],
                                        width: coord[2],
                                        height: coord[3],
                                        rawX: coord[0],
                                        rawY: coord[1],
                                    };
    
                                }
                            }
    
                            //set coordinate range to (0.0-1.0)
                            faceArea.x = (faceArea.x / _this.detectWidth);
                            faceArea.y = (faceArea.y / _this.detectHeight);
                            faceArea.width = (faceArea.width / _this.detectWidth);
                            faceArea.height = (faceArea.height / _this.detectHeight);
    
                            if ((0 < faceArea.x && faceArea.x < 1.0 ) &&
                                (0 < faceArea.y && faceArea.y < 1.0)) {
                                //- When x, y are within the specified range
                                rawDetectedFaces.push(faceArea);
                            }
    
                        }
    
                        //Sort in ascending(small number->big number) order of x coordinates
                        rawDetectedFaces.sort(function (a, b) {
                            if (a.x < b.x) return -1;
                            if (a.x > b.x) return 1;
                            return 0;
                        });
    
                        _this.doTrackDetectedFaces(rawDetectedFaces);
    
    
                    } else {
    
                        //- If there are 0 face detection
                        // return an empty array
                        _this.doTrackDetectedFaces([]);
                    }
                }
    
            };
    
    
            /**
             * Track(follow) the movement of the face as much as possible
             * @param rawDetectedFaces (array)
             */
            FaceDetector.prototype.doTrackDetectedFaces = function (rawDetectedFaces) {
                var _this = this;
    
                //Number of faces detected NOW
                var numOfCrrDetectedFaces = rawDetectedFaces.length;
    
                //Smooth the number of detected faces by using lowpass filter(moving average filter)
                //Because a face may sometimes be lost or detect for a moment due to the influence of detection noise
                _this._lowpassFilter4faceCount.putValue(numOfCrrDetectedFaces);
    
    
                //After detecting the face for more than a certain number of times,
                // when it stabilizes, the face integration logic starts.
                if (_this._lowpassFilter4faceCount.getTotalCount() > _this.MIN_NUM_OF_PREPARE_DETECTION) {
    
                    //Reload the process in order to take in account the new rate
                    if(_this.updateDelayParam !== _this.updateDelayLocal) {
                        _this.updateDelayLocal = _this.updateDelayParam;
                        _this.startDetecting(_this.updateDelayParam);
                    }
    
                    //Calculate moving average by chronologically counting the number of detected faces, and let it be the number of faces.
                    //(The reason why the weighted average is adopted for the number of faces
                    // is because the face suddenly increases or decreases due to noise / chattering.
                    var averageFaceCount = _this._lowpassFilter4faceCount.getFilteredValue();
    
                    //Round the average face number, if it is 1.5 or more, make two faces visible
                    var averageFaceCountRounded = Math.round(averageFaceCount);
    
                    var newFace, cachedFace;
    
                    var trackingFaces = [];
    
                    var cacheKey;
    
                    for (cacheKey in _this._cachedFaces) {
    
                        cachedFace = _this._cachedFaces[cacheKey];
    
                        //A flag indicating whether or not the position of the cached face has been updated is first set to false
                        cachedFace._isUpdatedFacePosition = false;
    
                        // Update cacehed face's position.
                        // The detected face's position CLOSEST to the cached face's position is considered as the destination of the cached face.
                        var updateSuccess = cachedFace.updateFace(rawDetectedFaces);
    
                        if (updateSuccess) {
                            // - If cached face position update success
    
                            // then update flag is set to true
                            cachedFace._isUpdatedFacePosition = true;
                            trackingFaces.push(cachedFace);
                        }
    
                    }
    
                    //When lost face for a moment
                    for (cacheKey in _this._cachedFaces) {
    
                        cachedFace = _this._cachedFaces[cacheKey];
    
                        if (cachedFace._isUpdatedFacePosition == false) {
                            //- If there are faces that have not been matched yet at this point
    
                            //Judging that it was lost for a moment, return currently cached face.
                            trackingFaces.push(cachedFace);
                        }
    
                    }
    
                    //Sort
                    trackingFaces.sort(function (a, b) {
                        if (a.x < b.x) return -1;
                        if (a.x > b.x) return 1;
                        return 0;
                    });
    
    
                    //Confirm increase and decrease of face
                    if (Object.keys(_this._cachedFaces).length < averageFaceCountRounded) {
                        //- when the number of faces increases
                        // (When the number of detected faces is larger than the cached face)
    
                        var addedFaces = [];
    
                        for (var i = 0; i < numOfCrrDetectedFaces; i++) {
    
                            newFace = rawDetectedFaces[i];
    
                            if (newFace.consumed) {
                                //- When this face has already been processed (After being registered to a cached face list)
                                continue;
                            } else {
                                //- Not registered yet
                                newFace.consumed = true;
                            }
    
                            //create Face object for newly discovered face
                            var newFaceToCache = new Face(
                                {trackingDistanceRatio: _this.DEFAULT_MAX_MOVING_DISTANCE_RATIO}
                            );
    
                            newFaceToCache.updatePos(newFace.x, newFace.y);
                            newFaceToCache.updateSize(newFace.width, newFace.height);
    
                            //Assign the face number for tracking
                            newFaceToCache.faceId = "FACE_" + _this._ttlFaceIndex;
                            newFaceToCache.faceIndex = _this._ttlFaceIndex;
    
                            //Increment the total number of faces found  (Since it is not identifying individual face,
                            // even if they are the same (person's) face. So after the same person goes out of the camera screen,
                            // and once they come back again, this library regard it as different face)
                            _this._ttlFaceIndex++;
    
                            _this._cachedFaces[newFaceToCache.faceId] = newFaceToCache;
    
                            //Cache a newly discovered face
                            addedFaces.push(newFaceToCache);
                        }
    
                        if (_this._onFaceAddedCallback) {
                            if (addedFaces.length > 0) {
                                _this._onFaceAddedCallback(addedFaces, trackingFaces);
                            }
                        }
    
                    } else if (Object.keys(_this._cachedFaces).length > averageFaceCountRounded) {
                        //- When the number of faces has decreased
                        // (If the number of faces detected is less than the cached face)
    
                        var lostFaces = [];
    
                        for (cacheKey in _this._cachedFaces) {
    
                            // "cachedFaces" means "tracking faces"
                            cachedFace = _this._cachedFaces[cacheKey];
    
                            if (cachedFace._isUpdatedFacePosition == false) {
                                delete _this._cachedFaces[cacheKey];
                                lostFaces.push(cachedFace);
                            }
                        }
    
    
                        if (_this._onFaceLostCallback) {
                            if (lostFaces.length > 0) {
                                _this._onFaceLostCallback(lostFaces, trackingFaces);
                            }
                        }
    
                        //When losing a face, stop processing here and prevent calling "onFaceUpdatecallback"
                        return;
                    }
    
                    if (_this._onFaceUpdatedCallback) {
                        if (trackingFaces.length > 0) {
                            _this._onFaceUpdatedCallback(trackingFaces);
                        }
                    }
    
                }
            };
    
            /**
             *
             * Set still image snapshot callback
             * @param callbackFunc
             * @param width width of captured image
             * @param height height of captured image
             */
            FaceDetector.prototype.setOnSnapShotCallback = function (callbackFunc, width, height) {
                var _this = this;
                _this._onSnapShotCallback = callbackFunc;
    
                this._snapShotCanvas = document.createElement("canvas");
                this._snapShotCanvas.width = width;
                this._snapShotCanvas.height = height;
                this._snapShotContext = this._snapShotCanvas.getContext("2d");
    
            };
    
            /**
             * (Optional)
             * Detect skin area from Input Image
             * @param inputImage
             * @param outputImage detected skin-area is set to 255,non-skin-area is set to zero.
             * @returns {*}
             *
             * Example code for creating outputImage
             *  <code>
             *    var ctx = canvas.getContext("2d");
             *    var outputImage=ctx.createImageData(inputImage);
             *  </code>
             */
            FaceDetector.prototype.detectSkinArea = function (inputImage, outputImage) {
                var inp = inputImage.data, out = outputImage.data;
    
    
                var r, g, b, h, s, v, colorVal;
                var i;
                for (i = 0; i < inp.length; i += 4) {
    
                    r = inp[i];
                    g = inp[i + 1];
                    b = inp[i + 2];
    
                    var h, // 0-360
                        s, // 0.0-1.0
                        v, // 0.0-1.0
                        max = Math.max(Math.max(r, g), b),
                        min = Math.min(Math.min(r, g), b);
    
                    if (max == min) {
                        h = 0;
                    } else if (max == r) {
                        h = 60 * (g - b) / (max - min) + 0;
                    } else if (max == g) {
                        h = (60 * (b - r) / (max - min)) + 120;
                    } else {
                        h = (60 * (r - g) / (max - min)) + 240;
                    }
    
                    while (h < 0) {
                        h += 360;
                    }
                    s = (max == 0) ? 0 : (max - min) / max;//* 255;
                    v = max / 255;
    
                    colorVal = 0;
    
                    //specify skin-color range
                    if (0 < h && h < 50 && 0.23 < s && s < 0.68) {
                        colorVal = 255;
                    } else {
                        colorVal = 128;
                    }
    
                    out[i] = colorVal;     //red
                    out[i + 1] = colorVal; //green
                    out[i + 2] = colorVal; //blue
                    out[i + 3] = 255;      //alpha
                }
    
                outputImage.width = inputImage.width;
                outputImage.height = inputImage.height;
    
                return outputImage;
            };
    
            return FaceDetector;
        }()
    );
    
    module.exports = FaceDetector;
    },{"./Face.js":4,"./objectdetect.frontalface_alt.js":6,"./objectdetect.js":7,"lowpassf":2}],6:[function(require,module,exports){
    /**
     * Stump-based 20x20 gentle adaboost frontal face detector. Created by Rainer Lienhart.
    
     IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
    
     By downloading, copying, installing or using the software you agree to this license.
     If you do not agree to this license, do not download, install,
     copy or use the software.
    
    
     Intel License Agreement
     For Open Source Computer Vision Library
    
     Copyright (C) 2000, Intel Corporation, all rights reserved.
     Third party copyrights are property of their respective owners.
    
     Redistribution and use in source and binary forms, with or without modification,
     are permitted provided that the following conditions are met:
    
     * Redistribution's of source code must retain the above copyright notice,
     this list of conditions and the following disclaimer.
    
     * Redistribution's in binary form must reproduce the above copyright notice,
     this list of conditions and the following disclaimer in the documentation
     and/or other materials provided with the distribution.
    
     * The name of Intel Corporation may not be used to endorse or promote products
     derived from this software without specific prior written permission.
    
     This software is provided by the copyright holders and contributors "as is" and
     any express or implied warranties, including, but not limited to, the implied
     warranties of merchantability and fitness for a particular purpose are disclaimed.
     In no event shall the Intel Corporation or contributors be liable for any direct,
     indirect, incidental, special, exemplary, or consequential damages
     (including, but not limited to, procurement of substitute goods or services;
     loss of use, data, or profits; or business interruption) however caused
     and on any theory of liability, whether in contract, strict liability,
     or tort (including negligence or otherwise) arising in any way out of
     the use of this software, even if advised of the possibility of such damage.
     */
    var ClassifierFrontalFace=(function () {
    
            function ClassifierFrontalFace() {
    
                var classifier = [20, 20, 0.8226894140243530, 3, 0, 2, 3, 7, 14, 4, -1., 3, 9, 14, 2, 2., 4.0141958743333817e-003, 0.0337941907346249, 0.8378106951713562, 0, 2, 1, 2, 18, 4, -1., 7, 2, 6, 4, 3., 0.0151513395830989, 0.1514132022857666, 0.7488812208175659, 0, 2, 1, 7, 15, 9, -1., 1, 10, 15, 3, 3., 4.2109931819140911e-003, 0.0900492817163467, 0.6374819874763489, 6.9566087722778320, 16, 0, 2, 5, 6, 2, 6, -1., 5, 9, 2, 3, 2., 1.6227109590545297e-003, 0.0693085864186287, 0.7110946178436279, 0, 2, 7, 5, 6, 3, -1., 9, 5, 2, 3, 3., 2.2906649392098188e-003, 0.1795803010463715, 0.6668692231178284, 0, 2, 4, 0, 12, 9, -1., 4, 3, 12, 3, 3., 5.0025708042085171e-003, 0.1693672984838486, 0.6554006934165955, 0, 2, 6, 9, 10, 8, -1., 6, 13, 10, 4, 2., 7.9659894108772278e-003, 0.5866332054138184, 0.0914145186543465, 0, 2, 3, 6, 14, 8, -1., 3, 10, 14, 4, 2., -3.5227010957896709e-003, 0.1413166970014572, 0.6031895875930786, 0, 2, 14, 1, 6, 10, -1., 14, 1, 3, 10, 2., 0.0366676896810532, 0.3675672113895416, 0.7920318245887756, 0, 2, 7, 8, 5, 12, -1., 7, 12, 5, 4, 3., 9.3361474573612213e-003, 0.6161385774612427, 0.2088509947061539, 0, 2, 1, 1, 18, 3, -1., 7, 1, 6, 3, 3., 8.6961314082145691e-003, 0.2836230993270874, 0.6360273957252502, 0, 2, 1, 8, 17, 2, -1., 1, 9, 17, 1, 2., 1.1488880263641477e-003, 0.2223580926656723, 0.5800700783729553, 0, 2, 16, 6, 4, 2, -1., 16, 7, 4, 1, 2., -2.1484689787030220e-003, 0.2406464070081711, 0.5787054896354675, 0, 2, 5, 17, 2, 2, -1., 5, 18, 2, 1, 2., 2.1219060290604830e-003, 0.5559654831886292, 0.1362237036228180, 0, 2, 14, 2, 6, 12, -1., 14, 2, 3, 12, 2., -0.0939491465687752, 0.8502737283706665, 0.4717740118503571, 0, 3, 4, 0, 4, 12, -1., 4, 0, 2, 6, 2., 6, 6, 2, 6, 2., 1.3777789426967502e-003, 0.5993673801422119, 0.2834529876708984, 0, 2, 2, 11, 18, 8, -1., 8, 11, 6, 8, 3., 0.0730631574988365, 0.4341886043548584, 0.7060034275054932, 0, 2, 5, 7, 10, 2, -1., 5, 8, 10, 1, 2., 3.6767389974556863e-004, 0.3027887940406799, 0.6051574945449829, 0, 2, 15, 11, 5, 3, -1., 15, 12, 5, 1, 3., -6.0479710809886456e-003, 0.1798433959484100, 0.5675256848335266, 9.4985427856445313, 21, 0, 2, 5, 3, 10, 9, -1., 5, 6, 10, 3, 3., -0.0165106896311045, 0.6644225120544434, 0.1424857974052429, 0, 2, 9, 4, 2, 14, -1., 9, 11, 2, 7, 2., 2.7052499353885651e-003, 0.6325352191925049, 0.1288477033376694, 0, 2, 3, 5, 4, 12, -1., 3, 9, 4, 4, 3., 2.8069869149476290e-003, 0.1240288019180298, 0.6193193197250366, 0, 2, 4, 5, 12, 5, -1., 8, 5, 4, 5, 3., -1.5402400167658925e-003, 0.1432143002748489, 0.5670015811920166, 0, 2, 5, 6, 10, 8, -1., 5, 10, 10, 4, 2., -5.6386279175058007e-004, 0.1657433062791824, 0.5905207991600037, 0, 2, 8, 0, 6, 9, -1., 8, 3, 6, 3, 3., 1.9253729842603207e-003, 0.2695507109165192, 0.5738824009895325, 0, 2, 9, 12, 1, 8, -1., 9, 16, 1, 4, 2., -5.0214841030538082e-003, 0.1893538981676102, 0.5782774090766907, 0, 2, 0, 7, 20, 6, -1., 0, 9, 20, 2, 3., 2.6365420781075954e-003, 0.2309329062700272, 0.5695425868034363, 0, 2, 7, 0, 6, 17, -1., 9, 0, 2, 17, 3., -1.5127769438549876e-003, 0.2759602069854736, 0.5956642031669617, 0, 2, 9, 0, 6, 4, -1., 11, 0, 2, 4, 3., -0.0101574398577213, 0.1732538044452667, 0.5522047281265259, 0, 2, 5, 1, 6, 4, -1., 7, 1, 2, 4, 3., -0.0119536602869630, 0.1339409947395325, 0.5559014081954956, 0, 2, 12, 1, 6, 16, -1., 14, 1, 2, 16, 3., 4.8859491944313049e-003, 0.3628703951835632, 0.6188849210739136, 0, 3, 0, 5, 18, 8, -1., 0, 5, 9, 4, 2., 9, 9, 9, 4, 2., -0.0801329165697098, 0.0912110507488251, 0.5475944876670837, 0, 3, 8, 15, 10, 4, -1., 13, 15, 5, 2, 2., 8, 17, 5, 2, 2., 1.0643280111253262e-003, 0.3715142905712128, 0.5711399912834168, 0, 3, 3, 1, 4, 8, -1., 3, 1, 2, 4, 2., 5, 5, 2, 4, 2., -1.3419450260698795e-003, 0.5953313708305359, 0.3318097889423370, 0, 3, 3, 6, 14, 10, -1., 10, 6, 7, 5, 2., 3, 11, 7, 5, 2., -0.0546011403203011, 0.1844065934419632, 0.5602846145629883, 0, 2, 2, 1, 6, 16, -1., 4, 1, 2, 16, 3., 2.9071690514683723e-003, 0.3594244122505188, 0.6131715178489685, 0, 2, 0, 18, 20, 2, -1., 0, 19, 20, 1, 2., 7.4718717951327562e-004, 0.5994353294372559, 0.3459562957286835, 0, 2, 8, 13, 4, 3, -1., 8, 14, 4, 1, 3., 4.3013808317482471e-003, 0.4172652065753937, 0.6990845203399658, 0, 2, 9, 14, 2, 3, -1., 9, 15, 2, 1, 3., 4.5017572119832039e-003, 0.4509715139865875, 0.7801457047462463, 0, 2, 0, 12, 9, 6, -1., 0, 14, 9, 2, 3., 0.0241385009139776, 0.5438212752342224, 0.1319826990365982, 18.4129695892333980, 39, 0, 2, 5, 7, 3, 4, -1., 5, 9, 3, 2, 2., 1.9212230108678341e-003, 0.1415266990661621, 0.6199870705604553, 0, 2, 9, 3, 2, 16, -1., 9, 11, 2, 8, 2., -1.2748669541906565e-004, 0.6191074252128601, 0.1884928941726685, 0, 2, 3, 6, 13, 8, -1., 3, 10, 13, 4, 2., 5.1409931620582938e-004, 0.1487396955490112, 0.5857927799224854, 0, 2, 12, 3, 8, 2, -1., 12, 3, 4, 2, 2., 4.1878609918057919e-003, 0.2746909856796265, 0.6359239816665649, 0, 2, 8, 8, 4, 12, -1., 8, 12, 4, 4, 3., 5.1015717908740044e-003, 0.5870851278305054, 0.2175628989934921, 0, 3, 11, 3, 8, 6, -1., 15, 3, 4, 3, 2., 11, 6, 4, 3, 2., -2.1448440384119749e-003, 0.5880944728851318, 0.2979590892791748, 0, 2, 7, 1, 6, 19, -1., 9, 1, 2, 19, 3., -2.8977119363844395e-003, 0.2373327016830444, 0.5876647233963013, 0, 2, 9, 0, 6, 4, -1., 11, 0, 2, 4, 3., -0.0216106791049242, 0.1220654994249344, 0.5194202065467835, 0, 2, 3, 1, 9, 3, -1., 6, 1, 3, 3, 3., -4.6299318782985210e-003, 0.2631230950355530, 0.5817409157752991, 0, 3, 8, 15, 10, 4, -1., 13, 15, 5, 2, 2., 8, 17, 5, 2, 2., 5.9393711853772402e-004, 0.3638620078563690, 0.5698544979095459, 0, 2, 0, 3, 6, 10, -1., 3, 3, 3, 10, 2., 0.0538786612451077, 0.4303531050682068, 0.7559366226196289, 0, 2, 3, 4, 15, 15, -1., 3, 9, 15, 5, 3., 1.8887349870055914e-003, 0.2122603058815002, 0.5613427162170410, 0, 2, 6, 5, 8, 6, -1., 6, 7, 8, 2, 3., -2.3635339457541704e-003, 0.5631849169731140, 0.2642767131328583, 0, 3, 4, 4, 12, 10, -1., 10, 4, 6, 5, 2., 4, 9, 6, 5, 2., 0.0240177996456623, 0.5797107815742493, 0.2751705944538117, 0, 2, 6, 4, 4, 4, -1., 8, 4, 2, 4, 2., 2.0543030404951423e-004, 0.2705242037773132, 0.5752568840980530, 0, 2, 15, 11, 1, 2, -1., 15, 12, 1, 1, 2., 8.4790197433903813e-004, 0.5435624718666077, 0.2334876954555512, 0, 2, 3, 11, 2, 2, -1., 3, 12, 2, 1, 2., 1.4091329649090767e-003, 0.5319424867630005, 0.2063155025243759, 0, 2, 16, 11, 1, 3, -1., 16, 12, 1, 1, 3., 1.4642629539594054e-003, 0.5418980717658997, 0.3068861067295075, 0, 3, 3, 15, 6, 4, -1., 3, 15, 3, 2, 2., 6, 17, 3, 2, 2., 1.6352549428120255e-003, 0.3695372939109802, 0.6112868189811707, 0, 2, 6, 7, 8, 2, -1., 6, 8, 8, 1, 2., 8.3172752056270838e-004, 0.3565036952495575, 0.6025236248970032, 0, 2, 3, 11, 1, 3, -1., 3, 12, 1, 1, 3., -2.0998890977352858e-003, 0.1913982033729553, 0.5362827181816101, 0, 2, 6, 0, 12, 2, -1., 6, 1, 12, 1, 2., -7.4213981861248612e-004, 0.3835555016994476, 0.5529310107231140, 0, 2, 9, 14, 2, 3, -1., 9, 15, 2, 1, 3., 3.2655049581080675e-003, 0.4312896132469177, 0.7101895809173584, 0, 2, 7, 15, 6, 2, -1., 7, 16, 6, 1, 2., 8.9134991867467761e-004, 0.3984830975532532, 0.6391963958740234, 0, 2, 0, 5, 4, 6, -1., 0, 7, 4, 2, 3., -0.0152841797098517, 0.2366732954978943, 0.5433713793754578, 0, 2, 4, 12, 12, 2, -1., 8, 12, 4, 2, 3., 4.8381411470472813e-003, 0.5817500948905945, 0.3239189088344574, 0, 2, 6, 3, 1, 9, -1., 6, 6, 1, 3, 3., -9.1093179071322083e-004, 0.5540593862533569, 0.2911868989467621, 0, 2, 10, 17, 3, 2, -1., 11, 17, 1, 2, 3., -6.1275060288608074e-003, 0.1775255054235458, 0.5196629166603088, 0, 2, 9, 9, 2, 2, -1., 9, 10, 2, 1, 2., -4.4576259097084403e-004, 0.3024170100688934, 0.5533593893051148, 0, 2, 7, 6, 6, 4, -1., 9, 6, 2, 4, 3., 0.0226465407758951, 0.4414930939674377, 0.6975377202033997, 0, 2, 7, 17, 3, 2, -1., 8, 17, 1, 2, 3., -1.8804960418492556e-003, 0.2791394889354706, 0.5497952103614807, 0, 2, 10, 17, 3, 3, -1., 11, 17, 1, 3, 3., 7.0889107882976532e-003, 0.5263199210166931, 0.2385547012090683, 0, 2, 8, 12, 3, 2, -1., 8, 13, 3, 1, 2., 1.7318050377070904e-003, 0.4319379031658173, 0.6983600854873657, 0, 2, 9, 3, 6, 2, -1., 11, 3, 2, 2, 3., -6.8482700735330582e-003, 0.3082042932510376, 0.5390920042991638, 0, 2, 3, 11, 14, 4, -1., 3, 13, 14, 2, 2., -1.5062530110299122e-005, 0.5521922111511231, 0.3120366036891937, 0, 3, 1, 10, 18, 4, -1., 10, 10, 9, 2, 2., 1, 12, 9, 2, 2., 0.0294755697250366, 0.5401322841644287, 0.1770603060722351, 0, 2, 0, 10, 3, 3, -1., 0, 11, 3, 1, 3., 8.1387329846620560e-003, 0.5178617835044861, 0.1211019009351730, 0, 2, 9, 1, 6, 6, -1., 11, 1, 2, 6, 3., 0.0209429506212473, 0.5290294289588928, 0.3311221897602081, 0, 2, 8, 7, 3, 6, -1., 9, 7, 1, 6, 3., -9.5665529370307922e-003, 0.7471994161605835, 0.4451968967914581, 15.3241395950317380, 33, 0, 2, 1, 0, 18, 9, -1., 1, 3, 18, 3, 3., -2.8206960996612906e-004, 0.2064086049795151, 0.6076732277870178, 0, 2, 12, 10, 2, 6, -1., 12, 13, 2, 3, 2., 1.6790600493550301e-003, 0.5851997137069702, 0.1255383938550949, 0, 2, 0, 5, 19, 8, -1., 0, 9, 19, 4, 2., 6.9827912375330925e-004, 0.0940184295177460, 0.5728961229324341, 0, 2, 7, 0, 6, 9, -1., 9, 0, 2, 9, 3., 7.8959012171253562e-004, 0.1781987994909287, 0.5694308876991272, 0, 2, 5, 3, 6, 1, -1., 7, 3, 2, 1, 3., -2.8560499195009470e-003, 0.1638399064540863, 0.5788664817810059, 0, 2, 11, 3, 6, 1, -1., 13, 3, 2, 1, 3., -3.8122469559311867e-003, 0.2085440009832382, 0.5508564710617065, 0, 2, 5, 10, 4, 6, -1., 5, 13, 4, 3, 2., 1.5896620461717248e-003, 0.5702760815620422, 0.1857215017080307, 0, 2, 11, 3, 6, 1, -1., 13, 3, 2, 1, 3., 0.0100783398374915, 0.5116943120956421, 0.2189770042896271, 0, 2, 4, 4, 12, 6, -1., 4, 6, 12, 2, 3., -0.0635263025760651, 0.7131379842758179, 0.4043813049793243, 0, 2, 15, 12, 2, 6, -1., 15, 14, 2, 2, 3., -9.1031491756439209e-003, 0.2567181885242462, 0.5463973283767700, 0, 2, 9, 3, 2, 2, -1., 10, 3, 1, 2, 2., -2.4035000242292881e-003, 0.1700665950775147, 0.5590974092483521, 0, 2, 9, 3, 3, 1, -1., 10, 3, 1, 1, 3., 1.5226360410451889e-003, 0.5410556793212891, 0.2619054019451141, 0, 2, 1, 1, 4, 14, -1., 3, 1, 2, 14, 2., 0.0179974399507046, 0.3732436895370483, 0.6535220742225647, 0, 3, 9, 0, 4, 4, -1., 11, 0, 2, 2, 2., 9, 2, 2, 2, 2., -6.4538191072642803e-003, 0.2626481950283051, 0.5537446141242981, 0, 2, 7, 5, 1, 14, -1., 7, 12, 1, 7, 2., -0.0118807600811124, 0.2003753930330277, 0.5544745922088623, 0, 2, 19, 0, 1, 4, -1., 19, 2, 1, 2, 2., 1.2713660253211856e-003, 0.5591902732849121, 0.3031975924968720, 0, 2, 5, 5, 6, 4, -1., 8, 5, 3, 4, 2., 1.1376109905540943e-003, 0.2730407118797302, 0.5646508932113648, 0, 2, 9, 18, 3, 2, -1., 10, 18, 1, 2, 3., -4.2651998810470104e-003, 0.1405909061431885, 0.5461820960044861, 0, 2, 8, 18, 3, 2, -1., 9, 18, 1, 2, 3., -2.9602861031889915e-003, 0.1795035004615784, 0.5459290146827698, 0, 2, 4, 5, 12, 6, -1., 4, 7, 12, 2, 3., -8.8448226451873779e-003, 0.5736783146858215, 0.2809219956398010, 0, 2, 3, 12, 2, 6, -1., 3, 14, 2, 2, 3., -6.6430689767003059e-003, 0.2370675951242447, 0.5503826141357422, 0, 2, 10, 8, 2, 12, -1., 10, 12, 2, 4, 3., 3.9997808635234833e-003, 0.5608199834823608, 0.3304282128810883, 0, 2, 7, 18, 3, 2, -1., 8, 18, 1, 2, 3., -4.1221720166504383e-003, 0.1640105992555618, 0.5378993153572083, 0, 2, 9, 0, 6, 2, -1., 11, 0, 2, 2, 3., 0.0156249096617103, 0.5227649211883545, 0.2288603931665421, 0, 2, 5, 11, 9, 3, -1., 5, 12, 9, 1, 3., -0.0103564197197557, 0.7016193866729736, 0.4252927899360657, 0, 2, 9, 0, 6, 2, -1., 11, 0, 2, 2, 3., -8.7960809469223022e-003, 0.2767347097396851, 0.5355830192565918, 0, 2, 1, 1, 18, 5, -1., 7, 1, 6, 5, 3., 0.1622693985700607, 0.4342240095138550, 0.7442579269409180, 0, 3, 8, 0, 4, 4, -1., 10, 0, 2, 2, 2., 8, 2, 2, 2, 2., 4.5542530715465546e-003, 0.5726485848426819, 0.2582125067710877, 0, 2, 3, 12, 1, 3, -1., 3, 13, 1, 1, 3., -2.1309209987521172e-003, 0.2106848061084747, 0.5361018776893616, 0, 2, 8, 14, 5, 3, -1., 8, 15, 5, 1, 3., -0.0132084200158715, 0.7593790888786316, 0.4552468061447144, 0, 3, 5, 4, 10, 12, -1., 5, 4, 5, 6, 2., 10, 10, 5, 6, 2., -0.0659966766834259, 0.1252475976943970, 0.5344039797782898, 0, 2, 9, 6, 9, 12, -1., 9, 10, 9, 4, 3., 7.9142656177282333e-003, 0.3315384089946747, 0.5601043105125427, 0, 3, 2, 2, 12, 14, -1., 2, 2, 6, 7, 2., 8, 9, 6, 7, 2., 0.0208942797034979, 0.5506049990653992, 0.2768838107585907, 21.0106391906738280, 44, 0, 2, 4, 7, 12, 2, -1., 8, 7, 4, 2, 3., 1.1961159761995077e-003, 0.1762690991163254, 0.6156241297721863, 0, 2, 7, 4, 6, 4, -1., 7, 6, 6, 2, 2., -1.8679830245673656e-003, 0.6118106842041016, 0.1832399964332581, 0, 2, 4, 5, 11, 8, -1., 4, 9, 11, 4, 2., -1.9579799845814705e-004, 0.0990442633628845, 0.5723816156387329, 0, 2, 3, 10, 16, 4, -1., 3, 12, 16, 2, 2., -8.0255657667294145e-004, 0.5579879879951477, 0.2377282977104187, 0, 2, 0, 0, 16, 2, -1., 0, 1, 16, 1, 2., -2.4510810617357492e-003, 0.2231457978487015, 0.5858935117721558, 0, 2, 7, 5, 6, 2, -1., 9, 5, 2, 2, 3., 5.0361850298941135e-004, 0.2653993964195252, 0.5794103741645813, 0, 3, 3, 2, 6, 10, -1., 3, 2, 3, 5, 2., 6, 7, 3, 5, 2., 4.0293349884450436e-003, 0.5803827047348023, 0.2484865039587021, 0, 2, 10, 5, 8, 15, -1., 10, 10, 8, 5, 3., -0.0144517095759511, 0.1830351948738098, 0.5484204888343811, 0, 3, 3, 14, 8, 6, -1., 3, 14, 4, 3, 2., 7, 17, 4, 3, 2., 2.0380979403853416e-003, 0.3363558948040009, 0.6051092743873596, 0, 2, 14, 2, 2, 2, -1., 14, 3, 2, 1, 2., -1.6155190533027053e-003, 0.2286642044782639, 0.5441246032714844, 0, 2, 1, 10, 7, 6, -1., 1, 13, 7, 3, 2., 3.3458340913057327e-003, 0.5625913143157959, 0.2392338067293167, 0, 2, 15, 4, 4, 3, -1., 15, 4, 2, 3, 2., 1.6379579901695251e-003, 0.3906993865966797, 0.5964621901512146, 0, 3, 2, 9, 14, 6, -1., 2, 9, 7, 3, 2., 9, 12, 7, 3, 2., 0.0302512105554342, 0.5248482227325440, 0.1575746983289719, 0, 2, 5, 7, 10, 4, -1., 5, 9, 10, 2, 2., 0.0372519902884960, 0.4194310903549194, 0.6748418807983398, 0, 3, 6, 9, 8, 8, -1., 6, 9, 4, 4, 2., 10, 13, 4, 4, 2., -0.0251097902655602, 0.1882549971342087, 0.5473451018333435, 0, 2, 14, 1, 3, 2, -1., 14, 2, 3, 1, 2., -5.3099058568477631e-003, 0.1339973062276840, 0.5227110981941223, 0, 2, 1, 4, 4, 2, -1., 3, 4, 2, 2, 2., 1.2086479691788554e-003, 0.3762088119983673, 0.6109635829925537, 0, 2, 11, 10, 2, 8, -1., 11, 14, 2, 4, 2., -0.0219076797366142, 0.2663142979145050, 0.5404006838798523, 0, 2, 0, 0, 5, 3, -1., 0, 1, 5, 1, 3., 5.4116579703986645e-003, 0.5363578796386719, 0.2232273072004318, 0, 3, 2, 5, 18, 8, -1., 11, 5, 9, 4, 2., 2, 9, 9, 4, 2., 0.0699463263154030, 0.5358232855796814, 0.2453698068857193, 0, 2, 6, 6, 1, 6, -1., 6, 9, 1, 3, 2., 3.4520021290518343e-004, 0.2409671992063522, 0.5376930236816406, 0, 2, 19, 1, 1, 3, -1., 19, 2, 1, 1, 3., 1.2627709656953812e-003, 0.5425856709480286, 0.3155693113803864, 0, 2, 7, 6, 6, 6, -1., 9, 6, 2, 6, 3., 0.0227195098996162, 0.4158405959606171, 0.6597865223884583, 0, 2, 19, 1, 1, 3, -1., 19, 2, 1, 1, 3., -1.8111000536009669e-003, 0.2811253070831299, 0.5505244731903076, 0, 2, 3, 13, 2, 3, -1., 3, 14, 2, 1, 3., 3.3469670452177525e-003, 0.5260028243064880, 0.1891465038061142, 0, 3, 8, 4, 8, 12, -1., 12, 4, 4, 6, 2., 8, 10, 4, 6, 2., 4.0791751234792173e-004, 0.5673509240150452, 0.3344210088253021, 0, 2, 5, 2, 6, 3, -1., 7, 2, 2, 3, 3., 0.0127347996458411, 0.5343592166900635, 0.2395612001419067, 0, 2, 6, 1, 9, 10, -1., 6, 6, 9, 5, 2., -7.3119727894663811e-003, 0.6010890007019043, 0.4022207856178284, 0, 2, 0, 4, 6, 12, -1., 2, 4, 2, 12, 3., -0.0569487512111664, 0.8199151158332825, 0.4543190896511078, 0, 2, 15, 13, 2, 3, -1., 15, 14, 2, 1, 3., -5.0116591155529022e-003, 0.2200281023979187, 0.5357710719108582, 0, 2, 7, 14, 5, 3, -1., 7, 15, 5, 1, 3., 6.0334368608891964e-003, 0.4413081109523773, 0.7181751132011414, 0, 2, 15, 13, 3, 3, -1., 15, 14, 3, 1, 3., 3.9437441155314445e-003, 0.5478860735893250, 0.2791733145713806, 0, 2, 6, 14, 8, 3, -1., 6, 15, 8, 1, 3., -3.6591119132936001e-003, 0.6357867717742920, 0.3989723920822144, 0, 2, 15, 13, 3, 3, -1., 15, 14, 3, 1, 3., -3.8456181064248085e-003, 0.3493686020374298, 0.5300664901733398, 0, 2, 2, 13, 3, 3, -1., 2, 14, 3, 1, 3., -7.1926261298358440e-003, 0.1119614988565445, 0.5229672789573669, 0, 3, 4, 7, 12, 12, -1., 10, 7, 6, 6, 2., 4, 13, 6, 6, 2., -0.0527989417314529, 0.2387102991342545, 0.5453451275825501, 0, 2, 9, 7, 2, 6, -1., 10, 7, 1, 6, 2., -7.9537667334079742e-003, 0.7586917877197266, 0.4439376890659332, 0, 2, 8, 9, 5, 2, -1., 8, 10, 5, 1, 2., -2.7344180271029472e-003, 0.2565476894378662, 0.5489321947097778, 0, 2, 8, 6, 3, 4, -1., 9, 6, 1, 4, 3., -1.8507939530536532e-003, 0.6734347939491272, 0.4252474904060364, 0, 2, 9, 6, 2, 8, -1., 9, 10, 2, 4, 2., 0.0159189198166132, 0.5488352775573731, 0.2292661964893341, 0, 2, 7, 7, 3, 6, -1., 8, 7, 1, 6, 3., -1.2687679845839739e-003, 0.6104331016540527, 0.4022389948368073, 0, 2, 11, 3, 3, 3, -1., 12, 3, 1, 3, 3., 6.2883910723030567e-003, 0.5310853123664856, 0.1536193042993546, 0, 2, 5, 4, 6, 1, -1., 7, 4, 2, 1, 3., -6.2259892001748085e-003, 0.1729111969470978, 0.5241606235504150, 0, 2, 5, 6, 10, 3, -1., 5, 7, 10, 1, 3., -0.0121325999498367, 0.6597759723663330, 0.4325182139873505, 23.9187908172607420, 50, 0, 2, 7, 3, 6, 9, -1., 7, 6, 6, 3, 3., -3.9184908382594585e-003, 0.6103435158729553, 0.1469330936670303, 0, 2, 6, 7, 9, 1, -1., 9, 7, 3, 1, 3., 1.5971299726516008e-003, 0.2632363140583038, 0.5896466970443726, 0, 2, 2, 8, 16, 8, -1., 2, 12, 16, 4, 2., 0.0177801102399826, 0.5872874259948731, 0.1760361939668655, 0, 2, 14, 6, 2, 6, -1., 14, 9, 2, 3, 2., 6.5334769897162914e-004, 0.1567801982164383, 0.5596066117286682, 0, 2, 1, 5, 6, 15, -1., 1, 10, 6, 5, 3., -2.8353091329336166e-004, 0.1913153976202011, 0.5732036232948303, 0, 2, 10, 0, 6, 9, -1., 10, 3, 6, 3, 3., 1.6104689566418529e-003, 0.2914913892745972, 0.5623080730438232, 0, 2, 6, 6, 7, 14, -1., 6, 13, 7, 7, 2., -0.0977506190538406, 0.1943476945161820, 0.5648233294487000, 0, 2, 13, 7, 3, 6, -1., 13, 9, 3, 2, 3., 5.5182358482852578e-004, 0.3134616911411285, 0.5504639744758606, 0, 2, 1, 8, 15, 4, -1., 6, 8, 5, 4, 3., -0.0128582203760743, 0.2536481916904450, 0.5760142803192139, 0, 2, 11, 2, 3, 10, -1., 11, 7, 3, 5, 2., 4.1530239395797253e-003, 0.5767722129821777, 0.3659774065017700, 0, 2, 3, 7, 4, 6, -1., 3, 9, 4, 2, 3., 1.7092459602281451e-003, 0.2843191027641296, 0.5918939113616943, 0, 2, 13, 3, 6, 10, -1., 15, 3, 2, 10, 3., 7.5217359699308872e-003, 0.4052427113056183, 0.6183109283447266, 0, 3, 5, 7, 8, 10, -1., 5, 7, 4, 5, 2., 9, 12, 4, 5, 2., 2.2479810286313295e-003, 0.5783755183219910, 0.3135401010513306, 0, 3, 4, 4, 12, 12, -1., 10, 4, 6, 6, 2., 4, 10, 6, 6, 2., 0.0520062111318111, 0.5541312098503113, 0.1916636973619461, 0, 2, 1, 4, 6, 9, -1., 3, 4, 2, 9, 3., 0.0120855299755931, 0.4032655954360962, 0.6644591093063355, 0, 2, 11, 3, 2, 5, -1., 11, 3, 1, 5, 2., 1.4687820112158079e-005, 0.3535977900028229, 0.5709382891654968, 0, 2, 7, 3, 2, 5, -1., 8, 3, 1, 5, 2., 7.1395188570022583e-006, 0.3037444949150085, 0.5610269904136658, 0, 2, 10, 14, 2, 3, -1., 10, 15, 2, 1, 3., -4.6001640148460865e-003, 0.7181087136268616, 0.4580326080322266, 0, 2, 5, 12, 6, 2, -1., 8, 12, 3, 2, 2., 2.0058949012309313e-003, 0.5621951818466187, 0.2953684031963348, 0, 2, 9, 14, 2, 3, -1., 9, 15, 2, 1, 3., 4.5050270855426788e-003, 0.4615387916564941, 0.7619017958641052, 0, 2, 4, 11, 12, 6, -1., 4, 14, 12, 3, 2., 0.0117468303069472, 0.5343837141990662, 0.1772529035806656, 0, 2, 11, 11, 5, 9, -1., 11, 14, 5, 3, 3., -0.0583163388073444, 0.1686245948076248, 0.5340772271156311, 0, 2, 6, 15, 3, 2, -1., 6, 16, 3, 1, 2., 2.3629379575140774e-004, 0.3792056143283844, 0.6026803851127625, 0, 2, 11, 0, 3, 5, -1., 12, 0, 1, 5, 3., -7.8156180679798126e-003, 0.1512867063283920, 0.5324323773384094, 0, 2, 5, 5, 6, 7, -1., 8, 5, 3, 7, 2., -0.0108761601150036, 0.2081822007894516, 0.5319945216178894, 0, 2, 13, 0, 1, 9, -1., 13, 3, 1, 3, 3., -2.7745519764721394e-003, 0.4098246991634369, 0.5210328102111816, 0, 3, 3, 2, 4, 8, -1., 3, 2, 2, 4, 2., 5, 6, 2, 4, 2., -7.8276381827890873e-004, 0.5693274140357971, 0.3478842079639435, 0, 2, 13, 12, 4, 6, -1., 13, 14, 4, 2, 3., 0.0138704096898437, 0.5326750874519348, 0.2257698029279709, 0, 2, 3, 12, 4, 6, -1., 3, 14, 4, 2, 3., -0.0236749108880758, 0.1551305055618286, 0.5200707912445068, 0, 2, 13, 11, 3, 4, -1., 13, 13, 3, 2, 2., -1.4879409718560055e-005, 0.5500566959381104, 0.3820176124572754, 0, 2, 4, 4, 4, 3, -1., 4, 5, 4, 1, 3., 3.6190641112625599e-003, 0.4238683879375458, 0.6639748215675354, 0, 2, 7, 5, 11, 8, -1., 7, 9, 11, 4, 2., -0.0198171101510525, 0.2150038033723831, 0.5382357835769653, 0, 2, 7, 8, 3, 4, -1., 8, 8, 1, 4, 3., -3.8154039066284895e-003, 0.6675711274147034, 0.4215297102928162, 0, 2, 9, 1, 6, 1, -1., 11, 1, 2, 1, 3., -4.9775829538702965e-003, 0.2267289012670517, 0.5386328101158142, 0, 2, 5, 5, 3, 3, -1., 5, 6, 3, 1, 3., 2.2441020701080561e-003, 0.4308691024780273, 0.6855735778808594, 0, 3, 0, 9, 20, 6, -1., 10, 9, 10, 3, 2., 0, 12, 10, 3, 2., 0.0122824599966407, 0.5836614966392517, 0.3467479050159454, 0, 2, 8, 6, 3, 5, -1., 9, 6, 1, 5, 3., -2.8548699337989092e-003, 0.7016944885253906, 0.4311453998088837, 0, 2, 11, 0, 1, 3, -1., 11, 1, 1, 1, 3., -3.7875669077038765e-003, 0.2895345091819763, 0.5224946141242981, 0, 2, 4, 2, 4, 2, -1., 4, 3, 4, 1, 2., -1.2201230274513364e-003, 0.2975570857524872, 0.5481644868850708, 0, 2, 12, 6, 4, 3, -1., 12, 7, 4, 1, 3., 0.0101605998352170, 0.4888817965984345, 0.8182697892189026, 0, 2, 5, 0, 6, 4, -1., 7, 0, 2, 4, 3., -0.0161745697259903, 0.1481492966413498, 0.5239992737770081, 0, 2, 9, 7, 3, 8, -1., 10, 7, 1, 8, 3., 0.0192924607545137, 0.4786309897899628, 0.7378190755844116, 0, 2, 9, 7, 2, 2, -1., 10, 7, 1, 2, 2., -3.2479539513587952e-003, 0.7374222874641419, 0.4470643997192383, 0, 3, 6, 7, 14, 4, -1., 13, 7, 7, 2, 2., 6, 9, 7, 2, 2., -9.3803480267524719e-003, 0.3489154875278473, 0.5537996292114258, 0, 2, 0, 5, 3, 6, -1., 0, 7, 3, 2, 3., -0.0126061299815774, 0.2379686981439591, 0.5315443277359009, 0, 2, 13, 11, 3, 4, -1., 13, 13, 3, 2, 2., -0.0256219301372766, 0.1964688003063202, 0.5138769745826721, 0, 2, 4, 11, 3, 4, -1., 4, 13, 3, 2, 2., -7.5741496402770281e-005, 0.5590522885322571, 0.3365853130817413, 0, 3, 5, 9, 12, 8, -1., 11, 9, 6, 4, 2., 5, 13, 6, 4, 2., -0.0892108827829361, 0.0634046569466591, 0.5162634849548340, 0, 2, 9, 12, 1, 3, -1., 9, 13, 1, 1, 3., -2.7670480776578188e-003, 0.7323467731475830, 0.4490706026554108, 0, 2, 10, 15, 2, 4, -1., 10, 17, 2, 2, 2., 2.7152578695677221e-004, 0.4114834964275360, 0.5985518097877502, 24.5278797149658200, 51, 0, 2, 7, 7, 6, 1, -1., 9, 7, 2, 1, 3., 1.4786219689995050e-003, 0.2663545012474060, 0.6643316745758057, 0, 3, 12, 3, 6, 6, -1., 15, 3, 3, 3, 2., 12, 6, 3, 3, 2., -1.8741659587249160e-003, 0.6143848896026611, 0.2518512904644013, 0, 2, 0, 4, 10, 6, -1., 0, 6, 10, 2, 3., -1.7151009524241090e-003, 0.5766341090202332, 0.2397463023662567, 0, 3, 8, 3, 8, 14, -1., 12, 3, 4, 7, 2., 8, 10, 4, 7, 2., -1.8939269939437509e-003, 0.5682045817375183, 0.2529144883155823, 0, 2, 4, 4, 7, 15, -1., 4, 9, 7, 5, 3., -5.3006052039563656e-003, 0.1640675961971283, 0.5556079745292664, 0, 3, 12, 2, 6, 8, -1., 15, 2, 3, 4, 2., 12, 6, 3, 4, 2., -0.0466625317931175, 0.6123154163360596, 0.4762830138206482, 0, 3, 2, 2, 6, 8, -1., 2, 2, 3, 4, 2., 5, 6, 3, 4, 2., -7.9431332414969802e-004, 0.5707858800888062, 0.2839404046535492, 0, 2, 2, 13, 18, 7, -1., 8, 13, 6, 7, 3., 0.0148916700854898, 0.4089672863483429, 0.6006367206573486, 0, 3, 4, 3, 8, 14, -1., 4, 3, 4, 7, 2., 8, 10, 4, 7, 2., -1.2046529445797205e-003, 0.5712450742721558, 0.2705289125442505, 0, 2, 18, 1, 2, 6, -1., 18, 3, 2, 2, 3., 6.0619381256401539e-003, 0.5262504220008850, 0.3262225985527039, 0, 2, 9, 11, 2, 3, -1., 9, 12, 2, 1, 3., -2.5286648888140917e-003, 0.6853830814361572, 0.4199256896972656, 0, 2, 18, 1, 2, 6, -1., 18, 3, 2, 2, 3., -5.9010218828916550e-003, 0.3266282081604004, 0.5434812903404236, 0, 2, 0, 1, 2, 6, -1., 0, 3, 2, 2, 3., 5.6702760048210621e-003, 0.5468410849571228, 0.2319003939628601, 0, 2, 1, 5, 18, 6, -1., 1, 7, 18, 2, 3., -3.0304100364446640e-003, 0.5570667982101440, 0.2708238065242767, 0, 2, 0, 2, 6, 7, -1., 3, 2, 3, 7, 2., 2.9803649522364140e-003, 0.3700568974018097, 0.5890625715255737, 0, 2, 7, 3, 6, 14, -1., 7, 10, 6, 7, 2., -0.0758405104279518, 0.2140070050954819, 0.5419948101043701, 0, 2, 3, 7, 13, 10, -1., 3, 12, 13, 5, 2., 0.0192625392228365, 0.5526772141456604, 0.2726590037345886, 0, 2, 11, 15, 2, 2, -1., 11, 16, 2, 1, 2., 1.8888259364757687e-004, 0.3958011865615845, 0.6017209887504578, 0, 3, 2, 11, 16, 4, -1., 2, 11, 8, 2, 2., 10, 13, 8, 2, 2., 0.0293695498257875, 0.5241373777389526, 0.1435758024454117, 0, 3, 13, 7, 6, 4, -1., 16, 7, 3, 2, 2., 13, 9, 3, 2, 2., 1.0417619487270713e-003, 0.3385409116744995, 0.5929983258247376, 0, 2, 6, 10, 3, 9, -1., 6, 13, 3, 3, 3., 2.6125640142709017e-003, 0.5485377907752991, 0.3021597862243652, 0, 2, 14, 6, 1, 6, -1., 14, 9, 1, 3, 2., 9.6977467183023691e-004, 0.3375276029109955, 0.5532032847404480, 0, 2, 5, 10, 4, 1, -1., 7, 10, 2, 1, 2., 5.9512659208849072e-004, 0.5631743073463440, 0.3359399139881134, 0, 2, 3, 8, 15, 5, -1., 8, 8, 5, 5, 3., -0.1015655994415283, 0.0637350380420685, 0.5230425000190735, 0, 2, 1, 6, 5, 4, -1., 1, 8, 5, 2, 2., 0.0361566990613937, 0.5136963129043579, 0.1029528975486755, 0, 2, 3, 1, 17, 6, -1., 3, 3, 17, 2, 3., 3.4624140243977308e-003, 0.3879320025444031, 0.5558289289474487, 0, 2, 6, 7, 8, 2, -1., 10, 7, 4, 2, 2., 0.0195549800992012, 0.5250086784362793, 0.1875859946012497, 0, 2, 9, 7, 3, 2, -1., 10, 7, 1, 2, 3., -2.3121440317481756e-003, 0.6672028899192810, 0.4679641127586365, 0, 2, 8, 7, 3, 2, -1., 9, 7, 1, 2, 3., -1.8605289515107870e-003, 0.7163379192352295, 0.4334670901298523, 0, 2, 8, 9, 4, 2, -1., 8, 10, 4, 1, 2., -9.4026362057775259e-004, 0.3021360933780670, 0.5650203227996826, 0, 2, 8, 8, 4, 3, -1., 8, 9, 4, 1, 3., -5.2418331615626812e-003, 0.1820009052753449, 0.5250256061553955, 0, 2, 9, 5, 6, 4, -1., 9, 5, 3, 4, 2., 1.1729019752237946e-004, 0.3389188051223755, 0.5445973277091980, 0, 2, 8, 13, 4, 3, -1., 8, 14, 4, 1, 3., 1.1878840159624815e-003, 0.4085349142551422, 0.6253563165664673, 0, 3, 4, 7, 12, 6, -1., 10, 7, 6, 3, 2., 4, 10, 6, 3, 2., -0.0108813596889377, 0.3378399014472961, 0.5700082778930664, 0, 2, 8, 14, 4, 3, -1., 8, 15, 4, 1, 3., 1.7354859737679362e-003, 0.4204635918140411, 0.6523038744926453, 0, 2, 9, 7, 3, 3, -1., 9, 8, 3, 1, 3., -6.5119052305817604e-003, 0.2595216035842896, 0.5428143739700317, 0, 2, 7, 4, 3, 8, -1., 8, 4, 1, 8, 3., -1.2136430013924837e-003, 0.6165143847465515, 0.3977893888950348, 0, 2, 10, 0, 3, 6, -1., 11, 0, 1, 6, 3., -0.0103542404249310, 0.1628028005361557, 0.5219504833221436, 0, 2, 6, 3, 4, 8, -1., 8, 3, 2, 8, 2., 5.5858830455690622e-004, 0.3199650943279266, 0.5503574013710022, 0, 2, 14, 3, 6, 13, -1., 14, 3, 3, 13, 2., 0.0152996499091387, 0.4103994071483612, 0.6122388243675232, 0, 2, 8, 13, 3, 6, -1., 8, 16, 3, 3, 2., -0.0215882100164890, 0.1034912988543510, 0.5197384953498840, 0, 2, 14, 3, 6, 13, -1., 14, 3, 3, 13, 2., -0.1283462941646576, 0.8493865132331848, 0.4893102943897247, 0, 3, 0, 7, 10, 4, -1., 0, 7, 5, 2, 2., 5, 9, 5, 2, 2., -2.2927189711481333e-003, 0.3130157887935638, 0.5471575260162354, 0, 2, 14, 3, 6, 13, -1., 14, 3, 3, 13, 2., 0.0799151062965393, 0.4856320917606354, 0.6073989272117615, 0, 2, 0, 3, 6, 13, -1., 3, 3, 3, 13, 2., -0.0794410929083824, 0.8394674062728882, 0.4624533057212830, 0, 2, 9, 1, 4, 1, -1., 9, 1, 2, 1, 2., -5.2800010889768600e-003, 0.1881695985794067, 0.5306698083877564, 0, 2, 8, 0, 2, 1, -1., 9, 0, 1, 1, 2., 1.0463109938427806e-003, 0.5271229147911072, 0.2583065927028656, 0, 3, 10, 16, 4, 4, -1., 12, 16, 2, 2, 2., 10, 18, 2, 2, 2., 2.6317298761568964e-004, 0.4235304892063141, 0.5735440850257874, 0, 2, 9, 6, 2, 3, -1., 10, 6, 1, 3, 2., -3.6173160187900066e-003, 0.6934396028518677, 0.4495444893836975, 0, 2, 4, 5, 12, 2, -1., 8, 5, 4, 2, 3., 0.0114218797534704, 0.5900921225547791, 0.4138193130493164, 0, 2, 8, 7, 3, 5, -1., 9, 7, 1, 5, 3., -1.9963278900831938e-003, 0.6466382741928101, 0.4327239990234375, 27.1533508300781250, 56, 0, 2, 6, 4, 8, 6, -1., 6, 6, 8, 2, 3., -9.9691245704889297e-003, 0.6142324209213257, 0.2482212036848068, 0, 2, 9, 5, 2, 12, -1., 9, 11, 2, 6, 2., 7.3073059320449829e-004, 0.5704951882362366, 0.2321965992450714, 0, 2, 4, 6, 6, 8, -1., 4, 10, 6, 4, 2., 6.4045301405712962e-004, 0.2112251967191696, 0.5814933180809021, 0, 2, 12, 2, 8, 5, -1., 12, 2, 4, 5, 2., 4.5424019917845726e-003, 0.2950482070446014, 0.5866311788558960, 0, 2, 0, 8, 18, 3, -1., 0, 9, 18, 1, 3., 9.2477443104144186e-005, 0.2990990877151489, 0.5791326761245728, 0, 2, 8, 12, 4, 8, -1., 8, 16, 4, 4, 2., -8.6603146046400070e-003, 0.2813029885292053, 0.5635542273521423, 0, 2, 0, 2, 8, 5, -1., 4, 2, 4, 5, 2., 8.0515816807746887e-003, 0.3535369038581848, 0.6054757237434387, 0, 2, 13, 11, 3, 4, -1., 13, 13, 3, 2, 2., 4.3835240649059415e-004, 0.5596532225608826, 0.2731510996818543, 0, 2, 5, 11, 6, 1, -1., 7, 11, 2, 1, 3., -9.8168973636347800e-005, 0.5978031754493713, 0.3638561069965363, 0, 2, 11, 3, 3, 1, -1., 12, 3, 1, 1, 3., -1.1298790341243148e-003, 0.2755252122879028, 0.5432729125022888, 0, 2, 7, 13, 5, 3, -1., 7, 14, 5, 1, 3., 6.4356150105595589e-003, 0.4305641949176788, 0.7069833278656006, 0, 2, 11, 11, 7, 6, -1., 11, 14, 7, 3, 2., -0.0568293295800686, 0.2495242953300476, 0.5294997096061707, 0, 2, 2, 11, 7, 6, -1., 2, 14, 7, 3, 2., 4.0668169967830181e-003, 0.5478553175926209, 0.2497723996639252, 0, 2, 12, 14, 2, 6, -1., 12, 16, 2, 2, 3., 4.8164798499783501e-005, 0.3938601016998291, 0.5706356167793274, 0, 2, 8, 14, 3, 3, -1., 8, 15, 3, 1, 3., 6.1795017682015896e-003, 0.4407606124877930, 0.7394766807556152, 0, 2, 11, 0, 3, 5, -1., 12, 0, 1, 5, 3., 6.4985752105712891e-003, 0.5445243120193481, 0.2479152977466583, 0, 2, 6, 1, 4, 9, -1., 8, 1, 2, 9, 2., -1.0211090557277203e-003, 0.2544766962528229, 0.5338971018791199, 0, 2, 10, 3, 6, 1, -1., 12, 3, 2, 1, 3., -5.4247528314590454e-003, 0.2718858122825623, 0.5324069261550903, 0, 2, 8, 8, 3, 4, -1., 8, 10, 3, 2, 2., -1.0559899965301156e-003, 0.3178288042545319, 0.5534508824348450, 0, 2, 8, 12, 4, 2, -1., 8, 13, 4, 1, 2., 6.6465808777138591e-004, 0.4284219145774841, 0.6558194160461426, 0, 2, 5, 18, 4, 2, -1., 5, 19, 4, 1, 2., -2.7524109464138746e-004, 0.5902860760688782, 0.3810262978076935, 0, 2, 2, 1, 18, 6, -1., 2, 3, 18, 2, 3., 4.2293202131986618e-003, 0.3816489875316620, 0.5709385871887207, 0, 2, 6, 0, 3, 2, -1., 7, 0, 1, 2, 3., -3.2868210691958666e-003, 0.1747743934392929, 0.5259544253349304, 0, 3, 13, 8, 6, 2, -1., 16, 8, 3, 1, 2., 13, 9, 3, 1, 2., 1.5611879643984139e-004, 0.3601722121238709, 0.5725612044334412, 0, 2, 6, 10, 3, 6, -1., 6, 13, 3, 3, 2., -7.3621381488919724e-006, 0.5401858091354370, 0.3044497072696686, 0, 3, 0, 13, 20, 4, -1., 10, 13, 10, 2, 2., 0, 15, 10, 2, 2., -0.0147672500461340, 0.3220770061016083, 0.5573434829711914, 0, 2, 7, 7, 6, 5, -1., 9, 7, 2, 5, 3., 0.0244895908981562, 0.4301528036594391, 0.6518812775611877, 0, 2, 11, 0, 2, 2, -1., 11, 1, 2, 1, 2., -3.7652091123163700e-004, 0.3564583063125610, 0.5598236918449402, 0, 3, 1, 8, 6, 2, -1., 1, 8, 3, 1, 2., 4, 9, 3, 1, 2., 7.3657688517414499e-006, 0.3490782976150513, 0.5561897754669190, 0, 3, 0, 2, 20, 2, -1., 10, 2, 10, 1, 2., 0, 3, 10, 1, 2., -0.0150999398902059, 0.1776272058486939, 0.5335299968719482, 0, 2, 7, 14, 5, 3, -1., 7, 15, 5, 1, 3., -3.8316650316119194e-003, 0.6149687767028809, 0.4221394062042236, 0, 3, 7, 13, 6, 6, -1., 10, 13, 3, 3, 2., 7, 16, 3, 3, 2., 0.0169254001230001, 0.5413014888763428, 0.2166585028171539, 0, 2, 9, 12, 2, 3, -1., 9, 13, 2, 1, 3., -3.0477850232273340e-003, 0.6449490785598755, 0.4354617893695831, 0, 2, 16, 11, 1, 6, -1., 16, 13, 1, 2, 3., 3.2140589319169521e-003, 0.5400155186653137, 0.3523217141628265, 0, 2, 3, 11, 1, 6, -1., 3, 13, 1, 2, 3., -4.0023201145231724e-003, 0.2774524092674255, 0.5338417291641235, 0, 3, 4, 4, 14, 12, -1., 11, 4, 7, 6, 2., 4, 10, 7, 6, 2., 7.4182129465043545e-003, 0.5676739215850830, 0.3702817857265472, 0, 2, 5, 4, 3, 3, -1., 5, 5, 3, 1, 3., -8.8764587417244911e-003, 0.7749221920967102, 0.4583688974380493, 0, 2, 12, 3, 3, 3, -1., 13, 3, 1, 3, 3., 2.7311739977449179e-003, 0.5338721871376038, 0.3996661007404327, 0, 2, 6, 6, 8, 3, -1., 6, 7, 8, 1, 3., -2.5082379579544067e-003, 0.5611963272094727, 0.3777498900890350, 0, 2, 12, 3, 3, 3, -1., 13, 3, 1, 3, 3., -8.0541074275970459e-003, 0.2915228903293610, 0.5179182887077332, 0, 3, 3, 1, 4, 10, -1., 3, 1, 2, 5, 2., 5, 6, 2, 5, 2., -9.7938813269138336e-004, 0.5536432862281799, 0.3700192868709564, 0, 2, 5, 7, 10, 2, -1., 5, 7, 5, 2, 2., -5.8745909482240677e-003, 0.3754391074180603, 0.5679376125335693, 0, 2, 8, 7, 3, 3, -1., 9, 7, 1, 3, 3., -4.4936719350516796e-003, 0.7019699215888977, 0.4480949938297272, 0, 2, 15, 12, 2, 3, -1., 15, 13, 2, 1, 3., -5.4389229044318199e-003, 0.2310364991426468, 0.5313386917114258, 0, 2, 7, 8, 3, 4, -1., 8, 8, 1, 4, 3., -7.5094640487805009e-004, 0.5864868760108948, 0.4129343032836914, 0, 2, 13, 4, 1, 12, -1., 13, 10, 1, 6, 2., 1.4528800420521293e-005, 0.3732407093048096, 0.5619621276855469, 0, 3, 4, 5, 12, 12, -1., 4, 5, 6, 6, 2., 10, 11, 6, 6, 2., 0.0407580696046352, 0.5312091112136841, 0.2720521986484528, 0, 2, 7, 14, 7, 3, -1., 7, 15, 7, 1, 3., 6.6505931317806244e-003, 0.4710015952587128, 0.6693493723869324, 0, 2, 3, 12, 2, 3, -1., 3, 13, 2, 1, 3., 4.5759351924061775e-003, 0.5167819261550903, 0.1637275964021683, 0, 3, 3, 2, 14, 2, -1., 10, 2, 7, 1, 2., 3, 3, 7, 1, 2., 6.5269311890006065e-003, 0.5397608876228333, 0.2938531935214996, 0, 2, 0, 1, 3, 10, -1., 1, 1, 1, 10, 3., -0.0136603796854615, 0.7086488008499146, 0.4532200098037720, 0, 2, 9, 0, 6, 5, -1., 11, 0, 2, 5, 3., 0.0273588690906763, 0.5206481218338013, 0.3589231967926025, 0, 2, 5, 7, 6, 2, -1., 8, 7, 3, 2, 2., 6.2197551596909761e-004, 0.3507075905799866, 0.5441123247146606, 0, 2, 7, 1, 6, 10, -1., 7, 6, 6, 5, 2., -3.3077080734074116e-003, 0.5859522819519043, 0.4024891853332520, 0, 2, 1, 1, 18, 3, -1., 7, 1, 6, 3, 3., -0.0106311095878482, 0.6743267178535461, 0.4422602951526642, 0, 2, 16, 3, 3, 6, -1., 16, 5, 3, 2, 3., 0.0194416493177414, 0.5282716155052185, 0.1797904968261719, 34.5541114807128910, 71, 0, 2, 6, 3, 7, 6, -1., 6, 6, 7, 3, 2., -5.5052167735993862e-003, 0.5914731025695801, 0.2626559138298035, 0, 2, 4, 7, 12, 2, -1., 8, 7, 4, 2, 3., 1.9562279339879751e-003, 0.2312581986188889, 0.5741627216339111, 0, 2, 0, 4, 17, 10, -1., 0, 9, 17, 5, 2., -8.8924784213304520e-003, 0.1656530052423477, 0.5626654028892517, 0, 2, 3, 4, 15, 16, -1., 3, 12, 15, 8, 2., 0.0836383774876595, 0.5423449873924255, 0.1957294940948486, 0, 2, 7, 15, 6, 4, -1., 7, 17, 6, 2, 2., 1.2282270472496748e-003, 0.3417904078960419, 0.5992503762245178, 0, 2, 15, 2, 4, 9, -1., 15, 2, 2, 9, 2., 5.7629169896245003e-003, 0.3719581961631775, 0.6079903841018677, 0, 2, 2, 3, 3, 2, -1., 2, 4, 3, 1, 2., -1.6417410224676132e-003, 0.2577486038208008, 0.5576915740966797, 0, 2, 13, 6, 7, 9, -1., 13, 9, 7, 3, 3., 3.4113149158656597e-003, 0.2950749099254608, 0.5514171719551086, 0, 2, 8, 11, 4, 3, -1., 8, 12, 4, 1, 3., -0.0110693201422691, 0.7569358944892883, 0.4477078914642334, 0, 3, 0, 2, 20, 6, -1., 10, 2, 10, 3, 2., 0, 5, 10, 3, 2., 0.0348659716546535, 0.5583708882331848, 0.2669621109962463, 0, 3, 3, 2, 6, 10, -1., 3, 2, 3, 5, 2., 6, 7, 3, 5, 2., 6.5701099811121821e-004, 0.5627313256263733, 0.2988890111446381, 0, 2, 13, 10, 3, 4, -1., 13, 12, 3, 2, 2., -0.0243391301482916, 0.2771185040473938, 0.5108863115310669, 0, 2, 4, 10, 3, 4, -1., 4, 12, 3, 2, 2., 5.9435202274471521e-004, 0.5580651760101318, 0.3120341897010803, 0, 2, 7, 5, 6, 3, -1., 9, 5, 2, 3, 3., 2.2971509024500847e-003, 0.3330250084400177, 0.5679075717926025, 0, 2, 7, 6, 6, 8, -1., 7, 10, 6, 4, 2., -3.7801829166710377e-003, 0.2990534901618958, 0.5344808101654053, 0, 2, 0, 11, 20, 6, -1., 0, 14, 20, 3, 2., -0.1342066973447800, 0.1463858932256699, 0.5392568111419678, 0, 3, 4, 13, 4, 6, -1., 4, 13, 2, 3, 2., 6, 16, 2, 3, 2., 7.5224548345431685e-004, 0.3746953904628754, 0.5692734718322754, 0, 3, 6, 0, 8, 12, -1., 10, 0, 4, 6, 2., 6, 6, 4, 6, 2., -0.0405455417931080, 0.2754747867584229, 0.5484297871589661, 0, 2, 2, 0, 15, 2, -1., 2, 1, 15, 1, 2., 1.2572970008477569e-003, 0.3744584023952484, 0.5756075978279114, 0, 2, 9, 12, 2, 3, -1., 9, 13, 2, 1, 3., -7.4249948374927044e-003, 0.7513859272003174, 0.4728231132030487, 0, 2, 3, 12, 1, 2, -1., 3, 13, 1, 1, 2., 5.0908129196614027e-004, 0.5404896736145020, 0.2932321131229401, 0, 2, 9, 11, 2, 3, -1., 9, 12, 2, 1, 3., -1.2808450264856219e-003, 0.6169779896736145, 0.4273349046707153, 0, 2, 7, 3, 3, 1, -1., 8, 3, 1, 1, 3., -1.8348860321566463e-003, 0.2048496007919312, 0.5206472277641296, 0, 2, 17, 7, 3, 6, -1., 17, 9, 3, 2, 3., 0.0274848695844412, 0.5252984762191773, 0.1675522029399872, 0, 2, 7, 2, 3, 2, -1., 8, 2, 1, 2, 3., 2.2372419480234385e-003, 0.5267782807350159, 0.2777658104896545, 0, 2, 11, 4, 5, 3, -1., 11, 5, 5, 1, 3., -8.8635291904211044e-003, 0.6954557895660400, 0.4812048971652985, 0, 2, 4, 4, 5, 3, -1., 4, 5, 5, 1, 3., 4.1753971017897129e-003, 0.4291887879371643, 0.6349195837974548, 0, 2, 19, 3, 1, 2, -1., 19, 4, 1, 1, 2., -1.7098189564421773e-003, 0.2930536866188049, 0.5361248850822449, 0, 2, 5, 5, 4, 3, -1., 5, 6, 4, 1, 3., 6.5328548662364483e-003, 0.4495325088500977, 0.7409694194793701, 0, 2, 17, 7, 3, 6, -1., 17, 9, 3, 2, 3., -9.5372907817363739e-003, 0.3149119913578033, 0.5416501760482788, 0, 2, 0, 7, 3, 6, -1., 0, 9, 3, 2, 3., 0.0253109894692898, 0.5121892094612122, 0.1311707943677902, 0, 2, 14, 2, 6, 9, -1., 14, 5, 6, 3, 3., 0.0364609695971012, 0.5175911784172058, 0.2591339945793152, 0, 2, 0, 4, 5, 6, -1., 0, 6, 5, 2, 3., 0.0208543296903372, 0.5137140154838562, 0.1582316011190414, 0, 2, 10, 5, 6, 2, -1., 12, 5, 2, 2, 3., -8.7207747856155038e-004, 0.5574309825897217, 0.4398978948593140, 0, 2, 4, 5, 6, 2, -1., 6, 5, 2, 2, 3., -1.5227000403683633e-005, 0.5548940896987915, 0.3708069920539856, 0, 2, 8, 1, 4, 6, -1., 8, 3, 4, 2, 3., -8.4316509310156107e-004, 0.3387419879436493, 0.5554211139678955, 0, 2, 0, 2, 3, 6, -1., 0, 4, 3, 2, 3., 3.6037859972566366e-003, 0.5358061790466309, 0.3411171138286591, 0, 2, 6, 6, 8, 3, -1., 6, 7, 8, 1, 3., -6.8057891912758350e-003, 0.6125202775001526, 0.4345862865447998, 0, 2, 0, 1, 5, 9, -1., 0, 4, 5, 3, 3., -0.0470216609537601, 0.2358165979385376, 0.5193738937377930, 0, 2, 16, 0, 4, 15, -1., 16, 0, 2, 15, 2., -0.0369541086256504, 0.7323111295700073, 0.4760943949222565, 0, 2, 1, 10, 3, 2, -1., 1, 11, 3, 1, 2., 1.0439479956403375e-003, 0.5419455170631409, 0.3411330878734589, 0, 2, 14, 4, 1, 10, -1., 14, 9, 1, 5, 2., -2.1050689974799752e-004, 0.2821694016456604, 0.5554947257041931, 0, 2, 0, 1, 4, 12, -1., 2, 1, 2, 12, 2., -0.0808315873146057, 0.9129930138587952, 0.4697434902191162, 0, 2, 11, 11, 4, 2, -1., 11, 11, 2, 2, 2., -3.6579059087671340e-004, 0.6022670269012451, 0.3978292942047119, 0, 2, 5, 11, 4, 2, -1., 7, 11, 2, 2, 2., -1.2545920617412776e-004, 0.5613213181495667, 0.3845539987087250, 0, 2, 3, 8, 15, 5, -1., 8, 8, 5, 5, 3., -0.0687864869832993, 0.2261611968278885, 0.5300496816635132, 0, 2, 0, 0, 6, 10, -1., 3, 0, 3, 10, 2., 0.0124157899990678, 0.4075691998004913, 0.5828812122344971, 0, 2, 11, 4, 3, 2, -1., 12, 4, 1, 2, 3., -4.7174817882478237e-003, 0.2827253937721252, 0.5267757773399353, 0, 2, 8, 12, 3, 8, -1., 8, 16, 3, 4, 2., 0.0381368584930897, 0.5074741244316101, 0.1023615971207619, 0, 2, 8, 14, 5, 3, -1., 8, 15, 5, 1, 3., -2.8168049175292253e-003, 0.6169006824493408, 0.4359692931175232, 0, 2, 7, 14, 4, 3, -1., 7, 15, 4, 1, 3., 8.1303603947162628e-003, 0.4524433016777039, 0.7606095075607300, 0, 2, 11, 4, 3, 2, -1., 12, 4, 1, 2, 3., 6.0056019574403763e-003, 0.5240408778190613, 0.1859712004661560, 0, 3, 3, 15, 14, 4, -1., 3, 15, 7, 2, 2., 10, 17, 7, 2, 2., 0.0191393196582794, 0.5209379196166992, 0.2332071959972382, 0, 3, 2, 2, 16, 4, -1., 10, 2, 8, 2, 2., 2, 4, 8, 2, 2., 0.0164457596838474, 0.5450702905654907, 0.3264234960079193, 0, 2, 0, 8, 6, 12, -1., 3, 8, 3, 12, 2., -0.0373568907380104, 0.6999046802520752, 0.4533241987228394, 0, 2, 5, 7, 10, 2, -1., 5, 7, 5, 2, 2., -0.0197279006242752, 0.2653664946556091, 0.5412809848785400, 0, 2, 9, 7, 2, 5, -1., 10, 7, 1, 5, 2., 6.6972579807043076e-003, 0.4480566084384918, 0.7138652205467224, 0, 3, 13, 7, 6, 4, -1., 16, 7, 3, 2, 2., 13, 9, 3, 2, 2., 7.4457528535276651e-004, 0.4231350123882294, 0.5471320152282715, 0, 2, 0, 13, 8, 2, -1., 0, 14, 8, 1, 2., 1.1790640419349074e-003, 0.5341702103614807, 0.3130455017089844, 0, 3, 13, 7, 6, 4, -1., 16, 7, 3, 2, 2., 13, 9, 3, 2, 2., 0.0349806100130081, 0.5118659734725952, 0.3430530130863190, 0, 3, 1, 7, 6, 4, -1., 1, 7, 3, 2, 2., 4, 9, 3, 2, 2., 5.6859792675822973e-004, 0.3532187044620514, 0.5468639731407166, 0, 2, 12, 6, 1, 12, -1., 12, 12, 1, 6, 2., -0.0113406497985125, 0.2842353880405426, 0.5348700881004334, 0, 2, 9, 5, 2, 6, -1., 10, 5, 1, 6, 2., -6.6228108480572701e-003, 0.6883640289306641, 0.4492664933204651, 0, 2, 14, 12, 2, 3, -1., 14, 13, 2, 1, 3., -8.0160330981016159e-003, 0.1709893941879273, 0.5224308967590332, 0, 2, 4, 12, 2, 3, -1., 4, 13, 2, 1, 3., 1.4206819469109178e-003, 0.5290846228599548, 0.2993383109569550, 0, 2, 8, 12, 4, 3, -1., 8, 13, 4, 1, 3., -2.7801711112260818e-003, 0.6498854160308838, 0.4460499882698059, 0, 3, 5, 2, 2, 4, -1., 5, 2, 1, 2, 2., 6, 4, 1, 2, 2., -1.4747589593753219e-003, 0.3260438144207001, 0.5388113260269165, 0, 2, 5, 5, 11, 3, -1., 5, 6, 11, 1, 3., -0.0238303393125534, 0.7528941035270691, 0.4801219999790192, 0, 2, 7, 6, 4, 12, -1., 7, 12, 4, 6, 2., 6.9369790144264698e-003, 0.5335165858268738, 0.3261427879333496, 0, 2, 12, 13, 8, 5, -1., 12, 13, 4, 5, 2., 8.2806255668401718e-003, 0.4580394029617310, 0.5737829804420471, 0, 2, 7, 6, 1, 12, -1., 7, 12, 1, 6, 2., -0.0104395002126694, 0.2592320144176483, 0.5233827829360962, 39.1072883605957030, 80, 0, 2, 1, 2, 6, 3, -1., 4, 2, 3, 3, 2., 7.2006587870419025e-003, 0.3258886039257050, 0.6849808096885681, 0, 3, 9, 5, 6, 10, -1., 12, 5, 3, 5, 2., 9, 10, 3, 5, 2., -2.8593589086085558e-003, 0.5838881134986877, 0.2537829875946045, 0, 3, 5, 5, 8, 12, -1., 5, 5, 4, 6, 2., 9, 11, 4, 6, 2., 6.8580528022721410e-004, 0.5708081722259522, 0.2812424004077911, 0, 2, 0, 7, 20, 6, -1., 0, 9, 20, 2, 3., 7.9580191522836685e-003, 0.2501051127910614, 0.5544260740280151, 0, 2, 4, 2, 2, 2, -1., 4, 3, 2, 1, 2., -1.2124150525778532e-003, 0.2385368049144745, 0.5433350205421448, 0, 2, 4, 18, 12, 2, -1., 8, 18, 4, 2, 3., 7.9426132142543793e-003, 0.3955070972442627, 0.6220757961273193, 0, 2, 7, 4, 4, 16, -1., 7, 12, 4, 8, 2., 2.4630590341985226e-003, 0.5639708042144775, 0.2992357909679413, 0, 2, 7, 6, 7, 8, -1., 7, 10, 7, 4, 2., -6.0396599583327770e-003, 0.2186512947082520, 0.5411676764488220, 0, 2, 6, 3, 3, 1, -1., 7, 3, 1, 1, 3., -1.2988339876756072e-003, 0.2350706011056900, 0.5364584922790527, 0, 2, 11, 15, 2, 4, -1., 11, 17, 2, 2, 2., 2.2299369447864592e-004, 0.3804112970829010, 0.5729606151580811, 0, 2, 3, 5, 4, 8, -1., 3, 9, 4, 4, 2., 1.4654280385002494e-003, 0.2510167956352234, 0.5258268713951111, 0, 2, 7, 1, 6, 12, -1., 7, 7, 6, 6, 2., -8.1210042117163539e-004, 0.5992823839187622, 0.3851158916950226, 0, 2, 4, 6, 6, 2, -1., 6, 6, 2, 2, 3., -1.3836020370945334e-003, 0.5681396126747131, 0.3636586964130402, 0, 2, 16, 4, 4, 6, -1., 16, 6, 4, 2, 3., -0.0279364492744207, 0.1491317003965378, 0.5377560257911682, 0, 2, 3, 3, 5, 2, -1., 3, 4, 5, 1, 2., -4.6919551095925272e-004, 0.3692429959774017, 0.5572484731674194, 0, 2, 9, 11, 2, 3, -1., 9, 12, 2, 1, 3., -4.9829659983515739e-003, 0.6758509278297424, 0.4532504081726074, 0, 2, 2, 16, 4, 2, -1., 2, 17, 4, 1, 2., 1.8815309740602970e-003, 0.5368022918701172, 0.2932539880275726, 0, 3, 7, 13, 6, 6, -1., 10, 13, 3, 3, 2., 7, 16, 3, 3, 2., -0.0190675500780344, 0.1649377048015595, 0.5330067276954651, 0, 2, 7, 0, 3, 4, -1., 8, 0, 1, 4, 3., -4.6906559728085995e-003, 0.1963925957679749, 0.5119361877441406, 0, 2, 8, 15, 4, 3, -1., 8, 16, 4, 1, 3., 5.9777139686048031e-003, 0.4671171903610230, 0.7008398175239563, 0, 2, 0, 4, 4, 6, -1., 0, 6, 4, 2, 3., -0.0333031304180622, 0.1155416965484619, 0.5104162096977234, 0, 2, 5, 6, 12, 3, -1., 9, 6, 4, 3, 3., 0.0907441079616547, 0.5149660110473633, 0.1306173056364059, 0, 2, 7, 6, 6, 14, -1., 9, 6, 2, 14, 3., 9.3555898638442159e-004, 0.3605481088161469, 0.5439859032630920, 0, 2, 9, 7, 3, 3, -1., 10, 7, 1, 3, 3., 0.0149016501381993, 0.4886212050914764, 0.7687569856643677, 0, 2, 6, 12, 2, 4, -1., 6, 14, 2, 2, 2., 6.1594118596985936e-004, 0.5356813073158264, 0.3240939080715179, 0, 2, 10, 12, 7, 6, -1., 10, 14, 7, 2, 3., -0.0506709888577461, 0.1848621964454651, 0.5230404138565064, 0, 2, 1, 0, 15, 2, -1., 1, 1, 15, 1, 2., 6.8665749859064817e-004, 0.3840579986572266, 0.5517945885658264, 0, 2, 14, 0, 6, 6, -1., 14, 0, 3, 6, 2., 8.3712432533502579e-003, 0.4288564026355743, 0.6131753921508789, 0, 2, 5, 3, 3, 1, -1., 6, 3, 1, 1, 3., -1.2953069526702166e-003, 0.2913674116134644, 0.5280737876892090, 0, 2, 14, 0, 6, 6, -1., 14, 0, 3, 6, 2., -0.0419416800141335, 0.7554799914360046, 0.4856030941009522, 0, 2, 0, 3, 20, 10, -1., 0, 8, 20, 5, 2., -0.0235293805599213, 0.2838279902935028, 0.5256081223487854, 0, 2, 14, 0, 6, 6, -1., 14, 0, 3, 6, 2., 0.0408574491739273, 0.4870935082435608, 0.6277297139167786, 0, 2, 0, 0, 6, 6, -1., 3, 0, 3, 6, 2., -0.0254068691283464, 0.7099707722663879, 0.4575029015541077, 0, 2, 19, 15, 1, 2, -1., 19, 16, 1, 1, 2., -4.1415440500713885e-004, 0.4030886888504028, 0.5469412207603455, 0, 2, 0, 2, 4, 8, -1., 2, 2, 2, 8, 2., 0.0218241196125746, 0.4502024054527283, 0.6768701076507568, 0, 3, 2, 1, 18, 4, -1., 11, 1, 9, 2, 2., 2, 3, 9, 2, 2., 0.0141140399500728, 0.5442860722541809, 0.3791700005531311, 0, 2, 8, 12, 1, 2, -1., 8, 13, 1, 1, 2., 6.7214590671937913e-005, 0.4200463891029358, 0.5873476266860962, 0, 3, 5, 2, 10, 6, -1., 10, 2, 5, 3, 2., 5, 5, 5, 3, 2., -7.9417638480663300e-003, 0.3792561888694763, 0.5585265755653381, 0, 2, 9, 7, 2, 4, -1., 10, 7, 1, 4, 2., -7.2144409641623497e-003, 0.7253103852272034, 0.4603548943996429, 0, 2, 9, 7, 3, 3, -1., 10, 7, 1, 3, 3., 2.5817339774221182e-003, 0.4693301916122437, 0.5900238752365112, 0, 2, 4, 5, 12, 8, -1., 8, 5, 4, 8, 3., 0.1340931951999664, 0.5149213075637817, 0.1808844953775406, 0, 2, 15, 15, 4, 3, -1., 15, 16, 4, 1, 3., 2.2962710354477167e-003, 0.5399743914604187, 0.3717867136001587, 0, 2, 8, 18, 3, 1, -1., 9, 18, 1, 1, 3., -2.1575849968940020e-003, 0.2408495992422104, 0.5148863792419434, 0, 2, 9, 13, 4, 3, -1., 9, 14, 4, 1, 3., -4.9196188338100910e-003, 0.6573588252067566, 0.4738740026950836, 0, 2, 7, 13, 4, 3, -1., 7, 14, 4, 1, 3., 1.6267469618469477e-003, 0.4192821979522705, 0.6303114295005798, 0, 2, 19, 15, 1, 2, -1., 19, 16, 1, 1, 2., 3.3413388882763684e-004, 0.5540298223495483, 0.3702101111412048, 0, 2, 0, 15, 8, 4, -1., 0, 17, 8, 2, 2., -0.0266980808228254, 0.1710917949676514, 0.5101410746574402, 0, 2, 9, 3, 6, 4, -1., 11, 3, 2, 4, 3., -0.0305618792772293, 0.1904218047857285, 0.5168793797492981, 0, 2, 8, 14, 4, 3, -1., 8, 15, 4, 1, 3., 2.8511548880487680e-003, 0.4447506964206696, 0.6313853859901428, 0, 2, 3, 14, 14, 6, -1., 3, 16, 14, 2, 3., -0.0362114794552326, 0.2490727007389069, 0.5377349257469177, 0, 2, 6, 3, 6, 6, -1., 6, 6, 6, 3, 2., -2.4115189444273710e-003, 0.5381243228912354, 0.3664236962795258, 0, 2, 5, 11, 10, 6, -1., 5, 14, 10, 3, 2., -7.7253201743587852e-004, 0.5530232191085815, 0.3541550040245056, 0, 2, 3, 10, 3, 4, -1., 4, 10, 1, 4, 3., 2.9481729143299162e-004, 0.4132699072360992, 0.5667243003845215, 0, 2, 13, 9, 2, 2, -1., 13, 9, 1, 2, 2., -6.2334560789167881e-003, 0.0987872332334518, 0.5198668837547302, 0, 2, 5, 3, 6, 4, -1., 7, 3, 2, 4, 3., -0.0262747295200825, 0.0911274924874306, 0.5028107166290283, 0, 2, 9, 7, 3, 3, -1., 10, 7, 1, 3, 3., 5.3212260827422142e-003, 0.4726648926734924, 0.6222720742225647, 0, 2, 2, 12, 2, 3, -1., 2, 13, 2, 1, 3., -4.1129058226943016e-003, 0.2157457023859024, 0.5137804746627808, 0, 2, 9, 8, 3, 12, -1., 9, 12, 3, 4, 3., 3.2457809429615736e-003, 0.5410770773887634, 0.3721776902675629, 0, 3, 3, 14, 4, 6, -1., 3, 14, 2, 3, 2., 5, 17, 2, 3, 2., -0.0163597092032433, 0.7787874937057495, 0.4685291945934296, 0, 2, 16, 15, 2, 2, -1., 16, 16, 2, 1, 2., 3.2166109303943813e-004, 0.5478987097740173, 0.4240373969078064, 0, 2, 2, 15, 2, 2, -1., 2, 16, 2, 1, 2., 6.4452440710738301e-004, 0.5330560803413391, 0.3501324951648712, 0, 2, 8, 12, 4, 3, -1., 8, 13, 4, 1, 3., -7.8909732401371002e-003, 0.6923521161079407, 0.4726569056510925, 0, 2, 0, 7, 20, 1, -1., 10, 7, 10, 1, 2., 0.0483362115919590, 0.5055900216102600, 0.0757492035627365, 0, 2, 7, 6, 8, 3, -1., 7, 6, 4, 3, 2., -7.5178127735853195e-004, 0.3783741891384125, 0.5538573861122131, 0, 2, 5, 7, 8, 2, -1., 9, 7, 4, 2, 2., -2.4953910615295172e-003, 0.3081651031970978, 0.5359612107276917, 0, 2, 9, 7, 3, 5, -1., 10, 7, 1, 5, 3., -2.2385010961443186e-003, 0.6633958816528320, 0.4649342894554138, 0, 2, 8, 7, 3, 5, -1., 9, 7, 1, 5, 3., -1.7988430336117744e-003, 0.6596844792366028, 0.4347187876701355, 0, 2, 11, 1, 3, 5, -1., 12, 1, 1, 5, 3., 8.7860915809869766e-003, 0.5231832861900330, 0.2315579950809479, 0, 2, 6, 2, 3, 6, -1., 7, 2, 1, 6, 3., 3.6715380847454071e-003, 0.5204250216484070, 0.2977376878261566, 0, 2, 14, 14, 6, 5, -1., 14, 14, 3, 5, 2., -0.0353364497423172, 0.7238878011703491, 0.4861505031585693, 0, 2, 9, 8, 2, 2, -1., 9, 9, 2, 1, 2., -6.9189240457490087e-004, 0.3105022013187408, 0.5229824781417847, 0, 2, 10, 7, 1, 3, -1., 10, 8, 1, 1, 3., -3.3946109469980001e-003, 0.3138968050479889, 0.5210173726081848, 0, 3, 6, 6, 2, 2, -1., 6, 6, 1, 1, 2., 7, 7, 1, 1, 2., 9.8569283727556467e-004, 0.4536580145359039, 0.6585097908973694, 0, 3, 2, 11, 18, 4, -1., 11, 11, 9, 2, 2., 2, 13, 9, 2, 2., -0.0501631014049053, 0.1804454028606415, 0.5198916792869568, 0, 3, 6, 6, 2, 2, -1., 6, 6, 1, 1, 2., 7, 7, 1, 1, 2., -2.2367259953171015e-003, 0.7255702018737793, 0.4651359021663666, 0, 2, 0, 15, 20, 2, -1., 0, 16, 20, 1, 2., 7.4326287722215056e-004, 0.4412921071052551, 0.5898545980453491, 0, 2, 4, 14, 2, 3, -1., 4, 15, 2, 1, 3., -9.3485182151198387e-004, 0.3500052988529205, 0.5366017818450928, 0, 2, 8, 14, 4, 3, -1., 8, 15, 4, 1, 3., 0.0174979399889708, 0.4912194907665253, 0.8315284848213196, 0, 2, 8, 7, 2, 3, -1., 8, 8, 2, 1, 3., -1.5200000489130616e-003, 0.3570275902748108, 0.5370560288429260, 0, 2, 9, 10, 2, 3, -1., 9, 11, 2, 1, 3., 7.8003940870985389e-004, 0.4353772103786469, 0.5967335104942322, 50.6104812622070310, 103, 0, 2, 5, 4, 10, 4, -1., 5, 6, 10, 2, 2., -9.9945552647113800e-003, 0.6162583231925964, 0.3054533004760742, 0, 3, 9, 7, 6, 4, -1., 12, 7, 3, 2, 2., 9, 9, 3, 2, 2., -1.1085229925811291e-003, 0.5818294882774353, 0.3155578076839447, 0, 2, 4, 7, 3, 6, -1., 4, 9, 3, 2, 3., 1.0364380432292819e-003, 0.2552052140235901, 0.5692911744117737, 0, 3, 11, 15, 4, 4, -1., 13, 15, 2, 2, 2., 11, 17, 2, 2, 2., 6.8211311008781195e-004, 0.3685089945793152, 0.5934931039810181, 0, 2, 7, 8, 4, 2, -1., 7, 9, 4, 1, 2., -6.8057340104132891e-004, 0.2332392036914825, 0.5474792122840881, 0, 2, 13, 1, 4, 3, -1., 13, 1, 2, 3, 2., 2.6068789884448051e-004, 0.3257457017898560, 0.5667545795440674, 0, 3, 5, 15, 4, 4, -1., 5, 15, 2, 2, 2., 7, 17, 2, 2, 2., 5.1607372006401420e-004, 0.3744716942310333, 0.5845472812652588, 0, 2, 9, 5, 4, 7, -1., 9, 5, 2, 7, 2., 8.5007521556690335e-004, 0.3420371115207672, 0.5522807240486145, 0, 2, 5, 6, 8, 3, -1., 9, 6, 4, 3, 2., -1.8607829697430134e-003, 0.2804419994354248, 0.5375424027442932, 0, 2, 9, 9, 2, 2, -1., 9, 10, 2, 1, 2., -1.5033970121294260e-003, 0.2579050958156586, 0.5498952269554138, 0, 2, 7, 15, 5, 3, -1., 7, 16, 5, 1, 3., 2.3478909861296415e-003, 0.4175156056880951, 0.6313710808753967, 0, 2, 11, 10, 4, 3, -1., 11, 10, 2, 3, 2., -2.8880240279249847e-004, 0.5865169763565064, 0.4052666127681732, 0, 2, 6, 9, 8, 10, -1., 6, 14, 8, 5, 2., 8.9405477046966553e-003, 0.5211141109466553, 0.2318654060363770, 0, 2, 10, 11, 6, 2, -1., 10, 11, 3, 2, 2., -0.0193277392536402, 0.2753432989120483, 0.5241525769233704, 0, 2, 4, 11, 6, 2, -1., 7, 11, 3, 2, 2., -2.0202060113660991e-004, 0.5722978711128235, 0.3677195906639099, 0, 2, 11, 3, 8, 1, -1., 11, 3, 4, 1, 2., 2.1179069299250841e-003, 0.4466108083724976, 0.5542430877685547, 0, 2, 6, 3, 3, 2, -1., 7, 3, 1, 2, 3., -1.7743760254234076e-003, 0.2813253104686737, 0.5300959944725037, 0, 2, 14, 5, 6, 5, -1., 14, 5, 3, 5, 2., 4.2234458960592747e-003, 0.4399709999561310, 0.5795428156852722, 0, 2, 7, 5, 2, 12, -1., 7, 11, 2, 6, 2., -0.0143752200528979, 0.2981117963790894, 0.5292059183120728, 0, 2, 8, 11, 4, 3, -1., 8, 12, 4, 1, 3., -0.0153491804376245, 0.7705215215682983, 0.4748171865940094, 0, 2, 4, 1, 2, 3, -1., 5, 1, 1, 3, 2., 1.5152279956964776e-005, 0.3718844056129456, 0.5576897263526917, 0, 2, 18, 3, 2, 6, -1., 18, 5, 2, 2, 3., -9.1293919831514359e-003, 0.3615196049213409, 0.5286766886711121, 0, 2, 0, 3, 2, 6, -1., 0, 5, 2, 2, 3., 2.2512159775942564e-003, 0.5364704728126526, 0.3486298024654388, 0, 2, 9, 12, 2, 3, -1., 9, 13, 2, 1, 3., -4.9696918576955795e-003, 0.6927651762962341, 0.4676836133003235, 0, 2, 7, 13, 4, 3, -1., 7, 14, 4, 1, 3., -0.0128290103748441, 0.7712153792381287, 0.4660735130310059, 0, 2, 18, 0, 2, 6, -1., 18, 2, 2, 2, 3., -9.3660065904259682e-003, 0.3374983966350555, 0.5351287722587585, 0, 2, 0, 0, 2, 6, -1., 0, 2, 2, 2, 3., 3.2452319283038378e-003, 0.5325189828872681, 0.3289610147476196, 0, 2, 8, 14, 6, 3, -1., 8, 15, 6, 1, 3., -0.0117235602810979, 0.6837652921676636, 0.4754300117492676, 0, 2, 7, 4, 2, 4, -1., 8, 4, 1, 4, 2., 2.9257940695970319e-005, 0.3572087883949280, 0.5360502004623413, 0, 2, 8, 5, 4, 6, -1., 8, 7, 4, 2, 3., -2.2244219508138485e-005, 0.5541427135467529, 0.3552064001560211, 0, 2, 6, 4, 2, 2, -1., 7, 4, 1, 2, 2., 5.0881509669125080e-003, 0.5070844292640686, 0.1256462037563324, 0, 3, 3, 14, 14, 4, -1., 10, 14, 7, 2, 2., 3, 16, 7, 2, 2., 0.0274296794086695, 0.5269560217857361, 0.1625818014144898, 0, 3, 6, 15, 6, 2, -1., 6, 15, 3, 1, 2., 9, 16, 3, 1, 2., -6.4142867922782898e-003, 0.7145588994026184, 0.4584197103977203, 0, 2, 14, 15, 6, 2, -1., 14, 16, 6, 1, 2., 3.3479959238320589e-003, 0.5398612022399902, 0.3494696915149689, 0, 2, 2, 12, 12, 8, -1., 2, 16, 12, 4, 2., -0.0826354920864105, 0.2439192980527878, 0.5160226225852966, 0, 2, 7, 7, 7, 2, -1., 7, 8, 7, 1, 2., 1.0261740535497665e-003, 0.3886891901493073, 0.5767908096313477, 0, 2, 0, 2, 18, 2, -1., 0, 3, 18, 1, 2., -1.6307090409100056e-003, 0.3389458060264587, 0.5347700715065002, 0, 2, 9, 6, 2, 5, -1., 9, 6, 1, 5, 2., 2.4546680506318808e-003, 0.4601413905620575, 0.6387246847152710, 0, 2, 7, 5, 3, 8, -1., 8, 5, 1, 8, 3., -9.9476519972085953e-004, 0.5769879221916199, 0.4120396077632904, 0, 2, 9, 6, 3, 4, -1., 10, 6, 1, 4, 3., 0.0154091902077198, 0.4878709018230438, 0.7089822292327881, 0, 2, 4, 13, 3, 2, -1., 4, 14, 3, 1, 2., 1.1784400558099151e-003, 0.5263553261756897, 0.2895244956016541, 0, 2, 9, 4, 6, 3, -1., 11, 4, 2, 3, 3., -0.0277019198983908, 0.1498828977346420, 0.5219606757164002, 0, 2, 5, 4, 6, 3, -1., 7, 4, 2, 3, 3., -0.0295053999871016, 0.0248933192342520, 0.4999816119670868, 0, 2, 14, 11, 5, 2, -1., 14, 12, 5, 1, 2., 4.5159430010244250e-004, 0.5464622974395752, 0.4029662907123566, 0, 2, 1, 2, 6, 9, -1., 3, 2, 2, 9, 3., 7.1772639639675617e-003, 0.4271056950092316, 0.5866296887397766, 0, 2, 14, 6, 6, 13, -1., 14, 6, 3, 13, 2., -0.0741820484399796, 0.6874179244041443, 0.4919027984142304, 0, 3, 3, 6, 14, 8, -1., 3, 6, 7, 4, 2., 10, 10, 7, 4, 2., -0.0172541607171297, 0.3370676040649414, 0.5348739027976990, 0, 2, 16, 0, 4, 11, -1., 16, 0, 2, 11, 2., 0.0148515598848462, 0.4626792967319489, 0.6129904985427856, 0, 3, 3, 4, 12, 12, -1., 3, 4, 6, 6, 2., 9, 10, 6, 6, 2., 0.0100020002573729, 0.5346122980117798, 0.3423453867435455, 0, 2, 11, 4, 5, 3, -1., 11, 5, 5, 1, 3., 2.0138120744377375e-003, 0.4643830060958862, 0.5824304223060608, 0, 2, 4, 11, 4, 2, -1., 4, 12, 4, 1, 2., 1.5135470312088728e-003, 0.5196396112442017, 0.2856149971485138, 0, 2, 10, 7, 2, 2, -1., 10, 7, 1, 2, 2., 3.1381431035697460e-003, 0.4838162958621979, 0.5958529710769653, 0, 2, 8, 7, 2, 2, -1., 9, 7, 1, 2, 2., -5.1450440660119057e-003, 0.8920302987098694, 0.4741412103176117, 0, 2, 9, 17, 3, 2, -1., 10, 17, 1, 2, 3., -4.4736708514392376e-003, 0.2033942937850952, 0.5337278842926025, 0, 2, 5, 6, 3, 3, -1., 5, 7, 3, 1, 3., 1.9628470763564110e-003, 0.4571633934974670, 0.6725863218307495, 0, 2, 10, 0, 3, 3, -1., 11, 0, 1, 3, 3., 5.4260450415313244e-003, 0.5271108150482178, 0.2845670878887177, 0, 3, 5, 6, 6, 2, -1., 5, 6, 3, 1, 2., 8, 7, 3, 1, 2., 4.9611460417509079e-004, 0.4138312935829163, 0.5718597769737244, 0, 2, 12, 16, 4, 3, -1., 12, 17, 4, 1, 3., 9.3728788197040558e-003, 0.5225151181221008, 0.2804847061634064, 0, 2, 3, 12, 3, 2, -1., 3, 13, 3, 1, 2., 6.0500897234305739e-004, 0.5236768722534180, 0.3314523994922638, 0, 2, 9, 12, 3, 2, -1., 9, 13, 3, 1, 2., 5.6792551185935736e-004, 0.4531059861183167, 0.6276971101760864, 0, 3, 1, 11, 16, 4, -1., 1, 11, 8, 2, 2., 9, 13, 8, 2, 2., 0.0246443394571543, 0.5130851864814758, 0.2017143964767456, 0, 2, 12, 4, 3, 3, -1., 12, 5, 3, 1, 3., -0.0102904504165053, 0.7786595225334168, 0.4876641035079956, 0, 2, 4, 4, 5, 3, -1., 4, 5, 5, 1, 3., 2.0629419013857841e-003, 0.4288598895072937, 0.5881264209747315, 0, 2, 12, 16, 4, 3, -1., 12, 17, 4, 1, 3., -5.0519481301307678e-003, 0.3523977994918823, 0.5286008715629578, 0, 2, 5, 4, 3, 3, -1., 5, 5, 3, 1, 3., -5.7692620903253555e-003, 0.6841086149215698, 0.4588094055652618, 0, 2, 9, 0, 2, 2, -1., 9, 1, 2, 1, 2., -4.5789941214025021e-004, 0.3565520048141480, 0.5485978126525879, 0, 2, 8, 9, 4, 2, -1., 8, 10, 4, 1, 2., -7.5918837683275342e-004, 0.3368793129920960, 0.5254197120666504, 0, 2, 8, 8, 4, 3, -1., 8, 9, 4, 1, 3., -1.7737259622663260e-003, 0.3422161042690277, 0.5454015135765076, 0, 2, 0, 13, 6, 3, -1., 2, 13, 2, 3, 3., -8.5610467940568924e-003, 0.6533612012863159, 0.4485856890678406, 0, 2, 16, 14, 3, 2, -1., 16, 15, 3, 1, 2., 1.7277270089834929e-003, 0.5307580232620239, 0.3925352990627289, 0, 2, 1, 18, 18, 2, -1., 7, 18, 6, 2, 3., -0.0281996093690395, 0.6857458949089050, 0.4588584005832672, 0, 2, 16, 14, 3, 2, -1., 16, 15, 3, 1, 2., -1.7781109781935811e-003, 0.4037851095199585, 0.5369856953620911, 0, 2, 1, 14, 3, 2, -1., 1, 15, 3, 1, 2., 3.3177141449414194e-004, 0.5399798750877380, 0.3705750107765198, 0, 2, 7, 14, 6, 3, -1., 7, 15, 6, 1, 3., 2.6385399978607893e-003, 0.4665437042713165, 0.6452730894088745, 0, 2, 5, 14, 8, 3, -1., 5, 15, 8, 1, 3., -2.1183069329708815e-003, 0.5914781093597412, 0.4064677059650421, 0, 2, 10, 6, 4, 14, -1., 10, 6, 2, 14, 2., -0.0147732896730304, 0.3642038106918335, 0.5294762849807739, 0, 2, 6, 6, 4, 14, -1., 8, 6, 2, 14, 2., -0.0168154407292604, 0.2664231956005096, 0.5144972801208496, 0, 2, 13, 5, 2, 3, -1., 13, 6, 2, 1, 3., -6.3370140269398689e-003, 0.6779531240463257, 0.4852097928524017, 0, 2, 7, 16, 6, 1, -1., 9, 16, 2, 1, 3., -4.4560048991115764e-005, 0.5613964796066284, 0.4153054058551788, 0, 2, 9, 12, 3, 3, -1., 9, 13, 3, 1, 3., -1.0240620467811823e-003, 0.5964478254318237, 0.4566304087638855, 0, 2, 7, 0, 3, 3, -1., 8, 0, 1, 3, 3., -2.3161689750850201e-003, 0.2976115047931671, 0.5188159942626953, 0, 2, 4, 0, 16, 18, -1., 4, 9, 16, 9, 2., 0.5321757197380066, 0.5187839269638062, 0.2202631980180740, 0, 2, 1, 1, 16, 14, -1., 1, 8, 16, 7, 2., -0.1664305031299591, 0.1866022944450378, 0.5060343146324158, 0, 2, 3, 9, 15, 4, -1., 8, 9, 5, 4, 3., 0.1125352978706360, 0.5212125182151794, 0.1185022965073586, 0, 2, 6, 12, 7, 3, -1., 6, 13, 7, 1, 3., 9.3046864494681358e-003, 0.4589937031269074, 0.6826149225234985, 0, 2, 14, 15, 2, 3, -1., 14, 16, 2, 1, 3., -4.6255099587142467e-003, 0.3079940974712372, 0.5225008726119995, 0, 3, 2, 3, 16, 14, -1., 2, 3, 8, 7, 2., 10, 10, 8, 7, 2., -0.1111646965146065, 0.2101044058799744, 0.5080801844596863, 0, 3, 16, 2, 4, 18, -1., 18, 2, 2, 9, 2., 16, 11, 2, 9, 2., -0.0108884396031499, 0.5765355229377747, 0.4790464043617249, 0, 2, 4, 15, 2, 3, -1., 4, 16, 2, 1, 3., 5.8564301580190659e-003, 0.5065100193023682, 0.1563598960638046, 0, 3, 16, 2, 4, 18, -1., 18, 2, 2, 9, 2., 16, 11, 2, 9, 2., 0.0548543892800808, 0.4966914951801300, 0.7230510711669922, 0, 2, 1, 1, 8, 3, -1., 1, 2, 8, 1, 3., -0.0111973397433758, 0.2194979041814804, 0.5098798274993897, 0, 2, 8, 11, 4, 3, -1., 8, 12, 4, 1, 3., 4.4069071300327778e-003, 0.4778401851654053, 0.6770902872085571, 0, 2, 5, 11, 5, 9, -1., 5, 14, 5, 3, 3., -0.0636652931571007, 0.1936362981796265, 0.5081024169921875, 0, 2, 16, 0, 4, 11, -1., 16, 0, 2, 11, 2., -9.8081491887569427e-003, 0.5999063253402710, 0.4810341000556946, 0, 2, 7, 0, 6, 1, -1., 9, 0, 2, 1, 3., -2.1717099007219076e-003, 0.3338333964347839, 0.5235472917556763, 0, 2, 16, 3, 3, 7, -1., 17, 3, 1, 7, 3., -0.0133155202493072, 0.6617069840431213, 0.4919213056564331, 0, 2, 1, 3, 3, 7, -1., 2, 3, 1, 7, 3., 2.5442079640924931e-003, 0.4488744139671326, 0.6082184910774231, 0, 2, 7, 8, 6, 12, -1., 7, 12, 6, 4, 3., 0.0120378397405148, 0.5409392118453980, 0.3292432129383087, 0, 2, 0, 0, 4, 11, -1., 2, 0, 2, 11, 2., -0.0207010507583618, 0.6819120049476624, 0.4594995975494385, 0, 2, 14, 0, 6, 20, -1., 14, 0, 3, 20, 2., 0.0276082791388035, 0.4630792140960693, 0.5767282843589783, 0, 2, 0, 3, 1, 2, -1., 0, 4, 1, 1, 2., 1.2370620388537645e-003, 0.5165379047393799, 0.2635016143321991, 0, 3, 5, 5, 10, 8, -1., 10, 5, 5, 4, 2., 5, 9, 5, 4, 2., -0.0376693382859230, 0.2536393105983734, 0.5278980135917664, 0, 3, 4, 7, 12, 4, -1., 4, 7, 6, 2, 2., 10, 9, 6, 2, 2., -1.8057259730994701e-003, 0.3985156118869782, 0.5517500042915344, 54.6200714111328130, 111, 0, 2, 2, 1, 6, 4, -1., 5, 1, 3, 4, 2., 4.4299028813838959e-003, 0.2891018092632294, 0.6335226297378540, 0, 3, 9, 7, 6, 4, -1., 12, 7, 3, 2, 2., 9, 9, 3, 2, 2., -2.3813319858163595e-003, 0.6211789250373840, 0.3477487862110138, 0, 2, 5, 6, 2, 6, -1., 5, 9, 2, 3, 2., 2.2915711160749197e-003, 0.2254412025213242, 0.5582118034362793, 0, 3, 9, 16, 6, 4, -1., 12, 16, 3, 2, 2., 9, 18, 3, 2, 2., 9.9457940086722374e-004, 0.3711710870265961, 0.5930070877075195, 0, 2, 9, 4, 2, 12, -1., 9, 10, 2, 6, 2., 7.7164667891338468e-004, 0.5651720166206360, 0.3347995877265930, 0, 2, 7, 1, 6, 18, -1., 9, 1, 2, 18, 3., -1.1386410333216190e-003, 0.3069126009941101, 0.5508630871772766, 0, 2, 4, 12, 12, 2, -1., 8, 12, 4, 2, 3., -1.6403039626311511e-004, 0.5762827992439270, 0.3699047863483429, 0, 2, 8, 8, 6, 2, -1., 8, 9, 6, 1, 2., 2.9793529392918572e-005, 0.2644244134426117, 0.5437911152839661, 0, 2, 8, 0, 3, 6, -1., 9, 0, 1, 6, 3., 8.5774902254343033e-003, 0.5051138997077942, 0.1795724928379059, 0, 2, 11, 18, 3, 2, -1., 11, 19, 3, 1, 2., -2.6032689493149519e-004, 0.5826969146728516, 0.4446826875209808, 0, 2, 1, 1, 17, 4, -1., 1, 3, 17, 2, 2., -6.1404630541801453e-003, 0.3113852143287659, 0.5346971750259399, 0, 2, 11, 8, 4, 12, -1., 11, 8, 2, 12, 2., -0.0230869501829147, 0.3277946114540100, 0.5331197977066040, 0, 2, 8, 14, 4, 3, -1., 8, 15, 4, 1, 3., -0.0142436502501369, 0.7381709814071655, 0.4588063061237335, 0, 2, 12, 3, 2, 17, -1., 12, 3, 1, 17, 2., 0.0194871295243502, 0.5256630778312683, 0.2274471968412399, 0, 2, 4, 7, 6, 1, -1., 6, 7, 2, 1, 3., -9.6681108698248863e-004, 0.5511230826377869, 0.3815006911754608, 0, 2, 18, 3, 2, 3, -1., 18, 4, 2, 1, 3., 3.1474709976464510e-003, 0.5425636768341065, 0.2543726861476898, 0, 2, 8, 4, 3, 4, -1., 8, 6, 3, 2, 2., -1.8026070029009134e-004, 0.5380191802978516, 0.3406304121017456, 0, 2, 4, 5, 12, 10, -1., 4, 10, 12, 5, 2., -6.0266260989010334e-003, 0.3035801947116852, 0.5420572161674500, 0, 2, 5, 18, 4, 2, -1., 7, 18, 2, 2, 2., 4.4462960795499384e-004, 0.3990997076034546, 0.5660110116004944, 0, 2, 17, 2, 3, 6, -1., 17, 4, 3, 2, 3., 2.2609760053455830e-003, 0.5562806725502014, 0.3940688073635101, 0, 2, 7, 7, 6, 6, -1., 9, 7, 2, 6, 3., 0.0511330589652061, 0.4609653949737549, 0.7118561863899231, 0, 2, 17, 2, 3, 6, -1., 17, 4, 3, 2, 3., -0.0177863091230392, 0.2316166013479233, 0.5322144031524658, 0, 2, 8, 0, 3, 4, -1., 9, 0, 1, 4, 3., -4.9679628573358059e-003, 0.2330771982669830, 0.5122029185295105, 0, 2, 9, 14, 2, 3, -1., 9, 15, 2, 1, 3., 2.0667689386755228e-003, 0.4657444059848785, 0.6455488204956055, 0, 2, 0, 12, 6, 3, -1., 0, 13, 6, 1, 3., 7.4413768015801907e-003, 0.5154392123222351, 0.2361633926630020, 0, 2, 8, 14, 4, 3, -1., 8, 15, 4, 1, 3., -3.6277279723435640e-003, 0.6219773292541504, 0.4476661086082459, 0, 2, 3, 12, 2, 3, -1., 3, 13, 2, 1, 3., -5.3530759178102016e-003, 0.1837355047464371, 0.5102208256721497, 0, 2, 5, 6, 12, 7, -1., 9, 6, 4, 7, 3., 0.1453091949224472, 0.5145987272262573, 0.1535930931568146, 0, 2, 0, 2, 3, 6, -1., 0, 4, 3, 2, 3., 2.4394490756094456e-003, 0.5343660116195679, 0.3624661862850189, 0, 2, 14, 6, 1, 3, -1., 14, 7, 1, 1, 3., -3.1283390708267689e-003, 0.6215007901191711, 0.4845592081546783, 0, 2, 2, 0, 3, 14, -1., 3, 0, 1, 14, 3., 1.7940260004252195e-003, 0.4299261868000031, 0.5824198126792908, 0, 2, 12, 14, 5, 6, -1., 12, 16, 5, 2, 3., 0.0362538211047649, 0.5260334014892578, 0.1439467966556549, 0, 2, 4, 14, 5, 6, -1., 4, 16, 5, 2, 3., -5.1746722310781479e-003, 0.3506538867950440, 0.5287045240402222, 0, 3, 11, 10, 2, 2, -1., 12, 10, 1, 1, 2., 11, 11, 1, 1, 2., 6.5383297624066472e-004, 0.4809640944004059, 0.6122040152549744, 0, 2, 5, 0, 3, 14, -1., 6, 0, 1, 14, 3., -0.0264802295714617, 0.1139362007379532, 0.5045586228370667, 0, 2, 10, 15, 2, 3, -1., 10, 16, 2, 1, 3., -3.0440660193562508e-003, 0.6352095007896423, 0.4794734120368958, 0, 2, 0, 2, 2, 3, -1., 0, 3, 2, 1, 3., 3.6993520334362984e-003, 0.5131118297576904, 0.2498510926961899, 0, 2, 5, 11, 12, 6, -1., 5, 14, 12, 3, 2., -3.6762931267730892e-004, 0.5421394705772400, 0.3709532022476196, 0, 2, 6, 11, 3, 9, -1., 6, 14, 3, 3, 3., -0.0413822606205940, 0.1894959956407547, 0.5081691741943359, 0, 3, 11, 10, 2, 2, -1., 12, 10, 1, 1, 2., 11, 11, 1, 1, 2., -1.0532729793339968e-003, 0.6454367041587830, 0.4783608913421631, 0, 2, 5, 6, 1, 3, -1., 5, 7, 1, 1, 3., -2.1648600231856108e-003, 0.6215031147003174, 0.4499826133251190, 0, 2, 4, 9, 13, 3, -1., 4, 10, 13, 1, 3., -5.6747748749330640e-004, 0.3712610900402069, 0.5419334769248962, 0, 2, 1, 7, 15, 6, -1., 6, 7, 5, 6, 3., 0.1737584024667740, 0.5023643970489502, 0.1215742006897926, 0, 2, 4, 5, 12, 6, -1., 8, 5, 4, 6, 3., -2.9049699660390615e-003, 0.3240267932415009, 0.5381883978843689, 0, 2, 8, 10, 4, 3, -1., 8, 11, 4, 1, 3., 1.2299539521336555e-003, 0.4165507853031158, 0.5703486204147339, 0, 2, 15, 14, 1, 3, -1., 15, 15, 1, 1, 3., -5.4329237900674343e-004, 0.3854042887687683, 0.5547549128532410, 0, 2, 1, 11, 5, 3, -1., 1, 12, 5, 1, 3., -8.3297258242964745e-003, 0.2204494029283524, 0.5097082853317261, 0, 2, 7, 1, 7, 12, -1., 7, 7, 7, 6, 2., -1.0417630255687982e-004, 0.5607066154479981, 0.4303036034107208, 0, 3, 0, 1, 6, 10, -1., 0, 1, 3, 5, 2., 3, 6, 3, 5, 2., 0.0312047004699707, 0.4621657133102417, 0.6982004046440125, 0, 2, 16, 1, 4, 3, -1., 16, 2, 4, 1, 3., 7.8943502157926559e-003, 0.5269594192504883, 0.2269068062305450, 0, 2, 5, 5, 2, 3, -1., 5, 6, 2, 1, 3., -4.3645310215651989e-003, 0.6359223127365112, 0.4537956118583679, 0, 2, 12, 2, 3, 5, -1., 13, 2, 1, 5, 3., 7.6793059706687927e-003, 0.5274767875671387, 0.2740483880043030, 0, 2, 0, 3, 4, 6, -1., 0, 5, 4, 2, 3., -0.0254311393946409, 0.2038519978523254, 0.5071732997894287, 0, 2, 8, 12, 4, 2, -1., 8, 13, 4, 1, 2., 8.2000601105391979e-004, 0.4587455093860626, 0.6119868159294128, 0, 2, 8, 18, 3, 1, -1., 9, 18, 1, 1, 3., 2.9284600168466568e-003, 0.5071274042129517, 0.2028204947710037, 0, 3, 11, 10, 2, 2, -1., 12, 10, 1, 1, 2., 11, 11, 1, 1, 2., 4.5256470912136137e-005, 0.4812104105949402, 0.5430821776390076, 0, 3, 7, 10, 2, 2, -1., 7, 10, 1, 1, 2., 8, 11, 1, 1, 2., 1.3158309739083052e-003, 0.4625813961029053, 0.6779323220252991, 0, 2, 11, 11, 4, 4, -1., 11, 13, 4, 2, 2., 1.5870389761403203e-003, 0.5386291742324829, 0.3431465029716492, 0, 2, 8, 12, 3, 8, -1., 9, 12, 1, 8, 3., -0.0215396601706743, 0.0259425006806850, 0.5003222823143005, 0, 2, 13, 0, 6, 3, -1., 13, 1, 6, 1, 3., 0.0143344802781940, 0.5202844738960266, 0.1590632945299149, 0, 2, 8, 8, 3, 4, -1., 9, 8, 1, 4, 3., -8.3881383761763573e-003, 0.7282481193542481, 0.4648044109344482, 0, 3, 5, 7, 10, 10, -1., 10, 7, 5, 5, 2., 5, 12, 5, 5, 2., 9.1906841844320297e-003, 0.5562356710433960, 0.3923191130161285, 0, 3, 3, 18, 8, 2, -1., 3, 18, 4, 1, 2., 7, 19, 4, 1, 2., -5.8453059755265713e-003, 0.6803392767906189, 0.4629127979278565, 0, 2, 10, 2, 6, 8, -1., 12, 2, 2, 8, 3., -0.0547077991068363, 0.2561671137809753, 0.5206125974655151, 0, 2, 4, 2, 6, 8, -1., 6, 2, 2, 8, 3., 9.1142775490880013e-003, 0.5189620256423950, 0.3053877055644989, 0, 2, 11, 0, 3, 7, -1., 12, 0, 1, 7, 3., -0.0155750000849366, 0.1295074969530106, 0.5169094800949097, 0, 2, 7, 11, 2, 1, -1., 8, 11, 1, 1, 2., -1.2050600344082341e-004, 0.5735098123550415, 0.4230825006961823, 0, 2, 15, 14, 1, 3, -1., 15, 15, 1, 1, 3., 1.2273970060050488e-003, 0.5289878249168396, 0.4079791903495789, 0, 3, 7, 15, 2, 2, -1., 7, 15, 1, 1, 2., 8, 16, 1, 1, 2., -1.2186600361019373e-003, 0.6575639843940735, 0.4574409127235413, 0, 2, 15, 14, 1, 3, -1., 15, 15, 1, 1, 3., -3.3256649039685726e-003, 0.3628047108650208, 0.5195019841194153, 0, 2, 6, 0, 3, 7, -1., 7, 0, 1, 7, 3., -0.0132883097976446, 0.1284265965223312, 0.5043488740921021, 0, 2, 18, 1, 2, 7, -1., 18, 1, 1, 7, 2., -3.3839771058410406e-003, 0.6292240023612976, 0.4757505953311920, 0, 2, 2, 0, 8, 20, -1., 2, 10, 8, 10, 2., -0.2195422053337097, 0.1487731933593750, 0.5065013766288757, 0, 2, 3, 0, 15, 6, -1., 3, 2, 15, 2, 3., 4.9111708067357540e-003, 0.4256102144718170, 0.5665838718414307, 0, 2, 4, 3, 12, 2, -1., 4, 4, 12, 1, 2., -1.8744950648397207e-004, 0.4004144072532654, 0.5586857199668884, 0, 2, 16, 0, 4, 5, -1., 16, 0, 2, 5, 2., -5.2178641781210899e-003, 0.6009116172790527, 0.4812706112861633, 0, 2, 7, 0, 3, 4, -1., 8, 0, 1, 4, 3., -1.1111519997939467e-003, 0.3514933884143829, 0.5287089943885803, 0, 2, 16, 0, 4, 5, -1., 16, 0, 2, 5, 2., 4.4036400504410267e-003, 0.4642275869846344, 0.5924085974693298, 0, 2, 1, 7, 6, 13, -1., 3, 7, 2, 13, 3., 0.1229949966073036, 0.5025529265403748, 0.0691524818539619, 0, 2, 16, 0, 4, 5, -1., 16, 0, 2, 5, 2., -0.0123135102912784, 0.5884591937065125, 0.4934012889862061, 0, 2, 0, 0, 4, 5, -1., 2, 0, 2, 5, 2., 4.1471039876341820e-003, 0.4372239112854004, 0.5893477797508240, 0, 2, 14, 12, 3, 6, -1., 14, 14, 3, 2, 3., -3.5502649843692780e-003, 0.4327551126480103, 0.5396270155906677, 0, 2, 3, 12, 3, 6, -1., 3, 14, 3, 2, 3., -0.0192242693156004, 0.1913134008646011, 0.5068330764770508, 0, 2, 16, 1, 4, 3, -1., 16, 2, 4, 1, 3., 1.4395059552043676e-003, 0.5308178067207336, 0.4243533015251160, 0, 3, 8, 7, 2, 10, -1., 8, 7, 1, 5, 2., 9, 12, 1, 5, 2., -6.7751999013125896e-003, 0.6365395784378052, 0.4540086090564728, 0, 2, 11, 11, 4, 4, -1., 11, 13, 4, 2, 2., 7.0119630545377731e-003, 0.5189834237098694, 0.3026199936866760, 0, 2, 0, 1, 4, 3, -1., 0, 2, 4, 1, 3., 5.4014651104807854e-003, 0.5105062127113342, 0.2557682991027832, 0, 2, 13, 4, 1, 3, -1., 13, 5, 1, 1, 3., 9.0274988906458020e-004, 0.4696914851665497, 0.5861827731132507, 0, 2, 7, 15, 3, 5, -1., 8, 15, 1, 5, 3., 0.0114744501188397, 0.5053645968437195, 0.1527177989482880, 0, 2, 9, 7, 3, 5, -1., 10, 7, 1, 5, 3., -6.7023430019617081e-003, 0.6508980989456177, 0.4890604019165039, 0, 2, 8, 7, 3, 5, -1., 9, 7, 1, 5, 3., -2.0462959073483944e-003, 0.6241816878318787, 0.4514600038528442, 0, 2, 10, 6, 4, 14, -1., 10, 6, 2, 14, 2., -9.9951568990945816e-003, 0.3432781100273132, 0.5400953888893127, 0, 2, 0, 5, 5, 6, -1., 0, 7, 5, 2, 3., -0.0357007086277008, 0.1878059059381485, 0.5074077844619751, 0, 2, 9, 5, 6, 4, -1., 9, 5, 3, 4, 2., 4.5584561303257942e-004, 0.3805277049541473, 0.5402569770812988, 0, 2, 0, 0, 18, 10, -1., 6, 0, 6, 10, 3., -0.0542606003582478, 0.6843714714050293, 0.4595097005367279, 0, 2, 10, 6, 4, 14, -1., 10, 6, 2, 14, 2., 6.0600461438298225e-003, 0.5502905249595642, 0.4500527977943420, 0, 2, 6, 6, 4, 14, -1., 8, 6, 2, 14, 2., -6.4791832119226456e-003, 0.3368858098983765, 0.5310757160186768, 0, 2, 13, 4, 1, 3, -1., 13, 5, 1, 1, 3., -1.4939469983801246e-003, 0.6487640142440796, 0.4756175875663757, 0, 2, 5, 1, 2, 3, -1., 6, 1, 1, 3, 2., 1.4610530342906713e-005, 0.4034579098224640, 0.5451064109802246, 0, 3, 18, 1, 2, 18, -1., 19, 1, 1, 9, 2., 18, 10, 1, 9, 2., -7.2321938350796700e-003, 0.6386873722076416, 0.4824739992618561, 0, 2, 2, 1, 4, 3, -1., 2, 2, 4, 1, 3., -4.0645818226039410e-003, 0.2986421883106232, 0.5157335996627808, 0, 3, 18, 1, 2, 18, -1., 19, 1, 1, 9, 2., 18, 10, 1, 9, 2., 0.0304630808532238, 0.5022199749946594, 0.7159956097602844, 0, 3, 1, 14, 4, 6, -1., 1, 14, 2, 3, 2., 3, 17, 2, 3, 2., -8.0544911324977875e-003, 0.6492452025413513, 0.4619275033473969, 0, 2, 10, 11, 7, 6, -1., 10, 13, 7, 2, 3., 0.0395051389932632, 0.5150570869445801, 0.2450613975524902, 0, 3, 0, 10, 6, 10, -1., 0, 10, 3, 5, 2., 3, 15, 3, 5, 2., 8.4530208259820938e-003, 0.4573669135570526, 0.6394037008285523, 0, 2, 11, 0, 3, 4, -1., 12, 0, 1, 4, 3., -1.1688120430335402e-003, 0.3865512013435364, 0.5483661293983460, 0, 2, 5, 10, 5, 6, -1., 5, 13, 5, 3, 2., 2.8070670086890459e-003, 0.5128579139709473, 0.2701480090618134, 0, 2, 14, 6, 1, 8, -1., 14, 10, 1, 4, 2., 4.7365209320560098e-004, 0.4051581919193268, 0.5387461185455322, 0, 3, 1, 7, 18, 6, -1., 1, 7, 9, 3, 2., 10, 10, 9, 3, 2., 0.0117410803213716, 0.5295950174331665, 0.3719413876533508, 0, 2, 9, 7, 2, 2, -1., 9, 7, 1, 2, 2., 3.1833238899707794e-003, 0.4789406955242157, 0.6895126104354858, 0, 2, 5, 9, 4, 5, -1., 7, 9, 2, 5, 2., 7.0241501089185476e-004, 0.5384489297866821, 0.3918080925941467, 50.1697311401367190, 102, 0, 2, 7, 6, 6, 3, -1., 9, 6, 2, 3, 3., 0.0170599296689034, 0.3948527872562408, 0.7142534852027893, 0, 2, 1, 0, 18, 4, -1., 7, 0, 6, 4, 3., 0.0218408405780792, 0.3370316028594971, 0.6090016961097717, 0, 2, 7, 15, 2, 4, -1., 7, 17, 2, 2, 2., 2.4520049919374287e-004, 0.3500576019287109, 0.5987902283668518, 0, 2, 1, 0, 19, 9, -1., 1, 3, 19, 3, 3., 8.3272606134414673e-003, 0.3267528116703033, 0.5697240829467773, 0, 2, 3, 7, 3, 6, -1., 3, 9, 3, 2, 3., 5.7148298947140574e-004, 0.3044599890708923, 0.5531656742095947, 0, 3, 13, 7, 4, 4, -1., 15, 7, 2, 2, 2., 13, 9, 2, 2, 2., 6.7373987985774875e-004, 0.3650012016296387, 0.5672631263732910, 0, 3, 3, 7, 4, 4, -1., 3, 7, 2, 2, 2., 5, 9, 2, 2, 2., 3.4681590477703139e-005, 0.3313541114330292, 0.5388727188110352, 0, 2, 9, 6, 10, 8, -1., 9, 10, 10, 4, 2., -5.8563398197293282e-003, 0.2697942852973938, 0.5498778820037842, 0, 2, 3, 8, 14, 12, -1., 3, 14, 14, 6, 2., 8.5102273151278496e-003, 0.5269358158111572, 0.2762879133224487, 0, 3, 6, 5, 10, 12, -1., 11, 5, 5, 6, 2., 6, 11, 5, 6, 2., -0.0698172077536583, 0.2909603118896484, 0.5259246826171875, 0, 2, 9, 11, 2, 3, -1., 9, 12, 2, 1, 3., -8.6113670840859413e-004, 0.5892577171325684, 0.4073697924613953, 0, 2, 9, 5, 6, 5, -1., 9, 5, 3, 5, 2., 9.7149249631911516e-004, 0.3523564040660858, 0.5415862202644348, 0, 2, 9, 4, 2, 4, -1., 9, 6, 2, 2, 2., -1.4727490452060010e-005, 0.5423017740249634, 0.3503156006336212, 0, 2, 9, 5, 6, 5, -1., 9, 5, 3, 5, 2., 0.0484202913939953, 0.5193945765495300, 0.3411195874214172, 0, 2, 5, 5, 6, 5, -1., 8, 5, 3, 5, 2., 1.3257140526548028e-003, 0.3157769143581390, 0.5335376262664795, 0, 2, 11, 2, 6, 1, -1., 13, 2, 2, 1, 3., 1.4922149603080470e-005, 0.4451299905776978, 0.5536553859710693, 0, 2, 3, 2, 6, 1, -1., 5, 2, 2, 1, 3., -2.7173398993909359e-003, 0.3031741976737976, 0.5248088836669922, 0, 2, 13, 5, 2, 3, -1., 13, 6, 2, 1, 3., 2.9219500720500946e-003, 0.4781453013420105, 0.6606041789054871, 0, 2, 0, 10, 1, 4, -1., 0, 12, 1, 2, 2., -1.9804988987743855e-003, 0.3186308145523071, 0.5287625193595886, 0, 2, 13, 5, 2, 3, -1., 13, 6, 2, 1, 3., -4.0012109093368053e-003, 0.6413596868515015, 0.4749928116798401, 0, 2, 8, 18, 3, 2, -1., 9, 18, 1, 2, 3., -4.3491991236805916e-003, 0.1507498025894165, 0.5098996758460999, 0, 2, 6, 15, 9, 2, -1., 6, 16, 9, 1, 2., 1.3490889687091112e-003, 0.4316158890724182, 0.5881167054176331, 0, 2, 8, 14, 4, 3, -1., 8, 15, 4, 1, 3., 0.0185970701277256, 0.4735553860664368, 0.9089794158935547, 0, 2, 18, 4, 2, 4, -1., 18, 6, 2, 2, 2., -1.8562379991635680e-003, 0.3553189039230347, 0.5577837228775024, 0, 2, 5, 5, 2, 3, -1., 5, 6, 2, 1, 3., 2.2940430790185928e-003, 0.4500094950199127, 0.6580877900123596, 0, 2, 15, 16, 3, 2, -1., 15, 17, 3, 1, 2., 2.9982850537635386e-004, 0.5629242062568665, 0.3975878953933716, 0, 2, 0, 0, 3, 9, -1., 0, 3, 3, 3, 3., 3.5455459728837013e-003, 0.5381547212600708, 0.3605485856533051, 0, 2, 9, 7, 3, 3, -1., 9, 8, 3, 1, 3., 9.6104722470045090e-003, 0.5255997180938721, 0.1796745955944061, 0, 2, 8, 7, 3, 3, -1., 8, 8, 3, 1, 3., -6.2783220782876015e-003, 0.2272856980562210, 0.5114030241966248, 0, 2, 9, 5, 2, 6, -1., 9, 5, 1, 6, 2., 3.4598479978740215e-003, 0.4626308083534241, 0.6608219146728516, 0, 2, 8, 6, 3, 4, -1., 9, 6, 1, 4, 3., -1.3112019514665008e-003, 0.6317539811134338, 0.4436857998371124, 0, 3, 7, 6, 8, 12, -1., 11, 6, 4, 6, 2., 7, 12, 4, 6, 2., 2.6876179035753012e-003, 0.5421109795570374, 0.4054022133350372, 0, 3, 5, 6, 8, 12, -1., 5, 6, 4, 6, 2., 9, 12, 4, 6, 2., 3.9118169806897640e-003, 0.5358477830886841, 0.3273454904556274, 0, 2, 12, 4, 3, 3, -1., 12, 5, 3, 1, 3., -0.0142064504325390, 0.7793576717376709, 0.4975781142711639, 0, 2, 2, 16, 3, 2, -1., 2, 17, 3, 1, 2., 7.1705528534948826e-004, 0.5297319889068604, 0.3560903966426849, 0, 2, 12, 4, 3, 3, -1., 12, 5, 3, 1, 3., 1.6635019565001130e-003, 0.4678094089031220, 0.5816481709480286, 0, 2, 2, 12, 6, 6, -1., 2, 14, 6, 2, 3., 3.3686188980937004e-003, 0.5276734232902527, 0.3446420133113861, 0, 2, 7, 13, 6, 3, -1., 7, 14, 6, 1, 3., 0.0127995302900672, 0.4834679961204529, 0.7472159266471863, 0, 2, 6, 14, 6, 3, -1., 6, 15, 6, 1, 3., 3.3901201095432043e-003, 0.4511859118938446, 0.6401721239089966, 0, 2, 14, 15, 5, 3, -1., 14, 16, 5, 1, 3., 4.7070779837667942e-003, 0.5335658788681030, 0.3555220961570740, 0, 2, 5, 4, 3, 3, -1., 5, 5, 3, 1, 3., 1.4819339849054813e-003, 0.4250707030296326, 0.5772724151611328, 0, 2, 14, 15, 5, 3, -1., 14, 16, 5, 1, 3., -6.9995759986341000e-003, 0.3003320097923279, 0.5292900204658508, 0, 2, 5, 3, 6, 2, -1., 7, 3, 2, 2, 3., 0.0159390103071928, 0.5067319273948669, 0.1675581932067871, 0, 2, 8, 15, 4, 3, -1., 8, 16, 4, 1, 3., 7.6377349905669689e-003, 0.4795069992542267, 0.7085601091384888, 0, 2, 1, 15, 5, 3, -1., 1, 16, 5, 1, 3., 6.7334040068089962e-003, 0.5133113265037537, 0.2162470072507858, 0, 3, 8, 13, 4, 6, -1., 10, 13, 2, 3, 2., 8, 16, 2, 3, 2., -0.0128588099032640, 0.1938841938972473, 0.5251371860504150, 0, 2, 7, 8, 3, 3, -1., 8, 8, 1, 3, 3., -6.2270800117403269e-004, 0.5686538219451904, 0.4197868108749390, 0, 2, 12, 0, 5, 4, -1., 12, 2, 5, 2, 2., -5.2651681471616030e-004, 0.4224168956279755, 0.5429695844650269, 0, 3, 0, 2, 20, 2, -1., 0, 2, 10, 1, 2., 10, 3, 10, 1, 2., 0.0110750999301672, 0.5113775134086609, 0.2514517903327942, 0, 2, 1, 0, 18, 4, -1., 7, 0, 6, 4, 3., -0.0367282517254353, 0.7194662094116211, 0.4849618971347809, 0, 2, 4, 3, 6, 1, -1., 6, 3, 2, 1, 3., -2.8207109426148236e-004, 0.3840261995792389, 0.5394446253776550, 0, 2, 4, 18, 13, 2, -1., 4, 19, 13, 1, 2., -2.7489690110087395e-003, 0.5937088727951050, 0.4569182097911835, 0, 2, 2, 10, 3, 6, -1., 2, 12, 3, 2, 3., 0.0100475195795298, 0.5138576030731201, 0.2802298069000244, 0, 3, 14, 12, 6, 8, -1., 17, 12, 3, 4, 2., 14, 16, 3, 4, 2., -8.1497840583324432e-003, 0.6090037226676941, 0.4636121094226837, 0, 3, 4, 13, 10, 6, -1., 4, 13, 5, 3, 2., 9, 16, 5, 3, 2., -6.8833888508379459e-003, 0.3458611071109772, 0.5254660248756409, 0, 2, 14, 12, 1, 2, -1., 14, 13, 1, 1, 2., -1.4039360394235700e-005, 0.5693104267120361, 0.4082083106040955, 0, 2, 8, 13, 4, 3, -1., 8, 14, 4, 1, 3., 1.5498419525101781e-003, 0.4350537061691284, 0.5806517004966736, 0, 2, 14, 12, 2, 2, -1., 14, 13, 2, 1, 2., -6.7841499112546444e-003, 0.1468873023986816, 0.5182775259017944, 0, 2, 4, 12, 2, 2, -1., 4, 13, 2, 1, 2., 2.1705629478674382e-004, 0.5293524265289307, 0.3456174135208130, 0, 2, 8, 12, 9, 2, -1., 8, 13, 9, 1, 2., 3.1198898795992136e-004, 0.4652450978755951, 0.5942413806915283, 0, 2, 9, 14, 2, 3, -1., 9, 15, 2, 1, 3., 5.4507530294358730e-003, 0.4653508961200714, 0.7024846076965332, 0, 2, 11, 10, 3, 6, -1., 11, 13, 3, 3, 2., -2.5818689027801156e-004, 0.5497295260429382, 0.3768967092037201, 0, 2, 5, 6, 9, 12, -1., 5, 12, 9, 6, 2., -0.0174425393342972, 0.3919087946414948, 0.5457497835159302, 0, 2, 11, 10, 3, 6, -1., 11, 13, 3, 3, 2., -0.0453435294330120, 0.1631357073783875, 0.5154908895492554, 0, 2, 6, 10, 3, 6, -1., 6, 13, 3, 3, 2., 1.9190689781680703e-003, 0.5145897865295410, 0.2791895866394043, 0, 2, 5, 4, 11, 3, -1., 5, 5, 11, 1, 3., -6.0177869163453579e-003, 0.6517636179924011, 0.4756332933902741, 0, 2, 7, 1, 5, 10, -1., 7, 6, 5, 5, 2., -4.0720738470554352e-003, 0.5514652729034424, 0.4092685878276825, 0, 2, 2, 8, 18, 2, -1., 2, 9, 18, 1, 2., 3.9855059003457427e-004, 0.3165240883827210, 0.5285550951957703, 0, 2, 7, 17, 5, 3, -1., 7, 18, 5, 1, 3., -6.5418570302426815e-003, 0.6853377819061279, 0.4652808904647827, 0, 2, 5, 9, 12, 1, -1., 9, 9, 4, 1, 3., 3.4845089539885521e-003, 0.5484588146209717, 0.4502759873867035, 0, 3, 0, 14, 6, 6, -1., 0, 14, 3, 3, 2., 3, 17, 3, 3, 2., -0.0136967804282904, 0.6395779848098755, 0.4572555124759674, 0, 2, 5, 9, 12, 1, -1., 9, 9, 4, 1, 3., -0.0173471402376890, 0.2751072943210602, 0.5181614756584168, 0, 2, 3, 9, 12, 1, -1., 7, 9, 4, 1, 3., -4.0885428898036480e-003, 0.3325636088848114, 0.5194984078407288, 0, 2, 14, 10, 6, 7, -1., 14, 10, 3, 7, 2., -9.4687901437282562e-003, 0.5942280888557434, 0.4851819872856140, 0, 2, 1, 0, 16, 2, -1., 1, 1, 16, 1, 2., 1.7084840219467878e-003, 0.4167110919952393, 0.5519806146621704, 0, 2, 10, 9, 10, 9, -1., 10, 12, 10, 3, 3., 9.4809094443917274e-003, 0.5433894991874695, 0.4208514988422394, 0, 2, 0, 1, 10, 2, -1., 5, 1, 5, 2, 2., -4.7389650717377663e-003, 0.6407189965248108, 0.4560655057430267, 0, 2, 17, 3, 2, 3, -1., 17, 4, 2, 1, 3., 6.5761050209403038e-003, 0.5214555263519287, 0.2258227020502091, 0, 2, 1, 3, 2, 3, -1., 1, 4, 2, 1, 3., -2.1690549328923225e-003, 0.3151527941226959, 0.5156704783439636, 0, 2, 9, 7, 3, 6, -1., 10, 7, 1, 6, 3., 0.0146601703017950, 0.4870837032794952, 0.6689941287040710, 0, 2, 6, 5, 4, 3, -1., 8, 5, 2, 3, 2., 1.7231999663636088e-004, 0.3569748997688294, 0.5251078009605408, 0, 2, 7, 5, 6, 6, -1., 9, 5, 2, 6, 3., -0.0218037609010935, 0.8825920820236206, 0.4966329932212830, 0, 3, 3, 4, 12, 12, -1., 3, 4, 6, 6, 2., 9, 10, 6, 6, 2., -0.0947361066937447, 0.1446162015199661, 0.5061113834381104, 0, 2, 9, 2, 6, 15, -1., 11, 2, 2, 15, 3., 5.5825551971793175e-003, 0.5396478772163391, 0.4238066077232361, 0, 2, 2, 2, 6, 17, -1., 4, 2, 2, 17, 3., 1.9517090404406190e-003, 0.4170410931110382, 0.5497786998748779, 0, 2, 14, 10, 6, 7, -1., 14, 10, 3, 7, 2., 0.0121499001979828, 0.4698367118835449, 0.5664274096488953, 0, 2, 0, 10, 6, 7, -1., 3, 10, 3, 7, 2., -7.5169620104134083e-003, 0.6267772912979126, 0.4463135898113251, 0, 2, 9, 2, 6, 15, -1., 11, 2, 2, 15, 3., -0.0716679096221924, 0.3097011148929596, 0.5221003293991089, 0, 2, 5, 2, 6, 15, -1., 7, 2, 2, 15, 3., -0.0882924199104309, 0.0811238884925842, 0.5006365180015564, 0, 2, 17, 9, 3, 6, -1., 17, 11, 3, 2, 3., 0.0310630798339844, 0.5155503749847412, 0.1282255947589874, 0, 2, 6, 7, 6, 6, -1., 8, 7, 2, 6, 3., 0.0466218404471874, 0.4699777960777283, 0.7363960742950440, 0, 3, 1, 10, 18, 6, -1., 10, 10, 9, 3, 2., 1, 13, 9, 3, 2., -0.0121894897893071, 0.3920530080795288, 0.5518996715545654, 0, 2, 0, 9, 10, 9, -1., 0, 12, 10, 3, 3., 0.0130161102861166, 0.5260658264160156, 0.3685136139392853, 0, 2, 8, 15, 4, 3, -1., 8, 16, 4, 1, 3., -3.4952899441123009e-003, 0.6339294910430908, 0.4716280996799469, 0, 2, 5, 12, 3, 4, -1., 5, 14, 3, 2, 2., -4.4015039748046547e-005, 0.5333027243614197, 0.3776184916496277, 0, 2, 3, 3, 16, 12, -1., 3, 9, 16, 6, 2., -0.1096649020910263, 0.1765342056751251, 0.5198346972465515, 0, 3, 1, 1, 12, 12, -1., 1, 1, 6, 6, 2., 7, 7, 6, 6, 2., -9.0279558207839727e-004, 0.5324159860610962, 0.3838908076286316, 0, 3, 10, 4, 2, 4, -1., 11, 4, 1, 2, 2., 10, 6, 1, 2, 2., 7.1126641705632210e-004, 0.4647929966449738, 0.5755224227905273, 0, 3, 0, 9, 10, 2, -1., 0, 9, 5, 1, 2., 5, 10, 5, 1, 2., -3.1250279862433672e-003, 0.3236708939075470, 0.5166770815849304, 0, 2, 9, 11, 3, 3, -1., 9, 12, 3, 1, 3., 2.4144679773598909e-003, 0.4787439107894898, 0.6459717750549316, 0, 2, 3, 12, 9, 2, -1., 3, 13, 9, 1, 2., 4.4391240226104856e-004, 0.4409308135509491, 0.6010255813598633, 0, 2, 9, 9, 2, 2, -1., 9, 10, 2, 1, 2., -2.2611189342569560e-004, 0.4038113951683044, 0.5493255853652954, 66.6691207885742190, 135, 0, 2, 3, 4, 13, 6, -1., 3, 6, 13, 2, 3., -0.0469012893736362, 0.6600171923637390, 0.3743801116943359, 0, 3, 9, 7, 6, 4, -1., 12, 7, 3, 2, 2., 9, 9, 3, 2, 2., -1.4568349579349160e-003, 0.5783991217613220, 0.3437797129154205, 0, 2, 1, 0, 6, 8, -1., 4, 0, 3, 8, 2., 5.5598369799554348e-003, 0.3622266948223114, 0.5908216238021851, 0, 2, 9, 5, 2, 12, -1., 9, 11, 2, 6, 2., 7.3170487303286791e-004, 0.5500419139862061, 0.2873558104038239, 0, 2, 4, 4, 3, 10, -1., 4, 9, 3, 5, 2., 1.3318009441718459e-003, 0.2673169970512390, 0.5431019067764282, 0, 2, 6, 17, 8, 3, -1., 6, 18, 8, 1, 3., 2.4347059661522508e-004, 0.3855027854442596, 0.5741388797760010, 0, 2, 0, 5, 10, 6, -1., 0, 7, 10, 2, 3., -3.0512469820678234e-003, 0.5503209829330444, 0.3462845087051392, 0, 2, 13, 2, 3, 2, -1., 13, 3, 3, 1, 2., -6.8657199153676629e-004, 0.3291221857070923, 0.5429509282112122, 0, 2, 7, 5, 4, 5, -1., 9, 5, 2, 5, 2., 1.4668200165033340e-003, 0.3588382005691528, 0.5351811051368713, 0, 2, 12, 14, 3, 6, -1., 12, 16, 3, 2, 3., 3.2021870720200241e-004, 0.4296841919422150, 0.5700234174728394, 0, 2, 1, 11, 8, 2, -1., 1, 12, 8, 1, 2., 7.4122188379988074e-004, 0.5282164812088013, 0.3366870880126953, 0, 2, 7, 13, 6, 3, -1., 7, 14, 6, 1, 3., 3.8330298848450184e-003, 0.4559567868709564, 0.6257336139678955, 0, 2, 0, 5, 3, 6, -1., 0, 7, 3, 2, 3., -0.0154564399272203, 0.2350116968154907, 0.5129452943801880, 0, 2, 13, 2, 3, 2, -1., 13, 3, 3, 1, 2., 2.6796779129654169e-003, 0.5329415202140808, 0.4155062139034271, 0, 3, 4, 14, 4, 6, -1., 4, 14, 2, 3, 2., 6, 17, 2, 3, 2., 2.8296569362282753e-003, 0.4273087978363037, 0.5804538130760193, 0, 2, 13, 2, 3, 2, -1., 13, 3, 3, 1, 2., -3.9444249123334885e-003, 0.2912611961364746, 0.5202686190605164, 0, 2, 8, 2, 4, 12, -1., 8, 6, 4, 4, 3., 2.7179559692740440e-003, 0.5307688117027283, 0.3585677146911621, 0, 3, 14, 0, 6, 8, -1., 17, 0, 3, 4, 2., 14, 4, 3, 4, 2., 5.9077627956867218e-003, 0.4703775048255920, 0.5941585898399353, 0, 2, 7, 17, 3, 2, -1., 8, 17, 1, 2, 3., -4.2240349575877190e-003, 0.2141567021608353, 0.5088796019554138, 0, 2, 8, 12, 4, 2, -1., 8, 13, 4, 1, 2., 4.0725888684391975e-003, 0.4766413867473602, 0.6841061115264893, 0, 3, 6, 0, 8, 12, -1., 6, 0, 4, 6, 2., 10, 6, 4, 6, 2., 0.0101495301350951, 0.5360798835754395, 0.3748497068881989, 0, 3, 14, 0, 2, 10, -1., 15, 0, 1, 5, 2., 14, 5, 1, 5, 2., -1.8864999583456665e-004, 0.5720130205154419, 0.3853805065155029, 0, 3, 5, 3, 8, 6, -1., 5, 3, 4, 3, 2., 9, 6, 4, 3, 2., -4.8864358104765415e-003, 0.3693122863769531, 0.5340958833694458, 0, 3, 14, 0, 6, 10, -1., 17, 0, 3, 5, 2., 14, 5, 3, 5, 2., 0.0261584799736738, 0.4962374866008759, 0.6059989929199219, 0, 2, 9, 14, 1, 2, -1., 9, 15, 1, 1, 2., 4.8560759751126170e-004, 0.4438945949077606, 0.6012468934059143, 0, 2, 15, 10, 4, 3, -1., 15, 11, 4, 1, 3., 0.0112687097862363, 0.5244250297546387, 0.1840388029813767, 0, 2, 8, 14, 2, 3, -1., 8, 15, 2, 1, 3., -2.8114619199186563e-003, 0.6060283780097961, 0.4409897029399872, 0, 3, 3, 13, 14, 4, -1., 10, 13, 7, 2, 2., 3, 15, 7, 2, 2., -5.6112729944288731e-003, 0.3891170918941498, 0.5589237213134766, 0, 2, 1, 10, 4, 3, -1., 1, 11, 4, 1, 3., 8.5680093616247177e-003, 0.5069345831871033, 0.2062619030475617, 0, 2, 9, 11, 6, 1, -1., 11, 11, 2, 1, 3., -3.8172779022715986e-004, 0.5882201790809631, 0.4192610979080200, 0, 2, 5, 11, 6, 1, -1., 7, 11, 2, 1, 3., -1.7680290329735726e-004, 0.5533605813980103, 0.4003368914127350, 0, 2, 3, 5, 16, 15, -1., 3, 10, 16, 5, 3., 6.5112537704408169e-003, 0.3310146927833557, 0.5444191098213196, 0, 2, 6, 12, 4, 2, -1., 8, 12, 2, 2, 2., -6.5948683186434209e-005, 0.5433831810951233, 0.3944905996322632, 0, 3, 4, 4, 12, 10, -1., 10, 4, 6, 5, 2., 4, 9, 6, 5, 2., 6.9939051754772663e-003, 0.5600358247756958, 0.4192714095115662, 0, 2, 8, 6, 3, 4, -1., 9, 6, 1, 4, 3., -4.6744439750909805e-003, 0.6685466766357422, 0.4604960978031158, 0, 3, 8, 12, 4, 8, -1., 10, 12, 2, 4, 2., 8, 16, 2, 4, 2., 0.0115898502990603, 0.5357121229171753, 0.2926830053329468, 0, 2, 8, 14, 4, 3, -1., 8, 15, 4, 1, 3., 0.0130078401416540, 0.4679817855358124, 0.7307463288307190, 0, 2, 12, 2, 3, 2, -1., 13, 2, 1, 2, 3., -1.1008579749614000e-003, 0.3937501013278961, 0.5415065288543701, 0, 2, 8, 15, 3, 2, -1., 8, 16, 3, 1, 2., 6.0472649056464434e-004, 0.4242376089096069, 0.5604041218757629, 0, 2, 6, 0, 9, 14, -1., 9, 0, 3, 14, 3., -0.0144948400557041, 0.3631210029125214, 0.5293182730674744, 0, 2, 9, 6, 2, 3, -1., 10, 6, 1, 3, 2., -5.3056948818266392e-003, 0.6860452294349670, 0.4621821045875549, 0, 2, 10, 8, 2, 3, -1., 10, 9, 2, 1, 3., -8.1829127157106996e-004, 0.3944096863269806, 0.5420439243316650, 0, 2, 0, 9, 4, 6, -1., 0, 11, 4, 2, 3., -0.0190775208175182, 0.1962621957063675, 0.5037891864776611, 0, 2, 6, 0, 8, 2, -1., 6, 1, 8, 1, 2., 3.5549470339901745e-004, 0.4086259007453919, 0.5613973140716553, 0, 2, 6, 14, 7, 3, -1., 6, 15, 7, 1, 3., 1.9679730758070946e-003, 0.4489121139049530, 0.5926123261451721, 0, 2, 8, 10, 8, 9, -1., 8, 13, 8, 3, 3., 6.9189141504466534e-003, 0.5335925817489624, 0.3728385865688324, 0, 2, 5, 2, 3, 2, -1., 6, 2, 1, 2, 3., 2.9872779268771410e-003, 0.5111321210861206, 0.2975643873214722, 0, 3, 14, 1, 6, 8, -1., 17, 1, 3, 4, 2., 14, 5, 3, 4, 2., -6.2264618463814259e-003, 0.5541489720344544, 0.4824537932872772, 0, 3, 0, 1, 6, 8, -1., 0, 1, 3, 4, 2., 3, 5, 3, 4, 2., 0.0133533002808690, 0.4586423933506012, 0.6414797902107239, 0, 3, 1, 2, 18, 6, -1., 10, 2, 9, 3, 2., 1, 5, 9, 3, 2., 0.0335052385926247, 0.5392425060272217, 0.3429994881153107, 0, 2, 9, 3, 2, 1, -1., 10, 3, 1, 1, 2., -2.5294460356235504e-003, 0.1703713983297348, 0.5013315081596375, 0, 3, 13, 2, 4, 6, -1., 15, 2, 2, 3, 2., 13, 5, 2, 3, 2., -1.2801629491150379e-003, 0.5305461883544922, 0.4697405099868774, 0, 2, 5, 4, 3, 3, -1., 5, 5, 3, 1, 3., 7.0687388069927692e-003, 0.4615545868873596, 0.6436504721641541, 0, 2, 13, 5, 1, 3, -1., 13, 6, 1, 1, 3., 9.6880499040707946e-004, 0.4833599030971527, 0.6043894290924072, 0, 2, 2, 16, 5, 3, -1., 2, 17, 5, 1, 3., 3.9647659286856651e-003, 0.5187637209892273, 0.3231816887855530, 0, 3, 13, 2, 4, 6, -1., 15, 2, 2, 3, 2., 13, 5, 2, 3, 2., -0.0220577307045460, 0.4079256951808929, 0.5200980901718140, 0, 3, 3, 2, 4, 6, -1., 3, 2, 2, 3, 2., 5, 5, 2, 3, 2., -6.6906312713399529e-004, 0.5331609249114990, 0.3815600872039795, 0, 2, 13, 5, 1, 2, -1., 13, 6, 1, 1, 2., -6.7009328631684184e-004, 0.5655422210693359, 0.4688901901245117, 0, 2, 5, 5, 2, 2, -1., 5, 6, 2, 1, 2., 7.4284552829340100e-004, 0.4534381031990051, 0.6287400126457214, 0, 2, 13, 9, 2, 2, -1., 13, 9, 1, 2, 2., 2.2227810695767403e-003, 0.5350633263587952, 0.3303655982017517, 0, 2, 5, 9, 2, 2, -1., 6, 9, 1, 2, 2., -5.4130521602928638e-003, 0.1113687008619309, 0.5005434751510620, 0, 2, 13, 17, 3, 2, -1., 13, 18, 3, 1, 2., -1.4520040167553816e-005, 0.5628737807273865, 0.4325133860111237, 0, 3, 6, 16, 4, 4, -1., 6, 16, 2, 2, 2., 8, 18, 2, 2, 2., 2.3369169502984732e-004, 0.4165835082530975, 0.5447791218757629, 0, 2, 9, 16, 2, 3, -1., 9, 17, 2, 1, 3., 4.2894547805190086e-003, 0.4860391020774841, 0.6778649091720581, 0, 2, 0, 13, 9, 6, -1., 0, 15, 9, 2, 3., 5.9103150852024555e-003, 0.5262305140495300, 0.3612113893032074, 0, 2, 9, 14, 2, 6, -1., 9, 17, 2, 3, 2., 0.0129005396738648, 0.5319377183914185, 0.3250288069248200, 0, 2, 9, 15, 2, 3, -1., 9, 16, 2, 1, 3., 4.6982979401946068e-003, 0.4618245065212250, 0.6665925979614258, 0, 2, 1, 10, 18, 6, -1., 1, 12, 18, 2, 3., 0.0104398597031832, 0.5505670905113220, 0.3883604109287262, 0, 2, 8, 11, 4, 2, -1., 8, 12, 4, 1, 2., 3.0443191062659025e-003, 0.4697853028774262, 0.7301844954490662, 0, 2, 7, 9, 6, 2, -1., 7, 10, 6, 1, 2., -6.1593751888722181e-004, 0.3830839097499847, 0.5464984178543091, 0, 2, 8, 8, 2, 3, -1., 8, 9, 2, 1, 3., -3.4247159492224455e-003, 0.2566300034523010, 0.5089530944824219, 0, 2, 17, 5, 3, 4, -1., 18, 5, 1, 4, 3., -9.3538565561175346e-003, 0.6469966173171997, 0.4940795898437500, 0, 2, 1, 19, 18, 1, -1., 7, 19, 6, 1, 3., 0.0523389987647533, 0.4745982885360718, 0.7878770828247070, 0, 2, 9, 0, 3, 2, -1., 10, 0, 1, 2, 3., 3.5765620414167643e-003, 0.5306664705276489, 0.2748498022556305, 0, 2, 1, 8, 1, 6, -1., 1, 10, 1, 2, 3., 7.1555317845195532e-004, 0.5413125753402710, 0.4041908979415894, 0, 2, 12, 17, 8, 3, -1., 12, 17, 4, 3, 2., -0.0105166798457503, 0.6158512234687805, 0.4815283119678497, 0, 2, 0, 5, 3, 4, -1., 1, 5, 1, 4, 3., 7.7347927726805210e-003, 0.4695805907249451, 0.7028980851173401, 0, 2, 9, 7, 2, 3, -1., 9, 8, 2, 1, 3., -4.3226778507232666e-003, 0.2849566042423248, 0.5304684042930603, 0, 3, 7, 11, 2, 2, -1., 7, 11, 1, 1, 2., 8, 12, 1, 1, 2., -2.5534399319440126e-003, 0.7056984901428223, 0.4688892066478729, 0, 2, 11, 3, 2, 5, -1., 11, 3, 1, 5, 2., 1.0268510231981054e-004, 0.3902932107448578, 0.5573464035987854, 0, 2, 7, 3, 2, 5, -1., 8, 3, 1, 5, 2., 7.1395188570022583e-006, 0.3684231936931610, 0.5263987779617310, 0, 2, 15, 13, 2, 3, -1., 15, 14, 2, 1, 3., -1.6711989883333445e-003, 0.3849175870418549, 0.5387271046638489, 0, 2, 5, 6, 2, 3, -1., 5, 7, 2, 1, 3., 4.9260449595749378e-003, 0.4729771912097931, 0.7447251081466675, 0, 2, 4, 19, 15, 1, -1., 9, 19, 5, 1, 3., 4.3908702209591866e-003, 0.4809181094169617, 0.5591921806335449, 0, 2, 1, 19, 15, 1, -1., 6, 19, 5, 1, 3., -0.0177936293184757, 0.6903678178787231, 0.4676927030086517, 0, 2, 15, 13, 2, 3, -1., 15, 14, 2, 1, 3., 2.0469669252634048e-003, 0.5370690226554871, 0.3308162093162537, 0, 2, 5, 0, 4, 15, -1., 7, 0, 2, 15, 2., 0.0298914890736341, 0.5139865279197693, 0.3309059143066406, 0, 2, 9, 6, 2, 5, -1., 9, 6, 1, 5, 2., 1.5494900289922953e-003, 0.4660237133502960, 0.6078342795372009, 0, 2, 9, 5, 2, 7, -1., 10, 5, 1, 7, 2., 1.4956969534978271e-003, 0.4404835999011993, 0.5863919854164124, 0, 2, 16, 11, 3, 3, -1., 16, 12, 3, 1, 3., 9.5885928021743894e-004, 0.5435971021652222, 0.4208523035049439, 0, 2, 1, 11, 3, 3, -1., 1, 12, 3, 1, 3., 4.9643701640889049e-004, 0.5370578169822693, 0.4000622034072876, 0, 2, 6, 6, 8, 3, -1., 6, 7, 8, 1, 3., -2.7280810754746199e-003, 0.5659412741661072, 0.4259642958641052, 0, 2, 0, 15, 6, 2, -1., 0, 16, 6, 1, 2., 2.3026480339467525e-003, 0.5161657929420471, 0.3350869119167328, 0, 2, 1, 0, 18, 6, -1., 7, 0, 6, 6, 3., 0.2515163123607636, 0.4869661927223206, 0.7147309780120850, 0, 2, 6, 0, 3, 4, -1., 7, 0, 1, 4, 3., -4.6328022144734859e-003, 0.2727448940277100, 0.5083789825439453, 0, 3, 14, 10, 4, 10, -1., 16, 10, 2, 5, 2., 14, 15, 2, 5, 2., -0.0404344908893108, 0.6851438879966736, 0.5021767020225525, 0, 2, 3, 2, 3, 2, -1., 4, 2, 1, 2, 3., 1.4972220014897175e-005, 0.4284465014934540, 0.5522555112838745, 0, 2, 11, 2, 2, 2, -1., 11, 3, 2, 1, 2., -2.4050309730228037e-004, 0.4226118922233582, 0.5390074849128723, 0, 3, 2, 10, 4, 10, -1., 2, 10, 2, 5, 2., 4, 15, 2, 5, 2., 0.0236578397452831, 0.4744631946086884, 0.7504366040229797, 0, 3, 0, 13, 20, 6, -1., 10, 13, 10, 3, 2., 0, 16, 10, 3, 2., -8.1449104472994804e-003, 0.4245058894157410, 0.5538362860679627, 0, 2, 0, 5, 2, 15, -1., 1, 5, 1, 15, 2., -3.6992130335420370e-003, 0.5952357053756714, 0.4529713094234467, 0, 3, 1, 7, 18, 4, -1., 10, 7, 9, 2, 2., 1, 9, 9, 2, 2., -6.7718601785600185e-003, 0.4137794077396393, 0.5473399758338928, 0, 2, 0, 0, 2, 17, -1., 1, 0, 1, 17, 2., 4.2669530957937241e-003, 0.4484114944934845, 0.5797994136810303, 0, 3, 2, 6, 16, 6, -1., 10, 6, 8, 3, 2., 2, 9, 8, 3, 2., 1.7791989957913756e-003, 0.5624858736991882, 0.4432444870471954, 0, 2, 8, 14, 1, 3, -1., 8, 15, 1, 1, 3., 1.6774770338088274e-003, 0.4637751877307892, 0.6364241838455200, 0, 2, 8, 15, 4, 2, -1., 8, 16, 4, 1, 2., 1.1732629500329494e-003, 0.4544503092765808, 0.5914415717124939, 0, 3, 5, 2, 8, 2, -1., 5, 2, 4, 1, 2., 9, 3, 4, 1, 2., 8.6998171173036098e-004, 0.5334752798080444, 0.3885917961597443, 0, 2, 6, 11, 8, 6, -1., 6, 14, 8, 3, 2., 7.6378340600058436e-004, 0.5398585200309753, 0.3744941949844360, 0, 2, 9, 13, 2, 2, -1., 9, 14, 2, 1, 2., 1.5684569370932877e-004, 0.4317873120307922, 0.5614616274833679, 0, 2, 18, 4, 2, 6, -1., 18, 6, 2, 2, 3., -0.0215113703161478, 0.1785925030708313, 0.5185542702674866, 0, 2, 9, 12, 2, 2, -1., 9, 13, 2, 1, 2., 1.3081369979772717e-004, 0.4342499077320099, 0.5682849884033203, 0, 2, 18, 4, 2, 6, -1., 18, 6, 2, 2, 3., 0.0219920407980680, 0.5161716938018799, 0.2379394024610519, 0, 2, 9, 13, 1, 3, -1., 9, 14, 1, 1, 3., -8.0136500764638186e-004, 0.5986763238906860, 0.4466426968574524, 0, 2, 18, 4, 2, 6, -1., 18, 6, 2, 2, 3., -8.2736099138855934e-003, 0.4108217954635620, 0.5251057147979736, 0, 2, 0, 4, 2, 6, -1., 0, 6, 2, 2, 3., 3.6831789184361696e-003, 0.5173814296722412, 0.3397518098354340, 0, 2, 9, 12, 3, 3, -1., 9, 13, 3, 1, 3., -7.9525681212544441e-003, 0.6888983249664307, 0.4845924079418182, 0, 2, 3, 13, 2, 3, -1., 3, 14, 2, 1, 3., 1.5382299898192286e-003, 0.5178567171096802, 0.3454113900661469, 0, 2, 13, 13, 4, 3, -1., 13, 14, 4, 1, 3., -0.0140435304492712, 0.1678421050310135, 0.5188667774200440, 0, 2, 5, 4, 3, 3, -1., 5, 5, 3, 1, 3., 1.4315890148282051e-003, 0.4368256926536560, 0.5655773878097534, 0, 2, 5, 2, 10, 6, -1., 5, 4, 10, 2, 3., -0.0340142287313938, 0.7802296280860901, 0.4959217011928558, 0, 2, 3, 13, 4, 3, -1., 3, 14, 4, 1, 3., -0.0120272999629378, 0.1585101038217545, 0.5032231807708740, 0, 2, 3, 7, 15, 5, -1., 8, 7, 5, 5, 3., 0.1331661939620972, 0.5163304805755615, 0.2755128145217896, 0, 2, 3, 7, 12, 2, -1., 7, 7, 4, 2, 3., -1.5221949433907866e-003, 0.3728317916393280, 0.5214552283287048, 0, 2, 10, 3, 3, 9, -1., 11, 3, 1, 9, 3., -9.3929271679371595e-004, 0.5838379263877869, 0.4511165022850037, 0, 2, 8, 6, 4, 6, -1., 10, 6, 2, 6, 2., 0.0277197398245335, 0.4728286862373352, 0.7331544756889343, 0, 2, 9, 7, 4, 3, -1., 9, 8, 4, 1, 3., 3.1030150130391121e-003, 0.5302202105522156, 0.4101563096046448, 0, 2, 0, 9, 4, 9, -1., 2, 9, 2, 9, 2., 0.0778612196445465, 0.4998334050178528, 0.1272961944341660, 0, 2, 9, 13, 3, 5, -1., 10, 13, 1, 5, 3., -0.0158549398183823, 0.0508333593606949, 0.5165656208992004, 0, 2, 7, 7, 6, 3, -1., 9, 7, 2, 3, 3., -4.9725300632417202e-003, 0.6798133850097656, 0.4684231877326965, 0, 2, 9, 7, 3, 5, -1., 10, 7, 1, 5, 3., -9.7676506265997887e-004, 0.6010771989822388, 0.4788931906223297, 0, 2, 5, 7, 8, 2, -1., 9, 7, 4, 2, 2., -2.4647710379213095e-003, 0.3393397927284241, 0.5220503807067871, 0, 2, 5, 9, 12, 2, -1., 9, 9, 4, 2, 3., -6.7937700077891350e-003, 0.4365136921405792, 0.5239663124084473, 0, 2, 5, 6, 10, 3, -1., 10, 6, 5, 3, 2., 0.0326080210506916, 0.5052723884582520, 0.2425214946269989, 0, 2, 10, 12, 3, 1, -1., 11, 12, 1, 1, 3., -5.8514421107247472e-004, 0.5733973979949951, 0.4758574068546295, 0, 2, 0, 1, 11, 15, -1., 0, 6, 11, 5, 3., -0.0296326000243425, 0.3892289102077484, 0.5263597965240479, 67.6989212036132810, 137, 0, 2, 1, 0, 18, 6, -1., 7, 0, 6, 6, 3., 0.0465508513152599, 0.3276950120925903, 0.6240522861480713, 0, 2, 7, 7, 6, 1, -1., 9, 7, 2, 1, 3., 7.9537127166986465e-003, 0.4256485104560852, 0.6942939162254334, 0, 3, 5, 16, 6, 4, -1., 5, 16, 3, 2, 2., 8, 18, 3, 2, 2., 6.8221561377868056e-004, 0.3711487054824829, 0.5900732874870300, 0, 2, 6, 5, 9, 8, -1., 6, 9, 9, 4, 2., -1.9348249770700932e-004, 0.2041133940219879, 0.5300545096397400, 0, 2, 5, 10, 2, 6, -1., 5, 13, 2, 3, 2., -2.6710508973337710e-004, 0.5416126251220703, 0.3103179037570953, 0, 3, 7, 6, 8, 10, -1., 11, 6, 4, 5, 2., 7, 11, 4, 5, 2., 2.7818060480058193e-003, 0.5277832746505737, 0.3467069864273071, 0, 3, 5, 6, 8, 10, -1., 5, 6, 4, 5, 2., 9, 11, 4, 5, 2., -4.6779078547842801e-004, 0.5308231115341187, 0.3294492065906525, 0, 2, 9, 5, 2, 2, -1., 9, 6, 2, 1, 2., -3.0335160772665404e-005, 0.5773872733116150, 0.3852097094058991, 0, 2, 5, 12, 8, 2, -1., 5, 13, 8, 1, 2., 7.8038009814918041e-004, 0.4317438900470734, 0.6150057911872864, 0, 2, 10, 2, 8, 2, -1., 10, 3, 8, 1, 2., -4.2553851380944252e-003, 0.2933903932571411, 0.5324292778968811, 0, 3, 4, 0, 2, 10, -1., 4, 0, 1, 5, 2., 5, 5, 1, 5, 2., -2.4735610350035131e-004, 0.5468844771385193, 0.3843030035495758, 0, 2, 9, 10, 2, 2, -1., 9, 11, 2, 1, 2., -1.4724259381182492e-004, 0.4281542897224426, 0.5755587220191956, 0, 2, 2, 8, 15, 3, -1., 2, 9, 15, 1, 3., 1.1864770203828812e-003, 0.3747301101684570, 0.5471466183662415, 0, 2, 8, 13, 4, 3, -1., 8, 14, 4, 1, 3., 2.3936580400913954e-003, 0.4537783861160278, 0.6111528873443604, 0, 2, 7, 2, 3, 2, -1., 8, 2, 1, 2, 3., -1.5390539774671197e-003, 0.2971341907978058, 0.5189538002014160, 0, 2, 7, 13, 6, 3, -1., 7, 14, 6, 1, 3., -7.1968790143728256e-003, 0.6699066758155823, 0.4726476967334747, 0, 2, 9, 9, 2, 2, -1., 9, 10, 2, 1, 2., -4.1499789222143590e-004, 0.3384954035282135, 0.5260317921638489, 0, 2, 17, 2, 3, 6, -1., 17, 4, 3, 2, 3., 4.4359830208122730e-003, 0.5399122238159180, 0.3920140862464905, 0, 2, 1, 5, 3, 4, -1., 2, 5, 1, 4, 3., 2.6606200262904167e-003, 0.4482578039169312, 0.6119617819786072, 0, 2, 14, 8, 4, 6, -1., 14, 10, 4, 2, 3., -1.5287200221791863e-003, 0.3711237907409668, 0.5340266227722168, 0, 2, 1, 4, 3, 8, -1., 2, 4, 1, 8, 3., -4.7397250309586525e-003, 0.6031088232994080, 0.4455145001411438, 0, 2, 8, 13, 4, 6, -1., 8, 16, 4, 3, 2., -0.0148291299119592, 0.2838754057884216, 0.5341861844062805, 0, 2, 3, 14, 2, 2, -1., 3, 15, 2, 1, 2., 9.2275557108223438e-004, 0.5209547281265259, 0.3361653983592987, 0, 2, 14, 8, 4, 6, -1., 14, 10, 4, 2, 3., 0.0835298076272011, 0.5119969844818115, 0.0811644494533539, 0, 2, 2, 8, 4, 6, -1., 2, 10, 4, 2, 3., -7.5633148662745953e-004, 0.3317120075225830, 0.5189831256866455, 0, 2, 10, 14, 1, 6, -1., 10, 17, 1, 3, 2., 9.8403859883546829e-003, 0.5247598290443420, 0.2334959059953690, 0, 2, 7, 5, 3, 6, -1., 8, 5, 1, 6, 3., -1.5953830443322659e-003, 0.5750094056129456, 0.4295622110366821, 0, 3, 11, 2, 2, 6, -1., 12, 2, 1, 3, 2., 11, 5, 1, 3, 2., 3.4766020689858124e-005, 0.4342445135116577, 0.5564029216766357, 0, 2, 6, 6, 6, 5, -1., 8, 6, 2, 5, 3., 0.0298629105091095, 0.4579147100448608, 0.6579188108444214, 0, 2, 17, 1, 3, 6, -1., 17, 3, 3, 2, 3., 0.0113255903124809, 0.5274311900138855, 0.3673888146877289, 0, 2, 8, 7, 3, 5, -1., 9, 7, 1, 5, 3., -8.7828645482659340e-003, 0.7100368738174439, 0.4642167091369629, 0, 2, 9, 18, 3, 2, -1., 10, 18, 1, 2, 3., 4.3639959767460823e-003, 0.5279216170310974, 0.2705877125263214, 0, 2, 8, 18, 3, 2, -1., 9, 18, 1, 2, 3., 4.1804728098213673e-003, 0.5072525143623352, 0.2449083030223846, 0, 2, 12, 3, 5, 2, -1., 12, 4, 5, 1, 2., -4.5668511302210391e-004, 0.4283105134963989, 0.5548691153526306, 0, 2, 7, 1, 5, 12, -1., 7, 7, 5, 6, 2., -3.7140368949621916e-003, 0.5519387722015381, 0.4103653132915497, 0, 2, 1, 0, 18, 4, -1., 7, 0, 6, 4, 3., -0.0253042895346880, 0.6867002248764038, 0.4869889020919800, 0, 2, 4, 2, 2, 2, -1., 4, 3, 2, 1, 2., -3.4454080741852522e-004, 0.3728874027729034, 0.5287693142890930, 0, 3, 11, 14, 4, 2, -1., 13, 14, 2, 1, 2., 11, 15, 2, 1, 2., -8.3935231668874621e-004, 0.6060152053833008, 0.4616062045097351, 0, 2, 0, 2, 3, 6, -1., 0, 4, 3, 2, 3., 0.0172800496220589, 0.5049635767936707, 0.1819823980331421, 0, 2, 9, 7, 2, 3, -1., 9, 8, 2, 1, 3., -6.3595077954232693e-003, 0.1631239950656891, 0.5232778787612915, 0, 2, 5, 5, 1, 3, -1., 5, 6, 1, 1, 3., 1.0298109846189618e-003, 0.4463278055191040, 0.6176549196243286, 0, 2, 10, 10, 6, 1, -1., 10, 10, 3, 1, 2., 1.0117109632119536e-003, 0.5473384857177734, 0.4300698935985565, 0, 2, 4, 10, 6, 1, -1., 7, 10, 3, 1, 2., -0.0103088002651930, 0.1166985034942627, 0.5000867247581482, 0, 2, 9, 17, 3, 3, -1., 9, 18, 3, 1, 3., 5.4682018235325813e-003, 0.4769287109375000, 0.6719213724136353, 0, 2, 4, 14, 1, 3, -1., 4, 15, 1, 1, 3., -9.1696460731327534e-004, 0.3471089899539948, 0.5178164839744568, 0, 2, 12, 5, 3, 3, -1., 12, 6, 3, 1, 3., 2.3922820109874010e-003, 0.4785236120223999, 0.6216310858726502, 0, 2, 4, 5, 12, 3, -1., 4, 6, 12, 1, 3., -7.5573818758130074e-003, 0.5814796090126038, 0.4410085082054138, 0, 2, 9, 8, 2, 3, -1., 9, 9, 2, 1, 3., -7.7024032361805439e-004, 0.3878000080585480, 0.5465722084045410, 0, 2, 4, 9, 3, 3, -1., 5, 9, 1, 3, 3., -8.7125990539789200e-003, 0.1660051047801971, 0.4995836019515991, 0, 2, 6, 0, 9, 17, -1., 9, 0, 3, 17, 3., -0.0103063201531768, 0.4093391001224518, 0.5274233818054199, 0, 2, 9, 12, 1, 3, -1., 9, 13, 1, 1, 3., -2.0940979011356831e-003, 0.6206194758415222, 0.4572280049324036, 0, 2, 9, 5, 2, 15, -1., 9, 10, 2, 5, 3., 6.8099051713943481e-003, 0.5567759275436401, 0.4155600070953369, 0, 2, 8, 14, 2, 3, -1., 8, 15, 2, 1, 3., -1.0746059706434608e-003, 0.5638927817344666, 0.4353024959564209, 0, 2, 10, 14, 1, 3, -1., 10, 15, 1, 1, 3., 2.1550289820879698e-003, 0.4826265871524811, 0.6749758124351502, 0, 2, 7, 1, 6, 5, -1., 9, 1, 2, 5, 3., 0.0317423194646835, 0.5048379898071289, 0.1883248984813690, 0, 2, 0, 0, 20, 2, -1., 0, 0, 10, 2, 2., -0.0783827230334282, 0.2369548976421356, 0.5260158181190491, 0, 2, 2, 13, 5, 3, -1., 2, 14, 5, 1, 3., 5.7415119372308254e-003, 0.5048828721046448, 0.2776469886302948, 0, 2, 9, 11, 2, 3, -1., 9, 12, 2, 1, 3., -2.9014600440859795e-003, 0.6238604784011841, 0.4693317115306854, 0, 2, 2, 5, 9, 15, -1., 2, 10, 9, 5, 3., -2.6427931152284145e-003, 0.3314141929149628, 0.5169777274131775, 0, 3, 5, 0, 12, 10, -1., 11, 0, 6, 5, 2., 5, 5, 6, 5, 2., -0.1094966009259224, 0.2380045056343079, 0.5183441042900085, 0, 2, 5, 1, 2, 3, -1., 6, 1, 1, 3, 2., 7.4075913289561868e-005, 0.4069635868072510, 0.5362150073051453, 0, 2, 10, 7, 6, 1, -1., 12, 7, 2, 1, 3., -5.0593802006915212e-004, 0.5506706237792969, 0.4374594092369080, 0, 3, 3, 1, 2, 10, -1., 3, 1, 1, 5, 2., 4, 6, 1, 5, 2., -8.2131777890026569e-004, 0.5525709986686707, 0.4209375977516174, 0, 2, 13, 7, 2, 1, -1., 13, 7, 1, 1, 2., -6.0276539443293586e-005, 0.5455474853515625, 0.4748266041278839, 0, 2, 4, 13, 4, 6, -1., 4, 15, 4, 2, 3., 6.8065142259001732e-003, 0.5157995820045471, 0.3424577116966248, 0, 2, 13, 7, 2, 1, -1., 13, 7, 1, 1, 2., 1.7202789895236492e-003, 0.5013207793235779, 0.6331263780593872, 0, 2, 5, 7, 2, 1, -1., 6, 7, 1, 1, 2., -1.3016929733566940e-004, 0.5539718270301819, 0.4226869940757752, 0, 3, 2, 12, 18, 4, -1., 11, 12, 9, 2, 2., 2, 14, 9, 2, 2., -4.8016388900578022e-003, 0.4425095021724701, 0.5430780053138733, 0, 3, 5, 7, 2, 2, -1., 5, 7, 1, 1, 2., 6, 8, 1, 1, 2., -2.5399310979992151e-003, 0.7145782113075256, 0.4697605073451996, 0, 2, 16, 3, 4, 2, -1., 16, 4, 4, 1, 2., -1.4278929447755218e-003, 0.4070445001125336, 0.5399605035781860, 0, 3, 0, 2, 2, 18, -1., 0, 2, 1, 9, 2., 1, 11, 1, 9, 2., -0.0251425504684448, 0.7884690761566162, 0.4747352004051209, 0, 3, 1, 2, 18, 4, -1., 10, 2, 9, 2, 2., 1, 4, 9, 2, 2., -3.8899609353393316e-003, 0.4296191930770874, 0.5577110052108765, 0, 2, 9, 14, 1, 3, -1., 9, 15, 1, 1, 3., 4.3947459198534489e-003, 0.4693162143230438, 0.7023944258689880, 0, 3, 2, 12, 18, 4, -1., 11, 12, 9, 2, 2., 2, 14, 9, 2, 2., 0.0246784202754498, 0.5242322087287903, 0.3812510073184967, 0, 3, 0, 12, 18, 4, -1., 0, 12, 9, 2, 2., 9, 14, 9, 2, 2., 0.0380476787686348, 0.5011739730834961, 0.1687828004360199, 0, 2, 11, 4, 5, 3, -1., 11, 5, 5, 1, 3., 7.9424865543842316e-003, 0.4828582108020783, 0.6369568109512329, 0, 2, 6, 4, 7, 3, -1., 6, 5, 7, 1, 3., -1.5110049862414598e-003, 0.5906485915184021, 0.4487667977809906, 0, 2, 13, 17, 3, 3, -1., 13, 18, 3, 1, 3., 6.4201741479337215e-003, 0.5241097807884216, 0.2990570068359375, 0, 2, 8, 1, 3, 4, -1., 9, 1, 1, 4, 3., -2.9802159406244755e-003, 0.3041465878486633, 0.5078489780426025, 0, 2, 11, 4, 2, 4, -1., 11, 4, 1, 4, 2., -7.4580078944563866e-004, 0.4128139019012451, 0.5256826281547546, 0, 2, 0, 17, 9, 3, -1., 3, 17, 3, 3, 3., -0.0104709500446916, 0.5808395147323608, 0.4494296014308929, 0, 3, 11, 0, 2, 8, -1., 12, 0, 1, 4, 2., 11, 4, 1, 4, 2., 9.3369204550981522e-003, 0.5246552824974060, 0.2658948898315430, 0, 3, 0, 8, 6, 12, -1., 0, 8, 3, 6, 2., 3, 14, 3, 6, 2., 0.0279369000345469, 0.4674955010414124, 0.7087256908416748, 0, 2, 10, 7, 4, 12, -1., 10, 13, 4, 6, 2., 7.4277678504586220e-003, 0.5409486889839172, 0.3758518099784851, 0, 2, 5, 3, 8, 14, -1., 5, 10, 8, 7, 2., -0.0235845092684031, 0.3758639991283417, 0.5238550901412964, 0, 2, 14, 10, 6, 1, -1., 14, 10, 3, 1, 2., 1.1452640173956752e-003, 0.4329578876495361, 0.5804247260093689, 0, 2, 0, 4, 10, 4, -1., 0, 6, 10, 2, 2., -4.3468660442158580e-004, 0.5280618071556091, 0.3873069882392883, 0, 2, 10, 0, 5, 8, -1., 10, 4, 5, 4, 2., 0.0106485402211547, 0.4902113080024719, 0.5681251883506775, 0, 3, 8, 1, 4, 8, -1., 8, 1, 2, 4, 2., 10, 5, 2, 4, 2., -3.9418050437234342e-004, 0.5570880174636841, 0.4318251013755798, 0, 2, 9, 11, 6, 1, -1., 11, 11, 2, 1, 3., -1.3270479394122958e-004, 0.5658439993858337, 0.4343554973602295, 0, 2, 8, 9, 3, 4, -1., 9, 9, 1, 4, 3., -2.0125510636717081e-003, 0.6056739091873169, 0.4537523984909058, 0, 2, 18, 4, 2, 6, -1., 18, 6, 2, 2, 3., 2.4854319635778666e-003, 0.5390477180480957, 0.4138010144233704, 0, 2, 8, 8, 3, 4, -1., 9, 8, 1, 4, 3., 1.8237880431115627e-003, 0.4354828894138336, 0.5717188715934753, 0, 2, 7, 1, 13, 3, -1., 7, 2, 13, 1, 3., -0.0166566595435143, 0.3010913133621216, 0.5216122865676880, 0, 2, 7, 13, 6, 1, -1., 9, 13, 2, 1, 3., 8.0349558265879750e-004, 0.5300151109695435, 0.3818396925926209, 0, 2, 12, 11, 3, 6, -1., 12, 13, 3, 2, 3., 3.4170378930866718e-003, 0.5328028798103333, 0.4241400063037872, 0, 2, 5, 11, 6, 1, -1., 7, 11, 2, 1, 3., -3.6222729249857366e-004, 0.5491728186607361, 0.4186977148056030, 0, 3, 1, 4, 18, 10, -1., 10, 4, 9, 5, 2., 1, 9, 9, 5, 2., -0.1163002029061317, 0.1440722048282623, 0.5226451158523560, 0, 2, 8, 6, 4, 9, -1., 8, 9, 4, 3, 3., -0.0146950101479888, 0.7747725248336792, 0.4715717136859894, 0, 2, 8, 6, 4, 3, -1., 8, 7, 4, 1, 3., 2.1972130052745342e-003, 0.5355433821678162, 0.3315644860267639, 0, 2, 8, 7, 3, 3, -1., 9, 7, 1, 3, 3., -4.6965209185145795e-004, 0.5767235159873962, 0.4458136856555939, 0, 2, 14, 15, 4, 3, -1., 14, 16, 4, 1, 3., 6.5144998952746391e-003, 0.5215674042701721, 0.3647888898849487, 0, 2, 5, 10, 3, 10, -1., 6, 10, 1, 10, 3., 0.0213000606745481, 0.4994204938411713, 0.1567950993776321, 0, 2, 8, 15, 4, 3, -1., 8, 16, 4, 1, 3., 3.1881409231573343e-003, 0.4742200076580048, 0.6287270188331604, 0, 2, 0, 8, 1, 6, -1., 0, 10, 1, 2, 3., 9.0019777417182922e-004, 0.5347954034805298, 0.3943752050399780, 0, 2, 10, 15, 1, 3, -1., 10, 16, 1, 1, 3., -5.1772277802228928e-003, 0.6727191805839539, 0.5013138055801392, 0, 2, 2, 15, 4, 3, -1., 2, 16, 4, 1, 3., -4.3764649890363216e-003, 0.3106675148010254, 0.5128793120384216, 0, 3, 18, 3, 2, 8, -1., 19, 3, 1, 4, 2., 18, 7, 1, 4, 2., 2.6299960445612669e-003, 0.4886310100555420, 0.5755215883255005, 0, 3, 0, 3, 2, 8, -1., 0, 3, 1, 4, 2., 1, 7, 1, 4, 2., -2.0458688959479332e-003, 0.6025794148445129, 0.4558076858520508, 0, 3, 3, 7, 14, 10, -1., 10, 7, 7, 5, 2., 3, 12, 7, 5, 2., 0.0694827064871788, 0.5240747928619385, 0.2185259014368057, 0, 2, 0, 7, 19, 3, -1., 0, 8, 19, 1, 3., 0.0240489393472672, 0.5011867284774780, 0.2090622037649155, 0, 2, 12, 6, 3, 3, -1., 12, 7, 3, 1, 3., 3.1095340382307768e-003, 0.4866712093353272, 0.7108548283576965, 0, 2, 0, 6, 1, 3, -1., 0, 7, 1, 1, 3., -1.2503260513767600e-003, 0.3407891094684601, 0.5156195163726807, 0, 2, 12, 6, 3, 3, -1., 12, 7, 3, 1, 3., -1.0281190043315291e-003, 0.5575572252273560, 0.4439432024955750, 0, 2, 5, 6, 3, 3, -1., 5, 7, 3, 1, 3., -8.8893622159957886e-003, 0.6402000784873962, 0.4620442092418671, 0, 2, 8, 2, 4, 2, -1., 8, 3, 4, 1, 2., -6.1094801640138030e-004, 0.3766441941261292, 0.5448899865150452, 0, 2, 6, 3, 4, 12, -1., 8, 3, 2, 12, 2., -5.7686357758939266e-003, 0.3318648934364319, 0.5133677124977112, 0, 2, 13, 6, 2, 3, -1., 13, 7, 2, 1, 3., 1.8506490159779787e-003, 0.4903570115566254, 0.6406934857368469, 0, 2, 0, 10, 20, 4, -1., 0, 12, 20, 2, 2., -0.0997994691133499, 0.1536051034927368, 0.5015562176704407, 0, 2, 2, 0, 17, 14, -1., 2, 7, 17, 7, 2., -0.3512834906578064, 0.0588231310248375, 0.5174378752708435, 0, 3, 0, 0, 6, 10, -1., 0, 0, 3, 5, 2., 3, 5, 3, 5, 2., -0.0452445708215237, 0.6961488723754883, 0.4677872955799103, 0, 2, 14, 6, 6, 4, -1., 14, 6, 3, 4, 2., 0.0714815780520439, 0.5167986154556274, 0.1038092970848084, 0, 2, 0, 6, 6, 4, -1., 3, 6, 3, 4, 2., 2.1895780228078365e-003, 0.4273078143596649, 0.5532060861587524, 0, 2, 13, 2, 7, 2, -1., 13, 3, 7, 1, 2., -5.9242651332169771e-004, 0.4638943970203400, 0.5276389122009277, 0, 2, 0, 2, 7, 2, -1., 0, 3, 7, 1, 2., 1.6788389766588807e-003, 0.5301648974418640, 0.3932034969329834, 0, 3, 6, 11, 14, 2, -1., 13, 11, 7, 1, 2., 6, 12, 7, 1, 2., -2.2163488902151585e-003, 0.5630694031715393, 0.4757033884525299, 0, 3, 8, 5, 2, 2, -1., 8, 5, 1, 1, 2., 9, 6, 1, 1, 2., 1.1568699846975505e-004, 0.4307535886764526, 0.5535702705383301, 0, 2, 13, 9, 2, 3, -1., 13, 9, 1, 3, 2., -7.2017288766801357e-003, 0.1444882005453110, 0.5193064212799072, 0, 2, 1, 1, 3, 12, -1., 2, 1, 1, 12, 3., 8.9081272017210722e-004, 0.4384432137012482, 0.5593621134757996, 0, 2, 17, 4, 1, 3, -1., 17, 5, 1, 1, 3., 1.9605009583756328e-004, 0.5340415835380554, 0.4705956876277924, 0, 2, 2, 4, 1, 3, -1., 2, 5, 1, 1, 3., 5.2022142335772514e-004, 0.5213856101036072, 0.3810079097747803, 0, 2, 14, 5, 1, 3, -1., 14, 6, 1, 1, 3., 9.4588572392240167e-004, 0.4769414961338043, 0.6130738854408264, 0, 2, 7, 16, 2, 3, -1., 7, 17, 2, 1, 3., 9.1698471806012094e-005, 0.4245009124279022, 0.5429363250732422, 0, 3, 8, 13, 4, 6, -1., 10, 13, 2, 3, 2., 8, 16, 2, 3, 2., 2.1833200007677078e-003, 0.5457730889320374, 0.4191075861454010, 0, 2, 5, 5, 1, 3, -1., 5, 6, 1, 1, 3., -8.6039671441540122e-004, 0.5764588713645935, 0.4471659958362579, 0, 2, 16, 0, 4, 20, -1., 16, 0, 2, 20, 2., -0.0132362395524979, 0.6372823119163513, 0.4695009887218475, 0, 3, 5, 1, 2, 6, -1., 5, 1, 1, 3, 2., 6, 4, 1, 3, 2., 4.3376701069064438e-004, 0.5317873954772949, 0.3945829868316650, 69.2298736572265630, 140, 0, 2, 5, 4, 10, 4, -1., 5, 6, 10, 2, 2., -0.0248471498489380, 0.6555516719818115, 0.3873311877250671, 0, 2, 15, 2, 4, 12, -1., 15, 2, 2, 12, 2., 6.1348611488938332e-003, 0.3748072087764740, 0.5973997712135315, 0, 2, 7, 6, 4, 12, -1., 7, 12, 4, 6, 2., 6.4498498104512691e-003, 0.5425491929054260, 0.2548811137676239, 0, 2, 14, 5, 1, 8, -1., 14, 9, 1, 4, 2., 6.3491211039945483e-004, 0.2462442070245743, 0.5387253761291504, 0, 3, 1, 4, 14, 10, -1., 1, 4, 7, 5, 2., 8, 9, 7, 5, 2., 1.4023890253156424e-003, 0.5594322085380554, 0.3528657853603363, 0, 3, 11, 6, 6, 14, -1., 14, 6, 3, 7, 2., 11, 13, 3, 7, 2., 3.0044000595808029e-004, 0.3958503901958466, 0.5765938162803650, 0, 3, 3, 6, 6, 14, -1., 3, 6, 3, 7, 2., 6, 13, 3, 7, 2., 1.0042409849120304e-004, 0.3698996901512146, 0.5534998178482056, 0, 2, 4, 9, 15, 2, -1., 9, 9, 5, 2, 3., -5.0841490738093853e-003, 0.3711090981960297, 0.5547800064086914, 0, 2, 7, 14, 6, 3, -1., 7, 15, 6, 1, 3., -0.0195372607558966, 0.7492755055427551, 0.4579297006130219, 0, 3, 6, 3, 14, 4, -1., 13, 3, 7, 2, 2., 6, 5, 7, 2, 2., -7.4532740654831287e-006, 0.5649787187576294, 0.3904069960117340, 0, 2, 1, 9, 15, 2, -1., 6, 9, 5, 2, 3., -3.6079459823668003e-003, 0.3381088078022003, 0.5267801284790039, 0, 2, 6, 11, 8, 9, -1., 6, 14, 8, 3, 3., 2.0697501022368670e-003, 0.5519291162490845, 0.3714388906955719, 0, 2, 7, 4, 3, 8, -1., 8, 4, 1, 8, 3., -4.6463840408250690e-004, 0.5608214735984802, 0.4113566875457764, 0, 2, 14, 6, 2, 6, -1., 14, 9, 2, 3, 2., 7.5490452582016587e-004, 0.3559206128120422, 0.5329356193542481, 0, 3, 5, 7, 6, 4, -1., 5, 7, 3, 2, 2., 8, 9, 3, 2, 2., -9.8322238773107529e-004, 0.5414795875549316, 0.3763205111026764, 0, 2, 1, 1, 18, 19, -1., 7, 1, 6, 19, 3., -0.0199406407773495, 0.6347903013229370, 0.4705299139022827, 0, 2, 1, 2, 6, 5, -1., 4, 2, 3, 5, 2., 3.7680300883948803e-003, 0.3913489878177643, 0.5563716292381287, 0, 2, 12, 17, 6, 2, -1., 12, 18, 6, 1, 2., -9.4528505578637123e-003, 0.2554892897605896, 0.5215116739273071, 0, 2, 2, 17, 6, 2, -1., 2, 18, 6, 1, 2., 2.9560849070549011e-003, 0.5174679160118103, 0.3063920140266419, 0, 2, 17, 3, 3, 6, -1., 17, 5, 3, 2, 3., 9.1078737750649452e-003, 0.5388448238372803, 0.2885963022708893, 0, 2, 8, 17, 3, 3, -1., 8, 18, 3, 1, 3., 1.8219229532405734e-003, 0.4336043000221252, 0.5852196812629700, 0, 2, 10, 13, 2, 6, -1., 10, 16, 2, 3, 2., 0.0146887395530939, 0.5287361741065979, 0.2870005965232849, 0, 2, 7, 13, 6, 3, -1., 7, 14, 6, 1, 3., -0.0143879903480411, 0.7019448876380920, 0.4647370874881744, 0, 2, 17, 3, 3, 6, -1., 17, 5, 3, 2, 3., -0.0189866498112679, 0.2986552119255066, 0.5247011780738831, 0, 2, 8, 13, 2, 3, -1., 8, 14, 2, 1, 3., 1.1527639580890536e-003, 0.4323473870754242, 0.5931661725044251, 0, 2, 9, 3, 6, 2, -1., 11, 3, 2, 2, 3., 0.0109336702153087, 0.5286864042282105, 0.3130319118499756, 0, 2, 0, 3, 3, 6, -1., 0, 5, 3, 2, 3., -0.0149327302351594, 0.2658419013023377, 0.5084077119827271, 0, 2, 8, 5, 4, 6, -1., 8, 7, 4, 2, 3., -2.9970539617352188e-004, 0.5463526844978333, 0.3740724027156830, 0, 2, 5, 5, 3, 2, -1., 5, 6, 3, 1, 2., 4.1677621193230152e-003, 0.4703496992588043, 0.7435721755027771, 0, 2, 10, 1, 3, 4, -1., 11, 1, 1, 4, 3., -6.3905320130288601e-003, 0.2069258987903595, 0.5280538201332092, 0, 2, 1, 2, 5, 9, -1., 1, 5, 5, 3, 3., 4.5029609464108944e-003, 0.5182648897171021, 0.3483543097972870, 0, 2, 13, 6, 2, 3, -1., 13, 7, 2, 1, 3., -9.2040365561842918e-003, 0.6803777217864990, 0.4932360053062439, 0, 2, 0, 6, 14, 3, -1., 7, 6, 7, 3, 2., 0.0813272595405579, 0.5058398842811585, 0.2253051996231079, 0, 2, 2, 11, 18, 8, -1., 2, 15, 18, 4, 2., -0.1507928073406220, 0.2963424921035767, 0.5264679789543152, 0, 2, 5, 6, 2, 3, -1., 5, 7, 2, 1, 3., 3.3179009333252907e-003, 0.4655495882034302, 0.7072932124137878, 0, 3, 10, 6, 4, 2, -1., 12, 6, 2, 1, 2., 10, 7, 2, 1, 2., 7.7402801252901554e-004, 0.4780347943305969, 0.5668237805366516, 0, 3, 6, 6, 4, 2, -1., 6, 6, 2, 1, 2., 8, 7, 2, 1, 2., 6.8199541419744492e-004, 0.4286996126174927, 0.5722156763076782, 0, 2, 10, 1, 3, 4, -1., 11, 1, 1, 4, 3., 5.3671570494771004e-003, 0.5299307107925415, 0.3114621937274933, 0, 2, 7, 1, 2, 7, -1., 8, 1, 1, 7, 2., 9.7018666565418243e-005, 0.3674638867378235, 0.5269461870193481, 0, 2, 4, 2, 15, 14, -1., 4, 9, 15, 7, 2., -0.1253408938646317, 0.2351492047309876, 0.5245791077613831, 0, 2, 8, 7, 3, 2, -1., 9, 7, 1, 2, 3., -5.2516269497573376e-003, 0.7115936875343323, 0.4693767130374908, 0, 3, 2, 3, 18, 4, -1., 11, 3, 9, 2, 2., 2, 5, 9, 2, 2., -7.8342109918594360e-003, 0.4462651014328003, 0.5409085750579834, 0, 2, 9, 7, 2, 2, -1., 10, 7, 1, 2, 2., -1.1310069821774960e-003, 0.5945618748664856, 0.4417662024497986, 0, 2, 13, 9, 2, 3, -1., 13, 9, 1, 3, 2., 1.7601120052859187e-003, 0.5353249907493591, 0.3973453044891357, 0, 2, 5, 2, 6, 2, -1., 7, 2, 2, 2, 3., -8.1581249833106995e-004, 0.3760268092155457, 0.5264726877212524, 0, 2, 9, 5, 2, 7, -1., 9, 5, 1, 7, 2., -3.8687589112669230e-003, 0.6309912800788879, 0.4749819934368134, 0, 2, 5, 9, 2, 3, -1., 6, 9, 1, 3, 2., 1.5207129763439298e-003, 0.5230181813240051, 0.3361223936080933, 0, 2, 6, 0, 14, 18, -1., 6, 9, 14, 9, 2., 0.5458673834800720, 0.5167139768600464, 0.1172635033726692, 0, 2, 2, 16, 6, 3, -1., 2, 17, 6, 1, 3., 0.0156501904129982, 0.4979439079761505, 0.1393294930458069, 0, 2, 9, 7, 3, 6, -1., 10, 7, 1, 6, 3., -0.0117318602278829, 0.7129650712013245, 0.4921196103096008, 0, 2, 7, 8, 4, 3, -1., 7, 9, 4, 1, 3., -6.1765122227370739e-003, 0.2288102954626083, 0.5049701929092407, 0, 2, 7, 12, 6, 3, -1., 7, 13, 6, 1, 3., 2.2457661107182503e-003, 0.4632433950901032, 0.6048725843429565, 0, 2, 9, 12, 2, 3, -1., 9, 13, 2, 1, 3., -5.1915869116783142e-003, 0.6467421054840088, 0.4602192938327789, 0, 2, 7, 12, 6, 2, -1., 9, 12, 2, 2, 3., -0.0238278806209564, 0.1482000946998596, 0.5226079225540161, 0, 2, 5, 11, 4, 6, -1., 5, 14, 4, 3, 2., 1.0284580057486892e-003, 0.5135489106178284, 0.3375957012176514, 0, 2, 11, 12, 7, 2, -1., 11, 13, 7, 1, 2., -0.0100788502022624, 0.2740561068058014, 0.5303567051887512, 0, 3, 6, 10, 8, 6, -1., 6, 10, 4, 3, 2., 10, 13, 4, 3, 2., 2.6168930344283581e-003, 0.5332670807838440, 0.3972454071044922, 0, 2, 11, 10, 3, 4, -1., 11, 12, 3, 2, 2., 5.4385367548093200e-004, 0.5365604162216187, 0.4063411951065064, 0, 2, 9, 16, 2, 3, -1., 9, 17, 2, 1, 3., 5.3510512225329876e-003, 0.4653759002685547, 0.6889045834541321, 0, 2, 13, 3, 1, 9, -1., 13, 6, 1, 3, 3., -1.5274790348485112e-003, 0.5449501276016235, 0.3624723851680756, 0, 2, 1, 13, 14, 6, -1., 1, 15, 14, 2, 3., -0.0806244164705276, 0.1656087040901184, 0.5000287294387817, 0, 2, 13, 6, 1, 6, -1., 13, 9, 1, 3, 2., 0.0221920292824507, 0.5132731199264526, 0.2002808004617691, 0, 2, 0, 4, 3, 8, -1., 1, 4, 1, 8, 3., 7.3100631125271320e-003, 0.4617947936058044, 0.6366536021232605, 0, 2, 18, 0, 2, 18, -1., 18, 0, 1, 18, 2., -6.4063072204589844e-003, 0.5916250944137573, 0.4867860972881317, 0, 2, 2, 3, 6, 2, -1., 2, 4, 6, 1, 2., -7.6415040530264378e-004, 0.3888409137725830, 0.5315797924995422, 0, 2, 9, 0, 8, 6, -1., 9, 2, 8, 2, 3., 7.6734489994123578e-004, 0.4159064888954163, 0.5605279803276062, 0, 2, 6, 6, 1, 6, -1., 6, 9, 1, 3, 2., 6.1474501853808761e-004, 0.3089022040367127, 0.5120148062705994, 0, 2, 14, 8, 6, 3, -1., 14, 9, 6, 1, 3., -5.0105270929634571e-003, 0.3972199857234955, 0.5207306146621704, 0, 2, 0, 0, 2, 18, -1., 1, 0, 1, 18, 2., -8.6909132078289986e-003, 0.6257408261299133, 0.4608575999736786, 0, 3, 1, 18, 18, 2, -1., 10, 18, 9, 1, 2., 1, 19, 9, 1, 2., -0.0163914598524570, 0.2085209935903549, 0.5242266058921814, 0, 2, 3, 15, 2, 2, -1., 3, 16, 2, 1, 2., 4.0973909199237823e-004, 0.5222427248954773, 0.3780320882797241, 0, 2, 8, 14, 5, 3, -1., 8, 15, 5, 1, 3., -2.5242289993911982e-003, 0.5803927183151245, 0.4611890017986298, 0, 2, 8, 14, 2, 3, -1., 8, 15, 2, 1, 3., 5.0945312250405550e-004, 0.4401271939277649, 0.5846015810966492, 0, 2, 12, 3, 3, 3, -1., 13, 3, 1, 3, 3., 1.9656419754028320e-003, 0.5322325229644775, 0.4184590876102448, 0, 2, 7, 5, 6, 2, -1., 9, 5, 2, 2, 3., 5.6298897834494710e-004, 0.3741844892501831, 0.5234565734863281, 0, 2, 15, 5, 5, 2, -1., 15, 6, 5, 1, 2., -6.7946797935292125e-004, 0.4631041884422302, 0.5356478095054627, 0, 2, 0, 5, 5, 2, -1., 0, 6, 5, 1, 2., 7.2856349870562553e-003, 0.5044670104980469, 0.2377564013004303, 0, 2, 17, 14, 1, 6, -1., 17, 17, 1, 3, 2., -0.0174594894051552, 0.7289121150970459, 0.5050435066223145, 0, 2, 2, 9, 9, 3, -1., 5, 9, 3, 3, 3., -0.0254217498004436, 0.6667134761810303, 0.4678100049495697, 0, 2, 12, 3, 3, 3, -1., 13, 3, 1, 3, 3., -1.5647639520466328e-003, 0.4391759037971497, 0.5323626995086670, 0, 2, 0, 0, 4, 18, -1., 2, 0, 2, 18, 2., 0.0114443600177765, 0.4346440136432648, 0.5680012106895447, 0, 2, 17, 6, 1, 3, -1., 17, 7, 1, 1, 3., -6.7352550104260445e-004, 0.4477140903472900, 0.5296812057495117, 0, 2, 2, 14, 1, 6, -1., 2, 17, 1, 3, 2., 9.3194209039211273e-003, 0.4740200042724609, 0.7462607026100159, 0, 2, 19, 8, 1, 2, -1., 19, 9, 1, 1, 2., 1.3328490604180843e-004, 0.5365061759948731, 0.4752134978771210, 0, 2, 5, 3, 3, 3, -1., 6, 3, 1, 3, 3., -7.8815799206495285e-003, 0.1752219051122665, 0.5015255212783814, 0, 2, 9, 16, 2, 3, -1., 9, 17, 2, 1, 3., -5.7985680177807808e-003, 0.7271236777305603, 0.4896200895309448, 0, 2, 2, 6, 1, 3, -1., 2, 7, 1, 1, 3., -3.8922499516047537e-004, 0.4003908932209015, 0.5344941020011902, 0, 3, 12, 4, 8, 2, -1., 16, 4, 4, 1, 2., 12, 5, 4, 1, 2., -1.9288610201328993e-003, 0.5605612993240356, 0.4803955852985382, 0, 3, 0, 4, 8, 2, -1., 0, 4, 4, 1, 2., 4, 5, 4, 1, 2., 8.4214154630899429e-003, 0.4753246903419495, 0.7623608708381653, 0, 2, 2, 16, 18, 4, -1., 2, 18, 18, 2, 2., 8.1655876711010933e-003, 0.5393261909484863, 0.4191643893718720, 0, 2, 7, 15, 2, 4, -1., 7, 17, 2, 2, 2., 4.8280550981871784e-004, 0.4240800142288208, 0.5399821996688843, 0, 2, 4, 0, 14, 3, -1., 4, 1, 14, 1, 3., -2.7186630759388208e-003, 0.4244599938392639, 0.5424923896789551, 0, 2, 0, 0, 4, 20, -1., 2, 0, 2, 20, 2., -0.0125072300434113, 0.5895841717720032, 0.4550411105155945, 0, 3, 12, 4, 4, 8, -1., 14, 4, 2, 4, 2., 12, 8, 2, 4, 2., -0.0242865197360516, 0.2647134959697723, 0.5189179778099060, 0, 3, 6, 7, 2, 2, -1., 6, 7, 1, 1, 2., 7, 8, 1, 1, 2., -2.9676330741494894e-003, 0.7347682714462280, 0.4749749898910523, 0, 2, 10, 6, 2, 3, -1., 10, 7, 2, 1, 3., -0.0125289997085929, 0.2756049931049347, 0.5177599787712097, 0, 2, 8, 7, 3, 2, -1., 8, 8, 3, 1, 2., -1.0104000102728605e-003, 0.3510560989379883, 0.5144724249839783, 0, 2, 8, 2, 6, 12, -1., 8, 8, 6, 6, 2., -2.1348530426621437e-003, 0.5637925863265991, 0.4667319953441620, 0, 2, 4, 0, 11, 12, -1., 4, 4, 11, 4, 3., 0.0195642597973347, 0.4614573121070862, 0.6137639880180359, 0, 2, 14, 9, 6, 11, -1., 16, 9, 2, 11, 3., -0.0971463471651077, 0.2998378872871399, 0.5193555951118469, 0, 2, 0, 14, 4, 3, -1., 0, 15, 4, 1, 3., 4.5014568604528904e-003, 0.5077884793281555, 0.3045755922794342, 0, 2, 9, 10, 2, 3, -1., 9, 11, 2, 1, 3., 6.3706971704959869e-003, 0.4861018955707550, 0.6887500882148743, 0, 2, 5, 11, 3, 2, -1., 5, 12, 3, 1, 2., -9.0721528977155685e-003, 0.1673395931720734, 0.5017563104629517, 0, 2, 9, 15, 3, 3, -1., 10, 15, 1, 3, 3., -5.3537208586931229e-003, 0.2692756950855255, 0.5242633223533630, 0, 2, 8, 8, 3, 4, -1., 9, 8, 1, 4, 3., -0.0109328404068947, 0.7183864116668701, 0.4736028909683228, 0, 2, 9, 15, 3, 3, -1., 10, 15, 1, 3, 3., 8.2356072962284088e-003, 0.5223966836929321, 0.2389862984418869, 0, 2, 7, 7, 3, 2, -1., 8, 7, 1, 2, 3., -1.0038160253316164e-003, 0.5719355940818787, 0.4433943033218384, 0, 3, 2, 10, 16, 4, -1., 10, 10, 8, 2, 2., 2, 12, 8, 2, 2., 4.0859128348529339e-003, 0.5472841858863831, 0.4148836135864258, 0, 2, 2, 3, 4, 17, -1., 4, 3, 2, 17, 2., 0.1548541933298111, 0.4973812103271484, 0.0610615983605385, 0, 2, 15, 13, 2, 7, -1., 15, 13, 1, 7, 2., 2.0897459762636572e-004, 0.4709174036979675, 0.5423889160156250, 0, 2, 2, 2, 6, 1, -1., 5, 2, 3, 1, 2., 3.3316991175524890e-004, 0.4089626967906952, 0.5300992131233215, 0, 2, 5, 2, 12, 4, -1., 9, 2, 4, 4, 3., -0.0108134001493454, 0.6104369759559631, 0.4957334101200104, 0, 3, 6, 0, 8, 12, -1., 6, 0, 4, 6, 2., 10, 6, 4, 6, 2., 0.0456560105085373, 0.5069689154624939, 0.2866660058498383, 0, 3, 13, 7, 2, 2, -1., 14, 7, 1, 1, 2., 13, 8, 1, 1, 2., 1.2569549726322293e-003, 0.4846917092800140, 0.6318171024322510, 0, 2, 0, 12, 20, 6, -1., 0, 14, 20, 2, 3., -0.1201507002115250, 0.0605261400341988, 0.4980959892272949, 0, 2, 14, 7, 2, 3, -1., 14, 7, 1, 3, 2., -1.0533799650147557e-004, 0.5363109707832336, 0.4708042144775391, 0, 2, 0, 8, 9, 12, -1., 3, 8, 3, 12, 3., -0.2070319056510925, 0.0596603304147720, 0.4979098141193390, 0, 2, 3, 0, 16, 2, -1., 3, 0, 8, 2, 2., 1.2909180077258497e-004, 0.4712977111339569, 0.5377997756004334, 0, 2, 6, 15, 3, 3, -1., 6, 16, 3, 1, 3., 3.8818528992123902e-004, 0.4363538026809692, 0.5534191131591797, 0, 2, 8, 15, 6, 3, -1., 8, 16, 6, 1, 3., -2.9243610333651304e-003, 0.5811185836791992, 0.4825215935707092, 0, 2, 0, 10, 1, 6, -1., 0, 12, 1, 2, 3., 8.3882332546636462e-004, 0.5311700105667114, 0.4038138985633850, 0, 2, 10, 9, 4, 3, -1., 10, 10, 4, 1, 3., -1.9061550265178084e-003, 0.3770701885223389, 0.5260015130043030, 0, 2, 9, 15, 2, 3, -1., 9, 16, 2, 1, 3., 8.9514348655939102e-003, 0.4766167998313904, 0.7682183980941773, 0, 2, 5, 7, 10, 1, -1., 5, 7, 5, 1, 2., 0.0130834598094225, 0.5264462828636169, 0.3062222003936768, 0, 2, 4, 0, 12, 19, -1., 10, 0, 6, 19, 2., -0.2115933001041412, 0.6737198233604431, 0.4695810079574585, 0, 3, 0, 6, 20, 6, -1., 10, 6, 10, 3, 2., 0, 9, 10, 3, 2., 3.1493250280618668e-003, 0.5644835233688355, 0.4386953115463257, 0, 3, 3, 6, 2, 2, -1., 3, 6, 1, 1, 2., 4, 7, 1, 1, 2., 3.9754100725986063e-004, 0.4526061117649078, 0.5895630121231079, 0, 3, 15, 6, 2, 2, -1., 16, 6, 1, 1, 2., 15, 7, 1, 1, 2., -1.3814480043947697e-003, 0.6070582270622253, 0.4942413866519928, 0, 3, 3, 6, 2, 2, -1., 3, 6, 1, 1, 2., 4, 7, 1, 1, 2., -5.8122188784182072e-004, 0.5998213291168213, 0.4508252143859863, 0, 2, 14, 4, 1, 12, -1., 14, 10, 1, 6, 2., -2.3905329871922731e-003, 0.4205588996410370, 0.5223848223686218, 0, 3, 2, 5, 16, 10, -1., 2, 5, 8, 5, 2., 10, 10, 8, 5, 2., 0.0272689294070005, 0.5206447243690491, 0.3563301861286163, 0, 2, 9, 17, 3, 2, -1., 10, 17, 1, 2, 3., -3.7658358924090862e-003, 0.3144704103469849, 0.5218814015388489, 0, 2, 1, 4, 2, 2, -1., 1, 5, 2, 1, 2., -1.4903489500284195e-003, 0.3380196094512940, 0.5124437212944031, 0, 2, 5, 0, 15, 5, -1., 10, 0, 5, 5, 3., -0.0174282304942608, 0.5829960703849793, 0.4919725954532623, 0, 2, 0, 0, 15, 5, -1., 5, 0, 5, 5, 3., -0.0152780301868916, 0.6163144707679749, 0.4617887139320374, 0, 2, 11, 2, 2, 17, -1., 11, 2, 1, 17, 2., 0.0319956094026566, 0.5166357159614563, 0.1712764054536820, 0, 2, 7, 2, 2, 17, -1., 8, 2, 1, 17, 2., -3.8256710395216942e-003, 0.3408012092113495, 0.5131387710571289, 0, 2, 15, 11, 2, 9, -1., 15, 11, 1, 9, 2., -8.5186436772346497e-003, 0.6105518937110901, 0.4997941851615906, 0, 2, 3, 11, 2, 9, -1., 4, 11, 1, 9, 2., 9.0641621500253677e-004, 0.4327270984649658, 0.5582311153411865, 0, 2, 5, 16, 14, 4, -1., 5, 16, 7, 4, 2., 0.0103448498994112, 0.4855653047561646, 0.5452420115470886, 79.2490768432617190, 160, 0, 2, 1, 4, 18, 1, -1., 7, 4, 6, 1, 3., 7.8981826081871986e-003, 0.3332524895668030, 0.5946462154388428, 0, 3, 13, 7, 6, 4, -1., 16, 7, 3, 2, 2., 13, 9, 3, 2, 2., 1.6170160379260778e-003, 0.3490641117095947, 0.5577868819236755, 0, 2, 9, 8, 2, 12, -1., 9, 12, 2, 4, 3., -5.5449741194024682e-004, 0.5542566180229187, 0.3291530013084412, 0, 2, 12, 1, 6, 6, -1., 12, 3, 6, 2, 3., 1.5428980113938451e-003, 0.3612579107284546, 0.5545979142189026, 0, 3, 5, 2, 6, 6, -1., 5, 2, 3, 3, 2., 8, 5, 3, 3, 2., -1.0329450014978647e-003, 0.3530139029026032, 0.5576140284538269, 0, 3, 9, 16, 6, 4, -1., 12, 16, 3, 2, 2., 9, 18, 3, 2, 2., 7.7698158565908670e-004, 0.3916778862476349, 0.5645321011543274, 0, 2, 1, 2, 18, 3, -1., 7, 2, 6, 3, 3., 0.1432030051946640, 0.4667482078075409, 0.7023633122444153, 0, 2, 7, 4, 9, 10, -1., 7, 9, 9, 5, 2., -7.3866490274667740e-003, 0.3073684871196747, 0.5289257764816284, 0, 2, 5, 9, 4, 4, -1., 7, 9, 2, 4, 2., -6.2936742324382067e-004, 0.5622118115425110, 0.4037049114704132, 0, 2, 11, 10, 3, 6, -1., 11, 13, 3, 3, 2., 7.8893528552725911e-004, 0.5267661213874817, 0.3557874858379364, 0, 2, 7, 11, 5, 3, -1., 7, 12, 5, 1, 3., -0.0122280502691865, 0.6668320894241333, 0.4625549912452698, 0, 3, 7, 11, 6, 6, -1., 10, 11, 3, 3, 2., 7, 14, 3, 3, 2., 3.5420239437371492e-003, 0.5521438121795654, 0.3869673013687134, 0, 2, 0, 0, 10, 9, -1., 0, 3, 10, 3, 3., -1.0585320414975286e-003, 0.3628678023815155, 0.5320926904678345, 0, 2, 13, 14, 1, 6, -1., 13, 16, 1, 2, 3., 1.4935660146875307e-005, 0.4632444977760315, 0.5363323092460632, 0, 2, 0, 2, 3, 6, -1., 0, 4, 3, 2, 3., 5.2537708543241024e-003, 0.5132231712341309, 0.3265708982944489, 0, 2, 8, 14, 4, 3, -1., 8, 15, 4, 1, 3., -8.2338023930788040e-003, 0.6693689823150635, 0.4774140119552612, 0, 2, 6, 14, 1, 6, -1., 6, 16, 1, 2, 3., 2.1866810129722580e-005, 0.4053862094879150, 0.5457931160926819, 0, 2, 9, 15, 2, 3, -1., 9, 16, 2, 1, 3., -3.8150229956954718e-003, 0.6454995870590210, 0.4793178141117096, 0, 2, 6, 4, 3, 3, -1., 7, 4, 1, 3, 3., 1.1105879675596952e-003, 0.5270407199859619, 0.3529678881168366, 0, 2, 9, 0, 11, 3, -1., 9, 1, 11, 1, 3., -5.7707689702510834e-003, 0.3803547024726868, 0.5352957844734192, 0, 2, 0, 6, 20, 3, -1., 0, 7, 20, 1, 3., -3.0158339068293571e-003, 0.5339403152465820, 0.3887133002281189, 0, 2, 10, 1, 1, 2, -1., 10, 2, 1, 1, 2., -8.5453689098358154e-004, 0.3564616143703461, 0.5273603796958923, 0, 2, 9, 6, 2, 6, -1., 10, 6, 1, 6, 2., 0.0110505102202296, 0.4671907126903534, 0.6849737763404846, 0, 2, 5, 8, 12, 1, -1., 9, 8, 4, 1, 3., 0.0426058396697044, 0.5151473283767700, 0.0702200904488564, 0, 2, 3, 8, 12, 1, -1., 7, 8, 4, 1, 3., -3.0781750101596117e-003, 0.3041661083698273, 0.5152602195739746, 0, 2, 9, 7, 3, 5, -1., 10, 7, 1, 5, 3., -5.4815728217363358e-003, 0.6430295705795288, 0.4897229969501495, 0, 2, 3, 9, 6, 2, -1., 6, 9, 3, 2, 2., 3.1881860923022032e-003, 0.5307493209838867, 0.3826209902763367, 0, 2, 12, 9, 3, 3, -1., 12, 10, 3, 1, 3., 3.5947180003859103e-004, 0.4650047123432159, 0.5421904921531677, 0, 2, 7, 0, 6, 1, -1., 9, 0, 2, 1, 3., -4.0705031715333462e-003, 0.2849679887294769, 0.5079116225242615, 0, 2, 12, 9, 3, 3, -1., 12, 10, 3, 1, 3., -0.0145941702648997, 0.2971645891666412, 0.5128461718559265, 0, 2, 7, 10, 2, 1, -1., 8, 10, 1, 1, 2., -1.1947689927183092e-004, 0.5631098151206970, 0.4343082010746002, 0, 2, 6, 4, 9, 13, -1., 9, 4, 3, 13, 3., -6.9344649091362953e-004, 0.4403578042984009, 0.5359959006309509, 0, 2, 6, 8, 4, 2, -1., 6, 9, 4, 1, 2., 1.4834799912932795e-005, 0.3421008884906769, 0.5164697766304016, 0, 2, 16, 2, 4, 6, -1., 16, 2, 2, 6, 2., 9.0296985581517220e-003, 0.4639343023300171, 0.6114075183868408, 0, 2, 0, 17, 6, 3, -1., 0, 18, 6, 1, 3., -8.0640818923711777e-003, 0.2820158898830414, 0.5075494050979614, 0, 2, 10, 10, 3, 10, -1., 10, 15, 3, 5, 2., 0.0260621197521687, 0.5208905935287476, 0.2688778042793274, 0, 2, 8, 7, 3, 5, -1., 9, 7, 1, 5, 3., 0.0173146594315767, 0.4663713872432709, 0.6738539934158325, 0, 2, 10, 4, 4, 3, -1., 10, 4, 2, 3, 2., 0.0226666405797005, 0.5209349989891052, 0.2212723940610886, 0, 2, 8, 4, 3, 8, -1., 9, 4, 1, 8, 3., -2.1965929772704840e-003, 0.6063101291656494, 0.4538190066814423, 0, 2, 6, 6, 9, 13, -1., 9, 6, 3, 13, 3., -9.5282476395368576e-003, 0.4635204970836639, 0.5247430801391602, 0, 3, 6, 0, 8, 12, -1., 6, 0, 4, 6, 2., 10, 6, 4, 6, 2., 8.0943619832396507e-003, 0.5289440155029297, 0.3913882076740265, 0, 2, 14, 2, 6, 8, -1., 16, 2, 2, 8, 3., -0.0728773325681686, 0.7752001881599426, 0.4990234971046448, 0, 2, 6, 0, 3, 6, -1., 7, 0, 1, 6, 3., -6.9009521976113319e-003, 0.2428039014339447, 0.5048090219497681, 0, 2, 14, 2, 6, 8, -1., 16, 2, 2, 8, 3., -0.0113082397729158, 0.5734364986419678, 0.4842376112937927, 0, 2, 0, 5, 6, 6, -1., 0, 8, 6, 3, 2., 0.0596132017672062, 0.5029836297035217, 0.2524977028369904, 0, 3, 9, 12, 6, 2, -1., 12, 12, 3, 1, 2., 9, 13, 3, 1, 2., -2.8624620754271746e-003, 0.6073045134544373, 0.4898459911346436, 0, 2, 8, 17, 3, 2, -1., 9, 17, 1, 2, 3., 4.4781449250876904e-003, 0.5015289187431335, 0.2220316976308823, 0, 3, 11, 6, 2, 2, -1., 12, 6, 1, 1, 2., 11, 7, 1, 1, 2., -1.7513240454718471e-003, 0.6614428758621216, 0.4933868944644928, 0, 2, 1, 9, 18, 2, -1., 7, 9, 6, 2, 3., 0.0401634201407433, 0.5180878043174744, 0.3741044998168945, 0, 3, 11, 6, 2, 2, -1., 12, 6, 1, 1, 2., 11, 7, 1, 1, 2., 3.4768949262797832e-004, 0.4720416963100433, 0.5818032026290894, 0, 2, 3, 4, 12, 8, -1., 7, 4, 4, 8, 3., 2.6551650371402502e-003, 0.3805010914802551, 0.5221335887908936, 0, 2, 13, 11, 5, 3, -1., 13, 12, 5, 1, 3., -8.7706279009580612e-003, 0.2944166064262390, 0.5231295228004456, 0, 2, 9, 10, 2, 3, -1., 9, 11, 2, 1, 3., -5.5122091434895992e-003, 0.7346177101135254, 0.4722816944122315, 0, 2, 14, 7, 2, 3, -1., 14, 7, 1, 3, 2., 6.8672042107209563e-004, 0.5452876091003418, 0.4242413043975830, 0, 2, 5, 4, 1, 3, -1., 5, 5, 1, 1, 3., 5.6019669864326715e-004, 0.4398862123489380, 0.5601285099983215, 0, 2, 13, 4, 2, 3, -1., 13, 5, 2, 1, 3., 2.4143769405782223e-003, 0.4741686880588532, 0.6136621832847595, 0, 2, 5, 4, 2, 3, -1., 5, 5, 2, 1, 3., -1.5680900542065501e-003, 0.6044552922248840, 0.4516409933567047, 0, 2, 9, 8, 2, 3, -1., 9, 9, 2, 1, 3., -3.6827491130679846e-003, 0.2452459037303925, 0.5294982194900513, 0, 2, 8, 9, 2, 2, -1., 8, 10, 2, 1, 2., -2.9409190756268799e-004, 0.3732838034629822, 0.5251451134681702, 0, 2, 15, 14, 1, 4, -1., 15, 16, 1, 2, 2., 4.2847759323194623e-004, 0.5498809814453125, 0.4065535068511963, 0, 2, 3, 12, 2, 2, -1., 3, 13, 2, 1, 2., -4.8817070201039314e-003, 0.2139908969402313, 0.4999957084655762, 0, 3, 12, 15, 2, 2, -1., 13, 15, 1, 1, 2., 12, 16, 1, 1, 2., 2.7272020815871656e-004, 0.4650287032127380, 0.5813428759574890, 0, 2, 9, 13, 2, 2, -1., 9, 14, 2, 1, 2., 2.0947199664078653e-004, 0.4387486875057221, 0.5572792887687683, 0, 2, 4, 11, 14, 9, -1., 4, 14, 14, 3, 3., 0.0485011897981167, 0.5244972705841065, 0.3212889134883881, 0, 2, 7, 13, 4, 3, -1., 7, 14, 4, 1, 3., -4.5166411437094212e-003, 0.6056813001632690, 0.4545882046222687, 0, 2, 15, 14, 1, 4, -1., 15, 16, 1, 2, 2., -0.0122916800901294, 0.2040929049253464, 0.5152214169502258, 0, 2, 4, 14, 1, 4, -1., 4, 16, 1, 2, 2., 4.8549679922871292e-004, 0.5237604975700378, 0.3739503026008606, 0, 2, 14, 0, 6, 13, -1., 16, 0, 2, 13, 3., 0.0305560491979122, 0.4960533976554871, 0.5938246250152588, 0, 3, 4, 1, 2, 12, -1., 4, 1, 1, 6, 2., 5, 7, 1, 6, 2., -1.5105320198927075e-004, 0.5351303815841675, 0.4145204126834869, 0, 3, 11, 14, 6, 6, -1., 14, 14, 3, 3, 2., 11, 17, 3, 3, 2., 2.4937440175563097e-003, 0.4693366885185242, 0.5514941215515137, 0, 3, 3, 14, 6, 6, -1., 3, 14, 3, 3, 2., 6, 17, 3, 3, 2., -0.0123821301385760, 0.6791396737098694, 0.4681667983531952, 0, 2, 14, 17, 3, 2, -1., 14, 18, 3, 1, 2., -5.1333461888134480e-003, 0.3608739078044891, 0.5229160189628601, 0, 2, 3, 17, 3, 2, -1., 3, 18, 3, 1, 2., 5.1919277757406235e-004, 0.5300073027610779, 0.3633613884449005, 0, 2, 14, 0, 6, 13, -1., 16, 0, 2, 13, 3., 0.1506042033433914, 0.5157316923141480, 0.2211782038211823, 0, 2, 0, 0, 6, 13, -1., 2, 0, 2, 13, 3., 7.7144149690866470e-003, 0.4410496950149536, 0.5776609182357788, 0, 2, 10, 10, 7, 6, -1., 10, 12, 7, 2, 3., 9.4443522393703461e-003, 0.5401855111122131, 0.3756650090217590, 0, 3, 6, 15, 2, 2, -1., 6, 15, 1, 1, 2., 7, 16, 1, 1, 2., 2.5006249779835343e-004, 0.4368270933628082, 0.5607374906539917, 0, 3, 6, 11, 8, 6, -1., 10, 11, 4, 3, 2., 6, 14, 4, 3, 2., -3.3077150583267212e-003, 0.4244799017906189, 0.5518230795860291, 0, 3, 7, 6, 2, 2, -1., 7, 6, 1, 1, 2., 8, 7, 1, 1, 2., 7.4048910755664110e-004, 0.4496962130069733, 0.5900576710700989, 0, 3, 2, 2, 16, 6, -1., 10, 2, 8, 3, 2., 2, 5, 8, 3, 2., 0.0440920516848564, 0.5293493270874023, 0.3156355023384094, 0, 2, 5, 4, 3, 3, -1., 5, 5, 3, 1, 3., 3.3639909233897924e-003, 0.4483296871185303, 0.5848662257194519, 0, 2, 11, 7, 3, 10, -1., 11, 12, 3, 5, 2., -3.9760079234838486e-003, 0.4559507071971893, 0.5483639240264893, 0, 2, 6, 7, 3, 10, -1., 6, 12, 3, 5, 2., 2.7716930489987135e-003, 0.5341786146163940, 0.3792484104633331, 0, 2, 10, 7, 3, 2, -1., 11, 7, 1, 2, 3., -2.4123019829858094e-004, 0.5667188763618469, 0.4576973021030426, 0, 2, 8, 12, 4, 2, -1., 8, 13, 4, 1, 2., 4.9425667384639382e-004, 0.4421244859695435, 0.5628787279129028, 0, 2, 10, 1, 1, 3, -1., 10, 2, 1, 1, 3., -3.8876468897797167e-004, 0.4288370907306671, 0.5391063094139099, 0, 3, 1, 2, 4, 18, -1., 1, 2, 2, 9, 2., 3, 11, 2, 9, 2., -0.0500488989055157, 0.6899513006210327, 0.4703742861747742, 0, 2, 12, 4, 4, 12, -1., 12, 10, 4, 6, 2., -0.0366354808211327, 0.2217779010534287, 0.5191826224327087, 0, 2, 0, 0, 1, 6, -1., 0, 2, 1, 2, 3., 2.4273579474538565e-003, 0.5136224031448364, 0.3497397899627686, 0, 2, 9, 11, 2, 3, -1., 9, 12, 2, 1, 3., 1.9558030180633068e-003, 0.4826192855834961, 0.6408380866050720, 0, 2, 8, 7, 4, 3, -1., 8, 8, 4, 1, 3., -1.7494610510766506e-003, 0.3922835886478424, 0.5272685289382935, 0, 2, 10, 7, 3, 2, -1., 11, 7, 1, 2, 3., 0.0139550799503922, 0.5078201889991760, 0.8416504859924316, 0, 2, 7, 7, 3, 2, -1., 8, 7, 1, 2, 3., -2.1896739781368524e-004, 0.5520489811897278, 0.4314234852790833, 0, 2, 9, 4, 6, 1, -1., 11, 4, 2, 1, 3., -1.5131309628486633e-003, 0.3934605121612549, 0.5382571220397949, 0, 2, 8, 7, 2, 3, -1., 9, 7, 1, 3, 2., -4.3622800149023533e-003, 0.7370628714561462, 0.4736475944519043, 0, 3, 12, 7, 8, 6, -1., 16, 7, 4, 3, 2., 12, 10, 4, 3, 2., 0.0651605874300003, 0.5159279704093933, 0.3281595110893250, 0, 3, 0, 7, 8, 6, -1., 0, 7, 4, 3, 2., 4, 10, 4, 3, 2., -2.3567399475723505e-003, 0.3672826886177063, 0.5172886252403259, 0, 3, 18, 2, 2, 10, -1., 19, 2, 1, 5, 2., 18, 7, 1, 5, 2., 0.0151466596871614, 0.5031493902206421, 0.6687604188919067, 0, 2, 0, 2, 6, 4, -1., 3, 2, 3, 4, 2., -0.0228509604930878, 0.6767519712448120, 0.4709596931934357, 0, 2, 9, 4, 6, 1, -1., 11, 4, 2, 1, 3., 4.8867650330066681e-003, 0.5257998108863831, 0.4059878885746002, 0, 3, 7, 15, 2, 2, -1., 7, 15, 1, 1, 2., 8, 16, 1, 1, 2., 1.7619599821045995e-003, 0.4696272909641266, 0.6688278913497925, 0, 2, 11, 13, 1, 6, -1., 11, 16, 1, 3, 2., -1.2942519970238209e-003, 0.4320712983608246, 0.5344281792640686, 0, 2, 8, 13, 1, 6, -1., 8, 16, 1, 3, 2., 0.0109299495816231, 0.4997706115245819, 0.1637486070394516, 0, 2, 14, 3, 2, 1, -1., 14, 3, 1, 1, 2., 2.9958489903947338e-005, 0.4282417893409729, 0.5633224248886108, 0, 2, 8, 15, 2, 3, -1., 8, 16, 2, 1, 3., -6.5884361974895000e-003, 0.6772121191024780, 0.4700526893138886, 0, 2, 12, 15, 7, 4, -1., 12, 17, 7, 2, 2., 3.2527779694646597e-003, 0.5313397049903870, 0.4536148905754089, 0, 2, 4, 14, 12, 3, -1., 4, 15, 12, 1, 3., -4.0435739792883396e-003, 0.5660061836242676, 0.4413388967514038, 0, 2, 10, 3, 3, 2, -1., 11, 3, 1, 2, 3., -1.2523540062829852e-003, 0.3731913864612579, 0.5356451869010925, 0, 2, 4, 12, 2, 2, -1., 4, 13, 2, 1, 2., 1.9246719602961093e-004, 0.5189986228942871, 0.3738811016082764, 0, 2, 10, 11, 4, 6, -1., 10, 14, 4, 3, 2., -0.0385896712541580, 0.2956373989582062, 0.5188810825347900, 0, 3, 7, 13, 2, 2, -1., 7, 13, 1, 1, 2., 8, 14, 1, 1, 2., 1.5489870565943420e-004, 0.4347135126590729, 0.5509533286094666, 0, 3, 4, 11, 14, 4, -1., 11, 11, 7, 2, 2., 4, 13, 7, 2, 2., -0.0337638482451439, 0.3230330049991608, 0.5195475816726685, 0, 2, 1, 18, 18, 2, -1., 7, 18, 6, 2, 3., -8.2657067105174065e-003, 0.5975489020347595, 0.4552114009857178, 0, 3, 11, 18, 2, 2, -1., 12, 18, 1, 1, 2., 11, 19, 1, 1, 2., 1.4481440302915871e-005, 0.4745678007602692, 0.5497426986694336, 0, 3, 7, 18, 2, 2, -1., 7, 18, 1, 1, 2., 8, 19, 1, 1, 2., 1.4951299817766994e-005, 0.4324473142623901, 0.5480644106864929, 0, 2, 12, 18, 8, 2, -1., 12, 19, 8, 1, 2., -0.0187417995184660, 0.1580052971839905, 0.5178533196449280, 0, 2, 7, 14, 6, 2, -1., 7, 15, 6, 1, 2., 1.7572239739820361e-003, 0.4517636895179749, 0.5773764252662659, 0, 3, 8, 12, 4, 8, -1., 10, 12, 2, 4, 2., 8, 16, 2, 4, 2., -3.1391119118779898e-003, 0.4149647951126099, 0.5460842251777649, 0, 2, 4, 9, 3, 3, -1., 4, 10, 3, 1, 3., 6.6656779381446540e-005, 0.4039090871810913, 0.5293084979057312, 0, 2, 7, 10, 6, 2, -1., 9, 10, 2, 2, 3., 6.7743421532213688e-003, 0.4767651855945587, 0.6121956110000610, 0, 2, 5, 0, 4, 15, -1., 7, 0, 2, 15, 2., -7.3868161998689175e-003, 0.3586258888244629, 0.5187280774116516, 0, 2, 8, 6, 12, 14, -1., 12, 6, 4, 14, 3., 0.0140409301966429, 0.4712139964103699, 0.5576155781745911, 0, 2, 5, 16, 3, 3, -1., 5, 17, 3, 1, 3., -5.5258329957723618e-003, 0.2661027014255524, 0.5039281249046326, 0, 2, 8, 1, 12, 19, -1., 12, 1, 4, 19, 3., 0.3868423998355866, 0.5144339799880981, 0.2525899112224579, 0, 2, 3, 0, 3, 2, -1., 3, 1, 3, 1, 2., 1.1459240340627730e-004, 0.4284994900226593, 0.5423371195793152, 0, 2, 10, 12, 4, 5, -1., 10, 12, 2, 5, 2., -0.0184675697237253, 0.3885835111141205, 0.5213062167167664, 0, 2, 6, 12, 4, 5, -1., 8, 12, 2, 5, 2., -4.5907011372037232e-004, 0.5412563085556030, 0.4235909879207611, 0, 3, 11, 11, 2, 2, -1., 12, 11, 1, 1, 2., 11, 12, 1, 1, 2., 1.2527540093287826e-003, 0.4899305105209351, 0.6624091267585754, 0, 2, 0, 2, 3, 6, -1., 0, 4, 3, 2, 3., 1.4910609461367130e-003, 0.5286778211593628, 0.4040051996707916, 0, 3, 11, 11, 2, 2, -1., 12, 11, 1, 1, 2., 11, 12, 1, 1, 2., -7.5435562757775187e-004, 0.6032990217208862, 0.4795120060443878, 0, 2, 7, 6, 4, 10, -1., 7, 11, 4, 5, 2., -6.9478838704526424e-003, 0.4084401130676270, 0.5373504161834717, 0, 3, 11, 11, 2, 2, -1., 12, 11, 1, 1, 2., 11, 12, 1, 1, 2., 2.8092920547351241e-004, 0.4846062958240509, 0.5759382247924805, 0, 2, 2, 13, 5, 2, -1., 2, 14, 5, 1, 2., 9.6073717577382922e-004, 0.5164741277694702, 0.3554979860782623, 0, 3, 11, 11, 2, 2, -1., 12, 11, 1, 1, 2., 11, 12, 1, 1, 2., -2.6883929967880249e-004, 0.5677582025527954, 0.4731765985488892, 0, 3, 7, 11, 2, 2, -1., 7, 11, 1, 1, 2., 8, 12, 1, 1, 2., 2.1599370520561934e-003, 0.4731487035751343, 0.7070567011833191, 0, 2, 14, 13, 3, 3, -1., 14, 14, 3, 1, 3., 5.6235301308333874e-003, 0.5240243077278137, 0.2781791985034943, 0, 2, 3, 13, 3, 3, -1., 3, 14, 3, 1, 3., -5.0243991427123547e-003, 0.2837013900279999, 0.5062304139137268, 0, 2, 9, 14, 2, 3, -1., 9, 15, 2, 1, 3., -9.7611639648675919e-003, 0.7400717735290527, 0.4934569001197815, 0, 2, 8, 7, 3, 3, -1., 8, 8, 3, 1, 3., 4.1515100747346878e-003, 0.5119131207466126, 0.3407008051872253, 0, 2, 13, 5, 3, 3, -1., 13, 6, 3, 1, 3., 6.2465080991387367e-003, 0.4923788011074066, 0.6579058766365051, 0, 2, 0, 9, 5, 3, -1., 0, 10, 5, 1, 3., -7.0597478188574314e-003, 0.2434711009263992, 0.5032842159271240, 0, 2, 13, 5, 3, 3, -1., 13, 6, 3, 1, 3., -2.0587709732353687e-003, 0.5900310873985291, 0.4695087075233460, 0, 3, 9, 12, 2, 8, -1., 9, 12, 1, 4, 2., 10, 16, 1, 4, 2., -2.4146060459315777e-003, 0.3647317886352539, 0.5189201831817627, 0, 3, 11, 7, 2, 2, -1., 12, 7, 1, 1, 2., 11, 8, 1, 1, 2., -1.4817609917372465e-003, 0.6034948229789734, 0.4940128028392792, 0, 2, 0, 16, 6, 4, -1., 3, 16, 3, 4, 2., -6.3016400672495365e-003, 0.5818989872932434, 0.4560427963733673, 0, 2, 10, 6, 2, 3, -1., 10, 7, 2, 1, 3., 3.4763428848236799e-003, 0.5217475891113281, 0.3483993113040924, 0, 2, 9, 5, 2, 6, -1., 9, 7, 2, 2, 3., -0.0222508702427149, 0.2360700070858002, 0.5032082796096802, 0, 2, 12, 15, 8, 4, -1., 12, 15, 4, 4, 2., -0.0306125506758690, 0.6499186754226685, 0.4914919137954712, 0, 2, 0, 14, 8, 6, -1., 4, 14, 4, 6, 2., 0.0130574796348810, 0.4413323104381561, 0.5683764219284058, 0, 2, 9, 0, 3, 2, -1., 10, 0, 1, 2, 3., -6.0095742810517550e-004, 0.4359731078147888, 0.5333483219146729, 0, 2, 4, 15, 4, 2, -1., 6, 15, 2, 2, 2., -4.1514250915497541e-004, 0.5504062771797180, 0.4326060116291046, 0, 2, 12, 7, 3, 13, -1., 13, 7, 1, 13, 3., -0.0137762902304530, 0.4064112901687622, 0.5201548933982849, 0, 2, 5, 7, 3, 13, -1., 6, 7, 1, 13, 3., -0.0322965085506439, 0.0473519712686539, 0.4977194964885712, 0, 2, 9, 6, 3, 9, -1., 9, 9, 3, 3, 3., 0.0535569787025452, 0.4881733059883118, 0.6666939258575440, 0, 2, 4, 4, 7, 12, -1., 4, 10, 7, 6, 2., 8.1889545544981956e-003, 0.5400037169456482, 0.4240820109844208, 0, 3, 12, 12, 2, 2, -1., 13, 12, 1, 1, 2., 12, 13, 1, 1, 2., 2.1055320394225419e-004, 0.4802047908306122, 0.5563852787017822, 0, 3, 6, 12, 2, 2, -1., 6, 12, 1, 1, 2., 7, 13, 1, 1, 2., -2.4382730480283499e-003, 0.7387793064117432, 0.4773685038089752, 0, 3, 8, 9, 4, 2, -1., 10, 9, 2, 1, 2., 8, 10, 2, 1, 2., 3.2835570164024830e-003, 0.5288546085357666, 0.3171291947364807, 0, 3, 3, 6, 2, 2, -1., 3, 6, 1, 1, 2., 4, 7, 1, 1, 2., 2.3729570675641298e-003, 0.4750812947750092, 0.7060170769691467, 0, 2, 16, 6, 3, 2, -1., 16, 7, 3, 1, 2., -1.4541699783876538e-003, 0.3811730146408081, 0.5330739021301270, 87.6960296630859380, 177, 0, 2, 0, 7, 19, 4, -1., 0, 9, 19, 2, 2., 0.0557552389800549, 0.4019156992435455, 0.6806036829948425, 0, 2, 10, 2, 10, 1, -1., 10, 2, 5, 1, 2., 2.4730248842388391e-003, 0.3351148962974548, 0.5965719819068909, 0, 2, 9, 4, 2, 12, -1., 9, 10, 2, 6, 2., -3.5031698644161224e-004, 0.5557708144187927, 0.3482286930084229, 0, 2, 12, 18, 4, 1, -1., 12, 18, 2, 1, 2., 5.4167630150914192e-004, 0.4260858893394470, 0.5693380832672119, 0, 3, 1, 7, 6, 4, -1., 1, 7, 3, 2, 2., 4, 9, 3, 2, 2., 7.7193678589537740e-004, 0.3494240045547485, 0.5433688759803772, 0, 2, 12, 0, 6, 13, -1., 14, 0, 2, 13, 3., -1.5999219613149762e-003, 0.4028499126434326, 0.5484359264373779, 0, 2, 2, 0, 6, 13, -1., 4, 0, 2, 13, 3., -1.1832080053864047e-004, 0.3806901872158051, 0.5425465106964111, 0, 2, 10, 5, 8, 8, -1., 10, 9, 8, 4, 2., 3.2909031142480671e-004, 0.2620100080966950, 0.5429521799087524, 0, 2, 8, 3, 2, 5, -1., 9, 3, 1, 5, 2., 2.9518108931370080e-004, 0.3799768984317780, 0.5399264097213745, 0, 2, 8, 4, 9, 1, -1., 11, 4, 3, 1, 3., 9.0466710389591753e-005, 0.4433645009994507, 0.5440226197242737, 0, 2, 3, 4, 9, 1, -1., 6, 4, 3, 1, 3., 1.5007190086180344e-005, 0.3719654977321625, 0.5409119725227356, 0, 2, 1, 0, 18, 10, -1., 7, 0, 6, 10, 3., 0.1393561065196991, 0.5525395870208740, 0.4479042887687683, 0, 2, 7, 17, 5, 3, -1., 7, 18, 5, 1, 3., 1.6461990308016539e-003, 0.4264501035213471, 0.5772169828414917, 0, 2, 7, 11, 6, 1, -1., 9, 11, 2, 1, 3., 4.9984431825578213e-004, 0.4359526038169861, 0.5685871243476868, 0, 2, 2, 2, 3, 2, -1., 2, 3, 3, 1, 2., -1.0971280280500650e-003, 0.3390136957168579, 0.5205408930778503, 0, 2, 8, 12, 4, 2, -1., 8, 13, 4, 1, 2., 6.6919892560690641e-004, 0.4557456076145172, 0.5980659723281860, 0, 2, 6, 10, 3, 6, -1., 6, 13, 3, 3, 2., 8.6471042595803738e-004, 0.5134841203689575, 0.2944033145904541, 0, 2, 11, 4, 2, 4, -1., 11, 4, 1, 4, 2., -2.7182599296793342e-004, 0.3906578123569489, 0.5377181172370911, 0, 2, 7, 4, 2, 4, -1., 8, 4, 1, 4, 2., 3.0249499104684219e-005, 0.3679609894752502, 0.5225688815116882, 0, 2, 9, 6, 2, 4, -1., 9, 6, 1, 4, 2., -8.5225896909832954e-003, 0.7293102145195007, 0.4892365038394928, 0, 2, 6, 13, 8, 3, -1., 6, 14, 8, 1, 3., 1.6705560265108943e-003, 0.4345324933528900, 0.5696138143539429, 0, 2, 9, 15, 3, 4, -1., 10, 15, 1, 4, 3., -7.1433838456869125e-003, 0.2591280043125153, 0.5225623846054077, 0, 2, 9, 2, 2, 17, -1., 10, 2, 1, 17, 2., -0.0163193698972464, 0.6922279000282288, 0.4651575982570648, 0, 2, 7, 0, 6, 1, -1., 9, 0, 2, 1, 3., 4.8034260980784893e-003, 0.5352262854576111, 0.3286302983760834, 0, 2, 8, 15, 3, 4, -1., 9, 15, 1, 4, 3., -7.5421929359436035e-003, 0.2040544003248215, 0.5034546256065369, 0, 2, 7, 13, 7, 3, -1., 7, 14, 7, 1, 3., -0.0143631100654602, 0.6804888844490051, 0.4889059066772461, 0, 2, 8, 16, 3, 3, -1., 9, 16, 1, 3, 3., 8.9063588529825211e-004, 0.5310695767402649, 0.3895480930805206, 0, 2, 6, 2, 8, 10, -1., 6, 7, 8, 5, 2., -4.4060191139578819e-003, 0.5741562843322754, 0.4372426867485046, 0, 2, 2, 5, 8, 8, -1., 2, 9, 8, 4, 2., -1.8862540309783071e-004, 0.2831785976886749, 0.5098205208778381, 0, 2, 14, 16, 2, 2, -1., 14, 17, 2, 1, 2., -3.7979281041771173e-003, 0.3372507989406586, 0.5246580243110657, 0, 2, 4, 16, 2, 2, -1., 4, 17, 2, 1, 2., 1.4627049677073956e-004, 0.5306674242019653, 0.3911710083484650, 0, 2, 10, 11, 4, 6, -1., 10, 14, 4, 3, 2., -4.9164638767251745e-005, 0.5462496280670166, 0.3942720890045166, 0, 2, 6, 11, 4, 6, -1., 6, 14, 4, 3, 2., -0.0335825011134148, 0.2157824039459229, 0.5048211812973023, 0, 2, 10, 14, 1, 3, -1., 10, 15, 1, 1, 3., -3.5339309833943844e-003, 0.6465312242507935, 0.4872696995735169, 0, 2, 8, 14, 4, 3, -1., 8, 15, 4, 1, 3., 5.0144111737608910e-003, 0.4617668092250824, 0.6248074769973755, 0, 3, 10, 0, 4, 6, -1., 12, 0, 2, 3, 2., 10, 3, 2, 3, 2., 0.0188173707574606, 0.5220689177513123, 0.2000052034854889, 0, 2, 0, 3, 20, 2, -1., 0, 4, 20, 1, 2., -1.3434339780360460e-003, 0.4014537930488586, 0.5301619768142700, 0, 3, 12, 0, 8, 2, -1., 16, 0, 4, 1, 2., 12, 1, 4, 1, 2., 1.7557960236445069e-003, 0.4794039130210877, 0.5653169751167297, 0, 2, 2, 12, 10, 8, -1., 2, 16, 10, 4, 2., -0.0956374630331993, 0.2034195065498352, 0.5006706714630127, 0, 3, 17, 7, 2, 10, -1., 18, 7, 1, 5, 2., 17, 12, 1, 5, 2., -0.0222412291914225, 0.7672473192214966, 0.5046340227127075, 0, 3, 1, 7, 2, 10, -1., 1, 7, 1, 5, 2., 2, 12, 1, 5, 2., -0.0155758196488023, 0.7490342259407044, 0.4755851030349731, 0, 2, 15, 10, 3, 6, -1., 15, 12, 3, 2, 3., 5.3599118255078793e-003, 0.5365303754806519, 0.4004670977592468, 0, 2, 4, 4, 6, 2, -1., 6, 4, 2, 2, 3., -0.0217634998261929, 0.0740154981613159, 0.4964174926280975, 0, 2, 0, 5, 20, 6, -1., 0, 7, 20, 2, 3., -0.1656159013509750, 0.2859103083610535, 0.5218086242675781, 0, 3, 0, 0, 8, 2, -1., 0, 0, 4, 1, 2., 4, 1, 4, 1, 2., 1.6461320046801120e-004, 0.4191615879535675, 0.5380793213844299, 0, 2, 1, 0, 18, 4, -1., 7, 0, 6, 4, 3., -8.9077502489089966e-003, 0.6273192763328552, 0.4877404868602753, 0, 2, 1, 13, 6, 2, -1., 1, 14, 6, 1, 2., 8.6346449097618461e-004, 0.5159940719604492, 0.3671025931835175, 0, 2, 10, 8, 3, 4, -1., 11, 8, 1, 4, 3., -1.3751760125160217e-003, 0.5884376764297485, 0.4579083919525147, 0, 2, 6, 1, 6, 1, -1., 8, 1, 2, 1, 3., -1.4081239933148026e-003, 0.3560509979724884, 0.5139945149421692, 0, 2, 8, 14, 4, 3, -1., 8, 15, 4, 1, 3., -3.9342888630926609e-003, 0.5994288921356201, 0.4664272069931030, 0, 2, 1, 6, 18, 2, -1., 10, 6, 9, 2, 2., -0.0319669283926487, 0.3345462083816528, 0.5144183039665222, 0, 2, 15, 11, 1, 2, -1., 15, 12, 1, 1, 2., -1.5089280168467667e-005, 0.5582656264305115, 0.4414057135581970, 0, 2, 6, 5, 1, 2, -1., 6, 6, 1, 1, 2., 5.1994470413774252e-004, 0.4623680114746094, 0.6168993711471558, 0, 2, 13, 4, 1, 3, -1., 13, 5, 1, 1, 3., -3.4220460802316666e-003, 0.6557074785232544, 0.4974805116653442, 0, 2, 2, 15, 1, 2, -1., 2, 16, 1, 1, 2., 1.7723299970384687e-004, 0.5269501805305481, 0.3901908099651337, 0, 2, 12, 4, 4, 3, -1., 12, 5, 4, 1, 3., 1.5716759953647852e-003, 0.4633373022079468, 0.5790457725524902, 0, 2, 0, 0, 7, 3, -1., 0, 1, 7, 1, 3., -8.9041329920291901e-003, 0.2689608037471771, 0.5053591132164002, 0, 2, 9, 12, 6, 2, -1., 9, 12, 3, 2, 2., 4.0677518700249493e-004, 0.5456603169441223, 0.4329898953437805, 0, 2, 5, 4, 2, 3, -1., 5, 5, 2, 1, 3., 6.7604780197143555e-003, 0.4648993909358978, 0.6689761877059937, 0, 2, 18, 4, 2, 3, -1., 18, 5, 2, 1, 3., 2.9100088868290186e-003, 0.5309703946113586, 0.3377839922904968, 0, 2, 3, 0, 8, 6, -1., 3, 2, 8, 2, 3., 1.3885459629818797e-003, 0.4074738919734955, 0.5349133014678955, 0, 3, 0, 2, 20, 6, -1., 10, 2, 10, 3, 2., 0, 5, 10, 3, 2., -0.0767642632126808, 0.1992176026105881, 0.5228242278099060, 0, 2, 4, 7, 2, 4, -1., 5, 7, 1, 4, 2., -2.2688310127705336e-004, 0.5438501834869385, 0.4253072142601013, 0, 2, 3, 10, 15, 2, -1., 8, 10, 5, 2, 3., -6.3094152137637138e-003, 0.4259178936481476, 0.5378909707069397, 0, 2, 3, 0, 12, 11, -1., 9, 0, 6, 11, 2., -0.1100727990269661, 0.6904156804084778, 0.4721749126911163, 0, 2, 13, 0, 2, 6, -1., 13, 0, 1, 6, 2., 2.8619659133255482e-004, 0.4524914920330048, 0.5548306107521057, 0, 2, 0, 19, 2, 1, -1., 1, 19, 1, 1, 2., 2.9425329557852820e-005, 0.5370373725891113, 0.4236463904380798, 0, 3, 16, 10, 4, 10, -1., 18, 10, 2, 5, 2., 16, 15, 2, 5, 2., -0.0248865708708763, 0.6423557996749878, 0.4969303905963898, 0, 2, 4, 8, 10, 3, -1., 4, 9, 10, 1, 3., 0.0331488512456417, 0.4988475143909454, 0.1613811999559403, 0, 2, 14, 12, 3, 3, -1., 14, 13, 3, 1, 3., 7.8491691965609789e-004, 0.5416026115417481, 0.4223009049892426, 0, 3, 0, 10, 4, 10, -1., 0, 10, 2, 5, 2., 2, 15, 2, 5, 2., 4.7087189741432667e-003, 0.4576328992843628, 0.6027557849884033, 0, 2, 18, 3, 2, 6, -1., 18, 5, 2, 2, 3., 2.4144479539245367e-003, 0.5308973193168640, 0.4422498941421509, 0, 2, 6, 6, 1, 3, -1., 6, 7, 1, 1, 3., 1.9523180089890957e-003, 0.4705634117126465, 0.6663324832916260, 0, 2, 7, 7, 7, 2, -1., 7, 8, 7, 1, 2., 1.3031980488449335e-003, 0.4406126141548157, 0.5526962280273438, 0, 2, 0, 3, 2, 6, -1., 0, 5, 2, 2, 3., 4.4735497795045376e-003, 0.5129023790359497, 0.3301498889923096, 0, 2, 11, 1, 3, 1, -1., 12, 1, 1, 1, 3., -2.6652868837118149e-003, 0.3135471045970917, 0.5175036191940308, 0, 2, 5, 0, 2, 6, -1., 6, 0, 1, 6, 2., 1.3666770246345550e-004, 0.4119370877742767, 0.5306876897811890, 0, 2, 1, 1, 18, 14, -1., 7, 1, 6, 14, 3., -0.0171264503151178, 0.6177806258201599, 0.4836578965187073, 0, 2, 4, 6, 8, 3, -1., 8, 6, 4, 3, 2., -2.6601430727168918e-004, 0.3654330968856812, 0.5169736742973328, 0, 2, 9, 12, 6, 2, -1., 9, 12, 3, 2, 2., -0.0229323804378510, 0.3490915000438690, 0.5163992047309876, 0, 2, 5, 12, 6, 2, -1., 8, 12, 3, 2, 2., 2.3316550068557262e-003, 0.5166299939155579, 0.3709389865398407, 0, 2, 10, 7, 3, 5, -1., 11, 7, 1, 5, 3., 0.0169256608933210, 0.5014736056327820, 0.8053988218307495, 0, 2, 7, 7, 3, 5, -1., 8, 7, 1, 5, 3., -8.9858826249837875e-003, 0.6470788717269898, 0.4657020866870880, 0, 2, 13, 0, 3, 10, -1., 14, 0, 1, 10, 3., -0.0118746999651194, 0.3246378898620606, 0.5258755087852478, 0, 2, 4, 11, 3, 2, -1., 4, 12, 3, 1, 2., 1.9350569345988333e-004, 0.5191941857337952, 0.3839643895626068, 0, 2, 17, 3, 3, 6, -1., 18, 3, 1, 6, 3., 5.8713490143418312e-003, 0.4918133914470673, 0.6187043190002441, 0, 2, 1, 8, 18, 10, -1., 1, 13, 18, 5, 2., -0.2483879029750824, 0.1836802959442139, 0.4988150000572205, 0, 2, 13, 0, 3, 10, -1., 14, 0, 1, 10, 3., 0.0122560001909733, 0.5227053761482239, 0.3632029891014099, 0, 2, 9, 14, 2, 3, -1., 9, 15, 2, 1, 3., 8.3990179700776935e-004, 0.4490250051021576, 0.5774148106575012, 0, 2, 16, 3, 3, 7, -1., 17, 3, 1, 7, 3., 2.5407369248569012e-003, 0.4804787039756775, 0.5858299136161804, 0, 2, 4, 0, 3, 10, -1., 5, 0, 1, 10, 3., -0.0148224299773574, 0.2521049976348877, 0.5023537278175354, 0, 2, 16, 3, 3, 7, -1., 17, 3, 1, 7, 3., -5.7973959483206272e-003, 0.5996695756912231, 0.4853715002536774, 0, 2, 0, 9, 1, 2, -1., 0, 10, 1, 1, 2., 7.2662148158997297e-004, 0.5153716802597046, 0.3671779930591583, 0, 2, 18, 1, 2, 10, -1., 18, 1, 1, 10, 2., -0.0172325801104307, 0.6621719002723694, 0.4994656145572662, 0, 2, 0, 1, 2, 10, -1., 1, 1, 1, 10, 2., 7.8624086454510689e-003, 0.4633395075798035, 0.6256101727485657, 0, 2, 10, 16, 3, 4, -1., 11, 16, 1, 4, 3., -4.7343620099127293e-003, 0.3615573048591614, 0.5281885266304016, 0, 2, 2, 8, 3, 3, -1., 3, 8, 1, 3, 3., 8.3048478700220585e-004, 0.4442889094352722, 0.5550957918167114, 0, 3, 11, 0, 2, 6, -1., 12, 0, 1, 3, 2., 11, 3, 1, 3, 2., 7.6602199114859104e-003, 0.5162935256958008, 0.2613354921340942, 0, 3, 7, 0, 2, 6, -1., 7, 0, 1, 3, 2., 8, 3, 1, 3, 2., -4.1048377752304077e-003, 0.2789632081985474, 0.5019031763076782, 0, 2, 16, 3, 3, 7, -1., 17, 3, 1, 7, 3., 4.8512578941881657e-003, 0.4968984127044678, 0.5661668181419373, 0, 2, 1, 3, 3, 7, -1., 2, 3, 1, 7, 3., 9.9896453320980072e-004, 0.4445607960224152, 0.5551813244819641, 0, 2, 14, 1, 6, 16, -1., 16, 1, 2, 16, 3., -0.2702363133430481, 0.0293882098048925, 0.5151314139366150, 0, 2, 0, 1, 6, 16, -1., 2, 1, 2, 16, 3., -0.0130906803533435, 0.5699399709701538, 0.4447459876537323, 0, 3, 2, 0, 16, 8, -1., 10, 0, 8, 4, 2., 2, 4, 8, 4, 2., -9.4342790544033051e-003, 0.4305466115474701, 0.5487895011901856, 0, 2, 6, 8, 5, 3, -1., 6, 9, 5, 1, 3., -1.5482039889320731e-003, 0.3680317103862763, 0.5128080844879150, 0, 2, 9, 7, 3, 3, -1., 10, 7, 1, 3, 3., 5.3746132180094719e-003, 0.4838916957378388, 0.6101555824279785, 0, 2, 8, 8, 4, 3, -1., 8, 9, 4, 1, 3., 1.5786769799888134e-003, 0.5325223207473755, 0.4118548035621643, 0, 2, 9, 6, 2, 4, -1., 9, 6, 1, 4, 2., 3.6856050137430429e-003, 0.4810948073863983, 0.6252303123474121, 0, 2, 0, 7, 15, 1, -1., 5, 7, 5, 1, 3., 9.3887019902467728e-003, 0.5200229883193970, 0.3629410862922669, 0, 2, 8, 2, 7, 9, -1., 8, 5, 7, 3, 3., 0.0127926301211119, 0.4961709976196289, 0.6738016009330750, 0, 3, 1, 7, 16, 4, -1., 1, 7, 8, 2, 2., 9, 9, 8, 2, 2., -3.3661040943115950e-003, 0.4060279130935669, 0.5283598899841309, 0, 2, 6, 12, 8, 2, -1., 6, 13, 8, 1, 2., 3.9771420415490866e-004, 0.4674113988876343, 0.5900775194168091, 0, 2, 8, 11, 3, 3, -1., 8, 12, 3, 1, 3., 1.4868030557408929e-003, 0.4519116878509522, 0.6082053780555725, 0, 3, 4, 5, 14, 10, -1., 11, 5, 7, 5, 2., 4, 10, 7, 5, 2., -0.0886867493391037, 0.2807899117469788, 0.5180991888046265, 0, 2, 4, 12, 3, 2, -1., 4, 13, 3, 1, 2., -7.4296112870797515e-005, 0.5295584201812744, 0.4087625145912170, 0, 2, 9, 11, 6, 1, -1., 11, 11, 2, 1, 3., -1.4932939848222304e-005, 0.5461400151252747, 0.4538542926311493, 0, 2, 4, 9, 7, 6, -1., 4, 11, 7, 2, 3., 5.9162238612771034e-003, 0.5329161286354065, 0.4192134141921997, 0, 2, 7, 10, 6, 3, -1., 7, 11, 6, 1, 3., 1.1141640134155750e-003, 0.4512017965316773, 0.5706217288970947, 0, 2, 9, 11, 2, 2, -1., 9, 12, 2, 1, 2., 8.9249362645205110e-005, 0.4577805995941162, 0.5897638201713562, 0, 2, 0, 5, 20, 6, -1., 0, 7, 20, 2, 3., 2.5319510605186224e-003, 0.5299603939056397, 0.3357639014720917, 0, 2, 6, 4, 6, 1, -1., 8, 4, 2, 1, 3., 0.0124262003228068, 0.4959059059619904, 0.1346601992845535, 0, 2, 9, 11, 6, 1, -1., 11, 11, 2, 1, 3., 0.0283357501029968, 0.5117079019546509, 6.1043637106195092e-004, 0, 2, 5, 11, 6, 1, -1., 7, 11, 2, 1, 3., 6.6165882162749767e-003, 0.4736349880695343, 0.7011628150939941, 0, 2, 10, 16, 3, 4, -1., 11, 16, 1, 4, 3., 8.0468766391277313e-003, 0.5216417908668518, 0.3282819986343384, 0, 2, 8, 7, 3, 3, -1., 9, 7, 1, 3, 3., -1.1193980462849140e-003, 0.5809860825538635, 0.4563739001750946, 0, 2, 2, 12, 16, 8, -1., 2, 16, 16, 4, 2., 0.0132775902748108, 0.5398362278938294, 0.4103901088237763, 0, 2, 0, 15, 15, 2, -1., 0, 16, 15, 1, 2., 4.8794739996083081e-004, 0.4249286055564880, 0.5410590767860413, 0, 2, 15, 4, 5, 6, -1., 15, 6, 5, 2, 3., 0.0112431701272726, 0.5269963741302490, 0.3438215851783752, 0, 2, 9, 5, 2, 4, -1., 10, 5, 1, 4, 2., -8.9896668214350939e-004, 0.5633075833320618, 0.4456613063812256, 0, 2, 8, 10, 9, 6, -1., 8, 12, 9, 2, 3., 6.6677159629762173e-003, 0.5312889218330383, 0.4362679123878479, 0, 2, 2, 19, 15, 1, -1., 7, 19, 5, 1, 3., 0.0289472993463278, 0.4701794981956482, 0.6575797796249390, 0, 2, 10, 16, 3, 4, -1., 11, 16, 1, 4, 3., -0.0234000496566296, 0., 0.5137398838996887, 0, 2, 0, 15, 20, 4, -1., 0, 17, 20, 2, 2., -0.0891170501708984, 0.0237452797591686, 0.4942430853843689, 0, 2, 10, 16, 3, 4, -1., 11, 16, 1, 4, 3., -0.0140546001493931, 0.3127323091030121, 0.5117511153221130, 0, 2, 7, 16, 3, 4, -1., 8, 16, 1, 4, 3., 8.1239398568868637e-003, 0.5009049177169800, 0.2520025968551636, 0, 2, 9, 16, 3, 3, -1., 9, 17, 3, 1, 3., -4.9964650534093380e-003, 0.6387143731117249, 0.4927811920642853, 0, 2, 8, 11, 4, 6, -1., 8, 14, 4, 3, 2., 3.1253970228135586e-003, 0.5136849880218506, 0.3680452108383179, 0, 2, 9, 6, 2, 12, -1., 9, 10, 2, 4, 3., 6.7669642157852650e-003, 0.5509843826293945, 0.4363631904125214, 0, 2, 8, 17, 4, 3, -1., 8, 18, 4, 1, 3., -2.3711440153419971e-003, 0.6162335276603699, 0.4586946964263916, 0, 3, 9, 18, 8, 2, -1., 13, 18, 4, 1, 2., 9, 19, 4, 1, 2., -5.3522791713476181e-003, 0.6185457706451416, 0.4920490980148315, 0, 2, 1, 18, 8, 2, -1., 1, 19, 8, 1, 2., -0.0159688591957092, 0.1382617950439453, 0.4983252882957459, 0, 2, 13, 5, 6, 15, -1., 15, 5, 2, 15, 3., 4.7676060348749161e-003, 0.4688057899475098, 0.5490046143531799, 0, 2, 9, 8, 2, 2, -1., 9, 9, 2, 1, 2., -2.4714691098779440e-003, 0.2368514984846115, 0.5003952980041504, 0, 2, 9, 5, 2, 3, -1., 9, 5, 1, 3, 2., -7.1033788844943047e-004, 0.5856394171714783, 0.4721533060073853, 0, 2, 1, 5, 6, 15, -1., 3, 5, 2, 15, 3., -0.1411755979061127, 0.0869000628590584, 0.4961591064929962, 0, 3, 4, 1, 14, 8, -1., 11, 1, 7, 4, 2., 4, 5, 7, 4, 2., 0.1065180972218514, 0.5138837099075317, 0.1741005033254623, 0, 3, 2, 4, 4, 16, -1., 2, 4, 2, 8, 2., 4, 12, 2, 8, 2., -0.0527447499334812, 0.7353636026382446, 0.4772881865501404, 0, 2, 12, 4, 3, 12, -1., 12, 10, 3, 6, 2., -4.7431760467588902e-003, 0.3884406089782715, 0.5292701721191406, 0, 3, 4, 5, 10, 12, -1., 4, 5, 5, 6, 2., 9, 11, 5, 6, 2., 9.9676765967160463e-004, 0.5223492980003357, 0.4003424048423767, 0, 2, 9, 14, 2, 3, -1., 9, 15, 2, 1, 3., 8.0284131690859795e-003, 0.4959106147289276, 0.7212964296340942, 0, 2, 5, 4, 2, 3, -1., 5, 5, 2, 1, 3., 8.6025858763605356e-004, 0.4444884061813355, 0.5538476109504700, 0, 3, 12, 2, 4, 10, -1., 14, 2, 2, 5, 2., 12, 7, 2, 5, 2., 9.3191501218825579e-004, 0.5398371219635010, 0.4163244068622589, 0, 2, 6, 4, 7, 3, -1., 6, 5, 7, 1, 3., -2.5082060601562262e-003, 0.5854265093803406, 0.4562500119209290, 0, 3, 2, 0, 18, 2, -1., 11, 0, 9, 1, 2., 2, 1, 9, 1, 2., -2.1378761157393456e-003, 0.4608069062232971, 0.5280259251594544, 0, 3, 0, 0, 18, 2, -1., 0, 0, 9, 1, 2., 9, 1, 9, 1, 2., -2.1546049974858761e-003, 0.3791126906871796, 0.5255997180938721, 0, 3, 13, 13, 4, 6, -1., 15, 13, 2, 3, 2., 13, 16, 2, 3, 2., -7.6214009895920753e-003, 0.5998609066009522, 0.4952073991298676, 0, 3, 3, 13, 4, 6, -1., 3, 13, 2, 3, 2., 5, 16, 2, 3, 2., 2.2055360022932291e-003, 0.4484206140041351, 0.5588530898094177, 0, 2, 10, 12, 2, 6, -1., 10, 15, 2, 3, 2., 1.2586950324475765e-003, 0.5450747013092041, 0.4423840939998627, 0, 3, 5, 9, 10, 10, -1., 5, 9, 5, 5, 2., 10, 14, 5, 5, 2., -5.0926720723509789e-003, 0.4118275046348572, 0.5263035893440247, 0, 3, 11, 4, 4, 2, -1., 13, 4, 2, 1, 2., 11, 5, 2, 1, 2., -2.5095739401876926e-003, 0.5787907838821411, 0.4998494982719421, 0, 2, 7, 12, 6, 8, -1., 10, 12, 3, 8, 2., -0.0773275569081306, 0.8397865891456604, 0.4811120033264160, 0, 3, 12, 2, 4, 10, -1., 14, 2, 2, 5, 2., 12, 7, 2, 5, 2., -0.0414858199656010, 0.2408611029386520, 0.5176993012428284, 0, 2, 8, 11, 2, 1, -1., 9, 11, 1, 1, 2., 1.0355669655837119e-004, 0.4355360865592957, 0.5417054295539856, 0, 2, 10, 5, 1, 12, -1., 10, 9, 1, 4, 3., 1.3255809899419546e-003, 0.5453971028327942, 0.4894095063209534, 0, 2, 0, 11, 6, 9, -1., 3, 11, 3, 9, 2., -8.0598732456564903e-003, 0.5771024227142334, 0.4577918946743012, 0, 3, 12, 2, 4, 10, -1., 14, 2, 2, 5, 2., 12, 7, 2, 5, 2., 0.0190586205571890, 0.5169867873191834, 0.3400475084781647, 0, 3, 4, 2, 4, 10, -1., 4, 2, 2, 5, 2., 6, 7, 2, 5, 2., -0.0350578911602497, 0.2203243970870972, 0.5000503063201904, 0, 3, 11, 4, 4, 2, -1., 13, 4, 2, 1, 2., 11, 5, 2, 1, 2., 5.7296059094369411e-003, 0.5043408274650574, 0.6597570776939392, 0, 2, 0, 14, 6, 3, -1., 0, 15, 6, 1, 3., -0.0116483299061656, 0.2186284959316254, 0.4996652901172638, 0, 3, 11, 4, 4, 2, -1., 13, 4, 2, 1, 2., 11, 5, 2, 1, 2., 1.4544479781761765e-003, 0.5007681846618652, 0.5503727793693543, 0, 2, 6, 1, 3, 2, -1., 7, 1, 1, 2, 3., -2.5030909455381334e-004, 0.4129841029644013, 0.5241670012474060, 0, 3, 11, 4, 4, 2, -1., 13, 4, 2, 1, 2., 11, 5, 2, 1, 2., -8.2907272735610604e-004, 0.5412868261337280, 0.4974496066570282, 0, 3, 5, 4, 4, 2, -1., 5, 4, 2, 1, 2., 7, 5, 2, 1, 2., 1.0862209601327777e-003, 0.4605529904365540, 0.5879228711128235, 0, 3, 13, 0, 2, 12, -1., 14, 0, 1, 6, 2., 13, 6, 1, 6, 2., 2.0000500080641359e-004, 0.5278854966163635, 0.4705209136009216, 0, 2, 6, 0, 3, 10, -1., 7, 0, 1, 10, 3., 2.9212920926511288e-003, 0.5129609704017639, 0.3755536973476410, 0, 2, 3, 0, 17, 8, -1., 3, 4, 17, 4, 2., 0.0253874007612467, 0.4822691977024078, 0.5790768265724182, 0, 2, 0, 4, 20, 4, -1., 0, 6, 20, 2, 2., -3.1968469265848398e-003, 0.5248395204544067, 0.3962840139865875, 90.2533493041992190, 182, 0, 2, 0, 3, 8, 2, -1., 4, 3, 4, 2, 2., 5.8031738735735416e-003, 0.3498983979225159, 0.5961983203887940, 0, 2, 8, 11, 4, 3, -1., 8, 12, 4, 1, 3., -9.0003069490194321e-003, 0.6816636919975281, 0.4478552043437958, 0, 3, 5, 7, 6, 4, -1., 5, 7, 3, 2, 2., 8, 9, 3, 2, 2., -1.1549659539014101e-003, 0.5585706233978272, 0.3578251004219055, 0, 2, 8, 3, 4, 9, -1., 8, 6, 4, 3, 3., -1.1069850297644734e-003, 0.5365036129951477, 0.3050428032875061, 0, 2, 8, 15, 1, 4, -1., 8, 17, 1, 2, 2., 1.0308309720130637e-004, 0.3639095127582550, 0.5344635844230652, 0, 2, 4, 5, 12, 7, -1., 8, 5, 4, 7, 3., -5.0984839908778667e-003, 0.2859157025814056, 0.5504264831542969, 0, 3, 4, 2, 4, 10, -1., 4, 2, 2, 5, 2., 6, 7, 2, 5, 2., 8.2572200335562229e-004, 0.5236523747444153, 0.3476041853427887, 0, 2, 3, 0, 17, 2, -1., 3, 1, 17, 1, 2., 9.9783325567841530e-003, 0.4750322103500366, 0.6219646930694580, 0, 2, 2, 2, 16, 15, -1., 2, 7, 16, 5, 3., -0.0374025292694569, 0.3343375921249390, 0.5278062820434570, 0, 2, 15, 2, 5, 2, -1., 15, 3, 5, 1, 2., 4.8548257909715176e-003, 0.5192180871963501, 0.3700444102287293, 0, 2, 9, 3, 2, 2, -1., 10, 3, 1, 2, 2., -1.8664470408111811e-003, 0.2929843962192535, 0.5091944932937622, 0, 2, 4, 5, 16, 15, -1., 4, 10, 16, 5, 3., 0.0168888904154301, 0.3686845898628235, 0.5431225895881653, 0, 2, 7, 13, 5, 6, -1., 7, 16, 5, 3, 2., -5.8372621424496174e-003, 0.3632183969020844, 0.5221335887908936, 0, 2, 10, 7, 3, 2, -1., 11, 7, 1, 2, 3., -1.4713739510625601e-003, 0.5870683789253235, 0.4700650870800018, 0, 2, 8, 3, 3, 1, -1., 9, 3, 1, 1, 3., -1.1522950371727347e-003, 0.3195894956588745, 0.5140954256057739, 0, 2, 9, 16, 3, 3, -1., 9, 17, 3, 1, 3., -4.2560300789773464e-003, 0.6301859021186829, 0.4814921021461487, 0, 2, 0, 2, 5, 2, -1., 0, 3, 5, 1, 2., -6.7378291860222816e-003, 0.1977048069238663, 0.5025808215141296, 0, 2, 12, 5, 4, 3, -1., 12, 6, 4, 1, 3., 0.0113826701417565, 0.4954132139682770, 0.6867045760154724, 0, 2, 1, 7, 12, 1, -1., 5, 7, 4, 1, 3., 5.1794708706438541e-003, 0.5164427757263184, 0.3350647985935211, 0, 2, 7, 5, 6, 14, -1., 7, 12, 6, 7, 2., -0.1174378991127014, 0.2315246015787125, 0.5234413743019104, 0, 3, 0, 0, 8, 10, -1., 0, 0, 4, 5, 2., 4, 5, 4, 5, 2., 0.0287034492939711, 0.4664297103881836, 0.6722521185874939, 0, 2, 9, 1, 3, 2, -1., 10, 1, 1, 2, 3., 4.8231030814349651e-003, 0.5220875144004822, 0.2723532915115356, 0, 2, 8, 1, 3, 2, -1., 9, 1, 1, 2, 3., 2.6798530016094446e-003, 0.5079277157783508, 0.2906948924064636, 0, 2, 12, 4, 3, 3, -1., 12, 5, 3, 1, 3., 8.0504082143306732e-003, 0.4885950982570648, 0.6395021080970764, 0, 2, 7, 4, 6, 16, -1., 7, 12, 6, 8, 2., 4.8054959625005722e-003, 0.5197256803512573, 0.3656663894653320, 0, 2, 12, 4, 3, 3, -1., 12, 5, 3, 1, 3., -2.2420159075409174e-003, 0.6153467893600464, 0.4763701856136322, 0, 2, 2, 3, 2, 6, -1., 2, 5, 2, 2, 3., -0.0137577103450894, 0.2637344896793366, 0.5030903220176697, 0, 2, 14, 2, 6, 9, -1., 14, 5, 6, 3, 3., -0.1033829972147942, 0.2287521958351135, 0.5182461142539978, 0, 2, 5, 4, 3, 3, -1., 5, 5, 3, 1, 3., -9.4432085752487183e-003, 0.6953303813934326, 0.4694949090480804, 0, 2, 9, 17, 3, 2, -1., 10, 17, 1, 2, 3., 8.0271181650459766e-004, 0.5450655221939087, 0.4268783926963806, 0, 2, 5, 5, 2, 3, -1., 5, 6, 2, 1, 3., -4.1945669800043106e-003, 0.6091387867927551, 0.4571642875671387, 0, 2, 13, 11, 3, 6, -1., 13, 13, 3, 2, 3., 0.0109422104433179, 0.5241063237190247, 0.3284547030925751, 0, 2, 3, 14, 2, 6, -1., 3, 17, 2, 3, 2., -5.7841069065034389e-004, 0.5387929081916809, 0.4179368913173676, 0, 2, 14, 3, 6, 2, -1., 14, 4, 6, 1, 2., -2.0888620056211948e-003, 0.4292691051959992, 0.5301715731620789, 0, 2, 0, 8, 16, 2, -1., 0, 9, 16, 1, 2., 3.2383969519287348e-003, 0.3792347908020020, 0.5220744013786316, 0, 2, 14, 3, 6, 2, -1., 14, 4, 6, 1, 2., 4.9075027927756310e-003, 0.5237283110618591, 0.4126757979393005, 0, 2, 0, 0, 5, 6, -1., 0, 2, 5, 2, 3., -0.0322779417037964, 0.1947655975818634, 0.4994502067565918, 0, 2, 12, 5, 4, 3, -1., 12, 6, 4, 1, 3., -8.9711230248212814e-003, 0.6011285185813904, 0.4929032027721405, 0, 2, 4, 11, 3, 6, -1., 4, 13, 3, 2, 3., 0.0153210898861289, 0.5009753704071045, 0.2039822041988373, 0, 2, 12, 5, 4, 3, -1., 12, 6, 4, 1, 3., 2.0855569746345282e-003, 0.4862189888954163, 0.5721694827079773, 0, 2, 9, 5, 1, 3, -1., 9, 6, 1, 1, 3., 5.0615021027624607e-003, 0.5000218749046326, 0.1801805943250656, 0, 2, 12, 5, 4, 3, -1., 12, 6, 4, 1, 3., -3.7174751050770283e-003, 0.5530117154121399, 0.4897592961788178, 0, 2, 6, 6, 8, 12, -1., 6, 12, 8, 6, 2., -0.0121705001220107, 0.4178605973720551, 0.5383723974227905, 0, 2, 12, 5, 4, 3, -1., 12, 6, 4, 1, 3., 4.6248398721218109e-003, 0.4997169971466065, 0.5761327147483826, 0, 2, 5, 12, 9, 2, -1., 8, 12, 3, 2, 3., -2.1040429419372231e-004, 0.5331807136535645, 0.4097681045532227, 0, 2, 12, 5, 4, 3, -1., 12, 6, 4, 1, 3., -0.0146417804062366, 0.5755925178527832, 0.5051776170730591, 0, 2, 4, 5, 4, 3, -1., 4, 6, 4, 1, 3., 3.3199489116668701e-003, 0.4576976895332336, 0.6031805872917175, 0, 2, 6, 6, 9, 2, -1., 9, 6, 3, 2, 3., 3.7236879579722881e-003, 0.4380396902561188, 0.5415883064270020, 0, 2, 4, 11, 1, 3, -1., 4, 12, 1, 1, 3., 8.2951161311939359e-004, 0.5163031816482544, 0.3702219128608704, 0, 2, 14, 12, 6, 6, -1., 14, 12, 3, 6, 2., -0.0114084901288152, 0.6072946786880493, 0.4862565100193024, 0, 2, 7, 0, 3, 7, -1., 8, 0, 1, 7, 3., -4.5320121571421623e-003, 0.3292475938796997, 0.5088962912559509, 0, 2, 9, 8, 3, 3, -1., 10, 8, 1, 3, 3., 5.1276017911732197e-003, 0.4829767942428589, 0.6122708916664124, 0, 2, 8, 8, 3, 3, -1., 9, 8, 1, 3, 3., 9.8583158105611801e-003, 0.4660679996013641, 0.6556177139282227, 0, 2, 5, 10, 11, 3, -1., 5, 11, 11, 1, 3., 0.0369859188795090, 0.5204849243164063, 0.1690472066402435, 0, 2, 5, 7, 10, 1, -1., 10, 7, 5, 1, 2., 4.6491161920130253e-003, 0.5167322158813477, 0.3725225031375885, 0, 2, 9, 7, 3, 2, -1., 10, 7, 1, 2, 3., -4.2664702050387859e-003, 0.6406493186950684, 0.4987342953681946, 0, 2, 8, 7, 3, 2, -1., 9, 7, 1, 2, 3., -4.7956590424291790e-004, 0.5897293090820313, 0.4464873969554901, 0, 2, 11, 9, 4, 2, -1., 11, 9, 2, 2, 2., 3.6827160511165857e-003, 0.5441560745239258, 0.3472662866115570, 0, 2, 5, 9, 4, 2, -1., 7, 9, 2, 2, 2., -0.0100598800927401, 0.2143162935972214, 0.5004829764366150, 0, 2, 14, 10, 2, 4, -1., 14, 12, 2, 2, 2., -3.0361840617842972e-004, 0.5386424064636231, 0.4590323865413666, 0, 2, 7, 7, 3, 2, -1., 8, 7, 1, 2, 3., -1.4545479789376259e-003, 0.5751184225082398, 0.4497095048427582, 0, 2, 14, 17, 6, 3, -1., 14, 18, 6, 1, 3., 1.6515209572389722e-003, 0.5421937704086304, 0.4238520860671997, 0, 3, 4, 5, 12, 12, -1., 4, 5, 6, 6, 2., 10, 11, 6, 6, 2., -7.8468639403581619e-003, 0.4077920913696289, 0.5258157253265381, 0, 3, 6, 9, 8, 8, -1., 10, 9, 4, 4, 2., 6, 13, 4, 4, 2., -5.1259850151836872e-003, 0.4229275882244110, 0.5479453206062317, 0, 2, 0, 4, 15, 4, -1., 5, 4, 5, 4, 3., -0.0368909612298012, 0.6596375703811646, 0.4674678146839142, 0, 2, 13, 2, 4, 1, -1., 13, 2, 2, 1, 2., 2.4035639944486320e-004, 0.4251135885715485, 0.5573202967643738, 0, 2, 4, 12, 2, 2, -1., 4, 13, 2, 1, 2., -1.5150169929256663e-005, 0.5259246826171875, 0.4074114859104157, 0, 2, 8, 13, 4, 3, -1., 8, 14, 4, 1, 3., 2.2108471021056175e-003, 0.4671722948551178, 0.5886352062225342, 0, 2, 9, 13, 2, 3, -1., 9, 14, 2, 1, 3., -1.1568620102480054e-003, 0.5711066126823425, 0.4487161934375763, 0, 2, 13, 11, 2, 3, -1., 13, 12, 2, 1, 3., 4.9996292218565941e-003, 0.5264198184013367, 0.2898327112197876, 0, 3, 7, 12, 4, 4, -1., 7, 12, 2, 2, 2., 9, 14, 2, 2, 2., -1.4656189596280456e-003, 0.3891738057136536, 0.5197871923446655, 0, 3, 10, 11, 2, 2, -1., 11, 11, 1, 1, 2., 10, 12, 1, 1, 2., -1.1975039960816503e-003, 0.5795872807502747, 0.4927955865859985, 0, 2, 8, 17, 3, 2, -1., 9, 17, 1, 2, 3., -4.4954330660402775e-003, 0.2377603054046631, 0.5012555122375488, 0, 3, 10, 11, 2, 2, -1., 11, 11, 1, 1, 2., 10, 12, 1, 1, 2., 1.4997160178609192e-004, 0.4876626133918762, 0.5617607831954956, 0, 2, 0, 17, 6, 3, -1., 0, 18, 6, 1, 3., 2.6391509454697371e-003, 0.5168088078498840, 0.3765509128570557, 0, 3, 10, 11, 2, 2, -1., 11, 11, 1, 1, 2., 10, 12, 1, 1, 2., -2.9368131072260439e-004, 0.5446649193763733, 0.4874630868434906, 0, 3, 8, 11, 2, 2, -1., 8, 11, 1, 1, 2., 9, 12, 1, 1, 2., 1.4211760135367513e-003, 0.4687897861003876, 0.6691331863403320, 0, 2, 12, 5, 8, 4, -1., 12, 5, 4, 4, 2., 0.0794276371598244, 0.5193443894386292, 0.2732945978641510, 0, 2, 0, 5, 8, 4, -1., 4, 5, 4, 4, 2., 0.0799375027418137, 0.4971731007099152, 0.1782083958387375, 0, 2, 13, 2, 4, 1, -1., 13, 2, 2, 1, 2., 0.0110892597585917, 0.5165994763374329, 0.3209475874900818, 0, 2, 3, 2, 4, 1, -1., 5, 2, 2, 1, 2., 1.6560709627810866e-004, 0.4058471918106079, 0.5307276248931885, 0, 3, 10, 0, 4, 2, -1., 12, 0, 2, 1, 2., 10, 1, 2, 1, 2., -5.3354292176663876e-003, 0.3445056974887848, 0.5158129930496216, 0, 2, 7, 12, 3, 1, -1., 8, 12, 1, 1, 3., 1.1287260567769408e-003, 0.4594863057136536, 0.6075533032417297, 0, 3, 8, 11, 4, 8, -1., 10, 11, 2, 4, 2., 8, 15, 2, 4, 2., -0.0219692196696997, 0.1680400967597961, 0.5228595733642578, 0, 2, 9, 9, 2, 2, -1., 9, 10, 2, 1, 2., -2.1775320055894554e-004, 0.3861596882343292, 0.5215672850608826, 0, 2, 3, 18, 15, 2, -1., 3, 19, 15, 1, 2., 2.0200149447191507e-004, 0.5517979264259338, 0.4363039135932922, 0, 3, 2, 6, 2, 12, -1., 2, 6, 1, 6, 2., 3, 12, 1, 6, 2., -0.0217331498861313, 0.7999460101127625, 0.4789851009845734, 0, 2, 9, 8, 2, 3, -1., 9, 9, 2, 1, 3., -8.4399932529777288e-004, 0.4085975885391235, 0.5374773144721985, 0, 2, 7, 10, 3, 2, -1., 8, 10, 1, 2, 3., -4.3895249837078154e-004, 0.5470405220985413, 0.4366143047809601, 0, 2, 11, 11, 3, 1, -1., 12, 11, 1, 1, 3., 1.5092400135472417e-003, 0.4988996982574463, 0.5842149257659912, 0, 2, 6, 11, 3, 1, -1., 7, 11, 1, 1, 3., -3.5547839943319559e-003, 0.6753690242767334, 0.4721005856990814, 0, 3, 9, 2, 4, 2, -1., 11, 2, 2, 1, 2., 9, 3, 2, 1, 2., 4.8191400128416717e-004, 0.5415853857994080, 0.4357109069824219, 0, 2, 4, 12, 2, 3, -1., 4, 13, 2, 1, 3., -6.0264398343861103e-003, 0.2258509993553162, 0.4991880953311920, 0, 2, 2, 1, 18, 3, -1., 8, 1, 6, 3, 3., -0.0116681400686502, 0.6256554722785950, 0.4927498996257782, 0, 2, 5, 1, 4, 14, -1., 7, 1, 2, 14, 2., -2.8718370012938976e-003, 0.3947784900665283, 0.5245801806449890, 0, 2, 8, 16, 12, 3, -1., 8, 16, 6, 3, 2., 0.0170511696487665, 0.4752511084079742, 0.5794224143028259, 0, 2, 1, 17, 18, 3, -1., 7, 17, 6, 3, 3., -0.0133520802482963, 0.6041104793548584, 0.4544535875320435, 0, 2, 9, 14, 2, 6, -1., 9, 17, 2, 3, 2., -3.9301801007241011e-004, 0.4258275926113129, 0.5544905066490173, 0, 2, 9, 12, 1, 8, -1., 9, 16, 1, 4, 2., 3.0483349692076445e-003, 0.5233420133590698, 0.3780272901058197, 0, 2, 9, 14, 2, 3, -1., 9, 15, 2, 1, 3., -4.3579288758337498e-003, 0.6371889114379883, 0.4838674068450928, 0, 2, 9, 6, 2, 12, -1., 9, 10, 2, 4, 3., 5.6661018170416355e-003, 0.5374705791473389, 0.4163666069507599, 0, 2, 12, 9, 3, 3, -1., 12, 10, 3, 1, 3., 6.0677339206449687e-005, 0.4638795852661133, 0.5311625003814697, 0, 2, 0, 1, 4, 8, -1., 2, 1, 2, 8, 2., 0.0367381609976292, 0.4688656032085419, 0.6466524004936218, 0, 3, 9, 1, 6, 2, -1., 12, 1, 3, 1, 2., 9, 2, 3, 1, 2., 8.6528137326240540e-003, 0.5204318761825562, 0.2188657969236374, 0, 2, 1, 3, 12, 14, -1., 1, 10, 12, 7, 2., -0.1537135988473892, 0.1630371958017349, 0.4958840012550354, 0, 3, 8, 12, 4, 2, -1., 10, 12, 2, 1, 2., 8, 13, 2, 1, 2., -4.1560421232134104e-004, 0.5774459242820740, 0.4696458876132965, 0, 3, 1, 9, 10, 2, -1., 1, 9, 5, 1, 2., 6, 10, 5, 1, 2., -1.2640169588848948e-003, 0.3977175951004028, 0.5217198133468628, 0, 2, 8, 15, 4, 3, -1., 8, 16, 4, 1, 3., -3.5473341122269630e-003, 0.6046528220176697, 0.4808315038681030, 0, 2, 6, 8, 8, 3, -1., 6, 9, 8, 1, 3., 3.0019069527043030e-005, 0.3996723890304565, 0.5228201150894165, 0, 2, 9, 15, 5, 3, -1., 9, 16, 5, 1, 3., 1.3113019522279501e-003, 0.4712158143520355, 0.5765997767448425, 0, 2, 8, 7, 4, 3, -1., 8, 8, 4, 1, 3., -1.3374709524214268e-003, 0.4109584987163544, 0.5253170132637024, 0, 2, 7, 7, 6, 2, -1., 7, 8, 6, 1, 2., 0.0208767093718052, 0.5202993750572205, 0.1757981926202774, 0, 3, 5, 7, 8, 2, -1., 5, 7, 4, 1, 2., 9, 8, 4, 1, 2., -7.5497948564589024e-003, 0.6566609740257263, 0.4694975018501282, 0, 2, 12, 9, 3, 3, -1., 12, 10, 3, 1, 3., 0.0241885501891375, 0.5128673911094666, 0.3370220959186554, 0, 2, 4, 7, 4, 2, -1., 4, 8, 4, 1, 2., -2.9358828905969858e-003, 0.6580786705017090, 0.4694541096687317, 0, 2, 14, 2, 6, 9, -1., 14, 5, 6, 3, 3., 0.0575579293072224, 0.5146445035934448, 0.2775259912014008, 0, 2, 4, 9, 3, 3, -1., 5, 9, 1, 3, 3., -1.1343370424583554e-003, 0.3836601972579956, 0.5192667245864868, 0, 2, 12, 9, 3, 3, -1., 12, 10, 3, 1, 3., 0.0168169997632504, 0.5085592865943909, 0.6177260875701904, 0, 2, 0, 2, 6, 9, -1., 0, 5, 6, 3, 3., 5.0535178743302822e-003, 0.5138763189315796, 0.3684791922569275, 0, 2, 17, 3, 3, 6, -1., 18, 3, 1, 6, 3., -4.5874710194766521e-003, 0.5989655256271362, 0.4835202097892761, 0, 2, 0, 3, 3, 6, -1., 1, 3, 1, 6, 3., 1.6882460331544280e-003, 0.4509486854076386, 0.5723056793212891, 0, 2, 17, 14, 1, 2, -1., 17, 15, 1, 1, 2., -1.6554000321775675e-003, 0.3496770858764648, 0.5243319272994995, 0, 2, 4, 9, 4, 3, -1., 6, 9, 2, 3, 2., -0.0193738006055355, 0.1120536997914314, 0.4968712925910950, 0, 2, 12, 9, 3, 3, -1., 12, 10, 3, 1, 3., 0.0103744501248002, 0.5148196816444397, 0.4395213127136231, 0, 2, 5, 9, 3, 3, -1., 5, 10, 3, 1, 3., 1.4973050565458834e-004, 0.4084999859333038, 0.5269886851310730, 0, 3, 9, 5, 6, 8, -1., 12, 5, 3, 4, 2., 9, 9, 3, 4, 2., -0.0429819300770760, 0.6394104957580566, 0.5018504261970520, 0, 3, 5, 5, 6, 8, -1., 5, 5, 3, 4, 2., 8, 9, 3, 4, 2., 8.3065936341881752e-003, 0.4707553982734680, 0.6698353290557861, 0, 2, 16, 1, 4, 6, -1., 16, 4, 4, 3, 2., -4.1285790503025055e-003, 0.4541369080543518, 0.5323647260665894, 0, 2, 1, 0, 6, 20, -1., 3, 0, 2, 20, 3., 1.7399420030415058e-003, 0.4333961904048920, 0.5439866185188294, 0, 2, 12, 11, 3, 2, -1., 13, 11, 1, 2, 3., 1.1739750334527344e-004, 0.4579687118530273, 0.5543426275253296, 0, 2, 5, 11, 3, 2, -1., 6, 11, 1, 2, 3., 1.8585780344437808e-004, 0.4324643909931183, 0.5426754951477051, 0, 2, 9, 4, 6, 1, -1., 11, 4, 2, 1, 3., 5.5587692186236382e-003, 0.5257220864295960, 0.3550611138343811, 0, 2, 0, 0, 8, 3, -1., 4, 0, 4, 3, 2., -7.9851560294628143e-003, 0.6043018102645874, 0.4630635976791382, 0, 2, 15, 0, 2, 5, -1., 15, 0, 1, 5, 2., 6.0594122624024749e-004, 0.4598254859447479, 0.5533195137977600, 0, 2, 4, 1, 3, 2, -1., 5, 1, 1, 2, 3., -2.2983040253166109e-004, 0.4130752086639404, 0.5322461128234863, 0, 2, 7, 0, 6, 15, -1., 9, 0, 2, 15, 3., 4.3740210821852088e-004, 0.4043039977550507, 0.5409289002418518, 0, 2, 6, 11, 3, 1, -1., 7, 11, 1, 1, 3., 2.9482020181603730e-004, 0.4494963884353638, 0.5628852248191834, 0, 2, 12, 0, 3, 4, -1., 13, 0, 1, 4, 3., 0.0103126596659422, 0.5177510976791382, 0.2704316973686218, 0, 2, 5, 4, 6, 1, -1., 7, 4, 2, 1, 3., -7.7241109684109688e-003, 0.1988019049167633, 0.4980553984642029, 0, 2, 12, 7, 3, 2, -1., 12, 8, 3, 1, 2., -4.6797208487987518e-003, 0.6644750237464905, 0.5018296241760254, 0, 2, 0, 1, 4, 6, -1., 0, 4, 4, 3, 2., -5.0755459815263748e-003, 0.3898304998874664, 0.5185269117355347, 0, 2, 12, 7, 3, 2, -1., 12, 8, 3, 1, 2., 2.2479740437120199e-003, 0.4801808893680573, 0.5660336017608643, 0, 2, 2, 16, 3, 3, -1., 2, 17, 3, 1, 3., 8.3327008178457618e-004, 0.5210919976234436, 0.3957188129425049, 0, 3, 13, 8, 6, 10, -1., 16, 8, 3, 5, 2., 13, 13, 3, 5, 2., -0.0412793308496475, 0.6154541969299316, 0.5007054209709168, 0, 2, 0, 9, 5, 2, -1., 0, 10, 5, 1, 2., -5.0930189900100231e-004, 0.3975942134857178, 0.5228403806686401, 0, 3, 12, 11, 2, 2, -1., 13, 11, 1, 1, 2., 12, 12, 1, 1, 2., 1.2568780221045017e-003, 0.4979138076305389, 0.5939183235168457, 0, 2, 3, 15, 3, 3, -1., 3, 16, 3, 1, 3., 8.0048497766256332e-003, 0.4984497129917145, 0.1633366048336029, 0, 2, 12, 7, 3, 2, -1., 12, 8, 3, 1, 2., -1.1879300000146031e-003, 0.5904964804649353, 0.4942624866962433, 0, 2, 5, 7, 3, 2, -1., 5, 8, 3, 1, 2., 6.1948952497914433e-004, 0.4199557900428772, 0.5328726172447205, 0, 2, 9, 5, 9, 9, -1., 9, 8, 9, 3, 3., 6.6829859279096127e-003, 0.5418602824211121, 0.4905889034271240, 0, 2, 5, 0, 3, 7, -1., 6, 0, 1, 7, 3., -3.7062340416014194e-003, 0.3725939095020294, 0.5138000249862671, 0, 2, 5, 2, 12, 5, -1., 9, 2, 4, 5, 3., -0.0397394113242626, 0.6478961110115051, 0.5050346851348877, 0, 3, 6, 11, 2, 2, -1., 6, 11, 1, 1, 2., 7, 12, 1, 1, 2., 1.4085009461268783e-003, 0.4682339131832123, 0.6377884149551392, 0, 2, 15, 15, 3, 2, -1., 15, 16, 3, 1, 2., 3.9322688826359808e-004, 0.5458530187606812, 0.4150482118129730, 0, 2, 2, 15, 3, 2, -1., 2, 16, 3, 1, 2., -1.8979819724336267e-003, 0.3690159916877747, 0.5149704217910767, 0, 3, 14, 12, 6, 8, -1., 17, 12, 3, 4, 2., 14, 16, 3, 4, 2., -0.0139704402536154, 0.6050562858581543, 0.4811357855796814, 0, 2, 2, 8, 15, 6, -1., 7, 8, 5, 6, 3., -0.1010081991553307, 0.2017080038785934, 0.4992361962795258, 0, 2, 2, 2, 18, 17, -1., 8, 2, 6, 17, 3., -0.0173469204455614, 0.5713148713111877, 0.4899486005306244, 0, 2, 5, 1, 4, 1, -1., 7, 1, 2, 1, 2., 1.5619759506080300e-004, 0.4215388894081116, 0.5392642021179199, 0, 2, 5, 2, 12, 5, -1., 9, 2, 4, 5, 3., 0.1343892961740494, 0.5136151909828186, 0.3767612874507904, 0, 2, 3, 2, 12, 5, -1., 7, 2, 4, 5, 3., -0.0245822407305241, 0.7027357816696167, 0.4747906923294067, 0, 3, 4, 9, 12, 4, -1., 10, 9, 6, 2, 2., 4, 11, 6, 2, 2., -3.8553720805794001e-003, 0.4317409098148346, 0.5427716970443726, 0, 3, 5, 15, 6, 2, -1., 5, 15, 3, 1, 2., 8, 16, 3, 1, 2., -2.3165249731391668e-003, 0.5942698717117310, 0.4618647992610931, 0, 2, 10, 14, 2, 3, -1., 10, 15, 2, 1, 3., -4.8518120311200619e-003, 0.6191568970680237, 0.4884895086288452, 0, 3, 0, 13, 20, 2, -1., 0, 13, 10, 1, 2., 10, 14, 10, 1, 2., 2.4699938949197531e-003, 0.5256664752960205, 0.4017199873924255, 0, 3, 4, 9, 12, 8, -1., 10, 9, 6, 4, 2., 4, 13, 6, 4, 2., 0.0454969592392445, 0.5237867832183838, 0.2685773968696594, 0, 2, 8, 13, 3, 6, -1., 8, 16, 3, 3, 2., -0.0203195996582508, 0.2130445986986160, 0.4979738891124725, 0, 2, 10, 12, 2, 2, -1., 10, 13, 2, 1, 2., 2.6994998916052282e-004, 0.4814041852951050, 0.5543122291564941, 0, 3, 9, 12, 2, 2, -1., 9, 12, 1, 1, 2., 10, 13, 1, 1, 2., -1.8232699949294329e-003, 0.6482579708099365, 0.4709989130496979, 0, 3, 4, 11, 14, 4, -1., 11, 11, 7, 2, 2., 4, 13, 7, 2, 2., -6.3015790656208992e-003, 0.4581927955150604, 0.5306236147880554, 0, 2, 8, 5, 4, 2, -1., 8, 6, 4, 1, 2., -2.4139499873854220e-004, 0.5232086777687073, 0.4051763117313385, 0, 2, 10, 10, 6, 3, -1., 12, 10, 2, 3, 3., -1.0330369696021080e-003, 0.5556201934814453, 0.4789193868637085, 0, 2, 2, 14, 1, 2, -1., 2, 15, 1, 1, 2., 1.8041160365100950e-004, 0.5229442715644836, 0.4011810123920441, 0, 3, 13, 8, 6, 12, -1., 16, 8, 3, 6, 2., 13, 14, 3, 6, 2., -0.0614078603684902, 0.6298682093620300, 0.5010703206062317, 0, 3, 1, 8, 6, 12, -1., 1, 8, 3, 6, 2., 4, 14, 3, 6, 2., -0.0695439130067825, 0.7228280901908875, 0.4773184061050415, 0, 2, 10, 0, 6, 10, -1., 12, 0, 2, 10, 3., -0.0705426633358002, 0.2269513010978699, 0.5182529091835022, 0, 3, 5, 11, 8, 4, -1., 5, 11, 4, 2, 2., 9, 13, 4, 2, 2., 2.4423799477517605e-003, 0.5237097144126892, 0.4098151028156281, 0, 3, 10, 16, 8, 4, -1., 14, 16, 4, 2, 2., 10, 18, 4, 2, 2., 1.5494349645450711e-003, 0.4773750901222229, 0.5468043088912964, 0, 2, 7, 7, 6, 6, -1., 9, 7, 2, 6, 3., -0.0239142198115587, 0.7146975994110107, 0.4783824980258942, 0, 2, 10, 2, 4, 10, -1., 10, 2, 2, 10, 2., -0.0124536901712418, 0.2635296881198883, 0.5241122841835022, 0, 2, 6, 1, 4, 9, -1., 8, 1, 2, 9, 2., -2.0760179904755205e-004, 0.3623757064342499, 0.5113608837127686, 0, 2, 12, 19, 2, 1, -1., 12, 19, 1, 1, 2., 2.9781080229440704e-005, 0.4705932140350342, 0.5432801842689514, 104.7491989135742200, 211, 0, 2, 1, 2, 4, 9, -1., 3, 2, 2, 9, 2., 0.0117727499455214, 0.3860518932342529, 0.6421167254447937, 0, 2, 7, 5, 6, 4, -1., 9, 5, 2, 4, 3., 0.0270375702530146, 0.4385654926300049, 0.6754038929939270, 0, 2, 9, 4, 2, 4, -1., 9, 6, 2, 2, 2., -3.6419500247575343e-005, 0.5487101078033447, 0.3423315882682800, 0, 2, 14, 5, 2, 8, -1., 14, 9, 2, 4, 2., 1.9995409529656172e-003, 0.3230532109737396, 0.5400317907333374, 0, 2, 7, 6, 5, 12, -1., 7, 12, 5, 6, 2., 4.5278300531208515e-003, 0.5091639757156372, 0.2935043871402741, 0, 2, 14, 6, 2, 6, -1., 14, 9, 2, 3, 2., 4.7890920541249216e-004, 0.4178153872489929, 0.5344064235687256, 0, 2, 4, 6, 2, 6, -1., 4, 9, 2, 3, 2., 1.1720920447260141e-003, 0.2899182140827179, 0.5132070779800415, 0, 3, 8, 15, 10, 4, -1., 13, 15, 5, 2, 2., 8, 17, 5, 2, 2., 9.5305702416226268e-004, 0.4280124902725220, 0.5560845136642456, 0, 2, 6, 18, 2, 2, -1., 7, 18, 1, 2, 2., 1.5099150004971307e-005, 0.4044871926307678, 0.5404760241508484, 0, 2, 11, 3, 6, 2, -1., 11, 4, 6, 1, 2., -6.0817901976406574e-004, 0.4271768927574158, 0.5503466129302979, 0, 2, 2, 0, 16, 6, -1., 2, 2, 16, 2, 3., 3.3224520739167929e-003, 0.3962723910808563, 0.5369734764099121, 0, 2, 11, 3, 6, 2, -1., 11, 4, 6, 1, 2., -1.1037490330636501e-003, 0.4727177917957306, 0.5237749814987183, 0, 2, 4, 11, 10, 3, -1., 4, 12, 10, 1, 3., -1.4350269921123981e-003, 0.5603008270263672, 0.4223509132862091, 0, 2, 11, 3, 6, 2, -1., 11, 4, 6, 1, 2., 2.0767399109899998e-003, 0.5225917100906372, 0.4732725918292999, 0, 2, 3, 3, 6, 2, -1., 3, 4, 6, 1, 2., -1.6412809782195836e-004, 0.3999075889587402, 0.5432739853858948, 0, 2, 16, 0, 4, 7, -1., 16, 0, 2, 7, 2., 8.8302437216043472e-003, 0.4678385853767395, 0.6027327179908752, 0, 2, 0, 14, 9, 6, -1., 0, 16, 9, 2, 3., -0.0105520701035857, 0.3493967056274414, 0.5213974714279175, 0, 2, 9, 16, 3, 3, -1., 9, 17, 3, 1, 3., -2.2731600329279900e-003, 0.6185818910598755, 0.4749062955379486, 0, 2, 4, 6, 6, 2, -1., 6, 6, 2, 2, 3., -8.4786332445219159e-004, 0.5285341143608093, 0.3843482136726379, 0, 2, 15, 11, 1, 3, -1., 15, 12, 1, 1, 3., 1.2081359745934606e-003, 0.5360640883445740, 0.3447335958480835, 0, 2, 5, 5, 2, 3, -1., 5, 6, 2, 1, 3., 2.6512730401009321e-003, 0.4558292031288147, 0.6193962097167969, 0, 2, 10, 9, 2, 2, -1., 10, 10, 2, 1, 2., -1.1012479662895203e-003, 0.3680230081081390, 0.5327628254890442, 0, 2, 3, 1, 4, 3, -1., 5, 1, 2, 3, 2., 4.9561518244445324e-004, 0.3960595130920410, 0.5274940729141235, 0, 2, 16, 0, 4, 7, -1., 16, 0, 2, 7, 2., -0.0439017713069916, 0.7020444869995117, 0.4992839097976685, 0, 2, 0, 0, 20, 1, -1., 10, 0, 10, 1, 2., 0.0346903502941132, 0.5049164295196533, 0.2766602933406830, 0, 2, 15, 11, 1, 3, -1., 15, 12, 1, 1, 3., -2.7442190330475569e-003, 0.2672632932662964, 0.5274971127510071, 0, 2, 0, 4, 3, 4, -1., 1, 4, 1, 4, 3., 3.3316588960587978e-003, 0.4579482972621918, 0.6001101732254028, 0, 2, 16, 3, 3, 6, -1., 16, 5, 3, 2, 3., -0.0200445707887411, 0.3171594142913818, 0.5235717892646790, 0, 2, 1, 3, 3, 6, -1., 1, 5, 3, 2, 3., 1.3492030557245016e-003, 0.5265362858772278, 0.4034324884414673, 0, 3, 6, 2, 12, 6, -1., 12, 2, 6, 3, 2., 6, 5, 6, 3, 2., 2.9702018946409225e-003, 0.5332456827163696, 0.4571984112262726, 0, 2, 8, 10, 4, 3, -1., 8, 11, 4, 1, 3., 6.3039981760084629e-003, 0.4593310952186585, 0.6034635901451111, 0, 3, 4, 2, 14, 6, -1., 11, 2, 7, 3, 2., 4, 5, 7, 3, 2., -0.0129365902394056, 0.4437963962554932, 0.5372971296310425, 0, 2, 9, 11, 2, 3, -1., 9, 12, 2, 1, 3., 4.0148729458451271e-003, 0.4680323898792267, 0.6437833905220032, 0, 2, 15, 13, 2, 3, -1., 15, 14, 2, 1, 3., -2.6401679497212172e-003, 0.3709631860256195, 0.5314332842826843, 0, 2, 8, 12, 4, 3, -1., 8, 13, 4, 1, 3., 0.0139184398576617, 0.4723555147647858, 0.7130808830261231, 0, 2, 15, 11, 1, 3, -1., 15, 12, 1, 1, 3., -4.5087869511917233e-004, 0.4492394030094147, 0.5370404124259949, 0, 2, 7, 13, 5, 2, -1., 7, 14, 5, 1, 2., 2.5384349282830954e-004, 0.4406864047050476, 0.5514402985572815, 0, 2, 7, 12, 6, 3, -1., 7, 13, 6, 1, 3., 2.2710000630468130e-003, 0.4682416915893555, 0.5967984199523926, 0, 2, 5, 11, 4, 4, -1., 5, 13, 4, 2, 2., 2.4120779708027840e-003, 0.5079392194747925, 0.3018598854541779, 0, 2, 11, 4, 3, 3, -1., 12, 4, 1, 3, 3., -3.6025670851813629e-005, 0.5601037144660950, 0.4471096992492676, 0, 2, 6, 4, 3, 3, -1., 7, 4, 1, 3, 3., -7.4905529618263245e-003, 0.2207535058259964, 0.4989944100379944, 0, 2, 16, 5, 3, 6, -1., 17, 5, 1, 6, 3., -0.0175131205469370, 0.6531215906143189, 0.5017648935317993, 0, 2, 3, 6, 12, 7, -1., 7, 6, 4, 7, 3., 0.1428163051605225, 0.4967963099479675, 0.1482062041759491, 0, 2, 16, 5, 3, 6, -1., 17, 5, 1, 6, 3., 5.5345268920063972e-003, 0.4898946881294251, 0.5954223871231079, 0, 2, 3, 13, 2, 3, -1., 3, 14, 2, 1, 3., -9.6323591424152255e-004, 0.3927116990089417, 0.5196074247360230, 0, 2, 16, 5, 3, 6, -1., 17, 5, 1, 6, 3., -2.0370010752230883e-003, 0.5613325238227844, 0.4884858131408691, 0, 2, 1, 5, 3, 6, -1., 2, 5, 1, 6, 3., 1.6614829655736685e-003, 0.4472880065441132, 0.5578880906105042, 0, 2, 1, 9, 18, 1, -1., 7, 9, 6, 1, 3., -3.1188090797513723e-003, 0.3840532898902893, 0.5397477746009827, 0, 2, 0, 9, 8, 7, -1., 4, 9, 4, 7, 2., -6.4000617712736130e-003, 0.5843983888626099, 0.4533218145370483, 0, 2, 12, 11, 8, 2, -1., 12, 12, 8, 1, 2., 3.1319601112045348e-004, 0.5439221858978272, 0.4234727919101715, 0, 2, 0, 11, 8, 2, -1., 0, 12, 8, 1, 2., -0.0182220991700888, 0.1288464963436127, 0.4958404898643494, 0, 2, 9, 13, 2, 3, -1., 9, 14, 2, 1, 3., 8.7969247251749039e-003, 0.4951297938823700, 0.7153480052947998, 0, 3, 4, 10, 12, 4, -1., 4, 10, 6, 2, 2., 10, 12, 6, 2, 2., -4.2395070195198059e-003, 0.3946599960327148, 0.5194936990737915, 0, 2, 9, 3, 3, 7, -1., 10, 3, 1, 7, 3., 9.7086271271109581e-003, 0.4897503852844238, 0.6064900159835815, 0, 2, 7, 2, 3, 5, -1., 8, 2, 1, 5, 3., -3.9934171363711357e-003, 0.3245440125465393, 0.5060828924179077, 0, 3, 9, 12, 4, 6, -1., 11, 12, 2, 3, 2., 9, 15, 2, 3, 2., -0.0167850591242313, 0.1581953018903732, 0.5203778743743897, 0, 2, 8, 7, 3, 6, -1., 9, 7, 1, 6, 3., 0.0182720907032490, 0.4680935144424439, 0.6626979112625122, 0, 2, 15, 4, 4, 2, -1., 15, 5, 4, 1, 2., 5.6872838176786900e-003, 0.5211697816848755, 0.3512184917926788, 0, 2, 8, 7, 3, 3, -1., 9, 7, 1, 3, 3., -1.0739039862528443e-003, 0.5768386125564575, 0.4529845118522644, 0, 2, 14, 2, 6, 4, -1., 14, 4, 6, 2, 2., -3.7093870341777802e-003, 0.4507763087749481, 0.5313581228256226, 0, 2, 7, 16, 6, 1, -1., 9, 16, 2, 1, 3., -2.1110709349159151e-004, 0.5460820198059082, 0.4333376884460449, 0, 2, 15, 13, 2, 3, -1., 15, 14, 2, 1, 3., 1.0670139454305172e-003, 0.5371856093406677, 0.4078390896320343, 0, 2, 8, 7, 3, 10, -1., 9, 7, 1, 10, 3., 3.5943021066486835e-003, 0.4471287131309509, 0.5643836259841919, 0, 2, 11, 10, 2, 6, -1., 11, 12, 2, 2, 3., -5.1776031032204628e-003, 0.4499393105506897, 0.5280330181121826, 0, 2, 6, 10, 4, 1, -1., 8, 10, 2, 1, 2., -2.5414369883947074e-004, 0.5516173243522644, 0.4407708048820496, 0, 2, 10, 9, 2, 2, -1., 10, 10, 2, 1, 2., 6.3522560521960258e-003, 0.5194190144538879, 0.2465227991342545, 0, 2, 8, 9, 2, 2, -1., 8, 10, 2, 1, 2., -4.4205080484971404e-004, 0.3830705881118774, 0.5139682292938232, 0, 3, 12, 7, 2, 2, -1., 13, 7, 1, 1, 2., 12, 8, 1, 1, 2., 7.4488727841526270e-004, 0.4891090989112854, 0.5974786877632141, 0, 3, 5, 7, 2, 2, -1., 5, 7, 1, 1, 2., 6, 8, 1, 1, 2., -3.5116379149258137e-003, 0.7413681745529175, 0.4768764972686768, 0, 2, 13, 0, 3, 14, -1., 14, 0, 1, 14, 3., -0.0125409103929996, 0.3648819029331207, 0.5252826809883118, 0, 2, 4, 0, 3, 14, -1., 5, 0, 1, 14, 3., 9.4931852072477341e-003, 0.5100492835044861, 0.3629586994647980, 0, 2, 13, 4, 3, 14, -1., 14, 4, 1, 14, 3., 0.0129611501470208, 0.5232442021369934, 0.4333561062812805, 0, 2, 9, 14, 2, 3, -1., 9, 15, 2, 1, 3., 4.7209449112415314e-003, 0.4648149013519287, 0.6331052780151367, 0, 2, 8, 14, 4, 3, -1., 8, 15, 4, 1, 3., -2.3119079414755106e-003, 0.5930309891700745, 0.4531058073043823, 0, 2, 4, 2, 3, 16, -1., 5, 2, 1, 16, 3., -2.8262299019843340e-003, 0.3870477974414825, 0.5257101058959961, 0, 2, 7, 2, 8, 10, -1., 7, 7, 8, 5, 2., -1.4311339473351836e-003, 0.5522503256797791, 0.4561854898929596, 0, 2, 6, 14, 7, 3, -1., 6, 15, 7, 1, 3., 1.9378310535103083e-003, 0.4546220898628235, 0.5736966729164124, 0, 3, 9, 2, 10, 12, -1., 14, 2, 5, 6, 2., 9, 8, 5, 6, 2., 2.6343559147790074e-004, 0.5345739126205444, 0.4571875035762787, 0, 2, 6, 7, 8, 2, -1., 6, 8, 8, 1, 2., 7.8257522545754910e-004, 0.3967815935611725, 0.5220187902450562, 0, 2, 8, 13, 4, 6, -1., 8, 16, 4, 3, 2., -0.0195504408329725, 0.2829642891883850, 0.5243508219718933, 0, 2, 6, 6, 1, 3, -1., 6, 7, 1, 1, 3., 4.3914958951063454e-004, 0.4590066969394684, 0.5899090170860291, 0, 2, 16, 2, 4, 6, -1., 16, 4, 4, 2, 3., 0.0214520003646612, 0.5231410861015320, 0.2855378985404968, 0, 3, 6, 6, 4, 2, -1., 6, 6, 2, 1, 2., 8, 7, 2, 1, 2., 5.8973580598831177e-004, 0.4397256970405579, 0.5506421923637390, 0, 2, 16, 2, 4, 6, -1., 16, 4, 4, 2, 3., -0.0261576101183891, 0.3135079145431519, 0.5189175009727478, 0, 2, 0, 2, 4, 6, -1., 0, 4, 4, 2, 3., -0.0139598604291677, 0.3213272988796234, 0.5040717720985413, 0, 2, 9, 6, 2, 6, -1., 9, 6, 1, 6, 2., -6.3699018210172653e-003, 0.6387544870376587, 0.4849506914615631, 0, 2, 3, 4, 6, 10, -1., 3, 9, 6, 5, 2., -8.5613820701837540e-003, 0.2759132087230682, 0.5032019019126892, 0, 2, 9, 5, 2, 6, -1., 9, 5, 1, 6, 2., 9.6622901037335396e-004, 0.4685640931129456, 0.5834879279136658, 0, 2, 3, 13, 2, 3, -1., 3, 14, 2, 1, 3., 7.6550268568098545e-004, 0.5175207257270813, 0.3896422088146210, 0, 2, 13, 13, 3, 2, -1., 13, 14, 3, 1, 2., -8.1833340227603912e-003, 0.2069136947393417, 0.5208122134208679, 0, 3, 2, 16, 10, 4, -1., 2, 16, 5, 2, 2., 7, 18, 5, 2, 2., -9.3976939097046852e-003, 0.6134091019630432, 0.4641222953796387, 0, 3, 5, 6, 10, 6, -1., 10, 6, 5, 3, 2., 5, 9, 5, 3, 2., 4.8028980381786823e-003, 0.5454108119010925, 0.4395219981670380, 0, 2, 7, 14, 1, 3, -1., 7, 15, 1, 1, 3., -3.5680569708347321e-003, 0.6344485282897949, 0.4681093990802765, 0, 2, 14, 16, 6, 3, -1., 14, 17, 6, 1, 3., 4.0733120404183865e-003, 0.5292683243751526, 0.4015620052814484, 0, 2, 5, 4, 3, 3, -1., 5, 5, 3, 1, 3., 1.2568129459396005e-003, 0.4392988085746765, 0.5452824831008911, 0, 2, 7, 4, 10, 3, -1., 7, 5, 10, 1, 3., -2.9065010603517294e-003, 0.5898832082748413, 0.4863379895687103, 0, 2, 0, 4, 5, 4, -1., 0, 6, 5, 2, 2., -2.4409340694546700e-003, 0.4069364964962006, 0.5247421860694885, 0, 2, 13, 11, 3, 9, -1., 13, 14, 3, 3, 3., 0.0248307008296251, 0.5182725787162781, 0.3682524859905243, 0, 2, 4, 11, 3, 9, -1., 4, 14, 3, 3, 3., -0.0488540083169937, 0.1307577937841415, 0.4961281120777130, 0, 2, 9, 7, 2, 1, -1., 9, 7, 1, 1, 2., -1.6110379947349429e-003, 0.6421005725860596, 0.4872662127017975, 0, 2, 5, 0, 6, 17, -1., 7, 0, 2, 17, 3., -0.0970094799995422, 0.0477693490684032, 0.4950988888740540, 0, 2, 10, 3, 6, 3, -1., 10, 3, 3, 3, 2., 1.1209240183234215e-003, 0.4616267085075378, 0.5354745984077454, 0, 2, 2, 2, 15, 4, -1., 7, 2, 5, 4, 3., -1.3064090162515640e-003, 0.6261854171752930, 0.4638805985450745, 0, 3, 8, 2, 8, 2, -1., 12, 2, 4, 1, 2., 8, 3, 4, 1, 2., 4.5771620352752507e-004, 0.5384417772293091, 0.4646640121936798, 0, 2, 8, 1, 3, 6, -1., 8, 3, 3, 2, 3., -6.3149951165542006e-004, 0.3804047107696533, 0.5130257010459900, 0, 2, 9, 17, 2, 2, -1., 9, 18, 2, 1, 2., 1.4505970466416329e-004, 0.4554310142993927, 0.5664461851119995, 0, 2, 0, 0, 2, 14, -1., 1, 0, 1, 14, 2., -0.0164745505899191, 0.6596958041191101, 0.4715859889984131, 0, 2, 12, 0, 7, 3, -1., 12, 1, 7, 1, 3., 0.0133695797994733, 0.5195466279983521, 0.3035964965820313, 0, 2, 1, 14, 1, 2, -1., 1, 15, 1, 1, 2., 1.0271780047332868e-004, 0.5229176282882690, 0.4107066094875336, 0, 3, 14, 12, 2, 8, -1., 15, 12, 1, 4, 2., 14, 16, 1, 4, 2., -5.5311559699475765e-003, 0.6352887749671936, 0.4960907101631165, 0, 2, 1, 0, 7, 3, -1., 1, 1, 7, 1, 3., -2.6187049224972725e-003, 0.3824546039104462, 0.5140984058380127, 0, 3, 14, 12, 2, 8, -1., 15, 12, 1, 4, 2., 14, 16, 1, 4, 2., 5.0834268331527710e-003, 0.4950439929962158, 0.6220818758010864, 0, 3, 6, 0, 8, 12, -1., 6, 0, 4, 6, 2., 10, 6, 4, 6, 2., 0.0798181593418121, 0.4952335953712463, 0.1322475969791412, 0, 2, 6, 1, 8, 9, -1., 6, 4, 8, 3, 3., -0.0992265865206718, 0.7542728781700134, 0.5008416771888733, 0, 2, 5, 2, 2, 2, -1., 5, 3, 2, 1, 2., -6.5174017800018191e-004, 0.3699302971363068, 0.5130121111869812, 0, 3, 13, 14, 6, 6, -1., 16, 14, 3, 3, 2., 13, 17, 3, 3, 2., -0.0189968496561050, 0.6689178943634033, 0.4921202957630158, 0, 3, 0, 17, 20, 2, -1., 0, 17, 10, 1, 2., 10, 18, 10, 1, 2., 0.0173468999564648, 0.4983300864696503, 0.1859198063611984, 0, 3, 10, 3, 2, 6, -1., 11, 3, 1, 3, 2., 10, 6, 1, 3, 2., 5.5082101607695222e-004, 0.4574424028396606, 0.5522121787071228, 0, 2, 5, 12, 6, 2, -1., 8, 12, 3, 2, 2., 2.0056050270795822e-003, 0.5131744742393494, 0.3856469988822937, 0, 2, 10, 7, 6, 13, -1., 10, 7, 3, 13, 2., -7.7688191086053848e-003, 0.4361700117588043, 0.5434309244155884, 0, 2, 5, 15, 10, 5, -1., 10, 15, 5, 5, 2., 0.0508782789111137, 0.4682720899581909, 0.6840639710426331, 0, 2, 10, 4, 4, 10, -1., 10, 4, 2, 10, 2., -2.2901780903339386e-003, 0.4329245090484619, 0.5306099057197571, 0, 2, 5, 7, 2, 1, -1., 6, 7, 1, 1, 2., -1.5715380141045898e-004, 0.5370057225227356, 0.4378164112567902, 0, 2, 10, 3, 6, 7, -1., 10, 3, 3, 7, 2., 0.1051924005150795, 0.5137274265289307, 0.0673614665865898, 0, 2, 4, 3, 6, 7, -1., 7, 3, 3, 7, 2., 2.7198919560760260e-003, 0.4112060964107513, 0.5255665183067322, 0, 2, 1, 7, 18, 5, -1., 7, 7, 6, 5, 3., 0.0483377799391747, 0.5404623746871948, 0.4438967108726502, 0, 2, 3, 17, 4, 3, -1., 5, 17, 2, 3, 2., 9.5703761326149106e-004, 0.4355969130992889, 0.5399510860443115, 0, 3, 8, 14, 12, 6, -1., 14, 14, 6, 3, 2., 8, 17, 6, 3, 2., -0.0253712590783834, 0.5995175242424011, 0.5031024813652039, 0, 3, 0, 13, 20, 4, -1., 0, 13, 10, 2, 2., 10, 15, 10, 2, 2., 0.0524579510092735, 0.4950287938117981, 0.1398351043462753, 0, 3, 4, 5, 14, 2, -1., 11, 5, 7, 1, 2., 4, 6, 7, 1, 2., -0.0123656298965216, 0.6397299170494080, 0.4964106082916260, 0, 3, 1, 2, 10, 12, -1., 1, 2, 5, 6, 2., 6, 8, 5, 6, 2., -0.1458971947431564, 0.1001669988036156, 0.4946322143077850, 0, 2, 6, 1, 14, 3, -1., 6, 2, 14, 1, 3., -0.0159086007624865, 0.3312329947948456, 0.5208340883255005, 0, 2, 8, 16, 2, 3, -1., 8, 17, 2, 1, 3., 3.9486068999394774e-004, 0.4406363964080811, 0.5426102876663208, 0, 2, 9, 17, 3, 2, -1., 10, 17, 1, 2, 3., -5.2454001270234585e-003, 0.2799589931964874, 0.5189967155456543, 0, 3, 5, 15, 4, 2, -1., 5, 15, 2, 1, 2., 7, 16, 2, 1, 2., -5.0421799533069134e-003, 0.6987580060958862, 0.4752142131328583, 0, 2, 10, 15, 1, 3, -1., 10, 16, 1, 1, 3., 2.9812189750373363e-003, 0.4983288943767548, 0.6307479739189148, 0, 3, 8, 16, 4, 4, -1., 8, 16, 2, 2, 2., 10, 18, 2, 2, 2., -7.2884308174252510e-003, 0.2982333004474640, 0.5026869773864746, 0, 2, 6, 11, 8, 6, -1., 6, 14, 8, 3, 2., 1.5094350092113018e-003, 0.5308442115783691, 0.3832970857620239, 0, 2, 2, 13, 5, 2, -1., 2, 14, 5, 1, 2., -9.3340799212455750e-003, 0.2037964016199112, 0.4969817101955414, 0, 3, 13, 14, 6, 6, -1., 16, 14, 3, 3, 2., 13, 17, 3, 3, 2., 0.0286671407520771, 0.5025696754455566, 0.6928027272224426, 0, 2, 1, 9, 18, 4, -1., 7, 9, 6, 4, 3., 0.1701968014240265, 0.4960052967071533, 0.1476442962884903, 0, 3, 13, 14, 6, 6, -1., 16, 14, 3, 3, 2., 13, 17, 3, 3, 2., -3.2614478841423988e-003, 0.5603063702583313, 0.4826056063175201, 0, 2, 0, 2, 1, 6, -1., 0, 4, 1, 2, 3., 5.5769277969375253e-004, 0.5205562114715576, 0.4129633009433746, 0, 2, 5, 0, 15, 20, -1., 5, 10, 15, 10, 2., 0.3625833988189697, 0.5221652984619141, 0.3768612146377564, 0, 3, 1, 14, 6, 6, -1., 1, 14, 3, 3, 2., 4, 17, 3, 3, 2., -0.0116151301190257, 0.6022682785987854, 0.4637489914894104, 0, 3, 8, 14, 4, 6, -1., 10, 14, 2, 3, 2., 8, 17, 2, 3, 2., -4.0795197710394859e-003, 0.4070447087287903, 0.5337479114532471, 0, 2, 7, 11, 2, 1, -1., 8, 11, 1, 1, 2., 5.7204300537705421e-004, 0.4601835012435913, 0.5900393128395081, 0, 2, 9, 17, 3, 2, -1., 10, 17, 1, 2, 3., 6.7543348995968699e-004, 0.5398252010345459, 0.4345428943634033, 0, 2, 8, 17, 3, 2, -1., 9, 17, 1, 2, 3., 6.3295697327703238e-004, 0.5201563239097595, 0.4051358997821808, 0, 3, 12, 14, 4, 6, -1., 14, 14, 2, 3, 2., 12, 17, 2, 3, 2., 1.2435320531949401e-003, 0.4642387926578522, 0.5547441244125366, 0, 3, 4, 14, 4, 6, -1., 4, 14, 2, 3, 2., 6, 17, 2, 3, 2., -4.7363857738673687e-003, 0.6198567152023315, 0.4672552049160004, 0, 3, 13, 14, 2, 6, -1., 14, 14, 1, 3, 2., 13, 17, 1, 3, 2., -6.4658462069928646e-003, 0.6837332844734192, 0.5019000768661499, 0, 3, 5, 14, 2, 6, -1., 5, 14, 1, 3, 2., 6, 17, 1, 3, 2., 3.5017321351915598e-004, 0.4344803094863892, 0.5363622903823853, 0, 2, 7, 0, 6, 12, -1., 7, 4, 6, 4, 3., 1.5754920605104417e-004, 0.4760079085826874, 0.5732020735740662, 0, 2, 0, 7, 12, 2, -1., 4, 7, 4, 2, 3., 9.9774366244673729e-003, 0.5090985894203186, 0.3635039925575256, 0, 2, 10, 3, 3, 13, -1., 11, 3, 1, 13, 3., -4.1464529931545258e-004, 0.5570064783096314, 0.4593802094459534, 0, 2, 7, 3, 3, 13, -1., 8, 3, 1, 13, 3., -3.5888899583369493e-004, 0.5356845855712891, 0.4339134991168976, 0, 2, 10, 8, 6, 3, -1., 10, 9, 6, 1, 3., 4.0463250479660928e-004, 0.4439803063869476, 0.5436776876449585, 0, 2, 3, 11, 3, 2, -1., 4, 11, 1, 2, 3., -8.2184787606820464e-004, 0.4042294919490814, 0.5176299214363098, 0, 3, 13, 12, 6, 8, -1., 16, 12, 3, 4, 2., 13, 16, 3, 4, 2., 5.9467419050633907e-003, 0.4927651882171631, 0.5633779764175415, 0, 2, 7, 6, 6, 5, -1., 9, 6, 2, 5, 3., -0.0217533893883228, 0.8006293773651123, 0.4800840914249420, 0, 2, 17, 11, 2, 7, -1., 17, 11, 1, 7, 2., -0.0145403798669577, 0.3946054875850678, 0.5182222723960877, 0, 2, 3, 13, 8, 2, -1., 7, 13, 4, 2, 2., -0.0405107699334621, 0.0213249903172255, 0.4935792982578278, 0, 2, 6, 9, 8, 3, -1., 6, 10, 8, 1, 3., -5.8458268176764250e-004, 0.4012795984745026, 0.5314025282859802, 0, 2, 4, 3, 4, 3, -1., 4, 4, 4, 1, 3., 5.5151800625026226e-003, 0.4642418920993805, 0.5896260738372803, 0, 2, 11, 3, 4, 3, -1., 11, 4, 4, 1, 3., -6.0626221820712090e-003, 0.6502159237861633, 0.5016477704048157, 0, 2, 1, 4, 17, 12, -1., 1, 8, 17, 4, 3., 0.0945358425378799, 0.5264708995819092, 0.4126827120780945, 0, 2, 11, 3, 4, 3, -1., 11, 4, 4, 1, 3., 4.7315051779150963e-003, 0.4879199862480164, 0.5892447829246521, 0, 2, 4, 8, 6, 3, -1., 4, 9, 6, 1, 3., -5.2571471314877272e-004, 0.3917280137538910, 0.5189412832260132, 0, 2, 12, 3, 5, 3, -1., 12, 4, 5, 1, 3., -2.5464049540460110e-003, 0.5837599039077759, 0.4985705912113190, 0, 2, 1, 11, 2, 7, -1., 2, 11, 1, 7, 2., -0.0260756891220808, 0.1261983960866928, 0.4955821931362152, 0, 3, 15, 12, 2, 8, -1., 16, 12, 1, 4, 2., 15, 16, 1, 4, 2., -5.4779709316790104e-003, 0.5722513794898987, 0.5010265707969666, 0, 2, 4, 8, 11, 3, -1., 4, 9, 11, 1, 3., 5.1337741315364838e-003, 0.5273262262344360, 0.4226376116275787, 0, 3, 9, 13, 6, 2, -1., 12, 13, 3, 1, 2., 9, 14, 3, 1, 2., 4.7944980906322598e-004, 0.4450066983699799, 0.5819587111473084, 0, 2, 6, 13, 4, 3, -1., 6, 14, 4, 1, 3., -2.1114079281687737e-003, 0.5757653117179871, 0.4511714875698090, 0, 2, 9, 12, 3, 3, -1., 10, 12, 1, 3, 3., -0.0131799904629588, 0.1884381026029587, 0.5160734057426453, 0, 2, 5, 3, 3, 3, -1., 5, 4, 3, 1, 3., -4.7968099825084209e-003, 0.6589789986610413, 0.4736118912696838, 0, 2, 9, 4, 2, 3, -1., 9, 5, 2, 1, 3., 6.7483168095350266e-003, 0.5259429812431335, 0.3356395065784454, 0, 2, 0, 2, 16, 3, -1., 0, 3, 16, 1, 3., 1.4623369788751006e-003, 0.5355271100997925, 0.4264092147350311, 0, 3, 15, 12, 2, 8, -1., 16, 12, 1, 4, 2., 15, 16, 1, 4, 2., 4.7645159065723419e-003, 0.5034406781196594, 0.5786827802658081, 0, 3, 3, 12, 2, 8, -1., 3, 12, 1, 4, 2., 4, 16, 1, 4, 2., 6.8066660314798355e-003, 0.4756605029106140, 0.6677829027175903, 0, 2, 14, 13, 3, 6, -1., 14, 15, 3, 2, 3., 3.6608621012419462e-003, 0.5369611978530884, 0.4311546981334686, 0, 2, 3, 13, 3, 6, -1., 3, 15, 3, 2, 3., 0.0214496403932571, 0.4968641996383667, 0.1888816058635712, 0, 3, 6, 5, 10, 2, -1., 11, 5, 5, 1, 2., 6, 6, 5, 1, 2., 4.1678901761770248e-003, 0.4930733144283295, 0.5815368890762329, 0, 2, 2, 14, 14, 6, -1., 2, 17, 14, 3, 2., 8.6467564105987549e-003, 0.5205205082893372, 0.4132595062255859, 0, 2, 10, 14, 1, 3, -1., 10, 15, 1, 1, 3., -3.6114078829996288e-004, 0.5483555197715759, 0.4800927937030792, 0, 3, 4, 16, 2, 2, -1., 4, 16, 1, 1, 2., 5, 17, 1, 1, 2., 1.0808729566633701e-003, 0.4689902067184448, 0.6041421294212341, 0, 2, 10, 6, 2, 3, -1., 10, 7, 2, 1, 3., 5.7719959877431393e-003, 0.5171142220497131, 0.3053277134895325, 0, 3, 0, 17, 20, 2, -1., 0, 17, 10, 1, 2., 10, 18, 10, 1, 2., 1.5720770461484790e-003, 0.5219978094100952, 0.4178803861141205, 0, 2, 13, 6, 1, 3, -1., 13, 7, 1, 1, 3., -1.9307859474793077e-003, 0.5860369801521301, 0.4812920093536377, 0, 2, 8, 13, 3, 2, -1., 9, 13, 1, 2, 3., -7.8926272690296173e-003, 0.1749276965856552, 0.4971733987331390, 0, 2, 12, 2, 3, 3, -1., 13, 2, 1, 3, 3., -2.2224679123610258e-003, 0.4342589080333710, 0.5212848186492920, 0, 3, 3, 18, 2, 2, -1., 3, 18, 1, 1, 2., 4, 19, 1, 1, 2., 1.9011989934369922e-003, 0.4765186905860901, 0.6892055273056030, 0, 2, 9, 16, 3, 4, -1., 10, 16, 1, 4, 3., 2.7576119173318148e-003, 0.5262191295623779, 0.4337486028671265, 0, 2, 6, 6, 1, 3, -1., 6, 7, 1, 1, 3., 5.1787449046969414e-003, 0.4804069101810455, 0.7843729257583618, 0, 2, 13, 1, 5, 2, -1., 13, 2, 5, 1, 2., -9.0273341629654169e-004, 0.4120846986770630, 0.5353423953056335, 0, 3, 7, 14, 6, 2, -1., 7, 14, 3, 1, 2., 10, 15, 3, 1, 2., 5.1797959022223949e-003, 0.4740372896194458, 0.6425960063934326, 0, 2, 11, 3, 3, 4, -1., 12, 3, 1, 4, 3., -0.0101140001788735, 0.2468792051076889, 0.5175017714500427, 0, 2, 1, 13, 12, 6, -1., 5, 13, 4, 6, 3., -0.0186170600354671, 0.5756294131278992, 0.4628978967666626, 0, 2, 14, 11, 5, 2, -1., 14, 12, 5, 1, 2., 5.9225959703326225e-003, 0.5169625878334045, 0.3214271068572998, 0, 3, 2, 15, 14, 4, -1., 2, 15, 7, 2, 2., 9, 17, 7, 2, 2., -6.2945079989731312e-003, 0.3872014880180359, 0.5141636729240418, 0, 3, 3, 7, 14, 2, -1., 10, 7, 7, 1, 2., 3, 8, 7, 1, 2., 6.5353019163012505e-003, 0.4853048920631409, 0.6310489773750305, 0, 2, 1, 11, 4, 2, -1., 1, 12, 4, 1, 2., 1.0878399480134249e-003, 0.5117315053939819, 0.3723258972167969, 0, 2, 14, 0, 6, 14, -1., 16, 0, 2, 14, 3., -0.0225422400981188, 0.5692740082740784, 0.4887112975120544, 0, 2, 4, 11, 1, 3, -1., 4, 12, 1, 1, 3., -3.0065660830587149e-003, 0.2556012868881226, 0.5003992915153503, 0, 2, 14, 0, 6, 14, -1., 16, 0, 2, 14, 3., 7.4741272255778313e-003, 0.4810872972011566, 0.5675926804542542, 0, 2, 1, 10, 3, 7, -1., 2, 10, 1, 7, 3., 0.0261623207479715, 0.4971194863319397, 0.1777237057685852, 0, 2, 8, 12, 9, 2, -1., 8, 13, 9, 1, 2., 9.4352738233283162e-004, 0.4940010905265808, 0.5491250753402710, 0, 2, 0, 6, 20, 1, -1., 10, 6, 10, 1, 2., 0.0333632417023182, 0.5007612109184265, 0.2790724039077759, 0, 2, 8, 4, 4, 4, -1., 8, 4, 2, 4, 2., -0.0151186501607299, 0.7059578895568848, 0.4973031878471375, 0, 2, 0, 0, 2, 2, -1., 0, 1, 2, 1, 2., 9.8648946732282639e-004, 0.5128620266914368, 0.3776761889457703, 105.7611007690429700, 213, 0, 2, 5, 3, 10, 9, -1., 5, 6, 10, 3, 3., -0.0951507985591888, 0.6470757126808167, 0.4017286896705627, 0, 2, 15, 2, 4, 10, -1., 15, 2, 2, 10, 2., 6.2702340073883533e-003, 0.3999822139739990, 0.5746449232101440, 0, 2, 8, 2, 2, 7, -1., 9, 2, 1, 7, 2., 3.0018089455552399e-004, 0.3558770120143890, 0.5538809895515442, 0, 2, 7, 4, 12, 1, -1., 11, 4, 4, 1, 3., 1.1757409665733576e-003, 0.4256534874439240, 0.5382617712020874, 0, 2, 3, 4, 9, 1, -1., 6, 4, 3, 1, 3., 4.4235268433112651e-005, 0.3682908117771149, 0.5589926838874817, 0, 2, 15, 10, 1, 4, -1., 15, 12, 1, 2, 2., -2.9936920327600092e-005, 0.5452470183372498, 0.4020367860794067, 0, 2, 4, 10, 6, 4, -1., 7, 10, 3, 4, 2., 3.0073199886828661e-003, 0.5239058136940002, 0.3317843973636627, 0, 2, 15, 9, 1, 6, -1., 15, 12, 1, 3, 2., -0.0105138896033168, 0.4320689141750336, 0.5307983756065369, 0, 2, 7, 17, 6, 3, -1., 7, 18, 6, 1, 3., 8.3476826548576355e-003, 0.4504637122154236, 0.6453298926353455, 0, 3, 14, 3, 2, 16, -1., 15, 3, 1, 8, 2., 14, 11, 1, 8, 2., -3.1492270063608885e-003, 0.4313425123691559, 0.5370525121688843, 0, 2, 4, 9, 1, 6, -1., 4, 12, 1, 3, 2., -1.4435649973165710e-005, 0.5326603055000305, 0.3817971944808960, 0, 2, 12, 1, 5, 2, -1., 12, 2, 5, 1, 2., -4.2855090578086674e-004, 0.4305163919925690, 0.5382009744644165, 0, 3, 6, 18, 4, 2, -1., 6, 18, 2, 1, 2., 8, 19, 2, 1, 2., 1.5062429883982986e-004, 0.4235970973968506, 0.5544965267181397, 0, 3, 2, 4, 16, 10, -1., 10, 4, 8, 5, 2., 2, 9, 8, 5, 2., 0.0715598315000534, 0.5303059816360474, 0.2678802907466888, 0, 2, 6, 5, 1, 10, -1., 6, 10, 1, 5, 2., 8.4095180500298738e-004, 0.3557108938694000, 0.5205433964729309, 0, 2, 4, 8, 15, 2, -1., 9, 8, 5, 2, 3., 0.0629865005612373, 0.5225362777709961, 0.2861376106739044, 0, 2, 1, 8, 15, 2, -1., 6, 8, 5, 2, 3., -3.3798629883676767e-003, 0.3624185919761658, 0.5201697945594788, 0, 2, 9, 5, 3, 6, -1., 9, 7, 3, 2, 3., -1.1810739670181647e-004, 0.5474476814270020, 0.3959893882274628, 0, 2, 5, 7, 8, 2, -1., 9, 7, 4, 2, 2., -5.4505601292476058e-004, 0.3740422129631043, 0.5215715765953064, 0, 2, 9, 11, 2, 3, -1., 9, 12, 2, 1, 3., -1.8454910023137927e-003, 0.5893052220344544, 0.4584448933601379, 0, 2, 1, 0, 16, 3, -1., 1, 1, 16, 1, 3., -4.3832371011376381e-004, 0.4084582030773163, 0.5385351181030273, 0, 2, 11, 2, 7, 2, -1., 11, 3, 7, 1, 2., -2.4000830017030239e-003, 0.3777455091476440, 0.5293580293655396, 0, 2, 5, 1, 10, 18, -1., 5, 7, 10, 6, 3., -0.0987957417964935, 0.2963612079620361, 0.5070089101791382, 0, 2, 17, 4, 3, 2, -1., 18, 4, 1, 2, 3., 3.1798239797353745e-003, 0.4877632856369019, 0.6726443767547607, 0, 2, 8, 13, 1, 3, -1., 8, 14, 1, 1, 3., 3.2406419632025063e-004, 0.4366911053657532, 0.5561109781265259, 0, 2, 3, 14, 14, 6, -1., 3, 16, 14, 2, 3., -0.0325472503900528, 0.3128157854080200, 0.5308616161346436, 0, 2, 0, 2, 3, 4, -1., 1, 2, 1, 4, 3., -7.7561130747199059e-003, 0.6560224890708923, 0.4639872014522553, 0, 2, 12, 1, 5, 2, -1., 12, 2, 5, 1, 2., 0.0160272493958473, 0.5172680020332336, 0.3141897916793823, 0, 2, 3, 1, 5, 2, -1., 3, 2, 5, 1, 2., 7.1002350523485802e-006, 0.4084446132183075, 0.5336294770240784, 0, 2, 10, 13, 2, 3, -1., 10, 14, 2, 1, 3., 7.3422808200120926e-003, 0.4966922104358673, 0.6603465080261231, 0, 2, 8, 13, 2, 3, -1., 8, 14, 2, 1, 3., -1.6970280557870865e-003, 0.5908237099647522, 0.4500182867050171, 0, 2, 14, 12, 2, 3, -1., 14, 13, 2, 1, 3., 2.4118260480463505e-003, 0.5315160751342773, 0.3599720895290375, 0, 2, 7, 2, 2, 3, -1., 7, 3, 2, 1, 3., -5.5300937965512276e-003, 0.2334040999412537, 0.4996814131736755, 0, 3, 5, 6, 10, 4, -1., 10, 6, 5, 2, 2., 5, 8, 5, 2, 2., -2.6478730142116547e-003, 0.5880935788154602, 0.4684734046459198, 0, 2, 9, 13, 1, 6, -1., 9, 16, 1, 3, 2., 0.0112956296652555, 0.4983777105808258, 0.1884590983390808, 0, 3, 10, 12, 2, 2, -1., 11, 12, 1, 1, 2., 10, 13, 1, 1, 2., -6.6952878842130303e-004, 0.5872138142585754, 0.4799019992351532, 0, 2, 4, 12, 2, 3, -1., 4, 13, 2, 1, 3., 1.4410680159926414e-003, 0.5131189227104187, 0.3501011133193970, 0, 2, 14, 4, 6, 6, -1., 14, 6, 6, 2, 3., 2.4637870956212282e-003, 0.5339372158050537, 0.4117639064788818, 0, 2, 8, 17, 2, 3, -1., 8, 18, 2, 1, 3., 3.3114518737420440e-004, 0.4313383102416992, 0.5398246049880981, 0, 2, 16, 4, 4, 6, -1., 16, 6, 4, 2, 3., -0.0335572697222233, 0.2675336897373200, 0.5179154872894287, 0, 2, 0, 4, 4, 6, -1., 0, 6, 4, 2, 3., 0.0185394193977118, 0.4973869919776917, 0.2317177057266235, 0, 2, 14, 6, 2, 3, -1., 14, 6, 1, 3, 2., -2.9698139405809343e-004, 0.5529708266258240, 0.4643664062023163, 0, 2, 4, 9, 8, 1, -1., 8, 9, 4, 1, 2., -4.5577259152196348e-004, 0.5629584193229675, 0.4469191133975983, 0, 2, 8, 12, 4, 3, -1., 8, 13, 4, 1, 3., -0.0101589802652597, 0.6706212759017944, 0.4925918877124786, 0, 2, 5, 12, 10, 6, -1., 5, 14, 10, 2, 3., -2.2413829356082715e-005, 0.5239421725273132, 0.3912901878356934, 0, 2, 11, 12, 1, 2, -1., 11, 13, 1, 1, 2., 7.2034963523037732e-005, 0.4799438118934631, 0.5501788854598999, 0, 2, 8, 15, 4, 2, -1., 8, 16, 4, 1, 2., -6.9267209619283676e-003, 0.6930009722709656, 0.4698084890842438, 0, 3, 6, 9, 8, 8, -1., 10, 9, 4, 4, 2., 6, 13, 4, 4, 2., -7.6997838914394379e-003, 0.4099623858928680, 0.5480883121490479, 0, 3, 7, 12, 4, 6, -1., 7, 12, 2, 3, 2., 9, 15, 2, 3, 2., -7.3130549862980843e-003, 0.3283475935459137, 0.5057886242866516, 0, 2, 10, 11, 3, 1, -1., 11, 11, 1, 1, 3., 1.9650589674711227e-003, 0.4978047013282776, 0.6398249864578247, 0, 3, 9, 7, 2, 10, -1., 9, 7, 1, 5, 2., 10, 12, 1, 5, 2., 7.1647600270807743e-003, 0.4661160111427307, 0.6222137212753296, 0, 2, 8, 0, 6, 6, -1., 10, 0, 2, 6, 3., -0.0240786392241716, 0.2334644943475723, 0.5222162008285523, 0, 2, 3, 11, 2, 6, -1., 3, 13, 2, 2, 3., -0.0210279691964388, 0.1183653995394707, 0.4938226044178009, 0, 2, 16, 12, 1, 2, -1., 16, 13, 1, 1, 2., 3.6017020465806127e-004, 0.5325019955635071, 0.4116711020469666, 0, 3, 1, 14, 6, 6, -1., 1, 14, 3, 3, 2., 4, 17, 3, 3, 2., -0.0172197297215462, 0.6278762221336365, 0.4664269089698792, 0, 2, 13, 1, 3, 6, -1., 14, 1, 1, 6, 3., -7.8672142699360847e-003, 0.3403415083885193, 0.5249736905097961, 0, 2, 8, 8, 2, 2, -1., 8, 9, 2, 1, 2., -4.4777389848604798e-004, 0.3610411882400513, 0.5086259245872498, 0, 2, 9, 9, 3, 3, -1., 10, 9, 1, 3, 3., 5.5486010387539864e-003, 0.4884265959262848, 0.6203498244285584, 0, 2, 8, 7, 3, 3, -1., 8, 8, 3, 1, 3., -6.9461148232221603e-003, 0.2625930011272430, 0.5011097192764282, 0, 2, 14, 0, 2, 3, -1., 14, 0, 1, 3, 2., 1.3569870498031378e-004, 0.4340794980525971, 0.5628312230110169, 0, 2, 1, 0, 18, 9, -1., 7, 0, 6, 9, 3., -0.0458802506327629, 0.6507998704910278, 0.4696274995803833, 0, 2, 11, 5, 4, 15, -1., 11, 5, 2, 15, 2., -0.0215825606137514, 0.3826502859592438, 0.5287616848945618, 0, 2, 5, 5, 4, 15, -1., 7, 5, 2, 15, 2., -0.0202095396816731, 0.3233368098735809, 0.5074477195739746, 0, 2, 14, 0, 2, 3, -1., 14, 0, 1, 3, 2., 5.8496710844337940e-003, 0.5177603960037231, 0.4489670991897583, 0, 2, 4, 0, 2, 3, -1., 5, 0, 1, 3, 2., -5.7476379879517481e-005, 0.4020850956439972, 0.5246363878250122, 0, 3, 11, 12, 2, 2, -1., 12, 12, 1, 1, 2., 11, 13, 1, 1, 2., -1.1513100471347570e-003, 0.6315072178840637, 0.4905154109001160, 0, 3, 7, 12, 2, 2, -1., 7, 12, 1, 1, 2., 8, 13, 1, 1, 2., 1.9862831104546785e-003, 0.4702459871768951, 0.6497151255607605, 0, 2, 12, 0, 3, 4, -1., 13, 0, 1, 4, 3., -5.2719512023031712e-003, 0.3650383949279785, 0.5227652788162231, 0, 2, 4, 11, 3, 3, -1., 4, 12, 3, 1, 3., 1.2662699446082115e-003, 0.5166100859642029, 0.3877618014812470, 0, 2, 12, 7, 4, 2, -1., 12, 8, 4, 1, 2., -6.2919440679252148e-003, 0.7375894188880920, 0.5023847818374634, 0, 2, 8, 10, 3, 2, -1., 9, 10, 1, 2, 3., 6.7360111279413104e-004, 0.4423226118087769, 0.5495585799217224, 0, 2, 9, 9, 3, 2, -1., 10, 9, 1, 2, 3., -1.0523450328037143e-003, 0.5976396203041077, 0.4859583079814911, 0, 2, 8, 9, 3, 2, -1., 9, 9, 1, 2, 3., -4.4216238893568516e-004, 0.5955939292907715, 0.4398930966854096, 0, 2, 12, 0, 3, 4, -1., 13, 0, 1, 4, 3., 1.1747940443456173e-003, 0.5349888205528259, 0.4605058133602142, 0, 2, 5, 0, 3, 4, -1., 6, 0, 1, 4, 3., 5.2457437850534916e-003, 0.5049191117286682, 0.2941577136516571, 0, 3, 4, 14, 12, 4, -1., 10, 14, 6, 2, 2., 4, 16, 6, 2, 2., -0.0245397202670574, 0.2550177872180939, 0.5218586921691895, 0, 2, 8, 13, 2, 3, -1., 8, 14, 2, 1, 3., 7.3793041519820690e-004, 0.4424861073493958, 0.5490816235542297, 0, 2, 10, 10, 3, 8, -1., 10, 14, 3, 4, 2., 1.4233799884095788e-003, 0.5319514274597168, 0.4081355929374695, 0, 3, 8, 10, 4, 8, -1., 8, 10, 2, 4, 2., 10, 14, 2, 4, 2., -2.4149110540747643e-003, 0.4087659120559692, 0.5238950252532959, 0, 2, 10, 8, 3, 1, -1., 11, 8, 1, 1, 3., -1.2165299849584699e-003, 0.5674579143524170, 0.4908052980899811, 0, 2, 9, 12, 1, 6, -1., 9, 15, 1, 3, 2., -1.2438809499144554e-003, 0.4129425883293152, 0.5256118178367615, 0, 2, 10, 8, 3, 1, -1., 11, 8, 1, 1, 3., 6.1942739412188530e-003, 0.5060194134712219, 0.7313653230667114, 0, 2, 7, 8, 3, 1, -1., 8, 8, 1, 1, 3., -1.6607169527560472e-003, 0.5979632139205933, 0.4596369862556458, 0, 2, 5, 2, 15, 14, -1., 5, 9, 15, 7, 2., -0.0273162592202425, 0.4174365103244782, 0.5308842062950134, 0, 3, 2, 1, 2, 10, -1., 2, 1, 1, 5, 2., 3, 6, 1, 5, 2., -1.5845570014789701e-003, 0.5615804791450501, 0.4519486129283905, 0, 2, 14, 14, 2, 3, -1., 14, 15, 2, 1, 3., -1.5514739789068699e-003, 0.4076187014579773, 0.5360785126686096, 0, 2, 2, 7, 3, 3, -1., 3, 7, 1, 3, 3., 3.8446558755822480e-004, 0.4347293972969055, 0.5430442094802856, 0, 2, 17, 4, 3, 3, -1., 17, 5, 3, 1, 3., -0.0146722598001361, 0.1659304946660996, 0.5146093964576721, 0, 2, 0, 4, 3, 3, -1., 0, 5, 3, 1, 3., 8.1608882173895836e-003, 0.4961819052696228, 0.1884745955467224, 0, 3, 13, 5, 6, 2, -1., 16, 5, 3, 1, 2., 13, 6, 3, 1, 2., 1.1121659772470593e-003, 0.4868263900279999, 0.6093816161155701, 0, 2, 4, 19, 12, 1, -1., 8, 19, 4, 1, 3., -7.2603770531713963e-003, 0.6284325122833252, 0.4690375924110413, 0, 2, 12, 12, 2, 4, -1., 12, 14, 2, 2, 2., -2.4046430189628154e-004, 0.5575000047683716, 0.4046044051647186, 0, 2, 3, 15, 1, 3, -1., 3, 16, 1, 1, 3., -2.3348190006799996e-004, 0.4115762114524841, 0.5252848267555237, 0, 2, 11, 16, 6, 4, -1., 11, 16, 3, 4, 2., 5.5736480280756950e-003, 0.4730072915554047, 0.5690100789070129, 0, 2, 2, 10, 3, 10, -1., 3, 10, 1, 10, 3., 0.0306237693876028, 0.4971886873245239, 0.1740095019340515, 0, 2, 12, 8, 2, 4, -1., 12, 8, 1, 4, 2., 9.2074798885732889e-004, 0.5372117757797241, 0.4354872107505798, 0, 2, 6, 8, 2, 4, -1., 7, 8, 1, 4, 2., -4.3550739064812660e-005, 0.5366883873939514, 0.4347316920757294, 0, 2, 10, 14, 2, 3, -1., 10, 14, 1, 3, 2., -6.6452710889279842e-003, 0.3435518145561218, 0.5160533189773560, 0, 2, 5, 1, 10, 3, -1., 10, 1, 5, 3, 2., 0.0432219989597797, 0.4766792058944702, 0.7293652892112732, 0, 2, 10, 7, 3, 2, -1., 11, 7, 1, 2, 3., 2.2331769578158855e-003, 0.5029315948486328, 0.5633171200752258, 0, 2, 5, 6, 9, 2, -1., 8, 6, 3, 2, 3., 3.1829739455133677e-003, 0.4016092121601105, 0.5192136764526367, 0, 2, 9, 8, 2, 2, -1., 9, 9, 2, 1, 2., -1.8027749320026487e-004, 0.4088315963745117, 0.5417919754981995, 0, 3, 2, 11, 16, 6, -1., 2, 11, 8, 3, 2., 10, 14, 8, 3, 2., -5.2934689447283745e-003, 0.4075677096843720, 0.5243561863899231, 0, 3, 12, 7, 2, 2, -1., 13, 7, 1, 1, 2., 12, 8, 1, 1, 2., 1.2750959722325206e-003, 0.4913282990455627, 0.6387010812759399, 0, 2, 9, 5, 2, 3, -1., 9, 6, 2, 1, 3., 4.3385322205722332e-003, 0.5031672120094299, 0.2947346866130829, 0, 2, 9, 7, 3, 2, -1., 10, 7, 1, 2, 3., 8.5250744596123695e-003, 0.4949789047241211, 0.6308869123458862, 0, 2, 5, 1, 8, 12, -1., 5, 7, 8, 6, 2., -9.4266352243721485e-004, 0.5328366756439209, 0.4285649955272675, 0, 2, 13, 5, 2, 2, -1., 13, 6, 2, 1, 2., 1.3609660090878606e-003, 0.4991525113582611, 0.5941501259803772, 0, 2, 5, 5, 2, 2, -1., 5, 6, 2, 1, 2., 4.4782509212382138e-004, 0.4573504030704498, 0.5854480862617493, 0, 2, 12, 4, 3, 3, -1., 12, 5, 3, 1, 3., 1.3360050506889820e-003, 0.4604358971118927, 0.5849052071571350, 0, 2, 4, 14, 2, 3, -1., 4, 15, 2, 1, 3., -6.0967548051849008e-004, 0.3969388902187347, 0.5229423046112061, 0, 2, 12, 4, 3, 3, -1., 12, 5, 3, 1, 3., -2.3656780831515789e-003, 0.5808320045471191, 0.4898357093334198, 0, 2, 5, 4, 3, 3, -1., 5, 5, 3, 1, 3., 1.0734340175986290e-003, 0.4351210892200470, 0.5470039248466492, 0, 3, 9, 14, 2, 6, -1., 10, 14, 1, 3, 2., 9, 17, 1, 3, 2., 2.1923359017819166e-003, 0.5355060100555420, 0.3842903971672058, 0, 2, 8, 14, 3, 2, -1., 9, 14, 1, 2, 3., 5.4968618787825108e-003, 0.5018138885498047, 0.2827191948890686, 0, 2, 9, 5, 6, 6, -1., 11, 5, 2, 6, 3., -0.0753688216209412, 0.1225076019763947, 0.5148826837539673, 0, 2, 5, 5, 6, 6, -1., 7, 5, 2, 6, 3., 0.0251344703137875, 0.4731766879558563, 0.7025446295738220, 0, 2, 13, 13, 1, 2, -1., 13, 14, 1, 1, 2., -2.9358599931583740e-005, 0.5430532097816467, 0.4656086862087250, 0, 2, 0, 2, 10, 2, -1., 0, 3, 10, 1, 2., -5.8355910005047917e-004, 0.4031040072441101, 0.5190119743347168, 0, 2, 13, 13, 1, 2, -1., 13, 14, 1, 1, 2., -2.6639450807124376e-003, 0.4308126866817474, 0.5161771178245544, 0, 3, 5, 7, 2, 2, -1., 5, 7, 1, 1, 2., 6, 8, 1, 1, 2., -1.3804089976474643e-003, 0.6219829916954041, 0.4695515930652618, 0, 2, 13, 5, 2, 7, -1., 13, 5, 1, 7, 2., 1.2313219485804439e-003, 0.5379363894462585, 0.4425831139087677, 0, 2, 6, 13, 1, 2, -1., 6, 14, 1, 1, 2., -1.4644179827882908e-005, 0.5281640291213989, 0.4222503006458283, 0, 2, 11, 0, 3, 7, -1., 12, 0, 1, 7, 3., -0.0128188095986843, 0.2582092881202698, 0.5179932713508606, 0, 3, 0, 3, 2, 16, -1., 0, 3, 1, 8, 2., 1, 11, 1, 8, 2., 0.0228521898388863, 0.4778693020343781, 0.7609264254570007, 0, 2, 11, 0, 3, 7, -1., 12, 0, 1, 7, 3., 8.2305970136076212e-004, 0.5340992212295532, 0.4671724140644074, 0, 2, 6, 0, 3, 7, -1., 7, 0, 1, 7, 3., 0.0127701200544834, 0.4965761005878449, 0.1472366005182266, 0, 2, 11, 16, 8, 4, -1., 11, 16, 4, 4, 2., -0.0500515103340149, 0.6414994001388550, 0.5016592144966126, 0, 2, 1, 16, 8, 4, -1., 5, 16, 4, 4, 2., 0.0157752707600594, 0.4522320032119751, 0.5685362219810486, 0, 2, 13, 5, 2, 7, -1., 13, 5, 1, 7, 2., -0.0185016207396984, 0.2764748930931091, 0.5137959122657776, 0, 2, 5, 5, 2, 7, -1., 6, 5, 1, 7, 2., 2.4626250378787518e-003, 0.5141941905021668, 0.3795408010482788, 0, 2, 18, 6, 2, 14, -1., 18, 13, 2, 7, 2., 0.0629161670804024, 0.5060648918151856, 0.6580433845520020, 0, 2, 6, 10, 3, 4, -1., 6, 12, 3, 2, 2., -2.1648500478477217e-005, 0.5195388197898865, 0.4019886851310730, 0, 2, 14, 7, 1, 2, -1., 14, 8, 1, 1, 2., 2.1180990152060986e-003, 0.4962365031242371, 0.5954458713531494, 0, 3, 0, 1, 18, 6, -1., 0, 1, 9, 3, 2., 9, 4, 9, 3, 2., -0.0166348908096552, 0.3757933080196381, 0.5175446867942810, 0, 2, 14, 7, 1, 2, -1., 14, 8, 1, 1, 2., -2.8899470344185829e-003, 0.6624013781547546, 0.5057178735733032, 0, 2, 0, 6, 2, 14, -1., 0, 13, 2, 7, 2., 0.0767832621932030, 0.4795796871185303, 0.8047714829444885, 0, 2, 17, 0, 3, 12, -1., 18, 0, 1, 12, 3., 3.9170677773654461e-003, 0.4937882125377655, 0.5719941854476929, 0, 2, 0, 6, 18, 3, -1., 0, 7, 18, 1, 3., -0.0726706013083458, 0.0538945607841015, 0.4943903982639313, 0, 2, 6, 0, 14, 16, -1., 6, 8, 14, 8, 2., 0.5403950214385986, 0.5129774212837219, 0.1143338978290558, 0, 2, 0, 0, 3, 12, -1., 1, 0, 1, 12, 3., 2.9510019812732935e-003, 0.4528343975543976, 0.5698574185371399, 0, 2, 13, 0, 3, 7, -1., 14, 0, 1, 7, 3., 3.4508369863033295e-003, 0.5357726812362671, 0.4218730926513672, 0, 2, 5, 7, 1, 2, -1., 5, 8, 1, 1, 2., -4.2077939724549651e-004, 0.5916172862052918, 0.4637925922870636, 0, 2, 14, 4, 6, 6, -1., 14, 6, 6, 2, 3., 3.3051050268113613e-003, 0.5273385047912598, 0.4382042884826660, 0, 2, 5, 7, 7, 2, -1., 5, 8, 7, 1, 2., 4.7735060798004270e-004, 0.4046528041362763, 0.5181884765625000, 0, 2, 8, 6, 6, 9, -1., 8, 9, 6, 3, 3., -0.0259285103529692, 0.7452235817909241, 0.5089386105537415, 0, 2, 5, 4, 6, 1, -1., 7, 4, 2, 1, 3., -2.9729790985584259e-003, 0.3295435905456543, 0.5058795213699341, 0, 3, 13, 0, 6, 4, -1., 16, 0, 3, 2, 2., 13, 2, 3, 2, 2., 5.8508329093456268e-003, 0.4857144057750702, 0.5793024897575378, 0, 2, 1, 2, 18, 12, -1., 1, 6, 18, 4, 3., -0.0459675192832947, 0.4312731027603149, 0.5380653142929077, 0, 2, 3, 2, 17, 12, -1., 3, 6, 17, 4, 3., 0.1558596044778824, 0.5196170210838318, 0.1684713959693909, 0, 2, 5, 14, 7, 3, -1., 5, 15, 7, 1, 3., 0.0151648297905922, 0.4735757112503052, 0.6735026836395264, 0, 2, 10, 14, 1, 3, -1., 10, 15, 1, 1, 3., -1.0604249546304345e-003, 0.5822926759719849, 0.4775702953338623, 0, 2, 3, 14, 3, 3, -1., 3, 15, 3, 1, 3., 6.6476291976869106e-003, 0.4999198913574219, 0.2319535017013550, 0, 2, 14, 4, 6, 6, -1., 14, 6, 6, 2, 3., -0.0122311301529408, 0.4750893115997315, 0.5262982249259949, 0, 2, 0, 4, 6, 6, -1., 0, 6, 6, 2, 3., 5.6528882123529911e-003, 0.5069767832756043, 0.3561818897724152, 0, 2, 12, 5, 4, 3, -1., 12, 6, 4, 1, 3., 1.2977829901501536e-003, 0.4875693917274475, 0.5619062781333923, 0, 2, 4, 5, 4, 3, -1., 4, 6, 4, 1, 3., 0.0107815898954868, 0.4750770032405853, 0.6782308220863342, 0, 2, 18, 0, 2, 6, -1., 18, 2, 2, 2, 3., 2.8654779307544231e-003, 0.5305461883544922, 0.4290736019611359, 0, 2, 8, 1, 4, 9, -1., 10, 1, 2, 9, 2., 2.8663428965955973e-003, 0.4518479108810425, 0.5539351105690002, 0, 2, 6, 6, 8, 2, -1., 6, 6, 4, 2, 2., -5.1983320154249668e-003, 0.4149119853973389, 0.5434188842773438, 0, 3, 6, 5, 4, 2, -1., 6, 5, 2, 1, 2., 8, 6, 2, 1, 2., 5.3739990107715130e-003, 0.4717896878719330, 0.6507657170295715, 0, 2, 10, 5, 2, 3, -1., 10, 6, 2, 1, 3., -0.0146415298804641, 0.2172164022922516, 0.5161777138710022, 0, 2, 9, 5, 1, 3, -1., 9, 6, 1, 1, 3., -1.5042580344015732e-005, 0.5337383747100830, 0.4298836886882782, 0, 2, 9, 10, 2, 2, -1., 9, 11, 2, 1, 2., -1.1875660129589960e-004, 0.4604594111442566, 0.5582447052001953, 0, 2, 0, 8, 4, 3, -1., 0, 9, 4, 1, 3., 0.0169955305755138, 0.4945895075798035, 0.0738800764083862, 0, 2, 6, 0, 8, 6, -1., 6, 3, 8, 3, 2., -0.0350959412753582, 0.7005509138107300, 0.4977591037750244, 0, 3, 1, 0, 6, 4, -1., 1, 0, 3, 2, 2., 4, 2, 3, 2, 2., 2.4217350874096155e-003, 0.4466265141963959, 0.5477694272994995, 0, 2, 13, 0, 3, 7, -1., 14, 0, 1, 7, 3., -9.6340337768197060e-004, 0.4714098870754242, 0.5313338041305542, 0, 2, 9, 16, 2, 2, -1., 9, 17, 2, 1, 2., 1.6391130338888615e-004, 0.4331546127796173, 0.5342242121696472, 0, 2, 11, 4, 6, 10, -1., 11, 9, 6, 5, 2., -0.0211414601653814, 0.2644700109958649, 0.5204498767852783, 0, 2, 0, 10, 19, 2, -1., 0, 11, 19, 1, 2., 8.7775202700868249e-004, 0.5208349823951721, 0.4152742922306061, 0, 2, 9, 5, 8, 9, -1., 9, 8, 8, 3, 3., -0.0279439203441143, 0.6344125270843506, 0.5018811821937561, 0, 2, 4, 0, 3, 7, -1., 5, 0, 1, 7, 3., 6.7297378554940224e-003, 0.5050438046455383, 0.3500863909721375, 0, 3, 8, 6, 4, 12, -1., 10, 6, 2, 6, 2., 8, 12, 2, 6, 2., 0.0232810396701097, 0.4966318011283875, 0.6968677043914795, 0, 2, 0, 2, 6, 4, -1., 0, 4, 6, 2, 2., -0.0116449799388647, 0.3300260007381439, 0.5049629807472229, 0, 2, 8, 15, 4, 3, -1., 8, 16, 4, 1, 3., 0.0157643090933561, 0.4991598129272461, 0.7321153879165649, 0, 2, 8, 0, 3, 7, -1., 9, 0, 1, 7, 3., -1.3611479662358761e-003, 0.3911735117435455, 0.5160670876502991, 0, 2, 9, 5, 3, 4, -1., 10, 5, 1, 4, 3., -8.1522337859496474e-004, 0.5628911256790161, 0.4949719011783600, 0, 2, 8, 5, 3, 4, -1., 9, 5, 1, 4, 3., -6.0066272271797061e-004, 0.5853595137596130, 0.4550595879554749, 0, 2, 7, 6, 6, 1, -1., 9, 6, 2, 1, 3., 4.9715518252924085e-004, 0.4271470010280609, 0.5443599224090576, 0, 3, 7, 14, 4, 4, -1., 7, 14, 2, 2, 2., 9, 16, 2, 2, 2., 2.3475370835512877e-003, 0.5143110752105713, 0.3887656927108765, 0, 3, 13, 14, 4, 6, -1., 15, 14, 2, 3, 2., 13, 17, 2, 3, 2., -8.9261569082736969e-003, 0.6044502258300781, 0.4971720874309540, 0, 2, 7, 8, 1, 8, -1., 7, 12, 1, 4, 2., -0.0139199104160070, 0.2583160996437073, 0.5000367760658264, 0, 3, 16, 0, 2, 8, -1., 17, 0, 1, 4, 2., 16, 4, 1, 4, 2., 1.0209949687123299e-003, 0.4857374131679535, 0.5560358166694641, 0, 3, 2, 0, 2, 8, -1., 2, 0, 1, 4, 2., 3, 4, 1, 4, 2., -2.7441629208624363e-003, 0.5936884880065918, 0.4645777046680450, 0, 2, 6, 1, 14, 3, -1., 6, 2, 14, 1, 3., -0.0162001308053732, 0.3163014948368073, 0.5193495154380798, 0, 2, 7, 9, 3, 10, -1., 7, 14, 3, 5, 2., 4.3331980705261230e-003, 0.5061224102973938, 0.3458878993988037, 0, 2, 9, 14, 2, 2, -1., 9, 15, 2, 1, 2., 5.8497930876910686e-004, 0.4779017865657806, 0.5870177745819092, 0, 2, 7, 7, 6, 8, -1., 7, 11, 6, 4, 2., -2.2466450463980436e-003, 0.4297851026058197, 0.5374773144721985, 0, 2, 9, 7, 3, 6, -1., 9, 10, 3, 3, 2., 2.3146099410951138e-003, 0.5438671708106995, 0.4640969932079315, 0, 2, 7, 13, 3, 3, -1., 7, 14, 3, 1, 3., 8.7679121643304825e-003, 0.4726893007755280, 0.6771789789199829, 0, 2, 9, 9, 2, 2, -1., 9, 10, 2, 1, 2., -2.2448020172305405e-004, 0.4229173064231873, 0.5428048968315125, 0, 2, 0, 1, 18, 2, -1., 6, 1, 6, 2, 3., -7.4336021207273006e-003, 0.6098880767822266, 0.4683673977851868, 0, 2, 7, 1, 6, 14, -1., 7, 8, 6, 7, 2., -2.3189240600913763e-003, 0.5689436793327332, 0.4424242079257965, 0, 2, 1, 9, 18, 1, -1., 7, 9, 6, 1, 3., -2.1042178850620985e-003, 0.3762221038341522, 0.5187087059020996, 0, 2, 9, 7, 2, 2, -1., 9, 7, 1, 2, 2., 4.6034841216169298e-004, 0.4699405133724213, 0.5771207213401794, 0, 2, 9, 3, 2, 9, -1., 10, 3, 1, 9, 2., 1.0547629790380597e-003, 0.4465216994285584, 0.5601701736450195, 0, 2, 18, 14, 2, 3, -1., 18, 15, 2, 1, 3., 8.7148818420246243e-004, 0.5449805259704590, 0.3914709091186523, 0, 2, 7, 11, 3, 1, -1., 8, 11, 1, 1, 3., 3.3364820410497487e-004, 0.4564009010791779, 0.5645738840103149, 0, 2, 10, 8, 3, 4, -1., 11, 8, 1, 4, 3., -1.4853250468149781e-003, 0.5747377872467041, 0.4692778885364533, 0, 2, 7, 14, 3, 6, -1., 8, 14, 1, 6, 3., 3.0251620337367058e-003, 0.5166196823120117, 0.3762814104557037, 0, 2, 10, 8, 3, 4, -1., 11, 8, 1, 4, 3., 5.0280741415917873e-003, 0.5002111792564392, 0.6151527166366577, 0, 2, 7, 8, 3, 4, -1., 8, 8, 1, 4, 3., -5.8164511574432254e-004, 0.5394598245620728, 0.4390751123428345, 0, 2, 7, 9, 6, 9, -1., 7, 12, 6, 3, 3., 0.0451415292918682, 0.5188326835632324, 0.2063035964965820, 0, 2, 0, 14, 2, 3, -1., 0, 15, 2, 1, 3., -1.0795620037242770e-003, 0.3904685080051422, 0.5137907266616821, 0, 2, 11, 12, 1, 2, -1., 11, 13, 1, 1, 2., 1.5995999274309725e-004, 0.4895322918891907, 0.5427504181861877, 0, 2, 4, 3, 8, 3, -1., 8, 3, 4, 3, 2., -0.0193592701107264, 0.6975228786468506, 0.4773507118225098, 0, 2, 0, 4, 20, 6, -1., 0, 4, 10, 6, 2., 0.2072550952434540, 0.5233635902404785, 0.3034991919994354, 0, 2, 9, 14, 1, 3, -1., 9, 15, 1, 1, 3., -4.1953290929086506e-004, 0.5419396758079529, 0.4460186064243317, 0, 2, 8, 14, 4, 3, -1., 8, 15, 4, 1, 3., 2.2582069505006075e-003, 0.4815764129161835, 0.6027408838272095, 0, 2, 0, 15, 14, 4, -1., 0, 17, 14, 2, 2., -6.7811207845807076e-003, 0.3980278968811035, 0.5183305740356445, 0, 2, 1, 14, 18, 6, -1., 1, 17, 18, 3, 2., 0.0111543098464608, 0.5431231856346130, 0.4188759922981262, 0, 3, 0, 0, 10, 6, -1., 0, 0, 5, 3, 2., 5, 3, 5, 3, 2., 0.0431624315679073, 0.4738228023052216, 0.6522961258888245];
    
                this.data = new Float32Array(classifier);
                this.tilted = false;
            }
    
            return ClassifierFrontalFace;
        }()
    );
    module.exports = ClassifierFrontalFace;
    },{}],7:[function(require,module,exports){
    /**
     * Real-time object detector based on the Viola Jones Framework.
     * Compatible to OpenCV Haar Cascade Classifiers (stump based only).
     *
     * Copyright (c) 2012, Martin Tschirsich
     */
    var od = (function () {
        "use strict";
    
        var /**
             * Converts from a 4-channel RGBA source image to a 1-channel grayscale
             * image. Corresponds to the CV_RGB2GRAY OpenCV color space conversion.
             *
             * @param {Array} src   4-channel 8-bit source image
             * @param {Array} [dst] 1-channel 32-bit destination image
             *
             * @return {Array} 1-channel 32-bit destination image
             */
            convertRgbaToGrayscale = function (src, dst) {
                var srcLength = src.length;
                if (!dst) dst = new Uint32Array(srcLength >> 2);
    
                for (var i = 0; i < srcLength; i += 2) {
                    dst[i >> 2] = (src[i] * 4899 + src[++i] * 9617 + src[++i] * 1868 + 8192) >> 14;
                }
                return dst;
            },
    
            /**
             * Reduces the size of a given image by the given factor. Does NOT
             * perform interpolation. If interpolation is required, prefer using
             * the drawImage() method of the <canvas> element.
             *
             * @param {Array}  src       1-channel source image
             * @param {Number} srcWidth     Width of the source image
             * @param {Number} srcHeight Height of the source image
             * @param {Number} factor    Scaling down factor (> 1.0)
             * @param {Array}  [dst]     1-channel destination image
             *
             * @return {Array} 1-channel destination image
             */
            rescaleImage = function (src, srcWidth, srcHeight, factor, dst) {
                var srcLength = srcHeight * srcWidth,
                    dstWidth = ~~(srcWidth / factor),
                    dstHeight = ~~(srcHeight / factor);
    
                if (!dst) dst = new src.constructor(dstWidth * srcHeight);
    
                for (var x = 0; x < dstWidth; ++x) {
                    var dstIndex = x;
                    for (var srcIndex = ~~(x * factor), srcEnd = srcIndex + srcLength; srcIndex < srcEnd; srcIndex += srcWidth) {
                        dst[dstIndex] = src[srcIndex];
                        dstIndex += dstWidth;
                    }
                }
    
                var dstIndex = 0;
                for (var y = 0, yEnd = dstHeight * factor; y < yEnd; y += factor) {
                    for (var srcIndex = ~~y * dstWidth, srcEnd = srcIndex + dstWidth; srcIndex < srcEnd; ++srcIndex) {
                        dst[dstIndex] = dst[srcIndex];
                        ++dstIndex;
                    }
                }
                return dst;
            },
    
            /**
             * Horizontally mirrors a 1-channel source image.
             *
             * @param {Array}  src       1-channel source image
             * @param {Number} srcWidth  Width of the source image
             * @param {Number} srcHeight Height of the source image
             * @param {Array} [dst]      1-channel destination image
             *
             * @return {Array} 1-channel destination image
             */
            mirrorImage = function (src, srcWidth, srcHeight, dst) {
                if (!dst) dst = new src.constructor(srcWidth * srcHeight);
    
                var index = 0;
                for (var y = 0; y < srcHeight; ++y) {
                    for (var x = (srcWidth >> 1); x >= 0; --x) {
                        var swap = src[index + x];
                        dst[index + x] = src[index + srcWidth - 1 - x];
                        dst[index + srcWidth - 1 - x] = swap;
                    }
                    index += srcWidth;
                }
                return dst;
            },
    
            /**
             * Computes the gradient magnitude using a sobel filter after
             * applying gaussian smoothing (5x5 filter size). Useful for canny
             * pruning.
             *
             * @param {Array}  src      1-channel source image
             * @param {Number} srcWidth Width of the source image
             * @param {Number} srcWidth Height of the source image
             * @param {Array}  [dst]    1-channel destination image
             *
             * @return {Array} 1-channel destination image
             */
            computeCanny = function (src, srcWidth, srcHeight, dst) {
                var srcLength = srcWidth * srcHeight;
                if (!dst) dst = new src.constructor(srcLength);
                var buffer1 = dst === src ? new src.constructor(srcLength) : dst;
                var buffer2 = new src.constructor(srcLength);
    
                // Gaussian filter with size=5, sigma=sqrt(2) horizontal pass:
                for (var x = 2; x < srcWidth - 2; ++x) {
                    var index = x;
                    for (var y = 0; y < srcHeight; ++y) {
                        buffer1[index] =
                            0.1117 * src[index - 2] +
                            0.2365 * src[index - 1] +
                            0.3036 * src[index] +
                            0.2365 * src[index + 1] +
                            0.1117 * src[index + 2];
                        index += srcWidth;
                    }
                }
    
                // Gaussian filter with size=5, sigma=sqrt(2) vertical pass:
                for (var x = 0; x < srcWidth; ++x) {
                    var index = x + srcWidth;
                    for (var y = 2; y < srcHeight - 2; ++y) {
                        index += srcWidth;
                        buffer2[index] =
                            0.1117 * buffer1[index - srcWidth - srcWidth] +
                            0.2365 * buffer1[index - srcWidth] +
                            0.3036 * buffer1[index] +
                            0.2365 * buffer1[index + srcWidth] +
                            0.1117 * buffer1[index + srcWidth + srcWidth];
                    }
                }
    
                // Compute gradient:
                var abs = Math.abs;
                for (var x = 2; x < srcWidth - 2; ++x) {
                    var index = x + srcWidth;
                    for (var y = 2; y < srcHeight - 2; ++y) {
                        index += srcWidth;
    
                        dst[index] =
                            abs(-buffer2[index - 1 - srcWidth]
                                + buffer2[index + 1 - srcWidth]
                                - 2 * buffer2[index - 1]
                                + 2 * buffer2[index + 1]
                                - buffer2[index - 1 + srcWidth]
                                + buffer2[index + 1 + srcWidth]) +
    
                            abs(buffer2[index - 1 - srcWidth]
                                + 2 * buffer2[index - srcWidth]
                                + buffer2[index + 1 - srcWidth]
                                - buffer2[index - 1 + srcWidth]
                                - 2 * buffer2[index + srcWidth]
                                - buffer2[index + 1 + srcWidth]);
                    }
                }
                return dst;
            },
    
            /**
             * Computes the integral image of a 1-channel image. Arithmetic
             * overflow may occur if the integral exceeds the limits for the
             * destination image values ([0, 2^32-1] for an unsigned 32-bit image).
             * The integral image is 1 pixel wider both in vertical and horizontal
             * dimension compared to the source image.
             *
             * SAT = Summed Area Table.
             *
             * @param {Array}       src       1-channel source image
             * @param {Number}      srcWidth  Width of the source image
             * @param {Number}      srcHeight Height of the source image
             * @param {Uint32Array} [dst]     1-channel destination image
             *
             * @return {Uint32Array} 1-channel destination image
             */
            computeSat = function (src, srcWidth, srcHeight, dst) {
                var dstWidth = srcWidth + 1;
    
                if (!dst) dst = new Uint32Array(srcWidth * srcHeight + dstWidth + srcHeight);
    
                for (var i = srcHeight * dstWidth; i >= 0; i -= dstWidth)
                    dst[i] = 0;
    
                for (var x = 1; x <= srcWidth; ++x) {
                    var column_sum = 0;
                    var index = x;
                    dst[x] = 0;
    
                    for (var y = 1; y <= srcHeight; ++y) {
                        column_sum += src[index - y];
                        index += dstWidth;
                        dst[index] = dst[index - 1] + column_sum;
                    }
                }
                return dst;
            },
    
            /**
             * Computes the squared integral image of a 1-channel image.
             * @see computeSat()
             *
             * @param {Array}       src       1-channel source image
             * @param {Number}      srcWidth  Width of the source image
             * @param {Number}      srcHeight Height of the source image
             * @param {Uint32Array} [dst]     1-channel destination image
             *
             * @return {Uint32Array} 1-channel destination image
             */
            computeSquaredSat = function (src, srcWidth, srcHeight, dst) {
                var dstWidth = srcWidth + 1;
    
                if (!dst) dst = new Uint32Array(srcWidth * srcHeight + dstWidth + srcHeight);
    
                for (var i = srcHeight * dstWidth; i >= 0; i -= dstWidth)
                    dst[i] = 0;
    
                for (var x = 1; x <= srcWidth; ++x) {
                    var column_sum = 0;
                    var index = x;
                    dst[x] = 0;
                    for (var y = 1; y <= srcHeight; ++y) {
                        var val = src[index - y];
                        column_sum += val * val;
                        index += dstWidth;
                        dst[index] = dst[index - 1] + column_sum;
                    }
                }
                return dst;
            },
    
            /**
             * Computes the rotated / tilted integral image of a 1-channel image.
             * @see computeSat()
             *
             * @param {Array}       src       1-channel source image
             * @param {Number}      srcWidth  Width of the source image
             * @param {Number}      srcHeight Height of the source image
             * @param {Uint32Array} [dst]     1-channel destination image
             *
             * @return {Uint32Array} 1-channel destination image
             */
            computeRsat = function (src, srcWidth, srcHeight, dst) {
                var dstWidth = srcWidth + 1,
                    srcHeightTimesDstWidth = srcHeight * dstWidth;
    
                if (!dst) dst = new Uint32Array(srcWidth * srcHeight + dstWidth + srcHeight);
    
                for (var i = srcHeightTimesDstWidth; i >= 0; i -= dstWidth)
                    dst[i] = 0;
    
                for (var i = 0; i < dstWidth; ++i)
                    dst[i] = 0;
    
                var index = 0;
                for (var y = 0; y < srcHeight; ++y) {
                    for (var x = 0; x < srcWidth; ++x) {
                        dst[index + dstWidth + 1] = src[index - y] + dst[index];
                        ++index;
                    }
                    dst[index + dstWidth] += dst[index];
                    index++;
                }
    
                for (var x = srcWidth - 1; x > 0; --x) {
                    var index = x + srcHeightTimesDstWidth;
                    for (var y = srcHeight; y > 0; --y) {
                        index -= dstWidth;
                        dst[index + dstWidth] += dst[index] + dst[index + 1];
                    }
                }
    
                return dst;
            },
    
            /**
             * Equalizes the histogram of an unsigned 1-channel image with integer
             * values in [0, 255]. Corresponds to the equalizeHist OpenCV function.
             *
             * @param {Array}  src   1-channel integer source image
             * @param {Number} step  Sampling stepsize, increase for performance
             * @param {Array}  [dst] 1-channel destination image
             *
             * @return {Array} 1-channel destination image
             */
            equalizeHistogram = function (src, step, dst) {
                var srcLength = src.length;
                if (!dst) dst = src;
                if (!step) step = 5;
    
                // Compute histogram and histogram sum:
                var hist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0];
    
                for (var i = 0; i < srcLength; i += step) {
                    ++hist[src[i]];
                }
    
                // Compute integral histogram:
                var norm = 255 * step / srcLength,
                    prev = 0;
                for (var i = 0; i < 256; ++i) {
                    var h = hist[i];
                    prev = h += prev;
                    hist[i] = h * norm; // For non-integer src: ~~(h * norm + 0.5);
                }
    
                // Equalize image:
                for (var i = 0; i < srcLength; ++i) {
                    dst[i] = hist[src[i]];
                }
                return dst;
            },
    
            /**
             * Horizontally mirrors a cascase classifier. Useful to detect mirrored
             * objects such as opposite hands.
             *
             * @param {Array} dst Cascade classifier
             *
             * @return {Array} Mirrored cascade classifier
             */
            mirrorClassifier = function (src, dst) {
                if (!dst) dst = new src.constructor(src);
                var windowWidth = src[0];
    
                for (var i = 1, iEnd = src.length - 1; i < iEnd;) {
                    ++i;
                    for (var j = 0, jEnd = src[++i]; j < jEnd; ++j) {
                        if (src[++i]) {
                            // Simple classifier is tilted:
                            for (var kEnd = i + src[++i] * 5; i < kEnd;) {
                                dst[i + 1] = windowWidth - src[i + 1];
                                var width = src[i + 3];
                                dst[i + 3] = src[i + 4];
                                dst[i + 4] = width;
                                i += 5;
                            }
                        } else {
                            // Simple classifier is not tilted:
                            for (var kEnd = i + src[++i] * 5; i < kEnd;) {
                                dst[i + 1] = windowWidth - src[i + 1] - src[i + 3];
                                i += 5;
                            }
                        }
                        i += 3;
                    }
                }
                return dst;
            },
    
            /**
             * Compiles a cascade classifier to be applicable to images
             * of given dimensions. Speeds-up the actual detection process later on.
             *
             * @param {Array}        src    Cascade classifier
             * @param {Number}       width  Width of the source image
             * @param {Float32Array} [dst]  Compiled cascade classifier
             *
             * @return {Float32Array} Compiled cascade classifier
             */
            compileClassifier = function (src, width, scale, dst) {
                width += 1;
                if (!dst) dst = new Float32Array(src.length);
                var dstUint32 = new Uint32Array(dst.buffer);
    
                dstUint32[0] = src[0];
                dstUint32[1] = src[1];
                var dstIndex = 1;
                for (var srcIndex = 1, iEnd = src.length - 1; srcIndex < iEnd;) {
                    dst[++dstIndex] = src[++srcIndex];
    
                    var numComplexClassifiers = dstUint32[++dstIndex] = src[++srcIndex];
                    for (var j = 0, jEnd = numComplexClassifiers; j < jEnd; ++j) {
    
                        var tilted = dst[++dstIndex] = src[++srcIndex];
                        var numFeaturesTimes3 = dstUint32[++dstIndex] = src[++srcIndex] * 3;
                        if (tilted) {
                            for (var kEnd = dstIndex + numFeaturesTimes3; dstIndex < kEnd;) {
                                dstUint32[++dstIndex] = src[++srcIndex] + src[++srcIndex] * width;
                                dstUint32[++dstIndex] = src[++srcIndex] * (width + 1) + ((src[++srcIndex] * (width - 1)) << 16);
                                dst[++dstIndex] = src[++srcIndex];
                            }
                        } else {
                            for (var kEnd = dstIndex + numFeaturesTimes3; dstIndex < kEnd;) {
                                dstUint32[++dstIndex] = src[++srcIndex] + src[++srcIndex] * width;
                                dstUint32[++dstIndex] = src[++srcIndex] + ((src[++srcIndex] * width) << 16);
                                dst[++dstIndex] = src[++srcIndex];
                            }
                        }
    
                        var inverseClassifierThreshold = 1 / src[++srcIndex];
                        for (var k = 0; k < numFeaturesTimes3;) {
                            dst[dstIndex - k] *= inverseClassifierThreshold;
                            k += 3;
                        }
    
                        if (inverseClassifierThreshold < 0) {
                            dst[dstIndex + 2] = src[++srcIndex];
                            dst[dstIndex + 1] = src[++srcIndex];
                            dstIndex += 2;
                        } else {
                            dst[++dstIndex] = src[++srcIndex];
                            dst[++dstIndex] = src[++srcIndex];
                        }
                    }
                }
                return dst.subarray(0, dstIndex + 1);
            },
    
            /**
             * Evaluates a compiled cascade classifier. Sliding window approach.
             *
             * @param {Uint32Array}  sat        SAT of the source image
             * @param {Uint32Array}  rsat       Rotated SAT of the source image
             * @param {Uint32Array}  ssat       Squared SAT of the source image
             * @param {Uint32Array}  [cannySat] SAT of the canny source image
             * @param {Number}       width      Width of the source image
             * @param {Number}       height     Height of the source image
             * @param {Number}       step       Stepsize, increase for performance
             * @param {Float32Array} classifier Compiled cascade classifier
             *
             * @return {Array} Rectangles representing detected objects
             */
            detect = function (sat, rsat, ssat, cannySat, width, height, step, classifier) {
                width += 1;
                height += 1;
    
                var classifierUint32 = new Uint32Array(classifier.buffer),
                    windowWidth = classifierUint32[0],
                    windowHeight = classifierUint32[1],
                    windowHeightTimesWidth = windowHeight * width,
                    area = windowWidth * windowHeight,
                    inverseArea = 1 / area,
                    widthTimesStep = width * step,
                    rects = [];
    
                for (var x = 0; x + windowWidth < width; x += step) {
                    var satIndex = x;
                    for (var y = 0; y + windowHeight < height; y += step) {
                        var satIndex1 = satIndex + windowWidth,
                            satIndex2 = satIndex + windowHeightTimesWidth,
                            satIndex3 = satIndex2 + windowWidth,
                            canny = false;
    
                        // Canny test:
                        if (cannySat) {
                            var edgesDensity = (cannySat[satIndex] -
                                cannySat[satIndex1] -
                                cannySat[satIndex2] +
                                cannySat[satIndex3]) * inverseArea;
                            if (edgesDensity < 60 || edgesDensity > 200) {
                                canny = true;
                                satIndex += widthTimesStep;
                                continue;
                            }
                        }
    
                        // Normalize mean and variance of window area:
                        var mean = (sat[satIndex] -
                            sat[satIndex1] -
                            sat[satIndex2] +
                            sat[satIndex3]),
    
                            variance = (ssat[satIndex] -
                                ssat[satIndex1] -
                                ssat[satIndex2] +
                                ssat[satIndex3]) * area - mean * mean,
    
                            std = variance > 1 ? Math.sqrt(variance) : 1,
                            found = true;
    
                        // Evaluate cascade classifier aka 'stages':
                        for (var i = 1, iEnd = classifier.length - 1; i < iEnd;) {
                            var complexClassifierThreshold = classifier[++i];
                            // Evaluate complex classifiers aka 'trees':
                            var complexClassifierSum = 0;
                            for (var j = 0, jEnd = classifierUint32[++i]; j < jEnd; ++j) {
    
                                // Evaluate simple classifiers aka 'nodes':
                                var simpleClassifierSum = 0;
    
                                if (classifierUint32[++i]) {
                                    // Simple classifier is tilted:
                                    for (var kEnd = i + classifierUint32[++i]; i < kEnd;) {
                                        var f1 = satIndex + classifierUint32[++i],
                                            packed = classifierUint32[++i],
                                            f2 = f1 + (packed & 0xFFFF),
                                            f3 = f1 + (packed >> 16 & 0xFFFF);
    
                                        simpleClassifierSum += classifier[++i] *
                                            (rsat[f1] - rsat[f2] - rsat[f3] + rsat[f2 + f3 - f1]);
                                    }
                                } else {
                                    // Simple classifier is not tilted:
                                    for (var kEnd = i + classifierUint32[++i]; i < kEnd;) {
                                        var f1 = satIndex + classifierUint32[++i],
                                            packed = classifierUint32[++i],
                                            f2 = f1 + (packed & 0xFFFF),
                                            f3 = f1 + (packed >> 16 & 0xFFFF);
    
                                        simpleClassifierSum += classifier[++i] *
                                            (sat[f1] - sat[f2] - sat[f3] + sat[f2 + f3 - f1]);
                                    }
                                }
                                complexClassifierSum += classifier[i + (simpleClassifierSum > std ? 2 : 1)];
                                i += 2;
                            }
                            if (complexClassifierSum < complexClassifierThreshold) {
                                found = false;
                                break;
                            }
                        }
                        if (found) rects.push([x, y, windowWidth, windowHeight]);
                        satIndex += widthTimesStep;
                    }
                }
                return rects;
            },
    
            /**
             * Groups rectangles together using a rectilinear distance metric. For
             * each group of related rectangles, a representative mean rectangle
             * is returned.
             *
             * @param {Array}  rects        Rectangles (Arrays of 4 floats)
             * @param {Number} minNeighbors Minimum neighbors for returned groups
             * @param {Number} confluence    Neighbor distance threshold factor
             * @return {Array} Mean rectangles (Arrays of 4 floats)
             */
            groupRectangles = function (rects, minNeighbors, confluence) {
                var rectsLength = rects.length;
                if (!confluence) confluence = 0.25;
    
                // Partition rects into similarity classes:
                var numClasses = 0;
                var labels = new Array(rectsLength);
                for (var i = 0; i < rectsLength; ++i) {
                    labels[i] = 0;
                }
    
                var abs = Math.abs, min = Math.min;
                for (var i = 0; i < rectsLength; ++i) {
                    var found = false;
                    for (var j = 0; j < i; ++j) {
    
                        // Determine similarity:
                        var rect1 = rects[i];
                        var rect2 = rects[j];
                        var delta = confluence * (min(rect1[2], rect2[2]) + min(rect1[3], rect2[3]));
                        if (abs(rect1[0] - rect2[0]) <= delta &&
                            abs(rect1[1] - rect2[1]) <= delta &&
                            abs(rect1[0] + rect1[2] - rect2[0] - rect2[2]) <= delta &&
                            abs(rect1[1] + rect1[3] - rect2[1] - rect2[3]) <= delta) {
    
                            labels[i] = labels[j];
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        labels[i] = numClasses++;
                    }
                }
    
                // Compute average rectangle (group) for each cluster:
                var groups = new Array(numClasses);
    
                for (var i = 0; i < numClasses; ++i) {
                    groups[i] = [0, 0, 0, 0, 0];
                }
    
                for (var i = 0; i < rectsLength; ++i) {
                    var rect = rects[i],
                        group = groups[labels[i]];
                    group[0] += rect[0];
                    group[1] += rect[1];
                    group[2] += rect[2];
                    group[3] += rect[3];
                    ++group[4];
                }
    
                for (var i = 0; i < numClasses; ++i) {
                    var numNeighbors = groups[i][4];
                    if (numNeighbors >= minNeighbors) {
                        var group = groups[i];
                        numNeighbors = 1 / numNeighbors;
                        group[0] *= numNeighbors;
                        group[1] *= numNeighbors;
                        group[2] *= numNeighbors;
                        group[3] *= numNeighbors;
                    } else groups.splice(i, 1);
                }
    
                // Filter out small rectangles inside larger rectangles:
                var filteredGroups = [];
                for (var i = 0; i < numClasses; ++i) {
                    var r1 = groups[i];
    
                    for (var j = i + 1; j < numClasses; ++j) {
                        var r2 = groups[j];
    
                        var dx = r2[2] * confluence;// * 0.2;
                        var dy = r2[3] * confluence;// * 0.2;
    
                        // Not antisymmetric, must check both r1 > r2 and r2 > r1:
                        if ((r1[0] >= r2[0] - dx &&
                                r1[1] >= r2[1] - dy &&
                                r1[0] + r1[2] <= r2[0] + r2[2] + dx &&
                                r1[1] + r1[3] <= r2[1] + r2[3] + dy) ||
                            (r2[0] >= r1[0] - dx &&
                                r2[1] >= r1[1] - dy &&
                                r2[0] + r2[2] <= r1[0] + r1[2] + dx &&
                                r2[1] + r2[3] <= r1[1] + r1[3] + dy)) {
                            break;
                        }
                    }
    
                    if (j === numClasses) {
                        filteredGroups.push(r1);
                    }
                }
                return filteredGroups;
            };
    
        var detector = (function () {
    
            /**
             * Creates a new detector - basically a convenient wrapper class around
             * the js-objectdetect functions and hides away the technical details
             * of multi-scale object detection on image, video or canvas elements.
             *
             * @param width       Width of the detector
             * @param height      Height of the detector
             * @param scaleFactor Scaling factor for multi-scale detection
             * @param classifier  Compiled cascade classifier
             */
            function detector(width, height, scaleFactor, classifier) {
                this.canvas = document.createElement('canvas');
                this.canvas.width = width;
                this.canvas.height = height;
                this.context = this.canvas.getContext('2d');
                this.tilted = classifier.tilted;
                this.scaleFactor = scaleFactor;
                this.numScales = ~~(Math.log(Math.min(width / classifier.data[0], height / classifier.data[1])) / Math.log(scaleFactor));
                this.scaledGray = new Uint32Array(width * height);
                this.compiledClassifiers = [];
                var scale = 1;
                for (var i = 0; i < this.numScales; ++i) {
                    var scaledWidth = ~~(width / scale);
                    this.compiledClassifiers[i] = od.compileClassifier(classifier.data, scaledWidth);
                    scale *= scaleFactor;
                }
            }
    
            /**
             * Multi-scale object detection on image, video or canvas elements.
             *
             * @param image          HTML image, video or canvas element
             * @param [group]        Detection results will be grouped by proximity
             * @param [stepSize]     Increase for performance
             * @param [roi]          Region of interest, i.e. search window
             *
             * @return Grouped rectangles
             */
            detector.prototype.detect = function (image, group, stepSize, roi, canny) {
                if (stepSize === undefined) stepSize = 1;
                if (group === undefined) group = 1;
    
                var width = this.canvas.width;
                var height = this.canvas.height;
    
                if (roi)
                    this.context.drawImage(image, roi[0], roi[1], roi[2], roi[3], 0, 0, width, height);
                else
                    this.context.drawImage(image, 0, 0, width, height);
                var imageData = this.context.getImageData(0, 0, width, height).data;
                this.gray = od.convertRgbaToGrayscale(imageData, this.gray);
    
                var rects = [];
                var scale = 1;
                for (var i = 0; i < this.numScales; ++i) {
                    var scaledWidth = ~~(width / scale);
                    var scaledHeight = ~~(height / scale);
    
                    if (scale === 1) {
                        this.scaledGray.set(this.gray);
                    } else {
                        this.scaledGray = od.rescaleImage(this.gray, width, height, scale, this.scaledGray);
                    }
    
                    if (canny) {
                        this.canny = od.computeCanny(this.scaledGray, scaledWidth, scaledHeight, this.canny);
                        this.cannySat = od.computeSat(this.canny, scaledWidth, scaledHeight, this.cannySat);
                    }
    
                    this.sat = od.computeSat(this.scaledGray, scaledWidth, scaledHeight, this.sat);
                    this.ssat = od.computeSquaredSat(this.scaledGray, scaledWidth, scaledHeight, this.ssat);
                    if (this.tilted) this.rsat = od.computeRsat(this.scaledGray, scaledWidth, scaledHeight, this.rsat);
    
                    var newRects = od.detect(this.sat, this.rsat, this.ssat, this.cannySat, scaledWidth, scaledHeight, stepSize, this.compiledClassifiers[i]);
                    for (var j = newRects.length - 1; j >= 0; --j) {
                        var newRect = newRects[j];
                        newRect[0] *= scale;
                        newRect[1] *= scale;
                        newRect[2] *= scale;
                        newRect[3] *= scale;
                    }
                    rects = rects.concat(newRects);
    
                    scale *= this.scaleFactor;
                }
                return (group ? od.groupRectangles(rects, group) : rects).sort(function (r1, r2) {
                    return r2[4] - r1[4];
                });
            };
    
            return detector;
        })();
    
        return {
            convertRgbaToGrayscale: convertRgbaToGrayscale,
            rescaleImage: rescaleImage,
            mirrorImage: mirrorImage,
            computeCanny: computeCanny,
            equalizeHistogram: equalizeHistogram,
            computeSat: computeSat,
            computeRsat: computeRsat,
            computeSquaredSat: computeSquaredSat,
            mirrorClassifier: mirrorClassifier,
            compileClassifier: compileClassifier,
            detect: detect,
            groupRectangles: groupRectangles,
            detector: detector
        };
    })();
    
    module.exports = od;
    },{}]},{},[1])(1)
    });
    
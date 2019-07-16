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
                {x: x, y: y}, this.latestUpdatedPosition )) {
                var _this = this;

                // 1.Enter the latest coordinates(x,y) into the lowpass filter.
                _this._lowpass4x.putValue(this.latestUpdatedPosition.x);
                _this._lowpass4y.putValue(this.latestUpdatedPosition.y);

                // 2.Update coordinates(this.x,this.y) with a value filtered by lowpass filter.
                _this.x = _this._lowpass4x.getFilteredValue();
                _this.y = _this._lowpass4y.getFilteredValue();
            }
            this.latestUpdatedPosition = {x: x, y: y};
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

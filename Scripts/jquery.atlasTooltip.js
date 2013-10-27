// ========================================================================================== //
// Atlas Tooltip (v0.95)
// by Radney Aaron Alquiza
// v0.96 - Oct 27, 2013 : 1:18AM
// v0.97 - Oct 27, 2013 : 4:06AM
// ========================================================================================== //

// this tooltip plugin can be applied to any element on the viewport

/* BUILT WITH: jQuery 1.9.1 */


// NOTES:
// * This plugin wraps any NON-HTML content passed into it into a <p> tag.
// * If you pass a string containing HTML tags, the plugin simply appends this html element
// * settings.thisobject is the object you passed when you initialized the plugin. This is the DOM element
// you actually hover on.

/* as of version 0.96, you can add multiple tooltips on a single element.
HOWEVER, this opens a possibility of a bug where you may add 2 tooltips in the same position,
making one cover the other.
*/


(function ($) {

    $.fn.atlasTooltip = function (options_or_method, otherparams) {
        // default settings
        var atlastool = {
            textSize: '0.9em',
            contents: 'Default tooltip',
            pos: 'bottom',
        };

        var domelement = null;
        if (methods != null) {
            // if the parameter passed is nothing or a javascript object
            if (otherparams == null && options_or_method == null || (typeof options_or_method === 'object' && options_or_method != null)) {
                if (domelement == null) {
                    this.data('atlastool', $.extend({}, atlastool, options_or_method));
                    domelement = methods['initialize'](this, options_or_method);
                }
                return domelement;
            }
                // if the parameter passed is a string for a method
            else if (typeof options_or_method == "string" && otherparams == null) {
                return methods[options_or_method](this.data('atlastool'));
            }
            else if (typeof options_or_method == "string" && otherparams != null) {
                domelement = methods[options_or_method](this.data('atlastool'), otherparams);
                return domelement;
            }
        }
    }

    function decidePosition(pos) {

        switch (pos) {
            case 'top':
                return "atlas-tooltip-top";
            case 'bottom':
                return "atlas-tooltip-bottom";
            case 'left':
                return "atlas-tooltip-left";
            case 'right':
                return "atlas-tooltip-right";
            default:
                return "atlas-tooltip-top";
        }
    }

    function setPosition(settings) {
        var vtop = settings.thisobject.offset().top;
        var vleft = settings.thisobject.offset().left;
        var ht = settings.thisobject.outerHeight();
        var wt = settings.thisobject.outerWidth();
        
        switch (settings.pos) {
            case 'top':
                settings.thisobject.tooltip.addClass('atlas-top');
                settings.thisobject.tooltip.css({
                    'font-size': settings.textSize,
                });
                settings.thisobject.tooltip.offset({
                    top: vtop - settings.thisobject.tooltip.outerHeight(),
                    left: (vleft + (wt / 2)) - (settings.thisobject.tooltip.outerWidth()/2)
                });
                break;
            case 'bottom':
                settings.thisobject.tooltip.addClass('atlas-bottom');
                settings.thisobject.tooltip.css({
                    'font-size': settings.textSize,
                });
                settings.thisobject.tooltip.offset({
                    top: vtop + ht,
                    left: (vleft + (wt / 2)) - (settings.thisobject.tooltip.outerWidth() / 2)
                });
                break;
            case 'left':
                settings.thisobject.tooltip.addClass('atlas-left');
                settings.thisobject.tooltip.css({
                    'font-size': settings.textSize,
                });
                settings.thisobject.tooltip.offset({
                    top: (vtop + (ht / 2)) - (settings.thisobject.tooltip.outerHeight() / 2),
                    left: vleft - settings.thisobject.tooltip.outerWidth()
                });
                break;
            case 'right':
                settings.thisobject.tooltip.addClass('atlas-right');
                settings.thisobject.tooltip.css({
                    'font-size': settings.textSize,
                });
                settings.thisobject.tooltip.offset({
                    top: (vtop + (ht / 2)) - (settings.thisobject.tooltip.outerHeight() / 2),
                    left: vleft + wt
                });
                break;
            default:
                settings.thisobject.tooltip.addClass('atlas-top');
                settings.thisobject.tooltip.css({
                    'font-size': settings.fontSize,
                    'top': (top - settings.thisobject.tooltip.outerHeight() + 3) + 'px',
                    'left': ((left + (wt / 2)) - (settings.thisobject.tooltip.outerWidth() / 2)) + 'px'
                });
                break;
        }
    }
    function addTooltip(settings) {

        var posclass = decidePosition(settings.pos);
        var tool = $("<div class='atlas-tooltipContainer'></div>");

        /*var parent = settings.thisobject.parents().filter(function () {
// reduce to only relative position or "body" elements
return $(this).is('body') || $(this).css('position') == 'relative';
}).slice(0, 1); // grab only the "first"
*/

        $('body').append(tool);
        settings.thisobject.tooltip = tool;

        var toolinner = $("<div class='" + posclass + "'></div>");

        settings.thisobject.tooltip.append(toolinner);
        settings.thisobject.toolinner = toolinner;
        if (/(<([^>]+)>)/ig.test(settings.contents) && typeof settings.contents == "string")
            settings.thisobject.toolinner.append(settings.contents);
        else if (typeof settings.contents != "string")
            settings.contents.appendTo(settings.thisobject.toolinner);
        else
            settings.thisobject.toolinner.append('<span>' + settings.contents + '</span>');

       
        addEvents(settings);
    }

    function addEvents(settings) {
        settings.thisobject.tooltip.hover(
            function () { $(this).addClass('atlas-showTool-' + settings.pos); },
            function () { $(this).removeClass('atlas-showTool-' + settings.pos); }
        );
        settings.thisobject.hover(
            // hover in
            function () { setPosition(settings); settings.thisobject.tooltip.addClass('atlas-showTool-' + settings.pos); },
            // hover out
            function () { setPosition(settings); settings.thisobject.tooltip.removeClass('atlas-showTool-' + settings.pos); }
        );
    }

    var methods = {
        // =============================================================================
        // INITIALIZE - attach the plugin, attach events, attach css
        // =============================================================================
        initialize: function (object, options) {


            return object.each(function () {
                var settings = $(this).data('atlastool');
                settings.thisobject = $(this);

                if (settings.tooltip == null) {
                    addTooltip(settings);
                }

                // bind the jquery reference to the element (the div or any container)
                $(this).data('data', $(this));
            });
        },
        show: function (settings) {
        },
        hide: function (settings) {
        },
        destroy: function () {

        }
    }


}(jQuery));
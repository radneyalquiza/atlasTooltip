// ========================================================================================== //
// Atlas Tooltip (v0.95)
// by Radney Aaron Alquiza
// v0.96 - Oct 27, 2013 : 1:18AM
// v0.97 - Oct 27, 2013 : 4:06AM
// v0.99 - Nov 16, 2013 : 1:51AM
// v1.00 - Nov 16, 2013 : 2:16AM
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

/* NEW - 0.99 */
// setting the sticky variable from the settings will enable you to manually control
// a tooltip's behaviour (show/hide). It will also have a "X" button on the side to show that the 
// tooltip can be closed.
// The code below will show a tooltip automatically and won't close until you click the X button
// The X button has the "hide" method.
// You can initialize a tooltip without the sticky property and still manually
// show or hide the tooltip.
// $('selector').atlasTooltip({pos:"left", contents:"Test tooltip", sticky:true});

/* NEW - 1.00 */
// - onCreate and onClose callbacks are implemented
// - updatePosition can be called to adjust the position of the tooltip whenever
//   the object tooltipped is re-positioned.

(function ($) {

    $.fn.atlasTooltip = function (options_or_method, otherparams) {
        // default settings
        var atlastool = {
            textSize: '0.9em',
            contents: 'Default tooltip',
            pos: 'bottom',
            onClose: null,
            onCreate: null,
            sticky: false
        };

        var domelement = null;
        if (atlastooltipmethods != null) {
            // if the parameter passed is nothing or a javascript object
            if (otherparams == null && options_or_method == null || (typeof options_or_method === 'object' && options_or_method != null)) {
                if (domelement == null) {
                    this.data('atlastool', $.extend({}, atlastool, options_or_method));
                    domelement = atlastooltipmethods['initialize'](this, options_or_method);
                }
                return domelement;
            }
                // if the parameter passed is a string for a method
            else if (typeof options_or_method == "string" && otherparams == null) {
                return atlastooltipmethods[options_or_method](this.data('atlastool'));
            }
            else if (typeof options_or_method == "string" && otherparams != null) {
                domelement = atlastooltipmethods[options_or_method](this.data('atlastool'), otherparams);
                return domelement;
            }
            //else if (typeof options_or_method == 'function' && otherparams == null) { // make sure the callback is a function
            //    options_or_method.call(this); // brings the scope to the callback
            //}
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
                    top: vtop - settings.thisobject.tooltip.outerHeight() + 5,
                    left: (vleft + (wt / 2)) - (settings.thisobject.tooltip.outerWidth()/2)
                });
                break;
            case 'bottom':
                settings.thisobject.tooltip.addClass('atlas-bottom');
                settings.thisobject.tooltip.css({
                    'font-size': settings.textSize,
                });
                settings.thisobject.tooltip.offset({
                    top: vtop + ht + 5,
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
                    left: vleft - settings.thisobject.tooltip.outerWidth() - 5
                });
                break;
            case 'right':
                settings.thisobject.tooltip.addClass('atlas-right');
                settings.thisobject.tooltip.css({
                    'font-size': settings.textSize,
                });
                settings.thisobject.tooltip.offset({
                    top: (vtop + (ht / 2)) - (settings.thisobject.tooltip.outerHeight() / 2),
                    left: vleft + wt + 5
                });
                break;
            default:
                settings.thisobject.tooltip.addClass('atlas-top');
                settings.thisobject.tooltip.css({
                    'font-size': settings.textSize,
                });
                settings.thisobject.tooltip.offset({
                    top: vtop - settings.thisobject.tooltip.outerHeight() + 5,
                    left: (vleft + (wt / 2)) - (settings.thisobject.tooltip.outerWidth() / 2)
                });
                break;
        }
    }
    function addTooltip(settings) {

        var posclass = decidePosition(settings.pos);
        var tool = $("<div class='atlas-tooltipContainer'></div>");

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

        if (settings.sticky == false) {
            //settings.thisobject.tooltip.on('mouseenter', function () { $(this).addClass('atlas-showTool-' + settings.pos); });
            //settings.thisobject.tooltip.on('mouseleave', function () { $(this).removeClass('atlas-showTool-' + settings.pos); });
            settings.thisobject.on('mouseenter', function () { setPosition(settings); settings.thisobject.tooltip.addClass('atlas-showTool-' + settings.pos); });
            settings.thisobject.on('mouseleave', function () { setPosition(settings); settings.thisobject.tooltip.removeClass('atlas-showTool-' + settings.pos); });
        }
        else {
            atlastooltipmethods['show'](settings);
            if (settings.thisobject.tooltip.find('.stickyclose').length > 0) {
                settings.thisobject.tooltip.find('.stickyclose').click(function () {
                    atlastooltipmethods['hide'](settings);
                });
            }
        }
        if (typeof settings.onCreate == 'function' && settings.onCreate != null) {
            settings.onCreate.call();
        }
    }

    var atlastooltipmethods = {
        // =============================================================================
        // INITIALIZE - attach the plugin, attach events, attach css
        // =============================================================================
        initialize: function (object, options) {


            return object.each(function () {
                if (!$(this).hasClass('hasTooltip')) {
                    console.log('called');
                    var settings = $(this).data('atlastool');
                    settings.thisobject = $(this);
                    if (settings.tooltip == null) {
                        addTooltip(settings);
                    }
                    // bind the jquery reference to the element (the div or any container)
                    $(this).data('data', $(this));
                    $(this).addClass('hasTooltip');
                    //options.onClose.call(this);
                }
            });
        },
        show: function (settings) {
            if (settings.thisobject != null) {
                setPosition(settings);
                settings.thisobject.tooltip.addClass('atlas-showTool-' + settings.pos);
                if (settings.sticky == true) {
                    if (settings.thisobject.tooltip.find('.stickyclose').length < 1)
                        settings.thisobject.tooltip.find('div[class^="atlas-tool"]').append('<span class="stickyclose"></span>');
                    settings.thisobject.tooltip.find('div[class^="atlas-tool"]').addClass('hassticky');
                }
            }
        },
        hide: function (settings) {
            if (settings.thisobject != null) {
                settings.thisobject.tooltip.removeClass('atlas-showTool-' + settings.pos);
                if (typeof settings.onClose == 'function' && settings.onClose != null) {
                    settings.onClose.call();
                }
            }
        },
        updatePostion: function (settings) {
            if (settings.thisobject != null) {
                setPosition(settings);
            }
        },
        destroy: function (settings) {
            if (settings.thisobject != null) {
                settings.thisobject.tooltip.remove();
            }
        }
    }


}(jQuery));
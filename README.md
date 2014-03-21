Response - jqInfiniteSlider
--------------------------------------

A lite-weight js widget for inifinite looping of elements in both directions.

## What does jq.InfiniteSlide.js do?
--------------------------------------

> Out of a collection of images, create an infinite scrolling 
> loop in both directions. Want to move forward 5 slides? no problem.

  - Programatic sliding
  - Touch Friendly
  - Infinite looping of elements

First we need to register the widget with jQuery UI Bridge:
```
$.widget.bridge('DragSlider', DragSlider);
```

Lets say you want to initialise a slider on all containers with the `drag-slider` class:
```
$(".drag-slider").DragSlider();
```

And if you want to move the slider to the 10th element from its start slide:
```
$( "#mainDrag").DragSlider('gotoSlide', 10);
```
NOTE: If there are less elements than the slide number, it will simply loop round until 10 slides have pased. For example, if there are 7 slides and we are on the first slide - it will keepi sliding until it hits the 3rd element the second time.

## What needs to be added:
--------------------------------------
Lots of things need to be added:

  - Remove the coupling to images, both within variable names and jquery selectors
  - Look at removing jquery dependency - pure js babye, yeah!
  - Add config for wrapper container and the inner container
  - Create a less file for the css dependency
  - Destroy method: make one
  - Additional layout options based on responsive breakpoints
  - Add usage into the readme
  - Method to slide to a specific element (selector based)
  - BOWER configuration
  - Gulp optimisation

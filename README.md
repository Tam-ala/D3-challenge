# Data Journalism and D3

![Newsroom](https://media.giphy.com/media/v2xIous7mnEYg/giphy.gif)

## Background

Welcome to the newsroom! You've just accepted a data visualization position for a major metro paper. You're tasked with analyzing the current trends shaping people's lives, as well as creating charts, graphs, and interactive elements to help readers understand your findings.

The editor wants to run a series of feature stories about the health risks facing particular demographics. She's counting on you to sniff out the first story idea by sifting through information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System.

The data set included with the assignment is based on 2014 ACS 1-year estimates: [https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml)

## The Task

### First Step: Static Graph

![4-scatter](Images/4-scatter.jpg)

Create a scatter plot between two of the data variables such as `Healthcare vs. Poverty` or `Smokers vs. Age`. 

* Include state abbreviations in the circles.

* Create and situate axes and labels to the left and bottom of the chart.


### Second Step: Interactive Graph

![7-animated-scatter](Images/7-animated-scatter.gif)

#### 1. More Data, More Dynamics
This step includes more demographics and more risk factors. It has additional labels with click events so that users can decide which data to display. Animate the transitions for the circles' locations as well as the range of the axes. In the end, three risk factors were added to each axis.

#### 2. Incorporate d3-tip

Add tooltips to the circles and display each tooltip with the data that the user has selected. Used `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged) to accomplish this. [David Gotz's example](https://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7) was also used as a guide to see how tooltips are implemented with d3-tip.

![8-tooltip](Images/8-tooltip.gif)

- - -

#### Copyright

Trilogy Education Services © 2019. All Rights Reserved.

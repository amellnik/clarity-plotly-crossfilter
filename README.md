# Clarity-Plotly Crossfiltering Demo

## Plan of attack

I don't think it's possible to programmatically select points in plotly (based on the discussion [here](https://community.plot.ly/t/select-items-from-javascript/4516)).  Because of this, we will need to latch into the [select event](https://plot.ly/javascript/plotlyjs-events/#select-event) and then update a field in the underlying data in response.  

Clarity does offer a [two-way binding](https://vmware.github.io/clarity/documentation/v0.13/datagrid/selection) on the selection state of the row, so one option is to only plot items which are selected in Clarity.  We can then bind to the selection change event in Plotly, then take the set of selected points and deselect everything else by acting directly on the row, then redraw the plot.  This has the drawback of removing unselected points from the plot entirely.  

## The dataset

The data used here is from the Washington Post's fatal police shooting database which is available online [here](https://github.com/washingtonpost/data-police-shootings).

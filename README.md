# extjs-fusionchart
Fusion chart wrapper in ext js, could be used as a component
# Usage
Set the namepsace path mapping 
Ext.Loader.setPath('Jda.widget', 'jedify/widget');
{
    xtype : 'fusionchart',
    title : 'KPI Dashboard',
    itemId : 'kpiaggregategraphview',
    flex : 1,        
    dataFormat : 0,
    data : jsonDataArray
	type : 'MSCombi2D'
}
or Ext.create('Jedify.widget.chart.Chart');
Prerequisite : 
Fusion chart library should be made available
Features : 
- It renders the chart to the target container
- Using the maximize tool you can maximize the chart to an additional overlay with the same object
/**
*       {
*            xtype : 'fusionchart',
*            title : 'KPI Dashboard',
*            itemId : 'kpiaggregategraphview',
*            flex : 1,        
*            dataFormat : 0,
*            data : jsonDataArray
*            type : 'MSCombi2D'
*        }
*/
Ext.define('Jedify.widget.chart.Chart',{
        extend: 'Ext.panel.Panel',
        alias : ['widget.jedify-chart','widget.fusionchart'],
        title : '',
        margin : 2,
        height : 200,
        width:200,
        config : {
          chart : null,
          data : null,
          type : null,
          chartId : null,
          dataFormat : 1, // 0=> XML , 1=> JSON
          charts : []
        },
        layout : 'card',
        constructor : function(config) {
            var me = this;
            var items = [];
           
            me.items = items;
            Ext.apply(me.items,[{                  
              itemId : 'chartpanel',  
              style : 'width:100%; height:100%;',                        
              xtype : 'component'                  
             }]);
         //   me.addEvents('createchart','updatechart','refreshdata','updatesize');
            me.callParent([config]);
        },
        initComponent : function(){
        	 var me = this;
        	 if(!me.getData()){
             	if(me.getDataFormat()==1)
             		me.setData({	"chart" : {}, "data" : [] });
             	else
             		me.setData('<chart ></chart>');
             }
        	 me.callParent();
        },
        tools : [{
        	xtype: 'tool',
        	type :'drillup',
        	hidden : true,
        	itemId : 'drilluptool',
        	//text : '<-',
        	handler : function(e, t, owner, btn){
        		var activeComp = btn.up('panel').getLayout().getActiveItem();
        		btn.up('panel').getLayout().prev();
        		btn.up('panel').remove(activeComp);
        		if(btn.up('panel').getLayout().getLayoutItems( ).length < 2)
        			btn.hide();
        	}
        },{
            type : 'maximize',
            toolTip : 'Full View',
            handler : function(e, toolEl, owner, me ){
                var chartPanel = me.up('jda-chart').getLayout().getActiveItem();
                var chart = null;
                if(chartPanel.getItemId()=='chartpanel'){
                	chart = chartPanel;
                	chartPanel = me.up('jda-chart');
                }
                else{
                	chart = chartPanel.down('#chartpanel');
                }
                
                var width = window.innerWidth*0.8;
                var height = window.innerHeight*0.8;
                chartPanel.fireEvent('updatesize',width, height);
                var win = Ext.create('Ext.window.Window', {
                	title : chartPanel.title,
                    height: height,
                    width: width,
                    layout: 'fit',
                    float : true,
                    items: chart,
                    modal:true,
                    animateTarget : me.getEl(),
                    closable : true,
                    listeners : {
                        beforeclose : function( panel ){
                            chartPanel.add(chart);
                            chartPanel.fireEvent('updatesize',chartPanel.getWidth(), chartPanel.getHeight());
                        }
                    }
                }).show();
                Ext.select('.x-mask').addListener('click', function() {
                	win.close();
                });
            }
        }],
        listeners: {
            afterrender : function(){
            	var me = this;
              if(me.getData())
            	  me.fireEvent('createchart');
              this.self.instanceCount = this.self.instanceCount+1;
            },
            createchart : function(){                
                var chartObject = this.getChart();	                
                if(!chartObject)
                    chartObject = this._getChartObject();  
                this.setChart(chartObject);              
            },
            resize : function(me, width, height){
                this.fireEvent('updatesize',width, height);
            },
            updatesize : function(width, height){   
            	var me = this;
            	if(me.getHeader() && me.getHeader().isVisible())
            		height = height -25; 
                if(width<0 || height<0)            
                    return;
                if(me.getChart())
                    me.getChart().resizeTo(width, height);
                if(!me.getChart().isActive() && me.down('#chartpanel'))
                    me.getChart().render(me.down('#chartpanel').getId());
            },
            refreshdata : function(data){
            	if(this.getDataFormat()==1)
            		this.getChart().setJSONData(data);
            	else if(this.getDataFormat()==0)
            		this.getChart().setXMLData(data);
            },
            addchart : function(data){
            	var me = this;
            	var fc = Ext.widget({
						xtype : 'fusionchart',
						dataFormat : 0,
						//itemId : itemId,
						header : false,
					    type : 'MSCombi2D',
					    data : data,
					    width : me.getWidth(),
					    height : me.getHeight()+30
					});
            	me.add(fc);
            	me.down('#drilluptool').show();
            	me.getLayout().next();
            }
      },
      _getChartObject : function(){                
            if(!this.getChartId())
				this.setChartId(this.getId()+'-chart'+Ext.Number.randomInt( 1, 10000 ));
				
            if(this.getChart()){
                this.getChart().dispose();
                this.setChart(null);
            }
            var dataformat = this.getDataFormat()==0?'xml':'json';
            var localChartObject = new FusionCharts({                       
                    type: this.getType(),
                    id : this.getChartId(),
                    dataFormat: dataformat,
                    dataSource: this.getData(),
                    renderer : 'javascript',                        
                    registerWithJS : "1"
                });
            
            return localChartObject;
    },
    statics : {
    	instanceCount : 1
    }
});
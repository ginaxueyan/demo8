'use strict';

angular.module('testApp')
  .controller('MainCtrl', function ($scope,$http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

  var title = {
       text: '未来五天温度曲线',
       x: -20
   };
   var subtitle = {
       text: 'Source: Unicore Studio',
       x: -20
   };
   var tooltip = {
      valueSuffix: '摄氏度'
   }
   var legend = {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      borderWidth: 0
   };
   var yAxis = {
      title: {
         text: '温度 (°C)'
      },
      plotLines: [{
         value: 0,
         width: 1,
         color: '#808080'
      }]
   };   
   var json = {};
   json.title = title;
   json.subtitle = subtitle;
   json.yAxis = yAxis;
   json.tooltip = tooltip;
   json.legend = legend;



   $scope.changecity = function(city) {

    var forecastspath;
    if(city=="北京")
      forecastspath="./data/forecasts_beijing.json";
    else if(city=="廊坊")
      forecastspath="./data/forecasts_langfang.json";
    else if(city=="保定")
      forecastspath="./data/forecasts_baoding.json";

  $http.get(forecastspath)  //forecasts
 .success(function(data)  
    {

      $scope.forecasts=data;
   var xAxis = {
       categories: [$scope.forecasts[0].date, $scope.forecasts[1].date, $scope.forecasts[2].date, 
       $scope.forecasts[3].date,$scope.forecasts[4].date ]
   };

   var series =  [
      {
         name: '最低温度',
         data: [$scope.forecasts[0].temp1*1, $scope.forecasts[1].temp1*1, $scope.forecasts[2].temp1*1, 
       $scope.forecasts[3].temp1*1,$scope.forecasts[4].temp1*1]
      }, 
      {
         name: '最高温度',
         data: [$scope.forecasts[0].temp2*1, $scope.forecasts[1].temp2*1, $scope.forecasts[2].temp2*1, 
       $scope.forecasts[3].temp2*1,$scope.forecasts[4].temp2*1]
      }
   ];

       json.series = series;
       json.xAxis = xAxis;
       $('#mychart').highcharts(json);
    }
    );
   };



   $scope.getreminder = function(gettemp) {
        if (gettemp>30)
            return '天气酷热，注意防暑'
        else if (gettemp>20)
            return '天气炎热，注意降温'
        else if (gettemp>10)
            return '气温舒适'
        else if (gettemp>0)
            return '天凉记得加衣'
        else 
            return '天气寒冷，注意保暖'
    };

  var map = new BMap.Map("allmap");
  map.centerAndZoom('中国',6);
   $http.get("./data/monitor.json")  //Monitors And Add Object To Baidu map
 .success(function(data)  
    {
    $scope.monitors=data;


     for(var i=0; i<$scope.monitors.length ;i++)
     {

      var point = new BMap.Point($scope.monitors[i].longitude, $scope.monitors[i].latitude );

      var opts = {
        position : point,     // 指定文本标注所在的地理位置
        offset   : new BMap.Size(0, 0)    //设置文本偏移量
        }

      var levelcolor="#333";
      if($scope.monitors[i].level=="严重污染")
        levelcolor="#C00";
      else if($scope.monitors[i].level=="重度污染")
        levelcolor="#C30";
      else if($scope.monitors[i].level=="中度污染")
        levelcolor="#C60";
      else if($scope.monitors[i].level=="轻度污染")
        levelcolor="#CC0";
      else if($scope.monitors[i].level=="良")
        levelcolor="#9C0";
      else if($scope.monitors[i].level=="优")
        levelcolor="#390";

      var label = new BMap.Label($scope.monitors[i].level, opts);
        label.setStyle({
           color : levelcolor ,
           fontSize : "15px",
           height : "0px",
           lineHeight : "0px",
           fontFamily:"黑体"
         });
       map.addOverlay(label); 
     }
    }
    );

   $scope.weatherpicture = function(tq) {
        if (tq=='晴')
            return 'content2-table-sun'
        if (tq=='晴转多云')
            return 'content2-table-suncloudy'
        if (tq=='多云')
            return 'content2-table-cloudy'
        if (tq=='雨')
            return 'content2-table-rain'
        if (tq=='雪')
            return 'content2-table-snow'
    };

  $scope.changepic=function(hpa,hour){
   var today, yesterday;
   var year='';var mon='';var day ='';
   var curdate = new Date();
    year = curdate.getFullYear();
    mon=((curdate.getMonth()*1+1)<10 ? "0"+(curdate.getMonth()*1+1):(curdate.getMonth()*1+1));
    day = ((curdate.getDate()*1)<10 ? "0"+(curdate.getDate()*1):(curdate.getDate()*1));
    today = year+''+mon+day;
    curdate.setDate(curdate.getDate()-1);
    year = curdate.getFullYear();
    mon=((curdate.getMonth()*1+1)<10 ? "0"+(curdate.getMonth()*1+1):(curdate.getMonth()*1+1));
    day = ((curdate.getDate()*1)<10 ? "0"+(curdate.getDate()*1):(curdate.getDate()*1));
    yesterday = year+''+mon+day;

    var picpath="http://60.10.135.153:3000/images/ftproot/Products/Web/Forecast/weather/"+today+"/"+yesterday+"12_"+hour+"_"+hpa+".png"
   /* var picpath="./weather/"+today+"/"+yesterday+"12_"+hour+"_"+hpa+".png"*/
   document.getElementById('weatherpicshow').src=picpath;
  };
  $(document).ready(function(){
    $scope.hpa='850';
    $scope.hour='012';
    $scope.city='北京';
    $scope.changecity($scope.city);
    $scope.changepic($scope.hpa,$scope.hour);
  });

});


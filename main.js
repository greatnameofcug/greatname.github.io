//const { createStyleFunction } = require("ol/Feature");


const key = 'B3Hdjzt86GvHvSDXOMdA';
const attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

const casStyle = new ol.style.Style({
    image: new ol.style.Icon({
    //anchor: [1,1],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'CAS.gif',
    scale:0.02,
    }),
});
const schoolStyle = new ol.style.Style({
    image: new ol.style.Icon({
    //anchor: [1,1],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'school.png',
    scale:0.1,
    }),
});
const landscapeStyle = new ol.style.Style({
    image: new ol.style.Icon({
    //anchor: [1,1],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'landscape.png',
    scale:0.14,
    }),
});
const planeStyle = new ol.style.Style({
    image: new ol.style.Icon({
    //anchor: [1,1],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'plane.png',
    scale:0.1,
    }),
});
const trainStyle = new ol.style.Style({
    image: new ol.style.Icon({
    //anchor: [1,1],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'train.png',
    scale:0.1,
    }),
});


var features =new Array();
function addIcon(wgs84, name, type){
    const icon = new ol.Feature({
        geometry: new ol.geom.Point(wgs84),
        name: 'Null Island',
        population: 4000,
        rainfall: 500,
        name: name
    });
    if (type=='国科大')
    {
        icon.setStyle(casStyle);
    }
    else if (type=='景点')
    {
        icon.setStyle(landscapeStyle);
    }
    else if (type=='火车站')
    {
        icon.setStyle(trainStyle);
    }
    else if (type=='高校')
    {
        icon.setStyle(schoolStyle);
    }
    else if (type=='机场')
    {
        icon.setStyle(planeStyle);
    }
    
    features.push(icon);
}
addIcon([116.676390, 40.407053], '雁栖湖', '国科大');
addIcon([116.374550, 40.003155], '奥运村', '国科大');
addIcon([116.276001, 40.069644], '新技术', '国科大');
addIcon([116.328913, 39.981496], '中关村', '国科大');
addIcon([116.244078, 39.907638], '玉泉路', '国科大');
addIcon([116.391238, 39.906927], '天安门', '景点');
addIcon([116.001325, 40.356549], '八达岭', '景点');
addIcon([116.539685, 40.416834], '慕田峪', '景点');
addIcon([116.658501, 40.443992], '怀北滑雪场', '景点');
addIcon([116.620355, 40.375477], '红螺寺', '景点');
addIcon([116.306999, 39.999083], '圆明园', '景点');
addIcon([116.304484, 39.991531], '北京大学', '高校');
addIcon([116.320948, 40.002244], '清华大学', '高校');
addIcon([116.420961, 39.903432], '北京站', '火车站');
addIcon([116.347751, 39.942736], '北京北站', '火车站');
addIcon([116.370929, 39.864545], '北京南站', '火车站');
addIcon([116.314442, 39.895456], '北京西站', '火车站');
addIcon([116.478416, 39.901591], '北京东站', '火车站');
addIcon([116.307864, 40.040021], '清河火车站', '火车站');
addIcon([116.410023, 39.512139], '大兴机场', '机场');
addIcon([116.586510, 40.078416], '首都机场', '机场');


function addRoute(startwgs84, endwgs84, name, type){
    AMap.plugin('AMap.Driving', function() {
        var driving = new AMap.Driving({
          // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
            policy: AMap.DrivingPolicy.LEAST_TIME
        })
        console.log(startwgs84);
        var wgs84togcj02start = coordtransform.wgs84togcj02(startwgs84[0],startwgs84[1]);
        var wgs84togcj02send = coordtransform.wgs84togcj02(endwgs84[0],endwgs84[1]);
        console.log(wgs84togcj02send);
        driving.search(wgs84togcj02start, wgs84togcj02send, function (status, result) {
            console.log(result);
            num_routes = result['routes']['0']['steps']['length'];
            for  (var i = 0; i < num_routes; i++){
                points[i]=result['routes']['0']['steps'][i.toString()]['path']['length'];
        
        
                var co = new Array();
                var cco = new Array();
                for (var j = 0; j < points[i]; j++){
                    var coQ = parseFloat(result['routes']['0']['steps'][i.toString()]['path'][j.toString()]['Q']);
                    var coR = parseFloat(result['routes']['0']['steps'][i.toString()]['path'][j.toString()]['R']);
                    //co[j] = ol.proj.fromLonLat([coR, coQ]);
                    var gcj02towgs84 = coordtransform.gcj02towgs84(coR, coQ);
                    //console.log(gcj02towgs84);
                    co[j] = [gcj02towgs84[0], gcj02towgs84[1]];
                    //co[j] = ol.proj.transform([coR, coQ],"EPSG:4326","EPSG:3857");
                }
        
                for (var k = 0; k < points[i]-1; k++){
                    cco[k] = [co[k], co[k+1]]
                    //route['geometry']['coordinates'][k] = [co[k], co[k+1]];
                }
                var route = {
                    'type': 'Feature',
                    'geometry': {
                    'type': 'MultiLineString',
                    'coordinates': cco,
                    },
                };
                routes[i] = route;
                
            }
            const geojsonObject = {
                'type': 'FeatureCollection',
                'crs': {
                    'type': 'name',
                    'properties': {
                    'name': 'EPSG:3857',
                    },
                },
                'features': routes,
                };
            
            
            const vectorSource_route = new ol.source.Vector({
                features: new ol.format.GeoJSON().readFeatures(geojsonObject),
            });
            if (type=='国科大')
            {
                const vector_route = new ol.layer.Vector({
                    source: vectorSource_route,
                    style: casstyleFunction,
                    name: name,
                })
                map.addLayer(vector_route);
            }
            else if (type=='景点')
            {
                const vector_route = new ol.layer.Vector({
                    source: vectorSource_route,
                    style: landscapestyleFunction,
                    name: name,
                })
                map.addLayer(vector_route);
            }
            else if (type=='火车站')
            {
                const vector_route = new ol.layer.Vector({
                    source: vectorSource_route,
                    style: trainstyleFunction,
                    name: name,
                })
                map.addLayer(vector_route);
            }
            else if (type=='高校')
            {
                const vector_route = new ol.layer.Vector({
                    source: vectorSource_route,
                    style: schoolstyleFunction,
                    name: name,
                })
                map.addLayer(vector_route);
            }
            else if (type=='机场')
            {
                const vector_route = new ol.layer.Vector({
                    source: vectorSource_route,
                    style: planestyleFunction,
                    name: name,
                })
                map.addLayer(vector_route);
            }

            

        })
    })
}

const vectorSource_target = new ol.source.Vector({
    features: features,
    //features: [icon_yanqihu, icon_aoyuncun, icon_xinjishu, icon_shoudujichang],
});

const vector_target = new ol.layer.Vector({
    source: vectorSource_target,
});

const baseMap = new ol.layer.Tile({
    source: new ol.source.Stamen({
        layer:'terrain',
    }),
});

const map = new ol.Map({
    target: 'map',
    layers: [
    baseMap,
    vector_target,
    ],
    view: new ol.View({
    center: [116.391238, 39.906927],
    zoom: 9,
    minZoom: 1,
    maxZoom: 19,
    projection: 'EPSG:4326',
    extent: [115, 39, 118, 41],
    }),
});



var routes=new Array();
var num_routes = 0;
var points=new Array();

const casstyles = {
    'MultiLineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
        color: [0,0,255,0.8],
        width: 3,
        }),
    }),
};
const schoolstyles = {
    'MultiLineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
        color: [200,0,100,0.8],
        width: 3,
        }),
    }),
};
const landscapestyles = {
    'MultiLineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
        color: [0,255,0,0.8],
        width: 3,
        }),
    }),
};
const planestyles = {
    'MultiLineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
        color: [255,0,0,0.8],
        width: 3,
        }),
    }),
};
const trainstyles = {
    'MultiLineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
        color: [255,0,0,0.8],
        width: 3,
        }),
    }),
};

const casstyleFunction = function (feature) {
    return casstyles[feature.getGeometry().getType()];
};
const schoolstyleFunction = function (feature) {
    return schoolstyles[feature.getGeometry().getType()];
};
const landscapestyleFunction = function (feature) {
    return landscapestyles[feature.getGeometry().getType()];
};
const planestyleFunction = function (feature) {
    return planestyles[feature.getGeometry().getType()];
};
const trainstyleFunction = function (feature) {
    return trainstyles[feature.getGeometry().getType()];
};


addRoute([116.676390, 40.407053], [116.374550, 40.003155], '奥运村', '国科大');
addRoute([116.676390, 40.407053], [116.276001, 40.069644], '新技术', '国科大');
addRoute([116.676390, 40.407053], [116.328913, 39.981496], '中关村', '国科大');
addRoute([116.676390, 40.407053], [116.244078, 39.907638], '玉泉路', '国科大');
addRoute([116.676390, 40.407053], [116.391238, 39.906927], '天安门', '景点');
addRoute([116.676390, 40.407053], [116.001325, 40.356549], '八达岭', '景点');
addRoute([116.676390, 40.407053], [116.539685, 40.416834], '慕田峪', '景点');
addRoute([116.676390, 40.407053], [116.658501, 40.443992], '怀北滑雪场', '景点');
addRoute([116.676390, 40.407053], [116.620355, 40.375477], '红螺寺', '景点');
addRoute([116.676390, 40.407053], [116.306999, 39.999083], '圆明园', '景点');
addRoute([116.676390, 40.407053], [116.304484, 39.991531], '北京大学', '高校');
addRoute([116.676390, 40.407053], [116.320948, 40.002244], '清华大学', '高校');
addRoute([116.676390, 40.407053], [116.420961, 39.903432], '北京站', '火车站');
addRoute([116.676390, 40.407053], [116.347751, 39.942736], '北京北站', '火车站');
addRoute([116.676390, 40.407053], [116.370929, 39.864545], '北京南站', '火车站');
addRoute([116.676390, 40.407053], [116.314442, 39.895456], '北京西站', '火车站');
addRoute([116.676390, 40.407053], [116.478416, 39.901591], '北京东站', '火车站');
addRoute([116.676390, 40.407053], [116.307864, 40.040021], '清河火车站', '火车站');
addRoute([116.676390, 40.407053], [116.410023, 39.512139], '大兴机场', '机场');
addRoute([116.676390, 40.407053], [116.586510, 40.078416], '首都机场', '机场');





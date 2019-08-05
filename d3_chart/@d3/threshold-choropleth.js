//extract total yea from title
function extract_number(text){
	if (text != null){
		var text_str = text.split(",");
		if (text_str.length > 2){
			var total_yea = text_str[2];
			var total_yea_arr = total_yea.split(":");
			if (total_yea_arr.length > 1){
				return parseFloat(total_yea_arr[1].trim());
			}			
		}		
	}
	
	return 0;
}

// https://observablehq.com/@d3/threshold-choropleth@180
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md``
)});
  main.variable(observer("chart")).define("chart", ["d3","DOM","legend","topojson","us","color","data","format"], function(d3,DOM,legend,topojson,us,color,data,format)
{
  const width = 960;
  const height = 600;
  const path = d3.geoPath();

  const svg = d3.select(DOM.svg(width, height))
      .style("width", "100%")
      .style("height", "auto");

  svg.append("g")
      .attr("transform", "translate(600,40)")
      .call(legend);

  svg.append("g")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .join("path")
      .attr("fill", d => color(extract_number(data.get(d.id))))
      .attr("d", path)
    .append("title")
      .text(d => data.get(d.id));

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path);

  return svg.node();
}
);

 main.variable(observer("legend")).define("legend", ["color","d3","data"], function(color,d3,data){return(
g => {
  const width = 260;
  const length = color.range().length;

  const x = d3.scaleLinear()
      .domain([1, length - 1])
      .rangeRound([width / length, width * (length - 1) / length]);
}
)});


  main.variable(observer("data")).define("data", ["d3"], async function(d3){return(
Object.assign(new Map(await d3.csv("../d3_chart/Billiard.csv", ({Name,id,Total_YEA,Total_NAY}) =>
 [id, Name + ', Total yea: ' + Total_YEA + ', Total nay: ' + Total_NAY])), {title: ""})
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3){return(
d3.scaleThreshold()
    .domain([2, 4, 6, 8, 10])
    .range(d3.schemePurples[6])
)});
  main.variable(observer("format")).define("format", ["d3"], function(d3){return(
d3.format("")
)});
  main.variable(observer("us")).define("us", ["d3"], function(d3){return(
d3.json("https://cdn.jsdelivr.net/npm/us-atlas@1/us/10m.json")
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}

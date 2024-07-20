const req = new XMLHttpRequest();
req.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", true);
req.send();
req.onload = function () {
  const json = JSON.parse(req.responseText);
  const dataset = json.data;

  const w = 1000;
  const h = 480;
  const padding = 60;

  const xScale = d3
    .scaleTime()
    .domain([new Date(d3.min(dataset, (d) => d[0])), new Date(d3.max(dataset, (d) => d[0]))])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([h - padding, padding]);

  const svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(new Date(d[0])))
    .attr("y", (d) => yScale(d[1]))
    .attr("width", (w - 2 * padding) / dataset.length)
    .attr("height", (d) => h - padding - yScale(d[1]))
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .on("mouseover", function (event, d) {
      const tooltip = d3.select("#tooltip");
      tooltip
        .style("visibility", "visible")
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 20 + "px")
        .attr("data-date", d[0])
        .html(`Date: ${d[0]}<br>GDP: $${d[1]} Billion`);
    })
    .on("mouseout", function () {
      d3.select("#tooltip").style("visibility", "hidden");
    });

  const xAxis = d3.axisBottom(xScale).ticks(10);
  const yAxis = d3.axisLeft(yScale).ticks(10);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${h - padding})`)
    .call(xAxis)
    .append("text")
    .attr("x", w / 2)
    .attr("y", padding / 1.5)
    .attr("fill", "black")
    .attr("class", "axis-label")
    .text("Year")    
    .selectAll(".tick")
    .attr("class", "tick");

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -h / 2.5)
    .attr("y", -padding/1.3)
    .attr("fill", "black")
    .attr("class", "axis-label")
    .text("GDP (Billion $)")
    .selectAll(".tick")
    .attr("class", "tick");    
};
